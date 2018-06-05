const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const request = require('request');


const client_id = "4220f98a90dd428cb79a258b78fbe43d";
const client_secret = "f5abb23a14d442089620e296aa290186";
const redirect_uri = "http://localhost:3000/callback";

// Register
router.post('/register', (req, res, next) => {
	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		spotifyAccount: req.body.spotifyAccount
	});

	User.addUser(newUser, (err, user) => {
		if (err) {
			res.json({success: false, msg:'failed to register user'});
		} else {
			res.json({success: true, msg:'user registered'});
		}
	});
});

// Authentication
router.post('/authenticate', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;

	User.getUserByUsername(username, (err, user) => {
		if(err) {
			throw err;
		}

		if (!user) {
			return res.json({success: false, msg: 'user not found'});
		}

		User.comparePassword(password, user.password, (err, isMatch) => {
			if (err) {
				throw err;
			}

			if (isMatch) {
				const token = jwt.sign(user.toJSON(), config.secret, {expiresIn: 604800 //1 week
				});

				res.json({
					success: true,
					token: 'JWT' + token,
					user: {
						id: user._id,
						name: user.name,
						username: user.username, 
						email: user.email
					}
				});
			} else {
				return res.json({success: false, msg: 'Wrong Password'});
			}

			
		})
	});
});

// Profile 
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	console.log("in profile");
	res.json({user:req.user});
});

router.get('/test', (req, res, next) => {
	console.log("in profile");
	res.send("hi");
});

const generateRandomString = function(length) {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
	for (var i = 0; i < length; i++) {
	  text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
  };
  
  var stateKey = 'spotify_auth_state';

  //res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');	
router.get('/spotifyLogin', (req, res) => {

	var state = generateRandomString(16);
	res.cookie(stateKey, state);

	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');	
	
	console.log("/spotifyLogin");
	// your application requests authorization
	const scope = 'playlist-read-private user-read-currently-playing playlist-read-collaborative user-top-read';
	// res.redirect('https://accounts.spotify.com/authorize?' +
	// 	querystring.stringify({
	// 	response_type: 'code',
	// 	client_id: client_id,
	// 	scope: scope,
	// 	redirect_uri: redirect_uri,
	// 	state: state
	// 	}));
	res.redirect("https://accounts.spotify.com/authorize/?client_id=4220f98a90dd428cb79a258b78fbe43d&response_type=code&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&scope=user-read-private%20user-read-email&state=34fFs29kd09");
});
  
router.get('/callback', function(req, res) {
	
	// your application requests refresh and access tokens
	// after checking the state parameter
	console.log("/callback");
	console.log(res);
	var code = req.query.code || null;
	var state = req.query.state || null;
	var storedState = req.cookies ? req.cookies[stateKey] : null;

	if (state === null || state !== storedState) {
	res.redirect('/#' +
		querystring.stringify({
		error: 'state_mismatch'
		}));
	} else {
	res.clearCookie(stateKey);
	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
		code: code,
		redirect_uri: redirect_uri,
		grant_type: 'authorization_code'
		},
		headers: {
		'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
		},
		json: true
	};

	request.post(authOptions, function(error, response, body) {
		if (!error && response.statusCode === 200) {

		var access_token = body.access_token,
			refresh_token = body.refresh_token;

		var options = {
			url: 'https://api.spotify.com/v1/me',
			headers: { 'Authorization': 'Bearer ' + access_token },
			json: true
		};

		// use the access token to access the Spotify Web API
		request.get(options, function(error, response, body) {
			console.log(body);
		});

		// we can also pass the token to the browser to make requests from there
		res.redirect('/#' +
			querystring.stringify({
			access_token: access_token,
			refresh_token: refresh_token
			}));
		} else {
		res.redirect('/#' +
			querystring.stringify({
			error: 'invalid_token'
			}));
		}
	});
	}
});

router.get('/refresh_token', function(req, res) {

	// requesting access token from refresh token
	var refresh_token = req.query.refresh_token;
	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
		form: {
		grant_type: 'refresh_token',
		refresh_token: refresh_token
		},
		json: true
	};

	request.post(authOptions, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var access_token = body.access_token;
			res.send({
				'access_token': access_token
			});
		}
	});
});

module.exports = router;
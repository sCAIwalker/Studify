const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const cors = require('cors');
var request = require('request');

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

module.exports = router;
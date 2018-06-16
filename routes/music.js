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
const fs = require('fs');

const client_id = "4220f98a90dd428cb79a258b78fbe43d";
const client_secret = "f5abb23a14d442089620e296aa290186";
const redirect_uri = "http://localhost:3000/music/callback";
// const redirect_uri = "http://www.studify.online/music/callback";

var access_token = null;
var refresh_token = null;
var user_id = null;
var currPlaylistNames = null;

const generateRandomString = function(length) {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
	for (var i = 0; i < length; i++) {
	  text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
  };
  
const stateKey = 'spotify_auth_state';

router.get('/userPlaylist', (req, res, next) => {
    console.log("user playlist");
    console.log(access_token);    
    var options = {
        url: 'https://api.spotify.com/v1/me/playlists',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
    }
    
    // use the access token to access the Spotify Web API
    request.get(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var itemsArray = body.items;
            var playlistArray = [];
            console.log(body);

            for (var i = 0 ; i < itemsArray.length; i++) {
                var toAppend = { 
                    "name" : itemsArray[i].name,
                    "uri" : itemsArray[i].uri,
                    "id" : itemsArray[i].id
                }
                playlistArray.push(toAppend);
            }

            res.json(playlistArray);
        } else {
            console.log(error);
            res.json({success : false});
        }
    });
});

router.get('/spotifyLogin', (req, res) => {
    
        var state = generateRandomString(16);
        res.cookie(stateKey, state);	
        
        console.log("/spotifyLogin");
        // your application requests authorization
        const scope = 'playlist-read-private user-read-currently-playing playlist-read-collaborative user-top-read';
        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
            }));
});
      
router.get('/callback', function(req, res) {
    
    // your application requests refresh and access tokens
    // after checking the state parameter
    console.log("/callback");
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
            access_token = body.access_token
            refresh_token = body.refresh_token;
            
            console.log(access_token);

            var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };

            // use the access token to access the Spotify Web API
            request.get(options, function(error, response, body) {
                console.log(body);
                user_id = body.id;
                console.log(user_id);
            });

            // we can also pass the token to the browser to make requests from there
            res.redirect('/#');
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
    refresh_token = req.query.refresh_token;
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
            access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});

router.post('/convert', (req, res, next) => {
    console.log("inside convert");
    console.log(req.body);
    console.log(user_id);

    var options = {
        url: 'https://api.spotify.com/v1/users/' + user_id + "/playlists/" + req.body.id + "/tracks",
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
    }

    request.get(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var itemsArray = body.items;
            var returnedArray = [];
            for (var i = 0; i < itemsArray.length; i++) {
                console.log(itemsArray[i].track.name);
                var toAppend = {
                    "name" : itemsArray[i].track.name
                };

                returnedArray.push(toAppend);
            }
            console.log(returnedArray);
            res.json({success : true});
        } else {
            console.log(error);
            res.json({success : false});
        }
    });
});

module.exports = router

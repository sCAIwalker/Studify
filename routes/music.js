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

router.get('/test', (req, res, next) => {
	console.log("in music router");
	res.send("music");
});

module.exports = router

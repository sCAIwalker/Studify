const express = require('express');
const router = express.Router();
const config = require('../config/database');
const User = require('../models/user');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const cors = require('cors');
var request = require('request');
const fs = require('fs');

router.get('/test', (req, res, next) => {
    console.log("in here");
    res.json({success : true});
});

module.exports = router
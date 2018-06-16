const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database')
const cors = require('cors');
var global_access_token = "test";

// Connect to database
mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
	console.log("connected to database " + config.database);
});

mongoose.connection.on('error', (err) => {
	console.log("databse error " + err);
});

const app = express();

const users = require('./routes/users');
const music = require('./routes/music');
const convert = require('./routes/convert');

// Port Number
// const port = process.env.PORT || 8080;
const port = 3000;

// CORS stuff
app.use(cors());
app.options('*', cors()) // include before other routes

// CookieParser
app.use(cookieParser());

// Set Static Folder 
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// anything that is 3000/users/whatever will go to the users file
app.use('/users', users);

//anything that is 3000/music/whatever will go to the music file
app.use('/music', music);

//anything that is 3000/convert/whatever will go to the convert file
app.use('/convert', convert);

// Home Page
app.get('/', (req, res) => {
	res.send("Invalid Endpoint.");
});

// app.get('*', (req, res) => {
// 	res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// Start Server
app.listen(port, () => {
	console.log("Server started on port " + port);
});

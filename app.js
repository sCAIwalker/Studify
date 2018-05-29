const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database')

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

// Port Number
const port = 3000;

// CORS stuff
app.use(cors());

// Set Static Folder 
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser
app.use(bodyParser.json());

// anything that is 3000/users/whatever will go to the users file
app.use('/users', users);

// Home Page
app.get('/', (req, res) => {
	res.send("Invalid Endpoint.");
});

// Start Server
app.listen(port, () => {
	console.log("Server started on port " + port);
});

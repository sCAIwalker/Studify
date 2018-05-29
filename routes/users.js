const express = require('express');
const router = express.Router();

// Register
router.get('/register', (req, res, next) => {
	res.send("register");
});

// Authentication
router.get('/authenticate', (req, res, next) => {
	res.send("authenticate");
});

// Profile 
router.get('/profile', (req, res, next) => {
	res.send("profile");
});

// Validate
 router.get('/validate', (req, res, next) => {
	res.send("validate");
});

module.exports = router;
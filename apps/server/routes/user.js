const express = require('express');
const router = express.Router();
const { register, login,verify,upload } = require('../controllers/userController'); // Adjust the path as needed

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

//verify routes
router.post('/verify',verify);

//upload avatar image
router.post('/upload', upload);

module.exports = router;


const express = require('express');
const {getMessages} = require("../controllers/messageController")
const router = express.Router();

// Get balance sheet for a specific user
router.get('/:userId/:friendId', getMessages);

module.exports = router;

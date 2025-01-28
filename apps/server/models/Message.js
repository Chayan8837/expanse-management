const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {},{strict:false});

module.exports = mongoose.model('Message', MessageSchema);

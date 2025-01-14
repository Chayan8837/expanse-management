const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'https://bbdnitm.ac.in/wp-content/uploads/2021/11/dummy-image.jpg'},
});

module.exports = mongoose.model('User', UserSchema);

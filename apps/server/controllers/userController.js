const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const  Friends= require('../models/Friends')


// Register
exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const userExist = await User.findOne({ email });
  
  if (userExist) return res.status(400).json({ msg: 'User already exists' });
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, phone, password: hashedPassword });
  
  await newUser.save();
  return res.status(201).json({ msg: 'User registered' });
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ msg: 'User does not exist' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const friendsentry = new Friends({
    userId: user._id,
    friends: [],
    requestedFriends: []
});
  await friendsentry.save();
  console.log(friendsentry);
  return res.status(200).json({ token, userId: user._id ,userinfo: {name: user.name,email: user.email,phone: user.phone,userId:user._id}});
};

exports.verify = async (req, res) => {
  const { id } = req.body;
  const user= await User.findOne({_id:id});

  if (!user) return res.status(401).json({ msg: 'user not logged in before' });

  try {

    return res.status(200).json({ msg: 'user logged in automatically ' ,user:{name: user.name,email: user.email,phone: user.phone,userId: user._id,avatar: user.avatar}});
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }

};
exports.upload = async (req, res) => {
  const {userId,image} = req.body;
  const user = await User.findByIdAndUpdate(userId, { avatar: image }, { new: true });
  if (!user) return res.status(404).json({ msg: 'User not found' });
  return res.status(200).json({ msg: 'Avatar uploaded successfully',  user});
}

exports.changepassword = async (req, res) => {
  const { id,old_password,new_password } = req.body;
  const user= await User.findOne({_id:id});
  if (!user) return res.status(401).json({ msg: 'user not found' });
  const isMatch = await bcrypt.compare(old_password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid old password' });
  const hashedPassword = await bcrypt.hash(new_password, 10);
  const updatedUser = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
  if (!updatedUser) return res.status(404).json({ msg: 'User not found' });
  return res.status(200).json({ msg: 'Password changed successfully',  user});

};
exports.changepasswordwithout = async (req, res) => {
  const { id,new_password } = req.body;
  const user= await User.findOne({_id:id});
  if (!user) return res.status(401).json({ msg: 'user not found' });
  const hashedPassword = await bcrypt.hash(new_password, 10);
  const updatedUser = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
  if (!updatedUser) return res.status(404).json({ msg: 'User not found' });
  return res.status(200).json({ msg: 'Password changed successfully',  user});

};

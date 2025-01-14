const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  // friends 
  friends: [
    {
      friendId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      status: { type: String, enum: ['pending', 'accepted', 'blocked'], default: 'pending' },
      requested_at: { type: Date, default: Date.now },
      accepted_at: { type: Date, default: null },
      blocked_at: { type: Date, default: null },
    },
  ],

// frend requests
  requstedfriends: [
    {
      friendId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      status: { type: String, enum: ['pending', 'accepted', 'blocked'], default: 'pending' },
      requested_at: { type: Date, default: Date.now },
      accepted_at: { type: Date, default: null },
      blocked_at: { type: Date, default: null },
    },
  ],
  

});

module.exports = mongoose.model('Friends', friendSchema);
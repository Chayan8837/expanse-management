const Message = require('../models/Message');

// Fetch all messages for a conversation between two users
exports.getMessages = async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    // Find all messages between the sender and receiver, sorted by date
    const messages = await Message.find({
    senderId: friendId, receiverId: userId 
      
    })
    // .sort({ createdAt: 1 }); // Sort messages by creation date in ascending order

    // Return the messages
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
};
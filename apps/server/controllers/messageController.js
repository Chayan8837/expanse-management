const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    // Find all messages between the sender and receiver
    const messages = await Message.find({
      senderId: friendId,
      receiverId: userId,
    });

    if (messages.length === 0) {
      return res.status(404).json({ message: 'No messages found.' });
    }

    // Delete the fetched messages
    const result = await Message.deleteMany({
      senderId: friendId,
      receiverId: userId,
    });

    // Return the messages and a success message
    res.status(200).json({
      message: 'Messages fetched and deleted successfully.',
      messages,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch and delete messages.' });
  }
};

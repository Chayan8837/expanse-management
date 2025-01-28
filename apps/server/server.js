const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const Message = require("./models/Message")


const bodyParser = require('body-parser');
const expenseRoutes = require('./routes/expenseRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
const downloadRoutes =require("./routes/downloadRoutes")
const friendRoutes = require('./routes/friendRoutes');
const userRoutes = require('./routes/user');
const messageRoutes= require("./routes/messageRoutes")
const onlineUsers=new Map();


const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/download',downloadRoutes );
app.use('/api/friend', friendRoutes);
app.use("/api/messages",messageRoutes)



// Socket.IO for real-time messaging
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Store socket ID for a user
  socket.on('userOnline', async(userId) => {
    onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} connected with socket ID ${socket.id}`);
      console.log(onlineUsers);
      try {
        const contactUpdates = await Message.aggregate([
          {
              $match: { receiverId: userId } // Filter for messages where the current user is the receiver
          },
          {
              $group: {
                  _id: "$senderId", // Group by senderId to get messages from each contact
                  unreadCount: { 
                      $sum: 1 // Count unread messages
                  },
                  lastMessage: { $last: "$message" }, // Get the most recent message
                  lastTimestamp: { $last: "$sentAt" }, // Get the timestamp of the most recent message
              }
          },
          {
              $project: {
                  senderId: "$_id",
                  unreadCount: 1,
                  lastMessage: 1,
                  lastTimestamp: 1,
                  _id: 0, // Exclude the default _id
              }
          }
      ]);
    
        // // Emit the contact updates to the user
        io.to(socket.id).emit('updateAllContacts', contactUpdates);
    
        console.log('Contact updates sent:', contactUpdates);
      } catch (error) {
        console.error('Error fetching contact updates:', error);
      }

  });


  // Listen for a 'sendMessage' event from client
  socket.on('sendMessage', async (messageData) => {
      const { senderId, receiverId, message } = messageData;
  
      

      // Check if the friend (receiver) is connected
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
          io.to(receiverSocketId).emit('receiveMessage', { senderId, message});
      } else {
        try {
      
          // Save the message to the database for later delivery
          const newMessage = new Message(messageData);
          console.log(newMessage);
          
          await newMessage.save();
    
          console.log('Message saved to the database for offline user');
        } catch (error) {
          console.error('Error saving message to the database:', error);
        }

      }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
      // Find and remove the disconnected user
      onlineUsers.forEach((value, key) => {
        if (value === socket.id) {
          onlineUsers.delete(key);
          console.log(`User ${key} disconnected`);
        }})
          
      
  });
});




const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => server.listen(PORT, () => console.log(`Server running on port ${PORT},mongodb connected`)))
  .catch((error) => console.log(error));

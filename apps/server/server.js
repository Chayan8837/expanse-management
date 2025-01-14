const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');


const bodyParser = require('body-parser');
const expenseRoutes = require('./routes/expenseRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
const downloadRoutes =require("./routes/downloadRoutes")
const friendRoutes = require('./routes/friendRoutes');
const userRoutes = require('./routes/user');
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



// Socket.IO for real-time messaging
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Store socket ID for a user
  socket.on('register', (userId) => {
    onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} connected with socket ID ${socket.id}`);
      console.log(onlineUsers);
      
      
  });

  // Listen for a 'sendMessage' event from client
  socket.on('sendMessage', (messageData) => {
      const { senderId, receiverId, message } = messageData;

      // Check if the friend (receiver) is connected
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
          io.to(receiverSocketId).emit('receiveMessage', { senderId, message});
      } else {
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

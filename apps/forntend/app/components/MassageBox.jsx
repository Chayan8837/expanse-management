'use client'

import { useState, useEffect } from 'react'
import io from 'socket.io-client'

const MassageBox = () => {
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState('');
  const [friendId, setFriendId] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [onlineFriends, setOnlineFriends] = useState(new Set());

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    newSocket.on('receiveMessage', (messageData) => {
      const { senderId, message } = messageData;
      setMessages(prev => [...prev, {
        senderId,
        content: message,
        timestamp: new Date().toISOString()
      }]);
    });

    // Listen for online status updates
    newSocket.on('userOnline', (userId) => {
      setOnlineFriends(prev => new Set([...prev, userId]));
    });

    newSocket.on('userOffline', (userId) => {
      setOnlineFriends(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    // Cleanup on component unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!userId) return;

    socket.emit('register', userId);
    setIsRegistered(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !isRegistered || !friendId) return;

    const messageData = {
      senderId: userId,
      receiverId: friendId,
      message: newMessage
    };

    // Emit message to server
    socket.emit('sendMessage', messageData);
    
    // Add message to local state
    setMessages(prev => [...prev, {
      senderId: userId,
      content: newMessage,
      timestamp: new Date().toISOString()
    }]);
    setNewMessage('');
  };

  if (!isRegistered) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-4">
        <form onSubmit={handleRegister} className="w-full max-w-md space-y-4">
          <input
            type="text"
            placeholder="Enter your user ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800/40 backdrop-filter backdrop-blur-xl border border-gray-700/50 text-white"
          />
          <input
            type="text"
            placeholder="Enter friend's ID"
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800/40 backdrop-filter backdrop-blur-xl border border-gray-700/50 text-white"
          />
          <button 
            type="submit"
            className="w-full px-6 py-2 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Start Chatting
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="p-4 border-b border-gray-700/30">
        <div className="flex items-center justify-between">
          <h2 className="text-white">Chatting with: {friendId}</h2>
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${onlineFriends.has(friendId) ? 'bg-green-500' : 'bg-gray-500'}`}></span>
            <span className="text-white text-sm">{onlineFriends.has(friendId) ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </div>
      <div className="flex-grow space-y-4 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-end space-x-3 ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-4 rounded-2xl max-w-[70%] ${
                message.senderId === userId
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 rounded-br-sm'
                  : 'bg-gray-800/60 backdrop-blur-xl rounded-bl-sm'
              }`}
            >
              <p className="text-white text-base">{message.content}</p>
              <p className="text-xs text-gray-300/80 mt-2">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-700/30 bg-gray-900">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow px-4 py-2 rounded-lg bg-gray-800/40 backdrop-filter backdrop-blur-xl border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button 
            type="submit" 
            className="px-6 py-2 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default MassageBox

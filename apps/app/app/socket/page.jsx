"use client"
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import MassageBox from '../components/MassageBox';
import Loader from '../components/Loader';


// Connect to the Socket.IO server
const socket = io('http://localhost:5000'); // Replace with your server URL

function Chat() {
    const [userId, setUserId] = useState('');
    const [friendId, setFriendId] = useState('');
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [isUserRegistered, setIsUserRegistered] = useState(false);

    useEffect(() => {
        if (userId) {
            // Register the user with the server once userId is provided
            socket.emit('register', userId);
            setIsUserRegistered(true);
        }

        // Listen for incoming messages
        socket.on('receiveMessage', (messageData) => {
            if (messageData.senderId === friendId) {
                setChatMessages((prevMessages) => [
                    ...prevMessages,
                    messageData,
                ]);
            }
        });

        // Cleanup listener on component unmount
        return () => {
            socket.off('receiveMessage');
        };
    }, [userId, friendId]);

    const sendMessage = () => {
        if (!friendId || !message) {
            alert('Please choose a friend and type a message.');
            return;
        }

        const messageData = {
            senderId: userId,
            receiverId: friendId,
            message,
        };

        // Emit 'sendMessage' event with message data
        socket.emit('sendMessage', messageData);
        setMessage(''); // Clear the input field
    };

    return (
        <div>
            <Loader/>
            <MassageBox/>
        </div>

    )
}

export default Chat;

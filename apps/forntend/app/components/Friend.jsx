'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import UserSettings from './Setting';
import { setFriends, setLoading, setError } from '../Redux/User/friendSlice'
import userApis from '../api/userApi'
import { useMediaQuery } from 'react-responsive'
import { User, Settings } from 'lucide-react'
import AddFriend from './AddFriend'
import friendsApi from '../api/friend'
import FriendReq from './FriendReq'
import io from 'socket.io-client'
import { initDB, addMessage, getAllMessages,fetchMessages } from '../api/message';
import { fetchFriendsList } from '../Redux/User/friendSlice';

// Custom Button component with gradient
const GradientButton = ({ children, onClick, className = '', type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-4 py-2 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg ${className}`}
  >
    {children}
  </button>
)

// Custom Input component with glass effect
const GlassInput = ({ placeholder, value, onChange, className = '' }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full px-4 py-2 rounded-lg bg-gray-800/40 backdrop-filter backdrop-blur-xl border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
  />
)

// Custom Card component with glass effect
const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-filter backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-gray-700/50 relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
    <div className="relative z-10 h-full">
      {children}
    </div>
  </div>
)

export default function Friend() {
  const [contactDetails, setcontactDetails] = useState([])
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [db, setDB] = useState(null)
  const [showFriendReq, setShowFriendReq] = useState(false);
  const [socket, setSocket] = useState(null);
  const { verifyUser } = userApis;
  const { getFriends, addFriend, acceptFriend, deleteFriend, blockfriend, unblockfriend } = friendsApi;

  const [showAddFriend, setShowAddFriend] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [messageBox, setMessageBox] = useState(false);
  const { userId, userAvatar } = useSelector((state) => state.user);
  const { friends } = useSelector((state) => state.friend);
  const dispatch = useDispatch();
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [lastMessages, setLastMessages] = useState({});

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFriend || !socket) return;

    const message = {
      senderId: userId,
      receiverId: selectedFriend.friendId,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };
    await addMessage(db, message);
    setLastMessages((prevLastMessages) => ({
      ...prevLastMessages,
      [selectedFriend.friendId]: message,
    }));
    socket.emit('sendMessage', message);
    console.log(lastMessages);
    
    setNewMessage('');
  };


  useEffect(() => {
  
      if (selectedFriend) {
        console.log(selectedFriend.friendId);
        fetchMessages(userId, selectedFriend.friendId,db);
      }
    
  
  
  }, [selectedFriend, userId]); // Add `userId` as a dependency
  
  

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    if (userId) {
      newSocket.emit('userOnline', userId);
    }

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);
  useEffect(() => {
    if (!socket) return;
  
    const handleUpdateAllContacts =  async (contactUpdates) => {
      console.log('Contact Updates:', contactUpdates);
       await setcontactDetails(contactUpdates);
      

  
    
    };
  
    socket.on('updateAllContacts', handleUpdateAllContacts);
  
    return () => {
      socket.off('updateAllContacts', handleUpdateAllContacts);
    };
  }, [socket]);

  useEffect(() => {
    const initializeDB = async () => {
      const database = await initDB();
      setDB(database);
      const storedMessages = await getAllMessages(database);
      // console.log(storedMessages);
      
      const filteredMessages = storedMessages.filter(message =>
        message.receiverId === selectedFriend?.friendId || message.senderId === selectedFriend?.friendId
      );
      setMessageList(filteredMessages);
    };
    initializeDB();

    const handleMessageReceive = async (messageData) => {
      const newMessage = {
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        message: messageData.message,
        timestamp: new Date().toISOString()
      };
      await addMessage(db, newMessage);
      setLastMessages((prevLastMessages) => ({
        ...prevLastMessages,
        [messageData.senderId]: newMessage, // Assuming message.senderId is the friend who sent the message
    }));
    }

    socket?.on('receiveMessage', handleMessageReceive);


    return () => {
      socket?.off('receiveMessage', handleMessageReceive);
    };

  }, [selectedFriend, db, socket]);

  useEffect(() => {
    if (selectedFriend) {
      setSettingsVisible(false); // Hide the settings when selectedFriend changes
    }
  }, [selectedFriend]);
  useEffect(() => {
    const fetchfriend = async () => {
      await dispatch(fetchFriendsList(userId)); }
    fetchfriend();

  }, [userId, dispatch, getFriends, verifyUser]);

  const filteredFriends = friends.filter(friend =>
    friend.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteFriend = async (friendId) => {
    try {
      await deleteFriend(userId, friendId);
      // Refresh friends list after deleting
      const res = await getFriends(userId);
      if (res && res.friends) {
        dispatch(setFriends(res.friends));
      }
      // Clear selected friend if deleted
      if (selectedFriend?.friendId === friendId) {
        setSelectedFriend(null);
        setMessageList([]);
      }
    } catch (error) {
      console.error('Failed to delete friend:', error);
    }
  };

  const handleBlockUser = async (friendId) => {
    try {
      await blockfriend({ userId, friendId });

    } catch (error) {
      console.error('Failed to block user:', error);
    }
  };

  const handleUnblockUser = async (friendId) => {
    try {
      console.log("user unblocking");

      await unblockfriend({ userId, friendId });

    } catch (error) {
      console.error('Failed to block user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      {showAddFriend && <AddFriend onClose={() => setShowAddFriend(false)} />}
      {showFriendReq && <FriendReq onClose={() => setShowFriendReq(false)} />}
      <div
        className={`container mx-auto flex flex-col lg:flex-row gap-8 mt-10 h-[80vh] max-w-7xl ${isMobile ? "h-[100vh]" : ""}`}
      >
        {/* Friends List Section */}
        <div className={`w-full h-full lg:w-1/3 ${isMobile ? "h-[85vh]" : ""}`}>
          <GlassCard className="p-6 h-full ">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold mb-6 text-white">
                Friends List
              </h2>

              <div className="relative flex items-center">
                <button
                  onClick={() => setShowFriendReq(true)}
                  className="text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-semibold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center mb-6 gap-2"
                >
                  <User className="w-5 h-5" />
                  Requests
                </button>
                <span className="text-white h-5 w-5 text-center px-2 font-bold text-l ml-4 rounded-full fixed right-3 top-4 bg-red-700"></span>
              </div>
            </div>
            <button
              onClick={() => setShowAddFriend(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg mb-6 flex items-center justify-center gap-2"
            >
              <User className="w-5 h-5" />
              Add Friend
            </button>
            <GlassInput
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-6"
            />
            <div className="space-y-4 overflow-y-auto h-[90vh]">
              {filteredFriends.length === 0 && (
                <p className="text-gray-400 text-center">No friends found</p>
              )}
              {filteredFriends.map((friend) => (
                <div
                  key={friend.friendId}
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedFriend?.friendId === friend.friendId
                      ? "bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/20"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div
                    className="flex items-center space-x-4"
                    onClick={() => {
                      setSelectedFriend(friend);
                      setMessageBox(true);
                      setMessageList([]);
                      console.log(friend);
                    }}
                  >
                    <div>
                      <div className="absolute flex items-center justify-center w-6 h-6 text-xs text-white bg-green-500 rounded-full border-2 border-white">
                        2
                      </div>
                      <img
                        src={
                          friend.avatar ||
                          "https://picsum.photos/seed/default/200"
                        }
                        alt={friend.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/30 shadow-lg"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-lg">
                        {friend.name}
                      </p>
                      {lastMessages[friend.friendId] ? (
                        <div className="flex gap-8 text-white">
                          <p className=" text-white">
                          {lastMessages[friend.friendId].senderId === userId
        ? `You: ${lastMessages[friend.friendId].message}`
        :   `${friend.name}: ${lastMessages[friend.friendId].message}   `     }                          </p>
                          <small>
                            {new Date(
                              lastMessages[friend.friendId].timestamp
                            ).toLocaleString()}
                          </small>
                        </div>
                      ) : (
                        <div>
                          {" "}
                          <p className="text-gray-400 text-sm">
                            {friend.status || "Online"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const menu = e.currentTarget.nextElementSibling;
                        menu.classList.toggle("hidden");
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>

                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 hidden z-50 max-h-[150px] overflow-y-auto">
                      <button
                        className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700 w-full text-left"
                        onClick={() => handleDeleteFriend(friend.friendId)}
                      >
                        Delete Friend
                      </button>
                      <button
                        className="block px-4 py-2 text-sm text-yellow-400 hover:bg-gray-700 w-full text-left"
                        onClick={() =>
                          friend.status == "blocked"
                            ? handleUnblockUser(friend.friendId)
                            : handleBlockUser(friend.friendId)
                        }
                      >
                        {friend.status == "blocked"
                          ? "Unblock User"
                          : "Block User"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Chat Section */}
        <div
          className={`w-full lg:w-2/3 ${isMobile && !messageBox ? "hidden" : "block"}`}
        >
          <GlassCard className="p-6 h-full relative">
            <div className="flex items-center justify-between border-gray-700/30 border-b pb-4">
              <div className="flex items-center">
                {selectedFriend && (
                  <img
                    src={
                      selectedFriend.avatar ||
                      "https://picsum.photos/seed/default/200"
                    }
                    alt={selectedFriend.name}
                    className="w-10 h-10 rounded-full mr-4 border-2 border-purple-500/30"
                  />
                )}
                <h2 className="text-2xl font-bold text-white">
                  {selectedFriend
                    ? selectedFriend.name
                    : "Select a friend to start chatting"}
                </h2>
              </div>
              {selectedFriend && (
                <button
                  className="text-gray-400 hover:text-white ml-2"
                  onClick={() => setSettingsVisible(!settingsVisible)}
                >
                  <Settings className="h-6 w-6" />
                </button>
              )}
              {settingsVisible && <UserSettings friend={selectedFriend} />}
            </div>

            <div
              className="flex flex-col h-[86%]"
              onClick={() => setSettingsVisible(false)}
            >
              <div className="flex-grow space-y-4 mb-4 overflow-y-auto pr-4 ">
                {selectedFriend ? (
                  messageList.map((message, index) => (
                    <div
                      key={message.id || index}
                      className={`flex items-end space-x-3 ${message.senderId === userId ? "justify-end" : "justify-start"}`}
                    >
                      {message.senderId !== userId && (
                        <img
                          src={
                            selectedFriend.avatar ||
                            "https://picsum.photos/seed/default/200"
                          }
                          alt={selectedFriend.name}
                          className="w-8 h-8 rounded-full object-cover border-2 border-purple-500/30"
                        />
                      )}
                      <div
                        className={`p-4 rounded-2xl max-w-[70%] ${
                          message.senderId === userId
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 rounded-br-sm"
                            : "bg-gray-800/60 backdrop-blur-xl rounded-bl-sm"
                        }`}
                      >
                        <p
                          className="text-white text-base break-words"
                          style={{ maxWidth: "300px" }}
                        >
                          {message.message}
                        </p>
                        <p className="text-xs text-gray-300/80 mt-2">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {message.senderId === userId && (
                        <img
                          src={
                            userAvatar ||
                            "https://picsum.photos/seed/default/200"
                          }
                          alt="You"
                          className="w-8 h-8 rounded-full object-cover border-2 border-purple-500/30"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-300 space-y-4">
                    <svg
                      className="w-16 h-16 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p className="text-xl font-medium">
                      Select a friend to start chatting
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-auto w-full">
              {selectedFriend && selectedFriend.status === "accepted" && (
                <div className="flex items-center mb-6 border-gray-700/30 border-t pt-4 w-full">
                  <form
                    onSubmit={sendMessage}
                    className="flex space-x-3 w-full"
                  >
                    <GlassInput
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-grow"
                    />
                    <GradientButton type="submit" className="px-6">
                      Send
                    </GradientButton>
                  </form>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
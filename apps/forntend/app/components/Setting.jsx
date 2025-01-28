"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Clock, Trash, Ban, BellOff, Plus, X } from 'lucide-react';
import userApis from '../api/userApi';
import friendsApi from "../api/friend"
import { useSelector,useDispatch } from 'react-redux';
import { fetchFriendsList } from '../Redux/User/friendSlice';



const UserSettings =  ({ friend }) => {
  const [block, setblock] = useState(false);
  const { isAuthenticated, userName,userAvatar, userId } = useSelector((state) => state.user);
  const friends = useSelector((state) => state.friend); 
  const currentFriend = friends.friends.find(f => f.friendId === friend.friendId);
  const [Loading, setLoading] = useState(false);


  
  const dispatch = useDispatch()


  const handleBlock = async () => {
    setLoading(true);

    try {
      if (currentFriend.status === "blocked") {
        await friendsApi.unblockfriend({ userId, friendId: friend.friendId });
        await dispatch(fetchFriendsList(userId));

        // Optionally update the UI or state here
      } else {
        await friendsApi.blockfriend({ userId, friendId: friend.friendId });
        await dispatch(fetchFriendsList(userId));

        // Optionally update the UI or state here
      }
    } catch (error) {
      console.error("Error handling block/unblock:", error);
      // Optionally show an error message to the user
    }finally{setLoading(false)}
  };
  
  

  
  const ToggleButton = ({ id, label, checked, onChange }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
      <label htmlFor={id} style={{ color: '#e4e4e7' }}>{label}</label>
      <motion.button
        id={id}
        style={{
          width: '48px',
          height: '24px',
          backgroundColor: checked ? '#3b82f6' : '#4b5563',
          borderRadius: '12px',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: checked ? 'flex-end' : 'flex-start',
          cursor: 'pointer',
          border: 'none',
        }}
        onClick={() => onChange(!checked)}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
          }}
          layout
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30
          }}
        />
      </motion.button>
    </div>
  );

  const [userDetails, setUserDetails] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    userId: "USR-12345",
    avatar: "https://picsum.photos/seed/user123/200",
    balance: 95,
    transactions: [
      { id: "T1", amount: -50, description: "Chai", date: "2023-06-01", with: "Emma Watson" },
      { id: "T2", amount: 75, description: "Dinner", date: "2023-06-02", with: "Chris Hemsworth" },
      { id: "T3", amount: -30, description: "Movie tickets", date: "2023-06-03", with: "Zoe Saldana" },
    ]
  });

  const verifyUserDetails = async () => {
    try {
      const userData = await userApis.verifyUser(friend.friendId);
      setUserDetails(prevDetails => ({
        ...prevDetails,
        name: userData.user.name,
        email: userData.user.email,
        phone: userData.user.phone,
        avatar: userData.user.avatar,
        userId: userData.user.userId
      }));
      console.log(userData);
    } catch (error) {
      console.error('Failed to verify user:', error);
    }
  };

  useEffect(() => {
    verifyUserDetails();
  }, []);

  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("View Profile");
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [muteAllNotifications, setMuteAllNotifications] = useState(false);
  const [muteTransactionNotifications, setMuteTransactionNotifications] = useState(false);
  const [muteMessageNotifications, setMuteMessageNotifications] = useState(false);
  const [muteReminderNotifications, setMuteReminderNotifications] = useState(false);

  const settingsOptions = [
    { name: 'View Profile', icon: User },
    { name: 'Disappearing Messages', icon: Clock },
    { name: 'Clear Chat', icon: Trash },
    { name: 'Block User', icon: Ban },
    { name: 'Mute Notifications', icon: BellOff },
  ];

  const renderProfile = () => (
    <div style={{ color: '#e4e4e7' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div onClick={() => setIsImagePopupOpen(true)} style={{ cursor: 'pointer' }}>
          <img 
            src={friend.avatar} 
            alt={friend.name} 
            style={{ width: '128px', height: '128px', borderRadius: '50%' }} 
          />
        </div>
        {isImagePopupOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={friend.avatar} 
              alt={friend.name} 
              style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px' }} 
            />
            <button onClick={() => setIsImagePopupOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'transparent', color: '#ffffff', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✖</button>
          </div>
        )}
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1rem' }}>{userDetails.name}</h3>
        <span style={{ backgroundColor: '#4b5563', color: '#e4e4e7', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', marginTop: '0.5rem' }}>Split Money Pro</span>
      </div>
      <hr style={{ margin: '1rem 0', borderColor: '#4b5563' }} />
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 'semibold' }}>Email:</span>
          <span>{userDetails.email}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 'semibold' }}>Phone:</span>
          <span>{userDetails.phone}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 'semibold' }}>User ID:</span>
          <span>{userDetails.userId}</span>
        </div>
      </div>
      <hr style={{ margin: '.5rem 0', borderColor: '#4b5563' }} />
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ fontWeight: 'semibold', marginBottom: '0.5rem' }}>Current Balance</h4>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: userDetails.balance >= 0 ? '#10b981' : '#ef4444' }}>
          ${userDetails.balance.toFixed(2)}
        </p>
      </div>
      <hr style={{ margin: '1rem 0', borderColor: '#4b5563' }} />
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h4 style={{ fontWeight: 'semibold' }}>Recent Transactions</h4>
          <button onClick={() => setIsAddTransactionOpen(true)} style={{ backgroundColor: '#4b5563', color: '#e4e4e7', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>
            <Plus size={16} style={{ marginRight: '0.25rem' }} /> Add Transaction
          </button>
        </div>
        {userDetails.transactions.map((transaction) => (
          <div key={transaction.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div>
              <p style={{ fontWeight: 'medium' }}>{transaction.description}</p>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>• {transaction.date}</p>
            </div>
            <span style={{ fontWeight: 'bold', color: transaction.amount > 0 ? '#10b981' : '#ef4444' }}>
              {transaction.amount > 0 ? '+' : '-'}${Math.abs(transaction.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDisappearingMessages = () => (
    <div style={{ color: '#e4e4e7' }}>
      <h4 style={{ fontWeight: 'semibold', marginBottom: '0.5rem' }}>Disappearing Messages Settings</h4>
      <div>
        <label htmlFor="disappearing-time" style={{ display: 'block', marginBottom: '0.5rem' }}>Message disappear after</label>
        <select id="disappearing-time" style={{ width: '100%', padding: '0.5rem', backgroundColor: '#4b5563', color: '#e4e4e7', borderRadius: '0.375rem' }}>
          <option value="300">5 minutes</option>
          <option value="3600">1 hour</option>
          <option value="86400">24 hours</option>
          <option value="604800">7 days</option>
        </select>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
        When enabled, new messages in this chat will disappear after the specified time.
      </p>
    </div>
  );

  const renderClearChat = () => (
    <div style={{ color: '#e4e4e7' }}>
      <h4 style={{ fontWeight: 'semibold', marginBottom: '0.5rem' }}>Clear Chat History</h4>
      <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>
        This will permanently delete all messages in this chat for you. This action cannot be undone.
      </p>
      <button style={{ backgroundColor: '#ef4444', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 'medium' }}>Clear All Messages</button>
    </div>
  );

  const renderBlockUser = () => (
    <div style={{ color: '#e4e4e7' }}>
      <h4 style={{ fontWeight: 'semibold', marginBottom: '0.5rem' }}>
      {currentFriend.status=="blocked"?"Unblock User":"Block User"}</h4>
      <button style={{ backgroundColor: '#ef4444', color: '#ffffff',padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 'medium' }}
      onClick={()=>{handleBlock()}}
      >  {currentFriend.status=="blocked"?"Unblock User":"Block User"}</button>
      <hr style={{ margin: '1rem 0', borderColor: '#4b5563' }} />
    </div>
  );

  const renderMuteNotifications = () => (
    <div style={{ color: '#e4e4e7' }}>
      <h4 style={{ fontWeight: 'semibold', marginBottom: '0.5rem' }}>Mute Notifications</h4>
      <ToggleButton
        id="mute-all-notifications"
        label="Mute all notifications"
        checked={muteAllNotifications}
        onChange={setMuteAllNotifications}
      />
      <hr style={{ margin: '1rem 0', borderColor: '#4b5563' }} />
      <h4 style={{ fontWeight: 'semibold', marginBottom: '0.5rem' }}>Notification Settings</h4>
      <ToggleButton
        id="mute-transaction"
        label="Transaction notifications"
        checked={muteTransactionNotifications}
        onChange={setMuteTransactionNotifications}
      />
      <ToggleButton
        id="mute-message"
        label="Message notifications"
        checked={muteMessageNotifications}
        onChange={setMuteMessageNotifications}
      />
      <ToggleButton
        id="mute-reminder"
        label="Payment reminder notifications"
        checked={muteReminderNotifications}
        onChange={setMuteReminderNotifications}
      />
    </div>
  );

  const renderAddTransaction = () => (
    isAddTransactionOpen && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '0.5rem', width: '100%', maxWidth: '425px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#e4e4e7' }}>Add New Transaction</h3>
            <button onClick={() => setIsAddTransactionOpen(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#e4e4e7', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="transaction-amount" style={{ display: 'block', marginBottom: '0.5rem', color: '#e4e4e7' }}>Amount</label>
            <input id="transaction-amount" type="number" placeholder="Enter amount" style={{ width: '100%', padding: '0.5rem', backgroundColor: '#4b5563', color: '#e4e4e7', borderRadius: '0.375rem' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="transaction-description" style={{ display: 'block', marginBottom: '0.5rem', color: '#e4e4e7' }}>Description</label>
            <input id="transaction-description" placeholder="Enter description" style={{ width: '100%', padding: '0.5rem', backgroundColor: '#4b5563', color: '#e4e4e7', borderRadius: '0.375rem' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="mute-notifications" style={{ display: 'block', marginBottom: '0.5rem', color: '#e4e4e7' }}>Mute Notifications</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '0.5rem', color: '#e4e4e7' }}>Off</span>
              <input type="checkbox" id="mute-notifications" style={{ cursor: 'pointer' }} />
              <span style={{ marginLeft: '0.5rem', color: '#e4e4e7' }}>On</span>
            </div>
          </div>
          <button onClick={() => setIsAddTransactionOpen(false)} style={{ width: '100%', padding: '0.5rem', backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '0.375rem', fontWeight: 'medium' }}>Add Transaction</button>
        </div>
      </div>
    )
  );

  return (
    <div style={{ padding: '1.5rem', position: 'fixed', top: 0, right: 0, width: '24rem', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', zIndex: "50" }}>
      {Loading&&(
         <div className="absolute inset-0 flex items-center justify-center">
         <div className="w-10 h-10 border-4 border-t-blue-400 border-r-purple-400 border-b-pink-400 border-l-transparent rounded-full animate-spin"></div>
       </div>
      )}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '1rem' }}>Settings</h2>
      <div style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0.25rem', backgroundColor: '#1f2937', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          {settingsOptions.map((option) => (
            <motion.button
              key={option.name}
              onClick={() => setActiveTab(option.name)}
              style={{
                padding: '0.5rem',
                backgroundColor: activeTab === option.name ? '#374151' : 'transparent',
                borderRadius: '0.375rem',
                color: '#e4e4e7',
                border: 'none',
                cursor: 'pointer'
              }}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            >
              <option.icon size={24} />
            </motion.button>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "View Profile" && renderProfile()}
          {activeTab === "Disappearing Messages" && renderDisappearingMessages()}
          {activeTab === "Clear Chat" && renderClearChat()}
          {activeTab === "Block User" && renderBlockUser()}
          {activeTab === "Mute Notifications" && renderMuteNotifications()}
        </motion.div>
      </div>
      {renderAddTransaction()}
    </div>
  );
};

export default UserSettings;

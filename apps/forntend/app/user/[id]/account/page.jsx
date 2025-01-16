'use client'

import React, { useState } from 'react'
import { User, Mail, Phone, DollarSign, Users, Camera, Plus, ChevronRight, Lock, Trash2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import AddExpense from '../../../components/AddExpense';
import { showAlert } from '../../../Redux/User/AlertSlice';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '@/api/firebase';
import { imageUpload,imageLoading } from '../../../Redux/User/userSlice';
import userApis from '../../../api/userApi';
import Loader from '../../../components/Loader';

export default function SplitWiseUserProfile() {

  const {uploadImage}=userApis;
  const userDetail = useSelector(state => state.account.userDetails)
  const {userId,userName,userEmail,userPhone,userAvatar,imageUploaded}= useSelector(state=>state.user)   
  // user: null,
  // userId: null,
  // userName: null,
  // userPhone: null,
  // userEmail: null,
  // userAvatar: null,
  // profile:null,
  // token: null,
  // isAuthenticated: false,
  // loading: true,
  // error: null
  const dispatch = useDispatch();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const showAlert = (message, type) => {
    dispatch(showAlert({ message, type }));
  };

 
  const [isEditing, setIsEditing] = useState(false)
  const [userDetails, setUserDetails] = useState({
    name: 'John Doe',
    userId: '1234567890',
    email: 'john.doe@example.com', 
    phone: '+1 (555) 123-4567',
    defaultCurrency: 'USD',
    avatar: '/placeholder.svg?height=200&width=200',
    totalBalance: 152.75,
    youOwe: 50.25,
    youAreOwed: 203.00,
    groups: [
      { id: 1, name: 'Roommates', members: 4, balance: -25.50 },
      { id: 2, name: 'Trip to Paris', members: 6, balance: 75.00 },
      { id: 3, name: 'Office Lunch', members: 8, balance: 0 },
    ]
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordDetails, setPasswordDetails] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleSaveChanges = () => {
    setIsEditing(false)
    console.log('Changes saved')
    showAlert('Changes saved', 'success')
  }

  const handleAvatarChange = async (e) => {
    dispatch(imageLoading())
    const file = e.target.files?.[0]
    if (file) {
      try {
        console.log("uploading start.....");
        
        // Upload to Firebase
        const storage = getStorage(app);
        
        // Create new filename with user name and date
        const fileExtension = file.name.split('.').pop();
        const newFileName = `${userName}_${Date.now()}.${fileExtension}`;
        
        const storageRef = ref(storage, `avatars/${newFileName}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        console.log("firebase uploaded",downloadUrl);
        dispatch(imageUpload(downloadUrl))
        dispatch(imageLoading())
        
       // Upload to backend
        const response =await uploadImage({
          userId:userId,
          image: downloadUrl
        });
        console.log(response)

      } catch (error) {
        console.error('Error uploading avatar:', error);
        showAlert('Failed to upload avatar', 'error');
      }
    }
  }

  const handlePasswordChange = () => {
    if (passwordDetails.newPassword !== passwordDetails.confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    console.log('Password changed')
    setIsChangingPassword(false)
    setPasswordDetails({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.')
    if (confirmed) {
      console.log('Account deleted')
    }
  }

  const inputStyle = "w-full px-3 py-2 bg-gradient-to-r from-gray-700/50 to-gray-600/50 border border-gray-600 rounded-md text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
  const buttonStyle = "px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
         {showAddExpense && <AddExpense onClose={() => setShowAddExpense(false)} />}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-gradient-to-br from-purple-800/40 via-blue-800/40 to-gray-900/40 backdrop-filter backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-gray-700/50 p-6 mb-8">
            <div className="relative mb-6">
              


              <div className="relative">
                {!imageUploaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-t-blue-400 border-r-purple-400 border-b-pink-400 border-l-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img src={userAvatar || "/default-avatar.png"} className="w-32 h-32 rounded-full mx-auto object-cover bg-black" />
              </div>


              <label htmlFor="avatar-upload" className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full p-2 cursor-pointer">
                <Camera size={20} />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <p className="text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">@{userName}</p>
            
            <h2 className="text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{userId}</h2>
            <div className="text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
              <Mail className="inline-block mr-2" size={16} />
              {userEmail}
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`${buttonStyle} w-full mb-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white`}
            >
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className={`${buttonStyle} w-full mb-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white`}
            >
              <Lock className="inline-block mr-2" size={16} />
              Change Password
            </button>
            <button
              onClick={handleDeleteAccount}
              className={`${buttonStyle} w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white`}
            >
              <Trash2 className="inline-block mr-2" size={16} />
              Delete Account
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-800/40 via-blue-800/40 to-gray-900/40 backdrop-filter backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-gray-700/50 p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Balance Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-gray-700/50 to-gray-600/50 border border-gray-600">
                <span className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Total Expense</span>
                <span className={`text-xl font-bold ${userDetail.total_expense_created >= 0 ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400' : 'text-red-500'}`}>
                  ${userDetail.total_expense_created.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-800/40 via-blue-800/40 to-gray-900/40 backdrop-filter backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-gray-700/50 p-6">
            <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Quick Actions</h3>
            <div className="space-y-4">
              <button className={`${buttonStyle} w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white`}
                onClick={() => setShowAddExpense(true)}
              >
                <Plus className="inline-block mr-2" size={20} />
                Add an expense
              </button>
              <button className={`${buttonStyle} w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white`}>
                Settle up
              </button>
              <button className={`${buttonStyle} w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white`}>
                <Users className="inline-block mr-2" size={20} />
                Create a group
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          {isChangingPassword ? (
            <div className="bg-gradient-to-br from-purple-800/40 via-blue-800/40 to-gray-900/40 backdrop-filter backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-gray-700/50 p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-1">Current Password</label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={passwordDetails.currentPassword}
                    onChange={(e) => setPasswordDetails({...passwordDetails, currentPassword: e.target.value})}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-1">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={passwordDetails.newPassword}
                    onChange={(e) => setPasswordDetails({...passwordDetails, newPassword: e.target.value})}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-1">Confirm New Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={passwordDetails.confirmPassword}
                    onChange={(e) => setPasswordDetails({...passwordDetails, confirmPassword: e.target.value})}
                    className={inputStyle}
                  />
                </div>
                <button
                  onClick={handlePasswordChange}
                  className={`${buttonStyle} bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white`}
                >
                  Update Password
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-purple-800/40 via-blue-800/40 to-gray-900/40 backdrop-filter backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-gray-700/50 p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Personal Information</h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-1">Name</label>
                    <input
                      id="name"
                      type="text"
                      value={userDetail.name}
                      onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-1">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={userDetail.email}
                      onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-1">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      value={userDetail.phone}
                      onChange={(e) => setUserDetails({...userDetails, phone: e.target.value})}
                      className={inputStyle}
                    />
                  </div>
                  <button
                    onClick={handleSaveChanges}
                    className={`${buttonStyle} bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white`}
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-black mr-4 p-2 flex items-center justify-center">
                      <User className="text-white" size={24} />
                    </div>
                    <span className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{userName}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-black mr-4 p-2 flex items-center justify-center">
                      <Mail className="text-white" size={24} />
                    </div>
                    <span className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{userEmail}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-black mr-4 p-2 flex items-center justify-center">
                      <Phone className="text-white" size={24} />
                    </div>
                    <span className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{userPhone}</span>
                  </div>
                  
                </div>
              )}
            </div>
          )}

          <div className="bg-gradient-to-br from-purple-800/40 via-blue-800/40 to-gray-900/40 backdrop-filter backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-gray-700/50 p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Your Groups</h3>
            <div className="space-y-4">
              {userDetails.groups.map(group => (
                <div key={group.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-700/50 to-gray-600/50 border border-gray-600 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{group.name}</h4>
                    <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{group.members} members</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`mr-2 ${group.balance >= 0 ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400' : 'text-red-500'}`}>
                      ${Math.abs(group.balance).toFixed(2)}
                    </span>
                    <ChevronRight size={20} className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
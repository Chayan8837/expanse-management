"use client"

import React, { useState, useEffect } from 'react'
import { DollarSign, User, FileText, Search, Percent } from 'lucide-react'
import { useSelector } from 'react-redux'
userApis
import expenseApis from '../../../app/app/api/expensApi'
import userApis from '../api/userApi'
import { useDispatch } from 'react-redux'
import { addNewExpense } from '../Redux/User/AccountSlice'

  

const AddExpense = ({ onClose }) => {
  const dispatch = useDispatch();
  const {verifyUser} = userApis;
  const {addExpense} = expenseApis;
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [splitType, setSplitType] = useState('none') 
  const [splitUsers, setSplitUsers] = useState([]);
  const [splitAmounts, setSplitAmounts] = useState({})
  const [splitPercentages, setSplitPercentages] = useState({})
  const [searchUser, setSearchUser] = useState('')
  const [foundUser, setFoundUser] = useState({id: '', name: '', email: '', avatar: 'https://via.placeholder.com/150'})
  const {userDetails} = useSelector(state => state.account)
  const {userId} = useSelector(state => state.user)
  const demoUsers = [
    { id: "user1", name: "John Doe", email: "john@example.com" },
    { id: "user2", name: "Jane Smith", email: "jane@example.com" },
    { id: "user3", name: "Bob Wilson", email: "bob@example.com" },
    { id: "user4", name: "Alice Brown", email: "alice@example.com" }
  ]

  const filteredUsers = demoUsers.filter(user => 
    user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.id.toLowerCase().includes(searchUser.toLowerCase())
  )

  useEffect(() => {
    const searchForUser = async () => {
      if (searchUser.length === 24) {
        try {
          const userData = await verifyUser(searchUser)
          console.log(userData)
            setFoundUser({
              ...foundUser,
              id: userData.user.userId,
              name: userData.user.name,
              email: userData.user.email,
              avatar: userData.user.avatar || 'https://via.placeholder.com/150'
            })
            console.log(foundUser);
          
          
        } catch (error) {
          console.error('Error searching user:', error)
        }
      }
    }

    searchForUser()
    if (searchUser.length !== 24) {
      setFoundUser({
        ...foundUser,
        id: '',
        name: '',
        email: '',
        avatar: 'https://via.placeholder.com/150'
      })
    }
  }, [searchUser])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formData = {
      creator: userId,
      amount: parseFloat(amount),
      description,
      split_type: splitType,
      split_members: splitType !== 'none' ? 
        [
          {
            user: userDetails.id,
            amount: splitType === 'exact' ? parseFloat(splitAmounts[userDetails.id]) : 
                   splitType === 'percentage' ? (parseFloat(amount) * parseFloat(splitPercentages[userDetails.id])) / 100 :
                   parseFloat(amount) / (splitUsers.length + 1),
            percentage: splitType === 'percentage' ? parseFloat(splitPercentages[userDetails.id]) : null
          },
          ...splitUsers.map(user => ({
            user: user.id,
            amount: splitType === 'exact' ? parseFloat(splitAmounts[user.id]) : 
                   splitType === 'percentage' ? (parseFloat(amount) * parseFloat(splitPercentages[user.id])) / 100 :
                   parseFloat(amount) / (splitUsers.length + 1),
            percentage: splitType === 'percentage' ? parseFloat(splitPercentages[user.id]) : null
          }))
        ] : []
    }
    console.log('Form Data:', formData);
   




    try {
      const response = await expenseApis.addExpense(formData);
      console.log('Response:', response);

       
      await dispatch(addNewExpense({
        id: Math.floor(Math.random() * 20) + 1,
        amount: formData.amount,
        description: formData.description,
        split_type: formData.split_type,
        split_members: formData.split_members,
        createdAt: new Date().toISOString()
      }));

    } catch (error) {
      console.error('Error adding expense:', error);
    }
    

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-filter backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-gray-700/50 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add New Expense</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Total Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter total amount"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter expense description"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Split Type</label>
            <select 
              value={splitType}
              onChange={(e) => setSplitType(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 "
            >
              <option value="none">No Split</option>
              <option value="equal">Equal Split</option>
              <option value="exact">Exact Amount Split</option>
              <option value="percentage">Percentage Split</option>
            </select>
          </div>

          {splitType !== 'none' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Search Users</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Search by name, email or ID"
                />
              </div>
              
              {searchUser && (
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <div 
                        key={user.id}
                        onClick={() => {
                          if (!splitUsers.some(u => u.id === user.id)) {
                            setSplitUsers([...splitUsers, user])
                            setSearchUser('')
                          }
                        }}
                        className="p-2 bg-gray-700/30 rounded-md cursor-pointer hover:bg-gray-600/30"
                      >
                        <div className="text-white">{user.name}</div>
                        <div className="text-gray-400 text-sm">{user.email}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 bg-gray-700/30 rounded-md">
                      {foundUser.id ? (
                        <>
                        <div onClick={() => {
                          if (!splitUsers.some(u => u.id === foundUser.id)) {
                            setSplitUsers([...splitUsers, foundUser])
                            setSearchUser('')
                            console.log(splitUsers);
                            
                          }
                        }}>
                          <div className="text-white">{foundUser.name}</div>
                          <div className="text-gray-400 text-sm">{foundUser.email}</div>
                        </div>
                        </>
                      ) : (
                        <>
                          <div className="text-white">Searching for ID: {searchUser}</div>
                          <div className="text-gray-400 text-sm">Please wait...</div>
                          <div className="animate-pulse flex space-x-2 justify-center">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animation-delay-200"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animation-delay-400"></div>
                          </div>
                        </>
                      )}
                    </div>
                  ) 
                  }
                </div>
              )}

              {splitUsers.length > 0 && splitType === 'equal' && (
                <div className="mt-4 space-y-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Selected Users</label> 
                  {splitUsers.map(user => (
                    <div key={user.id} className="bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-gray-700/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                          <User className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-gray-400 text-sm">{user.email}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {splitType === 'exact' && splitUsers.map(user => (
            <div key={user.id} className="bg-gray-800/30 rounded-lg p-4 mb-4 backdrop-blur-sm border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="relative w-48">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={splitAmounts[user.id] || ''}
                      onChange={(e) => setSplitAmounts({...splitAmounts, [user.id]: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter amount"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>
          ))}

          {splitType === 'percentage' && splitUsers.map(user => (
            <div key={user.id} className="bg-gray-800/30 rounded-lg p-4 mb-4 backdrop-blur-sm border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="relative w-48">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Percent className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={splitPercentages[user.id] || ''}
                      onChange={(e) => setSplitPercentages({...splitPercentages, [user.id]: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter percentage"
                      min="0"
                      max="100"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>
          ))}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddExpense
'use client'

import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import friendsApi from '../api/friend'
import userApis from '../api/userApi'
// Add demo users data that was missing
const demoUsers = {
  user1: {
    userId: "user1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://picsum.photos/seed/user1/200"
  },
  user2: {
    userId: "user2", 
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://picsum.photos/seed/user2/200"
  }
}

export default function AddFriend({ onClose }) {
  const {verifyUser} = userApis;
  const {addFriendRequest} = friendsApi;
  const userId = useSelector(state => state.user.userId)
  const [searchTerm, setSearchTerm] = useState('')
  const [addedUsers, setAddedUsers] = useState({})
  const [searchResults, setSearchResults] = useState([])
  const [foundUser, setFoundUser] = useState(null)


  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.length === 24) {
        
        try {
          const response= await verifyUser(searchTerm);
          if (response) {
            setFoundUser({
              id: response.user.userId,
              name: response.user.name,
              email: response.user.email,
              avatar: response.user.avatar
            })
            setSearchResults([])
          } else {
            setFoundUser(null)
            setSearchResults([])
          }
        } catch (error) {
          console.error('Error searching user:', error)
          setSearchResults([])
        }
      } else if (searchTerm.length > 0) {
        // Search by name if less than 24 characters
        const results = Object.values(demoUsers).filter(user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(user => ({
          id: user.userId,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        }))
        setSearchResults(results)
        setFoundUser(null)
      } else {
        setFoundUser(null)
        setSearchResults([])
      }
    }

    searchUsers()
  }, [searchTerm])

  const handleAddFriend = async (requestUserId) => {
    try {
        const body ={
            userId,
            friendId: requestUserId
        }
      const response = await addFriendRequest(body);
      console.log({body,response});
      
      setAddedUsers(prev => ({
        ...prev,
        [requestUserId]: true
      }))

      console.log(`Friend request sent to user ${requestUserId}`)
    } catch (error) {
      console.error('Error adding friend:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-filter backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-gray-700/50 p-6 w-full max-w-md h-[600px] relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Add Friend</h2>
        <div className="space-y-4">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 text-white" />
              <input
                type="text"
                placeholder="Search by name or enter 24-character ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto perspective-1000">
            {foundUser && (
              <div 
                key={foundUser.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 hover:bg-gray-700/40 transition-all duration-300 transform hover:translate-z-12 hover:shadow-2xl"
              >
                <img 
                  src={foundUser.avatar}
                  alt={foundUser.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/30"
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{foundUser.name}</h3>
                  <p className="text-gray-400 text-sm">{foundUser.email}</p>
                </div>
                <button
                  onClick={() => handleAddFriend(foundUser.id)}
                  disabled={addedUsers[foundUser.id]}
                  className={`px-4 py-2 rounded-full font-bold text-white transition-all duration-300 shadow-lg transform hover:scale-105 ${
                    addedUsers[foundUser.id]
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                  }`}
                >
                  {addedUsers[foundUser.id] ? 'Sent' : 'Add'}
                </button>
              </div>
            )}

            {searchResults.map((user, index) => (
              <div 
                key={user.id}
                style={{
                  transform: `translateZ(${-index * 10}px)`,
                  zIndex: searchResults.length - index
                }}
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 hover:bg-gray-700/40 transition-all duration-300 transform hover:translate-z-12 hover:shadow-2xl"
              >
                <img 
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/30"
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{user.name}</h3>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
                <button
                  onClick={() => handleAddFriend(user.id)}
                  disabled={addedUsers[user.id]}
                  className={`px-4 py-2 rounded-full font-bold text-white transition-all duration-300 shadow-lg transform hover:scale-105 ${
                    addedUsers[user.id]
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                  }`}
                >
                  {addedUsers[user.id] ? 'Sent' : 'Add'}
                </button>
              </div>
            ))}

            {searchTerm.length > 0 && !foundUser && searchResults.length === 0 && (
              <p className="text-center text-gray-400 py-4">No users found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

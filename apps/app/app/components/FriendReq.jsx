'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import userApis from '../api/userApi'
import friendsApi from '../api/friend'
import { addFriend } from '../Redux/User/friendSlice'
import { setPendingRequests } from '../Redux/User/friendSlice';


// Custom Card component with glass effect
const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-filter backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-gray-700/50 relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
    <div className="relative z-10">
      {children}
    </div>
  </div>
)

export default function FriendReq({ onClose }) {
  const dispatch = useDispatch();
  const { verifyUser } = userApis;
  // const { addFriend } = useSelector((state) => state.friend);
  const { getRequests, acceptRequest } = friendsApi;
  const { userId } = useSelector((state) => state.user);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (!userId) return;

      try {
        const response = await getRequests(userId);
        
        const requestsWithDetails = await Promise.all(
          response.requests.map(async (request) => {
            try {
              const userDetails = await verifyUser(request.friendId);
              return {
                ...request,
                name: userDetails.user.name,
                email: userDetails.user.email,
                avatar: userDetails.user.avatar
              };
            } catch (error) {
              console.error(`Error fetching details for request ${request.senderId}:`, error);
              return request;
            }
          })
        );

        setFriendRequests(requestsWithDetails);
      dispatch(setPendingRequests(requestsWithDetails));
      } catch (err) {
        console.error('Failed to fetch friend requests:', err);
      }
    };
    fetchFriendRequests();
  }, [userId, dispatch]);

  const handleAccept = async (data) => {
    try {
      await acceptRequest({userId, friendId: data.friendId});
      dispatch(addFriend({
        friendId: data.friendId, 
        name: data.name, 
        avatar: data.avatar, 
        status: 'accepted'
      }));
      setFriendRequests(prev => prev.filter(req => req.friendId !== data.friendId));
    } catch (err) {
      console.error('Failed to accept friend request:', err);
    }
  };

  const handleReject = async (friendId) => {
    // try {
    // //   await rejectFriendRequest(userId, friendId)
    //   setFriendRequests(prev => prev.filter(req => req.friendId !== friendId))
    // } catch (err) {
    //   console.error('Failed to reject friend request:', err) 
    // }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md p-4">
        <GlassCard className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Friend Requests</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {friendRequests.length === 0 ? (
              <p className="text-gray-400 text-center">No pending friend requests</p>
            ) : (
              friendRequests.map((request) => (
                <div 
                  key={request.friendId}
                  className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl"
                >
                  <div className="flex items-center space-x-4">
                    <img 
                      src={request.avatar || "https://picsum.photos/seed/default/200"} 
                      alt={request.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/30"
                    />
                    <div>
                      <p className="font-semibold text-white">{request.name}</p>
                      <p className="text-sm text-gray-400">{request.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {request.status==="accepted" && (
                      <button
                        className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                      >
                        Accepted
                      </button>
                    )}
                    {request.status==="pending" && (
                      <>
                        <button
                          onClick={() => handleAccept({friendId: request.friendId, name: request.name, avatar: request.avatar})}
                      className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request.friendId)}
                      className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                      Reject
                        </button>
                      </>
                    )}
                    {request.status==="blocked" && (
                      <button
                        className="px-3 py-1 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-colors"
                      >
                        Blocked
                      </button>
                    )}


                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

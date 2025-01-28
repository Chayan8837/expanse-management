"use client"
import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import friendsApi  from "@/app/api/friend"
import userApis from "@/app/api/userApi"

export const fetchFriendsList = createAsyncThunk(
  'friend/fetchFriends',
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) return [];
      const res = await friendsApi.getFriends(userId);
      
      if (res && res.friends) {
        const friendsWithDetails = await Promise.all(
          res.friends.map(async (friend) => {
            try {
              const userDetails = await userApis.verifyUser(friend.friendId);
              return {
                ...friend,
                name: userDetails.user.name,
                email: userDetails.user.email,
                avatar: userDetails.user.avatar
              };
            } catch (error) {
              console.error(`Error fetching details for friend ${friend.friendId}:`, error);
              return friend; // Return the original friend object if details fetch fails
            }
          })
        );
        return friendsWithDetails;
      } else {
        throw new Error('Failed to fetch friends');
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
const initialState = {
  friends: [],
  pendingRequests: [],
  sentRequests: [], 
  loading: false,
  error: null
};

const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFriends: (state, action) => {
      state.friends = action.payload;
      state.loading = false;
      state.error = null;
    },
    addFriend: (state, action) => {
      state.friends.push(action.payload);
      
    },
    removeFriend: (state, action) => {
      state.friends = state.friends.filter(friend => friend.id !== action.payload);
    },
    setPendingRequests: (state, action) => {
      state.pendingRequests = action.payload;
      state.loading = false;
      state.error = null;
    },
    addPendingRequest: (state, action) => {
      if (!state.pendingRequests.some(request => request.id === action.payload.id)) {
        state.pendingRequests.push(action.payload);
      }
    },
    removePendingRequest: (state, action) => {
      state.pendingRequests = state.pendingRequests.filter(request => request.id !== action.payload);
    },
    setSentRequests: (state, action) => {
      state.sentRequests = action.payload;
      state.loading = false;
      state.error = null;
    },
    addSentRequest: (state, action) => {
      if (!state.sentRequests.some(request => request.id === action.payload.id)) {
        state.sentRequests.push(action.payload);
      }
    },
    removeSentRequest: (state, action) => {
      state.sentRequests = state.sentRequests.filter(request => request.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriendsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriendsList.fulfilled, (state, action) => {
        state.friends = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchFriendsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setLoading,
  setError,
  setFriends,
  addFriend,
  removeFriend,
  setPendingRequests,
  addPendingRequest,
  removePendingRequest,
  setSentRequests,
  addSentRequest,
  removeSentRequest
} = friendSlice.actions;

export default friendSlice.reducer;

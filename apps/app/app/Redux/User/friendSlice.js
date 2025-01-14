"use client"
import { createSlice } from '@reduxjs/toolkit';

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

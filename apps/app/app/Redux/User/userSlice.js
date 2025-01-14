"use client"
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  userId: null,
  userName: null,
  userPhone: null,
  userEmail: null,
  userAvatar: null,
  profile:null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  imageUploaded: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.userinfo;
      state.isAuthenticated = true;
      state.token = action.payload.token;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    imageUpload: (state, action) => {
      state.userAvatar = action.payload;
    },
    imageLoading: (state) => {
      state.imageUploaded = !state.imageUploaded;
    },
    verifyUser: (state, action) => {
      state.userId = action.payload.user.userId;
      state.userName = action.payload.user.name;
      state.userPhone = action.payload.user.phone;
      state.userEmail = action.payload.user.email;
      state.userAvatar = action.payload.user.avatar;
      state.isVerified = true;
      state.loading = false;
      state.isAuthenticated = true;
    }
  }
});

export const { logout, loginStart, loginSuccess, loginFailure,verifyUser,imageUpload,imageLoading } = userSlice.actions;

export default userSlice.reducer;
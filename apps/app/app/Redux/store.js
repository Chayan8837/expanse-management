"use client"
import { configureStore } from '@reduxjs/toolkit';
import userSlice from './User/userSlice';
import accountSlice from './User/AccountSlice';
import friendSlice from './User/friendSlice';
import alertSlice from './User/AlertSlice';

const store = configureStore({
  reducer: {
    user: userSlice,
    account: accountSlice,
    friend: friendSlice,
    alert: alertSlice
  },
 
});

export default store;

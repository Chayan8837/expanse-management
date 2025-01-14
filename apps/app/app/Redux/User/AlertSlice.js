import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: '',
  type: '', // 'success', 'error', 'info', 'warning'
  show: false
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.show = true;
    },
    hideAlert: (state) => {
      state.message = '';
      state.type = '';
      state.show = false;
    }
  }
});

export const { showAlert, hideAlert } = alertSlice.actions;
export default alertSlice.reducer;

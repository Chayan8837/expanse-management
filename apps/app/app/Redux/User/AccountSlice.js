"use client"
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userDetails: {
    user: {
      name: null,
      phone: null,
      email: null
    },
    total_expense_created: 0,
    total_paid_in_split: 0,
    balance_with_others: [],
    expenses: []
  },
  friends: [],
  loading: false,
  error: null
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    fetchAccountStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAccountSuccess: (state, action) => {
      state.loading = false;
      state.userDetails = {
        ...state.userDetails,
        ...action.payload
      };
    },
    fetchAccountFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addNewExpense: (state, action) => {
      state.userDetails.expenses.unshift(action.payload);
      state.userDetails.total_expense_created += action.payload.amount;
      console.log({state});
      
    },
    updateExpense: (state, action) => {
      const index = state.userDetails.expenses.findIndex(
        expense => expense.id === action.payload.id
      );
      if (index !== -1) {
        const oldAmount = state.userDetails.expenses[index].amount;
        state.userDetails.expenses[index] = action.payload;
        state.userDetails.total_expense_created += (action.payload.amount - oldAmount);
      }
    },
    resetAccount: (state) => {
      return initialState;
    }
  }
});

export const {
  fetchAccountStart,
  fetchAccountSuccess,
  fetchAccountFailure,
  addNewExpense,
  updateExpense,
  resetAccount
} = accountSlice.actions;

export default accountSlice.reducer;
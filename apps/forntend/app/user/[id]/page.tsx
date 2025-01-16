"use client"
import React from 'react'
import ExpenseDashboard from '../../components/ExpenseDashboard'    
import { Provider } from 'react-redux';
import store from '../../Redux/store';
import Alert from '../../components/Alert';
const Home = () => {
  return (
      
        <Provider store={store}>
          <ExpenseDashboard />
          <Alert/>
        </Provider>
    
  )
}

export default Home
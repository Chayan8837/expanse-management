'use client'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { verifyUser } from '../Redux/User/userSlice'
import userApis from '../api/userApi'

const Auth = () => {
  const { verifyUser: verifyUserApi } = userApis;
    const dispatch = useDispatch();
    useEffect(() => {
        const verifyUserStatus = async () => {
          try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;
    
            const response = await verifyUserApi(userId);
            
            if (response) {
              await dispatch(verifyUser(response));
              console.log(response);
              
            }
          } catch (error) {
            console.error('Verification failed:', error);
          }
        };
    
        verifyUserStatus();
      }, [dispatch]);

  return (
    <div>

    </div>
  )
}

export default Auth
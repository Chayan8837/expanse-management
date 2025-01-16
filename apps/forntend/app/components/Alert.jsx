"use client"
import { useSelector, useDispatch } from 'react-redux';
import { showAlert } from '../Redux/User/AlertSlice';
import { useEffect } from 'react';

const Alert = () => {
  const dispatch = useDispatch();
  const { message, type, show } = useSelector((state) => state.alert);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        dispatch(showAlert({message: 'hiiii', type: 'success'}));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }[type] || 'bg-gray-500';

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg text-white shadow-lg z-50 ${bgColor}`}>
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default Alert;

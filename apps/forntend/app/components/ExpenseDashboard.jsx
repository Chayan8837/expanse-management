"use client"

import { useEffect, useState } from 'react'
import { PlusCircle, User, CreditCard, PieChart, TrendingUp, Calendar, IndianRupee } from 'lucide-react'
import { useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Loader from './Loader';
import Link from 'next/link';
import AddExpense from './AddExpense';

export default function ExpenseDashboard() {
  const { userDetails, loading } = useSelector(state => state.account);
  const { userName, userAvatar,userId,userEmail} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const showAlert = (message, type) => {
    dispatch(showAlert({ message, type }));
  };



  // Custom Button Component
  const Button = ({ onClick, className, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${className}`}
    >
      {children}
    </button>
  );

  // Custom Input Component
  const Input = ({ id, name, type, required, className, placeholder, value, onChange }) => (
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      className={`w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
  
  
  // Custom Label Component
  const Label = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300 mb-1">
      {children}
    </label>
  );

  
  return (
  
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
     {!userDetails & !loading &&  <Loader /> }
     
      {showAddExpense && <AddExpense onClose={() => setShowAddExpense(false)} />}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* User Info Box */}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-filter backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-gray-700/50 p-6 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
          <div>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 mx-auto mb-4 flex items-center justify-center shadow-lg">
              {userAvatar ? (
                <img src={userAvatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <h2 className="text-x font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 text-center mb-2">{userId}</h2>
            <h2 className="text-2xl font-bold text-center text-white mb-2">{userName}</h2>
            <p className="text-gray-300 text-center mb-6">{userEmail}</p>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-xl p-4 flex items-center backdrop-blur-md">
              <CreditCard className="w-6 h-6 text-purple-400 mr-3" />
              <div>
                <p className="text-sm text-gray-300">Main Card</p>
                <p className="text-white font-semibold">**** 1234</p>
              </div>
            </div>
            <Button
              onClick={() => showAlert('Logged out successfully', 'success')}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Total Spent Box */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-filter backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-gray-700/50 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
            <h2 className="text-2xl font-semibold mb-2 text-white relative z-10">Total Spent</h2>
            <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 relative z-10">₹ {userDetails?.total_expense_created || 0}</p>
          </div>

          {/* Add Expense and Reports Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add Expense Box */}
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-filter backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-gray-700/50 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
              <h2 className="text-2xl font-semibold mb-4 text-white flex items-center relative z-10">
                <PlusCircle className="w-6 h-6 mr-2 text-purple-400" />
                Add Expense
              </h2>
              <Button
                onClick={() => setShowAddExpense(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg relative z-10"
              >
                New Expense
              </Button>
            </div>

            {/* Reports Box */}
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-filter backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-gray-700/50 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
              <h2 className="text-2xl font-semibold mb-4 text-white flex items-center relative z-10">
                <PieChart className="w-6 h-6 mr-2 text-purple-400" />
                Reports
              </h2>
              <div className="space-y-2 relative z-10">
                <Button
                  onClick={() => {}}
                  className="w-full text-gray-200 border border-gray-600 hover:bg-gray-700/50 backdrop-blur-sm"
                >
                  <TrendingUp className="w-4 h-4 mr-2 inline" />
                  View Analytics
                </Button>
                <Button
                  onClick={() => {}}
                  className="w-full text-gray-200 border border-gray-600 hover:bg-gray-700/50 backdrop-blur-sm"
                >
                  <Calendar className="w-4 h-4 mr-2 inline" />
                  Monthly Report
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Expenses Box */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-filter backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-gray-700/50 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-4">
              <h2 className="text-2xl font-semibold mb-4 text-white relative z-10">Recent Expenses</h2>
              <Link href={`/user/${id}/expenses`}>
                <h2 className="text-sm text-gray-300 relative z-10 mb-4ont-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 cursor-pointer">All Expenses</h2>
              </Link>
            </div>
            <div className="space-y-4 relative z-10 h-[240px] overflow-y-auto">
              {userDetails?.expenses?.length === 0 && <p className="text-gray-400 text-center">No expenses found</p>}
              {userDetails?.expenses?.slice(0,3).map((expense) => (
                <div key={expense.id} className="flex justify-between items-center py-2 border-b border-gray-700/50 last:border-0">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mr-4 backdrop-blur-sm">
                      <IndianRupee className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{expense.description}</p>
                      <p className="text-sm text-gray-300">{new Date(expense.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">₹ {expense.amount.toFixed(2)}</p>
                    {expense.split && <p className="text-xs text-gray-400">Split</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
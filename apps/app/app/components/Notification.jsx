"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { Bell } from 'lucide-react';

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Demo notification data
  const notifications = [
    {
      id: 1,
      sender: "John Doe", 
      message: "Added a new expense of $50 for Dinner",
      logo: "/avatars/john-doe.png",
      time: "2 mins ago"
    },
    {
      id: 2,
      sender: "Jane Smith",
      message: "Requested $30 for Movie tickets", 
      logo: "/avatars/jane-smith.png",
      time: "5 mins ago"
    },
    {
      id: 3,
      sender: "Mike Johnson",
      message: "Settled the pending bill of $25",
      logo: "/avatars/mike-johnson.png",
      time: "10 mins ago"
    }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 p-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg z-50"
      >
        <Bell className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed right-0 top-0 h-full w-80 bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-filter backdrop-blur-xl shadow-2xl border-l border-gray-700/50 p-4 z-40 transition-all duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition duration-200"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={notification.logo}
                    alt={notification.sender}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{notification.sender}</p>
                  <p className="text-sm text-gray-300">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;

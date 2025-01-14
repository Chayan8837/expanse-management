"use client"

import { useState } from 'react'
import { DollarSign, Calendar, Tag, Search } from 'lucide-react'
import { useSelector } from 'react-redux'
import userApis from '../../../api/userApi'
import { useEffect } from 'react'



export default function Page() {
  const { verifyUser } = userApis;
  const { userDetails, loading } = useSelector(state => state.account)
  const [searchTerm, setSearchTerm] = useState('')




  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search expenses..."
              className="w-full pl-12 pr-4 py-3 bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Expenses List */}
        <div className="space-y-4">
            {
            console.log(userDetails?.expenses)
          }
          {userDetails?.expenses?.map((expense) => (
            <div
              key={expense.id}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 transition-all hover:shadow-lg hover:border-purple-500/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <DollarSign className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{expense.description}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {expense.split_members && expense.split_members.slice(1).map((member) => {
                        const [splitMember, setSplitMember] = useState({});
                        
                        useEffect(() => {
                          const fetchMemberName = async () => {
                            try {
                              const username = await verifyUser(member.user);
                              setSplitMember(username.user);
                            } catch (err) {
                              console.error('Error fetching member name:', err);
                            }
                          };
                          
                          fetchMemberName();
                        }, [member.user]);

                        return (
                          <span key={member.user} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                            {splitMember.name} • {splitMember.email} • {member.amount}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                    ${expense.amount}
                  </p>
                  <div className="flex items-center text-gray-400 text-sm mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(expense.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

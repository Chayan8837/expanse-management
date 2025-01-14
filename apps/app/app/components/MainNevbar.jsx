'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Home, Users, UserPlus, User } from 'lucide-react'
import { useMediaQuery } from 'react-responsive'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function MainNavbar() {
  const [active, setActive] = useState('Home')
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const params = useParams()
  const id = params?.id // Dynamically get the `id` parameter

  const navItems = [
    { icon: Home, label: 'Home', href: id ? `/user/${id}` : '/' }, // Use dynamic id in URL
    { icon: Users, label: 'Friends', href: `/user/${id}/friends` }, // Include id in nested route
    { icon: UserPlus, label: 'Groups', href: '/groups' },
    { icon: User, label: 'Account', href: `/user/${id}/account` },
  ]

  const NavContent = () => (
    <>
      {navItems.map(({ icon: Icon, label, href }) => (
        <Link href={href} key={label}>
          <motion.button
            className={`flex flex-col items-center justify-center p-2 ${
              isMobile ? 'flex-1' : 'w-20'
            } ${
              active === label ? 'text-blue-400' : 'text-gray-400'
            }`}
            onClick={() => setActive(label)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className={`p-2 rounded-full bg-gradient-to-br ${
                active === label ? 'from-blue-500 to-purple-600' : 'from-gray-700 to-gray-800'
              }`}
              animate={{
                scale: active === label ? 1.2 : 1,
              }}
            >
              <Icon className="w-6 h-6" />
            </motion.div>
            <span className="text-xs mt-1 font-medium">{label}</span>
          </motion.button>
        </Link>
      ))}
    </>
  )

  return (
    <div className={` ${isMobile ? ' sticky bottom-0 w-full' : 'fixed bottom-10 left-1/2 transform -translate-x-1/2'} z-50`}>
      <motion.nav
        className={`${
          isMobile
            ? 'bg-gray-900 w-full'
            : 'bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-t-xl shadow-lg w-auto max-w-md'
        }`}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className={`flex ${isMobile ? 'justify-around' : 'justify-center space-x-4'} p-2`}>
          <NavContent />
        </div>
      </motion.nav>
    </div>
  )
}

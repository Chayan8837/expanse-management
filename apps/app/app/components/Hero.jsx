'use client'

import { motion } from 'framer-motion'
import { ArrowRight, DollarSign, Users, SplitSquareVertical } from 'lucide-react'

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-4 py-16 bg-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 text-white"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Split Bills, Not Friendships
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8 text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          CashSplit makes group expenses easy and fair
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg">
            Get Started <ArrowRight className="ml-2" />
          </button>
        </motion.div>
      </motion.div>
      <motion.div
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        {[
          { icon: DollarSign, text: "Split bills instantly" },
          { icon: Users, text: "Manage group expenses" },
          { icon: SplitSquareVertical, text: "Fair share calculations" }
        ].map((item, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <item.icon className="w-12 h-12 mb-4 text-green-500" />
            <p className="text-lg text-white">{item.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

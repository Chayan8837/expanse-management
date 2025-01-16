'use client'

import { useRef, useEffect } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function Community() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const mainControls = useAnimation()

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible")
    }
  }, [isInView])

  return (
    <section ref={ref} className="py-16 px-4 bg-gray-800">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
        <p className="text-xl text-gray-300 mb-8">
          Connect with thousands of users who are simplifying their group finances with CashSplit.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
            Join Now <ArrowRight className="ml-2" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}

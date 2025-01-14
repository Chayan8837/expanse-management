'use client'

import { useRef, useEffect } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { Calculator, CreditCard, PieChart, Smartphone } from 'lucide-react'

const features = [
  {
    title: "Smart Expense Tracking",
    description: "Automatically categorize and track your group expenses with ease.",
    icon: Calculator,
  },
  {
    title: "Instant Settlements",
    description: "Settle debts quickly with integrated payment options.",
    icon: CreditCard,
  },
  {
    title: "Fair Share Algorithm",
    description: "Our advanced algorithm ensures everyone pays their fair share.",
    icon: PieChart,
  },
  {
    title: "Mobile App",
    description: "Access CashSplit on the go with our user-friendly mobile app.",
    icon: Smartphone,
  },
]

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const mainControls = useAnimation()

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible")
    }
  }, [isInView])

  return (
    <section ref={ref} className="py-16 px-4">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <h2 className="text-4xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-gray-800 border-gray-700 p-4 rounded-lg">
                <div className="flex flex-col items-center">
                  <feature.icon className="w-10 h-10 mb-4 text-green-500" />
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

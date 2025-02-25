"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { motion } from "framer-motion"

const Home = () => {
  const { user } = useAuth()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen">
      <motion.div
        className="max-w-3xl mx-auto text-center py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="text-5xl font-bold mb-6">
          Welcome to Car Park
        </motion.h1>
        <motion.p variants={itemVariants} className="text-xl mb-8 text-gray-300">
          The easiest way to buy and sell second-hand cars online
        </motion.p>

        <motion.div variants={itemVariants}>
          {user ? (
            <Link
              to="/cars"
              className="bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Browse Cars
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Get Started
            </Link>
          )}
        </motion.div>
      </motion.div>

      <div className="w-full py-12 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            How It Works
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                title: "Browse Cars",
                description: "Search our extensive catalog of quality second-hand cars",
                icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
              },
              {
                title: "Request to Purchase",
                description: "Find a car you like? Submit a request to purchase it",
                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                title: "Complete the Purchase",
                description: "Once approved, complete the transaction securely",
                icon: "M5 13l4 4L19 7",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-800 p-6 rounded-lg shadow-lg text-center"
              >
                <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Home


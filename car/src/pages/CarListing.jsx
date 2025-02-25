"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, addDoc } from "firebase/firestore"
import { db } from "../config/firebase"
import { useAuth } from "../contexts/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import * as Dialog from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"

const CarListing = () => {
  const [cars, setCars] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cars"))
        const carList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setCars(carList)
      } catch (error) {
        console.error("Error fetching cars:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  const filteredCars = cars.filter((car) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      car.make.toLowerCase().includes(searchLower) ||
      car.model.toLowerCase().includes(searchLower) ||
      car.year.toString().includes(searchLower) ||
      car.description.toLowerCase().includes(searchLower)
    )
  })

  const handleRequestPurchase = async (car) => {
    try {
      await addDoc(collection(db, "purchaseRequests"), {
        carId: car.id,
        userId: user.uid,
        userEmail: user.email,
        carDetails: `${car.make} ${car.model} (${car.year})`,
        price: car.price,
        status: "pending",
        createdAt: new Date().toISOString(),
      })

      alert("Purchase request submitted successfully!")
    } catch (error) {
      console.error("Error submitting purchase request:", error)
      alert("Failed to submit purchase request. Please try again.")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 bg-gray-900 text-white min-h-screen p-6"
    >
      <h1 className="text-4xl font-bold">Available Cars</h1>

      <div className="relative">
        <input
          type="text"
          placeholder="Search for make, model, or year..."
          className="w-full p-3 pl-10 border rounded-lg bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-white focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg
          className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="h-8 w-8 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </motion.svg>
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-400">No cars found matching your search.</p>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {filteredCars.map((car) => (
              <motion.div
                key={car.id}
                className="bg-gray-800 rounded-lg shadow overflow-hidden"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
                }}
              >
                <img
                  src={car.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "https://via.placeholder.com/300x200?text=Image+Error"
                  }}
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-1">
                    {car.make} {car.model}
                  </h2>
                  <p className="text-gray-400 mb-2">{car.year}</p>
                  <p className="text-lg font-semibold text-green-400 mb-2">${car.price}</p>
                  <p className="text-gray-300 mb-4 line-clamp-3">{car.description}</p>
                  <Dialog.Root>
                    <Dialog.Trigger asChild>
                      <button className="w-full bg-white text-black py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        Request to Purchase
                      </button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg w-96">
                        <Dialog.Title className="text-lg font-bold mb-4">Confirm Purchase Request</Dialog.Title>
                        <Dialog.Description className="text-gray-300 mb-4">
                          Are you sure you want to request to purchase this car?
                        </Dialog.Description>
                        <div className="flex justify-end space-x-2">
                          <Dialog.Close asChild>
                            <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors">
                              Cancel
                            </button>
                          </Dialog.Close>
                          <button
                            onClick={() => handleRequestPurchase(car)}
                            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
                          >
                            Confirm
                          </button>
                        </div>
                        <Dialog.Close asChild>
                          <button className="absolute top-2 right-2 text-gray-400 hover:text-white">
                            <Cross2Icon />
                          </button>
                        </Dialog.Close>
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  )
}

export default CarListing


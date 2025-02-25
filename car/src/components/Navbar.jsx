"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { motion } from "framer-motion"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { ChevronDownIcon } from "@radix-ui/react-icons"

const Navbar = () => {
  const { user, signOut, isAdmin } = useAuth()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black text-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              CarPark
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/cars" className="text-gray-300 hover:text-white transition-colors">
                  Cars
                </Link>

                {isAdmin && (
                  <Link to="/admin" className="text-gray-300 hover:text-white transition-colors">
                    Admin Dashboard
                  </Link>
                )}

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="flex items-center space-x-2 bg-gray-800 rounded-full px-3 py-1">
                      <span className="text-sm">{user.displayName || user.email}</span>
                      <ChevronDownIcon />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Content className="bg-gray-900 rounded-md p-2 mt-2">
                    <DropdownMenu.Item className="text-sm text-gray-300 hover:bg-gray-800 rounded px-2 py-1 cursor-pointer">
                      Profile
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="text-sm text-gray-300 hover:bg-gray-800 rounded px-2 py-1 cursor-pointer">
                      Settings
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="my-1 border-t border-gray-700" />
                    <DropdownMenu.Item
                      onSelect={signOut}
                      className="text-sm text-red-500 hover:bg-gray-800 rounded px-2 py-1 cursor-pointer"
                    >
                      Sign Out
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </>
            ) : (
              <Link to="/login" className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar


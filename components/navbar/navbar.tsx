"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import AvatarWithUserDropDown from "./avatarWithUserDropDown/avatarWithUserDropDown"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

const links = [
  { name: "ORIGINALS", href: "/" },
  { name: "CUSTOMS", href: "/customs" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { userInfo } = useSelector((state: RootState) => state.auth)
  console.log("userInfo", userInfo)

  return (
    <nav className="fixed top-6 left-1/2 z-50 w-[90%] max-w-6xl -translate-x-1/2">
      <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-6 py-4 shadow-xl backdrop-blur-xl">
        {/* Mobile button */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link href="/" className="text-lg font-bold tracking-widest">
          FLOW STATE
        </Link>

        {/* Desktop menu */}
        <div className="hidden gap-10 md:flex">
          {links.map((link) => (
            <motion.div key={link.name} whileHover="hover" className="relative">
              <Link
                href={link.href}
                className="text-sm font-medium text-black/60 transition hover:text-black"
              >
                {link.name}
              </Link>

              <motion.div
                variants={{
                  hover: { width: "100%" },
                  initial: { width: 0 },
                }}
                initial="initial"
                className="absolute -bottom-1 left-0 h-0.5 bg-white"
              />
            </motion.div>
          ))}
        </div>

        {userInfo ? (
          <AvatarWithUserDropDown />
        ) : (
          <button 
          className="hidden rounded-xl bg-white px-5 py-2 text-sm font-medium text-black transition hover:scale-105 md:block"
          onClick={() => window.location.href = "/login"}
          >
            Login / Sign Up
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 space-y-4 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl md:hidden"
        >
          {links.map((link) => (
            <Link key={link.name} href="/" className="block text-lg">
              {link.name}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  )
}

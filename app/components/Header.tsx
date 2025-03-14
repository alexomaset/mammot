'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white shadow-lg' 
        : 'bg-gradient-to-b from-black/80 via-black/50 to-transparent backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-28">
          {/* Logo */}
          <Link href="/" className="relative w-72 h-24 transition-transform hover:scale-105">
            <Image
              src={isScrolled ? "/logo.png" : "/logo.png"}
              alt="MAMOT Digital Marketing"
              fill
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`font-medium text-lg hover:text-blue-400 transition-colors ${
                isScrolled ? 'text-gray-800' : 'text-white'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/services" 
              className={`font-medium text-lg hover:text-blue-400 transition-colors ${
                isScrolled ? 'text-gray-800' : 'text-white'
              }`}
            >
              Services
            </Link>
            <Link 
              href="/about" 
              className={`font-medium text-lg hover:text-blue-400 transition-colors ${
                isScrolled ? 'text-gray-800' : 'text-white'
              }`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`font-medium text-lg hover:text-blue-400 transition-colors ${
                isScrolled ? 'text-gray-800' : 'text-white'
              }`}
            >
              Contact
            </Link>
            <Link
              href="/contact"
              className={`bg-blue-600 text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg ${
                isScrolled ? 'shadow-blue-600/30' : 'shadow-blue-500/50'
              }`}
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden ${isScrolled ? 'text-gray-800' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: isMobileMenuOpen ? 'auto' : 0 }}
          className="md:hidden overflow-hidden bg-white/95 backdrop-blur-sm"
        >
          <nav className="py-4 space-y-4">
            <Link
              href="/"
              className="block text-gray-800 hover:text-blue-600 transition-colors text-lg font-medium px-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/services"
              className="block text-gray-800 hover:text-blue-600 transition-colors text-lg font-medium px-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/case-studies"
              className="block text-gray-800 hover:text-blue-600 transition-colors text-lg font-medium px-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Case Studies
            </Link>
            <Link
              href="/about"
              className="block text-gray-800 hover:text-blue-600 transition-colors text-lg font-medium px-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-gray-800 hover:text-blue-600 transition-colors text-lg font-medium px-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="px-4 pb-2">
              <Link
                href="/contact"
                className="block bg-blue-600 text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-blue-700 transition-all text-center shadow-lg shadow-blue-600/30"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </nav>
        </motion.div>
      </div>
    </header>
  )
}
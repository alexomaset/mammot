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
        ? 'bg-earth-light shadow-lg' 
        : 'bg-gradient-to-b from-earth-bark/90 via-earth-brown/60 to-transparent backdrop-blur-sm'
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
              className={`font-medium text-lg hover:text-earth-terracotta transition-colors ${
                isScrolled ? 'text-earth-brown' : 'text-earth-light'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/services" 
              className={`font-medium text-lg hover:text-earth-terracotta transition-colors ${
                isScrolled ? 'text-earth-brown' : 'text-earth-light'
              }`}
            >
              Services
            </Link>
            <Link 
              href="/about" 
              className={`font-medium text-lg hover:text-earth-terracotta transition-colors ${
                isScrolled ? 'text-earth-brown' : 'text-earth-light'
              }`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`font-medium text-lg hover:text-earth-terracotta transition-colors ${
                isScrolled ? 'text-earth-brown' : 'text-earth-light'
              }`}
            >
              Contact
            </Link>
            <Link
              href="/contact"
              className="bg-[#6D412A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7d4c32] transition-all"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden ${isScrolled ? 'text-earth-brown' : 'text-earth-light'}`}
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
          className="md:hidden overflow-hidden bg-earth-light/95 backdrop-blur-sm"
        >
          <nav className="py-4 space-y-4">
            <Link
              href="/"
              className="block text-earth-clay hover:text-earth-terracotta transition-colors text-lg font-medium px-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/services"
              className="block text-earth-clay hover:text-earth-terracotta transition-colors text-lg font-medium px-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/case-studies"
              className="block text-earth-clay hover:text-earth-terracotta transition-colors text-lg font-medium px-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Case Studies
            </Link>
            <Link
              href="/about"
              className="block text-earth-clay hover:text-earth-terracotta transition-colors text-lg font-medium px-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-earth-clay hover:text-earth-terracotta transition-colors text-lg font-medium px-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="px-4 pb-2">
              <Link
                href="/contact"
                className="bg-[#6D412A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7d4c32] transition-all"
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
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { FaPlay, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa'
import Image from 'next/image'

export default function Hero() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Small delay to ensure component is mounted
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100);
    
    return () => clearTimeout(timer);
  }, [])

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying)
  }

  // Split text into lines for better visual hierarchy

  // Animation variants for the heading - Simplified for better reliability
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const lineVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center pt-24 md:pt-32">
      {/* Video Background with enhanced overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`absolute w-full h-full object-cover transition-opacity duration-500 ${
            isVideoPlaying ? 'opacity-100' : 'opacity-60'
          }`}
        >
          <source src="/mamot.MOV" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" /> {/* Enhanced gradient overlay */}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Main heading with more reliable animation */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              className="mb-8 md:mb-10"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative w-full max-w-2xl mx-auto lg:mx-0"
              >
                <Image
                  src="/logo.png"
                  alt="Mamot Logo"
                  width={450}
                  height={100}
                  className="w-60 h-200"
                  priority
                />
              </motion.div>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto lg:mx-0"
              style={{ 
                fontFamily: "'Montserrat', sans-serif",
                letterSpacing: "0.02em",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)"
              }}
            >
             Filling the gap in unforgattable digital storytelling. Turning moments into lasting memories.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <Link
                href="/contact"
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-600/30"
              >
                Join Our Journey
              </Link>
              <Link
                href="/content"
                className="border-2 border-white/80 backdrop-blur-sm bg-white/10 text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all hover:scale-105 shadow-lg"
              >
                Explore Content
              </Link>
            </motion.div>
            
            {/* Social Media Links with enhanced hover effects */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="flex items-center justify-center lg:justify-start gap-6"
            >
              <Link href="https://instagram.com" className="text-white hover:text-blue-400 transition-colors hover:scale-110 transform duration-200">
                <FaInstagram className="w-6 h-6" />
              </Link>
              <Link href="https://tiktok.com" className="text-white hover:text-blue-400 transition-colors hover:scale-110 transform duration-200">
                <FaTiktok className="w-6 h-6" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Content - Enhanced Video Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group shadow-2xl shadow-blue-900/20 border border-white/10"
            onClick={toggleVideo}
          >
            {/* Video Thumbnail */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 to-transparent z-10" />
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url("/video-thumbnail.jpg")' }}
            />
            
            {/* Play Button Overlay */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center z-20 bg-black/20 group-hover:bg-black/40 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="bg-blue-600 rounded-full p-6 text-white shadow-lg shadow-blue-500/40 group-hover:bg-blue-500 transition-colors duration-300"
              >
                <FaPlay className="w-8 h-8" />
              </motion.div>
            </motion.div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-xl font-semibold mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    What We Do
                  </h3>
                  <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to watch our story
                  </p>
                </div>
                <motion.div 
                  className="bg-white/10 rounded-full p-2 backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                >
                  <FaPlay className="w-4 h-4 text-white" />
                </motion.div>
              </div>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/50 transition-colors duration-300 rounded-2xl" />
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            onClick={toggleVideo}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative w-full max-w-4xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                autoPlay
                controls
                className="w-full rounded-lg shadow-2xl"
              >
                <source src="/mamot.MOV" type="video/mp4" />
              </video>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVideo();
                }}
                className="absolute -top-12 right-0 text-white hover:text-gray-300"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Font imports */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@400;600&display=swap');
      `}</style>
    </section>
  )
}
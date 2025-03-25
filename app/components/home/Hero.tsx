'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaPlay } from 'react-icons/fa'
import Image from 'next/image'

export default function Hero() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying)
  }

  return (
    <section className="relative min-h-screen flex items-center pt-16">
      {/* Video Background with simplified overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover opacity-70"
        >
          <source src="/mamot.MOV" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/70" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Content - Simplified */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Image
                src="/logo1.png"
                alt="Mamot Logo"
                width={450}
                height={100}
                className="w-64 h-auto mx-auto lg:mx-0"
                priority
              />
            </motion.div>
            
            {/* Tagline */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl text-gray-200 mb-6 max-w-lg mx-auto lg:mx-0"
            >
              Filling the gap in unforgettable digital storytelling. Turning moments into lasting memories.
            </motion.p>

            {/* Call to action buttons */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <Link
                href="/contact"
                className="bg-[#6D412A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7d4c32] transition-all"
              >
                Join Our Journey
              </Link>
              <Link
                href="/content"
                className="border border-white/80 bg-white/10 text-white px-6 py-3 rounded-full font-medium hover:bg-white/20 transition-all"
              >
                Explore Content
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Content - Simplified Video Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative aspect-video rounded-xl overflow-hidden cursor-pointer shadow-lg"
            onClick={toggleVideo}
          >
            {/* Video Thumbnail */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url("/video-thumbnail.jpg")' }}
            />
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-all">
              <div className="bg-blue-600 rounded-full p-4 text-white">
                <FaPlay className="w-6 h-6" />
              </div>
            </div>

            {/* Simple text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white text-sm">Click to watch our story</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal - Simplified */}
      {isVideoPlaying && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={toggleVideo}
        >
          <div 
            className="relative w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              autoPlay
              controls
              className="w-full rounded-lg"
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
          </div>
        </div>
      )}

      {/* Font imports */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');
      `}</style>
    </section>
  )
}
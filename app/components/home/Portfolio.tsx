'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaPlay, FaArrowRight } from 'react-icons/fa'

interface PortfolioItem {
  id: number
  title: string
  category: string
  videoUrl: string
  thumbnail: string
  description: string
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Adventure in Paradise",
    category: "Travel & Lifestyle",
    videoUrl: "/videos/portfolio-1.mp4",
    thumbnail: "/images/portfolio/thumb-1.jpg",
    description: "Exploring hidden beaches and tropical destinations"
  },
  {
    id: 2,
    title: "Urban Lifestyle",
    category: "City Life",
    videoUrl: "/videos/portfolio-2.mp4",
    thumbnail: "/images/portfolio/thumb-2.jpg",
    description: "Modern city living through a creative lens"
  },
  {
    id: 3,
    title: "Food Journey",
    category: "Culinary",
    videoUrl: "/videos/portfolio-3.mp4",
    thumbnail: "/images/portfolio/thumb-3.jpg",
    description: "Discovering unique flavors and cuisines"
  },
  {
    id: 4,
    title: "Cultural Experience",
    category: "Culture & Arts",
    videoUrl: "/videos/portfolio-4.mp4",
    thumbnail: "/images/portfolio/thumb-4.jpg",
    description: "Immersive cultural experiences and traditions"
  }
]

export default function Portfolio() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'Travel & Lifestyle', 'City Life', 'Culinary', 'Culture & Arts']

  const filteredItems = selectedCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory)

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Our Creative Portfolio
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Discover our collection of captivating stories and experiences
          </motion.p>
        </div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative rounded-2xl overflow-hidden shadow-xl bg-white"
            >
              {/* Video Container */}
              <div className="relative aspect-video cursor-pointer" onClick={() => setActiveVideo(item.id)}>
                {/* Thumbnail */}
                <div className="absolute inset-0 bg-gray-900">
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.thumbnail})` }}
                  />
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="bg-blue-600 rounded-full p-4 text-white shadow-lg"
                  >
                    <FaPlay className="w-6 h-6" />
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="text-blue-600 text-sm font-medium">{item.category}</span>
                <h3 className="text-xl font-bold mt-2 mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <button 
                  onClick={() => setActiveVideo(item.id)}
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Watch Video <FaArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Modal */}
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setActiveVideo(null)}
          >
            <div className="relative w-full max-w-4xl mx-auto">
              <video
                autoPlay
                controls
                className="w-full rounded-lg shadow-2xl"
              >
                <source src={portfolioItems.find(item => item.id === activeVideo)?.videoUrl} type="video/mp4" />
              </video>
              <button
                onClick={() => setActiveVideo(null)}
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
          </motion.div>
        )}
      </div>
    </section>
  )
} 
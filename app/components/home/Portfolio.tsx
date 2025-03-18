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
  tags: string[]
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Adventure in Paradise",
    category: "Travel & Lifestyle",
    videoUrl: "https://player.vimeo.com/external/368763065.sd.mp4?s=308c8c3688ac49b3b307c54f0fa2c894ff2accf2&profile_id=139&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
    description: "Exploring hidden beaches and tropical destinations",
    tags: ["travel", "nature", "adventure"]
  },
  {
    id: 2,
    title: "Urban Lifestyle",
    category: "City Life",
    videoUrl: "https://player.vimeo.com/external/449583221.sd.mp4?s=0dbff82591f986cd631ab79854b5dccd5a221020&profile_id=139&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1000&auto=format&fit=crop",
    description: "Modern city living through a creative lens",
    tags: ["urban", "lifestyle", "modern"]
  },
  {
    id: 3,
    title: "Food Journey",
    category: "Culinary",
    videoUrl: "https://player.vimeo.com/external/537834385.sd.mp4?s=d81025cb635d4d6e3fe137a5d5d11f5f18fd8e70&profile_id=165&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
    description: "Discovering unique flavors and cuisines",
    tags: ["food", "culture", "travel"]
  },
  {
    id: 4,
    title: "Cultural Experience",
    category: "Culture & Arts",
    videoUrl: "https://player.vimeo.com/external/403156711.sd.mp4?s=a4d05de553717fd889c058a93f4582557c109836&profile_id=139&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1000&auto=format&fit=crop",
    description: "Immersive cultural experiences and traditions",
    tags: ["culture", "arts", "tradition"]
  }
]

export default function Portfolio() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(false)

  const categories = ['all', 'Travel & Lifestyle', 'City Life', 'Culinary', 'Culture & Arts']

  const filteredItems = selectedCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory)

  return (
    <div className="py-20 bg-gray-50">
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
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              layout
              className="group relative rounded-2xl overflow-hidden shadow-xl bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Video Container */}
              <div className="relative aspect-video cursor-pointer" onClick={() => setActiveVideo(item.id)}>
                {/* Thumbnail */}
                <div className="absolute inset-0 bg-gray-900 transform transition-transform duration-300 group-hover:scale-105">
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.thumbnail})` }}
                  />
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 rounded-full p-4 text-white shadow-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaPlay className="w-6 h-6" />
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
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
        </motion.div>

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
                src={portfolioItems.find(item => item.id === activeVideo)?.videoUrl}
                onError={(e) => {
                  // Handle video loading error
                  console.error('Video loading error:', e);
                  // You could set a state here to show a fallback UI
                }}
              />
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
    </div>
  )
}
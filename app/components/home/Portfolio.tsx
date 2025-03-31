'use client'

import { useState, useEffect } from 'react'
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

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; url: string }>({
    isOpen: false,
    url: '',
  })

  // Placeholder data for development when API fails
  const placeholderItems: PortfolioItem[] = [
    {
      id: 1,
      title: "Adventure in Paradise",
      category: "Travel & Lifestyle",
      videoUrl: "https://player.vimeo.com/external/368763065.sd.mp4?s=308c8c3688ac49b3b307c54f0fa2c894ff2accf2&profile_id=139&oauth2_token_id=57447761",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
      description: "Exploring hidden beaches and tropical destinations",
      tags: ["travel", "nature", "adventure"],
    },
    {
      id: 2,
      title: "Urban Exploration",
      category: "Documentation",
      videoUrl: "https://player.vimeo.com/external/371839222.sd.mp4?s=28a7c342d227c246b0e6fe93121e3c4a72b00bad&profile_id=139&oauth2_token_id=57447761",
      thumbnail: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1000&auto=format&fit=crop",
      description: "Documenting city life and architecture",
      tags: ["urban", "architecture", "documentary"],
    }
  ]

  // Fetch portfolio items
  useEffect(() => {
    async function fetchPortfolioItems() {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/portfolio')
        
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio items')
        }
        
        const data = await response.json()
        
        // Use placeholder data if no items are returned (for development)
        if (data.length === 0 && process.env.NODE_ENV === 'development') {
          console.log('No portfolio items found. Using placeholder data for development.')
          setPortfolioItems(placeholderItems)
        } else {
          setPortfolioItems(data)
        }
      } catch (err) {
        console.error('Error fetching portfolio items:', err)
        setError('Failed to load portfolio items')
        
        // Use placeholder data on error in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Error fetching portfolio data. Using placeholder data for development.')
          setPortfolioItems(placeholderItems)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchPortfolioItems()
  }, [])

  // Extract unique categories from portfolio items
  const allCategories = portfolioItems.length > 0
    ? ['all', ...Array.from(new Set(portfolioItems.map(item => item.category)))]
    : ['all']

  const filteredItems = selectedCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory)

  return (
    <div id="portfolio" className="py-20 bg-gray-50">
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-earth-terracotta"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-earth-terracotta text-white rounded-lg hover:bg-earth-rust transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Category Filter */}
        {!isLoading && !error && portfolioItems.length > 0 && (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {allCategories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-earth-terracotta text-earth-light shadow-lg shadow-earth-terracotta/30'
                      : 'bg-earth-light text-earth-clay hover:bg-earth-beige'
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
                  className="group relative rounded-2xl overflow-hidden shadow-xl bg-earth-light hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Video Container */}
                  <div className="relative aspect-video cursor-pointer" onClick={() => setVideoModal({ isOpen: true, url: item.videoUrl })}>
                    {/* Thumbnail */}
                    <div className="absolute inset-0 bg-earth-soil transform transition-transform duration-300 group-hover:scale-105">
                      <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.thumbnail})` }}
                      />
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-earth-bark/30 group-hover:bg-earth-bark/50 transition-all">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-earth-terracotta rounded-full p-4 text-earth-light shadow-lg hover:bg-earth-rust transition-colors"
                      >
                        <FaPlay className="w-6 h-6" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.tags && item.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-blue-600 text-sm font-medium">{item.category}</span>
                    <h3 className="text-xl font-bold mt-2 mb-3">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <button 
                      onClick={() => setVideoModal({ isOpen: true, url: item.videoUrl })}
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                      Watch Video <FaArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && portfolioItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No portfolio items found</p>
          </div>
        )}

        {/* Video Modal */}
        {videoModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setVideoModal({ isOpen: false, url: '' })}
          >
            <div className="relative w-full max-w-4xl mx-auto">
              <video
                autoPlay
                controls
                className="w-full rounded-lg shadow-2xl"
                src={videoModal.url}
                onError={(e) => {
                  console.error('Video loading error:', e)
                  setError('Failed to load video. Please try again later.')
                  setVideoModal({ isOpen: false, url: '' })
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setVideoModal({ isOpen: false, url: '' })
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
          </motion.div>
        )}
      </div>
    </div>
  )
}
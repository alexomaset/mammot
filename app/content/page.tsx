'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { FaArrowLeft, FaPlay, FaFilter, FaSearch } from 'react-icons/fa'

// Content types
type ContentItem = {
  id: number
  title: string
  category: string
  thumbnail: string
  description: string
  videoUrl?: string
  date: string
}

// Sample content for initial display
const sampleContent: ContentItem[] = [
  {
    id: 1,
    title: "Coastal Adventure Series",
    category: "Travel",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
    description: "Experience the beauty of coastal landscapes through our cinematic journey.",
    videoUrl: "https://player.vimeo.com/external/368763065.sd.mp4?s=308c8c3688ac49b3b307c54f0fa2c894ff2accf2&profile_id=139&oauth2_token_id=57447761",
    date: "2023-12-15"
  },
  {
    id: 2,
    title: "Urban Storytelling",
    category: "Documentary",
    thumbnail: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1000&auto=format&fit=crop",
    description: "A visual exploration of city life and architecture through different perspectives.",
    videoUrl: "https://player.vimeo.com/external/371839222.sd.mp4?s=28a7c342d227c246b0e6fe93121e3c4a72b00bad&profile_id=139&oauth2_token_id=57447761",
    date: "2023-11-28"
  },
  {
    id: 3,
    title: "Cultural Heritage Stories",
    category: "Culture",
    thumbnail: "https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=1000&auto=format&fit=crop",
    description: "Celebrating traditions and cultural identities across different communities.",
    videoUrl: "https://player.vimeo.com/external/370467553.sd.mp4?s=32d525248a35c7f5d8222aa82a7e6e990408277a&profile_id=139&oauth2_token_id=57447761",
    date: "2023-10-10"
  },
  {
    id: 4,
    title: "Wildlife Encounters",
    category: "Nature",
    thumbnail: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=1000&auto=format&fit=crop",
    description: "Intimate moments with wildlife, showcasing the beauty of natural habitats.",
    videoUrl: "https://player.vimeo.com/external/370467476.sd.mp4?s=95ea4f3850688a18f6dcb39fbb9c4ea4f2e394b6&profile_id=139&oauth2_token_id=57447761",
    date: "2023-09-22"
  },
  {
    id: 5,
    title: "Culinary Journeys",
    category: "Food",
    thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop",
    description: "Exploring food cultures and culinary traditions from around the world.",
    videoUrl: "https://player.vimeo.com/external/371840394.sd.mp4?s=89d93e9facde32be20a00b5ea0bb9f69a8b393c0&profile_id=139&oauth2_token_id=57447761",
    date: "2023-08-14"
  },
  {
    id: 6,
    title: "Artisan Craft Stories",
    category: "Culture",
    thumbnail: "https://images.unsplash.com/photo-1459908676235-d5f02a50184b?q=80&w=1000&auto=format&fit=crop",
    description: "Documenting traditional craftsmanship and the stories behind handmade art.",
    videoUrl: "https://player.vimeo.com/external/370467581.sd.mp4?s=d329b061c137b15285aac14632cafa48eb5a1f83&profile_id=139&oauth2_token_id=57447761",
    date: "2023-07-30"
  }
]

// Categories for filtering
const categories = ["All", "Travel", "Documentary", "Culture", "Nature", "Food"]

export default function ContentPage() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; url: string }>({
    isOpen: false,
    url: '',
  })

  // Fetch portfolio data from API
  const fetchPortfolioData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/portfolio')
      if (response.ok) {
        const portfolioData = await response.json()
        // Convert portfolio items to content items
        const contentItems: ContentItem[] = portfolioData.map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          thumbnail: item.thumbnail,
          videoUrl: item.videoUrl,
          description: item.description || '',
          date: item.createdAt || new Date().toISOString().split('T')[0]
        }))
        setContent(contentItems)
      } else {
        console.error('Failed to fetch portfolio data')
        // Fallback to sample content if API fails
        setContent(sampleContent)
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error)
      // Fallback to sample content if API fails
      setContent(sampleContent)
    } finally {
      setIsLoading(false)
    }
  }

  // Load portfolio data on component mount
  useEffect(() => {
    fetchPortfolioData()
  }, [])

  // Filter content based on category and search term
  useEffect(() => {
    let result = content
    
    // Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter(item => item.category === selectedCategory)
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term)
      )
    }
    
    setFilteredContent(result)
  }, [selectedCategory, searchTerm, content])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  // Open video modal
  const openVideoModal = (videoUrl: string) => {
    if (videoUrl) {
      setVideoModal({
        isOpen: true,
        url: videoUrl
      })
    }
  }

  // Close video modal
  const closeVideoModal = () => {
    setVideoModal({
      isOpen: false,
      url: ''
    })
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#f8f5f2] to-[#f0e9e4]">
      <div className="container mx-auto px-4">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-[#6D412A] transition-colors mb-8">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Content</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of stories, documentaries, and visual journeys
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Search */}
            <div className="w-full md:w-1/2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search content..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6D412A] transition-colors"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {/* Filter */}
            <div className="w-full md:w-auto">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-gray-600">Filter by:</span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-4 py-2 rounded-full transition-colors ${
                        selectedCategory === category
                          ? 'bg-[#6D412A] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="w-full md:w-auto">
              <button
                onClick={fetchPortfolioData}
                disabled={isLoading}
                className="w-full md:w-auto bg-[#6D412A] text-white px-4 py-2 rounded-lg hover:bg-[#5A3422] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <p className="text-xl text-gray-600">Loading content...</p>
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <p className="text-xl text-gray-600">No content found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory("All")
                setSearchTerm("")
              }}
              className="mt-4 inline-block bg-[#6D412A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7d4c32] transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredContent.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Thumbnail */}
                <div 
                  className="relative aspect-video cursor-pointer group"
                  onClick={() => item.videoUrl && openVideoModal(item.videoUrl)}
                >
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // If image fails to load, set a fallback
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite callback loop
                      target.src = "https://via.placeholder.com/640x360.png?text=Image+Unavailable";
                    }}
                    unoptimized={true} // This helps with some external image issues
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    {item.videoUrl && (
                      <div className="bg-[#6D412A] rounded-full p-4 text-white">
                        <FaPlay className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-[#6D412A] text-white text-xs font-medium px-3 py-1 rounded-full">
                    {item.category}
                  </div>
                </div>
                
                {/* Content Details */}
                <div className="p-6">
                  <div className="text-gray-500 text-sm mb-2">{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  
                  {item.videoUrl && (
                    <button
                      onClick={() => openVideoModal(item.videoUrl!)}
                      className="inline-flex items-center text-[#6D412A] font-medium hover:text-[#7d4c32] transition-colors"
                    >
                      <FaPlay className="mr-2 w-4 h-4" /> Watch Now
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Video Modal */}
        {videoModal.isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={closeVideoModal}
          >
            <div className="relative w-full max-w-4xl mx-auto">
              <video
                autoPlay
                controls
                className="w-full rounded-lg shadow-2xl"
                src={videoModal.url}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  closeVideoModal()
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
      </div>
    </main>
  )
}
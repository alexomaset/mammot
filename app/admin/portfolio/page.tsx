'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaEye, FaUpload, FaTimes, FaCheck, FaSpinner, FaVideo, FaImage } from 'react-icons/fa'
import { upload } from '@vercel/blob/client'

interface PortfolioItem {
  id: number
  title: string
  category: string
  videoUrl: string
  thumbnail: string
  description: string
  tags: string[]
  createdAt?: string
  updatedAt?: string
}

// Predefined categories with default thumbnails
const CATEGORIES = [
  {
    name: 'Travel and Hospitality',
    thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1280&h=720&fit=crop'
  },
  {
    name: 'Education and Wellness',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1280&h=720&fit=crop'
  },
  {
    name: 'Events',
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1280&h=720&fit=crop'
  },
  {
    name: 'Media and Brands',
    thumbnail: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1280&h=720&fit=crop'
  },
  {
    name: 'Lifestyle',
    thumbnail: 'https://images.unsplash.com/photo-1513094735237-8f2714d57c13?w=1280&h=720&fit=crop'
  }
]

const emptyItem: Omit<PortfolioItem, 'id'> = {
  title: '',
  category: '',
  videoUrl: '',
  thumbnail: '',
  description: '',
  tags: []
}

export default function AdminPortfolio() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [editingItem, setEditingItem] = useState<Partial<PortfolioItem> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [tagInput, setTagInput] = useState('')
  
  // Upload states
  const [isUploading, setIsUploading] = useState({
    video: false,
    image: false
  })
  const [uploadProgress, setUploadProgress] = useState({
    video: 0,
    image: 0
  })
  const [uploadError, setUploadError] = useState({
    video: '',
    image: ''
  })
  
  // File input refs
  const videoInputRef = useRef<HTMLInputElement>(null)

  // Fetch portfolio items
  const fetchPortfolioItems = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/portfolio')
      
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio items')
      }
      
      const data = await response.json()
      setPortfolioItems(data)
    } catch (err) {
      console.error('Error fetching portfolio items:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPortfolioItems()
  }, [])

  // Handle file upload - Client-side upload to Vercel Blob
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'image') => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Reset error state
      setUploadError(prev => ({ ...prev, [type]: '' }))

      // Set uploading state
      setIsUploading(prev => ({ ...prev, [type]: true }))
      setUploadProgress(prev => ({ ...prev, [type]: 0 }))

      // Generate filename
      const timestamp = Date.now()
      const fileExt = file.name.split('.').pop()?.toLowerCase() || ''
      const fileNameBase = file.name.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_')
      const filename = `${type}s/${timestamp}-${fileNameBase}.${fileExt}`

      // Upload directly to Vercel Blob using client-side upload
      const blob = await upload(filename, file, {
        access: 'public',
        handleUploadUrl: '/api/upload-url',
        onUploadProgress: (progress) => {
          const percentage = Math.round((progress.loaded / progress.total) * 100)
          setUploadProgress(prev => ({ ...prev, [type]: percentage }))
        },
      })

      // Update the form with the uploaded file URL
      if (type === 'video') {
        setEditingItem(prev => prev ? { ...prev, videoUrl: blob.url } : null)
      } else {
        setEditingItem(prev => prev ? { ...prev, thumbnail: blob.url } : null)
      }

      // Reset upload state
      setIsUploading(prev => ({ ...prev, [type]: false }))
      setUploadProgress(prev => ({ ...prev, [type]: 100 }))

      // Show success message
      setSuccessMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`)
      setTimeout(() => setSuccessMessage(null), 3000)

    } catch (error) {
      console.error(`Error uploading ${type}:`, error)
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadError(prev => ({ ...prev, [type]: errorMessage }))
      setIsUploading(prev => ({ ...prev, [type]: false }))
    }
  }

  // Create new portfolio item
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return
    
    try {
      setIsSubmitting(true)
      setFormError(null)
      
      // Validate required fields
      if (!editingItem.title || !editingItem.videoUrl || !editingItem.thumbnail || !editingItem.category) {
        setFormError('Please fill in all required fields')
        return
      }
      
      const method = editingItem.id ? 'PUT' : 'POST'
      const response = await fetch('/api/portfolio', {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingItem)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save portfolio item')
      }
      
      // Success
      setSuccessMessage(`Portfolio item ${editingItem.id ? 'updated' : 'created'} successfully`)
      setShowForm(false)
      setEditingItem(null)
      fetchPortfolioItems()
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
      
    } catch (err: any) {
      console.error('Error saving portfolio item:', err)
      setFormError(err.message || 'Failed to save portfolio item')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete portfolio item
  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/portfolio?id=${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete portfolio item')
      }
      
      // Success
      setSuccessMessage('Portfolio item deleted successfully')
      fetchPortfolioItems()
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
      
    } catch (err) {
      console.error('Error deleting portfolio item:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle category change - automatically set thumbnail
  const handleCategoryChange = (category: string) => {
    const selectedCategory = CATEGORIES.find(cat => cat.name === category)
    setEditingItem({
      ...editingItem,
      category: category,
      thumbnail: selectedCategory?.thumbnail || ''
    })
  }

  // Handle tag management
  const handleAddTag = () => {
    if (!tagInput.trim() || !editingItem) return

    setEditingItem({
      ...editingItem,
      tags: [...(editingItem.tags || []), tagInput.trim()]
    })

    setTagInput('')
  }

  const handleRemoveTag = (index: number) => {
    if (!editingItem) return

    const newTags = [...(editingItem.tags || [])]
    newTags.splice(index, 1)

    setEditingItem({
      ...editingItem,
      tags: newTags
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Portfolio Management</h1>
          
          <div className="flex gap-3">
            <button 
              onClick={async () => {
                try {
                  const response = await fetch('/api/auth/logout', { method: 'POST' });
                  if (response.ok) {
                    window.location.href = '/admin/login';
                  }
                } catch (error) {
                  console.error('Logout error:', error);
                }
              }}
              className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition-colors"
            >
              <FaTimes /> Logout
            </button>
            
            <button 
              onClick={() => {
                setEditingItem({...emptyItem})
                setShowForm(true)
                setFormError(null)
              }}
              className="bg-[#6D412A] text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-[#7d4c32] transition-colors"
            >
              <FaPlus /> Add New Item
            </button>
          </div>
        </div>
        
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
            <FaCheck /> {successMessage}
          </div>
        )}
        
        {/* Item Form - Fixed with higher z-index and top padding */}
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-black/50 flex items-start justify-center pt-24 px-4 overflow-y-auto z-[100]"
          >
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl mb-10 relative">
              <div className="sticky top-0 bg-white rounded-t-xl z-10">
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-xl font-bold">
                    {editingItem?.id ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
                  </h2>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {formError && (
                  <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                    {formError}
                  </div>
                )}
                
                <form onSubmit={handleAddItem} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editingItem?.title || ''}
                        onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6D412A] focus:border-transparent"
                        placeholder="Enter title"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={editingItem?.category || ''}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6D412A] focus:border-transparent"
                        required
                      >
                        <option value="">Select a category...</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat.name} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {editingItem?.category && (
                        <p className="mt-1 text-xs text-gray-500">
                          Thumbnail: {CATEGORIES.find(c => c.name === editingItem.category)?.thumbnail}
                        </p>
                      )}
                    </div>
                    
                    {/* Video Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Video <span className="text-red-500">*</span>
                      </label>
                      
                      <div className="space-y-2">
                        {/* Current Video URL Display */}
                        {editingItem?.videoUrl && (
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm">
                            <FaVideo className="text-[#6D412A]" />
                            <span className="truncate flex-1">
                              {editingItem.videoUrl.startsWith('/uploads') 
                                ? editingItem.videoUrl.split('/').pop() 
                                : editingItem.videoUrl}
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditingItem({...editingItem, videoUrl: ''})}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <FaTimes size={14} />
                            </button>
                          </div>
                        )}
                        
                        {/* Upload UI */}
                        {!editingItem?.videoUrl && (
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <input
                                type="url"
                                value={editingItem?.videoUrl || ''}
                                onChange={(e) => setEditingItem({...editingItem, videoUrl: e.target.value})}
                                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6D412A] focus:border-transparent"
                                placeholder="Enter video URL"
                              />
                              
                              <div className="relative">
                                <input
                                  ref={videoInputRef}
                                  type="file"
                                  className="sr-only"
                                  accept="video/*"
                                  onChange={(e) => handleFileUpload(e, 'video')}
                                  disabled={isUploading.video}
                                />
                                <button
                                  type="button"
                                  onClick={() => videoInputRef.current?.click()}
                                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1"
                                  disabled={isUploading.video}
                                >
                                  {isUploading.video ? <FaSpinner className="animate-spin" /> : <FaUpload />} 
                                  Upload
                                </button>
                              </div>
                            </div>
                            
                            {/* Upload Progress */}
                            {isUploading.video && (
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-[#6D412A] h-2.5 rounded-full" 
                                  style={{ width: `${uploadProgress.video}%` }}
                                ></div>
                              </div>
                            )}
                            
                            {/* Upload Error */}
                            {uploadError.video && (
                              <p className="text-red-500 text-sm">{uploadError.video}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Thumbnail Preview (Auto-assigned based on category) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thumbnail Preview
                      </label>

                      <div className="space-y-2">
                        {editingItem?.thumbnail ? (
                          <div className="flex items-center gap-3">
                            <div className="h-20 w-32 bg-gray-200 rounded overflow-hidden border-2 border-gray-300">
                              <img
                                src={editingItem.thumbnail}
                                alt="Category Thumbnail"
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/200x120?text=Thumbnail'
                                }}
                              />
                            </div>
                            <div className="text-sm text-gray-600">
                              <FaImage className="inline mr-1" />
                              Auto-assigned for "{editingItem.category}"
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                            <FaImage className="mx-auto text-gray-400 text-2xl mb-2" />
                            <p className="text-sm text-gray-500">
                              Select a category to see the thumbnail
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editingItem?.description || ''}
                      onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6D412A] focus:border-transparent"
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editingItem?.tags?.map((tag, index) => (
                        <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                          <span>{tag}</span>
                          <button 
                            type="button"
                            onClick={() => handleRemoveTag(index)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-[#6D412A] focus:border-transparent"
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="bg-gray-200 px-4 py-2 rounded-r-lg hover:bg-gray-300 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#6D412A] text-white px-6 py-2 rounded-lg hover:bg-[#7d4c32] transition-colors flex items-center gap-2"
                      disabled={isSubmitting || isUploading.video || isUploading.image}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaCheck /> Save
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Loading State */}
        {isLoading && !showForm && (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D412A]"></div>
          </div>
        )}
        
        {/* Portfolio Items */}
        {!isLoading && portfolioItems.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-gray-500">No portfolio items found. Click "Add New Item" to create one.</p>
          </div>
        )}
        
        {!isLoading && portfolioItems.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thumbnail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {portfolioItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-12 w-20 bg-gray-200 rounded overflow-hidden">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image'
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {item.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt || '').toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            const url = item.videoUrl.startsWith('http') 
                              ? item.videoUrl 
                              : `${window.location.origin}${item.videoUrl}`;
                            window.open(url, '_blank');
                          }}
                          className="text-gray-600 hover:text-gray-900"
                          title="Preview"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => {
                            setEditingItem(item)
                            setShowForm(true)
                            setFormError(null)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
} 
'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { FaLock, FaUser, FaSpinner } from 'react-icons/fa'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if there's an existing valid token on load
    const checkExistingToken = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        if (response.ok) {
          // Token is valid, redirect to portfolio
          router.push('/admin/portfolio');
        }
      } catch (error) {
        // Token validation failed, but that's okay - stay on login page
        console.log('No valid session found');
      }
    };
    
    checkExistingToken();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      setError('Please enter both username and password')
      return
    }
    
    try {
      setIsLoading(true)
      setError('')
      
      // Convert credentials to base64 for basic auth
      const credentials = btoa(`${username}:${password}`)
      
      // Call the authentication endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credentials }),
      })
      
      if (response.ok) {
        // Redirect to admin dashboard upon successful login
        router.push('/admin/portfolio')
      } else {
        const data = await response.json()
        setError(data.message || 'Invalid username or password')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred during login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        {/* Header with logo */}
        <div className="bg-[#6D412A] p-6 text-center">
          <div className="mb-2 flex justify-center">
            <Image 
              src="/logo1.png" 
              alt="Mamot Logo" 
              width={180} 
              height={50} 
              className="h-auto"
            />
          </div>
          <h1 className="text-white text-xl font-medium">Admin Portal</h1>
        </div>
        
        <div className="p-8">
          <h2 className="text-[#6D412A] text-2xl font-bold mb-6 text-center">Sign In</h2>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6D412A] focus:border-transparent"
                  placeholder="Enter your username"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6D412A] focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6D412A] hover:bg-[#7d4c32] text-white py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-gray-600">
            <Link href="/" className="text-[#6D412A] hover:underline">
              Return to Website
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 
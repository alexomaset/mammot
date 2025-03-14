'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    budget: '',
    message: '',
  })
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('submitting')
    
    try {
      // In a real app, you would send the form data to your API here
      await new Promise(resolve => setTimeout(resolve, 1500))
      setFormStatus('success')
      setFormData({ name: '', email: '', company: '', service: '', budget: '', message: '' })
    } catch (error) {
      setFormStatus('error')
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/30" />
        <div className="container relative z-10 mx-auto px-4 h-full flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Let's Grow Your Business</h1>
          <p className="text-xl">Get in touch with our digital marketing experts</p>
        </div>
      </div>

      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <FaEnvelope className="text-3xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600">contact@mamotdigital.com</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <FaPhone className="text-3xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <FaMapMarkerAlt className="text-3xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-600">123 Digital Street, Tech City</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Your Project</h2>
              <p className="text-xl text-gray-600">
                Tell us about your business and goals, and we'll create a custom digital marketing strategy for you.
              </p>
            </div>

            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="company" className="block text-gray-700 font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                  <label htmlFor="service" className="block text-gray-700 font-medium mb-2">Service Needed</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">Select a service</option>
                    <option value="SEO">Search Engine Optimization</option>
                    <option value="Social Media">Social Media Marketing</option>
                    <option value="Content">Content Marketing</option>
                    <option value="PPC">Pay-Per-Click Advertising</option>
                    <option value="Email">Email Marketing</option>
                    <option value="Web Design">Web Design & Development</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="budget" className="block text-gray-700 font-medium mb-2">Monthly Budget</label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">Select your budget</option>
                  <option value="1000-2000">$1,000 - $2,000</option>
                  <option value="2000-5000">$2,000 - $5,000</option>
                  <option value="5000-10000">$5,000 - $10,000</option>
                  <option value="10000+">$10,000+</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Project Details</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us about your business goals and what you'd like to achieve..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 disabled:bg-gray-400"
              >
                {formStatus === 'submitting' ? 'Sending...' : 'Get Started'}
              </button>

              {formStatus === 'success' && (
                <p className="mt-4 text-green-600 text-center font-medium">
                  Thank you for your interest! We'll contact you within 24 hours to discuss your project.
                </p>
              )}

              {formStatus === 'error' && (
                <p className="mt-4 text-red-600 text-center font-medium">
                  There was an error sending your message. Please try again or contact us directly.
                </p>
              )}
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  )
}
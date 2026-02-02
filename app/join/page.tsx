'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaCheck, FaVideo, FaCamera, FaPalette, FaUsers, FaChartLine, FaTimes } from 'react-icons/fa'

// Available project types
const projectTypes = [
  { id: 'social', name: 'Social Media Management', icon: <FaUsers className="w-5 h-5" /> },
  { id: 'video', name: 'Video Editing', icon: <FaVideo className="w-5 h-5" /> },
  { id: 'photo', name: 'Photography', icon: <FaCamera className="w-5 h-5" /> },
  { id: 'design', name: 'Graphic Design', icon: <FaPalette className="w-5 h-5" /> },
  { id: 'marketing', name: 'Digital Marketing', icon: <FaChartLine className="w-5 h-5" /> },
]

const budgetOptions = [
  'Under $1,000',
  '$1,000 - $3,000',
  '$3,000 - $5,000',
  '$5,000 - $10,000',
  'Over $10,000',
  'Not sure yet'
]

const timelineOptions = [
  'Less than a month',
  '1-3 months',
  '3-6 months',
  'More than 6 months',
  'Ongoing support',
  'Not sure yet'
]

type FormData = {
  fullName: string
  email: string
  phone: string
  companyName: string
  projectType: string[]
  projectDescription: string
  budget: string
  timeline: string
  hearAboutUs: string
  additionalInfo: string
}

export default function JoinPage() {
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    projectType: [],
    projectDescription: '',
    budget: '',
    timeline: '',
    hearAboutUs: '',
    additionalInfo: ''
  })

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleProjectTypeChange = (type: string) => {
    setFormData(prev => {
      const current = [...prev.projectType]
      if (current.includes(type)) {
        return { ...prev, projectType: current.filter(t => t !== type) }
      }
      return { ...prev, projectType: [...current, type] }
    })
    if (errors.projectType) setErrors(prev => ({ ...prev, projectType: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    const newErrors: Record<string, string> = {}
    if (!formData.fullName) newErrors.fullName = 'Name is required'
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required'
    if (formData.projectType.length === 0) newErrors.projectType = 'Please select at least one service'
    if (!formData.projectDescription) newErrors.projectDescription = 'Please describe your project'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setFormStatus('submitting')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to send')

      setFormStatus('success')
      setTimeout(() => router.push('/'), 5000)
    } catch {
      setFormStatus('error')
    }
  }

  if (formStatus === 'success') {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#f8f5f2] to-[#f0e9e4]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-10 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <FaCheck className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Thank You!</h2>
            <p className="text-lg mb-4">Your submission has been received successfully.</p>
            <p className="text-gray-600">We&apos;ll be in touch shortly to discuss your project.</p>
            <p className="mt-6 text-sm text-gray-500">Redirecting to home page...</p>
          </div>
        </div>
      </main>
    )
  }

  if (formStatus === 'error') {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#f8f5f2] to-[#f0e9e4]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-10 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <FaTimes className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Oops!</h2>
            <p className="text-lg mb-8">Something went wrong. Please try again.</p>
            <button
              onClick={() => setFormStatus('idle')}
              className="bg-[#6D412A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7d4c32] transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#f8f5f2] to-[#f0e9e4]">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-[#6D412A] transition-colors mb-8">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get Started</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us about your project and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-[#6D412A]">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#6D412A] focus:border-transparent`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#6D412A] focus:border-transparent`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#6D412A] focus:border-transparent`}
                    placeholder="+254 700 123 456"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Company/Organization (optional)
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6D412A] focus:border-transparent"
                    placeholder="Acme Inc."
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Services */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-[#6D412A]">Services Interested In</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectTypes.map(type => (
                  <div
                    key={type.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.projectType.includes(type.id)
                        ? 'border-[#6D412A] bg-[#6D412A]/10'
                        : 'border-gray-200 hover:border-[#6D412A]/50'
                    }`}
                    onClick={() => handleProjectTypeChange(type.id)}
                  >
                    <div className="flex items-center">
                      <div className={`mr-3 ${formData.projectType.includes(type.id) ? 'text-[#6D412A]' : 'text-gray-500'}`}>
                        {type.icon}
                      </div>
                      <span className={formData.projectType.includes(type.id) ? 'text-[#6D412A] font-medium' : ''}>
                        {type.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {errors.projectType && <p className="mt-2 text-sm text-red-500">{errors.projectType}</p>}
            </div>

            {/* Project Description */}
            <div>
              <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Tell us about your project <span className="text-red-500">*</span>
              </label>
              <textarea
                id="projectDescription"
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border ${errors.projectDescription ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#6D412A] focus:border-transparent`}
                placeholder="Describe your project goals, target audience, and any specific requirements..."
              />
              {errors.projectDescription && <p className="mt-1 text-sm text-red-500">{errors.projectDescription}</p>}
            </div>

            <hr className="border-gray-200" />

            {/* Budget & Timeline */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-[#6D412A]">Budget & Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                    Approximate Budget
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6D412A] focus:border-transparent"
                  >
                    <option value="">Select a budget range</option>
                    {budgetOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6D412A] focus:border-transparent"
                  >
                    <option value="">Select a timeline</option>
                    {timelineOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Additional Info */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-[#6D412A]">Additional Information</h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="hearAboutUs" className="block text-sm font-medium text-gray-700 mb-1">
                    How did you hear about us?
                  </label>
                  <select
                    id="hearAboutUs"
                    name="hearAboutUs"
                    value={formData.hearAboutUs}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6D412A] focus:border-transparent"
                  >
                    <option value="">Select an option</option>
                    <option value="search">Search Engine (Google, Bing, etc.)</option>
                    <option value="social">Social Media</option>
                    <option value="referral">Referral from Friend/Colleague</option>
                    <option value="advertisement">Advertisement</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                    Anything else you&apos;d like to share?
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6D412A] focus:border-transparent"
                    placeholder="Any additional details..."
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="w-full bg-[#6D412A] text-white py-4 rounded-full font-semibold text-lg hover:bg-[#7d4c32] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {formStatus === 'submitting' ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Sending...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  )
}

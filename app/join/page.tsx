'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FaArrowLeft, FaArrowRight, FaCheck, FaVideo, FaCamera, FaPalette, FaUsers, FaChartLine, FaTimes } from 'react-icons/fa'

// Types for form data
type FormData = {
  step: number;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  projectType: string[];
  projectDescription: string;
  budget: string;
  timeline: string;
  hearAboutUs: string;
  additionalInfo: string;
}

// Available project types
const projectTypes = [
  { id: 'social', name: 'Social Media Management', icon: <FaUsers className="w-5 h-5" /> },
  { id: 'video', name: 'Video Editing', icon: <FaVideo className="w-5 h-5" /> },
  { id: 'photo', name: 'Photography', icon: <FaCamera className="w-5 h-5" /> },
  { id: 'design', name: 'Graphic Design', icon: <FaPalette className="w-5 h-5" /> },
  { id: 'marketing', name: 'Digital Marketing', icon: <FaChartLine className="w-5 h-5" /> },
]

// Budget options
const budgetOptions = [
  'Under $1,000',
  '$1,000 - $3,000',
  '$3,000 - $5,000',
  '$5,000 - $10,000',
  'Over $10,000',
  'Not sure yet'
]

// Timeline options
const timelineOptions = [
  'Less than a month',
  '1-3 months',
  '3-6 months',
  'More than 6 months',
  'Ongoing support',
  'Not sure yet'
]

export default function JoinPage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Initialize form data
  const [formData, setFormData] = useState<FormData>({
    step: 1,
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
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handle checkbox changes for project types
  const handleProjectTypeChange = (type: string) => {
    setFormData(prev => {
      const currentTypes = [...prev.projectType]
      
      if (currentTypes.includes(type)) {
        return {
          ...prev,
          projectType: currentTypes.filter(t => t !== type)
        }
      } else {
        return {
          ...prev,
          projectType: [...currentTypes, type]
        }
      }
    })
  }
  
  // Handle form navigation
  const nextStep = () => {
    // Basic validation
    const newErrors: Record<string, string> = {}
    
    if (formData.step === 1) {
      if (!formData.fullName) newErrors.fullName = 'Name is required'
      if (!formData.email) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid'
      }
      if (!formData.phone) newErrors.phone = 'Phone number is required'
    } else if (formData.step === 2) {
      if (formData.projectType.length === 0) newErrors.projectType = 'Please select at least one project type'
      if (!formData.projectDescription) newErrors.projectDescription = 'Please provide a brief description'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setErrors({})
    setFormData(prev => ({
      ...prev,
      step: prev.step + 1
    }))
  }
  
  const prevStep = () => {
    setFormData(prev => ({
      ...prev,
      step: prev.step - 1
    }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('submitting')
    
    try {
      // Here you would normally send the data to your backend
      // For now, we'll simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setFormStatus('success')
      
      // Reset form after successful submission
      setTimeout(() => {
        router.push('/')
      }, 5000)
    } catch (error) {
      setFormStatus('error')
    }
  }
  
  // Render progress indicators
  const renderProgress = () => {
    const steps = [
      { number: 1, label: 'Contact Info' },
      { number: 2, label: 'Project Details' },
      { number: 3, label: 'Budget & Timeline' },
      { number: 4, label: 'Additional Info' }
    ]
    
    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              {/* Step circle */}
              <div 
                className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${
                  formData.step >= step.number 
                    ? 'bg-[#6D412A] text-white border-[#6D412A]' 
                    : 'border-gray-300 text-gray-300'
                }`}
              >
                {formData.step > step.number ? <FaCheck /> : step.number}
              </div>
              
              {/* Step label */}
              <div className={`ml-2 ${index < steps.length - 1 ? 'mr-6' : ''} text-sm font-medium ${
                formData.step >= step.number 
                  ? 'text-[#6D412A]' 
                  : 'text-gray-500'
              }`}>
                {step.label}
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  formData.step > step.number 
                    ? 'bg-[#6D412A]' 
                    : 'bg-gray-300'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  // Render different form steps
  const renderFormStep = () => {
    switch (formData.step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            
            <div className="space-y-6">
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
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>
              
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Company/Organization Name (optional)
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
          </motion.div>
        )
        
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-6">Project Details</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What type of services are you interested in? <span className="text-red-500">*</span>
                </label>
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
                        <div className={`mr-3 ${
                          formData.projectType.includes(type.id)
                            ? 'text-[#6D412A]'
                            : 'text-gray-500'
                        }`}>
                          {type.icon}
                        </div>
                        <span className={formData.projectType.includes(type.id) ? 'text-[#6D412A] font-medium' : ''}>
                          {type.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.projectType && <p className="mt-1 text-sm text-red-500">{errors.projectType}</p>}
              </div>
              
              <div>
                <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Tell us about your project <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="projectDescription"
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.projectDescription ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#6D412A] focus:border-transparent`}
                  placeholder="Describe your project goals, target audience, and any specific requirements..."
                ></textarea>
                {errors.projectDescription && <p className="mt-1 text-sm text-red-500">{errors.projectDescription}</p>}
              </div>
            </div>
          </motion.div>
        )
        
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-6">Budget & Timeline</h3>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                  What's your approximate budget?
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6D412A] focus:border-transparent"
                >
                  <option value="" disabled>Select a budget range</option>
                  {budgetOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-1">
                  What's your estimated timeline?
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6D412A] focus:border-transparent"
                >
                  <option value="" disabled>Select a timeline</option>
                  {timelineOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )
        
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-6">Additional Information</h3>
            
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
                  <option value="" disabled>Select an option</option>
                  <option value="search">Search Engine (Google, Bing, etc.)</option>
                  <option value="social">Social Media</option>
                  <option value="referral">Referral from Friend/Colleague</option>
                  <option value="advertisement">Advertisement</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                  Is there anything else you'd like to share?
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6D412A] focus:border-transparent"
                  placeholder="Any additional details that might help us understand your needs better..."
                ></textarea>
              </div>
            </div>
          </motion.div>
        )
        
      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            {formStatus === 'submitting' && (
              <div className="py-10">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#6D412A] mx-auto mb-6"></div>
                <p className="text-lg">Submitting your information...</p>
              </div>
            )}
            
            {formStatus === 'success' && (
              <div className="py-10">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <FaCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                <p className="text-lg mb-8">Your submission has been received successfully.</p>
                <p>We'll be in touch with you shortly to discuss your project.</p>
                <p className="mt-6 text-sm text-gray-500">You'll be redirected to the home page in a few seconds...</p>
              </div>
            )}
            
            {formStatus === 'error' && (
              <div className="py-10">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <FaTimes className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Oops!</h3>
                <p className="text-lg mb-8">Something went wrong while submitting your form.</p>
                <button
                  onClick={() => setFormStatus('idle')}
                  className="bg-[#6D412A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7d4c32] transition-all"
                >
                  Try Again
                </button>
              </div>
            )}
          </motion.div>
        )
        
      default:
        return null
    }
  }
  
  // Navigation buttons
  const renderNavButtons = () => {
    if (formData.step === 5) return null
    
    return (
      <div className="flex justify-between mt-10">
        {formData.step > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-all"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
        )}
        
        {formData.step < 4 ? (
          <button
            type="button"
            onClick={nextStep}
            className="ml-auto flex items-center bg-[#6D412A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7d4c32] transition-all"
          >
            Next <FaArrowRight className="ml-2" />
          </button>
        ) : (
          <button
            type="submit"
            onClick={handleSubmit}
            className="ml-auto flex items-center bg-[#6D412A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7d4c32] transition-all"
          >
            Submit
          </button>
        )}
      </div>
    )
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Journey</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us about your project needs and let's create something amazing together.
          </p>
        </div>
        
        {/* Form Container */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10">
          {/* Progress Indicators */}
          {renderProgress()}
          
          <form onSubmit={(e) => e.preventDefault()} className="mt-8">
            {/* Form Steps */}
            {renderFormStep()}
            
            {/* Navigation Buttons */}
            {renderNavButtons()}
          </form>
        </div>
      </div>
    </main>
  )
} 
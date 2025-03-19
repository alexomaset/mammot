'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa'

const contactInfo = [
  {
    icon: <FaPhone className="w-6 h-6" />,
    title: "Phone",
    content: "+254 712 345 678",
    link: "tel:+254712345678"
  },
  {
    icon: <FaEnvelope className="w-6 h-6" />,
    title: "Email",
    content: "hello@example.com",
    link: "mailto:hello@example.com"
  },
  {
    icon: <FaMapMarkerAlt className="w-6 h-6" />,
    title: "Location",
    content: "Nairobi, Kenya",
    link: "https://maps.google.com/?q=Nairobi,Kenya"
  }
]

const socialLinks = [
  { icon: <FaTiktok className="w-5 h-5" />, link: "https://tiktok.com" },
  { icon: <FaInstagram className="w-5 h-5" />, link: "https://instagram.com" }
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('submitting')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setFormStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setFormStatus('error')
    }
  }

  return (
    <section id="contact" className="py-20 bg-earth-light">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h2>
          <p className="text-earth-clay text-lg max-w-2xl mx-auto">
            Have a project in mind? Let's create something amazing together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-earth-beige rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 group"
                    whileHover={{ x: 8 }}
                  >
                    <div className="p-3 bg-earth-sand text-earth-brown rounded-lg group-hover:bg-earth-terracotta group-hover:text-earth-light transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm text-earth-clay">{item.title}</p>
                      <p className="font-medium">{item.content}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t">
                <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-earth-sand text-earth-brown rounded-lg hover:bg-earth-terracotta hover:text-earth-light transition-colors"
                      whileHover={{ y: -4 }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-earth-beige rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-earth-clay mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-earth-sand focus:ring-2 focus:ring-earth-terracotta focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-earth-clay mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-earth-sand focus:ring-2 focus:ring-earth-terracotta focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-earth-clay mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-earth-sand focus:ring-2 focus:ring-earth-terracotta focus:border-transparent"
                  placeholder="Project Inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-earth-clay mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-earth-sand focus:ring-2 focus:ring-earth-terracotta focus:border-transparent resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className={`w-full py-3 px-6 rounded-lg text-earth-light font-medium transition-all
                  ${formStatus === 'submitting' 
                    ? 'bg-earth-slate cursor-not-allowed' 
                    : 'bg-earth-terracotta hover:bg-earth-rust hover:shadow-lg hover:shadow-earth-terracotta/30'
                  }`}
              >
                {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>

              {formStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-earth-moss/20 text-earth-moss rounded-lg text-center"
                >
                  Thank you! Your message has been sent successfully.
                </motion.div>
              )}

              {formStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-earth-rust/20 text-earth-rust rounded-lg text-center"
                >
                  Oops! Something went wrong. Please try again.
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaTiktok, FaRobot, FaPaperPlane, FaTimes } from 'react-icons/fa'

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

// Types for the chatbot
type ChatMessage = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

type ChatbotState = 'minimized' | 'open';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  
  // Chatbot states
  const [chatbotState, setChatbotState] = useState<ChatbotState>('minimized')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
  
  // Chatbot functionality
  useEffect(() => {
    // Send welcome message when chatbot first opens
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 1,
        text: "Hi there! I'm Mamot, Muthusi's assistant. How can I help you today? I can provide information about our services, pricing, or answer any questions you might have.",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
    
    // Auto-scroll to the latest message
    scrollToBottom()
  }, [messages])
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  const toggleChatbot = () => {
    setChatbotState(chatbotState === 'minimized' ? 'open' : 'minimized')
  }
  
  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return
    
    // Add user message
    const newUserMessage: ChatMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages([...messages, newUserMessage])
    setInputMessage('')
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponses = [
        "Thank you for your message! Muthusi will get back to you shortly.",
        "I'd be happy to help with that. Could you provide more details?",
        "That's a great question! Our services include photography, videography, and digital storytelling.",
        "We specialize in capturing unforgettable moments and turning them into lasting memories.",
        "Our team is available for bookings throughout Kenya and East Africa."
      ]
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]
      
      const newBotMessage: ChatMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prevMessages => [...prevMessages, newBotMessage])
    }, 1000)
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
      
      {/* Chatbot Button */}
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-300 transform ${chatbotState === 'minimized' ? 'scale-100' : 'scale-0'}`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleChatbot}
          className="bg-earth-terracotta text-earth-light p-4 rounded-full shadow-lg hover:bg-earth-rust transition-colors"
        >
          <FaRobot className="w-6 h-6" />
        </motion.button>
      </div>
      
      {/* Chatbot Interface */}
      <div 
        className={`fixed bottom-8 right-8 w-80 md:w-96 bg-earth-light rounded-lg shadow-xl overflow-hidden z-50 transition-all duration-300 ${
          chatbotState === 'open' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'
        }`}
      >
        {/* Chatbot Header */}
        <div className="flex items-center justify-between p-4 bg-earth-brown text-earth-light">
          <div className="flex items-center space-x-2">
            <FaRobot className="w-5 h-5" />
            <h3 className="font-semibold">Mamot Assistant</h3>
          </div>
          <button 
            onClick={toggleChatbot}
            className="text-earth-light hover:text-earth-sand transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        
        {/* Chat Messages */}
        <div className="p-4 h-80 overflow-y-auto bg-earth-light/80 backdrop-blur-sm">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div 
                className={`inline-block max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-earth-terracotta text-earth-light rounded-tr-none' 
                    : 'bg-earth-sand text-earth-brown rounded-tl-none'
                }`}
              >
                <p>{message.text}</p>
                <span className="text-xs opacity-75 mt-1 block">
                  {`${message.timestamp.getHours().toString().padStart(2, '0')}:${
                    message.timestamp.getMinutes().toString().padStart(2, '0')
                  }`}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input */}
        <form onSubmit={handleMessageSubmit} className="p-4 border-t border-earth-sand">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-full border border-earth-sand focus:ring-2 focus:ring-earth-terracotta focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-earth-terracotta text-earth-light p-2 rounded-full hover:bg-earth-rust transition-colors"
            >
              <FaPaperPlane className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaSearch, FaHashtag, FaPen, FaAd, FaEnvelope, FaCode } from 'react-icons/fa'
import { IconType } from 'react-icons'

interface Service {
  icon: IconType
  title: string
  description: string
  features: string[]
}

const services: Service[] = [
  {
    icon: FaHashtag,
    title: 'Social Media Marketing',
    description: 'Build your brand presence and engage with your audience across all major social media platforms.',
    features: ['Content Strategy', 'Community Management', 'Paid Social Ads', 'Analytics & Reporting']
  },
  {
    icon: FaPen,
    title: 'Content Marketing',
    description: 'Create valuable, engaging content that attracts and converts your target audience.',
    features: ['Blog Writing', 'Email Newsletters', 'Infographics', 'Video Content']
  },
  {
    icon: FaAd,
    title: 'Pay-Per-Click Advertising',
    description: 'Maximize your ROI with targeted PPC campaigns across Google, Facebook, and other platforms.',
    features: ['Campaign Strategy', 'Ad Creation', 'Bid Management', 'Performance Tracking']
  },
  {
    icon: FaEnvelope,
    title: 'Email Marketing',
    description: 'Build and nurture customer relationships through strategic email marketing campaigns.',
    features: ['List Building', 'Campaign Design', 'Automation', 'A/B Testing']
  }
]

export default function Services() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive digital marketing solutions to help your business grow and succeed online
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100"
            >
              <div className="text-blue-600 mb-6">
                <service.icon size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300"
          >
            Get Started with Our Services
          </a>
        </div>
      </div>
    </section>
  )
} 
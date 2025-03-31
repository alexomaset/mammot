'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaCamera, FaInstagram, FaPen, FaAd, FaChartLine, FaVideo, FaUsers, FaPalette } from 'react-icons/fa'
import { IconType } from 'react-icons'

interface Service {
  icon: IconType
  title: string
  description: string
  features: string[]
}

const services: Service[] = [
  {
    icon: FaInstagram,
    title: 'Social Media Management',
    description: 'We create, schedule, and optimize content to keep your brand active and engaging across platforms like Instagram, TikTok, and more.',
    features: ['Content Planning', 'Platform Management', 'Community Engagement', 'Performance Analytics']
  },
  {
    icon: FaPen,
    title: 'Content Creation & Storytelling',
    description: 'From compelling captions to engaging visuals, we craft narratives that connect with your audience.',
    features: ['Brand Storytelling', 'Visual Narratives', 'Audience-Centered Content']
  },
  {
    icon: FaVideo,
    title: 'Video Editing',
    description: 'High-quality video editing services to enhance your brand\'s online presence.',
    features: ['Professional Editing', 'Social Media Videos', 'Visual Style Development']
  },
  {
    icon: FaUsers,
    title: 'Influencer Marketing Strategy',
    description: 'Developing and implementing influencer collaborations to boost brand visibility and engagement.',
    features: ['Influencer Identification', 'Partnership Management', 'Campaign Design', 'Performance Tracking']
  },
  {
    icon: FaChartLine,
    title: 'Content Strategy & Market Research',
    description: 'Data-driven content planning based on market trends and consumer behavior to maximize engagement and conversions.',
    features: ['Audience Analysis', 'Trend Research', 'Content Calendar Planning', 'Performance Analytics']
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
    <section id="services" className="py-20 bg-gradient-to-b from-stone-50 to-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">Our Services</h2>
          <p className="text-xl text-stone-700 max-w-2xl mx-auto">
            Comprehensive digital marketing solutions that elevate your brand through authentic storytelling and strategic engagement
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
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-stone-200"
              style={{
                background: "linear-gradient(145deg, #ffffff, #f5f5f0)",
                boxShadow: "0 10px 15px -3px rgba(120, 80, 40, 0.05), 0 4px 6px -2px rgba(120, 80, 40, 0.025)"
              }}
            >
              <div className="text-black mb-6">
                <service.icon size={40} />
              </div>
              <h3 className="text-2xl font-bold text-amber-800 mb-4">{service.title}</h3>
              <p className="text-stone-600 mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-stone-600">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-2"></span>
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
            className="inline-block bg-[#6D412A] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#7d4c32] transition-all"
          >
            Get Started with Our Services
          </a>
        </div>
      </div>
    </section>
  )
} 
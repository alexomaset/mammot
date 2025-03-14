'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'

const projects = [
  {
    title: 'E-commerce Growth Strategy',
    category: 'Digital Marketing',
    image: '/images/projects/ecommerce.jpg',
    description: 'Increased online sales by 200% through comprehensive digital marketing strategy',
    metrics: ['200% Sales Growth', '150% Traffic Increase', '3x Conversion Rate']
  },
  {
    title: 'Brand Awareness Campaign',
    category: 'Social Media',
    image: '/images/projects/social.jpg',
    description: 'Built a strong brand presence across social media platforms',
    metrics: ['500% Engagement', '2M+ Reach', '50K+ Followers']
  },
  {
    title: 'SEO Optimization',
    category: 'Search Engine',
    image: '/images/projects/seo.jpg',
    description: 'Improved search rankings and organic traffic through technical SEO',
    metrics: ['300% Traffic Growth', 'Top 3 Rankings', '40% Conversion Rate']
  }
]

export default function FeaturedWork() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Work</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how we've helped businesses achieve their digital marketing goals
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.metrics.map((metric, metricIndex) => (
                    <span
                      key={metricIndex}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/case-studies/${project.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  View Case Study →
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link
            href="/case-studies"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300"
          >
            View All Case Studies
          </Link>
        </div>
      </div>
    </section>
  )
}
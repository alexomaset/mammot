'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const brands = [
  {
    id: 1,
    name: 'Brand 1',
    image: '/images/brands/IMG_5520.PNG',
  },
  {
    id: 2,
    name: 'Brand 2',
    image: '/images/brands/WhatsApp Image 2026-01-08 at 3.10.15 PM.jpeg',
  },
  {
    id: 3,
    name: 'Brand 3',
    image: '/images/brands/WhatsApp Image 2026-01-08 at 3.11.13 PM.jpeg',
  },
  {
    id: 4,
    name: 'Brand 4',
    image: '/images/brands/WhatsApp Image 2026-01-08 at 3.12.14 PM.jpeg',
  },
  {
    id: 5,
    name: 'Brand 5',
    image: '/images/brands/IMG_2472.PNG',
  },
  {
    id: 6,
    name: 'Brand 6',
    image: '/images/brands/WhatsApp Image 2026-01-08 at 3.26.11 PM.jpeg',
  },
]

export default function Brands() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Trusted by Leading Brands
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            We're proud to collaborate with innovative companies and organizations
          </motion.p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 items-center">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Optional: Add a subtle divider or testimonial */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 italic">
            "Creating memorable experiences with brands we believe in"
          </p>
        </motion.div>
      </div>
    </section>
  )
}

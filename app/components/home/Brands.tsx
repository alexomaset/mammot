'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const brands = [
  {
    id: 1,
    name: 'Yungi',
    image: '/images/brands/IMG_5520.PNG',
  },
  {
    id: 2,
    name: 'Zawadi',
    image: '/images/brands/WhatsApp Image 2026-01-08 at 3.10.15 PM.jpeg',
  },
  {
    id: 3,
    name: 'Casa',
    image: '/images/brands/WhatsApp Image 2026-01-08 at 3.11.13 PM.jpeg',
  },
  {
    id: 4,
    name: 'Kijiji',
    image: '/images/brands/WhatsApp Image 2026-01-08 at 3.12.14 PM.jpeg',
  },
  {
    id: 5,
    name: 'Headway',
    image: '/images/brands/IMG_2472.PNG',
  },
  {
    id: 6,
    name: 'Mamy Mbuta',
    image: '/images/brands/mbuta.png',
  },
  {
    id: 7,
    name: 'Ene',
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
        <div className="grid grid-cols-2 gap-8 md:gap-12 items-center max-w-4xl mx-auto">
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
                    className="object-contain transition-all duration-300"
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

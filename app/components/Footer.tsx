import Link from 'next/link'
import Image from 'next/image'
import { FaInstagram, FaTiktok } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-earth-bark text-earth-light">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="relative h-12 w-48">
              <Image
                src="/logo.svg"
                alt="MAMOT Digital Marketing"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-earth-sand">
              Transforming businesses through innovative digital marketing solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-earth-sand hover:text-earth-terracotta transition-colors">
                <FaTiktok size={20} />
              </a>
              <a href="https://www.instagram.com/mamot_by_muthusi?igsh=MTR0N2N1YTN6aHd2dQ%3D%3D&utm_source=qr" className="text-earth-sand hover:text-earth-terracotta transition-colors">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services#seo" className="text-earth-sand hover:text-earth-terracotta transition-colors">
                Influencer Marketing Strategy
                </Link>
              </li>
              <li>
                <Link href="/services#social" className="text-gray-400 hover:text-white transition-colors">
                Social Media Management
                </Link>
              </li>
              <li>
                <Link href="/services#content" className="text-gray-400 hover:text-white transition-colors">
                Video Editing
                </Link>
              </li>
              <li>
                <Link href="/services#ppc" className="text-gray-400 hover:text-white transition-colors">
                Content Strategy & Market Research
                </Link>
              </li>
              <li>
                <Link href="/services#ppc" className="text-gray-400 hover:text-white transition-colors">
                Content Creation & Storytelling
                </Link>
              </li>
              <li>
                <Link href="/services#content" className="text-gray-400 hover:text-white transition-colors">
                  <li>
                <Link href="/services#content" className="text-gray-400 hover:text-white transition-colors">
                Video Editing
                </Link>
              </li>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-earth-sand hover:text-earth-terracotta transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>
                <a href="tel:+254 (713) 370-840" className="text-earth-sand hover:text-earth-terracotta transition-colors">
                  +254 (713) 370-840
                </a>
              </li>
              <li>
                <a href="mailto:mamotbymuthusi@gmail.com" className="text-earth-sand hover:text-earth-terracotta transition-colors">
                  mamotbymuthusi@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-earth-soil mt-12 pt-8 text-center text-earth-sand">
          <p>&copy; {new Date().getFullYear()} MAMOT Digital Marketing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 
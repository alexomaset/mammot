import Link from 'next/link'
import Image from 'next/image'
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa'

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
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-earth-sand hover:text-earth-terracotta transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-earth-sand hover:text-earth-terracotta transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-earth-sand hover:text-earth-terracotta transition-colors">
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
                  Search Engine Optimization
                </Link>
              </li>
              <li>
                <Link href="/services#social" className="text-gray-400 hover:text-white transition-colors">
                  Social Media Marketing
                </Link>
              </li>
              <li>
                <Link href="/services#content" className="text-gray-400 hover:text-white transition-colors">
                  Content Marketing
                </Link>
              </li>
              <li>
                <Link href="/services#ppc" className="text-gray-400 hover:text-white transition-colors">
                  Pay-Per-Click Advertising
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
              <li className="text-earth-sand">
                123 Digital Street
                <br />
                Tech City, TC 12345
              </li>
              <li>
                <a href="tel:+15551234567" className="text-earth-sand hover:text-earth-terracotta transition-colors">
                  +254 (555) 123-4567
                </a>
              </li>
              <li>
                <a href="mailto:contact@mamotdigital.com" className="text-earth-sand hover:text-earth-terracotta transition-colors">
                  contact@mamotdigital.com
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
import Link from 'next/link'
import Image from 'next/image'
import { FaInstagram, FaPinterest, FaFacebook, FaEnvelope } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Tagline */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative h-12 w-48 mb-4">
              <Image 
                src="/images/logo-white.svg" 
                alt="MAMOT by MUTHUSI" 
                fill
                className="object-contain"
              />
            </div>
            <p className="font-accent text-sm opacity-80">
              Memories are made of this
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="font-heading text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 font-body text-sm">
              <li><Link href="/" className="hover:text-secondary transition">Home</Link></li>
              <li><Link href="/gallery" className="hover:text-secondary transition">Gallery</Link></li>
              <li><Link href="/services" className="hover:text-secondary transition">Services</Link></li>
              <li><Link href="/about" className="hover:text-secondary transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-secondary transition">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="font-heading text-lg mb-4">Get In Touch</h3>
            <div className="flex justify-center md:justify-start space-x-4 mb-6">
              <a href="#" className="hover:text-secondary transition" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-secondary transition" aria-label="Pinterest">
                <FaPinterest size={20} />
              </a>
              <a href="#" className="hover:text-secondary transition" aria-label="Facebook">
                <FaFacebook size={20} />
              </a>
              <a href="mailto:contact@mamotbymuthusi.com" className="hover:text-secondary transition" aria-label="Email">
                <FaEnvelope size={20} />
              </a>
            </div>
            <p className="font-body text-sm opacity-80">
              contact@mamotbymuthusi.com
            </p>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="font-body text-xs opacity-70">
            &copy; {currentYear} MAMOT by MUTHUSI. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
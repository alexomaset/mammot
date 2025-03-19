"use client";
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationProps {
  mobile?: boolean
  setMobileMenuOpen?: (open: boolean) => void
}

export default function Navigation({ mobile, setMobileMenuOpen }: NavigationProps) {
  const pathname = usePathname()
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ]

  const handleClick = () => {
    if (mobile && setMobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }

  return (
    <nav className={mobile ? "flex flex-col space-y-4" : "flex space-x-8"}>
      {navItems.map((item) => {
        const isActive = pathname === item.path
        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={handleClick}
            className={`relative font-medium text-base transition duration-200 ${
              isActive 
                ? "text-earth-brown"
                : "text-earth-clay hover:text-earth-terracotta"
            }`}
          >
            {item.name}
            {isActive && (
              <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-earth-terracotta" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
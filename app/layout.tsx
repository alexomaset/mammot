import './globals.css'
import { Playfair_Display, Lato, Cormorant_Garamond } from 'next/font/google'
import { Header, Footer } from './components'
import { initializeApp } from '@/lib/init-app'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-lato',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-cormorant',
})

export const metadata = {
  title: 'MAMOT Digital Marketing | Transform Your Digital Presence',
  description: 'We help businesses grow through innovative digital marketing solutions',
}

// Initialize the app during build/startup
initializeApp()
  .then(success => {
    if (!success) {
      console.error('Application initialization failed');
    }
  })
  .catch(error => {
    console.error('Error during application initialization:', error);
  });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} ${cormorant.variable}`}>
      <body className="min-h-screen flex flex-col bg-earth-light">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
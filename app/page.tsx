import Image from 'next/image';
import Hero from '@/app/components/home/Hero';
import Services from '@/app/components/home/Services';
import FeaturedWork from '@/app/components/home/FeaturedWork';
import Testimonials from '@/app/components/home/Testimonials'
import CallToAction from '@/app/components/home/CallToAction'
import Portfolio from './components/home/Portfolio'
import Contact from './components/home/Contact'

export default function Home() {
  return (
    <main>
      <div style={{ display: 'none' }}>
        <img src="https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop" alt="Video Thumbnail" id="video-thumbnail" />
      </div>
      
      <Hero />
      {/* <FeaturedWork /> */}
      <CallToAction />
      <Portfolio />
      <Services />
      <Testimonials />
      <Contact />
    </main>
  )
}
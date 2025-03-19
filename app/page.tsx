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
    <div className="flex flex-col">
      <Hero />
      {/* <FeaturedWork /> */}
      <CallToAction />
      <Portfolio />
      <Services />
      <Testimonials />
      <Contact />
    </div>
  )
}
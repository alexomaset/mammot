import Image from 'next/image';
import Hero from '@/app/components/home/Hero';
import Services from '@/app/components/home/Services';
import FeaturedWork from '@/app/components/home/FeaturedWork';
import Testimonials from '@/app/components/home/Testimonials'
import CallToAction from '@/app/components/home/CallToAction'
import Portfolio from './components/home/Portfolio'

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Services />
      <FeaturedWork />
      <Testimonials />
      <CallToAction />
      <Portfolio />
    </div>
  )
}
import Link from 'next/link'

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-stone-100 to-emerald-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-amber-800">
            Ready to Transform Your Digital Presence?
          </h2>
          <p className="text-xl mb-8 text-stone-600">
            Let&apos;s work together to create a digital marketing strategy that drives real results for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-[#6D412A] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#7d4c32] transition-all"
            >
              Get Started
            </Link>
            <Link   
              href="/case-studies"
              className="border-2 border-amber-600/50 text-amber-800 px-8 py-3 rounded-full font-semibold hover:bg-amber-100 transition-all duration-300 transform hover:-translate-y-1"
            >
              View Case Studies
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
} 
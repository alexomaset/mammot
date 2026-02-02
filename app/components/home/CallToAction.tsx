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
          <div className="flex justify-center">
            <Link
              href="/join"
              className="bg-[#6D412A] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#7d4c32] transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
} 
import Link from 'next/link'

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Digital Presence?
          </h2>
          <p className="text-xl mb-8">
            Let's work together to create a digital marketing strategy that drives real results for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all"
            >
              Get Started
            </Link>
            <Link
              href="/case-studies"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              View Case Studies
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
} 
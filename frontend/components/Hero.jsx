'use client'

import { ArrowRight, CheckCircle2 } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const Hero = () => {
  const router = useRouter()

  const handleBookService = () => {
    router.push('/booking')
  }

  const handleViewServices = () => {
    const servicesSection = document.getElementById('services')

    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push('/services')
    }
  }

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative min-h-screen w-full bg-green-800">
        {/* Optimized Full-Screen Image Background */}
        <div className="absolute inset-0 h-full w-full">
          <Image
            src="/videos/hero.jpg"
            alt="Professional property services background"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Overlay - subtle dark for text readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 px-4 pt-24 sm:px-6 md:pt-28 lg:px-8">
          <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center py-8">
            {/* Left Content */}
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md">
                <span>Trusted Property Services Across London</span>
              </div>

              {/* Heading */}
              <h1 className="mb-6 text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
                Professional Property Services Across London
              </h1>

              {/* Subtitle */}
              <p className="mb-8 text-base leading-relaxed text-white/90 drop-shadow-md sm:text-lg">
                Book trusted cleaning, removal, disposal, clearance, moving, and
                commercial services with one reliable team.
              </p>

              {/* CTA Buttons */}
              <div className="mb-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={handleBookService}
                  className="group inline-flex items-center gap-2 rounded-full bg-green-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-green-700 hover:shadow-xl"
                >
                  Book a Service
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <button
                  type="button"
                  onClick={handleViewServices}
                  className="rounded-full border-2 border-white bg-white px-8 py-3 text-base font-semibold text-slate-800 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  View Services
                </button>
              </div>

              {/* Trust Highlights */}
              <div className="flex flex-wrap gap-3">
                {[
                  'Re-Clean Guarantee',
                  'Payment After Work',
                  'Fully Insured',
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm text-white shadow-md backdrop-blur-md"
                  >
                    <CheckCircle2
                      className="shrink-0 text-green-400"
                      size={16}
                    />
                    <span className="whitespace-nowrap font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
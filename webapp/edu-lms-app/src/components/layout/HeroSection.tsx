'use client'

import Link from 'next/link'

export default function HeroSection({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink
}) {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/5">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Left side - Text content */}
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {title}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={primaryButtonLink} className="btn-primary">
                {primaryButtonText}
              </Link>
              <Link href={secondaryButtonLink} className="btn-secondary">
                {secondaryButtonText}
              </Link>
            </div>
          </div>
          
          {/* Right side - AI Tutor Chat Image */}
          <div className="lg:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src="/images/ai-tutor-chat.jpeg" 
                alt="AI Tutor Chat Interface" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

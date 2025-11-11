'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface HeroIllustrationProps {
  className?: string
  priority?: boolean
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

export function HeroIllustration({
  className = '',
  priority = true
}: HeroIllustrationProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  const ImageWrapper = prefersReducedMotion ? 'div' : motion.div

  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: {
          duration: 1.2,
          delay: 0.3,
          ease: [0.4, 0, 0.2, 1],
        },
      }

  return (
    <ImageWrapper className={`relative ${className}`} {...animationProps}>
      <Image
        src="/images/hero/hero-illustration.png"
        alt="Creative professional overwhelmed by storyboard tool interface, breaking free toward creative freedom"
        width={800}
        height={600}
        priority={priority}
        className="w-full h-auto object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
      />
    </ImageWrapper>
  )
}

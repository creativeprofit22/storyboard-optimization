'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface HeroIllustrationProps {
  className?: string
  priority?: boolean
}

// Hook to detect mobile viewport
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

export function HeroIllustration({
  className = '',
  priority = true
}: HeroIllustrationProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()

  const ImageWrapper = prefersReducedMotion ? 'div' : motion.div

  // Mobile-optimized animation timing
  const animationProps = useMemo(() => {
    if (prefersReducedMotion) return {}

    return {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: {
        duration: isMobile ? 0.8 : 1.2,
        delay: isMobile ? 0.1 : 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
      style: { willChange: 'transform, opacity' }
    }
  }, [prefersReducedMotion, isMobile])

  return (
    <ImageWrapper
      className={`relative ${className}`}
      {...animationProps}
    >
      {/*
        FIX: Prevent Cumulative Layout Shift (CLS)
        - Use aspect-[4/3] container to reserve space before image loads
        - Use Next.js Image fill prop with object-contain
        - Explicit aspect ratio prevents layout shifts during image loading
      */}
      <div className="relative aspect-[4/3] w-full">
        <Image
          src="/images/hero/hero-illustration.png"
          alt="Creative professional overwhelmed by storyboard tool interface, breaking free toward creative freedom"
          fill
          priority={priority}
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
          style={{
            // GPU acceleration hint
            transform: 'translateZ(0)',
            willChange: 'transform, opacity'
          }}
        />
      </div>
    </ImageWrapper>
  )
}

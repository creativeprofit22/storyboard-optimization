'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSharedIntersectionObserver } from '@/hooks/useSharedIntersectionObserver'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
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

export function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: AnimatedSectionProps) {
  const { ref, isInView } = useSharedIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    once: true
  })

  const prefersReducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()

  // Memoize animation configuration based on device type
  const animationConfig = useMemo(() => ({
    duration: isMobile ? 0.4 : 0.6,
    delay: isMobile ? Math.min(delay * 0.5, 0.1) : delay,
    ease: [0.4, 0, 0.2, 1] as const, // --ease-standard from design system
  }), [isMobile, delay])

  // If user prefers reduced motion, show content immediately
  if (prefersReducedMotion) {
    return (
      <div ref={ref as any} className={`animated-section ${className}`}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref as any}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={animationConfig}
      className={`animated-section ${className}`}
      style={{ willChange: isInView ? 'transform, opacity' : 'auto' }}
    >
      {children}
    </motion.div>
  )
}

// Variant for staggered child animations
export function StaggeredContainer({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const { ref, isInView } = useSharedIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    once: true
  })

  const prefersReducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()

  // Adjust stagger timing for mobile
  const staggerConfig = useMemo(() => ({
    staggerChildren: isMobile ? 0.05 : 0.1,
    delayChildren: isMobile ? 0.1 : 0.2,
  }), [isMobile])

  // If user prefers reduced motion, show content immediately
  if (prefersReducedMotion) {
    return (
      <div ref={ref as any} className={`animated-section ${className}`}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref as any}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        visible: {
          transition: staggerConfig,
        },
        hidden: {},
      }}
      className={`animated-section ${className}`}
      style={{ willChange: isInView ? 'transform, opacity' : 'auto' }}
    >
      {children}
    </motion.div>
  )
}

// Child variant for staggered animations
export function StaggeredChild({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()

  // Memoize transition config
  const transitionConfig = useMemo(() => ({
    duration: isMobile ? 0.4 : 0.6,
    ease: [0.4, 0, 0.2, 1] as const,
  }), [isMobile])

  // If user prefers reduced motion, show content immediately
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 },
      }}
      transition={transitionConfig}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

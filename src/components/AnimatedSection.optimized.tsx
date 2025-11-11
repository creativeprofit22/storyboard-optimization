'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

// Memoized animation variants (prevents recreation on each render)
const ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
} as const

const ANIMATION_CONFIG = {
  duration: 0.6,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
}

// Singleton observer for better performance (single observer for all sections)
let sharedObserver: IntersectionObserver | null = null
const observerCallbacks = new Map<Element, () => void>()

function getSharedObserver() {
  if (typeof window === 'undefined') return null
  
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const callback = observerCallbacks.get(entry.target)
            if (callback) {
              callback()
              observerCallbacks.delete(entry.target)
              sharedObserver?.unobserve(entry.target)
            }
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    )
  }
  return sharedObserver
}

export function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  // Memoize transition config to prevent recreating object on each render
  const transition = useMemo(
    () => 
      shouldReduceMotion 
        ? { duration: 0 } 
        : { ...ANIMATION_CONFIG, delay },
    [delay, shouldReduceMotion]
  )

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = getSharedObserver()
    if (!observer) return

    const callback = () => setIsInView(true)
    
    observerCallbacks.set(element, callback)
    observer.observe(element)

    return () => {
      observerCallbacks.delete(element)
      observer.unobserve(element)
    }
  }, [])

  return (
    <motion.div
      ref={ref}
      variants={shouldReduceMotion ? undefined : ANIMATION_VARIANTS}
      initial={shouldReduceMotion ? false : 'hidden'}
      animate={shouldReduceMotion ? false : (isInView ? 'visible' : 'hidden')}
      transition={transition}
      style={{
        // GPU acceleration hints
        willChange: isInView && !shouldReduceMotion ? 'transform, opacity' : 'auto',
        transform: 'translate3d(0, 0, 0)', // Force GPU layer creation
        // CSS containment for layout isolation (prevents CLS)
        contain: 'layout',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Variant for staggered child animations (OPTIMIZED)
export function StaggeredContainer({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = getSharedObserver()
    if (!observer) return

    const callback = () => setIsInView(true)
    
    observerCallbacks.set(element, callback)
    observer.observe(element)

    return () => {
      observerCallbacks.delete(element)
      observer.unobserve(element)
    }
  }, [])

  const variants = useMemo(
    () => ({
      visible: {
        transition: {
          staggerChildren: shouldReduceMotion ? 0 : 0.1,
          delayChildren: shouldReduceMotion ? 0 : 0.2,
        },
      },
      hidden: {},
    }),
    [shouldReduceMotion]
  )

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? false : 'hidden'}
      animate={shouldReduceMotion ? false : (isInView ? 'visible' : 'hidden')}
      variants={variants}
      className={className}
      style={{
        contain: 'layout',
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      {children}
    </motion.div>
  )
}

// Child variant for staggered animations (OPTIMIZED)
const STAGGER_VARIANTS = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 20 },
} as const

export function StaggeredChild({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const shouldReduceMotion = useReducedMotion()
  
  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : STAGGER_VARIANTS}
      className={className}
      style={{
        willChange: 'transform, opacity',
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      {children}
    </motion.div>
  )
}

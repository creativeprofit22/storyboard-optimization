'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import { useSharedIntersectionObserver } from '@/hooks/useSharedIntersectionObserver'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface ProblemSolutionDiagramProps {
  className?: string
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

export function ProblemSolutionDiagram({
  className = ''
}: ProblemSolutionDiagramProps) {
  const { ref, isInView } = useSharedIntersectionObserver({
    threshold: 0.3,
    rootMargin: '-100px',
    once: true
  })

  const prefersReducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()

  const DiagramWrapper = prefersReducedMotion ? 'div' : motion.div

  // Mobile-optimized animation config
  const animationProps = useMemo(() => {
    if (prefersReducedMotion) return {}

    return {
      initial: { opacity: 0, y: 40 },
      animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
      transition: {
        duration: isMobile ? 0.6 : 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
      style: { willChange: isInView ? 'transform, opacity' : 'auto' }
    }
  }, [prefersReducedMotion, isInView, isMobile])

  return (
    <div ref={ref as any} className={`w-full animated-section ${className}`}>
      <DiagramWrapper
        className="relative w-full max-w-4xl mx-auto"
        {...animationProps}
      >
        {/*
          FIX: Prevent Cumulative Layout Shift (CLS)
          - Use aspect-[2/1] container to reserve space before image loads
          - Use Next.js Image fill prop with object-contain
          - Explicit aspect ratio prevents layout shifts during image loading
        */}
        <div className="relative aspect-[2/1] w-full">
          <Image
            src="/images/diagrams/problem-solution.png"
            alt="Storyboard Tool Comparison - Current tools show cognitive load, constraints, and chaos versus our solution providing protection, collaboration, and clarity through a bridging concept"
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 1200px"
            loading="lazy"
            style={{
              // GPU acceleration hint
              transform: 'translateZ(0)',
              willChange: 'transform, opacity'
            }}
          />
        </div>
      </DiagramWrapper>

      {/* Accessibility text fallback */}
      <div className="sr-only">
        <h3>Problem versus Solution Comparison: Storyboard Tools From Chaos to Clarity</h3>
        <div>
          <h4>Current Tool Problems:</h4>
          <ul>
            <li>Cognitive load: Managing creative work and technical interface simultaneously</li>
            <li>Constraints: Ideas limited by tool capabilities</li>
          </ul>
        </div>
        <div>
          <h4>Our Framework Solution:</h4>
          <ul>
            <li>Protection: Sacred space for creative work</li>
            <li>Collaboration: Meaningful teamwork and dialogue</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

'use client'

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

interface ProblemSolutionDiagramProps {
  className?: string
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

export function ProblemSolutionDiagram({
  className = ''
}: ProblemSolutionDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    once: true,
    margin: '-100px',
    amount: 0.3
  })
  const prefersReducedMotion = usePrefersReducedMotion()

  const DiagramWrapper = prefersReducedMotion ? 'div' : motion.div

  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 40 },
        animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
        transition: {
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        },
      }

  return (
    <div ref={ref} className={`w-full ${className}`}>
      <DiagramWrapper
        className="relative w-full max-w-4xl mx-auto"
        {...animationProps}
      >
        <Image
          src="/images/diagrams/problem-solution.jpeg"
          alt="Storyboard Tools: From Chaos to Clarity - Comparison diagram showing current tools (cognitive load, constraints) versus our solution (protection, collaboration)"
          width={1200}
          height={800}
          className="w-full h-auto"
          sizes="(max-width: 1024px) 100vw, 1200px"
          loading="lazy"
        />
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

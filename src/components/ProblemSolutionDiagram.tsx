'use client'

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
        className="relative w-full max-w-5xl mx-auto"
        {...animationProps}
      >
        {/* Diagram Content */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-4 text-center">
          {/* Problem Side */}
          <motion.div
            className="lg:col-span-1"
            initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
            animate={
              isInView && !prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
            }
            transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="p-6 rounded-lg bg-neutral-100 border-2 border-neutral-300">
              <h3 className="text-h4 text-primary-dark mb-4">CURRENT TOOLS</h3>
              <ul className="text-sm text-primary-dark opacity-80 space-y-2 text-left">
                <li className="flex items-start">
                  <span className="text-accent-orange mr-2">✗</span>
                  <span>Cognitive load trap</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-orange mr-2">✗</span>
                  <span>Template ceiling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-orange mr-2">✗</span>
                  <span>No creative space</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-orange mr-2">✗</span>
                  <span>Speed over quality</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Bridge */}
          <motion.div
            className="lg:col-span-1 flex items-center justify-center"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
            animate={
              isInView && !prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="hidden lg:block">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-1 h-16 bg-accent-orange"></div>
                <div className="text-accent-orange text-2xl font-bold">→</div>
                <div className="w-1 h-16 bg-accent-orange"></div>
              </div>
            </div>
            <div className="block lg:hidden text-accent-orange text-2xl font-bold">↓</div>
          </motion.div>

          {/* Solution Side */}
          <motion.div
            className="lg:col-span-1"
            initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
            animate={
              isInView && !prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
            }
            transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="p-6 rounded-lg bg-primary-dark border-2 border-accent-orange">
              <h3 className="text-h4 text-accent-orange mb-4">OUR FRAMEWORK</h3>
              <ul className="text-sm text-primary-light opacity-90 space-y-2 text-left">
                <li className="flex items-start">
                  <span className="text-accent-orange mr-2">✓</span>
                  <span>Protect the sketch</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-orange mr-2">✓</span>
                  <span>Deepen collaboration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-orange mr-2">✓</span>
                  <span>Creative space</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-orange mr-2">✓</span>
                  <span>Quality over speed</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </DiagramWrapper>

      {/* Accessibility text fallback */}
      <div className="sr-only">
        <h3>Problem versus Solution Comparison</h3>
        <div>
          <h4>Current Tool Problems:</h4>
          <ul>
            <li>Cognitive load trap: Managing creative work and technical interface simultaneously</li>
            <li>Template ceiling: Ideas constrained by tool capabilities</li>
            <li>Missing creative space: No room for messy ideation</li>
            <li>Speed over quality: Prioritizes fast output over creative depth</li>
          </ul>
        </div>
        <div>
          <h4>Our Framework Solution:</h4>
          <ul>
            <li>Protect the sketch: Sacred space for rough ideas</li>
            <li>Deepen collaboration: Shared thinking process</li>
            <li>Creative space: Room for the creative process</li>
            <li>Quality over speed: Meaningful creative work</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

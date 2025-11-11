'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface FrameworkIconProps {
  icon: 'sketch' | 'collaboration' | 'rhythm' | 'intention' | 'simplicity'
  title: string
  className?: string
  index?: number
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

const iconMap = {
  sketch: '/images/icons/icon-sketch.png',
  collaboration: '/images/icons/icon-collaboration.png',
  rhythm: '/images/icons/icon-rhythm.png',
  intention: '/images/icons/icon-intention.png',
  simplicity: '/images/icons/icon-simplicity.png',
}

export function FrameworkIcon({
  icon,
  title,
  className = '',
  index = 0
}: FrameworkIconProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isHovered, setIsHovered] = useState(false)

  const IconWrapper = prefersReducedMotion ? 'div' : motion.div

  const hoverProps = prefersReducedMotion
    ? {}
    : {
        whileHover: { scale: 1.1, rotate: 5 },
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      }

  return (
    <IconWrapper
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...hoverProps}
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28">
        {/* Background circle with accent color */}
        <motion.div
          className="absolute inset-0 rounded-full bg-accent-orange opacity-10 group-hover:opacity-20 transition-opacity duration-300"
          initial={false}
          animate={isHovered && !prefersReducedMotion ? { scale: 1.2 } : { scale: 1 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Icon */}
        <div className="relative w-full h-full p-3 sm:p-4">
          <Image
            src={iconMap[icon]}
            alt={`${title} icon`}
            fill
            className="object-contain filter group-hover:brightness-110 transition-all duration-300"
            sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 112px"
          />
        </div>
      </div>

      {/* Accessible label */}
      <span className="sr-only">{title}</span>
    </IconWrapper>
  )
}

export function FrameworkIconGrid({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 items-center justify-items-center ${className}`}
      role="list"
      aria-label="Framework principles"
    >
      {children}
    </div>
  )
}

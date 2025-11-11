'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface FrameworkIconProps {
  icon: 'sketch' | 'collaboration' | 'rhythm' | 'intention' | 'simplicity'
  title: string
  className?: string
  index?: number
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

  // Memoize hover animation props
  const hoverProps = useMemo(() => {
    if (prefersReducedMotion) return {}

    return {
      whileHover: { scale: 1.1, rotate: 5 },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      style: { willChange: 'transform' }
    }
  }, [prefersReducedMotion])

  // Memoize background animation props
  const backgroundAnimationProps = useMemo(() => {
    if (prefersReducedMotion) return {}

    return {
      initial: false,
      animate: isHovered ? { scale: 1.2 } : { scale: 1 },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      style: { willChange: isHovered ? 'transform' : 'auto' }
    }
  }, [isHovered, prefersReducedMotion])

  return (
    <IconWrapper
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...hoverProps}
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32">
        {/* Background circle with accent color */}
        <motion.div
          className="absolute inset-0 rounded-full bg-accent-orange opacity-10 group-hover:opacity-20 transition-opacity duration-300"
          {...backgroundAnimationProps}
        />

        {/* Icon with GPU acceleration */}
        <div className="relative w-full h-full p-3 sm:p-4">
          <Image
            src={iconMap[icon]}
            alt={`${title} icon`}
            fill
            className="object-contain filter group-hover:brightness-110 transition-all duration-300"
            sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 112px"
            style={{
              // GPU acceleration hint
              transform: 'translateZ(0)',
              willChange: 'transform, opacity'
            }}
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
      className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-10 lg:gap-12 items-center justify-items-center w-full ${className}`}
      role="list"
      aria-label="Framework principles"
    >
      {children}
    </div>
  )
}

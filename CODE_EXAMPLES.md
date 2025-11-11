# Code Examples - Refactored Patterns

## Table of Contents
1. [Hook Extraction Pattern](#1-hook-extraction-pattern)
2. [Animation Configuration](#2-animation-configuration)
3. [Responsive Design](#3-responsive-design)
4. [Section Layouts](#4-section-layouts)
5. [Complete Component Examples](#5-complete-component-examples)

---

## 1. Hook Extraction Pattern

### Before: Inline Hook (Duplicated 4x)
```typescript
// ❌ OLD WAY - Inside each component file
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

export function MyComponent() {
  const prefersReducedMotion = usePrefersReducedMotion()
  // ... rest of component
}
```

### After: Shared Hook
```typescript
// ✅ NEW WAY - Shared hook
// File: src/hooks/usePrefersReducedMotion.ts
'use client'

import { useState, useEffect } from 'react'

export function usePrefersReducedMotion(): boolean {
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

// File: src/components/MyComponent.tsx
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export function MyComponent() {
  const prefersReducedMotion = usePrefersReducedMotion()
  // ... rest of component
}
```

**Benefits:**
- Single source of truth
- Update once, applies everywhere
- Reduced bundle size (shared code)
- Better testability

---

## 2. Animation Configuration

### Before: Hardcoded Values
```typescript
// ❌ OLD WAY - Magic numbers scattered everywhere
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: 0.6,  // What does 0.6 represent?
    delay: 0.2,     // Why 0.2?
    ease: [0.4, 0, 0.2, 1],  // Repeated everywhere
  }}
/>

// Different component uses different values
<motion.div
  transition={{
    duration: 0.8,  // Inconsistent!
    ease: [0.4, 0, 0.2, 1],  // Duplicated
  }}
/>
```

### After: Semantic Constants
```typescript
// ✅ NEW WAY - Named constants with meaning
import { ANIMATION_CONFIG } from '@/constants/animations'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: ANIMATION_CONFIG.duration.standard,  // Clear intent
    delay: ANIMATION_CONFIG.delay.short,           // Self-documenting
    ease: ANIMATION_CONFIG.easing,                 // Consistent
  }}
/>

// All components use same configuration
<motion.div
  transition={{
    duration: ANIMATION_CONFIG.duration.slow,  // Consistent!
    ease: ANIMATION_CONFIG.easing,             // Same easing
  }}
/>
```

**Benefits:**
- Self-documenting code
- Consistent timing across site
- Easy to adjust globally
- TypeScript autocomplete

---

## 3. Responsive Design

### Pattern A: Mobile Detection Hook

```typescript
// File: Inside component (can be extracted later)
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

export function MyComponent() {
  const isMobile = useIsMobile()

  return (
    <motion.div
      transition={{
        duration: isMobile ? 0.4 : 0.6,  // Faster on mobile
      }}
    >
      {content}
    </motion.div>
  )
}
```

### Pattern B: Using Breakpoint Constants

```typescript
import { BREAKPOINTS, IS_MOBILE } from '@/constants/breakpoints'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(IS_MOBILE(window.innerWidth))  // Using constant
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}
```

### Pattern C: Mobile-Optimized Animations

```typescript
import { useMemo } from 'react'
import { ANIMATION_CONFIG } from '@/constants/animations'

export function MyComponent() {
  const isMobile = useIsMobile()

  // Memoize animation config for performance
  const animationConfig = useMemo(() => ({
    duration: isMobile
      ? ANIMATION_CONFIG.mobile.duration.standard
      : ANIMATION_CONFIG.duration.standard,
    delay: isMobile
      ? ANIMATION_CONFIG.mobile.delay.short
      : ANIMATION_CONFIG.delay.short,
    ease: ANIMATION_CONFIG.easing,
  }), [isMobile])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={animationConfig}
    >
      {content}
    </motion.div>
  )
}
```

---

## 4. Section Layouts

### Before: Manual Padding
```tsx
// ❌ OLD WAY - Repeated classes everywhere
<section className="min-h-screen w-full bg-primary-dark py-20 px-4 sm:px-8 lg:px-16">
  <div className="max-w-3xl mx-auto">
    {content}
  </div>
</section>

<section className="min-h-screen w-full bg-primary-light py-20 px-4 sm:px-8 lg:px-16">
  <div className="max-w-3xl mx-auto">
    {content}
  </div>
</section>

// Easy to forget responsive variants
<section className="min-h-screen w-full bg-primary-dark py-20 px-4">
  ❌ Missing responsive padding!
</section>
```

### After: Utility Classes
```tsx
// ✅ NEW WAY - Consistent utility class
<section className="min-h-screen w-full section-padding bg-primary-dark">
  <div className="max-w-3xl mx-auto">
    {content}
  </div>
</section>

<section className="min-h-screen w-full section-padding bg-primary-light">
  <div className="max-w-3xl mx-auto">
    {content}
  </div>
</section>

// Compact variant
<section className="w-full section-padding-compact bg-primary-dark">
  <div className="max-w-6xl mx-auto">
    {content}
  </div>
</section>
```

**What's Included in `.section-padding`:**
```css
.section-padding {
  padding-left: 1.5rem;    /* 24px */
  padding-right: 1.5rem;   /* 24px */
  padding-top: 5rem;       /* 80px */
  padding-bottom: 5rem;    /* 80px */
}

@media (min-width: 640px) {
  .section-padding {
    padding-left: 2rem;    /* 32px */
    padding-right: 2rem;   /* 32px */
    padding-top: 6rem;     /* 96px */
    padding-bottom: 6rem;  /* 96px */
  }
}

@media (min-width: 1024px) {
  .section-padding {
    padding-left: 4rem;    /* 64px */
    padding-right: 4rem;   /* 64px */
  }
}
```

---

## 5. Complete Component Examples

### Example 1: Simple Animated Card

```typescript
'use client'

import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { ANIMATION_CONFIG } from '@/constants/animations'

interface CardProps {
  title: string
  description: string
  delay?: number
}

export function AnimatedCard({ title, description, delay = 0 }: CardProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  // Skip animations if user prefers reduced motion
  if (prefersReducedMotion) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-h4 mb-4">{title}</h3>
        <p className="text-body">{description}</p>
      </div>
    )
  }

  // Animate for users who allow motion
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: ANIMATION_CONFIG.duration.standard,
        delay: ANIMATION_CONFIG.delay.short * delay,
        ease: ANIMATION_CONFIG.easing,
      }}
      className="p-6 bg-white rounded-lg shadow-lg"
    >
      <h3 className="text-h4 mb-4">{title}</h3>
      <p className="text-body">{description}</p>
    </motion.div>
  )
}
```

### Example 2: Mobile-Optimized Hero Section

```typescript
'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { ANIMATION_CONFIG } from '@/constants/animations'
import { IS_MOBILE } from '@/constants/breakpoints'

export function HeroSection() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(IS_MOBILE(window.innerWidth))
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Memoize animation configuration
  const animationConfig = useMemo(() => ({
    duration: isMobile
      ? ANIMATION_CONFIG.mobile.duration.standard
      : ANIMATION_CONFIG.duration.hero,
    ease: ANIMATION_CONFIG.easing,
  }), [isMobile])

  const ContentWrapper = prefersReducedMotion ? 'div' : motion.div

  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: animationConfig,
      }

  return (
    <section className="min-h-screen section-padding bg-primary-dark flex items-center">
      <ContentWrapper
        className="max-w-4xl mx-auto text-center"
        {...animationProps}
      >
        <h1 className="text-h1 text-accent-orange mb-6">
          Welcome to Our Site
        </h1>
        <p className="text-body-lg text-primary-light opacity-90">
          {isMobile
            ? "Optimized for mobile with faster animations"
            : "Full desktop experience with rich animations"}
        </p>
      </ContentWrapper>
    </section>
  )
}
```

### Example 3: Scroll-Triggered Animation

```typescript
'use client'

import { motion } from 'framer-motion'
import { useSharedIntersectionObserver } from '@/hooks/useSharedIntersectionObserver'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { ANIMATION_CONFIG } from '@/constants/animations'

interface SectionProps {
  children: React.ReactNode
  className?: string
}

export function ScrollRevealSection({ children, className = '' }: SectionProps) {
  const { ref, isInView } = useSharedIntersectionObserver({
    threshold: 0.2,
    once: true,
  })
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div ref={ref as any} className={`section-padding ${className}`}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref as any}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: ANIMATION_CONFIG.duration.standard,
        ease: ANIMATION_CONFIG.easing,
      }}
      className={`section-padding ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Usage
export default function Page() {
  return (
    <main>
      <ScrollRevealSection className="bg-primary-light">
        <h2 className="text-h2 mb-8">Section Title</h2>
        <p className="text-body">Section content...</p>
      </ScrollRevealSection>

      <ScrollRevealSection className="bg-primary-dark">
        <h2 className="text-h2 mb-8">Another Section</h2>
        <p className="text-body">More content...</p>
      </ScrollRevealSection>
    </main>
  )
}
```

### Example 4: Staggered List Animation

```typescript
'use client'

import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { ANIMATION_CONFIG } from '@/constants/animations'

interface Item {
  id: string
  title: string
  description: string
}

interface StaggeredListProps {
  items: Item[]
}

export function StaggeredList({ items }: StaggeredListProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="p-6 bg-neutral-50 rounded-lg">
            <h3 className="text-h4 mb-2">{item.title}</h3>
            <p className="text-body">{item.description}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
        hidden: {},
      }}
      className="space-y-6"
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 20 },
          }}
          transition={{
            duration: ANIMATION_CONFIG.duration.standard,
            ease: ANIMATION_CONFIG.easing,
          }}
          className="p-6 bg-neutral-50 rounded-lg"
        >
          <h3 className="text-h4 mb-2">{item.title}</h3>
          <p className="text-body">{item.description}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
```

---

## Testing Examples

### Unit Test: usePrefersReducedMotion

```typescript
import { renderHook } from '@testing-library/react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

describe('usePrefersReducedMotion', () => {
  it('returns false by default', () => {
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)
  })

  it('returns true when prefers-reduced-motion is set', () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }))

    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(true)
  })
})
```

### Component Test: AnimatedCard

```typescript
import { render, screen } from '@testing-library/react'
import { AnimatedCard } from '@/components/AnimatedCard'

describe('AnimatedCard', () => {
  it('renders content correctly', () => {
    render(
      <AnimatedCard
        title="Test Title"
        description="Test Description"
      />
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('skips animations with reduced motion', () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }))

    const { container } = render(
      <AnimatedCard
        title="Test Title"
        description="Test Description"
      />
    )

    // Should render as div, not motion.div
    expect(container.firstChild).not.toHaveAttribute('style')
  })
})
```

---

## Migration Checklist

When migrating an existing component:

- [ ] Import `usePrefersReducedMotion` from shared hook
- [ ] Remove inline `usePrefersReducedMotion` function
- [ ] Replace hardcoded animation values with `ANIMATION_CONFIG`
- [ ] Consider adding mobile optimization with `useIsMobile`
- [ ] Replace manual padding with `.section-padding` classes
- [ ] Add accessibility fallback for reduced motion
- [ ] Test on desktop and mobile
- [ ] Test with `prefers-reduced-motion` enabled
- [ ] Verify no console errors
- [ ] Check animation timing feels consistent

---

## Common Pitfalls & Solutions

### Pitfall 1: Forgetting Reduced Motion Check
```typescript
// ❌ BAD - No accessibility consideration
export function MyComponent() {
  return (
    <motion.div animate={{ opacity: 1 }}>
      {content}
    </motion.div>
  )
}

// ✅ GOOD - Respects user preferences
export function MyComponent() {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return <div>{content}</div>
  }

  return (
    <motion.div animate={{ opacity: 1 }}>
      {content}
    </motion.div>
  )
}
```

### Pitfall 2: Not Using Constants
```typescript
// ❌ BAD - Magic numbers
transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}

// ✅ GOOD - Named constants
transition={{
  duration: ANIMATION_CONFIG.duration.standard,
  ease: ANIMATION_CONFIG.easing,
}}
```

### Pitfall 3: Missing Mobile Optimization
```typescript
// ❌ BAD - Same timing for all devices
transition={{ duration: 0.6 }}

// ✅ GOOD - Faster on mobile
transition={{
  duration: isMobile
    ? ANIMATION_CONFIG.mobile.duration.standard
    : ANIMATION_CONFIG.duration.standard,
}}
```

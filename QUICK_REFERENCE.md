# Quick Reference Guide - Refactored Architecture

## New Imports Available

### 1. Motion Preferences Hook
```typescript
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const prefersReducedMotion = usePrefersReducedMotion()
// Returns: boolean (true if user prefers reduced motion)
```

### 2. Breakpoint Constants
```typescript
import { BREAKPOINTS, IS_MOBILE, IS_TABLET, IS_DESKTOP } from '@/constants/breakpoints'

BREAKPOINTS.sm   // 640
BREAKPOINTS.md   // 768
BREAKPOINTS.lg   // 1024
BREAKPOINTS.xl   // 1280
BREAKPOINTS['2xl'] // 1536

IS_MOBILE(768)   // false
IS_TABLET(900)   // true
IS_DESKTOP(1200) // true
```

### 3. Animation Configuration
```typescript
import { ANIMATION_CONFIG } from '@/constants/animations'

// Durations
ANIMATION_CONFIG.duration.quick      // 0.3
ANIMATION_CONFIG.duration.standard   // 0.6
ANIMATION_CONFIG.duration.slow       // 0.8
ANIMATION_CONFIG.duration.hero       // 1.2

// Mobile Durations (faster)
ANIMATION_CONFIG.mobile.duration.standard // 0.4

// Delays
ANIMATION_CONFIG.delay.short   // 0.1
ANIMATION_CONFIG.delay.medium  // 0.2
ANIMATION_CONFIG.delay.long    // 0.3

// Easing
ANIMATION_CONFIG.easing  // [0.4, 0, 0.2, 1]
```

## New CSS Classes

### Section Padding
```html
<!-- Standard section padding -->
<section className="section-padding">
  <!-- px-6 sm:px-8 lg:px-16 py-20 sm:py-24 -->
</section>

<!-- Compact section padding -->
<section className="section-padding-compact">
  <!-- px-6 sm:px-8 lg:px-16 py-12 sm:py-16 -->
</section>
```

## Common Patterns

### Pattern 1: Animated Component with Reduced Motion Support
```typescript
'use client'

import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { ANIMATION_CONFIG } from '@/constants/animations'

export function MyComponent() {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return <div className="my-content">{content}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: ANIMATION_CONFIG.duration.standard,
        ease: ANIMATION_CONFIG.easing,
      }}
      className="my-content"
    >
      {content}
    </motion.div>
  )
}
```

### Pattern 2: Mobile-Optimized Animations
```typescript
import { useState, useEffect } from 'react'
import { ANIMATION_CONFIG } from '@/constants/animations'
import { IS_MOBILE } from '@/constants/breakpoints'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(IS_MOBILE(window.innerWidth))
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile
}

export function MyComponent() {
  const isMobile = useIsMobile()

  return (
    <motion.div
      transition={{
        duration: isMobile
          ? ANIMATION_CONFIG.mobile.duration.standard
          : ANIMATION_CONFIG.duration.standard,
        ease: ANIMATION_CONFIG.easing,
      }}
    >
      {content}
    </motion.div>
  )
}
```

### Pattern 3: Section with Standard Layout
```tsx
<section className="min-h-screen w-full section-padding bg-primary-dark">
  <div className="max-w-3xl mx-auto">
    <h2 className="text-h2 mb-12">Section Title</h2>
    <p className="text-body">Section content...</p>
  </div>
</section>
```

## Migration Examples

### Before (Duplicated Hook)
```typescript
// Old way - duplicated in every component
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
```

### After (Shared Import)
```typescript
// New way - single import
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

// Use it
const prefersReducedMotion = usePrefersReducedMotion()
```

## File Locations Reference

```
website/src/
├── hooks/
│   ├── usePrefersReducedMotion.ts       ← Import this for motion preferences
│   └── useSharedIntersectionObserver.ts ← Import this for scroll detection
│
├── constants/
│   ├── breakpoints.ts                   ← Import this for responsive checks
│   └── animations.ts                    ← Import this for animation config
│
├── components/
│   ├── AnimatedSection.tsx              ← Reference implementation
│   ├── HeroIllustration.tsx             ← Reference implementation
│   ├── FrameworkIcon.tsx                ← Reference implementation
│   └── ProblemSolutionDiagram.tsx       ← Reference implementation
│
└── app/
    ├── globals.css                      ← Contains .section-padding classes
    └── page.tsx                         ← Main page using components
```

## Tips & Best Practices

1. **Always check motion preferences** before animating
2. **Use animation constants** instead of hardcoded values
3. **Apply section padding classes** for consistent spacing
4. **Leverage TypeScript** - all constants are strongly typed
5. **Mobile-first** - check IS_MOBILE and use mobile animation timings

## Need Help?

- See full documentation: `REFACTORING_SUMMARY.md`
- Check component examples in: `src/components/`
- Review constants definitions in: `src/constants/`

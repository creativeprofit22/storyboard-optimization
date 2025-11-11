export const ANIMATION_CONFIG = {
  easing: [0.4, 0, 0.2, 1] as const,
  duration: {
    quick: 0.3,
    standard: 0.6,
    slow: 0.8,
    hero: 1.2,
  },
  delay: {
    immediate: 0,
    short: 0.1,
    medium: 0.2,
    long: 0.3,
  },
  mobile: {
    duration: {
      quick: 0.2,
      standard: 0.4,
      slow: 0.6,
    },
    delay: {
      short: 0.05,
      medium: 0.1,
    }
  }
} as const

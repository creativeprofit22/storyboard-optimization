export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export const IS_MOBILE = (width: number) => width < BREAKPOINTS.md
export const IS_TABLET = (width: number) => width >= BREAKPOINTS.md && width < BREAKPOINTS.lg
export const IS_DESKTOP = (width: number) => width >= BREAKPOINTS.lg

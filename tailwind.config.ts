import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#1a1a2e',
          light: '#f8f7f4',
        },
        accent: {
          orange: '#ff6b35',
          purple: '#7c3aed',
        },
        state: {
          success: '#10b981',
          error: '#ef4444',
          info: '#3b82f6',
        },
        neutral: {
          50: '#f8f7f4',
          200: '#f3f4f6',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
        },
      },
      fontFamily: {
        clash: ['Clash Grotesk', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'h1': ['72px', { lineHeight: '1.2', letterSpacing: '-2px' }],
        'h2': ['48px', { lineHeight: '1.3', letterSpacing: '-1px' }],
        'h3': ['36px', { lineHeight: '1.4' }],
        'h4': ['28px', { lineHeight: '1.4' }],
        'h5': ['22px', { lineHeight: '1.5' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        'body': ['16px', { lineHeight: '1.6' }],
        'body-sm': ['14px', { lineHeight: '1.6' }],
        'caption': ['12px', { lineHeight: '1.5', letterSpacing: '0.5px' }],
      },
      spacing: {
        'xs': '8px',
        'sm': '16px',
        'md': '24px',
        'lg': '40px',
        'xl': '60px',
      },
      animation: {
        'pulse-down': 'pulse-down 2s ease-in-out infinite',
        'spin-slow': 'spin 1.5s linear infinite',
      },
      keyframes: {
        'pulse-down': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '1' },
          '50%': { transform: 'translateY(10px)', opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
export default config

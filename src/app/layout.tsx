import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-clash' })

export const metadata: Metadata = {
  title: 'Storyboard Optimization Brief',
  description: 'Research revealing how current storyboarding tools are killing creativity',
  openGraph: {
    title: 'Storyboard Optimization Brief',
    description: 'Research revealing how current storyboarding tools are killing creativity',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-inter bg-primary-dark text-primary-light`}>
        {children}
      </body>
    </html>
  )
}

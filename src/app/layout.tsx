import type { Metadata } from 'next'
import { Inter, Clash_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const clash = Clash_Grotesk({ subsets: ['latin'], variable: '--font-clash' })

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
      <body className={`${inter.variable} ${clash.variable} font-inter bg-primary-dark text-primary-light`}>
        {children}
      </body>
    </html>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main>
      {/* Hero Section */}
      <section className="h-screen w-full bg-primary-dark flex items-center justify-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto px-4"
        >
          <h1 className="text-h1 text-accent-orange mb-6 font-clash font-bold">
            THEY'RE CONNING YOU, MATE.
          </h1>
          <p className="text-2xl text-primary-light opacity-90 font-clash font-semibold mb-4">
            Your storyboard tool just made you think you're being productive. It's brilliant at that. The problem is, you're not.
          </p>
          <p className="text-body-lg text-primary-light opacity-80 max-w-xl mx-auto">
            Your Adobe. Your Firefly. Whatever the hell you're using to knock out storyboards. They've convinced you that this grinding, tedious, repetitive process that eats your day is somehow speeding you up.
          </p>
        </motion.div>

        {/* Scroll Cue */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="text-accent-orange text-3xl">↓</div>
        </motion.div>
      </section>

      {/* Coming Soon */}
      <section className="min-h-screen w-full bg-primary-light flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-h2 text-primary-dark font-clash font-bold mb-4">
            Building something powerful...
          </h2>
          <p className="text-body text-primary-dark opacity-70">
            The full presentation is coming soon. Check back in a few weeks.
          </p>
        </motion.div>
      </section>
    </main>
  )
}

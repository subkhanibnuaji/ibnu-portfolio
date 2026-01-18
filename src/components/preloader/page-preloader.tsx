'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// ============================================
// PRELOADER VARIANTS
// ============================================

// Cyber/Tech Preloader
export function CyberPreloader() {
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingText, setLoadingText] = useState('Initializing')

  useEffect(() => {
    const texts = [
      'Initializing',
      'Loading assets',
      'Preparing interface',
      'Almost ready',
      'Welcome',
    ]

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 15 + 5
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        setLoadingText(texts[Math.floor((next / 100) * texts.length)])
        return next
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
          >
            <div className="relative">
              {/* Glowing orb */}
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-purple-500 to-cyan-500"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(0, 212, 255, 0.3)',
                    '0 0 60px rgba(0, 212, 255, 0.5)',
                    '0 0 20px rgba(0, 212, 255, 0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Inner ring */}
              <motion.div
                className="absolute inset-2 rounded-full border-2 border-white/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              {/* Outer ring */}
              <motion.div
                className="absolute -inset-4 rounded-full border border-primary/30"
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              >
                {[0, 90, 180, 270].map((deg) => (
                  <div
                    key={deg}
                    className="absolute w-2 h-2 bg-primary rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${deg}deg) translateX(48px) translateY(-50%)`,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Brand */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent"
          >
            IBNU PORTFOLIO
          </motion.h1>

          {/* Loading text */}
          <motion.p
            key={loadingText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground mb-6"
          >
            {loadingText}...
          </motion.p>

          {/* Progress bar */}
          <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-purple-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          {/* Percentage */}
          <motion.span
            className="text-xs text-muted-foreground mt-2 font-mono"
            key={Math.round(progress)}
          >
            {Math.round(progress)}%
          </motion.span>

          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Grid */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `
                  linear-gradient(to right, currentColor 1px, transparent 1px),
                  linear-gradient(to bottom, currentColor 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }}
            />
            {/* Scan line */}
            <motion.div
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Minimal Preloader
export function MinimalPreloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed inset-0 z-[9999] bg-background flex items-center justify-center"
        >
          <motion.div
            className="flex gap-1"
            initial="hidden"
            animate="visible"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-primary"
                animate={{
                  y: [0, -12, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Logo Reveal Preloader
export function LogoRevealPreloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            clipPath: 'circle(0% at 50% 50%)',
            transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
          }}
          className="fixed inset-0 z-[9999] bg-background flex items-center justify-center"
        >
          <div className="relative">
            {/* Reveal mask */}
            <motion.div
              className="text-6xl font-black"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0)' }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            >
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                IBNU
              </span>
            </motion.div>

            {/* Underline */}
            <motion.div
              className="h-1 bg-gradient-to-r from-primary to-purple-500 mt-2"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Gradient Wipe Preloader
export function GradientWipePreloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <>
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[9999] bg-gradient-to-r from-primary via-purple-500 to-cyan-500"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[9998] bg-background flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-bold"
            >
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Loading...
              </span>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Counter Preloader
export function CounterPreloader() {
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const duration = 1500
    const steps = 100
    const interval = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current++
      setCount(current)
      if (current >= 100) {
        clearInterval(timer)
        setTimeout(() => setIsLoading(false), 300)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-background flex items-center justify-center"
        >
          <motion.span
            className="text-8xl font-black font-mono tabular-nums"
            key={count}
          >
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              {count.toString().padStart(3, '0')}
            </span>
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================
// MAIN PRELOADER COMPONENT
// ============================================
type PreloaderVariant = 'cyber' | 'minimal' | 'logo' | 'gradient' | 'counter'

interface PagePreloaderProps {
  variant?: PreloaderVariant
  onComplete?: () => void
}

export function PagePreloader({
  variant = 'cyber',
  onComplete,
}: PagePreloaderProps) {
  useEffect(() => {
    // Hide preloader after content loads
    const handleLoad = () => {
      setTimeout(() => onComplete?.(), 100)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [onComplete])

  switch (variant) {
    case 'minimal':
      return <MinimalPreloader />
    case 'logo':
      return <LogoRevealPreloader />
    case 'gradient':
      return <GradientWipePreloader />
    case 'counter':
      return <CounterPreloader />
    case 'cyber':
    default:
      return <CyberPreloader />
  }
}

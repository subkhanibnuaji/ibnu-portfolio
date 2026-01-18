'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 300)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Navigation progress bar
export function NavigationProgress() {
  const [isNavigating, setIsNavigating] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    setIsNavigating(true)
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + Math.random() * 30
      })
    }, 100)

    // Complete after a short delay
    const timer = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setIsNavigating(false)
        setProgress(0)
      }, 200)
    }, 300)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [pathname])

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 h-1 z-[45] pointer-events-none"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Page loading skeleton
export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-8 p-8">
      {/* Header skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded-lg w-1/3" />
        <div className="h-4 bg-muted rounded-lg w-2/3" />
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-40 bg-muted rounded-xl" />
            <div className="h-4 bg-muted rounded-lg w-3/4" />
            <div className="h-3 bg-muted rounded-lg w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Scroll restoration
export function ScrollRestoration() {
  const pathname = usePathname()

  useEffect(() => {
    // Store scroll position before navigation
    const scrollPositions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}')

    // Restore scroll position
    const savedPosition = scrollPositions[pathname]
    if (savedPosition) {
      window.scrollTo(0, savedPosition)
    } else {
      window.scrollTo(0, 0)
    }

    // Save scroll position on scroll
    const handleScroll = () => {
      scrollPositions[pathname] = window.scrollY
      sessionStorage.setItem('scrollPositions', JSON.stringify(scrollPositions))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  return null
}

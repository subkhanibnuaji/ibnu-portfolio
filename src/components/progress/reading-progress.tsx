'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ReadingProgressProps {
  showPercentage?: boolean
  position?: 'top' | 'bottom'
  height?: number
  color?: string
  backgroundColor?: string
}

export function ReadingProgress({
  showPercentage = true,
  position = 'top',
  height = 3,
  color,
  backgroundColor,
}: ReadingProgressProps = {}) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const [percentage, setPercentage] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setPercentage(Math.round(v * 100))
      setIsVisible(v > 0.02 && v < 0.98)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <>
      {/* Progress Bar */}
      <div
        className={cn(
          'fixed left-0 right-0 z-[100] pointer-events-none',
          position === 'top' ? 'top-0' : 'bottom-0'
        )}
        style={{ height }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundColor: backgroundColor || 'rgba(0, 0, 0, 0.1)' }}
        />
        <motion.div
          className="h-full origin-left"
          style={{
            scaleX,
            background: color || 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))',
          }}
        />
        {/* Glow effect */}
        <motion.div
          className="absolute top-0 h-full w-8 blur-sm origin-left"
          style={{
            scaleX,
            right: 0,
            background: color || 'hsl(var(--primary))',
            opacity: 0.5,
          }}
        />
      </div>

      {/* Percentage Indicator */}
      {showPercentage && (
        <motion.div
          initial={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
          animate={{
            opacity: isVisible ? 1 : 0,
            y: isVisible ? 0 : (position === 'top' ? -20 : 20),
          }}
          className={cn(
            'fixed right-4 z-[100] px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg',
            position === 'top' ? 'top-4' : 'bottom-4'
          )}
        >
          <span className="text-sm font-medium text-primary">{percentage}%</span>
        </motion.div>
      )}
    </>
  )
}

// Circular Progress Indicator
interface CircularProgressProps {
  showInCorner?: boolean
}

export function CircularReadingProgress({ showInCorner = true }: CircularProgressProps) {
  const { scrollYProgress } = useScroll()
  const [percentage, setPercentage] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setPercentage(Math.round(v * 100))
      setIsVisible(v > 0.02 && v < 0.98)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  const circumference = 2 * Math.PI * 18 // radius = 18

  if (!showInCorner) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
      }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100]"
    >
      <div className="relative w-12 h-12">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
          {/* Background circle */}
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-muted/30"
          />
          {/* Progress circle */}
          <motion.circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - percentage / 100)}
            className="drop-shadow-glow"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(280, 100%, 60%)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold">{percentage}</span>
        </div>
      </div>
    </motion.div>
  )
}

// Scroll to Top Button with Progress
export function ScrollToTopWithProgress() {
  const { scrollYProgress } = useScroll()
  const [percentage, setPercentage] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setPercentage(Math.round(v * 100))
      setIsVisible(v > 0.1)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const circumference = 2 * Math.PI * 20

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={scrollToTop}
      className="fixed bottom-24 right-4 z-[60] w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-shadow"
      title="Scroll to top"
    >
      <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
        {/* Background circle */}
        <circle
          cx="22"
          cy="22"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted/20"
        />
        {/* Progress circle */}
        <circle
          cx="22"
          cy="22"
          r="20"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percentage / 100)}
        />
      </svg>
      {/* Arrow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-4 h-4 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </div>
    </motion.button>
  )
}

'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

// ============================================
// TYPEWRITER EFFECT
// ============================================
interface TypewriterProps {
  text: string | string[]
  className?: string
  speed?: number
  delay?: number
  cursor?: boolean
  cursorChar?: string
  cursorClassName?: string
  loop?: boolean
  loopDelay?: number
  onComplete?: () => void
  startOnView?: boolean
}

export function Typewriter({
  text,
  className,
  speed = 50,
  delay = 0,
  cursor = true,
  cursorChar = '|',
  cursorClassName,
  loop = false,
  loopDelay = 2000,
  onComplete,
  startOnView = true,
}: TypewriterProps) {
  const texts = Array.isArray(text) ? text : [text]
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: !loop })

  useEffect(() => {
    if (startOnView && !isInView) return

    const currentText = texts[textIndex]
    let timeout: NodeJS.Timeout

    if (!isTyping && !isDeleting && displayText === '') {
      // Start typing after delay
      timeout = setTimeout(() => setIsTyping(true), delay)
    } else if (isTyping) {
      if (displayText.length < currentText.length) {
        // Type next character
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        }, speed)
      } else {
        // Finished typing
        setIsTyping(false)
        if (loop || textIndex < texts.length - 1) {
          timeout = setTimeout(() => setIsDeleting(true), loopDelay)
        } else {
          onComplete?.()
        }
      }
    } else if (isDeleting) {
      if (displayText.length > 0) {
        // Delete character
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, speed / 2)
      } else {
        // Finished deleting
        setIsDeleting(false)
        setTextIndex((prev) => (prev + 1) % texts.length)
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, isTyping, isDeleting, textIndex, texts, speed, delay, loop, loopDelay, onComplete, startOnView, isInView])

  return (
    <span ref={ref} className={cn('inline', className)}>
      {displayText}
      {cursor && (
        <motion.span
          className={cn('inline-block ml-0.5', cursorClassName)}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        >
          {cursorChar}
        </motion.span>
      )}
    </span>
  )
}

// ============================================
// SCRAMBLE TEXT
// ============================================
interface ScrambleTextProps {
  text: string
  className?: string
  scrambleSpeed?: number
  revealSpeed?: number
  characters?: string
  startOnView?: boolean
}

export function ScrambleText({
  text,
  className,
  scrambleSpeed = 30,
  revealSpeed = 50,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*',
  startOnView = true,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text.replace(/./g, ' '))
  const [revealedCount, setRevealedCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (startOnView && !isInView) return

    let scrambleInterval: NodeJS.Timeout
    let revealInterval: NodeJS.Timeout

    // Scramble unrevealed characters
    scrambleInterval = setInterval(() => {
      setDisplayText(prev => {
        return text
          .split('')
          .map((char, i) => {
            if (i < revealedCount) return char
            if (char === ' ') return ' '
            return characters[Math.floor(Math.random() * characters.length)]
          })
          .join('')
      })
    }, scrambleSpeed)

    // Gradually reveal characters
    revealInterval = setInterval(() => {
      setRevealedCount(prev => {
        if (prev >= text.length) {
          clearInterval(scrambleInterval)
          clearInterval(revealInterval)
          setDisplayText(text)
          return prev
        }
        return prev + 1
      })
    }, revealSpeed)

    return () => {
      clearInterval(scrambleInterval)
      clearInterval(revealInterval)
    }
  }, [text, characters, scrambleSpeed, revealSpeed, startOnView, isInView, revealedCount])

  return (
    <span ref={ref} className={cn('font-mono', className)}>
      {displayText}
    </span>
  )
}

// ============================================
// GRADIENT TEXT
// ============================================
interface GradientTextProps {
  text: string
  className?: string
  from?: string
  via?: string
  to?: string
  animate?: boolean
}

export function GradientText({
  text,
  className,
  from = 'from-primary',
  via,
  to = 'to-purple-500',
  animate = false,
}: GradientTextProps) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        from,
        via,
        to,
        animate && 'animate-gradient bg-[length:200%_auto]',
        className
      )}
    >
      {text}
    </span>
  )
}

// ============================================
// GLITCH TEXT
// ============================================
interface GlitchTextProps {
  text: string
  className?: string
  intensity?: 'low' | 'medium' | 'high'
}

export function GlitchText({ text, className, intensity = 'medium' }: GlitchTextProps) {
  const intensityValues = {
    low: { frequency: 5000, duration: 100 },
    medium: { frequency: 3000, duration: 200 },
    high: { frequency: 1000, duration: 300 },
  }

  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const { frequency, duration } = intensityValues[intensity]

    const glitchInterval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), duration)
    }, frequency)

    return () => clearInterval(glitchInterval)
  }, [intensity])

  return (
    <span className={cn('relative inline-block', className)}>
      <span className="relative z-10">{text}</span>
      {isGlitching && (
        <>
          <span
            className="absolute inset-0 text-cyan-500 z-20"
            style={{
              clipPath: 'inset(20% 0 30% 0)',
              transform: 'translate(-2px, 0)',
            }}
            aria-hidden
          >
            {text}
          </span>
          <span
            className="absolute inset-0 text-red-500 z-20"
            style={{
              clipPath: 'inset(50% 0 10% 0)',
              transform: 'translate(2px, 0)',
            }}
            aria-hidden
          >
            {text}
          </span>
        </>
      )}
    </span>
  )
}

// ============================================
// HIGHLIGHT TEXT
// ============================================
interface HighlightTextProps {
  text: string
  highlight: string | string[]
  className?: string
  highlightClassName?: string
}

export function HighlightText({
  text,
  highlight,
  className,
  highlightClassName = 'bg-primary/20 text-primary px-1 rounded',
}: HighlightTextProps) {
  const highlights = Array.isArray(highlight) ? highlight : [highlight]
  const regex = new RegExp(`(${highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  const parts = text.split(regex)

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const isHighlighted = highlights.some(h => h.toLowerCase() === part.toLowerCase())
        return isHighlighted ? (
          <mark key={i} className={highlightClassName}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      })}
    </span>
  )
}

// ============================================
// COUNTING TEXT
// ============================================
interface CountingTextProps {
  value: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  startOnView?: boolean
}

export function CountingText({
  value,
  className,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 2,
  startOnView = true,
}: CountingTextProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const hasStarted = useRef(false)

  useEffect(() => {
    if (startOnView && !isInView) return
    if (hasStarted.current) return
    hasStarted.current = true

    const startTime = Date.now()
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(value * eased)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    animate()
  }, [value, duration, startOnView, isInView])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  )
}

// ============================================
// MORPHING TEXT
// ============================================
interface MorphingTextProps {
  texts: string[]
  className?: string
  interval?: number
}

export function MorphingText({ texts, className, interval = 3000 }: MorphingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % texts.length)
    }, interval)
    return () => clearInterval(timer)
  }, [texts.length, interval])

  return (
    <span className={cn('relative inline-block', className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
          transition={{ duration: 0.5 }}
          className="inline-block"
        >
          {texts[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

// ============================================
// WAVE TEXT
// ============================================
interface WaveTextProps {
  text: string
  className?: string
  delay?: number
}

export function WaveText({ text, className, delay = 0.05 }: WaveTextProps) {
  return (
    <span className={cn('inline-flex', className)}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 0.5,
            delay: i * delay,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

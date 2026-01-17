'use client'

import { useEffect, useRef, useState, createContext, useContext } from 'react'
import { motion, useInView, useAnimation, Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

// ============================================
// REVEAL VARIANTS
// ============================================
type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none'
type RevealType = 'fade' | 'slide' | 'scale' | 'rotate' | 'flip' | 'blur'

const createVariants = (
  direction: RevealDirection,
  type: RevealType,
  distance: number
): Variants => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance }
      case 'down':
        return { y: -distance }
      case 'left':
        return { x: distance }
      case 'right':
        return { x: -distance }
      default:
        return {}
    }
  }

  const getTypeStyles = (isHidden: boolean) => {
    switch (type) {
      case 'fade':
        return { opacity: isHidden ? 0 : 1 }
      case 'slide':
        return { opacity: isHidden ? 0 : 1 }
      case 'scale':
        return { opacity: isHidden ? 0 : 1, scale: isHidden ? 0.8 : 1 }
      case 'rotate':
        return { opacity: isHidden ? 0 : 1, rotate: isHidden ? -10 : 0 }
      case 'flip':
        return { opacity: isHidden ? 0 : 1, rotateX: isHidden ? 90 : 0 }
      case 'blur':
        return { opacity: isHidden ? 0 : 1, filter: isHidden ? 'blur(10px)' : 'blur(0px)' }
      default:
        return { opacity: isHidden ? 0 : 1 }
    }
  }

  return {
    hidden: {
      ...getInitialPosition(),
      ...getTypeStyles(true),
    },
    visible: {
      x: 0,
      y: 0,
      ...getTypeStyles(false),
    },
  }
}

// ============================================
// SCROLL REVEAL COMPONENT
// ============================================
interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  direction?: RevealDirection
  type?: RevealType
  delay?: number
  duration?: number
  distance?: number
  once?: boolean
  threshold?: number
}

export function ScrollReveal({
  children,
  className,
  direction = 'up',
  type = 'fade',
  delay = 0,
  duration = 0.6,
  distance = 50,
  once = true,
  threshold = 0.2,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    } else if (!once) {
      controls.start('hidden')
    }
  }, [isInView, controls, once])

  const variants = createVariants(direction, type, distance)

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// STAGGER REVEAL CONTAINER
// ============================================
interface StaggerRevealProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  containerDelay?: number
  once?: boolean
}

export function StaggerReveal({
  children,
  className,
  staggerDelay = 0.1,
  containerDelay = 0,
  once = true,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: containerDelay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerRevealItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// PARALLAX SCROLL
// ============================================
interface ParallaxProps {
  children: React.ReactNode
  className?: string
  speed?: number // negative = slower, positive = faster
  direction?: 'vertical' | 'horizontal'
}

export function ParallaxScroll({
  children,
  className,
  speed = 0.5,
  direction = 'vertical',
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const scrolled = window.innerHeight - rect.top
      setOffset(scrolled * speed * 0.1)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <motion.div
        style={{
          [direction === 'vertical' ? 'y' : 'x']: offset,
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// ============================================
// TEXT SPLIT REVEAL
// ============================================
interface TextSplitRevealProps {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  staggerDelay?: number
  once?: boolean
}

export function TextSplitReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  staggerDelay = 0.05,
  once = true,
}: TextSplitRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: 0.5 })
  const words = text.split(' ')

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={cn('flex flex-wrap', className)}
    >
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden mr-[0.25em]">
          <motion.span
            variants={{
              hidden: { y: '100%', opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className={cn('inline-block', wordClassName)}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  )
}

// ============================================
// CHARACTER REVEAL
// ============================================
interface CharRevealProps {
  text: string
  className?: string
  charClassName?: string
  delay?: number
  staggerDelay?: number
  once?: boolean
}

export function CharReveal({
  text,
  className,
  charClassName,
  delay = 0,
  staggerDelay = 0.02,
  once = true,
}: CharRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn('inline-block', charClassName)}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  )
}

// ============================================
// COUNTER ON SCROLL
// ============================================
interface CounterOnScrollProps {
  value: number
  className?: string
  prefix?: string
  suffix?: string
  duration?: number
  once?: boolean
}

export function CounterOnScroll({
  value,
  className,
  prefix = '',
  suffix = '',
  duration = 2,
  once = true,
}: CounterOnScrollProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once, amount: 0.5 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const startTime = Date.now()
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(value * eased))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    animate()
  }, [isInView, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

// ============================================
// PROGRESS BAR ON SCROLL
// ============================================
interface ProgressOnScrollProps {
  value: number
  className?: string
  barClassName?: string
  duration?: number
  once?: boolean
}

export function ProgressOnScroll({
  value,
  className,
  barClassName,
  duration = 1,
  once = true,
}: ProgressOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: 0.5 })

  return (
    <div ref={ref} className={cn('h-2 bg-muted rounded-full overflow-hidden', className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: isInView ? `${value}%` : 0 }}
        transition={{ duration, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn('h-full bg-primary rounded-full', barClassName)}
      />
    </div>
  )
}

// ============================================
// IMAGE REVEAL
// ============================================
interface ImageRevealProps {
  children: React.ReactNode
  className?: string
  direction?: 'left' | 'right' | 'top' | 'bottom'
  duration?: number
  once?: boolean
}

export function ImageReveal({
  children,
  className,
  direction = 'left',
  duration = 1,
  once = true,
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: 0.3 })

  const getClipPath = (revealed: boolean) => {
    if (revealed) return 'inset(0 0 0 0)'
    switch (direction) {
      case 'left':
        return 'inset(0 100% 0 0)'
      case 'right':
        return 'inset(0 0 0 100%)'
      case 'top':
        return 'inset(100% 0 0 0)'
      case 'bottom':
        return 'inset(0 0 100% 0)'
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: getClipPath(false) }}
      animate={{ clipPath: getClipPath(isInView) }}
      transition={{ duration, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn('overflow-hidden', className)}
    >
      <motion.div
        initial={{ scale: 1.2 }}
        animate={{ scale: isInView ? 1 : 1.2 }}
        transition={{ duration: duration * 1.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// ============================================
// SECTION DIVIDER REVEAL
// ============================================
interface DividerRevealProps {
  className?: string
  color?: string
  thickness?: number
  once?: boolean
}

export function DividerReveal({
  className,
  color = 'bg-primary',
  thickness = 1,
  once = true,
}: DividerRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: 0.5 })

  return (
    <div ref={ref} className={cn('relative w-full overflow-hidden', className)}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isInView ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ height: thickness }}
        className={cn('w-full origin-left', color)}
      />
    </div>
  )
}

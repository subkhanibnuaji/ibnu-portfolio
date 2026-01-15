'use client'

import { ReactNode, useRef } from 'react'
import { motion, useInView, Variants } from 'framer-motion'

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none'

interface SmoothRevealProps {
  children: ReactNode
  direction?: RevealDirection
  delay?: number
  duration?: number
  distance?: number
  once?: boolean
  className?: string
  threshold?: number
}

const getVariants = (direction: RevealDirection, distance: number): Variants => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {}
  }

  return {
    hidden: {
      opacity: 0,
      ...directions[direction]
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0
    }
  }
}

export function SmoothReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  distance = 50,
  once = true,
  className = '',
  threshold = 0.1
}: SmoothRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    once,
    amount: threshold
  })

  const variants = getVariants(direction, distance)

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger children reveal
export function StaggerReveal({
  children,
  staggerDelay = 0.1,
  direction = 'up',
  className = ''
}: {
  children: ReactNode[]
  staggerDelay?: number
  direction?: RevealDirection
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay
      }
    }
  }

  const itemVariants = getVariants(direction, 30)

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={className}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Text reveal with character animation
export function TextReveal({
  text,
  className = '',
  delay = 0,
  staggerDelay = 0.02
}: {
  text: string
  className?: string
  delay?: number
  staggerDelay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  const words = text.split(' ')

  return (
    <motion.div
      ref={ref}
      className={`flex flex-wrap ${className}`}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-2">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{
                duration: 0.3,
                delay: delay + (wordIndex * word.length + charIndex) * staggerDelay
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  )
}

// Line reveal (like highlight)
export function LineReveal({
  children,
  className = '',
  color = 'bg-primary'
}: {
  children: ReactNode
  className?: string
  color?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {children}
      <motion.span
        className={`absolute bottom-0 left-0 h-[30%] ${color} -z-10`}
        initial={{ width: 0 }}
        animate={{ width: isInView ? '100%' : 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
      />
    </span>
  )
}

// Blur reveal
export function BlurReveal({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// Scale reveal
export function ScaleReveal({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        type: 'spring',
        stiffness: 100,
        damping: 15
      }}
    >
      {children}
    </motion.div>
  )
}

// Mask reveal
export function MaskReveal({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%' }}
        animate={isInView ? { y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}

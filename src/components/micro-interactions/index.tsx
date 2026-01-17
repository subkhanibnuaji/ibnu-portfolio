'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

// ============================================
// RIPPLE EFFECT
// ============================================
interface RippleProps {
  color?: string
  duration?: number
}

export function useRipple({ color = 'rgba(255, 255, 255, 0.3)', duration = 600 }: RippleProps = {}) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])

  const createRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples(prev => [...prev, { x, y, id }])
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id))
    }, duration)
  }, [duration])

  const RippleContainer = () => (
    <span className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: color,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </span>
  )

  return { createRipple, RippleContainer }
}

// ============================================
// MAGNETIC BUTTON
// ============================================
interface MagneticProps {
  children: React.ReactNode
  className?: string
  strength?: number
}

export function MagneticButton({ children, className, strength = 0.3 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 150 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength
    x.set(deltaX)
    y.set(deltaY)
  }, [strength, x, y])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// TILT CARD
// ============================================
interface TiltCardProps {
  children: React.ReactNode
  className?: string
  maxTilt?: number
  scale?: number
  glare?: boolean
}

export function TiltCard({ children, className, maxTilt = 10, scale = 1.02, glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTilt({
      x: (y - 0.5) * maxTilt * 2,
      y: (x - 0.5) * -maxTilt * 2,
    })
    setGlarePosition({ x: x * 100, y: y * 100 })
  }, [maxTilt])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }, [])

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: isHovered ? scale : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={cn('relative', className)}
    >
      {children}
      {glare && isHovered && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
          }}
        />
      )}
    </motion.div>
  )
}

// ============================================
// GLOW EFFECT
// ============================================
interface GlowProps {
  children: React.ReactNode
  className?: string
  color?: string
}

export function GlowOnHover({ children, className, color = 'rgba(0, 212, 255, 0.5)' }: GlowProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn('relative overflow-hidden', className)}
    >
      {isHovered && (
        <div
          className="absolute pointer-events-none transition-opacity duration-300"
          style={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            left: mousePosition.x - 100,
            top: mousePosition.y - 100,
            opacity: 0.6,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ============================================
// TEXT REVEAL
// ============================================
interface TextRevealProps {
  text: string
  className?: string
  delay?: number
}

export function TextReveal({ text, className, delay = 0 }: TextRevealProps) {
  return (
    <span className={cn('inline-flex overflow-hidden', className)}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.03,
            ease: [0.33, 1, 0.68, 1],
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

// ============================================
// HOVER UNDERLINE
// ============================================
interface HoverUnderlineProps {
  children: React.ReactNode
  className?: string
  color?: string
}

export function HoverUnderline({ children, className, color = 'currentColor' }: HoverUnderlineProps) {
  return (
    <span className={cn('relative inline-block group', className)}>
      {children}
      <span
        className="absolute bottom-0 left-0 w-full h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        style={{ backgroundColor: color }}
      />
    </span>
  )
}

// ============================================
// PULSE DOT
// ============================================
interface PulseDotProps {
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

export function PulseDot({ color = 'bg-green-500', size = 'md' }: PulseDotProps) {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  return (
    <span className="relative flex">
      <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', color, sizes[size])} />
      <span className={cn('relative inline-flex rounded-full', color, sizes[size])} />
    </span>
  )
}

// ============================================
// ANIMATED COUNTER
// ============================================
interface AnimatedCounterProps {
  value: number
  className?: string
  duration?: number
}

export function AnimatedCounter({ value, className, duration = 1 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const startTime = Date.now()
          const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // Ease out cubic
            setDisplayValue(Math.floor(value * eased))
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          animate()
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, duration, hasAnimated])

  return <span ref={ref} className={className}>{displayValue.toLocaleString()}</span>
}

// ============================================
// SHIMMER EFFECT
// ============================================
interface ShimmerProps {
  children: React.ReactNode
  className?: string
}

export function ShimmerButton({ children, className }: ShimmerProps) {
  return (
    <button className={cn(
      'relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3 rounded-xl font-medium',
      'before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
      className
    )}>
      {children}
    </button>
  )
}

// ============================================
// FLOATING ANIMATION
// ============================================
interface FloatingProps {
  children: React.ReactNode
  className?: string
  duration?: number
  distance?: number
}

export function Floating({ children, className, duration = 3, distance = 10 }: FloatingProps) {
  return (
    <motion.div
      animate={{ y: [-distance, distance, -distance] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// STAGGER CHILDREN
// ============================================
interface StaggerProps {
  children: React.ReactNode
  className?: string
  delay?: number
  staggerDelay?: number
}

export function StaggerChildren({ children, className, delay = 0, staggerDelay = 0.1 }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
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

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// GLOBAL STYLES
// ============================================
export function MicroInteractionStyles() {
  return (
    <style jsx global>{`
      @keyframes ripple {
        0% {
          width: 0;
          height: 0;
          opacity: 0.5;
        }
        100% {
          width: 500px;
          height: 500px;
          opacity: 0;
        }
      }

      .animate-ripple {
        animation: ripple 0.6s ease-out forwards;
      }

      @keyframes shimmer {
        100% {
          transform: translateX(100%);
        }
      }

      .animate-shimmer {
        animation: shimmer 2s infinite;
      }

      /* Smooth selection */
      ::selection {
        background: rgba(0, 212, 255, 0.3);
        color: inherit;
      }

      /* Focus ring */
      *:focus-visible {
        outline: 2px solid hsl(var(--primary));
        outline-offset: 2px;
      }

      /* Smooth scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: transparent;
      }

      ::-webkit-scrollbar-thumb {
        background: hsl(var(--muted-foreground) / 0.3);
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: hsl(var(--muted-foreground) / 0.5);
      }

      /* Active state for buttons */
      button:active:not(:disabled) {
        transform: scale(0.98);
      }

      /* Link hover effect */
      a {
        transition: color 0.2s ease;
      }

      /* Card hover lift */
      .hover-lift {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .hover-lift:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      }
    `}</style>
  )
}

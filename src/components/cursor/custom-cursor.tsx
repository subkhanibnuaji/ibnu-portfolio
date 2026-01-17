'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CursorState {
  isHovering: boolean
  isClicking: boolean
  hoverType: 'default' | 'link' | 'button' | 'text' | 'image'
  text: string
}

export function CustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>({
    isHovering: false,
    isClicking: false,
    hoverType: 'default',
    text: '',
  })
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(true)

  // Mouse position with spring physics
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const springConfig = { damping: 25, stiffness: 300 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  // Trailing cursor (slower)
  const trailConfig = { damping: 35, stiffness: 200 }
  const trailXSpring = useSpring(cursorX, trailConfig)
  const trailYSpring = useSpring(cursorY, trailConfig)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setIsVisible(true)
    }

    // Mouse down/up handlers
    const handleMouseDown = () => {
      setCursorState(prev => ({ ...prev, isClicking: true }))
    }
    const handleMouseUp = () => {
      setCursorState(prev => ({ ...prev, isClicking: false }))
    }

    // Mouse leave handler
    const handleMouseLeave = () => {
      setIsVisible(false)
    }
    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    // Hover detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Check for links
      if (target.closest('a') || target.closest('[role="link"]')) {
        setCursorState(prev => ({ ...prev, isHovering: true, hoverType: 'link' }))
        return
      }

      // Check for buttons
      if (target.closest('button') || target.closest('[role="button"]') || target.closest('input[type="submit"]')) {
        setCursorState(prev => ({ ...prev, isHovering: true, hoverType: 'button' }))
        return
      }

      // Check for images
      if (target.closest('img') || target.closest('[data-cursor="image"]')) {
        setCursorState(prev => ({ ...prev, isHovering: true, hoverType: 'image' }))
        return
      }

      // Check for text inputs
      if (target.closest('input') || target.closest('textarea') || target.closest('[contenteditable="true"]')) {
        setCursorState(prev => ({ ...prev, isHovering: true, hoverType: 'text' }))
        return
      }

      // Check for custom cursor text
      const cursorText = target.getAttribute('data-cursor-text')
      if (cursorText) {
        setCursorState(prev => ({ ...prev, isHovering: true, text: cursorText }))
        return
      }

      setCursorState(prev => ({ ...prev, isHovering: false, hoverType: 'default', text: '' }))
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      window.removeEventListener('resize', checkMobile)
    }
  }, [cursorX, cursorY])

  // Don't render on mobile
  if (isMobile) return null

  const getCursorSize = () => {
    if (cursorState.isClicking) return 24
    if (cursorState.isHovering) {
      switch (cursorState.hoverType) {
        case 'link': return 48
        case 'button': return 56
        case 'image': return 80
        case 'text': return 4
        default: return 40
      }
    }
    return 12
  }

  const cursorSize = getCursorSize()

  return (
    <>
      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Main cursor dot */}
      <motion.div
        className={cn(
          'fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference',
          cursorState.hoverType === 'text' ? 'bg-primary' : 'bg-white'
        )}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: cursorSize,
          height: cursorSize,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      />

      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border-2 border-white/50 mix-blend-difference"
        style={{
          x: trailXSpring,
          y: trailYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: cursorState.isHovering ? cursorSize + 20 : 32,
          height: cursorState.isHovering ? cursorSize + 20 : 32,
          opacity: isVisible ? (cursorState.hoverType === 'text' ? 0 : 0.5) : 0,
          scale: cursorState.isClicking ? 0.8 : 1,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      />

      {/* Cursor text */}
      {cursorState.text && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9997] px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium whitespace-nowrap"
          style={{
            x: trailXSpring,
            y: trailYSpring,
            translateX: '-50%',
            translateY: 'calc(-50% + 40px)',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          {cursorState.text}
        </motion.div>
      )}

      {/* Glow effect on hover */}
      {cursorState.isHovering && cursorState.hoverType !== 'text' && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9996] rounded-full"
          style={{
            x: trailXSpring,
            y: trailYSpring,
            translateX: '-50%',
            translateY: '-50%',
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
          }}
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{ width: 150, height: 150, opacity: 1 }}
          exit={{ width: 0, height: 0, opacity: 0 }}
        />
      )}
    </>
  )
}

// Spotlight Effect Component
export function SpotlightEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsActive(true)
    const handleMouseLeave = () => setIsActive(false)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] transition-opacity duration-300"
      style={{
        opacity: isActive ? 1 : 0,
        background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 212, 255, 0.03), transparent 80%)`,
      }}
    />
  )
}

// Magnetic Effect Wrapper
interface MagneticProps {
  children: React.ReactNode
  className?: string
  strength?: number
}

export function Magnetic({ children, className, strength = 0.5 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { damping: 20, stiffness: 200 })
  const springY = useSpring(y, { damping: 20, stiffness: 200 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * strength)
    y.set((e.clientY - centerY) * strength)
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

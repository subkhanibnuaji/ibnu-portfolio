'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface AnimatedGradientProps {
  colors?: string[]
  speed?: number
  blur?: number
  className?: string
}

// CSS-based animated gradient
export function AnimatedGradient({
  colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#3b82f6'],
  speed = 10,
  className = ''
}: AnimatedGradientProps) {
  return (
    <div
      className={`absolute inset-0 -z-10 ${className}`}
      style={{
        background: `linear-gradient(270deg, ${colors.join(', ')})`,
        backgroundSize: '400% 400%',
        animation: `gradientShift ${speed}s ease infinite`
      }}
    >
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )
}

// Mesh gradient background
export function MeshGradient({
  className = ''
}: {
  className?: string
}) {
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(at 40% 20%, hsla(228, 100%, 74%, 0.3) 0px, transparent 50%),
            radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 0.3) 0px, transparent 50%),
            radial-gradient(at 0% 50%, hsla(355, 100%, 93%, 0.3) 0px, transparent 50%),
            radial-gradient(at 80% 50%, hsla(340, 100%, 76%, 0.3) 0px, transparent 50%),
            radial-gradient(at 0% 100%, hsla(22, 100%, 77%, 0.3) 0px, transparent 50%),
            radial-gradient(at 80% 100%, hsla(242, 100%, 70%, 0.3) 0px, transparent 50%),
            radial-gradient(at 0% 0%, hsla(343, 100%, 76%, 0.3) 0px, transparent 50%)
          `
        }}
      />
    </div>
  )
}

// Aurora/Northern lights effect
export function AuroraBackground({
  className = ''
}: {
  className?: string
}) {
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent" />
      <motion.div
        className="absolute -top-1/2 left-0 right-0 h-full"
        style={{
          background: `
            linear-gradient(
              180deg,
              transparent,
              rgba(59, 130, 246, 0.1) 30%,
              rgba(139, 92, 246, 0.15) 50%,
              rgba(236, 72, 153, 0.1) 70%,
              transparent
            )
          `,
          filter: 'blur(100px)'
        }}
        animate={{
          y: ['0%', '10%', '0%'],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      <motion.div
        className="absolute -top-1/4 left-1/4 w-1/2 h-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(59, 130, 246, 0.2), transparent 70%)',
          filter: 'blur(80px)'
        }}
        animate={{
          x: ['-10%', '10%', '-10%'],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}

// Blob gradient animation
export function BlobGradient({
  className = ''
}: {
  className?: string
}) {
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <motion.div
        className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500/30 rounded-full filter blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      <motion.div
        className="absolute top-1/2 -right-20 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, 100, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      <motion.div
        className="absolute -bottom-20 left-1/3 w-80 h-80 bg-pink-500/30 rounded-full filter blur-3xl"
        animate={{
          x: [0, 80, 0],
          y: [0, -50, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}

// Gradient text
export function GradientText({
  children,
  colors = ['#3b82f6', '#8b5cf6', '#ec4899'],
  animate = false,
  className = ''
}: {
  children: React.ReactNode
  colors?: string[]
  animate?: boolean
  className?: string
}) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
        backgroundSize: animate ? '200% auto' : '100%',
        animation: animate ? 'gradientText 3s ease infinite' : 'none'
      }}
    >
      {children}
      {animate && (
        <style jsx>{`
          @keyframes gradientText {
            0%, 100% { background-position: 0% center; }
            50% { background-position: 100% center; }
          }
        `}</style>
      )}
    </span>
  )
}

// Spotlight effect
export function SpotlightEffect({
  className = ''
}: {
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      container.style.setProperty('--mouse-x', `${x}px`)
      container.style.setProperty('--mouse-y', `${y}px`)
    }

    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 -z-10 overflow-hidden ${className}`}
      style={{
        background: `
          radial-gradient(
            600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(59, 130, 246, 0.1),
            transparent 40%
          )
        `
      }}
    />
  )
}

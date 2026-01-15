'use client'

import { useRef, useState, ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  tiltAmount?: number
  perspective?: number
  scale?: number
  glareEnable?: boolean
  glareMaxOpacity?: number
}

export function TiltCard({
  children,
  className = '',
  tiltAmount = 20,
  perspective = 1000,
  scale = 1.05,
  glareEnable = true,
  glareMaxOpacity = 0.35
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 })

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [tiltAmount, -tiltAmount])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-tiltAmount, tiltAmount])

  const glareX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%'])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      style={{
        perspective,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        animate={{ scale: isHovered ? scale : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="relative w-full h-full"
      >
        {children}

        {/* Glare effect */}
        {glareEnable && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-inherit overflow-hidden"
            style={{
              opacity: isHovered ? glareMaxOpacity : 0,
              background: `
                radial-gradient(
                  farthest-corner circle at var(--glare-x, 50%) var(--glare-y, 50%),
                  rgba(255, 255, 255, 0.8) 10%,
                  rgba(255, 255, 255, 0.65) 20%,
                  rgba(255, 255, 255, 0) 90%
                )
              `,
              // @ts-ignore
              '--glare-x': glareX,
              '--glare-y': glareY
            }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

// Simple hover lift card
export function HoverLiftCard({
  children,
  className = '',
  liftAmount = -8
}: {
  children: ReactNode
  className?: string
  liftAmount?: number
}) {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: liftAmount,
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.3)'
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  )
}

// Flip card
export function FlipCard({
  front,
  back,
  className = ''
}: {
  front: ReactNode
  back: ReactNode
  className?: string
}) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className={`relative cursor-pointer ${className}`}
      style={{ perspective: 1000 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  )
}

// Parallax card with layers
export function ParallaxCard({
  backgroundLayer,
  middleLayer,
  foregroundLayer,
  className = ''
}: {
  backgroundLayer: ReactNode
  middleLayer?: ReactNode
  foregroundLayer: ReactNode
  className?: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const bgX = useTransform(x, [-0.5, 0.5], ['-5%', '5%'])
  const bgY = useTransform(y, [-0.5, 0.5], ['-5%', '5%'])
  const midX = useTransform(x, [-0.5, 0.5], ['-10%', '10%'])
  const midY = useTransform(y, [-0.5, 0.5], ['-10%', '10%'])
  const fgX = useTransform(x, [-0.5, 0.5], ['-20%', '20%'])
  const fgY = useTransform(y, [-0.5, 0.5], ['-20%', '20%'])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background layer */}
      <motion.div
        className="absolute inset-0"
        style={{ x: bgX, y: bgY }}
      >
        {backgroundLayer}
      </motion.div>

      {/* Middle layer */}
      {middleLayer && (
        <motion.div
          className="absolute inset-0"
          style={{ x: midX, y: midY }}
        >
          {middleLayer}
        </motion.div>
      )}

      {/* Foreground layer */}
      <motion.div
        className="relative z-10"
        style={{ x: fgX, y: fgY }}
      >
        {foregroundLayer}
      </motion.div>
    </div>
  )
}

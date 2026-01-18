'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Floating Orbs Background
export function FloatingOrbs({ className }: { className?: string }) {
  const orbs = useMemo(() => [
    { size: 300, x: '10%', y: '20%', color: 'from-primary/20 to-transparent', delay: 0 },
    { size: 400, x: '80%', y: '30%', color: 'from-purple-500/15 to-transparent', delay: 2 },
    { size: 250, x: '50%', y: '70%', color: 'from-cyan-500/20 to-transparent', delay: 4 },
    { size: 350, x: '20%', y: '80%', color: 'from-pink-500/15 to-transparent', delay: 1 },
    { size: 280, x: '70%', y: '60%', color: 'from-emerald-500/15 to-transparent', delay: 3 },
  ], [])

  return (
    <div className={cn('fixed inset-0 pointer-events-none overflow-hidden -z-10', className)}>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={cn(
            'absolute rounded-full bg-gradient-radial blur-3xl',
            orb.color
          )}
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 20,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Particle Field
export function ParticleField({
  className,
  particleCount = 50,
}: {
  className?: string
  particleCount?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
    }

    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }))

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`
        ctx.fill()

        // Connect nearby particles
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance / 100)})`
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [particleCount])

  return (
    <canvas
      ref={canvasRef}
      className={cn('fixed inset-0 pointer-events-none -z-10', className)}
    />
  )
}

// Gradient Mesh
export function GradientMesh({ className }: { className?: string }) {
  return (
    <div className={cn('fixed inset-0 pointer-events-none overflow-hidden -z-10', className)}>
      <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
          </filter>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(280, 100%, 50%)" />
          </linearGradient>
          <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(180, 100%, 50%)" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>
        <g filter="url(#goo)">
          <motion.circle
            cx="20%"
            cy="30%"
            r="15%"
            fill="url(#gradient1)"
            animate={{
              cx: ['20%', '30%', '20%'],
              cy: ['30%', '40%', '30%'],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="70%"
            cy="60%"
            r="20%"
            fill="url(#gradient2)"
            animate={{
              cx: ['70%', '60%', '70%'],
              cy: ['60%', '50%', '60%'],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="50%"
            cy="80%"
            r="12%"
            fill="url(#gradient1)"
            animate={{
              cx: ['50%', '55%', '50%'],
              cy: ['80%', '75%', '80%'],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>
      </svg>
    </div>
  )
}

// Grid Pattern
export function GridPattern({ className }: { className?: string }) {
  return (
    <div className={cn('fixed inset-0 pointer-events-none -z-10', className)}>
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Radial fade */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background" />
    </div>
  )
}

// Aurora Effect
export function AuroraEffect({ className }: { className?: string }) {
  return (
    <div className={cn('fixed inset-0 pointer-events-none overflow-hidden -z-10', className)}>
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
        style={{
          background: `
            linear-gradient(
              45deg,
              transparent 30%,
              rgba(0, 212, 255, 0.03) 40%,
              rgba(139, 92, 246, 0.03) 50%,
              rgba(236, 72, 153, 0.03) 60%,
              transparent 70%
            )
          `,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
        style={{
          background: `
            linear-gradient(
              -45deg,
              transparent 30%,
              rgba(16, 185, 129, 0.03) 40%,
              rgba(0, 212, 255, 0.03) 50%,
              rgba(139, 92, 246, 0.03) 60%,
              transparent 70%
            )
          `,
        }}
        animate={{
          rotate: [360, 0],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}

// Noise Overlay
export function NoiseOverlay({ className, opacity = 0.02 }: { className?: string; opacity?: number }) {
  return (
    <div
      className={cn('fixed inset-0 pointer-events-none z-50', className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity,
      }}
    />
  )
}

// Combined Background Component
interface AnimatedBackgroundProps {
  variant?: 'orbs' | 'particles' | 'mesh' | 'grid' | 'aurora' | 'minimal'
  showNoise?: boolean
  className?: string
}

export function AnimatedBackground({
  variant = 'minimal',
  showNoise = true,
  className,
}: AnimatedBackgroundProps) {
  return (
    <>
      {variant === 'orbs' && <FloatingOrbs className={className} />}
      {variant === 'particles' && <ParticleField className={className} />}
      {variant === 'mesh' && <GradientMesh className={className} />}
      {variant === 'grid' && <GridPattern className={className} />}
      {variant === 'aurora' && <AuroraEffect className={className} />}
      {variant === 'minimal' && (
        <>
          <FloatingOrbs className={cn('opacity-50', className)} />
          <GridPattern className={className} />
        </>
      )}
      {showNoise && <NoiseOverlay />}
    </>
  )
}

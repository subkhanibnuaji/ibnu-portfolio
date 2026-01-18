'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  shape: 'square' | 'circle' | 'triangle' | 'star'
  opacity: number
}

const COLORS = [
  '#00d4ff', // cyan
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#3b82f6', // blue
]

const SHAPES: Particle['shape'][] = ['square', 'circle', 'triangle', 'star']

export function useConfetti() {
  const [isActive, setIsActive] = useState(false)
  const [origin, setOrigin] = useState({ x: 0.5, y: 0.5 })

  const fire = useCallback((options?: { x?: number; y?: number }) => {
    setOrigin({
      x: options?.x ?? 0.5,
      y: options?.y ?? 0.5,
    })
    setIsActive(true)
    setTimeout(() => setIsActive(false), 3000)
  }, [])

  return { isActive, origin, fire }
}

interface ConfettiCanvasProps {
  isActive: boolean
  origin?: { x: number; y: number }
  particleCount?: number
  spread?: number
  duration?: number
}

export function ConfettiCanvas({
  isActive,
  origin = { x: 0.5, y: 0.5 },
  particleCount = 100,
  spread = 360,
  duration = 3000,
}: ConfettiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const originX = canvas.width * origin.x
    const originY = canvas.height * origin.y

    const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => {
      const angle = ((Math.random() * spread) - spread / 2) * (Math.PI / 180)
      const velocity = Math.random() * 15 + 10
      return {
        id: i,
        x: originX,
        y: originY,
        vx: Math.cos(angle - Math.PI / 2) * velocity,
        vy: Math.sin(angle - Math.PI / 2) * velocity - 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        opacity: 1,
      }
    })

    const startTime = Date.now()
    let animationId: number

    const drawShape = (p: Particle) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.fillStyle = p.color
      ctx.globalAlpha = p.opacity

      switch (p.shape) {
        case 'square':
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
          break
        case 'circle':
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
          break
        case 'triangle':
          ctx.beginPath()
          ctx.moveTo(0, -p.size / 2)
          ctx.lineTo(-p.size / 2, p.size / 2)
          ctx.lineTo(p.size / 2, p.size / 2)
          ctx.closePath()
          ctx.fill()
          break
        case 'star':
          ctx.beginPath()
          for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
            const r = i % 2 === 0 ? p.size / 2 : p.size / 4
            ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
          }
          ctx.closePath()
          ctx.fill()
          break
      }

      ctx.restore()
    }

    const animate = () => {
      const elapsed = Date.now() - startTime
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        // Physics
        p.vy += 0.3 // gravity
        p.vx *= 0.99 // air resistance
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed
        p.opacity = Math.max(0, 1 - elapsed / duration)

        drawShape(p)
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [isActive, origin, particleCount, spread, duration])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  )
}

// Emoji Rain Effect
interface EmojiRainProps {
  isActive: boolean
  emojis?: string[]
  count?: number
  duration?: number
}

export function EmojiRain({
  isActive,
  emojis = ['🎉', '🎊', '✨', '🌟', '💫', '⭐'],
  count = 30,
  duration = 3000,
}: EmojiRainProps) {
  const [particles, setParticles] = useState<Array<{ id: number; emoji: string; x: number; delay: number }>>([])

  useEffect(() => {
    if (!isActive) {
      setParticles([])
      return
    }

    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
      }))
    )

    const timer = setTimeout(() => setParticles([]), duration)
    return () => clearTimeout(timer)
  }, [isActive, emojis, count, duration])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {particles.map(p => (
          <motion.span
            key={p.id}
            initial={{ y: -50, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
            animate={{ y: '110vh', rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: p.delay,
              ease: 'linear',
            }}
            className="absolute text-2xl"
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Fireworks Effect
export function Fireworks({ isActive }: { isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    interface Spark {
      x: number
      y: number
      vx: number
      vy: number
      color: string
      life: number
      maxLife: number
    }

    interface Rocket {
      x: number
      y: number
      vy: number
      color: string
      exploded: boolean
      sparks: Spark[]
    }

    const rockets: Rocket[] = []
    let animationId: number

    const createRocket = () => {
      rockets.push({
        x: Math.random() * canvas.width,
        y: canvas.height,
        vy: -(Math.random() * 5 + 10),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        exploded: false,
        sparks: [],
      })
    }

    const explode = (rocket: Rocket) => {
      const sparkCount = 50 + Math.floor(Math.random() * 30)
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount
        const velocity = Math.random() * 5 + 2
        rocket.sparks.push({
          x: rocket.x,
          y: rocket.y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          color: rocket.color,
          life: 60 + Math.random() * 30,
          maxLife: 60 + Math.random() * 30,
        })
      }
      rocket.exploded = true
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Create new rockets occasionally
      if (Math.random() < 0.03) {
        createRocket()
      }

      rockets.forEach((rocket, rIndex) => {
        if (!rocket.exploded) {
          // Draw rocket
          ctx.beginPath()
          ctx.arc(rocket.x, rocket.y, 3, 0, Math.PI * 2)
          ctx.fillStyle = rocket.color
          ctx.fill()

          // Update rocket
          rocket.y += rocket.vy
          rocket.vy += 0.1

          // Check for explosion
          if (rocket.vy >= 0) {
            explode(rocket)
          }
        } else {
          // Update and draw sparks
          rocket.sparks = rocket.sparks.filter(spark => {
            spark.x += spark.vx
            spark.y += spark.vy
            spark.vy += 0.05
            spark.life--

            const opacity = spark.life / spark.maxLife
            ctx.beginPath()
            ctx.arc(spark.x, spark.y, 2, 0, Math.PI * 2)
            ctx.fillStyle = spark.color + Math.floor(opacity * 255).toString(16).padStart(2, '0')
            ctx.fill()

            return spark.life > 0
          })

          // Remove rocket if all sparks are gone
          if (rocket.sparks.length === 0) {
            rockets.splice(rIndex, 1)
          }
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  )
}

// Global Celebration Provider
export function CelebrationProvider() {
  const [confetti, setConfetti] = useState(false)
  const [emojiRain, setEmojiRain] = useState(false)
  const [fireworks, setFireworks] = useState(false)
  const [origin, setOrigin] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const handleCelebrate = (e: CustomEvent) => {
      const type = e.detail?.type || 'confetti'
      const customOrigin = e.detail?.origin || { x: 0.5, y: 0.5 }
      setOrigin(customOrigin)

      switch (type) {
        case 'confetti':
          setConfetti(true)
          setTimeout(() => setConfetti(false), 3000)
          break
        case 'emoji':
          setEmojiRain(true)
          setTimeout(() => setEmojiRain(false), 3000)
          break
        case 'fireworks':
          setFireworks(true)
          setTimeout(() => setFireworks(false), 5000)
          break
        case 'all':
          setConfetti(true)
          setEmojiRain(true)
          setTimeout(() => {
            setConfetti(false)
            setEmojiRain(false)
          }, 3000)
          break
      }
    }

    window.addEventListener('celebrate' as any, handleCelebrate)
    return () => window.removeEventListener('celebrate' as any, handleCelebrate)
  }, [])

  return (
    <>
      <ConfettiCanvas isActive={confetti} origin={origin} />
      <EmojiRain isActive={emojiRain} />
      <Fireworks isActive={fireworks} />
    </>
  )
}

// Helper to trigger celebrations
export const celebrate = {
  confetti: (origin?: { x: number; y: number }) => {
    window.dispatchEvent(new CustomEvent('celebrate', { detail: { type: 'confetti', origin } }))
  },
  emoji: () => {
    window.dispatchEvent(new CustomEvent('celebrate', { detail: { type: 'emoji' } }))
  },
  fireworks: () => {
    window.dispatchEvent(new CustomEvent('celebrate', { detail: { type: 'fireworks' } }))
  },
  all: () => {
    window.dispatchEvent(new CustomEvent('celebrate', { detail: { type: 'all' } }))
  },
}

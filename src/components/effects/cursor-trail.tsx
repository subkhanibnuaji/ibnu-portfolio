'use client'

import { useEffect, useRef, useState } from 'react'

interface CursorTrailProps {
  color?: string
  particleCount?: number
  particleSize?: number
  fadeSpeed?: number
  trailLength?: number
}

export function CursorTrail({
  color = '#3b82f6',
  particleCount = 20,
  particleSize = 8,
  fadeSpeed = 0.02,
  trailLength = 35
}: CursorTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<Array<{
    x: number
    y: number
    alpha: number
    size: number
  }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }

      // Add new particle
      particlesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        alpha: 1,
        size: particleSize
      })

      // Limit particles
      if (particlesRef.current.length > trailLength) {
        particlesRef.current.shift()
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, i) => {
        // Fade out
        particle.alpha -= fadeSpeed
        particle.size *= 0.97

        if (particle.alpha > 0) {
          ctx.save()
          ctx.globalAlpha = particle.alpha
          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      })

      // Remove dead particles
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0)

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [color, particleSize, fadeSpeed, trailLength])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}

// Sparkle trail effect
export function SparkleTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Array<{
    x: number
    y: number
    vx: number
    vy: number
    alpha: number
    size: number
    color: string
  }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const colors = ['#ffd700', '#fff', '#87ceeb', '#ff69b4', '#00ff00']

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4 - 1,
          alpha: 1,
          size: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }

      if (particlesRef.current.length > 100) {
        particlesRef.current = particlesRef.current.slice(-100)
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.05 // gravity
        particle.alpha -= 0.02
        particle.size *= 0.98

        if (particle.alpha > 0) {
          ctx.save()
          ctx.globalAlpha = particle.alpha
          ctx.fillStyle = particle.color

          // Draw star shape
          ctx.beginPath()
          for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
            const radius = i % 2 === 0 ? particle.size : particle.size / 2
            const x = particle.x + Math.cos(angle) * radius
            const y = particle.y + Math.sin(angle) * radius
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
          ctx.fill()
          ctx.restore()
        }
      })

      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0)
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  )
}

// Rainbow trail
export function RainbowTrail() {
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([])
  const idRef = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTrail(prev => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: idRef.current++ }]
        return newTrail.slice(-20)
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {trail.map((point, i) => {
        const hue = (i / trail.length) * 360
        const size = (i / trail.length) * 20 + 5
        const opacity = i / trail.length

        return (
          <div
            key={point.id}
            className="absolute rounded-full"
            style={{
              left: point.x - size / 2,
              top: point.y - size / 2,
              width: size,
              height: size,
              backgroundColor: `hsla(${hue}, 100%, 50%, ${opacity})`,
              transition: 'all 0.1s ease-out'
            }}
          />
        )
      })}
    </div>
  )
}

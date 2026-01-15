'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
}

// Cyber/Crypto/AI themed colors
const COLORS = ['#00d4ff', '#a855f7', '#00ff88', '#f7931a', '#ec4899', '#6366f1']

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number | undefined>(undefined)

  const createParticle = useCallback((width: number, height: number): Particle => {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: Math.random() * 0.5 + 0.2,
    }
  }, [])

  const initParticles = useCallback((width: number, height: number) => {
    const count = Math.min(100, Math.floor((width * height) / 10000))
    particlesRef.current = Array.from({ length: count }, () =>
      createParticle(width, height)
    )
  }, [createParticle])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles(canvas.width, canvas.height)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const drawParticle = (p: Particle) => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.globalAlpha = p.opacity
      ctx.fill()
      ctx.globalAlpha = 1
    }

    const drawConnections = () => {
      const particles = particlesRef.current
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            // Create gradient line effect using particle colors
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            )
            const alpha = 0.2 * (1 - dist / 150)
            gradient.addColorStop(0, particles[i].color.replace(')', `, ${alpha})`).replace('rgb', 'rgba').replace('#', ''))
            gradient.addColorStop(1, particles[j].color.replace(')', `, ${alpha})`).replace('rgb', 'rgba').replace('#', ''))
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    const updateParticle = (p: Particle) => {
      // Mouse interaction
      const dx = mouseRef.current.x - p.x
      const dy = mouseRef.current.y - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 150) {
        const force = (150 - dist) / 150
        p.vx -= (dx / dist) * force * 0.02
        p.vy -= (dy / dist) * force * 0.02
      }

      p.x += p.vx
      p.y += p.vy

      // Friction
      p.vx *= 0.99
      p.vy *= 0.99

      // Bounds
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1

      // Keep in bounds
      p.x = Math.max(0, Math.min(canvas.width, p.x))
      p.y = Math.max(0, Math.min(canvas.height, p.y))
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p) => {
        updateParticle(p)
        drawParticle(p)
      })

      // Only draw connections on desktop
      if (window.innerWidth > 768) {
        drawConnections()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initParticles])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  )
}

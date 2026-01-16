'use client'

import { useCallback, useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  shape: 'square' | 'circle' | 'triangle'
}

const COLORS = [
  '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
  '#ff8800', '#ff0088', '#88ff00', '#0088ff', '#8800ff', '#00ff88'
]

const SHAPES: Particle['shape'][] = ['square', 'circle', 'triangle']

export function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)

  const createParticles = useCallback((x: number, y: number, count: number = 100) => {
    const particles: Particle[] = []

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const velocity = 3 + Math.random() * 8

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 5 + Math.random() * 10,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)]
      })
    }

    return particles
  }, [])

  const fire = useCallback((options?: { x?: number, y?: number, count?: number }) => {
    if (!canvasRef.current) {
      // Create canvas if it doesn't exist
      const canvas = document.createElement('canvas')
      canvas.style.position = 'fixed'
      canvas.style.top = '0'
      canvas.style.left = '0'
      canvas.style.width = '100vw'
      canvas.style.height = '100vh'
      canvas.style.pointerEvents = 'none'
      canvas.style.zIndex = '9999'
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      document.body.appendChild(canvas)
      canvasRef.current = canvas
    }

    const x = options?.x ?? window.innerWidth / 2
    const y = options?.y ?? window.innerHeight / 2
    const count = options?.count ?? 100

    particlesRef.current.push(...createParticles(x, y, count))

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter(p => {
        // Update position
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.2 // gravity
        p.vx *= 0.99 // friction
        p.rotation += p.rotationSpeed

        // Draw particle
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, 1 - p.y / canvas.height)

        if (p.shape === 'square') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        } else if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.moveTo(0, -p.size / 2)
          ctx.lineTo(p.size / 2, p.size / 2)
          ctx.lineTo(-p.size / 2, p.size / 2)
          ctx.closePath()
          ctx.fill()
        }

        ctx.restore()

        // Keep particle if still visible
        return p.y < canvas.height + 50 && ctx.globalAlpha > 0.01
      })

      if (particlesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Clean up canvas when done
        if (canvasRef.current) {
          document.body.removeChild(canvasRef.current)
          canvasRef.current = null
        }
      }
    }

    cancelAnimationFrame(animationRef.current)
    animate()
  }, [createParticles])

  // Preset effects
  const fireFromCenter = useCallback(() => {
    fire({ x: window.innerWidth / 2, y: window.innerHeight / 2, count: 150 })
  }, [fire])

  const fireFromTop = useCallback(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        fire({
          x: Math.random() * window.innerWidth,
          y: -20,
          count: 30
        })
      }, i * 100)
    }
  }, [fire])

  const fireSides = useCallback(() => {
    fire({ x: 0, y: window.innerHeight, count: 75 })
    fire({ x: window.innerWidth, y: window.innerHeight, count: 75 })
  }, [fire])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationRef.current)
      if (canvasRef.current && document.body.contains(canvasRef.current)) {
        document.body.removeChild(canvasRef.current)
      }
    }
  }, [])

  return { fire, fireFromCenter, fireFromTop, fireSides }
}

// Simple confetti button wrapper
export function ConfettiButton({
  children,
  className = '',
  onClick,
  confettiOptions
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  confettiOptions?: { x?: number, y?: number, count?: number }
}) {
  const { fire } = useConfetti()

  const handleClick = (e: React.MouseEvent) => {
    fire({
      x: confettiOptions?.x ?? e.clientX,
      y: confettiOptions?.y ?? e.clientY,
      count: confettiOptions?.count ?? 50
    })
    onClick?.()
  }

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  )
}

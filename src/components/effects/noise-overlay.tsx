'use client'

import { useEffect, useRef } from 'react'

interface NoiseOverlayProps {
  opacity?: number
  animate?: boolean
  className?: string
}

// CSS-based noise (lighter, no canvas)
export function NoiseOverlay({
  opacity = 0.03,
  className = ''
}: NoiseOverlayProps) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-40 ${className}`}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}
    />
  )
}

// Animated canvas noise
export function AnimatedNoise({
  opacity = 0.05,
  speed = 50,
  className = ''
}: {
  opacity?: number
  speed?: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Lower resolution for performance
    const scale = 0.5
    canvas.width = window.innerWidth * scale
    canvas.height = window.innerHeight * scale
    ctx.scale(scale, scale)

    const resize = () => {
      canvas.width = window.innerWidth * scale
      canvas.height = window.innerHeight * scale
    }
    window.addEventListener('resize', resize)

    let animationId: number
    const draw = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255
        data[i] = value     // R
        data[i + 1] = value // G
        data[i + 2] = value // B
        data[i + 3] = 255   // A
      }

      ctx.putImageData(imageData, 0, 0)
    }

    const interval = setInterval(draw, speed)

    return () => {
      window.removeEventListener('resize', resize)
      clearInterval(interval)
    }
  }, [speed])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-40 ${className}`}
      style={{
        opacity,
        mixBlendMode: 'overlay',
        width: '100%',
        height: '100%'
      }}
    />
  )
}

// Film grain effect
export function FilmGrain({
  opacity = 0.04,
  className = ''
}: {
  opacity?: number
  className?: string
}) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-40 ${className}`}
      style={{ opacity }}
    >
      <svg className="w-full h-full">
        <filter id="film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="saturate"
            values="0"
            in="noise"
            result="mono"
          />
          <feBlend
            in="SourceGraphic"
            in2="mono"
            mode="multiply"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#film-grain)"
          style={{
            animation: 'grain 0.5s steps(10) infinite'
          }}
        />
      </svg>
      <style jsx>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(1%, 1%); }
          30% { transform: translate(-1%, 1%); }
          40% { transform: translate(1%, -1%); }
          50% { transform: translate(-1%, 0); }
          60% { transform: translate(1%, 0); }
          70% { transform: translate(0, -1%); }
          80% { transform: translate(0, 1%); }
          90% { transform: translate(1%, 1%); }
        }
      `}</style>
    </div>
  )
}

// Scanlines effect (CRT monitor style)
export function Scanlines({
  opacity = 0.1,
  lineHeight = 2,
  className = ''
}: {
  opacity?: number
  lineHeight?: number
  className?: string
}) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-40 ${className}`}
      style={{
        opacity,
        background: `repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.15),
          rgba(0, 0, 0, 0.15) ${lineHeight}px,
          transparent ${lineHeight}px,
          transparent ${lineHeight * 2}px
        )`
      }}
    />
  )
}

// Vignette effect
export function Vignette({
  intensity = 0.3,
  className = ''
}: {
  intensity?: number
  className?: string
}) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-30 ${className}`}
      style={{
        background: `radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,${intensity}) 100%)`
      }}
    />
  )
}

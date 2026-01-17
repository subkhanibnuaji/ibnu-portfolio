'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Skill {
  name: string
  category: string
  level: number
  color: string
}

const SKILLS: Skill[] = [
  // AI/ML
  { name: 'TensorFlow', category: 'AI/ML', level: 85, color: '#FF6F00' },
  { name: 'PyTorch', category: 'AI/ML', level: 80, color: '#EE4C2C' },
  { name: 'LangChain', category: 'AI/ML', level: 90, color: '#1C3C3C' },
  { name: 'OpenAI', category: 'AI/ML', level: 95, color: '#412991' },
  { name: 'Hugging Face', category: 'AI/ML', level: 75, color: '#FFD21E' },
  // Frontend
  { name: 'React', category: 'Frontend', level: 95, color: '#61DAFB' },
  { name: 'Next.js', category: 'Frontend', level: 95, color: '#000000' },
  { name: 'TypeScript', category: 'Frontend', level: 90, color: '#3178C6' },
  { name: 'Tailwind', category: 'Frontend', level: 95, color: '#06B6D4' },
  { name: 'Framer Motion', category: 'Frontend', level: 85, color: '#0055FF' },
  // Backend
  { name: 'Node.js', category: 'Backend', level: 90, color: '#339933' },
  { name: 'Python', category: 'Backend', level: 88, color: '#3776AB' },
  { name: 'PostgreSQL', category: 'Backend', level: 85, color: '#4169E1' },
  { name: 'Prisma', category: 'Backend', level: 90, color: '#2D3748' },
  { name: 'tRPC', category: 'Backend', level: 80, color: '#2596BE' },
  // Blockchain
  { name: 'Solidity', category: 'Blockchain', level: 75, color: '#363636' },
  { name: 'Web3.js', category: 'Blockchain', level: 80, color: '#F16822' },
  { name: 'Ethereum', category: 'Blockchain', level: 78, color: '#627EEA' },
  // DevOps
  { name: 'Docker', category: 'DevOps', level: 82, color: '#2496ED' },
  { name: 'Vercel', category: 'DevOps', level: 95, color: '#000000' },
  { name: 'Git', category: 'DevOps', level: 92, color: '#F05032' },
  // Security
  { name: 'OWASP', category: 'Security', level: 80, color: '#000000' },
  { name: 'Pen Testing', category: 'Security', level: 70, color: '#E11D48' },
]

const CATEGORY_COLORS: Record<string, string> = {
  'AI/ML': '#a855f7',
  'Frontend': '#06b6d4',
  'Backend': '#22c55e',
  'Blockchain': '#f59e0b',
  'DevOps': '#3b82f6',
  'Security': '#ef4444',
}

interface Point3D {
  x: number
  y: number
  z: number
  skill: Skill
  rx?: number
  ry?: number
  rz?: number
}

export function SkillsGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [autoRotate, setAutoRotate] = useState(true)
  const [zoom, setZoom] = useState(1)
  const pointsRef = useRef<Point3D[]>([])
  const animationRef = useRef<number>(0)
  const isDraggingRef = useRef(false)
  const lastMouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const points: Point3D[] = []
    const numPoints = SKILLS.length
    const phi = Math.PI * (3 - Math.sqrt(5))

    SKILLS.forEach((skill, i) => {
      const y = 1 - (i / (numPoints - 1)) * 2
      const radius = Math.sqrt(1 - y * y)
      const theta = phi * i

      points.push({
        x: Math.cos(theta) * radius,
        y: y,
        z: Math.sin(theta) * radius,
        skill,
      })
    })

    pointsRef.current = points
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rotationY = rotation.y

    const animate = () => {
      const width = canvas.width
      const height = canvas.height
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(width, height) * 0.35 * zoom

      ctx.clearRect(0, 0, width, height)

      if (autoRotate && !isDraggingRef.current) {
        rotationY += 0.003
        setRotation(prev => ({ ...prev, y: rotationY }))
      }

      const sortedPoints = [...pointsRef.current].map(point => {
        const cosY = Math.cos(rotationY)
        const sinY = Math.sin(rotationY)
        const x1 = point.x * cosY - point.z * sinY
        const z1 = point.x * sinY + point.z * cosY

        const cosX = Math.cos(rotation.x)
        const sinX = Math.sin(rotation.x)
        const y1 = point.y * cosX - z1 * sinX
        const z2 = point.y * sinX + z1 * cosX

        return { ...point, rx: x1, ry: y1, rz: z2 }
      }).sort((a, b) => (a.rz || 0) - (b.rz || 0))

      ctx.strokeStyle = 'rgba(100, 100, 100, 0.1)'
      ctx.lineWidth = 0.5
      sortedPoints.forEach((point, i) => {
        sortedPoints.slice(i + 1).forEach(other => {
          if (point.skill.category === other.skill.category) {
            const dist = Math.sqrt(
              Math.pow((point.rx || 0) - (other.rx || 0), 2) +
              Math.pow((point.ry || 0) - (other.ry || 0), 2) +
              Math.pow((point.rz || 0) - (other.rz || 0), 2)
            )
            if (dist < 0.8) {
              const alpha = (1 - dist / 0.8) * 0.3 * (((point.rz || 0) + 1) / 2)
              ctx.strokeStyle = 'rgba(100, 100, 100, ' + alpha + ')'
              ctx.beginPath()
              ctx.moveTo(centerX + (point.rx || 0) * radius, centerY + (point.ry || 0) * radius)
              ctx.lineTo(centerX + (other.rx || 0) * radius, centerY + (other.ry || 0) * radius)
              ctx.stroke()
            }
          }
        })
      })

      sortedPoints.forEach(point => {
        const screenX = centerX + (point.rx || 0) * radius
        const screenY = centerY + (point.ry || 0) * radius
        const scale = ((point.rz || 0) + 1.5) / 2.5
        const size = (8 + point.skill.level / 15) * scale * zoom
        const alpha = 0.3 + scale * 0.7

        const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size * 2)
        const categoryColor = CATEGORY_COLORS[point.skill.category] || '#888'
        const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0')
        gradient.addColorStop(0, categoryColor + alphaHex)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(screenX, screenY, size * 2, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = categoryColor + alphaHex
        ctx.beginPath()
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2)
        ctx.fill()

        if ((point.rz || 0) > 0.3) {
          ctx.fillStyle = 'rgba(255, 255, 255, ' + (alpha * 0.9) + ')'
          ctx.font = (10 + scale * 4) + 'px system-ui'
          ctx.textAlign = 'center'
          ctx.fillText(point.skill.name, screenX, screenY + size + 14)
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isOpen, rotation.x, autoRotate, zoom])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true
    lastMouseRef.current = { x: e.clientX, y: e.clientY }
    setAutoRotate(false)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return

    const deltaX = e.clientX - lastMouseRef.current.x
    const deltaY = e.clientY - lastMouseRef.current.y

    setRotation(prev => ({
      x: prev.x + deltaY * 0.005,
      y: prev.y + deltaX * 0.005,
    }))

    lastMouseRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setZoom(prev => Math.max(0.5, Math.min(2, prev - e.deltaY * 0.001)))
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handleResize = () => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return

      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen, isFullscreen])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-20 z-40 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all group"
      >
        <div className="relative w-6 h-6">
          <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
          <div className="absolute inset-1 rounded-full bg-white/50" />
        </div>
        <span className="text-sm font-medium">Skills Globe</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                'fixed z-50 bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden',
                isFullscreen ? 'inset-4' : 'inset-8 md:inset-16 lg:inset-24'
              )}
            >
              <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-card to-transparent z-10">
                <div>
                  <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                    Interactive Skills Globe
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Drag to rotate - Scroll to zoom - {SKILLS.length} skills
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      autoRotate ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                    )}
                    title="Toggle auto-rotate"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setZoom(prev => Math.min(2, prev + 0.2))}
                    className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
                    className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ZoomOut className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
              />

              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-center gap-4 bg-card/80 backdrop-blur-sm rounded-xl p-3">
                {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
                  <div key={category} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-xs text-muted-foreground">{category}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

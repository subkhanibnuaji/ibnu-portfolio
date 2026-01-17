'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Box, RotateCcw, ZoomIn, ZoomOut, Move, Sun, Moon,
  Grid3X3, Eye, Download, Upload, Maximize2, Pause, Play
} from 'lucide-react'

interface Vector3 {
  x: number
  y: number
  z: number
}

interface Face {
  vertices: number[]
  color: string
}

interface Model3D {
  name: string
  vertices: Vector3[]
  faces: Face[]
}

const PRESET_MODELS: { [key: string]: Model3D } = {
  cube: {
    name: 'Cube',
    vertices: [
      { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 }
    ],
    faces: [
      { vertices: [0, 1, 2, 3], color: '#ef4444' },
      { vertices: [5, 4, 7, 6], color: '#3b82f6' },
      { vertices: [4, 0, 3, 7], color: '#22c55e' },
      { vertices: [1, 5, 6, 2], color: '#eab308' },
      { vertices: [4, 5, 1, 0], color: '#a855f7' },
      { vertices: [3, 2, 6, 7], color: '#f97316' }
    ]
  },
  pyramid: {
    name: 'Pyramid',
    vertices: [
      { x: 0, y: 1.5, z: 0 },
      { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
      { x: 1, y: -1, z: 1 }, { x: -1, y: -1, z: 1 }
    ],
    faces: [
      { vertices: [0, 1, 2], color: '#ef4444' },
      { vertices: [0, 2, 3], color: '#3b82f6' },
      { vertices: [0, 3, 4], color: '#22c55e' },
      { vertices: [0, 4, 1], color: '#eab308' },
      { vertices: [1, 4, 3, 2], color: '#a855f7' }
    ]
  },
  octahedron: {
    name: 'Octahedron',
    vertices: [
      { x: 0, y: 1.5, z: 0 }, { x: 0, y: -1.5, z: 0 },
      { x: -1, y: 0, z: 0 }, { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: -1 }, { x: 0, y: 0, z: 1 }
    ],
    faces: [
      { vertices: [0, 2, 4], color: '#ef4444' },
      { vertices: [0, 4, 3], color: '#3b82f6' },
      { vertices: [0, 3, 5], color: '#22c55e' },
      { vertices: [0, 5, 2], color: '#eab308' },
      { vertices: [1, 4, 2], color: '#a855f7' },
      { vertices: [1, 3, 4], color: '#f97316' },
      { vertices: [1, 5, 3], color: '#ec4899' },
      { vertices: [1, 2, 5], color: '#06b6d4' }
    ]
  },
  prism: {
    name: 'Triangular Prism',
    vertices: [
      { x: 0, y: 1, z: -1 }, { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
      { x: 0, y: 1, z: 1 }, { x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 }
    ],
    faces: [
      { vertices: [0, 1, 2], color: '#ef4444' },
      { vertices: [3, 5, 4], color: '#3b82f6' },
      { vertices: [0, 3, 4, 1], color: '#22c55e' },
      { vertices: [0, 2, 5, 3], color: '#eab308' },
      { vertices: [1, 4, 5, 2], color: '#a855f7' }
    ]
  },
  diamond: {
    name: 'Diamond',
    vertices: [
      { x: 0, y: 2, z: 0 },
      { x: -1, y: 0.5, z: -1 }, { x: 1, y: 0.5, z: -1 },
      { x: 1, y: 0.5, z: 1 }, { x: -1, y: 0.5, z: 1 },
      { x: 0, y: -1.5, z: 0 }
    ],
    faces: [
      { vertices: [0, 1, 2], color: '#06b6d4' },
      { vertices: [0, 2, 3], color: '#0ea5e9' },
      { vertices: [0, 3, 4], color: '#3b82f6' },
      { vertices: [0, 4, 1], color: '#6366f1' },
      { vertices: [5, 2, 1], color: '#8b5cf6' },
      { vertices: [5, 3, 2], color: '#a855f7' },
      { vertices: [5, 4, 3], color: '#d946ef' },
      { vertices: [5, 1, 4], color: '#ec4899' }
    ]
  }
}

export function Model3DViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedModel, setSelectedModel] = useState<string>('cube')
  const [rotation, setRotation] = useState<Vector3>({ x: 0.5, y: 0.5, z: 0 })
  const [zoom, setZoom] = useState(100)
  const [autoRotate, setAutoRotate] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [showWireframe, setShowWireframe] = useState(false)
  const [lightMode, setLightMode] = useState<'light' | 'dark'>('dark')
  const [isDragging, setIsDragging] = useState(false)
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 })
  const animationRef = useRef<number>()

  const project = useCallback((vertex: Vector3, width: number, height: number): { x: number, y: number, z: number } => {
    const scale = zoom * 1.5
    const cosX = Math.cos(rotation.x)
    const sinX = Math.sin(rotation.x)
    const cosY = Math.cos(rotation.y)
    const sinY = Math.sin(rotation.y)
    const cosZ = Math.cos(rotation.z)
    const sinZ = Math.sin(rotation.z)

    let { x, y, z } = vertex

    // Rotate around Y axis
    const x1 = x * cosY - z * sinY
    const z1 = x * sinY + z * cosY

    // Rotate around X axis
    const y2 = y * cosX - z1 * sinX
    const z2 = y * sinX + z1 * cosX

    // Rotate around Z axis
    const x3 = x1 * cosZ - y2 * sinZ
    const y3 = x1 * sinZ + y2 * cosZ

    // Project to 2D
    const perspective = 4
    const factor = perspective / (perspective + z2)

    return {
      x: width / 2 + x3 * scale * factor,
      y: height / 2 - y3 * scale * factor,
      z: z2
    }
  }, [rotation, zoom])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const model = PRESET_MODELS[selectedModel]

    // Clear canvas
    ctx.fillStyle = lightMode === 'dark' ? '#0f172a' : '#f8fafc'
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = lightMode === 'dark' ? '#1e293b' : '#e2e8f0'
      ctx.lineWidth = 1
      const gridSize = 40
      for (let i = 0; i <= width; i += gridSize) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }
      for (let i = 0; i <= height; i += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
        ctx.stroke()
      }
    }

    // Project all vertices
    const projectedVertices = model.vertices.map(v => project(v, width, height))

    // Calculate face depths and sort
    const facesWithDepth = model.faces.map((face, index) => {
      const avgZ = face.vertices.reduce((sum, vi) => sum + projectedVertices[vi].z, 0) / face.vertices.length
      return { face, index, avgZ }
    }).sort((a, b) => b.avgZ - a.avgZ)

    // Draw faces
    facesWithDepth.forEach(({ face }) => {
      const points = face.vertices.map(vi => projectedVertices[vi])

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }
      ctx.closePath()

      if (!showWireframe) {
        // Calculate lighting
        const avgZ = face.vertices.reduce((sum, vi) => sum + projectedVertices[vi].z, 0) / face.vertices.length
        const lightFactor = 0.5 + (avgZ + 2) * 0.2

        // Parse color and apply lighting
        const hex = face.color
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)

        ctx.fillStyle = `rgb(${Math.min(255, r * lightFactor)}, ${Math.min(255, g * lightFactor)}, ${Math.min(255, b * lightFactor)})`
        ctx.fill()
      }

      ctx.strokeStyle = showWireframe
        ? (lightMode === 'dark' ? '#94a3b8' : '#475569')
        : (lightMode === 'dark' ? '#1e293b' : '#e2e8f0')
      ctx.lineWidth = showWireframe ? 2 : 1
      ctx.stroke()
    })

    // Draw vertices as points
    ctx.fillStyle = lightMode === 'dark' ? '#f8fafc' : '#0f172a'
    projectedVertices.forEach(p => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [selectedModel, project, showGrid, showWireframe, lightMode])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = 400
        draw()
      }
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [draw])

  useEffect(() => {
    if (autoRotate) {
      const animate = () => {
        setRotation(prev => ({
          x: prev.x,
          y: prev.y + 0.01,
          z: prev.z
        }))
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [autoRotate])

  useEffect(() => {
    draw()
  }, [draw, rotation])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setLastMouse({ x: e.clientX, y: e.clientY })
    setAutoRotate(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const dx = e.clientX - lastMouse.x
    const dy = e.clientY - lastMouse.y

    setRotation(prev => ({
      x: prev.x + dy * 0.01,
      y: prev.y + dx * 0.01,
      z: prev.z
    }))

    setLastMouse({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setZoom(prev => Math.max(30, Math.min(200, prev - e.deltaY * 0.1)))
  }

  const resetView = () => {
    setRotation({ x: 0.5, y: 0.5, z: 0 })
    setZoom(100)
    setAutoRotate(true)
  }

  const exportImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `${selectedModel}-3d-model.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            {Object.entries(PRESET_MODELS).map(([key, model]) => (
              <option key={key} value={key} className="bg-slate-800">
                {model.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg border transition-colors ${
              autoRotate
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                : 'bg-white/10 border-white/20 text-white/70'
            }`}
            title={autoRotate ? 'Pause rotation' : 'Auto rotate'}
          >
            {autoRotate ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg border transition-colors ${
              showGrid
                ? 'bg-green-500/20 border-green-500/50 text-green-400'
                : 'bg-white/10 border-white/20 text-white/70'
            }`}
            title="Toggle grid"
          >
            <Grid3X3 className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowWireframe(!showWireframe)}
            className={`p-2 rounded-lg border transition-colors ${
              showWireframe
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                : 'bg-white/10 border-white/20 text-white/70'
            }`}
            title="Toggle wireframe"
          >
            <Eye className="w-5 h-5" />
          </button>

          <button
            onClick={() => setLightMode(lightMode === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 transition-colors"
            title="Toggle light mode"
          >
            {lightMode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setZoom(prev => Math.min(200, prev + 20))}
            className="p-2 rounded-lg bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          <button
            onClick={() => setZoom(prev => Math.max(30, prev - 20))}
            className="p-2 rounded-lg bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>

          <button
            onClick={resetView}
            className="p-2 rounded-lg bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 transition-colors"
            title="Reset view"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={exportImage}
            className="p-2 rounded-lg bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 transition-colors"
            title="Export as PNG"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas */}
        <div
          className="relative rounded-xl overflow-hidden cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <canvas
            ref={canvasRef}
            className="w-full"
          />

          {/* Overlay info */}
          <div className="absolute bottom-4 left-4 text-white/50 text-sm">
            <div className="flex items-center gap-2">
              <Move className="w-4 h-4" />
              <span>Drag to rotate • Scroll to zoom</span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 text-white/50 text-sm">
            Zoom: {zoom.toFixed(0)}%
          </div>
        </div>

        {/* Model info */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/50 text-sm">Model</div>
            <div className="text-white font-medium">{PRESET_MODELS[selectedModel].name}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/50 text-sm">Vertices</div>
            <div className="text-white font-medium">{PRESET_MODELS[selectedModel].vertices.length}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/50 text-sm">Faces</div>
            <div className="text-white font-medium">{PRESET_MODELS[selectedModel].faces.length}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/50 text-sm">Rotation</div>
            <div className="text-white font-medium text-sm">
              X:{(rotation.x * 57.3).toFixed(0)}° Y:{(rotation.y * 57.3).toFixed(0)}°
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

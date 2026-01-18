'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Play, Pause, RotateCcw, Settings, Sparkles,
  Download, Palette
} from 'lucide-react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  alpha: number
}

interface ParticleConfig {
  particleCount: number
  speed: number
  size: number
  lifespan: number
  gravity: number
  spread: number
  color: string
  colorMode: 'solid' | 'rainbow' | 'gradient'
  shape: 'circle' | 'square' | 'star'
  emitterX: number
  emitterY: number
}

const PRESETS: Record<string, Partial<ParticleConfig>> = {
  fire: {
    particleCount: 100,
    speed: 3,
    size: 8,
    lifespan: 60,
    gravity: -0.1,
    spread: 30,
    color: '#ff6600',
    colorMode: 'gradient',
    shape: 'circle'
  },
  snow: {
    particleCount: 150,
    speed: 1,
    size: 4,
    lifespan: 200,
    gravity: 0.02,
    spread: 180,
    color: '#ffffff',
    colorMode: 'solid',
    shape: 'circle'
  },
  confetti: {
    particleCount: 80,
    speed: 5,
    size: 10,
    lifespan: 100,
    gravity: 0.15,
    spread: 60,
    color: '#ff0000',
    colorMode: 'rainbow',
    shape: 'square'
  },
  sparks: {
    particleCount: 50,
    speed: 8,
    size: 3,
    lifespan: 30,
    gravity: 0.2,
    spread: 360,
    color: '#ffff00',
    colorMode: 'gradient',
    shape: 'circle'
  },
  bubbles: {
    particleCount: 40,
    speed: 2,
    size: 15,
    lifespan: 150,
    gravity: -0.05,
    spread: 45,
    color: '#00aaff',
    colorMode: 'solid',
    shape: 'circle'
  },
  stars: {
    particleCount: 60,
    speed: 4,
    size: 12,
    lifespan: 80,
    gravity: 0,
    spread: 360,
    color: '#ffdd00',
    colorMode: 'rainbow',
    shape: 'star'
  }
}

export function ParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const [isPlaying, setIsPlaying] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [config, setConfig] = useState<ParticleConfig>({
    particleCount: 100,
    speed: 3,
    size: 6,
    lifespan: 80,
    gravity: 0.1,
    spread: 45,
    color: '#00aaff',
    colorMode: 'rainbow',
    shape: 'circle',
    emitterX: 0.5,
    emitterY: 0.7
  })

  const getColor = useCallback((life: number, maxLife: number): string => {
    const progress = life / maxLife

    if (config.colorMode === 'solid') {
      return config.color
    } else if (config.colorMode === 'rainbow') {
      const hue = (progress * 360 + Date.now() * 0.1) % 360
      return `hsl(${hue}, 80%, 60%)`
    } else {
      // Gradient from color to transparent
      const r = parseInt(config.color.slice(1, 3), 16)
      const g = parseInt(config.color.slice(3, 5), 16)
      const b = parseInt(config.color.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${progress})`
    }
  }, [config.color, config.colorMode])

  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    const angle = (Math.random() - 0.5) * (config.spread * Math.PI / 180)
    const speed = config.speed * (0.5 + Math.random() * 0.5)

    return {
      x: canvas.width * config.emitterX,
      y: canvas.height * config.emitterY,
      vx: Math.sin(angle) * speed,
      vy: -Math.cos(angle) * speed,
      life: config.lifespan,
      maxLife: config.lifespan,
      size: config.size * (0.5 + Math.random() * 0.5),
      color: config.color,
      alpha: 1
    }
  }, [config])

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.save()
    ctx.globalAlpha = p.life / p.maxLife
    ctx.fillStyle = getColor(p.life, p.maxLife)

    if (config.shape === 'circle') {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    } else if (config.shape === 'square') {
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
    } else if (config.shape === 'star') {
      drawStar(ctx, p.x, p.y, 5, p.size, p.size / 2)
    }

    ctx.restore()
  }, [config.shape, getColor])

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = Math.PI / 2 * 3
    let x = cx
    let y = cy
    const step = Math.PI / spikes

    ctx.beginPath()
    ctx.moveTo(cx, cy - outerRadius)

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius
      y = cy + Math.sin(rot) * outerRadius
      ctx.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius
      y = cy + Math.sin(rot) * innerRadius
      ctx.lineTo(x, y)
      rot += step
    }

    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath()
    ctx.fill()
  }

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Clear with fade effect
    ctx.fillStyle = 'rgba(15, 23, 42, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add new particles
    while (particlesRef.current.length < config.particleCount) {
      particlesRef.current.push(createParticle(canvas))
    }

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(p => {
      p.x += p.vx
      p.y += p.vy
      p.vy += config.gravity
      p.life--

      if (p.life > 0) {
        drawParticle(ctx, p)
        return true
      }
      return false
    })

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }, [config, createParticle, drawParticle, isPlaying])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }
    }

    resize()
    window.addEventListener('resize', resize)

    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, animate])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    setConfig(prev => ({ ...prev, emitterX: x, emitterY: y }))
  }

  const reset = () => {
    particlesRef.current = []
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }

  const applyPreset = (presetName: string) => {
    const preset = PRESETS[presetName]
    if (preset) {
      setConfig(prev => ({ ...prev, ...preset }))
      reset()
    }
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'particles.png'
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
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              isPlaying ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              showSettings ? 'bg-blue-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>

          <button
            onClick={downloadImage}
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Save
          </button>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(PRESETS).map(preset => (
            <button
              key={preset}
              onClick={() => applyPreset(preset)}
              className="px-3 py-1 rounded-full bg-white/10 text-white/70 hover:bg-white/20 text-sm capitalize"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-white/5 rounded-xl"
          >
            <div>
              <label className="text-white/70 text-sm">Particles</label>
              <input
                type="range"
                min="10"
                max="300"
                value={config.particleCount}
                onChange={(e) => setConfig(prev => ({ ...prev, particleCount: Number(e.target.value) }))}
                className="w-full"
              />
              <span className="text-white text-sm">{config.particleCount}</span>
            </div>

            <div>
              <label className="text-white/70 text-sm">Speed</label>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={config.speed}
                onChange={(e) => setConfig(prev => ({ ...prev, speed: Number(e.target.value) }))}
                className="w-full"
              />
              <span className="text-white text-sm">{config.speed}</span>
            </div>

            <div>
              <label className="text-white/70 text-sm">Size</label>
              <input
                type="range"
                min="1"
                max="30"
                value={config.size}
                onChange={(e) => setConfig(prev => ({ ...prev, size: Number(e.target.value) }))}
                className="w-full"
              />
              <span className="text-white text-sm">{config.size}</span>
            </div>

            <div>
              <label className="text-white/70 text-sm">Lifespan</label>
              <input
                type="range"
                min="20"
                max="300"
                value={config.lifespan}
                onChange={(e) => setConfig(prev => ({ ...prev, lifespan: Number(e.target.value) }))}
                className="w-full"
              />
              <span className="text-white text-sm">{config.lifespan}</span>
            </div>

            <div>
              <label className="text-white/70 text-sm">Gravity</label>
              <input
                type="range"
                min="-0.5"
                max="0.5"
                step="0.01"
                value={config.gravity}
                onChange={(e) => setConfig(prev => ({ ...prev, gravity: Number(e.target.value) }))}
                className="w-full"
              />
              <span className="text-white text-sm">{config.gravity.toFixed(2)}</span>
            </div>

            <div>
              <label className="text-white/70 text-sm">Spread (°)</label>
              <input
                type="range"
                min="0"
                max="360"
                value={config.spread}
                onChange={(e) => setConfig(prev => ({ ...prev, spread: Number(e.target.value) }))}
                className="w-full"
              />
              <span className="text-white text-sm">{config.spread}°</span>
            </div>

            <div>
              <label className="text-white/70 text-sm">Color</label>
              <input
                type="color"
                value={config.color}
                onChange={(e) => setConfig(prev => ({ ...prev, color: e.target.value }))}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="text-white/70 text-sm">Color Mode</label>
              <select
                value={config.colorMode}
                onChange={(e) => setConfig(prev => ({ ...prev, colorMode: e.target.value as ParticleConfig['colorMode'] }))}
                className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
              >
                <option value="solid">Solid</option>
                <option value="rainbow">Rainbow</option>
                <option value="gradient">Gradient</option>
              </select>
            </div>

            <div>
              <label className="text-white/70 text-sm">Shape</label>
              <select
                value={config.shape}
                onChange={(e) => setConfig(prev => ({ ...prev, shape: e.target.value as ParticleConfig['shape'] }))}
                className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
              >
                <option value="circle">Circle</option>
                <option value="square">Square</option>
                <option value="star">Star</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-[500px] rounded-xl bg-slate-900 cursor-crosshair"
            style={{ imageRendering: 'pixelated' }}
          />
          <p className="absolute bottom-4 left-4 text-white/30 text-sm">
            Click anywhere to move the emitter
          </p>
        </div>
      </motion.div>
    </div>
  )
}

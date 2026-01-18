'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Download, RefreshCw, Palette, User, Smile,
  Copy, Check
} from 'lucide-react'

interface AvatarConfig {
  seed: string
  backgroundColor: string
  style: 'initials' | 'geometric' | 'pixel' | 'abstract'
  size: number
}

export function AvatarGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [config, setConfig] = useState<AvatarConfig>({
    seed: 'User',
    backgroundColor: '#3b82f6',
    style: 'geometric',
    size: 200
  })
  const [copied, setCopied] = useState(false)

  const COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e', '#64748b', '#1e293b', '#0f172a'
  ]

  // Generate a hash from string
  const hashString = (str: string): number => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  // Seeded random number generator
  const seededRandom = (seed: number): () => number => {
    return () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
  }

  useEffect(() => {
    drawAvatar()
  }, [config])

  const drawAvatar = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const { seed, backgroundColor, style, size } = config
    canvas.width = size
    canvas.height = size

    // Clear and draw background
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, size, size)

    const hash = hashString(seed)
    const random = seededRandom(hash)

    switch (style) {
      case 'initials':
        drawInitials(ctx, seed, size)
        break
      case 'geometric':
        drawGeometric(ctx, random, size)
        break
      case 'pixel':
        drawPixel(ctx, random, size)
        break
      case 'abstract':
        drawAbstract(ctx, random, size)
        break
    }
  }

  const drawInitials = (ctx: CanvasRenderingContext2D, seed: string, size: number) => {
    const initials = seed
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)

    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${size * 0.4}px system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(initials, size / 2, size / 2)
  }

  const drawGeometric = (ctx: CanvasRenderingContext2D, random: () => number, size: number) => {
    const shapes = 8 + Math.floor(random() * 8)

    for (let i = 0; i < shapes; i++) {
      const x = random() * size
      const y = random() * size
      const shapeSize = 20 + random() * 60
      const alpha = 0.3 + random() * 0.5
      const shapeType = Math.floor(random() * 3)

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`

      switch (shapeType) {
        case 0: // Circle
          ctx.beginPath()
          ctx.arc(x, y, shapeSize / 2, 0, Math.PI * 2)
          ctx.fill()
          break
        case 1: // Square
          ctx.fillRect(x - shapeSize / 2, y - shapeSize / 2, shapeSize, shapeSize)
          break
        case 2: // Triangle
          ctx.beginPath()
          ctx.moveTo(x, y - shapeSize / 2)
          ctx.lineTo(x + shapeSize / 2, y + shapeSize / 2)
          ctx.lineTo(x - shapeSize / 2, y + shapeSize / 2)
          ctx.closePath()
          ctx.fill()
          break
      }
    }
  }

  const drawPixel = (ctx: CanvasRenderingContext2D, random: () => number, size: number) => {
    const gridSize = 5
    const cellSize = size / gridSize
    const colors = ['#ffffff', 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0.4)', 'transparent']

    // Draw symmetric pattern
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < Math.ceil(gridSize / 2); x++) {
        const colorIndex = Math.floor(random() * colors.length)
        ctx.fillStyle = colors[colorIndex]

        // Left side
        ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1)
        // Right side (mirror)
        ctx.fillRect((gridSize - 1 - x) * cellSize, y * cellSize, cellSize - 1, cellSize - 1)
      }
    }
  }

  const drawAbstract = (ctx: CanvasRenderingContext2D, random: () => number, size: number) => {
    // Draw flowing curves
    const curves = 3 + Math.floor(random() * 4)

    for (let i = 0; i < curves; i++) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + random() * 0.4})`
      ctx.lineWidth = 5 + random() * 15
      ctx.lineCap = 'round'

      ctx.beginPath()
      let x = random() * size
      let y = random() * size
      ctx.moveTo(x, y)

      const points = 3 + Math.floor(random() * 4)
      for (let j = 0; j < points; j++) {
        const cx = random() * size
        const cy = random() * size
        x = random() * size
        y = random() * size
        ctx.quadraticCurveTo(cx, cy, x, y)
      }

      ctx.stroke()
    }

    // Add some dots
    const dots = 5 + Math.floor(random() * 10)
    for (let i = 0; i < dots; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + random() * 0.4})`
      ctx.beginPath()
      ctx.arc(random() * size, random() * size, 3 + random() * 10, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const randomize = () => {
    const adjectives = ['Happy', 'Cool', 'Smart', 'Fast', 'Brave', 'Kind', 'Wild', 'Calm']
    const nouns = ['Tiger', 'Eagle', 'Wolf', 'Bear', 'Fox', 'Hawk', 'Lion', 'Owl']
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)]
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)]

    setConfig(prev => ({
      ...prev,
      seed: `${randomAdj} ${randomNoun}`,
      backgroundColor: randomColor
    }))
  }

  const downloadAvatar = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `avatar-${config.seed.replace(/\s+/g, '-').toLowerCase()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const copyDataUrl = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    navigator.clipboard.writeText(canvas.toDataURL('image/png'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const styles: { id: AvatarConfig['style']; name: string; description: string }[] = [
    { id: 'initials', name: 'Initials', description: 'Text-based avatar' },
    { id: 'geometric', name: 'Geometric', description: 'Random shapes' },
    { id: 'pixel', name: 'Pixel', description: 'Retro pixel art' },
    { id: 'abstract', name: 'Abstract', description: 'Flowing curves' }
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <canvas
                ref={canvasRef}
                className="rounded-2xl shadow-2xl"
                style={{ width: config.size, height: config.size }}
              />
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadAvatar}
                className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyDataUrl}
                className="px-4 py-2 bg-white/10 text-white rounded-lg flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy URL'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={randomize}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Random
              </motion.button>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-6">
            {/* Name/Seed */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Name or Seed
              </label>
              <input
                type="text"
                value={config.seed}
                onChange={(e) => setConfig(prev => ({ ...prev, seed: e.target.value }))}
                placeholder="Enter name or text..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Style */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <Smile className="w-4 h-4" />
                Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {styles.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setConfig(prev => ({ ...prev, style: style.id }))}
                    className={`p-3 rounded-lg text-left transition-colors ${
                      config.style === style.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    <div className="font-medium text-sm">{style.name}</div>
                    <div className={`text-xs ${config.style === style.id ? 'text-white/70' : 'text-white/50'}`}>
                      {style.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Background Color
              </label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setConfig(prev => ({ ...prev, backgroundColor: color }))}
                    className={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 ${
                      config.backgroundColor === color ? 'border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="color"
                  value={config.backgroundColor}
                  onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={config.backgroundColor}
                  onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-mono text-sm"
                />
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="text-white/70 text-sm mb-2 block">Size: {config.size}px</label>
              <input
                type="range"
                min="64"
                max="512"
                step="8"
                value={config.size}
                onChange={(e) => setConfig(prev => ({ ...prev, size: Number(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-white/50 text-xs mt-1">
                <span>64px</span>
                <span>512px</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Loader2, RefreshCw, Palette, Copy, Check, Download } from 'lucide-react'

interface ColorInfo {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  count: number
  percentage: number
}

export function ColorExtractor() {
  const [image, setImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [colors, setColors] = useState<ColorInfo[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
  }

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  const quantizeColor = (r: number, g: number, b: number, step: number = 32): string => {
    return `${Math.round(r / step) * step}-${Math.round(g / step) * step}-${Math.round(b / step) * step}`
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setColors([])
    }
    reader.readAsDataURL(file)
  }

  const extractColors = async () => {
    if (!image || !canvasRef.current) return

    setIsLoading(true)

    try {
      const img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = image
      })

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')!

      // Scale down for performance
      const maxSize = 200
      let width = img.width
      let height = img.height

      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = (height / width) * maxSize
          width = maxSize
        } else {
          width = (width / height) * maxSize
          height = maxSize
        }
      }

      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)

      const imageData = ctx.getImageData(0, 0, width, height)
      const data = imageData.data

      // Count colors using quantization
      const colorCounts = new Map<string, { r: number; g: number; b: number; count: number }>()
      const totalPixels = data.length / 4

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        const key = quantizeColor(r, g, b)
        const existing = colorCounts.get(key)

        if (existing) {
          existing.count++
          // Average the colors
          existing.r = Math.round((existing.r * (existing.count - 1) + r) / existing.count)
          existing.g = Math.round((existing.g * (existing.count - 1) + g) / existing.count)
          existing.b = Math.round((existing.b * (existing.count - 1) + b) / existing.count)
        } else {
          colorCounts.set(key, { r, g, b, count: 1 })
        }
      }

      // Sort by count and get top colors
      const sortedColors = Array.from(colorCounts.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 8)
        .map(color => ({
          hex: rgbToHex(color.r, color.g, color.b),
          rgb: { r: color.r, g: color.g, b: color.b },
          hsl: rgbToHsl(color.r, color.g, color.b),
          count: color.count,
          percentage: (color.count / totalPixels) * 100
        }))

      setColors(sortedColors)
    } catch (error) {
      console.error('Error extracting colors:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyColor = async (color: ColorInfo, index: number, format: 'hex' | 'rgb' | 'hsl') => {
    let text = ''
    switch (format) {
      case 'hex':
        text = color.hex
        break
      case 'rgb':
        text = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
        break
      case 'hsl':
        text = `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`
        break
    }
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const downloadPalette = () => {
    if (colors.length === 0) return

    const paletteData = colors.map(c => ({
      hex: c.hex,
      rgb: `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`,
      hsl: `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`,
      percentage: `${c.percentage.toFixed(1)}%`
    }))

    const blob = new Blob([JSON.stringify(paletteData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'color-palette.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setImage(null)
    setColors([])
  }

  const getContrastColor = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#000000' : '#ffffff'
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 text-rose-500 text-sm font-medium mb-4">
          <Palette className="w-4 h-4" />
          Color Analysis
        </div>
        <h2 className="text-3xl font-bold mb-2">Color Palette Extractor</h2>
        <p className="text-muted-foreground">
          Extract dominant colors from any image to create color palettes.
        </p>
      </div>

      {/* Upload Area */}
      {!image ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Upload an image</p>
          <p className="text-sm text-muted-foreground">
            Extract up to 8 dominant colors
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Image and Canvas */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-center">Source Image</h3>
              <div className="aspect-square rounded-xl border border-border overflow-hidden bg-muted/30 flex items-center justify-center">
                <img
                  src={image}
                  alt="Source"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-center">Color Palette</h3>
              <div className="aspect-square rounded-xl border border-border overflow-hidden bg-muted/30">
                <AnimatePresence>
                  {colors.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-2 h-full"
                    >
                      {colors.map((color, index) => (
                        <motion.div
                          key={color.hex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="relative group cursor-pointer"
                          style={{ backgroundColor: color.hex }}
                          onClick={() => copyColor(color, index, 'hex')}
                        >
                          <div
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                          >
                            {copiedIndex === index ? (
                              <Check className="w-6 h-6 text-white" />
                            ) : (
                              <Copy className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div
                            className="absolute bottom-2 left-2 text-xs font-mono"
                            style={{ color: getContrastColor(color.hex) }}
                          >
                            {color.hex}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Palette className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Click "Extract Colors"</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={extractColors}
              disabled={isLoading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Palette className="w-4 h-4" />
              )}
              Extract Colors
            </button>

            {colors.length > 0 && (
              <button
                onClick={downloadPalette}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Palette
              </button>
            )}

            <button
              onClick={reset}
              className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              New Image
            </button>
          </div>

          {/* Color Details */}
          {colors.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-center">Color Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {colors.map((color, index) => (
                  <motion.div
                    key={color.hex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 rounded-lg border border-border bg-card flex items-center gap-3"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm">{color.hex}</span>
                        <span className="text-xs text-muted-foreground">
                          ({color.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyColor(color, index, 'rgb')}
                          className="text-xs px-2 py-0.5 rounded bg-muted hover:bg-muted/80"
                        >
                          RGB
                        </button>
                        <button
                          onClick={() => copyColor(color, index, 'hsl')}
                          className="text-xs px-2 py-0.5 rounded bg-muted hover:bg-muted/80"
                        >
                          HSL
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="mt-8 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <strong>Privacy:</strong> All processing happens locally in your browser.
        </p>
      </div>
    </div>
  )
}

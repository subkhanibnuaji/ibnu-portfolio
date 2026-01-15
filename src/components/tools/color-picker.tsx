'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Palette, Copy, Check, RefreshCw, Heart, Trash2 } from 'lucide-react'

interface ColorFormat {
  hex: string
  rgb: string
  hsl: string
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
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

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

const getColorFormats = (hex: string): ColorFormat => {
  const rgb = hexToRgb(hex)
  if (!rgb) return { hex, rgb: 'rgb(0, 0, 0)', hsl: 'hsl(0, 0%, 0%)' }

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  return {
    hex: hex.toUpperCase(),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
  }
}

const getContrastColor = (hex: string): string => {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#000000'
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

const generateRandomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#8b5cf6', '#ec4899', '#000000', '#ffffff'
]

export function ColorPicker() {
  const [color, setColor] = useState('#3b82f6')
  const [formats, setFormats] = useState<ColorFormat>(getColorFormats('#3b82f6'))
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)
  const [savedColors, setSavedColors] = useState<string[]>([])
  const [history, setHistory] = useState<string[]>(['#3b82f6'])

  useEffect(() => {
    const saved = localStorage.getItem('colorPickerSaved')
    if (saved) setSavedColors(JSON.parse(saved))
  }, [])

  useEffect(() => {
    setFormats(getColorFormats(color))
    if (!history.includes(color)) {
      setHistory(prev => [color, ...prev.slice(0, 9)])
    }
  }, [color])

  const copyToClipboard = async (text: string, format: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedFormat(format)
    setTimeout(() => setCopiedFormat(null), 2000)
  }

  const saveColor = () => {
    if (savedColors.includes(color)) return
    const updated = [...savedColors, color]
    setSavedColors(updated)
    localStorage.setItem('colorPickerSaved', JSON.stringify(updated))
  }

  const removeColor = (colorToRemove: string) => {
    const updated = savedColors.filter(c => c !== colorToRemove)
    setSavedColors(updated)
    localStorage.setItem('colorPickerSaved', JSON.stringify(updated))
  }

  const contrastColor = getContrastColor(color)

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-500 text-sm font-medium mb-4">
          <Palette className="w-4 h-4" />
          Design Tool
        </div>
        <h2 className="text-2xl font-bold">Color Picker</h2>
        <p className="text-muted-foreground mt-2">
          Pick colors and get them in multiple formats.
        </p>
      </div>

      {/* Main Color Display */}
      <motion.div
        key={color}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="relative rounded-2xl overflow-hidden mb-6 shadow-lg"
        style={{ backgroundColor: color, height: 200 }}
      >
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ color: contrastColor }}
        >
          <p className="text-4xl font-bold">{formats.hex}</p>
          <p className="text-lg opacity-80">{formats.rgb}</p>
        </div>
        <button
          onClick={saveColor}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          style={{ color: contrastColor }}
          title="Save color"
        >
          <Heart className={`w-5 h-5 ${savedColors.includes(color) ? 'fill-current' : ''}`} />
        </button>
      </motion.div>

      {/* Color Input */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Color Picker</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-12 rounded-lg cursor-pointer border border-border"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => {
                const val = e.target.value
                if (/^#[0-9A-Fa-f]{6}$/.test(val)) setColor(val)
              }}
              placeholder="#3b82f6"
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background font-mono"
            />
            <button
              onClick={() => setColor(generateRandomColor())}
              className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              title="Random color"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Color Formats */}
      <div className="grid gap-3 mb-6">
        {Object.entries(formats).map(([format, value]) => (
          <div
            key={format}
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card"
          >
            <div>
              <p className="text-sm text-muted-foreground uppercase">{format}</p>
              <p className="font-mono">{value}</p>
            </div>
            <button
              onClick={() => copyToClipboard(value, format)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {copiedFormat === format ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Preset Colors */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Preset Colors</h3>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((presetColor) => (
            <button
              key={presetColor}
              onClick={() => setColor(presetColor)}
              className={`w-10 h-10 rounded-lg transition-transform hover:scale-110 ${
                color === presetColor ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
              style={{ backgroundColor: presetColor, border: presetColor === '#ffffff' ? '1px solid #e5e7eb' : 'none' }}
            />
          ))}
        </div>
      </div>

      {/* History */}
      {history.length > 1 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Recent Colors</h3>
          <div className="flex flex-wrap gap-2">
            {history.slice(1).map((historyColor, idx) => (
              <button
                key={idx}
                onClick={() => setColor(historyColor)}
                className="w-8 h-8 rounded-lg transition-transform hover:scale-110"
                style={{ backgroundColor: historyColor }}
                title={historyColor}
              />
            ))}
          </div>
        </div>
      )}

      {/* Saved Colors */}
      {savedColors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Saved Colors</h3>
          <div className="flex flex-wrap gap-2">
            {savedColors.map((savedColor) => (
              <div key={savedColor} className="relative group">
                <button
                  onClick={() => setColor(savedColor)}
                  className="w-10 h-10 rounded-lg transition-transform hover:scale-110"
                  style={{ backgroundColor: savedColor }}
                  title={savedColor}
                />
                <button
                  onClick={() => removeColor(savedColor)}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Color Shades */}
      <div>
        <h3 className="text-sm font-medium mb-3">Shades</h3>
        <div className="flex rounded-xl overflow-hidden">
          {[0.1, 0.3, 0.5, 0.7, 0.9, 1, 0.9, 0.7, 0.5, 0.3].map((opacity, idx) => {
            const rgb = hexToRgb(color)
            if (!rgb) return null

            let shadeColor: string
            if (idx < 5) {
              // Lighter shades
              const factor = 1 - (idx * 0.15)
              shadeColor = `rgb(${Math.round(rgb.r + (255 - rgb.r) * factor)}, ${Math.round(rgb.g + (255 - rgb.g) * factor)}, ${Math.round(rgb.b + (255 - rgb.b) * factor)})`
            } else if (idx === 5) {
              shadeColor = color
            } else {
              // Darker shades
              const factor = (idx - 5) * 0.2
              shadeColor = `rgb(${Math.round(rgb.r * (1 - factor))}, ${Math.round(rgb.g * (1 - factor))}, ${Math.round(rgb.b * (1 - factor))})`
            }

            return (
              <div
                key={idx}
                className="flex-1 h-12 cursor-pointer transition-transform hover:scale-y-110"
                style={{ backgroundColor: shadeColor }}
                onClick={() => {
                  const elem = document.createElement('canvas')
                  const ctx = elem.getContext('2d')
                  if (ctx) {
                    ctx.fillStyle = shadeColor
                    const hex = ctx.fillStyle
                    setColor(hex)
                  }
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

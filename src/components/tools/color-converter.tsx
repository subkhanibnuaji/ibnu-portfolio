'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, RefreshCw } from 'lucide-react'

interface RGB { r: number; g: number; b: number }
interface HSL { h: number; s: number; l: number }
interface CMYK { c: number; m: number; y: number; k: number }

function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
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

function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360; s /= 100; l /= 100
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

function rgbToCmyk(r: number, g: number, b: number): CMYK {
  const rp = r / 255, gp = g / 255, bp = b / 255
  const k = 1 - Math.max(rp, gp, bp)
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 }
  return {
    c: Math.round((1 - rp - k) / (1 - k) * 100),
    m: Math.round((1 - gp - k) / (1 - k) * 100),
    y: Math.round((1 - bp - k) / (1 - k) * 100),
    k: Math.round(k * 100)
  }
}

export function ColorConverter() {
  const [hex, setHex] = useState('#3B82F6')
  const [rgb, setRgb] = useState<RGB>({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState<HSL>({ h: 217, s: 91, l: 60 })
  const [copied, setCopied] = useState<string | null>(null)

  const cmyk = useMemo(() => rgbToCmyk(rgb.r, rgb.g, rgb.b), [rgb])

  const updateFromHex = (value: string) => {
    setHex(value)
    const newRgb = hexToRgb(value)
    if (newRgb) {
      setRgb(newRgb)
      setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
    }
  }

  const updateFromRgb = (newRgb: RGB) => {
    setRgb(newRgb)
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
  }

  const updateFromHsl = (newHsl: HSL) => {
    setHsl(newHsl)
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l)
    setRgb(newRgb)
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
  }

  const randomColor = () => {
    const newHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    updateFromHex(newHex)
  }

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const colorFormats = [
    { label: 'HEX', value: hex.toUpperCase() },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Color Converter</h1>
        <p className="text-muted-foreground">Convert colors between HEX, RGB, HSL, and CMYK</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Color Preview */}
        <div className="flex gap-4 mb-6">
          <div
            className="w-32 h-32 rounded-xl border-4 border-white shadow-lg"
            style={{ backgroundColor: hex }}
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={hex}
                onChange={(e) => updateFromHex(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => updateFromHex(e.target.value)}
                placeholder="#000000"
                className="flex-1 px-3 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <button
                onClick={randomColor}
                className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                title="Random color"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            {/* Copy Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {colorFormats.map(format => (
                <button
                  key={format.label}
                  onClick={() => copyToClipboard(format.value, format.label)}
                  className="flex items-center justify-between px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors"
                >
                  <span className="font-medium">{format.label}</span>
                  {copied === format.label ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RGB Sliders */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">RGB</h3>
          <div className="space-y-3">
            {(['r', 'g', 'b'] as const).map(channel => (
              <div key={channel} className="flex items-center gap-4">
                <span className="w-4 text-sm font-medium uppercase">{channel}</span>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgb[channel]}
                  onChange={(e) => updateFromRgb({ ...rgb, [channel]: parseInt(e.target.value) })}
                  className="flex-1 accent-blue-500"
                  style={{
                    accentColor: channel === 'r' ? '#ef4444' : channel === 'g' ? '#22c55e' : '#3b82f6'
                  }}
                />
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb[channel]}
                  onChange={(e) => updateFromRgb({ ...rgb, [channel]: Math.min(255, Math.max(0, parseInt(e.target.value) || 0)) })}
                  className="w-16 px-2 py-1 bg-muted rounded text-center text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* HSL Sliders */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">HSL</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="w-4 text-sm font-medium">H</span>
              <input
                type="range"
                min="0"
                max="360"
                value={hsl.h}
                onChange={(e) => updateFromHsl({ ...hsl, h: parseInt(e.target.value) })}
                className="flex-1"
                style={{
                  background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                }}
              />
              <input
                type="number"
                min="0"
                max="360"
                value={hsl.h}
                onChange={(e) => updateFromHsl({ ...hsl, h: Math.min(360, Math.max(0, parseInt(e.target.value) || 0)) })}
                className="w-16 px-2 py-1 bg-muted rounded text-center text-sm"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="w-4 text-sm font-medium">S</span>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.s}
                onChange={(e) => updateFromHsl({ ...hsl, s: parseInt(e.target.value) })}
                className="flex-1 accent-blue-500"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={hsl.s}
                onChange={(e) => updateFromHsl({ ...hsl, s: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                className="w-16 px-2 py-1 bg-muted rounded text-center text-sm"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="w-4 text-sm font-medium">L</span>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.l}
                onChange={(e) => updateFromHsl({ ...hsl, l: parseInt(e.target.value) })}
                className="flex-1 accent-blue-500"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={hsl.l}
                onChange={(e) => updateFromHsl({ ...hsl, l: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                className="w-16 px-2 py-1 bg-muted rounded text-center text-sm"
              />
            </div>
          </div>
        </div>

        {/* All Values */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">All Formats</h3>
          <div className="space-y-1 font-mono text-sm">
            {colorFormats.map(format => (
              <div key={format.label} className="flex justify-between">
                <span className="text-muted-foreground">{format.label}:</span>
                <span>{format.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

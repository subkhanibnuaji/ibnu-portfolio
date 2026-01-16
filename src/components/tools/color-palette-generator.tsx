'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Copy, Check, Lock, Unlock, Download, Palette } from 'lucide-react'

interface ColorInfo {
  hex: string
  locked: boolean
}

type HarmonyType = 'random' | 'analogous' | 'complementary' | 'triadic' | 'split-complementary' | 'monochromatic'

export function ColorPaletteGenerator() {
  const [colors, setColors] = useState<ColorInfo[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [harmonyType, setHarmonyType] = useState<HarmonyType>('random')
  const [savedPalettes, setSavedPalettes] = useState<string[][]>([])

  useEffect(() => {
    generatePalette()
    const saved = localStorage.getItem('savedPalettes')
    if (saved) setSavedPalettes(JSON.parse(saved))
  }, [])

  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100
    l /= 100
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }

  const hexToHsl = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break
        case g: h = ((b - r) / d + 2) * 60; break
        case b: h = ((r - g) / d + 4) * 60; break
      }
    }

    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)]
  }

  const generateRandomColor = (): string => {
    const h = Math.floor(Math.random() * 360)
    const s = Math.floor(Math.random() * 40) + 50 // 50-90%
    const l = Math.floor(Math.random() * 40) + 30 // 30-70%
    return hslToHex(h, s, l)
  }

  const generateHarmonyColors = (baseHue: number, type: HarmonyType): string[] => {
    const s = Math.floor(Math.random() * 30) + 50
    const l = Math.floor(Math.random() * 30) + 35

    switch (type) {
      case 'analogous':
        return [
          hslToHex((baseHue - 30 + 360) % 360, s, l),
          hslToHex((baseHue - 15 + 360) % 360, s, l),
          hslToHex(baseHue, s, l),
          hslToHex((baseHue + 15) % 360, s, l),
          hslToHex((baseHue + 30) % 360, s, l),
        ]
      case 'complementary':
        return [
          hslToHex(baseHue, s, l - 15),
          hslToHex(baseHue, s, l),
          hslToHex(baseHue, s - 20, l + 20),
          hslToHex((baseHue + 180) % 360, s, l),
          hslToHex((baseHue + 180) % 360, s, l + 15),
        ]
      case 'triadic':
        return [
          hslToHex(baseHue, s, l),
          hslToHex(baseHue, s - 20, l + 15),
          hslToHex((baseHue + 120) % 360, s, l),
          hslToHex((baseHue + 240) % 360, s, l),
          hslToHex((baseHue + 240) % 360, s - 20, l + 15),
        ]
      case 'split-complementary':
        return [
          hslToHex(baseHue, s, l),
          hslToHex(baseHue, s - 20, l + 20),
          hslToHex((baseHue + 150) % 360, s, l),
          hslToHex((baseHue + 210) % 360, s, l),
          hslToHex((baseHue + 180) % 360, s - 30, l + 25),
        ]
      case 'monochromatic':
        return [
          hslToHex(baseHue, s, 20),
          hslToHex(baseHue, s, 35),
          hslToHex(baseHue, s, 50),
          hslToHex(baseHue, s, 65),
          hslToHex(baseHue, s, 80),
        ]
      default:
        return Array(5).fill(null).map(() => generateRandomColor())
    }
  }

  const generatePalette = () => {
    const baseHue = Math.floor(Math.random() * 360)
    const newColors = generateHarmonyColors(baseHue, harmonyType)

    setColors(prev => {
      if (prev.length === 0) {
        return newColors.map(hex => ({ hex, locked: false }))
      }
      return prev.map((color, i) => ({
        hex: color.locked ? color.hex : newColors[i],
        locked: color.locked,
      }))
    })
  }

  const toggleLock = (index: number) => {
    setColors(prev => prev.map((color, i) =>
      i === index ? { ...color, locked: !color.locked } : color
    ))
  }

  const copyColor = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const savePalette = () => {
    const palette = colors.map(c => c.hex)
    const newPalettes = [palette, ...savedPalettes.slice(0, 9)]
    setSavedPalettes(newPalettes)
    localStorage.setItem('savedPalettes', JSON.stringify(newPalettes))
  }

  const loadPalette = (palette: string[]) => {
    setColors(palette.map(hex => ({ hex, locked: false })))
  }

  const exportPalette = () => {
    const css = colors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n')
    const scss = colors.map((c, i) => `$color-${i + 1}: ${c.hex};`).join('\n')
    const json = JSON.stringify(colors.map(c => c.hex), null, 2)

    const content = `/* CSS Variables */\n:root {\n${css}\n}\n\n/* SCSS Variables */\n${scss}\n\n/* JSON */\n${json}`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'palette.txt'
    link.click()
  }

  const getContrastColor = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#000000' : '#ffffff'
  }

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.target?.toString().includes('input')) {
        e.preventDefault()
        generatePalette()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [harmonyType])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Color Palette Generator</h1>
        <p className="text-muted-foreground">Generate beautiful color palettes. Press Space to generate!</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-muted-foreground" />
            <select
              value={harmonyType}
              onChange={(e) => setHarmonyType(e.target.value as HarmonyType)}
              className="px-3 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="random">Random</option>
              <option value="analogous">Analogous</option>
              <option value="complementary">Complementary</option>
              <option value="triadic">Triadic</option>
              <option value="split-complementary">Split Complementary</option>
              <option value="monochromatic">Monochromatic</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={generatePalette}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Generate
            </button>
            <button
              onClick={savePalette}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Save
            </button>
            <button
              onClick={exportPalette}
              className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Color Palette Display */}
        <div className="grid grid-cols-5 gap-2 mb-6 h-48 rounded-xl overflow-hidden">
          <AnimatePresence mode="popLayout">
            {colors.map((color, index) => (
              <motion.div
                key={`${index}-${color.hex}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group cursor-pointer"
                style={{ backgroundColor: color.hex }}
                onClick={() => copyColor(color.hex, index)}
              >
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: getContrastColor(color.hex) }}
                >
                  <span className="font-mono text-lg font-bold">{color.hex.toUpperCase()}</span>
                  {copiedIndex === index ? (
                    <div className="flex items-center gap-1 mt-2">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Copied!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 mt-2">
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Click to copy</span>
                    </div>
                  )}
                </div>

                {/* Lock Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleLock(index); }}
                  className="absolute top-2 right-2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundColor: color.locked ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.3)',
                    color: color.locked ? '#000' : '#fff',
                  }}
                >
                  {color.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Saved Palettes */}
        {savedPalettes.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">Saved Palettes</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {savedPalettes.map((palette, i) => (
                <button
                  key={i}
                  onClick={() => loadPalette(palette)}
                  className="w-full flex rounded-lg overflow-hidden h-8 hover:ring-2 hover:ring-blue-500 transition-all"
                >
                  {palette.map((hex, j) => (
                    <div
                      key={j}
                      className="flex-1"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">How to Use</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Press <kbd className="px-2 py-1 bg-muted rounded">Space</kbd> to generate a new palette</li>
            <li>Click on a color to copy its hex code</li>
            <li>Click the lock icon to keep a color while regenerating</li>
            <li>Choose different harmony types for cohesive palettes</li>
            <li>Save your favorite palettes for later</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

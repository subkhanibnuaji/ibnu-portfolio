'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Contrast, Check, X, AlertTriangle, Info,
  RefreshCw, Copy, Palette
} from 'lucide-react'

interface ContrastResult {
  ratio: number
  aa: { normal: boolean; large: boolean }
  aaa: { normal: boolean; large: boolean }
}

export function ContrastChecker() {
  const [foreground, setForeground] = useState('#ffffff')
  const [background, setBackground] = useState('#1a1a2e')
  const [result, setResult] = useState<ContrastResult | null>(null)
  const [copied, setCopied] = useState(false)

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null
  }

  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const getContrastRatio = (l1: number, l2: number): number => {
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)
  }

  useEffect(() => {
    const fg = hexToRgb(foreground)
    const bg = hexToRgb(background)

    if (fg && bg) {
      const fgLum = getLuminance(fg.r, fg.g, fg.b)
      const bgLum = getLuminance(bg.r, bg.g, bg.b)
      const ratio = getContrastRatio(fgLum, bgLum)

      setResult({
        ratio,
        aa: {
          normal: ratio >= 4.5,
          large: ratio >= 3
        },
        aaa: {
          normal: ratio >= 7,
          large: ratio >= 4.5
        }
      })
    }
  }, [foreground, background])

  const swapColors = () => {
    const temp = foreground
    setForeground(background)
    setBackground(temp)
  }

  const copyColors = () => {
    navigator.clipboard.writeText(`Foreground: ${foreground}\nBackground: ${background}\nContrast Ratio: ${result?.ratio.toFixed(2)}:1`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const presets = [
    { fg: '#000000', bg: '#ffffff', name: 'Black on White' },
    { fg: '#ffffff', bg: '#000000', name: 'White on Black' },
    { fg: '#1a1a2e', bg: '#f0f0f0', name: 'Dark on Light' },
    { fg: '#3b82f6', bg: '#ffffff', name: 'Blue on White' },
    { fg: '#22c55e', bg: '#ffffff', name: 'Green on White' },
    { fg: '#ef4444', bg: '#ffffff', name: 'Red on White' },
    { fg: '#a855f7', bg: '#ffffff', name: 'Purple on White' },
    { fg: '#f97316', bg: '#000000', name: 'Orange on Black' }
  ]

  const StatusIcon = ({ passed }: { passed: boolean }) => (
    passed ? (
      <Check className="w-4 h-4 text-green-400" />
    ) : (
      <X className="w-4 h-4 text-red-400" />
    )
  )

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Color Inputs */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-white/70 text-sm mb-2 block">Foreground (Text)</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={foreground}
                onChange={(e) => setForeground(e.target.value)}
                className="w-16 h-16 rounded-lg cursor-pointer border-0"
              />
              <input
                type="text"
                value={foreground}
                onChange={(e) => setForeground(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white font-mono"
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div>
            <label className="text-white/70 text-sm mb-2 block">Background</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="w-16 h-16 rounded-lg cursor-pointer border-0"
              />
              <input
                type="text"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white font-mono"
                placeholder="#1a1a2e"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={swapColors}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Swap Colors
          </button>
          <button
            onClick={copyColors}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Preview */}
        <div className="mb-6">
          <label className="text-white/70 text-sm mb-2 block">Preview</label>
          <div
            className="rounded-xl p-8 text-center"
            style={{ backgroundColor: background }}
          >
            <p
              className="text-4xl font-bold mb-2"
              style={{ color: foreground }}
            >
              Sample Text
            </p>
            <p
              className="text-lg"
              style={{ color: foreground }}
            >
              The quick brown fox jumps over the lazy dog
            </p>
            <p
              className="text-sm mt-2"
              style={{ color: foreground }}
            >
              Small text for testing accessibility
            </p>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="mb-6">
            <label className="text-white/70 text-sm mb-3 block flex items-center gap-2">
              <Contrast className="w-4 h-4" />
              Contrast Ratio
            </label>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Ratio */}
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className={`text-4xl font-bold ${
                  result.ratio >= 7 ? 'text-green-400' :
                  result.ratio >= 4.5 ? 'text-yellow-400' :
                  result.ratio >= 3 ? 'text-orange-400' : 'text-red-400'
                }`}>
                  {result.ratio.toFixed(2)}:1
                </div>
                <div className="text-white/50 text-sm mt-1">Contrast Ratio</div>
              </div>

              {/* AA Level */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-lg font-bold text-white mb-2">WCAG AA</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Normal Text</span>
                    <StatusIcon passed={result.aa.normal} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Large Text</span>
                    <StatusIcon passed={result.aa.large} />
                  </div>
                </div>
              </div>

              {/* AAA Level */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-lg font-bold text-white mb-2">WCAG AAA</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Normal Text</span>
                    <StatusIcon passed={result.aaa.normal} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Large Text</span>
                    <StatusIcon passed={result.aaa.large} />
                  </div>
                </div>
              </div>
            </div>

            {/* Warning */}
            {result.ratio < 4.5 && (
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-white/70 text-sm">
                  This color combination may be difficult to read for some users.
                  Consider increasing the contrast for better accessibility.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Presets */}
        <div>
          <label className="text-white/70 text-sm mb-3 block flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Color Presets
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {presets.map((preset, i) => (
              <button
                key={i}
                onClick={() => {
                  setForeground(preset.fg)
                  setBackground(preset.bg)
                }}
                className="p-3 rounded-lg text-left hover:ring-2 ring-white/30 transition-all"
                style={{ backgroundColor: preset.bg }}
              >
                <div
                  className="font-medium text-sm truncate"
                  style={{ color: preset.fg }}
                >
                  {preset.name}
                </div>
                <div
                  className="text-xs opacity-70"
                  style={{ color: preset.fg }}
                >
                  {preset.fg} / {preset.bg}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-white/70 text-sm">
            <p className="font-medium text-white mb-1">WCAG Guidelines:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>AA Normal: 4.5:1 minimum for regular text</li>
              <li>AA Large: 3:1 minimum for large text (18pt+ or 14pt bold)</li>
              <li>AAA Normal: 7:1 for enhanced accessibility</li>
              <li>AAA Large: 4.5:1 for enhanced accessibility on large text</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

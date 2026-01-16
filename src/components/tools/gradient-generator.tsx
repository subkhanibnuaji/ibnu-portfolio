'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Palette, Copy, Check, RefreshCw, Plus, X, RotateCw } from 'lucide-react'

interface ColorStop {
  id: string
  color: string
  position: number
}

const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')

const PRESETS = [
  { name: 'Sunset', colors: ['#f97316', '#ec4899', '#8b5cf6'] },
  { name: 'Ocean', colors: ['#06b6d4', '#3b82f6', '#1e3a8a'] },
  { name: 'Forest', colors: ['#22c55e', '#15803d', '#166534'] },
  { name: 'Fire', colors: ['#fbbf24', '#f97316', '#dc2626'] },
  { name: 'Purple Haze', colors: ['#a855f7', '#7c3aed', '#4c1d95'] },
  { name: 'Twilight', colors: ['#f472b6', '#8b5cf6', '#3b82f6'] },
  { name: 'Mint', colors: ['#6ee7b7', '#34d399', '#10b981'] },
  { name: 'Rose', colors: ['#fda4af', '#fb7185', '#e11d48'] },
]

export function GradientGenerator() {
  const [type, setType] = useState<'linear' | 'radial' | 'conic'>('linear')
  const [angle, setAngle] = useState(90)
  const [stops, setStops] = useState<ColorStop[]>([
    { id: '1', color: '#8b5cf6', position: 0 },
    { id: '2', color: '#ec4899', position: 100 }
  ])
  const [copied, setCopied] = useState<string | null>(null)

  const gradient = useMemo(() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position)
    const colorString = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ')

    switch (type) {
      case 'linear':
        return `linear-gradient(${angle}deg, ${colorString})`
      case 'radial':
        return `radial-gradient(circle, ${colorString})`
      case 'conic':
        return `conic-gradient(from ${angle}deg, ${colorString})`
      default:
        return ''
    }
  }, [type, angle, stops])

  const cssCode = `background: ${gradient};`
  const tailwindCode = `bg-gradient-to-r from-[${stops[0]?.color}] to-[${stops[stops.length - 1]?.color}]`

  const addStop = () => {
    const newStop: ColorStop = {
      id: Date.now().toString(),
      color: randomColor(),
      position: 50
    }
    setStops([...stops, newStop])
  }

  const removeStop = (id: string) => {
    if (stops.length <= 2) return
    setStops(stops.filter(s => s.id !== id))
  }

  const updateStop = (id: string, updates: Partial<ColorStop>) => {
    setStops(stops.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const randomize = () => {
    setStops(stops.map(s => ({ ...s, color: randomColor() })))
    setAngle(Math.floor(Math.random() * 360))
  }

  const applyPreset = (preset: typeof PRESETS[0]) => {
    const newStops = preset.colors.map((color, idx) => ({
      id: (idx + 1).toString(),
      color,
      position: (idx / (preset.colors.length - 1)) * 100
    }))
    setStops(newStops)
  }

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/10 text-fuchsia-500 text-sm font-medium mb-4">
          <Palette className="w-4 h-4" />
          Design Tool
        </div>
        <h2 className="text-2xl font-bold">Gradient Generator</h2>
        <p className="text-muted-foreground mt-2">
          Create beautiful CSS gradients.
        </p>
      </div>

      {/* Preview */}
      <div
        className="w-full h-64 rounded-2xl shadow-lg mb-6"
        style={{ background: gradient }}
      />

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Left: Type and Angle */}
        <div className="p-4 rounded-xl border border-border bg-card space-y-4">
          {/* Type */}
          <div>
            <label className="text-sm font-medium mb-2 block">Gradient Type</label>
            <div className="flex gap-2">
              {(['linear', 'radial', 'conic'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-lg capitalize font-medium transition-colors ${
                    type === t
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Angle */}
          {(type === 'linear' || type === 'conic') && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Angle</label>
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  {angle}°
                </span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={angle}
                  onChange={(e) => setAngle(parseInt(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <button
                  onClick={() => setAngle((angle + 45) % 360)}
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Randomize */}
          <button
            onClick={randomize}
            className="w-full py-2 bg-muted hover:bg-muted/80 rounded-lg font-medium inline-flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Randomize
          </button>
        </div>

        {/* Right: Color Stops */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium">Color Stops</label>
            <button
              onClick={addStop}
              className="p-1.5 rounded-lg bg-muted hover:bg-muted/80"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3 max-h-[200px] overflow-y-auto">
            {stops.map((stop, idx) => (
              <div key={stop.id} className="flex items-center gap-2">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={stop.color}
                  onChange={(e) => {
                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                      updateStop(stop.id, { color: e.target.value })
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background font-mono text-sm"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={stop.position}
                  onChange={(e) => updateStop(stop.id, { position: parseInt(e.target.value) || 0 })}
                  className="w-16 px-2 py-2 rounded-lg border border-border bg-background text-center"
                />
                <span className="text-sm text-muted-foreground">%</span>
                {stops.length > 2 && (
                  <button
                    onClick={() => removeStop(stop.id)}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Presets</h3>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <div
                className="w-6 h-6 rounded"
                style={{
                  background: `linear-gradient(90deg, ${preset.colors.join(', ')})`
                }}
              />
              <span className="text-sm">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Code Output */}
      <div className="space-y-4">
        {/* CSS */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">CSS</span>
            <button
              onClick={() => copyToClipboard(cssCode, 'css')}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {copied === 'css' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <pre className="font-mono text-sm bg-muted p-3 rounded-lg overflow-x-auto">
            {cssCode}
          </pre>
        </div>

        {/* Full CSS */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Full Background</span>
            <button
              onClick={() => copyToClipboard(gradient, 'full')}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {copied === 'full' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <pre className="font-mono text-sm bg-muted p-3 rounded-lg overflow-x-auto break-all">
            {gradient}
          </pre>
        </div>
      </div>
    </div>
  )
}

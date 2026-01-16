'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Square, Copy, Check, Plus, Trash2, RotateCcw } from 'lucide-react'

interface Shadow {
  id: string
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
  opacity: number
  inset: boolean
}

const PRESETS = [
  { name: 'Subtle', shadows: [{ offsetX: 0, offsetY: 1, blur: 3, spread: 0, color: '#000000', opacity: 0.1, inset: false }] },
  { name: 'Medium', shadows: [{ offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: '#000000', opacity: 0.1, inset: false }, { offsetX: 0, offsetY: 2, blur: 4, spread: -2, color: '#000000', opacity: 0.1, inset: false }] },
  { name: 'Large', shadows: [{ offsetX: 0, offsetY: 10, blur: 15, spread: -3, color: '#000000', opacity: 0.1, inset: false }, { offsetX: 0, offsetY: 4, blur: 6, spread: -4, color: '#000000', opacity: 0.1, inset: false }] },
  { name: 'Soft', shadows: [{ offsetX: 0, offsetY: 25, blur: 50, spread: -12, color: '#000000', opacity: 0.25, inset: false }] },
  { name: 'Hard', shadows: [{ offsetX: 5, offsetY: 5, blur: 0, spread: 0, color: '#000000', opacity: 0.2, inset: false }] },
  { name: 'Inset', shadows: [{ offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: '#000000', opacity: 0.1, inset: true }] },
  { name: 'Glow', shadows: [{ offsetX: 0, offsetY: 0, blur: 20, spread: 0, color: '#3b82f6', opacity: 0.5, inset: false }] },
  { name: 'Layered', shadows: [
    { offsetX: 0, offsetY: 1, blur: 1, spread: 0, color: '#000000', opacity: 0.05, inset: false },
    { offsetX: 0, offsetY: 2, blur: 2, spread: 0, color: '#000000', opacity: 0.05, inset: false },
    { offsetX: 0, offsetY: 4, blur: 4, spread: 0, color: '#000000', opacity: 0.05, inset: false },
    { offsetX: 0, offsetY: 8, blur: 8, spread: 0, color: '#000000', opacity: 0.05, inset: false },
  ]},
]

const hexToRgba = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export function BoxShadowGenerator() {
  const [shadows, setShadows] = useState<Shadow[]>([
    { id: '1', offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: '#000000', opacity: 0.1, inset: false }
  ])
  const [boxColor, setBoxColor] = useState('#ffffff')
  const [bgColor, setBgColor] = useState('#f3f4f6')
  const [copied, setCopied] = useState(false)
  const [activeId, setActiveId] = useState('1')

  const addShadow = () => {
    const newShadow: Shadow = {
      id: Date.now().toString(),
      offsetX: 0,
      offsetY: 4,
      blur: 6,
      spread: 0,
      color: '#000000',
      opacity: 0.1,
      inset: false
    }
    setShadows([...shadows, newShadow])
    setActiveId(newShadow.id)
  }

  const removeShadow = (id: string) => {
    if (shadows.length <= 1) return
    const newShadows = shadows.filter(s => s.id !== id)
    setShadows(newShadows)
    if (activeId === id) {
      setActiveId(newShadows[0].id)
    }
  }

  const updateShadow = (id: string, updates: Partial<Shadow>) => {
    setShadows(shadows.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const applyPreset = (preset: typeof PRESETS[0]) => {
    const newShadows = preset.shadows.map((s, i) => ({
      ...s,
      id: Date.now().toString() + i
    }))
    setShadows(newShadows)
    setActiveId(newShadows[0].id)
  }

  const getCssValue = (): string => {
    return shadows
      .map(s => {
        const inset = s.inset ? 'inset ' : ''
        const rgba = hexToRgba(s.color, s.opacity)
        return `${inset}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${rgba}`
      })
      .join(', ')
  }

  const cssCode = `box-shadow: ${getCssValue()};`

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(cssCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const activeShadow = shadows.find(s => s.id === activeId)

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-500 text-sm font-medium mb-4">
          <Square className="w-4 h-4" />
          CSS Tool
        </div>
        <h2 className="text-2xl font-bold">Box Shadow Generator</h2>
        <p className="text-muted-foreground mt-2">
          Create beautiful CSS box shadows with live preview.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Preview */}
        <div>
          <div
            className="h-80 rounded-xl flex items-center justify-center p-8 transition-colors"
            style={{ backgroundColor: bgColor }}
          >
            <motion.div
              className="w-40 h-40 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: boxColor,
                boxShadow: getCssValue()
              }}
            />
          </div>

          {/* Colors */}
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Box Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={boxColor}
                  onChange={(e) => setBoxColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={boxColor}
                  onChange={(e) => setBoxColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background font-mono text-sm"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Background</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Presets */}
          <div>
            <label className="text-sm font-medium mb-2 block">Presets</label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-1.5 rounded-lg text-sm bg-muted hover:bg-muted/80"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Shadow Layers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Shadow Layers</label>
              <button
                onClick={addShadow}
                className="p-1 rounded hover:bg-muted"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {shadows.map((shadow, idx) => (
                <button
                  key={shadow.id}
                  onClick={() => setActiveId(shadow.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 ${
                    activeId === shadow.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  Layer {idx + 1}
                  {shadows.length > 1 && (
                    <span
                      onClick={(e) => { e.stopPropagation(); removeShadow(shadow.id); }}
                      className="hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active Shadow Controls */}
          {activeShadow && (
            <div className="space-y-4 p-4 rounded-xl border border-border bg-card">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Offset X: {activeShadow.offsetX}px</label>
                  <input
                    type="range"
                    value={activeShadow.offsetX}
                    onChange={(e) => updateShadow(activeShadow.id, { offsetX: Number(e.target.value) })}
                    min={-50}
                    max={50}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Offset Y: {activeShadow.offsetY}px</label>
                  <input
                    type="range"
                    value={activeShadow.offsetY}
                    onChange={(e) => updateShadow(activeShadow.id, { offsetY: Number(e.target.value) })}
                    min={-50}
                    max={50}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Blur: {activeShadow.blur}px</label>
                  <input
                    type="range"
                    value={activeShadow.blur}
                    onChange={(e) => updateShadow(activeShadow.id, { blur: Number(e.target.value) })}
                    min={0}
                    max={100}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Spread: {activeShadow.spread}px</label>
                  <input
                    type="range"
                    value={activeShadow.spread}
                    onChange={(e) => updateShadow(activeShadow.id, { spread: Number(e.target.value) })}
                    min={-50}
                    max={50}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground">Color</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="color"
                      value={activeShadow.color}
                      onChange={(e) => updateShadow(activeShadow.id, { color: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={activeShadow.color}
                      onChange={(e) => updateShadow(activeShadow.id, { color: e.target.value })}
                      className="flex-1 px-2 py-1 rounded border border-border bg-background font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground">Opacity: {(activeShadow.opacity * 100).toFixed(0)}%</label>
                  <input
                    type="range"
                    value={activeShadow.opacity}
                    onChange={(e) => updateShadow(activeShadow.id, { opacity: Number(e.target.value) })}
                    min={0}
                    max={1}
                    step={0.01}
                    className="w-full mt-1"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeShadow.inset}
                  onChange={(e) => updateShadow(activeShadow.id, { inset: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Inset Shadow</span>
              </label>
            </div>
          )}

          {/* CSS Output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">CSS Code</label>
              <button
                onClick={copyToClipboard}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-muted/50 border border-border overflow-x-auto">
              <code className="text-sm font-mono">{cssCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

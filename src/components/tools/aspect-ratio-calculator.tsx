'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Monitor, Smartphone, Film, Camera, Lock, Unlock, ArrowRightLeft } from 'lucide-react'

interface PresetRatio {
  name: string
  width: number
  height: number
  icon: React.ElementType
  description: string
}

const PRESET_RATIOS: PresetRatio[] = [
  { name: '16:9', width: 16, height: 9, icon: Monitor, description: 'HD, Full HD, 4K' },
  { name: '4:3', width: 4, height: 3, icon: Monitor, description: 'Standard TV' },
  { name: '21:9', width: 21, height: 9, icon: Film, description: 'Ultrawide' },
  { name: '1:1', width: 1, height: 1, icon: Camera, description: 'Square' },
  { name: '9:16', width: 9, height: 16, icon: Smartphone, description: 'Mobile vertical' },
  { name: '3:2', width: 3, height: 2, icon: Camera, description: 'DSLR photos' },
  { name: '2:3', width: 2, height: 3, icon: Camera, description: 'Portrait photos' },
  { name: '4:5', width: 4, height: 5, icon: Smartphone, description: 'Instagram portrait' },
]

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

export function AspectRatioCalculator() {
  const [width1, setWidth1] = useState('1920')
  const [height1, setHeight1] = useState('1080')
  const [width2, setWidth2] = useState('')
  const [height2, setHeight2] = useState('')
  const [lockRatio, setLockRatio] = useState(true)
  const [lastChanged, setLastChanged] = useState<'width' | 'height'>('width')

  const currentRatio = useMemo(() => {
    const w = parseInt(width1) || 0
    const h = parseInt(height1) || 0
    if (w === 0 || h === 0) return { ratio: '0:0', decimal: 0, w: 0, h: 0 }

    const divisor = gcd(w, h)
    const ratioW = w / divisor
    const ratioH = h / divisor

    return {
      ratio: `${ratioW}:${ratioH}`,
      decimal: w / h,
      w: ratioW,
      h: ratioH,
    }
  }, [width1, height1])

  const handleWidth1Change = (value: string) => {
    setWidth1(value)
    setLastChanged('width')

    if (lockRatio && value) {
      const w = parseInt(value) || 0
      const h = parseInt(height1) || 0
      if (h > 0) {
        const ratio = w / h
        if (width2 && !height2) {
          setHeight2(Math.round(parseInt(width2) / ratio).toString())
        } else if (height2 && !width2) {
          setWidth2(Math.round(parseInt(height2) * ratio).toString())
        }
      }
    }
  }

  const handleHeight1Change = (value: string) => {
    setHeight1(value)
    setLastChanged('height')

    if (lockRatio && value) {
      const w = parseInt(width1) || 0
      const h = parseInt(value) || 0
      if (w > 0) {
        const ratio = w / h
        if (width2 && !height2) {
          setHeight2(Math.round(parseInt(width2) / ratio).toString())
        } else if (height2 && !width2) {
          setWidth2(Math.round(parseInt(height2) * ratio).toString())
        }
      }
    }
  }

  const handleWidth2Change = (value: string) => {
    setWidth2(value)
    if (lockRatio && value && currentRatio.decimal > 0) {
      setHeight2(Math.round(parseInt(value) / currentRatio.decimal).toString())
    }
  }

  const handleHeight2Change = (value: string) => {
    setHeight2(value)
    if (lockRatio && value && currentRatio.decimal > 0) {
      setWidth2(Math.round(parseInt(value) * currentRatio.decimal).toString())
    }
  }

  const applyPreset = (preset: PresetRatio) => {
    const currentW = parseInt(width1) || 1920
    const newHeight = Math.round(currentW / (preset.width / preset.height))
    setWidth1(currentW.toString())
    setHeight1(newHeight.toString())
  }

  const swapDimensions = () => {
    setWidth1(height1)
    setHeight1(width1)
    setWidth2(height2)
    setHeight2(width2)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Aspect Ratio Calculator</h1>
        <p className="text-muted-foreground">Calculate and convert aspect ratios</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Preset Ratios */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Common Ratios</h3>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_RATIOS.map(preset => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className={`p-3 rounded-lg text-center transition-colors hover:bg-blue-500/20 ${
                  currentRatio.ratio === preset.name ? 'bg-blue-600 text-white' : 'bg-muted'
                }`}
              >
                <preset.icon className="w-5 h-5 mx-auto mb-1" />
                <div className="font-semibold">{preset.name}</div>
                <div className="text-xs opacity-70">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Original Dimensions */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium">Original Size</h3>
            <button
              onClick={swapDimensions}
              className="p-2 bg-muted hover:bg-muted/80 rounded-lg"
              title="Swap dimensions"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Width</label>
              <input
                type="number"
                value={width1}
                onChange={(e) => handleWidth1Change(e.target.value)}
                placeholder="Width"
                min="1"
                className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Height</label>
              <input
                type="number"
                value={height1}
                onChange={(e) => handleHeight1Change(e.target.value)}
                placeholder="Height"
                min="1"
                className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Current Ratio Display */}
        <div className="mb-6 p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg text-center">
          <div className="text-sm text-muted-foreground mb-1">Aspect Ratio</div>
          <div className="text-3xl font-bold text-blue-500">{currentRatio.ratio}</div>
          <div className="text-sm text-muted-foreground mt-1">
            {currentRatio.decimal.toFixed(4)} : 1
          </div>
        </div>

        {/* Lock Ratio Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setLockRatio(!lockRatio)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              lockRatio ? 'bg-blue-600 text-white' : 'bg-muted'
            }`}
          >
            {lockRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            {lockRatio ? 'Ratio Locked' : 'Ratio Unlocked'}
          </button>
        </div>

        {/* Scale Calculator */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Scale to New Size</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">New Width</label>
              <input
                type="number"
                value={width2}
                onChange={(e) => handleWidth2Change(e.target.value)}
                placeholder="Enter width"
                min="1"
                className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">New Height</label>
              <input
                type="number"
                value={height2}
                onChange={(e) => handleHeight2Change(e.target.value)}
                placeholder="Enter height"
                min="1"
                className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {width2 && height2 && (
            <div className="mt-3 text-center text-sm text-muted-foreground">
              Scaled size: {width2} × {height2} px
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Preview</h3>
          <div className="flex justify-center">
            <div
              className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"
              style={{
                width: '200px',
                height: currentRatio.decimal > 0 ? `${200 / currentRatio.decimal}px` : '200px',
                maxHeight: '200px',
                maxWidth: currentRatio.decimal > 0 && currentRatio.decimal < 1
                  ? `${200 * currentRatio.decimal}px`
                  : '200px',
              }}
            />
          </div>
        </div>

        {/* Common Resolutions */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Common Resolutions</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">HD</span>
              <span>1280 × 720</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Full HD</span>
              <span>1920 × 1080</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">2K</span>
              <span>2560 × 1440</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">4K</span>
              <span>3840 × 2160</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

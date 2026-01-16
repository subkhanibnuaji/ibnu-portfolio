'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftRight, Copy, Check } from 'lucide-react'

const COMMON_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96]

export function PxToRemConverter() {
  const [pxValue, setPxValue] = useState('')
  const [remValue, setRemValue] = useState('')
  const [baseFontSize, setBaseFontSize] = useState('16')
  const [mode, setMode] = useState<'pxToRem' | 'remToPx'>('pxToRem')
  const [copied, setCopied] = useState<string | null>(null)

  const base = parseFloat(baseFontSize) || 16

  const conversion = useMemo(() => {
    if (mode === 'pxToRem') {
      const px = parseFloat(pxValue) || 0
      return {
        result: px / base,
        unit: 'rem',
        cssValue: `${(px / base).toFixed(4).replace(/\.?0+$/, '')}rem`,
      }
    } else {
      const rem = parseFloat(remValue) || 0
      return {
        result: rem * base,
        unit: 'px',
        cssValue: `${(rem * base).toFixed(2).replace(/\.?0+$/, '')}px`,
      }
    }
  }, [pxValue, remValue, base, mode])

  const conversionTable = useMemo(() => {
    return COMMON_SIZES.map(px => ({
      px,
      rem: (px / base).toFixed(4).replace(/\.?0+$/, ''),
    }))
  }, [base])

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handlePxChange = (value: string) => {
    setPxValue(value)
    if (mode === 'pxToRem') {
      const px = parseFloat(value) || 0
      setRemValue((px / base).toFixed(4).replace(/\.?0+$/, ''))
    }
  }

  const handleRemChange = (value: string) => {
    setRemValue(value)
    if (mode === 'remToPx') {
      const rem = parseFloat(value) || 0
      setPxValue((rem * base).toFixed(2).replace(/\.?0+$/, ''))
    }
  }

  const toggleMode = () => {
    setMode(mode === 'pxToRem' ? 'remToPx' : 'pxToRem')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">PX to REM Converter</h1>
        <p className="text-muted-foreground">Convert between pixels and rem units</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Base Font Size */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Base Font Size (px)</label>
          <input
            type="number"
            value={baseFontSize}
            onChange={(e) => setBaseFontSize(e.target.value)}
            placeholder="16"
            min="1"
            className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Default browser font size is 16px
          </p>
        </div>

        {/* Converter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Pixels (px)</label>
            <input
              type="number"
              value={pxValue}
              onChange={(e) => handlePxChange(e.target.value)}
              placeholder="16"
              min="0"
              step="1"
              className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg"
            />
          </div>

          <button
            onClick={toggleMode}
            className="p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors mt-6"
            title="Switch direction"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">REM</label>
            <input
              type="number"
              value={remValue}
              onChange={(e) => handleRemChange(e.target.value)}
              placeholder="1"
              min="0"
              step="0.0625"
              className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg"
            />
          </div>
        </div>

        {/* Result */}
        {conversion.result > 0 && (
          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-muted-foreground">CSS Value</div>
              <div className="text-xl font-mono font-bold">{conversion.cssValue}</div>
            </div>
            <button
              onClick={() => copyToClipboard(conversion.cssValue, 'result')}
              className="p-2 bg-background/50 hover:bg-background rounded-lg transition-colors"
            >
              {copied === 'result' ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        )}

        {/* Common Sizes */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Quick Convert</h3>
          <div className="flex flex-wrap gap-2">
            {[12, 14, 16, 18, 20, 24, 32].map(px => (
              <button
                key={px}
                onClick={() => {
                  setPxValue(px.toString())
                  setRemValue((px / base).toFixed(4).replace(/\.?0+$/, ''))
                }}
                className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
              >
                {px}px
              </button>
            ))}
          </div>
        </div>

        {/* Conversion Table */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-3">Conversion Table (Base: {base}px)</h3>
          <div className="grid grid-cols-3 gap-2 text-sm max-h-64 overflow-y-auto">
            <div className="font-medium text-muted-foreground">Pixels</div>
            <div className="font-medium text-muted-foreground">REM</div>
            <div></div>
            {conversionTable.map(({ px, rem }) => (
              <>
                <div key={`px-${px}`}>{px}px</div>
                <div key={`rem-${px}`}>{rem}rem</div>
                <button
                  key={`copy-${px}`}
                  onClick={() => copyToClipboard(`${rem}rem`, `table-${px}`)}
                  className="text-blue-500 hover:underline text-left"
                >
                  {copied === `table-${px}` ? 'Copied!' : 'Copy'}
                </button>
              </>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-500/10 rounded-lg text-sm">
          <p className="font-semibold text-blue-600 mb-1">Why use REM?</p>
          <p className="text-muted-foreground">
            REM units are relative to the root element{"'"}s font size, making your design more accessible
            and easier to scale. Users who increase their browser{"'"}s font size will see your layout adjust accordingly.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

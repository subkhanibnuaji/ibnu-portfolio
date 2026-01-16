'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shuffle, Copy, Check, History, Settings } from 'lucide-react'

interface GeneratedNumber {
  value: number | number[]
  timestamp: Date
  min: number
  max: number
}

export function RandomNumberGenerator() {
  const [min, setMin] = useState('1')
  const [max, setMax] = useState('100')
  const [count, setCount] = useState('1')
  const [allowDuplicates, setAllowDuplicates] = useState(true)
  const [result, setResult] = useState<number[] | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [history, setHistory] = useState<GeneratedNumber[]>([])
  const [copied, setCopied] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const generate = () => {
    const minVal = parseInt(min) || 0
    const maxVal = parseInt(max) || 100
    const countVal = Math.min(parseInt(count) || 1, allowDuplicates ? 1000 : maxVal - minVal + 1)

    if (minVal > maxVal) {
      return
    }

    setIsGenerating(true)

    setTimeout(() => {
      let numbers: number[] = []

      if (allowDuplicates) {
        for (let i = 0; i < countVal; i++) {
          numbers.push(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal)
        }
      } else {
        // Generate unique numbers
        const available = Array.from({ length: maxVal - minVal + 1 }, (_, i) => minVal + i)
        for (let i = 0; i < countVal && available.length > 0; i++) {
          const index = Math.floor(Math.random() * available.length)
          numbers.push(available[index])
          available.splice(index, 1)
        }
      }

      setResult(numbers)
      setHistory(prev => [{
        value: numbers.length === 1 ? numbers[0] : numbers,
        timestamp: new Date(),
        min: minVal,
        max: maxVal,
      }, ...prev].slice(0, 20))
      setIsGenerating(false)
    }, 300)
  }

  const copyResult = () => {
    if (!result) return
    navigator.clipboard.writeText(result.join(', '))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const applyPreset = (minVal: number, maxVal: number) => {
    setMin(minVal.toString())
    setMax(maxVal.toString())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Random Number Generator</h1>
        <p className="text-muted-foreground">Generate random numbers in any range</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Presets */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <button onClick={() => applyPreset(1, 10)} className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-lg text-sm">1-10</button>
          <button onClick={() => applyPreset(1, 100)} className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-lg text-sm">1-100</button>
          <button onClick={() => applyPreset(1, 1000)} className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-lg text-sm">1-1000</button>
          <button onClick={() => applyPreset(0, 1)} className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-lg text-sm">0-1</button>
          <button onClick={() => applyPreset(1, 6)} className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-lg text-sm">🎲 1-6</button>
        </div>

        {/* Range Input */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Minimum</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-lg text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Maximum</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-lg text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Settings Toggle */}
        <div className="mb-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mx-auto"
          >
            <Settings className="w-4 h-4" />
            Advanced Settings
          </button>
        </div>

        {/* Advanced Settings */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">How many numbers?</label>
                  <input
                    type="number"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    min="1"
                    max="100"
                    className="w-full px-4 py-2 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowDuplicates}
                    onChange={(e) => setAllowDuplicates(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Allow duplicates</span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate Button */}
        <button
          onClick={generate}
          disabled={isGenerating}
          className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg font-semibold text-lg flex items-center justify-center gap-2 mb-6"
        >
          <Shuffle className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>

        {/* Result Display */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.join(',')}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-6"
            >
              <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl text-center">
                {result.length === 1 ? (
                  <div className="text-6xl font-bold text-blue-500">{result[0]}</div>
                ) : (
                  <div className="flex flex-wrap justify-center gap-2">
                    {result.map((num, i) => (
                      <span
                        key={i}
                        className="px-3 py-2 bg-blue-500/30 rounded-lg font-mono font-bold text-lg"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-center mt-3">
                <button
                  onClick={copyResult}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {history.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {history.slice(0, 10).map((item, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-muted/50 rounded-lg text-sm">
                  <span className="text-muted-foreground">
                    {item.min}-{item.max}
                  </span>
                  <span className="font-mono font-semibold">
                    {Array.isArray(item.value) ? item.value.join(', ') : item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRightLeft, Copy, Check } from 'lucide-react'

const ROMAN_MAP: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
]

const EXAMPLES = [
  { arabic: 1, roman: 'I' },
  { arabic: 4, roman: 'IV' },
  { arabic: 9, roman: 'IX' },
  { arabic: 40, roman: 'XL' },
  { arabic: 90, roman: 'XC' },
  { arabic: 400, roman: 'CD' },
  { arabic: 900, roman: 'CM' },
  { arabic: 1999, roman: 'MCMXCIX' },
  { arabic: 2024, roman: 'MMXXIV' },
]

function arabicToRoman(num: number): string {
  if (num <= 0 || num > 3999 || !Number.isInteger(num)) {
    return ''
  }

  let result = ''
  for (const [value, symbol] of ROMAN_MAP) {
    while (num >= value) {
      result += symbol
      num -= value
    }
  }
  return result
}

function romanToArabic(roman: string): number {
  const cleaned = roman.toUpperCase().trim()
  if (!cleaned || !/^[MDCLXVI]+$/i.test(cleaned)) {
    return 0
  }

  const romanValues: Record<string, number> = {
    'M': 1000, 'D': 500, 'C': 100, 'L': 50, 'X': 10, 'V': 5, 'I': 1
  }

  let result = 0
  for (let i = 0; i < cleaned.length; i++) {
    const current = romanValues[cleaned[i]]
    const next = romanValues[cleaned[i + 1]] || 0

    if (current < next) {
      result -= current
    } else {
      result += current
    }
  }

  // Validate by converting back
  if (arabicToRoman(result) !== cleaned) {
    return 0
  }

  return result
}

export function RomanNumeralConverter() {
  const [arabic, setArabic] = useState('')
  const [roman, setRoman] = useState('')
  const [mode, setMode] = useState<'toRoman' | 'toArabic'>('toRoman')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const handleArabicChange = (value: string) => {
    setArabic(value)
    setError('')
    const num = parseInt(value)
    if (value === '') {
      setRoman('')
    } else if (isNaN(num) || num <= 0 || num > 3999) {
      setRoman('')
      setError('Enter a number between 1 and 3999')
    } else {
      setRoman(arabicToRoman(num))
    }
  }

  const handleRomanChange = (value: string) => {
    setRoman(value.toUpperCase())
    setError('')
    if (value === '') {
      setArabic('')
    } else if (!/^[MDCLXVImdclxvi]*$/.test(value)) {
      setArabic('')
      setError('Use only valid Roman numeral characters (M, D, C, L, X, V, I)')
    } else {
      const num = romanToArabic(value)
      if (num === 0) {
        setArabic('')
        setError('Invalid Roman numeral')
      } else {
        setArabic(num.toString())
      }
    }
  }

  const swapMode = () => {
    setMode(mode === 'toRoman' ? 'toArabic' : 'toRoman')
    setArabic('')
    setRoman('')
    setError('')
  }

  const copyResult = async () => {
    const textToCopy = mode === 'toRoman' ? roman : arabic
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Roman Numeral Converter</h1>
        <p className="text-muted-foreground">Convert between Arabic and Roman numerals</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={swapMode}
            className="flex items-center gap-3 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
          >
            <span className={mode === 'toRoman' ? 'font-bold text-blue-500' : ''}>Arabic</span>
            <ArrowRightLeft className="w-4 h-4" />
            <span className={mode === 'toArabic' ? 'font-bold text-blue-500' : ''}>Roman</span>
          </button>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Arabic Number</label>
            <input
              type={mode === 'toRoman' ? 'number' : 'text'}
              value={arabic}
              onChange={(e) => mode === 'toRoman' && handleArabicChange(e.target.value)}
              readOnly={mode === 'toArabic'}
              placeholder={mode === 'toRoman' ? 'Enter number (1-3999)' : 'Result'}
              min="1"
              max="3999"
              className={`w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-center ${
                mode === 'toArabic' ? 'bg-muted/50' : ''
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Roman Numeral</label>
            <input
              type="text"
              value={roman}
              onChange={(e) => mode === 'toArabic' && handleRomanChange(e.target.value)}
              readOnly={mode === 'toRoman'}
              placeholder={mode === 'toArabic' ? 'Enter Roman numeral' : 'Result'}
              className={`w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-center font-serif ${
                mode === 'toRoman' ? 'bg-muted/50' : ''
              }`}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Copy Button */}
        <button
          onClick={copyResult}
          disabled={mode === 'toRoman' ? !roman : !arabic}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Result'}
        </button>

        {/* Reference Table */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Roman Numeral Reference</h3>
          <div className="grid grid-cols-7 gap-2 text-center mb-4">
            {[
              { symbol: 'I', value: 1 },
              { symbol: 'V', value: 5 },
              { symbol: 'X', value: 10 },
              { symbol: 'L', value: 50 },
              { symbol: 'C', value: 100 },
              { symbol: 'D', value: 500 },
              { symbol: 'M', value: 1000 },
            ].map(({ symbol, value }) => (
              <div key={symbol} className="p-2 bg-muted rounded-lg">
                <div className="text-lg font-serif font-bold">{symbol}</div>
                <div className="text-xs text-muted-foreground">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Examples */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Examples</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {EXAMPLES.map(({ arabic, roman }) => (
              <div key={arabic} className="flex justify-between">
                <span className="text-muted-foreground">{arabic}</span>
                <span className="font-serif">{roman}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

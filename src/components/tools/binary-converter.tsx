'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Copy, Check, RefreshCw } from 'lucide-react'

type ConversionBase = 'decimal' | 'binary' | 'octal' | 'hexadecimal'

export function BinaryConverter() {
  const [inputValue, setInputValue] = useState('')
  const [inputBase, setInputBase] = useState<ConversionBase>('decimal')
  const [copied, setCopied] = useState<string | null>(null)

  const conversions = useMemo(() => {
    if (!inputValue.trim()) {
      return { decimal: '', binary: '', octal: '', hexadecimal: '' }
    }

    let decimalValue: number

    try {
      switch (inputBase) {
        case 'binary':
          if (!/^[01]+$/.test(inputValue)) throw new Error('Invalid binary')
          decimalValue = parseInt(inputValue, 2)
          break
        case 'octal':
          if (!/^[0-7]+$/.test(inputValue)) throw new Error('Invalid octal')
          decimalValue = parseInt(inputValue, 8)
          break
        case 'hexadecimal':
          if (!/^[0-9A-Fa-f]+$/.test(inputValue)) throw new Error('Invalid hex')
          decimalValue = parseInt(inputValue, 16)
          break
        default:
          if (!/^\d+$/.test(inputValue)) throw new Error('Invalid decimal')
          decimalValue = parseInt(inputValue, 10)
      }

      if (isNaN(decimalValue) || decimalValue < 0) {
        throw new Error('Invalid number')
      }

      return {
        decimal: decimalValue.toString(10),
        binary: decimalValue.toString(2),
        octal: decimalValue.toString(8),
        hexadecimal: decimalValue.toString(16).toUpperCase(),
      }
    } catch {
      return { decimal: 'Invalid', binary: 'Invalid', octal: 'Invalid', hexadecimal: 'Invalid' }
    }
  }, [inputValue, inputBase])

  const copyValue = (value: string, type: string) => {
    if (value === 'Invalid') return
    navigator.clipboard.writeText(value)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const clear = () => {
    setInputValue('')
  }

  const baseInfo: Record<ConversionBase, { label: string; prefix: string; placeholder: string }> = {
    decimal: { label: 'Decimal (Base 10)', prefix: '', placeholder: '42' },
    binary: { label: 'Binary (Base 2)', prefix: '0b', placeholder: '101010' },
    octal: { label: 'Octal (Base 8)', prefix: '0o', placeholder: '52' },
    hexadecimal: { label: 'Hexadecimal (Base 16)', prefix: '0x', placeholder: '2A' },
  }

  const ResultCard = ({ base, value }: { base: ConversionBase; value: string }) => (
    <div className={`p-4 rounded-lg ${inputBase === base ? 'bg-blue-500/20 border-2 border-blue-500' : 'bg-muted/50'}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm text-muted-foreground">{baseInfo[base].label}</span>
        <button
          onClick={() => copyValue(value, base)}
          disabled={value === 'Invalid'}
          className="p-1 hover:bg-muted rounded disabled:opacity-50"
        >
          {copied === base ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <div className="font-mono text-xl break-all">
        {value && value !== 'Invalid' && (
          <span className="text-muted-foreground">{baseInfo[base].prefix}</span>
        )}
        {value || '—'}
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Number Base Converter</h1>
        <p className="text-muted-foreground">Convert between decimal, binary, octal, and hexadecimal</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Input Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Input</label>
            <button
              onClick={clear}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Base Selection */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {(Object.keys(baseInfo) as ConversionBase[]).map(base => (
              <button
                key={base}
                onClick={() => { setInputBase(base); setInputValue(''); }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  inputBase === base
                    ? 'bg-blue-600 text-white'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {base.charAt(0).toUpperCase() + base.slice(1, 3)}
              </button>
            ))}
          </div>

          {/* Input Field */}
          <div className="relative">
            {baseInfo[inputBase].prefix && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">
                {baseInfo[inputBase].prefix}
              </span>
            )}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.toUpperCase())}
              placeholder={baseInfo[inputBase].placeholder}
              className={`w-full px-4 py-3 bg-muted rounded-lg font-mono text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                baseInfo[inputBase].prefix ? 'pl-12' : ''
              }`}
            />
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center mb-6">
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          <ResultCard base="decimal" value={conversions.decimal} />
          <ResultCard base="binary" value={conversions.binary} />
          <ResultCard base="octal" value={conversions.octal} />
          <ResultCard base="hexadecimal" value={conversions.hexadecimal} />
        </div>

        {/* Quick Reference */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Quick Reference</h3>
          <div className="grid grid-cols-4 gap-2 text-sm font-mono">
            <div className="text-muted-foreground">Dec</div>
            <div className="text-muted-foreground">Bin</div>
            <div className="text-muted-foreground">Oct</div>
            <div className="text-muted-foreground">Hex</div>
            {[0, 1, 2, 8, 10, 15, 16, 255].map(num => (
              <>
                <div key={`d${num}`}>{num}</div>
                <div key={`b${num}`}>{num.toString(2)}</div>
                <div key={`o${num}`}>{num.toString(8)}</div>
                <div key={`h${num}`}>{num.toString(16).toUpperCase()}</div>
              </>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

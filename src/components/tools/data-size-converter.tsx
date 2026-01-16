'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { HardDrive, Copy, Check } from 'lucide-react'

type DataUnit = 'b' | 'kb' | 'mb' | 'gb' | 'tb' | 'pb'
type Base = 'binary' | 'decimal'

const UNITS: { id: DataUnit; name: string; binaryFactor: number; decimalFactor: number }[] = [
  { id: 'b', name: 'Bytes', binaryFactor: 1, decimalFactor: 1 },
  { id: 'kb', name: 'Kilobytes', binaryFactor: 1024, decimalFactor: 1000 },
  { id: 'mb', name: 'Megabytes', binaryFactor: 1024 ** 2, decimalFactor: 1000 ** 2 },
  { id: 'gb', name: 'Gigabytes', binaryFactor: 1024 ** 3, decimalFactor: 1000 ** 3 },
  { id: 'tb', name: 'Terabytes', binaryFactor: 1024 ** 4, decimalFactor: 1000 ** 4 },
  { id: 'pb', name: 'Petabytes', binaryFactor: 1024 ** 5, decimalFactor: 1000 ** 5 },
]

function formatNumber(num: number): string {
  if (num >= 1000000) return num.toExponential(4)
  if (num >= 0.001) return num.toLocaleString(undefined, { maximumFractionDigits: 4 })
  if (num === 0) return '0'
  return num.toExponential(4)
}

export function DataSizeConverter() {
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState<DataUnit>('mb')
  const [base, setBase] = useState<Base>('binary')
  const [copied, setCopied] = useState<string | null>(null)

  const conversions = useMemo(() => {
    const num = parseFloat(value) || 0
    if (num === 0) return []

    const fromUnitData = UNITS.find(u => u.id === fromUnit)!
    const factor = base === 'binary' ? fromUnitData.binaryFactor : fromUnitData.decimalFactor
    const bytes = num * factor

    return UNITS.map(unit => {
      const unitFactor = base === 'binary' ? unit.binaryFactor : unit.decimalFactor
      const converted = bytes / unitFactor
      return {
        unit: unit.id,
        name: unit.name,
        value: converted,
        formatted: formatNumber(converted),
        label: base === 'binary'
          ? unit.id === 'b' ? 'B' : unit.id.toUpperCase().replace('B', 'iB')
          : unit.id === 'b' ? 'B' : unit.id.toUpperCase(),
      }
    })
  }, [value, fromUnit, base])

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const bits = useMemo(() => {
    const num = parseFloat(value) || 0
    if (num === 0) return 0
    const fromUnitData = UNITS.find(u => u.id === fromUnit)!
    const factor = base === 'binary' ? fromUnitData.binaryFactor : fromUnitData.decimalFactor
    return num * factor * 8
  }, [value, fromUnit, base])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Size Converter</h1>
        <p className="text-muted-foreground">Convert between bytes, KB, MB, GB, TB, and PB</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Base Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg bg-muted p-1">
            <button
              onClick={() => setBase('binary')}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                base === 'binary' ? 'bg-background shadow' : ''
              }`}
            >
              Binary (1024)
            </button>
            <button
              onClick={() => setBase('decimal')}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                base === 'decimal' ? 'bg-background shadow' : ''
              }`}
            >
              Decimal (1000)
            </button>
          </div>
        </div>

        {/* Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Enter Value</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter size"
              min="0"
              className="flex-1 px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as DataUnit)}
              className="px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {UNITS.map(unit => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Values */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {['1', '10', '100', '256', '500', '1000'].map(val => (
              <button
                key={val}
                onClick={() => setValue(val)}
                className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {conversions.length > 0 && (
          <div className="space-y-2">
            {conversions.map(conv => (
              <div
                key={conv.unit}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  conv.unit === fromUnit ? 'bg-blue-500/20' : 'bg-muted/50'
                }`}
              >
                <div>
                  <span className="text-muted-foreground">{conv.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium">
                    {conv.formatted} {conv.label}
                  </span>
                  <button
                    onClick={() => copyToClipboard(conv.formatted, conv.unit)}
                    className="p-1 hover:bg-background rounded transition-colors"
                  >
                    {copied === conv.unit ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}

            {/* Bits */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Bits</span>
              <span className="font-mono font-medium">{formatNumber(bits)} bits</span>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-500/10 rounded-lg text-sm">
          <h3 className="font-semibold text-blue-600 mb-2">Binary vs Decimal</h3>
          <div className="text-muted-foreground space-y-1">
            <p><strong>Binary (1024):</strong> Used by operating systems (KiB, MiB, GiB)</p>
            <p><strong>Decimal (1000):</strong> Used by storage manufacturers (KB, MB, GB)</p>
            <p className="mt-2">This is why a "1TB" drive shows as ~931GB in your OS!</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

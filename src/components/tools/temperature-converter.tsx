'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Thermometer, ArrowRight } from 'lucide-react'

type Unit = 'celsius' | 'fahrenheit' | 'kelvin'

const UNITS: { id: Unit; name: string; symbol: string }[] = [
  { id: 'celsius', name: 'Celsius', symbol: '°C' },
  { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F' },
  { id: 'kelvin', name: 'Kelvin', symbol: 'K' },
]

const PRESETS = [
  { name: 'Absolute Zero', celsius: -273.15 },
  { name: 'Water Freezes', celsius: 0 },
  { name: 'Room Temperature', celsius: 20 },
  { name: 'Body Temperature', celsius: 37 },
  { name: 'Water Boils', celsius: 100 },
]

function celsiusTo(value: number, to: Unit): number {
  switch (to) {
    case 'celsius': return value
    case 'fahrenheit': return (value * 9/5) + 32
    case 'kelvin': return value + 273.15
  }
}

function toCelsius(value: number, from: Unit): number {
  switch (from) {
    case 'celsius': return value
    case 'fahrenheit': return (value - 32) * 5/9
    case 'kelvin': return value - 273.15
  }
}

function getTemperatureColor(celsius: number): string {
  if (celsius < -20) return 'from-blue-900 to-blue-700'
  if (celsius < 0) return 'from-blue-700 to-blue-500'
  if (celsius < 10) return 'from-blue-500 to-cyan-400'
  if (celsius < 20) return 'from-cyan-400 to-green-400'
  if (celsius < 30) return 'from-green-400 to-yellow-400'
  if (celsius < 40) return 'from-yellow-400 to-orange-500'
  return 'from-orange-500 to-red-600'
}

export function TemperatureConverter() {
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState<Unit>('celsius')

  const conversions = useMemo(() => {
    const num = parseFloat(value)
    if (isNaN(num)) return null

    const celsius = toCelsius(num, fromUnit)
    return {
      celsius: celsiusTo(celsius, 'celsius'),
      fahrenheit: celsiusTo(celsius, 'fahrenheit'),
      kelvin: celsiusTo(celsius, 'kelvin'),
      colorGradient: getTemperatureColor(celsius),
    }
  }, [value, fromUnit])

  const applyPreset = (celsius: number) => {
    setFromUnit('celsius')
    setValue(celsius.toString())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Temperature Converter</h1>
        <p className="text-muted-foreground">Convert between Celsius, Fahrenheit, and Kelvin</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Temperature</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter temperature"
              className="flex-1 px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as Unit)}
              className="px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {UNITS.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.symbol}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Presets */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Quick Presets</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(preset => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset.celsius)}
                className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {conversions && (
          <>
            {/* Temperature Gauge */}
            <div className={`mb-6 p-4 rounded-lg bg-gradient-to-r ${conversions.colorGradient}`}>
              <div className="flex items-center justify-center gap-2 text-white">
                <Thermometer className="w-6 h-6" />
                <span className="text-2xl font-bold">
                  {conversions.celsius.toFixed(1)}°C
                </span>
              </div>
            </div>

            {/* Conversions */}
            <div className="grid grid-cols-3 gap-4">
              {UNITS.map(unit => (
                <div
                  key={unit.id}
                  className={`p-4 rounded-lg text-center ${
                    fromUnit === unit.id ? 'bg-blue-600 text-white' : 'bg-muted'
                  }`}
                >
                  <div className="text-sm opacity-70 mb-1">{unit.name}</div>
                  <div className="text-xl font-bold">
                    {conversions[unit.id].toFixed(2)}{unit.symbol}
                  </div>
                </div>
              ))}
            </div>

            {/* Formula */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm">
              <h3 className="font-semibold mb-2">Conversion Formulas</h3>
              <div className="grid grid-cols-1 gap-1 text-muted-foreground font-mono text-xs">
                <div>°F = (°C × 9/5) + 32</div>
                <div>°C = (°F - 32) × 5/9</div>
                <div>K = °C + 273.15</div>
              </div>
            </div>
          </>
        )}

        {/* Reference */}
        <div className="mt-6 p-4 bg-blue-500/10 rounded-lg text-sm">
          <h3 className="font-semibold text-blue-600 mb-2">Reference Points</h3>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="font-medium">Celsius</div>
            <div className="font-medium">Fahrenheit</div>
            <div className="font-medium">Kelvin</div>
            {PRESETS.map(preset => (
              <>
                <div key={`c-${preset.name}`}>{preset.celsius}°C</div>
                <div key={`f-${preset.name}`}>{celsiusTo(preset.celsius, 'fahrenheit').toFixed(1)}°F</div>
                <div key={`k-${preset.name}`}>{celsiusTo(preset.celsius, 'kelvin').toFixed(2)}K</div>
              </>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

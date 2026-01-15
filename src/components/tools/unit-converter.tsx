'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRightLeft, Ruler, Thermometer, Scale, Clock, Database, Zap } from 'lucide-react'

type UnitCategory = 'length' | 'weight' | 'temperature' | 'time' | 'data' | 'speed'

interface UnitConfig {
  name: string
  units: { [key: string]: number | ((v: number) => number) }
  icon: any
  color: string
}

const UNIT_CONFIGS: Record<UnitCategory, UnitConfig> = {
  length: {
    name: 'Length',
    icon: Ruler,
    color: 'text-blue-500',
    units: {
      'Meter (m)': 1,
      'Kilometer (km)': 0.001,
      'Centimeter (cm)': 100,
      'Millimeter (mm)': 1000,
      'Mile': 0.000621371,
      'Yard': 1.09361,
      'Foot': 3.28084,
      'Inch': 39.3701
    }
  },
  weight: {
    name: 'Weight',
    icon: Scale,
    color: 'text-green-500',
    units: {
      'Kilogram (kg)': 1,
      'Gram (g)': 1000,
      'Milligram (mg)': 1000000,
      'Pound (lb)': 2.20462,
      'Ounce (oz)': 35.274,
      'Ton': 0.001
    }
  },
  temperature: {
    name: 'Temperature',
    icon: Thermometer,
    color: 'text-red-500',
    units: {
      'Celsius (°C)': (v: number) => v,
      'Fahrenheit (°F)': (v: number) => v * 9/5 + 32,
      'Kelvin (K)': (v: number) => v + 273.15
    }
  },
  time: {
    name: 'Time',
    icon: Clock,
    color: 'text-purple-500',
    units: {
      'Second': 1,
      'Minute': 1/60,
      'Hour': 1/3600,
      'Day': 1/86400,
      'Week': 1/604800,
      'Month (30d)': 1/2592000,
      'Year': 1/31536000,
      'Millisecond': 1000
    }
  },
  data: {
    name: 'Data',
    icon: Database,
    color: 'text-cyan-500',
    units: {
      'Byte (B)': 1,
      'Kilobyte (KB)': 1/1024,
      'Megabyte (MB)': 1/(1024*1024),
      'Gigabyte (GB)': 1/(1024*1024*1024),
      'Terabyte (TB)': 1/(1024*1024*1024*1024),
      'Bit': 8
    }
  },
  speed: {
    name: 'Speed',
    icon: Zap,
    color: 'text-amber-500',
    units: {
      'm/s': 1,
      'km/h': 3.6,
      'mph': 2.23694,
      'knot': 1.94384,
      'ft/s': 3.28084
    }
  }
}

export function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length')
  const [fromUnit, setFromUnit] = useState<string>('')
  const [toUnit, setToUnit] = useState<string>('')
  const [fromValue, setFromValue] = useState<string>('1')
  const [toValue, setToValue] = useState<string>('')

  const config = UNIT_CONFIGS[category]
  const units = Object.keys(config.units)

  // Set default units when category changes
  useState(() => {
    if (units.length >= 2) {
      setFromUnit(units[0])
      setToUnit(units[1])
    }
  })

  const convert = (value: string, from: string, to: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue) || !from || !to) return ''

    if (category === 'temperature') {
      // Temperature needs special handling
      const fromFn = config.units[from]
      const toFn = config.units[to]

      if (typeof fromFn === 'function' && typeof toFn === 'function') {
        // Convert to Celsius first, then to target
        let celsius: number
        if (from.includes('Celsius')) {
          celsius = numValue
        } else if (from.includes('Fahrenheit')) {
          celsius = (numValue - 32) * 5/9
        } else { // Kelvin
          celsius = numValue - 273.15
        }

        let result: number
        if (to.includes('Celsius')) {
          result = celsius
        } else if (to.includes('Fahrenheit')) {
          result = celsius * 9/5 + 32
        } else { // Kelvin
          result = celsius + 273.15
        }

        return result.toFixed(4).replace(/\.?0+$/, '')
      }
    } else {
      const fromFactor = config.units[from]
      const toFactor = config.units[to]

      if (typeof fromFactor === 'number' && typeof toFactor === 'number') {
        // Convert to base unit, then to target
        const baseValue = numValue / fromFactor
        const result = baseValue * toFactor
        return result.toFixed(6).replace(/\.?0+$/, '')
      }
    }

    return ''
  }

  const handleFromValueChange = (value: string) => {
    setFromValue(value)
    setToValue(convert(value, fromUnit, toUnit))
  }

  const handleToValueChange = (value: string) => {
    setToValue(value)
    setFromValue(convert(value, toUnit, fromUnit))
  }

  const handleFromUnitChange = (unit: string) => {
    setFromUnit(unit)
    setToValue(convert(fromValue, unit, toUnit))
  }

  const handleToUnitChange = (unit: string) => {
    setToUnit(unit)
    setToValue(convert(fromValue, fromUnit, unit))
  }

  const handleCategoryChange = (newCategory: UnitCategory) => {
    setCategory(newCategory)
    const newUnits = Object.keys(UNIT_CONFIGS[newCategory].units)
    setFromUnit(newUnits[0])
    setToUnit(newUnits[1] || newUnits[0])
    setFromValue('1')
    setToValue(convert('1', newUnits[0], newUnits[1] || newUnits[0]))
  }

  const swapUnits = () => {
    const tempUnit = fromUnit
    const tempValue = fromValue
    setFromUnit(toUnit)
    setToUnit(tempUnit)
    setFromValue(toValue)
    setToValue(tempValue)
  }

  // Initialize conversion on mount
  useState(() => {
    if (fromUnit && toUnit) {
      setToValue(convert(fromValue, fromUnit, toUnit))
    }
  })

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-500 text-sm font-medium mb-4">
          <ArrowRightLeft className="w-4 h-4" />
          Converter
        </div>
        <h2 className="text-2xl font-bold">Unit Converter</h2>
      </div>

      {/* Category Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {(Object.keys(UNIT_CONFIGS) as UnitCategory[]).map((cat) => {
          const cfg = UNIT_CONFIGS[cat]
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2 ${
                category === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <cfg.icon className="w-4 h-4" />
              {cfg.name}
            </button>
          )
        })}
      </div>

      {/* Converter */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
          {/* From */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">From</label>
            <select
              value={fromUnit}
              onChange={(e) => handleFromUnitChange(e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-background"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            <input
              type="number"
              value={fromValue}
              onChange={(e) => handleFromValueChange(e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-background text-lg font-mono"
              placeholder="0"
            />
          </div>

          {/* Swap Button */}
          <motion.button
            whileTap={{ rotate: 180 }}
            onClick={swapUnits}
            className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors self-center mb-2"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </motion.button>

          {/* To */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">To</label>
            <select
              value={toUnit}
              onChange={(e) => handleToUnitChange(e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-background"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            <input
              type="number"
              value={toValue}
              onChange={(e) => handleToValueChange(e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-background text-lg font-mono"
              placeholder="0"
            />
          </div>
        </div>

        {/* Formula Display */}
        {fromValue && toValue && (
          <div className="mt-4 p-3 rounded-lg bg-muted/50 text-center">
            <p className="text-sm">
              <span className="font-mono font-medium">{fromValue}</span>
              <span className="text-muted-foreground"> {fromUnit.split(' ')[0]} = </span>
              <span className="font-mono font-medium">{toValue}</span>
              <span className="text-muted-foreground"> {toUnit.split(' ')[0]}</span>
            </p>
          </div>
        )}
      </div>

      {/* Quick Reference */}
      <div className="mt-8 p-4 rounded-lg bg-muted/30">
        <h3 className="font-medium mb-3 text-center">Quick Reference</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
          {category === 'length' && (
            <>
              <p>1 km = 1000 m</p>
              <p>1 mile = 1.609 km</p>
              <p>1 inch = 2.54 cm</p>
            </>
          )}
          {category === 'weight' && (
            <>
              <p>1 kg = 1000 g</p>
              <p>1 lb = 453.59 g</p>
              <p>1 oz = 28.35 g</p>
            </>
          )}
          {category === 'temperature' && (
            <>
              <p>0°C = 32°F</p>
              <p>100°C = 212°F</p>
              <p>0K = -273.15°C</p>
            </>
          )}
          {category === 'data' && (
            <>
              <p>1 KB = 1024 B</p>
              <p>1 MB = 1024 KB</p>
              <p>1 GB = 1024 MB</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

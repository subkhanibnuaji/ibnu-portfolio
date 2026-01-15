'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Scale, Info, TrendingUp, User } from 'lucide-react'

interface BMIResult {
  bmi: number
  category: string
  color: string
  description: string
  idealWeight: { min: number; max: number }
}

const calculateBMI = (weight: number, heightCm: number, unit: 'metric' | 'imperial'): BMIResult | null => {
  let bmi: number

  if (unit === 'metric') {
    const heightM = heightCm / 100
    bmi = weight / (heightM * heightM)
  } else {
    // Imperial: weight in lbs, height in inches
    bmi = (weight / (heightCm * heightCm)) * 703
  }

  if (isNaN(bmi) || !isFinite(bmi)) return null

  const heightM = unit === 'metric' ? heightCm / 100 : (heightCm * 2.54) / 100
  const idealMin = 18.5 * heightM * heightM
  const idealMax = 24.9 * heightM * heightM

  let category: string
  let color: string
  let description: string

  if (bmi < 18.5) {
    category = 'Underweight'
    color = 'text-blue-500'
    description = 'You may need to gain some weight. Consult a healthcare provider for personalized advice.'
  } else if (bmi < 25) {
    category = 'Normal Weight'
    color = 'text-green-500'
    description = 'Great job! Your weight is within the healthy range for your height.'
  } else if (bmi < 30) {
    category = 'Overweight'
    color = 'text-yellow-500'
    description = 'You may benefit from losing some weight. Consider lifestyle changes for better health.'
  } else if (bmi < 35) {
    category = 'Obese Class I'
    color = 'text-orange-500'
    description = 'Moderate obesity. It\'s recommended to consult with a healthcare provider.'
  } else if (bmi < 40) {
    category = 'Obese Class II'
    color = 'text-red-500'
    description = 'Severe obesity. Please consult a healthcare provider for guidance.'
  } else {
    category = 'Obese Class III'
    color = 'text-red-700'
    description = 'Morbid obesity. Professional medical advice is strongly recommended.'
  }

  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    color,
    description,
    idealWeight: {
      min: Math.round(idealMin * 10) / 10,
      max: Math.round(idealMax * 10) / 10
    }
  }
}

export function BMICalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [weight, setWeight] = useState<string>('')
  const [height, setHeight] = useState<string>('')
  const [heightFeet, setHeightFeet] = useState<string>('')
  const [heightInches, setHeightInches] = useState<string>('')
  const [result, setResult] = useState<BMIResult | null>(null)
  const [age, setAge] = useState<string>('')
  const [gender, setGender] = useState<'male' | 'female'>('male')

  useEffect(() => {
    calculateResult()
  }, [weight, height, heightFeet, heightInches, unit])

  const calculateResult = () => {
    const w = parseFloat(weight)
    let h: number

    if (unit === 'metric') {
      h = parseFloat(height)
    } else {
      const feet = parseFloat(heightFeet) || 0
      const inches = parseFloat(heightInches) || 0
      h = feet * 12 + inches
    }

    if (w > 0 && h > 0) {
      setResult(calculateBMI(w, h, unit))
    } else {
      setResult(null)
    }
  }

  const getBMIPosition = (bmi: number): number => {
    // Map BMI to percentage position (15-40 range)
    const min = 15
    const max = 40
    const clamped = Math.min(Math.max(bmi, min), max)
    return ((clamped - min) / (max - min)) * 100
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-500/10 text-lime-500 text-sm font-medium mb-4">
          <Scale className="w-4 h-4" />
          Health
        </div>
        <h2 className="text-2xl font-bold">BMI Calculator</h2>
        <p className="text-muted-foreground mt-2">
          Calculate your Body Mass Index.
        </p>
      </div>

      {/* Unit Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setUnit('metric')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              unit === 'metric' ? 'bg-background shadow' : ''
            }`}
          >
            Metric (kg/cm)
          </button>
          <button
            onClick={() => setUnit('imperial')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              unit === 'imperial' ? 'bg-background shadow' : ''
            }`}
          >
            Imperial (lbs/ft)
          </button>
        </div>
      </div>

      {/* Input Form */}
      <div className="p-6 rounded-xl border border-border bg-card space-y-4">
        {/* Weight */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Weight ({unit === 'metric' ? 'kg' : 'lbs'})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === 'metric' ? 'e.g., 70' : 'e.g., 154'}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-lg"
          />
        </div>

        {/* Height */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Height ({unit === 'metric' ? 'cm' : 'ft & in'})
          </label>
          {unit === 'metric' ? (
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g., 175"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-lg"
            />
          ) : (
            <div className="flex gap-2">
              <input
                type="number"
                value={heightFeet}
                onChange={(e) => setHeightFeet(e.target.value)}
                placeholder="Feet"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-lg"
              />
              <input
                type="number"
                value={heightInches}
                onChange={(e) => setHeightInches(e.target.value)}
                placeholder="Inches"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-lg"
              />
            </div>
          )}
        </div>

        {/* Optional: Age and Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Age (optional)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Years"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Gender (optional)</label>
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => setGender('male')}
                className={`flex-1 py-2 rounded-lg text-sm ${
                  gender === 'male' ? 'bg-background shadow' : ''
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex-1 py-2 rounded-lg text-sm ${
                  gender === 'female' ? 'bg-background shadow' : ''
                }`}
              >
                Female
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 rounded-xl border border-border bg-card"
        >
          {/* BMI Value */}
          <div className="text-center mb-6">
            <p className="text-6xl font-bold mb-2">{result.bmi}</p>
            <p className={`text-xl font-medium ${result.color}`}>{result.category}</p>
          </div>

          {/* BMI Scale */}
          <div className="relative mb-6">
            <div className="h-4 rounded-full overflow-hidden flex">
              <div className="flex-1 bg-blue-400" />
              <div className="flex-1 bg-green-400" />
              <div className="flex-1 bg-yellow-400" />
              <div className="flex-1 bg-orange-400" />
              <div className="flex-1 bg-red-400" />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>35</span>
              <span>40</span>
            </div>
            {/* Marker */}
            <motion.div
              initial={{ left: '0%' }}
              animate={{ left: `${getBMIPosition(result.bmi)}%` }}
              className="absolute top-0 w-1 h-4 bg-foreground rounded-full transform -translate-x-1/2"
              style={{ marginTop: '-2px' }}
            />
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4">{result.description}</p>

          {/* Ideal Weight */}
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Ideal Weight Range</span>
            </div>
            <p className="text-lg font-semibold">
              {result.idealWeight.min} - {result.idealWeight.max} {unit === 'metric' ? 'kg' : 'lbs'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            BMI is a simple measure using height and weight. It doesn't account for muscle mass,
            bone density, or other factors. For personalized health advice, consult a healthcare professional.
          </p>
        </div>
      </div>
    </div>
  )
}

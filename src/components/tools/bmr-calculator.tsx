'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Activity, Flame, User, Ruler } from 'lucide-react'

type Gender = 'male' | 'female'
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive'

const ACTIVITY_LEVELS: { id: ActivityLevel; name: string; multiplier: number; description: string }[] = [
  { id: 'sedentary', name: 'Sedentary', multiplier: 1.2, description: 'Little or no exercise' },
  { id: 'light', name: 'Lightly Active', multiplier: 1.375, description: 'Light exercise 1-3 days/week' },
  { id: 'moderate', name: 'Moderately Active', multiplier: 1.55, description: 'Moderate exercise 3-5 days/week' },
  { id: 'active', name: 'Very Active', multiplier: 1.725, description: 'Hard exercise 6-7 days/week' },
  { id: 'veryActive', name: 'Extra Active', multiplier: 1.9, description: 'Very hard exercise & physical job' },
]

export function BMRCalculator() {
  const [gender, setGender] = useState<Gender>('male')
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('sedentary')

  const calculations = useMemo(() => {
    const ageNum = parseInt(age) || 0
    let weightKg = parseFloat(weight) || 0
    let heightCm = parseFloat(height) || 0

    if (unit === 'imperial') {
      weightKg = weightKg * 0.453592
      heightCm = heightCm * 2.54
    }

    if (ageNum <= 0 || weightKg <= 0 || heightCm <= 0) {
      return null
    }

    // Mifflin-St Jeor Equation
    let bmr: number
    if (gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161
    }

    const activityInfo = ACTIVITY_LEVELS.find(a => a.id === activityLevel)!
    const tdee = bmr * activityInfo.multiplier

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      weightLoss: Math.round(tdee - 500),
      mildWeightLoss: Math.round(tdee - 250),
      weightGain: Math.round(tdee + 500),
      mildWeightGain: Math.round(tdee + 250),
    }
  }, [gender, age, weight, height, unit, activityLevel])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">BMR Calculator</h1>
        <p className="text-muted-foreground">Calculate your Basal Metabolic Rate and daily calories</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Unit Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg bg-muted p-1">
            <button
              onClick={() => setUnit('metric')}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                unit === 'metric' ? 'bg-background shadow' : ''
              }`}
            >
              Metric (kg, cm)
            </button>
            <button
              onClick={() => setUnit('imperial')}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                unit === 'imperial' ? 'bg-background shadow' : ''
              }`}
            >
              Imperial (lb, in)
            </button>
          </div>
        </div>

        {/* Gender Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Gender</label>
          <div className="grid grid-cols-2 gap-4">
            {(['male', 'female'] as Gender[]).map(g => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`p-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  gender === g ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <User className="w-5 h-5" />
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Age, Weight, Height */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Years"
              min="1"
              max="120"
              className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Weight ({unit === 'metric' ? 'kg' : 'lb'})
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === 'metric' ? 'kg' : 'lb'}
              min="1"
              className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Height ({unit === 'metric' ? 'cm' : 'in'})
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={unit === 'metric' ? 'cm' : 'in'}
              min="1"
              className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Activity Level */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Activity Level</label>
          <div className="space-y-2">
            {ACTIVITY_LEVELS.map(level => (
              <button
                key={level.id}
                onClick={() => setActivityLevel(level.id)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  activityLevel === level.id ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{level.name}</span>
                  <span className="text-sm opacity-70">x{level.multiplier}</span>
                </div>
                <div className="text-sm opacity-70">{level.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {calculations && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg text-center">
                <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <div className="text-sm text-muted-foreground mb-1">BMR</div>
                <div className="text-2xl font-bold">{calculations.bmr.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">calories/day</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg text-center">
                <Activity className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-sm text-muted-foreground mb-1">TDEE</div>
                <div className="text-2xl font-bold">{calculations.tdee.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">calories/day</div>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-3">Daily Calorie Goals</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-500">Weight Loss (-1 lb/week)</span>
                  <span className="font-medium">{calculations.weightLoss.toLocaleString()} cal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-500">Mild Weight Loss (-0.5 lb/week)</span>
                  <span className="font-medium">{calculations.mildWeightLoss.toLocaleString()} cal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-500">Maintain Weight</span>
                  <span className="font-medium">{calculations.tdee.toLocaleString()} cal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-500">Mild Weight Gain (+0.5 lb/week)</span>
                  <span className="font-medium">{calculations.mildWeightGain.toLocaleString()} cal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-500">Weight Gain (+1 lb/week)</span>
                  <span className="font-medium">{calculations.weightGain.toLocaleString()} cal</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-500/10 rounded-lg text-sm">
          <p className="font-semibold text-blue-600 mb-1">What is BMR?</p>
          <p className="text-muted-foreground">
            Basal Metabolic Rate (BMR) is the number of calories your body needs at rest.
            TDEE (Total Daily Energy Expenditure) includes your activity level.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

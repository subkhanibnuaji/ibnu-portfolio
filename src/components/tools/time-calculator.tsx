'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Clock, Plus, Minus, RotateCcw, ArrowRight, Calendar,
  Timer, Copy, Check
} from 'lucide-react'

type Operation = 'add' | 'subtract' | 'difference'

interface TimeDuration {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function TimeCalculator() {
  const [operation, setOperation] = useState<Operation>('add')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [duration, setDuration] = useState<TimeDuration>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [result, setResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const calculate = () => {
    try {
      if (operation === 'difference') {
        if (!startTime || !endTime) return
        const start = new Date(startTime)
        const end = new Date(endTime)
        const diffMs = Math.abs(end.getTime() - start.getTime())

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

        let resultStr = ''
        if (days > 0) resultStr += `${days} day${days > 1 ? 's' : ''} `
        if (hours > 0) resultStr += `${hours} hour${hours > 1 ? 's' : ''} `
        if (minutes > 0) resultStr += `${minutes} minute${minutes > 1 ? 's' : ''} `
        if (seconds > 0 || resultStr === '') resultStr += `${seconds} second${seconds !== 1 ? 's' : ''}`

        setResult(resultStr.trim())
      } else {
        if (!startTime) return
        const start = new Date(startTime)

        const totalMs =
          duration.days * 24 * 60 * 60 * 1000 +
          duration.hours * 60 * 60 * 1000 +
          duration.minutes * 60 * 1000 +
          duration.seconds * 1000

        const resultDate = operation === 'add'
          ? new Date(start.getTime() + totalMs)
          : new Date(start.getTime() - totalMs)

        setResult(resultDate.toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }))
      }
    } catch {
      setResult('Invalid input')
    }
  }

  const reset = () => {
    setStartTime('')
    setEndTime('')
    setDuration({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    setResult(null)
  }

  const setNow = (field: 'start' | 'end') => {
    const now = new Date()
    const formatted = now.toISOString().slice(0, 16)
    if (field === 'start') {
      setStartTime(formatted)
    } else {
      setEndTime(formatted)
    }
  }

  const copyResult = () => {
    if (!result) return
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const updateDuration = (field: keyof TimeDuration, value: number) => {
    setDuration(prev => ({
      ...prev,
      [field]: Math.max(0, value)
    }))
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Operation Selection */}
        <div className="mb-6">
          <label className="text-white/70 text-sm mb-2 block flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Operation
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setOperation('add')}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                operation === 'add'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm">Add Time</span>
            </button>
            <button
              onClick={() => setOperation('subtract')}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                operation === 'subtract'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <Minus className="w-5 h-5" />
              <span className="text-sm">Subtract Time</span>
            </button>
            <button
              onClick={() => setOperation('difference')}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                operation === 'difference'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <Timer className="w-5 h-5" />
              <span className="text-sm">Difference</span>
            </button>
          </div>
        </div>

        {/* Start Time */}
        <div className="mb-6">
          <label className="text-white/70 text-sm mb-2 block flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {operation === 'difference' ? 'Start Date/Time' : 'Date/Time'}
          </label>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
            />
            <button
              onClick={() => setNow('start')}
              className="px-4 py-3 bg-white/10 text-white/70 rounded-lg hover:bg-white/20"
            >
              Now
            </button>
          </div>
        </div>

        {/* Duration or End Time */}
        {operation === 'difference' ? (
          <div className="mb-6">
            <label className="text-white/70 text-sm mb-2 block flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              End Date/Time
            </label>
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              />
              <button
                onClick={() => setNow('end')}
                className="px-4 py-3 bg-white/10 text-white/70 rounded-lg hover:bg-white/20"
              >
                Now
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <label className="text-white/70 text-sm mb-2 block flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Duration to {operation === 'add' ? 'Add' : 'Subtract'}
            </label>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="text-white/50 text-xs block mb-1">Days</label>
                <input
                  type="number"
                  value={duration.days}
                  onChange={(e) => updateDuration('days', parseInt(e.target.value) || 0)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-center"
                  min="0"
                />
              </div>
              <div>
                <label className="text-white/50 text-xs block mb-1">Hours</label>
                <input
                  type="number"
                  value={duration.hours}
                  onChange={(e) => updateDuration('hours', parseInt(e.target.value) || 0)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-center"
                  min="0"
                  max="23"
                />
              </div>
              <div>
                <label className="text-white/50 text-xs block mb-1">Minutes</label>
                <input
                  type="number"
                  value={duration.minutes}
                  onChange={(e) => updateDuration('minutes', parseInt(e.target.value) || 0)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-center"
                  min="0"
                  max="59"
                />
              </div>
              <div>
                <label className="text-white/50 text-xs block mb-1">Seconds</label>
                <input
                  type="number"
                  value={duration.seconds}
                  onChange={(e) => updateDuration('seconds', parseInt(e.target.value) || 0)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-center"
                  min="0"
                  max="59"
                />
              </div>
            </div>
          </div>
        )}

        {/* Calculate Button */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={calculate}
            className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 font-medium"
          >
            <ArrowRight className="w-5 h-5" />
            Calculate
          </button>
          <button
            onClick={reset}
            className="px-4 py-3 bg-white/10 text-white/70 rounded-lg hover:bg-white/20"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6"
          >
            <div className="text-white/50 text-sm mb-2">
              {operation === 'difference' ? 'Time Difference' : 'Result'}
            </div>
            <div className="text-2xl font-bold text-white mb-4">
              {result}
            </div>
            <button
              onClick={copyResult}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
          </motion.div>
        )}

        {/* Quick Calculations */}
        <div className="mt-6">
          <label className="text-white/70 text-sm mb-2 block">Quick Calculations</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: '+1 Hour', days: 0, hours: 1, minutes: 0, seconds: 0 },
              { label: '+1 Day', days: 1, hours: 0, minutes: 0, seconds: 0 },
              { label: '+1 Week', days: 7, hours: 0, minutes: 0, seconds: 0 },
              { label: '+30 Days', days: 30, hours: 0, minutes: 0, seconds: 0 }
            ].map(preset => (
              <button
                key={preset.label}
                onClick={() => {
                  setOperation('add')
                  setDuration(preset)
                  if (!startTime) setNow('start')
                }}
                className="p-2 bg-white/5 text-white/70 rounded-lg hover:bg-white/10 text-sm"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

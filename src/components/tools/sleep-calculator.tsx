'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, Clock, Bed, AlarmClock } from 'lucide-react'

type CalculationMode = 'wakeUp' | 'sleepAt' | 'sleepNow'

const SLEEP_CYCLE_MINUTES = 90
const FALL_ASLEEP_MINUTES = 15

export function SleepCalculator() {
  const [mode, setMode] = useState<CalculationMode>('wakeUp')
  const [wakeUpTime, setWakeUpTime] = useState('07:00')
  const [sleepTime, setSleepTime] = useState('23:00')

  const results = useMemo(() => {
    const times: { time: string; cycles: number; hours: number; quality: 'poor' | 'fair' | 'good' | 'ideal' }[] = []

    const parseTime = (time: string): Date => {
      const [hours, minutes] = time.split(':').map(Number)
      const date = new Date()
      date.setHours(hours, minutes, 0, 0)
      return date
    }

    const formatTime = (date: Date): string => {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    }

    const getQuality = (cycles: number): 'poor' | 'fair' | 'good' | 'ideal' => {
      if (cycles >= 6) return 'ideal'
      if (cycles >= 5) return 'good'
      if (cycles >= 4) return 'fair'
      return 'poor'
    }

    if (mode === 'wakeUp') {
      // Calculate when to go to sleep to wake up at specified time
      const wakeUp = parseTime(wakeUpTime)

      for (let cycles = 6; cycles >= 3; cycles--) {
        const sleepDuration = (cycles * SLEEP_CYCLE_MINUTES) + FALL_ASLEEP_MINUTES
        const sleepAt = new Date(wakeUp.getTime() - sleepDuration * 60 * 1000)

        times.push({
          time: formatTime(sleepAt),
          cycles,
          hours: (cycles * SLEEP_CYCLE_MINUTES) / 60,
          quality: getQuality(cycles),
        })
      }
    } else if (mode === 'sleepAt') {
      // Calculate when to wake up if sleeping at specified time
      const sleep = parseTime(sleepTime)
      const fallAsleep = new Date(sleep.getTime() + FALL_ASLEEP_MINUTES * 60 * 1000)

      for (let cycles = 3; cycles <= 6; cycles++) {
        const sleepDuration = cycles * SLEEP_CYCLE_MINUTES
        const wakeAt = new Date(fallAsleep.getTime() + sleepDuration * 60 * 1000)

        times.push({
          time: formatTime(wakeAt),
          cycles,
          hours: (cycles * SLEEP_CYCLE_MINUTES) / 60,
          quality: getQuality(cycles),
        })
      }
    } else {
      // Sleep now - calculate wake up times
      const now = new Date()
      const fallAsleep = new Date(now.getTime() + FALL_ASLEEP_MINUTES * 60 * 1000)

      for (let cycles = 3; cycles <= 6; cycles++) {
        const sleepDuration = cycles * SLEEP_CYCLE_MINUTES
        const wakeAt = new Date(fallAsleep.getTime() + sleepDuration * 60 * 1000)

        times.push({
          time: formatTime(wakeAt),
          cycles,
          hours: (cycles * SLEEP_CYCLE_MINUTES) / 60,
          quality: getQuality(cycles),
        })
      }
    }

    return times
  }, [mode, wakeUpTime, sleepTime])

  const qualityColors = {
    poor: 'bg-red-500/20 text-red-500 border-red-500/30',
    fair: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    good: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    ideal: 'bg-green-500/20 text-green-500 border-green-500/30',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Sleep Calculator</h1>
        <p className="text-muted-foreground">Optimize your sleep cycles for better rest</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Mode Selection */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            onClick={() => setMode('wakeUp')}
            className={`p-3 rounded-lg text-center transition-colors ${
              mode === 'wakeUp' ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <AlarmClock className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs">Wake up at</span>
          </button>
          <button
            onClick={() => setMode('sleepAt')}
            className={`p-3 rounded-lg text-center transition-colors ${
              mode === 'sleepAt' ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <Bed className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs">Sleep at</span>
          </button>
          <button
            onClick={() => setMode('sleepNow')}
            className={`p-3 rounded-lg text-center transition-colors ${
              mode === 'sleepNow' ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <Moon className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs">Sleep now</span>
          </button>
        </div>

        {/* Time Input */}
        {mode !== 'sleepNow' && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {mode === 'wakeUp' ? 'I want to wake up at:' : 'I want to go to sleep at:'}
            </label>
            <input
              type="time"
              value={mode === 'wakeUp' ? wakeUpTime : sleepTime}
              onChange={(e) => mode === 'wakeUp' ? setWakeUpTime(e.target.value) : setSleepTime(e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-lg text-2xl font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Description */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg text-center">
          {mode === 'wakeUp' && (
            <p>To wake up at <span className="font-semibold">{wakeUpTime}</span>, go to sleep at one of these times:</p>
          )}
          {mode === 'sleepAt' && (
            <p>If you sleep at <span className="font-semibold">{sleepTime}</span>, wake up at one of these times:</p>
          )}
          {mode === 'sleepNow' && (
            <p>If you go to sleep now, wake up at one of these times:</p>
          )}
        </div>

        {/* Results */}
        <div className="space-y-3">
          {results.map((result, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-lg border ${qualityColors[result.quality]}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">{result.time}</div>
                  <div className="text-sm opacity-80">
                    {result.hours} hours ({result.cycles} cycles)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold capitalize">{result.quality}</div>
                  {result.quality === 'ideal' && <span className="text-xs">⭐ Recommended</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">About Sleep Cycles</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Each sleep cycle lasts about 90 minutes</li>
            <li>• It takes ~15 minutes to fall asleep</li>
            <li>• Waking between cycles helps you feel refreshed</li>
            <li>• Adults need 5-6 cycles (7.5-9 hours) per night</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

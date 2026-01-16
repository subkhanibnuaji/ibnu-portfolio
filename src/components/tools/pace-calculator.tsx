'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Timer, Route, Zap } from 'lucide-react'

type Unit = 'metric' | 'imperial'
type Mode = 'pace' | 'time' | 'distance'

const RACE_DISTANCES = [
  { name: '5K', km: 5, mi: 3.107 },
  { name: '10K', km: 10, mi: 6.214 },
  { name: 'Half Marathon', km: 21.0975, mi: 13.109 },
  { name: 'Marathon', km: 42.195, mi: 26.219 },
]

export function PaceCalculator() {
  const [mode, setMode] = useState<Mode>('pace')
  const [unit, setUnit] = useState<Unit>('metric')

  // Pace calculation inputs
  const [paceMinutes, setPaceMinutes] = useState('')
  const [paceSeconds, setPaceSeconds] = useState('')
  const [distance, setDistance] = useState('')

  // Time calculation inputs
  const [timeHours, setTimeHours] = useState('')
  const [timeMinutes, setTimeMinutes] = useState('')
  const [timeSeconds, setTimeSeconds] = useState('')

  const distanceUnit = unit === 'metric' ? 'km' : 'mi'
  const paceUnit = unit === 'metric' ? 'min/km' : 'min/mi'

  const calculations = useMemo(() => {
    if (mode === 'pace') {
      // Calculate pace from time and distance
      const dist = parseFloat(distance) || 0
      const totalSeconds = (parseInt(timeHours) || 0) * 3600 +
        (parseInt(timeMinutes) || 0) * 60 +
        (parseInt(timeSeconds) || 0)

      if (dist <= 0 || totalSeconds <= 0) return null

      const paceSecondsPerUnit = totalSeconds / dist
      const paceMin = Math.floor(paceSecondsPerUnit / 60)
      const paceSec = Math.round(paceSecondsPerUnit % 60)

      const speedKmh = unit === 'metric'
        ? (dist / (totalSeconds / 3600))
        : (dist * 1.60934 / (totalSeconds / 3600))

      return {
        paceMinutes: paceMin,
        paceSeconds: paceSec,
        speedKmh: speedKmh.toFixed(2),
        speedMph: (speedKmh / 1.60934).toFixed(2),
      }
    } else if (mode === 'time') {
      // Calculate time from pace and distance
      const dist = parseFloat(distance) || 0
      const paceTotalSec = (parseInt(paceMinutes) || 0) * 60 + (parseInt(paceSeconds) || 0)

      if (dist <= 0 || paceTotalSec <= 0) return null

      const totalSeconds = paceTotalSec * dist
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = Math.round(totalSeconds % 60)

      return {
        hours,
        minutes,
        seconds,
        formatted: `${hours > 0 ? hours + ':' : ''}${hours > 0 ? String(minutes).padStart(2, '0') : minutes}:${String(seconds).padStart(2, '0')}`,
      }
    } else {
      // Calculate distance from pace and time
      const paceTotalSec = (parseInt(paceMinutes) || 0) * 60 + (parseInt(paceSeconds) || 0)
      const totalSeconds = (parseInt(timeHours) || 0) * 3600 +
        (parseInt(timeMinutes) || 0) * 60 +
        (parseInt(timeSeconds) || 0)

      if (paceTotalSec <= 0 || totalSeconds <= 0) return null

      const dist = totalSeconds / paceTotalSec

      return {
        distance: dist.toFixed(2),
      }
    }
  }, [mode, unit, distance, timeHours, timeMinutes, timeSeconds, paceMinutes, paceSeconds])

  const raceProjections = useMemo(() => {
    const paceTotalSec = (parseInt(paceMinutes) || 0) * 60 + (parseInt(paceSeconds) || 0)
    if (paceTotalSec <= 0) return []

    return RACE_DISTANCES.map(race => {
      const dist = unit === 'metric' ? race.km : race.mi
      const totalSec = paceTotalSec * dist
      const hours = Math.floor(totalSec / 3600)
      const minutes = Math.floor((totalSec % 3600) / 60)
      const seconds = Math.round(totalSec % 60)
      return {
        name: race.name,
        time: `${hours > 0 ? hours + ':' : ''}${hours > 0 ? String(minutes).padStart(2, '0') : minutes}:${String(seconds).padStart(2, '0')}`,
      }
    })
  }, [paceMinutes, paceSeconds, unit])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Pace Calculator</h1>
        <p className="text-muted-foreground">Calculate running pace, time, or distance</p>
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
              Metric (km)
            </button>
            <button
              onClick={() => setUnit('imperial')}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                unit === 'imperial' ? 'bg-background shadow' : ''
              }`}
            >
              Imperial (mi)
            </button>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'pace', label: 'Calculate Pace', icon: Zap },
            { id: 'time', label: 'Calculate Time', icon: Timer },
            { id: 'distance', label: 'Calculate Distance', icon: Route },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id as Mode)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm transition-colors ${
                mode === id ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Inputs based on mode */}
        <div className="space-y-4 mb-6">
          {/* Distance Input - for pace and time modes */}
          {(mode === 'pace' || mode === 'time') && (
            <div>
              <label className="block text-sm font-medium mb-2">Distance ({distanceUnit})</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder={`Enter distance in ${distanceUnit}`}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2 mt-2">
                {RACE_DISTANCES.map(race => (
                  <button
                    key={race.name}
                    onClick={() => setDistance(unit === 'metric' ? race.km.toString() : race.mi.toString())}
                    className="px-2 py-1 bg-muted/50 rounded text-xs hover:bg-muted"
                  >
                    {race.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Time Input - for pace and distance modes */}
          {(mode === 'pace' || mode === 'distance') && (
            <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="number"
                    value={timeHours}
                    onChange={(e) => setTimeHours(e.target.value)}
                    placeholder="HH"
                    min="0"
                    className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  />
                  <div className="text-xs text-muted-foreground text-center mt-1">Hours</div>
                </div>
                <div>
                  <input
                    type="number"
                    value={timeMinutes}
                    onChange={(e) => setTimeMinutes(e.target.value)}
                    placeholder="MM"
                    min="0"
                    max="59"
                    className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  />
                  <div className="text-xs text-muted-foreground text-center mt-1">Minutes</div>
                </div>
                <div>
                  <input
                    type="number"
                    value={timeSeconds}
                    onChange={(e) => setTimeSeconds(e.target.value)}
                    placeholder="SS"
                    min="0"
                    max="59"
                    className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  />
                  <div className="text-xs text-muted-foreground text-center mt-1">Seconds</div>
                </div>
              </div>
            </div>
          )}

          {/* Pace Input - for time and distance modes */}
          {(mode === 'time' || mode === 'distance') && (
            <div>
              <label className="block text-sm font-medium mb-2">Pace ({paceUnit})</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="number"
                    value={paceMinutes}
                    onChange={(e) => setPaceMinutes(e.target.value)}
                    placeholder="Min"
                    min="0"
                    className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  />
                  <div className="text-xs text-muted-foreground text-center mt-1">Minutes</div>
                </div>
                <div>
                  <input
                    type="number"
                    value={paceSeconds}
                    onChange={(e) => setPaceSeconds(e.target.value)}
                    placeholder="Sec"
                    min="0"
                    max="59"
                    className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  />
                  <div className="text-xs text-muted-foreground text-center mt-1">Seconds</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {calculations && (
          <div className="p-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg text-center">
            {mode === 'pace' && 'paceMinutes' in calculations && (
              <>
                <div className="text-3xl font-bold mb-2">
                  {calculations.paceMinutes}:{String(calculations.paceSeconds).padStart(2, '0')} {paceUnit}
                </div>
                <div className="text-sm text-muted-foreground">
                  Speed: {calculations.speedKmh} km/h ({calculations.speedMph} mph)
                </div>
              </>
            )}
            {mode === 'time' && 'formatted' in calculations && (
              <div className="text-3xl font-bold">{calculations.formatted}</div>
            )}
            {mode === 'distance' && 'distance' in calculations && (
              <div className="text-3xl font-bold">{calculations.distance} {distanceUnit}</div>
            )}
          </div>
        )}

        {/* Race Projections */}
        {raceProjections.length > 0 && (paceMinutes || paceSeconds) && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-3">Race Time Projections</h3>
            <div className="grid grid-cols-2 gap-2">
              {raceProjections.map(race => (
                <div key={race.name} className="flex justify-between p-2 bg-background rounded">
                  <span className="text-muted-foreground">{race.name}</span>
                  <span className="font-medium">{race.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

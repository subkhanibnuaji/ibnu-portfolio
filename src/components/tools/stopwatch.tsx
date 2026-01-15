'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Timer, Play, Pause, RotateCcw, Flag, Trash2 } from 'lucide-react'

interface Lap {
  number: number
  time: number
  diff: number
}

export function Stopwatch() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<Lap[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const accumulatedTimeRef = useRef<number>(0)

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now()
      intervalRef.current = setInterval(() => {
        setTime(accumulatedTimeRef.current + (Date.now() - startTimeRef.current))
      }, 10)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      accumulatedTimeRef.current = time
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  const formatTime = (ms: number): { hours: string; minutes: string; seconds: string; milliseconds: string } => {
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      milliseconds: milliseconds.toString().padStart(2, '0')
    }
  }

  const formatLapTime = (ms: number): string => {
    const { hours, minutes, seconds, milliseconds } = formatTime(ms)
    if (parseInt(hours) > 0) {
      return `${hours}:${minutes}:${seconds}.${milliseconds}`
    }
    return `${minutes}:${seconds}.${milliseconds}`
  }

  const toggle = () => {
    setIsRunning(!isRunning)
  }

  const reset = () => {
    setIsRunning(false)
    setTime(0)
    setLaps([])
    accumulatedTimeRef.current = 0
  }

  const addLap = () => {
    const lastLapTime = laps.length > 0 ? laps[0].time : 0
    const newLap: Lap = {
      number: laps.length + 1,
      time: time,
      diff: time - lastLapTime
    }
    setLaps([newLap, ...laps])
  }

  const clearLaps = () => {
    setLaps([])
  }

  const { hours, minutes, seconds, milliseconds } = formatTime(time)
  const showHours = parseInt(hours) > 0

  // Find best and worst laps
  const lapDiffs = laps.map(l => l.diff)
  const bestLap = lapDiffs.length > 1 ? Math.min(...lapDiffs) : null
  const worstLap = lapDiffs.length > 1 ? Math.max(...lapDiffs) : null

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 text-teal-500 text-sm font-medium mb-4">
          <Timer className="w-4 h-4" />
          Time
        </div>
        <h2 className="text-2xl font-bold">Stopwatch</h2>
      </div>

      {/* Time Display */}
      <div className="text-center mb-8">
        <div className="inline-flex items-baseline font-mono">
          {showHours && (
            <>
              <span className="text-6xl font-bold">{hours}</span>
              <span className="text-4xl text-muted-foreground mx-1">:</span>
            </>
          )}
          <span className="text-6xl font-bold">{minutes}</span>
          <span className="text-4xl text-muted-foreground mx-1">:</span>
          <span className="text-6xl font-bold">{seconds}</span>
          <span className="text-2xl text-muted-foreground mx-1">.</span>
          <span className="text-4xl text-muted-foreground">{milliseconds}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggle}
          className={`px-8 py-4 rounded-full font-medium text-lg inline-flex items-center gap-2 ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-teal-500 hover:bg-teal-600 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              {time > 0 ? 'Resume' : 'Start'}
            </>
          )}
        </motion.button>

        {time > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={isRunning ? addLap : reset}
            className={`px-6 py-4 rounded-full font-medium inline-flex items-center gap-2 ${
              isRunning
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {isRunning ? (
              <>
                <Flag className="w-5 h-5" />
                Lap
              </>
            ) : (
              <>
                <RotateCcw className="w-5 h-5" />
                Reset
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-medium">Laps ({laps.length})</h3>
            <button
              onClick={clearLaps}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Clear laps"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {laps.map((lap) => {
              const isBest = lap.diff === bestLap && laps.length > 1
              const isWorst = lap.diff === worstLap && laps.length > 1

              return (
                <div
                  key={lap.number}
                  className={`flex items-center justify-between p-4 border-b border-border last:border-b-0 ${
                    isBest ? 'bg-green-500/10' : isWorst ? 'bg-red-500/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-8">#{lap.number}</span>
                    <span className={`text-sm ${isBest ? 'text-green-500' : isWorst ? 'text-red-500' : ''}`}>
                      {isBest && 'Best'}
                      {isWorst && 'Slowest'}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-mono">{formatLapTime(lap.diff)}</p>
                    <p className="text-xs text-muted-foreground font-mono">{formatLapTime(lap.time)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground text-center">
        <p>Click Lap while running to record split times.</p>
      </div>
    </div>
  )
}

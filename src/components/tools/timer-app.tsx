'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock, Settings } from 'lucide-react'

interface TimerPreset {
  name: string
  duration: number // in seconds
}

const PRESETS: TimerPreset[] = [
  { name: '1 min', duration: 60 },
  { name: '3 min', duration: 180 },
  { name: '5 min', duration: 300 },
  { name: '10 min', duration: 600 },
  { name: '15 min', duration: 900 },
  { name: '30 min', duration: 1800 },
  { name: '45 min', duration: 2700 },
  { name: '1 hour', duration: 3600 },
]

const ALARM_SOUNDS = [
  { name: 'Beep', frequency: 800 },
  { name: 'Bell', frequency: 523 },
  { name: 'Chime', frequency: 659 },
  { name: 'Alert', frequency: 440 },
]

export function TimerApp() {
  const [totalSeconds, setTotalSeconds] = useState(300) // 5 min default
  const [remainingSeconds, setRemainingSeconds] = useState(300)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedSound, setSelectedSound] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [customMinutes, setCustomMinutes] = useState('')
  const [customSeconds, setCustomSeconds] = useState('')
  const audioContext = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (!isRunning || remainingSeconds <= 0) return

    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          setIsRunning(false)
          setIsComplete(true)
          playAlarm()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, remainingSeconds])

  const playAlarm = () => {
    if (!soundEnabled) return

    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }

    const ctx = audioContext.current
    const sound = ALARM_SOUNDS[selectedSound]

    // Play 3 beeps
    for (let i = 0; i < 3; i++) {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = sound.frequency
      oscillator.type = 'sine'

      const startTime = ctx.currentTime + i * 0.3
      gainNode.gain.setValueAtTime(0.3, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.2)
    }
  }

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    if (remainingSeconds > 0) {
      setIsRunning(true)
      setIsComplete(false)
    }
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setRemainingSeconds(totalSeconds)
    setIsComplete(false)
  }

  const handlePreset = (duration: number) => {
    setTotalSeconds(duration)
    setRemainingSeconds(duration)
    setIsRunning(false)
    setIsComplete(false)
  }

  const handleCustomTime = () => {
    const mins = parseInt(customMinutes) || 0
    const secs = parseInt(customSeconds) || 0
    const total = mins * 60 + secs

    if (total > 0) {
      setTotalSeconds(total)
      setRemainingSeconds(total)
      setIsRunning(false)
      setIsComplete(false)
      setCustomMinutes('')
      setCustomSeconds('')
    }
  }

  const progress = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Timer</h1>
        <p className="text-muted-foreground">Set a timer for any duration</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Timer Display */}
        <div className="relative mb-8">
          {/* Circular Progress */}
          <svg className="w-64 h-64 mx-auto transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
              className={`transition-all duration-1000 ${
                isComplete ? 'text-red-500' : 'text-blue-500'
              }`}
            />
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-mono font-bold ${
              isComplete ? 'text-red-500 animate-pulse' : ''
            }`}>
              {formatTime(remainingSeconds)}
            </span>
            {isComplete && (
              <span className="text-red-500 font-semibold mt-2">Time&apos;s up!</span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          {!isRunning ? (
            <button
              onClick={handleStart}
              disabled={remainingSeconds === 0}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-semibold flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold flex items-center gap-2"
            >
              <Pause className="w-5 h-5" />
              Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-muted hover:bg-muted/80 rounded-lg flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3 text-center">Quick Presets</h3>
          <div className="grid grid-cols-4 gap-2">
            {PRESETS.map(preset => (
              <button
                key={preset.name}
                onClick={() => handlePreset(preset.duration)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  totalSeconds === preset.duration && !isRunning
                    ? 'bg-blue-600 text-white'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Time */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3 text-center">Custom Time</h3>
          <div className="flex items-center justify-center gap-2">
            <input
              type="number"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              placeholder="Min"
              min="0"
              max="999"
              className="w-20 px-3 py-2 bg-muted rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-muted-foreground">:</span>
            <input
              type="number"
              value={customSeconds}
              onChange={(e) => setCustomSeconds(e.target.value)}
              placeholder="Sec"
              min="0"
              max="59"
              className="w-20 px-3 py-2 bg-muted rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCustomTime}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Set
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="border-t pt-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mx-auto"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>

          {showSettings && (
            <div className="mt-4 space-y-4">
              {/* Sound Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Alarm Sound</span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2 rounded-lg ${
                    soundEnabled ? 'bg-blue-600 text-white' : 'bg-muted'
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              </div>

              {/* Sound Selection */}
              {soundEnabled && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sound Type</span>
                  <select
                    value={selectedSound}
                    onChange={(e) => setSelectedSound(parseInt(e.target.value))}
                    className="px-3 py-1 bg-muted rounded-lg text-sm"
                  >
                    {ALARM_SOUNDS.map((sound, i) => (
                      <option key={sound.name} value={i}>{sound.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

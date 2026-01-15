'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Play, Pause, RotateCcw, Coffee, Brain, Settings, Volume2, VolumeX } from 'lucide-react'

type TimerMode = 'work' | 'shortBreak' | 'longBreak'

const DEFAULT_TIMES = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
}

const MODE_COLORS = {
  work: 'from-red-500 to-orange-500',
  shortBreak: 'from-green-500 to-emerald-500',
  longBreak: 'from-blue-500 to-cyan-500'
}

const MODE_LABELS = {
  work: 'Focus Time',
  shortBreak: 'Short Break',
  longBreak: 'Long Break'
}

export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMES.work)
  const [isRunning, setIsRunning] = useState(false)
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [times, setTimes] = useState(DEFAULT_TIMES)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element for notification sound
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleC8NLpvH6N+YWCYfbsi/4KpjKRpdqMPMl2cuFEGJuNCnZCQfVJG+xY9SNRpMm8LCiEIpGkKOtryfTSkgSpC3u5NLJR5HjLG3mE8qHkeJsLWXTikfRoivtJZNKR9Gh66ylUwpH0aHrbGUTCkfRoetsJNMKR9Gh62wk0wpH0aHrbCTTCkfRoatsJNMKR9Gh62wk0wpH0aHrbCTTCkfRoetsJNMKQ==')
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => t - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }

    if (mode === 'work') {
      const newCount = pomodorosCompleted + 1
      setPomodorosCompleted(newCount)

      // After 4 pomodoros, take a long break
      if (newCount % 4 === 0) {
        switchMode('longBreak')
      } else {
        switchMode('shortBreak')
      }
    } else {
      switchMode('work')
    }
  }

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode)
    setTimeLeft(times[newMode])
    setIsRunning(false)
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(times[mode])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((times[mode] - timeLeft) / times[mode]) * 100

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 text-sm font-medium mb-4">
          <Timer className="w-4 h-4" />
          Productivity
        </div>
        <h2 className="text-2xl font-bold">Pomodoro Timer</h2>
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center gap-2 mb-8">
        {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              mode === m
                ? `bg-gradient-to-r ${MODE_COLORS[m]} text-white`
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {m === 'work' && <Brain className="w-4 h-4 inline mr-1" />}
            {m === 'shortBreak' && <Coffee className="w-4 h-4 inline mr-1" />}
            {m === 'longBreak' && <Coffee className="w-4 h-4 inline mr-1" />}
            {m === 'work' ? 'Focus' : m === 'shortBreak' ? 'Short' : 'Long'}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="relative mb-8">
        <div className="w-64 h-64 mx-auto relative">
          {/* Progress Ring */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              strokeWidth="8"
              className="fill-none stroke-muted"
            />
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              strokeWidth="8"
              className={`fill-none stroke-current ${
                mode === 'work' ? 'text-red-500' :
                mode === 'shortBreak' ? 'text-green-500' : 'text-blue-500'
              }`}
              strokeLinecap="round"
              strokeDasharray={754}
              strokeDashoffset={754 - (754 * progress) / 100}
              initial={false}
              animate={{ strokeDashoffset: 754 - (754 * progress) / 100 }}
              transition={{ duration: 0.5 }}
            />
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold font-mono">{formatTime(timeLeft)}</span>
            <span className="text-sm text-muted-foreground mt-2">{MODE_LABELS[mode]}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleTimer}
          className={`px-8 py-4 rounded-xl font-medium inline-flex items-center gap-2 ${
            isRunning
              ? 'bg-amber-500 text-white hover:bg-amber-600'
              : `bg-gradient-to-r ${MODE_COLORS[mode]} text-white`
          }`}
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isRunning ? 'Pause' : 'Start'}
        </motion.button>

        <button
          onClick={resetTimer}
          className="p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-4 rounded-xl transition-colors ${
            showSettings ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl border border-border bg-card space-y-4 mb-8">
              <h3 className="font-medium">Timer Settings (minutes)</h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Focus</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={times.work / 60}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) * 60
                      setTimes(t => ({ ...t, work: val }))
                      if (mode === 'work' && !isRunning) setTimeLeft(val)
                    }}
                    className="w-full p-2 rounded-lg border border-border bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Short</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={times.shortBreak / 60}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) * 60
                      setTimes(t => ({ ...t, shortBreak: val }))
                      if (mode === 'shortBreak' && !isRunning) setTimeLeft(val)
                    }}
                    className="w-full p-2 rounded-lg border border-border bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Long</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={times.longBreak / 60}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) * 60
                      setTimes(t => ({ ...t, longBreak: val }))
                      if (mode === 'longBreak' && !isRunning) setTimeLeft(val)
                    }}
                    className="w-full p-2 rounded-lg border border-border bg-background"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="p-4 rounded-xl border border-border bg-card text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-red-500" />
          <span className="font-medium">Pomodoros Completed</span>
        </div>
        <div className="flex justify-center gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i < pomodorosCompleted % 4 || (pomodorosCompleted > 0 && pomodorosCompleted % 4 === 0 && i < 4)
                  ? 'bg-red-500 text-white'
                  : 'bg-muted'
              }`}
            >
              {i < pomodorosCompleted % 4 || (pomodorosCompleted > 0 && pomodorosCompleted % 4 === 0) ? '✓' : i + 1}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Total: {pomodorosCompleted} pomodoro{pomodorosCompleted !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, RotateCcw, Coffee, Brain, Zap, Target, Trophy,
  Volume2, VolumeX, Settings, Moon, Sun, Sparkles
} from 'lucide-react'

interface Session {
  type: 'focus' | 'break'
  duration: number
  completedAt: Date
}

type TimerMode = 'pomodoro' | 'deepWork' | 'custom'

interface ModeConfig {
  focusTime: number
  shortBreak: number
  longBreak: number
  sessionsBeforeLong: number
}

const modeConfigs: Record<TimerMode, ModeConfig> = {
  pomodoro: { focusTime: 25, shortBreak: 5, longBreak: 15, sessionsBeforeLong: 4 },
  deepWork: { focusTime: 90, shortBreak: 20, longBreak: 30, sessionsBeforeLong: 2 },
  custom: { focusTime: 25, shortBreak: 5, longBreak: 15, sessionsBeforeLong: 4 }
}

export function FocusTimer() {
  const [mode, setMode] = useState<TimerMode>('pomodoro')
  const [customConfig, setCustomConfig] = useState<ModeConfig>(modeConfigs.custom)
  const [phase, setPhase] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [totalFocusTime, setTotalFocusTime] = useState(0)
  const [sessions, setSessions] = useState<Session[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [dailyGoal, setDailyGoal] = useState(8)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const config = mode === 'custom' ? customConfig : modeConfigs[mode]

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('focusTimer')
    if (saved) {
      const data = JSON.parse(saved)
      setSessionsCompleted(data.sessionsCompleted || 0)
      setTotalFocusTime(data.totalFocusTime || 0)
      setSessions(data.sessions?.map((s: Session) => ({ ...s, completedAt: new Date(s.completedAt) })) || [])
    }
  }, [])

  // Save data
  useEffect(() => {
    localStorage.setItem('focusTimer', JSON.stringify({
      sessionsCompleted,
      totalFocusTime,
      sessions
    }))
  }, [sessionsCompleted, totalFocusTime, sessions])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handlePhaseComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  const handlePhaseComplete = () => {
    setIsRunning(false)

    // Play sound
    if (soundEnabled) {
      const audio = new Audio('/sounds/bell.mp3')
      audio.play().catch(() => {})
    }

    if (phase === 'focus') {
      const newSessions = sessionsCompleted + 1
      setSessionsCompleted(newSessions)
      setTotalFocusTime(prev => prev + config.focusTime)

      setSessions(prev => [...prev, {
        type: 'focus',
        duration: config.focusTime,
        completedAt: new Date()
      }])

      // Determine next break
      if (newSessions % config.sessionsBeforeLong === 0) {
        setPhase('longBreak')
        setTimeLeft(config.longBreak * 60)
      } else {
        setPhase('shortBreak')
        setTimeLeft(config.shortBreak * 60)
      }
    } else {
      setPhase('focus')
      setTimeLeft(config.focusTime * 60)
    }
  }

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode)
    setIsRunning(false)
    setPhase('focus')
    const newConfig = newMode === 'custom' ? customConfig : modeConfigs[newMode]
    setTimeLeft(newConfig.focusTime * 60)
  }

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(config.focusTime * 60)
    setPhase('focus')
  }

  const skipPhase = () => {
    handlePhaseComplete()
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = () => {
    const total = phase === 'focus' ? config.focusTime * 60 :
                  phase === 'shortBreak' ? config.shortBreak * 60 :
                  config.longBreak * 60
    return ((total - timeLeft) / total) * 100
  }

  const getPhaseColor = () => {
    switch (phase) {
      case 'focus': return 'from-red-500 to-orange-500'
      case 'shortBreak': return 'from-green-500 to-emerald-500'
      case 'longBreak': return 'from-blue-500 to-cyan-500'
    }
  }

  const getPhaseIcon = () => {
    switch (phase) {
      case 'focus': return <Brain className="w-8 h-8" />
      case 'shortBreak': return <Coffee className="w-8 h-8" />
      case 'longBreak': return <Moon className="w-8 h-8" />
    }
  }

  const getPhaseText = () => {
    switch (phase) {
      case 'focus': return 'Focus Time'
      case 'shortBreak': return 'Short Break'
      case 'longBreak': return 'Long Break'
    }
  }

  const todaySessions = sessions.filter(s => {
    const today = new Date()
    const sessionDate = new Date(s.completedAt)
    return sessionDate.toDateString() === today.toDateString() && s.type === 'focus'
  }).length

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">{todaySessions}/{dailyGoal}</p>
          <p className="text-sm text-muted-foreground">Today&apos;s Sessions</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
          <p className="text-2xl font-bold">{sessionsCompleted}</p>
          <p className="text-sm text-muted-foreground">Total Sessions</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <Zap className="w-6 h-6 mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold">{Math.round(totalFocusTime / 60)}h</p>
          <p className="text-sm text-muted-foreground">Focus Time</p>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-2 p-1 rounded-lg bg-muted">
        {(['pomodoro', 'deepWork', 'custom'] as TimerMode[]).map(m => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === m ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {m === 'pomodoro' ? 'Pomodoro' : m === 'deepWork' ? 'Deep Work' : 'Custom'}
          </button>
        ))}
      </div>

      {/* Timer */}
      <div className={`p-8 rounded-2xl bg-gradient-to-br ${getPhaseColor()} relative overflow-hidden`}>
        {/* Progress ring background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress() / 100)}`}
              transform="rotate(-90 50 50)"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="relative text-center text-white">
          <div className="mb-4">
            {getPhaseIcon()}
          </div>
          <p className="text-lg font-medium mb-2 opacity-90">{getPhaseText()}</p>
          <p className="text-7xl font-bold font-mono mb-6">{formatTime(timeLeft)}</p>

          {/* Session indicators */}
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: config.sessionsBeforeLong }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < (sessionsCompleted % config.sessionsBeforeLong)
                    ? 'bg-white'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isRunning ? handlePause : handleStart}
              className="p-6 rounded-full bg-white text-gray-900 shadow-lg"
            >
              {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={skipPhase}
              className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <Sparkles className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Quick Settings */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            soundEnabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          Sound
        </button>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground"
        >
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 rounded-xl border border-border bg-card"
          >
            <h3 className="font-semibold mb-4">Timer Settings</h3>

            {mode === 'custom' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-muted-foreground">Focus (min)</label>
                  <input
                    type="number"
                    value={customConfig.focusTime}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 25
                      setCustomConfig({ ...customConfig, focusTime: val })
                      if (phase === 'focus') setTimeLeft(val * 60)
                    }}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                    min={1}
                    max={180}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Short Break (min)</label>
                  <input
                    type="number"
                    value={customConfig.shortBreak}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 5
                      setCustomConfig({ ...customConfig, shortBreak: val })
                    }}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                    min={1}
                    max={60}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Long Break (min)</label>
                  <input
                    type="number"
                    value={customConfig.longBreak}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 15
                      setCustomConfig({ ...customConfig, longBreak: val })
                    }}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                    min={1}
                    max={60}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Sessions before long break</label>
                  <input
                    type="number"
                    value={customConfig.sessionsBeforeLong}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 4
                      setCustomConfig({ ...customConfig, sessionsBeforeLong: val })
                    }}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                    min={1}
                    max={10}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm text-muted-foreground">Daily Goal (sessions)</label>
              <input
                type="number"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(parseInt(e.target.value) || 8)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                min={1}
                max={20}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode Info */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-2">Current Mode: {mode === 'pomodoro' ? 'Pomodoro' : mode === 'deepWork' ? 'Deep Work' : 'Custom'}</h3>
        <p className="text-sm text-muted-foreground">
          {config.focusTime}min focus → {config.shortBreak}min break → After {config.sessionsBeforeLong} sessions: {config.longBreak}min long break
        </p>
      </div>
    </div>
  )
}

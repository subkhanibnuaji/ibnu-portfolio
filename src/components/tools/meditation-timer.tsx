'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Wind, Waves, Moon, Sun, Heart } from 'lucide-react'

type AmbientSound = 'none' | 'rain' | 'ocean' | 'forest' | 'wind' | 'fire'

interface Session {
  duration: number
  completedAt: Date
  type: string
}

export function MeditationTimer() {
  const [duration, setDuration] = useState(5 * 60) // 5 minutes default
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [ambientSound, setAmbientSound] = useState<AmbientSound>('none')
  const [volume, setVolume] = useState(0.5)
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [showBreathing, setShowBreathing] = useState(true)
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedType, setSelectedType] = useState('focus')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const presets = [
    { label: '1 min', value: 60 },
    { label: '3 min', value: 180 },
    { label: '5 min', value: 300 },
    { label: '10 min', value: 600 },
    { label: '15 min', value: 900 },
    { label: '20 min', value: 1200 },
    { label: '30 min', value: 1800 }
  ]

  const meditationTypes = [
    { id: 'focus', label: 'Focus', icon: Sun, color: 'text-yellow-500' },
    { id: 'calm', label: 'Calm', icon: Moon, color: 'text-blue-500' },
    { id: 'breathe', label: 'Breathe', icon: Wind, color: 'text-cyan-500' },
    { id: 'gratitude', label: 'Gratitude', icon: Heart, color: 'text-pink-500' }
  ]

  const sounds: { id: AmbientSound; label: string; icon: typeof Waves }[] = [
    { id: 'none', label: 'None', icon: VolumeX },
    { id: 'rain', label: 'Rain', icon: Waves },
    { id: 'ocean', label: 'Ocean', icon: Waves },
    { id: 'forest', label: 'Forest', icon: Sparkles },
    { id: 'wind', label: 'Wind', icon: Wind }
  ]

  // Breathing animation cycle (4-7-8 technique)
  useEffect(() => {
    if (!isRunning || !showBreathing) return

    const breathCycle = () => {
      setBreathPhase('inhale')
      setTimeout(() => setBreathPhase('hold'), 4000)
      setTimeout(() => setBreathPhase('exhale'), 11000)
    }

    breathCycle()
    const interval = setInterval(breathCycle, 19000) // Full cycle: 4 + 7 + 8 = 19 seconds

    return () => clearInterval(interval)
  }, [isRunning, showBreathing])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsComplete(true)
            // Play completion sound
            const audio = new Audio('/sounds/bell.mp3')
            audio.play().catch(() => {})
            // Save session
            const newSession: Session = {
              duration: duration,
              completedAt: new Date(),
              type: selectedType
            }
            setSessions(prev => [...prev, newSession])
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, duration, selectedType])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    if (isComplete) {
      setTimeLeft(duration)
      setIsComplete(false)
    }
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(duration)
    setIsComplete(false)
  }

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration)
    setTimeLeft(newDuration)
    setIsComplete(false)
  }

  const progress = ((duration - timeLeft) / duration) * 100

  const getBreathingText = (): string => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe In'
      case 'hold': return 'Hold'
      case 'exhale': return 'Breathe Out'
    }
  }

  const getBreathingScale = (): number => {
    switch (breathPhase) {
      case 'inhale': return 1.3
      case 'hold': return 1.3
      case 'exhale': return 1
    }
  }

  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration / 60, 0)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-primary">{sessions.length}</p>
          <p className="text-sm text-muted-foreground">Sessions</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-green-500">{Math.round(totalMinutes)}</p>
          <p className="text-sm text-muted-foreground">Minutes</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-purple-500">
            {sessions.filter(s => {
              const today = new Date()
              const sessionDate = new Date(s.completedAt)
              return sessionDate.toDateString() === today.toDateString()
            }).length}
          </p>
          <p className="text-sm text-muted-foreground">Today</p>
        </div>
      </div>

      {/* Meditation Types */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <p className="text-sm font-medium mb-3">Meditation Type</p>
        <div className="flex gap-2 flex-wrap">
          {meditationTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                selectedType === type.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <type.icon className={`w-4 h-4 ${selectedType === type.id ? '' : type.color}`} />
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timer Display */}
      <div className="relative p-12 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-purple-500/5">
        {/* Progress Ring */}
        <div className="relative w-64 h-64 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
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
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Breathing Circle */}
          {showBreathing && isRunning && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: getBreathingScale() }}
              transition={{ duration: breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 0.1 : 8, ease: 'easeInOut' }}
            >
              <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                <p className="text-sm font-medium text-primary">{getBreathingText()}</p>
              </div>
            </motion.div>
          )}

          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {isComplete ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                  <p className="text-xl font-medium">Complete!</p>
                </motion.div>
              ) : (
                <motion.p
                  key={timeLeft}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  className="text-5xl font-bold font-mono"
                >
                  {formatTime(timeLeft)}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="p-4 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isRunning ? handlePause : handleStart}
            className="p-6 rounded-full bg-primary text-primary-foreground shadow-lg"
          >
            {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBreathing(!showBreathing)}
            className={`p-4 rounded-full transition-colors ${
              showBreathing ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
            }`}
          >
            <Wind className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Duration Presets */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <p className="text-sm font-medium mb-3">Duration</p>
        <div className="flex gap-2 flex-wrap">
          {presets.map(preset => (
            <button
              key={preset.value}
              onClick={() => handleDurationChange(preset.value)}
              disabled={isRunning}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                duration === preset.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ambient Sounds */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium">Ambient Sound</p>
          {ambientSound !== 'none' && (
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20"
              />
            </div>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {sounds.map(sound => (
            <button
              key={sound.id}
              onClick={() => setAmbientSound(sound.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                ambientSound === sound.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <sound.icon className="w-4 h-4" />
              {sound.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-4">Meditation Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Find a comfortable position and close your eyes
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Focus on your breath - follow the 4-7-8 breathing pattern
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            When your mind wanders, gently bring it back to your breath
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Start with shorter sessions and gradually increase duration
          </li>
        </ul>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Wind, Moon, Sun, Heart, Zap, Coffee } from 'lucide-react'

interface BreathingPattern {
  id: string
  name: string
  description: string
  inhale: number
  hold1: number
  exhale: number
  hold2: number
  cycles: number
  icon: typeof Wind
  color: string
}

const patterns: BreathingPattern[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal timing for stress relief and focus',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    cycles: 4,
    icon: Wind,
    color: 'text-cyan-500'
  },
  {
    id: '478',
    name: '4-7-8 Relaxing',
    description: 'Deep relaxation and sleep preparation',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    cycles: 4,
    icon: Moon,
    color: 'text-purple-500'
  },
  {
    id: 'energizing',
    name: 'Energizing Breath',
    description: 'Quick energy boost',
    inhale: 2,
    hold1: 2,
    exhale: 2,
    hold2: 0,
    cycles: 10,
    icon: Zap,
    color: 'text-yellow-500'
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    description: 'Heart coherence and calm',
    inhale: 5,
    hold1: 0,
    exhale: 5,
    hold2: 0,
    cycles: 6,
    icon: Heart,
    color: 'text-pink-500'
  },
  {
    id: 'morning',
    name: 'Morning Wake-Up',
    description: 'Gentle awakening breath',
    inhale: 3,
    hold1: 3,
    exhale: 6,
    hold2: 0,
    cycles: 5,
    icon: Sun,
    color: 'text-orange-500'
  },
  {
    id: 'focus',
    name: 'Focus Breath',
    description: 'Concentration and clarity',
    inhale: 4,
    hold1: 4,
    exhale: 6,
    hold2: 2,
    cycles: 4,
    icon: Coffee,
    color: 'text-amber-500'
  }
]

type Phase = 'idle' | 'inhale' | 'hold1' | 'exhale' | 'hold2' | 'complete'

export function BreathingExercise() {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(patterns[0])
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [currentCycle, setCurrentCycle] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [totalSessions, setTotalSessions] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('breathingSessions')
    if (saved) {
      setTotalSessions(parseInt(saved))
    }
  }, [])

  useEffect(() => {
    if (!isRunning) return

    const pattern = selectedPattern

    const runBreathingCycle = async () => {
      for (let cycle = 0; cycle < pattern.cycles; cycle++) {
        if (!isRunning) return
        setCurrentCycle(cycle + 1)

        // Inhale
        setPhase('inhale')
        for (let i = pattern.inhale; i > 0; i--) {
          if (!isRunning) return
          setCountdown(i)
          await new Promise(r => setTimeout(r, 1000))
        }

        // Hold 1
        if (pattern.hold1 > 0) {
          setPhase('hold1')
          for (let i = pattern.hold1; i > 0; i--) {
            if (!isRunning) return
            setCountdown(i)
            await new Promise(r => setTimeout(r, 1000))
          }
        }

        // Exhale
        setPhase('exhale')
        for (let i = pattern.exhale; i > 0; i--) {
          if (!isRunning) return
          setCountdown(i)
          await new Promise(r => setTimeout(r, 1000))
        }

        // Hold 2
        if (pattern.hold2 > 0) {
          setPhase('hold2')
          for (let i = pattern.hold2; i > 0; i--) {
            if (!isRunning) return
            setCountdown(i)
            await new Promise(r => setTimeout(r, 1000))
          }
        }
      }

      // Complete
      setPhase('complete')
      setIsRunning(false)
      const newTotal = totalSessions + 1
      setTotalSessions(newTotal)
      localStorage.setItem('breathingSessions', newTotal.toString())
    }

    runBreathingCycle()
  }, [isRunning, selectedPattern])

  const handleStart = () => {
    setCurrentCycle(0)
    setPhase('idle')
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
    setPhase('idle')
  }

  const handleReset = () => {
    setIsRunning(false)
    setPhase('idle')
    setCurrentCycle(0)
    setCountdown(0)
  }

  const getPhaseText = (): string => {
    switch (phase) {
      case 'inhale': return 'Breathe In'
      case 'hold1': return 'Hold'
      case 'exhale': return 'Breathe Out'
      case 'hold2': return 'Hold'
      case 'complete': return 'Complete!'
      default: return 'Ready'
    }
  }

  const getPhaseColor = (): string => {
    switch (phase) {
      case 'inhale': return 'text-cyan-500'
      case 'hold1': return 'text-yellow-500'
      case 'exhale': return 'text-purple-500'
      case 'hold2': return 'text-orange-500'
      case 'complete': return 'text-green-500'
      default: return 'text-muted-foreground'
    }
  }

  const getCircleScale = (): number => {
    switch (phase) {
      case 'inhale': return 1.5
      case 'hold1': return 1.5
      case 'exhale': return 1
      case 'hold2': return 1
      default: return 1.2
    }
  }

  const getCircleDuration = (): number => {
    switch (phase) {
      case 'inhale': return selectedPattern.inhale
      case 'hold1': return 0.1
      case 'exhale': return selectedPattern.exhale
      case 'hold2': return 0.1
      default: return 0.5
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-primary">{totalSessions}</p>
          <p className="text-sm text-muted-foreground">Sessions</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-cyan-500">{currentCycle}</p>
          <p className="text-sm text-muted-foreground">/ {selectedPattern.cycles} Cycles</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-purple-500">
            {selectedPattern.inhale + selectedPattern.hold1 + selectedPattern.exhale + selectedPattern.hold2}s
          </p>
          <p className="text-sm text-muted-foreground">Per Cycle</p>
        </div>
      </div>

      {/* Pattern Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {patterns.map(pattern => (
          <button
            key={pattern.id}
            onClick={() => {
              if (!isRunning) {
                setSelectedPattern(pattern)
                handleReset()
              }
            }}
            disabled={isRunning}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedPattern.id === pattern.id
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card hover:border-primary/50'
            } disabled:opacity-50`}
          >
            <pattern.icon className={`w-6 h-6 mb-2 ${pattern.color}`} />
            <p className="font-medium">{pattern.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{pattern.description}</p>
            <p className="text-xs font-mono mt-2 text-primary">
              {pattern.inhale}-{pattern.hold1}-{pattern.exhale}-{pattern.hold2}
            </p>
          </button>
        ))}
      </div>

      {/* Breathing Animation */}
      <div className="p-12 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-muted" />

          {/* Animated circle */}
          <motion.div
            className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center"
            animate={{
              scale: phase !== 'idle' && phase !== 'complete' ? getCircleScale() : 1.2
            }}
            transition={{
              duration: getCircleDuration(),
              ease: 'easeInOut'
            }}
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/50 to-purple-500/50"
              animate={{
                scale: phase !== 'idle' && phase !== 'complete' ? getCircleScale() : 1.2
              }}
              transition={{
                duration: getCircleDuration(),
                ease: 'easeInOut',
                delay: 0.1
              }}
            />
          </motion.div>

          {/* Center content */}
          <div className="relative z-10 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {phase !== 'idle' && phase !== 'complete' && (
                  <p className="text-5xl font-bold mb-2">{countdown}</p>
                )}
                <p className={`text-xl font-medium ${getPhaseColor()}`}>
                  {getPhaseText()}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Phase indicators */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            <div className={`w-3 h-3 rounded-full ${phase === 'inhale' ? 'bg-cyan-500' : 'bg-muted'}`} />
            <div className={`w-3 h-3 rounded-full ${phase === 'hold1' ? 'bg-yellow-500' : 'bg-muted'}`} />
            <div className={`w-3 h-3 rounded-full ${phase === 'exhale' ? 'bg-purple-500' : 'bg-muted'}`} />
            {selectedPattern.hold2 > 0 && (
              <div className={`w-3 h-3 rounded-full ${phase === 'hold2' ? 'bg-orange-500' : 'bg-muted'}`} />
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-12">
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
        </div>
      </div>

      {/* Pattern Info */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <selectedPattern.icon className={`w-5 h-5 ${selectedPattern.color}`} />
          {selectedPattern.name}
        </h3>
        <p className="text-muted-foreground mb-4">{selectedPattern.description}</p>

        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-lg bg-cyan-500/10">
            <p className="text-2xl font-bold text-cyan-500">{selectedPattern.inhale}s</p>
            <p className="text-xs text-muted-foreground">Inhale</p>
          </div>
          <div className="p-3 rounded-lg bg-yellow-500/10">
            <p className="text-2xl font-bold text-yellow-500">{selectedPattern.hold1}s</p>
            <p className="text-xs text-muted-foreground">Hold</p>
          </div>
          <div className="p-3 rounded-lg bg-purple-500/10">
            <p className="text-2xl font-bold text-purple-500">{selectedPattern.exhale}s</p>
            <p className="text-xs text-muted-foreground">Exhale</p>
          </div>
          <div className="p-3 rounded-lg bg-orange-500/10">
            <p className="text-2xl font-bold text-orange-500">{selectedPattern.hold2}s</p>
            <p className="text-xs text-muted-foreground">Hold</p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-4">Benefits of Breathing Exercises</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Reduces stress and anxiety
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Improves focus and concentration
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Lowers blood pressure and heart rate
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Enhances sleep quality
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Boosts immune system
          </li>
        </ul>
      </div>
    </div>
  )
}

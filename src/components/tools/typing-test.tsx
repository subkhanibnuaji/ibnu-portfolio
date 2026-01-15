'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Keyboard, RotateCcw, Timer, Award, Zap, Target, TrendingUp } from 'lucide-react'

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.",
  "Programming is the art of telling a computer what to do. It requires logic, creativity, and patience.",
  "In the world of web development, JavaScript has become the universal language of the internet.",
  "Machine learning is transforming how we interact with technology, making computers smarter every day.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The best way to predict the future is to create it. Innovation starts with a single idea.",
  "Code is like humor. When you have to explain it, it's bad. Write clean, readable code always.",
  "Every expert was once a beginner. Keep practicing and you will master any skill you pursue."
]

interface Stats {
  wpm: number
  accuracy: number
  correctChars: number
  incorrectChars: number
  totalChars: number
  time: number
}

export function TypingTest() {
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [isStarted, setIsStarted] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [stats, setStats] = useState<Stats | null>(null)
  const [duration, setDuration] = useState(60)
  const [showResults, setShowResults] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const selectRandomText = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_TEXTS.length)
    setText(SAMPLE_TEXTS[randomIndex])
  }, [])

  useEffect(() => {
    selectRandomText()
  }, [selectRandomText])

  useEffect(() => {
    if (isStarted && !isFinished) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setElapsedTime(elapsed)

        if (elapsed >= duration) {
          finishTest()
        }
      }, 100)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isStarted, isFinished, startTime, duration])

  const startTest = () => {
    setIsStarted(true)
    setStartTime(Date.now())
    setUserInput('')
    setElapsedTime(0)
    setIsFinished(false)
    setShowResults(false)
    inputRef.current?.focus()
  }

  const finishTest = () => {
    setIsFinished(true)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Calculate stats
    let correctChars = 0
    let incorrectChars = 0

    for (let i = 0; i < userInput.length; i++) {
      if (i < text.length && userInput[i] === text[i]) {
        correctChars++
      } else {
        incorrectChars++
      }
    }

    const totalChars = userInput.length
    const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0
    const timeInMinutes = elapsedTime / 60
    const words = correctChars / 5 // Standard: 5 chars = 1 word
    const wpm = timeInMinutes > 0 ? Math.round(words / timeInMinutes) : 0

    setStats({
      wpm,
      accuracy,
      correctChars,
      incorrectChars,
      totalChars,
      time: elapsedTime
    })
    setShowResults(true)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUserInput(value)

    // Check if user finished the text
    if (value.length >= text.length) {
      finishTest()
    }
  }

  const reset = () => {
    setIsStarted(false)
    setIsFinished(false)
    setUserInput('')
    setElapsedTime(0)
    setStats(null)
    setShowResults(false)
    selectRandomText()
  }

  const getCharacterClass = (index: number) => {
    if (index >= userInput.length) return 'text-muted-foreground'
    if (userInput[index] === text[index]) return 'text-green-500'
    return 'text-red-500 bg-red-500/20'
  }

  const timeRemaining = duration - elapsedTime

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium mb-4">
          <Keyboard className="w-4 h-4" />
          Typing Practice
        </div>
        <h2 className="text-3xl font-bold mb-2">Typing Speed Test</h2>
        <p className="text-muted-foreground">
          Test your typing speed and accuracy. How fast can you type?
        </p>
      </div>

      {/* Duration Selection */}
      {!isStarted && (
        <div className="flex justify-center gap-2 mb-6">
          {[30, 60, 120].map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                duration === d
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {d}s
            </button>
          ))}
        </div>
      )}

      {/* Timer Display */}
      {isStarted && !isFinished && (
        <div className="flex justify-center mb-6">
          <div className={`px-6 py-3 rounded-xl border ${
            timeRemaining <= 10 ? 'border-red-500 bg-red-500/10' : 'border-border bg-card'
          }`}>
            <div className="flex items-center gap-2">
              <Timer className={`w-5 h-5 ${timeRemaining <= 10 ? 'text-red-500' : ''}`} />
              <span className={`text-2xl font-mono font-bold ${timeRemaining <= 10 ? 'text-red-500' : ''}`}>
                {Math.max(0, timeRemaining)}s
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Text Display */}
      <div className="p-6 rounded-xl border border-border bg-card mb-6">
        <p className="text-lg leading-relaxed font-mono select-none">
          {text.split('').map((char, index) => (
            <span key={index} className={getCharacterClass(index)}>
              {char}
            </span>
          ))}
        </p>
      </div>

      {/* Input Field */}
      {isStarted && !isFinished && (
        <div className="mb-6">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInput}
            className="w-full p-4 rounded-xl border border-border bg-background text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Start typing..."
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
      )}

      {/* Start/Reset Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        {!isStarted ? (
          <button
            onClick={startTest}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 inline-flex items-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Start Test
          </button>
        ) : (
          <button
            onClick={reset}
            className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {/* Results */}
      <AnimatePresence>
        {showResults && stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Main Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 rounded-xl border border-border bg-card text-center">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-blue-500">{stats.wpm}</p>
                <p className="text-sm text-muted-foreground">WPM</p>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card text-center">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-green-500">{stats.accuracy.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card text-center">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-purple-500">{stats.correctChars}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                  <Timer className="w-6 h-6 text-amber-500" />
                </div>
                <p className="text-3xl font-bold text-amber-500">{stats.time}s</p>
                <p className="text-sm text-muted-foreground">Time</p>
              </div>
            </div>

            {/* Performance Badge */}
            <div className="p-6 rounded-xl border border-border bg-gradient-to-r from-card to-muted/30 text-center">
              <Award className="w-12 h-12 mx-auto mb-3 text-amber-500" />
              <h3 className="text-xl font-bold mb-1">
                {stats.wpm >= 80 ? 'Outstanding!' :
                 stats.wpm >= 60 ? 'Great Job!' :
                 stats.wpm >= 40 ? 'Good Progress!' :
                 'Keep Practicing!'}
              </h3>
              <p className="text-muted-foreground">
                {stats.wpm >= 80 ? 'You\'re a typing master!' :
                 stats.wpm >= 60 ? 'Above average typing speed!' :
                 stats.wpm >= 40 ? 'You\'re doing well!' :
                 'Practice makes perfect!'}
              </p>
            </div>

            {/* Try Again */}
            <div className="flex justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

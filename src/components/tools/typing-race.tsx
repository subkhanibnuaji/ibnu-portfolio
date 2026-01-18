'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy, Clock, Zap, Target, RotateCcw,
  Play, Keyboard, CheckCircle
} from 'lucide-react'

const TEXTS = [
  "The quick brown fox jumps over the lazy dog.",
  "Programming is the art of telling a computer what to do.",
  "A journey of a thousand miles begins with a single step.",
  "In the middle of difficulty lies opportunity.",
  "The only way to do great work is to love what you do.",
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "Experience is the name everyone gives to their mistakes.",
  "The best error message is the one that never shows up.",
  "Simplicity is the soul of efficiency.",
  "Talk is cheap. Show me the code.",
  "Any fool can write code that a computer can understand.",
  "Clean code always looks like it was written by someone who cares.",
  "The function of good software is to make the complex appear simple.",
  "Programming isn't about what you know; it's about what you can figure out."
]

interface GameStats {
  wpm: number
  accuracy: number
  time: number
  errors: number
  correct: number
}

interface HighScore {
  wpm: number
  accuracy: number
  date: string
}

export function TypingRace() {
  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'playing' | 'finished'>('idle')
  const [currentText, setCurrentText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [errors, setErrors] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [countdown, setCountdown] = useState(3)
  const [stats, setStats] = useState<GameStats | null>(null)
  const [highScores, setHighScores] = useState<HighScore[]>([])

  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('typing-race-scores')
    if (saved) {
      setHighScores(JSON.parse(saved))
    }
  }, [])

  const saveHighScore = useCallback((wpm: number, accuracy: number) => {
    const newScore: HighScore = {
      wpm,
      accuracy,
      date: new Date().toLocaleDateString()
    }

    const newScores = [...highScores, newScore]
      .sort((a, b) => b.wpm - a.wpm)
      .slice(0, 5)

    setHighScores(newScores)
    localStorage.setItem('typing-race-scores', JSON.stringify(newScores))
  }, [highScores])

  const startGame = () => {
    setGameState('countdown')
    setCountdown(3)
    setUserInput('')
    setCurrentIndex(0)
    setErrors(0)
    setStats(null)

    // Select random text
    const randomText = TEXTS[Math.floor(Math.random() * TEXTS.length)]
    setCurrentText(randomText)

    // Countdown
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          setGameState('playing')
          setStartTime(Date.now())
          inputRef.current?.focus()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime)
      }, 100)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [gameState, startTime])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'playing') return

    const value = e.target.value
    const expectedChar = currentText[currentIndex]

    if (value.length > userInput.length) {
      // New character typed
      const typedChar = value[value.length - 1]

      if (typedChar === expectedChar) {
        setUserInput(value)
        setCurrentIndex(prev => prev + 1)

        // Check if finished
        if (currentIndex + 1 >= currentText.length) {
          finishGame()
        }
      } else {
        setErrors(prev => prev + 1)
        // Don't update input for wrong character
      }
    } else {
      // Backspace - allow it
      setUserInput(value)
      setCurrentIndex(value.length)
    }
  }

  const finishGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    const finalTime = (Date.now() - startTime) / 1000
    const wordsTyped = currentText.split(' ').length
    const wpm = Math.round((wordsTyped / finalTime) * 60)
    const accuracy = Math.round(((currentText.length - errors) / currentText.length) * 100)

    const gameStats: GameStats = {
      wpm,
      accuracy: Math.max(0, accuracy),
      time: finalTime,
      errors,
      correct: currentText.length - errors
    }

    setStats(gameStats)
    setGameState('finished')
    saveHighScore(wpm, Math.max(0, accuracy))
  }

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000)
    const decimal = Math.floor((ms % 1000) / 100)
    return `${seconds}.${decimal}s`
  }

  const getCharacterClass = (index: number): string => {
    if (index < currentIndex) {
      return 'text-green-400'
    } else if (index === currentIndex) {
      return 'bg-blue-500 text-white'
    }
    return 'text-white/50'
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Stats bar */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-white font-mono">{formatTime(elapsedTime)}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-mono">
              {gameState === 'playing' && elapsedTime > 0
                ? Math.round((currentIndex / 5 / (elapsedTime / 60000)))
                : 0} WPM
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-2">
            <Target className="w-5 h-5 text-red-400" />
            <span className="text-white font-mono">{errors} errors</span>
          </div>
        </div>

        {/* Game area */}
        <div className="min-h-[200px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {gameState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <Keyboard className="w-16 h-16 mx-auto mb-4 text-white/30" />
                <h2 className="text-2xl font-bold text-white mb-4">Typing Race</h2>
                <p className="text-white/70 mb-6">Test your typing speed and accuracy</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="px-8 py-4 bg-blue-500 text-white rounded-lg font-medium flex items-center gap-2 mx-auto"
                >
                  <Play className="w-5 h-5" />
                  Start Race
                </motion.button>
              </motion.div>
            )}

            {gameState === 'countdown' && (
              <motion.div
                key="countdown"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="text-center"
              >
                <motion.div
                  key={countdown}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-8xl font-bold text-blue-400"
                >
                  {countdown}
                </motion.div>
                <p className="text-white/70 mt-4">Get ready...</p>
              </motion.div>
            )}

            {gameState === 'playing' && (
              <motion.div
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                {/* Text to type */}
                <div className="bg-white/5 rounded-xl p-6 mb-4 font-mono text-xl leading-relaxed">
                  {currentText.split('').map((char, index) => (
                    <span key={index} className={getCharacterClass(index)}>
                      {char}
                    </span>
                  ))}
                </div>

                {/* Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={handleInput}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-mono text-lg focus:outline-none focus:border-blue-500"
                  placeholder="Start typing..."
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                />

                {/* Progress bar */}
                <div className="mt-4 bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentIndex / currentText.length) * 100}%` }}
                  />
                </div>
              </motion.div>
            )}

            {gameState === 'finished' && stats && (
              <motion.div
                key="finished"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full text-center"
              >
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <h2 className="text-3xl font-bold text-white mb-6">Race Complete!</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-3xl font-bold text-blue-400">{stats.wpm}</div>
                    <div className="text-white/50 text-sm">WPM</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-3xl font-bold text-green-400">{stats.accuracy}%</div>
                    <div className="text-white/50 text-sm">Accuracy</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-3xl font-bold text-yellow-400">{stats.time.toFixed(1)}s</div>
                    <div className="text-white/50 text-sm">Time</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-3xl font-bold text-red-400">{stats.errors}</div>
                    <div className="text-white/50 text-sm">Errors</div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="px-8 py-4 bg-blue-500 text-white rounded-lg font-medium flex items-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-5 h-5" />
                  Play Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* High scores */}
        {highScores.length > 0 && gameState !== 'playing' && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              High Scores
            </h3>
            <div className="space-y-2">
              {highScores.map((score, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white/5 rounded-lg px-4 py-2"
                >
                  <span className={`font-bold ${
                    index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-gray-300' :
                    index === 2 ? 'text-amber-600' : 'text-white/50'
                  }`}>
                    #{index + 1}
                  </span>
                  <span className="text-white font-mono flex-1">{score.wpm} WPM</span>
                  <span className="text-white/50">{score.accuracy}%</span>
                  <span className="text-white/30 text-sm">{score.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

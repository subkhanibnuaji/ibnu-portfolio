'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Zap, RotateCcw, Target } from 'lucide-react'

type GameState = 'idle' | 'waiting' | 'ready' | 'clicked' | 'tooearly'

export function ReactionTest() {
  const [gameState, setGameState] = useState<GameState>('idle')
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [times, setTimes] = useState<number[]>([])
  const [bestTime, setBestTime] = useState<number | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('reactionTestBestTime')
    if (saved) setBestTime(parseInt(saved))
  }, [])

  const startRound = useCallback(() => {
    setGameState('waiting')
    setReactionTime(null)

    // Random delay between 2-5 seconds
    const delay = Math.random() * 3000 + 2000

    timeoutRef.current = setTimeout(() => {
      setGameState('ready')
      startTimeRef.current = Date.now()
    }, delay)
  }, [])

  const handleClick = () => {
    if (gameState === 'idle') {
      startRound()
    } else if (gameState === 'waiting') {
      // Clicked too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setGameState('tooearly')
    } else if (gameState === 'ready') {
      const time = Date.now() - startTimeRef.current
      setReactionTime(time)
      setTimes(prev => [...prev, time])
      setGameState('clicked')

      if (!bestTime || time < bestTime) {
        setBestTime(time)
        localStorage.setItem('reactionTestBestTime', time.toString())
      }
    } else if (gameState === 'clicked' || gameState === 'tooearly') {
      startRound()
    }
  }

  const reset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setGameState('idle')
    setReactionTime(null)
    setTimes([])
  }

  const getAverageTime = () => {
    if (times.length === 0) return null
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length)
  }

  const getTimeRating = (time: number) => {
    if (time < 200) return { text: 'Superhuman!', color: 'text-purple-500' }
    if (time < 250) return { text: 'Excellent!', color: 'text-green-500' }
    if (time < 300) return { text: 'Great!', color: 'text-blue-500' }
    if (time < 350) return { text: 'Good!', color: 'text-cyan-500' }
    if (time < 400) return { text: 'Average', color: 'text-yellow-500' }
    return { text: 'Keep practicing!', color: 'text-orange-500' }
  }

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'waiting':
        return 'bg-red-500'
      case 'ready':
        return 'bg-green-500'
      case 'clicked':
        return 'bg-blue-500'
      case 'tooearly':
        return 'bg-yellow-500'
      default:
        return 'bg-blue-600'
    }
  }

  const getMessage = () => {
    switch (gameState) {
      case 'idle':
        return 'Click to Start'
      case 'waiting':
        return 'Wait for green...'
      case 'ready':
        return 'Click NOW!'
      case 'clicked':
        return `${reactionTime} ms`
      case 'tooearly':
        return 'Too early!'
      default:
        return 'Click to Start'
    }
  }

  const average = getAverageTime()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Reaction Time Test</h1>
        <p className="text-muted-foreground">How fast can you react?</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Stats */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            {bestTime && (
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">{bestTime} ms</span>
              </div>
            )}
            {average && (
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span className="text-muted-foreground">Avg: {average} ms</span>
              </div>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            Attempts: {times.length}
          </div>
        </div>

        {/* Game Area */}
        <div
          onClick={handleClick}
          className={`relative h-64 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${getBackgroundColor()}`}
        >
          <Zap className="w-16 h-16 text-white mb-4" />
          <span className="text-3xl font-bold text-white">{getMessage()}</span>

          {gameState === 'clicked' && reactionTime && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-xl mt-2 ${getTimeRating(reactionTime).color}`}
            >
              {getTimeRating(reactionTime).text}
            </motion.span>
          )}

          {gameState === 'tooearly' && (
            <span className="text-white mt-2">Click to try again</span>
          )}

          {(gameState === 'clicked' || gameState === 'tooearly') && (
            <span className="text-white/70 mt-4 text-sm">Click to continue</span>
          )}
        </div>

        {/* Reset Button */}
        {times.length > 0 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={(e) => { e.stopPropagation(); reset(); }}
              className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        )}

        {/* Results */}
        {times.length > 0 && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-3">Your Results</h3>
            <div className="flex flex-wrap gap-2">
              {times.slice(-10).map((time, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-full text-sm ${
                    time === Math.min(...times)
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-muted'
                  }`}
                >
                  {time} ms
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reference */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Reaction Time Reference</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-purple-500">Superhuman</span>
              <span>&lt; 200ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-500">Excellent</span>
              <span>200-250ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-500">Great</span>
              <span>250-300ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyan-500">Good</span>
              <span>300-350ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-500">Average</span>
              <span>350-400ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-orange-500">Practice more</span>
              <span>&gt; 400ms</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, Trophy, Volume2, VolumeX } from 'lucide-react'

type Color = 'green' | 'red' | 'yellow' | 'blue'

const COLORS: Color[] = ['green', 'red', 'yellow', 'blue']

const COLOR_STYLES = {
  green: { bg: 'bg-green-500', active: 'bg-green-300', hover: 'hover:bg-green-400' },
  red: { bg: 'bg-red-500', active: 'bg-red-300', hover: 'hover:bg-red-400' },
  yellow: { bg: 'bg-yellow-500', active: 'bg-yellow-300', hover: 'hover:bg-yellow-400' },
  blue: { bg: 'bg-blue-500', active: 'bg-blue-300', hover: 'hover:bg-blue-400' },
}

const FREQUENCIES = {
  green: 261.63,
  red: 329.63,
  yellow: 392.00,
  blue: 523.25,
}

export function SimonSays() {
  const [sequence, setSequence] = useState<Color[]>([])
  const [playerSequence, setPlayerSequence] = useState<Color[]>([])
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'gameover'>('idle')
  const [activeColor, setActiveColor] = useState<Color | null>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [speed, setSpeed] = useState(1000)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('simonSaysHighScore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  const playSound = useCallback((color: Color) => {
    if (!soundEnabled) return

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = FREQUENCIES[color]
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.3)
  }, [soundEnabled])

  const flashColor = useCallback((color: Color) => {
    setActiveColor(color)
    playSound(color)
    setTimeout(() => setActiveColor(null), speed * 0.4)
  }, [speed, playSound])

  const showSequence = useCallback(async () => {
    setGameState('showing')
    setPlayerSequence([])

    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, speed * 0.6))
      flashColor(sequence[i])
      await new Promise(resolve => setTimeout(resolve, speed * 0.4))
    }

    setGameState('playing')
  }, [sequence, speed, flashColor])

  const addToSequence = useCallback(() => {
    const newColor = COLORS[Math.floor(Math.random() * 4)]
    setSequence(prev => [...prev, newColor])
  }, [])

  const startGame = () => {
    setSequence([])
    setPlayerSequence([])
    setScore(0)
    setSpeed(1000)
    setTimeout(() => {
      const firstColor = COLORS[Math.floor(Math.random() * 4)]
      setSequence([firstColor])
    }, 500)
  }

  useEffect(() => {
    if (sequence.length > 0 && gameState !== 'gameover') {
      showSequence()
    }
  }, [sequence])

  const handleColorClick = (color: Color) => {
    if (gameState !== 'playing') return

    flashColor(color)
    const newPlayerSequence = [...playerSequence, color]
    setPlayerSequence(newPlayerSequence)

    const currentIndex = newPlayerSequence.length - 1

    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      // Wrong color
      setGameState('gameover')
      if (score > highScore) {
        setHighScore(score)
        localStorage.setItem('simonSaysHighScore', score.toString())
      }
      return
    }

    if (newPlayerSequence.length === sequence.length) {
      // Completed sequence
      const newScore = score + 1
      setScore(newScore)

      // Increase speed every 5 rounds
      if (newScore % 5 === 0 && speed > 400) {
        setSpeed(s => s - 100)
      }

      // Add next color after delay
      setTimeout(() => {
        addToSequence()
      }, 1000)
    }
  }

  const getColorClass = (color: Color) => {
    const styles = COLOR_STYLES[color]
    const isActive = activeColor === color
    const canClick = gameState === 'playing'

    return `${isActive ? styles.active : styles.bg} ${canClick ? styles.hover + ' cursor-pointer' : 'cursor-not-allowed opacity-50'}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Simon Says</h1>
        <p className="text-muted-foreground">Repeat the pattern!</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Stats */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold">Score: {score}</div>
            <div className="flex items-center gap-1 text-yellow-500">
              <Trophy className="w-4 h-4" />
              <span>{highScore}</span>
            </div>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-muted hover:bg-muted/80 rounded-lg"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Game Status */}
        <div className="text-center mb-6 h-8">
          {gameState === 'idle' && (
            <span className="text-muted-foreground">Press Start to begin</span>
          )}
          {gameState === 'showing' && (
            <span className="text-yellow-500 font-semibold animate-pulse">Watch the pattern...</span>
          )}
          {gameState === 'playing' && (
            <span className="text-green-500 font-semibold">Your turn!</span>
          )}
          {gameState === 'gameover' && (
            <span className="text-red-500 font-semibold">Game Over!</span>
          )}
        </div>

        {/* Game Board */}
        <div className="relative w-64 h-64 mx-auto mb-6">
          {/* Center circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center z-10">
              <span className="text-white font-bold text-xl">{sequence.length}</span>
            </div>
          </div>

          {/* Color buttons */}
          <div className="grid grid-cols-2 gap-2 w-full h-full">
            <button
              onClick={() => handleColorClick('green')}
              disabled={gameState !== 'playing'}
              className={`rounded-tl-full transition-all duration-200 ${getColorClass('green')}`}
            />
            <button
              onClick={() => handleColorClick('red')}
              disabled={gameState !== 'playing'}
              className={`rounded-tr-full transition-all duration-200 ${getColorClass('red')}`}
            />
            <button
              onClick={() => handleColorClick('yellow')}
              disabled={gameState !== 'playing'}
              className={`rounded-bl-full transition-all duration-200 ${getColorClass('yellow')}`}
            />
            <button
              onClick={() => handleColorClick('blue')}
              disabled={gameState !== 'playing'}
              className={`rounded-br-full transition-all duration-200 ${getColorClass('blue')}`}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {gameState === 'idle' || gameState === 'gameover' ? (
            <button
              onClick={startGame}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 font-semibold"
            >
              <Play className="w-5 h-5" />
              {gameState === 'gameover' ? 'Play Again' : 'Start Game'}
            </button>
          ) : (
            <button
              onClick={startGame}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">How to Play</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Watch the sequence of colors that light up</li>
            <li>Click the colors in the same order</li>
            <li>Each round adds one more color to remember</li>
            <li>The game speeds up every 5 rounds!</li>
            <li>One mistake and it&apos;s game over</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, Trophy, Bird } from 'lucide-react'

interface Pipe {
  x: number
  topHeight: number
  passed: boolean
}

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 600
const BIRD_SIZE = 30
const PIPE_WIDTH = 60
const PIPE_GAP = 150
const GRAVITY = 0.5
const JUMP_FORCE = -8
const PIPE_SPEED = 3

export function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  const birdRef = useRef({ y: CANVAS_HEIGHT / 2, velocity: 0 })
  const pipesRef = useRef<Pipe[]>([])
  const animationRef = useRef<number>()
  const lastPipeRef = useRef(0)

  useEffect(() => {
    const saved = localStorage.getItem('flappy-high-score')
    if (saved) {
      setHighScore(parseInt(saved))
    }
  }, [])

  const jump = useCallback(() => {
    if (gameState === 'playing') {
      birdRef.current.velocity = JUMP_FORCE
    } else if (gameState === 'idle' || gameState === 'gameover') {
      startGame()
    }
  }, [gameState])

  const startGame = () => {
    birdRef.current = { y: CANVAS_HEIGHT / 2, velocity: 0 }
    pipesRef.current = []
    lastPipeRef.current = 0
    setScore(0)
    setGameState('playing')
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear
    ctx.fillStyle = '#87CEEB'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.beginPath()
    ctx.arc(50, 100, 30, 0, Math.PI * 2)
    ctx.arc(80, 100, 40, 0, Math.PI * 2)
    ctx.arc(120, 100, 30, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(300, 150, 25, 0, Math.PI * 2)
    ctx.arc(330, 150, 35, 0, Math.PI * 2)
    ctx.arc(365, 150, 25, 0, Math.PI * 2)
    ctx.fill()

    // Draw ground
    ctx.fillStyle = '#8B4513'
    ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50)
    ctx.fillStyle = '#228B22'
    ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 10)

    // Draw pipes
    pipesRef.current.forEach(pipe => {
      // Top pipe
      ctx.fillStyle = '#2ECC71'
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight)
      ctx.fillStyle = '#27AE60'
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 30, PIPE_WIDTH + 10, 30)

      // Bottom pipe
      const bottomY = pipe.topHeight + PIPE_GAP
      ctx.fillStyle = '#2ECC71'
      ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, CANVAS_HEIGHT - bottomY - 50)
      ctx.fillStyle = '#27AE60'
      ctx.fillRect(pipe.x - 5, bottomY, PIPE_WIDTH + 10, 30)
    })

    // Draw bird
    const bird = birdRef.current
    ctx.save()
    ctx.translate(100, bird.y)

    // Rotate based on velocity
    const rotation = Math.min(Math.max(bird.velocity * 3, -30), 90) * (Math.PI / 180)
    ctx.rotate(rotation)

    // Bird body
    ctx.fillStyle = '#F1C40F'
    ctx.beginPath()
    ctx.ellipse(0, 0, BIRD_SIZE / 2, BIRD_SIZE / 2.5, 0, 0, Math.PI * 2)
    ctx.fill()

    // Wing
    ctx.fillStyle = '#E67E22'
    ctx.beginPath()
    ctx.ellipse(-5, 5, 10, 6, -0.3, 0, Math.PI * 2)
    ctx.fill()

    // Eye
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(8, -5, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'black'
    ctx.beginPath()
    ctx.arc(10, -5, 4, 0, Math.PI * 2)
    ctx.fill()

    // Beak
    ctx.fillStyle = '#E74C3C'
    ctx.beginPath()
    ctx.moveTo(15, 0)
    ctx.lineTo(25, 3)
    ctx.lineTo(15, 6)
    ctx.closePath()
    ctx.fill()

    ctx.restore()

    // Score
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 3
    ctx.font = 'bold 48px Arial'
    ctx.textAlign = 'center'
    ctx.strokeText(score.toString(), CANVAS_WIDTH / 2, 80)
    ctx.fillText(score.toString(), CANVAS_WIDTH / 2, 80)
  }, [score])

  const update = useCallback(() => {
    if (gameState !== 'playing') return

    const bird = birdRef.current

    // Apply gravity
    bird.velocity += GRAVITY
    bird.y += bird.velocity

    // Check ground/ceiling collision
    if (bird.y < BIRD_SIZE / 2 || bird.y > CANVAS_HEIGHT - 50 - BIRD_SIZE / 2) {
      endGame()
      return
    }

    // Generate new pipes
    lastPipeRef.current += PIPE_SPEED
    if (lastPipeRef.current > 200) {
      lastPipeRef.current = 0
      const topHeight = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 150) + 50
      pipesRef.current.push({
        x: CANVAS_WIDTH,
        topHeight,
        passed: false
      })
    }

    // Update pipes
    pipesRef.current = pipesRef.current.filter(pipe => {
      pipe.x -= PIPE_SPEED

      // Check collision
      if (pipe.x < 100 + BIRD_SIZE / 2 && pipe.x + PIPE_WIDTH > 100 - BIRD_SIZE / 2) {
        if (bird.y - BIRD_SIZE / 2 < pipe.topHeight || bird.y + BIRD_SIZE / 2 > pipe.topHeight + PIPE_GAP) {
          endGame()
          return true
        }
      }

      // Check score
      if (!pipe.passed && pipe.x + PIPE_WIDTH < 100) {
        pipe.passed = true
        setScore(prev => prev + 1)
      }

      return pipe.x > -PIPE_WIDTH
    })

    draw()
    animationRef.current = requestAnimationFrame(update)
  }, [gameState, draw])

  const endGame = () => {
    setGameState('gameover')
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('flappy-high-score', score.toString())
    }
  }

  useEffect(() => {
    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(update)
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameState, update])

  useEffect(() => {
    draw()
  }, [draw])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        jump()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [jump])

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Score display */}
        <div className="flex justify-center gap-8 mb-4">
          <div className="text-center">
            <div className="text-white/50 text-sm">Score</div>
            <div className="text-2xl font-bold text-white">{score}</div>
          </div>
          <div className="text-center">
            <div className="text-white/50 text-sm flex items-center gap-1 justify-center">
              <Trophy className="w-4 h-4 text-yellow-400" /> Best
            </div>
            <div className="text-2xl font-bold text-yellow-400">{highScore}</div>
          </div>
        </div>

        {/* Game canvas */}
        <div className="relative flex justify-center">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onClick={jump}
            onTouchStart={(e) => { e.preventDefault(); jump(); }}
            className="rounded-xl cursor-pointer border-4 border-white/20"
          />

          {/* Overlay for idle/gameover */}
          {gameState !== 'playing' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
              <div className="text-center">
                {gameState === 'gameover' && (
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-white mb-2">Game Over!</div>
                    <div className="text-xl text-white/70">Score: {score}</div>
                    {score === highScore && score > 0 && (
                      <div className="text-yellow-400 font-bold mt-2">New High Score! 🎉</div>
                    )}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="px-8 py-4 bg-green-500 text-white rounded-lg font-medium flex items-center gap-2 mx-auto"
                >
                  {gameState === 'gameover' ? (
                    <>
                      <RotateCcw className="w-5 h-5" />
                      Play Again
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Start Game
                    </>
                  )}
                </motion.button>

                <p className="text-white/50 text-sm mt-4">
                  Click, tap, or press Space to jump
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center text-white/50 text-sm">
          Tap or press Space/Up Arrow to flap • Avoid the pipes!
        </div>
      </motion.div>
    </div>
  )
}

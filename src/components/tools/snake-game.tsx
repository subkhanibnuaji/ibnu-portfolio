'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, Play, RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Pause } from 'lucide-react'

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SPEED = 150

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type Position = { x: number; y: number }

export function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [speed, setSpeed] = useState(INITIAL_SPEED)

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const directionRef = useRef<Direction>('RIGHT')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('snakeHighScore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  // Generate random food position
  const generateFood = useCallback((snakeBody: Position[]): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isPaused) return

      const newDirection = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
        w: 'UP',
        s: 'DOWN',
        a: 'LEFT',
        d: 'RIGHT',
        W: 'UP',
        S: 'DOWN',
        A: 'LEFT',
        D: 'RIGHT'
      }[e.key] as Direction | undefined

      if (newDirection) {
        e.preventDefault()
        const opposites: Record<Direction, Direction> = {
          UP: 'DOWN',
          DOWN: 'UP',
          LEFT: 'RIGHT',
          RIGHT: 'LEFT'
        }

        if (opposites[newDirection] !== directionRef.current) {
          directionRef.current = newDirection
          setDirection(newDirection)
        }
      }

      if (e.key === ' ' || e.key === 'Escape') {
        e.preventDefault()
        setIsPaused(p => !p)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, isPaused])

  // Game loop
  useEffect(() => {
    if (!isPlaying || isPaused || gameOver) return

    gameLoopRef.current = setInterval(() => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] }

        switch (directionRef.current) {
          case 'UP': head.y -= 1; break
          case 'DOWN': head.y += 1; break
          case 'LEFT': head.x -= 1; break
          case 'RIGHT': head.x += 1; break
        }

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true)
          setIsPlaying(false)
          return prevSnake
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true)
          setIsPlaying(false)
          return prevSnake
        }

        const newSnake = [head, ...prevSnake]

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(s => {
            const newScore = s + 10
            if (newScore > highScore) {
              setHighScore(newScore)
              localStorage.setItem('snakeHighScore', newScore.toString())
            }
            return newScore
          })
          setFood(generateFood(newSnake))
          // Increase speed
          setSpeed(s => Math.max(50, s - 2))
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }, speed)

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [isPlaying, isPaused, gameOver, speed, food, generateFood, highScore])

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = '#2a2a4e'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL_SIZE, 0)
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * CELL_SIZE)
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE)
      ctx.stroke()
    }

    // Draw food
    ctx.fillStyle = '#ef4444'
    ctx.shadowColor = '#ef4444'
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    )
    ctx.fill()
    ctx.shadowBlur = 0

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0
      const gradient = ctx.createRadialGradient(
        segment.x * CELL_SIZE + CELL_SIZE / 2,
        segment.y * CELL_SIZE + CELL_SIZE / 2,
        0,
        segment.x * CELL_SIZE + CELL_SIZE / 2,
        segment.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2
      )

      if (isHead) {
        gradient.addColorStop(0, '#22c55e')
        gradient.addColorStop(1, '#16a34a')
      } else {
        gradient.addColorStop(0, '#4ade80')
        gradient.addColorStop(1, '#22c55e')
      }

      ctx.fillStyle = gradient
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      )

      // Draw eyes on head
      if (isHead) {
        ctx.fillStyle = '#000'
        const eyeOffsets = {
          UP: [{ x: -3, y: -2 }, { x: 3, y: -2 }],
          DOWN: [{ x: -3, y: 2 }, { x: 3, y: 2 }],
          LEFT: [{ x: -2, y: -3 }, { x: -2, y: 3 }],
          RIGHT: [{ x: 2, y: -3 }, { x: 2, y: 3 }]
        }[direction]

        eyeOffsets.forEach(offset => {
          ctx.beginPath()
          ctx.arc(
            segment.x * CELL_SIZE + CELL_SIZE / 2 + offset.x,
            segment.y * CELL_SIZE + CELL_SIZE / 2 + offset.y,
            2,
            0,
            Math.PI * 2
          )
          ctx.fill()
        })
      }
    })

  }, [snake, food, direction])

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }])
    setFood({ x: 15, y: 15 })
    setDirection('RIGHT')
    directionRef.current = 'RIGHT'
    setScore(0)
    setSpeed(INITIAL_SPEED)
    setGameOver(false)
    setIsPaused(false)
    setIsPlaying(true)
  }

  const handleMobileControl = (dir: Direction) => {
    if (!isPlaying || isPaused) return

    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT'
    }

    if (opposites[dir] !== directionRef.current) {
      directionRef.current = dir
      setDirection(dir)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm font-medium mb-4">
          <Gamepad2 className="w-4 h-4" />
          Classic Game
        </div>
        <h2 className="text-2xl font-bold">Snake Game</h2>
      </div>

      {/* Score Display */}
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Score</p>
          <p className="text-2xl font-bold">{score}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1 text-amber-500">
            <Trophy className="w-4 h-4" />
            <span className="text-sm">High Score</span>
          </div>
          <p className="text-2xl font-bold text-amber-500">{highScore}</p>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="relative rounded-xl border border-border overflow-hidden bg-[#1a1a2e]">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="w-full"
        />

        {/* Overlay States */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-8 py-4 bg-green-500 text-white rounded-xl font-medium inline-flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Game
            </motion.button>
          </div>
        )}

        {isPaused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-center">
              <Pause className="w-12 h-12 mx-auto text-white mb-2" />
              <p className="text-xl font-bold text-white">Paused</p>
              <p className="text-sm text-white/70">Press Space to continue</p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-500 mb-2">Game Over!</p>
              <p className="text-xl text-white mb-4">Score: {score}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="mt-6 flex flex-col items-center gap-2 md:hidden">
        <button
          onTouchStart={() => handleMobileControl('UP')}
          className="p-4 rounded-xl bg-muted active:bg-primary active:text-primary-foreground"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          <button
            onTouchStart={() => handleMobileControl('LEFT')}
            className="p-4 rounded-xl bg-muted active:bg-primary active:text-primary-foreground"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onTouchStart={() => handleMobileControl('DOWN')}
            className="p-4 rounded-xl bg-muted active:bg-primary active:text-primary-foreground"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
          <button
            onTouchStart={() => handleMobileControl('RIGHT')}
            className="p-4 rounded-xl bg-muted active:bg-primary active:text-primary-foreground"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Controls Info */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground text-center">
        <p><strong>Controls:</strong> Arrow keys or WASD to move • Space to pause</p>
      </div>
    </div>
  )
}

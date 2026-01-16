'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Trophy, Heart } from 'lucide-react'

interface Brick {
  x: number
  y: number
  width: number
  height: number
  color: string
  hits: number
  points: number
}

interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
}

interface Paddle {
  x: number
  y: number
  width: number
  height: number
}

export function BrickBreaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover' | 'win'>('idle')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [level, setLevel] = useState(1)

  const gameRef = useRef({
    ball: { x: 400, y: 500, dx: 4, dy: -4, radius: 8 } as Ball,
    paddle: { x: 350, y: 550, width: 100, height: 12 } as Paddle,
    bricks: [] as Brick[],
    animationId: 0,
  })

  useEffect(() => {
    const saved = localStorage.getItem('brickBreakerHighScore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  const generateBricks = useCallback((lvl: number) => {
    const bricks: Brick[] = []
    const rows = Math.min(3 + lvl, 8)
    const cols = 10
    const brickWidth = 70
    const brickHeight = 20
    const padding = 10
    const startX = 45
    const startY = 60

    const colors = [
      { color: '#ef4444', hits: 1, points: 10 },
      { color: '#f97316', hits: 1, points: 20 },
      { color: '#eab308', hits: 1, points: 30 },
      { color: '#22c55e', hits: 2, points: 50 },
      { color: '#3b82f6', hits: 2, points: 70 },
      { color: '#8b5cf6', hits: 3, points: 100 },
    ]

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const colorIndex = Math.min(row, colors.length - 1)
        bricks.push({
          x: startX + col * (brickWidth + padding),
          y: startY + row * (brickHeight + padding),
          width: brickWidth,
          height: brickHeight,
          color: colors[colorIndex].color,
          hits: colors[colorIndex].hits,
          points: colors[colorIndex].points,
        })
      }
    }
    return bricks
  }, [])

  const resetBall = useCallback(() => {
    const game = gameRef.current
    game.ball = {
      x: game.paddle.x + game.paddle.width / 2,
      y: game.paddle.y - 20,
      dx: (Math.random() > 0.5 ? 1 : -1) * (3 + level * 0.5),
      dy: -(3 + level * 0.5),
      radius: 8,
    }
  }, [level])

  const startGame = useCallback(() => {
    const game = gameRef.current
    game.bricks = generateBricks(level)
    game.paddle = { x: 350, y: 550, width: 100, height: 12 }
    resetBall()
    setScore(0)
    setLives(3)
    setLevel(1)
    setGameState('playing')
  }, [generateBricks, resetBall, level])

  const nextLevel = useCallback(() => {
    const newLevel = level + 1
    setLevel(newLevel)
    gameRef.current.bricks = generateBricks(newLevel)
    resetBall()
    setGameState('playing')
  }, [level, generateBricks, resetBall])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const game = gameRef.current

    // Clear
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw bricks
    game.bricks.forEach(brick => {
      ctx.fillStyle = brick.color
      ctx.beginPath()
      ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 4)
      ctx.fill()

      // Brick shine
      ctx.fillStyle = 'rgba(255,255,255,0.2)'
      ctx.fillRect(brick.x + 2, brick.y + 2, brick.width - 4, brick.height / 3)

      // Hit indicator
      if (brick.hits > 1) {
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 12px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(brick.hits.toString(), brick.x + brick.width / 2, brick.y + brick.height / 2 + 4)
      }
    })

    // Draw paddle
    const gradient = ctx.createLinearGradient(game.paddle.x, game.paddle.y, game.paddle.x, game.paddle.y + game.paddle.height)
    gradient.addColorStop(0, '#3b82f6')
    gradient.addColorStop(1, '#1d4ed8')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.roundRect(game.paddle.x, game.paddle.y, game.paddle.width, game.paddle.height, 6)
    ctx.fill()

    // Draw ball
    ctx.beginPath()
    ctx.arc(game.ball.x, game.ball.y, game.ball.radius, 0, Math.PI * 2)
    const ballGradient = ctx.createRadialGradient(
      game.ball.x - 2, game.ball.y - 2, 0,
      game.ball.x, game.ball.y, game.ball.radius
    )
    ballGradient.addColorStop(0, '#fff')
    ballGradient.addColorStop(1, '#94a3b8')
    ctx.fillStyle = ballGradient
    ctx.fill()
  }, [])

  const update = useCallback(() => {
    if (gameState !== 'playing') return

    const game = gameRef.current
    const ball = game.ball
    const paddle = game.paddle
    const canvas = canvasRef.current
    if (!canvas) return

    // Move ball
    ball.x += ball.dx
    ball.y += ball.dy

    // Wall collision
    if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
      ball.dx = -ball.dx
    }
    if (ball.y - ball.radius <= 0) {
      ball.dy = -ball.dy
    }

    // Paddle collision
    if (
      ball.y + ball.radius >= paddle.y &&
      ball.y - ball.radius <= paddle.y + paddle.height &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.width
    ) {
      const hitPos = (ball.x - paddle.x) / paddle.width
      const angle = (hitPos - 0.5) * Math.PI * 0.7
      const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy)
      ball.dx = speed * Math.sin(angle)
      ball.dy = -Math.abs(speed * Math.cos(angle))
      ball.y = paddle.y - ball.radius
    }

    // Brick collision
    for (let i = game.bricks.length - 1; i >= 0; i--) {
      const brick = game.bricks[i]
      if (
        ball.x + ball.radius >= brick.x &&
        ball.x - ball.radius <= brick.x + brick.width &&
        ball.y + ball.radius >= brick.y &&
        ball.y - ball.radius <= brick.y + brick.height
      ) {
        brick.hits--
        if (brick.hits <= 0) {
          game.bricks.splice(i, 1)
          setScore(prev => {
            const newScore = prev + brick.points
            if (newScore > highScore) {
              setHighScore(newScore)
              localStorage.setItem('brickBreakerHighScore', newScore.toString())
            }
            return newScore
          })
        }

        // Determine collision side
        const overlapLeft = ball.x + ball.radius - brick.x
        const overlapRight = brick.x + brick.width - (ball.x - ball.radius)
        const overlapTop = ball.y + ball.radius - brick.y
        const overlapBottom = brick.y + brick.height - (ball.y - ball.radius)

        const minOverlapX = Math.min(overlapLeft, overlapRight)
        const minOverlapY = Math.min(overlapTop, overlapBottom)

        if (minOverlapX < minOverlapY) {
          ball.dx = -ball.dx
        } else {
          ball.dy = -ball.dy
        }
        break
      }
    }

    // Check win
    if (game.bricks.length === 0) {
      setGameState('win')
      return
    }

    // Ball falls
    if (ball.y + ball.radius >= canvas.height) {
      setLives(prev => {
        const newLives = prev - 1
        if (newLives <= 0) {
          setGameState('gameover')
        } else {
          resetBall()
        }
        return newLives
      })
    }
  }, [gameState, highScore, resetBall])

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return

    const gameLoop = () => {
      update()
      draw()
      gameRef.current.animationId = requestAnimationFrame(gameLoop)
    }

    gameRef.current.animationId = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(gameRef.current.animationId)
    }
  }, [gameState, update, draw])

  // Mouse/Touch controls
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMove = (clientX: number) => {
      const rect = canvas.getBoundingClientRect()
      const x = clientX - rect.left
      const paddle = gameRef.current.paddle
      paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, x - paddle.width / 2))
    }

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      handleMove(e.touches[0].clientX)
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const paddle = gameRef.current.paddle
      const canvas = canvasRef.current
      if (!canvas) return

      if (e.key === 'ArrowLeft') {
        paddle.x = Math.max(0, paddle.x - 30)
      } else if (e.key === 'ArrowRight') {
        paddle.x = Math.min(canvas.width - paddle.width, paddle.x + 30)
      } else if (e.key === ' ' && gameState === 'idle') {
        startGame()
      } else if (e.key === 'p' || e.key === 'P') {
        if (gameState === 'playing') setGameState('paused')
        else if (gameState === 'paused') setGameState('playing')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, startGame])

  // Draw initial state
  useEffect(() => {
    if (gameState === 'idle') {
      draw()
    }
  }, [gameState, draw])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Brick Breaker</h1>
        <p className="text-muted-foreground">Classic arcade game - break all the bricks!</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Stats */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold">Score: {score}</div>
            <div className="flex items-center gap-1 text-yellow-500">
              <Trophy className="w-4 h-4" />
              <span>{highScore}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Level {level}</div>
            <div className="flex items-center gap-1">
              {Array.from({ length: lives }).map((_, i) => (
                <Heart key={i} className="w-5 h-5 text-red-500 fill-red-500" />
              ))}
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full bg-slate-900 rounded-lg cursor-none"
            style={{ maxWidth: '800px', margin: '0 auto', display: 'block' }}
          />

          {/* Overlays */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Brick Breaker</h2>
                <p className="mb-4 text-gray-300">Move mouse or use arrow keys</p>
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2 mx-auto"
                >
                  <Play className="w-5 h-5" />
                  Start Game
                </button>
              </div>
            </div>
          )}

          {gameState === 'paused' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Paused</h2>
                <button
                  onClick={() => setGameState('playing')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2 mx-auto"
                >
                  <Play className="w-5 h-5" />
                  Resume
                </button>
              </div>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-2 text-red-500">Game Over</h2>
                <p className="text-xl mb-4">Final Score: {score}</p>
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-5 h-5" />
                  Play Again
                </button>
              </div>
            </div>
          )}

          {gameState === 'win' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-2 text-green-500">Level Complete!</h2>
                <p className="text-xl mb-4">Score: {score}</p>
                <button
                  onClick={nextLevel}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold flex items-center gap-2 mx-auto"
                >
                  <Play className="w-5 h-5" />
                  Next Level
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-4">
          {gameState === 'playing' && (
            <button
              onClick={() => setGameState('paused')}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
          )}
          {(gameState === 'playing' || gameState === 'paused') && (
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
            <li>Move your mouse or use arrow keys to control the paddle</li>
            <li>Break all bricks to advance to the next level</li>
            <li>Some bricks require multiple hits (number shown)</li>
            <li>Don&apos;t let the ball fall below the paddle!</li>
            <li>Press P to pause/resume the game</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Trophy, Settings } from 'lucide-react'

interface GameState {
  ballX: number
  ballY: number
  ballVX: number
  ballVY: number
  paddle1Y: number
  paddle2Y: number
  score1: number
  score2: number
  gameOver: boolean
  winner: number | null
}

export function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameState, setGameState] = useState<GameState>({
    ballX: 400,
    ballY: 200,
    ballVX: 5,
    ballVY: 3,
    paddle1Y: 150,
    paddle2Y: 150,
    score1: 0,
    score2: 0,
    gameOver: false,
    winner: null
  })
  const [gameMode, setGameMode] = useState<'ai' | '2player'>('ai')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [winScore, setWinScore] = useState(5)

  const gameStateRef = useRef(gameState)
  const keysPressed = useRef<Set<string>>(new Set())
  const animationRef = useRef<number | null>(null)

  // Game constants
  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 400
  const PADDLE_WIDTH = 10
  const PADDLE_HEIGHT = 80
  const BALL_SIZE = 10
  const PADDLE_SPEED = 8

  const getAISpeed = () => {
    switch (difficulty) {
      case 'easy': return 3
      case 'medium': return 5
      case 'hard': return 7
    }
  }

  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  const resetBall = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT / 2,
      ballVX: (Math.random() > 0.5 ? 1 : -1) * 5,
      ballVY: (Math.random() - 0.5) * 6
    }))
  }, [])

  const startNewGame = useCallback(() => {
    setGameState({
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT / 2,
      ballVX: (Math.random() > 0.5 ? 1 : -1) * 5,
      ballVY: (Math.random() - 0.5) * 6,
      paddle1Y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      paddle2Y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      score1: 0,
      score2: 0,
      gameOver: false,
      winner: null
    })
    setIsPlaying(true)
  }, [])

  const gameLoop = useCallback(() => {
    const state = gameStateRef.current
    if (state.gameOver) return

    let newState = { ...state }

    // Move paddles based on input
    if (keysPressed.current.has('w') || keysPressed.current.has('W')) {
      newState.paddle1Y = Math.max(0, state.paddle1Y - PADDLE_SPEED)
    }
    if (keysPressed.current.has('s') || keysPressed.current.has('S')) {
      newState.paddle1Y = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.paddle1Y + PADDLE_SPEED)
    }

    if (gameMode === '2player') {
      if (keysPressed.current.has('ArrowUp')) {
        newState.paddle2Y = Math.max(0, state.paddle2Y - PADDLE_SPEED)
      }
      if (keysPressed.current.has('ArrowDown')) {
        newState.paddle2Y = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.paddle2Y + PADDLE_SPEED)
      }
    } else {
      // AI movement
      const aiSpeed = getAISpeed()
      const paddle2Center = state.paddle2Y + PADDLE_HEIGHT / 2
      const targetY = state.ballX > CANVAS_WIDTH / 2 ? state.ballY : CANVAS_HEIGHT / 2

      if (paddle2Center < targetY - 10) {
        newState.paddle2Y = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.paddle2Y + aiSpeed)
      } else if (paddle2Center > targetY + 10) {
        newState.paddle2Y = Math.max(0, state.paddle2Y - aiSpeed)
      }
    }

    // Move ball
    newState.ballX = state.ballX + state.ballVX
    newState.ballY = state.ballY + state.ballVY

    // Ball collision with top/bottom walls
    if (newState.ballY <= 0 || newState.ballY >= CANVAS_HEIGHT - BALL_SIZE) {
      newState.ballVY = -state.ballVY
      newState.ballY = newState.ballY <= 0 ? 0 : CANVAS_HEIGHT - BALL_SIZE
    }

    // Ball collision with paddle 1
    if (
      newState.ballX <= PADDLE_WIDTH + 20 &&
      newState.ballX >= 20 &&
      newState.ballY + BALL_SIZE >= newState.paddle1Y &&
      newState.ballY <= newState.paddle1Y + PADDLE_HEIGHT
    ) {
      const hitPos = (newState.ballY - newState.paddle1Y) / PADDLE_HEIGHT
      newState.ballVX = Math.abs(state.ballVX) * 1.05 // Speed up slightly
      newState.ballVY = (hitPos - 0.5) * 10
      newState.ballX = PADDLE_WIDTH + 21
    }

    // Ball collision with paddle 2
    if (
      newState.ballX >= CANVAS_WIDTH - PADDLE_WIDTH - 20 - BALL_SIZE &&
      newState.ballX <= CANVAS_WIDTH - 20 - BALL_SIZE &&
      newState.ballY + BALL_SIZE >= newState.paddle2Y &&
      newState.ballY <= newState.paddle2Y + PADDLE_HEIGHT
    ) {
      const hitPos = (newState.ballY - newState.paddle2Y) / PADDLE_HEIGHT
      newState.ballVX = -Math.abs(state.ballVX) * 1.05
      newState.ballVY = (hitPos - 0.5) * 10
      newState.ballX = CANVAS_WIDTH - PADDLE_WIDTH - 21 - BALL_SIZE
    }

    // Cap ball speed
    const maxSpeed = 15
    newState.ballVX = Math.max(-maxSpeed, Math.min(maxSpeed, newState.ballVX))
    newState.ballVY = Math.max(-maxSpeed, Math.min(maxSpeed, newState.ballVY))

    // Score
    if (newState.ballX <= 0) {
      newState.score2 += 1
      if (newState.score2 >= winScore) {
        newState.gameOver = true
        newState.winner = 2
      } else {
        newState.ballX = CANVAS_WIDTH / 2
        newState.ballY = CANVAS_HEIGHT / 2
        newState.ballVX = 5
        newState.ballVY = (Math.random() - 0.5) * 6
      }
    } else if (newState.ballX >= CANVAS_WIDTH - BALL_SIZE) {
      newState.score1 += 1
      if (newState.score1 >= winScore) {
        newState.gameOver = true
        newState.winner = 1
      } else {
        newState.ballX = CANVAS_WIDTH / 2
        newState.ballY = CANVAS_HEIGHT / 2
        newState.ballVX = -5
        newState.ballVY = (Math.random() - 0.5) * 6
      }
    }

    setGameState(newState)
  }, [gameMode, difficulty, winScore])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const state = gameStateRef.current

    // Clear canvas
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw center line
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 2
    ctx.setLineDash([10, 10])
    ctx.beginPath()
    ctx.moveTo(CANVAS_WIDTH / 2, 0)
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw scores
    ctx.fillStyle = '#334155'
    ctx.font = 'bold 60px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(state.score1.toString(), CANVAS_WIDTH / 4, 70)
    ctx.fillText(state.score2.toString(), (CANVAS_WIDTH * 3) / 4, 70)

    // Draw paddles
    ctx.fillStyle = '#3b82f6'
    ctx.fillRect(20, state.paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT)

    ctx.fillStyle = '#ef4444'
    ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH - 20, state.paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT)

    // Draw ball
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(state.ballX + BALL_SIZE / 2, state.ballY + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2)
    ctx.fill()

    // Draw ball trail
    ctx.globalAlpha = 0.3
    ctx.beginPath()
    ctx.arc(state.ballX - state.ballVX + BALL_SIZE / 2, state.ballY - state.ballVY + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 0.15
    ctx.beginPath()
    ctx.arc(state.ballX - state.ballVX * 2 + BALL_SIZE / 2, state.ballY - state.ballVY * 2 + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key)
      if (['ArrowUp', 'ArrowDown', 'w', 's', 'W', 'S'].includes(e.key)) {
        e.preventDefault()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    let lastTime = 0
    const fps = 60
    const frameTime = 1000 / fps

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameTime) {
        if (isPlaying && !gameState.gameOver) {
          gameLoop()
        }
        draw()
        lastTime = currentTime
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, gameState.gameOver, gameLoop, draw])

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={gameState.gameOver}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                isPlaying ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'
              } disabled:opacity-50`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={startNewGame}
              className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              New Game
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value as 'ai' | '2player')}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="ai">vs AI</option>
              <option value="2player">2 Player</option>
            </select>

            {gameMode === 'ai' && (
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            )}

            <select
              value={winScore}
              onChange={(e) => setWinScore(Number(e.target.value))}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value={3}>First to 3</option>
              <option value={5}>First to 5</option>
              <option value={10}>First to 10</option>
            </select>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full max-w-[800px] mx-auto rounded-xl border border-white/10"
            style={{ aspectRatio: '2/1' }}
          />

          {/* Game Over Overlay */}
          {gameState.gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
              <div className="text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-3xl font-bold text-white mb-2">
                  {gameState.winner === 1 ? 'Player 1' : gameMode === 'ai' ? 'AI' : 'Player 2'} Wins!
                </h3>
                <p className="text-white/70 mb-4">
                  Final Score: {gameState.score1} - {gameState.score2}
                </p>
                <button
                  onClick={startNewGame}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-5 h-5" />
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2">Player 1 (Left)</h4>
            <p className="text-white/70 text-sm">
              W - Move Up | S - Move Down
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-red-400 font-medium mb-2">
              {gameMode === 'ai' ? 'AI (Right)' : 'Player 2 (Right)'}
            </h4>
            <p className="text-white/70 text-sm">
              {gameMode === 'ai' ? 'Controlled by computer' : '↑ - Move Up | ↓ - Move Down'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

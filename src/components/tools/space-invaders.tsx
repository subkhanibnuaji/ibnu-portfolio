'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Trophy, Heart, Zap } from 'lucide-react'

interface Invader {
  x: number
  y: number
  alive: boolean
  type: number
}

interface Bullet {
  x: number
  y: number
  isPlayer: boolean
}

interface GameState {
  player: { x: number; y: number }
  invaders: Invader[]
  bullets: Bullet[]
  score: number
  lives: number
  level: number
  gameOver: boolean
  victory: boolean
  invaderDirection: 1 | -1
  invaderSpeed: number
}

export function SpaceInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [highScore, setHighScore] = useState(0)
  const [gameState, setGameState] = useState<GameState>({
    player: { x: 400, y: 550 },
    invaders: [],
    bullets: [],
    score: 0,
    lives: 3,
    level: 1,
    gameOver: false,
    victory: false,
    invaderDirection: 1,
    invaderSpeed: 1
  })

  const gameStateRef = useRef(gameState)
  const keysPressed = useRef<Set<string>>(new Set())
  const lastShot = useRef(0)
  const animationRef = useRef<number>()
  const lastInvaderShot = useRef(0)

  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 600
  const PLAYER_WIDTH = 50
  const PLAYER_HEIGHT = 30
  const INVADER_WIDTH = 40
  const INVADER_HEIGHT = 30
  const BULLET_WIDTH = 4
  const BULLET_HEIGHT = 15
  const PLAYER_SPEED = 8
  const BULLET_SPEED = 10
  const SHOT_COOLDOWN = 300

  useEffect(() => {
    const saved = localStorage.getItem('space-invaders-high-score')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  const createInvaders = useCallback((level: number): Invader[] => {
    const invaders: Invader[] = []
    const rows = Math.min(3 + Math.floor(level / 2), 5)
    const cols = Math.min(8 + level, 11)

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        invaders.push({
          x: 100 + col * (INVADER_WIDTH + 20),
          y: 60 + row * (INVADER_HEIGHT + 20),
          alive: true,
          type: row % 3
        })
      }
    }
    return invaders
  }, [])

  const startGame = useCallback(() => {
    const newState: GameState = {
      player: { x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2, y: CANVAS_HEIGHT - 50 },
      invaders: createInvaders(1),
      bullets: [],
      score: 0,
      lives: 3,
      level: 1,
      gameOver: false,
      victory: false,
      invaderDirection: 1,
      invaderSpeed: 1
    }
    setGameState(newState)
    setIsPlaying(true)
  }, [createInvaders])

  const nextLevel = useCallback(() => {
    const newLevel = gameStateRef.current.level + 1
    setGameState(prev => ({
      ...prev,
      invaders: createInvaders(newLevel),
      bullets: [],
      level: newLevel,
      invaderDirection: 1,
      invaderSpeed: 1 + newLevel * 0.3
    }))
  }, [createInvaders])

  const gameLoop = useCallback(() => {
    const state = gameStateRef.current
    if (state.gameOver || state.victory) return

    let newState = { ...state }

    // Player movement
    if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a')) {
      newState.player.x = Math.max(0, state.player.x - PLAYER_SPEED)
    }
    if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d')) {
      newState.player.x = Math.min(CANVAS_WIDTH - PLAYER_WIDTH, state.player.x + PLAYER_SPEED)
    }

    // Player shooting
    if (keysPressed.current.has(' ') || keysPressed.current.has('ArrowUp')) {
      const now = Date.now()
      if (now - lastShot.current > SHOT_COOLDOWN) {
        newState.bullets.push({
          x: state.player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
          y: state.player.y - BULLET_HEIGHT,
          isPlayer: true
        })
        lastShot.current = now
      }
    }

    // Move bullets
    newState.bullets = newState.bullets.filter(bullet => {
      if (bullet.isPlayer) {
        bullet.y -= BULLET_SPEED
        return bullet.y > -BULLET_HEIGHT
      } else {
        bullet.y += BULLET_SPEED * 0.7
        return bullet.y < CANVAS_HEIGHT
      }
    })

    // Move invaders
    let shouldDescend = false
    const aliveInvaders = state.invaders.filter(inv => inv.alive)

    aliveInvaders.forEach(invader => {
      invader.x += state.invaderDirection * state.invaderSpeed
      if (invader.x <= 0 || invader.x >= CANVAS_WIDTH - INVADER_WIDTH) {
        shouldDescend = true
      }
    })

    if (shouldDescend) {
      newState.invaderDirection = (-state.invaderDirection) as 1 | -1
      aliveInvaders.forEach(invader => {
        invader.y += 20
        if (invader.y > CANVAS_HEIGHT - 100) {
          newState.gameOver = true
        }
      })
    }

    // Invader shooting
    const now = Date.now()
    if (now - lastInvaderShot.current > 1500 - state.level * 100) {
      if (aliveInvaders.length > 0) {
        const shooter = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)]
        newState.bullets.push({
          x: shooter.x + INVADER_WIDTH / 2 - BULLET_WIDTH / 2,
          y: shooter.y + INVADER_HEIGHT,
          isPlayer: false
        })
        lastInvaderShot.current = now
      }
    }

    // Check bullet collisions
    newState.bullets = newState.bullets.filter(bullet => {
      if (bullet.isPlayer) {
        // Check collision with invaders
        for (let invader of newState.invaders) {
          if (invader.alive &&
              bullet.x < invader.x + INVADER_WIDTH &&
              bullet.x + BULLET_WIDTH > invader.x &&
              bullet.y < invader.y + INVADER_HEIGHT &&
              bullet.y + BULLET_HEIGHT > invader.y) {
            invader.alive = false
            newState.score += (3 - invader.type) * 10 + 10
            return false
          }
        }
      } else {
        // Check collision with player
        if (bullet.x < newState.player.x + PLAYER_WIDTH &&
            bullet.x + BULLET_WIDTH > newState.player.x &&
            bullet.y < newState.player.y + PLAYER_HEIGHT &&
            bullet.y + BULLET_HEIGHT > newState.player.y) {
          newState.lives--
          if (newState.lives <= 0) {
            newState.gameOver = true
          }
          return false
        }
      }
      return true
    })

    // Check victory
    if (newState.invaders.every(inv => !inv.alive)) {
      nextLevel()
      return
    }

    // Update high score
    if (newState.score > highScore) {
      setHighScore(newState.score)
      localStorage.setItem('space-invaders-high-score', newState.score.toString())
    }

    setGameState(newState)
  }, [highScore, nextLevel])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const state = gameStateRef.current

    // Clear
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw stars
    ctx.fillStyle = '#ffffff'
    for (let i = 0; i < 50; i++) {
      const x = (i * 37) % CANVAS_WIDTH
      const y = (i * 23) % CANVAS_HEIGHT
      ctx.fillRect(x, y, 1, 1)
    }

    // Draw player
    ctx.fillStyle = '#22c55e'
    ctx.beginPath()
    ctx.moveTo(state.player.x + PLAYER_WIDTH / 2, state.player.y)
    ctx.lineTo(state.player.x, state.player.y + PLAYER_HEIGHT)
    ctx.lineTo(state.player.x + PLAYER_WIDTH, state.player.y + PLAYER_HEIGHT)
    ctx.closePath()
    ctx.fill()

    // Draw invaders
    state.invaders.filter(inv => inv.alive).forEach(invader => {
      const colors = ['#ef4444', '#f97316', '#eab308']
      ctx.fillStyle = colors[invader.type]

      // Simple invader shape
      ctx.fillRect(invader.x + 5, invader.y, INVADER_WIDTH - 10, 10)
      ctx.fillRect(invader.x, invader.y + 10, INVADER_WIDTH, 10)
      ctx.fillRect(invader.x + 5, invader.y + 20, 10, 10)
      ctx.fillRect(invader.x + INVADER_WIDTH - 15, invader.y + 20, 10, 10)
    })

    // Draw bullets
    state.bullets.forEach(bullet => {
      ctx.fillStyle = bullet.isPlayer ? '#22c55e' : '#ef4444'
      ctx.fillRect(bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT)
    })

    // Draw UI
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 20px monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`Score: ${state.score}`, 20, 30)
    ctx.fillText(`Level: ${state.level}`, 200, 30)
    ctx.textAlign = 'right'
    ctx.fillText(`High: ${highScore}`, CANVAS_WIDTH - 20, 30)

    // Draw lives
    for (let i = 0; i < state.lives; i++) {
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(CANVAS_WIDTH - 150 + i * 25, 25, 8, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [highScore])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key)
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
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
            {!isPlaying || gameState.gameOver ? (
              <button
                onClick={startGame}
                className="px-4 py-2 rounded-lg bg-green-500 text-white flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                {gameState.gameOver ? 'Play Again' : 'Start Game'}
              </button>
            ) : (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-lg bg-yellow-500 text-black flex items-center gap-2"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
            )}

            <button
              onClick={startGame}
              className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span>High Score: {highScore}</span>
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full max-w-[800px] mx-auto rounded-xl border border-white/10"
            style={{ aspectRatio: '4/3' }}
          />

          {/* Game Over Overlay */}
          {gameState.gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
              <div className="text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-3xl font-bold text-white mb-2">Game Over!</h3>
                <p className="text-white/70 mb-2">Final Score: {gameState.score}</p>
                <p className="text-white/70 mb-4">Level: {gameState.level}</p>
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-5 h-5" />
                  Play Again
                </button>
              </div>
            </div>
          )}

          {/* Start Screen */}
          {!isPlaying && !gameState.gameOver && gameState.score === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
              <div className="text-center">
                <Zap className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <h3 className="text-3xl font-bold text-white mb-4">Space Invaders</h3>
                <p className="text-white/70 mb-6">Defend Earth from the alien invasion!</p>
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 mx-auto"
                >
                  <Play className="w-5 h-5" />
                  Start Game
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-white/70 text-sm">Move Left</div>
            <div className="text-white font-medium">← or A</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-white/70 text-sm">Move Right</div>
            <div className="text-white font-medium">→ or D</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-white/70 text-sm">Shoot</div>
            <div className="text-white font-medium">Space or ↑</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

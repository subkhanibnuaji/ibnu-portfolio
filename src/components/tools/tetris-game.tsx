'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, Play, Pause, RotateCcw, Trophy, ArrowDown, ArrowLeft, ArrowRight, RotateCw } from 'lucide-react'

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const CELL_SIZE = 25

type Board = (string | null)[][]
type Piece = { shape: number[][]; color: string; x: number; y: number }

const PIECES = [
  { shape: [[1, 1, 1, 1]], color: '#00f5ff' }, // I
  { shape: [[1, 1], [1, 1]], color: '#ffd700' }, // O
  { shape: [[0, 1, 0], [1, 1, 1]], color: '#a855f7' }, // T
  { shape: [[0, 1, 1], [1, 1, 0]], color: '#22c55e' }, // S
  { shape: [[1, 1, 0], [0, 1, 1]], color: '#ef4444' }, // Z
  { shape: [[1, 0, 0], [1, 1, 1]], color: '#3b82f6' }, // J
  { shape: [[0, 0, 1], [1, 1, 1]], color: '#f97316' }, // L
]

const createEmptyBoard = (): Board =>
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null))

const getRandomPiece = (): Piece => {
  const piece = PIECES[Math.floor(Math.random() * PIECES.length)]
  return {
    shape: piece.shape.map(row => [...row]),
    color: piece.color,
    x: Math.floor((BOARD_WIDTH - piece.shape[0].length) / 2),
    y: 0
  }
}

const rotatePiece = (shape: number[][]): number[][] => {
  const rows = shape.length
  const cols = shape[0].length
  const rotated: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0))
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c]
    }
  }
  return rotated
}

export function TetrisGame() {
  const [board, setBoard] = useState<Board>(createEmptyBoard)
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null)
  const [nextPiece, setNextPiece] = useState<Piece | null>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [highScore, setHighScore] = useState(0)

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('tetrisHighScore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  const checkCollision = useCallback((piece: Piece, board: Board, offsetX = 0, offsetY = 0): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + offsetX
          const newY = piece.y + y + offsetY
          if (
            newX < 0 || newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && board[newY][newX])
          ) {
            return true
          }
        }
      }
    }
    return false
  }, [])

  const mergePieceToBoard = useCallback((piece: Piece, board: Board): Board => {
    const newBoard = board.map(row => [...row])
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.y + y
          const boardX = piece.x + x
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = piece.color
          }
        }
      }
    }
    return newBoard
  }, [])

  const clearLines = useCallback((board: Board): { newBoard: Board; clearedLines: number } => {
    const newBoard = board.filter(row => row.some(cell => cell === null))
    const clearedLines = BOARD_HEIGHT - newBoard.length
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null))
    }
    return { newBoard, clearedLines }
  }, [])

  const moveDown = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return

    if (!checkCollision(currentPiece, board, 0, 1)) {
      setCurrentPiece(prev => prev ? { ...prev, y: prev.y + 1 } : null)
    } else {
      // Lock piece
      const newBoard = mergePieceToBoard(currentPiece, board)
      const { newBoard: clearedBoard, clearedLines } = clearLines(newBoard)

      setBoard(clearedBoard)
      if (clearedLines > 0) {
        const points = [0, 100, 300, 500, 800][clearedLines] * level
        setScore(prev => prev + points)
        setLines(prev => {
          const newLines = prev + clearedLines
          if (newLines >= level * 10) {
            setLevel(l => l + 1)
          }
          return newLines
        })
      }

      // Spawn next piece
      if (nextPiece && checkCollision(nextPiece, clearedBoard)) {
        setGameOver(true)
        setIsPlaying(false)
        if (score > highScore) {
          setHighScore(score)
          localStorage.setItem('tetrisHighScore', score.toString())
        }
      } else {
        setCurrentPiece(nextPiece)
        setNextPiece(getRandomPiece())
      }
    }
  }, [currentPiece, board, gameOver, isPaused, checkCollision, mergePieceToBoard, clearLines, nextPiece, level, score, highScore])

  const moveLeft = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return
    if (!checkCollision(currentPiece, board, -1, 0)) {
      setCurrentPiece(prev => prev ? { ...prev, x: prev.x - 1 } : null)
    }
  }, [currentPiece, board, gameOver, isPaused, checkCollision])

  const moveRight = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return
    if (!checkCollision(currentPiece, board, 1, 0)) {
      setCurrentPiece(prev => prev ? { ...prev, x: prev.x + 1 } : null)
    }
  }, [currentPiece, board, gameOver, isPaused, checkCollision])

  const rotate = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return
    const rotated = rotatePiece(currentPiece.shape)
    const newPiece = { ...currentPiece, shape: rotated }
    if (!checkCollision(newPiece, board)) {
      setCurrentPiece(newPiece)
    }
  }, [currentPiece, board, gameOver, isPaused, checkCollision])

  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return
    let dropY = 0
    while (!checkCollision(currentPiece, board, 0, dropY + 1)) {
      dropY++
    }
    setCurrentPiece(prev => prev ? { ...prev, y: prev.y + dropY } : null)
  }, [currentPiece, board, gameOver, isPaused, checkCollision])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          moveLeft()
          break
        case 'ArrowRight':
          e.preventDefault()
          moveRight()
          break
        case 'ArrowDown':
          e.preventDefault()
          moveDown()
          break
        case 'ArrowUp':
          e.preventDefault()
          rotate()
          break
        case ' ':
          e.preventDefault()
          hardDrop()
          break
        case 'p':
        case 'P':
          setIsPaused(prev => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, gameOver, moveLeft, moveRight, moveDown, rotate, hardDrop])

  useEffect(() => {
    if (isPlaying && !gameOver && !isPaused) {
      const speed = Math.max(100, 1000 - (level - 1) * 100)
      gameLoopRef.current = setInterval(moveDown, speed)
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [isPlaying, gameOver, isPaused, level, moveDown])

  const startGame = () => {
    setBoard(createEmptyBoard())
    setCurrentPiece(getRandomPiece())
    setNextPiece(getRandomPiece())
    setScore(0)
    setLevel(1)
    setLines(0)
    setGameOver(false)
    setIsPaused(false)
    setIsPlaying(true)
  }

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row])

    // Add current piece to display
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y
            const boardX = currentPiece.x + x
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color
            }
          }
        }
      }
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className="border border-border/30"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: cell || 'transparent',
              boxShadow: cell ? 'inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.3)' : 'none'
            }}
          />
        ))}
      </div>
    ))
  }

  const renderNextPiece = () => {
    if (!nextPiece) return null
    return (
      <div className="flex flex-col items-center">
        {nextPiece.shape.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <div
                key={x}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: cell ? nextPiece.color : 'transparent',
                  border: cell ? '1px solid rgba(255,255,255,0.2)' : 'none'
                }}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-500 text-sm font-medium mb-4">
          <Gamepad2 className="w-4 h-4" />
          Classic Game
        </div>
        <h2 className="text-2xl font-bold">Tetris</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 justify-center items-start">
        {/* Game Board */}
        <div className="rounded-xl border-2 border-border bg-background/50 p-2 overflow-hidden">
          {renderBoard()}
        </div>

        {/* Side Panel */}
        <div className="space-y-4 min-w-[180px]">
          {/* Score */}
          <div className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Score</span>
            </div>
            <p className="text-3xl font-bold">{score.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">High: {highScore.toLocaleString()}</p>
          </div>

          {/* Stats */}
          <div className="p-4 rounded-xl border border-border bg-card grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Level</p>
              <p className="text-2xl font-bold">{level}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lines</p>
              <p className="text-2xl font-bold">{lines}</p>
            </div>
          </div>

          {/* Next Piece */}
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-sm font-medium mb-3">Next</p>
            <div className="flex justify-center p-2 bg-muted rounded-lg min-h-[80px] items-center">
              {renderNextPiece()}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-2">
            {!isPlaying || gameOver ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="w-full py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 inline-flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                {gameOver ? 'Play Again' : 'Start Game'}
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPaused(p => !p)}
                className="w-full py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 inline-flex items-center justify-center gap-2"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </motion.button>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="grid grid-cols-3 gap-2 lg:hidden">
            <button
              onClick={moveLeft}
              className="p-3 rounded-lg bg-muted hover:bg-muted/80"
            >
              <ArrowLeft className="w-5 h-5 mx-auto" />
            </button>
            <button
              onClick={rotate}
              className="p-3 rounded-lg bg-muted hover:bg-muted/80"
            >
              <RotateCw className="w-5 h-5 mx-auto" />
            </button>
            <button
              onClick={moveRight}
              className="p-3 rounded-lg bg-muted hover:bg-muted/80"
            >
              <ArrowRight className="w-5 h-5 mx-auto" />
            </button>
            <div />
            <button
              onClick={hardDrop}
              className="p-3 rounded-lg bg-primary text-primary-foreground"
            >
              <ArrowDown className="w-5 h-5 mx-auto" />
            </button>
            <div />
          </div>
        </div>
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={startGame}
        >
          <div className="bg-card p-8 rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-2">Game Over!</h3>
            <p className="text-muted-foreground mb-4">Score: {score.toLocaleString()}</p>
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg">
              Play Again
            </button>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground text-center">
        <p className="hidden lg:block">Arrow keys to move, Up to rotate, Space for hard drop, P to pause.</p>
        <p className="lg:hidden">Use the on-screen buttons to play.</p>
      </div>
    </div>
  )
}

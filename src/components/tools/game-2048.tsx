'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'

type Grid = number[][]

const CELL_COLORS: Record<number, { bg: string; text: string }> = {
  0: { bg: 'bg-muted/30', text: '' },
  2: { bg: 'bg-gray-200 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200' },
  4: { bg: 'bg-gray-300 dark:bg-gray-600', text: 'text-gray-800 dark:text-gray-200' },
  8: { bg: 'bg-orange-300', text: 'text-white' },
  16: { bg: 'bg-orange-400', text: 'text-white' },
  32: { bg: 'bg-orange-500', text: 'text-white' },
  64: { bg: 'bg-orange-600', text: 'text-white' },
  128: { bg: 'bg-yellow-400', text: 'text-white' },
  256: { bg: 'bg-yellow-500', text: 'text-white' },
  512: { bg: 'bg-yellow-600', text: 'text-white' },
  1024: { bg: 'bg-yellow-700', text: 'text-white' },
  2048: { bg: 'bg-yellow-500', text: 'text-white' },
}

const createEmptyGrid = (): Grid => Array(4).fill(null).map(() => Array(4).fill(0))

const addRandomTile = (grid: Grid): Grid => {
  const newGrid = grid.map(row => [...row])
  const emptyCells: [number, number][] = []

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (newGrid[i][j] === 0) emptyCells.push([i, j])
    }
  }

  if (emptyCells.length > 0) {
    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    newGrid[row][col] = Math.random() < 0.9 ? 2 : 4
  }

  return newGrid
}

const rotateGrid = (grid: Grid): Grid => {
  const newGrid = createEmptyGrid()
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newGrid[i][j] = grid[3 - j][i]
    }
  }
  return newGrid
}

const slideRow = (row: number[]): { newRow: number[]; score: number } => {
  let arr = row.filter(x => x !== 0)
  let score = 0

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2
      score += arr[i]
      arr.splice(i + 1, 1)
    }
  }

  while (arr.length < 4) arr.push(0)
  return { newRow: arr, score }
}

const moveLeft = (grid: Grid): { newGrid: Grid; score: number; moved: boolean } => {
  let totalScore = 0
  let moved = false
  const newGrid = grid.map(row => {
    const { newRow, score } = slideRow([...row])
    totalScore += score
    if (JSON.stringify(row) !== JSON.stringify(newRow)) moved = true
    return newRow
  })
  return { newGrid, score: totalScore, moved }
}

const move = (grid: Grid, direction: 'up' | 'down' | 'left' | 'right'): { newGrid: Grid; score: number; moved: boolean } => {
  let rotated = grid
  const rotations = { up: 1, right: 2, down: 3, left: 0 }

  for (let i = 0; i < rotations[direction]; i++) {
    rotated = rotateGrid(rotated)
  }

  const { newGrid, score, moved } = moveLeft(rotated)

  let result = newGrid
  for (let i = 0; i < (4 - rotations[direction]) % 4; i++) {
    result = rotateGrid(result)
  }

  return { newGrid: result, score, moved }
}

const checkGameOver = (grid: Grid): boolean => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) return false
      if (i < 3 && grid[i][j] === grid[i + 1][j]) return false
      if (j < 3 && grid[i][j] === grid[i][j + 1]) return false
    }
  }
  return true
}

const checkWin = (grid: Grid): boolean => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] >= 2048) return true
    }
  }
  return false
}

export function Game2048() {
  const [grid, setGrid] = useState<Grid>(() => addRandomTile(addRandomTile(createEmptyGrid())))
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [keepPlaying, setKeepPlaying] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('2048BestScore')
    if (saved) setBestScore(parseInt(saved))
  }, [])

  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver && !keepPlaying) return

    const { newGrid, score: moveScore, moved } = move(grid, direction)

    if (moved) {
      const gridWithNewTile = addRandomTile(newGrid)
      setGrid(gridWithNewTile)
      setScore(s => {
        const newScore = s + moveScore
        if (newScore > bestScore) {
          setBestScore(newScore)
          localStorage.setItem('2048BestScore', newScore.toString())
        }
        return newScore
      })

      if (!keepPlaying && checkWin(gridWithNewTile)) {
        setWon(true)
      }

      if (checkGameOver(gridWithNewTile)) {
        setGameOver(true)
      }
    }
  }, [grid, gameOver, keepPlaying, bestScore])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        const direction = e.key.replace('Arrow', '').toLowerCase() as 'up' | 'down' | 'left' | 'right'
        handleMove(direction)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleMove])

  const resetGame = () => {
    setGrid(addRandomTile(addRandomTile(createEmptyGrid())))
    setScore(0)
    setGameOver(false)
    setWon(false)
    setKeepPlaying(false)
  }

  const continueGame = () => {
    setWon(false)
    setKeepPlaying(true)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium mb-4">
          <Gamepad2 className="w-4 h-4" />
          Puzzle Game
        </div>
        <h2 className="text-2xl font-bold">2048</h2>
        <p className="text-muted-foreground mt-2">
          Combine tiles to reach 2048!
        </p>
      </div>

      {/* Scores */}
      <div className="flex justify-center gap-4 mb-6">
        <div className="px-6 py-3 rounded-xl bg-card border border-border text-center min-w-[100px]">
          <p className="text-xs text-muted-foreground uppercase">Score</p>
          <p className="text-2xl font-bold">{score}</p>
        </div>
        <div className="px-6 py-3 rounded-xl bg-card border border-border text-center min-w-[100px]">
          <p className="text-xs text-muted-foreground uppercase">Best</p>
          <p className="text-2xl font-bold">{bestScore}</p>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative p-2 rounded-xl bg-muted/50 mb-6">
        <div className="grid grid-cols-4 gap-2">
          {grid.flat().map((value, index) => {
            const colors = CELL_COLORS[value] || { bg: 'bg-yellow-600', text: 'text-white' }
            return (
              <motion.div
                key={index}
                initial={{ scale: value ? 0.8 : 1 }}
                animate={{ scale: 1 }}
                className={`
                  aspect-square rounded-lg flex items-center justify-center
                  font-bold text-xl sm:text-2xl
                  ${colors.bg} ${colors.text}
                `}
              >
                {value > 0 && value}
              </motion.div>
            )
          })}
        </div>

        {/* Win Overlay */}
        <AnimatePresence>
          {won && !keepPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-yellow-500/90 rounded-xl flex flex-col items-center justify-center"
            >
              <Trophy className="w-16 h-16 text-white mb-4" />
              <h3 className="text-3xl font-bold text-white mb-4">You Win!</h3>
              <div className="flex gap-2">
                <button
                  onClick={continueGame}
                  className="px-4 py-2 bg-white text-yellow-600 rounded-lg font-medium"
                >
                  Keep Playing
                </button>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium"
                >
                  New Game
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameOver && !won && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 rounded-xl flex flex-col items-center justify-center"
            >
              <h3 className="text-3xl font-bold text-white mb-4">Game Over!</h3>
              <p className="text-white/70 mb-4">Score: {score}</p>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 mb-6">
        <button
          onClick={() => handleMove('up')}
          className="p-3 bg-muted rounded-lg hover:bg-muted/80"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => handleMove('left')}
            className="p-3 bg-muted rounded-lg hover:bg-muted/80"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleMove('down')}
            className="p-3 bg-muted rounded-lg hover:bg-muted/80"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleMove('right')}
            className="p-3 bg-muted rounded-lg hover:bg-muted/80"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-center">
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          New Game
        </button>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground text-center">
        <p>Use arrow keys or buttons to move tiles. Combine same numbers to reach 2048!</p>
      </div>
    </div>
  )
}

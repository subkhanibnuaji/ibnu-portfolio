'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Flag, Bomb, Trophy, Clock, Smile, Frown } from 'lucide-react'

type Difficulty = 'easy' | 'medium' | 'hard'

interface Cell {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

const DIFFICULTIES = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 30 },
  hard: { rows: 16, cols: 16, mines: 60 },
}

export function Minesweeper() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [board, setBoard] = useState<Cell[][]>([])
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle')
  const [flagCount, setFlagCount] = useState(0)
  const [timer, setTimer] = useState(0)
  const [bestTimes, setBestTimes] = useState<Record<Difficulty, number | null>>({
    easy: null,
    medium: null,
    hard: null,
  })

  useEffect(() => {
    const saved = localStorage.getItem('minesweeperBestTimes')
    if (saved) setBestTimes(JSON.parse(saved))
  }, [])

  const initBoard = useCallback(() => {
    const { rows, cols, mines } = DIFFICULTIES[difficulty]
    const newBoard: Cell[][] = Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }))
    )

    // Place mines randomly
    let minesPlaced = 0
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows)
      const col = Math.floor(Math.random() * cols)
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true
        minesPlaced++
      }
    }

    // Calculate neighbor mines
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const r = row + dr
              const c = col + dc
              if (r >= 0 && r < rows && c >= 0 && c < cols && newBoard[r][c].isMine) {
                count++
              }
            }
          }
          newBoard[row][col].neighborMines = count
        }
      }
    }

    setBoard(newBoard)
    setGameState('idle')
    setFlagCount(0)
    setTimer(0)
  }, [difficulty])

  useEffect(() => {
    initBoard()
  }, [initBoard])

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return

    const interval = setInterval(() => {
      setTimer(t => t + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState])

  const revealCell = (board: Cell[][], row: number, col: number) => {
    const { rows, cols } = DIFFICULTIES[difficulty]
    if (row < 0 || row >= rows || col < 0 || col >= cols) return
    if (board[row][col].isRevealed || board[row][col].isFlagged) return

    board[row][col].isRevealed = true

    if (board[row][col].neighborMines === 0 && !board[row][col].isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          revealCell(board, row + dr, col + dc)
        }
      }
    }
  }

  const handleCellClick = (row: number, col: number) => {
    if (gameState === 'won' || gameState === 'lost') return
    if (board[row][col].isFlagged) return

    if (gameState === 'idle') {
      setGameState('playing')
    }

    const newBoard = board.map(r => r.map(c => ({ ...c })))

    if (newBoard[row][col].isMine) {
      // Reveal all mines
      newBoard.forEach(r => r.forEach(c => {
        if (c.isMine) c.isRevealed = true
      }))
      setBoard(newBoard)
      setGameState('lost')
      return
    }

    revealCell(newBoard, row, col)
    setBoard(newBoard)

    // Check win
    const { mines } = DIFFICULTIES[difficulty]
    const unrevealedCount = newBoard.flat().filter(c => !c.isRevealed).length
    if (unrevealedCount === mines) {
      setGameState('won')
      const newBestTimes = { ...bestTimes }
      if (!newBestTimes[difficulty] || timer < newBestTimes[difficulty]!) {
        newBestTimes[difficulty] = timer
        setBestTimes(newBestTimes)
        localStorage.setItem('minesweeperBestTimes', JSON.stringify(newBestTimes))
      }
    }
  }

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault()
    if (gameState === 'won' || gameState === 'lost') return
    if (board[row][col].isRevealed) return

    const newBoard = board.map(r => r.map(c => ({ ...c })))
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged
    setBoard(newBoard)
    setFlagCount(newBoard.flat().filter(c => c.isFlagged).length)
  }

  const getCellContent = (cell: Cell) => {
    if (cell.isFlagged) {
      return <Flag className="w-4 h-4 text-red-500" />
    }
    if (!cell.isRevealed) {
      return null
    }
    if (cell.isMine) {
      return <Bomb className="w-4 h-4 text-red-500" />
    }
    if (cell.neighborMines > 0) {
      const colors: Record<number, string> = {
        1: 'text-blue-500',
        2: 'text-green-500',
        3: 'text-red-500',
        4: 'text-purple-500',
        5: 'text-yellow-600',
        6: 'text-cyan-500',
        7: 'text-gray-700',
        8: 'text-gray-500',
      }
      return <span className={`font-bold ${colors[cell.neighborMines]}`}>{cell.neighborMines}</span>
    }
    return null
  }

  const getCellStyle = (cell: Cell) => {
    if (!cell.isRevealed) {
      return 'bg-muted hover:bg-muted/80 border-t-2 border-l-2 border-white/20 border-b-2 border-r-2 border-black/20'
    }
    if (cell.isMine) {
      return 'bg-red-200 dark:bg-red-900/50'
    }
    return 'bg-gray-200 dark:bg-gray-700'
  }

  const { mines, cols } = DIFFICULTIES[difficulty]
  const cellSize = difficulty === 'hard' ? 'w-6 h-6' : 'w-8 h-8'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Minesweeper</h1>
        <p className="text-muted-foreground">Clear the board without hitting any mines!</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1 rounded-lg text-sm capitalize transition-colors ${
                  difficulty === d ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <button
            onClick={initBoard}
            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            New Game
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="flex items-center gap-2">
            <Bomb className="w-5 h-5 text-muted-foreground" />
            <span className="font-mono">{mines - flagCount}</span>
          </div>
          <div className="text-2xl">
            {gameState === 'won' ? (
              <Trophy className="w-8 h-8 text-yellow-500" />
            ) : gameState === 'lost' ? (
              <Frown className="w-8 h-8 text-red-500" />
            ) : (
              <Smile className="w-8 h-8 text-yellow-500" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="font-mono">{timer.toString().padStart(3, '0')}</span>
          </div>
        </div>

        {/* Best Times */}
        <div className="flex justify-center gap-4 mb-4 text-sm">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
            <div key={d} className="flex items-center gap-1">
              <span className="capitalize text-muted-foreground">{d}:</span>
              <span className={d === difficulty ? 'text-blue-500 font-semibold' : ''}>
                {bestTimes[d] ? `${bestTimes[d]}s` : '--'}
              </span>
            </div>
          ))}
        </div>

        {/* Game Board */}
        <div className="flex justify-center overflow-x-auto pb-4">
          <div
            className="inline-grid gap-[1px] bg-gray-400 dark:bg-gray-600 p-1"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                  className={`${cellSize} flex items-center justify-center text-sm transition-colors ${getCellStyle(cell)}`}
                >
                  {getCellContent(cell)}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Game Over Messages */}
        {gameState === 'won' && (
          <div className="text-center mt-4">
            <p className="text-xl font-bold text-green-500">You Won!</p>
            <p className="text-muted-foreground">Time: {timer} seconds</p>
          </div>
        )}
        {gameState === 'lost' && (
          <div className="text-center mt-4">
            <p className="text-xl font-bold text-red-500">Game Over!</p>
            <p className="text-muted-foreground">Better luck next time!</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">How to Play</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Left-click to reveal a cell</li>
            <li>Right-click to place/remove a flag</li>
            <li>Numbers show how many mines are adjacent</li>
            <li>Clear all non-mine cells to win!</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

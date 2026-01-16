'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Lightbulb, CheckCircle, XCircle, Trophy, Clock } from 'lucide-react'

type Difficulty = 'easy' | 'medium' | 'hard'

interface Cell {
  value: number | null
  isOriginal: boolean
  isError: boolean
  notes: number[]
}

export function SudokuGame() {
  const [board, setBoard] = useState<Cell[][]>([])
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won'>('idle')
  const [timer, setTimer] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [solution, setSolution] = useState<number[][]>([])
  const [noteMode, setNoteMode] = useState(false)
  const [bestTimes, setBestTimes] = useState<Record<Difficulty, number | null>>({
    easy: null,
    medium: null,
    hard: null,
  })

  useEffect(() => {
    const saved = localStorage.getItem('sudokuBestTimes')
    if (saved) setBestTimes(JSON.parse(saved))
  }, [])

  const generateSudoku = useCallback(() => {
    // Generate a solved sudoku using backtracking
    const grid: number[][] = Array(9).fill(null).map(() => Array(9).fill(0))

    const isValid = (grid: number[][], row: number, col: number, num: number): boolean => {
      // Check row
      for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num) return false
      }
      // Check column
      for (let x = 0; x < 9; x++) {
        if (grid[x][col] === num) return false
      }
      // Check 3x3 box
      const startRow = row - (row % 3)
      const startCol = col - (col % 3)
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (grid[i + startRow][j + startCol] === num) return false
        }
      }
      return true
    }

    const solveSudoku = (grid: number[][]): boolean => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === 0) {
            const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5)
            for (const num of nums) {
              if (isValid(grid, row, col, num)) {
                grid[row][col] = num
                if (solveSudoku(grid)) return true
                grid[row][col] = 0
              }
            }
            return false
          }
        }
      }
      return true
    }

    solveSudoku(grid)
    const solvedGrid = grid.map(row => [...row])

    // Remove cells based on difficulty
    const cellsToRemove = {
      easy: 35,
      medium: 45,
      hard: 55,
    }[difficulty]

    const positions = []
    for (let i = 0; i < 81; i++) positions.push(i)
    positions.sort(() => Math.random() - 0.5)

    for (let i = 0; i < cellsToRemove; i++) {
      const pos = positions[i]
      const row = Math.floor(pos / 9)
      const col = pos % 9
      grid[row][col] = 0
    }

    return { puzzle: grid, solution: solvedGrid }
  }, [difficulty])

  const startGame = useCallback(() => {
    const { puzzle, solution: sol } = generateSudoku()
    const newBoard: Cell[][] = puzzle.map(row =>
      row.map(value => ({
        value: value || null,
        isOriginal: value !== 0,
        isError: false,
        notes: [],
      }))
    )
    setBoard(newBoard)
    setSolution(sol)
    setSelectedCell(null)
    setTimer(0)
    setHintsUsed(0)
    setGameState('playing')
  }, [generateSudoku])

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return

    const interval = setInterval(() => {
      setTimer(t => t + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState])

  const handleCellClick = (row: number, col: number) => {
    if (gameState !== 'playing' || board[row][col].isOriginal) return
    setSelectedCell([row, col])
  }

  const handleNumberInput = (num: number) => {
    if (!selectedCell || gameState !== 'playing') return

    const [row, col] = selectedCell
    if (board[row][col].isOriginal) return

    const newBoard = board.map(r => r.map(c => ({ ...c })))

    if (noteMode) {
      const notes = newBoard[row][col].notes
      if (notes.includes(num)) {
        newBoard[row][col].notes = notes.filter(n => n !== num)
      } else {
        newBoard[row][col].notes = [...notes, num].sort()
      }
    } else {
      newBoard[row][col].value = num
      newBoard[row][col].notes = []
      newBoard[row][col].isError = num !== solution[row][col]
    }

    setBoard(newBoard)

    // Check win condition
    const isComplete = newBoard.every((row, i) =>
      row.every((cell, j) => cell.value === solution[i][j])
    )

    if (isComplete) {
      setGameState('won')
      const newBestTimes = { ...bestTimes }
      if (!newBestTimes[difficulty] || timer < newBestTimes[difficulty]!) {
        newBestTimes[difficulty] = timer
        setBestTimes(newBestTimes)
        localStorage.setItem('sudokuBestTimes', JSON.stringify(newBestTimes))
      }
    }
  }

  const handleClear = () => {
    if (!selectedCell || gameState !== 'playing') return

    const [row, col] = selectedCell
    if (board[row][col].isOriginal) return

    const newBoard = board.map(r => r.map(c => ({ ...c })))
    newBoard[row][col].value = null
    newBoard[row][col].notes = []
    newBoard[row][col].isError = false
    setBoard(newBoard)
  }

  const handleHint = () => {
    if (!selectedCell || gameState !== 'playing') return

    const [row, col] = selectedCell
    if (board[row][col].isOriginal || board[row][col].value === solution[row][col]) return

    const newBoard = board.map(r => r.map(c => ({ ...c })))
    newBoard[row][col].value = solution[row][col]
    newBoard[row][col].isError = false
    newBoard[row][col].notes = []
    setBoard(newBoard)
    setHintsUsed(h => h + 1)

    // Check win
    const isComplete = newBoard.every((row, i) =>
      row.every((cell, j) => cell.value === solution[i][j])
    )
    if (isComplete) {
      setGameState('won')
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getCellClasses = (row: number, col: number): string => {
    const cell = board[row]?.[col]
    if (!cell) return ''

    const classes = [
      'w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg font-semibold cursor-pointer transition-all',
      cell.isOriginal ? 'bg-muted text-foreground' : 'bg-card hover:bg-muted/50',
      cell.isError ? 'text-red-500' : cell.isOriginal ? '' : 'text-blue-500',
      selectedCell?.[0] === row && selectedCell?.[1] === col ? 'ring-2 ring-blue-500' : '',
      col % 3 === 2 && col !== 8 ? 'border-r-2 border-foreground/30' : '',
      row % 3 === 2 && row !== 8 ? 'border-b-2 border-foreground/30' : '',
    ]

    return classes.filter(Boolean).join(' ')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Sudoku</h1>
        <p className="text-muted-foreground">Classic number puzzle game</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Game Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="px-3 py-2 bg-muted rounded-lg border"
              disabled={gameState === 'playing'}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <button
              onClick={startGame}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {gameState === 'idle' ? 'Start' : 'New Game'}
            </button>
          </div>

          {gameState === 'playing' && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timer)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lightbulb className="w-4 h-4" />
                <span>{hintsUsed}</span>
              </div>
            </div>
          )}
        </div>

        {/* Best Times */}
        <div className="flex gap-4 mb-6 text-sm">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
            <div key={d} className="flex items-center gap-1">
              <Trophy className={`w-4 h-4 ${d === difficulty ? 'text-yellow-500' : 'text-muted-foreground'}`} />
              <span className="capitalize">{d}:</span>
              <span className="text-muted-foreground">
                {bestTimes[d] ? formatTime(bestTimes[d]!) : '--:--'}
              </span>
            </div>
          ))}
        </div>

        {/* Sudoku Board */}
        {gameState !== 'idle' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="grid grid-cols-9 gap-[1px] bg-foreground/30 p-[1px] rounded-lg">
                {board.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={getCellClasses(rowIndex, colIndex)}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {cell.value ? (
                        cell.value
                      ) : cell.notes.length > 0 ? (
                        <div className="grid grid-cols-3 gap-0 text-[8px] text-muted-foreground">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                            <span key={n} className={cell.notes.includes(n) ? 'opacity-100' : 'opacity-0'}>
                              {n}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Number Input */}
            {gameState === 'playing' && (
              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                      key={num}
                      onClick={() => handleNumberInput(num)}
                      className="w-10 h-10 bg-muted hover:bg-blue-600 hover:text-white rounded-lg font-semibold transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setNoteMode(!noteMode)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      noteMode ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    Notes {noteMode ? 'ON' : 'OFF'}
                  </button>
                  <button
                    onClick={handleClear}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Clear
                  </button>
                  <button
                    onClick={handleHint}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center gap-2"
                  >
                    <Lightbulb className="w-4 h-4" />
                    Hint
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Win Screen */}
        {gameState === 'won' && (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-500 mb-2">Congratulations!</h2>
            <p className="text-lg mb-4">
              You solved the puzzle in {formatTime(timer)}
              {hintsUsed > 0 && ` using ${hintsUsed} hint${hintsUsed > 1 ? 's' : ''}`}
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">How to Play</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Fill each row, column, and 3x3 box with numbers 1-9</li>
            <li>Each number can only appear once in each row, column, and box</li>
            <li>Click a cell and then click a number to fill it in</li>
            <li>Use Notes mode to mark possible numbers</li>
            <li>Use Hint if you get stuck (but try to avoid it!)</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

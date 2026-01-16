'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, RotateCcw, Trophy, User, Bot, Zap } from 'lucide-react'

type Player = 'X' | 'O' | null
type Board = Player[]
type Difficulty = 'easy' | 'medium' | 'hard'

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
]

const checkWinner = (board: Board): { winner: Player; line: number[] | null } => {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combo }
    }
  }
  return { winner: null, line: null }
}

const getEmptyCells = (board: Board): number[] => {
  return board.map((cell, idx) => cell === null ? idx : -1).filter(idx => idx !== -1)
}

const minimax = (
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number
): number => {
  const { winner } = checkWinner(board)
  if (winner === 'O') return 10 - depth
  if (winner === 'X') return depth - 10
  if (getEmptyCells(board).length === 0) return 0

  if (isMaximizing) {
    let maxEval = -Infinity
    for (const cell of getEmptyCells(board)) {
      board[cell] = 'O'
      const evaluation = minimax(board, depth + 1, false, alpha, beta)
      board[cell] = null
      maxEval = Math.max(maxEval, evaluation)
      alpha = Math.max(alpha, evaluation)
      if (beta <= alpha) break
    }
    return maxEval
  } else {
    let minEval = Infinity
    for (const cell of getEmptyCells(board)) {
      board[cell] = 'X'
      const evaluation = minimax(board, depth + 1, true, alpha, beta)
      board[cell] = null
      minEval = Math.min(minEval, evaluation)
      beta = Math.min(beta, evaluation)
      if (beta <= alpha) break
    }
    return minEval
  }
}

export function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [gameMode, setGameMode] = useState<'pvp' | 'pvc'>('pvc')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })
  const [winningLine, setWinningLine] = useState<number[] | null>(null)
  const [gameOver, setGameOver] = useState(false)

  const { winner, line } = checkWinner(board)
  const isDraw = !winner && getEmptyCells(board).length === 0

  useEffect(() => {
    if (winner) {
      setWinningLine(line)
      setGameOver(true)
      setScores(prev => ({
        ...prev,
        [winner]: prev[winner] + 1
      }))
    } else if (isDraw) {
      setGameOver(true)
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }))
    }
  }, [winner, isDraw, line])

  const getBestMove = useCallback((currentBoard: Board): number => {
    const emptyCells = getEmptyCells(currentBoard)

    if (difficulty === 'easy') {
      // Random move
      return emptyCells[Math.floor(Math.random() * emptyCells.length)]
    }

    if (difficulty === 'medium') {
      // 50% optimal, 50% random
      if (Math.random() < 0.5) {
        return emptyCells[Math.floor(Math.random() * emptyCells.length)]
      }
    }

    // Hard: Minimax
    let bestScore = -Infinity
    let bestMove = emptyCells[0]

    for (const cell of emptyCells) {
      currentBoard[cell] = 'O'
      const score = minimax(currentBoard, 0, false, -Infinity, Infinity)
      currentBoard[cell] = null

      if (score > bestScore) {
        bestScore = score
        bestMove = cell
      }
    }

    return bestMove
  }, [difficulty])

  useEffect(() => {
    if (gameMode === 'pvc' && !isXNext && !gameOver) {
      const timer = setTimeout(() => {
        const move = getBestMove([...board])
        makeMove(move)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isXNext, gameMode, gameOver, board, getBestMove])

  const makeMove = (index: number) => {
    if (board[index] || gameOver) return

    const newBoard = [...board]
    newBoard[index] = isXNext ? 'X' : 'O'
    setBoard(newBoard)
    setIsXNext(!isXNext)
  }

  const handleCellClick = (index: number) => {
    if (gameMode === 'pvc' && !isXNext) return // Prevent clicking during AI turn
    makeMove(index)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinningLine(null)
    setGameOver(false)
  }

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 })
    resetGame()
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-4">
          <Gamepad2 className="w-4 h-4" />
          Classic Game
        </div>
        <h2 className="text-2xl font-bold">Tic Tac Toe</h2>
      </div>

      {/* Game Mode */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => {
            setGameMode('pvp')
            resetGame()
          }}
          className={`px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 ${
            gameMode === 'pvp'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <User className="w-4 h-4" />
          2 Players
        </button>
        <button
          onClick={() => {
            setGameMode('pvc')
            resetGame()
          }}
          className={`px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 ${
            gameMode === 'pvc'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <Bot className="w-4 h-4" />
          vs AI
        </button>
      </div>

      {/* AI Difficulty */}
      {gameMode === 'pvc' && (
        <div className="flex justify-center gap-2 mb-6">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
            <button
              key={d}
              onClick={() => {
                setDifficulty(d)
                resetGame()
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${
                difficulty === d
                  ? 'bg-amber-500 text-white'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {/* Scores */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-xl border border-border bg-card">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">X {gameMode === 'pvc' ? '(You)' : ''}</p>
          <p className="text-2xl font-bold text-blue-500">{scores.X}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Draws</p>
          <p className="text-2xl font-bold">{scores.draws}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">O {gameMode === 'pvc' ? '(AI)' : ''}</p>
          <p className="text-2xl font-bold text-red-500">{scores.O}</p>
        </div>
      </div>

      {/* Turn Indicator */}
      <div className="text-center mb-4">
        {gameOver ? (
          <p className="text-lg font-medium">
            {winner ? (
              <span className={winner === 'X' ? 'text-blue-500' : 'text-red-500'}>
                {winner} Wins! 🎉
              </span>
            ) : (
              <span>It's a Draw! 🤝</span>
            )}
          </p>
        ) : (
          <p className="text-muted-foreground">
            {gameMode === 'pvc' && !isXNext ? (
              <span className="inline-flex items-center gap-2">
                <Zap className="w-4 h-4 animate-pulse" />
                AI is thinking...
              </span>
            ) : (
              <span className={isXNext ? 'text-blue-500' : 'text-red-500'}>
                {isXNext ? 'X' : 'O'}'s turn
              </span>
            )}
          </p>
        )}
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {board.map((cell, index) => {
          const isWinningCell = winningLine?.includes(index)

          return (
            <motion.button
              key={index}
              whileHover={!cell && !gameOver ? { scale: 1.05 } : {}}
              whileTap={!cell && !gameOver ? { scale: 0.95 } : {}}
              onClick={() => handleCellClick(index)}
              disabled={!!cell || gameOver || (gameMode === 'pvc' && !isXNext)}
              className={`
                aspect-square text-5xl font-bold rounded-xl border-2 transition-all
                ${cell ? 'cursor-default' : 'cursor-pointer hover:bg-muted/50'}
                ${isWinningCell
                  ? 'bg-green-500/20 border-green-500'
                  : 'border-border bg-card'
                }
                ${cell === 'X' ? 'text-blue-500' : cell === 'O' ? 'text-red-500' : ''}
              `}
            >
              {cell && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {cell}
                </motion.span>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={resetGame}
          className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium inline-flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          New Game
        </button>
        <button
          onClick={resetScores}
          className="px-4 py-3 bg-muted rounded-xl font-medium"
        >
          Reset Scores
        </button>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground text-center">
        <p>
          {gameMode === 'pvp'
            ? 'Take turns placing X and O. Get 3 in a row to win!'
            : `You're X. Try to beat the ${difficulty} AI!`
          }
        </p>
      </div>
    </div>
  )
}

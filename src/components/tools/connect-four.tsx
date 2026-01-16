'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Trophy, Users, Cpu } from 'lucide-react'

type Player = 'red' | 'yellow'
type Cell = Player | null
type Board = Cell[][]
type GameMode = 'pvp' | 'ai'

const ROWS = 6
const COLS = 7

export function ConnectFour() {
  const [board, setBoard] = useState<Board>([])
  const [currentPlayer, setCurrentPlayer] = useState<Player>('red')
  const [winner, setWinner] = useState<Player | 'draw' | null>(null)
  const [gameMode, setGameMode] = useState<GameMode>('pvp')
  const [scores, setScores] = useState({ red: 0, yellow: 0 })
  const [winningCells, setWinningCells] = useState<[number, number][]>([])
  const [isThinking, setIsThinking] = useState(false)

  const initBoard = useCallback(() => {
    const newBoard: Board = Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
    setBoard(newBoard)
    setWinner(null)
    setWinningCells([])
    setCurrentPlayer('red')
  }, [])

  useEffect(() => {
    initBoard()
  }, [initBoard])

  const checkWin = (board: Board, row: number, col: number, player: Player): [number, number][] | null => {
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal down-right
      [1, -1],  // diagonal down-left
    ]

    for (const [dr, dc] of directions) {
      const cells: [number, number][] = [[row, col]]

      // Check positive direction
      for (let i = 1; i < 4; i++) {
        const r = row + dr * i
        const c = col + dc * i
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
          cells.push([r, c])
        } else break
      }

      // Check negative direction
      for (let i = 1; i < 4; i++) {
        const r = row - dr * i
        const c = col - dc * i
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
          cells.push([r, c])
        } else break
      }

      if (cells.length >= 4) return cells
    }

    return null
  }

  const checkDraw = (board: Board): boolean => {
    return board[0].every(cell => cell !== null)
  }

  const getLowestEmptyRow = (board: Board, col: number): number => {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === null) return row
    }
    return -1
  }

  const minimax = (board: Board, depth: number, alpha: number, beta: number, isMaximizing: boolean): number => {
    // Check for terminal states
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (board[row][col]) {
          const win = checkWin(board, row, col, board[row][col]!)
          if (win) {
            return board[row][col] === 'yellow' ? 1000 - depth : -1000 + depth
          }
        }
      }
    }

    if (checkDraw(board) || depth === 0) return 0

    if (isMaximizing) {
      let maxEval = -Infinity
      for (let col = 0; col < COLS; col++) {
        const row = getLowestEmptyRow(board, col)
        if (row === -1) continue
        board[row][col] = 'yellow'
        const evalScore = minimax(board, depth - 1, alpha, beta, false)
        board[row][col] = null
        maxEval = Math.max(maxEval, evalScore)
        alpha = Math.max(alpha, evalScore)
        if (beta <= alpha) break
      }
      return maxEval
    } else {
      let minEval = Infinity
      for (let col = 0; col < COLS; col++) {
        const row = getLowestEmptyRow(board, col)
        if (row === -1) continue
        board[row][col] = 'red'
        const evalScore = minimax(board, depth - 1, alpha, beta, true)
        board[row][col] = null
        minEval = Math.min(minEval, evalScore)
        beta = Math.min(beta, evalScore)
        if (beta <= alpha) break
      }
      return minEval
    }
  }

  const getAIMove = (board: Board): number => {
    let bestScore = -Infinity
    let bestCol = 3 // default to center
    const boardCopy = board.map(row => [...row])

    // Prioritize center columns
    const colOrder = [3, 2, 4, 1, 5, 0, 6]

    for (const col of colOrder) {
      const row = getLowestEmptyRow(boardCopy, col)
      if (row === -1) continue

      boardCopy[row][col] = 'yellow'
      const score = minimax(boardCopy, 4, -Infinity, Infinity, false)
      boardCopy[row][col] = null

      if (score > bestScore) {
        bestScore = score
        bestCol = col
      }
    }

    return bestCol
  }

  const dropPiece = useCallback((col: number) => {
    if (winner || isThinking) return

    const row = getLowestEmptyRow(board, col)
    if (row === -1) return

    const newBoard = board.map(r => [...r])
    newBoard[row][col] = currentPlayer

    setBoard(newBoard)

    const winning = checkWin(newBoard, row, col, currentPlayer)
    if (winning) {
      setWinner(currentPlayer)
      setWinningCells(winning)
      setScores(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }))
    } else if (checkDraw(newBoard)) {
      setWinner('draw')
    } else {
      setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red')
    }
  }, [board, currentPlayer, winner, isThinking])

  // AI move
  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 'yellow' && !winner) {
      setIsThinking(true)
      const timer = setTimeout(() => {
        const aiCol = getAIMove(board)
        dropPiece(aiCol)
        setIsThinking(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentPlayer, gameMode, winner, board])

  const handleColumnClick = (col: number) => {
    if (gameMode === 'ai' && currentPlayer === 'yellow') return
    dropPiece(col)
  }

  const resetGame = () => {
    initBoard()
  }

  const switchMode = (mode: GameMode) => {
    setGameMode(mode)
    setScores({ red: 0, yellow: 0 })
    initBoard()
  }

  const isWinningCell = (row: number, col: number): boolean => {
    return winningCells.some(([r, c]) => r === row && c === col)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Connect Four</h1>
        <p className="text-muted-foreground">Drop discs to connect 4 in a row!</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Mode Selection */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => switchMode('pvp')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              gameMode === 'pvp' ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <Users className="w-4 h-4" />
            2 Players
          </button>
          <button
            onClick={() => switchMode('ai')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              gameMode === 'ai' ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <Cpu className="w-4 h-4" />
            vs AI
          </button>
        </div>

        {/* Scores */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-red-500 mx-auto mb-1" />
            <span className={`font-semibold ${currentPlayer === 'red' && !winner ? 'text-red-500' : ''}`}>
              {gameMode === 'ai' ? 'You' : 'Red'}: {scores.red}
            </span>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-yellow-500 mx-auto mb-1" />
            <span className={`font-semibold ${currentPlayer === 'yellow' && !winner ? 'text-yellow-500' : ''}`}>
              {gameMode === 'ai' ? 'AI' : 'Yellow'}: {scores.yellow}
            </span>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-4 h-8">
          {winner ? (
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-lg font-semibold">
                {winner === 'draw'
                  ? "It's a draw!"
                  : gameMode === 'ai'
                    ? winner === 'red' ? 'You win!' : 'AI wins!'
                    : `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins!`
                }
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">
              {isThinking
                ? 'AI is thinking...'
                : `${gameMode === 'ai' && currentPlayer === 'red' ? 'Your' : currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1) + "'s"} turn`
              }
            </span>
          )}
        </div>

        {/* Board */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-lg">
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
            >
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <motion.button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleColumnClick(colIndex)}
                    disabled={!!winner || (gameMode === 'ai' && currentPlayer === 'yellow')}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-800 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    <AnimatePresence>
                      {cell && (
                        <motion.div
                          initial={{ y: -100, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                            cell === 'red' ? 'bg-red-500' : 'bg-yellow-500'
                          } ${isWinningCell(rowIndex, colIndex) ? 'ring-4 ring-white animate-pulse' : ''}`}
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center">
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            New Game
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">How to Play</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Click on a column to drop your disc</li>
            <li>Connect 4 discs in a row (horizontal, vertical, or diagonal) to win</li>
            <li>Take turns with your opponent</li>
            <li>Play against a friend or challenge the AI!</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

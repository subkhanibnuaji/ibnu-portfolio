'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RotateCcw, Flag, Clock, Trophy, Cpu, Users,
  ChevronLeft, ChevronRight, Play, Pause
} from 'lucide-react'

type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn'
type PieceColor = 'white' | 'black'

interface Piece {
  type: PieceType
  color: PieceColor
}

type Board = (Piece | null)[][]
type Position = { row: number; col: number }

const PIECE_SYMBOLS: { [key in PieceColor]: { [key in PieceType]: string } } = {
  white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
  black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
}

const PIECE_VALUES: { [key in PieceType]: number } = {
  pawn: 10, knight: 30, bishop: 30, rook: 50, queen: 90, king: 900
}

const INITIAL_BOARD: Board = [
  [{ type: 'rook', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'queen', color: 'black' }, { type: 'king', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'rook', color: 'black' }],
  Array(8).fill(null).map(() => ({ type: 'pawn' as PieceType, color: 'black' as PieceColor })),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null).map(() => ({ type: 'pawn' as PieceType, color: 'white' as PieceColor })),
  [{ type: 'rook', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' }, { type: 'king', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'rook', color: 'white' }]
]

interface Move {
  from: Position
  to: Position
  piece: Piece
  captured?: Piece
  notation: string
}

export function ChessGame() {
  const [board, setBoard] = useState<Board>(JSON.parse(JSON.stringify(INITIAL_BOARD)))
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [currentTurn, setCurrentTurn] = useState<PieceColor>('white')
  const [gameMode, setGameMode] = useState<'pvp' | 'ai'>('ai')
  const [moveHistory, setMoveHistory] = useState<Move[]>([])
  const [capturedPieces, setCapturedPieces] = useState<{ white: Piece[]; black: Piece[] }>({ white: [], black: [] })
  const [isCheck, setIsCheck] = useState(false)
  const [isCheckmate, setIsCheckmate] = useState(false)
  const [isStalemate, setIsStalemate] = useState(false)
  const [aiThinking, setAiThinking] = useState(false)

  const findKing = useCallback((boardState: Board, color: PieceColor): Position | null => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col]
        if (piece?.type === 'king' && piece.color === color) {
          return { row, col }
        }
      }
    }
    return null
  }, [])

  const isValidPosition = (row: number, col: number): boolean => {
    return row >= 0 && row < 8 && col >= 0 && col < 8
  }

  const getRawMoves = useCallback((boardState: Board, pos: Position): Position[] => {
    const piece = boardState[pos.row][pos.col]
    if (!piece) return []

    const moves: Position[] = []
    const { row, col } = pos
    const direction = piece.color === 'white' ? -1 : 1

    switch (piece.type) {
      case 'pawn':
        // Forward move
        if (isValidPosition(row + direction, col) && !boardState[row + direction][col]) {
          moves.push({ row: row + direction, col })
          // Double move from starting position
          const startRow = piece.color === 'white' ? 6 : 1
          if (row === startRow && !boardState[row + 2 * direction][col]) {
            moves.push({ row: row + 2 * direction, col })
          }
        }
        // Captures
        for (const dc of [-1, 1]) {
          if (isValidPosition(row + direction, col + dc)) {
            const target = boardState[row + direction][col + dc]
            if (target && target.color !== piece.color) {
              moves.push({ row: row + direction, col: col + dc })
            }
          }
        }
        break

      case 'knight':
        const knightMoves = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ]
        for (const [dr, dc] of knightMoves) {
          const newRow = row + dr
          const newCol = col + dc
          if (isValidPosition(newRow, newCol)) {
            const target = boardState[newRow][newCol]
            if (!target || target.color !== piece.color) {
              moves.push({ row: newRow, col: newCol })
            }
          }
        }
        break

      case 'bishop':
        for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
          for (let i = 1; i < 8; i++) {
            const newRow = row + dr * i
            const newCol = col + dc * i
            if (!isValidPosition(newRow, newCol)) break
            const target = boardState[newRow][newCol]
            if (!target) {
              moves.push({ row: newRow, col: newCol })
            } else {
              if (target.color !== piece.color) {
                moves.push({ row: newRow, col: newCol })
              }
              break
            }
          }
        }
        break

      case 'rook':
        for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          for (let i = 1; i < 8; i++) {
            const newRow = row + dr * i
            const newCol = col + dc * i
            if (!isValidPosition(newRow, newCol)) break
            const target = boardState[newRow][newCol]
            if (!target) {
              moves.push({ row: newRow, col: newCol })
            } else {
              if (target.color !== piece.color) {
                moves.push({ row: newRow, col: newCol })
              }
              break
            }
          }
        }
        break

      case 'queen':
        for (const [dr, dc] of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) {
          for (let i = 1; i < 8; i++) {
            const newRow = row + dr * i
            const newCol = col + dc * i
            if (!isValidPosition(newRow, newCol)) break
            const target = boardState[newRow][newCol]
            if (!target) {
              moves.push({ row: newRow, col: newCol })
            } else {
              if (target.color !== piece.color) {
                moves.push({ row: newRow, col: newCol })
              }
              break
            }
          }
        }
        break

      case 'king':
        for (const [dr, dc] of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) {
          const newRow = row + dr
          const newCol = col + dc
          if (isValidPosition(newRow, newCol)) {
            const target = boardState[newRow][newCol]
            if (!target || target.color !== piece.color) {
              moves.push({ row: newRow, col: newCol })
            }
          }
        }
        break
    }

    return moves
  }, [])

  const isSquareAttacked = useCallback((boardState: Board, pos: Position, byColor: PieceColor): boolean => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col]
        if (piece && piece.color === byColor) {
          const moves = getRawMoves(boardState, { row, col })
          if (moves.some(m => m.row === pos.row && m.col === pos.col)) {
            return true
          }
        }
      }
    }
    return false
  }, [getRawMoves])

  const isInCheck = useCallback((boardState: Board, color: PieceColor): boolean => {
    const kingPos = findKing(boardState, color)
    if (!kingPos) return false
    return isSquareAttacked(boardState, kingPos, color === 'white' ? 'black' : 'white')
  }, [findKing, isSquareAttacked])

  const getValidMoves = useCallback((boardState: Board, pos: Position): Position[] => {
    const piece = boardState[pos.row][pos.col]
    if (!piece) return []

    const rawMoves = getRawMoves(boardState, pos)

    // Filter moves that would leave king in check
    return rawMoves.filter(move => {
      const newBoard = boardState.map(row => [...row])
      newBoard[move.row][move.col] = piece
      newBoard[pos.row][pos.col] = null
      return !isInCheck(newBoard, piece.color)
    })
  }, [getRawMoves, isInCheck])

  const hasAnyValidMoves = useCallback((boardState: Board, color: PieceColor): boolean => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col]
        if (piece && piece.color === color) {
          const moves = getValidMoves(boardState, { row, col })
          if (moves.length > 0) return true
        }
      }
    }
    return false
  }, [getValidMoves])

  const evaluateBoard = useCallback((boardState: Board): number => {
    let score = 0

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col]
        if (piece) {
          const value = PIECE_VALUES[piece.type]
          // Position bonus
          const centerBonus = (3.5 - Math.abs(col - 3.5)) * 0.1 + (3.5 - Math.abs(row - 3.5)) * 0.1
          const totalValue = value + centerBonus
          score += piece.color === 'white' ? -totalValue : totalValue
        }
      }
    }

    return score
  }, [])

  const getAllMoves = useCallback((boardState: Board, color: PieceColor): { from: Position; to: Position }[] => {
    const moves: { from: Position; to: Position }[] = []

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col]
        if (piece && piece.color === color) {
          const validMoves = getValidMoves(boardState, { row, col })
          validMoves.forEach(to => {
            moves.push({ from: { row, col }, to })
          })
        }
      }
    }

    return moves
  }, [getValidMoves])

  const minimax = useCallback((
    boardState: Board,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): number => {
    if (depth === 0) {
      return evaluateBoard(boardState)
    }

    const color = isMaximizing ? 'black' : 'white'
    const moves = getAllMoves(boardState, color)

    if (moves.length === 0) {
      if (isInCheck(boardState, color)) {
        return isMaximizing ? -10000 : 10000
      }
      return 0
    }

    if (isMaximizing) {
      let maxEval = -Infinity
      for (const move of moves) {
        const newBoard = boardState.map(row => [...row])
        const piece = newBoard[move.from.row][move.from.col]
        newBoard[move.to.row][move.to.col] = piece
        newBoard[move.from.row][move.from.col] = null

        const evalScore = minimax(newBoard, depth - 1, alpha, beta, false)
        maxEval = Math.max(maxEval, evalScore)
        alpha = Math.max(alpha, evalScore)
        if (beta <= alpha) break
      }
      return maxEval
    } else {
      let minEval = Infinity
      for (const move of moves) {
        const newBoard = boardState.map(row => [...row])
        const piece = newBoard[move.from.row][move.from.col]
        newBoard[move.to.row][move.to.col] = piece
        newBoard[move.from.row][move.from.col] = null

        const evalScore = minimax(newBoard, depth - 1, alpha, beta, true)
        minEval = Math.min(minEval, evalScore)
        beta = Math.min(beta, evalScore)
        if (beta <= alpha) break
      }
      return minEval
    }
  }, [evaluateBoard, getAllMoves, isInCheck])

  const makeAIMove = useCallback(() => {
    if (currentTurn !== 'black' || gameMode !== 'ai') return

    setAiThinking(true)

    setTimeout(() => {
      const moves = getAllMoves(board, 'black')
      if (moves.length === 0) {
        setAiThinking(false)
        return
      }

      let bestMove = moves[0]
      let bestScore = -Infinity

      for (const move of moves) {
        const newBoard = board.map(row => [...row])
        const piece = newBoard[move.from.row][move.from.col]
        newBoard[move.to.row][move.to.col] = piece
        newBoard[move.from.row][move.from.col] = null

        const score = minimax(newBoard, 2, -Infinity, Infinity, false)
        if (score > bestScore) {
          bestScore = score
          bestMove = move
        }
      }

      // Make the move
      const newBoard = board.map(row => [...row])
      const piece = newBoard[bestMove.from.row][bestMove.from.col]!
      const captured = newBoard[bestMove.to.row][bestMove.to.col]

      newBoard[bestMove.to.row][bestMove.to.col] = piece
      newBoard[bestMove.from.row][bestMove.from.col] = null

      // Handle pawn promotion
      if (piece.type === 'pawn' && bestMove.to.row === 7) {
        newBoard[bestMove.to.row][bestMove.to.col] = { type: 'queen', color: 'black' }
      }

      const notation = `${piece.type === 'pawn' ? '' : piece.type[0].toUpperCase()}${String.fromCharCode(97 + bestMove.from.col)}${8 - bestMove.from.row}-${String.fromCharCode(97 + bestMove.to.col)}${8 - bestMove.to.row}${captured ? 'x' : ''}`

      setMoveHistory(prev => [...prev, { from: bestMove.from, to: bestMove.to, piece, captured: captured || undefined, notation }])

      if (captured) {
        setCapturedPieces(prev => ({
          ...prev,
          black: [...prev.black, captured]
        }))
      }

      setBoard(newBoard)
      setCurrentTurn('white')
      setAiThinking(false)

      // Check game state
      const inCheck = isInCheck(newBoard, 'white')
      setIsCheck(inCheck)

      if (!hasAnyValidMoves(newBoard, 'white')) {
        if (inCheck) {
          setIsCheckmate(true)
        } else {
          setIsStalemate(true)
        }
      }
    }, 500)
  }, [board, currentTurn, gameMode, getAllMoves, minimax, isInCheck, hasAnyValidMoves])

  useEffect(() => {
    if (currentTurn === 'black' && gameMode === 'ai' && !isCheckmate && !isStalemate) {
      makeAIMove()
    }
  }, [currentTurn, gameMode, isCheckmate, isStalemate, makeAIMove])

  const handleSquareClick = (row: number, col: number) => {
    if (isCheckmate || isStalemate || aiThinking) return
    if (gameMode === 'ai' && currentTurn === 'black') return

    const piece = board[row][col]

    if (selectedPiece) {
      // Check if this is a valid move
      const isValidMove = validMoves.some(m => m.row === row && m.col === col)

      if (isValidMove) {
        const newBoard = board.map(r => [...r])
        const movingPiece = newBoard[selectedPiece.row][selectedPiece.col]!
        const captured = newBoard[row][col]

        newBoard[row][col] = movingPiece
        newBoard[selectedPiece.row][selectedPiece.col] = null

        // Pawn promotion
        if (movingPiece.type === 'pawn' && (row === 0 || row === 7)) {
          newBoard[row][col] = { type: 'queen', color: movingPiece.color }
        }

        const notation = `${movingPiece.type === 'pawn' ? '' : movingPiece.type[0].toUpperCase()}${String.fromCharCode(97 + selectedPiece.col)}${8 - selectedPiece.row}-${String.fromCharCode(97 + col)}${8 - row}${captured ? 'x' : ''}`

        setMoveHistory(prev => [...prev, { from: selectedPiece, to: { row, col }, piece: movingPiece, captured: captured || undefined, notation }])

        if (captured) {
          setCapturedPieces(prev => ({
            ...prev,
            [currentTurn]: [...prev[currentTurn], captured]
          }))
        }

        setBoard(newBoard)
        const nextTurn = currentTurn === 'white' ? 'black' : 'white'
        setCurrentTurn(nextTurn)
        setSelectedPiece(null)
        setValidMoves([])

        // Check game state
        const inCheck = isInCheck(newBoard, nextTurn)
        setIsCheck(inCheck)

        if (!hasAnyValidMoves(newBoard, nextTurn)) {
          if (inCheck) {
            setIsCheckmate(true)
          } else {
            setIsStalemate(true)
          }
        }
      } else {
        // Select another piece
        if (piece && piece.color === currentTurn) {
          setSelectedPiece({ row, col })
          setValidMoves(getValidMoves(board, { row, col }))
        } else {
          setSelectedPiece(null)
          setValidMoves([])
        }
      }
    } else {
      // Select piece
      if (piece && piece.color === currentTurn) {
        setSelectedPiece({ row, col })
        setValidMoves(getValidMoves(board, { row, col }))
      }
    }
  }

  const resetGame = () => {
    setBoard(JSON.parse(JSON.stringify(INITIAL_BOARD)))
    setSelectedPiece(null)
    setValidMoves([])
    setCurrentTurn('white')
    setMoveHistory([])
    setCapturedPieces({ white: [], black: [] })
    setIsCheck(false)
    setIsCheckmate(false)
    setIsStalemate(false)
    setAiThinking(false)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Game mode selection */}
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={() => { setGameMode('ai'); resetGame(); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              gameMode === 'ai'
                ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                : 'bg-white/10 border border-white/20 text-white/70'
            }`}
          >
            <Cpu className="w-5 h-5" />
            vs AI
          </button>
          <button
            onClick={() => { setGameMode('pvp'); resetGame(); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              gameMode === 'pvp'
                ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                : 'bg-white/10 border border-white/20 text-white/70'
            }`}
          >
            <Users className="w-5 h-5" />
            2 Players
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Board */}
          <div className="flex-1">
            <div className="aspect-square max-w-[480px] mx-auto">
              <div className="grid grid-cols-8 gap-0 border-2 border-amber-900 rounded-lg overflow-hidden">
                {board.map((row, rowIndex) =>
                  row.map((piece, colIndex) => {
                    const isLight = (rowIndex + colIndex) % 2 === 0
                    const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex
                    const isValidMove = validMoves.some(m => m.row === rowIndex && m.col === colIndex)
                    const isLastMove = moveHistory.length > 0 && (
                      (moveHistory[moveHistory.length - 1].from.row === rowIndex && moveHistory[moveHistory.length - 1].from.col === colIndex) ||
                      (moveHistory[moveHistory.length - 1].to.row === rowIndex && moveHistory[moveHistory.length - 1].to.col === colIndex)
                    )
                    const kingPos = findKing(board, currentTurn)
                    const isKingInCheck = isCheck && kingPos?.row === rowIndex && kingPos?.col === colIndex

                    return (
                      <motion.div
                        key={`${rowIndex}-${colIndex}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                        className={`
                          aspect-square flex items-center justify-center cursor-pointer relative
                          ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
                          ${isSelected ? 'ring-4 ring-blue-500 ring-inset' : ''}
                          ${isLastMove ? 'bg-yellow-400/50' : ''}
                          ${isKingInCheck ? 'bg-red-500/50' : ''}
                        `}
                      >
                        {isValidMove && (
                          <div className={`absolute inset-0 flex items-center justify-center ${piece ? 'ring-4 ring-red-500/50 ring-inset' : ''}`}>
                            {!piece && <div className="w-3 h-3 rounded-full bg-green-500/50" />}
                          </div>
                        )}
                        {piece && (
                          <span className={`text-4xl md:text-5xl ${piece.color === 'white' ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : 'text-gray-900'}`}>
                            {PIECE_SYMBOLS[piece.color][piece.type]}
                          </span>
                        )}
                      </motion.div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="w-full lg:w-64 space-y-4">
            {/* Status */}
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-center">
                {isCheckmate ? (
                  <div className="text-xl font-bold text-yellow-400">
                    <Trophy className="w-8 h-8 mx-auto mb-2" />
                    Checkmate! {currentTurn === 'white' ? 'Black' : 'White'} wins!
                  </div>
                ) : isStalemate ? (
                  <div className="text-xl font-bold text-gray-400">Stalemate! Draw.</div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-white/70">Current turn:</div>
                    <div className={`text-2xl font-bold ${currentTurn === 'white' ? 'text-white' : 'text-gray-400'}`}>
                      {currentTurn === 'white' ? '♔ White' : '♚ Black'}
                    </div>
                    {aiThinking && (
                      <div className="text-blue-400 animate-pulse">AI thinking...</div>
                    )}
                    {isCheck && !isCheckmate && (
                      <div className="text-red-400 font-bold">Check!</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Captured pieces */}
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/70 text-sm mb-2">Captured</div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {capturedPieces.white.map((p, i) => (
                    <span key={i} className="text-2xl text-gray-900">{PIECE_SYMBOLS.black[p.type]}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {capturedPieces.black.map((p, i) => (
                    <span key={i} className="text-2xl text-white">{PIECE_SYMBOLS.white[p.type]}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Move history */}
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/70 text-sm mb-2">Move History</div>
              <div className="max-h-40 overflow-y-auto space-y-1 text-sm">
                {moveHistory.map((move, i) => (
                  <div key={i} className="text-white/60">
                    {Math.floor(i / 2) + 1}{i % 2 === 0 ? '.' : '...'} {move.notation}
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <button
              onClick={resetGame}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              New Game
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

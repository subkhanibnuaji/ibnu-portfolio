'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, RotateCcw, Trophy, Timer, Zap } from 'lucide-react'

const EMOJIS = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎸', '🎹', '🎺', '🎻', '🎼', '🎵', '🎶', '🌟', '⭐', '🌈', '🔥', '💎', '🎁', '🎀', '🎉', '🎊', '🎋', '🎍', '🎎', '🎏', '🎐']

type Difficulty = 'easy' | 'medium' | 'hard'

const DIFFICULTY_CONFIG = {
  easy: { pairs: 6, cols: 4 },
  medium: { pairs: 8, cols: 4 },
  hard: { pairs: 12, cols: 6 },
}

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

export function MemoryGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [bestScores, setBestScores] = useState<Record<Difficulty, number>>({
    easy: 0,
    medium: 0,
    hard: 0
  })

  useEffect(() => {
    const saved = localStorage.getItem('memoryGameScores')
    if (saved) {
      setBestScores(JSON.parse(saved))
    }
    initGame()
  }, [difficulty])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && !gameOver) {
      interval = setInterval(() => {
        setTimer(t => t + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, gameOver])

  const initGame = () => {
    const { pairs } = DIFFICULTY_CONFIG[difficulty]
    const selectedEmojis = EMOJIS.slice(0, pairs)
    const cardPairs = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }))

    setCards(cardPairs)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setGameOver(false)
    setTimer(0)
    setIsPlaying(false)
  }

  const handleCardClick = (id: number) => {
    if (!isPlaying) setIsPlaying(true)

    const card = cards.find(c => c.id === id)
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return

    const newFlipped = [...flippedCards, id]
    setFlippedCards(newFlipped)

    setCards(cards.map(c =>
      c.id === id ? { ...c, isFlipped: true } : c
    ))

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      const [first, second] = newFlipped
      const firstCard = cards.find(c => c.id === first)
      const secondCard = cards.find(c => c.id === second)

      if (firstCard?.emoji === secondCard?.emoji) {
        // Match found
        setTimeout(() => {
          setCards(prevCards => prevCards.map(c =>
            c.id === first || c.id === second
              ? { ...c, isMatched: true }
              : c
          ))
          setMatches(m => {
            const newMatches = m + 1
            if (newMatches === DIFFICULTY_CONFIG[difficulty].pairs) {
              setGameOver(true)
              setIsPlaying(false)
              // Save best score
              const score = moves + 1
              if (!bestScores[difficulty] || score < bestScores[difficulty]) {
                const newScores = { ...bestScores, [difficulty]: score }
                setBestScores(newScores)
                localStorage.setItem('memoryGameScores', JSON.stringify(newScores))
              }
            }
            return newMatches
          })
          setFlippedCards([])
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards => prevCards.map(c =>
            c.id === first || c.id === second
              ? { ...c, isFlipped: false }
              : c
          ))
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const { cols, pairs } = DIFFICULTY_CONFIG[difficulty]

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-500 text-sm font-medium mb-4">
          <Brain className="w-4 h-4" />
          Memory Game
        </div>
        <h2 className="text-2xl font-bold">Memory Match</h2>
        <p className="text-muted-foreground mt-2">
          Find all matching pairs in as few moves as possible!
        </p>
      </div>

      {/* Difficulty */}
      <div className="flex justify-center gap-2 mb-6">
        {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`px-4 py-2 rounded-lg font-medium capitalize ${
              difficulty === d
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {d} ({DIFFICULTY_CONFIG[d].pairs} pairs)
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <Zap className="w-5 h-5 mx-auto mb-1 text-amber-500" />
          <p className="text-2xl font-bold">{moves}</p>
          <p className="text-xs text-muted-foreground">Moves</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <Trophy className="w-5 h-5 mx-auto mb-1 text-green-500" />
          <p className="text-2xl font-bold">{matches}/{pairs}</p>
          <p className="text-xs text-muted-foreground">Matches</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <Timer className="w-5 h-5 mx-auto mb-1 text-blue-500" />
          <p className="text-2xl font-bold">{formatTime(timer)}</p>
          <p className="text-xs text-muted-foreground">Time</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <Trophy className="w-5 h-5 mx-auto mb-1 text-purple-500" />
          <p className="text-2xl font-bold">{bestScores[difficulty] || '-'}</p>
          <p className="text-xs text-muted-foreground">Best</p>
        </div>
      </div>

      {/* Game Over */}
      {gameOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-6 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-center"
        >
          <h3 className="text-2xl font-bold mb-2">🎉 Congratulations!</h3>
          <p className="text-muted-foreground">
            You completed the game in <span className="font-bold text-foreground">{moves}</span> moves
            and <span className="font-bold text-foreground">{formatTime(timer)}</span>!
          </p>
          {moves === bestScores[difficulty] && (
            <p className="text-green-500 font-medium mt-2">New Best Score! 🏆</p>
          )}
        </motion.div>
      )}

      {/* Game Board */}
      <div
        className="grid gap-2 mb-6"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cards.map(card => (
          <motion.button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isMatched}
            whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              aspect-square rounded-xl text-3xl font-bold transition-all duration-300
              ${card.isMatched
                ? 'bg-green-500/20 border-2 border-green-500'
                : card.isFlipped
                  ? 'bg-primary/20 border-2 border-primary'
                  : 'bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-border hover:border-primary/50'
              }
            `}
          >
            <motion.span
              initial={false}
              animate={{
                rotateY: card.isFlipped || card.isMatched ? 0 : 180,
                opacity: card.isFlipped || card.isMatched ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              className="block"
            >
              {card.emoji}
            </motion.span>
          </motion.button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-center">
        <button
          onClick={initGame}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          New Game
        </button>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground text-center">
        <p>Click cards to flip them. Match all pairs to win!</p>
      </div>
    </div>
  )
}

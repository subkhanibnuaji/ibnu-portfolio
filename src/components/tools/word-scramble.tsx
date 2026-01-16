'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Trophy, Clock, Lightbulb, CheckCircle, XCircle, Zap } from 'lucide-react'

type Category = 'animals' | 'food' | 'countries' | 'technology' | 'nature' | 'sports'

const WORDS: Record<Category, string[]> = {
  animals: ['elephant', 'giraffe', 'penguin', 'dolphin', 'kangaroo', 'butterfly', 'crocodile', 'hamster', 'squirrel', 'peacock'],
  food: ['pizza', 'burger', 'spaghetti', 'chocolate', 'sandwich', 'pancake', 'avocado', 'broccoli', 'strawberry', 'pineapple'],
  countries: ['australia', 'brazil', 'canada', 'germany', 'japan', 'mexico', 'norway', 'sweden', 'thailand', 'vietnam'],
  technology: ['computer', 'keyboard', 'internet', 'software', 'database', 'algorithm', 'wireless', 'bluetooth', 'processor', 'monitor'],
  nature: ['mountain', 'waterfall', 'rainbow', 'volcano', 'glacier', 'desert', 'forest', 'island', 'canyon', 'meadow'],
  sports: ['basketball', 'football', 'swimming', 'tennis', 'volleyball', 'baseball', 'hockey', 'cricket', 'boxing', 'cycling'],
}

const CATEGORY_LABELS: Record<Category, string> = {
  animals: 'Animals',
  food: 'Food',
  countries: 'Countries',
  technology: 'Technology',
  nature: 'Nature',
  sports: 'Sports',
}

export function WordScramble() {
  const [category, setCategory] = useState<Category>('animals')
  const [currentWord, setCurrentWord] = useState('')
  const [scrambledWord, setScrambledWord] = useState('')
  const [userInput, setUserInput] = useState('')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [revealedLetters, setRevealedLetters] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'correct' | 'wrong' | 'timeout'>('idle')
  const [usedWords, setUsedWords] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('wordScrambleHighScore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  const scrambleWord = (word: string): string => {
    const letters = word.split('')
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[letters[i], letters[j]] = [letters[j], letters[i]]
    }
    // Make sure it's actually scrambled
    if (letters.join('') === word) {
      return scrambleWord(word)
    }
    return letters.join('')
  }

  const getNewWord = useCallback(() => {
    const categoryWords = WORDS[category]
    const availableWords = categoryWords.filter(w => !usedWords.includes(w))

    if (availableWords.length === 0) {
      setUsedWords([])
      const word = categoryWords[Math.floor(Math.random() * categoryWords.length)]
      return word
    }

    const word = availableWords[Math.floor(Math.random() * availableWords.length)]
    return word
  }, [category, usedWords])

  const startNewRound = useCallback(() => {
    const word = getNewWord()
    setCurrentWord(word)
    setScrambledWord(scrambleWord(word))
    setUserInput('')
    setRevealedLetters([])
    setTimeLeft(30)
    setGameState('playing')
    setUsedWords(prev => [...prev, word])
  }, [getNewWord])

  const startGame = () => {
    setScore(0)
    setStreak(0)
    setHintsUsed(0)
    setUsedWords([])
    startNewRound()
  }

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return

    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setGameState('timeout')
          setStreak(0)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (gameState !== 'playing') return

    if (userInput.toLowerCase() === currentWord) {
      const timeBonus = Math.floor(timeLeft / 3)
      const streakBonus = streak * 5
      const hintPenalty = hintsUsed * 10
      const points = Math.max(10, 50 + timeBonus + streakBonus - hintPenalty)

      const newScore = score + points
      setScore(newScore)
      setStreak(s => s + 1)

      if (newScore > highScore) {
        setHighScore(newScore)
        localStorage.setItem('wordScrambleHighScore', newScore.toString())
      }

      setGameState('correct')
    } else {
      setGameState('wrong')
      setStreak(0)
    }
  }

  const handleHint = () => {
    if (gameState !== 'playing' || revealedLetters.length >= currentWord.length - 1) return

    // Find an unrevealed position
    const unrevealedPositions = []
    for (let i = 0; i < currentWord.length; i++) {
      if (!revealedLetters.includes(i)) {
        unrevealedPositions.push(i)
      }
    }

    if (unrevealedPositions.length > 0) {
      const randomPos = unrevealedPositions[Math.floor(Math.random() * unrevealedPositions.length)]
      setRevealedLetters(prev => [...prev, randomPos])
      setHintsUsed(h => h + 1)
    }
  }

  const getHintDisplay = (): string => {
    return currentWord
      .split('')
      .map((letter, i) => (revealedLetters.includes(i) ? letter : '_'))
      .join(' ')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Word Scramble</h1>
        <p className="text-muted-foreground">Unscramble the letters to find the hidden word!</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Stats */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold">Score: {score}</div>
            <div className="flex items-center gap-1 text-yellow-500">
              <Trophy className="w-4 h-4" />
              <span>{highScore}</span>
            </div>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 text-orange-500">
              <Zap className="w-4 h-4" />
              <span>{streak} streak!</span>
            </div>
          )}
        </div>

        {/* Category Selection */}
        {gameState === 'idle' && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select Category</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(WORDS) as Category[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    category === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Game Area */}
        {gameState === 'idle' ? (
          <div className="text-center py-8">
            <button
              onClick={startGame}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg"
            >
              Start Game
            </button>
          </div>
        ) : (
          <>
            {/* Timer and Category */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-muted-foreground">
                Category: <span className="font-medium text-foreground">{CATEGORY_LABELS[category]}</span>
              </div>
              <div className={`flex items-center gap-2 ${timeLeft <= 10 ? 'text-red-500' : 'text-muted-foreground'}`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono text-lg">{timeLeft}s</span>
              </div>
            </div>

            {/* Scrambled Word Display */}
            <div className="text-center mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={scrambledWord}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex justify-center gap-2 mb-4"
                >
                  {scrambledWord.split('').map((letter, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold rounded-lg uppercase"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Hint Display */}
              {revealedLetters.length > 0 && (
                <div className="text-lg font-mono text-muted-foreground">
                  {getHintDisplay()}
                </div>
              )}
            </div>

            {/* Input Form */}
            {gameState === 'playing' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full px-4 py-3 bg-muted rounded-lg text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleHint}
                    disabled={revealedLetters.length >= currentWord.length - 1}
                    className="flex-1 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center gap-2"
                  >
                    <Lightbulb className="w-5 h-5" />
                    Hint ({3 - revealedLetters.length} left)
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}

            {/* Result Display */}
            {(gameState === 'correct' || gameState === 'wrong' || gameState === 'timeout') && (
              <div className="text-center py-8">
                {gameState === 'correct' && (
                  <>
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-500 mb-2">Correct!</h3>
                  </>
                )}
                {gameState === 'wrong' && (
                  <>
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-red-500 mb-2">Wrong!</h3>
                  </>
                )}
                {gameState === 'timeout' && (
                  <>
                    <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-yellow-500 mb-2">Time&apos;s Up!</h3>
                  </>
                )}
                <p className="text-lg mb-6">
                  The word was: <span className="font-bold text-blue-500 uppercase">{currentWord}</span>
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={startNewRound}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2"
                  >
                    Next Word
                  </button>
                  <button
                    onClick={startGame}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold flex items-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    New Game
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">How to Play</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Unscramble the letters to form a word from the chosen category</li>
            <li>Type your answer and submit before time runs out</li>
            <li>Build streaks for bonus points</li>
            <li>Use hints if you&apos;re stuck (costs points!)</li>
            <li>Faster answers earn more points</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

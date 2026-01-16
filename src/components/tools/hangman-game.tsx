'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Trophy, Heart, Lightbulb } from 'lucide-react'

type Category = 'animals' | 'countries' | 'movies' | 'food' | 'sports' | 'technology'

const WORDS: Record<Category, string[]> = {
  animals: ['elephant', 'giraffe', 'penguin', 'dolphin', 'kangaroo', 'butterfly', 'crocodile', 'hamster', 'squirrel', 'peacock', 'leopard', 'octopus'],
  countries: ['australia', 'brazil', 'canada', 'germany', 'japan', 'mexico', 'norway', 'sweden', 'thailand', 'vietnam', 'argentina', 'indonesia'],
  movies: ['inception', 'avatar', 'titanic', 'gladiator', 'interstellar', 'jaws', 'alien', 'matrix', 'frozen', 'coco'],
  food: ['pizza', 'burger', 'spaghetti', 'chocolate', 'sandwich', 'pancake', 'avocado', 'broccoli', 'strawberry', 'pineapple', 'lasagna', 'sushi'],
  sports: ['basketball', 'football', 'swimming', 'tennis', 'volleyball', 'baseball', 'hockey', 'cricket', 'boxing', 'cycling', 'surfing', 'archery'],
  technology: ['computer', 'keyboard', 'internet', 'software', 'database', 'algorithm', 'wireless', 'bluetooth', 'processor', 'monitor', 'javascript', 'python'],
}

const CATEGORY_LABELS: Record<Category, string> = {
  animals: 'Animals',
  countries: 'Countries',
  movies: 'Movies',
  food: 'Food',
  sports: 'Sports',
  technology: 'Technology',
}

const MAX_WRONG = 6

export function HangmanGame() {
  const [category, setCategory] = useState<Category>('animals')
  const [word, setWord] = useState('')
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [hintUsed, setHintUsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('hangmanHighScore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  const startGame = useCallback(() => {
    const categoryWords = WORDS[category]
    const randomWord = categoryWords[Math.floor(Math.random() * categoryWords.length)]
    setWord(randomWord.toLowerCase())
    setGuessedLetters(new Set())
    setWrongGuesses(0)
    setGameState('playing')
    setHintUsed(false)
  }, [category])

  const handleGuess = (letter: string) => {
    if (gameState !== 'playing' || guessedLetters.has(letter)) return

    const newGuessedLetters = new Set(guessedLetters)
    newGuessedLetters.add(letter)
    setGuessedLetters(newGuessedLetters)

    if (!word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1
      setWrongGuesses(newWrongGuesses)
      if (newWrongGuesses >= MAX_WRONG) {
        setGameState('lost')
        setStreak(0)
      }
    } else {
      // Check if won
      const isWon = word.split('').every(l => newGuessedLetters.has(l))
      if (isWon) {
        const points = (MAX_WRONG - wrongGuesses) * 10 + (hintUsed ? 0 : 20) + streak * 5
        const newScore = score + points
        setScore(newScore)
        setStreak(s => s + 1)
        if (newScore > highScore) {
          setHighScore(newScore)
          localStorage.setItem('hangmanHighScore', newScore.toString())
        }
        setGameState('won')
      }
    }
  }

  const useHint = () => {
    if (hintUsed || gameState !== 'playing') return

    // Find an unguessed letter in the word
    const unguessedLetters = word.split('').filter(l => !guessedLetters.has(l))
    if (unguessedLetters.length > 0) {
      const hintLetter = unguessedLetters[0]
      const newGuessedLetters = new Set(guessedLetters)
      newGuessedLetters.add(hintLetter)
      setGuessedLetters(newGuessedLetters)
      setHintUsed(true)

      // Check if won after hint
      const isWon = word.split('').every(l => newGuessedLetters.has(l))
      if (isWon) {
        const points = (MAX_WRONG - wrongGuesses) * 10
        const newScore = score + points
        setScore(newScore)
        setStreak(s => s + 1)
        if (newScore > highScore) {
          setHighScore(newScore)
          localStorage.setItem('hangmanHighScore', newScore.toString())
        }
        setGameState('won')
      }
    }
  }

  const renderHangman = () => {
    const parts = [
      // Head
      <circle key="head" cx="150" cy="70" r="20" stroke="currentColor" strokeWidth="3" fill="none" />,
      // Body
      <line key="body" x1="150" y1="90" x2="150" y2="150" stroke="currentColor" strokeWidth="3" />,
      // Left Arm
      <line key="leftArm" x1="150" y1="110" x2="120" y2="140" stroke="currentColor" strokeWidth="3" />,
      // Right Arm
      <line key="rightArm" x1="150" y1="110" x2="180" y2="140" stroke="currentColor" strokeWidth="3" />,
      // Left Leg
      <line key="leftLeg" x1="150" y1="150" x2="120" y2="190" stroke="currentColor" strokeWidth="3" />,
      // Right Leg
      <line key="rightLeg" x1="150" y1="150" x2="180" y2="190" stroke="currentColor" strokeWidth="3" />,
    ]

    return (
      <svg viewBox="0 0 300 220" className="w-full max-w-[250px] mx-auto text-foreground">
        {/* Gallows */}
        <line x1="50" y1="200" x2="250" y2="200" stroke="currentColor" strokeWidth="3" />
        <line x1="100" y1="200" x2="100" y2="20" stroke="currentColor" strokeWidth="3" />
        <line x1="100" y1="20" x2="150" y2="20" stroke="currentColor" strokeWidth="3" />
        <line x1="150" y1="20" x2="150" y2="50" stroke="currentColor" strokeWidth="3" />
        {/* Body parts based on wrong guesses */}
        {parts.slice(0, wrongGuesses)}
      </svg>
    )
  }

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Hangman</h1>
        <p className="text-muted-foreground">Guess the word before the hangman is complete!</p>
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
            {streak > 0 && (
              <div className="text-sm text-green-500">{streak} streak!</div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: MAX_WRONG - wrongGuesses }).map((_, i) => (
              <Heart key={i} className="w-5 h-5 text-red-500 fill-red-500" />
            ))}
          </div>
        </div>

        {/* Category Selection (only in idle) */}
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
            {/* Category Display */}
            <div className="text-center mb-4">
              <span className="text-sm text-muted-foreground">Category: </span>
              <span className="font-medium">{CATEGORY_LABELS[category]}</span>
            </div>

            {/* Hangman Drawing */}
            <div className="mb-6">
              {renderHangman()}
            </div>

            {/* Word Display */}
            <div className="flex justify-center gap-2 mb-8">
              {word.split('').map((letter, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-10 h-12 border-b-4 flex items-end justify-center pb-1 text-2xl font-bold ${
                    guessedLetters.has(letter) ? 'text-green-500' : ''
                  } ${gameState === 'lost' && !guessedLetters.has(letter) ? 'text-red-500' : ''}`}
                >
                  {guessedLetters.has(letter) || gameState === 'lost' ? letter.toUpperCase() : ''}
                </motion.div>
              ))}
            </div>

            {/* Keyboard */}
            {gameState === 'playing' && (
              <div className="space-y-4">
                <div className="flex flex-wrap justify-center gap-2">
                  {alphabet.map(letter => {
                    const isGuessed = guessedLetters.has(letter)
                    const isCorrect = word.includes(letter)
                    return (
                      <button
                        key={letter}
                        onClick={() => handleGuess(letter)}
                        disabled={isGuessed}
                        className={`w-9 h-10 rounded-lg font-semibold uppercase transition-colors ${
                          isGuessed
                            ? isCorrect
                              ? 'bg-green-600 text-white'
                              : 'bg-red-600 text-white opacity-50'
                            : 'bg-muted hover:bg-blue-600 hover:text-white'
                        }`}
                      >
                        {letter}
                      </button>
                    )
                  })}
                </div>

                {/* Hint Button */}
                <div className="flex justify-center">
                  <button
                    onClick={useHint}
                    disabled={hintUsed}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      hintUsed
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    }`}
                  >
                    <Lightbulb className="w-4 h-4" />
                    {hintUsed ? 'Hint Used' : 'Use Hint (-20 pts)'}
                  </button>
                </div>
              </div>
            )}

            {/* Result */}
            <AnimatePresence>
              {(gameState === 'won' || gameState === 'lost') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <h3 className={`text-2xl font-bold mb-2 ${gameState === 'won' ? 'text-green-500' : 'text-red-500'}`}>
                    {gameState === 'won' ? 'You Won!' : 'Game Over!'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    The word was: <span className="font-bold text-blue-500 uppercase">{word}</span>
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={startGame}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Play Again
                    </button>
                    <button
                      onClick={() => setGameState('idle')}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold"
                    >
                      Change Category
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">How to Play</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Guess one letter at a time to reveal the hidden word</li>
            <li>You have 6 wrong guesses before the hangman is complete</li>
            <li>Use the hint if you&apos;re stuck (costs 20 points)</li>
            <li>Build streaks for bonus points!</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, HelpCircle, X, Trophy, Share2 } from 'lucide-react'

const WORDS = [
  'REACT', 'WORLD', 'PIANO', 'ABOUT', 'HEART', 'HOUSE', 'MUSIC', 'PAINT',
  'STONE', 'BEACH', 'CLOUD', 'DREAM', 'FLAME', 'GHOST', 'GRAPE', 'HONEY',
  'ISLAND', 'JUICE', 'KNIFE', 'LEMON', 'MAGIC', 'NIGHT', 'OCEAN', 'PEACE',
  'QUEEN', 'RIVER', 'SNAKE', 'TIGER', 'UNDER', 'VOICE', 'WATER', 'YOUTH',
  'ZEBRA', 'BREAD', 'CHAIR', 'DANCE', 'EARTH', 'FRUIT', 'GREEN', 'HAPPY',
  'LIGHT', 'MONEY', 'NORTH', 'PARTY', 'QUICK', 'RADIO', 'SLEEP', 'TABLE',
  'THINK', 'TRACK', 'TRUST', 'BRAIN', 'BRAVE', 'CLEAR', 'CLOCK', 'CLOSE',
  'CRAFT', 'CROWN', 'DRIVE', 'EMPTY', 'EQUAL', 'EVENT', 'FIELD', 'FINAL'
]

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty'

interface Letter {
  char: string
  status: LetterStatus
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
]

export function WordleGame() {
  const [targetWord, setTargetWord] = useState('')
  const [guesses, setGuesses] = useState<Letter[][]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [showHelp, setShowHelp] = useState(false)
  const [shake, setShake] = useState(false)
  const [stats, setStats] = useState({ played: 0, won: 0, streak: 0, maxStreak: 0 })
  const [usedLetters, setUsedLetters] = useState<Record<string, LetterStatus>>({})

  const maxGuesses = 6
  const wordLength = 5

  useEffect(() => {
    // Load stats
    const saved = localStorage.getItem('wordle-stats')
    if (saved) setStats(JSON.parse(saved))

    startNewGame()
  }, [])

  const startNewGame = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)]
    setTargetWord(word)
    setGuesses([])
    setCurrentGuess('')
    setGameStatus('playing')
    setUsedLetters({})
  }

  const saveStats = (won: boolean) => {
    const newStats = {
      played: stats.played + 1,
      won: stats.won + (won ? 1 : 0),
      streak: won ? stats.streak + 1 : 0,
      maxStreak: won ? Math.max(stats.maxStreak, stats.streak + 1) : stats.maxStreak
    }
    setStats(newStats)
    localStorage.setItem('wordle-stats', JSON.stringify(newStats))
  }

  const checkGuess = (guess: string): Letter[] => {
    const result: Letter[] = []
    const targetLetters = targetWord.split('')
    const guessLetters = guess.split('')

    // First pass: find correct positions
    guessLetters.forEach((letter, i) => {
      if (letter === targetLetters[i]) {
        result[i] = { char: letter, status: 'correct' }
        targetLetters[i] = ''
      }
    })

    // Second pass: find present letters
    guessLetters.forEach((letter, i) => {
      if (result[i]) return

      const targetIndex = targetLetters.indexOf(letter)
      if (targetIndex !== -1) {
        result[i] = { char: letter, status: 'present' }
        targetLetters[targetIndex] = ''
      } else {
        result[i] = { char: letter, status: 'absent' }
      }
    })

    return result
  }

  const updateUsedLetters = (guess: Letter[]) => {
    const newUsed = { ...usedLetters }
    guess.forEach(({ char, status }) => {
      const current = newUsed[char]
      if (!current || status === 'correct' || (status === 'present' && current === 'absent')) {
        newUsed[char] = status
      }
    })
    setUsedLetters(newUsed)
  }

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== wordLength) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    const result = checkGuess(currentGuess)
    const newGuesses = [...guesses, result]
    setGuesses(newGuesses)
    updateUsedLetters(result)
    setCurrentGuess('')

    if (currentGuess === targetWord) {
      setGameStatus('won')
      saveStats(true)
    } else if (newGuesses.length >= maxGuesses) {
      setGameStatus('lost')
      saveStats(false)
    }
  }, [currentGuess, guesses, targetWord])

  const handleKeyPress = useCallback((key: string) => {
    if (gameStatus !== 'playing') return

    if (key === 'ENTER') {
      submitGuess()
    } else if (key === '⌫' || key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1))
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < wordLength) {
      setCurrentGuess(prev => prev + key)
    }
  }, [currentGuess, gameStatus, submitGuess])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      handleKeyPress(e.key.toUpperCase())
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleKeyPress])

  const getKeyStatus = (key: string): LetterStatus | undefined => {
    return usedLetters[key]
  }

  const shareResult = () => {
    const emojiGrid = guesses.map(row =>
      row.map(({ status }) => {
        if (status === 'correct') return '🟩'
        if (status === 'present') return '🟨'
        return '⬛'
      }).join('')
    ).join('\n')

    const text = `Wordle Clone ${guesses.length}/${maxGuesses}\n\n${emojiGrid}`
    navigator.clipboard.writeText(text)
    alert('Results copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Wordle</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowHelp(true)}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={startNewGame}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-6 text-center">
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-2xl font-bold text-white">{stats.played}</div>
            <div className="text-xs text-white/50">Played</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-2xl font-bold text-white">
              {stats.played ? Math.round((stats.won / stats.played) * 100) : 0}%
            </div>
            <div className="text-xs text-white/50">Win %</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-2xl font-bold text-white">{stats.streak}</div>
            <div className="text-xs text-white/50">Streak</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-2xl font-bold text-white">{stats.maxStreak}</div>
            <div className="text-xs text-white/50">Best</div>
          </div>
        </div>

        {/* Game Grid */}
        <div className="flex flex-col items-center gap-2 mb-6">
          {Array(maxGuesses).fill(null).map((_, rowIndex) => (
            <motion.div
              key={rowIndex}
              className={`flex gap-2 ${rowIndex === guesses.length && shake ? 'animate-shake' : ''}`}
            >
              {Array(wordLength).fill(null).map((_, colIndex) => {
                const guess = guesses[rowIndex]
                const letter = guess?.[colIndex]
                const isCurrentRow = rowIndex === guesses.length
                const currentLetter = isCurrentRow ? currentGuess[colIndex] : undefined

                return (
                  <motion.div
                    key={colIndex}
                    initial={letter ? { rotateX: 0 } : false}
                    animate={letter ? { rotateX: 360 } : {}}
                    transition={{ delay: colIndex * 0.1, duration: 0.5 }}
                    className={`w-14 h-14 flex items-center justify-center text-2xl font-bold rounded-lg border-2 ${
                      letter
                        ? letter.status === 'correct'
                          ? 'bg-green-500 border-green-500 text-white'
                          : letter.status === 'present'
                          ? 'bg-yellow-500 border-yellow-500 text-white'
                          : 'bg-gray-600 border-gray-600 text-white'
                        : currentLetter
                        ? 'border-white/50 text-white'
                        : 'border-white/20'
                    }`}
                  >
                    {letter?.char || currentLetter || ''}
                  </motion.div>
                )
              })}
            </motion.div>
          ))}
        </div>

        {/* Keyboard */}
        <div className="flex flex-col items-center gap-2">
          {KEYBOARD_ROWS.map((row, i) => (
            <div key={i} className="flex gap-1">
              {row.map(key => {
                const status = getKeyStatus(key)
                return (
                  <motion.button
                    key={key}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleKeyPress(key)}
                    className={`px-3 py-4 rounded-lg font-semibold text-sm transition-colors ${
                      key === 'ENTER' || key === '⌫'
                        ? 'px-4 bg-white/20 text-white hover:bg-white/30'
                        : status === 'correct'
                        ? 'bg-green-500 text-white'
                        : status === 'present'
                        ? 'bg-yellow-500 text-white'
                        : status === 'absent'
                        ? 'bg-gray-600 text-white/50'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {key}
                  </motion.button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Game Over Modal */}
        <AnimatePresence>
          {gameStatus !== 'playing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => {}}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-slate-800 rounded-2xl p-6 max-w-sm mx-4 text-center"
              >
                {gameStatus === 'won' ? (
                  <>
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                    <h3 className="text-2xl font-bold text-white mb-2">Congratulations!</h3>
                    <p className="text-white/70 mb-4">
                      You found the word in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}!
                    </p>
                  </>
                ) : (
                  <>
                    <X className="w-16 h-16 mx-auto mb-4 text-red-400" />
                    <h3 className="text-2xl font-bold text-white mb-2">Game Over</h3>
                    <p className="text-white/70 mb-4">
                      The word was <span className="font-bold text-white">{targetWord}</span>
                    </p>
                  </>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={shareResult}
                    className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button
                    onClick={startNewGame}
                    className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Play Again
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Modal */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowHelp(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-800 rounded-2xl p-6 max-w-md mx-4"
              >
                <h3 className="text-xl font-bold text-white mb-4">How to Play</h3>
                <p className="text-white/70 mb-4">
                  Guess the word in 6 tries. Each guess must be a valid 5-letter word.
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center text-white font-bold">W</div>
                    <span className="text-white/70">Correct letter, correct spot</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center text-white font-bold">O</div>
                    <span className="text-white/70">Correct letter, wrong spot</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-600 rounded flex items-center justify-center text-white font-bold">R</div>
                    <span className="text-white/70">Letter not in word</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowHelp(false)}
                  className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Got it!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}

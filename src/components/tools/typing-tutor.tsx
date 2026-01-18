'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Keyboard, Play, RotateCcw, Trophy, Target,
  Clock, Zap, BarChart2
} from 'lucide-react'

const LESSONS = {
  beginner: {
    name: 'Home Row',
    keys: 'asdfjkl;',
    texts: [
      'asdf jkl; asdf jkl; asdf jkl;',
      'aaa sss ddd fff jjj kkk lll ;;;',
      'sad lad fad jak ask dad add all',
      'fall dall sall jall kall lasslass',
      'flask flask flash flash flask dash'
    ]
  },
  easy: {
    name: 'Common Words',
    keys: 'all letters',
    texts: [
      'the quick brown fox jumps over the lazy dog',
      'pack my box with five dozen liquor jugs',
      'how vexingly quick daft zebras jump',
      'the five boxing wizards jump quickly',
      'sphinx of black quartz judge my vow'
    ]
  },
  medium: {
    name: 'Sentences',
    keys: 'all keys',
    texts: [
      'The programmer debugged the code and fixed the bug.',
      'JavaScript is a versatile programming language.',
      'Practice makes perfect when learning to type.',
      'Consistent practice leads to faster typing speeds.',
      'The keyboard is mightier than the mouse.'
    ]
  },
  hard: {
    name: 'Programming',
    keys: 'symbols',
    texts: [
      'const result = array.map(item => item * 2);',
      'function greet(name: string): void { console.log(`Hello, ${name}!`); }',
      'if (condition && otherCondition) { return true; }',
      'const [state, setState] = useState<number>(0);',
      'export default function Component({ props }: Props) { return <div />; }'
    ]
  }
}

type Difficulty = keyof typeof LESSONS

interface Stats {
  wpm: number
  accuracy: number
  time: number
  errors: number
}

export function TypingTutor() {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner')
  const [currentText, setCurrentText] = useState('')
  const [typedText, setTypedText] = useState('')
  const [isStarted, setIsStarted] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [errors, setErrors] = useState(0)
  const [currentErrors, setCurrentErrors] = useState<Set<number>>(new Set())
  const [stats, setStats] = useState<Stats | null>(null)
  const [history, setHistory] = useState<Stats[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('typing-tutor-history')
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }, [])

  const startLesson = useCallback(() => {
    const texts = LESSONS[difficulty].texts
    const text = texts[Math.floor(Math.random() * texts.length)]
    setCurrentText(text)
    setTypedText('')
    setIsStarted(true)
    setIsFinished(false)
    setStartTime(null)
    setErrors(0)
    setCurrentErrors(new Set())
    setStats(null)
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [difficulty])

  const calculateStats = useCallback(() => {
    if (!startTime) return

    const endTime = Date.now()
    const timeInMinutes = (endTime - startTime) / 60000
    const wordCount = currentText.split(' ').length
    const wpm = Math.round(wordCount / timeInMinutes)
    const accuracy = Math.round(((currentText.length - errors) / currentText.length) * 100)

    const newStats: Stats = {
      wpm,
      accuracy: Math.max(0, accuracy),
      time: Math.round((endTime - startTime) / 1000),
      errors
    }

    setStats(newStats)
    setHistory(prev => {
      const updated = [newStats, ...prev].slice(0, 20)
      localStorage.setItem('typing-tutor-history', JSON.stringify(updated))
      return updated
    })
  }, [startTime, currentText, errors])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (!startTime && value.length > 0) {
      setStartTime(Date.now())
    }

    // Check for errors
    const newErrors = new Set<number>()
    let errorCount = 0
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== currentText[i]) {
        newErrors.add(i)
        errorCount++
      }
    }
    setCurrentErrors(newErrors)
    setErrors(errorCount)
    setTypedText(value)

    // Check if finished
    if (value.length === currentText.length) {
      setIsFinished(true)
      calculateStats()
    }
  }

  const reset = () => {
    setTypedText('')
    setIsStarted(false)
    setIsFinished(false)
    setStartTime(null)
    setErrors(0)
    setCurrentErrors(new Set())
    setStats(null)
  }

  const getAverageWPM = () => {
    if (history.length === 0) return 0
    return Math.round(history.reduce((acc, s) => acc + s.wpm, 0) / history.length)
  }

  const getBestWPM = () => {
    if (history.length === 0) return 0
    return Math.max(...history.map(s => s.wpm))
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
          <h3 className="text-white font-bold flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-blue-400" />
            Typing Tutor
          </h3>
          {!isStarted && (
            <div className="flex gap-2">
              {(Object.keys(LESSONS) as Difficulty[]).map(diff => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-all ${
                    difficulty === diff
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stats Bar */}
        {history.length > 0 && !isStarted && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-blue-400">{getAverageWPM()}</div>
              <div className="text-white/50 text-xs">Avg WPM</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-green-400">{getBestWPM()}</div>
              <div className="text-white/50 text-xs">Best WPM</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-white">{history.length}</div>
              <div className="text-white/50 text-xs">Tests</div>
            </div>
          </div>
        )}

        {/* Start Screen */}
        {!isStarted && (
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="text-white font-medium">{LESSONS[difficulty].name}</div>
              <div className="text-white/50 text-sm">Focus: {LESSONS[difficulty].keys}</div>
            </div>
            <button
              onClick={startLesson}
              className="px-8 py-4 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-600 flex items-center gap-2 mx-auto"
            >
              <Play className="w-5 h-5" />
              Start Typing
            </button>
          </div>
        )}

        {/* Typing Area */}
        {isStarted && (
          <>
            {/* Text Display */}
            <div className="mb-4 p-6 bg-slate-900 rounded-xl font-mono text-lg leading-relaxed">
              {currentText.split('').map((char, i) => {
                let className = 'text-white/30'
                if (i < typedText.length) {
                  if (currentErrors.has(i)) {
                    className = 'text-red-400 bg-red-500/20'
                  } else {
                    className = 'text-green-400'
                  }
                } else if (i === typedText.length) {
                  className = 'text-white border-b-2 border-blue-400'
                }
                return (
                  <span key={i} className={className}>
                    {char}
                  </span>
                )
              })}
            </div>

            {/* Hidden Input */}
            <input
              ref={inputRef}
              type="text"
              value={typedText}
              onChange={handleInput}
              disabled={isFinished}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-mono opacity-0 absolute"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />

            {/* Click to focus overlay */}
            {!isFinished && (
              <div
                onClick={() => inputRef.current?.focus()}
                className="text-center text-white/50 text-sm cursor-pointer"
              >
                Click here or start typing
              </div>
            )}

            {/* Live Stats */}
            {startTime && !isFinished && (
              <div className="flex justify-center gap-8 mt-4 text-sm">
                <div className="flex items-center gap-1 text-white/50">
                  <Clock className="w-4 h-4" />
                  {Math.round((Date.now() - startTime) / 1000)}s
                </div>
                <div className="flex items-center gap-1 text-white/50">
                  <Target className="w-4 h-4" />
                  {Math.round((typedText.length / currentText.length) * 100)}%
                </div>
                <div className={`flex items-center gap-1 ${errors > 0 ? 'text-red-400' : 'text-white/50'}`}>
                  Errors: {errors}
                </div>
              </div>
            )}
          </>
        )}

        {/* Results */}
        <AnimatePresence>
          {isFinished && stats && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6"
            >
              <div className="text-center mb-6">
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">Completed!</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <Zap className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-white">{stats.wpm}</div>
                  <div className="text-white/50 text-sm">WPM</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <Target className="w-6 h-6 text-green-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-white">{stats.accuracy}%</div>
                  <div className="text-white/50 text-sm">Accuracy</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <Clock className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-white">{stats.time}s</div>
                  <div className="text-white/50 text-sm">Time</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <BarChart2 className="w-6 h-6 text-red-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-white">{stats.errors}</div>
                  <div className="text-white/50 text-sm">Errors</div>
                </div>
              </div>

              <div className="flex justify-center gap-2">
                <button
                  onClick={startLesson}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={reset}
                  className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Change Lesson
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

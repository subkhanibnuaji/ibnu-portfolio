'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen, Play, Pause, SkipForward, SkipBack,
  Settings, RotateCcw, Gauge, Eye
} from 'lucide-react'

const SAMPLE_TEXTS = [
  {
    title: 'The Art of Learning',
    content: `Learning is a journey that never truly ends. Each day presents new opportunities to grow and expand our understanding of the world around us. The key to effective learning lies not just in the absorption of information, but in the ability to connect new knowledge with what we already know. This process of integration is what transforms mere facts into meaningful understanding. As we develop our learning skills, we become better equipped to tackle new challenges and adapt to an ever-changing world. The most successful learners are those who remain curious and open-minded, always ready to question their assumptions and explore new perspectives.`
  },
  {
    title: 'The Power of Focus',
    content: `In our modern world filled with constant distractions, the ability to focus has become increasingly valuable. Deep focus allows us to accomplish complex tasks that require sustained attention and creative thinking. When we enter a state of flow, time seems to disappear as we become completely absorbed in our work. This state of optimal experience leads to both higher productivity and greater satisfaction. Developing the skill of focus requires practice and intentional effort. By creating the right environment and eliminating unnecessary distractions, we can train our minds to maintain attention for longer periods.`
  },
  {
    title: 'Innovation and Progress',
    content: `Throughout history, innovation has been the driving force behind human progress. From the invention of the wheel to the development of artificial intelligence, each breakthrough has transformed the way we live and work. Innovation often emerges from the intersection of different fields and perspectives. The most creative solutions come from those who are willing to challenge conventional thinking and explore unconventional approaches. In today's rapidly changing world, the ability to innovate is more important than ever. Organizations and individuals who embrace change and continuously seek improvement will be best positioned for success.`
  }
]

export function SpeedReader() {
  const [text, setText] = useState('')
  const [words, setWords] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [wpm, setWpm] = useState(300)
  const [showSettings, setShowSettings] = useState(false)
  const [chunkSize, setChunkSize] = useState(1)
  const [fontSize, setFontSize] = useState(48)
  const [highlightCenter, setHighlightCenter] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const loadText = (content: string) => {
    setText(content)
    const wordArray = content.split(/\s+/).filter(w => w.length > 0)
    setWords(wordArray)
    setCurrentIndex(0)
    setIsPlaying(false)
  }

  const getCurrentChunk = useCallback(() => {
    const chunk = words.slice(currentIndex, currentIndex + chunkSize)
    return chunk.join(' ')
  }, [words, currentIndex, chunkSize])

  const play = useCallback(() => {
    if (currentIndex >= words.length) {
      setCurrentIndex(0)
    }
    setIsPlaying(true)
  }, [currentIndex, words.length])

  const pause = () => {
    setIsPlaying(false)
  }

  const reset = () => {
    setCurrentIndex(0)
    setIsPlaying(false)
  }

  const skipForward = () => {
    setCurrentIndex(Math.min(currentIndex + 10, words.length - 1))
  }

  const skipBack = () => {
    setCurrentIndex(Math.max(currentIndex - 10, 0))
  }

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / wpm) * 1000 * chunkSize
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const next = prev + chunkSize
          if (next >= words.length) {
            setIsPlaying(false)
            return prev
          }
          return next
        })
      }, interval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, wpm, chunkSize, words.length])

  const renderWord = () => {
    const chunk = getCurrentChunk()
    if (!chunk) return null

    if (highlightCenter && chunk.length > 0) {
      // Find optimal recognition point (ORP) - usually around 30% from the left
      const orpIndex = Math.floor(chunk.length * 0.3)
      const before = chunk.slice(0, orpIndex)
      const orp = chunk[orpIndex]
      const after = chunk.slice(orpIndex + 1)

      return (
        <span>
          <span className="text-white/50">{before}</span>
          <span className="text-red-400">{orp}</span>
          <span className="text-white/50">{after}</span>
        </span>
      )
    }

    return <span className="text-white">{chunk}</span>
  }

  const progress = words.length > 0 ? (currentIndex / words.length) * 100 : 0
  const remainingTime = words.length > 0
    ? Math.ceil(((words.length - currentIndex) / wpm) * 60)
    : 0

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
            <BookOpen className="w-5 h-5 text-green-400" />
            Speed Reader
          </h3>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${
              showSettings ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-white/5 rounded-xl space-y-4"
          >
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  Speed: {wpm} WPM
                </span>
              </label>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={wpm}
                onChange={(e) => setWpm(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-white/70 text-sm mb-2 block">
                Words per chunk: {chunkSize}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={chunkSize}
                onChange={(e) => setChunkSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-white/70 text-sm mb-2 block">
                Font size: {fontSize}px
              </label>
              <input
                type="range"
                min="24"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={highlightCenter}
                onChange={(e) => setHighlightCenter(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-white/70 text-sm flex items-center gap-1">
                <Eye className="w-4 h-4" />
                Highlight focus point
              </span>
            </label>
          </motion.div>
        )}

        {/* Text Input or Sample Selection */}
        {!text && (
          <div className="mb-6">
            <label className="text-white/70 text-sm mb-2 block">Choose a sample or paste your own text</label>
            <div className="grid gap-2 mb-4">
              {SAMPLE_TEXTS.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => loadText(sample.content)}
                  className="p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 transition-colors"
                >
                  <div className="text-white font-medium">{sample.title}</div>
                  <div className="text-white/50 text-sm truncate">{sample.content.slice(0, 80)}...</div>
                </button>
              ))}
            </div>
            <textarea
              placeholder="Or paste your own text here..."
              className="w-full h-32 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 resize-none"
              onChange={(e) => e.target.value && loadText(e.target.value)}
            />
          </div>
        )}

        {/* Reading Display */}
        {text && (
          <>
            {/* Word Display */}
            <div className="mb-6">
              <div
                className="min-h-32 bg-slate-900 rounded-xl flex items-center justify-center p-8"
              >
                <div
                  className="font-bold text-center"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {renderWord() || <span className="text-white/30">Ready</span>}
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-white/50 mb-1">
                <span>{currentIndex} / {words.length} words</span>
                <span>{Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')} remaining</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={skipBack}
                disabled={currentIndex === 0}
                className="p-3 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              {isPlaying ? (
                <button
                  onClick={pause}
                  className="p-4 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600"
                >
                  <Pause className="w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={play}
                  className="p-4 bg-green-500 text-white rounded-xl hover:bg-green-600"
                >
                  <Play className="w-6 h-6" />
                </button>
              )}

              <button
                onClick={skipForward}
                disabled={currentIndex >= words.length - 1}
                className="p-3 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={reset}
                className="p-3 bg-white/10 text-white rounded-lg hover:bg-white/20 ml-4"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Change Text */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setText('')}
                className="text-white/50 text-sm hover:text-white/70"
              >
                Change text
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

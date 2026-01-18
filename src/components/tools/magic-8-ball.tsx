'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, HelpCircle, RotateCcw } from 'lucide-react'

const RESPONSES = [
  // Positive
  { text: 'It is certain', type: 'positive' },
  { text: 'It is decidedly so', type: 'positive' },
  { text: 'Without a doubt', type: 'positive' },
  { text: 'Yes definitely', type: 'positive' },
  { text: 'You may rely on it', type: 'positive' },
  { text: 'As I see it, yes', type: 'positive' },
  { text: 'Most likely', type: 'positive' },
  { text: 'Outlook good', type: 'positive' },
  { text: 'Yes', type: 'positive' },
  { text: 'Signs point to yes', type: 'positive' },
  // Neutral
  { text: 'Reply hazy, try again', type: 'neutral' },
  { text: 'Ask again later', type: 'neutral' },
  { text: 'Better not tell you now', type: 'neutral' },
  { text: 'Cannot predict now', type: 'neutral' },
  { text: 'Concentrate and ask again', type: 'neutral' },
  // Negative
  { text: "Don't count on it", type: 'negative' },
  { text: 'My reply is no', type: 'negative' },
  { text: 'My sources say no', type: 'negative' },
  { text: 'Outlook not so good', type: 'negative' },
  { text: 'Very doubtful', type: 'negative' }
]

export function Magic8Ball() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<typeof RESPONSES[0] | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const [history, setHistory] = useState<{ question: string; answer: typeof RESPONSES[0] }[]>([])

  const askQuestion = () => {
    if (!question.trim() || isShaking) return

    setIsShaking(true)
    setAnswer(null)

    setTimeout(() => {
      const randomAnswer = RESPONSES[Math.floor(Math.random() * RESPONSES.length)]
      setAnswer(randomAnswer)
      setHistory(prev => [{ question: question.trim(), answer: randomAnswer }, ...prev].slice(0, 10))
      setIsShaking(false)
    }, 2000)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-400'
      case 'negative': return 'text-red-400'
      default: return 'text-yellow-400'
    }
  }

  const reset = () => {
    setQuestion('')
    setAnswer(null)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Question Input */}
        <div className="mb-8">
          <label className="text-white/70 text-sm mb-2 block flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Ask a Yes/No Question
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
              placeholder="Will I be successful?"
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30"
              disabled={isShaking}
            />
            <button
              onClick={askQuestion}
              disabled={!question.trim() || isShaking}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Ask
            </button>
          </div>
        </div>

        {/* Magic 8 Ball */}
        <div className="flex justify-center mb-8">
          <motion.div
            animate={isShaking ? {
              x: [-10, 10, -10, 10, -5, 5, 0],
              y: [-5, 5, -5, 5, -3, 3, 0],
              rotate: [-5, 5, -5, 5, -3, 3, 0]
            } : {}}
            transition={{ duration: 0.5, repeat: isShaking ? 3 : 0 }}
            className="relative w-64 h-64 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl flex items-center justify-center cursor-pointer"
            onClick={askQuestion}
          >
            {/* Outer ring */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-900 to-black" />

            {/* White circle (window) */}
            <motion.div
              className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center shadow-inner"
            >
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-blue-900 to-indigo-950" />

              <AnimatePresence mode="wait">
                {isShaking ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-8 h-8 text-white/50" />
                    </motion.div>
                  </motion.div>
                ) : answer ? (
                  <motion.div
                    key="answer"
                    initial={{ opacity: 0, scale: 0.5, rotateX: 90 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10 p-2"
                  >
                    <div className={`text-center font-bold text-sm ${getTypeColor(answer.type)}`}>
                      {answer.text}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10 text-white text-5xl font-bold"
                  >
                    8
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Shine effect */}
            <div className="absolute top-4 left-8 w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-sm" />
          </motion.div>
        </div>

        {/* Instructions */}
        <div className="text-center text-white/50 text-sm mb-6">
          Click the ball or press Enter to reveal your answer
        </div>

        {/* Reset button */}
        {answer && (
          <div className="flex justify-center">
            <button
              onClick={reset}
              className="px-4 py-2 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Ask Another Question
            </button>
          </div>
        )}
      </motion.div>

      {/* History */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white font-bold mb-4">Recent Questions</h3>
          <div className="space-y-3">
            {history.map((item, i) => (
              <div
                key={i}
                className="p-3 bg-white/5 rounded-lg"
              >
                <div className="text-white/70 text-sm mb-1">{item.question}</div>
                <div className={`font-medium ${getTypeColor(item.answer.type)}`}>
                  {item.answer.text}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

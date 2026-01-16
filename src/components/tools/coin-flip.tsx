'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, History, TrendingUp } from 'lucide-react'

type CoinSide = 'heads' | 'tails'

interface FlipResult {
  result: CoinSide
  timestamp: Date
}

export function CoinFlip() {
  const [isFlipping, setIsFlipping] = useState(false)
  const [currentResult, setCurrentResult] = useState<CoinSide | null>(null)
  const [history, setHistory] = useState<FlipResult[]>([])
  const [flipCount, setFlipCount] = useState(0)
  const [showStats, setShowStats] = useState(false)

  const stats = {
    total: history.length,
    heads: history.filter(h => h.result === 'heads').length,
    tails: history.filter(h => h.result === 'tails').length,
    headsPercent: history.length > 0
      ? ((history.filter(h => h.result === 'heads').length / history.length) * 100).toFixed(1)
      : '0',
    tailsPercent: history.length > 0
      ? ((history.filter(h => h.result === 'tails').length / history.length) * 100).toFixed(1)
      : '0',
  }

  const flipCoin = () => {
    if (isFlipping) return

    setIsFlipping(true)
    setFlipCount(prev => prev + 1)

    // Random number of flips for animation
    const flips = Math.floor(Math.random() * 5) + 5

    setTimeout(() => {
      const result: CoinSide = Math.random() < 0.5 ? 'heads' : 'tails'
      setCurrentResult(result)
      setHistory(prev => [{ result, timestamp: new Date() }, ...prev].slice(0, 100))
      setIsFlipping(false)
    }, flips * 150)
  }

  const resetStats = () => {
    setHistory([])
    setCurrentResult(null)
    setFlipCount(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Coin Flip</h1>
        <p className="text-muted-foreground">Flip a virtual coin for random decisions</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Coin Display */}
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{
              rotateY: isFlipping ? flipCount * 180 : currentResult === 'tails' ? 180 : 0,
            }}
            transition={{
              duration: isFlipping ? 0.15 : 0.5,
              repeat: isFlipping ? Infinity : 0,
            }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative w-40 h-40"
          >
            {/* Heads Side */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-4xl font-bold text-yellow-900 shadow-lg border-4 border-yellow-500"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="flex flex-col items-center">
                <span className="text-5xl">👑</span>
                <span className="text-sm mt-1">HEADS</span>
              </div>
            </div>

            {/* Tails Side */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-4xl font-bold text-yellow-900 shadow-lg border-4 border-yellow-600"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="flex flex-col items-center">
                <span className="text-5xl">🦅</span>
                <span className="text-sm mt-1">TAILS</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Result Display */}
        <AnimatePresence mode="wait">
          {currentResult && !isFlipping && (
            <motion.div
              key={flipCount}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-center mb-6"
            >
              <span className={`text-3xl font-bold ${
                currentResult === 'heads' ? 'text-yellow-500' : 'text-yellow-600'
              }`}>
                {currentResult.toUpperCase()}!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flip Button */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={flipCoin}
            disabled={isFlipping}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-xl font-semibold text-lg transition-colors"
          >
            {isFlipping ? 'Flipping...' : 'Flip Coin'}
          </button>
          <button
            onClick={resetStats}
            className="px-4 py-4 bg-muted hover:bg-muted/80 rounded-xl"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Toggle */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <TrendingUp className="w-4 h-4" />
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
        </div>

        {/* Statistics */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-muted/50 rounded-lg mb-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Statistics
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-xs text-muted-foreground">Total Flips</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-500">{stats.heads}</div>
                    <div className="text-xs text-muted-foreground">Heads ({stats.headsPercent}%)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{stats.tails}</div>
                    <div className="text-xs text-muted-foreground">Tails ({stats.tailsPercent}%)</div>
                  </div>
                </div>

                {/* Visual Bar */}
                {stats.total > 0 && (
                  <div className="h-4 rounded-full overflow-hidden bg-muted flex">
                    <div
                      className="bg-yellow-500 transition-all"
                      style={{ width: `${stats.headsPercent}%` }}
                    />
                    <div
                      className="bg-yellow-600 transition-all"
                      style={{ width: `${stats.tailsPercent}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Recent History */}
              {history.length > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Recent Flips
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {history.slice(0, 20).map((flip, i) => (
                      <span
                        key={i}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          flip.result === 'heads'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-yellow-600/20 text-yellow-600'
                        }`}
                      >
                        {flip.result === 'heads' ? 'H' : 'T'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

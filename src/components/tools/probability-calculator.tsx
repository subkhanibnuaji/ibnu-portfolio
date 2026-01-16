'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Percent, Dice1, Calculator } from 'lucide-react'

type Mode = 'single' | 'multiple' | 'atLeast'

function factorial(n: number): number {
  if (n <= 1) return 1
  let result = 1
  for (let i = 2; i <= n; i++) result *= i
  return result
}

function combination(n: number, r: number): number {
  if (r > n) return 0
  return factorial(n) / (factorial(r) * factorial(n - r))
}

function binomialProbability(n: number, k: number, p: number): number {
  return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k)
}

export function ProbabilityCalculator() {
  const [mode, setMode] = useState<Mode>('single')

  // Single event
  const [favorable, setFavorable] = useState('')
  const [total, setTotal] = useState('')

  // Multiple trials
  const [probability, setProbability] = useState('')
  const [trials, setTrials] = useState('')
  const [successes, setSuccesses] = useState('')

  const singleResult = useMemo(() => {
    const fav = parseInt(favorable) || 0
    const tot = parseInt(total) || 0
    if (tot <= 0 || fav < 0) return null

    const prob = fav / tot
    return {
      probability: prob,
      percentage: (prob * 100).toFixed(2),
      odds: fav > 0 ? `${fav} : ${tot - fav}` : '0 : ' + tot,
      oddsAgainst: fav > 0 && tot > fav ? `${tot - fav} : ${fav}` : 'N/A',
    }
  }, [favorable, total])

  const multipleResult = useMemo(() => {
    const p = parseFloat(probability) / 100
    const n = parseInt(trials) || 0
    const k = parseInt(successes) || 0

    if (p < 0 || p > 1 || n <= 0 || k < 0 || k > n) return null

    if (mode === 'multiple') {
      // Exactly k successes
      const prob = binomialProbability(n, k, p)
      return {
        probability: prob,
        percentage: (prob * 100).toFixed(4),
        description: `Exactly ${k} success${k !== 1 ? 'es' : ''} in ${n} trials`,
      }
    } else {
      // At least k successes
      let prob = 0
      for (let i = k; i <= n; i++) {
        prob += binomialProbability(n, i, p)
      }
      return {
        probability: prob,
        percentage: (prob * 100).toFixed(4),
        description: `At least ${k} success${k !== 1 ? 'es' : ''} in ${n} trials`,
      }
    }
  }, [mode, probability, trials, successes])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Probability Calculator</h1>
        <p className="text-muted-foreground">Calculate probabilities for various scenarios</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Mode Selection */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'single', label: 'Single Event', icon: Dice1 },
            { id: 'multiple', label: 'Exact Success', icon: Calculator },
            { id: 'atLeast', label: 'At Least', icon: Percent },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id as Mode)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm transition-colors ${
                mode === id ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Single Event */}
        {mode === 'single' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Favorable Outcomes</label>
              <input
                type="number"
                value={favorable}
                onChange={(e) => setFavorable(e.target.value)}
                placeholder="Number of favorable outcomes"
                min="0"
                className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Total Possible Outcomes</label>
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="Total number of possible outcomes"
                min="1"
                className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {singleResult && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-blue-500/10 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">Probability</div>
                  <div className="text-2xl font-bold text-blue-500">{singleResult.percentage}%</div>
                  <div className="text-xs text-muted-foreground">
                    {singleResult.probability.toFixed(4)}
                  </div>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">Odds (for : against)</div>
                  <div className="text-xl font-bold text-green-500">{singleResult.odds}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Multiple Trials */}
        {(mode === 'multiple' || mode === 'atLeast') && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Probability of Success (%)
              </label>
              <input
                type="number"
                value={probability}
                onChange={(e) => setProbability(e.target.value)}
                placeholder="e.g., 50 for 50%"
                min="0"
                max="100"
                step="0.1"
                className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Number of Trials</label>
              <input
                type="number"
                value={trials}
                onChange={(e) => setTrials(e.target.value)}
                placeholder="e.g., 10"
                min="1"
                className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {mode === 'multiple' ? 'Exact Number of Successes' : 'Minimum Successes'}
              </label>
              <input
                type="number"
                value={successes}
                onChange={(e) => setSuccesses(e.target.value)}
                placeholder="e.g., 3"
                min="0"
                className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {multipleResult && (
              <div className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg text-center">
                <div className="text-sm text-muted-foreground mb-2">{multipleResult.description}</div>
                <div className="text-3xl font-bold">{multipleResult.percentage}%</div>
                <div className="text-sm text-muted-foreground mt-1">
                  ({multipleResult.probability.toFixed(6)})
                </div>
              </div>
            )}
          </div>
        )}

        {/* Examples */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Examples</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Coin flip:</strong> 1 favorable (heads), 2 total = 50%</p>
            <p><strong>Dice roll (getting 6):</strong> 1 favorable, 6 total = 16.67%</p>
            <p><strong>Card draw (Ace):</strong> 4 favorable, 52 total = 7.69%</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

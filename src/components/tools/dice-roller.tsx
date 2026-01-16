'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, RotateCcw, Plus, Minus, History } from 'lucide-react'

type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100'

interface DiceConfig {
  type: DiceType
  count: number
}

interface RollResult {
  dice: DiceConfig[]
  rolls: number[][]
  total: number
  modifier: number
  timestamp: Date
}

const DICE_FACES: Record<DiceType, number> = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
  d100: 100,
}

const DICE_COLORS: Record<DiceType, string> = {
  d4: 'bg-red-500',
  d6: 'bg-blue-500',
  d8: 'bg-green-500',
  d10: 'bg-purple-500',
  d12: 'bg-yellow-500',
  d20: 'bg-pink-500',
  d100: 'bg-cyan-500',
}

export function DiceRoller() {
  const [diceConfigs, setDiceConfigs] = useState<DiceConfig[]>([
    { type: 'd20', count: 1 },
  ])
  const [modifier, setModifier] = useState(0)
  const [rolling, setRolling] = useState(false)
  const [currentResult, setCurrentResult] = useState<RollResult | null>(null)
  const [history, setHistory] = useState<RollResult[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const rollDice = () => {
    setRolling(true)

    // Animate for 500ms
    setTimeout(() => {
      const rolls: number[][] = diceConfigs.map(config => {
        const results: number[] = []
        for (let i = 0; i < config.count; i++) {
          results.push(Math.floor(Math.random() * DICE_FACES[config.type]) + 1)
        }
        return results
      })

      const total = rolls.flat().reduce((a, b) => a + b, 0) + modifier

      const result: RollResult = {
        dice: diceConfigs,
        rolls,
        total,
        modifier,
        timestamp: new Date(),
      }

      setCurrentResult(result)
      setHistory(prev => [result, ...prev].slice(0, 20))
      setRolling(false)
    }, 500)
  }

  const addDice = (type: DiceType) => {
    const existing = diceConfigs.find(d => d.type === type)
    if (existing) {
      setDiceConfigs(diceConfigs.map(d =>
        d.type === type ? { ...d, count: d.count + 1 } : d
      ))
    } else {
      setDiceConfigs([...diceConfigs, { type, count: 1 }])
    }
  }

  const removeDice = (type: DiceType) => {
    const existing = diceConfigs.find(d => d.type === type)
    if (existing && existing.count > 1) {
      setDiceConfigs(diceConfigs.map(d =>
        d.type === type ? { ...d, count: d.count - 1 } : d
      ))
    } else {
      setDiceConfigs(diceConfigs.filter(d => d.type !== type))
    }
  }

  const clearDice = () => {
    setDiceConfigs([])
    setModifier(0)
    setCurrentResult(null)
  }

  const getDiceNotation = () => {
    const parts = diceConfigs.map(d => `${d.count}${d.type}`)
    const notation = parts.join(' + ')
    if (modifier > 0) return `${notation} + ${modifier}`
    if (modifier < 0) return `${notation} - ${Math.abs(modifier)}`
    return notation || 'No dice selected'
  }

  const getDiceIcon = (value: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]
    return icons[Math.min(value - 1, 5)]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Dice Roller</h1>
        <p className="text-muted-foreground">Roll any combination of RPG dice</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Dice Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Select Dice</h3>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(DICE_FACES) as DiceType[]).map(type => {
              const config = diceConfigs.find(d => d.type === type)
              return (
                <div
                  key={type}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-colors ${
                    config ? 'border-blue-500 bg-blue-500/10' : 'border-muted'
                  }`}
                >
                  <button
                    onClick={() => removeDice(type)}
                    className="p-1 hover:bg-muted rounded"
                    disabled={!config}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2 min-w-[60px] justify-center">
                    <div className={`w-3 h-3 rounded-full ${DICE_COLORS[type]}`} />
                    <span className="font-mono font-semibold">
                      {config ? config.count : 0}{type}
                    </span>
                  </div>
                  <button
                    onClick={() => addDice(type)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Modifier */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="text-sm text-muted-foreground">Modifier:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModifier(m => m - 1)}
              className="p-2 bg-muted hover:bg-muted/80 rounded-lg"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono text-xl w-12 text-center">
              {modifier >= 0 ? `+${modifier}` : modifier}
            </span>
            <button
              onClick={() => setModifier(m => m + 1)}
              className="p-2 bg-muted hover:bg-muted/80 rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dice Notation */}
        <div className="text-center mb-6">
          <span className="font-mono text-lg text-muted-foreground">{getDiceNotation()}</span>
        </div>

        {/* Roll Button */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={rollDice}
            disabled={diceConfigs.length === 0 || rolling}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-semibold text-lg flex items-center gap-2"
          >
            {rolling ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.3 }}
              >
                <Dice6 className="w-6 h-6" />
              </motion.div>
            ) : (
              <Dice6 className="w-6 h-6" />
            )}
            {rolling ? 'Rolling...' : 'Roll Dice'}
          </button>
          <button
            onClick={clearDice}
            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Result */}
        <AnimatePresence>
          {currentResult && !rolling && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center mb-6"
            >
              <div className="text-6xl font-bold text-blue-500 mb-4">
                {currentResult.total}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {currentResult.rolls.map((diceRolls, diceIndex) =>
                  diceRolls.map((roll, rollIndex) => {
                    const DiceIcon = getDiceIcon(roll)
                    const isMax = roll === DICE_FACES[currentResult.dice[diceIndex].type]
                    const isMin = roll === 1
                    return (
                      <div
                        key={`${diceIndex}-${rollIndex}`}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg ${
                          isMax ? 'bg-green-500/20 text-green-500' :
                          isMin ? 'bg-red-500/20 text-red-500' :
                          'bg-muted'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${DICE_COLORS[currentResult.dice[diceIndex].type]}`} />
                        <span className="font-mono font-semibold">{roll}</span>
                      </div>
                    )
                  })
                )}
                {currentResult.modifier !== 0 && (
                  <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-yellow-500/20 text-yellow-500">
                    <span className="font-mono font-semibold">
                      {currentResult.modifier >= 0 ? `+${currentResult.modifier}` : currentResult.modifier}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Toggle */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg flex items-center gap-2 text-sm"
          >
            <History className="w-4 h-4" />
            {showHistory ? 'Hide' : 'Show'} History ({history.length})
          </button>
        </div>

        {/* History */}
        <AnimatePresence>
          {showHistory && history.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="max-h-48 overflow-y-auto space-y-2">
                {history.map((result, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg text-sm">
                    <span className="font-mono text-muted-foreground">
                      {result.dice.map(d => `${d.count}${d.type}`).join('+')}
                      {result.modifier !== 0 && (result.modifier > 0 ? `+${result.modifier}` : result.modifier)}
                    </span>
                    <span className="font-bold">{result.total}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">How to Use</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Click + to add dice, - to remove them</li>
            <li>Add modifiers with the +/- buttons</li>
            <li>Click Roll to roll all selected dice</li>
            <li>Green results are max rolls, red are 1s</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

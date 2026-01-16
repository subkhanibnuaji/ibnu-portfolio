'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Users, Percent, Receipt, Minus, Plus } from 'lucide-react'

const TIP_PRESETS = [10, 15, 18, 20, 25]

export function TipCalculator() {
  const [billAmount, setBillAmount] = useState('')
  const [tipPercent, setTipPercent] = useState(18)
  const [customTip, setCustomTip] = useState('')
  const [splitCount, setSplitCount] = useState(1)
  const [roundUp, setRoundUp] = useState(false)

  const calculations = useMemo(() => {
    const bill = parseFloat(billAmount) || 0
    const tip = customTip ? parseFloat(customTip) : tipPercent

    let tipAmount = bill * (tip / 100)
    let total = bill + tipAmount

    if (roundUp) {
      total = Math.ceil(total)
      tipAmount = total - bill
    }

    const perPerson = splitCount > 0 ? total / splitCount : total
    const tipPerPerson = splitCount > 0 ? tipAmount / splitCount : tipAmount

    return {
      tipAmount,
      total,
      perPerson,
      tipPerPerson,
      effectiveTipPercent: bill > 0 ? (tipAmount / bill) * 100 : 0,
    }
  }, [billAmount, tipPercent, customTip, splitCount, roundUp])

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Tip Calculator</h1>
        <p className="text-muted-foreground">Calculate tips and split bills easily</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Bill Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Bill Amount</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full pl-12 pr-4 py-3 bg-muted rounded-lg text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tip Percentage */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Tip Percentage</label>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {TIP_PRESETS.map(preset => (
              <button
                key={preset}
                onClick={() => { setTipPercent(preset); setCustomTip(''); }}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  tipPercent === preset && !customTip
                    ? 'bg-blue-600 text-white'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="number"
              value={customTip}
              onChange={(e) => setCustomTip(e.target.value)}
              placeholder="Custom %"
              min="0"
              max="100"
              className="w-full px-4 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <Percent className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* Split Bill */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Split Between</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
              className="p-3 bg-muted hover:bg-muted/80 rounded-lg"
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="flex-1 flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{splitCount}</span>
              <span className="text-muted-foreground">
                {splitCount === 1 ? 'person' : 'people'}
              </span>
            </div>
            <button
              onClick={() => setSplitCount(splitCount + 1)}
              className="p-3 bg-muted hover:bg-muted/80 rounded-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Round Up Option */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={roundUp}
              onChange={(e) => setRoundUp(e.target.checked)}
              className="w-5 h-5 rounded"
            />
            <span className="text-sm">Round up total</span>
          </label>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Tip Amount */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Receipt className="w-5 h-5" />
                <span>Tip Amount</span>
              </div>
              <span className="text-xl font-bold">{formatCurrency(calculations.tipAmount)}</span>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              ({calculations.effectiveTipPercent.toFixed(1)}%)
            </div>
          </div>

          {/* Total */}
          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total</span>
              <span className="text-2xl font-bold text-blue-500">
                {formatCurrency(calculations.total)}
              </span>
            </div>
          </div>

          {/* Per Person (if split) */}
          {splitCount > 1 && (
            <div className="p-4 bg-green-500/10 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Per Person</span>
                <span className="text-xl font-bold text-green-500">
                  {formatCurrency(calculations.perPerson)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Tip per person</span>
                <span className="text-muted-foreground">
                  {formatCurrency(calculations.tipPerPerson)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Tips Guide */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Tipping Guide</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 15% - Standard service</li>
            <li>• 18% - Good service</li>
            <li>• 20%+ - Excellent service</li>
            <li>• 25%+ - Outstanding service</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

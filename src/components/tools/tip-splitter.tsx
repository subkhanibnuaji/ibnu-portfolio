'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Receipt, Users, Percent, DollarSign, Plus, Minus,
  RotateCcw, Copy, Check
} from 'lucide-react'

export function TipSplitter() {
  const [billAmount, setBillAmount] = useState('')
  const [tipPercent, setTipPercent] = useState(18)
  const [people, setPeople] = useState(2)
  const [customTip, setCustomTip] = useState('')
  const [copied, setCopied] = useState(false)

  const tipPresets = [10, 15, 18, 20, 25]

  const bill = parseFloat(billAmount) || 0
  const tip = customTip ? parseFloat(customTip) : tipPercent
  const tipAmount = bill * (tip / 100)
  const totalAmount = bill + tipAmount
  const perPerson = people > 0 ? totalAmount / people : 0
  const tipPerPerson = people > 0 ? tipAmount / people : 0

  const reset = () => {
    setBillAmount('')
    setTipPercent(18)
    setPeople(2)
    setCustomTip('')
  }

  const copyResult = () => {
    const text = `Bill: $${bill.toFixed(2)}
Tip (${tip}%): $${tipAmount.toFixed(2)}
Total: $${totalAmount.toFixed(2)}
Split ${people} ways: $${perPerson.toFixed(2)} each`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const adjustPeople = (delta: number) => {
    setPeople(Math.max(1, people + delta))
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Bill Amount */}
        <div className="mb-6">
          <label className="text-white/70 text-sm mb-2 block flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Bill Amount
          </label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white text-2xl font-bold placeholder:text-white/30"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* Tip Selection */}
        <div className="mb-6">
          <label className="text-white/70 text-sm mb-2 block flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Tip Percentage
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {tipPresets.map(preset => (
              <button
                key={preset}
                onClick={() => {
                  setTipPercent(preset)
                  setCustomTip('')
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  tipPercent === preset && !customTip
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
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
              placeholder="Custom tip %"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/30"
              step="0.5"
              min="0"
              max="100"
            />
            <Percent className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          </div>
        </div>

        {/* Number of People */}
        <div className="mb-6">
          <label className="text-white/70 text-sm mb-2 block flex items-center gap-2">
            <Users className="w-4 h-4" />
            Number of People
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => adjustPeople(-1)}
              disabled={people <= 1}
              className="p-3 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="text-4xl font-bold text-white w-20 text-center">
              {people}
            </div>
            <button
              onClick={() => adjustPeople(1)}
              className="p-3 bg-white/10 text-white rounded-lg hover:bg-white/20"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results */}
        {bill > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="h-px bg-white/10" />

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-white/50 text-sm mb-1">Tip Amount</div>
                <div className="text-2xl font-bold text-green-400">
                  ${tipAmount.toFixed(2)}
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-white/50 text-sm mb-1">Total</div>
                <div className="text-2xl font-bold text-white">
                  ${totalAmount.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6 text-center">
              <div className="text-white/50 text-sm mb-1">Each Person Pays</div>
              <div className="text-4xl font-bold text-white mb-1">
                ${perPerson.toFixed(2)}
              </div>
              <div className="text-white/50 text-sm">
                (${(bill / people).toFixed(2)} + ${tipPerPerson.toFixed(2)} tip)
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/70 text-sm mb-2">Breakdown per person</div>
              <div className="space-y-2">
                <div className="flex justify-between text-white/70">
                  <span>Bill share</span>
                  <span>${(bill / people).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Tip share ({tip}%)</span>
                  <span>${tipPerPerson.toFixed(2)}</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between text-white font-medium">
                  <span>Total per person</span>
                  <span>${perPerson.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={copyResult}
                className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={reset}
                className="px-4 py-3 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Tag, Percent, DollarSign, TrendingDown } from 'lucide-react'

const PRESET_DISCOUNTS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80]

export function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [discountAmount, setDiscountAmount] = useState('')
  const [finalPrice, setFinalPrice] = useState('')
  const [mode, setMode] = useState<'percent' | 'amount' | 'final'>('percent')

  const calculations = useMemo(() => {
    const original = parseFloat(originalPrice) || 0

    if (original <= 0) {
      return {
        discount: 0,
        savings: 0,
        final: 0,
        percentOff: 0,
      }
    }

    let discount = 0
    let final = 0
    let savings = 0
    let percentOff = 0

    if (mode === 'percent') {
      percentOff = parseFloat(discountPercent) || 0
      savings = original * (percentOff / 100)
      final = original - savings
    } else if (mode === 'amount') {
      savings = parseFloat(discountAmount) || 0
      final = original - savings
      percentOff = (savings / original) * 100
    } else if (mode === 'final') {
      final = parseFloat(finalPrice) || 0
      savings = original - final
      percentOff = (savings / original) * 100
    }

    return {
      discount: percentOff,
      savings: Math.max(0, savings),
      final: Math.max(0, final),
      percentOff: Math.max(0, percentOff),
    }
  }, [originalPrice, discountPercent, discountAmount, finalPrice, mode])

  const handlePresetClick = (percent: number) => {
    setMode('percent')
    setDiscountPercent(percent.toString())
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Discount Calculator</h1>
        <p className="text-muted-foreground">Calculate discounts, savings, and final prices</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Original Price */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Original Price</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            {[
              { id: 'percent', label: 'By Percentage', icon: Percent },
              { id: 'amount', label: 'By Amount', icon: Tag },
              { id: 'final', label: 'By Final Price', icon: TrendingDown },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setMode(id as typeof mode)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm transition-colors ${
                  mode === id ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {mode === 'percent' && (
            <div>
              <label className="block text-sm font-medium mb-2">Discount Percentage</label>
              <div className="relative">
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="100"
                  className="w-full pr-10 px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
            </div>
          )}

          {mode === 'amount' && (
            <div>
              <label className="block text-sm font-medium mb-2">Discount Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
              </div>
            </div>
          )}

          {mode === 'final' && (
            <div>
              <label className="block text-sm font-medium mb-2">Final Price (after discount)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="number"
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Discount Buttons */}
        {mode === 'percent' && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quick Discounts</label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_DISCOUNTS.map(percent => (
                <button
                  key={percent}
                  onClick={() => handlePresetClick(percent)}
                  className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                    discountPercent === percent.toString()
                      ? 'bg-blue-600 text-white'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {percent}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-red-500/10 rounded-lg text-center">
            <div className="text-sm text-muted-foreground mb-1">You Save</div>
            <div className="text-2xl font-bold text-red-500">
              {formatCurrency(calculations.savings)}
            </div>
            <div className="text-sm text-muted-foreground">
              ({calculations.percentOff.toFixed(1)}% off)
            </div>
          </div>
          <div className="p-4 bg-green-500/10 rounded-lg text-center">
            <div className="text-sm text-muted-foreground mb-1">Final Price</div>
            <div className="text-2xl font-bold text-green-500">
              {formatCurrency(calculations.final)}
            </div>
            <div className="text-sm text-muted-foreground">
              After discount
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        {parseFloat(originalPrice) > 0 && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-3">Price Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Original Price</span>
                <span>{formatCurrency(parseFloat(originalPrice) || 0)}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Discount ({calculations.percentOff.toFixed(1)}%)</span>
                <span>-{formatCurrency(calculations.savings)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Final Price</span>
                <span className="text-green-500">{formatCurrency(calculations.final)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

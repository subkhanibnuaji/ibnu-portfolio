'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Target, Calendar, DollarSign, TrendingUp, PiggyBank } from 'lucide-react'

export function SavingsCalculator() {
  const [goalAmount, setGoalAmount] = useState('')
  const [currentSavings, setCurrentSavings] = useState('')
  const [monthlyContribution, setMonthlyContribution] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [targetMonths, setTargetMonths] = useState('')

  const calculations = useMemo(() => {
    const goal = parseFloat(goalAmount) || 0
    const current = parseFloat(currentSavings) || 0
    const monthly = parseFloat(monthlyContribution) || 0
    const rate = (parseFloat(interestRate) || 0) / 100 / 12 // Monthly rate
    const months = parseInt(targetMonths) || 0

    if (goal <= 0) return null

    const remaining = goal - current

    // Calculate months needed without interest
    const monthsNeededSimple = monthly > 0 ? Math.ceil(remaining / monthly) : Infinity

    // Calculate months needed with compound interest
    let monthsWithInterest = 0
    let balance = current
    if (monthly > 0 || rate > 0) {
      while (balance < goal && monthsWithInterest < 600) { // Max 50 years
        balance = balance * (1 + rate) + monthly
        monthsWithInterest++
      }
    }

    // Calculate future value if target months given
    let futureValue = current
    for (let i = 0; i < months; i++) {
      futureValue = futureValue * (1 + rate) + monthly
    }

    // Calculate required monthly to reach goal in target months
    let requiredMonthly = 0
    if (months > 0 && goal > current) {
      if (rate > 0) {
        // PMT formula: PMT = (FV - PV * (1+r)^n) * r / ((1+r)^n - 1)
        const factor = Math.pow(1 + rate, months)
        requiredMonthly = (goal - current * factor) * rate / (factor - 1)
      } else {
        requiredMonthly = remaining / months
      }
    }

    // Total contributions
    const totalContributions = current + (monthly * monthsWithInterest)
    const interestEarned = balance - totalContributions

    return {
      remaining,
      monthsNeededSimple,
      monthsWithInterest: monthsWithInterest > 600 ? Infinity : monthsWithInterest,
      yearsNeeded: monthsWithInterest > 600 ? Infinity : Math.floor(monthsWithInterest / 12),
      monthsRemainder: monthsWithInterest > 600 ? 0 : monthsWithInterest % 12,
      futureValue,
      requiredMonthly: requiredMonthly > 0 ? requiredMonthly : 0,
      totalContributions,
      interestEarned: interestEarned > 0 ? interestEarned : 0,
      progress: goal > 0 ? Math.min((current / goal) * 100, 100) : 0,
    }
  }, [goalAmount, currentSavings, monthlyContribution, interestRate, targetMonths])

  const formatCurrency = (amount: number): string => {
    if (!isFinite(amount)) return '—'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatTime = (months: number): string => {
    if (!isFinite(months)) return 'Never'
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    if (years === 0) return `${remainingMonths} months`
    if (remainingMonths === 0) return `${years} years`
    return `${years}y ${remainingMonths}m`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Savings Goal Calculator</h1>
        <p className="text-muted-foreground">Plan your savings and reach your financial goals</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-card rounded-xl p-6 border">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Your Goal
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Savings Goal</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="number"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  placeholder="10,000"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-1">Current Savings</label>
              <div className="relative">
                <PiggyBank className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-1">Monthly Contribution</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="500"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-1">Annual Interest Rate (%)</label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="5"
                  min="0"
                  max="50"
                  step="0.1"
                  className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-1">Target Timeframe (months)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="number"
                  value={targetMonths}
                  onChange={(e) => setTargetMonths(e.target.value)}
                  placeholder="24"
                  min="1"
                  className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-card rounded-xl p-6 border">
          <h2 className="font-semibold mb-4">Results</h2>

          {calculations ? (
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress to Goal</span>
                  <span className="font-semibold">{calculations.progress.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${calculations.progress}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatCurrency(parseFloat(currentSavings) || 0)}</span>
                  <span>{formatCurrency(parseFloat(goalAmount) || 0)}</span>
                </div>
              </div>

              {/* Time to Goal */}
              <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Time to Reach Goal</div>
                <div className="text-2xl font-bold text-blue-500">
                  {formatTime(calculations.monthsWithInterest)}
                </div>
              </div>

              {/* Required Monthly */}
              {targetMonths && calculations.requiredMonthly > 0 && (
                <div className="p-4 bg-green-500/10 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    Required Monthly (to reach goal in {targetMonths} months)
                  </div>
                  <div className="text-xl font-bold text-green-500">
                    {formatCurrency(calculations.requiredMonthly)}
                  </div>
                </div>
              )}

              {/* Future Value */}
              {targetMonths && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    Projected Balance (in {targetMonths} months)
                  </div>
                  <div className="text-xl font-bold">
                    {formatCurrency(calculations.futureValue)}
                  </div>
                </div>
              )}

              {/* Breakdown */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Remaining to Save</span>
                  <span className="font-semibold">{formatCurrency(calculations.remaining)}</span>
                </div>
                {calculations.interestEarned > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Interest Earned</span>
                    <span className="font-semibold text-green-500">
                      +{formatCurrency(calculations.interestEarned)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Enter a savings goal to see calculations
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Banknote, Calculator, TrendingUp, Calendar, DollarSign, Percent, PiggyBank } from 'lucide-react'

interface LoanResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  schedule: {
    month: number
    payment: number
    principal: number
    interest: number
    balance: number
  }[]
}

export function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(100000)
  const [interestRate, setInterestRate] = useState(5)
  const [loanTerm, setLoanTerm] = useState(15)
  const [showSchedule, setShowSchedule] = useState(false)

  const result = useMemo<LoanResult | null>(() => {
    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) return null

    const principal = loanAmount
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    // Monthly payment formula
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    const totalPayment = monthlyPayment * numberOfPayments
    const totalInterest = totalPayment - principal

    // Generate amortization schedule
    const schedule = []
    let balance = principal

    for (let month = 1; month <= numberOfPayments; month++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = monthlyPayment - interestPayment
      balance -= principalPayment

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      })
    }

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      schedule
    }
  }, [loanAmount, interestRate, loanTerm])

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatCurrencyFull = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const principalPercentage = result
    ? (loanAmount / result.totalPayment) * 100
    : 0

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm font-medium mb-4">
          <Banknote className="w-4 h-4" />
          Finance
        </div>
        <h2 className="text-2xl font-bold">Loan Calculator</h2>
        <p className="text-muted-foreground mt-2">
          Calculate monthly payments and total interest for your loan.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="text-sm font-medium mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            Loan Amount
          </label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            min={1000}
            max={10000000}
            step={1000}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background"
          />
          <input
            type="range"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            min={1000}
            max={1000000}
            step={1000}
            className="w-full mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 flex items-center gap-2">
            <Percent className="w-4 h-4 text-blue-500" />
            Interest Rate (%)
          </label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            min={0.1}
            max={30}
            step={0.1}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background"
          />
          <input
            type="range"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            min={0.5}
            max={20}
            step={0.1}
            className="w-full mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            Loan Term (years)
          </label>
          <input
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            min={1}
            max={30}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background"
          />
          <input
            type="range"
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            min={1}
            max={30}
            className="w-full mt-2"
          />
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Result */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/5 border border-green-500/20 text-center">
            <p className="text-sm text-muted-foreground mb-2">Monthly Payment</p>
            <p className="text-5xl font-bold text-green-500">
              {formatCurrencyFull(result.monthlyPayment)}
            </p>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <PiggyBank className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{formatCurrency(loanAmount)}</p>
              <p className="text-xs text-muted-foreground">Principal</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <p className="text-2xl font-bold">{formatCurrency(result.totalInterest)}</p>
              <p className="text-xs text-muted-foreground">Total Interest</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <Calculator className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{formatCurrency(result.totalPayment)}</p>
              <p className="text-xs text-muted-foreground">Total Payment</p>
            </div>
          </div>

          {/* Visual Breakdown */}
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-sm font-medium mb-3">Payment Breakdown</p>
            <div className="h-8 rounded-full overflow-hidden flex">
              <div
                className="bg-green-500 transition-all duration-500"
                style={{ width: `${principalPercentage}%` }}
              />
              <div
                className="bg-red-400 transition-all duration-500"
                style={{ width: `${100 - principalPercentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                Principal ({principalPercentage.toFixed(1)}%)
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                Interest ({(100 - principalPercentage).toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* Amortization Schedule Toggle */}
          <div className="text-center">
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="px-4 py-2 bg-muted rounded-lg font-medium"
            >
              {showSchedule ? 'Hide' : 'Show'} Amortization Schedule
            </button>
          </div>

          {/* Amortization Schedule */}
          {showSchedule && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3">Month</th>
                    <th className="text-right p-3">Payment</th>
                    <th className="text-right p-3">Principal</th>
                    <th className="text-right p-3">Interest</th>
                    <th className="text-right p-3">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.slice(0, 24).map((row) => (
                    <tr key={row.month} className="border-b border-border/50">
                      <td className="p-3">{row.month}</td>
                      <td className="text-right p-3">{formatCurrencyFull(row.payment)}</td>
                      <td className="text-right p-3 text-green-500">{formatCurrencyFull(row.principal)}</td>
                      <td className="text-right p-3 text-red-400">{formatCurrencyFull(row.interest)}</td>
                      <td className="text-right p-3">{formatCurrencyFull(row.balance)}</td>
                    </tr>
                  ))}
                  {result.schedule.length > 24 && (
                    <tr>
                      <td colSpan={5} className="p-3 text-center text-muted-foreground">
                        ... and {result.schedule.length - 24} more months
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground text-center">
        <p>This calculator uses standard amortization formula. Actual payments may vary.</p>
      </div>
    </div>
  )
}

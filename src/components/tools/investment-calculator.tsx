'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, Calculator, DollarSign, Percent,
  Calendar, PiggyBank, Target, Info
} from 'lucide-react'

interface YearlyData {
  year: number
  startBalance: number
  contribution: number
  interest: number
  endBalance: number
}

export function InvestmentCalculator() {
  const [principal, setPrincipal] = useState(10000)
  const [monthlyContribution, setMonthlyContribution] = useState(500)
  const [annualReturn, setAnnualReturn] = useState(7)
  const [years, setYears] = useState(20)
  const [compoundingFrequency, setCompoundingFrequency] = useState<'monthly' | 'quarterly' | 'annually'>('monthly')
  const [inflationRate, setInflationRate] = useState(2.5)
  const [showInflationAdjusted, setShowInflationAdjusted] = useState(false)

  const results = useMemo(() => {
    const compoundingPeriods = compoundingFrequency === 'monthly' ? 12 : compoundingFrequency === 'quarterly' ? 4 : 1
    const periodicRate = annualReturn / 100 / compoundingPeriods
    const contributionsPerPeriod = monthlyContribution * (12 / compoundingPeriods)

    let balance = principal
    const yearlyData: YearlyData[] = []
    let totalContributions = principal

    for (let year = 1; year <= years; year++) {
      const startBalance = balance
      let yearInterest = 0
      const yearContribution = monthlyContribution * 12

      for (let period = 0; period < compoundingPeriods; period++) {
        const interest = balance * periodicRate
        yearInterest += interest
        balance += interest + contributionsPerPeriod
      }

      totalContributions += yearContribution

      yearlyData.push({
        year,
        startBalance,
        contribution: yearContribution,
        interest: yearInterest,
        endBalance: balance
      })
    }

    const totalInterest = balance - totalContributions
    const inflationAdjustedValue = balance / Math.pow(1 + inflationRate / 100, years)

    return {
      finalBalance: balance,
      totalContributions,
      totalInterest,
      inflationAdjustedValue,
      yearlyData
    }
  }, [principal, monthlyContribution, annualReturn, years, compoundingFrequency, inflationRate])

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`
  }

  // Calculate chart dimensions
  const maxBalance = results.yearlyData[results.yearlyData.length - 1]?.endBalance || 0
  const chartHeight = 200

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Investment Parameters
            </h3>

            {/* Initial Investment */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Initial Investment
              </label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                min="0"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="range"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                min="0"
                max="100000"
                step="1000"
                className="w-full mt-2"
              />
            </div>

            {/* Monthly Contribution */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <PiggyBank className="w-4 h-4" />
                Monthly Contribution
              </label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                min="0"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="range"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                min="0"
                max="5000"
                step="50"
                className="w-full mt-2"
              />
            </div>

            {/* Annual Return */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Expected Annual Return
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  min="0"
                  max="30"
                  step="0.1"
                  className="w-24 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-lg focus:outline-none focus:border-blue-500"
                />
                <span className="text-white text-lg">%</span>
                <input
                  type="range"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  min="0"
                  max="20"
                  step="0.5"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Investment Period */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Investment Period (Years)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Math.min(50, Math.max(1, Number(e.target.value))))}
                  min="1"
                  max="50"
                  className="w-24 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-lg focus:outline-none focus:border-blue-500"
                />
                <span className="text-white text-lg">years</span>
                <input
                  type="range"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  min="1"
                  max="50"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Compounding Frequency */}
            <div>
              <label className="text-white/70 text-sm mb-2 block">Compounding Frequency</label>
              <div className="flex gap-2">
                {(['monthly', 'quarterly', 'annually'] as const).map(freq => (
                  <button
                    key={freq}
                    onClick={() => setCompoundingFrequency(freq)}
                    className={`flex-1 py-2 rounded-lg capitalize transition-colors ${
                      compoundingFrequency === freq
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {/* Inflation */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Expected Inflation Rate
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  min="0"
                  max="10"
                  step="0.1"
                  className="w-24 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                <span className="text-white">%</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Target className="w-5 h-5" />
              Investment Results
            </h3>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                <div className="text-green-400 text-sm mb-1">Final Balance</div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(results.finalBalance)}
                </div>
              </div>
              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                <div className="text-blue-400 text-sm mb-1">Total Contributions</div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(results.totalContributions)}
                </div>
              </div>
              <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                <div className="text-purple-400 text-sm mb-1">Total Interest Earned</div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(results.totalInterest)}
                </div>
              </div>
              <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                <div className="text-yellow-400 text-sm mb-1 flex items-center gap-1">
                  Inflation-Adjusted
                  <Info className="w-3 h-3" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(results.inflationAdjustedValue)}
                </div>
              </div>
            </div>

            {/* Growth Chart */}
            <div className="bg-white/5 rounded-xl p-4">
              <h4 className="text-white/70 text-sm mb-4">Growth Over Time</h4>
              <div className="relative h-[200px]">
                <svg className="w-full h-full" viewBox={`0 0 ${results.yearlyData.length * 30} ${chartHeight}`}>
                  {/* Contributions area */}
                  <path
                    d={`M0,${chartHeight} ${results.yearlyData.map((d, i) =>
                      `L${i * 30},${chartHeight - (((d.startBalance + d.contribution * ((i + 1) / results.yearlyData.length))) / maxBalance * chartHeight)}`
                    ).join(' ')} L${(results.yearlyData.length - 1) * 30},${chartHeight} Z`}
                    fill="rgba(59, 130, 246, 0.3)"
                  />
                  {/* Interest area */}
                  <path
                    d={`M0,${chartHeight - (principal / maxBalance * chartHeight)} ${results.yearlyData.map((d, i) =>
                      `L${i * 30},${chartHeight - (d.endBalance / maxBalance * chartHeight)}`
                    ).join(' ')} L${(results.yearlyData.length - 1) * 30},${chartHeight} Z`}
                    fill="rgba(34, 197, 94, 0.3)"
                  />
                  {/* Balance line */}
                  <path
                    d={`M0,${chartHeight - (principal / maxBalance * chartHeight)} ${results.yearlyData.map((d, i) =>
                      `L${i * 30},${chartHeight - (d.endBalance / maxBalance * chartHeight)}`
                    ).join(' ')}`}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500/50" />
                  <span className="text-white/50 text-sm">Contributions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500/50" />
                  <span className="text-white/50 text-sm">Interest</span>
                </div>
              </div>
            </div>

            {/* Year by Year Table */}
            <div className="bg-white/5 rounded-xl overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 sticky top-0">
                    <tr className="text-white/50">
                      <th className="py-2 px-3 text-left">Year</th>
                      <th className="py-2 px-3 text-right">Start</th>
                      <th className="py-2 px-3 text-right">Contrib.</th>
                      <th className="py-2 px-3 text-right">Interest</th>
                      <th className="py-2 px-3 text-right">End</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.yearlyData.map((row) => (
                      <tr key={row.year} className="border-t border-white/5">
                        <td className="py-2 px-3 text-white">{row.year}</td>
                        <td className="py-2 px-3 text-right text-white/70">{formatCurrency(row.startBalance)}</td>
                        <td className="py-2 px-3 text-right text-blue-400">{formatCurrency(row.contribution)}</td>
                        <td className="py-2 px-3 text-right text-green-400">{formatCurrency(row.interest)}</td>
                        <td className="py-2 px-3 text-right text-white font-medium">{formatCurrency(row.endBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

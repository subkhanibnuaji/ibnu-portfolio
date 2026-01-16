'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Percent, Calculator, ArrowRight, RefreshCw } from 'lucide-react'

type CalculationType = 'whatPercent' | 'percentOf' | 'percentChange' | 'addPercent' | 'subtractPercent'

interface Calculation {
  type: CalculationType
  inputs: number[]
  result: number | null
}

export function PercentageCalculator() {
  const [calcType, setCalcType] = useState<CalculationType>('percentOf')
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [history, setHistory] = useState<Calculation[]>([])

  const calculate = () => {
    const v1 = parseFloat(value1)
    const v2 = parseFloat(value2)

    if (isNaN(v1) || isNaN(v2)) {
      setResult(null)
      return
    }

    let res: number

    switch (calcType) {
      case 'whatPercent':
        // What percent is V1 of V2?
        res = (v1 / v2) * 100
        break
      case 'percentOf':
        // What is V1% of V2?
        res = (v1 / 100) * v2
        break
      case 'percentChange':
        // Percent change from V1 to V2
        res = ((v2 - v1) / v1) * 100
        break
      case 'addPercent':
        // Add V1% to V2
        res = v2 + (v2 * v1 / 100)
        break
      case 'subtractPercent':
        // Subtract V1% from V2
        res = v2 - (v2 * v1 / 100)
        break
      default:
        res = 0
    }

    setResult(res)
    setHistory(prev => [{
      type: calcType,
      inputs: [v1, v2],
      result: res,
    }, ...prev].slice(0, 10))
  }

  const clear = () => {
    setValue1('')
    setValue2('')
    setResult(null)
  }

  const formatResult = (num: number): string => {
    if (Number.isInteger(num)) return num.toString()
    return num.toFixed(4).replace(/\.?0+$/, '')
  }

  const getCalculationDescription = (type: CalculationType): { label1: string; label2: string; resultLabel: string; formula: string } => {
    switch (type) {
      case 'whatPercent':
        return {
          label1: 'Value',
          label2: 'Total',
          resultLabel: 'is what percent of',
          formula: '(Value ÷ Total) × 100',
        }
      case 'percentOf':
        return {
          label1: 'Percent',
          label2: 'Number',
          resultLabel: '% of',
          formula: '(Percent ÷ 100) × Number',
        }
      case 'percentChange':
        return {
          label1: 'From',
          label2: 'To',
          resultLabel: 'to',
          formula: '((To - From) ÷ From) × 100',
        }
      case 'addPercent':
        return {
          label1: 'Percent to add',
          label2: 'Base number',
          resultLabel: '% added to',
          formula: 'Base + (Base × Percent ÷ 100)',
        }
      case 'subtractPercent':
        return {
          label1: 'Percent to subtract',
          label2: 'Base number',
          resultLabel: '% subtracted from',
          formula: 'Base - (Base × Percent ÷ 100)',
        }
    }
  }

  const getHistoryText = (calc: Calculation): string => {
    const [v1, v2] = calc.inputs
    switch (calc.type) {
      case 'whatPercent':
        return `${v1} is ${formatResult(calc.result!)}% of ${v2}`
      case 'percentOf':
        return `${v1}% of ${v2} = ${formatResult(calc.result!)}`
      case 'percentChange':
        return `${v1} → ${v2} = ${formatResult(calc.result!)}% change`
      case 'addPercent':
        return `${v2} + ${v1}% = ${formatResult(calc.result!)}`
      case 'subtractPercent':
        return `${v2} - ${v1}% = ${formatResult(calc.result!)}`
      default:
        return ''
    }
  }

  const desc = getCalculationDescription(calcType)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Percentage Calculator</h1>
        <p className="text-muted-foreground">Calculate percentages quickly and easily</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Calculation Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Calculation Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={() => { setCalcType('percentOf'); clear(); }}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                calcType === 'percentOf' ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              X% of Y
            </button>
            <button
              onClick={() => { setCalcType('whatPercent'); clear(); }}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                calcType === 'whatPercent' ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              X is what % of Y
            </button>
            <button
              onClick={() => { setCalcType('percentChange'); clear(); }}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                calcType === 'percentChange' ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              % Change
            </button>
            <button
              onClick={() => { setCalcType('addPercent'); clear(); }}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                calcType === 'addPercent' ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Add X%
            </button>
            <button
              onClick={() => { setCalcType('subtractPercent'); clear(); }}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                calcType === 'subtractPercent' ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Subtract X%
            </button>
          </div>
        </div>

        {/* Formula Display */}
        <div className="mb-6 p-3 bg-muted/50 rounded-lg text-center">
          <span className="text-sm text-muted-foreground">Formula: </span>
          <span className="font-mono text-sm">{desc.formula}</span>
        </div>

        {/* Input Fields */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">{desc.label1}</label>
            <div className="relative">
              <input
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                placeholder={`Enter ${desc.label1.toLowerCase()}`}
                className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              />
              {calcType === 'percentOf' && (
                <Percent className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{desc.label2}</label>
            <input
              type="number"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              placeholder={`Enter ${desc.label2.toLowerCase()}`}
              className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={calculate}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calculate
          </button>
          <button
            onClick={clear}
            className="px-6 py-3 bg-muted hover:bg-muted/80 rounded-lg flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Clear
          </button>
        </div>

        {/* Result Display */}
        {result !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl text-center mb-6"
          >
            <p className="text-sm text-muted-foreground mb-2">Result</p>
            <p className="text-4xl font-bold text-blue-500">
              {formatResult(result)}
              {(calcType === 'whatPercent' || calcType === 'percentChange') && '%'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {value1} {desc.resultLabel} {value2}
            </p>
          </motion.div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">Recent Calculations</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {history.map((calc, i) => (
                <div key={i} className="p-2 bg-muted/50 rounded-lg text-sm font-mono">
                  {getHistoryText(calc)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Examples */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Quick Examples</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• What is 15% of 200? → 30</li>
            <li>• 25 is what percent of 200? → 12.5%</li>
            <li>• Percent change from 50 to 75? → 50%</li>
            <li>• 100 + 20% = 120</li>
            <li>• 100 - 25% = 75</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

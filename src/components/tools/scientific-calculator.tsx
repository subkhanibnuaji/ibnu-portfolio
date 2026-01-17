'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calculator, History, Trash2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'

interface HistoryItem {
  expression: string
  result: string
  timestamp: Date
}

export function ScientificCalculator() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [memory, setMemory] = useState(0)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [mode, setMode] = useState<'deg' | 'rad'>('deg')
  const [copied, setCopied] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(true)

  const toRadians = (deg: number) => (deg * Math.PI) / 180
  const toDegrees = (rad: number) => (rad * 180) / Math.PI

  const calculate = (expr: string): string => {
    try {
      let sanitized = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**')
        .replace(/π/g, Math.PI.toString())
        .replace(/e(?![xp])/g, Math.E.toString())

      // Handle trigonometric functions based on mode
      if (mode === 'deg') {
        sanitized = sanitized
          .replace(/sin\(([^)]+)\)/g, (_, x) => `Math.sin(${toRadians(parseFloat(x))})`)
          .replace(/cos\(([^)]+)\)/g, (_, x) => `Math.cos(${toRadians(parseFloat(x))})`)
          .replace(/tan\(([^)]+)\)/g, (_, x) => `Math.tan(${toRadians(parseFloat(x))})`)
      } else {
        sanitized = sanitized
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(')
      }

      sanitized = sanitized
        .replace(/asin\(/g, 'Math.asin(')
        .replace(/acos\(/g, 'Math.acos(')
        .replace(/atan\(/g, 'Math.atan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/abs\(/g, 'Math.abs(')
        .replace(/exp\(/g, 'Math.exp(')
        .replace(/(\d+)!/g, (_, n) => factorial(parseInt(n)).toString())

      const result = eval(sanitized)

      if (typeof result !== 'number' || !isFinite(result)) {
        return 'Error'
      }

      // Round to avoid floating point issues
      const rounded = Math.round(result * 1e12) / 1e12
      return rounded.toString()
    } catch {
      return 'Error'
    }
  }

  const factorial = (n: number): number => {
    if (n < 0) return NaN
    if (n <= 1) return 1
    return n * factorial(n - 1)
  }

  const handleButton = (value: string) => {
    switch (value) {
      case 'C':
        setDisplay('0')
        setExpression('')
        break
      case 'CE':
        setDisplay('0')
        break
      case '⌫':
        setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0')
        break
      case '=':
        const result = calculate(expression + display)
        if (result !== 'Error') {
          setHistory(prev => [{
            expression: expression + display,
            result,
            timestamp: new Date()
          }, ...prev].slice(0, 50))
        }
        setDisplay(result)
        setExpression('')
        break
      case '+':
      case '-':
      case '×':
      case '÷':
      case '^':
        setExpression(prev => prev + display + value)
        setDisplay('0')
        break
      case '±':
        setDisplay(prev => (parseFloat(prev) * -1).toString())
        break
      case '%':
        setDisplay(prev => (parseFloat(prev) / 100).toString())
        break
      case '.':
        if (!display.includes('.')) {
          setDisplay(prev => prev + '.')
        }
        break
      case 'π':
        setDisplay(Math.PI.toString())
        break
      case 'e':
        setDisplay(Math.E.toString())
        break
      case 'x²':
        setDisplay(prev => Math.pow(parseFloat(prev), 2).toString())
        break
      case 'x³':
        setDisplay(prev => Math.pow(parseFloat(prev), 3).toString())
        break
      case '√':
        setDisplay(prev => Math.sqrt(parseFloat(prev)).toString())
        break
      case '∛':
        setDisplay(prev => Math.cbrt(parseFloat(prev)).toString())
        break
      case '1/x':
        setDisplay(prev => (1 / parseFloat(prev)).toString())
        break
      case 'n!':
        setDisplay(prev => factorial(parseInt(prev)).toString())
        break
      case 'sin':
      case 'cos':
      case 'tan':
      case 'asin':
      case 'acos':
      case 'atan':
        const trig = {
          sin: Math.sin,
          cos: Math.cos,
          tan: Math.tan,
          asin: Math.asin,
          acos: Math.acos,
          atan: Math.atan
        }[value]!

        let angle = parseFloat(display)
        if (['sin', 'cos', 'tan'].includes(value) && mode === 'deg') {
          angle = toRadians(angle)
        }
        let result2 = trig(angle)
        if (['asin', 'acos', 'atan'].includes(value) && mode === 'deg') {
          result2 = toDegrees(result2)
        }
        setDisplay(result2.toString())
        break
      case 'log':
        setDisplay(prev => Math.log10(parseFloat(prev)).toString())
        break
      case 'ln':
        setDisplay(prev => Math.log(parseFloat(prev)).toString())
        break
      case 'exp':
        setDisplay(prev => Math.exp(parseFloat(prev)).toString())
        break
      case 'MC':
        setMemory(0)
        break
      case 'MR':
        setDisplay(memory.toString())
        break
      case 'M+':
        setMemory(prev => prev + parseFloat(display))
        break
      case 'M-':
        setMemory(prev => prev - parseFloat(display))
        break
      case 'MS':
        setMemory(parseFloat(display))
        break
      default:
        setDisplay(prev => prev === '0' ? value : prev + value)
    }
  }

  const copyResult = () => {
    navigator.clipboard.writeText(display)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleButton(e.key)
      else if (e.key === '+') handleButton('+')
      else if (e.key === '-') handleButton('-')
      else if (e.key === '*') handleButton('×')
      else if (e.key === '/') handleButton('÷')
      else if (e.key === '.') handleButton('.')
      else if (e.key === 'Enter' || e.key === '=') handleButton('=')
      else if (e.key === 'Escape') handleButton('C')
      else if (e.key === 'Backspace') handleButton('⌫')
      else if (e.key === '%') handleButton('%')
      else if (e.key === '^') handleButton('^')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [display, expression])

  const basicButtons = [
    ['C', 'CE', '⌫', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['±', '0', '.', '=']
  ]

  const scientificButtons = [
    ['sin', 'cos', 'tan', 'π'],
    ['asin', 'acos', 'atan', 'e'],
    ['log', 'ln', 'exp', '^'],
    ['x²', 'x³', '√', '∛'],
    ['1/x', 'n!', '(', ')']
  ]

  const memoryButtons = ['MC', 'MR', 'M+', 'M-', 'MS']

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Display */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-2">
            <button
              onClick={() => setMode(mode === 'deg' ? 'rad' : 'deg')}
              className={`px-2 py-1 text-xs rounded ${mode === 'deg' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            >
              {mode.toUpperCase()}
            </button>
            {memory !== 0 && (
              <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-500 rounded">M</span>
            )}
          </div>
          <button
            onClick={copyResult}
            className="p-1 hover:bg-muted rounded"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {expression && (
          <p className="text-sm text-muted-foreground text-right mb-1 font-mono">
            {expression}
          </p>
        )}
        <p className="text-4xl font-bold text-right font-mono truncate">
          {display}
        </p>
      </div>

      {/* Memory Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {memoryButtons.map(btn => (
          <motion.button
            key={btn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleButton(btn)}
            className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground text-sm font-medium"
          >
            {btn}
          </motion.button>
        ))}
      </div>

      {/* Advanced Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground"
      >
        {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {showAdvanced ? 'Hide' : 'Show'} Scientific Functions
      </button>

      {/* Scientific Buttons */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="grid grid-cols-4 gap-2"
        >
          {scientificButtons.flat().map(btn => (
            <motion.button
              key={btn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleButton(btn)}
              className="p-3 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 font-medium"
            >
              {btn}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Basic Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {basicButtons.flat().map(btn => (
          <motion.button
            key={btn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleButton(btn)}
            className={`p-4 rounded-lg font-bold text-lg ${
              btn === '=' ? 'bg-primary text-primary-foreground col-span-1' :
              ['+', '-', '×', '÷'].includes(btn) ? 'bg-cyan-500/20 text-cyan-500' :
              ['C', 'CE', '⌫'].includes(btn) ? 'bg-red-500/20 text-red-500' :
              'bg-muted hover:bg-muted/80'
            }`}
          >
            {btn}
          </motion.button>
        ))}
      </div>

      {/* History */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between"
        >
          <span className="font-semibold flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            History ({history.length})
          </span>
          {showHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showHistory && (
          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No history yet</p>
            ) : (
              history.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setDisplay(item.result)}
                  className="w-full p-2 rounded-lg bg-muted/50 hover:bg-muted text-left"
                >
                  <p className="text-sm text-muted-foreground font-mono">{item.expression}</p>
                  <p className="font-bold font-mono">= {item.result}</p>
                </button>
              ))
            )}
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
                Clear History
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

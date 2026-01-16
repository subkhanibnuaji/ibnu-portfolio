'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator as CalcIcon, Delete, RotateCcw, History, Percent, Divide, X, Minus, Plus, Equal } from 'lucide-react'

export function Calculator() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [lastResult, setLastResult] = useState<string | null>(null)

  const buttons = [
    { label: 'C', type: 'clear', className: 'bg-red-500/20 text-red-500' },
    { label: '±', type: 'negate', className: 'bg-muted' },
    { label: '%', type: 'percent', icon: Percent, className: 'bg-muted' },
    { label: '÷', type: 'operator', value: '/', icon: Divide, className: 'bg-primary/20 text-primary' },
    { label: '7', type: 'number', className: 'bg-card hover:bg-muted' },
    { label: '8', type: 'number', className: 'bg-card hover:bg-muted' },
    { label: '9', type: 'number', className: 'bg-card hover:bg-muted' },
    { label: '×', type: 'operator', value: '*', icon: X, className: 'bg-primary/20 text-primary' },
    { label: '4', type: 'number', className: 'bg-card hover:bg-muted' },
    { label: '5', type: 'number', className: 'bg-card hover:bg-muted' },
    { label: '6', type: 'number', className: 'bg-card hover:bg-muted' },
    { label: '−', type: 'operator', value: '-', icon: Minus, className: 'bg-primary/20 text-primary' },
    { label: '1', type: 'number', className: 'bg-card hover:bg-muted' },
    { label: '2', type: 'number', className: 'bg-card hover:bg-muted' },
    { label: '3', type: 'number', className: 'bg-card hover:bg-muted' },
    { label: '+', type: 'operator', value: '+', icon: Plus, className: 'bg-primary/20 text-primary' },
    { label: '0', type: 'number', className: 'bg-card hover:bg-muted col-span-2' },
    { label: '.', type: 'decimal', className: 'bg-card hover:bg-muted' },
    { label: '=', type: 'equals', icon: Equal, className: 'bg-primary text-primary-foreground' },
  ]

  const handleButton = (button: typeof buttons[0]) => {
    switch (button.type) {
      case 'number':
        if (display === '0' || lastResult) {
          setDisplay(button.label)
          setLastResult(null)
        } else if (display.length < 15) {
          setDisplay(display + button.label)
        }
        break

      case 'decimal':
        if (lastResult) {
          setDisplay('0.')
          setLastResult(null)
        } else if (!display.includes('.')) {
          setDisplay(display + '.')
        }
        break

      case 'operator':
        const op = button.value || button.label
        setExpression(display + ' ' + op + ' ')
        setDisplay('0')
        setLastResult(null)
        break

      case 'equals':
        try {
          const fullExpr = expression + display
          // Safe evaluation
          const sanitized = fullExpr.replace(/[^0-9+\-*/.() ]/g, '')
          const result = Function('"use strict";return (' + sanitized + ')')()
          const resultStr = Number.isFinite(result)
            ? parseFloat(result.toFixed(10)).toString()
            : 'Error'

          setHistory(prev => [...prev.slice(-9), `${fullExpr} = ${resultStr}`])
          setDisplay(resultStr)
          setExpression('')
          setLastResult(resultStr)
        } catch {
          setDisplay('Error')
          setExpression('')
        }
        break

      case 'clear':
        setDisplay('0')
        setExpression('')
        setLastResult(null)
        break

      case 'negate':
        if (display !== '0') {
          setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display)
        }
        break

      case 'percent':
        const percentValue = parseFloat(display) / 100
        setDisplay(percentValue.toString())
        break
    }
  }

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-4">
          <CalcIcon className="w-4 h-4" />
          Calculator
        </div>
        <h2 className="text-2xl font-bold">Calculator</h2>
      </div>

      {/* Calculator Body */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
        {/* History Toggle */}
        <div className="flex justify-between items-center p-3 border-b border-border">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-lg transition-colors ${
              showHistory ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
          >
            <History className="w-4 h-4" />
          </button>
          <button
            onClick={handleBackspace}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>

        {/* History Panel */}
        {showHistory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-border bg-muted/30"
          >
            <div className="p-3 max-h-40 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center">No history yet</p>
              ) : (
                <div className="space-y-1">
                  {history.map((item, i) => (
                    <p key={i} className="text-sm text-muted-foreground font-mono">{item}</p>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Display */}
        <div className="p-6 text-right">
          {expression && (
            <p className="text-sm text-muted-foreground font-mono mb-1">{expression}</p>
          )}
          <p className="text-4xl font-bold font-mono truncate">{display}</p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-1 p-3">
          {buttons.map((button, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleButton(button)}
              className={`${button.className} ${
                button.label === '0' ? 'col-span-2' : ''
              } h-16 rounded-xl font-medium text-xl transition-colors flex items-center justify-center`}
            >
              {button.icon ? <button.icon className="w-5 h-5" /> : button.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

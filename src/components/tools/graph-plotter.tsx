'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Plus, Trash2, Download, ZoomIn, ZoomOut, RefreshCw, Palette } from 'lucide-react'

interface GraphFunction {
  id: string
  expression: string
  color: string
  enabled: boolean
}

const colors = [
  '#00d4ff', '#a855f7', '#22c55e', '#f59e0b', '#ef4444',
  '#ec4899', '#3b82f6', '#14b8a6', '#f97316', '#8b5cf6'
]

export function GraphPlotter() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [functions, setFunctions] = useState<GraphFunction[]>([
    { id: '1', expression: 'sin(x)', color: colors[0], enabled: true },
    { id: '2', expression: 'cos(x)', color: colors[1], enabled: true }
  ])
  const [xMin, setXMin] = useState(-10)
  const [xMax, setXMax] = useState(10)
  const [yMin, setYMin] = useState(-5)
  const [yMax, setYMax] = useState(5)
  const [showGrid, setShowGrid] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const evaluateExpression = (expr: string, x: number): number | null => {
    try {
      // Safe math evaluation
      const sanitized = expr
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log')
        .replace(/exp/g, 'Math.exp')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/pow/g, 'Math.pow')
        .replace(/pi/gi, 'Math.PI')
        .replace(/e(?![xp])/gi, 'Math.E')
        .replace(/\^/g, '**')

      // Create function and evaluate
      const fn = new Function('x', `return ${sanitized}`)
      const result = fn(x)

      if (typeof result !== 'number' || !isFinite(result)) {
        return null
      }
      return result
    } catch {
      return null
    }
  }

  const drawGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, width, height)

    const xScale = width / (xMax - xMin)
    const yScale = height / (yMax - yMin)

    const toCanvasX = (x: number) => (x - xMin) * xScale
    const toCanvasY = (y: number) => height - (y - yMin) * yScale

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 0.5

      // Vertical grid lines
      for (let x = Math.ceil(xMin); x <= xMax; x++) {
        ctx.beginPath()
        ctx.moveTo(toCanvasX(x), 0)
        ctx.lineTo(toCanvasX(x), height)
        ctx.stroke()
      }

      // Horizontal grid lines
      for (let y = Math.ceil(yMin); y <= yMax; y++) {
        ctx.beginPath()
        ctx.moveTo(0, toCanvasY(y))
        ctx.lineTo(width, toCanvasY(y))
        ctx.stroke()
      }
    }

    // Draw axes
    ctx.strokeStyle = '#666'
    ctx.lineWidth = 1

    // X axis
    if (yMin <= 0 && yMax >= 0) {
      ctx.beginPath()
      ctx.moveTo(0, toCanvasY(0))
      ctx.lineTo(width, toCanvasY(0))
      ctx.stroke()
    }

    // Y axis
    if (xMin <= 0 && xMax >= 0) {
      ctx.beginPath()
      ctx.moveTo(toCanvasX(0), 0)
      ctx.lineTo(toCanvasX(0), height)
      ctx.stroke()
    }

    // Draw axis labels
    ctx.fillStyle = '#888'
    ctx.font = '12px monospace'

    // X axis labels
    for (let x = Math.ceil(xMin); x <= xMax; x++) {
      if (x !== 0) {
        ctx.fillText(x.toString(), toCanvasX(x) - 5, toCanvasY(0) + 15)
      }
    }

    // Y axis labels
    for (let y = Math.ceil(yMin); y <= yMax; y++) {
      if (y !== 0) {
        ctx.fillText(y.toString(), toCanvasX(0) + 5, toCanvasY(y) + 4)
      }
    }

    // Draw functions
    setError(null)
    functions.forEach(fn => {
      if (!fn.enabled || !fn.expression.trim()) return

      ctx.strokeStyle = fn.color
      ctx.lineWidth = 2
      ctx.beginPath()

      let started = false
      const step = (xMax - xMin) / width

      for (let px = 0; px < width; px++) {
        const x = xMin + (px / width) * (xMax - xMin)
        const y = evaluateExpression(fn.expression, x)

        if (y === null) continue

        const canvasX = toCanvasX(x)
        const canvasY = toCanvasY(y)

        if (!started) {
          ctx.moveTo(canvasX, canvasY)
          started = true
        } else {
          if (canvasY >= -100 && canvasY <= height + 100) {
            ctx.lineTo(canvasX, canvasY)
          } else {
            ctx.moveTo(canvasX, canvasY)
          }
        }
      }

      ctx.stroke()
    })
  }

  useEffect(() => {
    drawGraph()
  }, [functions, xMin, xMax, yMin, yMax, showGrid])

  const addFunction = () => {
    const newFn: GraphFunction = {
      id: Date.now().toString(),
      expression: '',
      color: colors[functions.length % colors.length],
      enabled: true
    }
    setFunctions([...functions, newFn])
  }

  const updateFunction = (id: string, field: keyof GraphFunction, value: string | boolean) => {
    setFunctions(functions.map(fn =>
      fn.id === id ? { ...fn, [field]: value } : fn
    ))
  }

  const removeFunction = (id: string) => {
    setFunctions(functions.filter(fn => fn.id !== id))
  }

  const zoom = (factor: number) => {
    const xRange = xMax - xMin
    const yRange = yMax - yMin
    const xCenter = (xMax + xMin) / 2
    const yCenter = (yMax + yMin) / 2

    setXMin(xCenter - (xRange * factor) / 2)
    setXMax(xCenter + (xRange * factor) / 2)
    setYMin(yCenter - (yRange * factor) / 2)
    setYMax(yCenter + (yRange * factor) / 2)
  }

  const resetView = () => {
    setXMin(-10)
    setXMax(10)
    setYMin(-5)
    setYMax(5)
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'graph.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const presets = [
    { name: 'sin(x)', expr: 'sin(x)' },
    { name: 'cos(x)', expr: 'cos(x)' },
    { name: 'tan(x)', expr: 'tan(x)' },
    { name: 'x²', expr: 'x^2' },
    { name: 'x³', expr: 'x^3' },
    { name: '1/x', expr: '1/x' },
    { name: 'sqrt(x)', expr: 'sqrt(x)' },
    { name: 'log(x)', expr: 'log(x)' },
    { name: 'exp(x)', expr: 'exp(x)' },
    { name: '|x|', expr: 'abs(x)' }
  ]

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <LineChart className="w-5 h-5 text-primary" />
            Graph
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => zoom(0.8)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={() => zoom(1.2)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={resetView}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Reset View"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={downloadImage}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full rounded-lg border border-border"
        />
      </div>

      {/* View Settings */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-4">View Range</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">X Min</label>
            <input
              type="number"
              value={xMin}
              onChange={(e) => setXMin(parseFloat(e.target.value) || -10)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">X Max</label>
            <input
              type="number"
              value={xMax}
              onChange={(e) => setXMax(parseFloat(e.target.value) || 10)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Y Min</label>
            <input
              type="number"
              value={yMin}
              onChange={(e) => setYMin(parseFloat(e.target.value) || -5)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Y Max</label>
            <input
              type="number"
              value={yMax}
              onChange={(e) => setYMax(parseFloat(e.target.value) || 5)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show grid</span>
        </label>
      </div>

      {/* Function Presets */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-4">Quick Functions</h3>
        <div className="flex flex-wrap gap-2">
          {presets.map(preset => (
            <button
              key={preset.expr}
              onClick={() => {
                const newFn: GraphFunction = {
                  id: Date.now().toString(),
                  expression: preset.expr,
                  color: colors[functions.length % colors.length],
                  enabled: true
                }
                setFunctions([...functions, newFn])
              }}
              className="px-3 py-1.5 rounded-lg bg-muted text-sm hover:bg-primary/10 hover:text-primary transition-colors font-mono"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Functions List */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Functions</h3>
          <button
            onClick={addFunction}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
          >
            <Plus className="w-4 h-4" />
            Add Function
          </button>
        </div>

        <div className="space-y-3">
          {functions.map(fn => (
            <div
              key={fn.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
            >
              <input
                type="checkbox"
                checked={fn.enabled}
                onChange={(e) => updateFunction(fn.id, 'enabled', e.target.checked)}
                className="rounded"
              />
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: fn.color }}
              />
              <span className="text-muted-foreground">f(x) =</span>
              <input
                type="text"
                value={fn.expression}
                onChange={(e) => updateFunction(fn.id, 'expression', e.target.value)}
                placeholder="Enter expression (e.g., sin(x), x^2)"
                className="flex-1 px-3 py-1 rounded-lg border border-border bg-background font-mono"
              />
              <input
                type="color"
                value={fn.color}
                onChange={(e) => updateFunction(fn.id, 'color', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <button
                onClick={() => removeFunction(fn.id)}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Help */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-4">Supported Functions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div className="p-2 rounded bg-muted/50 font-mono">sin(x), cos(x), tan(x)</div>
          <div className="p-2 rounded bg-muted/50 font-mono">log(x), exp(x)</div>
          <div className="p-2 rounded bg-muted/50 font-mono">sqrt(x), abs(x)</div>
          <div className="p-2 rounded bg-muted/50 font-mono">x^n, pow(x,n)</div>
          <div className="p-2 rounded bg-muted/50 font-mono">pi, e</div>
          <div className="p-2 rounded bg-muted/50 font-mono">+, -, *, /</div>
          <div className="p-2 rounded bg-muted/50 font-mono">(parentheses)</div>
          <div className="p-2 rounded bg-muted/50 font-mono">numbers</div>
        </div>
      </div>
    </div>
  )
}

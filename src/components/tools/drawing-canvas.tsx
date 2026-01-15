'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Paintbrush, Eraser, Trash2, Download, Undo, Redo,
  Circle, Square, Minus, Palette, Droplet
} from 'lucide-react'

type Tool = 'brush' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'fill'

const COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'
]

const BRUSH_SIZES = [2, 5, 10, 20, 40]

interface HistoryState {
  data: ImageData
}

export function DrawingCanvas() {
  const [tool, setTool] = useState<Tool>('brush')
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)
  const [isDrawing, setIsDrawing] = useState(false)
  const [history, setHistory] = useState<HistoryState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = 800
    canvas.height = 600

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    contextRef.current = ctx

    // Save initial state
    saveToHistory()
  }, [])

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = contextRef.current
    if (!canvas || !ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ data: imageData })

    // Keep only last 50 states
    if (newHistory.length > 50) {
      newHistory.shift()
    }

    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  const undo = () => {
    if (historyIndex <= 0) return
    const ctx = contextRef.current
    if (!ctx) return

    const newIndex = historyIndex - 1
    ctx.putImageData(history[newIndex].data, 0, 0)
    setHistoryIndex(newIndex)
  }

  const redo = () => {
    if (historyIndex >= history.length - 1) return
    const ctx = contextRef.current
    if (!ctx) return

    const newIndex = historyIndex + 1
    ctx.putImageData(history[newIndex].data, 0, 0)
    setHistoryIndex(newIndex)
  }

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      }
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const ctx = contextRef.current
    if (!ctx) return

    const { x, y } = getCanvasCoords(e)
    setStartPos({ x, y })
    setIsDrawing(true)

    if (tool === 'brush' || tool === 'eraser') {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color
      ctx.lineWidth = brushSize
    } else if (tool === 'fill') {
      floodFill(Math.floor(x), Math.floor(y), color)
      saveToHistory()
    }
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    const ctx = contextRef.current
    const canvas = canvasRef.current
    if (!ctx || !canvas) return

    const { x, y } = getCanvasCoords(e)

    if (tool === 'brush' || tool === 'eraser') {
      ctx.lineTo(x, y)
      ctx.stroke()
    } else if (tool === 'line' || tool === 'rectangle' || tool === 'circle') {
      // Restore previous state and draw shape preview
      if (historyIndex >= 0) {
        ctx.putImageData(history[historyIndex].data, 0, 0)
      }
      ctx.strokeStyle = color
      ctx.lineWidth = brushSize

      if (tool === 'line') {
        ctx.beginPath()
        ctx.moveTo(startPos.x, startPos.y)
        ctx.lineTo(x, y)
        ctx.stroke()
      } else if (tool === 'rectangle') {
        ctx.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y)
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)
        )
        ctx.beginPath()
        ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2)
        ctx.stroke()
      }
    }
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    contextRef.current?.closePath()
    saveToHistory()
  }

  const floodFill = (startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current
    const ctx = contextRef.current
    if (!canvas || !ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    const startIdx = (startY * canvas.width + startX) * 4
    const startColor = [
      data[startIdx],
      data[startIdx + 1],
      data[startIdx + 2],
      data[startIdx + 3]
    ]

    // Parse fill color
    const hex = fillColor.replace('#', '')
    const fillR = parseInt(hex.slice(0, 2), 16)
    const fillG = parseInt(hex.slice(2, 4), 16)
    const fillB = parseInt(hex.slice(4, 6), 16)

    // Don't fill if same color
    if (
      startColor[0] === fillR &&
      startColor[1] === fillG &&
      startColor[2] === fillB
    ) return

    const stack: [number, number][] = [[startX, startY]]
    const visited = new Set<string>()

    while (stack.length > 0) {
      const [x, y] = stack.pop()!
      const key = `${x},${y}`

      if (
        x < 0 || x >= canvas.width ||
        y < 0 || y >= canvas.height ||
        visited.has(key)
      ) continue

      const idx = (y * canvas.width + x) * 4
      if (
        data[idx] !== startColor[0] ||
        data[idx + 1] !== startColor[1] ||
        data[idx + 2] !== startColor[2]
      ) continue

      visited.add(key)
      data[idx] = fillR
      data[idx + 1] = fillG
      data[idx + 2] = fillB
      data[idx + 3] = 255

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = contextRef.current
    if (!canvas || !ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveToHistory()
  }

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'drawing.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const tools: { id: Tool; icon: any; label: string }[] = [
    { id: 'brush', icon: Paintbrush, label: 'Brush' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'fill', icon: Droplet, label: 'Fill' }
  ]

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-500 text-sm font-medium mb-4">
          <Paintbrush className="w-4 h-4" />
          Creative
        </div>
        <h2 className="text-2xl font-bold">Drawing Canvas</h2>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-4 p-4 rounded-xl border border-border bg-card mb-4">
        {/* Tools */}
        <div className="flex gap-1">
          {tools.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTool(id)}
              className={`p-2 rounded-lg transition-colors ${
                tool === id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
              title={label}
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Colors */}
        <div className="flex gap-1">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full border-2 transition-transform ${
                color === c ? 'scale-110 border-primary' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-7 h-7 rounded cursor-pointer"
          />
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Brush Size */}
        <div className="flex items-center gap-2">
          {BRUSH_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              className={`rounded-full transition-colors ${
                brushSize === size
                  ? 'bg-primary'
                  : 'bg-muted hover:bg-muted/80'
              }`}
              style={{
                width: Math.min(size + 10, 30),
                height: Math.min(size + 10, 30)
              }}
            />
          ))}
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Actions */}
        <div className="flex gap-1">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-50"
            title="Undo"
          >
            <Undo className="w-5 h-5" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-50"
            title="Redo"
          >
            <Redo className="w-5 h-5" />
          </button>
          <button
            onClick={clearCanvas}
            className="p-2 rounded-lg hover:bg-muted text-red-500"
            title="Clear"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={downloadCanvas}
            className="p-2 rounded-lg hover:bg-muted text-green-500"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="rounded-xl border border-border overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair touch-none"
          style={{ aspectRatio: '4/3' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Tips */}
      <div className="mt-4 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground text-center">
        <p>Use mouse or touch to draw. Shapes are drawn from click point to release point.</p>
      </div>
    </div>
  )
}

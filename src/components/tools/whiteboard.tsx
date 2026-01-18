'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Pencil, Eraser, Square, Circle, Type, Minus,
  Trash2, Download, Undo, Redo, Palette, MousePointer,
  Move, ZoomIn, ZoomOut
} from 'lucide-react'

type Tool = 'select' | 'pen' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'text'

interface Point {
  x: number
  y: number
}

interface DrawElement {
  id: string
  type: 'path' | 'line' | 'rectangle' | 'circle' | 'text'
  points?: Point[]
  startPoint?: Point
  endPoint?: Point
  text?: string
  color: string
  strokeWidth: number
  fill?: boolean
}

export function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tool, setTool] = useState<Tool>('pen')
  const [color, setColor] = useState('#ffffff')
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [isDrawing, setIsDrawing] = useState(false)
  const [elements, setElements] = useState<DrawElement[]>([])
  const [currentElement, setCurrentElement] = useState<DrawElement | null>(null)
  const [history, setHistory] = useState<DrawElement[][]>([[]])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null)

  const COLORS = [
    '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
    '#ff00ff', '#00ffff', '#ff8800', '#8800ff', '#00ff88'
  ]

  useEffect(() => {
    drawCanvas()
  }, [elements, currentElement, scale, offset])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Clear
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Apply transformations
    ctx.save()
    ctx.translate(offset.x, offset.y)
    ctx.scale(scale, scale)

    // Draw grid
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 0.5
    const gridSize = 20
    for (let x = 0; x < canvas.width / scale; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height / scale)
      ctx.stroke()
    }
    for (let y = 0; y < canvas.height / scale; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width / scale, y)
      ctx.stroke()
    }

    // Draw elements
    const allElements = currentElement ? [...elements, currentElement] : elements

    allElements.forEach(element => {
      ctx.strokeStyle = element.color
      ctx.fillStyle = element.color
      ctx.lineWidth = element.strokeWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      switch (element.type) {
        case 'path':
          if (element.points && element.points.length > 0) {
            ctx.beginPath()
            ctx.moveTo(element.points[0].x, element.points[0].y)
            element.points.forEach(point => {
              ctx.lineTo(point.x, point.y)
            })
            ctx.stroke()
          }
          break

        case 'line':
          if (element.startPoint && element.endPoint) {
            ctx.beginPath()
            ctx.moveTo(element.startPoint.x, element.startPoint.y)
            ctx.lineTo(element.endPoint.x, element.endPoint.y)
            ctx.stroke()
          }
          break

        case 'rectangle':
          if (element.startPoint && element.endPoint) {
            const width = element.endPoint.x - element.startPoint.x
            const height = element.endPoint.y - element.startPoint.y
            if (element.fill) {
              ctx.fillRect(element.startPoint.x, element.startPoint.y, width, height)
            } else {
              ctx.strokeRect(element.startPoint.x, element.startPoint.y, width, height)
            }
          }
          break

        case 'circle':
          if (element.startPoint && element.endPoint) {
            const radius = Math.sqrt(
              Math.pow(element.endPoint.x - element.startPoint.x, 2) +
              Math.pow(element.endPoint.y - element.startPoint.y, 2)
            )
            ctx.beginPath()
            ctx.arc(element.startPoint.x, element.startPoint.y, radius, 0, Math.PI * 2)
            if (element.fill) {
              ctx.fill()
            } else {
              ctx.stroke()
            }
          }
          break

        case 'text':
          if (element.text && element.startPoint) {
            ctx.font = `${element.strokeWidth * 5}px sans-serif`
            ctx.fillText(element.text, element.startPoint.x, element.startPoint.y)
          }
          break
      }
    })

    ctx.restore()
  }

  const getCanvasPoint = (e: React.MouseEvent): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left - offset.x) / scale,
      y: (e.clientY - rect.top - offset.y) / scale
    }
  }

  const startDrawing = (e: React.MouseEvent) => {
    const point = getCanvasPoint(e)

    if (tool === 'select') {
      setIsPanning(true)
      setLastPanPoint({ x: e.clientX, y: e.clientY })
      return
    }

    setIsDrawing(true)

    const newElement: DrawElement = {
      id: Date.now().toString(),
      type: tool === 'pen' || tool === 'eraser' ? 'path' : tool === 'text' ? 'text' : tool,
      color: tool === 'eraser' ? '#1e293b' : color,
      strokeWidth: tool === 'eraser' ? strokeWidth * 5 : strokeWidth,
      points: tool === 'pen' || tool === 'eraser' ? [point] : undefined,
      startPoint: tool !== 'pen' && tool !== 'eraser' ? point : undefined
    }

    if (tool === 'text') {
      const text = prompt('Enter text:')
      if (text) {
        newElement.text = text
        newElement.endPoint = point
        saveElement(newElement)
      }
      setIsDrawing(false)
      return
    }

    setCurrentElement(newElement)
  }

  const draw = (e: React.MouseEvent) => {
    if (isPanning && lastPanPoint) {
      const dx = e.clientX - lastPanPoint.x
      const dy = e.clientY - lastPanPoint.y
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }))
      setLastPanPoint({ x: e.clientX, y: e.clientY })
      return
    }

    if (!isDrawing || !currentElement) return

    const point = getCanvasPoint(e)

    if (currentElement.type === 'path') {
      setCurrentElement({
        ...currentElement,
        points: [...(currentElement.points || []), point]
      })
    } else {
      setCurrentElement({
        ...currentElement,
        endPoint: point
      })
    }
  }

  const stopDrawing = () => {
    if (isPanning) {
      setIsPanning(false)
      setLastPanPoint(null)
      return
    }

    if (currentElement) {
      saveElement(currentElement)
    }
    setIsDrawing(false)
    setCurrentElement(null)
  }

  const saveElement = (element: DrawElement) => {
    const newElements = [...elements, element]
    setElements(newElements)

    // Save to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newElements)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setElements(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setElements(history[historyIndex + 1])
    }
  }

  const clear = () => {
    setElements([])
    setHistory([[]])
    setHistoryIndex(0)
    setOffset({ x: 0, y: 0 })
    setScale(1)
  }

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'whiteboard.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const tools: { id: Tool; icon: any; name: string }[] = [
    { id: 'select', icon: MousePointer, name: 'Select/Pan' },
    { id: 'pen', icon: Pencil, name: 'Pen' },
    { id: 'eraser', icon: Eraser, name: 'Eraser' },
    { id: 'line', icon: Minus, name: 'Line' },
    { id: 'rectangle', icon: Square, name: 'Rectangle' },
    { id: 'circle', icon: Circle, name: 'Circle' },
    { id: 'text', icon: Type, name: 'Text' }
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Toolbar */}
        <div className="flex flex-wrap gap-4 items-center mb-4">
          {/* Tools */}
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {tools.map(t => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`p-2 rounded-lg transition-colors ${
                  tool === t.id
                    ? 'bg-blue-500 text-white'
                    : 'text-white/70 hover:bg-white/10'
                }`}
                title={t.name}
              >
                <t.icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          {/* Colors */}
          <div className="flex gap-1">
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  color === c ? 'border-white scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-7 h-7 rounded-full cursor-pointer"
            />
          </div>

          {/* Stroke Width */}
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-sm">Size:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-white text-sm w-6">{strokeWidth}</span>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-white text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(s => Math.min(3, s + 0.1))}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-1 ml-auto">
            <button
              onClick={undo}
              disabled={historyIndex === 0}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-30"
              title="Undo"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-30"
              title="Redo"
            >
              <Redo className="w-5 h-5" />
            </button>
            <button
              onClick={clear}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              title="Clear"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={download}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="overflow-hidden rounded-xl border border-white/10">
          <canvas
            ref={canvasRef}
            width={1200}
            height={600}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full cursor-crosshair"
            style={{
              cursor: tool === 'select' ? 'grab' : 'crosshair'
            }}
          />
        </div>

        {/* Tips */}
        <div className="mt-4 text-white/50 text-sm">
          <span className="font-medium text-white/70">Tips:</span> Use Select tool to pan around. Scroll to zoom. Press Ctrl+Z to undo.
        </div>
      </motion.div>
    </div>
  )
}

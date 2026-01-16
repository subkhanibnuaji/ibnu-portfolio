'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Paintbrush, Eraser, Download, Trash2, Grid, Palette, Pipette, Undo, Redo } from 'lucide-react'

type Tool = 'brush' | 'eraser' | 'fill' | 'eyedropper'

interface HistoryState {
  pixels: string[][]
}

const PRESET_COLORS = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
  '#ff00ff', '#00ffff', '#ff8000', '#8000ff', '#0080ff', '#ff0080',
  '#808080', '#c0c0c0', '#800000', '#008000', '#000080', '#808000',
  '#800080', '#008080', '#ffc0cb', '#ffd700', '#98fb98', '#87ceeb',
]

const GRID_SIZES = [8, 16, 32, 64]

export function PixelArtEditor() {
  const [gridSize, setGridSize] = useState(16)
  const [pixels, setPixels] = useState<string[][]>([])
  const [currentColor, setCurrentColor] = useState('#000000')
  const [tool, setTool] = useState<Tool>('brush')
  const [showGrid, setShowGrid] = useState(true)
  const [isDrawing, setIsDrawing] = useState(false)
  const [history, setHistory] = useState<HistoryState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [customColors, setCustomColors] = useState<string[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const initializeGrid = useCallback((size: number) => {
    const newPixels = Array(size).fill(null).map(() => Array(size).fill('transparent'))
    setPixels(newPixels)
    setHistory([{ pixels: newPixels }])
    setHistoryIndex(0)
  }, [])

  useEffect(() => {
    initializeGrid(gridSize)
    const savedColors = localStorage.getItem('pixelArtCustomColors')
    if (savedColors) setCustomColors(JSON.parse(savedColors))
  }, [])

  const saveToHistory = (newPixels: string[][]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ pixels: newPixels.map(row => [...row]) })
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setPixels(history[historyIndex - 1].pixels.map(row => [...row]))
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setPixels(history[historyIndex + 1].pixels.map(row => [...row]))
    }
  }

  const floodFill = (startRow: number, startCol: number, targetColor: string, fillColor: string, grid: string[][]) => {
    if (targetColor === fillColor) return grid

    const newGrid = grid.map(row => [...row])
    const stack = [[startRow, startCol]]

    while (stack.length > 0) {
      const [row, col] = stack.pop()!
      if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) continue
      if (newGrid[row][col] !== targetColor) continue

      newGrid[row][col] = fillColor
      stack.push([row + 1, col], [row - 1, col], [row, col + 1], [row, col - 1])
    }

    return newGrid
  }

  const handlePixelAction = (row: number, col: number) => {
    const newPixels = pixels.map(r => [...r])

    switch (tool) {
      case 'brush':
        newPixels[row][col] = currentColor
        break
      case 'eraser':
        newPixels[row][col] = 'transparent'
        break
      case 'fill':
        const result = floodFill(row, col, pixels[row][col], currentColor, pixels)
        setPixels(result)
        saveToHistory(result)
        return
      case 'eyedropper':
        if (pixels[row][col] !== 'transparent') {
          setCurrentColor(pixels[row][col])
        }
        return
    }

    setPixels(newPixels)
  }

  const handleMouseDown = (row: number, col: number) => {
    setIsDrawing(true)
    handlePixelAction(row, col)
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (isDrawing && (tool === 'brush' || tool === 'eraser')) {
      handlePixelAction(row, col)
    }
  }

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false)
      saveToHistory(pixels)
    }
  }

  const clearCanvas = () => {
    initializeGrid(gridSize)
  }

  const handleGridSizeChange = (newSize: number) => {
    setGridSize(newSize)
    initializeGrid(newSize)
  }

  const addCustomColor = () => {
    if (!customColors.includes(currentColor)) {
      const newColors = [...customColors, currentColor].slice(-12)
      setCustomColors(newColors)
      localStorage.setItem('pixelArtCustomColors', JSON.stringify(newColors))
    }
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const scale = 512 / gridSize
    canvas.width = 512
    canvas.height = 512

    // Draw pixels
    pixels.forEach((row, rowIndex) => {
      row.forEach((color, colIndex) => {
        if (color !== 'transparent') {
          ctx.fillStyle = color
          ctx.fillRect(colIndex * scale, rowIndex * scale, scale, scale)
        }
      })
    })

    // Download
    const link = document.createElement('a')
    link.download = 'pixel-art.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const pixelSize = Math.min(400 / gridSize, 32)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Pixel Art Editor</h1>
        <p className="text-muted-foreground">Create beautiful pixel art masterpieces</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Toolbar */}
          <div className="lg:w-48 space-y-4">
            {/* Tools */}
            <div>
              <h3 className="text-sm font-medium mb-2">Tools</h3>
              <div className="grid grid-cols-4 lg:grid-cols-2 gap-2">
                <button
                  onClick={() => setTool('brush')}
                  className={`p-3 rounded-lg transition-colors ${
                    tool === 'brush' ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
                  }`}
                  title="Brush"
                >
                  <Paintbrush className="w-5 h-5 mx-auto" />
                </button>
                <button
                  onClick={() => setTool('eraser')}
                  className={`p-3 rounded-lg transition-colors ${
                    tool === 'eraser' ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
                  }`}
                  title="Eraser"
                >
                  <Eraser className="w-5 h-5 mx-auto" />
                </button>
                <button
                  onClick={() => setTool('fill')}
                  className={`p-3 rounded-lg transition-colors ${
                    tool === 'fill' ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
                  }`}
                  title="Fill"
                >
                  <Palette className="w-5 h-5 mx-auto" />
                </button>
                <button
                  onClick={() => setTool('eyedropper')}
                  className={`p-3 rounded-lg transition-colors ${
                    tool === 'eyedropper' ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
                  }`}
                  title="Eyedropper"
                >
                  <Pipette className="w-5 h-5 mx-auto" />
                </button>
              </div>
            </div>

            {/* Grid Size */}
            <div>
              <h3 className="text-sm font-medium mb-2">Grid Size</h3>
              <div className="grid grid-cols-4 lg:grid-cols-2 gap-2">
                {GRID_SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => handleGridSizeChange(size)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      gridSize === size ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {size}x{size}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Color */}
            <div>
              <h3 className="text-sm font-medium mb-2">Current Color</h3>
              <div className="flex items-center gap-2">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-foreground/20"
                  style={{ backgroundColor: currentColor }}
                />
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer"
                />
                <button
                  onClick={addCustomColor}
                  className="px-2 py-1 bg-muted hover:bg-muted/80 rounded text-xs"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Preset Colors */}
            <div>
              <h3 className="text-sm font-medium mb-2">Colors</h3>
              <div className="grid grid-cols-6 gap-1">
                {PRESET_COLORS.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentColor(color)}
                    className={`w-6 h-6 rounded transition-transform hover:scale-110 ${
                      currentColor === color ? 'ring-2 ring-blue-500' : ''
                    }`}
                    style={{ backgroundColor: color, border: color === '#ffffff' ? '1px solid #ccc' : 'none' }}
                  />
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            {customColors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Custom</h3>
                <div className="grid grid-cols-6 gap-1">
                  {customColors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentColor(color)}
                      className={`w-6 h-6 rounded transition-transform hover:scale-110 ${
                        currentColor === color ? 'ring-2 ring-blue-500' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-2 bg-muted hover:bg-muted/80 disabled:opacity-50 rounded-lg"
                title="Undo"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 bg-muted hover:bg-muted/80 disabled:opacity-50 rounded-lg"
                title="Redo"
              >
                <Redo className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2 rounded-lg ${showGrid ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'}`}
                title="Toggle Grid"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={clearCanvas}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={downloadImage}
                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 flex justify-center">
            <div
              className="inline-grid bg-muted/30 rounded-lg p-2"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, ${pixelSize}px)`,
                gap: showGrid ? '1px' : '0px',
              }}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {pixels.map((row, rowIndex) =>
                row.map((color, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="cursor-crosshair transition-colors"
                    style={{
                      width: pixelSize,
                      height: pixelSize,
                      backgroundColor: color === 'transparent' ? 'transparent' : color,
                      backgroundImage: color === 'transparent'
                        ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                        : 'none',
                      backgroundSize: `${pixelSize / 2}px ${pixelSize / 2}px`,
                      backgroundPosition: `0 0, 0 ${pixelSize / 4}px, ${pixelSize / 4}px -${pixelSize / 4}px, -${pixelSize / 4}px 0px`,
                    }}
                    onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Hidden canvas for export */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Instructions */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">How to Use</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Select a tool (Brush, Eraser, Fill, or Eyedropper)</li>
            <li>Choose a color from the palette or use the color picker</li>
            <li>Click and drag on the canvas to draw</li>
            <li>Use Undo/Redo to fix mistakes</li>
            <li>Download your artwork as a PNG image</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

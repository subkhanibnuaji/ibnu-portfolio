'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, LineChart, PieChart, Plus, Trash2,
  Download, Palette, Settings
} from 'lucide-react'

type ChartType = 'bar' | 'line' | 'pie' | 'doughnut'

interface DataPoint {
  label: string
  value: number
  color: string
}

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280', '#06b6d4'
]

export function ChartBuilder() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [chartType, setChartType] = useState<ChartType>('bar')
  const [title, setTitle] = useState('My Chart')
  const [data, setData] = useState<DataPoint[]>([
    { label: 'Category A', value: 30, color: COLORS[0] },
    { label: 'Category B', value: 45, color: COLORS[1] },
    { label: 'Category C', value: 25, color: COLORS[2] },
    { label: 'Category D', value: 60, color: COLORS[3] },
  ])
  const [showValues, setShowValues] = useState(true)
  const [showLegend, setShowLegend] = useState(true)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 60
    const legendWidth = showLegend ? 150 : 0

    // Clear
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, width, height)

    // Title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 18px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(title, (width - legendWidth) / 2, 30)

    const chartWidth = width - padding * 2 - legendWidth
    const chartHeight = height - padding * 2 - 20

    if (chartType === 'bar') {
      drawBarChart(ctx, chartWidth, chartHeight, padding)
    } else if (chartType === 'line') {
      drawLineChart(ctx, chartWidth, chartHeight, padding)
    } else if (chartType === 'pie' || chartType === 'doughnut') {
      drawPieChart(ctx, width - legendWidth, height, chartType === 'doughnut')
    }

    // Legend
    if (showLegend) {
      const legendX = width - legendWidth + 20
      let legendY = 60

      ctx.font = '12px sans-serif'
      ctx.textAlign = 'left'

      data.forEach((point, index) => {
        ctx.fillStyle = point.color
        ctx.fillRect(legendX, legendY, 16, 16)

        ctx.fillStyle = '#ffffff'
        ctx.fillText(`${point.label}: ${point.value}`, legendX + 24, legendY + 12)

        legendY += 28
      })
    }
  }, [chartType, title, data, showValues, showLegend])

  const drawBarChart = (ctx: CanvasRenderingContext2D, chartWidth: number, chartHeight: number, padding: number) => {
    const maxValue = Math.max(...data.map(d => d.value)) * 1.1
    const barWidth = (chartWidth - (data.length - 1) * 10) / data.length

    // Draw axes
    ctx.strokeStyle = '#475569'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, padding + chartHeight)
    ctx.lineTo(padding + chartWidth, padding + chartHeight)
    ctx.stroke()

    // Draw grid lines and labels
    ctx.fillStyle = '#94a3b8'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'right'

    for (let i = 0; i <= 5; i++) {
      const y = padding + chartHeight - (chartHeight * i / 5)
      const value = Math.round(maxValue * i / 5)

      ctx.strokeStyle = '#334155'
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()

      ctx.fillText(value.toString(), padding - 8, y + 4)
    }

    // Draw bars
    data.forEach((point, index) => {
      const x = padding + index * (barWidth + 10)
      const barHeight = (point.value / maxValue) * chartHeight
      const y = padding + chartHeight - barHeight

      // Gradient fill
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
      gradient.addColorStop(0, point.color)
      gradient.addColorStop(1, point.color + '80')

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, barHeight)

      // Value label
      if (showValues) {
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 12px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(point.value.toString(), x + barWidth / 2, y - 8)
      }

      // Category label
      ctx.fillStyle = '#94a3b8'
      ctx.font = '10px sans-serif'
      ctx.fillText(point.label, x + barWidth / 2, padding + chartHeight + 16)
    })
  }

  const drawLineChart = (ctx: CanvasRenderingContext2D, chartWidth: number, chartHeight: number, padding: number) => {
    const maxValue = Math.max(...data.map(d => d.value)) * 1.1
    const pointSpacing = chartWidth / (data.length - 1 || 1)

    // Draw axes
    ctx.strokeStyle = '#475569'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, padding + chartHeight)
    ctx.lineTo(padding + chartWidth, padding + chartHeight)
    ctx.stroke()

    // Draw grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + chartHeight - (chartHeight * i / 5)
      const value = Math.round(maxValue * i / 5)

      ctx.strokeStyle = '#334155'
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()

      ctx.fillStyle = '#94a3b8'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(value.toString(), padding - 8, y + 4)
    }

    // Calculate points
    const points = data.map((point, index) => ({
      x: padding + index * pointSpacing,
      y: padding + chartHeight - (point.value / maxValue) * chartHeight,
      ...point
    }))

    // Draw area fill
    ctx.beginPath()
    ctx.moveTo(points[0].x, padding + chartHeight)
    points.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.lineTo(points[points.length - 1].x, padding + chartHeight)
    ctx.closePath()

    const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight)
    gradient.addColorStop(0, '#3b82f6' + '40')
    gradient.addColorStop(1, '#3b82f6' + '00')
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw line
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    points.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw points
    points.forEach((point, index) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2)
      ctx.fillStyle = data[index].color
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()

      // Value label
      if (showValues) {
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 12px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(point.value.toString(), point.x, point.y - 12)
      }

      // Category label
      ctx.fillStyle = '#94a3b8'
      ctx.font = '10px sans-serif'
      ctx.fillText(point.label, point.x, padding + chartHeight + 16)
    })
  }

  const drawPieChart = (ctx: CanvasRenderingContext2D, width: number, height: number, isDoughnut: boolean) => {
    const centerX = width / 2
    const centerY = height / 2 + 20
    const radius = Math.min(width, height) / 3
    const innerRadius = isDoughnut ? radius * 0.5 : 0

    const total = data.reduce((sum, d) => sum + d.value, 0)
    let startAngle = -Math.PI / 2

    data.forEach((point, index) => {
      const sliceAngle = (point.value / total) * Math.PI * 2
      const endAngle = startAngle + sliceAngle

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX + innerRadius * Math.cos(startAngle), centerY + innerRadius * Math.sin(startAngle))
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.lineTo(centerX + innerRadius * Math.cos(endAngle), centerY + innerRadius * Math.sin(endAngle))
      if (innerRadius > 0) {
        ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true)
      }
      ctx.closePath()

      ctx.fillStyle = point.color
      ctx.fill()
      ctx.strokeStyle = '#1e293b'
      ctx.lineWidth = 2
      ctx.stroke()

      // Value label
      if (showValues) {
        const labelAngle = startAngle + sliceAngle / 2
        const labelRadius = radius * (isDoughnut ? 0.75 : 0.65)
        const labelX = centerX + labelRadius * Math.cos(labelAngle)
        const labelY = centerY + labelRadius * Math.sin(labelAngle)

        const percentage = Math.round((point.value / total) * 100)
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 12px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(`${percentage}%`, labelX, labelY)
      }

      startAngle = endAngle
    })

    // Center label for doughnut
    if (isDoughnut) {
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 24px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(total.toString(), centerX, centerY - 10)
      ctx.font = '12px sans-serif'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('Total', centerX, centerY + 15)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = 400
        draw()
      }
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [draw])

  useEffect(() => {
    draw()
  }, [draw])

  const addDataPoint = () => {
    const newColor = COLORS[data.length % COLORS.length]
    setData([...data, {
      label: `Category ${String.fromCharCode(65 + data.length)}`,
      value: Math.floor(Math.random() * 50) + 10,
      color: newColor
    }])
  }

  const updateDataPoint = (index: number, field: keyof DataPoint, value: string | number) => {
    const newData = [...data]
    newData[index] = { ...newData[index], [field]: value }
    setData(newData)
  }

  const deleteDataPoint = (index: number) => {
    if (data.length > 1) {
      setData(data.filter((_, i) => i !== index))
    }
  }

  const exportChart = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `chart-${chartType}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Chart type selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { type: 'bar' as ChartType, icon: BarChart3, label: 'Bar' },
            { type: 'line' as ChartType, icon: LineChart, label: 'Line' },
            { type: 'pie' as ChartType, icon: PieChart, label: 'Pie' },
            { type: 'doughnut' as ChartType, icon: PieChart, label: 'Doughnut' },
          ].map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                chartType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Title input */}
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Chart Title"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Canvas */}
        <div className="relative rounded-xl overflow-hidden mb-4">
          <canvas ref={canvasRef} className="w-full" />
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showValues}
              onChange={(e) => setShowValues(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-white/70">Show Values</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLegend}
              onChange={(e) => setShowLegend(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-white/70">Show Legend</span>
          </label>
          <button
            onClick={exportChart}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white/70 hover:bg-white/20 ml-auto"
          >
            <Download className="w-4 h-4" />
            Export PNG
          </button>
        </div>

        {/* Data editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">Data Points</h3>
            <button
              onClick={addDataPoint}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
            >
              <Plus className="w-4 h-4" />
              Add Point
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {data.map((point, index) => (
              <div key={index} className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                <input
                  type="color"
                  value={point.color}
                  onChange={(e) => updateDataPoint(index, 'color', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={point.label}
                  onChange={(e) => updateDataPoint(index, 'label', e.target.value)}
                  className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                  placeholder="Label"
                />
                <input
                  type="number"
                  value={point.value}
                  onChange={(e) => updateDataPoint(index, 'value', parseInt(e.target.value) || 0)}
                  className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                  placeholder="Value"
                />
                <button
                  onClick={() => deleteDataPoint(index)}
                  disabled={data.length <= 1}
                  className="p-1 text-red-400 hover:bg-red-500/20 rounded disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

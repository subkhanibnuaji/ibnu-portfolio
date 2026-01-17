'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, RefreshCw, Bitcoin, Activity, BarChart3, DollarSign, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BitcoinData {
  price: number
  change24h: number
  change7d: number
  change30d: number
  marketCap: number
  volume24h: number
  circulatingSupply: number
  maxSupply: number
  ath: number
  athDate: string
  athChangePercent: number
  lastUpdated: string
  sparkline7d: number[]
}

interface BitcoinWidgetProps {
  className?: string
  showSparkline?: boolean
}

export function BitcoinWidget({ className, showSparkline = true }: BitcoinWidgetProps) {
  const [data, setData] = useState<BitcoinData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const fetchData = async () => {
    try {
      setError(null)
      const response = await fetch('/api/crypto/bitcoin')
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        setError('Failed to fetch Bitcoin data')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Draw sparkline chart
  useEffect(() => {
    if (!canvasRef.current || !data?.sparkline7d?.length || !showSparkline) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const prices = data.sparkline7d
    const width = rect.width
    const height = rect.height

    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    if (data.change7d >= 0) {
      gradient.addColorStop(0, 'rgba(0, 255, 136, 0.3)')
      gradient.addColorStop(1, 'rgba(0, 255, 136, 0)')
    } else {
      gradient.addColorStop(0, 'rgba(255, 51, 102, 0.3)')
      gradient.addColorStop(1, 'rgba(255, 51, 102, 0)')
    }

    // Draw filled area
    ctx.beginPath()
    ctx.moveTo(0, height)

    prices.forEach((price, i) => {
      const x = (i / (prices.length - 1)) * width
      const y = height - ((price - minPrice) / priceRange) * height * 0.8 - height * 0.1
      if (i === 0) {
        ctx.lineTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.lineTo(width, height)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw line
    ctx.beginPath()
    prices.forEach((price, i) => {
      const x = (i / (prices.length - 1)) * width
      const y = height - ((price - minPrice) / priceRange) * height * 0.8 - height * 0.1
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.strokeStyle = data.change7d >= 0 ? '#00ff88' : '#ff3366'
    ctx.lineWidth = 2
    ctx.stroke()
  }, [data, showSparkline])

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    return `$${(num / 1e6).toFixed(2)}M`
  }

  const formatSupply = (supply: number) => {
    return `${(supply / 1e6).toFixed(2)}M BTC`
  }

  if (loading) {
    return (
      <div className={cn('p-6 bg-card border border-border rounded-2xl', className)}>
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-8 w-32 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
          </div>
          <div className="h-32 bg-muted rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className={cn('p-6 bg-card border border-border rounded-2xl', className)}>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{error || 'No data available'}</span>
          <button
            onClick={fetchData}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-6 bg-card border border-border rounded-2xl overflow-hidden relative',
        className
      )}
    >
      {/* Bitcoin icon background */}
      <div className="absolute top-4 right-4 opacity-5">
        <Bitcoin className="w-32 h-32 text-cyber-orange" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyber-orange to-yellow-500 flex items-center justify-center glow-orange">
            <Bitcoin className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              {formatPrice(data.price)}
              <span
                className={cn(
                  'flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full',
                  data.change24h >= 0
                    ? 'text-trading-profit bg-trading-profit/10'
                    : 'text-trading-loss bg-trading-loss/10'
                )}
              >
                {data.change24h >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(data.change24h).toFixed(2)}%
              </span>
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="text-cyber-orange font-semibold">Bitcoin</span>
              <span>BTC</span>
            </p>
          </div>
        </div>
        <button
          onClick={fetchData}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Sparkline Chart */}
      {showSparkline && data.sparkline7d?.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>7D Price Chart</span>
            <span
              className={cn(
                'font-medium',
                data.change7d >= 0 ? 'text-trading-profit' : 'text-trading-loss'
              )}
            >
              {data.change7d >= 0 ? '+' : ''}
              {data.change7d.toFixed(2)}%
            </span>
          </div>
          <canvas
            ref={canvasRef}
            className="w-full h-24 rounded-xl"
            style={{ width: '100%', height: '96px' }}
          />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <BarChart3 className="w-3 h-3" />
            Market Cap
          </div>
          <p className="font-semibold">{formatLargeNumber(data.marketCap)}</p>
        </div>
        <div className="p-3 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Activity className="w-3 h-3" />
            24h Volume
          </div>
          <p className="font-semibold">{formatLargeNumber(data.volume24h)}</p>
        </div>
        <div className="p-3 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <DollarSign className="w-3 h-3" />
            All-Time High
          </div>
          <p className="font-semibold">{formatPrice(data.ath)}</p>
          <p className="text-xs text-muted-foreground">{data.athChangePercent.toFixed(1)}% from ATH</p>
        </div>
        <div className="p-3 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Bitcoin className="w-3 h-3" />
            Circulating Supply
          </div>
          <p className="font-semibold">{formatSupply(data.circulatingSupply)}</p>
          <p className="text-xs text-muted-foreground">of {formatSupply(data.maxSupply)}</p>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
      </div>
    </motion.div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, RefreshCw, Coins } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CryptoPrice {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
}

interface CryptoPriceGridProps {
  className?: string
}

const cryptoIcons: Record<string, string> = {
  'BTC': '₿',
  'ETH': 'Ξ',
  'BNB': '⬡',
  'SOL': '◎',
  'ADA': '₳',
  'XRP': '✕',
  'DOT': '●',
  'DOGE': 'Ð',
  'AVAX': '🔺',
  'LINK': '⬡',
}

const cryptoColors: Record<string, { gradient: string; glow: string }> = {
  'BTC': { gradient: 'from-orange-500 to-yellow-500', glow: 'shadow-orange-500/30' },
  'ETH': { gradient: 'from-blue-500 to-purple-500', glow: 'shadow-blue-500/30' },
  'BNB': { gradient: 'from-yellow-500 to-amber-500', glow: 'shadow-yellow-500/30' },
  'SOL': { gradient: 'from-purple-500 to-pink-500', glow: 'shadow-purple-500/30' },
  'ADA': { gradient: 'from-blue-600 to-cyan-500', glow: 'shadow-blue-600/30' },
  'XRP': { gradient: 'from-gray-500 to-blue-500', glow: 'shadow-gray-500/30' },
  'DOT': { gradient: 'from-pink-500 to-rose-500', glow: 'shadow-pink-500/30' },
  'DOGE': { gradient: 'from-yellow-400 to-orange-400', glow: 'shadow-yellow-400/30' },
  'AVAX': { gradient: 'from-red-500 to-red-600', glow: 'shadow-red-500/30' },
  'LINK': { gradient: 'from-blue-500 to-indigo-500', glow: 'shadow-blue-500/30' },
}

export function CryptoPriceGrid({ className }: CryptoPriceGridProps) {
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrices = async () => {
    try {
      setError(null)
      const response = await fetch('/api/crypto/prices')
      const data = await response.json()

      if (data.success) {
        setPrices(data.data)
      } else {
        setError('Failed to fetch prices')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    if (price >= 1) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    return `$${price.toFixed(4)}`
  }

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(1)}B`
    return `$${(cap / 1e6).toFixed(0)}M`
  }

  if (loading) {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4', className)}>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="p-4 bg-card border border-border rounded-xl animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div className="space-y-1">
                <div className="h-4 w-12 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded" />
              </div>
            </div>
            <div className="h-6 w-20 bg-muted rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('p-6 bg-card border border-border rounded-xl text-center', className)}>
        <Coins className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground mb-3">{error}</p>
        <button
          onClick={fetchPrices}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4', className)}>
      {prices.map((coin, index) => {
        const colors = cryptoColors[coin.symbol] || { gradient: 'from-gray-500 to-gray-600', glow: 'shadow-gray-500/30' }
        const icon = cryptoIcons[coin.symbol] || '●'

        return (
          <motion.div
            key={coin.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              'p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all group',
              'hover:shadow-lg',
              colors.glow
            )}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg',
                  colors.gradient
                )}
              >
                {icon}
              </div>
              <div>
                <h4 className="font-bold">{coin.symbol}</h4>
                <p className="text-xs text-muted-foreground truncate max-w-[80px]">{coin.name}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-lg font-semibold">{formatPrice(coin.price)}</p>
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    coin.change24h >= 0 ? 'text-trading-profit' : 'text-trading-loss'
                  )}
                >
                  {coin.change24h >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(coin.change24h).toFixed(2)}%
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatMarketCap(coin.marketCap)}
                </span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

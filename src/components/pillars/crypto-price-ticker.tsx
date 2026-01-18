'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react'
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

interface CryptoPriceTickerProps {
  className?: string
}

export function CryptoPriceTicker({ className }: CryptoPriceTickerProps) {
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
    const interval = setInterval(fetchPrices, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    if (price >= 1) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`
  }

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`
    return `$${(cap / 1e6).toFixed(2)}M`
  }

  if (loading) {
    return (
      <div className={cn('overflow-hidden bg-card/50 border border-border rounded-xl', className)}>
        <div className="flex items-center gap-8 animate-pulse p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted rounded" />
                <div className="h-3 w-12 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('p-4 bg-card/50 border border-border rounded-xl', className)}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
          <button
            onClick={fetchPrices}
            className="ml-2 p-1 hover:bg-muted rounded transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('overflow-hidden bg-card/50 border border-border rounded-xl', className)}>
      <div className="relative">
        <motion.div
          className="flex gap-8 py-3 px-4"
          animate={{ x: [0, -1000] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 30,
              ease: 'linear',
            },
          }}
        >
          {/* Duplicate items for seamless loop */}
          {[...prices, ...prices].map((coin, index) => (
            <div
              key={`${coin.id}-${index}`}
              className="flex items-center gap-3 shrink-0"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyber-orange">{coin.symbol}</span>
                  <span className="font-semibold">{formatPrice(coin.price)}</span>
                  <span
                    className={cn(
                      'flex items-center gap-0.5 text-xs font-medium',
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
                </div>
                <span className="text-xs text-muted-foreground">
                  MCap: {formatMarketCap(coin.marketCap)}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, RefreshCw, Star, StarOff,
  Search, ArrowUpDown, DollarSign, Percent, BarChart3
} from 'lucide-react'

interface CryptoData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  price_change_percentage_24h: number
  price_change_percentage_7d_in_currency?: number
  total_volume: number
  circulating_supply: number
  sparkline_in_7d?: { price: number[] }
}

type SortField = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'market_cap'
type SortDirection = 'asc' | 'desc'

export function CryptoTracker() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortField, setSortField] = useState<SortField>('market_cap_rank')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [currency, setCurrency] = useState('usd')

  useEffect(() => {
    const saved = localStorage.getItem('crypto-favorites')
    if (saved) setFavorites(JSON.parse(saved))
  }, [])

  useEffect(() => {
    fetchCryptoData()
    const interval = setInterval(fetchCryptoData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [currency])

  const fetchCryptoData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Using a mock data approach since external APIs may have CORS issues
      // In production, you would use your own API endpoint or proxy
      const mockData: CryptoData[] = [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
          current_price: 43250.00,
          market_cap: 847000000000,
          market_cap_rank: 1,
          price_change_percentage_24h: 2.45,
          price_change_percentage_7d_in_currency: 5.32,
          total_volume: 28500000000,
          circulating_supply: 19500000
        },
        {
          id: 'ethereum',
          symbol: 'eth',
          name: 'Ethereum',
          image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
          current_price: 2650.00,
          market_cap: 318000000000,
          market_cap_rank: 2,
          price_change_percentage_24h: -1.23,
          price_change_percentage_7d_in_currency: 3.18,
          total_volume: 15200000000,
          circulating_supply: 120000000
        },
        {
          id: 'tether',
          symbol: 'usdt',
          name: 'Tether',
          image: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
          current_price: 1.00,
          market_cap: 95000000000,
          market_cap_rank: 3,
          price_change_percentage_24h: 0.01,
          price_change_percentage_7d_in_currency: 0.02,
          total_volume: 52000000000,
          circulating_supply: 95000000000
        },
        {
          id: 'binancecoin',
          symbol: 'bnb',
          name: 'BNB',
          image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
          current_price: 315.50,
          market_cap: 48500000000,
          market_cap_rank: 4,
          price_change_percentage_24h: 1.87,
          price_change_percentage_7d_in_currency: -2.45,
          total_volume: 890000000,
          circulating_supply: 153800000
        },
        {
          id: 'solana',
          symbol: 'sol',
          name: 'Solana',
          image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
          current_price: 98.75,
          market_cap: 42800000000,
          market_cap_rank: 5,
          price_change_percentage_24h: 4.56,
          price_change_percentage_7d_in_currency: 12.34,
          total_volume: 2150000000,
          circulating_supply: 434000000
        },
        {
          id: 'ripple',
          symbol: 'xrp',
          name: 'XRP',
          image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
          current_price: 0.62,
          market_cap: 33500000000,
          market_cap_rank: 6,
          price_change_percentage_24h: -0.85,
          price_change_percentage_7d_in_currency: 1.23,
          total_volume: 1250000000,
          circulating_supply: 54000000000
        },
        {
          id: 'cardano',
          symbol: 'ada',
          name: 'Cardano',
          image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
          current_price: 0.58,
          market_cap: 20500000000,
          market_cap_rank: 7,
          price_change_percentage_24h: 3.21,
          price_change_percentage_7d_in_currency: 8.76,
          total_volume: 485000000,
          circulating_supply: 35300000000
        },
        {
          id: 'dogecoin',
          symbol: 'doge',
          name: 'Dogecoin',
          image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
          current_price: 0.085,
          market_cap: 12100000000,
          market_cap_rank: 8,
          price_change_percentage_24h: -2.15,
          price_change_percentage_7d_in_currency: -5.43,
          total_volume: 520000000,
          circulating_supply: 142500000000
        },
        {
          id: 'polkadot',
          symbol: 'dot',
          name: 'Polkadot',
          image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
          current_price: 7.85,
          market_cap: 10200000000,
          market_cap_rank: 9,
          price_change_percentage_24h: 1.45,
          price_change_percentage_7d_in_currency: 4.32,
          total_volume: 285000000,
          circulating_supply: 1300000000
        },
        {
          id: 'avalanche',
          symbol: 'avax',
          name: 'Avalanche',
          image: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
          current_price: 38.50,
          market_cap: 14200000000,
          market_cap_rank: 10,
          price_change_percentage_24h: 5.67,
          price_change_percentage_7d_in_currency: 15.23,
          total_volume: 650000000,
          circulating_supply: 369000000
        }
      ]

      // Add some random variation to simulate live data
      const liveData = mockData.map(crypto => ({
        ...crypto,
        current_price: crypto.current_price * (1 + (Math.random() - 0.5) * 0.02),
        price_change_percentage_24h: crypto.price_change_percentage_24h + (Math.random() - 0.5) * 2
      }))

      setCryptos(liveData)
    } catch (err) {
      setError('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id]
    setFavorites(newFavorites)
    localStorage.setItem('crypto-favorites', JSON.stringify(newFavorites))
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const formatNumber = (num: number, decimals: number = 2): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(decimals)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
  }

  const formatPrice = (price: number): string => {
    if (price >= 1) return formatNumber(price, 2)
    if (price >= 0.01) return `$${price.toFixed(4)}`
    return `$${price.toFixed(6)}`
  }

  const filteredCryptos = cryptos
    .filter(crypto => {
      const matchesSearch = crypto.name.toLowerCase().includes(search.toLowerCase()) ||
                           crypto.symbol.toLowerCase().includes(search.toLowerCase())
      const matchesFavorites = !showFavoritesOnly || favorites.includes(crypto.id)
      return matchesSearch && matchesFavorites
    })
    .sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
      }
      return 0
    })

  const totalMarketCap = cryptos.reduce((sum, c) => sum + c.market_cap, 0)
  const totalVolume = cryptos.reduce((sum, c) => sum + c.total_volume, 0)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Market Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
              <BarChart3 className="w-4 h-4" />
              Total Market Cap
            </div>
            <div className="text-xl font-bold text-white">{formatNumber(totalMarketCap)}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
              <DollarSign className="w-4 h-4" />
              24h Volume
            </div>
            <div className="text-xl font-bold text-white">{formatNumber(totalVolume)}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              BTC Dominance
            </div>
            <div className="text-xl font-bold text-white">
              {((cryptos[0]?.market_cap || 0) / totalMarketCap * 100).toFixed(1)}%
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
              <Star className="w-4 h-4" />
              Watching
            </div>
            <div className="text-xl font-bold text-white">{favorites.length}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cryptocurrencies..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              showFavoritesOnly
                ? 'bg-yellow-500 text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Star className="w-4 h-4" />
            Favorites
          </button>

          <button
            onClick={fetchCryptoData}
            disabled={loading}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Table */}
        {error ? (
          <div className="text-center py-12 text-red-400">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-white/50 text-sm border-b border-white/10">
                  <th className="py-3 px-2 text-left w-8"></th>
                  <th
                    className="py-3 px-2 text-left cursor-pointer hover:text-white"
                    onClick={() => handleSort('market_cap_rank')}
                  >
                    <span className="flex items-center gap-1">
                      # <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="py-3 px-2 text-left">Name</th>
                  <th
                    className="py-3 px-2 text-right cursor-pointer hover:text-white"
                    onClick={() => handleSort('current_price')}
                  >
                    <span className="flex items-center justify-end gap-1">
                      Price <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th
                    className="py-3 px-2 text-right cursor-pointer hover:text-white"
                    onClick={() => handleSort('price_change_percentage_24h')}
                  >
                    <span className="flex items-center justify-end gap-1">
                      24h % <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th
                    className="py-3 px-2 text-right cursor-pointer hover:text-white hidden md:table-cell"
                    onClick={() => handleSort('market_cap')}
                  >
                    <span className="flex items-center justify-end gap-1">
                      Market Cap <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="py-3 px-2 text-right hidden lg:table-cell">Volume (24h)</th>
                </tr>
              </thead>
              <tbody>
                {filteredCryptos.map((crypto) => (
                  <motion.tr
                    key={crypto.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="py-3 px-2">
                      <button
                        onClick={() => toggleFavorite(crypto.id)}
                        className="text-white/30 hover:text-yellow-400"
                      >
                        {favorites.includes(crypto.id) ? (
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-2 text-white/50">{crypto.market_cap_rank}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={crypto.image}
                          alt={crypto.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="text-white font-medium">{crypto.name}</div>
                          <div className="text-white/50 text-sm uppercase">{crypto.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right text-white font-medium">
                      {formatPrice(crypto.current_price)}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className={`flex items-center justify-end gap-1 ${
                        crypto.price_change_percentage_24h >= 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}>
                        {crypto.price_change_percentage_24h >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-white/70 hidden md:table-cell">
                      {formatNumber(crypto.market_cap, 0)}
                    </td>
                    <td className="py-3 px-2 text-right text-white/70 hidden lg:table-cell">
                      {formatNumber(crypto.total_volume, 0)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredCryptos.length === 0 && !loading && !error && (
          <div className="text-center py-12 text-white/50">
            No cryptocurrencies found
          </div>
        )}
      </motion.div>
    </div>
  )
}

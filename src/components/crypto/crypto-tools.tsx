'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Calculator, Wallet, TrendingUp, Coins, RefreshCw, Copy, Check,
  DollarSign, Bitcoin, ArrowRightLeft, PiggyBank, BarChart3, Clock,
  AlertTriangle, CheckCircle, XCircle, Activity, Gauge, LineChart,
  Layers, Sparkles, Search, Globe, Shield, Zap, Target, Eye,
  TrendingDown, Flame, Snowflake, Sun, Moon, Cloud, Heart,
  Database, Link, Code, FileCode, Lock, Unlock, Gift, Timer,
  Percent, Scale, Box, Hexagon, CircleDot, Network, ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// CRYPTO UNIT CONVERTER
// ============================================

const CRYPTO_UNITS = {
  BTC: [
    { name: 'BTC', factor: 1, description: 'Bitcoin' },
    { name: 'mBTC', factor: 1000, description: 'Milli-Bitcoin' },
    { name: 'μBTC', factor: 1000000, description: 'Micro-Bitcoin' },
    { name: 'Satoshi', factor: 100000000, description: 'Smallest BTC unit' },
  ],
  ETH: [
    { name: 'ETH', factor: 1, description: 'Ether' },
    { name: 'Finney', factor: 1000, description: 'Milli-Ether' },
    { name: 'Szabo', factor: 1000000, description: 'Micro-Ether' },
    { name: 'Gwei', factor: 1000000000, description: 'Giga-Wei' },
    { name: 'Mwei', factor: 1000000000000, description: 'Mega-Wei' },
    { name: 'Kwei', factor: 1000000000000000, description: 'Kilo-Wei' },
    { name: 'Wei', factor: 1e18, description: 'Smallest ETH unit' },
  ],
}

export function CryptoUnitConverter() {
  const [crypto, setCrypto] = useState<'BTC' | 'ETH'>('BTC')
  const [amount, setAmount] = useState('')
  const [fromUnit, setFromUnit] = useState('BTC')
  const [results, setResults] = useState<{ name: string; value: string; description: string }[]>([])
  const [copied, setCopied] = useState('')

  const handleConvert = useCallback(() => {
    const value = parseFloat(amount)
    if (isNaN(value)) {
      setResults([])
      return
    }

    const units = CRYPTO_UNITS[crypto]
    const fromUnitData = units.find(u => u.name === fromUnit)
    if (!fromUnitData) return

    // Convert to base unit first
    const baseValue = value / fromUnitData.factor

    // Convert to all other units
    const conversions = units.map(unit => ({
      name: unit.name,
      value: (baseValue * unit.factor).toLocaleString('en-US', {
        maximumFractionDigits: 18,
        useGrouping: true,
      }),
      description: unit.description,
    }))

    setResults(conversions)
  }, [amount, crypto, fromUnit])

  useEffect(() => {
    handleConvert()
  }, [handleConvert])

  const handleCopy = async (value: string, unit: string) => {
    await navigator.clipboard.writeText(value.replace(/,/g, ''))
    setCopied(unit)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-cyber-orange/10 flex items-center justify-center">
          <ArrowRightLeft className="w-5 h-5 text-cyber-orange" />
        </div>
        <div>
          <h3 className="font-bold">Crypto Unit Converter</h3>
          <p className="text-xs text-muted-foreground">Convert between BTC/ETH units</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Crypto Selection */}
        <div className="flex gap-2">
          <button
            onClick={() => { setCrypto('BTC'); setFromUnit('BTC') }}
            className={cn(
              'flex-1 py-2 rounded-lg font-medium transition-colors',
              crypto === 'BTC'
                ? 'bg-orange-500 text-white'
                : 'bg-muted/50 hover:bg-muted text-muted-foreground'
            )}
          >
            Bitcoin
          </button>
          <button
            onClick={() => { setCrypto('ETH'); setFromUnit('ETH') }}
            className={cn(
              'flex-1 py-2 rounded-lg font-medium transition-colors',
              crypto === 'ETH'
                ? 'bg-blue-500 text-white'
                : 'bg-muted/50 hover:bg-muted text-muted-foreground'
            )}
          >
            Ethereum
          </button>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount..."
            className="flex-1 px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-cyber-orange focus:outline-none"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-cyber-orange focus:outline-none"
          >
            {CRYPTO_UNITS[crypto].map(unit => (
              <option key={unit.name} value={unit.name}>{unit.name}</option>
            ))}
          </select>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {results.map((result) => (
              <div
                key={result.name}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg transition-colors',
                  result.name === fromUnit ? 'bg-cyber-orange/10 border border-cyber-orange/20' : 'bg-muted/50'
                )}
              >
                <div>
                  <span className="font-mono font-bold">{result.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{result.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{result.value}</span>
                  <button
                    onClick={() => handleCopy(result.value, result.name)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    {copied === result.name ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// CRYPTO ROI CALCULATOR
// ============================================

export function CryptoROICalculator() {
  const [investment, setInvestment] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [currentPrice, setCurrentPrice] = useState('')
  const [sellFee, setSellFee] = useState('0.1')
  const [result, setResult] = useState<{
    coinsOwned: number
    currentValue: number
    profit: number
    profitPercent: number
    feeCost: number
  } | null>(null)

  const calculate = useCallback(() => {
    const inv = parseFloat(investment)
    const buy = parseFloat(buyPrice)
    const current = parseFloat(currentPrice)
    const fee = parseFloat(sellFee) / 100

    if (isNaN(inv) || isNaN(buy) || isNaN(current) || buy <= 0) {
      setResult(null)
      return
    }

    const coinsOwned = inv / buy
    const grossValue = coinsOwned * current
    const feeCost = grossValue * fee
    const currentValue = grossValue - feeCost
    const profit = currentValue - inv
    const profitPercent = (profit / inv) * 100

    setResult({
      coinsOwned,
      currentValue,
      profit,
      profitPercent,
      feeCost,
    })
  }, [investment, buyPrice, currentPrice, sellFee])

  useEffect(() => {
    calculate()
  }, [calculate])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h3 className="font-bold">ROI Calculator</h3>
          <p className="text-xs text-muted-foreground">Calculate your crypto profits</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Investment ($)</label>
            <input
              type="number"
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
              placeholder="1000"
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-green-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Buy Price ($)</label>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="50000"
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-green-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Current Price ($)</label>
            <input
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              placeholder="60000"
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-green-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Sell Fee (%)</label>
            <input
              type="number"
              value={sellFee}
              onChange={(e) => setSellFee(e.target.value)}
              placeholder="0.1"
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-green-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        {result && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Coins Owned:</span>
              <span className="font-mono">{result.coinsOwned.toFixed(8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Value:</span>
              <span className="font-mono">${result.currentValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fee Cost:</span>
              <span className="font-mono text-yellow-500">-${result.feeCost.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-medium">Profit/Loss:</span>
                <span className={cn(
                  'font-mono font-bold',
                  result.profit >= 0 ? 'text-green-500' : 'text-red-500'
                )}>
                  {result.profit >= 0 ? '+' : ''}{result.profit.toFixed(2)} ({result.profitPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// DCA (DOLLAR COST AVERAGING) CALCULATOR
// ============================================

export function DCACalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState('100')
  const [months, setMonths] = useState('12')
  const [startPrice, setStartPrice] = useState('50000')
  const [endPrice, setEndPrice] = useState('60000')
  const [result, setResult] = useState<{
    totalInvested: number
    totalCoins: number
    averagePrice: number
    finalValue: number
    profit: number
    profitPercent: number
  } | null>(null)

  const calculate = useCallback(() => {
    const monthly = parseFloat(monthlyInvestment)
    const numMonths = parseInt(months)
    const start = parseFloat(startPrice)
    const end = parseFloat(endPrice)

    if (isNaN(monthly) || isNaN(numMonths) || isNaN(start) || isNaN(end) || numMonths <= 0) {
      setResult(null)
      return
    }

    // Simulate linear price change for simplicity
    const priceChange = (end - start) / numMonths
    let totalCoins = 0
    let totalInvested = 0

    for (let i = 0; i < numMonths; i++) {
      const priceAtMonth = start + (priceChange * i)
      const coinsThisMonth = monthly / priceAtMonth
      totalCoins += coinsThisMonth
      totalInvested += monthly
    }

    const averagePrice = totalInvested / totalCoins
    const finalValue = totalCoins * end
    const profit = finalValue - totalInvested
    const profitPercent = (profit / totalInvested) * 100

    setResult({
      totalInvested,
      totalCoins,
      averagePrice,
      finalValue,
      profit,
      profitPercent,
    })
  }, [monthlyInvestment, months, startPrice, endPrice])

  useEffect(() => {
    calculate()
  }, [calculate])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <PiggyBank className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <h3 className="font-bold">DCA Calculator</h3>
          <p className="text-xs text-muted-foreground">Dollar Cost Averaging simulation</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Monthly ($)</label>
            <input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-purple-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Months</label>
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-purple-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Start Price ($)</label>
            <input
              type="number"
              value={startPrice}
              onChange={(e) => setStartPrice(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-purple-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">End Price ($)</label>
            <input
              type="number"
              value={endPrice}
              onChange={(e) => setEndPrice(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-purple-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        {result && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Invested:</span>
              <span className="font-mono">${result.totalInvested.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Coins Accumulated:</span>
              <span className="font-mono">{result.totalCoins.toFixed(8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg. Buy Price:</span>
              <span className="font-mono">${result.averagePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Final Value:</span>
              <span className="font-mono">${result.finalValue.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-medium">Total Return:</span>
                <span className={cn(
                  'font-mono font-bold',
                  result.profit >= 0 ? 'text-green-500' : 'text-red-500'
                )}>
                  {result.profit >= 0 ? '+' : ''}${result.profit.toFixed(2)} ({result.profitPercent.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// WALLET ADDRESS VALIDATOR
// ============================================

const WALLET_PATTERNS = {
  BTC: {
    legacy: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
    segwit: /^bc1[a-zA-HJ-NP-Z0-9]{25,90}$/,
    bech32m: /^bc1p[a-zA-HJ-NP-Z0-9]{58}$/,
  },
  ETH: {
    standard: /^0x[a-fA-F0-9]{40}$/,
  },
  SOL: {
    standard: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  },
  LTC: {
    legacy: /^[LM][a-km-zA-HJ-NP-Z1-9]{26,33}$/,
    segwit: /^ltc1[a-zA-HJ-NP-Z0-9]{39,59}$/,
  },
  DOGE: {
    standard: /^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/,
  },
}

type WalletType = keyof typeof WALLET_PATTERNS

export function WalletAddressValidator() {
  const [address, setAddress] = useState('')
  const [result, setResult] = useState<{
    isValid: boolean
    type: string
    format: string
  } | null>(null)

  const validate = useCallback(() => {
    if (!address.trim()) {
      setResult(null)
      return
    }

    // Check each cryptocurrency pattern
    for (const [crypto, patterns] of Object.entries(WALLET_PATTERNS)) {
      for (const [format, pattern] of Object.entries(patterns)) {
        if (pattern.test(address)) {
          setResult({
            isValid: true,
            type: crypto,
            format: format.charAt(0).toUpperCase() + format.slice(1),
          })
          return
        }
      }
    }

    setResult({
      isValid: false,
      type: 'Unknown',
      format: 'Invalid format',
    })
  }, [address])

  useEffect(() => {
    validate()
  }, [validate])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-bold">Address Validator</h3>
          <p className="text-xs text-muted-foreground">Validate crypto wallet addresses</p>
        </div>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter wallet address..."
          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-blue-500 focus:outline-none font-mono text-sm"
        />

        {result && (
          <div className={cn(
            'p-4 rounded-lg flex items-center gap-3',
            result.isValid
              ? 'bg-green-500/10 border border-green-500/20'
              : 'bg-red-500/10 border border-red-500/20'
          )}>
            {result.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 shrink-0" />
            )}
            <div>
              <p className={cn('font-medium', result.isValid ? 'text-green-500' : 'text-red-500')}>
                {result.isValid ? 'Valid Address' : 'Invalid Address'}
              </p>
              {result.isValid && (
                <p className="text-sm text-muted-foreground">
                  {result.type} ({result.format})
                </p>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Supported formats:</p>
          <ul className="grid grid-cols-2 gap-1">
            <li>• Bitcoin (Legacy, SegWit, Taproot)</li>
            <li>• Ethereum (0x...)</li>
            <li>• Solana</li>
            <li>• Litecoin (Legacy, SegWit)</li>
            <li>• Dogecoin</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MARKET CAP CALCULATOR
// ============================================

export function MarketCapCalculator() {
  const [price, setPrice] = useState('')
  const [supply, setSupply] = useState('')
  const [targetMarketCap, setTargetMarketCap] = useState('')
  const [result, setResult] = useState<{
    marketCap: number
    targetPrice: number
    multiplier: number
  } | null>(null)

  const calculate = useCallback(() => {
    const priceNum = parseFloat(price)
    const supplyNum = parseFloat(supply.replace(/,/g, ''))
    const targetMC = parseFloat(targetMarketCap.replace(/,/g, ''))

    if (isNaN(priceNum) || isNaN(supplyNum)) {
      setResult(null)
      return
    }

    const marketCap = priceNum * supplyNum
    const targetPrice = !isNaN(targetMC) ? targetMC / supplyNum : priceNum
    const multiplier = targetPrice / priceNum

    setResult({
      marketCap,
      targetPrice,
      multiplier,
    })
  }, [price, supply, targetMarketCap])

  useEffect(() => {
    calculate()
  }, [calculate])

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-yellow-500" />
        </div>
        <div>
          <h3 className="font-bold">Market Cap Calculator</h3>
          <p className="text-xs text-muted-foreground">Calculate market cap & price targets</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Current Price ($)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.50"
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-yellow-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Circulating Supply</label>
            <input
              type="text"
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
              placeholder="1,000,000,000"
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-yellow-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Target Market Cap (optional)</label>
          <input
            type="text"
            value={targetMarketCap}
            onChange={(e) => setTargetMarketCap(e.target.value)}
            placeholder="1,000,000,000"
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-yellow-500 focus:outline-none text-sm"
          />
        </div>

        {result && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Market Cap:</span>
              <span className="font-mono font-bold">{formatNumber(result.marketCap)}</span>
            </div>
            {targetMarketCap && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price at Target MC:</span>
                  <span className="font-mono font-bold text-yellow-500">
                    ${result.targetPrice.toFixed(result.targetPrice < 1 ? 6 : 2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Multiplier Needed:</span>
                  <span className={cn(
                    'font-mono font-bold',
                    result.multiplier >= 1 ? 'text-green-500' : 'text-red-500'
                  )}>
                    {result.multiplier.toFixed(2)}x
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// GAS FEE ESTIMATOR
// ============================================

export function GasFeeEstimator() {
  const [gasPrice, setGasPrice] = useState('30')
  const [gasLimit, setGasLimit] = useState('21000')
  const [ethPrice, setEthPrice] = useState('2000')
  const [result, setResult] = useState<{
    gasFeeGwei: number
    gasFeeETH: number
    gasFeeUSD: number
  } | null>(null)

  const COMMON_GAS_LIMITS = [
    { name: 'ETH Transfer', limit: 21000 },
    { name: 'ERC-20 Transfer', limit: 65000 },
    { name: 'ERC-20 Approve', limit: 45000 },
    { name: 'NFT Transfer', limit: 85000 },
    { name: 'Uniswap Swap', limit: 150000 },
    { name: 'NFT Mint', limit: 200000 },
  ]

  const calculate = useCallback(() => {
    const gp = parseFloat(gasPrice)
    const gl = parseFloat(gasLimit)
    const ep = parseFloat(ethPrice)

    if (isNaN(gp) || isNaN(gl) || isNaN(ep)) {
      setResult(null)
      return
    }

    const gasFeeGwei = gp * gl
    const gasFeeETH = gasFeeGwei / 1e9
    const gasFeeUSD = gasFeeETH * ep

    setResult({
      gasFeeGwei,
      gasFeeETH,
      gasFeeUSD,
    })
  }, [gasPrice, gasLimit, ethPrice])

  useEffect(() => {
    calculate()
  }, [calculate])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
          <Coins className="w-5 h-5 text-cyan-500" />
        </div>
        <div>
          <h3 className="font-bold">Gas Fee Estimator</h3>
          <p className="text-xs text-muted-foreground">Estimate Ethereum transaction fees</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Gas Price (Gwei)</label>
            <input
              type="number"
              value={gasPrice}
              onChange={(e) => setGasPrice(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-cyan-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Gas Limit</label>
            <input
              type="number"
              value={gasLimit}
              onChange={(e) => setGasLimit(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-cyan-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">ETH Price ($)</label>
            <input
              type="number"
              value={ethPrice}
              onChange={(e) => setEthPrice(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-cyan-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Quick gas limit presets */}
        <div className="flex flex-wrap gap-1">
          {COMMON_GAS_LIMITS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setGasLimit(preset.limit.toString())}
              className={cn(
                'px-2 py-1 rounded text-xs transition-colors',
                gasLimit === preset.limit.toString()
                  ? 'bg-cyan-500 text-white'
                  : 'bg-muted/50 hover:bg-muted text-muted-foreground'
              )}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {result && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Gas Fee (Gwei):</span>
              <span className="font-mono">{result.gasFeeGwei.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Gas Fee (ETH):</span>
              <span className="font-mono">{result.gasFeeETH.toFixed(6)} ETH</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-medium">Total Cost:</span>
                <span className="font-mono font-bold text-cyan-500">
                  ${result.gasFeeUSD.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// CRYPTO TOOLS GRID
// ============================================

// ============================================
// IMPERMANENT LOSS CALCULATOR
// ============================================

export function ImpermanentLossCalculator() {
  const [initialPrice, setInitialPrice] = useState('1000')
  const [currentPrice, setCurrentPrice] = useState('1500')
  const [result, setResult] = useState<{
    priceRatio: number
    impermanentLoss: number
    holdValue: number
    lpValue: number
  } | null>(null)

  const calculate = useCallback(() => {
    const initial = parseFloat(initialPrice)
    const current = parseFloat(currentPrice)

    if (isNaN(initial) || isNaN(current) || initial <= 0) {
      setResult(null)
      return
    }

    const priceRatio = current / initial
    // IL formula: 2 * sqrt(priceRatio) / (1 + priceRatio) - 1
    const ilFactor = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio)
    const impermanentLoss = (1 - ilFactor) * 100

    // Assuming $1000 initial investment, 50/50 split
    const initialInvestment = 1000
    const holdValue = (initialInvestment / 2) + (initialInvestment / 2) * priceRatio
    const lpValue = holdValue * ilFactor

    setResult({
      priceRatio,
      impermanentLoss,
      holdValue,
      lpValue,
    })
  }, [initialPrice, currentPrice])

  useEffect(() => {
    calculate()
  }, [calculate])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h3 className="font-bold">Impermanent Loss Calculator</h3>
          <p className="text-xs text-muted-foreground">Calculate LP impermanent loss</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Initial Price ($)</label>
            <input
              type="number"
              value={initialPrice}
              onChange={(e) => setInitialPrice(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-red-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Current Price ($)</label>
            <input
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-red-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="p-4 bg-red-500/10 rounded-lg text-center">
              <p className="text-3xl font-bold text-red-500">-{result.impermanentLoss.toFixed(2)}%</p>
              <p className="text-sm text-muted-foreground">Impermanent Loss</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <p className="text-lg font-bold">${result.holdValue.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">If HODL</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <p className="text-lg font-bold">${result.lpValue.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">If LP</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Price ratio: {result.priceRatio.toFixed(2)}x | Assumes 50/50 pool with $1000 initial
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// STAKING REWARDS CALCULATOR
// ============================================

export function StakingRewardsCalculator() {
  const [amount, setAmount] = useState('10000')
  const [apy, setApy] = useState('5')
  const [duration, setDuration] = useState('12')
  const [compounding, setCompounding] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('daily')
  const [result, setResult] = useState<{
    finalAmount: number
    rewards: number
    effectiveApy: number
  } | null>(null)

  const calculate = useCallback(() => {
    const principal = parseFloat(amount)
    const apyPercent = parseFloat(apy) / 100
    const months = parseFloat(duration)

    if (isNaN(principal) || isNaN(apyPercent) || isNaN(months)) {
      setResult(null)
      return
    }

    const years = months / 12
    let finalAmount: number
    let effectiveApy: number

    switch (compounding) {
      case 'none':
        finalAmount = principal * (1 + apyPercent * years)
        effectiveApy = apyPercent * 100
        break
      case 'daily':
        finalAmount = principal * Math.pow(1 + apyPercent / 365, 365 * years)
        effectiveApy = (Math.pow(1 + apyPercent / 365, 365) - 1) * 100
        break
      case 'weekly':
        finalAmount = principal * Math.pow(1 + apyPercent / 52, 52 * years)
        effectiveApy = (Math.pow(1 + apyPercent / 52, 52) - 1) * 100
        break
      case 'monthly':
        finalAmount = principal * Math.pow(1 + apyPercent / 12, 12 * years)
        effectiveApy = (Math.pow(1 + apyPercent / 12, 12) - 1) * 100
        break
    }

    setResult({
      finalAmount,
      rewards: finalAmount - principal,
      effectiveApy,
    })
  }, [amount, apy, duration, compounding])

  useEffect(() => {
    calculate()
  }, [calculate])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
          <PiggyBank className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h3 className="font-bold">Staking Rewards</h3>
          <p className="text-xs text-muted-foreground">Calculate staking earnings</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-green-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">APY (%)</label>
            <input
              type="number"
              value={apy}
              onChange={(e) => setApy(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-green-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Duration (months)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-green-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Compounding</label>
            <select
              value={compounding}
              onChange={(e) => setCompounding(e.target.value as typeof compounding)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-green-500 focus:outline-none text-sm"
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        {result && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Final Amount:</span>
              <span className="font-mono font-bold text-green-500">${result.finalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Rewards:</span>
              <span className="font-mono font-bold">+${result.rewards.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Effective APY:</span>
              <span className="font-mono">{result.effectiveApy.toFixed(2)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// LIQUIDATION PRICE CALCULATOR
// ============================================

export function LiquidationCalculator() {
  const [entryPrice, setEntryPrice] = useState('50000')
  const [leverage, setLeverage] = useState('10')
  const [positionType, setPositionType] = useState<'long' | 'short'>('long')
  const [maintenanceMargin, setMaintenanceMargin] = useState('0.5')
  const [result, setResult] = useState<{
    liquidationPrice: number
    distance: number
  } | null>(null)

  const calculate = useCallback(() => {
    const entry = parseFloat(entryPrice)
    const lev = parseFloat(leverage)
    const mm = parseFloat(maintenanceMargin) / 100

    if (isNaN(entry) || isNaN(lev) || isNaN(mm) || lev <= 0) {
      setResult(null)
      return
    }

    let liquidationPrice: number
    if (positionType === 'long') {
      // Liq price for long: Entry * (1 - 1/leverage + mm)
      liquidationPrice = entry * (1 - (1 / lev) + mm)
    } else {
      // Liq price for short: Entry * (1 + 1/leverage - mm)
      liquidationPrice = entry * (1 + (1 / lev) - mm)
    }

    const distance = Math.abs((liquidationPrice - entry) / entry) * 100

    setResult({
      liquidationPrice,
      distance,
    })
  }, [entryPrice, leverage, positionType, maintenanceMargin])

  useEffect(() => {
    calculate()
  }, [calculate])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
        </div>
        <div>
          <h3 className="font-bold">Liquidation Calculator</h3>
          <p className="text-xs text-muted-foreground">Calculate liquidation price</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2 rounded-lg overflow-hidden border border-border">
          <button
            onClick={() => setPositionType('long')}
            className={cn(
              'flex-1 py-2 text-sm font-medium transition-colors',
              positionType === 'long' ? 'bg-green-500 text-white' : 'bg-muted/50 hover:bg-muted'
            )}
          >
            Long
          </button>
          <button
            onClick={() => setPositionType('short')}
            className={cn(
              'flex-1 py-2 text-sm font-medium transition-colors',
              positionType === 'short' ? 'bg-red-500 text-white' : 'bg-muted/50 hover:bg-muted'
            )}
          >
            Short
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Entry Price ($)</label>
            <input
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-yellow-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Leverage (x)</label>
            <input
              type="number"
              value={leverage}
              onChange={(e) => setLeverage(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-yellow-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Maintenance Margin (%)</label>
          <input
            type="number"
            value={maintenanceMargin}
            onChange={(e) => setMaintenanceMargin(e.target.value)}
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-yellow-500 focus:outline-none text-sm"
          />
        </div>

        {result && (
          <div className="p-4 bg-yellow-500/10 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-500">${result.liquidationPrice.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              {result.distance.toFixed(1)}% {positionType === 'long' ? 'below' : 'above'} entry
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// BITCOIN HALVING COUNTDOWN
// ============================================

export function BitcoinHalvingCountdown() {
  // Next halving estimated April 2028 (block 1,050,000)
  const NEXT_HALVING_DATE = new Date('2028-04-15T00:00:00Z')
  const CURRENT_REWARD = 3.125 // BTC per block
  const NEXT_REWARD = 1.5625 // BTC per block after halving

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const diff = NEXT_HALVING_DATE.getTime() - now.getTime()

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
          <Bitcoin className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h3 className="font-bold">Bitcoin Halving Countdown</h3>
          <p className="text-xs text-muted-foreground">Time until next block reward halving</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Countdown */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: timeLeft.days, label: 'Days' },
            { value: timeLeft.hours, label: 'Hours' },
            { value: timeLeft.minutes, label: 'Mins' },
            { value: timeLeft.seconds, label: 'Secs' },
          ].map((item) => (
            <div key={item.label} className="p-3 bg-orange-500/10 rounded-lg text-center">
              <p className="text-2xl font-bold text-orange-500 font-mono">{item.value.toString().padStart(2, '0')}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="p-3 bg-muted/50 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Reward:</span>
            <span className="font-mono font-bold">{CURRENT_REWARD} BTC</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">After Halving:</span>
            <span className="font-mono font-bold text-orange-500">{NEXT_REWARD} BTC</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Est. Date:</span>
            <span className="font-mono">April 2028</span>
          </div>
        </div>

        {/* Historical Halvings */}
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Previous Halvings:</p>
          <div className="grid grid-cols-2 gap-1">
            <span>2012: 50 → 25 BTC</span>
            <span>2016: 25 → 12.5 BTC</span>
            <span>2020: 12.5 → 6.25 BTC</span>
            <span>2024: 6.25 → 3.125 BTC</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MINING PROFITABILITY CALCULATOR
// ============================================

export function MiningCalculator() {
  const [hashrate, setHashrate] = useState('100')
  const [power, setPower] = useState('3000')
  const [electricityCost, setElectricityCost] = useState('0.10')
  const [btcPrice, setBtcPrice] = useState('60000')
  const [poolFee, setPoolFee] = useState('2')
  const [result, setResult] = useState<{
    dailyBTC: number
    dailyRevenue: number
    dailyPowerCost: number
    dailyProfit: number
    monthlyProfit: number
  } | null>(null)

  // Network hashrate ~600 EH/s, block reward 3.125 BTC, 144 blocks/day
  const NETWORK_HASHRATE = 600e18 // 600 EH/s
  const BLOCKS_PER_DAY = 144
  const BLOCK_REWARD = 3.125

  const calculate = useCallback(() => {
    const hr = parseFloat(hashrate) * 1e12 // Convert TH/s to H/s
    const pw = parseFloat(power)
    const elec = parseFloat(electricityCost)
    const price = parseFloat(btcPrice)
    const fee = parseFloat(poolFee) / 100

    if (isNaN(hr) || isNaN(pw) || isNaN(elec) || isNaN(price) || isNaN(fee)) {
      setResult(null)
      return
    }

    // Daily BTC mined = (hashrate / network_hashrate) * blocks_per_day * block_reward
    const dailyBTC = (hr / NETWORK_HASHRATE) * BLOCKS_PER_DAY * BLOCK_REWARD * (1 - fee)
    const dailyRevenue = dailyBTC * price
    const dailyPowerCost = (pw / 1000) * 24 * elec // kWh * 24 hours * cost
    const dailyProfit = dailyRevenue - dailyPowerCost

    setResult({
      dailyBTC,
      dailyRevenue,
      dailyPowerCost,
      dailyProfit,
      monthlyProfit: dailyProfit * 30,
    })
  }, [hashrate, power, electricityCost, btcPrice, poolFee])

  useEffect(() => {
    calculate()
  }, [calculate])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-yellow-500" />
        </div>
        <div>
          <h3 className="font-bold">Mining Calculator</h3>
          <p className="text-xs text-muted-foreground">Estimate BTC mining profitability</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Hashrate (TH/s)</label>
            <input
              type="number"
              value={hashrate}
              onChange={(e) => setHashrate(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-yellow-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Power (W)</label>
            <input
              type="number"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-yellow-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Electricity ($/kWh)</label>
            <input
              type="number"
              value={electricityCost}
              onChange={(e) => setElectricityCost(e.target.value)}
              step="0.01"
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-yellow-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">BTC Price ($)</label>
            <input
              type="number"
              value={btcPrice}
              onChange={(e) => setBtcPrice(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-yellow-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        {result && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Daily BTC:</span>
              <span className="font-mono">{result.dailyBTC.toFixed(8)} BTC</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Daily Revenue:</span>
              <span className="font-mono text-green-500">${result.dailyRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Daily Power Cost:</span>
              <span className="font-mono text-red-500">-${result.dailyPowerCost.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-medium">Daily Profit:</span>
                <span className={cn(
                  'font-mono font-bold',
                  result.dailyProfit >= 0 ? 'text-green-500' : 'text-red-500'
                )}>
                  ${result.dailyProfit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Monthly Profit:</span>
                <span className={cn(
                  'font-mono',
                  result.monthlyProfit >= 0 ? 'text-green-500' : 'text-red-500'
                )}>
                  ${result.monthlyProfit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// FEAR & GREED INDEX
// ============================================

const FEAR_GREED_LEVELS = [
  { min: 0, max: 24, label: 'Extreme Fear', color: 'text-red-500', bg: 'bg-red-500', emoji: '😱' },
  { min: 25, max: 44, label: 'Fear', color: 'text-orange-500', bg: 'bg-orange-500', emoji: '😨' },
  { min: 45, max: 55, label: 'Neutral', color: 'text-yellow-500', bg: 'bg-yellow-500', emoji: '😐' },
  { min: 56, max: 75, label: 'Greed', color: 'text-green-500', bg: 'bg-green-500', emoji: '😊' },
  { min: 76, max: 100, label: 'Extreme Greed', color: 'text-emerald-500', bg: 'bg-emerald-500', emoji: '🤑' },
]

export function FearGreedIndex() {
  const [factors, setFactors] = useState({
    volatility: 50,
    momentum: 50,
    social: 50,
    dominance: 50,
    trends: 50,
  })

  const calculateIndex = useCallback(() => {
    // Weighted average of factors
    const weights = { volatility: 0.25, momentum: 0.25, social: 0.15, dominance: 0.1, trends: 0.25 }
    let total = 0
    for (const [key, weight] of Object.entries(weights)) {
      total += factors[key as keyof typeof factors] * weight
    }
    return Math.round(total)
  }, [factors])

  const index = calculateIndex()
  const level = FEAR_GREED_LEVELS.find(l => index >= l.min && index <= l.max) || FEAR_GREED_LEVELS[2]

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
          <Gauge className="w-5 h-5 text-yellow-500" />
        </div>
        <div>
          <h3 className="font-bold">Fear & Greed Index</h3>
          <p className="text-xs text-muted-foreground">Market sentiment simulator</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Main Index Display */}
        <div className="relative p-6 rounded-lg bg-gradient-to-br from-muted/50 to-muted/20">
          <div className="text-center">
            <span className="text-5xl">{level.emoji}</span>
            <p className={cn('text-4xl font-bold mt-2', level.color)}>{index}</p>
            <p className={cn('text-lg font-medium', level.color)}>{level.label}</p>
          </div>

          {/* Gradient Bar */}
          <div className="mt-4 h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-gray-800 shadow-lg transition-all"
              style={{ left: `calc(${index}% - 8px)` }}
            />
          </div>
        </div>

        {/* Factor Sliders */}
        <div className="space-y-3">
          {[
            { key: 'volatility', label: 'Volatility', desc: 'Market price swings' },
            { key: 'momentum', label: 'Momentum', desc: 'Volume & price trends' },
            { key: 'social', label: 'Social Media', desc: 'Twitter/Reddit sentiment' },
            { key: 'dominance', label: 'BTC Dominance', desc: 'Bitcoin market share' },
            { key: 'trends', label: 'Search Trends', desc: 'Google search interest' },
          ].map((factor) => (
            <div key={factor.key} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium">{factor.label}</span>
                <span className="text-muted-foreground">{factors[factor.key as keyof typeof factors]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={factors[factor.key as keyof typeof factors]}
                onChange={(e) => setFactors(prev => ({ ...prev, [factor.key]: parseInt(e.target.value) }))}
                className="w-full h-2 rounded-full bg-muted appearance-none cursor-pointer accent-yellow-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// RSI CALCULATOR
// ============================================

export function RSICalculator() {
  const [prices, setPrices] = useState('100,102,101,103,105,104,106,108,107,109,111,110,112,114,113')
  const [period, setPeriod] = useState('14')
  const [result, setResult] = useState<{
    rsi: number
    avgGain: number
    avgLoss: number
    signal: string
  } | null>(null)

  const calculate = useCallback(() => {
    const priceArray = prices.split(',').map(p => parseFloat(p.trim())).filter(p => !isNaN(p))
    const periodNum = parseInt(period)

    if (priceArray.length < periodNum + 1) {
      setResult(null)
      return
    }

    // Calculate price changes
    const changes: number[] = []
    for (let i = 1; i < priceArray.length; i++) {
      changes.push(priceArray[i] - priceArray[i - 1])
    }

    // Calculate gains and losses
    const gains = changes.map(c => c > 0 ? c : 0)
    const losses = changes.map(c => c < 0 ? Math.abs(c) : 0)

    // Calculate average gain/loss for first period
    let avgGain = gains.slice(0, periodNum).reduce((a, b) => a + b, 0) / periodNum
    let avgLoss = losses.slice(0, periodNum).reduce((a, b) => a + b, 0) / periodNum

    // Smooth using Wilder's method
    for (let i = periodNum; i < gains.length; i++) {
      avgGain = (avgGain * (periodNum - 1) + gains[i]) / periodNum
      avgLoss = (avgLoss * (periodNum - 1) + losses[i]) / periodNum
    }

    // Calculate RSI
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
    const rsi = 100 - (100 / (1 + rs))

    let signal = 'Neutral'
    if (rsi >= 70) signal = 'Overbought - Consider Selling'
    else if (rsi <= 30) signal = 'Oversold - Consider Buying'

    setResult({
      rsi,
      avgGain,
      avgLoss,
      signal,
    })
  }, [prices, period])

  useEffect(() => {
    calculate()
  }, [calculate])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <Activity className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <h3 className="font-bold">RSI Calculator</h3>
          <p className="text-xs text-muted-foreground">Relative Strength Index</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Prices (comma separated)</label>
          <textarea
            value={prices}
            onChange={(e) => setPrices(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-purple-500 focus:outline-none text-sm font-mono"
            placeholder="100,102,101,103..."
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Period</label>
          <input
            type="number"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-purple-500 focus:outline-none text-sm"
          />
        </div>

        {result && (
          <div className="space-y-3">
            <div className={cn(
              'p-4 rounded-lg text-center',
              result.rsi >= 70 ? 'bg-red-500/10' : result.rsi <= 30 ? 'bg-green-500/10' : 'bg-muted/50'
            )}>
              <p className={cn(
                'text-3xl font-bold',
                result.rsi >= 70 ? 'text-red-500' : result.rsi <= 30 ? 'text-green-500' : 'text-yellow-500'
              )}>
                {result.rsi.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{result.signal}</p>
            </div>

            <div className="h-3 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 relative">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-800 shadow"
                style={{ left: `calc(${result.rsi}% - 6px)` }}
              />
              <div className="absolute top-full mt-1 text-xs text-muted-foreground w-full flex justify-between">
                <span>0 (Oversold)</span>
                <span>100 (Overbought)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// MVRV RATIO SIMULATOR
// ============================================

export function MVRVSimulator() {
  const [marketCap, setMarketCap] = useState('1000000000000')
  const [realizedCap, setRealizedCap] = useState('500000000000')
  const [result, setResult] = useState<{
    mvrv: number
    zone: string
    color: string
  } | null>(null)

  const calculate = useCallback(() => {
    const mc = parseFloat(marketCap.replace(/,/g, ''))
    const rc = parseFloat(realizedCap.replace(/,/g, ''))

    if (isNaN(mc) || isNaN(rc) || rc === 0) {
      setResult(null)
      return
    }

    const mvrv = mc / rc
    let zone = 'Neutral'
    let color = 'text-yellow-500'

    if (mvrv < 1) {
      zone = 'Undervalued - Accumulation Zone'
      color = 'text-green-500'
    } else if (mvrv < 2) {
      zone = 'Fair Value'
      color = 'text-yellow-500'
    } else if (mvrv < 3.5) {
      zone = 'Overvalued - Caution'
      color = 'text-orange-500'
    } else {
      zone = 'Extremely Overvalued - Potential Top'
      color = 'text-red-500'
    }

    setResult({ mvrv, zone, color })
  }, [marketCap, realizedCap])

  useEffect(() => {
    calculate()
  }, [calculate])

  const formatNumber = (num: string) => {
    const n = parseFloat(num.replace(/,/g, ''))
    if (isNaN(n)) return num
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
    return `$${n.toLocaleString()}`
  }

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <Scale className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-bold">MVRV Ratio</h3>
          <p className="text-xs text-muted-foreground">Market Value to Realized Value</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Market Cap ($)</label>
          <input
            type="text"
            value={marketCap}
            onChange={(e) => setMarketCap(e.target.value)}
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-blue-500 focus:outline-none text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">{formatNumber(marketCap)}</p>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Realized Cap ($)</label>
          <input
            type="text"
            value={realizedCap}
            onChange={(e) => setRealizedCap(e.target.value)}
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-blue-500 focus:outline-none text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">{formatNumber(realizedCap)}</p>
        </div>

        {result && (
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className={cn('text-3xl font-bold', result.color)}>{result.mvrv.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.zone}</p>

            <div className="mt-4 grid grid-cols-4 gap-1 text-xs">
              <div className={cn('p-2 rounded', result.mvrv < 1 ? 'bg-green-500/20' : 'bg-muted')}>
                <p className="font-medium">&lt;1</p>
                <p className="text-muted-foreground">Buy</p>
              </div>
              <div className={cn('p-2 rounded', result.mvrv >= 1 && result.mvrv < 2 ? 'bg-yellow-500/20' : 'bg-muted')}>
                <p className="font-medium">1-2</p>
                <p className="text-muted-foreground">Fair</p>
              </div>
              <div className={cn('p-2 rounded', result.mvrv >= 2 && result.mvrv < 3.5 ? 'bg-orange-500/20' : 'bg-muted')}>
                <p className="font-medium">2-3.5</p>
                <p className="text-muted-foreground">Caution</p>
              </div>
              <div className={cn('p-2 rounded', result.mvrv >= 3.5 ? 'bg-red-500/20' : 'bg-muted')}>
                <p className="font-medium">&gt;3.5</p>
                <p className="text-muted-foreground">Sell</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// STOCK-TO-FLOW MODEL
// ============================================

export function StockToFlowModel() {
  const [currentSupply, setCurrentSupply] = useState('19600000')
  const [annualProduction, setAnnualProduction] = useState('164250')
  const [currentPrice, setCurrentPrice] = useState('60000')
  const [result, setResult] = useState<{
    s2f: number
    modelPrice: number
    deviation: number
  } | null>(null)

  const calculate = useCallback(() => {
    const supply = parseFloat(currentSupply.replace(/,/g, ''))
    const production = parseFloat(annualProduction.replace(/,/g, ''))
    const price = parseFloat(currentPrice.replace(/,/g, ''))

    if (isNaN(supply) || isNaN(production) || isNaN(price) || production === 0) {
      setResult(null)
      return
    }

    const s2f = supply / production
    // S2F model: Price = e^(a * ln(S2F) + b) where a ≈ 3.3 and b ≈ 14.6
    const modelPrice = Math.exp(3.3 * Math.log(s2f) + 14.6)
    const deviation = ((price - modelPrice) / modelPrice) * 100

    setResult({ s2f, modelPrice, deviation })
  }, [currentSupply, annualProduction, currentPrice])

  useEffect(() => {
    calculate()
  }, [calculate])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
          <Layers className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h3 className="font-bold">Stock-to-Flow Model</h3>
          <p className="text-xs text-muted-foreground">Bitcoin scarcity valuation</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Current Supply (BTC)</label>
            <input
              type="text"
              value={currentSupply}
              onChange={(e) => setCurrentSupply(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-orange-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Annual Production</label>
            <input
              type="text"
              value={annualProduction}
              onChange={(e) => setAnnualProduction(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-orange-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Current BTC Price ($)</label>
          <input
            type="text"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-orange-500 focus:outline-none text-sm"
          />
        </div>

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-orange-500/10 rounded-lg text-center">
                <p className="text-2xl font-bold text-orange-500">{result.s2f.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">S2F Ratio</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <p className="text-2xl font-bold">${(result.modelPrice / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground">Model Price</p>
              </div>
            </div>

            <div className={cn(
              'p-3 rounded-lg text-center',
              result.deviation < 0 ? 'bg-green-500/10' : 'bg-red-500/10'
            )}>
              <p className={cn(
                'text-xl font-bold',
                result.deviation < 0 ? 'text-green-500' : 'text-red-500'
              )}>
                {result.deviation > 0 ? '+' : ''}{result.deviation.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">
                {result.deviation < 0 ? 'Undervalued vs Model' : 'Overvalued vs Model'}
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              Note: S2F model is one metric among many. Not financial advice.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// BITCOIN RAINBOW CHART
// ============================================

const RAINBOW_BANDS = [
  { label: 'Maximum Bubble', color: 'bg-red-600', multiplier: 3.5 },
  { label: 'Sell Seriously', color: 'bg-red-500', multiplier: 3.0 },
  { label: 'FOMO Intensifies', color: 'bg-orange-500', multiplier: 2.5 },
  { label: 'Is This a Bubble?', color: 'bg-yellow-500', multiplier: 2.0 },
  { label: 'HODL', color: 'bg-green-400', multiplier: 1.5 },
  { label: 'Still Cheap', color: 'bg-green-500', multiplier: 1.0 },
  { label: 'Accumulate', color: 'bg-cyan-500', multiplier: 0.7 },
  { label: 'Buy!', color: 'bg-blue-500', multiplier: 0.5 },
  { label: 'Fire Sale!', color: 'bg-violet-500', multiplier: 0.3 },
]

export function BitcoinRainbowChart() {
  const [btcPrice, setBtcPrice] = useState('60000')
  const [daysSinceGenesis, setDaysSinceGenesis] = useState('5500')
  const [result, setResult] = useState<{
    band: typeof RAINBOW_BANDS[0]
    basePrice: number
    position: number
  } | null>(null)

  const calculate = useCallback(() => {
    const price = parseFloat(btcPrice.replace(/,/g, ''))
    const days = parseFloat(daysSinceGenesis)

    if (isNaN(price) || isNaN(days)) {
      setResult(null)
      return
    }

    // Simplified rainbow model: log regression
    // Base price = 10^(a * log10(days) + b) where a ≈ 5.84 and b ≈ -17.01
    const basePrice = Math.pow(10, 5.84 * Math.log10(days) - 17.01)

    // Find which band we're in
    const ratio = price / basePrice
    let band = RAINBOW_BANDS[RAINBOW_BANDS.length - 1]
    let position = 0

    for (let i = 0; i < RAINBOW_BANDS.length; i++) {
      if (ratio >= RAINBOW_BANDS[i].multiplier) {
        band = RAINBOW_BANDS[i]
        position = i
        break
      }
    }

    setResult({ band, basePrice, position })
  }, [btcPrice, daysSinceGenesis])

  useEffect(() => {
    // Calculate days since genesis block (Jan 3, 2009)
    const genesis = new Date('2009-01-03')
    const now = new Date()
    const days = Math.floor((now.getTime() - genesis.getTime()) / (1000 * 60 * 60 * 24))
    setDaysSinceGenesis(days.toString())
    calculate()
  }, [calculate])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold">Bitcoin Rainbow Chart</h3>
          <p className="text-xs text-muted-foreground">Long-term valuation bands</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">BTC Price ($)</label>
            <input
              type="text"
              value={btcPrice}
              onChange={(e) => setBtcPrice(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-primary focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Days Since Genesis</label>
            <input
              type="number"
              value={daysSinceGenesis}
              onChange={(e) => setDaysSinceGenesis(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-primary focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Rainbow Bands */}
        <div className="space-y-1">
          {RAINBOW_BANDS.map((band, index) => (
            <div
              key={band.label}
              className={cn(
                'flex items-center justify-between px-3 py-1.5 rounded text-xs',
                band.color,
                result?.position === index ? 'ring-2 ring-white ring-offset-2 ring-offset-background' : 'opacity-70'
              )}
            >
              <span className="text-white font-medium">{band.label}</span>
              <span className="text-white/80">{band.multiplier}x</span>
            </div>
          ))}
        </div>

        {result && (
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Current Position</p>
            <p className={cn('text-xl font-bold mt-1', result.band.color.replace('bg-', 'text-'))}>
              {result.band.label}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Base model price: ${result.basePrice.toFixed(0)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// PI CYCLE TOP INDICATOR
// ============================================

export function PiCycleIndicator() {
  const [ma111, setMa111] = useState('65000')
  const [ma350x2, setMa350x2] = useState('62000')
  const [currentPrice, setCurrentPrice] = useState('60000')
  const [result, setResult] = useState<{
    difference: number
    percentDiff: number
    signal: string
    isCrossed: boolean
  } | null>(null)

  const calculate = useCallback(() => {
    const ma111Val = parseFloat(ma111.replace(/,/g, ''))
    const ma350x2Val = parseFloat(ma350x2.replace(/,/g, ''))
    const price = parseFloat(currentPrice.replace(/,/g, ''))

    if (isNaN(ma111Val) || isNaN(ma350x2Val) || isNaN(price)) {
      setResult(null)
      return
    }

    const difference = ma111Val - ma350x2Val
    const percentDiff = (difference / ma350x2Val) * 100
    const isCrossed = ma111Val >= ma350x2Val

    let signal = 'Normal Market Conditions'
    if (percentDiff > 5) signal = 'Approaching Potential Top'
    if (percentDiff > 0 && percentDiff <= 5) signal = 'Warning Zone - Close to Crossover'
    if (isCrossed) signal = 'Pi Cycle Top Signal - Potential Market Top!'

    setResult({ difference, percentDiff, signal, isCrossed })
  }, [ma111, ma350x2, currentPrice])

  useEffect(() => {
    calculate()
  }, [calculate])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
          <Target className="w-5 h-5 text-pink-500" />
        </div>
        <div>
          <h3 className="font-bold">Pi Cycle Top Indicator</h3>
          <p className="text-xs text-muted-foreground">111 DMA vs 350 DMA x 2</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">111 Day MA ($)</label>
            <input
              type="text"
              value={ma111}
              onChange={(e) => setMa111(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-pink-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">350 Day MA x2 ($)</label>
            <input
              type="text"
              value={ma350x2}
              onChange={(e) => setMa350x2(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-pink-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Current Price ($)</label>
          <input
            type="text"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-pink-500 focus:outline-none text-sm"
          />
        </div>

        {result && (
          <div className={cn(
            'p-4 rounded-lg text-center',
            result.isCrossed ? 'bg-red-500/20' : result.percentDiff > 0 ? 'bg-yellow-500/20' : 'bg-green-500/20'
          )}>
            <div className="flex items-center justify-center gap-2 mb-2">
              {result.isCrossed ? (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              <span className={cn(
                'font-bold',
                result.isCrossed ? 'text-red-500' : result.percentDiff > 0 ? 'text-yellow-500' : 'text-green-500'
              )}>
                {result.signal}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              111 DMA is {result.percentDiff > 0 ? 'above' : 'below'} 350x2 DMA by {Math.abs(result.percentDiff).toFixed(2)}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Historical accuracy: Called BTC tops in 2013, 2017, 2021
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// HASH RIBBON INDICATOR
// ============================================

export function HashRibbonIndicator() {
  const [hashrate30d, setHashrate30d] = useState('580')
  const [hashrate60d, setHashrate60d] = useState('570')
  const [previousCross, setPreviousCross] = useState<'up' | 'down'>('up')
  const [result, setResult] = useState<{
    signal: string
    description: string
    color: string
    isBuySignal: boolean
  } | null>(null)

  const calculate = useCallback(() => {
    const h30 = parseFloat(hashrate30d)
    const h60 = parseFloat(hashrate60d)

    if (isNaN(h30) || isNaN(h60)) {
      setResult(null)
      return
    }

    const currentCross = h30 > h60 ? 'up' : 'down'
    let signal = ''
    let description = ''
    let color = ''
    let isBuySignal = false

    if (h30 > h60) {
      if (previousCross === 'down') {
        signal = 'Hash Ribbon Buy Signal'
        description = '30d MA crossed above 60d MA - Miners capitulation ended, historically strong buy signal'
        color = 'text-green-500'
        isBuySignal = true
      } else {
        signal = 'Healthy Network'
        description = 'Hashrate is growing. Network is healthy and miners are profitable.'
        color = 'text-green-500'
      }
    } else {
      signal = 'Miner Capitulation'
      description = '30d MA below 60d MA - Miners may be selling BTC or turning off machines'
      color = 'text-red-500'
    }

    setResult({ signal, description, color, isBuySignal })
  }, [hashrate30d, hashrate60d, previousCross])

  useEffect(() => {
    calculate()
  }, [calculate])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <Database className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h3 className="font-bold">Hash Ribbon Indicator</h3>
          <p className="text-xs text-muted-foreground">Miner capitulation signals</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">30-Day MA (EH/s)</label>
            <input
              type="number"
              value={hashrate30d}
              onChange={(e) => setHashrate30d(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-emerald-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">60-Day MA (EH/s)</label>
            <input
              type="number"
              value={hashrate60d}
              onChange={(e) => setHashrate60d(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-emerald-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Previous Cross Direction</label>
          <div className="flex gap-2">
            <button
              onClick={() => setPreviousCross('up')}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
                previousCross === 'up' ? 'bg-green-500 text-white' : 'bg-muted/50 hover:bg-muted'
              )}
            >
              Crossed Up
            </button>
            <button
              onClick={() => setPreviousCross('down')}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
                previousCross === 'down' ? 'bg-red-500 text-white' : 'bg-muted/50 hover:bg-muted'
              )}
            >
              Crossed Down
            </button>
          </div>
        </div>

        {result && (
          <div className={cn(
            'p-4 rounded-lg',
            result.isBuySignal ? 'bg-green-500/20' : result.color === 'text-green-500' ? 'bg-green-500/10' : 'bg-red-500/10'
          )}>
            <p className={cn('font-bold text-lg', result.color)}>{result.signal}</p>
            <p className="text-sm text-muted-foreground mt-2">{result.description}</p>
            {result.isBuySignal && (
              <div className="mt-3 p-2 bg-green-500/20 rounded text-sm text-green-500 font-medium">
                Historically, buying at hash ribbon crossovers has yielded strong returns
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// ENS/DOMAIN LOOKUP
// ============================================

export function ENSLookup() {
  const [domain, setDomain] = useState('')
  const [lookupType, setLookupType] = useState<'ens' | 'unstoppable'>('ens')
  const [result, setResult] = useState<{
    isValid: boolean
    type: string
    possibleAddress: string
  } | null>(null)

  const validate = useCallback(() => {
    if (!domain.trim()) {
      setResult(null)
      return
    }

    const ensPattern = /^[a-z0-9-]+\.eth$/i
    const unstoppablePatterns = [
      /^[a-z0-9-]+\.crypto$/i,
      /^[a-z0-9-]+\.nft$/i,
      /^[a-z0-9-]+\.x$/i,
      /^[a-z0-9-]+\.wallet$/i,
      /^[a-z0-9-]+\.bitcoin$/i,
      /^[a-z0-9-]+\.dao$/i,
      /^[a-z0-9-]+\.888$/i,
    ]

    let isValid = false
    let type = 'Unknown'

    if (ensPattern.test(domain)) {
      isValid = true
      type = 'ENS Domain (.eth)'
    } else {
      for (const pattern of unstoppablePatterns) {
        if (pattern.test(domain)) {
          isValid = true
          type = 'Unstoppable Domain'
          break
        }
      }
    }

    // Generate mock address for demo
    const mockAddress = isValid
      ? `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
      : ''

    setResult({ isValid, type, possibleAddress: mockAddress })
  }, [domain])

  useEffect(() => {
    validate()
  }, [validate])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
          <Globe className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <h3 className="font-bold">Web3 Domain Lookup</h3>
          <p className="text-xs text-muted-foreground">Validate ENS & Unstoppable Domains</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setLookupType('ens')}
            className={cn(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
              lookupType === 'ens' ? 'bg-indigo-500 text-white' : 'bg-muted/50 hover:bg-muted'
            )}
          >
            ENS (.eth)
          </button>
          <button
            onClick={() => setLookupType('unstoppable')}
            className={cn(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
              lookupType === 'unstoppable' ? 'bg-indigo-500 text-white' : 'bg-muted/50 hover:bg-muted'
            )}
          >
            Unstoppable
          </button>
        </div>

        <div>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder={lookupType === 'ens' ? 'vitalik.eth' : 'mydomain.crypto'}
            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-indigo-500 focus:outline-none font-mono text-sm"
          />
        </div>

        {result && (
          <div className={cn(
            'p-4 rounded-lg',
            result.isValid ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
          )}>
            <div className="flex items-center gap-2 mb-2">
              {result.isValid ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className={cn('font-medium', result.isValid ? 'text-green-500' : 'text-red-500')}>
                {result.isValid ? 'Valid Domain Format' : 'Invalid Domain Format'}
              </span>
            </div>
            {result.isValid && (
              <>
                <p className="text-sm text-muted-foreground">Type: {result.type}</p>
                <p className="text-xs font-mono text-muted-foreground mt-2 break-all">
                  Demo Address: {result.possibleAddress}
                </p>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  Note: Connect to provider for real lookups
                </p>
              </>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Supported TLDs:</p>
          <p>.eth (ENS) | .crypto .nft .x .wallet .bitcoin .dao .888 (Unstoppable)</p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// NFT RARITY CALCULATOR
// ============================================

export function NFTRarityCalculator() {
  const [totalSupply, setTotalSupply] = useState('10000')
  const [traits, setTraits] = useState([
    { name: 'Background', count: 500 },
    { name: 'Body', count: 1000 },
    { name: 'Eyes', count: 200 },
    { name: 'Mouth', count: 300 },
  ])
  const [result, setResult] = useState<{
    rarityScore: number
    rank: string
    traitRarities: { name: string; rarity: number; tier: string }[]
  } | null>(null)

  const calculate = useCallback(() => {
    const supply = parseFloat(totalSupply)
    if (isNaN(supply) || supply <= 0) {
      setResult(null)
      return
    }

    const traitRarities = traits.map(trait => {
      const rarity = (trait.count / supply) * 100
      let tier = 'Common'
      if (rarity < 1) tier = 'Legendary'
      else if (rarity < 5) tier = 'Epic'
      else if (rarity < 10) tier = 'Rare'
      else if (rarity < 25) tier = 'Uncommon'

      return { name: trait.name, rarity, tier }
    })

    // Calculate rarity score (lower is rarer)
    const rarityScore = traitRarities.reduce((acc, trait) => acc + trait.rarity, 0) / traits.length

    let rank = 'Common'
    if (rarityScore < 3) rank = 'Legendary (Top 1%)'
    else if (rarityScore < 5) rank = 'Epic (Top 5%)'
    else if (rarityScore < 10) rank = 'Rare (Top 10%)'
    else if (rarityScore < 20) rank = 'Uncommon (Top 25%)'

    setResult({ rarityScore, rank, traitRarities })
  }, [totalSupply, traits])

  useEffect(() => {
    calculate()
  }, [calculate])

  const updateTrait = (index: number, field: 'name' | 'count', value: string | number) => {
    setTraits(prev => {
      const updated = [...prev]
      if (field === 'name') {
        updated[index] = { ...updated[index], name: value as string }
      } else {
        updated[index] = { ...updated[index], count: parseInt(value as string) || 0 }
      }
      return updated
    })
  }

  const addTrait = () => {
    setTraits(prev => [...prev, { name: 'New Trait', count: 1000 }])
  }

  const removeTrait = (index: number) => {
    setTraits(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
          <Hexagon className="w-5 h-5 text-pink-500" />
        </div>
        <div>
          <h3 className="font-bold">NFT Rarity Calculator</h3>
          <p className="text-xs text-muted-foreground">Calculate trait-based rarity score</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Total Collection Supply</label>
          <input
            type="number"
            value={totalSupply}
            onChange={(e) => setTotalSupply(e.target.value)}
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-pink-500 focus:outline-none text-sm"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs text-muted-foreground">Traits</label>
            <button
              onClick={addTrait}
              className="text-xs text-pink-500 hover:underline"
            >
              + Add Trait
            </button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {traits.map((trait, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={trait.name}
                  onChange={(e) => updateTrait(index, 'name', e.target.value)}
                  className="flex-1 px-2 py-1 bg-muted/50 border border-border rounded text-xs"
                  placeholder="Trait name"
                />
                <input
                  type="number"
                  value={trait.count}
                  onChange={(e) => updateTrait(index, 'count', e.target.value)}
                  className="w-20 px-2 py-1 bg-muted/50 border border-border rounded text-xs"
                  placeholder="Count"
                />
                <button
                  onClick={() => removeTrait(index)}
                  className="text-red-500 hover:bg-red-500/10 p-1 rounded"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg text-center">
              <p className="text-3xl font-bold text-pink-500">{result.rarityScore.toFixed(2)}%</p>
              <p className="text-sm font-medium mt-1">{result.rank}</p>
            </div>

            <div className="space-y-1">
              {result.traitRarities.map((trait, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded text-xs">
                  <span>{trait.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{trait.rarity.toFixed(2)}%</span>
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium',
                      trait.tier === 'Legendary' && 'bg-yellow-500/20 text-yellow-500',
                      trait.tier === 'Epic' && 'bg-purple-500/20 text-purple-500',
                      trait.tier === 'Rare' && 'bg-blue-500/20 text-blue-500',
                      trait.tier === 'Uncommon' && 'bg-green-500/20 text-green-500',
                      trait.tier === 'Common' && 'bg-muted text-muted-foreground',
                    )}>
                      {trait.tier}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// TOKEN APPROVAL CHECKER
// ============================================

const COMMON_CONTRACTS = [
  { name: 'Uniswap V3', address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45' },
  { name: 'OpenSea', address: '0x1E0049783F008A0085193E00003D00cd54003c71' },
  { name: '1inch', address: '0x1111111254EEB25477B68fb85Ed929f73A960582' },
  { name: 'SushiSwap', address: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F' },
]

export function TokenApprovalChecker() {
  const [walletAddress, setWalletAddress] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [mockApprovals, setMockApprovals] = useState<{
    contract: string
    name: string
    amount: string
    risk: 'low' | 'medium' | 'high'
  }[]>([])

  const checkApprovals = useCallback(() => {
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return
    }

    setIsChecking(true)

    // Simulate API call
    setTimeout(() => {
      // Generate mock approvals for demo
      const approvals = COMMON_CONTRACTS.slice(0, Math.floor(Math.random() * 4) + 1).map(contract => ({
        contract: contract.address,
        name: contract.name,
        amount: Math.random() > 0.5 ? 'Unlimited' : `${(Math.random() * 1000).toFixed(2)} USDC`,
        risk: (Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
      }))

      setMockApprovals(approvals)
      setIsChecking(false)
    }, 1500)
  }, [walletAddress])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h3 className="font-bold">Token Approval Checker</h3>
          <p className="text-xs text-muted-foreground">Check wallet token approvals</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Wallet Address</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x..."
              className="flex-1 px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-red-500 focus:outline-none text-sm font-mono"
            />
            <button
              onClick={checkApprovals}
              disabled={isChecking || !walletAddress}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isChecking ? 'Checking...' : 'Check'}
            </button>
          </div>
        </div>

        {mockApprovals.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Found {mockApprovals.length} approval(s):</p>
            {mockApprovals.map((approval, index) => (
              <div
                key={index}
                className={cn(
                  'p-3 rounded-lg border',
                  approval.risk === 'high' && 'bg-red-500/10 border-red-500/20',
                  approval.risk === 'medium' && 'bg-yellow-500/10 border-yellow-500/20',
                  approval.risk === 'low' && 'bg-green-500/10 border-green-500/20',
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{approval.name}</p>
                    <p className="text-xs font-mono text-muted-foreground truncate max-w-[180px]">
                      {approval.contract}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{approval.amount}</p>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded',
                      approval.risk === 'high' && 'bg-red-500/20 text-red-500',
                      approval.risk === 'medium' && 'bg-yellow-500/20 text-yellow-500',
                      approval.risk === 'low' && 'bg-green-500/20 text-green-500',
                    )}>
                      {approval.risk.toUpperCase()} RISK
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <p className="text-xs text-muted-foreground mt-2">
              To revoke approvals, use tools like Revoke.cash or Etherscan Token Approval Checker
            </p>
          </div>
        )}

        {!isChecking && walletAddress && mockApprovals.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Enter a valid address and click Check to scan approvals
          </p>
        )}
      </div>
    </div>
  )
}

// ============================================
// YIELD FARMING CALCULATOR
// ============================================

export function YieldFarmingCalculator() {
  const [principal, setPrincipal] = useState('10000')
  const [apr, setApr] = useState('100')
  const [compoundFrequency, setCompoundFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [duration, setDuration] = useState('365')
  const [result, setResult] = useState<{
    simpleYield: number
    compoundedYield: number
    apy: number
    difference: number
  } | null>(null)

  const calculate = useCallback(() => {
    const p = parseFloat(principal)
    const r = parseFloat(apr) / 100
    const d = parseFloat(duration)

    if (isNaN(p) || isNaN(r) || isNaN(d)) {
      setResult(null)
      return
    }

    const years = d / 365
    let n: number
    switch (compoundFrequency) {
      case 'daily': n = 365; break
      case 'weekly': n = 52; break
      case 'monthly': n = 12; break
    }

    const simpleYield = p * (1 + r * years)
    const compoundedYield = p * Math.pow(1 + r / n, n * years)
    const apy = (Math.pow(1 + r / n, n) - 1) * 100
    const difference = compoundedYield - simpleYield

    setResult({ simpleYield, compoundedYield, apy, difference })
  }, [principal, apr, compoundFrequency, duration])

  useEffect(() => {
    calculate()
  }, [calculate])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
          <Percent className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h3 className="font-bold">Yield Farming Calculator</h3>
          <p className="text-xs text-muted-foreground">APR vs APY comparison</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Principal ($)</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-green-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">APR (%)</label>
            <input
              type="number"
              value={apr}
              onChange={(e) => setApr(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-green-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Compound Frequency</label>
          <div className="flex gap-2">
            {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
              <button
                key={freq}
                onClick={() => setCompoundFrequency(freq)}
                className={cn(
                  'flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors',
                  compoundFrequency === freq ? 'bg-green-500 text-white' : 'bg-muted/50 hover:bg-muted'
                )}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Duration (days)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-green-500 focus:outline-none text-sm"
          />
        </div>

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Simple Interest</p>
                <p className="text-xl font-bold">${result.simpleYield.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Compounded</p>
                <p className="text-xl font-bold text-green-500">${result.compoundedYield.toFixed(2)}</p>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">APY (with compounding):</span>
                <span className="font-bold text-green-500">{result.apy.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Extra from compounding:</span>
                <span className="font-bold">+${result.difference.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// PROTOCOL TVL COMPARISON
// ============================================

const DEFI_PROTOCOLS = [
  { name: 'Lido', tvl: 33200000000, chain: 'Ethereum', category: 'Liquid Staking', color: 'bg-cyan-500' },
  { name: 'AAVE', tvl: 12500000000, chain: 'Multi-chain', category: 'Lending', color: 'bg-purple-500' },
  { name: 'MakerDAO', tvl: 8300000000, chain: 'Ethereum', category: 'CDP', color: 'bg-green-500' },
  { name: 'Uniswap', tvl: 6800000000, chain: 'Multi-chain', category: 'DEX', color: 'bg-pink-500' },
  { name: 'Curve', tvl: 5200000000, chain: 'Multi-chain', category: 'DEX', color: 'bg-blue-500' },
  { name: 'Compound', tvl: 2800000000, chain: 'Ethereum', category: 'Lending', color: 'bg-green-400' },
  { name: 'PancakeSwap', tvl: 2200000000, chain: 'BSC', category: 'DEX', color: 'bg-yellow-500' },
  { name: 'Convex', tvl: 1900000000, chain: 'Ethereum', category: 'Yield', color: 'bg-orange-500' },
]

export function ProtocolTVLComparison() {
  const [filter, setFilter] = useState<'all' | 'Lending' | 'DEX' | 'Yield' | 'Liquid Staking' | 'CDP'>('all')

  const filteredProtocols = filter === 'all'
    ? DEFI_PROTOCOLS
    : DEFI_PROTOCOLS.filter(p => p.category === filter)

  const maxTVL = Math.max(...filteredProtocols.map(p => p.tvl))

  const formatTVL = (tvl: number) => {
    if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(1)}B`
    if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(1)}M`
    return `$${tvl.toLocaleString()}`
  }

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-bold">DeFi Protocol TVL</h3>
          <p className="text-xs text-muted-foreground">Total Value Locked comparison</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {['all', 'Lending', 'DEX', 'Yield', 'Liquid Staking', 'CDP'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as typeof filter)}
              className={cn(
                'px-2 py-1 rounded text-xs transition-colors capitalize',
                filter === cat ? 'bg-blue-500 text-white' : 'bg-muted/50 hover:bg-muted'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filteredProtocols.map((protocol) => (
            <div key={protocol.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={cn('w-2 h-2 rounded-full', protocol.color)} />
                  <span className="font-medium">{protocol.name}</span>
                  <span className="text-xs text-muted-foreground">({protocol.chain})</span>
                </div>
                <span className="font-mono">{formatTVL(protocol.tvl)}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', protocol.color)}
                  style={{ width: `${(protocol.tvl / maxTVL) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total TVL (filtered):</span>
            <span className="font-bold">{formatTVL(filteredProtocols.reduce((a, b) => a + b.tvl, 0))}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// TOKEN VESTING CALCULATOR
// ============================================

export function TokenVestingCalculator() {
  const [totalTokens, setTotalTokens] = useState('1000000')
  const [vestingMonths, setVestingMonths] = useState('24')
  const [cliffMonths, setCliffMonths] = useState('6')
  const [currentMonth, setCurrentMonth] = useState('12')
  const [tokenPrice, setTokenPrice] = useState('0.50')
  const [result, setResult] = useState<{
    vestedTokens: number
    unlockedTokens: number
    lockedTokens: number
    currentValue: number
    monthlyUnlock: number
  } | null>(null)

  const calculate = useCallback(() => {
    const total = parseFloat(totalTokens.replace(/,/g, ''))
    const vesting = parseInt(vestingMonths)
    const cliff = parseInt(cliffMonths)
    const current = parseInt(currentMonth)
    const price = parseFloat(tokenPrice)

    if (isNaN(total) || isNaN(vesting) || isNaN(cliff) || isNaN(current) || isNaN(price)) {
      setResult(null)
      return
    }

    let unlockedTokens = 0
    if (current >= cliff) {
      const vestingPeriod = vesting - cliff
      const monthsVested = Math.min(current - cliff, vestingPeriod)
      unlockedTokens = total * (monthsVested / vestingPeriod)
    }

    const vestedTokens = current >= vesting ? total : total * (current / vesting)
    const lockedTokens = total - unlockedTokens
    const monthlyUnlock = total / (vesting - cliff)

    setResult({
      vestedTokens,
      unlockedTokens,
      lockedTokens,
      currentValue: unlockedTokens * price,
      monthlyUnlock,
    })
  }, [totalTokens, vestingMonths, cliffMonths, currentMonth, tokenPrice])

  useEffect(() => {
    calculate()
  }, [calculate])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <Lock className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <h3 className="font-bold">Token Vesting Calculator</h3>
          <p className="text-xs text-muted-foreground">Track vesting schedules</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Total Tokens</label>
            <input
              type="text"
              value={totalTokens}
              onChange={(e) => setTotalTokens(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-purple-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Token Price ($)</label>
            <input
              type="number"
              value={tokenPrice}
              onChange={(e) => setTokenPrice(e.target.value)}
              step="0.01"
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-purple-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Vesting Period (months)</label>
            <input
              type="number"
              value={vestingMonths}
              onChange={(e) => setVestingMonths(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-purple-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Cliff (months)</label>
            <input
              type="number"
              value={cliffMonths}
              onChange={(e) => setCliffMonths(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-purple-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Current Month: {currentMonth}</label>
          <input
            type="range"
            min="0"
            max={vestingMonths}
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
            className="w-full h-2 rounded-full bg-muted appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Start</span>
            <span>Cliff ({cliffMonths}m)</span>
            <span>End ({vestingMonths}m)</span>
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg text-center">
                <Unlock className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-green-500">
                  {result.unlockedTokens.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-muted-foreground">Unlocked</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg text-center">
                <Lock className="w-5 h-5 text-red-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-red-500">
                  {result.lockedTokens.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-muted-foreground">Locked</p>
              </div>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Unlocked Value:</span>
                <span className="font-bold text-green-500">${result.currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Unlock:</span>
                <span className="font-mono">{result.monthlyUnlock.toLocaleString(undefined, { maximumFractionDigits: 0 })} tokens</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// AIRDROP CHECKER
// ============================================

const AIRDROP_CRITERIA = [
  { id: 'early_user', label: 'Early User (before mainnet)', points: 100 },
  { id: 'transactions', label: '50+ Transactions', points: 75 },
  { id: 'volume', label: '$10K+ Volume', points: 80 },
  { id: 'liquidity', label: 'Provided Liquidity', points: 90 },
  { id: 'governance', label: 'Voted in Governance', points: 60 },
  { id: 'bridge', label: 'Used Bridge', points: 50 },
  { id: 'nft', label: 'Holds Protocol NFT', points: 40 },
  { id: 'testnet', label: 'Testnet Participant', points: 70 },
]

export function AirdropChecker() {
  const [criteria, setCriteria] = useState<string[]>([])
  const [result, setResult] = useState<{
    score: number
    tier: string
    estimatedTokens: string
    probability: number
  } | null>(null)

  const calculate = useCallback(() => {
    if (criteria.length === 0) {
      setResult(null)
      return
    }

    const score = criteria.reduce((acc, id) => {
      const criterion = AIRDROP_CRITERIA.find(c => c.id === id)
      return acc + (criterion?.points || 0)
    }, 0)

    let tier = 'Bronze'
    let estimatedTokens = '100-500'
    let probability = 25

    if (score >= 400) {
      tier = 'Diamond'
      estimatedTokens = '5,000-10,000+'
      probability = 95
    } else if (score >= 300) {
      tier = 'Gold'
      estimatedTokens = '2,000-5,000'
      probability = 80
    } else if (score >= 200) {
      tier = 'Silver'
      estimatedTokens = '500-2,000'
      probability = 60
    }

    setResult({ score, tier, estimatedTokens, probability })
  }, [criteria])

  useEffect(() => {
    calculate()
  }, [calculate])

  const toggleCriterion = (id: string) => {
    setCriteria(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
          <Gift className="w-5 h-5 text-yellow-500" />
        </div>
        <div>
          <h3 className="font-bold">Airdrop Eligibility</h3>
          <p className="text-xs text-muted-foreground">Check your airdrop criteria</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          {AIRDROP_CRITERIA.map((criterion) => (
            <button
              key={criterion.id}
              onClick={() => toggleCriterion(criterion.id)}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-lg text-sm transition-colors',
                criteria.includes(criterion.id)
                  ? 'bg-yellow-500/20 border border-yellow-500/30'
                  : 'bg-muted/50 hover:bg-muted'
              )}
            >
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-4 h-4 rounded border flex items-center justify-center',
                  criteria.includes(criterion.id) ? 'bg-yellow-500 border-yellow-500' : 'border-border'
                )}>
                  {criteria.includes(criterion.id) && <Check className="w-3 h-3 text-white" />}
                </div>
                <span>{criterion.label}</span>
              </div>
              <span className="text-xs text-muted-foreground">+{criterion.points} pts</span>
            </button>
          ))}
        </div>

        {result && (
          <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-500">{result.score}</p>
                <p className="text-xs text-muted-foreground">Total Score</p>
              </div>
              <div className="text-center">
                <p className={cn(
                  'text-2xl font-bold',
                  result.tier === 'Diamond' && 'text-cyan-400',
                  result.tier === 'Gold' && 'text-yellow-500',
                  result.tier === 'Silver' && 'text-gray-400',
                  result.tier === 'Bronze' && 'text-orange-700',
                )}>
                  {result.tier}
                </p>
                <p className="text-xs text-muted-foreground">Tier</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Tokens:</span>
                <span className="font-medium">{result.estimatedTokens}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Probability:</span>
                <span className="font-medium">{result.probability}%</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-3 italic">
              *Estimates based on typical airdrop patterns. Actual results may vary.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// CRYPTO TOOLS GRID
// ============================================

const TOOL_CATEGORIES = [
  { id: 'btc-indicators', label: 'BTC Indicators', icon: Bitcoin },
  { id: 'calculator', label: 'Calculator', icon: Calculator },
  { id: 'defi', label: 'DeFi', icon: TrendingUp },
  { id: 'web3', label: 'Web3', icon: Globe },
  { id: 'converter', label: 'Converter', icon: ArrowRightLeft },
  { id: 'validator', label: 'Validator', icon: Wallet },
  { id: 'mining', label: 'Mining', icon: BarChart3 },
]

export function CryptoToolsGrid() {
  const [activeCategory, setActiveCategory] = useState('btc-indicators')

  const renderTools = () => {
    switch (activeCategory) {
      case 'btc-indicators':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <FearGreedIndex />
            <RSICalculator />
            <MVRVSimulator />
            <StockToFlowModel />
            <BitcoinRainbowChart />
            <PiCycleIndicator />
            <HashRibbonIndicator />
            <BitcoinHalvingCountdown />
          </div>
        )
      case 'calculator':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <CryptoROICalculator />
            <DCACalculator />
            <MarketCapCalculator />
            <MiningCalculator />
            <LiquidationCalculator />
          </div>
        )
      case 'defi':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <YieldFarmingCalculator />
            <ImpermanentLossCalculator />
            <StakingRewardsCalculator />
            <ProtocolTVLComparison />
            <TokenVestingCalculator />
            <AirdropChecker />
          </div>
        )
      case 'web3':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <ENSLookup />
            <NFTRarityCalculator />
            <TokenApprovalChecker />
            <WalletAddressValidator />
          </div>
        )
      case 'converter':
        return (
          <div className="grid md:grid-cols-1 gap-6">
            <CryptoUnitConverter />
          </div>
        )
      case 'validator':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <WalletAddressValidator />
            <GasFeeEstimator />
          </div>
        )
      case 'mining':
        return (
          <div className="grid md:grid-cols-1 gap-6">
            <MiningCalculator />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TOOL_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              activeCategory === category.id
                ? 'bg-cyber-orange text-white'
                : 'bg-muted/50 hover:bg-muted text-muted-foreground'
            )}
          >
            <category.icon className="w-4 h-4" />
            {category.label}
          </button>
        ))}
      </div>

      {/* Tools Content */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderTools()}
      </motion.div>
    </div>
  )
}

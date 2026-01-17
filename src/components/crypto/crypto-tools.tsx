'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Calculator, Wallet, TrendingUp, Coins, RefreshCw, Copy, Check,
  DollarSign, Bitcoin, ArrowRightLeft, PiggyBank, BarChart3, Clock,
  AlertTriangle, CheckCircle, XCircle
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

const TOOL_CATEGORIES = [
  { id: 'converter', label: 'Converter', icon: ArrowRightLeft },
  { id: 'calculator', label: 'Calculator', icon: Calculator },
  { id: 'validator', label: 'Validator', icon: Wallet },
  { id: 'estimator', label: 'Estimator', icon: Coins },
]

export function CryptoToolsGrid() {
  const [activeCategory, setActiveCategory] = useState('converter')

  const renderTools = () => {
    switch (activeCategory) {
      case 'converter':
        return (
          <div className="grid md:grid-cols-1 gap-6">
            <CryptoUnitConverter />
          </div>
        )
      case 'calculator':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <CryptoROICalculator />
            <DCACalculator />
            <MarketCapCalculator />
          </div>
        )
      case 'validator':
        return (
          <div className="grid md:grid-cols-1 gap-6">
            <WalletAddressValidator />
          </div>
        )
      case 'estimator':
        return (
          <div className="grid md:grid-cols-1 gap-6">
            <GasFeeEstimator />
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

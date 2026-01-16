'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, ArrowRightLeft, RefreshCw, TrendingUp, History } from 'lucide-react'

// Static exchange rates (demo - in production would fetch from API)
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CNY: 7.24,
  INR: 83.12,
  IDR: 15650,
  MYR: 4.72,
  SGD: 1.34,
  AUD: 1.53,
  CAD: 1.36,
  CHF: 0.88,
  KRW: 1320,
  THB: 35.50,
  PHP: 55.80,
  VND: 24500,
  BRL: 4.97,
  MXN: 17.15,
  RUB: 92.50,
  AED: 3.67,
  SAR: 3.75,
  HKD: 7.82,
  TWD: 31.50,
  NZD: 1.64,
}

const CURRENCY_INFO: Record<string, { name: string; symbol: string; flag: string }> = {
  USD: { name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺' },
  GBP: { name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  JPY: { name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  CNY: { name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  INR: { name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  IDR: { name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  MYR: { name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  AUD: { name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  CAD: { name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  CHF: { name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
  KRW: { name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  THB: { name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  PHP: { name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
  VND: { name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
  BRL: { name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  MXN: { name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  RUB: { name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  AED: { name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  SAR: { name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
  HKD: { name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  TWD: { name: 'Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼' },
  NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
}

interface ConversionHistory {
  from: string
  to: string
  amount: number
  result: number
  timestamp: number
}

export function CurrencyConverter() {
  const [amount, setAmount] = useState(100)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('IDR')
  const [history, setHistory] = useState<ConversionHistory[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('currencyHistory')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  const convert = (value: number, from: string, to: string): number => {
    const usdAmount = value / EXCHANGE_RATES[from]
    return usdAmount * EXCHANGE_RATES[to]
  }

  const convertedAmount = convert(amount, fromCurrency, toCurrency)
  const exchangeRate = convert(1, fromCurrency, toCurrency)

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const saveToHistory = () => {
    const entry: ConversionHistory = {
      from: fromCurrency,
      to: toCurrency,
      amount,
      result: convertedAmount,
      timestamp: Date.now()
    }
    const newHistory = [entry, ...history.slice(0, 9)]
    setHistory(newHistory)
    localStorage.setItem('currencyHistory', JSON.stringify(newHistory))
  }

  const formatNumber = (num: number, currency: string): string => {
    const decimals = ['JPY', 'KRW', 'IDR', 'VND'].includes(currency) ? 0 : 2
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  }

  const popularPairs = [
    ['USD', 'IDR'],
    ['USD', 'EUR'],
    ['USD', 'JPY'],
    ['EUR', 'GBP'],
    ['USD', 'SGD'],
  ]

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm font-medium mb-4">
          <DollarSign className="w-4 h-4" />
          Finance
        </div>
        <h2 className="text-2xl font-bold">Currency Converter</h2>
        <p className="text-muted-foreground mt-2">
          Convert between 24 world currencies instantly.
        </p>
      </div>

      {/* Quick Pairs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {popularPairs.map(([from, to]) => (
          <button
            key={`${from}-${to}`}
            onClick={() => { setFromCurrency(from); setToCurrency(to); }}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              fromCurrency === from && toCurrency === to
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {CURRENCY_INFO[from].flag} {from} → {CURRENCY_INFO[to].flag} {to}
          </button>
        ))}
      </div>

      {/* Converter */}
      <div className="space-y-4 mb-6">
        {/* From */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <label className="text-sm text-muted-foreground mb-2 block">From</label>
          <div className="flex gap-3">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background"
            >
              {Object.keys(EXCHANGE_RATES).map(code => (
                <option key={code} value={code}>
                  {CURRENCY_INFO[code].flag} {code} - {CURRENCY_INFO[code].name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={0}
              className="w-32 px-3 py-2 rounded-lg border border-border bg-background text-right font-mono"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {CURRENCY_INFO[fromCurrency].symbol} {formatNumber(amount, fromCurrency)} {fromCurrency}
          </p>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapCurrencies}
            className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
        </div>

        {/* To */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <label className="text-sm text-muted-foreground mb-2 block">To</label>
          <div className="flex gap-3">
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background"
            >
              {Object.keys(EXCHANGE_RATES).map(code => (
                <option key={code} value={code}>
                  {CURRENCY_INFO[code].flag} {code} - {CURRENCY_INFO[code].name}
                </option>
              ))}
            </select>
            <div className="w-32 px-3 py-2 rounded-lg bg-muted/50 text-right font-mono font-bold">
              {formatNumber(convertedAmount, toCurrency)}
            </div>
          </div>
          <p className="text-lg font-bold mt-2 text-primary">
            {CURRENCY_INFO[toCurrency].symbol} {formatNumber(convertedAmount, toCurrency)} {toCurrency}
          </p>
        </div>
      </div>

      {/* Exchange Rate Info */}
      <div className="p-4 rounded-xl border border-border bg-card mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm text-muted-foreground">Exchange Rate</span>
          </div>
          <button
            onClick={saveToHistory}
            className="text-xs px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80"
          >
            Save to History
          </button>
        </div>
        <p className="mt-2 font-mono">
          1 {fromCurrency} = {formatNumber(exchangeRate, toCurrency)} {toCurrency}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          1 {toCurrency} = {formatNumber(1 / exchangeRate, fromCurrency)} {fromCurrency}
        </p>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <History className="w-4 h-4" />
            Recent Conversions
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {history.map((entry, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-muted/30 text-sm flex items-center justify-between"
              >
                <span>
                  {CURRENCY_INFO[entry.from].flag} {formatNumber(entry.amount, entry.from)} {entry.from}
                </span>
                <span className="text-muted-foreground">→</span>
                <span>
                  {CURRENCY_INFO[entry.to].flag} {formatNumber(entry.result, entry.to)} {entry.to}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground text-center">
        <p>Exchange rates are demo values for illustration purposes.</p>
      </div>
    </div>
  )
}

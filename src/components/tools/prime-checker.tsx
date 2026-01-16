'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Search, List } from 'lucide-react'

function isPrime(n: number): boolean {
  if (n < 2) return false
  if (n === 2) return true
  if (n % 2 === 0) return false
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false
  }
  return true
}

function getPrimeFactors(n: number): number[] {
  if (n < 2) return []
  const factors: number[] = []
  let num = n

  while (num % 2 === 0) {
    factors.push(2)
    num = num / 2
  }

  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    while (num % i === 0) {
      factors.push(i)
      num = num / i
    }
  }

  if (num > 2) {
    factors.push(num)
  }

  return factors
}

function getNextPrime(n: number): number {
  let candidate = n + 1
  while (!isPrime(candidate)) {
    candidate++
  }
  return candidate
}

function getPreviousPrime(n: number): number {
  if (n <= 2) return 2
  let candidate = n - 1
  while (candidate > 1 && !isPrime(candidate)) {
    candidate--
  }
  return candidate > 1 ? candidate : 2
}

function getPrimesInRange(start: number, end: number, limit = 100): number[] {
  const primes: number[] = []
  for (let i = Math.max(2, start); i <= end && primes.length < limit; i++) {
    if (isPrime(i)) {
      primes.push(i)
    }
  }
  return primes
}

export function PrimeChecker() {
  const [number, setNumber] = useState('')
  const [rangeStart, setRangeStart] = useState('')
  const [rangeEnd, setRangeEnd] = useState('')
  const [mode, setMode] = useState<'check' | 'range'>('check')

  const checkResult = useMemo(() => {
    const num = parseInt(number)
    if (isNaN(num) || num < 0) return null

    const prime = isPrime(num)
    const factors = getPrimeFactors(num)
    const nextPrime = getNextPrime(num)
    const prevPrime = getPreviousPrime(num)

    return {
      number: num,
      isPrime: prime,
      factors,
      nextPrime,
      prevPrime,
    }
  }, [number])

  const rangeResult = useMemo(() => {
    const start = parseInt(rangeStart)
    const end = parseInt(rangeEnd)
    if (isNaN(start) || isNaN(end) || start < 0 || end < start) return null

    return getPrimesInRange(start, end)
  }, [rangeStart, rangeEnd])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Prime Number Checker</h1>
        <p className="text-muted-foreground">Check if a number is prime and find prime factors</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Mode Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('check')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors ${
              mode === 'check' ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <Search className="w-4 h-4" />
            Check Number
          </button>
          <button
            onClick={() => setMode('range')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors ${
              mode === 'range' ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <List className="w-4 h-4" />
            Find in Range
          </button>
        </div>

        {mode === 'check' && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Enter a Number</label>
              <input
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Enter a positive integer"
                min="0"
                className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-center"
              />
            </div>

            {checkResult && (
              <div className="space-y-4">
                {/* Prime Status */}
                <div className={`p-6 rounded-lg text-center ${
                  checkResult.isPrime
                    ? 'bg-green-500/20 border border-green-500/30'
                    : 'bg-red-500/20 border border-red-500/30'
                }`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {checkResult.isPrime ? (
                      <Check className="w-8 h-8 text-green-500" />
                    ) : (
                      <X className="w-8 h-8 text-red-500" />
                    )}
                    <span className="text-3xl font-bold">{checkResult.number}</span>
                  </div>
                  <div className={`text-lg font-medium ${
                    checkResult.isPrime ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {checkResult.isPrime ? 'is a Prime Number!' : 'is NOT a Prime Number'}
                  </div>
                </div>

                {/* Prime Factors */}
                {!checkResult.isPrime && checkResult.number > 1 && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold mb-2">Prime Factorization</h3>
                    <div className="text-lg">
                      {checkResult.number} = {checkResult.factors.join(' × ')}
                    </div>
                  </div>
                )}

                {/* Nearby Primes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <div className="text-sm text-muted-foreground mb-1">Previous Prime</div>
                    <div className="text-xl font-bold text-blue-500">{checkResult.prevPrime}</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <div className="text-sm text-muted-foreground mb-1">Next Prime</div>
                    <div className="text-xl font-bold text-blue-500">{checkResult.nextPrime}</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {mode === 'range' && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Start</label>
                <input
                  type="number"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  placeholder="From"
                  min="0"
                  className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End</label>
                <input
                  type="number"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  placeholder="To"
                  min="0"
                  className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {rangeResult && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Prime Numbers Found</h3>
                  <span className="text-sm text-muted-foreground">{rangeResult.length} primes</span>
                </div>
                {rangeResult.length > 0 ? (
                  <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                    {rangeResult.map(prime => (
                      <span
                        key={prime}
                        className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm font-medium"
                      >
                        {prime}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No prime numbers in this range
                  </p>
                )}
                {rangeResult.length === 100 && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Showing first 100 primes
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* Quick Reference */}
        <div className="mt-6 p-4 bg-blue-500/10 rounded-lg text-sm">
          <p className="font-semibold text-blue-600 mb-1">What is a Prime Number?</p>
          <p className="text-muted-foreground">
            A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.
            First 10 primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29
          </p>
        </div>
      </div>
    </motion.div>
  )
}

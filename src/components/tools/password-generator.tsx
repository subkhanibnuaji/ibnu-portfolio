'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Key, Copy, Check, RefreshCw, Shield, ShieldAlert, ShieldCheck, Eye, EyeOff } from 'lucide-react'

interface PasswordOptions {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  excludeAmbiguous: boolean
}

const CHARS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
}

const AMBIGUOUS = 'O0Il1'

const calculateStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0

  // Length score
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (password.length >= 16) score += 1
  if (password.length >= 20) score += 1

  // Character variety
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 2

  // Complexity patterns
  if (!/(.)\1{2,}/.test(password)) score += 1 // No repeated chars
  if (/[a-z].*[A-Z]|[A-Z].*[a-z]/.test(password)) score += 1 // Mixed case

  if (score <= 3) return { score, label: 'Weak', color: 'bg-red-500' }
  if (score <= 5) return { score, label: 'Fair', color: 'bg-orange-500' }
  if (score <= 7) return { score, label: 'Good', color: 'bg-yellow-500' }
  if (score <= 9) return { score, label: 'Strong', color: 'bg-green-500' }
  return { score, label: 'Very Strong', color: 'bg-emerald-500' }
}

export function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(true)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: true
  })

  const generatePassword = useCallback(() => {
    let charset = ''
    if (options.uppercase) charset += CHARS.uppercase
    if (options.lowercase) charset += CHARS.lowercase
    if (options.numbers) charset += CHARS.numbers
    if (options.symbols) charset += CHARS.symbols

    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(c => !AMBIGUOUS.includes(c)).join('')
    }

    if (charset.length === 0) {
      setPassword('')
      return
    }

    // Ensure at least one character from each selected category
    let newPassword = ''
    const required: string[] = []

    if (options.uppercase) {
      let chars = CHARS.uppercase
      if (options.excludeAmbiguous) chars = chars.split('').filter(c => !AMBIGUOUS.includes(c)).join('')
      if (chars.length > 0) required.push(chars[Math.floor(Math.random() * chars.length)])
    }
    if (options.lowercase) {
      let chars = CHARS.lowercase
      if (options.excludeAmbiguous) chars = chars.split('').filter(c => !AMBIGUOUS.includes(c)).join('')
      if (chars.length > 0) required.push(chars[Math.floor(Math.random() * chars.length)])
    }
    if (options.numbers) {
      let chars = CHARS.numbers
      if (options.excludeAmbiguous) chars = chars.split('').filter(c => !AMBIGUOUS.includes(c)).join('')
      if (chars.length > 0) required.push(chars[Math.floor(Math.random() * chars.length)])
    }
    if (options.symbols) {
      required.push(CHARS.symbols[Math.floor(Math.random() * CHARS.symbols.length)])
    }

    // Fill remaining length with random characters
    const remainingLength = options.length - required.length
    for (let i = 0; i < remainingLength; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)]
    }

    // Add required characters at random positions
    for (const char of required) {
      const pos = Math.floor(Math.random() * (newPassword.length + 1))
      newPassword = newPassword.slice(0, pos) + char + newPassword.slice(pos)
    }

    setPassword(newPassword)
    setHistory(prev => [newPassword, ...prev.slice(0, 9)])
  }, [options])

  useEffect(() => {
    generatePassword()
  }, [])

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const strength = calculateStrength(password)

  const StrengthIcon = strength.score <= 3 ? ShieldAlert :
    strength.score <= 7 ? Shield : ShieldCheck

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 text-rose-500 text-sm font-medium mb-4">
          <Key className="w-4 h-4" />
          Security
        </div>
        <h2 className="text-2xl font-bold">Password Generator</h2>
        <p className="text-muted-foreground mt-2">
          Generate secure, random passwords instantly.
        </p>
      </div>

      {/* Password Display */}
      <div className="mb-6">
        <div className="relative p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 pr-24">
            <p className={`font-mono text-lg break-all ${showPassword ? '' : 'blur-sm select-none'}`}>
              {password || 'Select at least one option'}
            </p>
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title={showPassword ? 'Hide' : 'Show'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <button
              onClick={copyToClipboard}
              disabled={!password}
              className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
              title="Copy"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
            <button
              onClick={generatePassword}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Generate new"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Strength Meter */}
        {password && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Strength</span>
              <span className={`text-sm font-medium flex items-center gap-1 ${
                strength.color.replace('bg-', 'text-')
              }`}>
                <StrengthIcon className="w-4 h-4" />
                {strength.label}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((strength.score / 10) * 100, 100)}%` }}
                className={`h-full ${strength.color}`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="p-4 rounded-xl border border-border bg-card space-y-4 mb-6">
        {/* Length */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Length</label>
            <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{options.length}</span>
          </div>
          <input
            type="range"
            min={4}
            max={64}
            value={options.length}
            onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        {/* Character Types */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Include</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'uppercase', label: 'Uppercase (A-Z)' },
              { key: 'lowercase', label: 'Lowercase (a-z)' },
              { key: 'numbers', label: 'Numbers (0-9)' },
              { key: 'symbols', label: 'Symbols (!@#$)' }
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options[key as keyof PasswordOptions] as boolean}
                  onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                  className="w-4 h-4 rounded accent-primary"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Extra Options */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.excludeAmbiguous}
            onChange={(e) => setOptions({ ...options, excludeAmbiguous: e.target.checked })}
            className="w-4 h-4 rounded accent-primary"
          />
          <span className="text-sm">Exclude ambiguous characters (O, 0, I, l, 1)</span>
        </label>
      </div>

      {/* Generate Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={generatePassword}
        className="w-full py-3 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 inline-flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Generate New Password
      </motion.button>

      {/* History */}
      {history.length > 1 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Recent Passwords</h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {history.slice(1).map((pw, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-sm"
              >
                <span className="font-mono truncate mr-2">{pw}</span>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(pw)
                  }}
                  className="p-1 rounded hover:bg-muted"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

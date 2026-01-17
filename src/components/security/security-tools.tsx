'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Lock, Key, Hash, Eye, EyeOff, Copy, Check, RefreshCw,
  AlertTriangle, CheckCircle, XCircle, Info, Globe, Server,
  Binary, FileText, Fingerprint, Network, Search, Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// PASSWORD STRENGTH ANALYZER
// ============================================

interface PasswordStrength {
  score: number
  label: string
  color: string
  suggestions: string[]
  details: {
    length: boolean
    uppercase: boolean
    lowercase: boolean
    numbers: boolean
    special: boolean
    noCommon: boolean
  }
}

function analyzePassword(password: string): PasswordStrength {
  const details = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    noCommon: !['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome', 'monkey', 'dragon'].some(
      common => password.toLowerCase().includes(common)
    ),
  }

  let score = 0
  if (details.length) score += 20
  if (details.uppercase) score += 15
  if (details.lowercase) score += 15
  if (details.numbers) score += 15
  if (details.special) score += 20
  if (details.noCommon) score += 15
  if (password.length >= 16) score += 10

  // Entropy bonus
  const uniqueChars = new Set(password).size
  if (uniqueChars >= 10) score += 5

  score = Math.min(100, score)

  const suggestions: string[] = []
  if (!details.length) suggestions.push('Use at least 12 characters')
  if (!details.uppercase) suggestions.push('Add uppercase letters (A-Z)')
  if (!details.lowercase) suggestions.push('Add lowercase letters (a-z)')
  if (!details.numbers) suggestions.push('Add numbers (0-9)')
  if (!details.special) suggestions.push('Add special characters (!@#$%^&*)')
  if (!details.noCommon) suggestions.push('Avoid common words or patterns')

  let label: string, color: string
  if (score < 30) { label = 'Very Weak'; color = 'text-red-500' }
  else if (score < 50) { label = 'Weak'; color = 'text-orange-500' }
  else if (score < 70) { label = 'Fair'; color = 'text-yellow-500' }
  else if (score < 90) { label = 'Strong'; color = 'text-green-500' }
  else { label = 'Very Strong'; color = 'text-emerald-500' }

  return { score, label, color, suggestions, details }
}

export function PasswordStrengthAnalyzer() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [analysis, setAnalysis] = useState<PasswordStrength | null>(null)

  const handleAnalyze = useCallback((value: string) => {
    setPassword(value)
    if (value) {
      setAnalysis(analyzePassword(value))
    } else {
      setAnalysis(null)
    }
  }, [])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-security-safe/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-security-safe" />
        </div>
        <div>
          <h3 className="font-bold">Password Strength Analyzer</h3>
          <p className="text-xs text-muted-foreground">Check how secure your password is</p>
        </div>
      </div>

      <div className="relative mb-4">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => handleAnalyze(e.target.value)}
          placeholder="Enter password to analyze..."
          className="w-full px-4 py-3 pr-12 bg-muted/50 border border-border rounded-lg focus:border-security-safe focus:outline-none"
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4"
        >
          {/* Score Bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Strength</span>
              <span className={cn('text-sm font-bold', analysis.color)}>{analysis.label}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${analysis.score}%` }}
                className={cn(
                  'h-full rounded-full',
                  analysis.score < 30 ? 'bg-red-500' :
                  analysis.score < 50 ? 'bg-orange-500' :
                  analysis.score < 70 ? 'bg-yellow-500' :
                  analysis.score < 90 ? 'bg-green-500' : 'bg-emerald-500'
                )}
              />
            </div>
          </div>

          {/* Criteria Checklist */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'length', label: '12+ characters' },
              { key: 'uppercase', label: 'Uppercase (A-Z)' },
              { key: 'lowercase', label: 'Lowercase (a-z)' },
              { key: 'numbers', label: 'Numbers (0-9)' },
              { key: 'special', label: 'Special chars' },
              { key: 'noCommon', label: 'No common words' },
            ].map(item => (
              <div key={item.key} className="flex items-center gap-2 text-sm">
                {analysis.details[item.key as keyof typeof analysis.details] ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className={analysis.details[item.key as keyof typeof analysis.details] ? 'text-muted-foreground' : ''}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Suggestions</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                {analysis.suggestions.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

// ============================================
// PASSWORD GENERATOR
// ============================================

interface PasswordOptions {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  special: boolean
  excludeAmbiguous: boolean
}

function generatePassword(options: PasswordOptions): string {
  let chars = ''
  if (options.lowercase) chars += options.excludeAmbiguous ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz'
  if (options.uppercase) chars += options.excludeAmbiguous ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (options.numbers) chars += options.excludeAmbiguous ? '23456789' : '0123456789'
  if (options.special) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

  if (!chars) return ''

  let password = ''
  const array = new Uint32Array(options.length)
  crypto.getRandomValues(array)
  for (let i = 0; i < options.length; i++) {
    password += chars[array[i] % chars.length]
  }
  return password
}

export function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true,
    excludeAmbiguous: true,
  })

  const handleGenerate = useCallback(() => {
    setPassword(generatePassword(options))
    setCopied(false)
  }, [options])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [password])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <Key className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <h3 className="font-bold">Secure Password Generator</h3>
          <p className="text-xs text-muted-foreground">Generate cryptographically secure passwords</p>
        </div>
      </div>

      {/* Generated Password */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 px-4 py-3 bg-muted/50 border border-border rounded-lg font-mono text-sm break-all">
          {password || 'Click generate to create password'}
        </div>
        <button
          onClick={handleCopy}
          disabled={!password}
          className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg disabled:opacity-50 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
        <button
          onClick={handleGenerate}
          className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {/* Length Slider */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Length</span>
            <span className="text-sm font-mono">{options.length}</span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={options.length}
            onChange={(e) => setOptions(o => ({ ...o, length: parseInt(e.target.value) }))}
            className="w-full accent-purple-500"
          />
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'uppercase', label: 'Uppercase (A-Z)' },
            { key: 'lowercase', label: 'Lowercase (a-z)' },
            { key: 'numbers', label: 'Numbers (0-9)' },
            { key: 'special', label: 'Special (!@#$)' },
            { key: 'excludeAmbiguous', label: 'Exclude similar (0/O, l/1)' },
          ].map(item => (
            <label key={item.key} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={options[item.key as keyof PasswordOptions] as boolean}
                onChange={(e) => setOptions(o => ({ ...o, [item.key]: e.target.checked }))}
                className="accent-purple-500"
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// HASH GENERATOR
// ============================================

async function computeHash(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export function HashGenerator() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<{ [key: string]: string }>({})
  const [copied, setCopied] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const algorithms = [
    { name: 'MD5', id: 'md5', note: '(Not recommended for security)' },
    { name: 'SHA-1', id: 'SHA-1', note: '(Deprecated)' },
    { name: 'SHA-256', id: 'SHA-256', note: '(Recommended)' },
    { name: 'SHA-384', id: 'SHA-384', note: '' },
    { name: 'SHA-512', id: 'SHA-512', note: '(Most secure)' },
  ]

  const handleGenerate = useCallback(async () => {
    if (!input) return
    setLoading(true)

    const newHashes: { [key: string]: string } = {}

    for (const algo of algorithms) {
      if (algo.id === 'md5') {
        // MD5 implementation (simple)
        newHashes[algo.id] = await computeMD5(input)
      } else {
        newHashes[algo.id] = await computeHash(input, algo.id)
      }
    }

    setHashes(newHashes)
    setLoading(false)
  }, [input])

  const handleCopy = useCallback(async (hash: string, algo: string) => {
    await navigator.clipboard.writeText(hash)
    setCopied(algo)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
          <Hash className="w-5 h-5 text-cyan-500" />
        </div>
        <div>
          <h3 className="font-bold">Hash Generator</h3>
          <p className="text-xs text-muted-foreground">Generate cryptographic hashes from text</p>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          rows={3}
          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-cyan-500 focus:outline-none resize-none"
        />

        <button
          onClick={handleGenerate}
          disabled={!input || loading}
          className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          Generate Hashes
        </button>

        {Object.keys(hashes).length > 0 && (
          <div className="space-y-2">
            {algorithms.map(algo => (
              <div key={algo.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{algo.name}</span>
                  <span className="text-xs text-muted-foreground">{algo.note}</span>
                </div>
                <div className="flex gap-2">
                  <code className="flex-1 text-xs bg-black/20 px-2 py-1 rounded break-all">
                    {hashes[algo.id] || '...'}
                  </code>
                  <button
                    onClick={() => handleCopy(hashes[algo.id], algo.id)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    {copied === algo.id ? (
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

// Simple MD5 implementation
async function computeMD5(str: string): Promise<string> {
  // Using a simple MD5 implementation for browser
  const md5 = (string: string) => {
    function md5cycle(x: number[], k: number[]) {
      let a = x[0], b = x[1], c = x[2], d = x[3]

      a = ff(a, b, c, d, k[0], 7, -680876936)
      d = ff(d, a, b, c, k[1], 12, -389564586)
      c = ff(c, d, a, b, k[2], 17,  606105819)
      b = ff(b, c, d, a, k[3], 22, -1044525330)
      a = ff(a, b, c, d, k[4], 7, -176418897)
      d = ff(d, a, b, c, k[5], 12,  1200080426)
      c = ff(c, d, a, b, k[6], 17, -1473231341)
      b = ff(b, c, d, a, k[7], 22, -45705983)
      a = ff(a, b, c, d, k[8], 7,  1770035416)
      d = ff(d, a, b, c, k[9], 12, -1958414417)
      c = ff(c, d, a, b, k[10], 17, -42063)
      b = ff(b, c, d, a, k[11], 22, -1990404162)
      a = ff(a, b, c, d, k[12], 7,  1804603682)
      d = ff(d, a, b, c, k[13], 12, -40341101)
      c = ff(c, d, a, b, k[14], 17, -1502002290)
      b = ff(b, c, d, a, k[15], 22,  1236535329)

      a = gg(a, b, c, d, k[1], 5, -165796510)
      d = gg(d, a, b, c, k[6], 9, -1069501632)
      c = gg(c, d, a, b, k[11], 14,  643717713)
      b = gg(b, c, d, a, k[0], 20, -373897302)
      a = gg(a, b, c, d, k[5], 5, -701558691)
      d = gg(d, a, b, c, k[10], 9,  38016083)
      c = gg(c, d, a, b, k[15], 14, -660478335)
      b = gg(b, c, d, a, k[4], 20, -405537848)
      a = gg(a, b, c, d, k[9], 5,  568446438)
      d = gg(d, a, b, c, k[14], 9, -1019803690)
      c = gg(c, d, a, b, k[3], 14, -187363961)
      b = gg(b, c, d, a, k[8], 20,  1163531501)
      a = gg(a, b, c, d, k[13], 5, -1444681467)
      d = gg(d, a, b, c, k[2], 9, -51403784)
      c = gg(c, d, a, b, k[7], 14,  1735328473)
      b = gg(b, c, d, a, k[12], 20, -1926607734)

      a = hh(a, b, c, d, k[5], 4, -378558)
      d = hh(d, a, b, c, k[8], 11, -2022574463)
      c = hh(c, d, a, b, k[11], 16,  1839030562)
      b = hh(b, c, d, a, k[14], 23, -35309556)
      a = hh(a, b, c, d, k[1], 4, -1530992060)
      d = hh(d, a, b, c, k[4], 11,  1272893353)
      c = hh(c, d, a, b, k[7], 16, -155497632)
      b = hh(b, c, d, a, k[10], 23, -1094730640)
      a = hh(a, b, c, d, k[13], 4,  681279174)
      d = hh(d, a, b, c, k[0], 11, -358537222)
      c = hh(c, d, a, b, k[3], 16, -722521979)
      b = hh(b, c, d, a, k[6], 23,  76029189)
      a = hh(a, b, c, d, k[9], 4, -640364487)
      d = hh(d, a, b, c, k[12], 11, -421815835)
      c = hh(c, d, a, b, k[15], 16,  530742520)
      b = hh(b, c, d, a, k[2], 23, -995338651)

      a = ii(a, b, c, d, k[0], 6, -198630844)
      d = ii(d, a, b, c, k[7], 10,  1126891415)
      c = ii(c, d, a, b, k[14], 15, -1416354905)
      b = ii(b, c, d, a, k[5], 21, -57434055)
      a = ii(a, b, c, d, k[12], 6,  1700485571)
      d = ii(d, a, b, c, k[3], 10, -1894986606)
      c = ii(c, d, a, b, k[10], 15, -1051523)
      b = ii(b, c, d, a, k[1], 21, -2054922799)
      a = ii(a, b, c, d, k[8], 6,  1873313359)
      d = ii(d, a, b, c, k[15], 10, -30611744)
      c = ii(c, d, a, b, k[6], 15, -1560198380)
      b = ii(b, c, d, a, k[13], 21,  1309151649)
      a = ii(a, b, c, d, k[4], 6, -145523070)
      d = ii(d, a, b, c, k[11], 10, -1120210379)
      c = ii(c, d, a, b, k[2], 15,  718787259)
      b = ii(b, c, d, a, k[9], 21, -343485551)

      x[0] = add32(a, x[0])
      x[1] = add32(b, x[1])
      x[2] = add32(c, x[2])
      x[3] = add32(d, x[3])
    }

    function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
      a = add32(add32(a, q), add32(x, t))
      return add32((a << s) | (a >>> (32 - s)), b)
    }

    function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
      return cmn((b & c) | ((~b) & d), a, b, x, s, t)
    }

    function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
      return cmn((b & d) | (c & (~d)), a, b, x, s, t)
    }

    function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
      return cmn(b ^ c ^ d, a, b, x, s, t)
    }

    function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
      return cmn(c ^ (b | (~d)), a, b, x, s, t)
    }

    function md51(s: string) {
      const n = s.length
      const state = [1732584193, -271733879, -1732584194, 271733878]
      let i: number
      for (i = 64; i <= s.length; i += 64) {
        md5cycle(state, md5blk(s.substring(i - 64, i)))
      }
      s = s.substring(i - 64)
      const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      for (i = 0; i < s.length; i++)
        tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3)
      tail[i >> 2] |= 0x80 << ((i % 4) << 3)
      if (i > 55) {
        md5cycle(state, tail)
        for (i = 0; i < 16; i++) tail[i] = 0
      }
      tail[14] = n * 8
      md5cycle(state, tail)
      return state
    }

    function md5blk(s: string) {
      const md5blks = []
      for (let i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = s.charCodeAt(i) +
          (s.charCodeAt(i + 1) << 8) +
          (s.charCodeAt(i + 2) << 16) +
          (s.charCodeAt(i + 3) << 24)
      }
      return md5blks
    }

    const hex_chr = '0123456789abcdef'.split('')

    function rhex(n: number) {
      let s = ''
      for (let j = 0; j < 4; j++)
        s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F]
      return s
    }

    function hex(x: number[]): string {
      const result: string[] = []
      for (let i = 0; i < x.length; i++)
        result[i] = rhex(x[i])
      return result.join('')
    }

    function add32(a: number, b: number) {
      return (a + b) & 0xFFFFFFFF
    }

    return hex(md51(string))
  }

  return md5(str)
}

// ============================================
// BASE64 ENCODER/DECODER
// ============================================

export function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleConvert = useCallback(() => {
    setError('')
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))))
      } else {
        setOutput(decodeURIComponent(escape(atob(input))))
      }
    } catch {
      setError('Invalid input for ' + mode + 'ing')
      setOutput('')
    }
  }, [input, mode])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
          <Binary className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h3 className="font-bold">Base64 Encoder/Decoder</h3>
          <p className="text-xs text-muted-foreground">Encode or decode Base64 strings</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Mode Toggle */}
        <div className="flex rounded-lg overflow-hidden border border-border">
          <button
            onClick={() => setMode('encode')}
            className={cn(
              'flex-1 py-2 text-sm font-medium transition-colors',
              mode === 'encode' ? 'bg-orange-500 text-white' : 'bg-muted/50 hover:bg-muted'
            )}
          >
            Encode
          </button>
          <button
            onClick={() => setMode('decode')}
            className={cn(
              'flex-1 py-2 text-sm font-medium transition-colors',
              mode === 'decode' ? 'bg-orange-500 text-white' : 'bg-muted/50 hover:bg-muted'
            )}
          >
            Decode
          </button>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
          rows={3}
          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-orange-500 focus:outline-none resize-none font-mono text-sm"
        />

        <button
          onClick={handleConvert}
          disabled={!input}
          className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
        >
          {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
        </button>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-500 text-sm">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        {output && (
          <div className="relative">
            <textarea
              value={output}
              readOnly
              rows={3}
              className="w-full px-4 py-3 pr-12 bg-muted/50 border border-border rounded-lg font-mono text-sm resize-none"
            />
            <button
              onClick={handleCopy}
              className="absolute right-3 top-3 p-1 hover:bg-muted rounded"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// JWT DECODER
// ============================================

interface JWTPayload {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
  isValid: boolean
}

function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')))
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))

    // Check expiration
    const isValid = payload.exp ? payload.exp * 1000 > Date.now() : true

    return {
      header,
      payload,
      signature: parts[2],
      isValid,
    }
  } catch {
    return null
  }
}

export function JWTDecoder() {
  const [token, setToken] = useState('')
  const [decoded, setDecoded] = useState<JWTPayload | null>(null)
  const [error, setError] = useState('')

  const handleDecode = useCallback(() => {
    setError('')
    const result = decodeJWT(token)
    if (result) {
      setDecoded(result)
    } else {
      setError('Invalid JWT token')
      setDecoded(null)
    }
  }, [token])

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-bold">JWT Decoder</h3>
          <p className="text-xs text-muted-foreground">Decode and inspect JSON Web Tokens</p>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT token here..."
          rows={3}
          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-blue-500 focus:outline-none resize-none font-mono text-xs"
        />

        <button
          onClick={handleDecode}
          disabled={!token}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
        >
          Decode Token
        </button>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-500 text-sm">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        {decoded && (
          <div className="space-y-3">
            {/* Token Status */}
            <div className={cn(
              'p-3 rounded-lg flex items-center gap-2',
              decoded.isValid ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
            )}>
              {decoded.isValid ? (
                <><CheckCircle className="w-4 h-4" /> Token is valid (not expired)</>
              ) : (
                <><XCircle className="w-4 h-4" /> Token has expired</>
              )}
            </div>

            {/* Header */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2 text-blue-400">Header</p>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2 text-purple-400">Payload</p>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>

              {/* Timestamps */}
              {Boolean(decoded.payload.iat || decoded.payload.exp) && (
                <div className="mt-2 pt-2 border-t border-border space-y-1">
                  {Boolean(decoded.payload.iat) && (
                    <p className="text-xs text-muted-foreground">
                      Issued: {formatDate(decoded.payload.iat as number)}
                    </p>
                  )}
                  {Boolean(decoded.payload.exp) && (
                    <p className="text-xs text-muted-foreground">
                      Expires: {formatDate(decoded.payload.exp as number)}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Signature */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2 text-cyan-400">Signature</p>
              <code className="text-xs break-all">{decoded.signature}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// SUBNET CALCULATOR
// ============================================

interface SubnetInfo {
  networkAddress: string
  broadcastAddress: string
  firstHost: string
  lastHost: string
  totalHosts: number
  usableHosts: number
  wildcardMask: string
  binaryMask: string
}

function calculateSubnet(ip: string, cidr: number): SubnetInfo | null {
  try {
    const parts = ip.split('.').map(Number)
    if (parts.length !== 4 || parts.some(p => p < 0 || p > 255)) return null
    if (cidr < 0 || cidr > 32) return null

    const ipBinary = parts.map(p => p.toString(2).padStart(8, '0')).join('')
    const mask = '1'.repeat(cidr) + '0'.repeat(32 - cidr)

    const networkBinary = ipBinary.split('').map((bit, i) =>
      bit === '1' && mask[i] === '1' ? '1' : '0'
    ).join('')

    const broadcastBinary = networkBinary.slice(0, cidr) + '1'.repeat(32 - cidr)

    const binaryToIP = (binary: string) => {
      return [
        parseInt(binary.slice(0, 8), 2),
        parseInt(binary.slice(8, 16), 2),
        parseInt(binary.slice(16, 24), 2),
        parseInt(binary.slice(24, 32), 2),
      ].join('.')
    }

    const networkIP = binaryToIP(networkBinary)
    const broadcastIP = binaryToIP(broadcastBinary)

    const firstHostBinary = networkBinary.slice(0, 31) + '1'
    const lastHostBinary = broadcastBinary.slice(0, 31) + '0'

    const totalHosts = Math.pow(2, 32 - cidr)
    const usableHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : totalHosts - 2

    const wildcardMask = mask.split('').map(b => b === '1' ? '0' : '1').join('')

    return {
      networkAddress: networkIP,
      broadcastAddress: broadcastIP,
      firstHost: cidr >= 31 ? networkIP : binaryToIP(firstHostBinary),
      lastHost: cidr >= 31 ? broadcastIP : binaryToIP(lastHostBinary),
      totalHosts,
      usableHosts,
      wildcardMask: binaryToIP(wildcardMask),
      binaryMask: mask.match(/.{8}/g)?.join('.') || '',
    }
  } catch {
    return null
  }
}

export function SubnetCalculator() {
  const [ip, setIP] = useState('192.168.1.0')
  const [cidr, setCIDR] = useState(24)
  const [result, setResult] = useState<SubnetInfo | null>(null)

  const handleCalculate = useCallback(() => {
    setResult(calculateSubnet(ip, cidr))
  }, [ip, cidr])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
          <Network className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h3 className="font-bold">Subnet Calculator</h3>
          <p className="text-xs text-muted-foreground">Calculate network ranges from CIDR notation</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={ip}
            onChange={(e) => setIP(e.target.value)}
            placeholder="192.168.1.0"
            className="flex-1 px-4 py-2 bg-muted/50 border border-border rounded-lg focus:border-green-500 focus:outline-none font-mono"
          />
          <div className="flex items-center gap-1 px-3 py-2 bg-muted/50 border border-border rounded-lg">
            <span className="text-muted-foreground">/</span>
            <input
              type="number"
              min={0}
              max={32}
              value={cidr}
              onChange={(e) => setCIDR(parseInt(e.target.value) || 0)}
              className="w-12 bg-transparent focus:outline-none font-mono text-center"
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
        >
          Calculate
        </button>

        {result && (
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Network Address', value: result.networkAddress },
              { label: 'Broadcast Address', value: result.broadcastAddress },
              { label: 'First Usable Host', value: result.firstHost },
              { label: 'Last Usable Host', value: result.lastHost },
              { label: 'Total Hosts', value: result.totalHosts.toLocaleString() },
              { label: 'Usable Hosts', value: result.usableHosts.toLocaleString() },
              { label: 'Wildcard Mask', value: result.wildcardMask },
            ].map(item => (
              <div key={item.label} className="p-2 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="font-mono text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// URL ENCODER/DECODER
// ============================================

export function URLEncoderDecoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)

  const handleConvert = useCallback(() => {
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input))
      } else {
        setOutput(decodeURIComponent(input))
      }
    } catch {
      setOutput('Error: Invalid input')
    }
  }, [input, mode])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
          <Globe className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <h3 className="font-bold">URL Encoder/Decoder</h3>
          <p className="text-xs text-muted-foreground">Encode or decode URL components</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex rounded-lg overflow-hidden border border-border">
          <button
            onClick={() => setMode('encode')}
            className={cn(
              'flex-1 py-2 text-sm font-medium transition-colors',
              mode === 'encode' ? 'bg-indigo-500 text-white' : 'bg-muted/50 hover:bg-muted'
            )}
          >
            Encode
          </button>
          <button
            onClick={() => setMode('decode')}
            className={cn(
              'flex-1 py-2 text-sm font-medium transition-colors',
              mode === 'decode' ? 'bg-indigo-500 text-white' : 'bg-muted/50 hover:bg-muted'
            )}
          >
            Decode
          </button>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter URL to encode...' : 'Enter encoded URL to decode...'}
          rows={2}
          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-indigo-500 focus:outline-none resize-none font-mono text-sm"
        />

        <button
          onClick={handleConvert}
          disabled={!input}
          className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
        >
          {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
        </button>

        {output && (
          <div className="relative">
            <textarea
              value={output}
              readOnly
              rows={2}
              className="w-full px-4 py-3 pr-12 bg-muted/50 border border-border rounded-lg font-mono text-sm resize-none"
            />
            <button
              onClick={handleCopy}
              className="absolute right-3 top-3 p-1 hover:bg-muted rounded"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// ENCRYPTION TOOL (AES)
// ============================================

export function EncryptionTool() {
  const [input, setInput] = useState('')
  const [password, setPassword] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt')
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const deriveKey = async (password: string, salt: Uint8Array) => {
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    )
    // Convert salt to ArrayBuffer for TypeScript compatibility
    const saltBuffer = new Uint8Array(salt).buffer
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: saltBuffer, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
  }

  const handleEncrypt = async () => {
    setError('')
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(input)
      const salt = crypto.getRandomValues(new Uint8Array(16))
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const key = await deriveKey(password, salt)

      // Convert iv and data to ArrayBuffer for TypeScript compatibility
      const ivBuffer = new Uint8Array(iv).buffer
      const dataBuffer = new Uint8Array(data).buffer

      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: ivBuffer },
        key,
        dataBuffer
      )

      const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
      combined.set(salt, 0)
      combined.set(iv, salt.length)
      combined.set(new Uint8Array(encrypted), salt.length + iv.length)

      setOutput(btoa(String.fromCharCode(...combined)))
    } catch {
      setError('Encryption failed')
    }
  }

  const handleDecrypt = async () => {
    setError('')
    try {
      const combined = Uint8Array.from(atob(input), c => c.charCodeAt(0))
      const salt = combined.slice(0, 16)
      const iv = combined.slice(16, 28)
      const data = combined.slice(28)

      const key = await deriveKey(password, salt)

      // Convert iv and data to ArrayBuffer for TypeScript compatibility
      const ivBuffer = new Uint8Array(iv).buffer
      const dataBuffer = new Uint8Array(data).buffer

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: ivBuffer },
        key,
        dataBuffer
      )

      const decoder = new TextDecoder()
      setOutput(decoder.decode(decrypted))
    } catch {
      setError('Decryption failed. Check your password and input.')
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
          <Lock className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h3 className="font-bold">AES Encryption Tool</h3>
          <p className="text-xs text-muted-foreground">Encrypt/decrypt text with AES-256-GCM</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex rounded-lg overflow-hidden border border-border">
          <button
            onClick={() => setMode('encrypt')}
            className={cn(
              'flex-1 py-2 text-sm font-medium transition-colors',
              mode === 'encrypt' ? 'bg-red-500 text-white' : 'bg-muted/50 hover:bg-muted'
            )}
          >
            Encrypt
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={cn(
              'flex-1 py-2 text-sm font-medium transition-colors',
              mode === 'decrypt' ? 'bg-red-500 text-white' : 'bg-muted/50 hover:bg-muted'
            )}
          >
            Decrypt
          </button>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter encrypted text to decrypt...'}
          rows={3}
          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-red-500 focus:outline-none resize-none"
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter encryption password..."
            className="w-full px-4 py-3 pr-12 bg-muted/50 border border-border rounded-lg focus:border-red-500 focus:outline-none"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <button
          onClick={mode === 'encrypt' ? handleEncrypt : handleDecrypt}
          disabled={!input || !password}
          className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" />
          {mode === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'}
        </button>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-500 text-sm">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        {output && (
          <div className="relative">
            <textarea
              value={output}
              readOnly
              rows={3}
              className="w-full px-4 py-3 pr-12 bg-muted/50 border border-border rounded-lg font-mono text-sm resize-none"
            />
            <button
              onClick={handleCopy}
              className="absolute right-3 top-3 p-1 hover:bg-muted rounded"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// SECURITY TOOLS GRID
// ============================================

export function SecurityToolsGrid() {
  const [activeTab, setActiveTab] = useState('password')

  const tabs = [
    { id: 'password', label: 'Password', icon: Shield },
    { id: 'hash', label: 'Hash', icon: Hash },
    { id: 'encoding', label: 'Encoding', icon: Binary },
    { id: 'crypto', label: 'Crypto', icon: Lock },
    { id: 'network', label: 'Network', icon: Network },
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-security-safe text-white'
                : 'bg-muted/50 hover:bg-muted text-muted-foreground'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'password' && (
            <div className="grid md:grid-cols-2 gap-6">
              <PasswordStrengthAnalyzer />
              <PasswordGenerator />
            </div>
          )}

          {activeTab === 'hash' && (
            <div className="grid md:grid-cols-2 gap-6">
              <HashGenerator />
              <div className="p-6 bg-card border border-border rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <Info className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-bold">About Hashing</h3>
                    <p className="text-xs text-muted-foreground">Understanding cryptographic hashes</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">MD5:</strong> Fast but cryptographically broken. Never use for security.</p>
                  <p><strong className="text-foreground">SHA-1:</strong> Deprecated. Collision attacks exist.</p>
                  <p><strong className="text-foreground">SHA-256:</strong> Current standard. Secure for most applications.</p>
                  <p><strong className="text-foreground">SHA-512:</strong> Highest security. Good for passwords.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'encoding' && (
            <div className="grid md:grid-cols-2 gap-6">
              <Base64Tool />
              <URLEncoderDecoder />
            </div>
          )}

          {activeTab === 'crypto' && (
            <div className="grid md:grid-cols-2 gap-6">
              <EncryptionTool />
              <JWTDecoder />
            </div>
          )}

          {activeTab === 'network' && (
            <div className="grid md:grid-cols-2 gap-6">
              <SubnetCalculator />
              <div className="p-6 bg-card border border-border rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Server className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold">Common CIDR Notations</h3>
                    <p className="text-xs text-muted-foreground">Quick reference for network masks</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    { cidr: '/8', hosts: '16M', mask: '255.0.0.0' },
                    { cidr: '/16', hosts: '65K', mask: '255.255.0.0' },
                    { cidr: '/24', hosts: '254', mask: '255.255.255.0' },
                    { cidr: '/25', hosts: '126', mask: '255.255.255.128' },
                    { cidr: '/26', hosts: '62', mask: '255.255.255.192' },
                    { cidr: '/27', hosts: '30', mask: '255.255.255.224' },
                    { cidr: '/28', hosts: '14', mask: '255.255.255.240' },
                    { cidr: '/30', hosts: '2', mask: '255.255.255.252' },
                  ].map(item => (
                    <div key={item.cidr} className="p-2 bg-muted/50 rounded-lg">
                      <span className="font-mono font-bold">{item.cidr}</span>
                      <span className="text-muted-foreground text-xs ml-2">{item.hosts} hosts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Key, Copy, Check, AlertCircle, Clock, Shield, User } from 'lucide-react'

interface DecodedJWT {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
}

export function JWTDecoder() {
  const [token, setToken] = useState('')
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!token.trim()) {
      setDecoded(null)
      setError(null)
      setIsExpired(false)
      return
    }

    try {
      const parts = token.split('.')
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. Token must have 3 parts separated by dots.')
      }

      const decodeBase64Url = (str: string): string => {
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
        const padding = '='.repeat((4 - base64.length % 4) % 4)
        return atob(base64 + padding)
      }

      const header = JSON.parse(decodeBase64Url(parts[0]))
      const payload = JSON.parse(decodeBase64Url(parts[1]))
      const signature = parts[2]

      setDecoded({ header, payload, signature })
      setError(null)

      // Check expiration
      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000)
        setIsExpired(expDate < new Date())
      } else {
        setIsExpired(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decode JWT')
      setDecoded(null)
      setIsExpired(false)
    }
  }, [token])

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const getTimeRemaining = (exp: number) => {
    const now = Date.now() / 1000
    const diff = exp - now
    if (diff < 0) return 'Expired'

    const hours = Math.floor(diff / 3600)
    const minutes = Math.floor((diff % 3600) / 60)
    const seconds = Math.floor(diff % 60)

    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h remaining`
    }
    return `${hours}h ${minutes}m ${seconds}s remaining`
  }

  const exampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzY5NjE2MDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            JWT Token
          </h3>
          <button
            onClick={() => setToken(exampleToken)}
            className="text-sm text-primary hover:text-primary/80"
          >
            Load Example
          </button>
        </div>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT token here..."
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background font-mono text-sm resize-none"
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      {decoded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Token Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border ${isExpired ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className={`w-5 h-5 ${isExpired ? 'text-red-500' : 'text-green-500'}`} />
                <span className="font-medium">Status</span>
              </div>
              <p className={`text-lg font-bold ${isExpired ? 'text-red-500' : 'text-green-500'}`}>
                {isExpired ? 'Expired' : 'Valid'}
              </p>
              {typeof decoded.payload.exp === 'number' && (
                <p className="text-sm text-muted-foreground mt-1">
                  {getTimeRemaining(decoded.payload.exp as number)}
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-medium">Algorithm</span>
              </div>
              <p className="text-lg font-bold">{decoded.header.alg as string || 'Unknown'}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Type: {decoded.header.typ as string || 'JWT'}
              </p>
            </div>

            {typeof decoded.payload.sub === 'string' && (
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-primary" />
                  <span className="font-medium">Subject</span>
                </div>
                <p className="text-lg font-bold truncate">{decoded.payload.sub as string}</p>
                {typeof decoded.payload.name === 'string' && (
                  <p className="text-sm text-muted-foreground mt-1">{decoded.payload.name as string}</p>
                )}
              </div>
            )}
          </div>

          {/* Header */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-red-500">HEADER</h3>
              <button
                onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2), 'header')}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {copied === 'header' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-muted overflow-auto text-sm font-mono">
              <code className="text-red-400">{JSON.stringify(decoded.header, null, 2)}</code>
            </pre>
          </div>

          {/* Payload */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-purple-500">PAYLOAD</h3>
              <button
                onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2), 'payload')}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {copied === 'payload' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-muted overflow-auto text-sm font-mono">
              <code className="text-purple-400">{JSON.stringify(decoded.payload, null, 2)}</code>
            </pre>

            {/* Decoded Claims */}
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Decoded Claims</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {typeof decoded.payload.iat === 'number' && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Issued At (iat)</p>
                    <p className="font-mono text-sm">{formatDate(decoded.payload.iat as number)}</p>
                  </div>
                )}
                {typeof decoded.payload.exp === 'number' && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Expires (exp)</p>
                    <p className="font-mono text-sm">{formatDate(decoded.payload.exp as number)}</p>
                  </div>
                )}
                {typeof decoded.payload.nbf === 'number' && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Not Before (nbf)</p>
                    <p className="font-mono text-sm">{formatDate(decoded.payload.nbf as number)}</p>
                  </div>
                )}
                {typeof decoded.payload.iss === 'string' && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Issuer (iss)</p>
                    <p className="font-mono text-sm truncate">{decoded.payload.iss as string}</p>
                  </div>
                )}
                {decoded.payload.aud !== undefined && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Audience (aud)</p>
                    <p className="font-mono text-sm truncate">{decoded.payload.aud as string}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-cyan-500">SIGNATURE</h3>
              <button
                onClick={() => copyToClipboard(decoded.signature, 'signature')}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {copied === 'signature' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-muted overflow-auto text-sm font-mono break-all">
              <code className="text-cyan-400">{decoded.signature}</code>
            </pre>
            <p className="text-xs text-muted-foreground mt-2">
              * Signature verification requires the secret key
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

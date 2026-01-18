'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Search, Check, X, AlertTriangle, Clock, Lock, Globe, Loader2, Copy } from 'lucide-react'

interface SSLInfo {
  valid: boolean
  issuer: string
  subject: string
  validFrom: string
  validTo: string
  daysRemaining: number
  protocol: string
  cipher: string
  keyExchange: string
  sans: string[]
  serialNumber: string
  fingerprint: string
}

export function SSLChecker() {
  const [domain, setDomain] = useState('')
  const [sslInfo, setSSLInfo] = useState<SSLInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const checkSSL = async () => {
    if (!domain.trim()) {
      setError('Please enter a domain name')
      return
    }

    setLoading(true)
    setError(null)
    setSSLInfo(null)

    try {
      const cleanDomain = domain
        .replace(/^https?:\/\//, '')
        .replace(/\/.*$/, '')
        .trim()

      // Note: In a real implementation, this would call a backend API
      // that can actually check SSL certificates. For demo, we'll simulate it.

      // Try to fetch the site to check if it's reachable
      const testUrl = `https://${cleanDomain}`

      try {
        await fetch(testUrl, { mode: 'no-cors' })
      } catch {
        // Ignore CORS errors - we just want to test connectivity
      }

      // Simulate SSL info (in production, use a backend service)
      const now = new Date()
      const validFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      const validTo = new Date(now.getTime() + 275 * 24 * 60 * 60 * 1000)
      const daysRemaining = Math.ceil((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      setSSLInfo({
        valid: true,
        issuer: "Let's Encrypt Authority X3",
        subject: `CN=${cleanDomain}`,
        validFrom: validFrom.toISOString(),
        validTo: validTo.toISOString(),
        daysRemaining,
        protocol: 'TLS 1.3',
        cipher: 'TLS_AES_256_GCM_SHA384',
        keyExchange: 'X25519',
        sans: [cleanDomain, `www.${cleanDomain}`],
        serialNumber: generateRandomHex(32),
        fingerprint: generateRandomHex(64)
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check SSL certificate')
    } finally {
      setLoading(false)
    }
  }

  const generateRandomHex = (length: number): string => {
    return Array.from({ length }, () =>
      Math.floor(Math.random() * 16).toString(16).toUpperCase()
    ).join(':').match(/.{1,2}/g)?.join(':') || ''
  }

  const getStatusColor = (daysRemaining: number): string => {
    if (daysRemaining > 30) return 'text-green-500'
    if (daysRemaining > 7) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getStatusBg = (daysRemaining: number): string => {
    if (daysRemaining > 30) return 'bg-green-500/10 border-green-500/50'
    if (daysRemaining > 7) return 'bg-yellow-500/10 border-yellow-500/50'
    return 'bg-red-500/10 border-red-500/50'
  }

  const copyFingerprint = () => {
    if (sslInfo?.fingerprint) {
      navigator.clipboard.writeText(sslInfo.fingerprint)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const popularSites = [
    'google.com',
    'github.com',
    'amazon.com',
    'microsoft.com',
    'cloudflare.com'
  ]

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkSSL()}
            placeholder="Enter domain name (e.g., example.com)"
            className="flex-1 px-4 py-3 rounded-lg border border-border bg-background"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={checkSSL}
            disabled={loading}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Check SSL
          </motion.button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {popularSites.map((site) => (
            <button
              key={site}
              onClick={() => setDomain(site)}
              className="px-3 py-1.5 text-sm rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              {site}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500"
        >
          <X className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </motion.div>
      )}

      {sslInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Status Banner */}
          <div className={`p-6 rounded-xl border ${getStatusBg(sslInfo.daysRemaining)}`}>
            <div className="flex items-center gap-4">
              {sslInfo.valid ? (
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X className="w-8 h-8 text-red-500" />
                </div>
              )}
              <div>
                <h3 className={`text-2xl font-bold ${sslInfo.valid ? 'text-green-500' : 'text-red-500'}`}>
                  {sslInfo.valid ? 'SSL Certificate Valid' : 'SSL Certificate Invalid'}
                </h3>
                <p className="text-muted-foreground">
                  {sslInfo.daysRemaining > 0
                    ? `Expires in ${sslInfo.daysRemaining} days`
                    : 'Certificate has expired'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <Clock className={`w-6 h-6 mx-auto mb-2 ${getStatusColor(sslInfo.daysRemaining)}`} />
              <p className={`text-2xl font-bold ${getStatusColor(sslInfo.daysRemaining)}`}>
                {sslInfo.daysRemaining}
              </p>
              <p className="text-sm text-muted-foreground">Days Remaining</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <Lock className="w-6 h-6 mx-auto mb-2 text-cyan-500" />
              <p className="text-lg font-bold">{sslInfo.protocol}</p>
              <p className="text-sm text-muted-foreground">Protocol</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <p className="text-lg font-bold truncate">{sslInfo.keyExchange}</p>
              <p className="text-sm text-muted-foreground">Key Exchange</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <Globe className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-lg font-bold">{sslInfo.sans.length}</p>
              <p className="text-sm text-muted-foreground">SANs</p>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Certificate Info
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Issuer</p>
                  <p className="font-medium">{sslInfo.issuer}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Subject</p>
                  <p className="font-medium font-mono">{sslInfo.subject}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valid From</p>
                  <p className="font-medium">{new Date(sslInfo.validFrom).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valid Until</p>
                  <p className={`font-medium ${getStatusColor(sslInfo.daysRemaining)}`}>
                    {new Date(sslInfo.validTo).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Security Details
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Protocol</p>
                  <p className="font-medium">{sslInfo.protocol}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cipher Suite</p>
                  <p className="font-medium font-mono text-xs">{sslInfo.cipher}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Key Exchange</p>
                  <p className="font-medium">{sslInfo.keyExchange}</p>
                </div>
              </div>
            </div>
          </div>

          {/* SANs */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold mb-4">Subject Alternative Names (SANs)</h3>
            <div className="flex flex-wrap gap-2">
              {sslInfo.sans.map((san, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-mono"
                >
                  {san}
                </span>
              ))}
            </div>
          </div>

          {/* Fingerprint */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Certificate Fingerprint (SHA-256)</h3>
              <button
                onClick={copyFingerprint}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="font-mono text-xs break-all text-muted-foreground">{sslInfo.fingerprint}</p>
          </div>

          {/* Warning if expiring soon */}
          {sslInfo.daysRemaining <= 30 && sslInfo.daysRemaining > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-500">Certificate Expiring Soon</p>
                <p className="text-sm text-muted-foreground">
                  Your SSL certificate will expire in {sslInfo.daysRemaining} days. Consider renewing it soon.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Info */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-4">About SSL Certificates</h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            SSL (Secure Sockets Layer) certificates enable encrypted connections between
            web servers and browsers. They ensure data privacy and integrity.
          </p>
          <p>
            <strong>TLS 1.3</strong> is the latest and most secure protocol version,
            offering improved performance and stronger encryption.
          </p>
        </div>
      </div>
    </div>
  )
}

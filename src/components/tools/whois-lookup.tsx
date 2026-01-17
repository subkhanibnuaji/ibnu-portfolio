'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Search, Copy, Check, Loader2, Calendar, User, Server, Building } from 'lucide-react'

interface WhoisInfo {
  domain: string
  registrar: string
  registrarUrl?: string
  createdDate: string
  updatedDate: string
  expiryDate: string
  status: string[]
  nameServers: string[]
  registrant?: {
    organization?: string
    country?: string
    state?: string
  }
  dnssec: string
  domainAge: number
}

export function WhoisLookup() {
  const [domain, setDomain] = useState('')
  const [whoisInfo, setWhoisInfo] = useState<WhoisInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const lookupWhois = async () => {
    if (!domain.trim()) {
      setError('Please enter a domain name')
      return
    }

    setLoading(true)
    setError(null)
    setWhoisInfo(null)

    try {
      const cleanDomain = domain
        .replace(/^https?:\/\//, '')
        .replace(/\/.*$/, '')
        .replace(/^www\./, '')
        .trim()
        .toLowerCase()

      // Simulated WHOIS data (in production, use a backend API)
      const now = new Date()
      const createdDate = new Date(now.getTime() - Math.random() * 10 * 365 * 24 * 60 * 60 * 1000)
      const expiryDate = new Date(now.getTime() + Math.random() * 3 * 365 * 24 * 60 * 60 * 1000)
      const updatedDate = new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000)

      const domainAge = Math.floor((now.getTime() - createdDate.getTime()) / (365 * 24 * 60 * 60 * 1000))

      const registrars = [
        { name: 'GoDaddy.com, LLC', url: 'https://www.godaddy.com' },
        { name: 'NameCheap, Inc.', url: 'https://www.namecheap.com' },
        { name: 'Cloudflare, Inc.', url: 'https://www.cloudflare.com' },
        { name: 'Google LLC', url: 'https://domains.google' },
        { name: 'Amazon Registrar, Inc.', url: 'https://aws.amazon.com/route53' }
      ]

      const randomRegistrar = registrars[Math.floor(Math.random() * registrars.length)]

      setWhoisInfo({
        domain: cleanDomain,
        registrar: randomRegistrar.name,
        registrarUrl: randomRegistrar.url,
        createdDate: createdDate.toISOString(),
        updatedDate: updatedDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        status: ['clientTransferProhibited', 'clientDeleteProhibited'],
        nameServers: [
          `ns1.${cleanDomain.split('.')[0]}.com`,
          `ns2.${cleanDomain.split('.')[0]}.com`
        ],
        registrant: {
          organization: 'REDACTED FOR PRIVACY',
          country: 'US',
          state: 'CA'
        },
        dnssec: 'unsigned',
        domainAge
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to lookup WHOIS')
    } finally {
      setLoading(false)
    }
  }

  const copyInfo = () => {
    if (whoisInfo) {
      const text = `
Domain: ${whoisInfo.domain}
Registrar: ${whoisInfo.registrar}
Created: ${new Date(whoisInfo.createdDate).toLocaleDateString()}
Expires: ${new Date(whoisInfo.expiryDate).toLocaleDateString()}
Nameservers: ${whoisInfo.nameServers.join(', ')}
      `.trim()
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getDaysUntilExpiry = (): number => {
    if (!whoisInfo) return 0
    const now = new Date()
    const expiry = new Date(whoisInfo.expiryDate)
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getExpiryColor = (): string => {
    const days = getDaysUntilExpiry()
    if (days > 90) return 'text-green-500'
    if (days > 30) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && lookupWhois()}
            placeholder="Enter domain name (e.g., example.com)"
            className="flex-1 px-4 py-3 rounded-lg border border-border bg-background"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={lookupWhois}
            disabled={loading}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Lookup
          </motion.button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500"
        >
          {error}
        </motion.div>
      )}

      {whoisInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Domain Header */}
          <div className="p-6 rounded-xl border border-primary/50 bg-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Domain Name</p>
                <h2 className="text-3xl font-bold font-mono">{whoisInfo.domain}</h2>
              </div>
              <button
                onClick={copyInfo}
                className="p-3 hover:bg-muted rounded-lg transition-colors"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-lg font-bold">{whoisInfo.domainAge} years</p>
              <p className="text-sm text-muted-foreground">Domain Age</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <Calendar className={`w-6 h-6 mx-auto mb-2 ${getExpiryColor()}`} />
              <p className={`text-lg font-bold ${getExpiryColor()}`}>{getDaysUntilExpiry()} days</p>
              <p className="text-sm text-muted-foreground">Until Expiry</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <Server className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <p className="text-lg font-bold">{whoisInfo.nameServers.length}</p>
              <p className="text-sm text-muted-foreground">Nameservers</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <Globe className="w-6 h-6 mx-auto mb-2 text-cyan-500" />
              <p className="text-lg font-bold">{whoisInfo.dnssec}</p>
              <p className="text-sm text-muted-foreground">DNSSEC</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                Registrar Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Registrar</p>
                  <p className="font-medium">{whoisInfo.registrar}</p>
                </div>
                {whoisInfo.registrarUrl && (
                  <div>
                    <p className="text-muted-foreground">Registrar URL</p>
                    <a
                      href={whoisInfo.registrarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {whoisInfo.registrarUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Important Dates
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">{new Date(whoisInfo.createdDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Updated</p>
                  <p className="font-medium">{new Date(whoisInfo.updatedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Expires</p>
                  <p className={`font-medium ${getExpiryColor()}`}>
                    {new Date(whoisInfo.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Nameservers */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" />
              Nameservers
            </h3>
            <div className="space-y-2">
              {whoisInfo.nameServers.map((ns, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-muted font-mono text-sm"
                >
                  {ns}
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold mb-4">Domain Status</h3>
            <div className="flex flex-wrap gap-2">
              {whoisInfo.status.map((status, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 text-sm"
                >
                  {status}
                </span>
              ))}
            </div>
          </div>

          {/* Registrant */}
          {whoisInfo.registrant && (
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Registrant Information
              </h3>
              <div className="text-sm text-muted-foreground">
                <p>Organization: {whoisInfo.registrant.organization}</p>
                {whoisInfo.registrant.country && (
                  <p>Country: {whoisInfo.registrant.country}</p>
                )}
                {whoisInfo.registrant.state && (
                  <p>State/Province: {whoisInfo.registrant.state}</p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

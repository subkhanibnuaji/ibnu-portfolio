'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Search, Copy, Check, Loader2, Server, Shield, Mail, AlertCircle } from 'lucide-react'

interface DNSRecord {
  type: string
  value: string
  ttl?: number
  priority?: number
}

export function DNSLookup() {
  const [domain, setDomain] = useState('')
  const [records, setRecords] = useState<DNSRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState('ALL')

  const recordTypes = [
    { value: 'ALL', label: 'All Records' },
    { value: 'A', label: 'A (IPv4)' },
    { value: 'AAAA', label: 'AAAA (IPv6)' },
    { value: 'CNAME', label: 'CNAME' },
    { value: 'MX', label: 'MX (Mail)' },
    { value: 'NS', label: 'NS (Nameserver)' },
    { value: 'TXT', label: 'TXT' },
    { value: 'SOA', label: 'SOA' }
  ]

  const lookupDNS = async () => {
    if (!domain.trim()) {
      setError('Please enter a domain name')
      return
    }

    setLoading(true)
    setError(null)
    setRecords([])

    try {
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim()

      // Use DNS over HTTPS (DoH) from Cloudflare
      const types = selectedType === 'ALL'
        ? ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT']
        : [selectedType]

      const results: DNSRecord[] = []

      for (const type of types) {
        try {
          const response = await fetch(
            `https://cloudflare-dns.com/dns-query?name=${cleanDomain}&type=${type}`,
            {
              headers: {
                'Accept': 'application/dns-json'
              }
            }
          )

          const data = await response.json()

          if (data.Answer) {
            data.Answer.forEach((answer: { type: number; data: string; TTL: number }) => {
              results.push({
                type: getRecordTypeName(answer.type),
                value: answer.data,
                ttl: answer.TTL
              })
            })
          }
        } catch {
          // Continue with other record types if one fails
        }
      }

      if (results.length === 0) {
        setError('No DNS records found for this domain')
      } else {
        setRecords(results)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to lookup DNS')
    } finally {
      setLoading(false)
    }
  }

  const getRecordTypeName = (type: number): string => {
    const types: Record<number, string> = {
      1: 'A',
      2: 'NS',
      5: 'CNAME',
      6: 'SOA',
      15: 'MX',
      16: 'TXT',
      28: 'AAAA'
    }
    return types[type] || `TYPE${type}`
  }

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'A':
      case 'AAAA':
        return <Server className="w-4 h-4 text-blue-500" />
      case 'MX':
        return <Mail className="w-4 h-4 text-green-500" />
      case 'NS':
        return <Globe className="w-4 h-4 text-purple-500" />
      case 'TXT':
        return <Shield className="w-4 h-4 text-orange-500" />
      default:
        return <Globe className="w-4 h-4 text-cyan-500" />
    }
  }

  const getRecordColor = (type: string): string => {
    const colors: Record<string, string> = {
      'A': 'bg-blue-500/20 text-blue-500 border-blue-500/50',
      'AAAA': 'bg-indigo-500/20 text-indigo-500 border-indigo-500/50',
      'CNAME': 'bg-cyan-500/20 text-cyan-500 border-cyan-500/50',
      'MX': 'bg-green-500/20 text-green-500 border-green-500/50',
      'NS': 'bg-purple-500/20 text-purple-500 border-purple-500/50',
      'TXT': 'bg-orange-500/20 text-orange-500 border-orange-500/50',
      'SOA': 'bg-red-500/20 text-red-500 border-red-500/50'
    }
    return colors[type] || 'bg-gray-500/20 text-gray-500 border-gray-500/50'
  }

  const copyValue = (value: string) => {
    navigator.clipboard.writeText(value)
    setCopied(value)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatTTL = (ttl?: number): string => {
    if (!ttl) return '-'
    if (ttl < 60) return `${ttl}s`
    if (ttl < 3600) return `${Math.floor(ttl / 60)}m`
    if (ttl < 86400) return `${Math.floor(ttl / 3600)}h`
    return `${Math.floor(ttl / 86400)}d`
  }

  const popularDomains = [
    'google.com',
    'github.com',
    'cloudflare.com',
    'amazon.com',
    'microsoft.com'
  ]

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && lookupDNS()}
              placeholder="Enter domain name (e.g., example.com)"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background"
            />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 rounded-lg border border-border bg-background"
            >
              {recordTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={lookupDNS}
              disabled={loading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Lookup
            </motion.button>
          </div>

          {/* Quick Domains */}
          <div className="flex flex-wrap gap-2">
            {popularDomains.map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDomain(d)
                }}
                className="px-3 py-1.5 text-sm rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </motion.div>
      )}

      {records.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['A', 'AAAA', 'MX', 'NS'].map(type => {
              const count = records.filter(r => r.type === type).length
              return (
                <div key={type} className="p-4 rounded-xl border border-border bg-card text-center">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-muted-foreground">{type} Records</p>
                </div>
              )
            })}
          </div>

          {/* Records List */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold mb-4">DNS Records for {domain}</h3>
            <div className="space-y-3">
              {records.map((record, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-2 min-w-[100px]">
                    {getRecordIcon(record.type)}
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getRecordColor(record.type)}`}>
                      {record.type}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm break-all">{record.value}</p>
                    {record.ttl && (
                      <p className="text-xs text-muted-foreground mt-1">
                        TTL: {formatTTL(record.ttl)} ({record.ttl}s)
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => copyValue(record.value)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
                  >
                    {copied === record.value
                      ? <Check className="w-4 h-4 text-green-500" />
                      : <Copy className="w-4 h-4" />
                    }
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Record Type Explanations */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold mb-4">Record Types Explained</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-blue-500">A Record</p>
                <p className="text-muted-foreground">Maps domain to IPv4 address</p>
              </div>
              <div>
                <p className="font-medium text-indigo-500">AAAA Record</p>
                <p className="text-muted-foreground">Maps domain to IPv6 address</p>
              </div>
              <div>
                <p className="font-medium text-cyan-500">CNAME Record</p>
                <p className="text-muted-foreground">Alias pointing to another domain</p>
              </div>
              <div>
                <p className="font-medium text-green-500">MX Record</p>
                <p className="text-muted-foreground">Mail server for the domain</p>
              </div>
              <div>
                <p className="font-medium text-purple-500">NS Record</p>
                <p className="text-muted-foreground">Authoritative nameservers</p>
              </div>
              <div>
                <p className="font-medium text-orange-500">TXT Record</p>
                <p className="text-muted-foreground">Text info (SPF, DKIM, verification)</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

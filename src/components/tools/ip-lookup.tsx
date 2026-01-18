'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Search, MapPin, Building, Wifi, Shield, Copy, Check, Loader2 } from 'lucide-react'

interface IPInfo {
  ip: string
  city?: string
  region?: string
  country?: string
  countryCode?: string
  timezone?: string
  isp?: string
  org?: string
  as?: string
  lat?: number
  lon?: number
  zip?: string
}

export function IPLookup() {
  const [ipInput, setIpInput] = useState('')
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null)
  const [myIP, setMyIP] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const lookupIP = async (ip?: string) => {
    setLoading(true)
    setError(null)
    setIpInfo(null)

    try {
      const targetIP = ip || ipInput.trim()
      const url = targetIP
        ? `https://ipapi.co/${targetIP}/json/`
        : 'https://ipapi.co/json/'

      const response = await fetch(url)
      const data = await response.json()

      if (data.error) {
        throw new Error(data.reason || 'Failed to lookup IP')
      }

      setIpInfo({
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        countryCode: data.country_code,
        timezone: data.timezone,
        isp: data.org,
        org: data.org,
        as: data.asn,
        lat: data.latitude,
        lon: data.longitude,
        zip: data.postal
      })

      if (!ip && !ipInput) {
        setMyIP(data.ip)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to lookup IP address')
    } finally {
      setLoading(false)
    }
  }

  const copyIP = () => {
    if (ipInfo?.ip) {
      navigator.clipboard.writeText(ipInfo.ip)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isValidIP = (ip: string): boolean => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$/
    return ipv4Regex.test(ip) || ipv6Regex.test(ip) || ip === ''
  }

  const getCountryFlag = (countryCode?: string): string => {
    if (!countryCode) return ''
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="Enter IP address (e.g., 8.8.8.8) or leave empty for your IP"
              className={`w-full px-4 py-3 rounded-lg border bg-background font-mono ${
                ipInput && !isValidIP(ipInput) ? 'border-red-500' : 'border-border'
              }`}
            />
            {ipInput && !isValidIP(ipInput) && (
              <p className="text-sm text-red-500 mt-1">Invalid IP address format</p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => lookupIP()}
            disabled={loading || (!!ipInput && !isValidIP(ipInput))}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Lookup
          </motion.button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => lookupIP()}
            className="px-3 py-1.5 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            My IP Address
          </button>
          <button
            onClick={() => {
              setIpInput('8.8.8.8')
              lookupIP('8.8.8.8')
            }}
            className="px-3 py-1.5 text-sm rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            Google DNS
          </button>
          <button
            onClick={() => {
              setIpInput('1.1.1.1')
              lookupIP('1.1.1.1')
            }}
            className="px-3 py-1.5 text-sm rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            Cloudflare DNS
          </button>
          <button
            onClick={() => {
              setIpInput('208.67.222.222')
              lookupIP('208.67.222.222')
            }}
            className="px-3 py-1.5 text-sm rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            OpenDNS
          </button>
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

      {ipInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Info */}
          <div className="p-6 rounded-xl border border-primary/50 bg-primary/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                IP Address
              </h3>
              <button
                onClick={copyIP}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-3xl font-bold font-mono">{ipInfo.ip}</p>
            {myIP === ipInfo.ip && (
              <p className="text-sm text-primary mt-2">This is your public IP address</p>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Location */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-red-500" />
                <span className="font-medium">Location</span>
              </div>
              <div className="space-y-2 text-sm">
                {ipInfo.city && (
                  <p><span className="text-muted-foreground">City:</span> {ipInfo.city}</p>
                )}
                {ipInfo.region && (
                  <p><span className="text-muted-foreground">Region:</span> {ipInfo.region}</p>
                )}
                {ipInfo.country && (
                  <p>
                    <span className="text-muted-foreground">Country:</span>{' '}
                    {getCountryFlag(ipInfo.countryCode)} {ipInfo.country}
                  </p>
                )}
                {ipInfo.zip && (
                  <p><span className="text-muted-foreground">Postal Code:</span> {ipInfo.zip}</p>
                )}
              </div>
            </div>

            {/* Coordinates */}
            {ipInfo.lat && ipInfo.lon && (
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Coordinates</span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Latitude:</span> {ipInfo.lat.toFixed(4)}</p>
                  <p><span className="text-muted-foreground">Longitude:</span> {ipInfo.lon.toFixed(4)}</p>
                  <a
                    href={`https://www.google.com/maps?q=${ipInfo.lat},${ipInfo.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-block mt-2"
                  >
                    View on Google Maps →
                  </a>
                </div>
              </div>
            )}

            {/* Timezone */}
            {ipInfo.timezone && (
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">Timezone</span>
                </div>
                <p className="text-lg font-medium">{ipInfo.timezone}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Local time: {new Date().toLocaleString('en-US', { timeZone: ipInfo.timezone })}
                </p>
              </div>
            )}

            {/* ISP */}
            {ipInfo.isp && (
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 mb-3">
                  <Wifi className="w-5 h-5 text-green-500" />
                  <span className="font-medium">ISP / Organization</span>
                </div>
                <p className="text-sm break-words">{ipInfo.isp}</p>
              </div>
            )}

            {/* ASN */}
            {ipInfo.as && (
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-cyan-500" />
                  <span className="font-medium">ASN</span>
                </div>
                <p className="text-sm font-mono">{ipInfo.as}</p>
              </div>
            )}
          </div>

          {/* Map Preview */}
          {ipInfo.lat && ipInfo.lon && (
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-4">Location Preview</h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${ipInfo.lon - 0.1}%2C${ipInfo.lat - 0.1}%2C${ipInfo.lon + 0.1}%2C${ipInfo.lat + 0.1}&layer=mapnik&marker=${ipInfo.lat}%2C${ipInfo.lon}`}
                  className="w-full h-full"
                  style={{ border: 0 }}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Info */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-4">About IP Lookup</h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            IP Lookup tool helps you find geographical and network information about any IP address.
            This includes location data, ISP information, timezone, and more.
          </p>
          <p>
            <strong>Note:</strong> IP geolocation is approximate and may not reflect the exact physical location.
            VPNs, proxies, and corporate networks can show different locations.
          </p>
        </div>
      </div>
    </div>
  )
}

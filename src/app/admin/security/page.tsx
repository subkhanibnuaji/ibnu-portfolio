'use client'

/**
 * Security Dashboard Page
 * Admin-only page for monitoring security threats
 */

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import {
  Shield,
  AlertTriangle,
  Ban,
  Eye,
  RefreshCw,
  Clock,
  Activity,
  Zap,
  Lock,
  Unlock,
} from 'lucide-react'

// =============================================================================
// TYPES
// =============================================================================

interface ThreatLog {
  timestamp: string
  ip: string
  threat: string
  severity: string
  path: string
  userAgent: string
  details?: string
}

interface BlockedIP {
  ip: string
  until: number
  reason: string
  permanent: boolean
  expiresIn: string
}

interface SecurityStats {
  totalThreatsLast24h: number
  blockedIPs: number
  threatsByType: Record<string, number>
  threatsBySeverity: Record<string, number>
  topOffenders: { ip: string; count: number }[]
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function SecurityDashboard() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<SecurityStats | null>(null)
  const [logs, setLogs] = useState<ThreatLog[]>([])
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'blocked'>('overview')
  const [blockForm, setBlockForm] = useState({ ip: '', reason: '', duration: 3600000 })

  // Auth check
  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/admin/login')
    }
  }, [status])

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [statsRes, logsRes, blockedRes] = await Promise.all([
        fetch('/api/security/stats?type=summary'),
        fetch('/api/security/stats?type=logs&limit=100'),
        fetch('/api/security/stats?type=blocked'),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData.data.stats)
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json()
        setLogs(logsData.data.logs || [])
      }

      if (blockedRes.ok) {
        const blockedData = await blockedRes.json()
        setBlockedIPs(blockedData.data.blockedIPs || [])
      }
    } catch (error) {
      console.error('Failed to fetch security data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Block IP handler
  const handleBlockIP = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/security/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blockForm),
      })

      if (res.ok) {
        setBlockForm({ ip: '', reason: '', duration: 3600000 })
        fetchData()
      }
    } catch (error) {
      console.error('Failed to block IP:', error)
    }
  }

  // Unblock IP handler
  const handleUnblockIP = async (ip: string) => {
    try {
      const res = await fetch('/api/security/block', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip }),
      })

      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Failed to unblock IP:', error)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading security data...</span>
        </div>
      </div>
    )
  }

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">Admin privileges required</p>
        </div>
      </div>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500 bg-red-500/10'
      case 'high':
        return 'text-orange-500 bg-orange-500/10'
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10'
      default:
        return 'text-blue-500 bg-blue-500/10'
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Security Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Real-time threat monitoring and protection
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Threats (24h)</p>
                <p className="text-2xl font-bold">{stats?.totalThreatsLast24h || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Ban className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blocked IPs</p>
                <p className="text-2xl font-bold">{stats?.blockedIPs || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">DDoS Attempts</p>
                <p className="text-2xl font-bold">{stats?.threatsByType?.ddos || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Activity className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Critical Severity</p>
                <p className="text-2xl font-bold">{stats?.threatsBySeverity?.critical || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['overview', 'logs', 'blocked'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-2 rounded-lg font-medium capitalize transition-colors
                ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-lg">
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Threat Distribution</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Threats by Type */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">By Type</h3>
                  <div className="space-y-2">
                    {Object.entries(stats?.threatsByType || {}).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                        <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Offenders */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Top Offenders</h3>
                  <div className="space-y-2">
                    {stats?.topOffenders?.slice(0, 5).map(({ ip, count }, i) => (
                      <div key={ip} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">#{i + 1}</span>
                          <span className="font-mono text-sm">{ip}</span>
                        </div>
                        <span className="font-mono text-sm bg-red-500/10 text-red-500 px-2 py-1 rounded">
                          {count} threats
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Time</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">IP</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Threat</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Severity</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Path</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logs.slice(0, 50).map((log, i) => (
                    <tr key={i} className="hover:bg-muted/50">
                      <td className="p-4 text-sm font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-4 text-sm font-mono">{log.ip}</td>
                      <td className="p-4 text-sm capitalize">{log.threat.replace('_', ' ')}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded capitalize ${getSeverityColor(log.severity)}`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-mono truncate max-w-[200px]">{log.path}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {logs.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No threats detected recently</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'blocked' && (
            <div className="p-6">
              {/* Block IP Form */}
              <form onSubmit={handleBlockIP} className="mb-6 p-4 bg-muted rounded-lg">
                <h3 className="text-sm font-medium mb-3">Block IP Address</h3>
                <div className="flex gap-3 flex-wrap">
                  <input
                    type="text"
                    placeholder="IP Address"
                    value={blockForm.ip}
                    onChange={(e) => setBlockForm({ ...blockForm, ip: e.target.value })}
                    className="px-3 py-2 bg-background border border-border rounded-lg text-sm flex-1 min-w-[150px]"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Reason"
                    value={blockForm.reason}
                    onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                    className="px-3 py-2 bg-background border border-border rounded-lg text-sm flex-1 min-w-[200px]"
                    required
                  />
                  <select
                    value={blockForm.duration}
                    onChange={(e) => setBlockForm({ ...blockForm, duration: parseInt(e.target.value) })}
                    className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  >
                    <option value={3600000}>1 Hour</option>
                    <option value={86400000}>24 Hours</option>
                    <option value={604800000}>7 Days</option>
                    <option value={2592000000}>30 Days</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    Block
                  </button>
                </div>
              </form>

              {/* Blocked IPs List */}
              <div className="space-y-2">
                {blockedIPs.map((item) => (
                  <div
                    key={item.ip}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div>
                      <div className="font-mono text-sm">{item.ip}</div>
                      <div className="text-xs text-muted-foreground">{item.reason}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm">{item.expiresIn}</div>
                        {item.permanent && (
                          <span className="text-xs text-red-500">Permanent</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleUnblockIP(item.ip)}
                        className="p-2 hover:bg-background rounded-lg transition-colors"
                        title="Unblock"
                      >
                        <Unlock className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {blockedIPs.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No IPs are currently blocked</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

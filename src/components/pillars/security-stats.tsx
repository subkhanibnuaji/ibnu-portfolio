'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, ShieldAlert, AlertTriangle, ShieldCheck, Bug, Lock, Skull, FileWarning } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SecurityStats {
  critical: number
  high: number
  medium: number
  info: number
}

interface SecurityStatsProps {
  className?: string
}

export function SecurityStatsWidget({ className }: SecurityStatsProps) {
  const [stats, setStats] = useState<SecurityStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/news/security')
        const data = await response.json()

        if (data.success && data.severityCounts) {
          setStats(data.severityCounts)
        }
      } catch {
        console.error('Failed to fetch security stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 300000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 bg-card border border-border rounded-xl animate-pulse">
            <div className="w-10 h-10 rounded-lg bg-muted mb-3" />
            <div className="h-6 w-8 bg-muted rounded mb-1" />
            <div className="h-4 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    )
  }

  const statItems = [
    {
      label: 'Critical',
      value: stats?.critical || 0,
      icon: Skull,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
    },
    {
      label: 'High',
      value: stats?.high || 0,
      icon: ShieldAlert,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
    },
    {
      label: 'Medium',
      value: stats?.medium || 0,
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
    {
      label: 'Info',
      value: stats?.info || 0,
      icon: ShieldCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
  ]

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            'p-4 bg-card border rounded-xl transition-all hover:scale-105',
            item.borderColor
          )}
        >
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', item.bgColor)}>
            <item.icon className={cn('w-5 h-5', item.color)} />
          </div>
          <p className="text-2xl font-bold">{item.value}</p>
          <p className={cn('text-sm', item.color)}>{item.label}</p>
        </motion.div>
      ))}
    </div>
  )
}

// Animated security threat indicators
export function ThreatIndicator({ className }: { className?: string }) {
  const threats = [
    { icon: FileWarning, label: 'Malware', count: 847, trend: '+12%' },
    { icon: Bug, label: 'Vulnerabilities', count: 234, trend: '+8%' },
    { icon: Lock, label: 'Breaches', count: 156, trend: '-3%' },
    { icon: Shield, label: 'Patches', count: 512, trend: '+24%' },
  ]

  return (
    <div className={cn('p-6 bg-card border border-border rounded-2xl', className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-security-danger/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-security-danger" />
        </div>
        <div>
          <h3 className="font-bold">Global Threat Landscape</h3>
          <p className="text-xs text-muted-foreground">Real-time security metrics</p>
        </div>
      </div>

      <div className="space-y-4">
        {threats.map((threat, index) => (
          <motion.div
            key={threat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
                <threat.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="font-medium">{threat.label}</span>
            </div>
            <div className="text-right">
              <p className="font-bold">{threat.count.toLocaleString()}</p>
              <p className={cn(
                'text-xs',
                threat.trend.startsWith('+') ? 'text-trading-loss' : 'text-trading-profit'
              )}>
                {threat.trend} this week
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

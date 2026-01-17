'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Activity,
  Gauge,
  MousePointer,
  Layout,
  Clock,
  Server,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react'

interface VitalStats {
  count: number
  average: number
  p75: number
  p95: number
  good: number
  needsImprovement: number
  poor: number
}

interface VitalsData {
  vitals: Record<string, VitalStats>
  timestamp: number
}

const VITAL_INFO = {
  LCP: {
    name: 'Largest Contentful Paint',
    description: 'Loading performance - when main content is visible',
    icon: Activity,
    unit: 'ms',
    thresholds: { good: 2500, poor: 4000 },
  },
  FID: {
    name: 'First Input Delay',
    description: 'Interactivity - response time to first user input',
    icon: MousePointer,
    unit: 'ms',
    thresholds: { good: 100, poor: 300 },
  },
  CLS: {
    name: 'Cumulative Layout Shift',
    description: 'Visual stability - unexpected layout shifts',
    icon: Layout,
    unit: '',
    thresholds: { good: 0.1, poor: 0.25 },
  },
  FCP: {
    name: 'First Contentful Paint',
    description: 'Initial render - when first content appears',
    icon: Clock,
    unit: 'ms',
    thresholds: { good: 1800, poor: 3000 },
  },
  TTFB: {
    name: 'Time to First Byte',
    description: 'Server response - time until first byte received',
    icon: Server,
    unit: 'ms',
    thresholds: { good: 800, poor: 1800 },
  },
  INP: {
    name: 'Interaction to Next Paint',
    description: 'Responsiveness - time from interaction to visual update',
    icon: Gauge,
    unit: 'ms',
    thresholds: { good: 200, poor: 500 },
  },
}

function getRatingColor(rating: string) {
  switch (rating) {
    case 'good':
      return 'bg-green-500'
    case 'needs-improvement':
      return 'bg-yellow-500'
    case 'poor':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

function getRatingBadge(value: number, thresholds: { good: number; poor: number }) {
  if (value <= thresholds.good) {
    return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Good</Badge>
  }
  if (value <= thresholds.poor) {
    return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Needs Improvement</Badge>
  }
  return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Poor</Badge>
}

function VitalCard({ name, stats }: { name: string; stats: VitalStats }) {
  const info = VITAL_INFO[name as keyof typeof VITAL_INFO]
  if (!info) return null

  const Icon = info.icon
  const total = stats.good + stats.needsImprovement + stats.poor
  const goodPercent = total > 0 ? (stats.good / total) * 100 : 0
  const needsPercent = total > 0 ? (stats.needsImprovement / total) * 100 : 0
  const poorPercent = total > 0 ? (stats.poor / total) * 100 : 0

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{name}</CardTitle>
          </div>
          {getRatingBadge(stats.p75, info.thresholds)}
        </div>
        <p className="text-sm text-muted-foreground">{info.name}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">
                {stats.average.toFixed(info.unit ? 0 : 3)}
                <span className="text-sm font-normal text-muted-foreground">{info.unit}</span>
              </p>
              <p className="text-xs text-muted-foreground">Average</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {stats.p75.toFixed(info.unit ? 0 : 3)}
                <span className="text-sm font-normal text-muted-foreground">{info.unit}</span>
              </p>
              <p className="text-xs text-muted-foreground">P75</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {stats.p95.toFixed(info.unit ? 0 : 3)}
                <span className="text-sm font-normal text-muted-foreground">{info.unit}</span>
              </p>
              <p className="text-xs text-muted-foreground">P95</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{stats.count} samples</span>
              <div className="flex gap-2">
                <span className="text-green-400">{goodPercent.toFixed(0)}% good</span>
                <span className="text-yellow-400">{needsPercent.toFixed(0)}% ok</span>
                <span className="text-red-400">{poorPercent.toFixed(0)}% poor</span>
              </div>
            </div>
            <div className="flex h-2 overflow-hidden rounded-full bg-secondary">
              <div className={`${getRatingColor('good')}`} style={{ width: `${goodPercent}%` }} />
              <div className={`${getRatingColor('needs-improvement')}`} style={{ width: `${needsPercent}%` }} />
              <div className={`${getRatingColor('poor')}`} style={{ width: `${poorPercent}%` }} />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">{info.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PerformanceDashboard() {
  const [data, setData] = useState<VitalsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/monitoring/vitals')
      if (!response.ok) throw new Error('Failed to fetch vitals')
      const result = await response.json()
      setData(result)
    } catch {
      setError('Failed to load performance data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const calculateOverallScore = () => {
    if (!data?.vitals) return 0

    const scores: number[] = []
    const coreVitals = ['LCP', 'FID', 'CLS']

    coreVitals.forEach((name) => {
      const stats = data.vitals[name]
      if (stats) {
        const total = stats.good + stats.needsImprovement + stats.poor
        if (total > 0) {
          scores.push((stats.good / total) * 100)
        }
      }
    })

    if (scores.length === 0) return 0
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  const overallScore = calculateOverallScore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Performance Dashboard</h1>
            <p className="text-muted-foreground">Core Web Vitals monitoring</p>
          </div>
          <Button onClick={fetchData} disabled={loading} variant="outline">
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Overall Score */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-transparent">
          <CardContent className="flex items-center gap-8 p-6">
            <div className="relative h-32 w-32">
              <svg className="h-32 w-32 -rotate-90 transform">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-secondary"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${overallScore * 3.52} 352`}
                  className={
                    overallScore >= 90
                      ? 'text-green-500'
                      : overallScore >= 50
                        ? 'text-yellow-500'
                        : 'text-red-500'
                  }
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{overallScore}</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Performance Score</h2>
              <p className="text-muted-foreground">
                Based on Core Web Vitals (LCP, FID, CLS)
              </p>
              <div className="mt-4 flex gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">90-100: Excellent</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">50-89: Needs Work</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">0-49: Poor</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <TrendingUp className="h-12 w-12 text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">
                {data?.timestamp
                  ? `Last updated: ${new Date(data.timestamp).toLocaleTimeString()}`
                  : 'Loading...'}
              </p>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-500/50 bg-red-500/10">
            <CardContent className="p-4">
              <p className="text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Vitals Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.vitals &&
            Object.entries(data.vitals).map(([name, stats]) => (
              <VitalCard key={name} name={name} stats={stats} />
            ))}
        </div>

        {(!data?.vitals || Object.keys(data.vitals).length === 0) && !loading && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <Activity className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No Performance Data Yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Web Vitals data will appear here once users visit your site.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>About Core Web Vitals</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(VITAL_INFO).map(([key, info]) => {
              const Icon = info.icon
              return (
                <div key={key} className="flex gap-3">
                  <Icon className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">
                      {key} - {info.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Good: ≤{info.thresholds.good}
                      {info.unit} | Poor: &gt;{info.thresholds.poor}
                      {info.unit}
                    </p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

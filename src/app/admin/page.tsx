'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Shield,
  Activity,
  Settings,
  BarChart3,
  Server,
  Lock,
  AlertTriangle,
  Gauge,
} from 'lucide-react'

const adminPages = [
  {
    title: 'Security Dashboard',
    description: 'Monitor threats, blocked IPs, and security events',
    href: '/admin/security',
    icon: Shield,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    title: 'Performance',
    description: 'Core Web Vitals and performance metrics',
    href: '/admin/performance',
    icon: Gauge,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    title: 'Health Status',
    description: 'System health and uptime monitoring',
    href: '/api/monitoring/health',
    icon: Activity,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    external: true,
  },
  {
    title: 'Public Status',
    description: 'Public status page for users',
    href: '/api/monitoring/status',
    icon: Server,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    external: true,
  },
]

const quickStats = [
  {
    label: 'Security Score',
    value: '9.5/10',
    icon: Shield,
    color: 'text-green-500',
  },
  {
    label: 'Uptime',
    value: '99.9%',
    icon: Activity,
    color: 'text-blue-500',
  },
  {
    label: 'Threats Blocked',
    value: 'Active',
    icon: Lock,
    color: 'text-red-500',
  },
  {
    label: 'Performance',
    value: 'Optimized',
    icon: BarChart3,
    color: 'text-purple-500',
  },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your portfolio application
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {quickStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="border-border/50">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className={`rounded-lg bg-primary/10 p-2`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Warning Banner */}
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="flex items-center gap-4 p-4">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            <div>
              <p className="font-medium text-yellow-500">Setup Required</p>
              <p className="text-sm text-muted-foreground">
                Configure environment variables for full functionality: UPSTASH_REDIS_REST_URL,
                SENTRY_DSN, NEXT_PUBLIC_TURNSTILE_SITE_KEY
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Admin Pages Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {adminPages.map((page) => {
            const Icon = page.icon
            const Component = page.external ? 'a' : Link

            return (
              <Component
                key={page.href}
                href={page.href}
                {...(page.external ? { target: '_blank', rel: 'noopener' } : {})}
              >
                <Card className="h-full cursor-pointer border-border/50 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`rounded-lg p-3 ${page.bgColor}`}>
                        <Icon className={`h-6 w-6 ${page.color}`} />
                      </div>
                      <div>
                        <CardTitle>{page.title}</CardTitle>
                        <CardDescription>{page.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Component>
            )
          })}
        </div>

        {/* Security Features */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Active Security Features</CardTitle>
            <CardDescription>Enterprise-grade protection enabled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                'DDoS Protection',
                'Rate Limiting',
                'SQL Injection Prevention',
                'XSS Protection',
                'Honeypot Traps',
                'IP Reputation',
                'Bot Detection',
                'Brute Force Protection',
                'CSP Headers',
                'HSTS Enabled',
                'Path Traversal Prevention',
                'CAPTCHA Ready',
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2"
                >
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Protected by enterprise-grade security | All services FREE tier</p>
        </div>
      </div>
    </div>
  )
}

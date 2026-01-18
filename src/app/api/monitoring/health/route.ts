/**
 * Comprehensive Health Check API
 *
 * Use with FREE uptime monitoring services:
 * - UptimeRobot (https://uptimerobot.com) - 50 monitors free
 * - Better Uptime (https://betteruptime.com) - 10 monitors free
 * - Freshping (https://freshping.io) - 50 monitors free
 * - Uptime Kuma (https://uptime.kuma.pet) - Self-hosted, unlimited
 *
 * Configure these services to ping this endpoint every 1-5 minutes
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  uptime: number
  checks: {
    database: CheckResult
    memory: CheckResult
    api: CheckResult
    security: CheckResult
  }
  metrics: {
    memoryUsage: NodeJS.MemoryUsage
    cpuUsage?: number
    requestsPerMinute?: number
  }
}

interface CheckResult {
  status: 'pass' | 'warn' | 'fail'
  message: string
  latency?: number
}

const startTime = Date.now()

export async function GET(req: NextRequest) {
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    checks: {
      database: await checkDatabase(),
      memory: checkMemory(),
      api: checkAPI(),
      security: checkSecurity(),
    },
    metrics: {
      memoryUsage: process.memoryUsage(),
    },
  }

  // Determine overall status
  const checkResults = Object.values(health.checks)
  if (checkResults.some((c) => c.status === 'fail')) {
    health.status = 'unhealthy'
  } else if (checkResults.some((c) => c.status === 'warn')) {
    health.status = 'degraded'
  }

  // Return appropriate status code
  const statusCode =
    health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503

  return NextResponse.json(health, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Health-Status': health.status,
    },
  })
}

// =============================================================================
// HEALTH CHECKS
// =============================================================================

async function checkDatabase(): Promise<CheckResult> {
  const start = Date.now()

  try {
    // Simple query to check connection
    await prisma.$queryRaw`SELECT 1`
    const latency = Date.now() - start

    if (latency > 1000) {
      return {
        status: 'warn',
        message: 'Database responding slowly',
        latency,
      }
    }

    return {
      status: 'pass',
      message: 'Database connected',
      latency,
    }
  } catch (error) {
    return {
      status: 'fail',
      message: `Database error: ${error instanceof Error ? error.message : 'Unknown'}`,
      latency: Date.now() - start,
    }
  }
}

function checkMemory(): CheckResult {
  const usage = process.memoryUsage()
  const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024)
  const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024)
  const percentUsed = Math.round((usage.heapUsed / usage.heapTotal) * 100)

  if (percentUsed > 90) {
    return {
      status: 'fail',
      message: `Memory critical: ${heapUsedMB}MB / ${heapTotalMB}MB (${percentUsed}%)`,
    }
  }

  if (percentUsed > 75) {
    return {
      status: 'warn',
      message: `Memory high: ${heapUsedMB}MB / ${heapTotalMB}MB (${percentUsed}%)`,
    }
  }

  return {
    status: 'pass',
    message: `Memory OK: ${heapUsedMB}MB / ${heapTotalMB}MB (${percentUsed}%)`,
  }
}

function checkAPI(): CheckResult {
  // Basic API check - in production, you might want to test critical endpoints
  return {
    status: 'pass',
    message: 'API responding',
  }
}

function checkSecurity(): CheckResult {
  // Check if critical security features are enabled
  const issues: string[] = []

  if (!process.env.AUTH_SECRET) {
    issues.push('AUTH_SECRET not set')
  }

  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_APP_URL?.startsWith('https')) {
    issues.push('Not using HTTPS in production')
  }

  if (issues.length > 0) {
    return {
      status: 'warn',
      message: `Security issues: ${issues.join(', ')}`,
    }
  }

  return {
    status: 'pass',
    message: 'Security configuration OK',
  }
}

// =============================================================================
// SIMPLE PING ENDPOINT
// =============================================================================

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'X-Health-Status': 'ok',
    },
  })
}

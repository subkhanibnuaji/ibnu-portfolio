/**
 * Health Check Endpoint
 * Used for monitoring and load balancer health checks
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  uptime: number
  checks: {
    database: 'ok' | 'error' | 'unknown'
    memory: {
      used: number
      total: number
      percentage: number
    }
  }
}

const startTime = Date.now()

export async function GET() {
  const status: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '3.0.0',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    checks: {
      database: 'unknown',
      memory: {
        used: 0,
        total: 0,
        percentage: 0,
      },
    },
  }

  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`
    status.checks.database = 'ok'
  } catch (error) {
    status.checks.database = 'error'
    status.status = 'degraded'
  }

  // Check memory usage (Node.js)
  try {
    const memUsage = process.memoryUsage()
    status.checks.memory = {
      used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
      percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
    }

    // Warn if memory usage is high
    if (status.checks.memory.percentage > 90) {
      status.status = 'degraded'
    }
  } catch (error) {
    // Memory check failed, but not critical
  }

  const httpStatus = status.status === 'healthy' ? 200 : 503

  return NextResponse.json(status, {
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

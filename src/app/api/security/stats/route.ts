/**
 * Security Statistics API
 * Admin-only endpoint for monitoring security threats
 */

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import {
  getThreatLogs,
  getBlockedIPs,
  getSuspicionScores,
  getSecurityStats,
} from '@/lib/security/advanced-protection'
import { apiError, apiSuccess } from '@/lib/security'

export async function GET(req: NextRequest) {
  try {
    // Auth check - admin only
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return apiError('Unauthorized', 401)
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'summary'

    switch (type) {
      case 'logs':
        const limit = Math.min(500, parseInt(searchParams.get('limit') || '100'))
        return apiSuccess({
          logs: getThreatLogs(limit),
        })

      case 'blocked':
        const blocked = Array.from(getBlockedIPs().entries()).map(([ip, data]) => ({
          ip,
          ...data,
          expiresIn: data.until === Infinity ? 'permanent' : `${Math.round((data.until - Date.now()) / 1000 / 60)} minutes`,
        }))
        return apiSuccess({ blockedIPs: blocked })

      case 'suspicion':
        const scores = Array.from(getSuspicionScores().entries())
          .map(([ip, data]) => ({ ip, ...data }))
          .sort((a, b) => b.score - a.score)
        return apiSuccess({ suspicionScores: scores })

      case 'summary':
      default:
        return apiSuccess({
          stats: getSecurityStats(),
          timestamp: new Date().toISOString(),
        })
    }
  } catch (error) {
    console.error('Security stats error:', error)
    return apiError('Failed to fetch security stats', 500)
  }
}

/**
 * IP Blocking Management API
 * Admin-only endpoint for managing IP blocks
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { blockIP, unblockIP } from '@/lib/security/advanced-protection'
import { apiError, apiSuccess, logAuditEvent } from '@/lib/security'
import { validateInput, formatZodErrors } from '@/lib/validations'

const blockSchema = z.object({
  ip: z.string().ip({ message: 'Invalid IP address' }),
  duration: z.number().min(60000).max(365 * 24 * 60 * 60 * 1000).optional().default(60 * 60 * 1000), // Default 1 hour
  reason: z.string().min(1).max(200),
  permanent: z.boolean().optional().default(false),
})

const unblockSchema = z.object({
  ip: z.string().ip({ message: 'Invalid IP address' }),
})

// POST - Block an IP
export async function POST(req: NextRequest) {
  try {
    // Auth check - admin only
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      logAuditEvent(req, 'ip_block_unauthorized', false)
      return apiError('Unauthorized', 401)
    }

    const body = await req.json()
    const validation = validateInput(blockSchema, body)

    if (!validation.success) {
      return apiError(formatZodErrors(validation.errors), 400)
    }

    const { ip, duration = 60 * 60 * 1000, reason, permanent } = validation.data

    blockIP(ip, permanent ? Infinity : duration, reason, permanent)

    logAuditEvent(req, 'ip_blocked', true, session.user.id, {
      ip,
      duration: permanent ? 'permanent' : `${duration / 1000 / 60} minutes`,
      reason,
    })

    return apiSuccess({
      message: `IP ${ip} has been blocked`,
      duration: permanent ? 'permanent' : `${duration / 1000 / 60} minutes`,
    })
  } catch (error) {
    console.error('IP block error:', error)
    return apiError('Failed to block IP', 500)
  }
}

// DELETE - Unblock an IP
export async function DELETE(req: NextRequest) {
  try {
    // Auth check - admin only
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      logAuditEvent(req, 'ip_unblock_unauthorized', false)
      return apiError('Unauthorized', 401)
    }

    const body = await req.json()
    const validation = validateInput(unblockSchema, body)

    if (!validation.success) {
      return apiError(formatZodErrors(validation.errors), 400)
    }

    const { ip } = validation.data
    const success = unblockIP(ip)

    if (!success) {
      return apiError('IP is not blocked', 404)
    }

    logAuditEvent(req, 'ip_unblocked', true, session.user.id, { ip })

    return apiSuccess({
      message: `IP ${ip} has been unblocked`,
    })
  } catch (error) {
    console.error('IP unblock error:', error)
    return apiError('Failed to unblock IP', 500)
  }
}

/**
 * Contact Form API
 * Handles contact form submissions with validation, rate limiting, and notifications
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { sendContactNotification } from '@/lib/email'
import { contactSchema, validateInput, formatZodErrors } from '@/lib/validations'
import {
  checkRateLimit,
  rateLimitResponse,
  apiError,
  apiSuccess,
  logAuditEvent,
  getClientIp,
} from '@/lib/security'

// =============================================================================
// POST - Submit contact form
// =============================================================================

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - 3 requests per minute
    const rateLimit = await checkRateLimit(req, 'contact')
    if (!rateLimit.allowed) {
      logAuditEvent(req, 'contact_rate_limited', false)
      return rateLimitResponse(rateLimit.resetIn)
    }

    // Parse and validate input
    const body = await req.json()
    const validation = validateInput(contactSchema, body)

    if (!validation.success) {
      logAuditEvent(req, 'contact_validation_failed', false, undefined, {
        errors: formatZodErrors(validation.errors),
      })
      return apiError(formatZodErrors(validation.errors), 400)
    }

    const { name = '', email = '', subject = '', message = '' } = validation.data || {}

    // Get request metadata
    const userAgent = req.headers.get('user-agent') || undefined

    // Save to database
    let submissionId: string | null = null
    try {
      const submission = await prisma.contactSubmission.create({
        data: {
          name,
          email,
          subject,
          message,
          userAgent,
          status: 'NEW',
          priority: determinePriority(subject || '', message),
        },
      })
      submissionId = submission.id
    } catch (dbError) {
      console.error('Database error saving contact:', dbError)
      // Continue anyway - still send email notification
    }

    // Send email notification
    let emailSent = false
    try {
      const emailResult = await sendContactNotification({
        name,
        email,
        subject,
        message,
      })
      emailSent = emailResult.success
    } catch (emailError) {
      console.error('Email notification failed:', emailError)
    }

    logAuditEvent(req, 'contact_submitted', true, undefined, {
      submissionId,
      emailSent,
    })

    return apiSuccess(
      {
        message: 'Message sent successfully',
        id: submissionId,
        emailSent,
      },
      201
    )
  } catch (error) {
    console.error('Contact form error:', error)
    logAuditEvent(req, 'contact_error', false, undefined, {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return apiError('Failed to submit message', 500)
  }
}

// =============================================================================
// GET - Fetch contact submissions (admin only)
// =============================================================================

export async function GET(req: NextRequest) {
  try {
    // Auth check
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      logAuditEvent(req, 'contact_list_unauthorized', false)
      return apiError('Unauthorized', 401)
    }

    // Rate limiting for admin
    const rateLimit = await checkRateLimit(req, 'admin')
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.resetIn)
    }

    // Parse query params
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    // Build filter
    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (priority) where.priority = priority

    // Fetch submissions with pagination
    const [submissions, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contactSubmission.count({ where }),
    ])

    logAuditEvent(req, 'contact_list_fetched', true, session.user.id)

    return apiSuccess({
      submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching contact submissions:', error)
    return apiError('Failed to fetch submissions', 500)
  }
}

// =============================================================================
// HELPERS
// =============================================================================

function determinePriority(subject: string, message: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
  const urgentKeywords = ['urgent', 'asap', 'emergency', 'immediately', 'critical']
  const highKeywords = ['job', 'opportunity', 'collaboration', 'partnership', 'business']

  const text = `${subject} ${message}`.toLowerCase()

  if (urgentKeywords.some((keyword) => text.includes(keyword))) {
    return 'URGENT'
  }

  if (highKeywords.some((keyword) => text.includes(keyword))) {
    return 'HIGH'
  }

  return 'MEDIUM'
}

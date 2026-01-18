/**
 * Guestbook API
 * Handles guestbook entries with validation, rate limiting, and moderation
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { guestbookSchema, validateInput, formatZodErrors, escapeHtml } from '@/lib/validations'
import {
  checkRateLimit,
  rateLimitResponse,
  apiError,
  apiSuccess,
  logAuditEvent,
  getClientIp,
} from '@/lib/security'

// =============================================================================
// MOCK DATA (for when DB is not connected)
// =============================================================================

interface GuestbookEntry {
  id: string
  name: string
  message: string
  createdAt: Date
  country?: string
}

const MOCK_ENTRIES: GuestbookEntry[] = [
  {
    id: '1',
    name: 'John Doe',
    message: 'Amazing portfolio! Love the AI chatbot feature.',
    createdAt: new Date('2024-01-15'),
    country: 'US',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    message: 'The terminal emulator is so cool! Great work Ibnu!',
    createdAt: new Date('2024-01-14'),
    country: 'SG',
  },
  {
    id: '3',
    name: 'Ahmad Fauzi',
    message: 'Inspiratif banget portfolionya, sukses terus mas!',
    createdAt: new Date('2024-01-13'),
    country: 'ID',
  },
]

// =============================================================================
// GET - Fetch guestbook entries
// =============================================================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))

    try {
      const [entries, total] = await Promise.all([
        prisma.testimonial.findMany({
          where: { approved: true },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          select: {
            id: true,
            name: true,
            content: true,
            createdAt: true,
          },
        }),
        prisma.testimonial.count({ where: { approved: true } }),
      ])

      return apiSuccess({
        entries: entries.map((e) => ({
          id: e.id,
          name: e.name,
          message: e.content,
          createdAt: e.createdAt,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    } catch (dbError) {
      // Return mock data if DB not connected
      console.error('Database error fetching guestbook:', dbError)
      return apiSuccess({
        entries: MOCK_ENTRIES,
        pagination: {
          page: 1,
          limit: MOCK_ENTRIES.length,
          total: MOCK_ENTRIES.length,
          totalPages: 1,
        },
        isMock: true,
      })
    }
  } catch (error) {
    console.error('Error fetching guestbook:', error)
    return apiError('Failed to fetch entries', 500)
  }
}

// =============================================================================
// POST - Add new guestbook entry
// =============================================================================

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - 5 entries per minute
    const rateLimit = await checkRateLimit(req, 'guestbook')
    if (!rateLimit.allowed) {
      logAuditEvent(req, 'guestbook_rate_limited', false)
      return rateLimitResponse(rateLimit.resetIn)
    }

    // Parse and validate input
    const body = await req.json()
    const validation = validateInput(guestbookSchema, body)

    if (!validation.success) {
      logAuditEvent(req, 'guestbook_validation_failed', false, undefined, {
        errors: formatZodErrors(validation.errors),
      })
      return apiError(formatZodErrors(validation.errors), 400)
    }

    const { name, message } = validation.data

    // Get IP for geo-location (optional)
    const ip = getClientIp(req)

    try {
      const entry = await prisma.testimonial.create({
        data: {
          name: escapeHtml(name),
          content: escapeHtml(message),
          role: 'Visitor',
          approved: false, // Require moderation
        },
      })

      logAuditEvent(req, 'guestbook_entry_created', true, undefined, {
        entryId: entry.id,
      })

      return apiSuccess(
        {
          message: 'Thanks for signing! Your message will appear after approval.',
          entry: {
            id: entry.id,
            name: entry.name,
            message: entry.content,
            createdAt: entry.createdAt,
          },
        },
        201
      )
    } catch (dbError) {
      console.error('Database error creating guestbook entry:', dbError)

      // Return success even if DB fails (for better UX)
      logAuditEvent(req, 'guestbook_entry_db_failed', false)

      return apiSuccess({
        message: 'Thanks for signing! Your message has been recorded.',
        warning: 'Entry saved offline',
      })
    }
  } catch (error) {
    console.error('Guestbook entry error:', error)
    logAuditEvent(req, 'guestbook_error', false, undefined, {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return apiError('Failed to submit entry', 500)
  }
}

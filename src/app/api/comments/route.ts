/**
 * Comments API
 * Handles blog post comments with validation, rate limiting, and spam protection
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { commentSchema, validateInput, formatZodErrors, escapeHtml } from '@/lib/validations'
import {
  checkRateLimit,
  rateLimitResponse,
  apiError,
  apiSuccess,
  logAuditEvent,
  getClientIp,
} from '@/lib/security'

// =============================================================================
// GET - Fetch comments for a post
// =============================================================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return apiError('Post ID required', 400)
    }

    // Validate postId format (basic sanitization)
    if (!/^[\w-]+$/.test(postId)) {
      return apiError('Invalid post ID format', 400)
    }

    try {
      const comments = await prisma.comment.findMany({
        where: {
          postId,
          parentId: null, // Only top-level comments
        },
        include: {
          replies: {
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      return apiSuccess({ comments })
    } catch (dbError) {
      // Database not available, return empty
      console.error('Database error fetching comments:', dbError)
      return apiSuccess({ comments: [] })
    }
  } catch (error) {
    console.error('Error fetching comments:', error)
    return apiError('Failed to fetch comments', 500)
  }
}

// =============================================================================
// POST - Create a new comment
// =============================================================================

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - 10 comments per minute
    const rateLimit = await checkRateLimit(req, 'comment')
    if (!rateLimit.allowed) {
      logAuditEvent(req, 'comment_rate_limited', false)
      return rateLimitResponse(rateLimit.resetIn)
    }

    // Parse and validate input
    const body = await req.json()
    const validation = validateInput(commentSchema, body)

    if (!validation.success) {
      logAuditEvent(req, 'comment_validation_failed', false, undefined, {
        errors: formatZodErrors(validation.errors),
      })
      return apiError(formatZodErrors(validation.errors), 400)
    }

    const { postId, postSlug, parentId, name, email, content } = validation.data

    // Additional spam check with scoring
    const spamScore = calculateSpamScore(content, name)
    if (spamScore > 5) {
      logAuditEvent(req, 'comment_spam_detected', false, undefined, {
        spamScore,
      })
      return apiError('Comment flagged as spam', 400)
    }

    // Get IP for tracking
    const ip = getClientIp(req)

    try {
      const comment = await prisma.comment.create({
        data: {
          postId,
          postSlug: postSlug || postId,
          parentId: parentId || null,
          name: escapeHtml(name),
          email: email.toLowerCase(),
          content: escapeHtml(content),
          likes: 0,
          ip,
          approved: spamScore < 2, // Auto-approve low spam score
        },
      })

      logAuditEvent(req, 'comment_created', true, undefined, {
        commentId: comment.id,
        postId,
        spamScore,
        autoApproved: spamScore < 2,
      })

      return apiSuccess(
        {
          comment: {
            ...comment,
            email: undefined, // Don't expose email
            ip: undefined, // Don't expose IP
          },
          message: spamScore < 2
            ? 'Comment posted successfully'
            : 'Comment submitted for review',
        },
        201
      )
    } catch (dbError) {
      console.error('Database error creating comment:', dbError)
      return apiError('Database not available', 503)
    }
  } catch (error) {
    console.error('Error creating comment:', error)
    logAuditEvent(req, 'comment_error', false, undefined, {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return apiError('Failed to create comment', 500)
  }
}

// =============================================================================
// HELPERS
// =============================================================================

function calculateSpamScore(content: string, name: string): number {
  let score = 0

  // Check for spam patterns
  const spamPatterns = [
    { pattern: /\b(viagra|cialis|casino|lottery|winner|prize|free money)\b/i, score: 10 },
    { pattern: /(http|https):\/\/[^\s]+/g, score: 2 }, // URLs
    { pattern: /<[^>]+>/g, score: 5 }, // HTML tags
    { pattern: /\b(buy now|click here|limited time|act now)\b/i, score: 3 },
    { pattern: /(.)\1{4,}/g, score: 2 }, // Repeated characters
    { pattern: /[A-Z]{5,}/g, score: 1 }, // Excessive caps
    { pattern: /\$\d+/g, score: 2 }, // Money amounts
    { pattern: /\b(crypto|bitcoin|investment|profit)\b/i, score: 1 }, // Crypto spam
  ]

  for (const { pattern, score: patternScore } of spamPatterns) {
    if (pattern.test(content)) {
      score += patternScore
    }
  }

  // Check name
  if (/\d{3,}/.test(name)) score += 2 // Numbers in name
  if (name.length < 2) score += 3 // Too short name
  if (/^[A-Z]+$/.test(name)) score += 2 // All caps name

  // Check content length
  if (content.length < 10) score += 2 // Too short
  if (content.length > 2000) score += 1 // Too long

  return score
}

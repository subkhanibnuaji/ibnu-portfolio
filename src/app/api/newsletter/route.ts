/**
 * Newsletter API
 * Handles newsletter subscriptions with validation, rate limiting, and welcome email
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { newsletterSchema, validateInput, formatZodErrors } from '@/lib/validations'
import {
  checkRateLimit,
  rateLimitResponse,
  apiError,
  apiSuccess,
  logAuditEvent,
} from '@/lib/security'

// =============================================================================
// POST - Subscribe to newsletter
// =============================================================================

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - 2 requests per minute
    const rateLimit = await checkRateLimit(req, 'newsletter')
    if (!rateLimit.allowed) {
      logAuditEvent(req, 'newsletter_rate_limited', false)
      return rateLimitResponse(rateLimit.resetIn)
    }

    // Parse and validate input
    const body = await req.json()
    const validation = validateInput(newsletterSchema, body)

    if (!validation.success) {
      logAuditEvent(req, 'newsletter_validation_failed', false, undefined, {
        errors: formatZodErrors(validation.errors),
      })
      return apiError(formatZodErrors(validation.errors), 400)
    }

    const { email } = validation.data

    // Check existing subscription
    let isNew = true
    try {
      const existing = await prisma.newsletterSubscriber.findUnique({
        where: { email },
      })

      if (existing) {
        if (existing.status === 'UNSUBSCRIBED') {
          // Re-subscribe
          await prisma.newsletterSubscriber.update({
            where: { email },
            data: {
              status: 'ACTIVE',
              confirmedAt: new Date(),
              unsubscribedAt: null,
            },
          })
          isNew = false
        } else {
          // Already subscribed
          return apiSuccess({
            message: 'You are already subscribed!',
            alreadySubscribed: true,
          })
        }
      } else {
        // Create new subscriber
        await prisma.newsletterSubscriber.create({
          data: {
            email,
            status: 'ACTIVE',
            source: 'website',
          },
        })
      }
    } catch (dbError) {
      console.error('Database error for newsletter:', dbError)
      // Continue anyway - try to send welcome email
    }

    // Send welcome email
    let welcomeEmailSent = false
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)

        const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://heyibnu.com'

        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'Ibnu Aji <noreply@heyibnu.com>',
          to: email,
          subject: 'Welcome to my newsletter! 🎉',
          html: generateWelcomeEmail(email, siteUrl),
        })

        welcomeEmailSent = true
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError)
      }
    }

    logAuditEvent(req, 'newsletter_subscribed', true, undefined, {
      email: email.substring(0, 3) + '***',
      isNew,
      welcomeEmailSent,
    })

    return apiSuccess(
      {
        message: isNew ? 'Successfully subscribed!' : 'Welcome back! You have been re-subscribed.',
        welcomeEmailSent,
      },
      201
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    logAuditEvent(req, 'newsletter_error', false, undefined, {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return apiError('Failed to subscribe', 500)
  }
}

// =============================================================================
// DELETE - Unsubscribe from newsletter
// =============================================================================

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
      return apiError('Email is required', 400)
    }

    // Validate email format
    const validation = validateInput(newsletterSchema, { email })
    if (!validation.success) {
      return apiError('Invalid email format', 400)
    }

    try {
      const subscriber = await prisma.newsletterSubscriber.findUnique({
        where: { email: validation.data.email },
      })

      if (!subscriber) {
        return apiError('Email not found', 404)
      }

      await prisma.newsletterSubscriber.update({
        where: { email: validation.data.email },
        data: {
          status: 'UNSUBSCRIBED',
          unsubscribedAt: new Date(),
        },
      })
    } catch (dbError) {
      console.error('Database error for unsubscribe:', dbError)
      return apiError('Failed to unsubscribe', 500)
    }

    logAuditEvent(req, 'newsletter_unsubscribed', true)

    return apiSuccess({
      message: 'Successfully unsubscribed',
    })
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return apiError('Failed to unsubscribe', 500)
  }
}

// =============================================================================
// HELPERS
// =============================================================================

function generateWelcomeEmail(email: string, siteUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to My Newsletter!</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0f; color: #ffffff; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a2e; border-radius: 16px; padding: 40px; border: 1px solid rgba(0, 212, 255, 0.2);">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; margin: 0 auto 16px; background: linear-gradient(135deg, #00d4ff, #a855f7); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 40px;">🚀</span>
      </div>
      <h1 style="color: #00d4ff; margin: 0; font-size: 28px; font-weight: 700;">Welcome Aboard!</h1>
    </div>

    <!-- Content -->
    <p style="line-height: 1.7; color: #e0e0e0; font-size: 16px;">
      Thank you for subscribing to my newsletter! I'm thrilled to have you join this community of tech enthusiasts, AI researchers, and blockchain innovators.
    </p>

    <p style="line-height: 1.7; color: #e0e0e0; font-size: 16px;">
      Here's what you can expect:
    </p>

    <ul style="color: #e0e0e0; line-height: 2; font-size: 16px; padding-left: 20px;">
      <li>🤖 <strong style="color: #00d4ff;">AI Insights</strong> - Latest trends in AI and machine learning</li>
      <li>⛓️ <strong style="color: #a855f7;">Blockchain Updates</strong> - Web3, DeFi, and crypto analysis</li>
      <li>🔐 <strong style="color: #00ff88;">Security Tips</strong> - Cybersecurity best practices</li>
      <li>💡 <strong style="color: #f7931a;">Project Updates</strong> - New tools and projects I'm building</li>
      <li>📚 <strong style="color: #00d4ff;">Learning Resources</strong> - Curated tutorials and guides</li>
    </ul>

    <!-- CTA Button -->
    <div style="margin-top: 32px; text-align: center;">
      <a href="${siteUrl}/blog" style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #a855f7); color: #000; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Read Latest Articles
      </a>
    </div>

    <!-- Social Links -->
    <div style="margin-top: 32px; text-align: center;">
      <p style="color: #888; font-size: 14px; margin-bottom: 12px;">Connect with me:</p>
      <a href="https://github.com/subkhanibnuaji" style="color: #00d4ff; text-decoration: none; margin: 0 8px;">GitHub</a>
      <span style="color: #444;">•</span>
      <a href="https://linkedin.com/in/subkhanibnuaji" style="color: #00d4ff; text-decoration: none; margin: 0 8px;">LinkedIn</a>
      <span style="color: #444;">•</span>
      <a href="https://twitter.com/subkhanibnuaji" style="color: #00d4ff; text-decoration: none; margin: 0 8px;">Twitter</a>
    </div>

    <!-- Signature -->
    <p style="margin-top: 32px; line-height: 1.6; color: #e0e0e0;">
      Best regards,<br>
      <strong style="color: #00d4ff;">Ibnu Aji</strong><br>
      <span style="color: #888; font-size: 14px;">AI Researcher & Blockchain Developer</span>
    </p>

    <!-- Footer -->
    <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 32px 0;">

    <p style="text-align: center; color: #666; font-size: 12px; line-height: 1.6;">
      You're receiving this email because you subscribed at ${siteUrl}<br>
      <a href="${siteUrl}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #666;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>
  `.trim()
}

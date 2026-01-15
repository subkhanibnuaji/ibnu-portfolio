import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Save to database (will fail gracefully if DB not connected)
    try {
      // Check if already subscribed
      const existing = await prisma.newsletterSubscriber.findUnique({
        where: { email },
      })

      if (existing) {
        if (existing.status === 'UNSUBSCRIBED') {
          // Re-subscribe
          await prisma.newsletterSubscriber.update({
            where: { email },
            data: { status: 'ACTIVE' },
          })
        } else {
          return NextResponse.json(
            { message: 'Already subscribed' },
            { status: 200 }
          )
        }
      } else {
        // Create new subscriber
        await prisma.newsletterSubscriber.create({
          data: {
            email,
            status: 'ACTIVE',
          },
        })
      }
    } catch (dbError) {
      console.log('Database not connected, subscription not saved:', dbError)
      // Continue anyway - the email is still collected in logs
    }

    // Send welcome email if Resend is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)

        await resend.emails.send({
          from: 'Ibnu Aji <noreply@heyibnu.com>',
          to: email,
          subject: 'Welcome to my newsletter!',
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome!</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 12px; padding: 32px; border: 1px solid #333;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="color: #00d9ff; margin: 0; font-size: 24px;">Welcome aboard!</h1>
    </div>

    <p style="line-height: 1.6; color: #ccc;">
      Thanks for subscribing to my newsletter! You'll receive updates about:
    </p>

    <ul style="color: #ccc; line-height: 1.8;">
      <li>New blog articles and tutorials</li>
      <li>Project updates and case studies</li>
      <li>Tech insights on AI, Web3, and more</li>
      <li>Career tips and industry perspectives</li>
    </ul>

    <div style="margin-top: 24px; text-align: center;">
      <a href="https://heyibnu.com/blog" style="display: inline-block; background: linear-gradient(135deg, #00d9ff, #a855f7); color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Read Latest Articles
      </a>
    </div>

    <p style="margin-top: 24px; line-height: 1.6; color: #ccc;">
      Best regards,<br>
      <strong style="color: #00d9ff;">Ibnu Aji</strong>
    </p>

    <hr style="border: none; border-top: 1px solid #333; margin: 24px 0;">

    <p style="text-align: center; color: #666; font-size: 12px;">
      You can unsubscribe at any time by clicking <a href="https://heyibnu.com/unsubscribe?email=${email}" style="color: #00d9ff;">here</a>.
    </p>
  </div>
</body>
</html>
          `,
        })
      } catch (emailError) {
        console.log('Failed to send welcome email:', emailError)
      }
    }

    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}

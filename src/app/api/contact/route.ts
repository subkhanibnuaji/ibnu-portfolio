import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { sendContactNotification } from '@/lib/email'

// POST submit contact form
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Save to database (will fail gracefully if DB not connected)
    let submissionId = null
    try {
      const submission = await prisma.contactSubmission.create({
        data: {
          name,
          email,
          subject: subject || 'General Inquiry',
          message,
          ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          userAgent: req.headers.get('user-agent'),
        },
      })
      submissionId = submission.id
    } catch (dbError) {
      console.log('Database not connected, skipping save:', dbError)
    }

    // Send email notifications (will fail gracefully if Resend not configured)
    const emailResult = await sendContactNotification({
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
    })

    if (!emailResult.success) {
      console.log('Email not sent:', emailResult.error)
    }

    return NextResponse.json(
      {
        message: 'Message sent successfully',
        id: submissionId,
        emailSent: emailResult.success
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return NextResponse.json(
      { error: 'Failed to submit message' },
      { status: 500 }
    )
  }
}

// GET all contact submissions (admin only)
export async function GET() {
  try {
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Error fetching contact submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}

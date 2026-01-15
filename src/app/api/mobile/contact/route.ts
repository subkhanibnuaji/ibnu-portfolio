import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message, category } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get client info
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'mobile-app'

    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        subject: subject || 'Mobile App Contact',
        message,
        category: category || 'mobile-inquiry',
        ip,
        userAgent,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! I will get back to you soon.',
      data: {
        id: submission.id,
        createdAt: submission.createdAt,
      },
    })
  } catch (error) {
    console.error('Error submitting contact:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}

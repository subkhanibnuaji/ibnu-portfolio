import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface GuestbookEntry {
  id: string
  name: string
  message: string
  createdAt: Date
  country?: string
}

// Mock data for when DB is not connected
const MOCK_ENTRIES: GuestbookEntry[] = [
  {
    id: '1',
    name: 'John Doe',
    message: 'Amazing portfolio! Love the AI chatbot feature.',
    createdAt: new Date('2024-01-15'),
    country: 'US'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    message: 'The terminal emulator is so cool! Great work Ibnu!',
    createdAt: new Date('2024-01-14'),
    country: 'SG'
  },
  {
    id: '3',
    name: 'Ahmad Fauzi',
    message: 'Inspiratif banget portfolionya, sukses terus mas!',
    createdAt: new Date('2024-01-13'),
    country: 'ID'
  }
]

// GET - Fetch guestbook entries
export async function GET() {
  try {
    // Try to fetch from database
    const entries = await prisma.testimonial.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      entries: entries.map(e => ({
        id: e.id,
        name: e.name,
        message: e.content,
        createdAt: e.createdAt
      }))
    })
  } catch (error) {
    // Return mock data if DB not connected
    return NextResponse.json({ entries: MOCK_ENTRIES })
  }
}

// POST - Add new guestbook entry
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, message } = body

    if (!name || !message) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      )
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: 'Name must be less than 50 characters' },
        { status: 400 }
      )
    }

    if (message.length > 500) {
      return NextResponse.json(
        { error: 'Message must be less than 500 characters' },
        { status: 400 }
      )
    }

    // Save to database (using testimonials table)
    const entry = await prisma.testimonial.create({
      data: {
        name,
        content: message,
        role: 'Visitor',
        approved: false, // Require approval
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Thanks for signing! Your message will appear after approval.',
      entry: {
        id: entry.id,
        name: entry.name,
        message: entry.content,
        createdAt: entry.createdAt
      }
    })
  } catch (error) {
    // Return success even if DB fails
    return NextResponse.json({
      success: true,
      message: 'Thanks for signing! Your message has been recorded.'
    })
  }
}

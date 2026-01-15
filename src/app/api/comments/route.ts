import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch comments for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
    }

    // Try to fetch from database
    try {
      const comments = await prisma.comment.findMany({
        where: {
          postId,
          parentId: null // Only top-level comments
        },
        include: {
          replies: {
            orderBy: { createdAt: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({ comments })
    } catch (dbError) {
      // Database not available, return empty
      return NextResponse.json({ comments: [] })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, postSlug, parentId, name, email, content } = body

    // Validation
    if (!postId || !name || !email || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Basic spam check
    const spamPatterns = [
      /\b(viagra|cialis|casino|lottery|winner|prize)\b/i,
      /(http|https):\/\/[^\s]+/g // URLs
    ]

    const isSpam = spamPatterns.some(pattern => pattern.test(content))
    if (isSpam) {
      return NextResponse.json(
        { error: 'Comment flagged as spam' },
        { status: 400 }
      )
    }

    try {
      const comment = await prisma.comment.create({
        data: {
          postId,
          postSlug,
          parentId: parentId || null,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          content: content.trim(),
          likes: 0
        }
      })

      return NextResponse.json({
        success: true,
        comment
      })
    } catch (dbError) {
      // Database not available
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}

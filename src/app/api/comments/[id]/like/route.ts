import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST - Like a comment
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Comment ID required' },
        { status: 400 }
      )
    }

    try {
      const comment = await prisma.comment.update({
        where: { id },
        data: {
          likes: { increment: 1 }
        }
      })

      return NextResponse.json({
        success: true,
        likes: comment.likes
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
      { error: 'Failed to like comment' },
      { status: 500 }
    )
  }
}

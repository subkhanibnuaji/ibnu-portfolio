import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Add or remove a reaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemId, itemType, reactionType, action } = body

    if (!itemId || !itemType || !reactionType || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For now, we'll track reactions in localStorage on the client
    // This API is a placeholder for future database-backed reactions

    // If you want to store in database, you could create a Reaction model:
    // model Reaction {
    //   id        String @id @default(cuid())
    //   itemId    String
    //   itemType  String // post, project, comment
    //   type      String // like, love, star, sparkle
    //   visitorId String?
    //   createdAt DateTime @default(now())
    // }

    // For blog posts, we can increment the views as a simple like counter
    if (itemType === 'post') {
      try {
        if (action === 'add') {
          await prisma.blogPost.update({
            where: { id: itemId },
            data: { views: { increment: 1 } }
          })
        }
      } catch (dbError) {
        // Database not available, continue silently
      }
    }

    return NextResponse.json({
      success: true,
      action,
      itemId,
      itemType,
      reactionType
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process reaction' },
      { status: 500 }
    )
  }
}

// GET - Get reactions for an item
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')
    const itemType = searchParams.get('itemType')

    if (!itemId || !itemType) {
      return NextResponse.json(
        { error: 'Missing itemId or itemType' },
        { status: 400 }
      )
    }

    // Return placeholder data
    // In a full implementation, you'd query the Reaction model
    return NextResponse.json({
      reactions: {
        like: 0,
        love: 0,
        star: 0,
        sparkle: 0
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reactions' },
      { status: 500 }
    )
  }
}

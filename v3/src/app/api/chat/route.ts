import { NextRequest, NextResponse } from 'next/server'
import { streamChatResponse, type ChatMessage } from '@/lib/ai/claude'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages } = body as { messages: ChatMessage[] }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Create a TransformStream for streaming response
    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()

    // Start streaming in the background
    ;(async () => {
      try {
        await streamChatResponse(messages, async (chunk) => {
          await writer.write(
            encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
          )
        })
        await writer.write(encoder.encode('data: [DONE]\n\n'))
      } catch (error) {
        console.error('Streaming error:', error)
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`
          )
        )
      } finally {
        await writer.close()
      }
    })()

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}

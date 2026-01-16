/**
 * AI Agent API Endpoint
 * File: app/api/ai/agent/route.ts
 *
 * Handles AI agent queries with tool execution.
 * Isolated endpoint - no dependencies on other API routes.
 */

import { NextRequest } from 'next/server';
import { runAgent, getToolsList } from '@/lib/ai/agent';
import {
  AI_DEFAULTS,
  AI_ERRORS,
  AI_FEATURES,
  type GroqModelId,
  type AIMessage,
} from '@/lib/ai/config';
import { isValidModel } from '@/lib/ai/langchain';

// ============================================
// CONFIGURATION
// ============================================

export const runtime = 'edge';
export const maxDuration = 60;

// ============================================
// POST - Agent Query
// ============================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, model = AI_DEFAULTS.model, maxIterations = 5 } = body as {
      messages?: AIMessage[];
      model?: string;
      maxIterations?: number;
    };

    // Validate API key
    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: AI_ERRORS.API_KEY_MISSING }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate model
    if (!isValidModel(model)) {
      return new Response(
        JSON.stringify({ error: AI_ERRORS.INVALID_MODEL }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const agentStream = runAgent(
            messages,
            model as GroqModelId,
            Math.min(maxIterations, 10) // Cap at 10 iterations
          );

          for await (const event of agentStream) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
            );
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Agent Error:', error);
          const errorMessage =
            error instanceof Error ? error.message : AI_ERRORS.STREAM_ERROR;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'error', error: errorMessage })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Agent API Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// ============================================
// GET - Health check and info
// ============================================

export async function GET() {
  const hasApiKey = !!process.env.GROQ_API_KEY;

  return new Response(
    JSON.stringify({
      status: hasApiKey ? 'ready' : 'missing_api_key',
      endpoint: '/api/ai/agent',
      method: 'POST',
      description: 'AI Agent with Tool Execution',
      features: AI_FEATURES.agent,
      tools: getToolsList(),
      params: {
        messages: 'AIMessage[] - Conversation history',
        model: 'string - Model ID (optional)',
        maxIterations: 'number - Max tool iterations (default: 5, max: 10)',
      },
      note: hasApiKey
        ? 'API is ready to use'
        : 'Set GROQ_API_KEY environment variable',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

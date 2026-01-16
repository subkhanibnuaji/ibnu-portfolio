/**
 * AI Chat API Endpoint
 * File: app/api/ai/chat/route.ts
 *
 * Handles chat requests with streaming support.
 * Isolated endpoint - no dependencies on other API routes.
 */

import { NextRequest } from 'next/server';
import {
  streamChatResponse,
  isValidModel,
  getAvailableModels,
} from '@/lib/ai/langchain';
import {
  AI_DEFAULTS,
  AI_ERRORS,
  SYSTEM_PROMPTS,
  type GroqModelId,
  type AIMessage,
} from '@/lib/ai/config';

// ============================================
// CONFIGURATION
// ============================================

export const runtime = 'edge';
export const maxDuration = 60;

// ============================================
// POST - Chat with streaming
// ============================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages,
      model = AI_DEFAULTS.model,
      systemPrompt = SYSTEM_PROMPTS.chat,
    } = body as {
      messages: AIMessage[];
      model?: string;
      systemPrompt?: string;
    };

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

    // Check API key
    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: AI_ERRORS.API_KEY_MISSING }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const responseStream = streamChatResponse(
            messages,
            model as GroqModelId,
            systemPrompt
          );

          for await (const chunk of responseStream) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
            );
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('AI Chat Error:', error);
          const errorMessage =
            error instanceof Error ? error.message : AI_ERRORS.STREAM_ERROR;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
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
    console.error('AI Chat API Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// ============================================
// GET - Health check and models list
// ============================================

export async function GET() {
  const hasApiKey = !!process.env.GROQ_API_KEY;
  const models = getAvailableModels();

  return new Response(
    JSON.stringify({
      status: hasApiKey ? 'ready' : 'missing_api_key',
      endpoint: '/api/ai/chat',
      method: 'POST',
      description: 'AI Chat with streaming support',
      provider: 'Groq (Free)',
      models,
      defaultModel: AI_DEFAULTS.model,
      requestFormat: {
        messages: [
          { role: 'user', content: 'string' },
          { role: 'assistant', content: 'string' },
        ],
        model: 'optional: model id',
        systemPrompt: 'optional: custom system prompt',
      },
      responseFormat: 'Server-Sent Events (SSE)',
      note: hasApiKey
        ? 'API is ready to use'
        : 'Set GROQ_API_KEY environment variable. Get free key at console.groq.com',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

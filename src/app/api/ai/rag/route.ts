/**
 * AI RAG (Retrieval Augmented Generation) API Endpoint
 * File: app/api/ai/rag/route.ts
 *
 * Handles RAG queries with document context.
 * Isolated endpoint - no dependencies on other API routes.
 */

import { NextRequest } from 'next/server';
import { streamRAGResponse, isValidModel } from '@/lib/ai/langchain';
import {
  processDocument,
  addDocumentToStore,
  removeDocumentFromStore,
  clearSessionStore,
  getRAGContext,
} from '@/lib/ai/rag';
import {
  AI_DEFAULTS,
  AI_ERRORS,
  AI_FEATURES,
  type GroqModelId,
  type AIMessage,
} from '@/lib/ai/config';

// ============================================
// CONFIGURATION
// ============================================

export const runtime = 'edge';
export const maxDuration = 60;

// ============================================
// POST - RAG Query
// ============================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages,
      sessionId,
      model = AI_DEFAULTS.model,
      action = 'query',
      document,
      documentId,
    } = body as {
      messages?: AIMessage[];
      sessionId: string;
      model?: string;
      action?: 'query' | 'upload' | 'remove' | 'clear';
      document?: { name: string; content: string; type: string };
      documentId?: string;
    };

    // Validate session ID
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Session ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check API key for queries
    if (action === 'query' && !process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: AI_ERRORS.API_KEY_MISSING }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle different actions
    switch (action) {
      // ============================================
      // UPLOAD DOCUMENT
      // ============================================
      case 'upload': {
        if (!document) {
          return new Response(
            JSON.stringify({ error: 'Document is required for upload' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        try {
          const processedDoc = processDocument(
            document.name,
            document.content,
            document.type
          );

          addDocumentToStore(sessionId, processedDoc);

          return new Response(
            JSON.stringify({
              success: true,
              document: {
                id: processedDoc.id,
                name: processedDoc.name,
                chunks: processedDoc.chunks.length,
                size: processedDoc.metadata.size,
              },
            }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Document processing failed';
          return new Response(JSON.stringify({ error: errorMessage }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      // ============================================
      // REMOVE DOCUMENT
      // ============================================
      case 'remove': {
        if (!documentId) {
          return new Response(
            JSON.stringify({ error: 'Document ID is required for removal' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        removeDocumentFromStore(sessionId, documentId);

        return new Response(
          JSON.stringify({ success: true, removed: documentId }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      }

      // ============================================
      // CLEAR ALL DOCUMENTS
      // ============================================
      case 'clear': {
        clearSessionStore(sessionId);

        return new Response(
          JSON.stringify({ success: true, message: 'All documents cleared' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      }

      // ============================================
      // QUERY WITH RAG
      // ============================================
      case 'query':
      default: {
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Messages array is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        if (!isValidModel(model)) {
          return new Response(
            JSON.stringify({ error: AI_ERRORS.INVALID_MODEL }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        // Get latest user message for context retrieval
        const lastUserMessage = messages
          .filter((m) => m.role === 'user')
          .pop();

        if (!lastUserMessage) {
          return new Response(
            JSON.stringify({ error: 'No user message found' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        // Retrieve relevant context
        const context = getRAGContext(sessionId, lastUserMessage.content);

        // Create streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              const responseStream = streamRAGResponse(
                messages,
                context,
                model as GroqModelId
              );

              for await (const chunk of responseStream) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
                );
              }

              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            } catch (error) {
              console.error('RAG Error:', error);
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
      }
    }
  } catch (error) {
    console.error('RAG API Error:', error);
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
      endpoint: '/api/ai/rag',
      method: 'POST',
      description: 'RAG (Retrieval Augmented Generation) API',
      features: AI_FEATURES.rag,
      actions: {
        upload: {
          description: 'Upload a document for context',
          params: { sessionId: 'string', document: '{ name, content, type }' },
        },
        remove: {
          description: 'Remove a document',
          params: { sessionId: 'string', documentId: 'string' },
        },
        clear: {
          description: 'Clear all documents for session',
          params: { sessionId: 'string' },
        },
        query: {
          description: 'Query with document context',
          params: { sessionId: 'string', messages: 'AIMessage[]' },
        },
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

/**
 * Telegram Webhook API Endpoint
 * File: app/api/telegram/webhook/route.ts
 *
 * Handles incoming updates from Telegram via webhook.
 * Processes messages, commands, and callback queries.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  handleUpdate,
  getBotToken,
  type TelegramUpdate,
} from '@/lib/ai/telegram';

// ============================================
// CONFIGURATION
// ============================================

// Use nodejs runtime for better async support
export const runtime = 'nodejs';
export const maxDuration = 60; // Increase timeout for AI responses
export const dynamic = 'force-dynamic';

// ============================================
// POST - Handle incoming webhook updates
// ============================================

export async function POST(req: NextRequest) {
  console.log('[Telegram Webhook] Received request');

  try {
    // Verify bot token is configured
    const token = getBotToken();
    if (!token) {
      console.error('[Telegram Webhook] TELEGRAM_BOT_TOKEN is not configured');
      return NextResponse.json(
        { error: 'Bot not configured' },
        { status: 500 }
      );
    }

    // Parse update from Telegram
    let update: TelegramUpdate;
    try {
      update = await req.json();
      console.log('[Telegram Webhook] Update received:', JSON.stringify(update, null, 2));
    } catch (parseError) {
      console.error('[Telegram Webhook] Failed to parse request body:', parseError);
      return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
    }

    // Process update and WAIT for completion
    try {
      await handleUpdate(update);
      console.log('[Telegram Webhook] Update processed successfully');
    } catch (handleError) {
      console.error('[Telegram Webhook] Error processing update:', handleError);
      // Still return 200 to prevent Telegram from retrying
    }

    // Always return 200 OK to Telegram
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Telegram Webhook] Unexpected error:', error);
    // Still return 200 to prevent Telegram from retrying
    return NextResponse.json({ ok: true });
  }
}

// ============================================
// GET - Health check
// ============================================

export async function GET() {
  const hasToken = !!getBotToken();
  const hasGroqKey = !!process.env.GROQ_API_KEY;

  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/telegram/webhook',
    description: 'Telegram Bot Webhook Endpoint',
    configuration: {
      botToken: hasToken ? 'configured' : 'missing',
      groqApiKey: hasGroqKey ? 'configured' : 'missing',
    },
    ready: hasToken && hasGroqKey,
    note: !hasToken
      ? 'Set TELEGRAM_BOT_TOKEN environment variable'
      : !hasGroqKey
        ? 'Set GROQ_API_KEY environment variable'
        : 'Webhook is ready to receive updates',
  });
}

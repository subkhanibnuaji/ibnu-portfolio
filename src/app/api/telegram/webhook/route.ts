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

export const runtime = 'edge';
export const maxDuration = 30;

// ============================================
// POST - Handle incoming webhook updates
// ============================================

export async function POST(req: NextRequest) {
  try {
    // Verify bot token is configured
    const token = getBotToken();
    if (!token) {
      console.error('TELEGRAM_BOT_TOKEN is not configured');
      return NextResponse.json(
        { error: 'Bot not configured' },
        { status: 500 }
      );
    }

    // Optional: Verify webhook secret (recommended for production)
    const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (webhookSecret) {
      const providedSecret = req.headers.get('X-Telegram-Bot-Api-Secret-Token');
      if (providedSecret !== webhookSecret) {
        console.warn('Invalid webhook secret provided');
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    // Parse update from Telegram
    const update: TelegramUpdate = await req.json();

    // Process update asynchronously
    // We respond immediately to Telegram and process in background
    // This prevents timeout issues
    handleUpdate(update).catch((error) => {
      console.error('Error processing Telegram update:', error);
    });

    // Always return 200 OK to Telegram
    // If we return error, Telegram will retry sending the update
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook Error:', error);
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

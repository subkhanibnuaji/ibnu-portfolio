/**
 * Telegram Bot Test API
 * File: app/api/telegram/test/route.ts
 *
 * Test endpoint to verify bot configuration and send test messages.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getBotToken,
  getMe,
  getWebhookInfo,
  sendMessage,
} from '@/lib/ai/telegram';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Test bot configuration
export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    tests: {},
  };

  // Test 1: Check environment variables
  const token = getBotToken();
  const groqKey = process.env.GROQ_API_KEY;

  results.tests = {
    ...results.tests as object,
    envVars: {
      TELEGRAM_BOT_TOKEN: token ? `configured (${token.substring(0, 10)}...)` : 'MISSING',
      GROQ_API_KEY: groqKey ? `configured (${groqKey.substring(0, 10)}...)` : 'MISSING',
    },
  };

  if (!token) {
    return NextResponse.json({
      ...results,
      status: 'error',
      message: 'TELEGRAM_BOT_TOKEN is not configured',
    });
  }

  // Test 2: Get bot info from Telegram API
  try {
    const botInfo = await getMe();
    results.tests = {
      ...results.tests as object,
      botInfo: {
        status: 'success',
        id: botInfo.id,
        username: botInfo.username,
        firstName: botInfo.first_name,
        link: `https://t.me/${botInfo.username}`,
      },
    };
  } catch (error) {
    results.tests = {
      ...results.tests as object,
      botInfo: {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }

  // Test 3: Get webhook info
  try {
    const webhookInfo = await getWebhookInfo();
    results.tests = {
      ...results.tests as object,
      webhookInfo: {
        status: 'success',
        url: webhookInfo.url || 'NOT SET',
        pendingUpdates: webhookInfo.pending_update_count,
        lastError: webhookInfo.last_error_message || null,
        lastErrorDate: webhookInfo.last_error_date
          ? new Date(webhookInfo.last_error_date * 1000).toISOString()
          : null,
      },
    };
  } catch (error) {
    results.tests = {
      ...results.tests as object,
      webhookInfo: {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }

  // Determine overall status
  const tests = results.tests as Record<string, { status?: string }>;
  const allPassed = Object.values(tests).every(
    (test) => test.status === 'success' || !test.status
  );

  return NextResponse.json({
    ...results,
    status: allPassed ? 'ok' : 'partial',
    message: allPassed
      ? 'All tests passed! Bot is ready.'
      : 'Some tests failed. Check details above.',
  });
}

// POST - Send test message
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatId, message } = body as { chatId?: number; message?: string };

    if (!chatId) {
      return NextResponse.json(
        { error: 'chatId is required' },
        { status: 400 }
      );
    }

    const testMessage = message || '🧪 Test message from IbnuGPT Bot API';

    await sendMessage(chatId, testMessage);

    return NextResponse.json({
      success: true,
      message: 'Test message sent successfully',
      chatId,
      content: testMessage,
    });
  } catch (error) {
    console.error('Test message error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

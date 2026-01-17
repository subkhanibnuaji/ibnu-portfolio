/**
 * Telegram Bot Setup API
 * File: app/api/telegram/setup/route.ts
 *
 * Handles bot setup operations like webhook management.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getBotToken,
  setWebhook,
  deleteWebhook,
  getWebhookInfo,
  getMe,
} from '@/lib/ai/telegram';

// ============================================
// CONFIGURATION
// ============================================

export const runtime = 'edge';
export const maxDuration = 30;

// ============================================
// POST - Setup/manage webhook
// ============================================

export async function POST(req: NextRequest) {
  try {
    const token = getBotToken();
    if (!token) {
      return NextResponse.json(
        {
          error: 'TELEGRAM_BOT_TOKEN is not configured',
          help: 'Set the TELEGRAM_BOT_TOKEN environment variable',
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { action, webhookUrl } = body as {
      action: 'setWebhook' | 'deleteWebhook' | 'getInfo';
      webhookUrl?: string;
    };

    switch (action) {
      case 'setWebhook': {
        if (!webhookUrl) {
          return NextResponse.json(
            { error: 'webhookUrl is required for setWebhook action' },
            { status: 400 }
          );
        }

        // Validate webhook URL
        try {
          const url = new URL(webhookUrl);
          if (url.protocol !== 'https:') {
            return NextResponse.json(
              { error: 'Webhook URL must use HTTPS' },
              { status: 400 }
            );
          }
        } catch {
          return NextResponse.json(
            { error: 'Invalid webhook URL format' },
            { status: 400 }
          );
        }

        const success = await setWebhook(webhookUrl);
        return NextResponse.json({
          success,
          message: success
            ? 'Webhook set successfully'
            : 'Failed to set webhook',
          webhookUrl,
        });
      }

      case 'deleteWebhook': {
        const success = await deleteWebhook();
        return NextResponse.json({
          success,
          message: success
            ? 'Webhook deleted successfully'
            : 'Failed to delete webhook',
        });
      }

      case 'getInfo': {
        const [webhookInfo, botInfo] = await Promise.all([
          getWebhookInfo(),
          getMe(),
        ]);

        return NextResponse.json({
          success: true,
          bot: {
            id: botInfo.id,
            username: botInfo.username,
            firstName: botInfo.first_name,
            isBot: botInfo.is_bot,
          },
          webhook: {
            url: webhookInfo.url || null,
            hasCustomCertificate: webhookInfo.has_custom_certificate,
            pendingUpdateCount: webhookInfo.pending_update_count,
            lastErrorDate: webhookInfo.last_error_date
              ? new Date(webhookInfo.last_error_date * 1000).toISOString()
              : null,
            lastErrorMessage: webhookInfo.last_error_message || null,
          },
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: setWebhook, deleteWebhook, or getInfo' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Telegram Setup Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================
// GET - Get current status
// ============================================

export async function GET() {
  try {
    const token = getBotToken();

    if (!token) {
      return NextResponse.json({
        configured: false,
        message: 'TELEGRAM_BOT_TOKEN is not configured',
        help: 'Create a bot with @BotFather on Telegram and set the token',
      });
    }

    const hasGroqKey = !!process.env.GROQ_API_KEY;

    try {
      const [webhookInfo, botInfo] = await Promise.all([
        getWebhookInfo(),
        getMe(),
      ]);

      return NextResponse.json({
        configured: true,
        ready: hasGroqKey,
        bot: {
          id: botInfo.id,
          username: botInfo.username,
          firstName: botInfo.first_name,
          link: `https://t.me/${botInfo.username}`,
        },
        webhook: {
          url: webhookInfo.url || null,
          isSet: !!webhookInfo.url,
          pendingUpdateCount: webhookInfo.pending_update_count,
          lastError: webhookInfo.last_error_message || null,
        },
        groqApiKey: hasGroqKey ? 'configured' : 'missing',
      });
    } catch (apiError) {
      console.error('Telegram API Error:', apiError);
      return NextResponse.json({
        configured: true,
        ready: false,
        error: 'Failed to connect to Telegram API. Check your bot token.',
        groqApiKey: hasGroqKey ? 'configured' : 'missing',
      });
    }
  } catch (error) {
    console.error('Setup Status Error:', error);
    return NextResponse.json(
      { error: 'Failed to get status' },
      { status: 500 }
    );
  }
}

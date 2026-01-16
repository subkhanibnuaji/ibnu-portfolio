/**
 * Telegram Bot Library - AI Chatbot Integration
 * File: lib/ai/telegram.ts
 *
 * Handles Telegram bot interactions with Groq LLM integration.
 * Supports multiple commands and AI-powered conversations.
 */

import { ChatGroq } from '@langchain/groq';
import { HumanMessage, AIMessage, SystemMessage, BaseMessage } from '@langchain/core/messages';
import { AI_MODELS, AI_DEFAULTS, type GroqModelId } from './config';

// ============================================
// TYPES
// ============================================

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramChat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  entities?: Array<{
    type: string;
    offset: number;
    length: number;
  }>;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: {
    id: string;
    from: TelegramUser;
    chat_instance: string;
    message?: TelegramMessage;
    data?: string;
  };
}

export interface TelegramInlineKeyboard {
  inline_keyboard: Array<Array<{
    text: string;
    callback_data?: string;
    url?: string;
  }>>;
}

export interface TelegramReplyKeyboard {
  keyboard: Array<Array<{
    text: string;
  }>>;
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
}

export interface TelegramConversation {
  chatId: number;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  model: GroqModelId;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory conversation storage (for demo, use Redis/DB in production)
const conversations = new Map<number, TelegramConversation>();

// ============================================
// TELEGRAM API FUNCTIONS
// ============================================

const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';

/**
 * Get bot token from environment
 */
export function getBotToken(): string | undefined {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  // Trim any whitespace that might have been added
  return token?.trim();
}

/**
 * Make API call to Telegram
 */
async function callTelegramAPI(
  method: string,
  params: Record<string, unknown>
): Promise<unknown> {
  const token = getBotToken();
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not configured');
  }

  const url = `${TELEGRAM_API_BASE}${token}/${method}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Telegram API Error:', {
        method,
        error: data.description,
        errorCode: data.error_code,
      });
      throw new Error(data.description || 'Telegram API error');
    }

    return data.result;
  } catch (error) {
    console.error('Telegram API Call Failed:', { method, error });
    throw error;
  }
}

/**
 * Send text message
 */
export async function sendMessage(
  chatId: number,
  text: string,
  options?: {
    parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
    replyMarkup?: TelegramInlineKeyboard | TelegramReplyKeyboard | { remove_keyboard: true };
    replyToMessageId?: number;
  }
): Promise<unknown> {
  return callTelegramAPI('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: options?.parseMode || 'HTML',
    reply_markup: options?.replyMarkup,
    reply_to_message_id: options?.replyToMessageId,
  });
}

/**
 * Send chat action (typing indicator)
 */
export async function sendChatAction(
  chatId: number,
  action: 'typing' | 'upload_photo' | 'record_video' = 'typing'
): Promise<void> {
  await callTelegramAPI('sendChatAction', {
    chat_id: chatId,
    action,
  });
}

/**
 * Answer callback query (for inline keyboard buttons)
 */
export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string,
  showAlert?: boolean
): Promise<void> {
  await callTelegramAPI('answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text,
    show_alert: showAlert,
  });
}

/**
 * Edit message text
 */
export async function editMessageText(
  chatId: number,
  messageId: number,
  text: string,
  options?: {
    parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
    replyMarkup?: TelegramInlineKeyboard;
  }
): Promise<unknown> {
  return callTelegramAPI('editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: options?.parseMode || 'HTML',
    reply_markup: options?.replyMarkup,
  });
}

/**
 * Set webhook URL
 */
export async function setWebhook(url: string): Promise<boolean> {
  const result = await callTelegramAPI('setWebhook', {
    url,
    allowed_updates: ['message', 'callback_query'],
  });
  return result === true;
}

/**
 * Delete webhook
 */
export async function deleteWebhook(): Promise<boolean> {
  const result = await callTelegramAPI('deleteWebhook', {
    drop_pending_updates: true,
  });
  return result === true;
}

/**
 * Get webhook info
 */
export async function getWebhookInfo(): Promise<{
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  last_error_date?: number;
  last_error_message?: string;
}> {
  const token = getBotToken();
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not configured');
  }

  const response = await fetch(`${TELEGRAM_API_BASE}${token}/getWebhookInfo`);
  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.description || 'Failed to get webhook info');
  }

  return data.result;
}

/**
 * Get bot info
 */
export async function getMe(): Promise<TelegramUser> {
  const result = await callTelegramAPI('getMe', {});
  return result as TelegramUser;
}

// ============================================
// CONVERSATION MANAGEMENT
// ============================================

/**
 * Get or create conversation for a chat
 */
export function getConversation(chatId: number): TelegramConversation {
  let conversation = conversations.get(chatId);

  if (!conversation) {
    conversation = {
      chatId,
      messages: [],
      model: AI_DEFAULTS.model,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    conversations.set(chatId, conversation);
  }

  return conversation;
}

/**
 * Add message to conversation
 */
export function addMessage(
  chatId: number,
  role: 'user' | 'assistant',
  content: string
): void {
  const conversation = getConversation(chatId);
  conversation.messages.push({ role, content });
  conversation.updatedAt = new Date();

  // Limit conversation history to last 20 messages
  if (conversation.messages.length > 20) {
    conversation.messages = conversation.messages.slice(-20);
  }
}

/**
 * Clear conversation history
 */
export function clearConversation(chatId: number): void {
  const conversation = conversations.get(chatId);
  if (conversation) {
    conversation.messages = [];
    conversation.updatedAt = new Date();
  }
}

/**
 * Change model for conversation
 */
export function setModel(chatId: number, model: GroqModelId): void {
  const conversation = getConversation(chatId);
  conversation.model = model;
  conversation.updatedAt = new Date();
}

// ============================================
// AI CHAT FUNCTIONS
// ============================================

const TELEGRAM_SYSTEM_PROMPT = `You are IbnuGPT, an AI assistant running on Telegram.
You are helpful, friendly, and conversational.

About the creator (context for relevant questions):
- Subkhan Ibnu Aji - Civil Servant at Indonesia's Ministry of Housing
- Senior Executive MBA from UGM, Bachelor in Informatics from Telkom University
- Interests: AI/ML, Blockchain/Web3, Cybersecurity
- 50+ certifications from Harvard, Stanford, Google, IBM, etc.

Guidelines:
- Keep responses concise (Telegram has character limits)
- Use simple formatting - avoid complex markdown
- Be friendly and conversational
- Respond in the same language as the user (Indonesian or English)
- If asked about code, provide short working examples
- If you don't know something, say so honestly`;

/**
 * Generate AI response for a message
 */
export async function generateResponse(
  chatId: number,
  userMessage: string
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return '⚠️ AI service is not configured. Please contact the administrator.';
  }

  const conversation = getConversation(chatId);

  // Add user message to history
  addMessage(chatId, 'user', userMessage);

  try {
    const llm = new ChatGroq({
      model: AI_MODELS.groq[conversation.model].id,
      apiKey,
      temperature: 0.7,
      maxTokens: 1024, // Shorter for Telegram
    });

    // Build message history
    const langchainMessages: BaseMessage[] = [
      new SystemMessage(TELEGRAM_SYSTEM_PROMPT),
    ];

    for (const msg of conversation.messages) {
      if (msg.role === 'user') {
        langchainMessages.push(new HumanMessage(msg.content));
      } else {
        langchainMessages.push(new AIMessage(msg.content));
      }
    }

    const response = await llm.invoke(langchainMessages);
    const assistantMessage = typeof response.content === 'string'
      ? response.content
      : response.content.toString();

    // Add assistant response to history
    addMessage(chatId, 'assistant', assistantMessage);

    return assistantMessage;
  } catch (error) {
    console.error('AI Generation Error:', error);
    return '😅 Sorry, I encountered an error. Please try again later.';
  }
}

// ============================================
// COMMAND HANDLERS
// ============================================

/**
 * Handle /start command
 */
export async function handleStart(chatId: number, user?: TelegramUser): Promise<void> {
  const name = user?.first_name || 'there';

  const welcomeMessage = `👋 <b>Hello ${name}!</b>

Welcome to <b>IbnuGPT Bot</b> - Your AI assistant powered by Groq LLMs.

🤖 <b>What I can do:</b>
• Answer questions on any topic
• Help with coding problems
• Have conversations in Indonesian or English
• Provide information and explanations

📝 <b>Commands:</b>
/start - Show this welcome message
/help - Get help and tips
/clear - Clear conversation history
/model - Change AI model
/about - About this bot

Just type any message to start chatting! 💬`;

  const keyboard: TelegramInlineKeyboard = {
    inline_keyboard: [
      [
        { text: '💬 Start Chatting', callback_data: 'action_chat' },
        { text: '📖 Help', callback_data: 'action_help' },
      ],
      [
        { text: '🔧 Change Model', callback_data: 'action_model' },
        { text: '🌐 Visit Portfolio', url: 'https://ibnuaji.my.id' },
      ],
    ],
  };

  await sendMessage(chatId, welcomeMessage, { replyMarkup: keyboard });
}

/**
 * Handle /help command
 */
export async function handleHelp(chatId: number): Promise<void> {
  const helpMessage = `📖 <b>IbnuGPT Bot Help</b>

<b>How to use:</b>
Simply type any message and I'll respond using AI!

<b>Tips:</b>
• Be specific in your questions for better answers
• Use /clear to start a fresh conversation
• Choose a different model with /model

<b>Available Commands:</b>
• /start - Welcome message
• /help - This help message
• /clear - Reset conversation
• /model - Switch AI model
• /about - Bot information

<b>Models Available:</b>
• Llama 3.3 70B - Most capable
• Llama 3.1 8B - Fastest
• Mixtral 8x7B - Great for complex tasks
• Gemma 2 9B - Efficient

<b>Example Questions:</b>
• "Explain quantum computing simply"
• "Write a Python function to sort a list"
• "Apa itu machine learning?"`;

  await sendMessage(chatId, helpMessage);
}

/**
 * Handle /about command
 */
export async function handleAbout(chatId: number): Promise<void> {
  const aboutMessage = `🤖 <b>About IbnuGPT Bot</b>

<b>Version:</b> 1.0.0
<b>Powered by:</b> Groq LLMs (Free API)
<b>Framework:</b> LangChain + Telegraf

<b>Creator:</b>
Subkhan Ibnu Aji
• Civil Servant at Ministry of Housing, Indonesia
• Senior Executive MBA, UGM
• B.Sc Informatics, Telkom University

<b>Tech Stack:</b>
• Next.js 15 + TypeScript
• LangChain for AI
• Groq API (Free)
• PostgreSQL + Prisma

<b>Links:</b>
🌐 Portfolio: ibnuaji.my.id
💻 GitHub: github.com/subkhanibnuaji

Built with ❤️ as part of AI Tools collection.`;

  const keyboard: TelegramInlineKeyboard = {
    inline_keyboard: [
      [
        { text: '🌐 Portfolio', url: 'https://ibnuaji.my.id' },
        { text: '🛠️ AI Tools', url: 'https://ibnuaji.my.id/ai-tools' },
      ],
    ],
  };

  await sendMessage(chatId, aboutMessage, { replyMarkup: keyboard });
}

/**
 * Handle /clear command
 */
export async function handleClear(chatId: number): Promise<void> {
  clearConversation(chatId);
  await sendMessage(chatId, '🗑️ Conversation history cleared!\n\nStart a new conversation by typing any message.');
}

/**
 * Handle /model command
 */
export async function handleModelSelection(chatId: number): Promise<void> {
  const conversation = getConversation(chatId);
  const currentModel = AI_MODELS.groq[conversation.model];

  const modelMessage = `🔧 <b>Select AI Model</b>

Current model: <b>${currentModel.name}</b>
${currentModel.description}

Choose a model:`;

  const keyboard: TelegramInlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: `${conversation.model === 'llama-3.3-70b-versatile' ? '✅ ' : ''}Llama 3.3 70B`,
          callback_data: 'model_llama-3.3-70b-versatile'
        },
      ],
      [
        {
          text: `${conversation.model === 'llama-3.1-8b-instant' ? '✅ ' : ''}Llama 3.1 8B (Fast)`,
          callback_data: 'model_llama-3.1-8b-instant'
        },
      ],
      [
        {
          text: `${conversation.model === 'mixtral-8x7b-32768' ? '✅ ' : ''}Mixtral 8x7B`,
          callback_data: 'model_mixtral-8x7b-32768'
        },
      ],
      [
        {
          text: `${conversation.model === 'gemma2-9b-it' ? '✅ ' : ''}Gemma 2 9B`,
          callback_data: 'model_gemma2-9b-it'
        },
      ],
    ],
  };

  await sendMessage(chatId, modelMessage, { replyMarkup: keyboard });
}

// ============================================
// CALLBACK QUERY HANDLERS
// ============================================

/**
 * Handle callback query from inline keyboard
 */
export async function handleCallbackQuery(
  callbackQueryId: string,
  chatId: number,
  data: string,
  messageId?: number
): Promise<void> {
  // Handle model selection
  if (data.startsWith('model_')) {
    const modelId = data.replace('model_', '') as GroqModelId;

    if (modelId in AI_MODELS.groq) {
      setModel(chatId, modelId);
      const model = AI_MODELS.groq[modelId];

      await answerCallbackQuery(callbackQueryId, `✅ Model changed to ${model.name}`);

      if (messageId) {
        await editMessageText(chatId, messageId,
          `✅ <b>Model Updated!</b>\n\nNow using: <b>${model.name}</b>\n${model.description}\n\nYour conversation history is preserved. Continue chatting!`
        );
      }
    } else {
      await answerCallbackQuery(callbackQueryId, '❌ Invalid model', true);
    }
    return;
  }

  // Handle action buttons
  switch (data) {
    case 'action_chat':
      await answerCallbackQuery(callbackQueryId, '💬 Just type any message to chat!');
      break;
    case 'action_help':
      await answerCallbackQuery(callbackQueryId);
      await handleHelp(chatId);
      break;
    case 'action_model':
      await answerCallbackQuery(callbackQueryId);
      await handleModelSelection(chatId);
      break;
    default:
      await answerCallbackQuery(callbackQueryId, 'Unknown action');
  }
}

// ============================================
// MAIN UPDATE HANDLER
// ============================================

/**
 * Process incoming Telegram update
 */
export async function handleUpdate(update: TelegramUpdate): Promise<void> {
  // Handle callback queries (button clicks)
  if (update.callback_query) {
    const { id, from, message, data } = update.callback_query;
    const chatId = message?.chat.id || from.id;

    if (data) {
      await handleCallbackQuery(id, chatId, data, message?.message_id);
    }
    return;
  }

  // Handle regular messages
  if (update.message) {
    const { chat, from, text } = update.message;

    if (!text) {
      // Ignore non-text messages
      return;
    }

    // Handle commands
    if (text.startsWith('/')) {
      const command = text.split(' ')[0].toLowerCase().replace('@', '');

      switch (command) {
        case '/start':
          await handleStart(chat.id, from);
          break;
        case '/help':
          await handleHelp(chat.id);
          break;
        case '/about':
          await handleAbout(chat.id);
          break;
        case '/clear':
          await handleClear(chat.id);
          break;
        case '/model':
          await handleModelSelection(chat.id);
          break;
        default:
          await sendMessage(chat.id, '❓ Unknown command. Use /help to see available commands.');
      }
      return;
    }

    // Handle regular chat message
    await sendChatAction(chat.id, 'typing');

    try {
      const response = await generateResponse(chat.id, text);
      await sendMessage(chat.id, response, { parseMode: 'HTML' });
    } catch (error) {
      console.error('Error handling message:', error);
      await sendMessage(chat.id, '😅 Sorry, something went wrong. Please try again.');
    }
  }
}

// ============================================
// EXPORTS
// ============================================

export {
  TELEGRAM_SYSTEM_PROMPT,
};

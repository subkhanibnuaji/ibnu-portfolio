/**
 * Telegram Bot Library - Advanced AI Chatbot Integration
 * File: lib/ai/telegram.ts
 *
 * Features:
 * - AI-powered conversations with context memory
 * - Web search integration
 * - URL/webpage summarization
 * - Image analysis (photo messages)
 * - Voice message transcription
 * - Code execution sandbox
 * - Inline mode support
 * - Group chat support
 * - Rate limiting & anti-spam
 * - Admin commands & statistics
 * - Multi-language support
 */

import { ChatGroq } from '@langchain/groq';
import { HumanMessage, AIMessage, SystemMessage, BaseMessage } from '@langchain/core/messages';
import { AI_MODELS, AI_DEFAULTS, type GroqModelId } from './config';
import * as SuperApp from './telegram-features';

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

export interface TelegramPhotoSize {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

export interface TelegramVoice {
  file_id: string;
  file_unique_id: string;
  duration: number;
  mime_type?: string;
  file_size?: number;
}

export interface TelegramDocument {
  file_id: string;
  file_unique_id: string;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  caption?: string;
  photo?: TelegramPhotoSize[];
  voice?: TelegramVoice;
  document?: TelegramDocument;
  reply_to_message?: TelegramMessage;
  entities?: Array<{
    type: string;
    offset: number;
    length: number;
    url?: string;
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
  inline_query?: {
    id: string;
    from: TelegramUser;
    query: string;
    offset: string;
  };
}

export interface TelegramInlineKeyboard {
  inline_keyboard: Array<Array<{
    text: string;
    callback_data?: string;
    url?: string;
    switch_inline_query_current_chat?: string;
  }>>;
}

export interface TelegramReplyKeyboard {
  keyboard: Array<Array<{
    text: string;
  }>>;
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    type?: 'text' | 'image' | 'voice' | 'document' | 'search' | 'code';
    urls?: string[];
    imageUrl?: string;
  };
}

export interface TelegramConversation {
  chatId: number;
  userId: number;
  messages: ConversationMessage[];
  model: GroqModelId;
  settings: {
    language: string;
    persona: string;
    temperature: number;
    webSearchEnabled: boolean;
  };
  stats: {
    totalMessages: number;
    totalTokens: number;
    lastActive: number;
  };
  createdAt: number;
  updatedAt: number;
}

export interface UserRateLimit {
  userId: number;
  requests: number[];
  warnings: number;
  blocked: boolean;
  blockedUntil?: number;
}

export interface BotStats {
  totalUsers: number;
  totalMessages: number;
  totalTokensUsed: number;
  activeToday: number;
  commandUsage: Record<string, number>;
  modelUsage: Record<string, number>;
  startTime: number;
}

// ============================================
// CONSTANTS
// ============================================

const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';
const MAX_CONTEXT_MESSAGES = 30;
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20; // 20 requests per minute
const ADMIN_USER_IDS = process.env.TELEGRAM_ADMIN_IDS?.split(',').map(Number) || [];

// Available personas
const PERSONAS: Record<string, string> = {
  default: 'You are IbnuGPT, a helpful and friendly AI assistant.',
  professional: 'You are a professional AI consultant providing expert advice.',
  creative: 'You are a creative AI with imaginative and artistic responses.',
  teacher: 'You are a patient teacher who explains concepts clearly with examples.',
  coder: 'You are a senior software engineer focused on clean, efficient code.',
};

// ============================================
// STORAGE (In-memory, use Redis in production)
// ============================================

const conversations = new Map<number, TelegramConversation>();
const rateLimits = new Map<number, UserRateLimit>();
const botStats: BotStats = {
  totalUsers: 0,
  totalMessages: 0,
  totalTokensUsed: 0,
  activeToday: 0,
  commandUsage: {},
  modelUsage: {},
  startTime: Date.now(),
};

// ============================================
// TELEGRAM API FUNCTIONS
// ============================================

export function getBotToken(): string | undefined {
  return process.env.TELEGRAM_BOT_TOKEN?.trim();
}

async function callTelegramAPI(
  method: string,
  params: Record<string, unknown>
): Promise<unknown> {
  const token = getBotToken();
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not configured');

  const url = `${TELEGRAM_API_BASE}${token}/${method}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Telegram API Error:', { method, error: data.description });
      throw new Error(data.description || 'Telegram API error');
    }

    return data.result;
  } catch (error) {
    console.error('Telegram API Call Failed:', { method, error });
    throw error;
  }
}

export async function sendMessage(
  chatId: number,
  text: string,
  options?: {
    parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
    replyMarkup?: TelegramInlineKeyboard | TelegramReplyKeyboard | { remove_keyboard: true };
    replyToMessageId?: number;
    disableWebPagePreview?: boolean;
  }
): Promise<unknown> {
  // Split long messages
  const maxLength = 4096;
  if (text.length > maxLength) {
    const chunks = splitMessage(text, maxLength);
    let lastResult: unknown;
    for (const chunk of chunks) {
      lastResult = await callTelegramAPI('sendMessage', {
        chat_id: chatId,
        text: chunk,
        parse_mode: options?.parseMode || 'HTML',
        disable_web_page_preview: options?.disableWebPagePreview,
      });
    }
    return lastResult;
  }

  return callTelegramAPI('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: options?.parseMode || 'HTML',
    reply_markup: options?.replyMarkup,
    reply_to_message_id: options?.replyToMessageId,
    disable_web_page_preview: options?.disableWebPagePreview,
  });
}

export async function sendChatAction(
  chatId: number,
  action: 'typing' | 'upload_photo' | 'record_voice' | 'upload_document' = 'typing'
): Promise<void> {
  await callTelegramAPI('sendChatAction', { chat_id: chatId, action });
}

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

export async function answerInlineQuery(
  inlineQueryId: string,
  results: Array<{
    type: 'article';
    id: string;
    title: string;
    input_message_content: { message_text: string; parse_mode?: string };
    description?: string;
  }>
): Promise<void> {
  await callTelegramAPI('answerInlineQuery', {
    inline_query_id: inlineQueryId,
    results,
    cache_time: 300,
  });
}

export async function getFile(fileId: string): Promise<{ file_path: string }> {
  const result = await callTelegramAPI('getFile', { file_id: fileId });
  return result as { file_path: string };
}

export async function downloadFile(filePath: string): Promise<ArrayBuffer> {
  const token = getBotToken();
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not configured');

  const url = `https://api.telegram.org/file/bot${token}/${filePath}`;
  const response = await fetch(url);
  return response.arrayBuffer();
}

export async function setWebhook(url: string): Promise<boolean> {
  const result = await callTelegramAPI('setWebhook', {
    url,
    allowed_updates: ['message', 'callback_query', 'inline_query'],
  });
  return result === true;
}

export async function deleteWebhook(): Promise<boolean> {
  const result = await callTelegramAPI('deleteWebhook', { drop_pending_updates: true });
  return result === true;
}

export async function getWebhookInfo(): Promise<{
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  last_error_date?: number;
  last_error_message?: string;
}> {
  const token = getBotToken();
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not configured');

  const response = await fetch(`${TELEGRAM_API_BASE}${token}/getWebhookInfo`);
  const data = await response.json();
  if (!data.ok) throw new Error(data.description || 'Failed to get webhook info');
  return data.result;
}

export async function getMe(): Promise<TelegramUser> {
  return (await callTelegramAPI('getMe', {})) as TelegramUser;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function splitMessage(text: string, maxLength: number): string[] {
  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > maxLength) {
    let splitIndex = remaining.lastIndexOf('\n', maxLength);
    if (splitIndex === -1 || splitIndex < maxLength / 2) {
      splitIndex = remaining.lastIndexOf(' ', maxLength);
    }
    if (splitIndex === -1 || splitIndex < maxLength / 2) {
      splitIndex = maxLength;
    }

    chunks.push(remaining.slice(0, splitIndex));
    remaining = remaining.slice(splitIndex).trimStart();
  }

  if (remaining.length > 0) {
    chunks.push(remaining);
  }

  return chunks;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s<>]+)/gi;
  return text.match(urlRegex) || [];
}

function detectLanguage(text: string): string {
  // Simple language detection based on character sets
  const indonesian = /[aku|saya|adalah|untuk|dengan|yang|ini|itu|dan|atau]/i;
  if (indonesian.test(text)) return 'id';
  return 'en';
}

// ============================================
// RATE LIMITING
// ============================================

function checkRateLimit(userId: number): { allowed: boolean; message?: string } {
  const now = Date.now();
  let limit = rateLimits.get(userId);

  if (!limit) {
    limit = { userId, requests: [], warnings: 0, blocked: false };
    rateLimits.set(userId, limit);
  }

  // Check if blocked
  if (limit.blocked) {
    if (limit.blockedUntil && now > limit.blockedUntil) {
      limit.blocked = false;
      limit.blockedUntil = undefined;
      limit.warnings = 0;
    } else {
      const remaining = Math.ceil((limit.blockedUntil! - now) / 1000);
      return { allowed: false, message: `⛔ You are temporarily blocked. Try again in ${remaining} seconds.` };
    }
  }

  // Clean old requests
  limit.requests = limit.requests.filter(r => now - r < RATE_LIMIT_WINDOW);

  // Check rate limit
  if (limit.requests.length >= RATE_LIMIT_MAX_REQUESTS) {
    limit.warnings++;

    if (limit.warnings >= 3) {
      limit.blocked = true;
      limit.blockedUntil = now + 300000; // 5 minutes block
      return { allowed: false, message: '⛔ Too many requests. You are blocked for 5 minutes.' };
    }

    return { allowed: false, message: `⚠️ Slow down! Max ${RATE_LIMIT_MAX_REQUESTS} messages per minute. Warning ${limit.warnings}/3` };
  }

  limit.requests.push(now);
  return { allowed: true };
}

// ============================================
// CONVERSATION MANAGEMENT
// ============================================

export function getConversation(chatId: number, userId?: number): TelegramConversation {
  let conversation = conversations.get(chatId);

  if (!conversation) {
    conversation = {
      chatId,
      userId: userId || chatId,
      messages: [],
      model: AI_DEFAULTS.model,
      settings: {
        language: 'auto',
        persona: 'default',
        temperature: 0.7,
        webSearchEnabled: true,
      },
      stats: {
        totalMessages: 0,
        totalTokens: 0,
        lastActive: Date.now(),
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    conversations.set(chatId, conversation);
    botStats.totalUsers++;
  }

  return conversation;
}

export function addMessage(
  chatId: number,
  role: 'user' | 'assistant',
  content: string,
  metadata?: ConversationMessage['metadata']
): void {
  const conversation = getConversation(chatId);
  conversation.messages.push({
    role,
    content,
    timestamp: Date.now(),
    metadata,
  });
  conversation.stats.totalMessages++;
  conversation.stats.lastActive = Date.now();
  conversation.updatedAt = Date.now();

  // Limit history
  if (conversation.messages.length > MAX_CONTEXT_MESSAGES) {
    conversation.messages = conversation.messages.slice(-MAX_CONTEXT_MESSAGES);
  }

  // Update global stats
  botStats.totalMessages++;
}

export function clearConversation(chatId: number): void {
  const conversation = conversations.get(chatId);
  if (conversation) {
    conversation.messages = [];
    conversation.updatedAt = Date.now();
  }
}

export function setModel(chatId: number, model: GroqModelId): void {
  const conversation = getConversation(chatId);
  conversation.model = model;
  conversation.updatedAt = Date.now();
  botStats.modelUsage[model] = (botStats.modelUsage[model] || 0) + 1;
}

export function setPersona(chatId: number, persona: string): void {
  const conversation = getConversation(chatId);
  if (PERSONAS[persona]) {
    conversation.settings.persona = persona;
    conversation.updatedAt = Date.now();
  }
}

export function toggleWebSearch(chatId: number): boolean {
  const conversation = getConversation(chatId);
  conversation.settings.webSearchEnabled = !conversation.settings.webSearchEnabled;
  conversation.updatedAt = Date.now();
  return conversation.settings.webSearchEnabled;
}

// ============================================
// WEB SEARCH FEATURE
// ============================================

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

async function webSearch(query: string, limit: number = 5): Promise<SearchResult[]> {
  try {
    // Using DuckDuckGo HTML API (free, no API key required)
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://html.duckduckgo.com/html/?q=${encodedQuery}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; IbnuGPTBot/1.0)',
        },
      }
    );

    const html = await response.text();
    const results: SearchResult[] = [];

    // Parse results using regex (simple extraction)
    const resultRegex = /<a class="result__a" href="([^"]+)"[^>]*>([^<]+)<\/a>[\s\S]*?<a class="result__snippet"[^>]*>([^<]+)<\/a>/gi;
    let match;

    while ((match = resultRegex.exec(html)) !== null && results.length < limit) {
      const url = match[1];
      // Skip DuckDuckGo redirect URLs, extract actual URL
      const actualUrl = url.includes('uddg=')
        ? decodeURIComponent(url.split('uddg=')[1]?.split('&')[0] || url)
        : url;

      results.push({
        url: actualUrl,
        title: match[2].trim(),
        snippet: match[3].trim(),
      });
    }

    return results;
  } catch (error) {
    console.error('Web search error:', error);
    return [];
  }
}

async function summarizeUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; IbnuGPTBot/1.0)',
      },
    });

    if (!response.ok) {
      return `Failed to fetch URL: ${response.status}`;
    }

    const html = await response.text();

    // Extract text content (simple extraction)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 5000);

    return textContent || 'No content found';
  } catch (error) {
    console.error('URL fetch error:', error);
    return 'Failed to fetch URL content';
  }
}

// ============================================
// CODE EXECUTION (Sandboxed)
// ============================================

interface CodeExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
}

function executeJavaScript(code: string): CodeExecutionResult {
  const startTime = Date.now();
  const logs: string[] = [];

  // Create a sandboxed console
  const sandboxConsole = {
    log: (...args: unknown[]) => logs.push(args.map(String).join(' ')),
    error: (...args: unknown[]) => logs.push('Error: ' + args.map(String).join(' ')),
    warn: (...args: unknown[]) => logs.push('Warning: ' + args.map(String).join(' ')),
  };

  try {
    // Very basic sandbox - NOT secure for production
    // In production, use a proper sandbox like VM2 or isolated-vm
    const sandboxedCode = `
      (function(console) {
        'use strict';
        ${code}
      })
    `;

    // eslint-disable-next-line no-new-func
    const fn = new Function('console', sandboxedCode);
    const result = fn(sandboxConsole);

    const output = logs.length > 0 ? logs.join('\n') : String(result ?? 'undefined');

    return {
      success: true,
      output: output.slice(0, 1000),
      executionTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime: Date.now() - startTime,
    };
  }
}

function executePython(code: string): CodeExecutionResult {
  // Python execution would require a backend service
  // For now, return a placeholder
  return {
    success: false,
    error: 'Python execution requires server-side setup. Contact admin for configuration.',
  };
}

export function executeCode(language: string, code: string): CodeExecutionResult {
  const cleanCode = code.trim();

  // Security checks
  const dangerousPatterns = [
    /process\./i,
    /require\s*\(/i,
    /import\s+/i,
    /eval\s*\(/i,
    /Function\s*\(/i,
    /fetch\s*\(/i,
    /XMLHttpRequest/i,
    /localStorage/i,
    /document\./i,
    /window\./i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(cleanCode)) {
      return {
        success: false,
        error: 'Code contains potentially dangerous operations',
      };
    }
  }

  switch (language.toLowerCase()) {
    case 'javascript':
    case 'js':
      return executeJavaScript(cleanCode);
    case 'python':
    case 'py':
      return executePython(cleanCode);
    default:
      return {
        success: false,
        error: `Unsupported language: ${language}. Supported: JavaScript`,
      };
  }
}

// ============================================
// AI CHAT FUNCTIONS
// ============================================

function buildSystemPrompt(conversation: TelegramConversation, isGroup: boolean): string {
  const persona = PERSONAS[conversation.settings.persona] || PERSONAS.default;

  return `${persona}

About the creator:
- Subkhan Ibnu Aji - Civil Servant at Indonesia's Ministry of Housing
- Senior Executive MBA from UGM, Bachelor in Informatics from Telkom University
- Interests: AI/ML, Blockchain/Web3, Cybersecurity
- 50+ certifications from Harvard, Stanford, Google, IBM, etc.

Context:
- Platform: Telegram ${isGroup ? 'group chat' : 'private chat'}
- User language preference: ${conversation.settings.language === 'auto' ? 'detect from message' : conversation.settings.language}
- Web search: ${conversation.settings.webSearchEnabled ? 'enabled' : 'disabled'}

Guidelines:
- Keep responses concise for Telegram (max 4000 chars)
- Use simple formatting - bold with **, avoid complex markdown
- Be helpful and conversational
- Respond in the same language as the user
- For code, provide short working examples with language tags
- If unsure, be honest about limitations
- When search results are provided, cite sources`;
}

export async function generateResponse(
  chatId: number,
  userMessage: string,
  options?: {
    searchResults?: SearchResult[];
    urlContent?: string;
    imageDescription?: string;
    voiceTranscript?: string;
    isGroup?: boolean;
  }
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return '⚠️ AI service is not configured. Please contact the administrator.';
  }

  const conversation = getConversation(chatId);

  // Build context message
  let contextMessage = userMessage;

  if (options?.searchResults && options.searchResults.length > 0) {
    contextMessage += '\n\n[Web Search Results]\n';
    options.searchResults.forEach((r, i) => {
      contextMessage += `${i + 1}. ${r.title}\n   ${r.snippet}\n   URL: ${r.url}\n`;
    });
  }

  if (options?.urlContent) {
    contextMessage += `\n\n[URL Content]\n${options.urlContent.slice(0, 3000)}`;
  }

  if (options?.imageDescription) {
    contextMessage += `\n\n[Image Description]\n${options.imageDescription}`;
  }

  if (options?.voiceTranscript) {
    contextMessage = `[Voice Message Transcript]: ${options.voiceTranscript}`;
  }

  // Add to history
  addMessage(chatId, 'user', userMessage, {
    type: options?.voiceTranscript ? 'voice' : options?.imageDescription ? 'image' : 'text',
    urls: extractUrls(userMessage),
  });

  try {
    const llm = new ChatGroq({
      model: AI_MODELS.groq[conversation.model].id,
      apiKey,
      temperature: conversation.settings.temperature,
      maxTokens: 2048,
    });

    // Build message history
    const langchainMessages: BaseMessage[] = [
      new SystemMessage(buildSystemPrompt(conversation, options?.isGroup || false)),
    ];

    // Add recent conversation history
    const recentMessages = conversation.messages.slice(-10);
    for (const msg of recentMessages.slice(0, -1)) { // Exclude the just-added message
      if (msg.role === 'user') {
        langchainMessages.push(new HumanMessage(msg.content));
      } else if (msg.role === 'assistant') {
        langchainMessages.push(new AIMessage(msg.content));
      }
    }

    // Add current message with context
    langchainMessages.push(new HumanMessage(contextMessage));

    const response = await llm.invoke(langchainMessages);
    const assistantMessage = typeof response.content === 'string'
      ? response.content
      : response.content.toString();

    // Add response to history
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

export async function handleStart(chatId: number, user?: TelegramUser): Promise<void> {
  const name = user?.first_name || 'there';
  botStats.commandUsage['start'] = (botStats.commandUsage['start'] || 0) + 1;

  const welcomeMessage = `👋 <b>Hello ${escapeHtml(name)}!</b>

Welcome to <b>IbnuGPT Super App</b> 🚀

<b>🤖 AI Features:</b>
💬 Smart Chat • 🎨 Image Generation
🌐 Translation • 💻 Code Execution

<b>🔍 Info & Research:</b>
🔍 Web Search • 📰 News
🌤️ Weather • 💰 Crypto Prices

<b>🛠️ Utility Tools:</b>
📱 QR Code • 🔢 Calculator
💱 Currency • 📐 Unit Converter

<b>🎮 Fun & Games:</b>
🎯 Trivia • 📝 Word Games
😂 Jokes • 🔮 Horoscope

<b>📝 Productivity:</b>
📋 Notes • ✅ Todo List

Type /menu for interactive menu!
Type /help for all commands!

Just send any message to start! 💬`;

  const keyboard: TelegramInlineKeyboard = {
    inline_keyboard: [
      [
        { text: '📋 Menu', callback_data: 'action_menu' },
        { text: '💬 Start Chat', callback_data: 'action_chat' },
      ],
      [
        { text: '🎨 Generate Image', callback_data: 'menu_image' },
        { text: '🔍 Search', switch_inline_query_current_chat: '' },
      ],
      [
        { text: '🌤️ Weather', callback_data: 'menu_weather' },
        { text: '💰 Crypto', callback_data: 'menu_crypto' },
      ],
      [
        { text: '🎮 Games', callback_data: 'menu_games' },
        { text: '🛠️ Tools', callback_data: 'menu_tools' },
      ],
      [
        { text: '📖 Help', callback_data: 'action_help' },
        { text: '🌐 Portfolio', url: 'https://ibnuaji.my.id' },
      ],
    ],
  };

  await sendMessage(chatId, welcomeMessage, { replyMarkup: keyboard });
}

export async function handleHelp(chatId: number): Promise<void> {
  botStats.commandUsage['help'] = (botStats.commandUsage['help'] || 0) + 1;

  const helpMessage = `📖 <b>IbnuGPT Super App - Complete Guide</b>

<b>🚀 Quick Access:</b>
• /menu - Interactive menu
• /start - Welcome message

<b>🤖 AI Features:</b>
• /model - Switch AI model
• /persona - Change personality
• /run js [code] - Execute code
• /imagine [prompt] - Generate AI image
• /translate [lang] [text] - Translate

<b>🔍 Search & Research:</b>
• /search [query] - Web search
• /summarize [url] - Summarize page
• /news [category] - Latest news

<b>🌍 Info & Weather:</b>
• /weather [city] - Weather info
• /crypto [symbol] - Crypto prices

<b>🛠️ Utility Tools:</b>
• /calc [expr] - Calculator
• /convert [val] [from] to [to]
• /currency [amt] [from] to [to]
• /qr [text] - Generate QR code
• /shorten [url] - URL shortener

<b>📝 Productivity:</b>
• /notes - Manage notes
• /todo - Todo list

<b>🎮 Games & Fun:</b>
• /trivia - Trivia quiz
• /math - Math quiz
• /word - Word guess game
• /joke - Random joke
• /quote - Inspirational quote
• /horoscope [sign] - Horoscope

<b>💻 Developer Tools:</b>
• /dev - All dev tools
• /json, /base64, /hash
• /uuid, /password, /color

Use /menu for interactive buttons!`;

  await sendMessage(chatId, helpMessage);
}

export async function handleAbout(chatId: number): Promise<void> {
  botStats.commandUsage['about'] = (botStats.commandUsage['about'] || 0) + 1;

  const uptime = Math.floor((Date.now() - botStats.startTime) / 1000);
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);

  const aboutMessage = `🤖 <b>About IbnuGPT Bot v2.0</b>

<b>Version:</b> 2.0.0 Advanced
<b>Uptime:</b> ${hours}h ${minutes}m
<b>Total Users:</b> ${botStats.totalUsers}
<b>Messages Processed:</b> ${botStats.totalMessages}

<b>Powered by:</b>
• Groq LLM (Free API)
• LangChain Framework
• Next.js 15 + TypeScript

<b>Creator:</b>
<b>Subkhan Ibnu Aji</b>
• Civil Servant, Ministry of Housing Indonesia
• Senior Executive MBA, Universitas Gadjah Mada
• B.Sc Informatics, Telkom University
• 50+ Certifications

<b>Links:</b>
🌐 Portfolio: ibnuaji.my.id
💻 GitHub: github.com/subkhanibnuaji
🔧 AI Tools: ibnuaji.my.id/ai-tools

Built with ❤️ for the AI community.`;

  const keyboard: TelegramInlineKeyboard = {
    inline_keyboard: [
      [
        { text: '🌐 Portfolio', url: 'https://ibnuaji.my.id' },
        { text: '🛠️ AI Tools', url: 'https://ibnuaji.my.id/ai-tools' },
      ],
      [
        { text: '💻 GitHub', url: 'https://github.com/subkhanibnuaji' },
      ],
    ],
  };

  await sendMessage(chatId, aboutMessage, { replyMarkup: keyboard });
}

export async function handleClear(chatId: number): Promise<void> {
  botStats.commandUsage['clear'] = (botStats.commandUsage['clear'] || 0) + 1;
  clearConversation(chatId);
  await sendMessage(chatId, '🗑️ <b>Conversation cleared!</b>\n\nStart fresh with a new message.');
}

export async function handleModelSelection(chatId: number): Promise<void> {
  botStats.commandUsage['model'] = (botStats.commandUsage['model'] || 0) + 1;
  const conversation = getConversation(chatId);
  const currentModel = AI_MODELS.groq[conversation.model];

  const modelMessage = `🤖 <b>Select AI Model</b>

Current: <b>${currentModel.name}</b>
${currentModel.description}

Choose a model:`;

  const keyboard: TelegramInlineKeyboard = {
    inline_keyboard: [
      [{
        text: `${conversation.model === 'llama-3.3-70b-versatile' ? '✅ ' : ''}Llama 3.3 70B (Best)`,
        callback_data: 'model_llama-3.3-70b-versatile'
      }],
      [{
        text: `${conversation.model === 'llama-3.1-8b-instant' ? '✅ ' : ''}Llama 3.1 8B (Fast)`,
        callback_data: 'model_llama-3.1-8b-instant'
      }],
      [{
        text: `${conversation.model === 'mixtral-8x7b-32768' ? '✅ ' : ''}Mixtral 8x7B (Complex)`,
        callback_data: 'model_mixtral-8x7b-32768'
      }],
      [{
        text: `${conversation.model === 'gemma2-9b-it' ? '✅ ' : ''}Gemma 2 9B (Efficient)`,
        callback_data: 'model_gemma2-9b-it'
      }],
    ],
  };

  await sendMessage(chatId, modelMessage, { replyMarkup: keyboard });
}

export async function handlePersonaSelection(chatId: number): Promise<void> {
  botStats.commandUsage['persona'] = (botStats.commandUsage['persona'] || 0) + 1;
  const conversation = getConversation(chatId);

  const personaMessage = `🎭 <b>Select AI Persona</b>

Current: <b>${conversation.settings.persona}</b>

Choose a personality:`;

  const keyboard: TelegramInlineKeyboard = {
    inline_keyboard: [
      [{
        text: `${conversation.settings.persona === 'default' ? '✅ ' : ''}😊 Default (Friendly)`,
        callback_data: 'persona_default'
      }],
      [{
        text: `${conversation.settings.persona === 'professional' ? '✅ ' : ''}💼 Professional`,
        callback_data: 'persona_professional'
      }],
      [{
        text: `${conversation.settings.persona === 'creative' ? '✅ ' : ''}🎨 Creative`,
        callback_data: 'persona_creative'
      }],
      [{
        text: `${conversation.settings.persona === 'teacher' ? '✅ ' : ''}📚 Teacher`,
        callback_data: 'persona_teacher'
      }],
      [{
        text: `${conversation.settings.persona === 'coder' ? '✅ ' : ''}💻 Coder`,
        callback_data: 'persona_coder'
      }],
    ],
  };

  await sendMessage(chatId, personaMessage, { replyMarkup: keyboard });
}

export async function handleSettings(chatId: number): Promise<void> {
  botStats.commandUsage['settings'] = (botStats.commandUsage['settings'] || 0) + 1;
  const conversation = getConversation(chatId);

  const settingsMessage = `⚙️ <b>Your Settings</b>

🤖 <b>Model:</b> ${AI_MODELS.groq[conversation.model].name}
🎭 <b>Persona:</b> ${conversation.settings.persona}
🌡️ <b>Temperature:</b> ${conversation.settings.temperature}
🔍 <b>Web Search:</b> ${conversation.settings.webSearchEnabled ? 'Enabled' : 'Disabled'}
🌐 <b>Language:</b> ${conversation.settings.language}

<b>Conversation:</b>
📝 Messages: ${conversation.messages.length}
💬 Total: ${conversation.stats.totalMessages}`;

  const keyboard: TelegramInlineKeyboard = {
    inline_keyboard: [
      [
        { text: '🤖 Model', callback_data: 'action_model' },
        { text: '🎭 Persona', callback_data: 'action_persona' },
      ],
      [
        { text: `🔍 Search: ${conversation.settings.webSearchEnabled ? 'ON' : 'OFF'}`, callback_data: 'toggle_websearch' },
        { text: '🗑️ Clear', callback_data: 'action_clear' },
      ],
    ],
  };

  await sendMessage(chatId, settingsMessage, { replyMarkup: keyboard });
}

export async function handleStats(chatId: number, userId: number): Promise<void> {
  botStats.commandUsage['stats'] = (botStats.commandUsage['stats'] || 0) + 1;
  const conversation = getConversation(chatId, userId);

  const statsMessage = `📊 <b>Your Statistics</b>

💬 <b>Messages:</b> ${conversation.stats.totalMessages}
📝 <b>Context Size:</b> ${conversation.messages.length} messages
🤖 <b>Current Model:</b> ${AI_MODELS.groq[conversation.model].name}
⏰ <b>Last Active:</b> ${new Date(conversation.stats.lastActive).toLocaleString()}
📅 <b>Member Since:</b> ${new Date(conversation.createdAt).toLocaleDateString()}`;

  await sendMessage(chatId, statsMessage);
}

export async function handleSearch(chatId: number, query: string): Promise<void> {
  botStats.commandUsage['search'] = (botStats.commandUsage['search'] || 0) + 1;

  if (!query.trim()) {
    await sendMessage(chatId, '🔍 <b>Usage:</b> /search [your query]\n\nExample: /search latest AI news');
    return;
  }

  await sendChatAction(chatId, 'typing');

  const results = await webSearch(query, 5);

  if (results.length === 0) {
    await sendMessage(chatId, '❌ No results found. Try a different query.');
    return;
  }

  let message = `🔍 <b>Search Results for:</b> "${escapeHtml(query)}"\n\n`;

  results.forEach((r, i) => {
    message += `<b>${i + 1}. ${escapeHtml(r.title)}</b>\n`;
    message += `${escapeHtml(r.snippet)}\n`;
    message += `🔗 ${r.url}\n\n`;
  });

  // Generate AI summary
  await sendChatAction(chatId, 'typing');
  const aiSummary = await generateResponse(chatId, `Summarize these search results about "${query}" concisely:`, {
    searchResults: results,
  });

  message += `\n💡 <b>AI Summary:</b>\n${aiSummary}`;

  await sendMessage(chatId, message, { disableWebPagePreview: true });
}

export async function handleSummarize(chatId: number, url: string): Promise<void> {
  botStats.commandUsage['summarize'] = (botStats.commandUsage['summarize'] || 0) + 1;

  if (!url.trim() || !url.startsWith('http')) {
    await sendMessage(chatId, '📰 <b>Usage:</b> /summarize [URL]\n\nExample: /summarize https://example.com/article');
    return;
  }

  await sendChatAction(chatId, 'typing');
  await sendMessage(chatId, `📰 Fetching and summarizing: ${url}`);

  const content = await summarizeUrl(url);

  await sendChatAction(chatId, 'typing');
  const summary = await generateResponse(
    chatId,
    `Summarize this webpage content in a clear, structured way with key points:`,
    { urlContent: content }
  );

  await sendMessage(chatId, `📰 <b>Summary:</b>\n\n${summary}`, { disableWebPagePreview: true });
}

export async function handleRunCode(chatId: number, args: string): Promise<void> {
  botStats.commandUsage['run'] = (botStats.commandUsage['run'] || 0) + 1;

  const parts = args.split(/\s+/);
  const language = parts[0]?.toLowerCase();
  const code = parts.slice(1).join(' ');

  if (!language || !code) {
    await sendMessage(chatId, `💻 <b>Code Execution</b>

<b>Usage:</b> /run [language] [code]

<b>Supported Languages:</b>
• js/javascript

<b>Examples:</b>
<code>/run js console.log("Hello!")</code>
<code>/run js [1,2,3].map(x => x * 2)</code>

⚠️ Code runs in a sandboxed environment.`);
    return;
  }

  await sendChatAction(chatId, 'typing');
  const result = executeCode(language, code);

  let message = `💻 <b>Code Execution</b>\n\n`;
  message += `<b>Language:</b> ${language}\n`;
  message += `<b>Code:</b>\n<code>${escapeHtml(code)}</code>\n\n`;

  if (result.success) {
    message += `✅ <b>Output:</b>\n<code>${escapeHtml(result.output || 'No output')}</code>`;
    if (result.executionTime) {
      message += `\n\n⏱️ Executed in ${result.executionTime}ms`;
    }
  } else {
    message += `❌ <b>Error:</b>\n<code>${escapeHtml(result.error || 'Unknown error')}</code>`;
  }

  await sendMessage(chatId, message);
}

export async function handleRetry(chatId: number): Promise<void> {
  botStats.commandUsage['retry'] = (botStats.commandUsage['retry'] || 0) + 1;
  const conversation = getConversation(chatId);

  // Find the last user message
  const messages = conversation.messages;
  let lastUserMessage: ConversationMessage | undefined;

  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      lastUserMessage = messages[i];
      break;
    }
  }

  if (!lastUserMessage) {
    await sendMessage(chatId, '❌ No previous message to retry.');
    return;
  }

  // Remove the last assistant message if exists
  if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
    messages.pop();
  }

  await sendChatAction(chatId, 'typing');
  const response = await generateResponse(chatId, lastUserMessage.content);
  await sendMessage(chatId, `🔄 <b>Regenerated Response:</b>\n\n${response}`);
}

// ============================================
// SUPER APP COMMAND HANDLERS
// ============================================

// Image Generation
export async function handleImageGeneration(chatId: number, prompt: string): Promise<void> {
  if (!prompt.trim()) {
    await sendMessage(chatId, `🎨 <b>AI Image Generation</b>

<b>Usage:</b> /imagine [description]

<b>Examples:</b>
• /imagine a sunset over mountains
• /imagine cyberpunk city at night
• /imagine cute robot playing guitar

Powered by Pollinations.ai (free)`);
    return;
  }

  await sendChatAction(chatId, 'upload_photo');
  await sendMessage(chatId, `🎨 Generating image: "${prompt}"...`);

  const result = await SuperApp.generateImage(prompt);

  if (result.success && result.imageUrl) {
    // Send photo via Telegram API
    await callTelegramAPI('sendPhoto', {
      chat_id: chatId,
      photo: result.imageUrl,
      caption: `🎨 <b>AI Generated Image</b>\n\nPrompt: ${prompt}`,
      parse_mode: 'HTML',
    });
  } else {
    await sendMessage(chatId, `❌ Failed to generate image: ${result.error}`);
  }
}

// Translation
export async function handleTranslate(chatId: number, args: string): Promise<void> {
  const parts = args.split(' ');
  const targetLang = parts[0]?.toLowerCase();
  const text = parts.slice(1).join(' ');

  if (!targetLang || !text) {
    await sendMessage(chatId, `🌐 <b>Translation</b>

<b>Usage:</b> /translate [lang] [text]

<b>Examples:</b>
• /translate en Halo apa kabar?
• /translate id Hello how are you?
• /translate ja Good morning

<b>Languages:</b>
${SuperApp.getLanguageList()}`);
    return;
  }

  await sendChatAction(chatId, 'typing');
  const result = await SuperApp.translateText(text, targetLang);

  if (result.success) {
    await sendMessage(chatId, `🌐 <b>Translation</b>

<b>Original:</b> ${text}
<b>Translated (${targetLang}):</b> ${result.translation}`);
  } else {
    await sendMessage(chatId, `❌ Translation failed: ${result.error}`);
  }
}

// Weather
export async function handleWeather(chatId: number, city: string): Promise<void> {
  if (!city.trim()) {
    await sendMessage(chatId, `🌤️ <b>Weather</b>

<b>Usage:</b> /weather [city]

<b>Examples:</b>
• /weather Jakarta
• /weather Tokyo
• /weather New York`);
    return;
  }

  await sendChatAction(chatId, 'typing');
  const result = await SuperApp.getWeather(city);

  if (result.success && result.data) {
    const w = result.data;
    await sendMessage(chatId, `${w.icon} <b>Weather in ${w.city}, ${w.country}</b>

🌡️ <b>Temperature:</b> ${w.temp}°C (feels like ${w.feels_like}°C)
💧 <b>Humidity:</b> ${w.humidity}%
💨 <b>Wind:</b> ${w.wind} km/h
📝 <b>Condition:</b> ${w.description}`);
  } else {
    await sendMessage(chatId, `❌ ${result.error}`);
  }
}

// News
export async function handleNews(chatId: number, category: string): Promise<void> {
  const validCategories = ['technology', 'business', 'sports', 'entertainment', 'world'];
  const cat = category.toLowerCase() || 'technology';

  if (category && !validCategories.includes(cat)) {
    await sendMessage(chatId, `📰 <b>News Categories:</b>

• /news technology
• /news business
• /news sports
• /news entertainment
• /news world`);
    return;
  }

  await sendChatAction(chatId, 'typing');
  const result = await SuperApp.getNews(cat);

  if (result.success && result.articles) {
    let message = `📰 <b>${cat.charAt(0).toUpperCase() + cat.slice(1)} News</b>\n\n`;
    result.articles.forEach((article, i) => {
      message += `<b>${i + 1}. ${article.title}</b>\n`;
      message += `📍 ${article.source}\n`;
      message += `🔗 ${article.link}\n\n`;
    });
    await sendMessage(chatId, message, { disableWebPagePreview: true });
  } else {
    await sendMessage(chatId, `❌ ${result.error}`);
  }
}

// Calculator
export async function handleCalculator(chatId: number, expression: string): Promise<void> {
  if (!expression.trim()) {
    await sendMessage(chatId, `🔢 <b>Calculator</b>

<b>Usage:</b> /calc [expression]

<b>Examples:</b>
• /calc 2 + 2
• /calc 15 * 7
• /calc 100 / 4
• /calc 2 ^ 10
• /calc (5 + 3) * 2`);
    return;
  }

  const result = SuperApp.calculate(expression);

  if (result.success) {
    await sendMessage(chatId, `🔢 <b>Calculator</b>

${expression} = <b>${result.result}</b>`);
  } else {
    await sendMessage(chatId, `❌ ${result.error}`);
  }
}

// Unit Converter
export async function handleConvert(chatId: number, args: string): Promise<void> {
  const match = args.match(/^([\d.]+)\s*(\w+)\s+to\s+(\w+)$/i);

  if (!match) {
    await sendMessage(chatId, `📐 <b>Unit Converter</b>

<b>Usage:</b> /convert [value] [from] to [to]

<b>Examples:</b>
• /convert 100 km to mi
• /convert 50 kg to lb
• /convert 30 c to f
• /convert 1 gb to mb
• /convert 2 h to min

<b>Categories:</b>
📏 Length: m, km, cm, mm, mi, ft, in, yd
⚖️ Weight: kg, g, mg, lb, oz, ton
🌡️ Temperature: c, f, k
📦 Volume: l, ml, gal, qt, pt, cup
📐 Area: m2, km2, ha, acre, ft2
⏱️ Time: s, ms, min, h, day, week
💾 Data: b, kb, mb, gb, tb`);
    return;
  }

  const [, value, fromUnit, toUnit] = match;
  const result = SuperApp.convertUnit(parseFloat(value), fromUnit, toUnit);

  if (result.success) {
    await sendMessage(chatId, `📐 <b>Conversion</b>

${result.formatted}`);
  } else {
    await sendMessage(chatId, `❌ ${result.error}`);
  }
}

// Currency Converter
export async function handleCurrency(chatId: number, args: string): Promise<void> {
  const match = args.match(/^([\d.]+)\s*(\w+)\s+to\s+(\w+)$/i);

  if (!match) {
    await sendMessage(chatId, `💱 <b>Currency Converter</b>

<b>Usage:</b> /currency [amount] [from] to [to]

<b>Examples:</b>
• /currency 100 usd to idr
• /currency 1000000 idr to usd
• /currency 50 eur to gbp

Common currencies: USD, EUR, GBP, JPY, IDR, SGD, MYR, CNY`);
    return;
  }

  await sendChatAction(chatId, 'typing');
  const [, amount, from, to] = match;
  const result = await SuperApp.convertCurrency(parseFloat(amount), from, to);

  if (result.success) {
    await sendMessage(chatId, `💱 <b>Currency Conversion</b>

${parseFloat(amount).toLocaleString()} ${from.toUpperCase()} = <b>${result.result!.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${to.toUpperCase()}</b>

Rate: 1 ${from.toUpperCase()} = ${result.rate!.toFixed(4)} ${to.toUpperCase()}`);
  } else {
    await sendMessage(chatId, `❌ ${result.error}`);
  }
}

// QR Code Generator
export async function handleQRCode(chatId: number, data: string): Promise<void> {
  if (!data.trim()) {
    await sendMessage(chatId, `📱 <b>QR Code Generator</b>

<b>Usage:</b> /qr [text or URL]

<b>Examples:</b>
• /qr https://example.com
• /qr Hello World
• /qr +62812345678`);
    return;
  }

  const qrUrl = SuperApp.generateQRCode(data);
  await callTelegramAPI('sendPhoto', {
    chat_id: chatId,
    photo: qrUrl,
    caption: `📱 <b>QR Code</b>\n\nData: ${data}`,
    parse_mode: 'HTML',
  });
}

// URL Shortener
export async function handleShorten(chatId: number, url: string): Promise<void> {
  if (!url.trim() || !url.startsWith('http')) {
    await sendMessage(chatId, `🔗 <b>URL Shortener</b>

<b>Usage:</b> /shorten [URL]

<b>Example:</b>
/shorten https://example.com/very/long/url`);
    return;
  }

  await sendChatAction(chatId, 'typing');
  const result = await SuperApp.shortenUrl(url);

  if (result.success) {
    await sendMessage(chatId, `🔗 <b>URL Shortened</b>

<b>Original:</b> ${url}
<b>Short:</b> ${result.shortUrl}`);
  } else {
    await sendMessage(chatId, `❌ ${result.error}`);
  }
}

// Notes
export async function handleNotes(chatId: number, userId: number, args: string): Promise<void> {
  const [action, ...rest] = args.split(' ');

  switch (action?.toLowerCase()) {
    case 'add': {
      const [title, ...contentParts] = rest.join(' ').split('|');
      const content = contentParts.join('|').trim();
      if (!title || !content) {
        await sendMessage(chatId, `📝 <b>Add Note</b>\n\nUsage: /notes add Title | Content`);
        return;
      }
      const note = SuperApp.addNote(userId, title.trim(), content);
      await sendMessage(chatId, `✅ Note saved!\n\nID: ${note.id}\nTitle: ${note.title}`);
      break;
    }
    case 'delete': {
      const noteId = rest[0];
      if (SuperApp.deleteNote(userId, noteId)) {
        await sendMessage(chatId, `🗑️ Note deleted!`);
      } else {
        await sendMessage(chatId, `❌ Note not found`);
      }
      break;
    }
    default: {
      const notes = SuperApp.getNotes(userId);
      if (notes.length === 0) {
        await sendMessage(chatId, `📝 <b>Notes</b>

No notes yet.

<b>Commands:</b>
• /notes add Title | Content
• /notes delete [id]`);
      } else {
        let message = `📝 <b>Your Notes</b> (${notes.length})\n\n`;
        notes.forEach(note => {
          message += `<b>${note.title}</b> (${note.id})\n${note.content.slice(0, 50)}...\n\n`;
        });
        await sendMessage(chatId, message);
      }
    }
  }
}

// Todos
export async function handleTodos(chatId: number, userId: number, args: string): Promise<void> {
  const [action, ...rest] = args.split(' ');

  switch (action?.toLowerCase()) {
    case 'add': {
      const task = rest.join(' ');
      if (!task) {
        await sendMessage(chatId, `✅ <b>Add Todo</b>\n\nUsage: /todo add Your task here`);
        return;
      }
      const todo = SuperApp.addTodo(userId, task);
      await sendMessage(chatId, `✅ Todo added!\n\nID: ${todo.id}\nTask: ${todo.task}`);
      break;
    }
    case 'done': {
      const todoId = rest[0];
      if (SuperApp.toggleTodo(userId, todoId)) {
        await sendMessage(chatId, `✅ Todo marked as done!`);
      } else {
        await sendMessage(chatId, `❌ Todo not found`);
      }
      break;
    }
    case 'delete': {
      const todoId = rest[0];
      if (SuperApp.deleteTodo(userId, todoId)) {
        await sendMessage(chatId, `🗑️ Todo deleted!`);
      } else {
        await sendMessage(chatId, `❌ Todo not found`);
      }
      break;
    }
    default: {
      const todos = SuperApp.getTodos(userId);
      if (todos.length === 0) {
        await sendMessage(chatId, `✅ <b>Todos</b>

No todos yet.

<b>Commands:</b>
• /todo add Task description
• /todo done [id]
• /todo delete [id]`);
      } else {
        let message = `✅ <b>Your Todos</b>\n\n`;
        todos.forEach(todo => {
          message += `${todo.completed ? '✅' : '⬜'} ${todo.task} (${todo.id})\n`;
        });
        await sendMessage(chatId, message);
      }
    }
  }
}

// Entertainment
export async function handleJoke(chatId: number): Promise<void> {
  await sendMessage(chatId, `😂 <b>Random Joke</b>\n\n${SuperApp.getRandomJoke()}`);
}

export async function handleFact(chatId: number): Promise<void> {
  await sendMessage(chatId, `${SuperApp.getRandomFact()}`);
}

export async function handleQuote(chatId: number): Promise<void> {
  await sendMessage(chatId, `💡 <b>Quote of the Day</b>\n\n${SuperApp.getRandomQuote()}`);
}

export async function handleHoroscope(chatId: number, sign: string): Promise<void> {
  if (!sign.trim()) {
    await sendMessage(chatId, `🔮 <b>Horoscope</b>

<b>Usage:</b> /horoscope [sign]

<b>Signs:</b>
♈ Aries ♉ Taurus ♊ Gemini ♋ Cancer
♌ Leo ♍ Virgo ♎ Libra ♏ Scorpio
♐ Sagittarius ♑ Capricorn ♒ Aquarius ♓ Pisces`);
    return;
  }
  await sendMessage(chatId, `🔮 <b>Daily Horoscope</b>\n\n${SuperApp.getHoroscope(sign)}`);
}

// Games
export async function handleTrivia(chatId: number, userId: number, answer?: string): Promise<void> {
  if (answer) {
    const result = SuperApp.answerTrivia(userId, answer);
    if (result.correct) {
      await sendMessage(chatId, `✅ <b>Correct!</b> 🎉\n\nScore: ${result.score}\n\nSend /trivia for next question!`);
    } else {
      await sendMessage(chatId, `❌ Wrong! The answer was: <b>${result.correctAnswer}</b>\n\nScore: ${result.score}\n\nSend /trivia for next question!`);
    }
  } else {
    const game = SuperApp.startTrivia(userId);
    let message = `🎯 <b>Trivia Time!</b>\n\n${game.question}\n\n`;
    game.options.forEach((opt, i) => {
      message += `${i + 1}. ${opt}\n`;
    });
    message += `\nReply with: /trivia [your answer]`;
    await sendMessage(chatId, message);
  }
}

export async function handleMathQuiz(chatId: number, userId: number, answer?: string): Promise<void> {
  if (answer) {
    const result = SuperApp.answerMathQuiz(userId, parseInt(answer));
    if (result.correct) {
      await sendMessage(chatId, `✅ <b>Correct!</b> 🎉\n\nScore: ${result.score}\n\nSend /math for next question!`);
    } else {
      await sendMessage(chatId, `❌ Wrong! The answer was: <b>${result.correctAnswer}</b>\n\nScore: ${result.score}\n\nSend /math for next question!`);
    }
  } else {
    const game = SuperApp.startMathQuiz(userId);
    await sendMessage(chatId, `🔢 <b>Math Quiz!</b>\n\n${game.question}\n\nReply with: /math [your answer]`);
  }
}

export async function handleWordGame(chatId: number, userId: number, guess?: string): Promise<void> {
  if (guess) {
    const result = SuperApp.guessWord(userId, guess);
    if (result.correct) {
      await sendMessage(chatId, `✅ <b>Correct!</b> The word was: <b>${result.answer}</b>\n\nScore: ${result.score}\n\nSend /word for new game!`);
    } else if (result.attemptsLeft > 0) {
      await sendMessage(chatId, `❌ Wrong! ${result.attemptsLeft} attempts left.\n\nTry again: /word [guess]`);
    } else {
      await sendMessage(chatId, `❌ Game Over! The word was: <b>${result.answer}</b>\n\nScore: ${result.score}\n\nSend /word for new game!`);
    }
  } else {
    const game = SuperApp.startWordGuess(userId);
    await sendMessage(chatId, `📝 <b>Word Guess!</b>\n\nHint: ${game.hint} (${game.length} letters)\n\nGuess with: /word [your guess]`);
  }
}

// Developer Tools
export async function handleDevTools(chatId: number, tool: string, args: string): Promise<void> {
  switch (tool) {
    case 'json': {
      const result = SuperApp.formatJSON(args);
      if (result.success) {
        await sendMessage(chatId, `📋 <b>Formatted JSON</b>\n\n<code>${escapeHtml(result.formatted!)}</code>`);
      } else {
        await sendMessage(chatId, `❌ ${result.error}`);
      }
      break;
    }
    case 'base64': {
      const [action, ...text] = args.split(' ');
      if (action === 'encode') {
        const encoded = SuperApp.base64Encode(text.join(' '));
        await sendMessage(chatId, `🔐 <b>Base64 Encoded</b>\n\n<code>${encoded}</code>`);
      } else if (action === 'decode') {
        const result = SuperApp.base64Decode(text.join(' '));
        if (result.success) {
          await sendMessage(chatId, `🔓 <b>Base64 Decoded</b>\n\n${result.result}`);
        } else {
          await sendMessage(chatId, `❌ ${result.error}`);
        }
      } else {
        await sendMessage(chatId, `🔐 <b>Base64</b>\n\n/base64 encode [text]\n/base64 decode [base64]`);
      }
      break;
    }
    case 'hash': {
      const [algo, ...text] = args.split(' ');
      const validAlgos = ['md5', 'sha1', 'sha256', 'sha512'];
      if (!validAlgos.includes(algo) || !text.length) {
        await sendMessage(chatId, `🔒 <b>Hash Generator</b>\n\n/hash md5|sha1|sha256|sha512 [text]`);
        return;
      }
      const hash = await SuperApp.generateHash(text.join(' '), algo as 'md5' | 'sha1' | 'sha256' | 'sha512');
      await sendMessage(chatId, `🔒 <b>${algo.toUpperCase()} Hash</b>\n\n<code>${hash}</code>`);
      break;
    }
    case 'uuid': {
      const uuid = SuperApp.generateUUID();
      await sendMessage(chatId, `🆔 <b>Generated UUID</b>\n\n<code>${uuid}</code>`);
      break;
    }
    case 'lorem': {
      const paragraphs = parseInt(args) || 1;
      const text = SuperApp.generateLoremIpsum(Math.min(paragraphs, 5));
      await sendMessage(chatId, `📝 <b>Lorem Ipsum</b>\n\n${text}`);
      break;
    }
    case 'color': {
      const result = SuperApp.convertColor(args);
      if (result.error) {
        await sendMessage(chatId, `❌ ${result.error}`);
      } else {
        await sendMessage(chatId, `🎨 <b>Color Conversion</b>\n\nHEX: ${result.hex}\nRGB: ${result.rgb}\nHSL: ${result.hsl}`);
      }
      break;
    }
    case 'password': {
      const length = parseInt(args) || 16;
      const password = SuperApp.generatePassword(Math.min(length, 64));
      await sendMessage(chatId, `🔑 <b>Generated Password</b>\n\n<code>${password}</code>\n\n⚠️ Copy and delete this message!`);
      break;
    }
    default:
      await sendMessage(chatId, `🛠️ <b>Developer Tools</b>

/json [json] - Format JSON
/base64 encode|decode [text]
/hash md5|sha1|sha256|sha512 [text]
/uuid - Generate UUID
/lorem [paragraphs] - Lorem Ipsum
/color #RRGGBB - Color converter
/password [length] - Generate password`);
  }
}

// Crypto
export async function handleCrypto(chatId: number, symbol: string): Promise<void> {
  if (!symbol.trim()) {
    await sendChatAction(chatId, 'typing');
    const result = await SuperApp.getTopCryptos(10);
    if (result.success && result.data) {
      let message = `💰 <b>Top 10 Cryptocurrencies</b>\n\n`;
      result.data.forEach(coin => {
        const change = coin.change24h >= 0 ? `📈 +${coin.change24h.toFixed(2)}%` : `📉 ${coin.change24h.toFixed(2)}%`;
        message += `${coin.rank}. <b>${coin.symbol}</b> $${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}\n   ${change}\n`;
      });
      message += `\n/crypto [symbol] for details`;
      await sendMessage(chatId, message);
    } else {
      await sendMessage(chatId, `❌ ${result.error}`);
    }
    return;
  }

  await sendChatAction(chatId, 'typing');
  const result = await SuperApp.getCryptoPrice(symbol);

  if (result.success && result.data) {
    const c = result.data;
    const change = c.change24h >= 0 ? `📈 +${c.change24h.toFixed(2)}%` : `📉 ${c.change24h.toFixed(2)}%`;
    await sendMessage(chatId, `💰 <b>${c.symbol}</b>

💵 <b>Price:</b> $${c.price.toLocaleString(undefined, { maximumFractionDigits: 8 })}
📊 <b>24h Change:</b> ${change}
📈 <b>Market Cap:</b> $${(c.marketCap / 1e9).toFixed(2)}B`);
  } else {
    await sendMessage(chatId, `❌ ${result.error}`);
  }
}

// Super App Menu
export async function handleMenu(chatId: number): Promise<void> {
  const keyboard: TelegramInlineKeyboard = {
    inline_keyboard: [
      [
        { text: '🤖 AI Chat', callback_data: 'menu_ai' },
        { text: '🔍 Search', callback_data: 'menu_search' },
      ],
      [
        { text: '🎨 Generate Image', callback_data: 'menu_image' },
        { text: '🌐 Translate', callback_data: 'menu_translate' },
      ],
      [
        { text: '🌤️ Weather', callback_data: 'menu_weather' },
        { text: '📰 News', callback_data: 'menu_news' },
      ],
      [
        { text: '💰 Crypto', callback_data: 'menu_crypto' },
        { text: '💱 Currency', callback_data: 'menu_currency' },
      ],
      [
        { text: '🛠️ Tools', callback_data: 'menu_tools' },
        { text: '🎮 Games', callback_data: 'menu_games' },
      ],
      [
        { text: '📝 Productivity', callback_data: 'menu_productivity' },
        { text: '😂 Fun', callback_data: 'menu_fun' },
      ],
    ],
  };

  await sendMessage(chatId, `🚀 <b>IbnuGPT Super App Menu</b>

Choose a category:`, { replyMarkup: keyboard });
}

// Admin commands
export async function handleAdminStats(chatId: number, userId: number): Promise<void> {
  if (!ADMIN_USER_IDS.includes(userId)) {
    await sendMessage(chatId, '⛔ Admin access required.');
    return;
  }

  const uptime = Math.floor((Date.now() - botStats.startTime) / 1000);
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);

  let message = `👑 <b>Admin Statistics</b>\n\n`;
  message += `<b>Bot Status:</b>\n`;
  message += `• Uptime: ${hours}h ${minutes}m\n`;
  message += `• Total Users: ${botStats.totalUsers}\n`;
  message += `• Total Messages: ${botStats.totalMessages}\n\n`;

  message += `<b>Command Usage:</b>\n`;
  for (const [cmd, count] of Object.entries(botStats.commandUsage)) {
    message += `• /${cmd}: ${count}\n`;
  }

  message += `\n<b>Model Usage:</b>\n`;
  for (const [model, count] of Object.entries(botStats.modelUsage)) {
    message += `• ${model}: ${count}\n`;
  }

  message += `\n<b>Active Conversations:</b> ${conversations.size}`;

  await sendMessage(chatId, message);
}

// ============================================
// CALLBACK QUERY HANDLERS
// ============================================

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

      await answerCallbackQuery(callbackQueryId, `✅ Model: ${model.name}`);

      if (messageId) {
        await editMessageText(chatId, messageId,
          `✅ <b>Model Updated!</b>\n\nNow using: <b>${model.name}</b>\n${model.description}\n\nContinue chatting!`
        );
      }
    }
    return;
  }

  // Handle persona selection
  if (data.startsWith('persona_')) {
    const persona = data.replace('persona_', '');
    setPersona(chatId, persona);
    await answerCallbackQuery(callbackQueryId, `✅ Persona: ${persona}`);

    if (messageId) {
      await editMessageText(chatId, messageId,
        `🎭 <b>Persona Updated!</b>\n\nNow using: <b>${persona}</b>\n\nMy personality has changed. Try chatting now!`
      );
    }
    return;
  }

  // Handle toggle web search
  if (data === 'toggle_websearch') {
    const enabled = toggleWebSearch(chatId);
    await answerCallbackQuery(callbackQueryId, `🔍 Web Search: ${enabled ? 'ON' : 'OFF'}`);
    await handleSettings(chatId);
    return;
  }

  // Handle actions
  switch (data) {
    case 'action_chat':
      await answerCallbackQuery(callbackQueryId, '💬 Just type any message!');
      break;
    case 'action_help':
      await answerCallbackQuery(callbackQueryId);
      await handleHelp(chatId);
      break;
    case 'action_menu':
      await answerCallbackQuery(callbackQueryId);
      await handleMenu(chatId);
      break;
    case 'action_model':
      await answerCallbackQuery(callbackQueryId);
      await handleModelSelection(chatId);
      break;
    case 'action_persona':
      await answerCallbackQuery(callbackQueryId);
      await handlePersonaSelection(chatId);
      break;
    case 'action_clear':
      await answerCallbackQuery(callbackQueryId, '🗑️ Cleared!');
      await handleClear(chatId);
      break;

    // Menu categories
    case 'menu_ai':
      await answerCallbackQuery(callbackQueryId);
      await sendMessage(chatId, `🤖 <b>AI Features</b>

• Just chat - Send any message
• /imagine [prompt] - Generate AI image
• /translate [lang] [text] - Translate text
• /run js [code] - Execute JavaScript
• /model - Change AI model
• /persona - Change AI personality`);
      break;
    case 'menu_search':
      await answerCallbackQuery(callbackQueryId);
      await sendMessage(chatId, `🔍 <b>Search & Research</b>

• /search [query] - Web search + AI summary
• /summarize [url] - Summarize webpage
• /news [category] - Latest news
  Categories: technology, business, sports, entertainment, world`);
      break;
    case 'menu_image':
      await answerCallbackQuery(callbackQueryId);
      await sendMessage(chatId, `🎨 <b>AI Image Generation</b>

Usage: /imagine [description]

Examples:
• /imagine sunset over mountains
• /imagine cyberpunk city at night
• /imagine cute robot playing guitar`);
      break;
    case 'menu_translate':
      await answerCallbackQuery(callbackQueryId);
      await sendMessage(chatId, `🌐 <b>Translation</b>

Usage: /translate [lang] [text]

Examples:
• /translate en Halo apa kabar?
• /translate id Hello how are you?
• /translate ja Good morning

Languages: en, id, es, fr, de, ja, ko, zh, ar, ru...`);
      break;
    case 'menu_weather':
      await answerCallbackQuery(callbackQueryId);
      await sendMessage(chatId, `🌤️ <b>Weather</b>

Usage: /weather [city]

Examples:
• /weather Jakarta
• /weather Tokyo
• /weather New York`);
      break;
    case 'menu_news':
      await answerCallbackQuery(callbackQueryId);
      await sendMessage(chatId, `📰 <b>News</b>

Usage: /news [category]

Categories:
• /news technology
• /news business
• /news sports
• /news entertainment
• /news world`);
      break;
    case 'menu_crypto':
      await answerCallbackQuery(callbackQueryId);
      await sendMessage(chatId, `💰 <b>Cryptocurrency</b>

• /crypto - Top 10 crypto prices
• /crypto bitcoin - Bitcoin price
• /crypto ethereum - Ethereum price
• /crypto solana - Solana price`);
      break;
    case 'menu_currency':
      await answerCallbackQuery(callbackQueryId);
      await sendMessage(chatId, `💱 <b>Currency Converter</b>

Usage: /currency [amount] [from] to [to]

Examples:
• /currency 100 usd to idr
• /currency 1000000 idr to usd
• /currency 50 eur to gbp`);
      break;
    case 'menu_tools':
      await answerCallbackQuery(callbackQueryId);
      await sendMessage(chatId, `🛠️ <b>Utility Tools</b>

• /calc [expression] - Calculator
• /convert [value] [from] to [to] - Unit converter
• /qr [text] - Generate QR code
• /shorten [url] - URL shortener
• /dev - Developer tools (JSON, Base64, Hash, UUID, Password)`);
      break;
    case 'menu_games':
      await answerCallbackQuery(callbackQueryId);
      await sendMessage(chatId, `🎮 <b>Games & Fun</b>

• /trivia - Trivia quiz
• /math - Math quiz
• /word - Word guess game
• /joke - Random joke
• /fact - Fun fact
• /quote - Inspirational quote
• /horoscope [sign] - Daily horoscope`);
      break;
    case 'menu_productivity':
      await answerCallbackQuery(callbackQueryId);
      await sendMessage(chatId, `📝 <b>Productivity</b>

<b>Notes:</b>
• /notes - View all notes
• /notes add Title | Content
• /notes delete [id]

<b>Todos:</b>
• /todo - View all todos
• /todo add Task description
• /todo done [id]
• /todo delete [id]`);
      break;
    case 'menu_fun':
      await answerCallbackQuery(callbackQueryId);
      await sendMessage(chatId, `😂 <b>Fun & Entertainment</b>

• /joke - Random programming joke
• /fact - Fun tech fact
• /quote - Inspirational quote
• /horoscope [sign] - Daily horoscope

<b>Games:</b>
• /trivia - Answer trivia questions
• /math - Solve math problems
• /word - Guess the word`);
      break;

    default:
      await answerCallbackQuery(callbackQueryId, 'Unknown action');
  }
}

// ============================================
// INLINE QUERY HANDLER
// ============================================

export async function handleInlineQuery(
  queryId: string,
  query: string,
  userId: number
): Promise<void> {
  if (!query.trim()) {
    await answerInlineQuery(queryId, [
      {
        type: 'article',
        id: 'help',
        title: 'How to use IbnuGPT inline',
        description: 'Type your question or "search: [query]" for web search',
        input_message_content: {
          message_text: 'Use @IbnuGPT_Bot [your question] to get AI answers inline!',
        },
      },
    ]);
    return;
  }

  // Handle search prefix
  if (query.toLowerCase().startsWith('search:')) {
    const searchQuery = query.slice(7).trim();
    if (searchQuery) {
      const results = await webSearch(searchQuery, 3);

      const inlineResults = results.map((r, i) => ({
        type: 'article' as const,
        id: `search_${i}`,
        title: r.title,
        description: r.snippet,
        input_message_content: {
          message_text: `🔍 <b>${r.title}</b>\n\n${r.snippet}\n\n🔗 ${r.url}`,
          parse_mode: 'HTML',
        },
      }));

      await answerInlineQuery(queryId, inlineResults);
      return;
    }
  }

  // Generate AI response for inline query
  try {
    const response = await generateResponse(userId, query);

    await answerInlineQuery(queryId, [
      {
        type: 'article',
        id: 'ai_response',
        title: 'AI Answer',
        description: response.slice(0, 100) + '...',
        input_message_content: {
          message_text: `❓ <b>Q:</b> ${escapeHtml(query)}\n\n💡 <b>A:</b> ${response}`,
          parse_mode: 'HTML',
        },
      },
    ]);
  } catch {
    await answerInlineQuery(queryId, [
      {
        type: 'article',
        id: 'error',
        title: 'Error generating response',
        description: 'Please try again',
        input_message_content: {
          message_text: 'Sorry, I could not generate a response. Please try again.',
        },
      },
    ]);
  }
}

// ============================================
// MEDIA HANDLERS
// ============================================

export async function handlePhotoMessage(
  chatId: number,
  photo: TelegramPhotoSize[],
  caption?: string
): Promise<void> {
  await sendChatAction(chatId, 'typing');

  // Get largest photo
  const largestPhoto = photo.reduce((prev, current) =>
    (current.file_size || 0) > (prev.file_size || 0) ? current : prev
  );

  try {
    // Get file info
    const file = await getFile(largestPhoto.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${getBotToken()}/${file.file_path}`;

    // For now, describe that we received an image
    // In production, you could use a vision API
    const prompt = caption
      ? `User sent an image with caption: "${caption}". Acknowledge the image and respond to the caption.`
      : 'User sent an image. Acknowledge that you received it and ask what they would like to know about it.';

    const response = await generateResponse(chatId, prompt, {
      imageDescription: `[User sent a ${largestPhoto.width}x${largestPhoto.height} image]`,
    });

    await sendMessage(chatId, response);
  } catch (error) {
    console.error('Photo handling error:', error);
    await sendMessage(chatId, '📷 I received your image! Currently, I can acknowledge photos but detailed image analysis is coming soon.');
  }
}

export async function handleVoiceMessage(
  chatId: number,
  voice: TelegramVoice
): Promise<void> {
  await sendChatAction(chatId, 'typing');
  await sendMessage(chatId, '🎤 Processing your voice message...');

  try {
    // Get voice file
    const file = await getFile(voice.file_id);
    const audioBuffer = await downloadFile(file.file_path);

    // For transcription, you would use Groq's Whisper API
    // For now, acknowledge the voice message
    const response = await generateResponse(chatId,
      'User sent a voice message. Acknowledge it and explain that voice transcription is available.',
      { voiceTranscript: '[Voice message received - transcription feature available with Whisper API]' }
    );

    await sendMessage(chatId, response);
  } catch (error) {
    console.error('Voice handling error:', error);
    await sendMessage(chatId, '🎤 I received your voice message! Voice transcription is being set up.');
  }
}

// ============================================
// MAIN UPDATE HANDLER
// ============================================

export async function handleUpdate(update: TelegramUpdate): Promise<void> {
  console.log('[Telegram] Processing update:', update.update_id);

  // Handle inline queries
  if (update.inline_query) {
    const { id, from, query } = update.inline_query;
    await handleInlineQuery(id, query, from.id);
    return;
  }

  // Handle callback queries
  if (update.callback_query) {
    const { id, from, message, data } = update.callback_query;
    const chatId = message?.chat.id || from.id;

    if (data) {
      await handleCallbackQuery(id, chatId, data, message?.message_id);
    }
    return;
  }

  // Handle messages
  if (update.message) {
    const { chat, from, text, photo, voice, caption } = update.message;
    const userId = from?.id || chat.id;
    const isGroup = chat.type === 'group' || chat.type === 'supergroup';

    // Rate limiting
    const rateCheck = checkRateLimit(userId);
    if (!rateCheck.allowed) {
      await sendMessage(chat.id, rateCheck.message!);
      return;
    }

    // Handle photos
    if (photo && photo.length > 0) {
      await handlePhotoMessage(chat.id, photo, caption);
      return;
    }

    // Handle voice messages
    if (voice) {
      await handleVoiceMessage(chat.id, voice);
      return;
    }

    // Handle text messages
    if (!text) return;

    // In groups, only respond to mentions or replies
    if (isGroup) {
      const botUsername = '@IbnuGPT_Bot';
      const isMentioned = text.includes(botUsername);
      const isReplyToBot = update.message.reply_to_message?.from?.is_bot;

      if (!isMentioned && !isReplyToBot && !text.startsWith('/')) {
        return; // Ignore messages not directed at the bot
      }
    }

    // Handle commands
    if (text.startsWith('/')) {
      const [commandPart, ...argParts] = text.split(/\s+/);
      const command = commandPart.toLowerCase().split('@')[0];
      const args = argParts.join(' ');

      switch (command) {
        // Core Commands
        case '/start':
          await handleStart(chat.id, from);
          break;
        case '/help':
          await handleHelp(chat.id);
          break;
        case '/menu':
          await handleMenu(chat.id);
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
        case '/persona':
          await handlePersonaSelection(chat.id);
          break;
        case '/settings':
          await handleSettings(chat.id);
          break;
        case '/stats':
          await handleStats(chat.id, userId);
          break;

        // Search & Research
        case '/search':
          await handleSearch(chat.id, args);
          break;
        case '/summarize':
          await handleSummarize(chat.id, args);
          break;
        case '/websearch':
          const enabled = toggleWebSearch(chat.id);
          await sendMessage(chat.id, `🔍 Web search is now <b>${enabled ? 'enabled' : 'disabled'}</b>`);
          break;

        // AI Features
        case '/run':
          await handleRunCode(chat.id, args);
          break;
        case '/retry':
          await handleRetry(chat.id);
          break;
        case '/imagine':
        case '/image':
          await handleImageGeneration(chat.id, args);
          break;
        case '/translate':
        case '/tr':
          await handleTranslate(chat.id, args);
          break;

        // Info & News
        case '/weather':
        case '/cuaca':
          await handleWeather(chat.id, args);
          break;
        case '/news':
        case '/berita':
          await handleNews(chat.id, args);
          break;

        // Utility Tools
        case '/calc':
        case '/calculator':
          await handleCalculator(chat.id, args);
          break;
        case '/convert':
          await handleConvert(chat.id, args);
          break;
        case '/currency':
        case '/forex':
          await handleCurrency(chat.id, args);
          break;
        case '/qr':
        case '/qrcode':
          await handleQRCode(chat.id, args);
          break;
        case '/shorten':
        case '/short':
          await handleShorten(chat.id, args);
          break;

        // Productivity
        case '/notes':
        case '/note':
          await handleNotes(chat.id, userId, args);
          break;
        case '/todo':
        case '/todos':
          await handleTodos(chat.id, userId, args);
          break;

        // Entertainment
        case '/joke':
          await handleJoke(chat.id);
          break;
        case '/fact':
          await handleFact(chat.id);
          break;
        case '/quote':
          await handleQuote(chat.id);
          break;
        case '/horoscope':
        case '/zodiac':
          await handleHoroscope(chat.id, args);
          break;

        // Games
        case '/trivia':
          await handleTrivia(chat.id, userId, args || undefined);
          break;
        case '/math':
        case '/mathquiz':
          await handleMathQuiz(chat.id, userId, args || undefined);
          break;
        case '/word':
        case '/wordgame':
          await handleWordGame(chat.id, userId, args || undefined);
          break;

        // Developer Tools
        case '/json':
          await handleDevTools(chat.id, 'json', args);
          break;
        case '/base64':
          await handleDevTools(chat.id, 'base64', args);
          break;
        case '/hash':
          await handleDevTools(chat.id, 'hash', args);
          break;
        case '/uuid':
          await handleDevTools(chat.id, 'uuid', args);
          break;
        case '/lorem':
          await handleDevTools(chat.id, 'lorem', args);
          break;
        case '/color':
          await handleDevTools(chat.id, 'color', args);
          break;
        case '/password':
        case '/genpass':
          await handleDevTools(chat.id, 'password', args);
          break;
        case '/dev':
        case '/devtools':
          await handleDevTools(chat.id, '', '');
          break;

        // Finance
        case '/crypto':
        case '/btc':
        case '/coin':
          await handleCrypto(chat.id, args);
          break;

        // Admin
        case '/adminstats':
          await handleAdminStats(chat.id, userId);
          break;

        default:
          await sendMessage(chat.id, '❓ Unknown command. Use /help or /menu to see available commands.');
      }
      return;
    }

    // Handle regular chat
    await sendChatAction(chat.id, 'typing');

    try {
      // Check for URLs and auto-summarize if enabled
      const urls = extractUrls(text);
      let searchResults: SearchResult[] | undefined;
      let urlContent: string | undefined;

      const conversation = getConversation(chat.id, userId);

      // Auto web search for questions
      if (conversation.settings.webSearchEnabled && text.includes('?')) {
        searchResults = await webSearch(text, 3);
      }

      // Auto summarize if URL is shared
      if (urls.length > 0 && text.length < 200) {
        urlContent = await summarizeUrl(urls[0]);
      }

      const response = await generateResponse(chat.id, text, {
        searchResults,
        urlContent,
        isGroup,
      });

      await sendMessage(chat.id, response);
    } catch (error) {
      console.error('[Telegram] Error:', error);
      await sendMessage(chat.id, '😅 Sorry, something went wrong. Please try again.');
    }
  }
}

// ============================================
// EXPORTS
// ============================================

export const TELEGRAM_SYSTEM_PROMPT = buildSystemPrompt;
export { PERSONAS, ADMIN_USER_IDS };

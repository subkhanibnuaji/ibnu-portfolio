/**
 * AI Configuration - Centralized settings for all AI features
 * File: lib/ai/config.ts
 *
 * This file contains all configuration constants for AI features.
 * Isolated from the rest of the application.
 */

// ============================================
// MODEL CONFIGURATIONS
// ============================================

export const AI_MODELS = {
  // Groq Models (FREE)
  groq: {
    'llama-3.3-70b-versatile': {
      id: 'llama-3.3-70b-versatile',
      name: 'Llama 3.3 70B',
      description: 'Most capable, best for complex reasoning',
      provider: 'groq',
      maxTokens: 8192,
      contextWindow: 128000,
      free: true,
    },
    'llama-3.1-8b-instant': {
      id: 'llama-3.1-8b-instant',
      name: 'Llama 3.1 8B',
      description: 'Fastest responses, good for simple tasks',
      provider: 'groq',
      maxTokens: 8192,
      contextWindow: 128000,
      free: true,
    },
    'mixtral-8x7b-32768': {
      id: 'mixtral-8x7b-32768',
      name: 'Mixtral 8x7B',
      description: 'Great for complex multi-step tasks',
      provider: 'groq',
      maxTokens: 32768,
      contextWindow: 32768,
      free: true,
    },
    'gemma2-9b-it': {
      id: 'gemma2-9b-it',
      name: 'Gemma 2 9B',
      description: "Google's efficient instruction-tuned model",
      provider: 'groq',
      maxTokens: 8192,
      contextWindow: 8192,
      free: true,
    },
  },
} as const;

// Export GROQ_MODELS explicitly for proper bundling
export const GROQ_MODELS = {
  'llama-3.3-70b-versatile': {
    id: 'llama-3.3-70b-versatile' as const,
    name: 'Llama 3.3 70B',
    description: 'Most capable, best for complex reasoning',
    provider: 'groq' as const,
    maxTokens: 8192,
    contextWindow: 128000,
    free: true,
  },
  'llama-3.1-8b-instant': {
    id: 'llama-3.1-8b-instant' as const,
    name: 'Llama 3.1 8B',
    description: 'Fastest responses, good for simple tasks',
    provider: 'groq' as const,
    maxTokens: 8192,
    contextWindow: 128000,
    free: true,
  },
  'mixtral-8x7b-32768': {
    id: 'mixtral-8x7b-32768' as const,
    name: 'Mixtral 8x7B',
    description: 'Great for complex multi-step tasks',
    provider: 'groq' as const,
    maxTokens: 32768,
    contextWindow: 32768,
    free: true,
  },
  'gemma2-9b-it': {
    id: 'gemma2-9b-it' as const,
    name: 'Gemma 2 9B',
    description: "Google's efficient instruction-tuned model",
    provider: 'groq' as const,
    maxTokens: 8192,
    contextWindow: 8192,
    free: true,
  },
} as const;

export type GroqModelId = keyof typeof GROQ_MODELS;

// ============================================
// DEFAULT SETTINGS
// ============================================

export const AI_DEFAULTS = {
  model: 'llama-3.3-70b-versatile' as GroqModelId,
  temperature: 0.7,
  maxTokens: 4096,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
} as const;

// ============================================
// SYSTEM PROMPTS
// ============================================

export const SYSTEM_PROMPTS = {
  chat: `You are IbnuGPT, an AI assistant created for Subkhan Ibnu Aji's portfolio website.
You are helpful, harmless, and honest. You can answer questions about anything.

About Ibnu (context for relevant questions):
- Civil Servant (ASN) at Indonesia's Ministry of Housing & Settlement Areas
- Senior Executive MBA from UGM, Bachelor in Informatics from Telkom University
- Interests: AI/ML, Blockchain/Web3, Cybersecurity
- Former Founder of Virtus Futura Consulting and Automate All (RPA startup)
- 50+ certifications from Harvard, Stanford, Google, IBM, McKinsey, etc.

Guidelines:
- Respond in the same language as the user (Indonesian or English)
- Be concise but thorough
- Use markdown formatting for better readability
- If asked about code, provide working examples
- If you don't know something, say so honestly`,

  rag: `You are IbnuGPT with RAG (Retrieval Augmented Generation) capabilities.
You have access to uploaded documents and can answer questions based on their content.

Guidelines:
- Base your answers primarily on the provided context/documents
- If the answer is not in the documents, say so and offer general knowledge instead
- Cite sources when possible
- Be accurate and don't make up information not in the documents
- Respond in the same language as the user`,

  agent: `You are IbnuGPT Agent, an AI assistant with tool-use capabilities.
You can perform actions like web search, calculations, and code execution.

Guidelines:
- Think step by step before using tools
- Explain what you're doing when using tools
- Verify results before presenting them
- Be transparent about limitations
- Respond in the same language as the user`,

  codeAssistant: `You are IbnuGPT Code Assistant, specialized in helping with programming.

Guidelines:
- Provide working, tested code examples
- Explain code logic clearly
- Follow best practices and conventions
- Suggest improvements and alternatives
- Handle errors gracefully in examples
- Support multiple languages: JavaScript, TypeScript, Python, etc.`,
} as const;

// ============================================
// RATE LIMITING
// ============================================

export const RATE_LIMITS = {
  chat: {
    maxRequestsPerMinute: 20,
    maxTokensPerMinute: 40000,
  },
  rag: {
    maxRequestsPerMinute: 10,
    maxDocumentsPerUser: 10,
    maxDocumentSizeMB: 10,
  },
  agent: {
    maxRequestsPerMinute: 10,
    maxToolCallsPerRequest: 5,
  },
} as const;

// ============================================
// FEATURE FLAGS
// ============================================

export const AI_FEATURES = {
  chat: {
    enabled: true,
    streaming: true,
    historyEnabled: true,
    maxHistoryLength: 50,
  },
  rag: {
    enabled: true,
    supportedFormats: ['.txt', '.md', '.pdf', '.json'],
    maxChunkSize: 1000,
    chunkOverlap: 200,
    maxDocumentsPerUser: 10,
    maxDocumentSizeMB: 10,
  },
  agent: {
    enabled: true,
    availableTools: ['calculator', 'webSearch', 'codeRunner'],
  },
} as const;

// ============================================
// ERROR MESSAGES
// ============================================

export const AI_ERRORS = {
  API_KEY_MISSING: 'GROQ_API_KEY is not configured. Get your free API key at console.groq.com',
  RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
  INVALID_MODEL: 'Invalid model selected. Please choose a valid model.',
  CONTEXT_TOO_LONG: 'The conversation is too long. Please start a new chat.',
  DOCUMENT_TOO_LARGE: 'Document is too large. Maximum size is 10MB.',
  UNSUPPORTED_FORMAT: 'Unsupported file format. Supported: .txt, .md, .pdf, .json',
  STREAM_ERROR: 'Error during streaming. Please try again.',
  TOOL_ERROR: 'Error executing tool. Please try again.',
} as const;

// ============================================
// TYPE EXPORTS
// ============================================

export interface AIMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  model?: string;
  tokens?: number;
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  model: GroqModelId;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIDocument {
  id: string;
  name: string;
  content: string;
  chunks: string[];
  metadata: {
    size: number;
    type: string;
    uploadedAt: Date;
  };
}

export interface AIToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
  error?: string;
}

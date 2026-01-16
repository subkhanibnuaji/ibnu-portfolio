/**
 * LangChain Configuration - Core LLM setup and utilities
 * File: lib/ai/langchain.ts
 *
 * This file provides the core LangChain configuration for all AI features.
 * Supports multiple models via Groq (FREE).
 */

import { ChatGroq } from '@langchain/groq';
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  BaseMessage,
} from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';

import {
  AI_MODELS,
  AI_DEFAULTS,
  SYSTEM_PROMPTS,
  AI_ERRORS,
  type GroqModelId,
  type AIMessage as AIMessageType,
} from './config';

// ============================================
// LLM INITIALIZATION
// ============================================

/**
 * Initialize a Groq LLM instance with specified model
 */
export function initializeGroqLLM(
  modelId: GroqModelId = AI_DEFAULTS.model,
  options?: {
    temperature?: number;
    maxTokens?: number;
    streaming?: boolean;
  }
) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(AI_ERRORS.API_KEY_MISSING);
  }

  const model = AI_MODELS.groq[modelId];
  if (!model) {
    throw new Error(AI_ERRORS.INVALID_MODEL);
  }

  return new ChatGroq({
    model: model.id,
    apiKey,
    temperature: options?.temperature ?? AI_DEFAULTS.temperature,
    maxTokens: options?.maxTokens ?? AI_DEFAULTS.maxTokens,
    streaming: options?.streaming ?? true,
  });
}

// ============================================
// MESSAGE CONVERSION
// ============================================

/**
 * Convert our message format to LangChain format
 */
export function convertToLangChainMessages(
  messages: AIMessageType[],
  systemPrompt?: string
): BaseMessage[] {
  const langchainMessages: BaseMessage[] = [];

  // Add system prompt if provided
  if (systemPrompt) {
    langchainMessages.push(new SystemMessage(systemPrompt));
  }

  // Convert each message
  for (const msg of messages) {
    if (msg.role === 'user') {
      langchainMessages.push(new HumanMessage(msg.content));
    } else if (msg.role === 'assistant') {
      langchainMessages.push(new AIMessage(msg.content));
    } else if (msg.role === 'system') {
      langchainMessages.push(new SystemMessage(msg.content));
    }
  }

  return langchainMessages;
}

// ============================================
// CHAT CHAINS
// ============================================

/**
 * Create a basic chat chain
 */
export function createChatChain(
  modelId: GroqModelId = AI_DEFAULTS.model,
  systemPrompt: string = SYSTEM_PROMPTS.chat
) {
  const llm = initializeGroqLLM(modelId, { streaming: true });

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', systemPrompt],
    new MessagesPlaceholder('history'),
    ['human', '{input}'],
  ]);

  return prompt.pipe(llm).pipe(new StringOutputParser());
}

/**
 * Create a RAG-enabled chat chain
 */
export function createRAGChain(
  modelId: GroqModelId = AI_DEFAULTS.model,
  systemPrompt: string = SYSTEM_PROMPTS.rag
) {
  const llm = initializeGroqLLM(modelId, { streaming: true });

  const ragPrompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `${systemPrompt}

Context from documents:
{context}`,
    ],
    new MessagesPlaceholder('history'),
    ['human', '{input}'],
  ]);

  return ragPrompt.pipe(llm).pipe(new StringOutputParser());
}

/**
 * Create a code assistant chain
 */
export function createCodeAssistantChain(
  modelId: GroqModelId = AI_DEFAULTS.model
) {
  const llm = initializeGroqLLM(modelId, {
    streaming: true,
    temperature: 0.3, // Lower temperature for code
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', SYSTEM_PROMPTS.codeAssistant],
    new MessagesPlaceholder('history'),
    ['human', '{input}'],
  ]);

  return prompt.pipe(llm).pipe(new StringOutputParser());
}

// ============================================
// STREAMING UTILITIES
// ============================================

/**
 * Stream response from LLM and yield chunks
 */
export async function* streamChatResponse(
  messages: AIMessageType[],
  modelId: GroqModelId = AI_DEFAULTS.model,
  systemPrompt: string = SYSTEM_PROMPTS.chat
): AsyncGenerator<string> {
  const llm = initializeGroqLLM(modelId, { streaming: true });
  const langchainMessages = convertToLangChainMessages(messages, systemPrompt);

  const stream = await llm.stream(langchainMessages);

  for await (const chunk of stream) {
    const content = chunk.content;
    if (typeof content === 'string' && content) {
      yield content;
    }
  }
}

/**
 * Stream RAG response with context
 */
export async function* streamRAGResponse(
  messages: AIMessageType[],
  context: string,
  modelId: GroqModelId = AI_DEFAULTS.model
): AsyncGenerator<string> {
  const llm = initializeGroqLLM(modelId, { streaming: true });

  const systemPromptWithContext = `${SYSTEM_PROMPTS.rag}

Context from uploaded documents:
${context}`;

  const langchainMessages = convertToLangChainMessages(
    messages,
    systemPromptWithContext
  );

  const stream = await llm.stream(langchainMessages);

  for await (const chunk of stream) {
    const content = chunk.content;
    if (typeof content === 'string' && content) {
      yield content;
    }
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get available models list
 */
export function getAvailableModels() {
  return Object.values(AI_MODELS.groq).map((model) => ({
    id: model.id,
    name: model.name,
    description: model.description,
    free: model.free,
  }));
}

/**
 * Validate model ID
 */
export function isValidModel(modelId: string): modelId is GroqModelId {
  return modelId in AI_MODELS.groq;
}

/**
 * Estimate token count (rough approximation)
 */
export function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token for English
  return Math.ceil(text.length / 4);
}

/**
 * Truncate messages to fit context window
 */
export function truncateMessages(
  messages: AIMessageType[],
  maxTokens: number
): AIMessageType[] {
  let totalTokens = 0;
  const truncated: AIMessageType[] = [];

  // Keep messages from newest to oldest until we hit the limit
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    const msgTokens = estimateTokens(msg.content);

    if (totalTokens + msgTokens > maxTokens) {
      break;
    }

    truncated.unshift(msg);
    totalTokens += msgTokens;
  }

  return truncated;
}

// ============================================
// EXPORTS
// ============================================

// Re-export LangChain utilities (excluding AIMessage to avoid collision with config.ts)
export {
  HumanMessage,
  SystemMessage,
  ChatPromptTemplate,
  MessagesPlaceholder,
  StringOutputParser,
};

// Export AIMessage as LangChainAIMessage to avoid collision with config.ts AIMessage type
export { AIMessage as LangChainAIMessage } from '@langchain/core/messages';

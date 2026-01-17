/**
 * AI Library Index
 * File: lib/ai/index.ts
 *
 * Central export point for all AI utilities.
 * Import from '@/lib/ai' instead of individual files.
 */

// Configuration
export * from './config';

// LangChain utilities (excluding AIMessage to avoid collision with config.ts)
export {
  initializeGroqLLM,
  convertToLangChainMessages,
  createChatChain,
  createRAGChain,
  createCodeAssistantChain,
  streamChatResponse,
  streamRAGResponse,
  getAvailableModels,
  isValidModel,
  estimateTokens,
  truncateMessages,
  HumanMessage,
  SystemMessage,
  ChatPromptTemplate,
  MessagesPlaceholder,
  StringOutputParser,
} from './langchain';

// RAG utilities
export * from './rag';

// Agent utilities
export * from './agent';

// Telegram bot utilities
export * from './telegram';

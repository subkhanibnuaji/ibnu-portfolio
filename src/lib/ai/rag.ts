/**
 * RAG (Retrieval Augmented Generation) Utilities
 * File: lib/ai/rag.ts
 *
 * Provides document processing and retrieval capabilities for RAG.
 * Uses in-memory vector store for simplicity (no external DB needed).
 */

import { AI_FEATURES, AI_ERRORS, type AIDocument } from './config';

// ============================================
// DOCUMENT PROCESSING
// ============================================

/**
 * Split text into chunks with overlap
 */
export function splitTextIntoChunks(
  text: string,
  chunkSize: number = AI_FEATURES.rag.maxChunkSize,
  overlap: number = AI_FEATURES.rag.chunkOverlap
): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    let chunk = text.slice(start, end);

    // Try to end at a sentence boundary
    if (end < text.length) {
      const lastPeriod = chunk.lastIndexOf('.');
      const lastNewline = chunk.lastIndexOf('\n');
      const breakPoint = Math.max(lastPeriod, lastNewline);

      if (breakPoint > chunkSize / 2) {
        chunk = chunk.slice(0, breakPoint + 1);
      }
    }

    chunks.push(chunk.trim());
    start = start + chunk.length - overlap;
  }

  return chunks.filter((chunk) => chunk.length > 0);
}

/**
 * Process uploaded document
 */
export function processDocument(
  name: string,
  content: string,
  type: string
): AIDocument {
  // Validate file type
  const extension = `.${type.split('/').pop()?.toLowerCase()}`;
  if (!(AI_FEATURES.rag.supportedFormats as readonly string[]).includes(extension)) {
    throw new Error(AI_ERRORS.UNSUPPORTED_FORMAT);
  }

  // Split into chunks
  const chunks = splitTextIntoChunks(content);

  return {
    id: generateDocumentId(),
    name,
    content,
    chunks,
    metadata: {
      size: content.length,
      type,
      uploadedAt: new Date(),
    },
  };
}

/**
 * Generate unique document ID
 */
function generateDocumentId(): string {
  return `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================
// IN-MEMORY VECTOR STORE
// ============================================

interface VectorEntry {
  id: string;
  documentId: string;
  chunk: string;
  embedding: number[];
}

// Simple in-memory store (resets on server restart)
const vectorStore: Map<string, VectorEntry[]> = new Map();

/**
 * Simple text embedding using TF-IDF-like approach
 * (For production, use a real embedding model like OpenAI or HuggingFace)
 */
function createSimpleEmbedding(text: string): number[] {
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);
  const wordFreq = new Map<string, number>();

  // Count word frequencies
  for (const word of words) {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  }

  // Create a simple vector (hash-based for consistency)
  const vector: number[] = new Array(256).fill(0);

  for (const [word, freq] of wordFreq) {
    const hash = simpleHash(word) % 256;
    vector[hash] += freq / words.length;
  }

  // Normalize
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < vector.length; i++) {
      vector[i] /= magnitude;
    }
  }

  return vector;
}

/**
 * Simple hash function for strings
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude > 0 ? dotProduct / magnitude : 0;
}

// ============================================
// VECTOR STORE OPERATIONS
// ============================================

/**
 * Add document to vector store
 */
export function addDocumentToStore(
  sessionId: string,
  document: AIDocument
): void {
  const entries: VectorEntry[] = document.chunks.map((chunk, index) => ({
    id: `${document.id}_chunk_${index}`,
    documentId: document.id,
    chunk,
    embedding: createSimpleEmbedding(chunk),
  }));

  const existing = vectorStore.get(sessionId) || [];
  vectorStore.set(sessionId, [...existing, ...entries]);
}

/**
 * Remove document from vector store
 */
export function removeDocumentFromStore(
  sessionId: string,
  documentId: string
): void {
  const entries = vectorStore.get(sessionId) || [];
  const filtered = entries.filter((e) => e.documentId !== documentId);
  vectorStore.set(sessionId, filtered);
}

/**
 * Clear all documents for a session
 */
export function clearSessionStore(sessionId: string): void {
  vectorStore.delete(sessionId);
}

/**
 * Retrieve relevant chunks for a query
 */
export function retrieveRelevantChunks(
  sessionId: string,
  query: string,
  topK: number = 5
): string[] {
  const entries = vectorStore.get(sessionId) || [];

  if (entries.length === 0) {
    return [];
  }

  const queryEmbedding = createSimpleEmbedding(query);

  // Calculate similarities
  const similarities = entries.map((entry) => ({
    chunk: entry.chunk,
    score: cosineSimilarity(queryEmbedding, entry.embedding),
  }));

  // Sort by similarity and return top K
  similarities.sort((a, b) => b.score - a.score);

  return similarities.slice(0, topK).map((s) => s.chunk);
}

/**
 * Get context for RAG query
 */
export function getRAGContext(
  sessionId: string,
  query: string,
  maxTokens: number = 2000
): string {
  const chunks = retrieveRelevantChunks(sessionId, query, 5);

  if (chunks.length === 0) {
    return 'No relevant documents found.';
  }

  // Combine chunks up to token limit
  let context = '';
  let currentTokens = 0;

  for (const chunk of chunks) {
    const chunkTokens = Math.ceil(chunk.length / 4); // Rough estimate

    if (currentTokens + chunkTokens > maxTokens) {
      break;
    }

    context += chunk + '\n\n---\n\n';
    currentTokens += chunkTokens;
  }

  return context.trim();
}

// ============================================
// FILE PARSING
// ============================================

/**
 * Parse text from various file formats
 */
export async function parseFileContent(
  file: File
): Promise<{ content: string; type: string }> {
  const type = file.type || 'text/plain';
  const extension = file.name.split('.').pop()?.toLowerCase();

  // Check size
  if (file.size > AI_FEATURES.rag.maxDocumentSizeMB * 1024 * 1024) {
    throw new Error(AI_ERRORS.DOCUMENT_TOO_LARGE);
  }

  // Handle different formats
  switch (extension) {
    case 'txt':
    case 'md':
      return {
        content: await file.text(),
        type,
      };

    case 'json':
      const jsonContent = await file.text();
      return {
        content: JSON.stringify(JSON.parse(jsonContent), null, 2),
        type,
      };

    case 'pdf':
      // For PDF, we'd need a PDF parsing library
      // For now, return a placeholder
      return {
        content: `[PDF parsing not implemented. File: ${file.name}]`,
        type,
      };

    default:
      throw new Error(AI_ERRORS.UNSUPPORTED_FORMAT);
  }
}

// ============================================
// EXPORTS
// ============================================

export type { AIDocument };

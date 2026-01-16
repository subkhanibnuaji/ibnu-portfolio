/**
 * RAG System Page
 * File: app/ai-tools/rag/page.tsx
 *
 * Document upload and chat with context retrieval.
 * Uses isolated components and API routes.
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatMessage,
  ChatInput,
  StopButton,
  ModelSelector,
  DocumentUpload,
  type UploadedDocument,
} from '@/components/ai';
import { GROQ_MODELS, AI_DEFAULTS, type GroqModelId } from '@/lib/ai/config';

// Simplified message type for this component
interface ChatMessageType {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function RAGPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<GroqModelId>(AI_DEFAULTS.model);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [sessionId] = useState(() => `rag-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  const handleDocumentUpload = useCallback(
    async (files: File[]): Promise<void> => {
      for (const file of files) {
        // Add uploading state
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        setDocuments(prev => [...prev, {
          id: tempId,
          name: file.name,
          size: file.size,
          type: file.type || 'text/plain',
          status: 'uploading' as const,
        }]);

        try {
          const content = await file.text();

          const response = await fetch('/api/ai/rag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              action: 'upload',
              document: {
                name: file.name,
                content,
                type: file.type || 'text/plain',
              },
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Upload failed');
          }

          const result = await response.json();

          // Update with real data
          setDocuments(prev => prev.map(doc =>
            doc.id === tempId
              ? {
                  id: result.document.id,
                  name: result.document.name,
                  size: result.document.size,
                  type: result.document.type || 'text/plain',
                  status: 'ready' as const,
                  chunks: result.document.chunks,
                }
              : doc
          ));
        } catch (err) {
          // Mark as error
          setDocuments(prev => prev.map(doc =>
            doc.id === tempId
              ? { ...doc, status: 'error' as const, error: err instanceof Error ? err.message : 'Upload failed' }
              : doc
          ));
        }
      }
    },
    [sessionId]
  );

  const handleDocumentRemove = useCallback(
    async (docId: string) => {
      await fetch('/api/ai/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action: 'remove',
          documentId: docId,
        }),
      });

      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    },
    [sessionId]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!input.trim() || isLoading) return;

      const userMessage: ChatMessageType = { id: `user-${Date.now()}`, role: 'user', content: input.trim() };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');
      setError(null);
      setIsLoading(true);

      // Add placeholder assistant message
      const assistantId = `assistant-${Date.now()}`;
      setMessages([...newMessages, { id: assistantId, role: 'assistant', content: '' }]);

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch('/api/ai/rag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            messages: newMessages,
            model,
            action: 'query',
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get response');
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response stream');

        const decoder = new TextDecoder();
        let assistantContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  assistantContent += parsed.content;
                  setMessages([
                    ...newMessages,
                    { id: assistantId, role: 'assistant', content: assistantContent },
                  ]);
                }
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
              } catch {
                // Skip invalid JSON lines
              }
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('RAG error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setMessages(newMessages);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [input, isLoading, messages, model, sessionId]
  );

  const handleClear = useCallback(async () => {
    // Clear documents on server
    await fetch('/api/ai/rag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, action: 'clear' }),
    });

    setMessages([]);
    setDocuments([]);
    setError(null);
  }, [sessionId]);

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-4">
      {/* Sidebar - Document Management */}
      <div className="w-80 flex-shrink-0 overflow-y-auto rounded-xl border border-gray-700/50 bg-gray-800/30 p-4">
        <h2 className="mb-4 text-lg font-semibold text-white">Documents</h2>
        <DocumentUpload
          onUpload={handleDocumentUpload}
          onRemove={handleDocumentRemove}
          documents={documents}
        />
        {documents.length > 0 && (
          <div className="mt-4 rounded-lg bg-gray-700/30 p-3">
            <p className="text-sm text-gray-300">
              <span className="font-medium">{documents.length}</span> document(s) loaded
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Total chunks:{' '}
              {documents.reduce((sum, d) => sum + (d.chunks || 0), 0)}
            </p>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">RAG System</h1>
            <p className="text-sm text-gray-400">
              Chat with context from your documents
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ModelSelector
              value={model}
              onChange={(m) => setModel(m as GroqModelId)}
              disabled={isLoading}
            />
            {(messages.length > 0 || documents.length > 0) && (
              <button
                onClick={handleClear}
                className="rounded-lg border border-gray-600 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 disabled:opacity-50"
                disabled={isLoading}
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-gray-700/50 bg-gray-800/30 p-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-4">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-lg font-semibold text-white">
                {documents.length > 0
                  ? 'Ask About Your Documents'
                  : 'Upload Documents First'}
              </h2>
              <p className="max-w-md text-sm text-gray-400">
                {documents.length > 0
                  ? 'Your documents are loaded. Ask questions and the AI will use context from them to answer.'
                  : 'Upload PDF, TXT, MD, or other text files in the sidebar. Then ask questions about their content.'}
              </p>
              {documents.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {[
                    'Summarize the documents',
                    'What are the key points?',
                    'Find information about...',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="rounded-full bg-gray-700/50 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChatMessage
                    id={message.id || `msg-${index}`}
                    role={message.role}
                    content={message.content}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Input */}
        <div className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <StopButton onStop={handleStop} />
            </div>
          ) : (
            <ChatInput
              onSend={(message) => {
                if (!message.trim() || isLoading) return;

                const userMessage: ChatMessageType = { id: `user-${Date.now()}`, role: 'user', content: message.trim() };
                const newMessages = [...messages, userMessage];
                setMessages(newMessages);
                setInput('');
                setError(null);
                setIsLoading(true);

                const assistantId = `assistant-${Date.now()}`;
                setMessages([...newMessages, { id: assistantId, role: 'assistant', content: '' }]);

                const abortController = new AbortController();
                abortControllerRef.current = abortController;

                fetch('/api/ai/rag', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    sessionId,
                    messages: newMessages,
                    model,
                    action: 'query',
                  }),
                  signal: abortController.signal,
                }).then(async (response) => {
                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to get response');
                  }

                  const reader = response.body?.getReader();
                  if (!reader) throw new Error('No response stream');

                  const decoder = new TextDecoder();
                  let assistantContent = '';

                  while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                      if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                          const parsed = JSON.parse(data);
                          if (parsed.content) {
                            assistantContent += parsed.content;
                            setMessages([
                              ...newMessages,
                              { id: assistantId, role: 'assistant', content: assistantContent },
                            ]);
                          }
                          if (parsed.error) {
                            throw new Error(parsed.error);
                          }
                        } catch {
                          // Skip invalid JSON lines
                        }
                      }
                    }
                  }
                }).catch((err) => {
                  if (err instanceof Error && err.name === 'AbortError') {
                    return;
                  }
                  console.error('RAG error:', err);
                  setError(err instanceof Error ? err.message : 'An error occurred');
                  setMessages(newMessages);
                }).finally(() => {
                  setIsLoading(false);
                  abortControllerRef.current = null;
                });
              }}
              placeholder={
                documents.length > 0
                  ? 'Ask about your documents...'
                  : 'Upload documents first to enable RAG...'
              }
              disabled={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

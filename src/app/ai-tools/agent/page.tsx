/**
 * AI Agent Page
 * File: app/ai-tools/agent/page.tsx
 *
 * AI with tool execution capabilities.
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
  ToolOutput,
  ToolsList,
} from '@/components/ai';
import { GROQ_MODELS, AI_DEFAULTS, type GroqModelId } from '@/lib/ai/config';
import { getToolsList } from '@/lib/ai/agent';

// Get tools list at module level
const availableTools = getToolsList();

interface ToolExecution {
  tool: string;
  input: Record<string, unknown>;
  result: unknown;
}

interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
  toolExecutions?: ToolExecution[];
}

export default function AgentPage() {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<GroqModelId>(AI_DEFAULTS.model);
  const [error, setError] = useState<string | null>(null);
  const [currentToolExecutions, setCurrentToolExecutions] = useState<ToolExecution[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentToolExecutions, scrollToBottom]);

  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  const handleSend = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading) return;

      const userMessage: AgentMessage = { role: 'user', content: message.trim() };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setError(null);
      setIsLoading(true);
      setCurrentToolExecutions([]);

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch('/api/ai/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages.map(({ role, content }) => ({ role, content })),
            model,
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
        const toolExecutions: ToolExecution[] = [];

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

                if (parsed.type === 'thinking') {
                  // Show thinking in UI (optional)
                } else if (parsed.type === 'tool_call') {
                  const execution: ToolExecution = {
                    tool: parsed.tool,
                    input: parsed.input,
                    result: null,
                  };
                  toolExecutions.push(execution);
                  setCurrentToolExecutions([...toolExecutions]);
                } else if (parsed.type === 'tool_result') {
                  const lastExecution = toolExecutions[toolExecutions.length - 1];
                  if (lastExecution) {
                    lastExecution.result = parsed.result;
                    setCurrentToolExecutions([...toolExecutions]);
                  }
                } else if (parsed.type === 'response') {
                  assistantContent = parsed.content || '';
                  setMessages([
                    ...newMessages,
                    {
                      role: 'assistant',
                      content: assistantContent,
                      toolExecutions: [...toolExecutions],
                    },
                  ]);
                } else if (parsed.type === 'error') {
                  throw new Error(parsed.error);
                }
              } catch {
                // Skip invalid JSON lines
              }
            }
          }
        }

        // Final update
        if (assistantContent || toolExecutions.length > 0) {
          setMessages([
            ...newMessages,
            {
              role: 'assistant',
              content: assistantContent,
              toolExecutions,
            },
          ]);
        }
        setCurrentToolExecutions([]);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('Agent error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [isLoading, messages, model]
  );

  const handleClear = useCallback(() => {
    setMessages([]);
    setError(null);
    setCurrentToolExecutions([]);
  }, []);

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-4">
      {/* Sidebar - Available Tools */}
      <div className="w-80 flex-shrink-0 overflow-y-auto rounded-xl border border-gray-700/50 bg-gray-800/30 p-4">
        <h2 className="mb-4 text-lg font-semibold text-white">Available Tools</h2>
        <ToolsList tools={availableTools} />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Agent</h1>
            <p className="text-sm text-gray-400">
              AI with tool execution capabilities
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ModelSelector
              value={model}
              onChange={(m) => setModel(m as GroqModelId)}
              disabled={isLoading}
            />
            {messages.length > 0 && (
              <button
                onClick={handleClear}
                className="rounded-lg border border-gray-600 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 disabled:opacity-50"
                disabled={isLoading}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-gray-700/50 bg-gray-800/30 p-4">
          {messages.length === 0 && currentToolExecutions.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-500 p-4">
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
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-lg font-semibold text-white">
                AI Agent Ready
              </h2>
              <p className="max-w-md text-sm text-gray-400">
                This AI can use tools to help answer your questions. Try asking
                for calculations, current time, weather, or text analysis.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {[
                  'Calculate 15% of 850',
                  'What time is it?',
                  "What's the weather in Tokyo?",
                  'Analyze: Hello World',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSend(suggestion)}
                    className="rounded-full bg-gray-700/50 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Tool executions */}
                    {message.toolExecutions && message.toolExecutions.length > 0 && (
                      <div className="mb-2 space-y-2">
                        {message.toolExecutions.map((exec, i) => (
                          <ToolOutput
                            key={i}
                            tool={exec.tool}
                            input={exec.input}
                            result={exec.result}
                          />
                        ))}
                      </div>
                    )}
                    <ChatMessage
                      id={`msg-${index}`}
                      role={message.role}
                      content={message.content}
                      isStreaming={false}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Current tool executions (while loading) */}
              {isLoading && currentToolExecutions.length > 0 && (
                <div className="space-y-2">
                  {currentToolExecutions.map((exec, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <ToolOutput
                        tool={exec.tool}
                        input={exec.input}
                        result={exec.result}
                        isLoading={exec.result === null}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Loading indicator */}
              {isLoading && currentToolExecutions.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 py-4 text-gray-400"
                >
                  <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
                  <span className="text-sm">Agent is thinking...</span>
                </motion.div>
              )}
            </>
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
              onSend={handleSend}
              placeholder="Ask the agent to do something..."
              disabled={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

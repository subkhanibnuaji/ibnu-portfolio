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
import { Command, Sparkles, Zap } from 'lucide-react';

// Get tools list at module level
const availableTools = getToolsList();

// Quick prompts for each tool
const TOOL_PROMPTS: Record<string, string> = {
  calculator: 'Calculate: ',
  current_time: 'What time is it in ',
  weather: 'Weather in ',
  convert_unit: 'Convert ',
  date_calculator: 'How many days until ',
  shorten_url: 'Shorten this URL: ',
  generate_image: 'Generate an image of ',
  generate_qr: 'Create a QR code for ',
  generate_meme: 'Make a meme about ',
  generate_pdf: 'Create a PDF about ',
  generate_ppt: 'Create a presentation about ',
  generate_lorem: 'Generate lorem ipsum text',
  generate_password: 'Generate a secure password',
  generate_colors: 'Generate a color palette for ',
  generate_hashtags: 'Generate hashtags for ',
  generate_code: 'Write code to ',
  emoji_picker: 'Find emojis for ',
  wikipedia_search: 'Search Wikipedia for ',
  define_word: 'Define the word: ',
  random_fact: 'Tell me a random fact about ',
  quote_of_day: 'Give me a motivational quote',
  crypto_price: 'Price of ',
  translate: 'Translate to Indonesian: ',
  text_analysis: 'Analyze this text: ',
  tell_joke: 'Tell me a joke about ',
};

interface ToolExecution {
  tool: string;
  input: Record<string, unknown>;
  result: unknown;
}

interface AgentMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolExecutions?: ToolExecution[];
}

export default function AgentPage() {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<GroqModelId>(AI_DEFAULTS.model);
  const [error, setError] = useState<string | null>(null);
  const [currentToolExecutions, setCurrentToolExecutions] = useState<ToolExecution[]>([]);
  const [showToolPicker, setShowToolPicker] = useState(false);
  const [toolSearch, setToolSearch] = useState('');
  const [inputValue, setInputValue] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter tools based on search
  const filteredTools = toolSearch
    ? availableTools.filter(t =>
        t.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
        t.description.toLowerCase().includes(toolSearch.toLowerCase())
      )
    : availableTools;

  // Handle tool selection
  const selectTool = useCallback((toolName: string) => {
    const prompt = TOOL_PROMPTS[toolName] || `Use ${toolName}: `;
    setInputValue(prompt);
    setShowToolPicker(false);
    setToolSearch('');
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

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

  const handleSubmit = useCallback(
    async (messageOrEvent?: string | React.FormEvent) => {
      // Handle both string message and form event
      const message = typeof messageOrEvent === 'string' ? messageOrEvent : input;
      if (typeof messageOrEvent !== 'string') {
        messageOrEvent?.preventDefault?.();
      }
      if (!message.trim() || isLoading) return;

      const userMessage: AgentMessage = { id: `user-${Date.now()}`, role: 'user', content: message.trim() };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');
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
                      id: `assistant-${Date.now()}`,
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
              id: `assistant-final-${Date.now()}`,
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
    [input, isLoading, messages, model]
  );

  const handleClear = useCallback(() => {
    setMessages([]);
    setError(null);
    setCurrentToolExecutions([]);
    setInputValue('');
  }, []);

  // Keyboard shortcut for tool picker
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // "/" to open tool picker
      if (e.key === '/' && !showToolPicker && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setShowToolPicker(true);
      }
      // Escape to close
      if (e.key === 'Escape') {
        setShowToolPicker(false);
        setToolSearch('');
      }
      // Ctrl/Cmd + T to toggle tool picker
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        setShowToolPicker(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showToolPicker]);

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-4">
      {/* Tool Picker Modal */}
      <AnimatePresence>
        {showToolPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20"
            onClick={() => { setShowToolPicker(false); setToolSearch(''); }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="w-full max-w-2xl rounded-xl border border-gray-700 bg-gray-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-gray-700 p-4">
                <Command className="h-5 w-5 text-cyan-400" />
                <input
                  type="text"
                  placeholder="Search tools... (type to filter)"
                  value={toolSearch}
                  onChange={(e) => setToolSearch(e.target.value)}
                  className="flex-1 bg-transparent text-white outline-none placeholder:text-gray-500"
                  autoFocus
                />
                <kbd className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-400">ESC</kbd>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                <div className="grid grid-cols-2 gap-2">
                  {filteredTools.map((tool) => (
                    <button
                      key={tool.name}
                      onClick={() => selectTool(tool.name)}
                      className="flex items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-700/70 group"
                    >
                      <div className="rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 p-2 group-hover:from-cyan-500/30 group-hover:to-purple-500/30">
                        <Zap className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{tool.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{tool.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
                {filteredTools.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No tools found matching &quot;{toolSearch}&quot;</p>
                )}
              </div>
              <div className="border-t border-gray-700 p-3">
                <p className="text-xs text-gray-500 text-center">
                  Press <kbd className="rounded bg-gray-700 px-1.5 py-0.5 text-gray-400">/</kbd> anytime or{' '}
                  <kbd className="rounded bg-gray-700 px-1.5 py-0.5 text-gray-400">Ctrl+T</kbd> to open
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar - Available Tools */}
      <div className="w-80 flex-shrink-0 overflow-y-auto rounded-xl border border-gray-700/50 bg-gray-800/30 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">25 Tools</h2>
          <button
            onClick={() => setShowToolPicker(true)}
            className="rounded-lg bg-cyan-500/20 p-1.5 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
            title="Quick pick (/ or Ctrl+T)"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
        <ToolsList tools={availableTools} />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Agent</h1>
            <p className="text-sm text-gray-400">
              25 tools at your service
              <span className="ml-2 text-gray-600">|</span>
              <span className="ml-2 text-xs text-gray-500">Press / for quick tool picker</span>
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
                    onClick={() => setInput(suggestion)}
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
                      id={message.id}
                      role={message.role}
                      content={message.content}
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
              placeholder="Ask the agent to do something... (press / for tools)"
              disabled={isLoading}
              initialValue={inputValue}
              onValueChange={setInputValue}
            />
          )}
        </div>
      </div>
    </div>
  );
}

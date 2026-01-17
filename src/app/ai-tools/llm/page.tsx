/**
 * LLM Chat Page
 * File: app/ai-tools/llm/page.tsx
 *
 * Interactive chat with AI using Groq LLMs.
 * Uses isolated components and API routes.
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage, ChatInput, StopButton, ModelSelector } from '@/components/ai';
import { GROQ_MODELS, AI_DEFAULTS, type GroqModelId } from '@/lib/ai/config';
import { exportToMarkdown, exportToPDF, exportToJSON } from '@/lib/ai/file-generators';
import { Search, X, History, Trash2 } from 'lucide-react';

// Simple message interface for this page
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Storage key for chat history
const STORAGE_KEY = 'ibnugpt_llm_chat_history';
const STORAGE_MODEL_KEY = 'ibnugpt_llm_model';

export default function LLMChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<GroqModelId>(AI_DEFAULTS.model);
  const [error, setError] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [savedChats, setSavedChats] = useState<Array<{ id: string; title: string; messages: Message[]; date: string }>>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      const savedModel = localStorage.getItem(STORAGE_MODEL_KEY);

      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
      if (savedModel && GROQ_MODELS[savedModel as GroqModelId]) {
        setModel(savedModel as GroqModelId);
      }

      // Load saved chat sessions
      const chatHistory = localStorage.getItem('ibnugpt_chat_sessions');
      if (chatHistory) {
        setSavedChats(JSON.parse(chatHistory));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [messages]);

  // Save model preference
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MODEL_KEY, model);
    } catch {
      // Ignore localStorage errors
    }
  }, [model]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K: Toggle search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(prev => !prev);
        if (!showSearch) {
          setTimeout(() => searchInputRef.current?.focus(), 100);
        }
      }
      // Ctrl/Cmd + L: Clear chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        if (messages.length > 0 && !isLoading) {
          handleClear();
        }
      }
      // Ctrl/Cmd + H: Show history
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setShowHistory(prev => !prev);
      }
      // Ctrl/Cmd + S: Save current chat
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (messages.length > 0) {
          saveCurrentChat();
        }
      }
      // Escape: Close modals
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowHistory(false);
        setShowExportMenu(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [messages, isLoading, showSearch]);

  const saveCurrentChat = useCallback(() => {
    if (messages.length === 0) return;

    const firstUserMessage = messages.find(m => m.role === 'user');
    const title = firstUserMessage?.content.slice(0, 50) || 'Untitled Chat';

    const newChat = {
      id: Date.now().toString(),
      title: title + (title.length >= 50 ? '...' : ''),
      messages: messages,
      date: new Date().toISOString(),
    };

    const updatedChats = [newChat, ...savedChats].slice(0, 20); // Keep max 20 chats
    setSavedChats(updatedChats);

    try {
      localStorage.setItem('ibnugpt_chat_sessions', JSON.stringify(updatedChats));
    } catch {
      // Ignore errors
    }
  }, [messages, savedChats]);

  const loadSavedChat = useCallback((chat: { messages: Message[] }) => {
    setMessages(chat.messages);
    setShowHistory(false);
  }, []);

  const deleteSavedChat = useCallback((chatId: string) => {
    const updatedChats = savedChats.filter(c => c.id !== chatId);
    setSavedChats(updatedChats);
    try {
      localStorage.setItem('ibnugpt_chat_sessions', JSON.stringify(updatedChats));
    } catch {
      // Ignore errors
    }
  }, [savedChats]);

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

  const handleSend = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading) return;

      const userMessage: Message = { role: 'user', content: message.trim() };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setError(null);
      setIsLoading(true);

      // Add placeholder assistant message
      setMessages([...newMessages, { role: 'assistant', content: '' }]);

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newMessages, model }),
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
                    { role: 'assistant', content: assistantContent },
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
          // User stopped the generation
          return;
        }
        console.error('Chat error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Remove the empty assistant message on error
        setMessages(newMessages);
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
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore errors
    }
  }, []);

  const handleExport = useCallback(
    async (format: 'markdown' | 'pdf' | 'json') => {
      const exportData = {
        title: 'LLM Chat Conversation',
        messages: messages,
        model: GROQ_MODELS[model].name,
        exportedAt: new Date(),
      };

      try {
        if (format === 'markdown') {
          exportToMarkdown(exportData);
        } else if (format === 'pdf') {
          await exportToPDF(exportData);
        } else if (format === 'json') {
          exportToJSON(exportData);
        }
      } catch (err) {
        console.error('Export error:', err);
        setError('Failed to export conversation');
      }

      setShowExportMenu(false);
    },
    [messages, model]
  );

  // Filter messages by search query
  const filteredMessages = searchQuery
    ? messages.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  // Close export menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="w-full max-w-xl rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white outline-none placeholder:text-gray-500"
                  autoFocus
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-400">ESC</kbd>
              </div>
              {searchQuery && (
                <div className="mt-4 max-h-60 overflow-y-auto">
                  {filteredMessages.length > 0 ? (
                    filteredMessages.map((msg, i) => (
                      <div key={i} className="rounded-lg p-2 text-sm text-gray-300 hover:bg-gray-700/50">
                        <span className="font-medium text-cyan-400">{msg.role}:</span>{' '}
                        {msg.content.slice(0, 100)}...
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No messages found</p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="w-full max-w-xl rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <History className="h-5 w-5" /> Chat History
                </h3>
                <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto space-y-2">
                {savedChats.length > 0 ? (
                  savedChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-700/50 group"
                    >
                      <button
                        onClick={() => loadSavedChat(chat)}
                        className="flex-1 text-left"
                      >
                        <p className="text-sm font-medium text-white truncate">{chat.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(chat.date).toLocaleDateString()} - {chat.messages.length} messages
                        </p>
                      </button>
                      <button
                        onClick={() => deleteSavedChat(chat.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No saved chats yet. Press Ctrl+S to save.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">LLM Chat</h1>
          <p className="text-sm text-gray-400">
            Chat with AI using {GROQ_MODELS[model].name}
            <span className="ml-2 text-gray-600">|</span>
            <span className="ml-2 text-xs text-gray-500">
              Ctrl+K search · Ctrl+H history · Ctrl+S save
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button
            onClick={() => setShowSearch(true)}
            className="rounded-lg border border-gray-600 p-2 text-gray-300 transition-colors hover:bg-gray-700"
            title="Search (Ctrl+K)"
          >
            <Search className="h-4 w-4" />
          </button>
          {/* History Button */}
          <button
            onClick={() => setShowHistory(true)}
            className="rounded-lg border border-gray-600 p-2 text-gray-300 transition-colors hover:bg-gray-700"
            title="Chat History (Ctrl+H)"
          >
            <History className="h-4 w-4" />
          </button>
          <ModelSelector
            value={model}
            onChange={(m) => setModel(m as GroqModelId)}
            disabled={isLoading}
          />
          {messages.length > 0 && (
            <>
              {/* Export Button */}
              <div className="relative" ref={exportMenuRef}>
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="rounded-lg border border-gray-600 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <svg
                    className="inline-block h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export
                </button>
                {/* Export Dropdown */}
                <AnimatePresence>
                  {showExportMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-700 bg-gray-800 py-1 shadow-xl z-50"
                    >
                      <button
                        onClick={() => handleExport('markdown')}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export as Markdown
                      </button>
                      <button
                        onClick={() => handleExport('pdf')}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Export as PDF
                      </button>
                      <button
                        onClick={() => handleExport('json')}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Export as JSON
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Clear Button */}
              <button
                onClick={handleClear}
                className="rounded-lg border border-gray-600 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 disabled:opacity-50"
                disabled={isLoading}
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-gray-700/50 bg-gray-800/30 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-4">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-lg font-semibold text-white">
              Start a Conversation
            </h2>
            <p className="max-w-md text-sm text-gray-400">
              Ask anything! This AI is powered by Groq&apos;s ultra-fast inference
              with {GROQ_MODELS[model].name}.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                'What is LangChain?',
                'Explain AI agents',
                'How does RAG work?',
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
                  id={`msg-${index}`}
                  role={message.role}
                  content={message.content}
                  isStreaming={
                    isLoading &&
                    index === messages.length - 1 &&
                    message.role === 'assistant'
                  }
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
            onSend={handleSend}
            placeholder="Type your message..."
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  );
}

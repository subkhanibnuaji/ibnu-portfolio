'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Loader2, Sparkles, User, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTIONS = [
  'What are your main interests?',
  'Tell me about HUB PKP project',
  'What certifications do you have?',
  'What is your crypto trading experience?',
  'What AI technologies do you work with?',
]

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hi! 👋 I'm Ibnu's AI assistant powered by Claude. I can answer questions about his skills, projects, interests in AI/Blockchain/Cybersecurity, or anything else about his portfolio. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent, scrollToBottom])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setStreamingContent('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                fullContent += parsed.content
                setStreamingContent(fullContent)
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setStreamingContent('')
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'I apologize, but I encountered an error. Please try again later.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content:
          "Hi! 👋 I'm Ibnu's AI assistant powered by Claude. How can I help you today?",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 p-4 rounded-full',
          'bg-cyber-gradient shadow-lg shadow-primary/25',
          'hover:scale-110 transition-transform duration-200',
          isOpen && 'hidden'
        )}
      >
        <Bot className="h-6 w-6 text-white" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-cyber-green rounded-full animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed bottom-6 right-6 z-50',
              'w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)]',
              'flex flex-col rounded-2xl overflow-hidden',
              'bg-background/95 backdrop-blur-xl border border-border',
              'shadow-2xl shadow-black/20'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-cyber-gradient flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-cyber-green rounded-full border-2 border-background" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Ibnu AI Assistant</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Powered by Claude
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={clearChat}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                      message.role === 'user'
                        ? 'bg-primary'
                        : 'bg-cyber-gradient'
                    )}
                  >
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-2.5',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Streaming Response */}
              {streamingContent && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyber-gradient flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl px-4 py-2.5 bg-muted">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{streamingContent}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading */}
              {isLoading && !streamingContent && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyber-gradient flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(suggestion)}
                      className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border bg-card/50">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className={cn(
                    'flex-1 px-4 py-2.5 rounded-xl',
                    'bg-muted border-0 outline-none',
                    'text-sm placeholder:text-muted-foreground',
                    'focus:ring-2 focus:ring-primary/20',
                    'disabled:opacity-50'
                  )}
                />
                <Button
                  size="icon"
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

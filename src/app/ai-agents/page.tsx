'use client'

import { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, Send, Loader2, PenTool, Code2, Search,
  Lightbulb, Languages, Sparkles, ArrowLeft,
  Trash2, Copy, Check, User
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

// Agent definitions with their system prompts
const AGENTS = {
  writer: {
    id: 'writer',
    name: 'Writer Agent',
    icon: PenTool,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    specialty: 'Content Creation',
    greeting: "Hi! I'm your Writer Agent. I can help you craft compelling content, articles, social media captions, blog posts, and more. What would you like me to write today?",
  },
  coder: {
    id: 'coder',
    name: 'Coder Agent',
    icon: Code2,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    specialty: 'Programming',
    greeting: "Hello! I'm the Coder Agent. I can help you with programming questions, code review, debugging, and explaining technical concepts. What coding challenge can I help you with?",
  },
  researcher: {
    id: 'researcher',
    name: 'Research Agent',
    icon: Search,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    specialty: 'Analysis',
    greeting: "Greetings! I'm the Research Agent. I specialize in analyzing topics, summarizing information, and providing in-depth insights. What would you like me to research or analyze?",
  },
  creative: {
    id: 'creative',
    name: 'Creative Agent',
    icon: Lightbulb,
    color: 'from-orange-500 to-yellow-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    specialty: 'Ideation',
    greeting: "Hey there! I'm the Creative Agent. I love brainstorming, generating unique ideas, and thinking outside the box. Ready to get creative? Tell me what you're working on!",
  },
  translator: {
    id: 'translator',
    name: 'Translator Agent',
    icon: Languages,
    color: 'from-indigo-500 to-violet-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    specialty: 'Languages',
    greeting: "Hello! I'm the Translator Agent. I can help translate text between languages while preserving meaning and cultural context. What would you like me to translate?",
  },
  assistant: {
    id: 'assistant',
    name: 'General Assistant',
    icon: Bot,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    specialty: 'General',
    greeting: "Hi! I'm your General Assistant. I can help with a wide variety of tasks - from answering questions to helping with daily tasks. How can I assist you today?",
  },
}

type AgentId = keyof typeof AGENTS

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Separate component that uses useSearchParams
function AIAgentsContent() {
  const searchParams = useSearchParams()
  const initialAgent = (searchParams.get('agent') as AgentId) || 'assistant'

  const [selectedAgent, setSelectedAgent] = useState<AgentId>(initialAgent)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const agent = AGENTS[selectedAgent]

  // Initialize with greeting when agent changes
  useEffect(() => {
    setMessages([{
      id: 'greeting',
      role: 'assistant',
      content: AGENTS[selectedAgent].greeting,
      timestamp: new Date(),
    }])
  }, [selectedAgent])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          agentId: selectedAgent,
          history: messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader')

      const assistantMessageId = `assistant-${Date.now()}`
      let assistantContent = ''

      // Add empty assistant message
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }])

      const decoder = new TextDecoder()

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
                assistantContent += parsed.content
                setMessages(prev => prev.map(m =>
                  m.id === assistantMessageId
                    ? { ...m, content: assistantContent }
                    : m
                ))
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }, [input, isLoading, messages, selectedAgent])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([{
      id: 'greeting',
      role: 'assistant',
      content: agent.greeting,
      timestamp: new Date(),
    }])
  }

  const copyMessage = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/#ai-agents"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          AI Agents
        </h1>
        <p className="text-muted-foreground mt-2">
          Chat with specialized AI agents for different tasks
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* Agent Selector Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-3"
        >
          <h2 className="text-sm font-medium text-muted-foreground mb-4">
            Select an Agent
          </h2>
          {Object.values(AGENTS).map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedAgent(a.id as AgentId)}
              className={`w-full p-4 rounded-xl border text-left transition-all duration-300 ${
                selectedAgent === a.id
                  ? `${a.bgColor} ${a.borderColor} border-2`
                  : 'border-border hover:border-primary/30 bg-card/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${a.bgColor} flex items-center justify-center`}>
                  <a.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.specialty}</div>
                </div>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col h-[calc(100vh-200px)] min-h-[500px] rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden"
        >
          {/* Chat Header */}
          <div className={`p-4 border-b border-border bg-gradient-to-r ${agent.color} bg-opacity-10`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${agent.bgColor} flex items-center justify-center`}>
                  <agent.icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-semibold">{agent.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Online
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-primary/10'
                      : agent.bgColor
                  }`}>
                    {message.role === 'user'
                      ? <User className="w-4 h-4" />
                      : <agent.icon className="w-4 h-4" />
                    }
                  </div>

                  {/* Message Content */}
                  <div className={`group relative max-w-[80%] ${
                    message.role === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-muted rounded-tl-sm'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content || (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Thinking...
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Copy Button */}
                    {message.content && message.role === 'assistant' && (
                      <button
                        onClick={() => copyMessage(message.content, message.id)}
                        className="absolute -right-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                      >
                        {copiedId === message.id
                          ? <Check className="w-4 h-4 text-green-500" />
                          : <Copy className="w-4 h-4 text-muted-foreground" />
                        }
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-background/50">
            <div className="flex gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${agent.name}...`}
                className="flex-1 min-h-[44px] max-h-[120px] px-4 py-3 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`px-4 bg-gradient-to-r ${agent.color} hover:opacity-90`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Powered by Groq (Llama 3.3 70B) - Free & Fast
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    </div>
  )
}

export default function AIAgentsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-20">
        <Suspense fallback={<LoadingFallback />}>
          <AIAgentsContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

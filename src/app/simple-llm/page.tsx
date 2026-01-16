'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import {
  Send,
  Bot,
  User,
  Sparkles,
  Trash2,
  Copy,
  Check,
  Loader2,
  ChevronDown,
  Zap,
  Brain,
  MessageSquare,
  ExternalLink
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const models = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', description: 'Most capable, versatile', icon: Brain },
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', description: 'Fast and efficient', icon: Zap },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: 'Great for complex tasks', icon: Sparkles },
  { id: 'gemma2-9b-it', name: 'Gemma 2 9B', description: "Google's efficient model", icon: Bot },
]

const examplePrompts = [
  "Jelaskan apa itu LangChain dalam bahasa sederhana",
  "Buatkan kode Python untuk web scraping",
  "Apa perbedaan antara AI dan Machine Learning?",
  "Bagaimana cara membuat REST API dengan Node.js?",
]

export default function SimpleLLMPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(models[0])
  const [showModelSelect, setShowModelSelect] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const modelSelectRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelSelectRef.current && !modelSelectRef.current.contains(event.target as Node)) {
        setShowModelSelect(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = useCallback(async (e?: React.FormEvent, customInput?: string) => {
    e?.preventDefault()
    const messageContent = customInput || input
    if (!messageContent.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Create assistant message placeholder
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, assistantMessage])

    try {
      const response = await fetch('/api/simple-llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          model: selectedModel.id
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get response')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No reader available')

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
                setMessages(prev => {
                  const updated = [...prev]
                  const lastMessage = updated[updated.length - 1]
                  if (lastMessage.role === 'assistant') {
                    lastMessage.content += parsed.content
                  }
                  return updated
                })
              }
              if (parsed.error) {
                throw new Error(parsed.error)
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => {
        const updated = [...prev]
        const lastMessage = updated[updated.length - 1]
        if (lastMessage.role === 'assistant') {
          lastMessage.content = error instanceof Error
            ? `Error: ${error.message}\n\nTip: Set GROQ_API_KEY in environment variables. Get your free API key at console.groq.com`
            : 'Maaf, terjadi kesalahan. Silakan coba lagi.'
        }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages, selectedModel.id])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const clearChat = () => {
    setMessages([])
  }

  const handleExampleClick = (prompt: string) => {
    setInput(prompt)
    handleSubmit(undefined, prompt)
  }

  return (
    <PageLayout
      title="Simple LLM"
      subtitle="Chat dengan AI menggunakan LangChain - Powered by Groq (FREE)"
      showBadge
      badgeText="LangChain + Groq API (Gratis)"
    >
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyber-purple/10">
                <Brain className="h-5 w-5 text-cyber-purple" />
              </div>
              <div>
                <h3 className="font-semibold">IbnuGPT Chat</h3>
                <p className="text-xs text-muted-foreground">
                  {messages.length} messages • Powered by Groq
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Model Selector */}
              <div className="relative" ref={modelSelectRef}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModelSelect(!showModelSelect)}
                  className="gap-2"
                >
                  <selectedModel.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{selectedModel.name}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>

                <AnimatePresence>
                  {showModelSelect && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-64 glass rounded-lg border border-white/10 overflow-hidden z-50"
                    >
                      {models.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedModel(model)
                            setShowModelSelect(false)
                          }}
                          className={`w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors ${
                            selectedModel.id === model.id ? 'bg-cyber-purple/10' : ''
                          }`}
                        >
                          <model.icon className={`h-5 w-5 ${
                            selectedModel.id === model.id ? 'text-cyber-purple' : 'text-muted-foreground'
                          }`} />
                          <div className="text-left">
                            <p className="font-medium text-sm">{model.name}</p>
                            <p className="text-xs text-muted-foreground">{model.description}</p>
                          </div>
                          {selectedModel.id === model.id && (
                            <Check className="h-4 w-4 text-cyber-purple ml-auto" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Clear Chat */}
              <Button
                variant="ghost"
                size="icon"
                onClick={clearChat}
                disabled={messages.length === 0}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center"
              >
                <div className="p-4 rounded-full bg-cyber-purple/10 mb-4">
                  <Brain className="h-8 w-8 text-cyber-purple" />
                </div>
                <h3 className="text-xl font-bold mb-2">IbnuGPT</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Tanyakan apa saja kepada AI. Didukung oleh LangChain dan Groq (100% Gratis).
                </p>

                {/* Example Prompts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {examplePrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleExampleClick(prompt)}
                      className="p-3 text-left text-sm glass rounded-lg hover:bg-white/5 transition-colors border border-white/5"
                    >
                      <span className="text-muted-foreground">{prompt}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyber-purple/20 flex items-center justify-center">
                        <Brain className="h-4 w-4 text-cyber-purple" />
                      </div>
                    )}

                    <div
                      className={`relative max-w-[80%] group ${
                        message.role === 'user'
                          ? 'bg-cyber-cyan/20 rounded-2xl rounded-tr-sm px-4 py-3'
                          : 'bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{message.content || '...'}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      )}

                      {/* Copy button */}
                      {message.content && (
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="absolute -bottom-6 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          {copiedId === message.id ? (
                            <>
                              <Check className="h-3 w-3" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              Copy
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyber-cyan/20 flex items-center justify-center">
                        <User className="h-4 w-4 text-cyber-cyan" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {isLoading && messages[messages.length - 1]?.content === '' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">AI sedang berpikir...</span>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik pesan Anda..."
                  rows={1}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-cyber-purple/50 placeholder:text-muted-foreground"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                variant="gradient"
                size="icon"
                className="h-12 w-12 rounded-xl flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send • Powered by Groq (Free) • {selectedModel.name}
            </p>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl p-6"
          >
            <div className="p-2 rounded-lg bg-cyber-cyan/10 w-fit mb-4">
              <Sparkles className="h-5 w-5 text-cyber-cyan" />
            </div>
            <h3 className="font-bold mb-2">LangChain Powered</h3>
            <p className="text-sm text-muted-foreground">
              Menggunakan LangChain framework untuk orkestrasi LLM yang powerful.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-6"
          >
            <div className="p-2 rounded-lg bg-cyber-purple/10 w-fit mb-4">
              <Brain className="h-5 w-5 text-cyber-purple" />
            </div>
            <h3 className="font-bold mb-2">100% Gratis</h3>
            <p className="text-sm text-muted-foreground">
              Menggunakan Groq API yang gratis. Llama 3.3 70B dengan kecepatan super cepat.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-6"
          >
            <div className="p-2 rounded-lg bg-cyber-green/10 w-fit mb-4">
              <Zap className="h-5 w-5 text-cyber-green" />
            </div>
            <h3 className="font-bold mb-2">Real-time Streaming</h3>
            <p className="text-sm text-muted-foreground">
              Respons streaming real-time untuk pengalaman chat yang lebih interaktif.
            </p>
          </motion.div>
        </div>

        {/* Get API Key Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 glass rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-cyber-orange/10 flex-shrink-0">
              <MessageSquare className="h-5 w-5 text-cyber-orange" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-2">Cara Setup</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Untuk menggunakan fitur AI Chat, Anda perlu mendapatkan API key gratis dari Groq:
              </p>
              <ol className="text-sm text-muted-foreground space-y-2 mb-4">
                <li>1. Daftar akun di <code className="bg-white/10 px-1 rounded">console.groq.com</code></li>
                <li>2. Buat API Key di dashboard</li>
                <li>3. Set environment variable: <code className="bg-white/10 px-1 rounded">GROQ_API_KEY=your_key</code></li>
              </ol>
              <Button variant="outline" size="sm" asChild>
                <Link href="https://console.groq.com" target="_blank" rel="noopener noreferrer">
                  Get Free API Key
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
}

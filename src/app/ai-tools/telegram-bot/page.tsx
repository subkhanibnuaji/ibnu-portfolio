'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Send,
  Bot,
  Settings,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Copy,
  Loader2,
  AlertCircle,
  Webhook,
  MessageSquare,
  Zap,
  Globe,
  ArrowLeft,
  Gamepad2,
  Trophy,
  Wand2,
  Search,
  Image,
  Calculator,
  FileText,
  Code,
  Dices,
  Network,
  BarChart3
} from 'lucide-react'

// Types
interface BotStatus {
  configured: boolean
  ready: boolean
  bot?: {
    id: number
    username: string
    firstName: string
    link: string
  }
  webhook?: {
    url: string | null
    isSet: boolean
    pendingUpdateCount: number
    lastError: string | null
  }
  groqApiKey?: string
  error?: string
  message?: string
}

// Bot Feature Categories
const BOT_CATEGORIES = [
  {
    icon: MessageSquare,
    title: 'AI Chat',
    description: 'Smart conversations with Groq LLMs',
    color: 'from-blue-500 to-cyan-500',
    commands: ['/model', '/persona', '/imagine', '/translate', '/run']
  },
  {
    icon: Search,
    title: 'Search & Research',
    description: 'Web search with AI summary',
    color: 'from-green-500 to-emerald-500',
    commands: ['/search', '/summarize', '/news']
  },
  {
    icon: Image,
    title: 'Media & Fun',
    description: 'Images, memes, GIFs, screenshots',
    color: 'from-purple-500 to-pink-500',
    commands: ['/meme', '/gif', '/screenshot', '/qr']
  },
  {
    icon: Gamepad2,
    title: 'Games',
    description: '8 interactive games',
    color: 'from-orange-500 to-red-500',
    commands: ['/trivia', '/hangman', '/rps', '/emoji', '/guess', '/riddle', '/math', '/word']
  },
  {
    icon: Trophy,
    title: 'Competition',
    description: 'Leaderboards & daily challenges',
    color: 'from-yellow-500 to-amber-500',
    commands: ['/daily', '/leaderboard']
  },
  {
    icon: Dices,
    title: 'Random & Decision',
    description: 'Coin flip, dice, 8-ball',
    color: 'from-indigo-500 to-violet-500',
    commands: ['/flip', '/dice', '/8ball', '/decide', '/joke', '/quote']
  },
  {
    icon: Calculator,
    title: 'Utility Tools',
    description: 'Calculator, converter, currency',
    color: 'from-teal-500 to-cyan-500',
    commands: ['/calc', '/convert', '/currency', '/weather', '/crypto']
  },
  {
    icon: Code,
    title: 'Developer Tools',
    description: 'JSON, Base64, Hash, UUID',
    color: 'from-slate-500 to-zinc-500',
    commands: ['/json', '/base64', '/hash', '/uuid', '/password', '/color']
  },
  {
    icon: Network,
    title: 'Network Tools',
    description: 'IP lookup, DNS, URL shortener',
    color: 'from-rose-500 to-pink-500',
    commands: ['/ip', '/dns', '/shorten']
  },
  {
    icon: FileText,
    title: 'Productivity',
    description: 'Notes, todos, polls',
    color: 'from-sky-500 to-blue-500',
    commands: ['/notes', '/todo', '/poll']
  },
  {
    icon: BarChart3,
    title: 'Text Analysis',
    description: 'Text stats, reverse, mocking',
    color: 'from-fuchsia-500 to-purple-500',
    commands: ['/textstats', '/reverse', '/mock']
  },
  {
    icon: Globe,
    title: 'Multilingual',
    description: 'Auto-detect Indonesian & English',
    color: 'from-emerald-500 to-green-500',
    commands: ['/translate']
  }
]

// Key Commands
const KEY_COMMANDS = [
  { command: '/start', description: 'Welcome message & menu', category: 'Core' },
  { command: '/help', description: '80+ commands guide', category: 'Core' },
  { command: '/menu', description: 'Interactive 8-category menu', category: 'Core' },
  { command: '/imagine', description: 'AI image generation', category: 'AI' },
  { command: '/meme', description: 'Meme generator', category: 'Media' },
  { command: '/hangman', description: 'Classic hangman game', category: 'Games' },
  { command: '/daily', description: 'Daily challenge', category: 'Competition' },
  { command: '/8ball', description: 'Magic 8-Ball answers', category: 'Random' },
  { command: '/crypto', description: 'Crypto prices', category: 'Utility' },
]

// Stats
const BOT_STATS = [
  { label: 'Commands', value: '80+' },
  { label: 'Categories', value: '12' },
  { label: 'Games', value: '8' },
  { label: 'API Integrations', value: '15+' }
]

export default function TelegramBotPage() {
  const [status, setStatus] = useState<BotStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<number | null>(null)

  // Fetch bot status
  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/telegram/setup')
      const data = await response.json()
      setStatus(data)
    } catch (err) {
      setError('Failed to fetch bot status')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  // Set webhook
  const handleSetWebhook = async () => {
    try {
      setActionLoading(true)
      setError(null)

      const webhookUrl = `${window.location.origin}/api/telegram/webhook`

      const response = await fetch('/api/telegram/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'setWebhook',
          webhookUrl
        })
      })

      const data = await response.json()

      if (data.success) {
        await fetchStatus()
      } else {
        setError(data.error || 'Failed to set webhook')
      }
    } catch (err) {
      setError('Failed to set webhook')
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  // Delete webhook
  const handleDeleteWebhook = async () => {
    try {
      setActionLoading(true)
      setError(null)

      const response = await fetch('/api/telegram/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteWebhook' })
      })

      const data = await response.json()

      if (data.success) {
        await fetchStatus()
      } else {
        setError(data.error || 'Failed to delete webhook')
      }
    } catch (err) {
      setError('Failed to delete webhook')
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  // Copy bot link
  const handleCopyLink = () => {
    if (status?.bot?.link) {
      navigator.clipboard.writeText(status.bot.link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <main className="min-h-screen py-24">
      <div className="container max-w-5xl">
        {/* Back Button */}
        <Link
          href="/ai-tools"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to AI Tools
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <Send className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">IbnuGPT Bot</h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full">
                  v3.0
                </span>
              </div>
              <p className="text-muted-foreground">World-Class Telegram Super App</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            {BOT_STATS.map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded-xl bg-muted/50">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Error</p>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 p-6 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Bot Status
                </h2>
                <button
                  onClick={fetchStatus}
                  disabled={loading}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  title="Refresh status"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Status Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Bot Token Status */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    {status?.configured ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-medium">Bot Token</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {status?.configured ? 'Token is configured' : 'Token not configured'}
                  </p>
                </div>

                {/* Groq API Key Status */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    {status?.groqApiKey === 'configured' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-medium">Groq API Key</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {status?.groqApiKey === 'configured' ? 'API key is configured' : 'API key not configured'}
                  </p>
                </div>

                {/* Webhook Status */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    {status?.webhook?.isSet ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-yellow-500" />
                    )}
                    <span className="font-medium">Webhook</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {status?.webhook?.isSet ? 'Webhook is active' : 'Webhook not set'}
                  </p>
                  {status?.webhook?.lastError && (
                    <p className="text-xs text-red-400 mt-1">Error: {status.webhook.lastError}</p>
                  )}
                </div>

                {/* Bot Info */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-5 h-5 text-primary" />
                    <span className="font-medium">Bot Info</span>
                  </div>
                  {status?.bot ? (
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">@{status.bot.username}</p>
                      <p className="text-xs">{status.bot.firstName}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {status?.configured && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleSetWebhook}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Webhook className="w-4 h-4" />
                    )}
                    {status?.webhook?.isSet ? 'Update Webhook' : 'Set Webhook'}
                  </button>

                  {status?.webhook?.isSet && (
                    <button
                      onClick={handleDeleteWebhook}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Delete Webhook
                    </button>
                  )}

                  {status?.bot?.link && (
                    <>
                      <a
                        href={status.bot.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90 transition-opacity"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open Bot
                      </a>
                      <button
                        onClick={handleCopyLink}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                      >
                        {copied ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        {copied ? 'Copied!' : 'Copy Link'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </motion.div>

            {/* Feature Categories Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Feature Categories
              </h2>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {BOT_CATEGORIES.map((category, index) => (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * index }}
                    className={`p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all cursor-pointer ${activeCategory === index ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setActiveCategory(activeCategory === index ? null : index)}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-3`}>
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-medium mb-1">{category.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{category.description}</p>
                    {activeCategory === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 pt-2 border-t border-border"
                      >
                        <div className="flex flex-wrap gap-1">
                          {category.commands.map((cmd) => (
                            <code key={cmd} className="px-1.5 py-0.5 text-xs bg-muted rounded">
                              {cmd}
                            </code>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Key Commands */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">Key Commands</h2>
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {KEY_COMMANDS.map((cmd) => (
                    <div
                      key={cmd.command}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <code className="px-2 py-1 rounded bg-primary/10 text-primary font-mono text-sm shrink-0">
                        {cmd.command}
                      </code>
                      <div className="min-w-0">
                        <p className="text-sm truncate">{cmd.description}</p>
                        <p className="text-xs text-muted-foreground">{cmd.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  + 70 more commands available! Send /help in the bot for the complete list.
                </p>
              </div>
            </motion.div>

            {/* Quick Start */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
              <div className="p-6 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Open the bot</p>
                      <p className="text-sm text-muted-foreground">Click "Open Bot" or search @IbnuGPT_Bot</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Send /start</p>
                      <p className="text-sm text-muted-foreground">See welcome message & menu</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Explore!</p>
                      <p className="text-sm text-muted-foreground">Chat, play games, use tools</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Try Commands Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <h2 className="text-xl font-semibold mb-4">Try These Commands</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-card">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-orange-500" />
                    Games
                  </h3>
                  <div className="space-y-2 text-sm">
                    <code className="block p-2 bg-muted rounded">/hangman</code>
                    <code className="block p-2 bg-muted rounded">/rps rock</code>
                    <code className="block p-2 bg-muted rounded">/trivia</code>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Image className="w-4 h-4 text-purple-500" />
                    Media
                  </h3>
                  <div className="space-y-2 text-sm">
                    <code className="block p-2 bg-muted rounded">/imagine sunset over mountains</code>
                    <code className="block p-2 bg-muted rounded">/meme drake | Before | After</code>
                    <code className="block p-2 bg-muted rounded">/gif happy</code>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Dices className="w-4 h-4 text-indigo-500" />
                    Random
                  </h3>
                  <div className="space-y-2 text-sm">
                    <code className="block p-2 bg-muted rounded">/8ball Will I be rich?</code>
                    <code className="block p-2 bg-muted rounded">/flip</code>
                    <code className="block p-2 bg-muted rounded">/dice 20</code>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-teal-500" />
                    Utility
                  </h3>
                  <div className="space-y-2 text-sm">
                    <code className="block p-2 bg-muted rounded">/crypto bitcoin</code>
                    <code className="block p-2 bg-muted rounded">/weather Jakarta</code>
                    <code className="block p-2 bg-muted rounded">/currency 100 usd to idr</code>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 p-4 rounded-xl border border-border bg-muted/30"
            >
              <p className="text-sm text-center text-muted-foreground">
                Powered by{' '}
                <span className="font-medium text-foreground">Groq API</span> +{' '}
                <span className="font-medium text-foreground">LangChain</span> +{' '}
                <span className="font-medium text-foreground">Telegram Bot API</span> +{' '}
                <span className="font-medium text-foreground">15+ Free APIs</span>
              </p>
            </motion.div>
          </>
        )}
      </div>
    </main>
  )
}

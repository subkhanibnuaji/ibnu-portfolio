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
  ArrowLeft
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

// Bot Features
const BOT_FEATURES = [
  {
    icon: MessageSquare,
    title: 'AI Chat',
    description: 'Have natural conversations powered by Groq LLMs'
  },
  {
    icon: Zap,
    title: 'Multiple Models',
    description: 'Choose from Llama 3.3 70B, Llama 3.1 8B, Mixtral, and Gemma'
  },
  {
    icon: Globe,
    title: 'Multilingual',
    description: 'Responds in Indonesian and English automatically'
  },
  {
    icon: Bot,
    title: 'Commands',
    description: '/start, /help, /clear, /model, /about'
  }
]

// Bot Commands
const BOT_COMMANDS = [
  { command: '/start', description: 'Start the bot and see welcome message' },
  { command: '/help', description: 'Get help and usage tips' },
  { command: '/clear', description: 'Clear conversation history' },
  { command: '/model', description: 'Change AI model' },
  { command: '/about', description: 'About this bot' }
]

export default function TelegramBotPage() {
  const [status, setStatus] = useState<BotStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

      // Get the current domain
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
      <div className="container max-w-4xl">
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Send className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Telegram Bot</h1>
              <p className="text-muted-foreground">AI Chatbot powered by Groq LLMs</p>
            </div>
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
                    {status?.configured
                      ? 'Token is configured'
                      : 'Token not configured'}
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
                    {status?.groqApiKey === 'configured'
                      ? 'API key is configured'
                      : 'API key not configured'}
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
                    {status?.webhook?.isSet
                      ? 'Webhook is active'
                      : 'Webhook not set'}
                  </p>
                  {status?.webhook?.lastError && (
                    <p className="text-xs text-red-400 mt-1">
                      Error: {status.webhook.lastError}
                    </p>
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
                      <p>@{status.bot.username}</p>
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
                  {/* Set/Update Webhook */}
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

                  {/* Delete Webhook */}
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

                  {/* Open Bot */}
                  {status?.bot?.link && (
                    <>
                      <a
                        href={status.bot.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
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

              {/* Setup Instructions (if not configured) */}
              {!status?.configured && (
                <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <h3 className="font-medium text-yellow-500 mb-2">Setup Required</h3>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Open Telegram and search for @BotFather</li>
                    <li>Send /newbot and follow the instructions</li>
                    <li>Copy the bot token you receive</li>
                    <li>Add TELEGRAM_BOT_TOKEN to your environment variables</li>
                    <li>Refresh this page and click "Set Webhook"</li>
                  </ol>
                </div>
              )}
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {BOT_FEATURES.map((feature) => (
                  <div
                    key={feature.title}
                    className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Commands List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">Available Commands</h2>
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="space-y-3">
                  {BOT_COMMANDS.map((cmd) => (
                    <div
                      key={cmd.command}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <code className="px-2 py-1 rounded bg-muted text-primary font-mono text-sm">
                        {cmd.command}
                      </code>
                      <span className="text-sm text-muted-foreground">{cmd.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Quick Start Guide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
              <div className="p-6 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Open the bot in Telegram</p>
                      <p className="text-sm text-muted-foreground">
                        Click "Open Bot" button above or search for the bot username
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Send /start</p>
                      <p className="text-sm text-muted-foreground">
                        This will show the welcome message and available options
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Start chatting!</p>
                      <p className="text-sm text-muted-foreground">
                        Type any message and the AI will respond
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 rounded-xl border border-border bg-muted/30"
            >
              <p className="text-sm text-center text-muted-foreground">
                Powered by{' '}
                <span className="font-medium text-foreground">Groq API</span> +{' '}
                <span className="font-medium text-foreground">LangChain</span> +{' '}
                <span className="font-medium text-foreground">Telegram Bot API</span>
              </p>
            </motion.div>
          </>
        )}
      </div>
    </main>
  )
}

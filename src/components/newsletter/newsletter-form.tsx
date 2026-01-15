'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  Send,
  Check,
  Loader2,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NewsletterFormProps {
  className?: string
  variant?: 'default' | 'compact' | 'inline'
  title?: string
  description?: string
}

export function NewsletterForm({
  className,
  variant = 'default',
  title = 'Stay Updated',
  description = 'Get notified about new articles, projects, and tech insights.',
}: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      // Call newsletter API
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to subscribe')
      }

      setStatus('success')
      setEmail('')

      // Reset after 5 seconds
      setTimeout(() => setStatus('idle'), 5000)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={status === 'loading' || status === 'success'}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none text-sm"
          />
        </div>
        <Button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          variant="gradient"
          size="sm"
        >
          {status === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : status === 'success' ? (
            <Check className="h-4 w-4" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn('glass rounded-xl p-4', className)}>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-cyber-cyan/10">
            <Mail className="h-4 w-4 text-cyber-cyan" />
          </div>
          <span className="font-medium text-sm">{title}</span>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none text-sm"
          />
          <Button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            size="sm"
          >
            {status === 'loading' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : status === 'success' ? (
              <Check className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        {status === 'error' && (
          <p className="text-xs text-red-500 mt-2">{errorMessage}</p>
        )}
        {status === 'success' && (
          <p className="text-xs text-cyber-green mt-2">Thanks for subscribing!</p>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('glass rounded-2xl p-6 md:p-8', className)}
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-xl bg-cyber-gradient">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              disabled={status === 'loading' || status === 'success'}
              className={cn(
                'w-full pl-12 pr-4 py-3 rounded-lg bg-muted border focus:border-cyber-cyan outline-none transition-colors',
                status === 'error' ? 'border-red-500' : 'border-border'
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            variant="gradient"
            size="lg"
            className="sm:px-8"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : status === 'success' ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Subscribed!
              </>
            ) : (
              <>
                Subscribe
                <Send className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-3 text-sm text-red-500"
          >
            <AlertCircle className="h-4 w-4" />
            {errorMessage}
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-3 text-sm text-cyber-green"
          >
            <Check className="h-4 w-4" />
            Thanks for subscribing! Check your email for confirmation.
          </motion.div>
        )}
      </form>

      <p className="text-xs text-muted-foreground mt-4">
        No spam, unsubscribe anytime. I respect your privacy.
      </p>

      {/* Topics */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground">Topics:</span>
        {['Tech', 'AI/ML', 'Web3', 'Career', 'Projects'].map((topic) => (
          <span
            key={topic}
            className="px-2 py-0.5 rounded-full text-xs bg-muted"
          >
            {topic}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

// Footer Newsletter (simpler version for footer)
export function FooterNewsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) return

    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) throw new Error('Failed')

      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <div>
      <h4 className="font-semibold mb-3">Newsletter</h4>
      <p className="text-sm text-muted-foreground mb-3">
        Get updates on new articles and projects.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none text-sm"
        />
        <Button type="submit" size="sm" disabled={status === 'loading'}>
          {status === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : status === 'success' ? (
            <Check className="h-4 w-4 text-cyber-green" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
      {status === 'error' && (
        <p className="text-xs text-red-500 mt-2">Failed to subscribe</p>
      )}
    </div>
  )
}

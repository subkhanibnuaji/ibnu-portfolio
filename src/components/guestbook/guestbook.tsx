'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, MessageSquare, User, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GuestbookEntry {
  id: string
  name: string
  message: string
  createdAt: string
  country?: string
}

export function Guestbook({ className }: { className?: string }) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [isLoading, setIsLoading] = useState(true)

  // Fetch entries on mount
  useEffect(() => {
    fetch('/api/guestbook')
      .then(res => res.json())
      .then(data => {
        setEntries(data.entries || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !message.trim()) return

    setStatus('loading')

    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), message: message.trim() })
      })

      if (!response.ok) throw new Error('Failed to submit')

      setStatus('success')
      setName('')
      setMessage('')

      // Reset after 3 seconds
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className={cn('space-y-8', className)}>
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-cyan/10 text-cyber-cyan text-sm mb-4">
          <MessageSquare className="h-4 w-4" />
          Guestbook
        </div>
        <h2 className="text-3xl font-bold mb-2">Leave a Message</h2>
        <p className="text-muted-foreground">
          Sign my guestbook and leave a message for others to see!
        </p>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass rounded-2xl p-6 space-y-4"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              maxLength={50}
              required
              disabled={status === 'loading'}
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none transition-colors"
            />
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              disabled={status === 'loading' || !name.trim() || !message.trim()}
              variant="gradient"
              className="w-full"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing...
                </>
              ) : status === 'success' ? (
                'Signed! ✓'
              ) : (
                <>
                  Sign Guestbook
                  <Send className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Your Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write something nice..."
            maxLength={500}
            rows={3}
            required
            disabled={status === 'loading'}
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none transition-colors resize-none"
          />
          <div className="text-xs text-muted-foreground mt-1 text-right">
            {message.length}/500
          </div>
        </div>

        {status === 'success' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-cyber-green"
          >
            Thanks for signing! Your message will appear after approval.
          </motion.p>
        )}

        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500"
          >
            Something went wrong. Please try again.
          </motion.p>
        )}
      </motion.form>

      {/* Entries */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          Recent Messages ({entries.length})
        </h3>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/4 mb-2" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No messages yet. Be the first to sign!
          </p>
        ) : (
          <AnimatePresence>
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyber-gradient flex items-center justify-center text-white text-sm font-bold">
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{entry.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(entry.createdAt)}
                  </span>
                </div>
                <p className="text-muted-foreground pl-10">{entry.message}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

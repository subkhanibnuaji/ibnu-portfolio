'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Type, Hash, FileText, Copy, Check, Twitter, MessageSquare } from 'lucide-react'

interface Limit {
  name: string
  icon: React.ElementType
  limit: number
  color: string
}

const LIMITS: Limit[] = [
  { name: 'Twitter/X', icon: Twitter, limit: 280, color: 'blue' },
  { name: 'SMS', icon: MessageSquare, limit: 160, color: 'green' },
  { name: 'Meta Title', icon: FileText, limit: 60, color: 'purple' },
  { name: 'Meta Description', icon: FileText, limit: 160, color: 'orange' },
]

export function CharacterCounter() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

  const stats = useMemo(() => {
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length
    const lines = text ? text.split('\n').length : 0

    return { characters, charactersNoSpaces, words, sentences, paragraphs, lines }
  }, [text])

  const copyText = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getProgressColor = (current: number, limit: number) => {
    const percent = (current / limit) * 100
    if (percent >= 100) return 'bg-red-500'
    if (percent >= 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Character Counter</h1>
        <p className="text-muted-foreground">Count characters, words, and check limits</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Text Input */}
        <div className="lg:col-span-2 bg-card rounded-xl p-6 border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Enter Text</h2>
            <button
              onClick={copyText}
              disabled={!text}
              className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-lg text-sm flex items-center gap-1 disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here..."
            className="w-full h-64 px-4 py-3 bg-muted rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Platform Limits */}
          <div className="mt-4 space-y-3">
            {LIMITS.map(limit => {
              const percent = Math.min((stats.characters / limit.limit) * 100, 100)
              const remaining = limit.limit - stats.characters
              return (
                <div key={limit.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <limit.icon className="w-4 h-4" />
                      {limit.name}
                    </span>
                    <span className={remaining < 0 ? 'text-red-500 font-semibold' : 'text-muted-foreground'}>
                      {remaining >= 0 ? `${remaining} left` : `${Math.abs(remaining)} over`}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      className={`h-full ${getProgressColor(stats.characters, limit.limit)}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-card rounded-xl p-6 border">
          <h2 className="font-semibold mb-4">Statistics</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Type className="w-4 h-4" />
                <span className="text-xs">Characters</span>
              </div>
              <div className="text-3xl font-bold">{stats.characters}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">No Spaces</div>
                <div className="text-xl font-semibold">{stats.charactersNoSpaces}</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Words</div>
                <div className="text-xl font-semibold">{stats.words}</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Sentences</div>
                <div className="text-xl font-semibold">{stats.sentences}</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Paragraphs</div>
                <div className="text-xl font-semibold">{stats.paragraphs}</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg col-span-2">
                <div className="text-xs text-muted-foreground mb-1">Lines</div>
                <div className="text-xl font-semibold">{stats.lines}</div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
              <p>Avg. {stats.words > 0 ? (stats.characters / stats.words).toFixed(1) : 0} chars/word</p>
              <p>Avg. {stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : 0} words/sentence</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

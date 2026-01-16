'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Hash,
  AlignLeft,
  Clock,
  BarChart3,
  Copy,
  Check,
  Type
} from 'lucide-react'

interface TextStats {
  characters: number
  charactersNoSpaces: number
  words: number
  sentences: number
  paragraphs: number
  lines: number
  readingTime: number // in minutes
  speakingTime: number // in minutes
  avgWordLength: number
  avgSentenceLength: number
  longestWord: string
  mostFrequentWords: { word: string; count: number }[]
}

export function TextStatistics() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

  const stats = useMemo((): TextStats => {
    if (!text.trim()) {
      return {
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        readingTime: 0,
        speakingTime: 0,
        avgWordLength: 0,
        avgSentenceLength: 0,
        longestWord: '',
        mostFrequentWords: [],
      }
    }

    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    const wordCount = words.length
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length
    const lines = text.split('\n').length

    // Reading time (avg 200 words/min) and speaking time (avg 150 words/min)
    const readingTime = Math.ceil(wordCount / 200)
    const speakingTime = Math.ceil(wordCount / 150)

    // Average word length
    const totalWordLength = words.reduce((sum, w) => sum + w.replace(/[^a-zA-Z]/g, '').length, 0)
    const avgWordLength = wordCount > 0 ? totalWordLength / wordCount : 0

    // Average sentence length
    const avgSentenceLength = sentences > 0 ? wordCount / sentences : 0

    // Longest word
    const longestWord = words.reduce((longest, current) => {
      const cleanCurrent = current.replace(/[^a-zA-Z]/g, '')
      const cleanLongest = longest.replace(/[^a-zA-Z]/g, '')
      return cleanCurrent.length > cleanLongest.length ? cleanCurrent : longest
    }, '')

    // Most frequent words (excluding common words)
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'is', 'it', 'be', 'as', 'by', 'this', 'that', 'with', 'from', 'are', 'was', 'were', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall'])
    const wordFrequency: Record<string, number> = {}
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-zA-Z]/g, '')
      if (cleanWord.length > 2 && !commonWords.has(cleanWord)) {
        wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1
      }
    })
    const mostFrequentWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }))

    return {
      characters,
      charactersNoSpaces,
      words: wordCount,
      sentences,
      paragraphs,
      lines,
      readingTime,
      speakingTime,
      avgWordLength,
      avgSentenceLength,
      longestWord,
      mostFrequentWords,
    }
  }, [text])

  const copyStats = () => {
    const statsText = `
Text Statistics:
- Characters: ${stats.characters}
- Characters (no spaces): ${stats.charactersNoSpaces}
- Words: ${stats.words}
- Sentences: ${stats.sentences}
- Paragraphs: ${stats.paragraphs}
- Lines: ${stats.lines}
- Reading Time: ${stats.readingTime} min
- Speaking Time: ${stats.speakingTime} min
- Avg Word Length: ${stats.avgWordLength.toFixed(1)} chars
- Avg Sentence Length: ${stats.avgSentenceLength.toFixed(1)} words
- Longest Word: ${stats.longestWord}
    `.trim()

    navigator.clipboard.writeText(statsText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const StatCard = ({ icon: Icon, label, value, subtext }: { icon: React.ElementType; label: string; value: string | number; subtext?: string }) => (
    <div className="p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        <Icon className="w-4 h-4" />
        <span className="text-xs">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {subtext && <div className="text-xs text-muted-foreground">{subtext}</div>}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Text Statistics</h1>
        <p className="text-muted-foreground">Analyze your text with detailed statistics</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Text Input */}
        <div className="bg-card rounded-xl p-6 border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Enter Text</h2>
            <button
              onClick={() => setText('')}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your text here..."
            className="w-full h-80 px-4 py-3 bg-muted rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Statistics */}
        <div className="bg-card rounded-xl p-6 border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Statistics</h2>
            <button
              onClick={copyStats}
              disabled={stats.words === 0}
              className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-lg text-sm flex items-center gap-1 disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Stats'}
            </button>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatCard icon={Type} label="Characters" value={stats.characters} />
            <StatCard icon={Type} label="No Spaces" value={stats.charactersNoSpaces} />
            <StatCard icon={FileText} label="Words" value={stats.words} />
            <StatCard icon={AlignLeft} label="Sentences" value={stats.sentences} />
            <StatCard icon={Hash} label="Paragraphs" value={stats.paragraphs} />
            <StatCard icon={Hash} label="Lines" value={stats.lines} />
          </div>

          {/* Time Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatCard
              icon={Clock}
              label="Reading Time"
              value={`${stats.readingTime} min`}
              subtext="@ 200 words/min"
            />
            <StatCard
              icon={Clock}
              label="Speaking Time"
              value={`${stats.speakingTime} min`}
              subtext="@ 150 words/min"
            />
          </div>

          {/* Advanced Stats */}
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Avg Word Length</span>
                <span className="font-semibold">{stats.avgWordLength.toFixed(1)} chars</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Avg Sentence Length</span>
                <span className="font-semibold">{stats.avgSentenceLength.toFixed(1)} words</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Longest Word</span>
                <span className="font-semibold font-mono">{stats.longestWord || '-'}</span>
              </div>
            </div>

            {/* Most Frequent Words */}
            {stats.mostFrequentWords.length > 0 && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Most Frequent Words</span>
                </div>
                <div className="space-y-2">
                  {stats.mostFrequentWords.map(({ word, count }, i) => (
                    <div key={word} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                      <span className="flex-1 font-mono text-sm">{word}</span>
                      <span className="text-sm text-muted-foreground">{count}x</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

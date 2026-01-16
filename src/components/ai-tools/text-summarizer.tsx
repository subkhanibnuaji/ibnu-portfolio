'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FileText, Copy, Check, Trash2, Sparkles, List, AlignLeft } from 'lucide-react'

// Simple extractive summarization
function summarizeText(text: string, ratio: number = 0.3): { sentences: string[]; keywords: string[]; stats: { original: number; summary: number; compression: number } } {
  if (!text.trim()) {
    return { sentences: [], keywords: [], stats: { original: 0, summary: 0, compression: 0 } }
  }

  // Split into sentences
  const sentences = text
    .replace(/([.!?])\s+/g, '$1|')
    .split('|')
    .map(s => s.trim())
    .filter(s => s.length > 10)

  if (sentences.length === 0) {
    return { sentences: [], keywords: [], stats: { original: 0, summary: 0, compression: 0 } }
  }

  // Calculate word frequency for scoring
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || []
  const wordFreq = new Map<string, number>()
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'it', 'its', 'as', 'if', 'when', 'where', 'which', 'who', 'whom', 'what', 'how', 'why', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there', 'then', 'than', 'into', 'over', 'after', 'before', 'between', 'under', 'again', 'once', 'during', 'through', 'about'])

  for (const word of words) {
    if (!stopWords.has(word)) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
    }
  }

  // Get top keywords
  const keywords = Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word)

  // Score sentences based on keyword frequency and position
  const scoredSentences = sentences.map((sentence, index) => {
    const sentenceWords = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || []
    let score = 0

    // Keyword frequency score
    for (const word of sentenceWords) {
      score += wordFreq.get(word) || 0
    }

    // Normalize by sentence length
    score = score / (sentenceWords.length || 1)

    // Position bonus (first and last sentences are often important)
    if (index === 0) score *= 1.5
    if (index === sentences.length - 1) score *= 1.2

    // Length penalty for very short sentences
    if (sentenceWords.length < 5) score *= 0.5

    return { sentence, score, index }
  })

  // Select top sentences
  const numSentences = Math.max(1, Math.ceil(sentences.length * ratio))
  const selectedSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, numSentences)
    .sort((a, b) => a.index - b.index) // Restore original order
    .map(s => s.sentence)

  const originalWords = text.split(/\s+/).length
  const summaryWords = selectedSentences.join(' ').split(/\s+/).length
  const compression = Math.round((1 - summaryWords / originalWords) * 100)

  return {
    sentences: selectedSentences,
    keywords,
    stats: {
      original: originalWords,
      summary: summaryWords,
      compression
    }
  }
}

export function TextSummarizer() {
  const [text, setText] = useState('')
  const [ratio, setRatio] = useState(0.3)
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState<'paragraph' | 'bullets'>('paragraph')

  const { sentences, keywords, stats } = useMemo(() => summarizeText(text, ratio), [text, ratio])

  const summaryText = mode === 'paragraph'
    ? sentences.join(' ')
    : sentences.map(s => `• ${s}`).join('\n')

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(summaryText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Text Summarizer</h1>
        <p className="text-muted-foreground">Automatically extract key sentences from long text</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-card rounded-xl p-6 border space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Original Text
              </label>
              <button
                onClick={() => setText('')}
                disabled={!text}
                className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your long text here to summarize..."
              className="w-full h-64 px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
            />
            <div className="text-right text-xs text-muted-foreground mt-1">
              {text.split(/\s+/).filter(Boolean).length} words
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Summary Length: {Math.round(ratio * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="0.5"
              step="0.1"
              value={ratio}
              onChange={(e) => setRatio(parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Shorter</span>
              <span>Longer</span>
            </div>
          </div>

          {/* Sample Text */}
          <div>
            <p className="text-sm font-medium mb-2">Try a sample:</p>
            <button
              onClick={() => setText(`Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.

The term "artificial intelligence" had previously been used to describe machines that mimic and display "human" cognitive skills that are associated with the human mind, such as "learning" and "problem-solving". This definition has since been rejected by major AI researchers who now describe AI in terms of rationality and acting rationally, which does not limit how intelligence can be articulated.

AI applications include advanced web search engines, recommendation systems, understanding human speech, self-driving cars, generative or creative tools, automated decision-making, and competing at the highest level in strategic game systems. As machines become increasingly capable, tasks considered to require "intelligence" are often removed from the definition of AI, a phenomenon known as the AI effect.

The field was founded on the assumption that human intelligence can be so precisely described that a machine can be made to simulate it. This raised philosophical arguments about the mind and the ethical consequences of creating artificial beings endowed with human-like intelligence. These issues have been explored by myth, fiction, and philosophy since antiquity. Science fiction and futurology have also suggested that, with its enormous potential and power, AI may become an existential risk to humanity.`)}
              className="text-sm px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
            >
              About AI
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-card rounded-xl p-6 border space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Summary
            </label>
            <div className="flex items-center gap-2">
              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => setMode('paragraph')}
                  className={`p-1.5 rounded ${mode === 'paragraph' ? 'bg-background shadow' : ''}`}
                  title="Paragraph"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMode('bullets')}
                  className={`p-1.5 rounded ${mode === 'bullets' ? 'bg-background shadow' : ''}`}
                  title="Bullet Points"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={copyToClipboard}
                disabled={!summaryText}
                className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="min-h-[200px] p-4 bg-muted/50 rounded-lg border border-border">
            {summaryText ? (
              <p className="text-sm whitespace-pre-wrap">{summaryText}</p>
            ) : (
              <p className="text-muted-foreground text-center mt-16">
                Enter text to generate a summary
              </p>
            )}
          </div>

          {/* Stats */}
          {stats.original > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <div className="text-lg font-bold text-primary">{stats.original}</div>
                <div className="text-xs text-muted-foreground">Original Words</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <div className="text-lg font-bold text-green-500">{stats.summary}</div>
                <div className="text-xs text-muted-foreground">Summary Words</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <div className="text-lg font-bold text-blue-500">{stats.compression}%</div>
                <div className="text-xs text-muted-foreground">Compression</div>
              </div>
            </div>
          )}

          {/* Keywords */}
          {keywords.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Key Topics</p>
              <div className="flex flex-wrap gap-2">
                {keywords.map(keyword => (
                  <span
                    key={keyword}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-500/10 rounded-xl text-sm">
        <p className="font-semibold text-blue-600 mb-1">How it works</p>
        <p className="text-muted-foreground">
          This tool uses extractive summarization - it identifies and extracts the most important sentences
          from your text based on keyword frequency and sentence position. For best results, use well-structured
          text with clear sentences.
        </p>
      </div>
    </motion.div>
  )
}

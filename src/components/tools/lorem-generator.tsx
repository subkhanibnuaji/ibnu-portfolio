'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FileText, Copy, Check, RefreshCw, Settings } from 'lucide-react'

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'porta', 'nibh', 'venenatis',
  'cras', 'sed', 'felis', 'eget', 'velit', 'aliquet', 'sagittis', 'eu', 'volutpat',
  'odio', 'facilisis', 'mauris', 'pellentesque', 'habitant', 'morbi', 'tristique',
  'senectus', 'netus', 'fames', 'ac', 'turpis', 'egestas', 'integer', 'feugiat',
  'scelerisque', 'varius', 'nunc', 'mattis', 'quisque', 'pretium', 'massa'
]

const LOREM_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'

type GenerateType = 'paragraphs' | 'sentences' | 'words'

const generateWord = (): string => {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]
}

const generateSentence = (minWords: number = 8, maxWords: number = 15): string => {
  const wordCount = minWords + Math.floor(Math.random() * (maxWords - minWords + 1))
  const words = Array.from({ length: wordCount }, generateWord)
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)

  // Add commas occasionally
  if (wordCount > 6) {
    const commaPos = 3 + Math.floor(Math.random() * (wordCount - 6))
    words[commaPos] = words[commaPos] + ','
  }

  return words.join(' ') + '.'
}

const generateParagraph = (minSentences: number = 4, maxSentences: number = 8): string => {
  const sentenceCount = minSentences + Math.floor(Math.random() * (maxSentences - minSentences + 1))
  const sentences = Array.from({ length: sentenceCount }, () => generateSentence())
  return sentences.join(' ')
}

export function LoremGenerator() {
  const [type, setType] = useState<GenerateType>('paragraphs')
  const [count, setCount] = useState(3)
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [includeHtml, setIncludeHtml] = useState(false)
  const [copied, setCopied] = useState(false)
  const [regenerateKey, setRegenerateKey] = useState(0)

  const generated = useMemo(() => {
    let result: string[] = []

    switch (type) {
      case 'paragraphs':
        result = Array.from({ length: count }, (_, i) => {
          if (i === 0 && startWithLorem) {
            return LOREM_START + ' ' + generateParagraph(3, 6)
          }
          return generateParagraph()
        })
        break

      case 'sentences':
        result = Array.from({ length: count }, (_, i) => {
          if (i === 0 && startWithLorem) {
            return LOREM_START
          }
          return generateSentence()
        })
        break

      case 'words':
        const words = Array.from({ length: count }, generateWord)
        if (startWithLorem && count >= 2) {
          words[0] = 'lorem'
          words[1] = 'ipsum'
        }
        result = [words.join(' ')]
        break
    }

    return result
  }, [type, count, startWithLorem, regenerateKey])

  const formattedOutput = useMemo(() => {
    if (includeHtml && type === 'paragraphs') {
      return generated.map(p => `<p>${p}</p>`).join('\n\n')
    }
    return generated.join(type === 'words' ? '' : '\n\n')
  }, [generated, includeHtml, type])

  const copyOutput = async () => {
    await navigator.clipboard.writeText(formattedOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const regenerate = () => {
    setRegenerateKey(k => k + 1)
  }

  // Stats
  const wordCount = formattedOutput.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
  const charCount = formattedOutput.replace(/<[^>]*>/g, '').length

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium mb-4">
          <FileText className="w-4 h-4" />
          Text Generator
        </div>
        <h2 className="text-2xl font-bold">Lorem Ipsum Generator</h2>
        <p className="text-muted-foreground mt-2">
          Generate placeholder text for your designs and mockups.
        </p>
      </div>

      {/* Controls */}
      <div className="p-4 rounded-xl border border-border bg-card mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Type Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Generate</label>
            <div className="flex gap-2">
              {(['paragraphs', 'sentences', 'words'] as GenerateType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-lg capitalize font-medium transition-colors ${
                    type === t
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Count</label>
              <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{count}</span>
            </div>
            <input
              type="range"
              min={1}
              max={type === 'words' ? 100 : 10}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="w-4 h-4 rounded accent-primary"
            />
            <span className="text-sm">Start with "Lorem ipsum..."</span>
          </label>

          {type === 'paragraphs' && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHtml}
                onChange={(e) => setIncludeHtml(e.target.checked)}
                className="w-4 h-4 rounded accent-primary"
              />
              <span className="text-sm">Include &lt;p&gt; tags</span>
            </label>
          )}
        </div>
      </div>

      {/* Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Generated Text</label>
            <span className="text-xs text-muted-foreground">
              {wordCount} words · {charCount} characters
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={regenerate}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={copyOutput}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
              title="Copy"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/30 max-h-[400px] overflow-y-auto">
          {includeHtml && type === 'paragraphs' ? (
            <pre className="font-mono text-sm whitespace-pre-wrap">{formattedOutput}</pre>
          ) : (
            <div className="space-y-4">
              {generated.map((text, idx) => (
                <p key={idx} className={type === 'words' ? '' : ''}>
                  {text}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-2">
        {[
          { label: '1 Paragraph', type: 'paragraphs' as GenerateType, count: 1 },
          { label: '3 Paragraphs', type: 'paragraphs' as GenerateType, count: 3 },
          { label: '5 Sentences', type: 'sentences' as GenerateType, count: 5 },
          { label: '50 Words', type: 'words' as GenerateType, count: 50 },
        ].map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setType(preset.type)
              setCount(preset.count)
              setRegenerateKey(k => k + 1)
            }}
            className="px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}

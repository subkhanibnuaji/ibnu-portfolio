'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Hash, FileText, Sparkles, Copy, Check, RefreshCw,
  BookOpen, Clock, BarChart2, Zap, MessageSquare,
  Code, Settings, Type, Brain, Wand2
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// TOKEN COUNTER/ESTIMATOR
// ============================================

// Simple tokenizer approximation (GPT-style)
function estimateTokens(text: string): {
  gpt: number
  claude: number
  words: number
  chars: number
} {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length
  const chars = text.length

  // GPT tokenization approximation: ~4 chars per token on average
  // Claude is similar but handles some patterns differently
  const gptTokens = Math.ceil(chars / 4)
  const claudeTokens = Math.ceil(chars / 3.8) // Claude tends to be slightly different

  return {
    gpt: text.length === 0 ? 0 : gptTokens,
    claude: text.length === 0 ? 0 : claudeTokens,
    words,
    chars,
  }
}

export function TokenCounter() {
  const [text, setText] = useState('')
  const [stats, setStats] = useState({ gpt: 0, claude: 0, words: 0, chars: 0 })

  useEffect(() => {
    setStats(estimateTokens(text))
  }, [text])

  const modelPricing = [
    { name: 'GPT-4o', inputPrice: 2.50, outputPrice: 10.00, tokens: stats.gpt },
    { name: 'GPT-4 Turbo', inputPrice: 10.00, outputPrice: 30.00, tokens: stats.gpt },
    { name: 'Claude 3.5 Sonnet', inputPrice: 3.00, outputPrice: 15.00, tokens: stats.claude },
    { name: 'Claude 3 Opus', inputPrice: 15.00, outputPrice: 75.00, tokens: stats.claude },
  ]

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <Hash className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <h3 className="font-bold">Token Counter</h3>
          <p className="text-xs text-muted-foreground">Estimate tokens & API costs</p>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here to count tokens..."
          rows={4}
          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-purple-500 focus:outline-none resize-none text-sm"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-500">{stats.gpt.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">GPT Tokens</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-orange-500">{stats.claude.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Claude Tokens</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold">{stats.words.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Words</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold">{stats.chars.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Characters</p>
          </div>
        </div>

        {/* Cost Estimation */}
        {stats.gpt > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Estimated Input Cost (per 1M tokens):</p>
            <div className="grid grid-cols-2 gap-2">
              {modelPricing.map((model) => (
                <div key={model.name} className="flex justify-between p-2 bg-muted/30 rounded text-xs">
                  <span>{model.name}</span>
                  <span className="font-mono text-green-500">
                    ${((model.tokens / 1000000) * model.inputPrice).toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// PROMPT TEMPLATE BUILDER
// ============================================

const PROMPT_TEMPLATES = [
  {
    name: 'System Prompt',
    template: `You are a helpful assistant that specializes in {{SPECIALTY}}.

Your key responsibilities:
- {{RESPONSIBILITY_1}}
- {{RESPONSIBILITY_2}}
- {{RESPONSIBILITY_3}}

Always respond in a {{TONE}} manner.`,
  },
  {
    name: 'Chain of Thought',
    template: `Let's solve this step by step:

Problem: {{PROBLEM}}

Think through this carefully:
1. First, identify the key elements
2. Then, analyze the relationships
3. Finally, derive the solution

Show your reasoning at each step.`,
  },
  {
    name: 'Few-Shot Learning',
    template: `Here are some examples:

Example 1:
Input: {{EXAMPLE_INPUT_1}}
Output: {{EXAMPLE_OUTPUT_1}}

Example 2:
Input: {{EXAMPLE_INPUT_2}}
Output: {{EXAMPLE_OUTPUT_2}}

Now, complete this:
Input: {{USER_INPUT}}
Output:`,
  },
  {
    name: 'Role Play',
    template: `You are {{CHARACTER_NAME}}, a {{CHARACTER_DESCRIPTION}}.

Background: {{BACKGROUND}}

Speaking style: {{SPEAKING_STYLE}}

Respond to the following as this character:
{{USER_MESSAGE}}`,
  },
]

export function PromptTemplateBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const [customPrompt, setCustomPrompt] = useState(PROMPT_TEMPLATES[0].template)
  const [copied, setCopied] = useState(false)

  const handleTemplateChange = (index: number) => {
    setSelectedTemplate(index)
    setCustomPrompt(PROMPT_TEMPLATES[index].template)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(customPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const extractVariables = (text: string): string[] => {
    const matches = text.match(/\{\{([^}]+)\}\}/g)
    return matches ? [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))] : []
  }

  const variables = extractVariables(customPrompt)

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <Wand2 className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-bold">Prompt Template Builder</h3>
          <p className="text-xs text-muted-foreground">Build effective prompts with templates</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Template Selection */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {PROMPT_TEMPLATES.map((template, index) => (
            <button
              key={template.name}
              onClick={() => handleTemplateChange(index)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                selectedTemplate === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-muted/50 hover:bg-muted text-muted-foreground'
              )}
            >
              {template.name}
            </button>
          ))}
        </div>

        {/* Editor */}
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          rows={8}
          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-blue-500 focus:outline-none resize-none font-mono text-sm"
        />

        {/* Variables */}
        {variables.length > 0 && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-2">Variables to replace:</p>
            <div className="flex flex-wrap gap-1">
              {variables.map((v) => (
                <span key={v} className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded text-xs font-mono">
                  {`{{${v}}}`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Template'}
        </button>
      </div>
    </div>
  )
}

// ============================================
// TEXT READABILITY ANALYZER
// ============================================

function calculateReadability(text: string) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = text.trim().split(/\s+/).filter(w => w.length > 0)
  const syllables = words.reduce((total, word) => {
    return total + countSyllables(word)
  }, 0)

  if (words.length === 0 || sentences.length === 0) {
    return { fleschKincaid: 0, readingLevel: 'N/A', readingTime: 0, speakingTime: 0 }
  }

  // Flesch-Kincaid Grade Level
  const avgWordsPerSentence = words.length / sentences.length
  const avgSyllablesPerWord = syllables / words.length
  const fleschKincaid = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59

  // Reading time (average 200 words per minute)
  const readingTime = Math.ceil(words.length / 200)

  // Speaking time (average 150 words per minute)
  const speakingTime = Math.ceil(words.length / 150)

  // Grade level interpretation
  let readingLevel = 'College Graduate'
  if (fleschKincaid <= 5) readingLevel = 'Elementary'
  else if (fleschKincaid <= 8) readingLevel = 'Middle School'
  else if (fleschKincaid <= 12) readingLevel = 'High School'
  else if (fleschKincaid <= 16) readingLevel = 'College'

  return {
    fleschKincaid: Math.max(0, Math.round(fleschKincaid * 10) / 10),
    readingLevel,
    readingTime,
    speakingTime,
    sentenceCount: sentences.length,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
  }
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '')
  if (word.length <= 3) return 1
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '')
  const matches = word.match(/[aeiouy]{1,2}/g)
  return matches ? matches.length : 1
}

export function TextReadabilityAnalyzer() {
  const [text, setText] = useState('')
  const [analysis, setAnalysis] = useState<ReturnType<typeof calculateReadability> | null>(null)

  useEffect(() => {
    if (text.trim()) {
      setAnalysis(calculateReadability(text))
    } else {
      setAnalysis(null)
    }
  }, [text])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h3 className="font-bold">Readability Analyzer</h3>
          <p className="text-xs text-muted-foreground">Analyze text complexity & reading level</p>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text to analyze readability..."
          rows={4}
          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-green-500 focus:outline-none resize-none text-sm"
        />

        {analysis && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Grade Level</span>
              </div>
              <p className="text-2xl font-bold">{analysis.fleschKincaid}</p>
              <p className="text-xs text-muted-foreground">{analysis.readingLevel}</p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Reading Time</span>
              </div>
              <p className="text-2xl font-bold">{analysis.readingTime} min</p>
              <p className="text-xs text-muted-foreground">~{analysis.speakingTime} min speaking</p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Sentences</span>
              </div>
              <p className="text-2xl font-bold">{analysis.sentenceCount}</p>
              <p className="text-xs text-muted-foreground">~{analysis.avgWordsPerSentence} words each</p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Complexity</span>
              </div>
              <p className="text-2xl font-bold">
                {analysis.fleschKincaid <= 8 ? 'Easy' : analysis.fleschKincaid <= 12 ? 'Medium' : 'Hard'}
              </p>
              <p className="text-xs text-muted-foreground">
                {analysis.fleschKincaid <= 8 ? 'Clear & accessible' : analysis.fleschKincaid <= 12 ? 'Standard' : 'Complex text'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// JSON SCHEMA GENERATOR
// ============================================

export function JSONSchemaGenerator() {
  const [jsonInput, setJsonInput] = useState('')
  const [schema, setSchema] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const generateSchema = useCallback(() => {
    setError('')
    if (!jsonInput.trim()) {
      setSchema('')
      return
    }

    try {
      const parsed = JSON.parse(jsonInput)
      const generated = inferSchema(parsed)
      setSchema(JSON.stringify(generated, null, 2))
    } catch {
      setError('Invalid JSON')
      setSchema('')
    }
  }, [jsonInput])

  useEffect(() => {
    generateSchema()
  }, [generateSchema])

  const inferSchema = (value: unknown): object => {
    if (value === null) {
      return { type: 'null' }
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return { type: 'array', items: {} }
      }
      return {
        type: 'array',
        items: inferSchema(value[0]),
      }
    }

    if (typeof value === 'object') {
      const properties: Record<string, object> = {}
      const required: string[] = []

      for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
        properties[key] = inferSchema(val)
        if (val !== null && val !== undefined) {
          required.push(key)
        }
      }

      return {
        type: 'object',
        properties,
        required,
      }
    }

    if (typeof value === 'string') {
      // Check for common patterns
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        return { type: 'string', format: 'date-time' }
      }
      if (/^https?:\/\//.test(value)) {
        return { type: 'string', format: 'uri' }
      }
      if (/^[^@]+@[^@]+\.[^@]+$/.test(value)) {
        return { type: 'string', format: 'email' }
      }
      return { type: 'string' }
    }

    if (typeof value === 'number') {
      return Number.isInteger(value) ? { type: 'integer' } : { type: 'number' }
    }

    if (typeof value === 'boolean') {
      return { type: 'boolean' }
    }

    return { type: typeof value }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(schema)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
          <Code className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h3 className="font-bold">JSON Schema Generator</h3>
          <p className="text-xs text-muted-foreground">Generate schemas for function calling</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Input JSON:</label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{"name": "John", "age": 30}'
            rows={4}
            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-orange-500 focus:outline-none resize-none font-mono text-sm"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {schema && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-muted-foreground">Generated Schema:</label>
              <button
                onClick={handleCopy}
                className="text-xs text-orange-500 hover:text-orange-400 flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 bg-muted/50 rounded-lg overflow-x-auto text-xs font-mono max-h-48">
              {schema}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// REGEX TESTER
// ============================================

export function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testText, setTestText] = useState('')
  const [result, setResult] = useState<{
    matches: string[]
    groups: Record<string, string>[]
    isValid: boolean
    error?: string
  } | null>(null)

  const testRegex = useCallback(() => {
    if (!pattern) {
      setResult(null)
      return
    }

    try {
      const regex = new RegExp(pattern, flags)
      const matches: string[] = []
      const groups: Record<string, string>[] = []

      let match
      const tempText = testText || ''

      if (flags.includes('g')) {
        while ((match = regex.exec(tempText)) !== null) {
          matches.push(match[0])
          if (match.groups) {
            groups.push(match.groups)
          }
        }
      } else {
        match = regex.exec(tempText)
        if (match) {
          matches.push(match[0])
          if (match.groups) {
            groups.push(match.groups)
          }
        }
      }

      setResult({
        matches,
        groups,
        isValid: true,
      })
    } catch (e) {
      setResult({
        matches: [],
        groups: [],
        isValid: false,
        error: (e as Error).message,
      })
    }
  }, [pattern, flags, testText])

  useEffect(() => {
    testRegex()
  }, [testRegex])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
          <Code className="w-5 h-5 text-cyan-500" />
        </div>
        <div>
          <h3 className="font-bold">Regex Tester</h3>
          <p className="text-xs text-muted-foreground">Test regular expressions for text processing</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern..."
            className="flex-1 px-4 py-2 bg-muted/50 border border-border rounded-lg focus:border-cyan-500 focus:outline-none font-mono text-sm"
          />
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="g"
            className="w-16 px-2 py-2 bg-muted/50 border border-border rounded-lg focus:border-cyan-500 focus:outline-none font-mono text-sm text-center"
          />
        </div>

        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="Enter test text..."
          rows={3}
          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-cyan-500 focus:outline-none resize-none text-sm"
        />

        {result && (
          <div className="space-y-2">
            {result.error ? (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                Error: {result.error}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Matches:</span>
                  <span className="text-sm text-muted-foreground">{result.matches.length} found</span>
                </div>
                {result.matches.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {result.matches.slice(0, 20).map((match, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-cyan-500/10 text-cyan-500 rounded text-xs font-mono">
                        {match || '(empty)'}
                      </span>
                    ))}
                    {result.matches.length > 20 && (
                      <span className="text-xs text-muted-foreground">+{result.matches.length - 20} more</span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Common flags:</p>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-muted rounded">g - global</span>
            <span className="px-2 py-0.5 bg-muted rounded">i - case-insensitive</span>
            <span className="px-2 py-0.5 bg-muted rounded">m - multiline</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// TEXT DIFF VIEWER
// ============================================

export function TextDiffViewer() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [diff, setDiff] = useState<{ type: 'same' | 'add' | 'remove'; text: string }[]>([])

  const computeDiff = useCallback(() => {
    const lines1 = text1.split('\n')
    const lines2 = text2.split('\n')
    const result: { type: 'same' | 'add' | 'remove'; text: string }[] = []

    const maxLen = Math.max(lines1.length, lines2.length)

    for (let i = 0; i < maxLen; i++) {
      const line1 = lines1[i]
      const line2 = lines2[i]

      if (line1 === line2) {
        if (line1 !== undefined) {
          result.push({ type: 'same', text: line1 })
        }
      } else {
        if (line1 !== undefined) {
          result.push({ type: 'remove', text: line1 })
        }
        if (line2 !== undefined) {
          result.push({ type: 'add', text: line2 })
        }
      }
    }

    setDiff(result)
  }, [text1, text2])

  useEffect(() => {
    computeDiff()
  }, [computeDiff])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-yellow-500" />
        </div>
        <div>
          <h3 className="font-bold">Text Diff Viewer</h3>
          <p className="text-xs text-muted-foreground">Compare two text outputs line by line</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Original Text</label>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Paste original text..."
              rows={4}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-yellow-500 focus:outline-none resize-none text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Modified Text</label>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Paste modified text..."
              rows={4}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-yellow-500 focus:outline-none resize-none text-sm font-mono"
            />
          </div>
        </div>

        {diff.length > 0 && (
          <div className="p-3 bg-muted/30 rounded-lg max-h-48 overflow-y-auto">
            <p className="text-xs font-medium text-muted-foreground mb-2">Diff Output:</p>
            <div className="space-y-0.5 font-mono text-xs">
              {diff.map((line, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'px-2 py-0.5 rounded',
                    line.type === 'add' && 'bg-green-500/20 text-green-500',
                    line.type === 'remove' && 'bg-red-500/20 text-red-500',
                    line.type === 'same' && 'text-muted-foreground'
                  )}
                >
                  <span className="mr-2">{line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}</span>
                  {line.text || '(empty line)'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// MODEL COMPARISON CHART
// ============================================

const AI_MODELS = [
  { name: 'GPT-4o', provider: 'OpenAI', context: '128K', inputPrice: 2.5, outputPrice: 10, speed: 'Fast', quality: 95 },
  { name: 'GPT-4 Turbo', provider: 'OpenAI', context: '128K', inputPrice: 10, outputPrice: 30, speed: 'Medium', quality: 98 },
  { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', context: '200K', inputPrice: 3, outputPrice: 15, speed: 'Fast', quality: 96 },
  { name: 'Claude 3 Opus', provider: 'Anthropic', context: '200K', inputPrice: 15, outputPrice: 75, speed: 'Slow', quality: 99 },
  { name: 'Gemini 1.5 Pro', provider: 'Google', context: '1M', inputPrice: 3.5, outputPrice: 10.5, speed: 'Fast', quality: 94 },
  { name: 'Llama 3.1 405B', provider: 'Meta', context: '128K', inputPrice: 0, outputPrice: 0, speed: 'Variable', quality: 92 },
  { name: 'Mistral Large', provider: 'Mistral', context: '32K', inputPrice: 4, outputPrice: 12, speed: 'Fast', quality: 90 },
]

export function ModelComparison() {
  const [sortBy, setSortBy] = useState<'quality' | 'inputPrice' | 'outputPrice'>('quality')

  const sortedModels = [...AI_MODELS].sort((a, b) => {
    if (sortBy === 'quality') return b.quality - a.quality
    if (sortBy === 'inputPrice') return a.inputPrice - b.inputPrice
    return a.outputPrice - b.outputPrice
  })

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-pink-500" />
        </div>
        <div>
          <h3 className="font-bold">Model Comparison</h3>
          <p className="text-xs text-muted-foreground">Compare AI model specs & pricing</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          {[
            { key: 'quality', label: 'By Quality' },
            { key: 'inputPrice', label: 'By Input Price' },
            { key: 'outputPrice', label: 'By Output Price' },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setSortBy(option.key as typeof sortBy)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                sortBy === option.key
                  ? 'bg-pink-500 text-white'
                  : 'bg-muted/50 hover:bg-muted text-muted-foreground'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {sortedModels.map((model) => (
            <div key={model.name} className="p-3 bg-muted/30 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm">{model.name}</span>
                <span className="text-xs text-muted-foreground">{model.provider}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Context: </span>
                  <span className="font-mono">{model.context}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">In: </span>
                  <span className="font-mono text-green-500">${model.inputPrice}/M</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Out: </span>
                  <span className="font-mono text-yellow-500">${model.outputPrice}/M</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Quality: </span>
                  <span className="font-mono">{model.quality}/100</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Prices are per 1M tokens. Quality scores are estimates based on benchmarks.
        </p>
      </div>
    </div>
  )
}

// ============================================
// SYSTEM PROMPT LIBRARY
// ============================================

const SYSTEM_PROMPTS = [
  {
    name: 'Code Assistant',
    category: 'Development',
    prompt: `You are an expert software engineer. When helping with code:
- Write clean, well-documented code
- Follow best practices and design patterns
- Explain your reasoning
- Consider edge cases and error handling
- Suggest improvements when appropriate`,
  },
  {
    name: 'Data Analyst',
    category: 'Analysis',
    prompt: `You are a data analysis expert. When analyzing data:
- Look for patterns and trends
- Calculate relevant statistics
- Visualize insights clearly
- Identify outliers and anomalies
- Provide actionable recommendations`,
  },
  {
    name: 'Technical Writer',
    category: 'Writing',
    prompt: `You are a technical documentation expert. When writing:
- Use clear, concise language
- Structure content logically
- Include examples and code snippets
- Define technical terms
- Follow documentation best practices`,
  },
  {
    name: 'Tutor',
    category: 'Education',
    prompt: `You are a patient and knowledgeable tutor. When teaching:
- Explain concepts from first principles
- Use analogies and examples
- Check for understanding
- Encourage questions
- Adapt to the learner's level`,
  },
  {
    name: 'Reviewer',
    category: 'Development',
    prompt: `You are a senior code reviewer. When reviewing:
- Check for bugs and security issues
- Evaluate code quality and style
- Suggest improvements
- Be constructive and specific
- Prioritize critical issues`,
  },
]

export function SystemPromptLibrary() {
  const [selectedPrompt, setSelectedPrompt] = useState<typeof SYSTEM_PROMPTS[0] | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = async (prompt: string) => {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <h3 className="font-bold">System Prompt Library</h3>
          <p className="text-xs text-muted-foreground">Pre-built prompts for common use cases</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {SYSTEM_PROMPTS.map((prompt) => (
            <button
              key={prompt.name}
              onClick={() => setSelectedPrompt(prompt)}
              className={cn(
                'p-3 rounded-lg text-left transition-colors',
                selectedPrompt?.name === prompt.name
                  ? 'bg-indigo-500/10 border border-indigo-500/30'
                  : 'bg-muted/30 hover:bg-muted/50 border border-transparent'
              )}
            >
              <p className="font-medium text-sm">{prompt.name}</p>
              <p className="text-xs text-muted-foreground">{prompt.category}</p>
            </button>
          ))}
        </div>

        {selectedPrompt && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium">{selectedPrompt.name}</span>
              <button
                onClick={() => handleCopy(selectedPrompt.prompt)}
                className="text-xs text-indigo-500 hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="text-xs font-mono whitespace-pre-wrap text-muted-foreground">
              {selectedPrompt.prompt}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// EMBEDDINGS SIMILARITY CALCULATOR
// ============================================

// Simple word-based embedding simulation (in production, use actual embeddings API)
function getWordFrequency(text: string): Map<string, number> {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2)
  const freq = new Map<string, number>()
  words.forEach(word => {
    freq.set(word, (freq.get(word) || 0) + 1)
  })
  return freq
}

function cosineSimilarity(freq1: Map<string, number>, freq2: Map<string, number>): number {
  const allWords = new Set([...freq1.keys(), ...freq2.keys()])
  let dotProduct = 0
  let magnitude1 = 0
  let magnitude2 = 0

  allWords.forEach(word => {
    const v1 = freq1.get(word) || 0
    const v2 = freq2.get(word) || 0
    dotProduct += v1 * v2
    magnitude1 += v1 * v1
    magnitude2 += v2 * v2
  })

  if (magnitude1 === 0 || magnitude2 === 0) return 0
  return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2))
}

export function EmbeddingsSimilarityCalculator() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [similarity, setSimilarity] = useState<number | null>(null)
  const [sharedWords, setSharedWords] = useState<string[]>([])

  useEffect(() => {
    if (text1.trim() && text2.trim()) {
      const freq1 = getWordFrequency(text1)
      const freq2 = getWordFrequency(text2)
      const sim = cosineSimilarity(freq1, freq2)
      setSimilarity(sim)

      // Find shared words
      const shared = [...freq1.keys()].filter(w => freq2.has(w)).slice(0, 10)
      setSharedWords(shared)
    } else {
      setSimilarity(null)
      setSharedWords([])
    }
  }, [text1, text2])

  const getSimilarityColor = (sim: number) => {
    if (sim >= 0.8) return 'text-green-500'
    if (sim >= 0.5) return 'text-yellow-500'
    if (sim >= 0.3) return 'text-orange-500'
    return 'text-red-500'
  }

  const getSimilarityLabel = (sim: number) => {
    if (sim >= 0.8) return 'Very Similar'
    if (sim >= 0.5) return 'Moderately Similar'
    if (sim >= 0.3) return 'Somewhat Similar'
    return 'Different'
  }

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-violet-500" />
        </div>
        <div>
          <h3 className="font-bold">Embeddings Similarity</h3>
          <p className="text-xs text-muted-foreground">Calculate text similarity using cosine distance</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Text A</label>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Enter first text..."
              rows={3}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-violet-500 focus:outline-none resize-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Text B</label>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Enter second text..."
              rows={3}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-violet-500 focus:outline-none resize-none text-sm"
            />
          </div>
        </div>

        {similarity !== null && (
          <div className="space-y-3">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">Cosine Similarity</p>
              <p className={cn('text-3xl font-bold', getSimilarityColor(similarity))}>
                {(similarity * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">{getSimilarityLabel(similarity)}</p>
            </div>

            {/* Similarity Bar */}
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  similarity >= 0.8 ? 'bg-green-500' :
                  similarity >= 0.5 ? 'bg-yellow-500' :
                  similarity >= 0.3 ? 'bg-orange-500' : 'bg-red-500'
                )}
                style={{ width: `${similarity * 100}%` }}
              />
            </div>

            {sharedWords.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Shared keywords:</p>
                <div className="flex flex-wrap gap-1">
                  {sharedWords.map(word => (
                    <span key={word} className="px-2 py-0.5 bg-violet-500/10 text-violet-500 rounded text-xs">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// CONTEXT WINDOW VISUALIZER
// ============================================

const CONTEXT_WINDOWS = [
  { model: 'GPT-3.5 Turbo', tokens: 16385, color: 'bg-green-500' },
  { model: 'GPT-4', tokens: 8192, color: 'bg-blue-500' },
  { model: 'GPT-4 Turbo', tokens: 128000, color: 'bg-purple-500' },
  { model: 'GPT-4o', tokens: 128000, color: 'bg-cyan-500' },
  { model: 'Claude 3 Haiku', tokens: 200000, color: 'bg-orange-500' },
  { model: 'Claude 3.5 Sonnet', tokens: 200000, color: 'bg-pink-500' },
  { model: 'Claude 3 Opus', tokens: 200000, color: 'bg-red-500' },
  { model: 'Gemini 1.5 Pro', tokens: 1000000, color: 'bg-yellow-500' },
  { model: 'Llama 3.1', tokens: 128000, color: 'bg-indigo-500' },
]

export function ContextWindowVisualizer() {
  const [inputText, setInputText] = useState('')
  const [selectedModel, setSelectedModel] = useState(CONTEXT_WINDOWS[5]) // Claude 3.5 Sonnet

  const estimatedTokens = Math.ceil(inputText.length / 4)
  const usagePercent = Math.min((estimatedTokens / selectedModel.tokens) * 100, 100)
  const remainingTokens = Math.max(selectedModel.tokens - estimatedTokens, 0)

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-cyan-500" />
        </div>
        <div>
          <h3 className="font-bold">Context Window Visualizer</h3>
          <p className="text-xs text-muted-foreground">Visualize context usage across models</p>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your prompt to visualize context usage..."
          rows={4}
          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-cyan-500 focus:outline-none resize-none text-sm"
        />

        {/* Model Selection */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CONTEXT_WINDOWS.map((model) => (
            <button
              key={model.model}
              onClick={() => setSelectedModel(model)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                selectedModel.model === model.model
                  ? 'bg-cyan-500 text-white'
                  : 'bg-muted/50 hover:bg-muted text-muted-foreground'
              )}
            >
              {model.model}
            </button>
          ))}
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-xl font-bold text-cyan-500">{estimatedTokens.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Tokens Used</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-xl font-bold text-green-500">{remainingTokens.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-xl font-bold">{selectedModel.tokens.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Max Tokens</p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{selectedModel.model}</span>
            <span className={usagePercent > 90 ? 'text-red-500' : 'text-muted-foreground'}>
              {usagePercent.toFixed(1)}% used
            </span>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-yellow-500' : selectedModel.color
              )}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          {usagePercent > 90 && (
            <p className="text-xs text-red-500">Warning: Near context limit. Consider using a model with larger context window.</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// API COST CALCULATOR
// ============================================

const API_PRICING = [
  { provider: 'OpenAI', model: 'GPT-4o', inputPrice: 2.50, outputPrice: 10.00, cached: 1.25 },
  { provider: 'OpenAI', model: 'GPT-4o mini', inputPrice: 0.15, outputPrice: 0.60, cached: 0.075 },
  { provider: 'OpenAI', model: 'GPT-4 Turbo', inputPrice: 10.00, outputPrice: 30.00, cached: null },
  { provider: 'OpenAI', model: 'o1', inputPrice: 15.00, outputPrice: 60.00, cached: 7.50 },
  { provider: 'OpenAI', model: 'o1-mini', inputPrice: 3.00, outputPrice: 12.00, cached: 1.50 },
  { provider: 'Anthropic', model: 'Claude 3.5 Sonnet', inputPrice: 3.00, outputPrice: 15.00, cached: 0.30 },
  { provider: 'Anthropic', model: 'Claude 3 Opus', inputPrice: 15.00, outputPrice: 75.00, cached: 1.50 },
  { provider: 'Anthropic', model: 'Claude 3 Haiku', inputPrice: 0.25, outputPrice: 1.25, cached: 0.03 },
  { provider: 'Google', model: 'Gemini 1.5 Pro', inputPrice: 3.50, outputPrice: 10.50, cached: null },
  { provider: 'Google', model: 'Gemini 1.5 Flash', inputPrice: 0.075, outputPrice: 0.30, cached: null },
]

export function APICostCalculator() {
  const [inputTokens, setInputTokens] = useState('1000')
  const [outputTokens, setOutputTokens] = useState('500')
  const [requestsPerDay, setRequestsPerDay] = useState('100')
  const [sortBy, setSortBy] = useState<'total' | 'input' | 'output'>('total')

  const inputT = parseInt(inputTokens) || 0
  const outputT = parseInt(outputTokens) || 0
  const requests = parseInt(requestsPerDay) || 0

  const calculations = API_PRICING.map(pricing => {
    const inputCost = (inputT / 1000000) * pricing.inputPrice
    const outputCost = (outputT / 1000000) * pricing.outputPrice
    const totalPerRequest = inputCost + outputCost
    const dailyCost = totalPerRequest * requests
    const monthlyCost = dailyCost * 30

    return {
      ...pricing,
      inputCost,
      outputCost,
      totalPerRequest,
      dailyCost,
      monthlyCost,
    }
  }).sort((a, b) => {
    if (sortBy === 'input') return a.inputCost - b.inputCost
    if (sortBy === 'output') return a.outputCost - b.outputCost
    return a.totalPerRequest - b.totalPerRequest
  })

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h3 className="font-bold">API Cost Calculator</h3>
          <p className="text-xs text-muted-foreground">Estimate API costs across providers</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Input Tokens</label>
            <input
              type="number"
              value={inputTokens}
              onChange={(e) => setInputTokens(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-green-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Output Tokens</label>
            <input
              type="number"
              value={outputTokens}
              onChange={(e) => setOutputTokens(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-green-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Requests/Day</label>
            <input
              type="number"
              value={requestsPerDay}
              onChange={(e) => setRequestsPerDay(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-green-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex gap-2">
          {[
            { key: 'total', label: 'By Total' },
            { key: 'input', label: 'By Input' },
            { key: 'output', label: 'By Output' },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setSortBy(option.key as typeof sortBy)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                sortBy === option.key
                  ? 'bg-green-500 text-white'
                  : 'bg-muted/50 hover:bg-muted text-muted-foreground'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {calculations.map((calc, idx) => (
            <div key={calc.model} className={cn(
              'p-3 rounded-lg',
              idx === 0 ? 'bg-green-500/10 border border-green-500/30' : 'bg-muted/30'
            )}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm">{calc.model}</span>
                <span className="text-xs text-muted-foreground">{calc.provider}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Per request: </span>
                  <span className="font-mono text-green-500">${calc.totalPerRequest.toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Daily: </span>
                  <span className="font-mono text-yellow-500">${calc.dailyCost.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Monthly: </span>
                  <span className="font-mono text-orange-500">${calc.monthlyCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// RAG CHUNKING PREVIEW
// ============================================

export function RAGChunkingPreview() {
  const [text, setText] = useState('')
  const [chunkSize, setChunkSize] = useState('500')
  const [overlap, setOverlap] = useState('50')
  const [chunks, setChunks] = useState<string[]>([])

  const chunkText = useCallback(() => {
    if (!text.trim()) {
      setChunks([])
      return
    }

    const size = parseInt(chunkSize) || 500
    const overlapSize = parseInt(overlap) || 50
    const result: string[] = []
    let start = 0

    while (start < text.length) {
      const end = Math.min(start + size, text.length)
      result.push(text.slice(start, end))
      start = end - overlapSize
      if (start >= text.length) break
    }

    setChunks(result)
  }, [text, chunkSize, overlap])

  useEffect(() => {
    chunkText()
  }, [chunkText])

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h3 className="font-bold">RAG Chunking Preview</h3>
          <p className="text-xs text-muted-foreground">Preview text chunking for RAG pipelines</p>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your document text to preview chunking..."
          rows={4}
          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-amber-500 focus:outline-none resize-none text-sm"
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Chunk Size (chars)</label>
            <input
              type="number"
              value={chunkSize}
              onChange={(e) => setChunkSize(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-amber-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Overlap (chars)</label>
            <input
              type="number"
              value={overlap}
              onChange={(e) => setOverlap(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-amber-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="p-2 bg-muted/50 rounded-lg text-center">
            <p className="text-lg font-bold text-amber-500">{chunks.length}</p>
            <p className="text-xs text-muted-foreground">Chunks</p>
          </div>
          <div className="p-2 bg-muted/50 rounded-lg text-center">
            <p className="text-lg font-bold">{text.length}</p>
            <p className="text-xs text-muted-foreground">Total Chars</p>
          </div>
          <div className="p-2 bg-muted/50 rounded-lg text-center">
            <p className="text-lg font-bold">{Math.ceil(text.length / 4)}</p>
            <p className="text-xs text-muted-foreground">Est. Tokens</p>
          </div>
          <div className="p-2 bg-muted/50 rounded-lg text-center">
            <p className="text-lg font-bold">{parseInt(overlap) > 0 ? Math.round((parseInt(overlap) / parseInt(chunkSize)) * 100) : 0}%</p>
            <p className="text-xs text-muted-foreground">Overlap %</p>
          </div>
        </div>

        {/* Chunk Preview */}
        {chunks.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {chunks.map((chunk, idx) => (
              <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-amber-500">Chunk {idx + 1}</span>
                  <span className="text-xs text-muted-foreground">{chunk.length} chars</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{chunk}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// LLM BENCHMARK COMPARISON
// ============================================

const BENCHMARK_DATA = [
  { model: 'GPT-4o', mmlu: 88.7, humanEval: 90.2, mathBench: 76.6, reasoning: 92.5 },
  { model: 'GPT-4 Turbo', mmlu: 86.4, humanEval: 87.0, mathBench: 72.6, reasoning: 90.1 },
  { model: 'Claude 3.5 Sonnet', mmlu: 88.7, humanEval: 92.0, mathBench: 78.3, reasoning: 94.2 },
  { model: 'Claude 3 Opus', mmlu: 86.8, humanEval: 84.9, mathBench: 70.1, reasoning: 91.5 },
  { model: 'Gemini 1.5 Pro', mmlu: 85.9, humanEval: 84.1, mathBench: 74.7, reasoning: 89.3 },
  { model: 'Llama 3.1 405B', mmlu: 88.6, humanEval: 89.0, mathBench: 73.8, reasoning: 88.0 },
  { model: 'o1', mmlu: 91.8, humanEval: 94.8, mathBench: 94.8, reasoning: 97.2 },
  { model: 'o1-mini', mmlu: 85.2, humanEval: 92.4, mathBench: 90.0, reasoning: 93.1 },
]

export function LLMBenchmarkComparison() {
  const [sortBy, setSortBy] = useState<'mmlu' | 'humanEval' | 'mathBench' | 'reasoning'>('reasoning')

  const sortedData = [...BENCHMARK_DATA].sort((a, b) => b[sortBy] - a[sortBy])

  const benchmarks = [
    { key: 'mmlu', label: 'MMLU', description: 'Knowledge' },
    { key: 'humanEval', label: 'HumanEval', description: 'Coding' },
    { key: 'mathBench', label: 'MATH', description: 'Math' },
    { key: 'reasoning', label: 'Reasoning', description: 'Logic' },
  ]

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <Brain className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-bold">LLM Benchmark Comparison</h3>
          <p className="text-xs text-muted-foreground">Compare models across key benchmarks</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Benchmark Selection */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {benchmarks.map((b) => (
            <button
              key={b.key}
              onClick={() => setSortBy(b.key as typeof sortBy)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                sortBy === b.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-muted/50 hover:bg-muted text-muted-foreground'
              )}
            >
              {b.label} ({b.description})
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-2">
          {sortedData.map((model, idx) => (
            <div key={model.model} className={cn(
              'p-3 rounded-lg',
              idx === 0 ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-muted/30'
            )}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {idx === 0 && <span className="text-xs bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded">Best</span>}
                  <span className="font-medium text-sm">{model.model}</span>
                </div>
                <span className="text-lg font-bold text-blue-500">{model[sortBy]}%</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {benchmarks.map(b => (
                  <div key={b.key} className={cn(
                    'text-center p-1 rounded',
                    b.key === sortBy ? 'bg-blue-500/20' : ''
                  )}>
                    <p className="text-muted-foreground">{b.label}</p>
                    <p className="font-mono">{model[b.key as keyof typeof model]}%</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// TEMPERATURE & TOP-P VISUALIZER
// ============================================

export function TemperatureVisualizer() {
  const [temperature, setTemperature] = useState(0.7)
  const [topP, setTopP] = useState(0.9)

  const sampleOutputs = [
    {
      temp: 0,
      output: 'The capital of France is Paris. Paris is the largest city in France and has been the capital since the 10th century.',
    },
    {
      temp: 0.3,
      output: 'Paris is the capital of France. It\'s a beautiful city known for the Eiffel Tower and rich history.',
    },
    {
      temp: 0.7,
      output: 'France\'s capital is the lovely Paris! A city where art, culture, and croissants meet in perfect harmony.',
    },
    {
      temp: 1.0,
      output: 'Ah, Paris! The City of Light beckons with its bohemian cafes, the Seine\'s gentle whispers, and dreams spun from golden sunsets.',
    },
    {
      temp: 1.5,
      output: 'France dances with Paris - a kaleidoscope where baguettes waltz with impressionist dreams under technicolor moons!',
    },
  ]

  const getClosestOutput = () => {
    const closest = sampleOutputs.reduce((prev, curr) =>
      Math.abs(curr.temp - temperature) < Math.abs(prev.temp - temperature) ? curr : prev
    )
    return closest.output
  }

  const getCreativityLevel = () => {
    if (temperature <= 0.2) return { level: 'Deterministic', color: 'text-blue-500', desc: 'Consistent, predictable outputs' }
    if (temperature <= 0.5) return { level: 'Conservative', color: 'text-green-500', desc: 'Slight variation, mostly focused' }
    if (temperature <= 0.8) return { level: 'Balanced', color: 'text-yellow-500', desc: 'Good mix of creativity and coherence' }
    if (temperature <= 1.2) return { level: 'Creative', color: 'text-orange-500', desc: 'More varied, imaginative outputs' }
    return { level: 'Wild', color: 'text-red-500', desc: 'Highly random, may lose coherence' }
  }

  const creativity = getCreativityLevel()

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
          <Zap className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h3 className="font-bold">Temperature & Top-P Visualizer</h3>
          <p className="text-xs text-muted-foreground">Understand sampling parameters</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Temperature Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Temperature</label>
            <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">{temperature.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-red-500"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Focused</span>
            <span>Creative</span>
            <span>Random</span>
          </div>
        </div>

        {/* Top-P Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Top-P (nucleus)</label>
            <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">{topP.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={topP}
            onChange={(e) => setTopP(parseFloat(e.target.value))}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Narrow</span>
            <span>Wide</span>
          </div>
        </div>

        {/* Creativity Level */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm">Creativity Level:</span>
            <span className={cn('font-medium', creativity.color)}>{creativity.level}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{creativity.desc}</p>
        </div>

        {/* Sample Output */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">Sample output at this temperature:</p>
          <p className="text-sm italic">&ldquo;{getClosestOutput()}&rdquo;</p>
        </div>

        {/* Recommendations */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Recommended settings:</p>
          <div className="grid grid-cols-2 gap-2">
            <span className="px-2 py-1 bg-muted rounded">Code: temp=0</span>
            <span className="px-2 py-1 bg-muted rounded">Analysis: temp=0.3</span>
            <span className="px-2 py-1 bg-muted rounded">Chat: temp=0.7</span>
            <span className="px-2 py-1 bg-muted rounded">Creative: temp=1.0</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// PROMPT INJECTION TESTER
// ============================================

const INJECTION_PATTERNS = [
  { pattern: /ignore (previous|all|above)/i, risk: 'high', type: 'Instruction Override' },
  { pattern: /forget (everything|all|your)/i, risk: 'high', type: 'Memory Wipe' },
  { pattern: /you are now/i, risk: 'high', type: 'Role Hijacking' },
  { pattern: /new instructions?:/i, risk: 'high', type: 'Instruction Injection' },
  { pattern: /disregard/i, risk: 'medium', type: 'Instruction Override' },
  { pattern: /pretend (you|to be)/i, risk: 'medium', type: 'Role Play Exploit' },
  { pattern: /act as (if|a)/i, risk: 'medium', type: 'Role Play Exploit' },
  { pattern: /system prompt/i, risk: 'medium', type: 'Prompt Extraction' },
  { pattern: /reveal your/i, risk: 'medium', type: 'Prompt Extraction' },
  { pattern: /bypass/i, risk: 'medium', type: 'Security Bypass' },
  { pattern: /jailbreak/i, risk: 'high', type: 'Jailbreak Attempt' },
  { pattern: /DAN|do anything now/i, risk: 'high', type: 'Jailbreak Attempt' },
  { pattern: /\[.*\]\(.*\)/i, risk: 'low', type: 'Hidden Link' },
  { pattern: /<script|javascript:/i, risk: 'medium', type: 'XSS Attempt' },
]

export function PromptInjectionTester() {
  const [prompt, setPrompt] = useState('')
  const [results, setResults] = useState<{
    pattern: string
    risk: string
    type: string
    match: string
  }[]>([])

  useEffect(() => {
    if (!prompt.trim()) {
      setResults([])
      return
    }

    const detected: typeof results = []
    INJECTION_PATTERNS.forEach(({ pattern, risk, type }) => {
      const match = prompt.match(pattern)
      if (match) {
        detected.push({
          pattern: pattern.source,
          risk,
          type,
          match: match[0],
        })
      }
    })
    setResults(detected)
  }, [prompt])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-500 bg-red-500/10'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10'
      case 'low': return 'text-blue-500 bg-blue-500/10'
      default: return 'text-muted-foreground bg-muted'
    }
  }

  const overallRisk = results.some(r => r.risk === 'high') ? 'High' :
                      results.some(r => r.risk === 'medium') ? 'Medium' :
                      results.length > 0 ? 'Low' : 'None'

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h3 className="font-bold">Prompt Injection Tester</h3>
          <p className="text-xs text-muted-foreground">Detect potential injection attacks</p>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste a user prompt to check for injection patterns..."
          rows={4}
          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-red-500 focus:outline-none resize-none text-sm"
        />

        {/* Overall Risk */}
        <div className={cn(
          'p-3 rounded-lg flex items-center justify-between',
          overallRisk === 'High' ? 'bg-red-500/10' :
          overallRisk === 'Medium' ? 'bg-yellow-500/10' :
          overallRisk === 'Low' ? 'bg-blue-500/10' : 'bg-green-500/10'
        )}>
          <span className="text-sm font-medium">Overall Risk:</span>
          <span className={cn(
            'font-bold',
            overallRisk === 'High' ? 'text-red-500' :
            overallRisk === 'Medium' ? 'text-yellow-500' :
            overallRisk === 'Low' ? 'text-blue-500' : 'text-green-500'
          )}>
            {overallRisk}
          </span>
        </div>

        {/* Detected Patterns */}
        {results.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Detected patterns ({results.length}):</p>
            {results.map((result, idx) => (
              <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">{result.type}</span>
                  <span className={cn('text-xs px-2 py-0.5 rounded', getRiskColor(result.risk))}>
                    {result.risk.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Matched: <span className="font-mono text-red-400">&ldquo;{result.match}&rdquo;</span>
                </p>
              </div>
            ))}
          </div>
        ) : prompt.trim() && (
          <div className="p-3 bg-green-500/10 rounded-lg text-center">
            <p className="text-sm text-green-500">No injection patterns detected</p>
          </div>
        )}

        {/* Tips */}
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Prevention tips:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Use system prompts to define strict boundaries</li>
            <li>Validate and sanitize user inputs</li>
            <li>Implement output filtering</li>
            <li>Use prompt templates with fixed structure</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================
// FINE-TUNING DATA FORMATTER
// ============================================

export function FineTuningDataFormatter() {
  const [systemPrompt, setSystemPrompt] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [assistantResponse, setAssistantResponse] = useState('')
  const [format, setFormat] = useState<'openai' | 'anthropic' | 'alpaca'>('openai')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!userMessage.trim() || !assistantResponse.trim()) {
      setOutput('')
      return
    }

    let formatted = ''

    switch (format) {
      case 'openai':
        formatted = JSON.stringify({
          messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: userMessage },
            { role: 'assistant', content: assistantResponse },
          ],
        }, null, 2)
        break

      case 'anthropic':
        formatted = JSON.stringify({
          system: systemPrompt || undefined,
          messages: [
            { role: 'user', content: userMessage },
            { role: 'assistant', content: assistantResponse },
          ],
        }, null, 2)
        break

      case 'alpaca':
        formatted = JSON.stringify({
          instruction: systemPrompt || 'You are a helpful assistant.',
          input: userMessage,
          output: assistantResponse,
        }, null, 2)
        break
    }

    setOutput(formatted)
  }, [systemPrompt, userMessage, assistantResponse, format])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <Type className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h3 className="font-bold">Fine-Tuning Data Formatter</h3>
          <p className="text-xs text-muted-foreground">Format training data for different providers</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Format Selection */}
        <div className="flex gap-2">
          {[
            { key: 'openai', label: 'OpenAI' },
            { key: 'anthropic', label: 'Anthropic' },
            { key: 'alpaca', label: 'Alpaca' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFormat(f.key as typeof format)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                format === f.key
                  ? 'bg-emerald-500 text-white'
                  : 'bg-muted/50 hover:bg-muted text-muted-foreground'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Input Fields */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">System Prompt (optional)</label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="You are a helpful assistant..."
            rows={2}
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-emerald-500 focus:outline-none resize-none text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">User Message *</label>
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="What the user asks..."
            rows={2}
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-emerald-500 focus:outline-none resize-none text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Assistant Response *</label>
          <textarea
            value={assistantResponse}
            onChange={(e) => setAssistantResponse(e.target.value)}
            placeholder="Expected assistant response..."
            rows={2}
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:border-emerald-500 focus:outline-none resize-none text-sm"
          />
        </div>

        {/* Output */}
        {output && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-muted-foreground">Formatted Output ({format}):</label>
              <button
                onClick={handleCopy}
                className="text-xs text-emerald-500 hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="p-3 bg-muted/50 rounded-lg overflow-x-auto text-xs font-mono max-h-40">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// AI TOOLS GRID
// ============================================

const TOOL_CATEGORIES = [
  { id: 'tokens', label: 'Tokens', icon: Hash },
  { id: 'prompts', label: 'Prompts', icon: Wand2 },
  { id: 'text', label: 'Text', icon: BookOpen },
  { id: 'schema', label: 'Schema', icon: Code },
  { id: 'llm', label: 'LLM Tools', icon: Brain },
  { id: 'safety', label: 'Safety', icon: RefreshCw },
  { id: 'advanced', label: 'Advanced', icon: Sparkles },
]

export function AIToolsGrid() {
  const [activeCategory, setActiveCategory] = useState('tokens')

  const renderTools = () => {
    switch (activeCategory) {
      case 'tokens':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <TokenCounter />
            <ContextWindowVisualizer />
          </div>
        )
      case 'prompts':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <PromptTemplateBuilder />
            <SystemPromptLibrary />
          </div>
        )
      case 'text':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <TextReadabilityAnalyzer />
            <TextDiffViewer />
          </div>
        )
      case 'schema':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <JSONSchemaGenerator />
            <FineTuningDataFormatter />
          </div>
        )
      case 'llm':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <LLMBenchmarkComparison />
            <APICostCalculator />
            <TemperatureVisualizer />
            <RAGChunkingPreview />
          </div>
        )
      case 'safety':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <PromptInjectionTester />
            <EmbeddingsSimilarityCalculator />
          </div>
        )
      case 'advanced':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <RegexTester />
            <ModelComparison />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TOOL_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              activeCategory === category.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-muted/50 hover:bg-muted text-muted-foreground'
            )}
          >
            <category.icon className="w-4 h-4" />
            {category.label}
          </button>
        ))}
      </div>

      {/* Tools Content */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderTools()}
      </motion.div>
    </div>
  )
}

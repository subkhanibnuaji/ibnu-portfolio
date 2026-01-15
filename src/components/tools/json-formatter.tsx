'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Braces, Copy, Check, Download, Trash2, Minimize2, Expand, AlertTriangle } from 'lucide-react'

const SAMPLE_JSON = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "skills": ["JavaScript", "React", "Node.js"],
  "active": true
}`

export function JSONFormatter() {
  const [input, setInput] = useState(SAMPLE_JSON)
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [indentSize, setIndentSize] = useState(2)

  const formatJSON = (minify = false) => {
    setError(null)
    try {
      const parsed = JSON.parse(input)
      const formatted = minify
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, indentSize)
      setOutput(formatted)
      setInput(formatted)
    } catch (e: any) {
      setError(e.message)
      setOutput('')
    }
  }

  const validateJSON = () => {
    setError(null)
    try {
      JSON.parse(input)
      setError(null)
      setOutput('Valid JSON!')
    } catch (e: any) {
      setError(e.message)
      setOutput('')
    }
  }

  const copyOutput = async () => {
    const textToCopy = output || input
    await navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadJSON = () => {
    const textToDownload = output || input
    const blob = new Blob([textToDownload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError(null)
  }

  const getJSONStats = () => {
    try {
      const parsed = JSON.parse(input)
      const keys = Object.keys(parsed).length
      const chars = input.length
      const lines = input.split('\n').length
      return { keys, chars, lines, type: Array.isArray(parsed) ? 'Array' : 'Object' }
    } catch {
      return null
    }
  }

  const stats = getJSONStats()

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-4">
          <Braces className="w-4 h-4" />
          Developer Tool
        </div>
        <h2 className="text-2xl font-bold">JSON Formatter</h2>
        <p className="text-muted-foreground mt-2">
          Format, validate, and minify JSON data.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => formatJSON(false)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 inline-flex items-center gap-2"
          >
            <Expand className="w-4 h-4" />
            Format
          </button>
          <button
            onClick={() => formatJSON(true)}
            className="px-4 py-2 bg-muted rounded-lg font-medium hover:bg-muted/80 inline-flex items-center gap-2"
          >
            <Minimize2 className="w-4 h-4" />
            Minify
          </button>
          <button
            onClick={validateJSON}
            className="px-4 py-2 bg-muted rounded-lg font-medium hover:bg-muted/80"
          >
            Validate
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm">Indent:</label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(parseInt(e.target.value))}
              className="px-3 py-1.5 rounded-lg border border-border bg-background"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>Tab</option>
            </select>
          </div>

          <div className="flex gap-1">
            <button
              onClick={copyOutput}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Copy"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
            <button
              onClick={downloadJSON}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={clearAll}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-red-500"
              title="Clear"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 rounded-xl border border-red-500/50 bg-red-500/10 text-red-500 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Invalid JSON</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Success Display */}
      {output === 'Valid JSON!' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 rounded-xl border border-green-500/50 bg-green-500/10 text-green-500 flex items-center gap-3"
        >
          <Check className="w-5 h-5" />
          <p className="font-medium">Valid JSON!</p>
        </motion.div>
      )}

      {/* Editor */}
      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setError(null)
            setOutput('')
          }}
          placeholder="Paste your JSON here..."
          className="w-full h-[500px] p-4 rounded-xl border border-border bg-card font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          spellCheck={false}
        />

        {/* Line numbers - simplified */}
        <div className="absolute left-0 top-0 w-8 h-full border-r border-border bg-muted/50 rounded-l-xl pointer-events-none">
          <div className="p-4 text-xs text-muted-foreground font-mono">
            {input.split('\n').slice(0, 30).map((_, i) => (
              <div key={i} className="h-[1.35rem] text-right pr-2">{i + 1}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mt-4 p-4 rounded-xl border border-border bg-card">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.type}</p>
              <p className="text-sm text-muted-foreground">Type</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.keys}</p>
              <p className="text-sm text-muted-foreground">Top-level Keys</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.lines}</p>
              <p className="text-sm text-muted-foreground">Lines</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.chars.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Characters</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Regex, Copy, Check, Info, Lightbulb } from 'lucide-react'

const COMMON_PATTERNS = [
  { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
  { name: 'Phone', pattern: '\\+?[1-9]\\d{1,14}' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
  { name: 'IPv4', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
  { name: 'Hex Color', pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})' },
  { name: 'Username', pattern: '[a-zA-Z0-9_]{3,16}' },
  { name: 'Password (8+ chars)', pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}' },
]

interface Match {
  text: string
  index: number
  groups: string[]
}

export function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('')
  const [copied, setCopied] = useState(false)

  const { regex, error, matches, highlightedText } = useMemo(() => {
    if (!pattern) {
      return { regex: null, error: null, matches: [], highlightedText: testString }
    }

    try {
      const reg = new RegExp(pattern, flags)
      const matchList: Match[] = []
      let match

      if (flags.includes('g')) {
        while ((match = reg.exec(testString)) !== null) {
          matchList.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          })
          if (!match[0]) break // Prevent infinite loop on zero-length matches
        }
      } else {
        match = reg.exec(testString)
        if (match) {
          matchList.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          })
        }
      }

      // Create highlighted text
      let highlighted = testString
      let offset = 0

      for (const m of matchList) {
        const start = m.index + offset
        const end = start + m.text.length
        const before = highlighted.slice(0, start)
        const matched = highlighted.slice(start, end)
        const after = highlighted.slice(end)
        const replacement = `<mark class="bg-yellow-300 dark:bg-yellow-600 px-0.5 rounded">${matched}</mark>`
        highlighted = before + replacement + after
        offset += replacement.length - m.text.length
      }

      return { regex: reg, error: null, matches: matchList, highlightedText: highlighted }
    } catch (e: any) {
      return { regex: null, error: e.message, matches: [], highlightedText: testString }
    }
  }, [pattern, flags, testString])

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''))
    } else {
      setFlags(flags + flag)
    }
  }

  const copyPattern = async () => {
    await navigator.clipboard.writeText(`/${pattern}/${flags}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const usePreset = (preset: typeof COMMON_PATTERNS[0]) => {
    setPattern(preset.pattern)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-500 text-sm font-medium mb-4">
          <Regex className="w-4 h-4" />
          Developer Tool
        </div>
        <h2 className="text-2xl font-bold">Regex Tester</h2>
        <p className="text-muted-foreground mt-2">
          Test and debug regular expressions in real-time.
        </p>
      </div>

      {/* Pattern Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Regular Expression</label>
          {pattern && (
            <button
              onClick={copyPattern}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center border border-border rounded-xl bg-background overflow-hidden">
            <span className="px-3 text-muted-foreground font-mono">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="flex-1 py-3 font-mono bg-transparent outline-none"
            />
            <span className="px-3 text-muted-foreground font-mono">/</span>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className="w-16 py-3 font-mono bg-transparent outline-none text-primary"
              placeholder="flags"
            />
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { flag: 'g', label: 'Global', desc: 'Find all matches' },
          { flag: 'i', label: 'Case Insensitive', desc: 'Ignore case' },
          { flag: 'm', label: 'Multiline', desc: '^ and $ match line boundaries' },
          { flag: 's', label: 'Dotall', desc: '. matches newlines' },
        ].map(({ flag, label, desc }) => (
          <button
            key={flag}
            onClick={() => toggleFlag(flag)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              flags.includes(flag)
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
            title={desc}
          >
            {flag} - {label}
          </button>
        ))}
      </div>

      {/* Common Patterns */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium">Common Patterns</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMON_PATTERNS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => usePreset(preset)}
              className="px-3 py-1.5 rounded-lg text-xs bg-muted hover:bg-muted/80"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Test String */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Test String</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against the regex..."
          className="w-full h-40 p-4 rounded-xl border border-border bg-background font-mono text-sm resize-none"
        />
      </div>

      {/* Results */}
      {pattern && testString && !error && (
        <div className="space-y-4">
          {/* Match Count */}
          <div className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between">
              <span className="font-medium">Matches Found</span>
              <span className={`text-2xl font-bold ${matches.length > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {matches.length}
              </span>
            </div>
          </div>

          {/* Highlighted Text */}
          <div>
            <label className="text-sm font-medium mb-2 block">Highlighted Matches</label>
            <div
              className="p-4 rounded-xl border border-border bg-muted/30 font-mono text-sm whitespace-pre-wrap break-all"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </div>

          {/* Match Details */}
          {matches.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Match Details</label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {matches.map((match, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-border bg-card text-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Match {idx + 1}</span>
                      <span className="text-xs text-muted-foreground">Index: {match.index}</span>
                    </div>
                    <code className="text-primary font-mono">{match.text}</code>
                    {match.groups.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground">Groups:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {match.groups.map((group, gIdx) => (
                            <span key={gIdx} className="px-2 py-0.5 rounded bg-muted text-xs font-mono">
                              ${gIdx + 1}: {group || '(empty)'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground text-center">
        <p>Matches are highlighted in yellow. Use capture groups () to extract specific parts.</p>
      </div>
    </div>
  )
}

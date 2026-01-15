'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Type, Copy, Check, Trash2, RefreshCw, ArrowDown } from 'lucide-react'

type ConversionType =
  | 'uppercase'
  | 'lowercase'
  | 'titlecase'
  | 'sentencecase'
  | 'camelcase'
  | 'snakecase'
  | 'kebabcase'
  | 'pascalcase'
  | 'reverse'
  | 'alternating'

const CONVERSIONS: { type: ConversionType; label: string; example: string }[] = [
  { type: 'uppercase', label: 'UPPERCASE', example: 'HELLO WORLD' },
  { type: 'lowercase', label: 'lowercase', example: 'hello world' },
  { type: 'titlecase', label: 'Title Case', example: 'Hello World' },
  { type: 'sentencecase', label: 'Sentence case', example: 'Hello world' },
  { type: 'camelcase', label: 'camelCase', example: 'helloWorld' },
  { type: 'pascalcase', label: 'PascalCase', example: 'HelloWorld' },
  { type: 'snakecase', label: 'snake_case', example: 'hello_world' },
  { type: 'kebabcase', label: 'kebab-case', example: 'hello-world' },
  { type: 'reverse', label: 'Reverse', example: 'dlroW olleH' },
  { type: 'alternating', label: 'aLtErNaTiNg', example: 'hElLo WoRlD' }
]

const convert = (text: string, type: ConversionType): string => {
  if (!text) return ''

  const words = text.split(/\s+/)
  const cleanWords = text.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean)

  switch (type) {
    case 'uppercase':
      return text.toUpperCase()

    case 'lowercase':
      return text.toLowerCase()

    case 'titlecase':
      return words.map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ')

    case 'sentencecase':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

    case 'camelcase':
      return cleanWords.map((word, idx) =>
        idx === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join('')

    case 'pascalcase':
      return cleanWords.map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join('')

    case 'snakecase':
      return cleanWords.map(w => w.toLowerCase()).join('_')

    case 'kebabcase':
      return cleanWords.map(w => w.toLowerCase()).join('-')

    case 'reverse':
      return text.split('').reverse().join('')

    case 'alternating':
      return text.split('').map((char, idx) =>
        idx % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
      ).join('')

    default:
      return text
  }
}

export function TextConverter() {
  const [input, setInput] = useState('The quick brown fox jumps over the lazy dog')
  const [output, setOutput] = useState('')
  const [selectedType, setSelectedType] = useState<ConversionType | null>(null)
  const [copied, setCopied] = useState(false)

  const handleConvert = (type: ConversionType) => {
    setSelectedType(type)
    setOutput(convert(input, type))
  }

  const copyOutput = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clear = () => {
    setInput('')
    setOutput('')
    setSelectedType(null)
  }

  // Calculate stats
  const charCount = input.length
  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0
  const lineCount = input.split('\n').length

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-500 text-sm font-medium mb-4">
          <Type className="w-4 h-4" />
          Text Tool
        </div>
        <h2 className="text-2xl font-bold">Text Case Converter</h2>
        <p className="text-muted-foreground mt-2">
          Convert text between different cases and formats.
        </p>
      </div>

      {/* Input */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Input Text</label>
          <button
            onClick={clear}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            if (selectedType) {
              setOutput(convert(e.target.value, selectedType))
            }
          }}
          placeholder="Enter or paste your text here..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-border bg-card resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{charCount} characters</span>
          <span>{wordCount} words</span>
          <span>{lineCount} lines</span>
        </div>
      </div>

      {/* Conversion Buttons */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-3 block">Convert to:</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {CONVERSIONS.map(({ type, label }) => (
            <motion.button
              key={type}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleConvert(type)}
              className={`px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                selectedType === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Arrow */}
      {output && (
        <div className="flex justify-center mb-4">
          <ArrowDown className="w-6 h-6 text-muted-foreground animate-bounce" />
        </div>
      )}

      {/* Output */}
      {output && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Output ({CONVERSIONS.find(c => c.type === selectedType)?.label})
            </label>
            <button
              onClick={copyOutput}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="p-4 rounded-xl border border-border bg-muted/50 min-h-[100px]">
            <p className="whitespace-pre-wrap break-all">{output}</p>
          </div>
        </motion.div>
      )}

      {/* Quick Reference */}
      <div className="mt-8">
        <h3 className="text-sm font-medium mb-3">Examples</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {CONVERSIONS.map(({ type, label, example }) => (
            <div
              key={type}
              className="p-3 rounded-lg bg-muted/50 text-center"
            >
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="text-sm font-mono">{example}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

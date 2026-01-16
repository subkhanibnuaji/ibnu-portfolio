'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link2, ArrowRightLeft, Copy, Check, Trash2 } from 'lucide-react'

export function URLEncoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const processText = (text: string, encodeMode: boolean) => {
    try {
      setError('')
      if (encodeMode) {
        setOutput(encodeURIComponent(text))
      } else {
        setOutput(decodeURIComponent(text))
      }
    } catch {
      setError('Invalid input for decoding')
      setOutput('')
    }
  }

  const handleInputChange = (value: string) => {
    setInput(value)
    processText(value, mode === 'encode')
  }

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode'
    setMode(newMode)
    // Swap input and output
    const temp = input
    setInput(output)
    processText(output, newMode === 'encode')
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const examples = [
    { label: 'Spaces', encoded: 'Hello%20World', decoded: 'Hello World' },
    { label: 'Special', encoded: '%26%3D%3F', decoded: '&=?' },
    { label: 'Unicode', encoded: '%E2%9C%93', decoded: '✓' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">URL Encoder/Decoder</h1>
        <p className="text-muted-foreground">Encode or decode URL components</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={toggleMode}
            className="flex items-center gap-3 px-6 py-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
          >
            <span className={mode === 'encode' ? 'font-semibold text-blue-500' : 'text-muted-foreground'}>
              Encode
            </span>
            <ArrowRightLeft className="w-5 h-5" />
            <span className={mode === 'decode' ? 'font-semibold text-blue-500' : 'text-muted-foreground'}>
              Decode
            </span>
          </button>
        </div>

        {/* Input */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">
              {mode === 'encode' ? 'Plain Text' : 'Encoded URL'}
            </label>
            <button
              onClick={clear}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter URL to decode...'}
            className="w-full h-32 px-4 py-3 bg-muted rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>

        {/* Output */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">
              {mode === 'encode' ? 'Encoded URL' : 'Decoded Text'}
            </label>
            <button
              onClick={copyOutput}
              disabled={!output}
              className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-lg text-sm flex items-center gap-1 disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          {error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500">
              {error}
            </div>
          ) : (
            <div className="p-4 bg-muted/50 rounded-lg min-h-[80px] font-mono break-all">
              {output || <span className="text-muted-foreground">Output will appear here...</span>}
            </div>
          )}
        </div>

        {/* Examples */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-3">Examples</h3>
          <div className="space-y-2">
            {examples.map(ex => (
              <button
                key={ex.label}
                onClick={() => {
                  const value = mode === 'encode' ? ex.decoded : ex.encoded
                  setInput(value)
                  processText(value, mode === 'encode')
                }}
                className="w-full flex justify-between items-center p-2 bg-background hover:bg-muted rounded-lg text-sm"
              >
                <span className="text-muted-foreground">{ex.label}</span>
                <span className="font-mono">{mode === 'encode' ? ex.decoded : ex.encoded}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 text-xs text-muted-foreground">
          <p>URL encoding converts special characters to percent-encoded format for safe URL transmission.</p>
        </div>
      </div>
    </motion.div>
  )
}

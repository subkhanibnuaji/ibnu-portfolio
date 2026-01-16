'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Binary, Copy, Check, ArrowRightLeft, FileText, Image, Trash2 } from 'lucide-react'

type Mode = 'text' | 'file'
type Direction = 'encode' | 'decode'

export function Base64Tool() {
  const [mode, setMode] = useState<Mode>('text')
  const [direction, setDirection] = useState<Direction>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')

  const processText = () => {
    setError('')
    try {
      if (direction === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(input)))
        setOutput(encoded)
      } else {
        const decoded = decodeURIComponent(escape(atob(input)))
        setOutput(decoded)
      }
    } catch (e) {
      setError('Invalid input for ' + (direction === 'encode' ? 'encoding' : 'decoding'))
      setOutput('')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setError('')

    const reader = new FileReader()

    if (direction === 'encode') {
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]
        setOutput(base64)
      }
      reader.readAsDataURL(file)
    } else {
      reader.onload = () => {
        try {
          const text = reader.result as string
          const decoded = atob(text.trim())
          setOutput(decoded)
        } catch {
          setError('File does not contain valid Base64')
        }
      }
      reader.readAsText(file)
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadOutput = () => {
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = direction === 'encode' ? 'encoded.txt' : 'decoded.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const clear = () => {
    setInput('')
    setOutput('')
    setError('')
    setFileName('')
  }

  const swap = () => {
    setDirection(direction === 'encode' ? 'decode' : 'encode')
    setInput(output)
    setOutput('')
    setError('')
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-500 text-sm font-medium mb-4">
          <Binary className="w-4 h-4" />
          Developer Tool
        </div>
        <h2 className="text-2xl font-bold">Base64 Encoder/Decoder</h2>
        <p className="text-muted-foreground mt-2">
          Encode or decode text and files to/from Base64.
        </p>
      </div>

      {/* Mode & Direction */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => { setMode('text'); clear(); }}
            className={`px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 ${
              mode === 'text' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <FileText className="w-4 h-4" />
            Text
          </button>
          <button
            onClick={() => { setMode('file'); clear(); }}
            className={`px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 ${
              mode === 'file' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <Image className="w-4 h-4" />
            File
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setDirection('encode')}
            className={`px-4 py-2 rounded-lg font-medium ${
              direction === 'encode' ? 'bg-green-500 text-white' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setDirection('decode')}
            className={`px-4 py-2 rounded-lg font-medium ${
              direction === 'decode' ? 'bg-blue-500 text-white' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Decode
          </button>
        </div>
      </div>

      {/* Input/Output */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">
              {direction === 'encode' ? 'Plain Text' : 'Base64 Input'}
            </label>
            <button
              onClick={clear}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          </div>

          {mode === 'text' ? (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={direction === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
              className="w-full h-48 p-4 rounded-xl border border-border bg-background font-mono text-sm resize-none"
            />
          ) : (
            <div className="h-48 p-4 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer text-center"
              >
                <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {fileName || 'Click to select file'}
                </p>
              </label>
            </div>
          )}
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">
              {direction === 'encode' ? 'Base64 Output' : 'Decoded Text'}
            </label>
            {output && (
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Output will appear here..."
            className="w-full h-48 p-4 rounded-xl border border-border bg-muted/30 font-mono text-sm resize-none"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-2">
        {mode === 'text' && (
          <button
            onClick={processText}
            disabled={!input.trim()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50"
          >
            {direction === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
          </button>
        )}
        {output && (
          <>
            <button
              onClick={swap}
              className="px-4 py-3 bg-muted rounded-xl font-medium inline-flex items-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Swap
            </button>
            <button
              onClick={downloadOutput}
              className="px-4 py-3 bg-muted rounded-xl font-medium"
            >
              Download
            </button>
          </>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground text-center">
        <p>Base64 encoding represents binary data in ASCII string format.</p>
      </div>
    </div>
  )
}

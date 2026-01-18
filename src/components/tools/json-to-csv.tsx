'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileJson, FileSpreadsheet, Copy, Download, Upload, Check, AlertCircle, ArrowRight } from 'lucide-react'

export function JsonToCsv() {
  const [jsonInput, setJsonInput] = useState('')
  const [csvOutput, setCsvOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [delimiter, setDelimiter] = useState(',')
  const [includeHeaders, setIncludeHeaders] = useState(true)

  const convertToCSV = () => {
    setError('')
    setCsvOutput('')

    if (!jsonInput.trim()) {
      setError('Please enter JSON data')
      return
    }

    try {
      let data = JSON.parse(jsonInput)

      // Handle single object by wrapping in array
      if (!Array.isArray(data)) {
        if (typeof data === 'object' && data !== null) {
          data = [data]
        } else {
          setError('JSON must be an array of objects or a single object')
          return
        }
      }

      if (data.length === 0) {
        setError('JSON array is empty')
        return
      }

      // Get all unique keys from all objects
      const allKeys = new Set<string>()
      data.forEach((item: Record<string, unknown>) => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => allKeys.add(key))
        }
      })
      const headers = Array.from(allKeys)

      if (headers.length === 0) {
        setError('No valid properties found in JSON objects')
        return
      }

      // Build CSV
      const lines: string[] = []

      if (includeHeaders) {
        lines.push(headers.map(h => escapeCSV(h, delimiter)).join(delimiter))
      }

      data.forEach((item: Record<string, unknown>) => {
        if (typeof item === 'object' && item !== null) {
          const row = headers.map(header => {
            const value = item[header]
            if (value === null || value === undefined) return ''
            if (typeof value === 'object') return escapeCSV(JSON.stringify(value), delimiter)
            return escapeCSV(String(value), delimiter)
          })
          lines.push(row.join(delimiter))
        }
      })

      setCsvOutput(lines.join('\n'))
    } catch (e) {
      setError(`Invalid JSON: ${e instanceof Error ? e.message : 'Parse error'}`)
    }
  }

  const escapeCSV = (value: string, delim: string): string => {
    if (value.includes(delim) || value.includes('"') || value.includes('\n') || value.includes('\r')) {
      return `"${value.replace(/"/g, '""')}"`
    }
    return value
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(csvOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCSV = () => {
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setJsonInput(text)
      setError('')
      setCsvOutput('')
    }
    reader.readAsText(file)
  }

  const loadSample = () => {
    const sample = JSON.stringify([
      { id: 1, name: 'Alice', email: 'alice@example.com', age: 28, city: 'New York' },
      { id: 2, name: 'Bob', email: 'bob@example.com', age: 34, city: 'Los Angeles' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 22, city: 'Chicago' },
      { id: 4, name: 'Diana', email: 'diana@example.com', age: 31, city: 'Houston' },
      { id: 5, name: 'Eve', email: 'eve@example.com', age: 27, city: 'Phoenix' }
    ], null, 2)
    setJsonInput(sample)
    setError('')
    setCsvOutput('')
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Options */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="text-white/70 text-sm mb-1 block">Delimiter</label>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="\t">Tab</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHeaders}
                onChange={(e) => setIncludeHeaders(e.target.checked)}
                className="w-4 h-4 rounded bg-white/10 border-white/20"
              />
              <span className="text-white/70 text-sm">Include headers</span>
            </label>
          </div>
          <div className="flex items-end gap-2 ml-auto">
            <label className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 cursor-pointer flex items-center gap-2 text-sm">
              <Upload className="w-4 h-4" />
              Upload JSON
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={loadSample}
              className="px-4 py-2 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 text-sm"
            >
              Load Sample
            </button>
          </div>
        </div>

        {/* Input/Output */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* JSON Input */}
          <div>
            <label className="text-white/70 text-sm mb-2 block flex items-center gap-2">
              <FileJson className="w-4 h-4" />
              JSON Input
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value)
                setError('')
              }}
              placeholder='[{"name": "Alice", "age": 28}, {"name": "Bob", "age": 34}]'
              className="w-full h-64 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-mono text-sm placeholder:text-white/30 resize-none"
            />
          </div>

          {/* CSV Output */}
          <div>
            <label className="text-white/70 text-sm mb-2 block flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              CSV Output
            </label>
            <textarea
              value={csvOutput}
              readOnly
              placeholder="CSV output will appear here..."
              className="w-full h-64 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-mono text-sm placeholder:text-white/30 resize-none"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={convertToCSV}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 font-medium"
          >
            <ArrowRight className="w-5 h-5" />
            Convert to CSV
          </button>

          {csvOutput && (
            <>
              <button
                onClick={copyOutput}
                className="px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 flex items-center gap-2"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={downloadCSV}
                className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download CSV
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

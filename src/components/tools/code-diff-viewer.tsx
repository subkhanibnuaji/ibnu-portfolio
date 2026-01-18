'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  GitCompare, Copy, Check, Trash2, ArrowLeftRight,
  Eye, EyeOff, Download
} from 'lucide-react'

interface DiffLine {
  type: 'unchanged' | 'added' | 'removed'
  oldLineNum?: number
  newLineNum?: number
  content: string
}

export function CodeDiffViewer() {
  const [oldCode, setOldCode] = useState('')
  const [newCode, setNewCode] = useState('')
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split')
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [copied, setCopied] = useState(false)

  const diffLines = useMemo(() => {
    const oldLines = oldCode.split('\n')
    const newLines = newCode.split('\n')

    // Simple line-by-line diff using LCS algorithm
    const lcs = (a: string[], b: string[]): number[][] => {
      const m = a.length
      const n = b.length
      const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (a[i - 1] === b[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1] + 1
          } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
          }
        }
      }

      return dp
    }

    const getDiff = (a: string[], b: string[]): DiffLine[] => {
      const dp = lcs(a, b)
      const result: DiffLine[] = []

      let i = a.length
      let j = b.length
      const stack: DiffLine[] = []

      while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
          stack.push({
            type: 'unchanged',
            oldLineNum: i,
            newLineNum: j,
            content: a[i - 1]
          })
          i--
          j--
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
          stack.push({
            type: 'added',
            newLineNum: j,
            content: b[j - 1]
          })
          j--
        } else {
          stack.push({
            type: 'removed',
            oldLineNum: i,
            content: a[i - 1]
          })
          i--
        }
      }

      while (stack.length > 0) {
        result.push(stack.pop()!)
      }

      return result
    }

    return getDiff(oldLines, newLines)
  }, [oldCode, newCode])

  const stats = useMemo(() => {
    const added = diffLines.filter(l => l.type === 'added').length
    const removed = diffLines.filter(l => l.type === 'removed').length
    const unchanged = diffLines.filter(l => l.type === 'unchanged').length
    return { added, removed, unchanged }
  }, [diffLines])

  const swapCode = () => {
    const temp = oldCode
    setOldCode(newCode)
    setNewCode(temp)
  }

  const copyDiff = () => {
    const diffText = diffLines.map(line => {
      const prefix = line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '
      return `${prefix} ${line.content}`
    }).join('\n')

    navigator.clipboard.writeText(diffText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const exportDiff = () => {
    const diffText = `--- old
+++ new
${diffLines.map(line => {
  const prefix = line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '
  return `${prefix}${line.content}`
}).join('\n')}`

    const blob = new Blob([diffText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'diff.patch'
    a.click()
  }

  const clearAll = () => {
    setOldCode('')
    setNewCode('')
  }

  const getLineClass = (type: DiffLine['type']) => {
    switch (type) {
      case 'added': return 'bg-green-500/20 text-green-300'
      case 'removed': return 'bg-red-500/20 text-red-300'
      default: return 'text-white/70'
    }
  }

  const getLinePrefix = (type: DiffLine['type']) => {
    switch (type) {
      case 'added': return '+'
      case 'removed': return '-'
      default: return ' '
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('split')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'split'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'unified'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Unified View
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              className={`p-2 rounded-lg border transition-colors ${
                showLineNumbers
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                  : 'bg-white/10 border-white/20 text-white/70'
              }`}
              title="Toggle line numbers"
            >
              {showLineNumbers ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
            <button
              onClick={swapCode}
              className="p-2 rounded-lg bg-white/10 border border-white/20 text-white/70 hover:bg-white/20"
              title="Swap code"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
            <button
              onClick={copyDiff}
              className="p-2 rounded-lg bg-white/10 border border-white/20 text-white/70 hover:bg-white/20"
              title="Copy diff"
            >
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </button>
            <button
              onClick={exportDiff}
              className="p-2 rounded-lg bg-white/10 border border-white/20 text-white/70 hover:bg-white/20"
              title="Export as patch"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={clearAll}
              className="p-2 rounded-lg bg-white/10 border border-white/20 text-white/70 hover:bg-white/20"
              title="Clear all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Input areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">Original Code</label>
            <textarea
              value={oldCode}
              onChange={(e) => setOldCode(e.target.value)}
              placeholder="Paste original code here..."
              className="w-full h-40 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white font-mono text-sm placeholder-white/30 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">Modified Code</label>
            <textarea
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="Paste modified code here..."
              className="w-full h-40 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white font-mono text-sm placeholder-white/30 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Stats */}
        {(oldCode || newCode) && (
          <div className="flex gap-4 mb-4">
            <span className="text-green-400 text-sm">+{stats.added} added</span>
            <span className="text-red-400 text-sm">-{stats.removed} removed</span>
            <span className="text-white/50 text-sm">{stats.unchanged} unchanged</span>
          </div>
        )}

        {/* Diff output */}
        {diffLines.length > 0 && (oldCode || newCode) && (
          <div className="bg-slate-900 rounded-lg overflow-hidden">
            {viewMode === 'split' ? (
              // Split view
              <div className="grid grid-cols-2 divide-x divide-white/10">
                {/* Old code */}
                <div className="overflow-x-auto">
                  <div className="p-2 bg-white/5 border-b border-white/10">
                    <span className="text-white/50 text-sm">Original</span>
                  </div>
                  <div className="font-mono text-sm">
                    {diffLines.filter(l => l.type !== 'added').map((line, index) => (
                      <div
                        key={index}
                        className={`flex ${line.type === 'removed' ? 'bg-red-500/20' : ''}`}
                      >
                        {showLineNumbers && (
                          <span className="w-12 px-2 text-right text-white/30 select-none border-r border-white/10">
                            {line.oldLineNum || ''}
                          </span>
                        )}
                        <span className="w-6 text-center text-white/50 select-none">
                          {line.type === 'removed' ? '-' : ' '}
                        </span>
                        <pre className={`flex-1 px-2 ${line.type === 'removed' ? 'text-red-300' : 'text-white/70'}`}>
                          {line.content || ' '}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>

                {/* New code */}
                <div className="overflow-x-auto">
                  <div className="p-2 bg-white/5 border-b border-white/10">
                    <span className="text-white/50 text-sm">Modified</span>
                  </div>
                  <div className="font-mono text-sm">
                    {diffLines.filter(l => l.type !== 'removed').map((line, index) => (
                      <div
                        key={index}
                        className={`flex ${line.type === 'added' ? 'bg-green-500/20' : ''}`}
                      >
                        {showLineNumbers && (
                          <span className="w-12 px-2 text-right text-white/30 select-none border-r border-white/10">
                            {line.newLineNum || ''}
                          </span>
                        )}
                        <span className="w-6 text-center text-white/50 select-none">
                          {line.type === 'added' ? '+' : ' '}
                        </span>
                        <pre className={`flex-1 px-2 ${line.type === 'added' ? 'text-green-300' : 'text-white/70'}`}>
                          {line.content || ' '}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Unified view
              <div className="overflow-x-auto">
                <div className="font-mono text-sm">
                  {diffLines.map((line, index) => (
                    <div
                      key={index}
                      className={`flex ${getLineClass(line.type)}`}
                    >
                      {showLineNumbers && (
                        <>
                          <span className="w-12 px-2 text-right text-white/30 select-none">
                            {line.oldLineNum || ''}
                          </span>
                          <span className="w-12 px-2 text-right text-white/30 select-none border-r border-white/10">
                            {line.newLineNum || ''}
                          </span>
                        </>
                      )}
                      <span className="w-6 text-center text-white/50 select-none">
                        {getLinePrefix(line.type)}
                      </span>
                      <pre className="flex-1 px-2">
                        {line.content || ' '}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!oldCode && !newCode && (
          <div className="text-center py-12">
            <GitCompare className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <p className="text-white/50">Paste code in both fields to see the diff</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

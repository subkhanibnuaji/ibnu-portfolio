'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Terminal, FileCode, Download, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// COPY BUTTON
// ============================================
interface CopyButtonProps {
  text: string
  className?: string
  variant?: 'default' | 'minimal' | 'icon'
}

export function CopyButton({ text, className, variant = 'default' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [text])

  const variants = {
    default: 'px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5',
    minimal: 'p-1.5 rounded-md',
    icon: 'p-2 rounded-lg',
  }

  return (
    <motion.button
      onClick={handleCopy}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'transition-all',
        copied
          ? 'bg-green-500/20 text-green-400 border-green-500/30'
          : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border-transparent',
        'border',
        variants[variant],
        className
      )}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5"
          >
            <Check className="h-3.5 w-3.5" />
            {variant === 'default' && 'Copied!'}
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5"
          >
            <Copy className="h-3.5 w-3.5" />
            {variant === 'default' && 'Copy'}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// ============================================
// CODE BLOCK
// ============================================
interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  className?: string
  maxHeight?: number
}

export function CodeBlock({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = true,
  highlightLines = [],
  className,
  maxHeight = 400,
}: CodeBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const lines = code.trim().split('\n')

  const getLanguageIcon = () => {
    switch (language) {
      case 'bash':
      case 'shell':
      case 'sh':
        return <Terminal className="h-3.5 w-3.5" />
      default:
        return <FileCode className="h-3.5 w-3.5" />
    }
  }

  const getLanguageColor = () => {
    const colors: Record<string, string> = {
      typescript: 'text-blue-400',
      javascript: 'text-yellow-400',
      python: 'text-green-400',
      rust: 'text-orange-400',
      go: 'text-cyan-400',
      bash: 'text-green-400',
      shell: 'text-green-400',
      json: 'text-amber-400',
      css: 'text-pink-400',
      html: 'text-orange-400',
    }
    return colors[language] || 'text-muted-foreground'
  }

  const downloadCode = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || `code.${language}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [code, filename, language])

  return (
    <div className={cn('rounded-xl overflow-hidden border border-border/50 bg-card/50', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/50">
        <div className="flex items-center gap-3">
          {/* Window buttons */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>

          {/* Filename or language */}
          <div className={cn('flex items-center gap-1.5 text-xs', getLanguageColor())}>
            {getLanguageIcon()}
            <span>{filename || language}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={downloadCode}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Download code"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <CopyButton text={code} variant="minimal" />
        </div>
      </div>

      {/* Code */}
      <div
        className="overflow-auto"
        style={{ maxHeight: isExpanded ? 'none' : maxHeight }}
      >
        <pre className="p-4 text-sm font-mono">
          <code>
            {lines.map((line, i) => (
              <div
                key={i}
                className={cn(
                  'flex',
                  highlightLines.includes(i + 1) && 'bg-primary/10 -mx-4 px-4'
                )}
              >
                {showLineNumbers && (
                  <span className="select-none text-muted-foreground/50 w-8 flex-shrink-0 text-right pr-4">
                    {i + 1}
                  </span>
                )}
                <span className="flex-1">{line || ' '}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Expand indicator */}
      {!isExpanded && lines.length > 15 && (
        <div className="flex items-center justify-center py-2 bg-gradient-to-t from-card/80 to-transparent border-t border-border/30">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Show all {lines.length} lines
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================
// INLINE CODE
// ============================================
interface InlineCodeProps {
  children: string
  copyable?: boolean
  className?: string
}

export function InlineCode({ children, copyable = true, className }: InlineCodeProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    if (!copyable) return
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [children, copyable])

  return (
    <code
      onClick={handleCopy}
      className={cn(
        'px-1.5 py-0.5 rounded-md bg-muted font-mono text-sm',
        copyable && 'cursor-pointer hover:bg-muted/80 transition-colors',
        copied && 'bg-green-500/20 text-green-400',
        className
      )}
      title={copyable ? (copied ? 'Copied!' : 'Click to copy') : undefined}
    >
      {children}
    </code>
  )
}

// ============================================
// TERMINAL BLOCK
// ============================================
interface TerminalBlockProps {
  commands: string | string[]
  output?: string
  className?: string
}

export function TerminalBlock({ commands, output, className }: TerminalBlockProps) {
  const cmdArray = Array.isArray(commands) ? commands : [commands]

  return (
    <div className={cn('rounded-xl overflow-hidden border border-border/50 bg-black/90', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-green-400">
            <Terminal className="h-3.5 w-3.5" />
            <span>Terminal</span>
          </div>
        </div>
        <CopyButton text={cmdArray.join('\n')} variant="minimal" />
      </div>

      {/* Commands */}
      <div className="p-4 font-mono text-sm">
        {cmdArray.map((cmd, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-green-400 select-none">$</span>
            <span className="text-white">{cmd}</span>
          </div>
        ))}
        {output && (
          <div className="mt-2 text-muted-foreground whitespace-pre-wrap">
            {output}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// DIFF BLOCK
// ============================================
interface DiffBlockProps {
  code: string
  className?: string
}

export function DiffBlock({ code, className }: DiffBlockProps) {
  const lines = code.trim().split('\n')

  return (
    <div className={cn('rounded-xl overflow-hidden border border-border/50 bg-card/50', className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/50">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <FileCode className="h-3.5 w-3.5" />
          <span>Diff</span>
        </div>
        <CopyButton text={code} variant="minimal" />
      </div>
      <pre className="p-4 text-sm font-mono overflow-auto">
        {lines.map((line, i) => {
          const isAddition = line.startsWith('+')
          const isDeletion = line.startsWith('-')
          const isHeader = line.startsWith('@@')

          return (
            <div
              key={i}
              className={cn(
                '-mx-4 px-4',
                isAddition && 'bg-green-500/10 text-green-400',
                isDeletion && 'bg-red-500/10 text-red-400',
                isHeader && 'bg-blue-500/10 text-blue-400'
              )}
            >
              {line || ' '}
            </div>
          )
        })}
      </pre>
    </div>
  )
}

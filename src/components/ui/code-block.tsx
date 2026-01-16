'use client'

import { useState } from 'react'
import { Check, Copy, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  className?: string
}

export function CodeBlock({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = false,
  className
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const lines = code.split('\n')

  return (
    <div className={cn('relative group rounded-xl overflow-hidden', className)}>
      {/* Header */}
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/80 border-b border-border">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {filename || language}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
        </div>
      )}

      {/* Code Content */}
      <div className="relative">
        <pre className="p-4 overflow-x-auto bg-muted/50 text-sm">
          <code className={`language-${language}`}>
            {showLineNumbers ? (
              <table className="w-full">
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index} className="hover:bg-muted/30">
                      <td className="pr-4 text-right text-muted-foreground select-none w-8">
                        {index + 1}
                      </td>
                      <td className="whitespace-pre">{line}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              code
            )}
          </code>
        </pre>

        {/* Copy Button */}
        <button
          onClick={copyToClipboard}
          className={cn(
            'absolute top-3 right-3',
            'p-2 rounded-lg',
            'bg-background/80 backdrop-blur-sm border border-border',
            'opacity-0 group-hover:opacity-100 transition-opacity',
            'text-muted-foreground hover:text-foreground',
            copied && 'text-cyber-green'
          )}
          title={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}

// Inline code component
export function InlineCode({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <code
      className={cn(
        'px-1.5 py-0.5 rounded',
        'bg-muted text-sm font-mono',
        'text-cyber-cyan',
        className
      )}
    >
      {children}
    </code>
  )
}

// Simple copy button for any text
export function CopyButton({
  text,
  className
}: {
  text: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={copy}
      className={cn(
        'p-2 rounded-lg transition-colors',
        'text-muted-foreground hover:text-foreground hover:bg-muted',
        copied && 'text-cyber-green',
        className
      )}
      title={copied ? 'Copied!' : 'Copy'}
    >
      {copied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  )
}

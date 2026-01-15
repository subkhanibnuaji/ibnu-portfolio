'use client'

import { useState } from 'react'
import { Link, Check, Copy } from 'lucide-react'
import { toast } from 'sonner'

interface CopyLinkProps {
  url?: string
  className?: string
  variant?: 'button' | 'icon' | 'text'
  showToast?: boolean
}

export function CopyLink({
  url,
  className = '',
  variant = 'button',
  showToast = true
}: CopyLinkProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const linkToCopy = url || (typeof window !== 'undefined' ? window.location.href : '')

    try {
      await navigator.clipboard.writeText(linkToCopy)
      setCopied(true)
      if (showToast) {
        toast.success('Link berhasil disalin!')
      }
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = linkToCopy
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      if (showToast) {
        toast.success('Link berhasil disalin!')
      }
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleCopy}
        className={`p-2 rounded-lg hover:bg-accent transition-colors ${className}`}
        title="Salin link"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Link className="w-4 h-4" />
        )}
      </button>
    )
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleCopy}
        className={`inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors ${className}`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            <span>Tersalin!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Salin link</span>
          </>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-accent transition-colors ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-500" />
          <span>Tersalin!</span>
        </>
      ) : (
        <>
          <Link className="w-4 h-4" />
          <span>Salin Link</span>
        </>
      )}
    </button>
  )
}

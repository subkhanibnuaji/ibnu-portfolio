'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Twitter,
  Linkedin,
  Facebook,
  Link2,
  Check,
  Share2,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SocialShareProps {
  url: string
  title: string
  description?: string
  className?: string
  variant?: 'default' | 'compact' | 'floating'
}

const SHARE_PLATFORMS = [
  {
    name: 'Twitter',
    icon: Twitter,
    color: 'hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]',
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]',
    getUrl: (url: string, title: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  },
  {
    name: 'Facebook',
    icon: Facebook,
    color: 'hover:bg-[#1877F2]/10 hover:text-[#1877F2]',
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  },
  {
    name: 'Email',
    icon: Mail,
    color: 'hover:bg-primary/10 hover:text-primary',
    getUrl: (url: string, title: string, description?: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description || '')}%0A%0A${encodeURIComponent(url)}`
  }
]

export function SocialShare({
  url,
  title,
  description,
  className,
  variant = 'default'
}: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = (platform: typeof SHARE_PLATFORMS[0]) => {
    const shareUrl = platform.getUrl(url, title, description)
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {SHARE_PLATFORMS.slice(0, 3).map((platform) => (
          <button
            key={platform.name}
            onClick={() => handleShare(platform)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              'text-muted-foreground',
              platform.color
            )}
            title={`Share on ${platform.name}`}
          >
            <platform.icon className="h-4 w-4" />
          </button>
        ))}
        <button
          onClick={copyToClipboard}
          className="p-2 rounded-lg transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Copy link"
        >
          {copied ? (
            <Check className="h-4 w-4 text-cyber-green" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
        </button>
      </div>
    )
  }

  if (variant === 'floating') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          'fixed left-6 top-1/2 -translate-y-1/2 z-40',
          'flex flex-col gap-2',
          'glass rounded-full p-2',
          className
        )}
      >
        {SHARE_PLATFORMS.map((platform) => (
          <button
            key={platform.name}
            onClick={() => handleShare(platform)}
            className={cn(
              'p-3 rounded-full transition-colors',
              'text-muted-foreground',
              platform.color
            )}
            title={`Share on ${platform.name}`}
          >
            <platform.icon className="h-5 w-5" />
          </button>
        ))}
        <div className="w-full h-px bg-border my-1" />
        <button
          onClick={copyToClipboard}
          className="p-3 rounded-full transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Copy link"
        >
          {copied ? (
            <Check className="h-5 w-5 text-cyber-green" />
          ) : (
            <Link2 className="h-5 w-5" />
          )}
        </button>
      </motion.div>
    )
  }

  // Default variant
  return (
    <div className={cn('glass rounded-xl p-6', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="h-5 w-5 text-cyber-cyan" />
        <span className="font-medium">Share this article</span>
      </div>

      <div className="flex flex-wrap gap-3">
        {SHARE_PLATFORMS.map((platform) => (
          <Button
            key={platform.name}
            variant="outline"
            size="sm"
            onClick={() => handleShare(platform)}
            className={cn('gap-2', platform.color)}
          >
            <platform.icon className="h-4 w-4" />
            {platform.name}
          </Button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-muted-foreground"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-cyber-green" />
                Copied!
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Share2,
  X,
  Twitter,
  Linkedin,
  Facebook,
  Link2,
  Mail,
  MessageCircle,
  Check,
  QrCode,
  Send,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShareOption {
  id: string
  name: string
  icon: React.ElementType
  color: string
  bgColor: string
  action: (url: string, title: string) => void
}

const SHARE_OPTIONS: ShareOption[] = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: Twitter,
    color: 'text-sky-400',
    bgColor: 'bg-sky-400/20',
    action: (url, title) => {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        '_blank'
      )
    },
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/20',
    action: (url, title) => {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        '_blank'
      )
    },
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/20',
    action: (url) => {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        '_blank'
      )
    },
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500/20',
    action: (url, title) => {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
        '_blank'
      )
    },
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: Send,
    color: 'text-sky-500',
    bgColor: 'bg-sky-500/20',
    action: (url, title) => {
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        '_blank'
      )
    },
  },
  {
    id: 'email',
    name: 'Email',
    icon: Mail,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/20',
    action: (url, title) => {
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
    },
  },
]

export function ShareWidget() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const getShareData = useCallback(() => {
    const url = typeof window !== 'undefined'
      ? window.location.href
      : `https://heyibnu.com${pathname}`
    const title = typeof document !== 'undefined'
      ? document.title
      : 'Ibnu Portfolio'
    return { url, title }
  }, [pathname])

  const handleCopyLink = useCallback(async () => {
    const { url } = getShareData()
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [getShareData])

  const handleNativeShare = useCallback(async () => {
    const { url, title } = getShareData()
    if (navigator.share) {
      try {
        await navigator.share({ url, title })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err)
        }
      }
    }
  }, [getShareData])

  const handleShare = useCallback((option: ShareOption) => {
    const { url, title } = getShareData()
    option.action(url, title)
    setIsOpen(false)
  }, [getShareData])

  return (
    <>
      {/* Floating Share Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-44 right-4 z-40 p-3 rounded-full bg-gradient-to-br from-primary/80 to-purple-600/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl hover:scale-105 transition-all group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Share this page"
        aria-label="Share this page"
      >
        <Share2 className="h-5 w-5 text-white" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-lg" />
      </motion.button>

      {/* Share Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-50 p-4"
            >
              <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20">
                        <Share2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-bold">Share</h2>
                        <p className="text-xs text-muted-foreground">
                          Spread the word!
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  {/* Native Share (if available) */}
                  {typeof navigator !== 'undefined' && navigator.share && (
                    <button
                      onClick={handleNativeShare}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-medium hover:opacity-90 transition-opacity"
                    >
                      <Share2 className="h-5 w-5" />
                      Share via...
                    </button>
                  )}

                  {/* Share Options Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {SHARE_OPTIONS.map((option, index) => (
                      <motion.button
                        key={option.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleShare(option)}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                      >
                        <div className={cn('p-3 rounded-xl transition-colors', option.bgColor)}>
                          <option.icon className={cn('h-5 w-5', option.color)} />
                        </div>
                        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                          {option.name}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Copy Link */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-muted/50 border border-border/50">
                    <div className="flex-1 px-2 text-sm text-muted-foreground truncate">
                      {getShareData().url}
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all',
                        copied
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      )}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Link2 className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  {/* QR Code Toggle */}
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-border/50 hover:border-primary/30 text-muted-foreground hover:text-foreground transition-all"
                  >
                    <QrCode className="h-4 w-4" />
                    {showQR ? 'Hide' : 'Show'} QR Code
                  </button>

                  {/* QR Code */}
                  <AnimatePresence>
                    {showQR && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-center p-4 rounded-xl bg-white"
                      >
                        {/* Simple QR code placeholder - would use a QR library in production */}
                        <div className="w-32 h-32 bg-black rounded-lg flex items-center justify-center">
                          <div className="grid grid-cols-5 gap-0.5 p-2">
                            {Array.from({ length: 25 }).map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  'w-4 h-4',
                                  Math.random() > 0.5 ? 'bg-white' : 'bg-black'
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  History,
  X,
  ChevronRight,
  Clock,
  Trash2,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ViewedPage {
  path: string
  title: string
  timestamp: number
  visitCount: number
}

const PAGE_TITLES: Record<string, string> = {
  '/': 'Home',
  '/about': 'About Me',
  '/projects': 'Projects',
  '/blog': 'Blog',
  '/tools': 'AI Tools',
  '/terminal': 'Terminal',
  '/games': 'Games',
  '/contact': 'Contact',
  '/resume': 'Resume',
  '/guestbook': 'Guestbook',
}

const MAX_HISTORY = 10

export function RecentlyViewed() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [history, setHistory] = useState<ViewedPage[]>([])
  const [showButton, setShowButton] = useState(false)

  // Load history
  useEffect(() => {
    const stored = localStorage.getItem('viewedPages')
    if (stored) {
      setHistory(JSON.parse(stored))
    }
    setShowButton(true)
  }, [])

  // Track page views
  useEffect(() => {
    if (!pathname) return

    const title = PAGE_TITLES[pathname] ||
      pathname.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) ||
      'Page'

    setHistory(prev => {
      const existing = prev.find(p => p.path === pathname)
      const updated = existing
        ? prev.map(p =>
            p.path === pathname
              ? { ...p, timestamp: Date.now(), visitCount: p.visitCount + 1 }
              : p
          )
        : [
            { path: pathname, title, timestamp: Date.now(), visitCount: 1 },
            ...prev.slice(0, MAX_HISTORY - 1)
          ]

      // Sort by most recent
      const sorted = updated.sort((a, b) => b.timestamp - a.timestamp)
      localStorage.setItem('viewedPages', JSON.stringify(sorted))
      return sorted
    })
  }, [pathname])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem('viewedPages')
  }, [])

  const removeItem = useCallback((path: string) => {
    setHistory(prev => {
      const updated = prev.filter(p => p.path !== path)
      localStorage.setItem('viewedPages', JSON.stringify(updated))
      return updated
    })
  }, [])

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  if (!showButton) return null

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-4 z-40 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 shadow-lg hover:shadow-xl transition-all group"
        title="Recently Viewed"
        aria-label="Open recently viewed pages"
      >
        <History className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        {history.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs bg-primary text-primary-foreground rounded-full">
            {history.length}
          </span>
        )}
      </button>

      {/* Panel */}
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
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 z-50 bg-card/95 backdrop-blur-xl border-r border-border/50 shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/20">
                      <History className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="font-bold">Recently Viewed</h2>
                      <p className="text-xs text-muted-foreground">
                        {history.length} pages in history
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close panel"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {history.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No pages viewed yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start exploring to build your history
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {history.map((page, index) => (
                      <motion.div
                        key={page.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative"
                      >
                        <Link
                          href={page.path}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-xl transition-all',
                            pathname === page.path
                              ? 'bg-primary/10 border border-primary/30'
                              : 'hover:bg-muted/50 border border-transparent'
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{page.title}</p>
                              {pathname === page.path && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground">
                                {formatTime(page.timestamp)}
                              </span>
                              {page.visitCount > 1 && (
                                <span className="text-xs text-muted-foreground">
                                  • {page.visitCount} visits
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </Link>

                        {/* Remove button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeItem(page.path)
                          }}
                          className="absolute right-12 top-1/2 -translate-y-1/2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all"
                          title="Remove from history"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {history.length > 0 && (
                <div className="p-4 border-t border-border/50">
                  <button
                    onClick={clearHistory}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-border/50 hover:border-destructive/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear History
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

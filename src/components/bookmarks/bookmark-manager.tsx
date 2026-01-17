'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bookmark,
  BookmarkCheck,
  X,
  Trash2,
  ExternalLink,
  Clock,
  Star,
  FolderHeart,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookmarkItem {
  path: string
  title: string
  timestamp: number
}

export function BookmarkManager() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Load bookmarks
  useEffect(() => {
    const loadBookmarks = () => {
      const stored = localStorage.getItem('bookmarks')
      if (stored) {
        setBookmarks(JSON.parse(stored))
      }
    }

    loadBookmarks()

    // Listen for bookmark changes
    const handleStorage = () => loadBookmarks()
    window.addEventListener('storage', handleStorage)
    window.addEventListener('bookmarksUpdated', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('bookmarksUpdated', handleStorage)
    }
  }, [])

  // Check if current page is bookmarked
  useEffect(() => {
    setIsBookmarked(bookmarks.some(b => b.path === pathname))
  }, [bookmarks, pathname])

  const toggleBookmark = useCallback(() => {
    const currentBookmarks = [...bookmarks]

    if (isBookmarked) {
      const filtered = currentBookmarks.filter(b => b.path !== pathname)
      setBookmarks(filtered)
      localStorage.setItem('bookmarks', JSON.stringify(filtered))
      setIsBookmarked(false)
    } else {
      const newBookmark: BookmarkItem = {
        path: pathname,
        title: document.title.replace(' | Ibnu Portfolio', ''),
        timestamp: Date.now(),
      }
      const updated = [newBookmark, ...currentBookmarks]
      setBookmarks(updated)
      localStorage.setItem('bookmarks', JSON.stringify(updated))
      setIsBookmarked(true)

      // Trigger achievement
      window.dispatchEvent(new CustomEvent('achievementUnlocked', {
        detail: { id: 'first_bookmark' }
      }))
    }

    window.dispatchEvent(new CustomEvent('bookmarksUpdated'))
  }, [bookmarks, isBookmarked, pathname])

  const removeBookmark = useCallback((path: string) => {
    const filtered = bookmarks.filter(b => b.path !== path)
    setBookmarks(filtered)
    localStorage.setItem('bookmarks', JSON.stringify(filtered))
    window.dispatchEvent(new CustomEvent('bookmarksUpdated'))
  }, [bookmarks])

  const clearAllBookmarks = useCallback(() => {
    setBookmarks([])
    localStorage.removeItem('bookmarks')
    window.dispatchEvent(new CustomEvent('bookmarksUpdated'))
  }, [])

  const navigateToBookmark = useCallback((path: string) => {
    router.push(path)
    setIsOpen(false)
  }, [router])

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggleBookmark()
      }
      if (e.key === 'b' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleBookmark])

  return (
    <>
      {/* Bookmark Button */}
      <button
        onClick={toggleBookmark}
        className={cn(
          'fixed top-56 left-4 z-40 p-3 rounded-full backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all group',
          isBookmarked
            ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
            : 'bg-card/80 border-border/50 hover:border-primary/50'
        )}
        title={isBookmarked ? 'Remove bookmark (⌘D)' : 'Bookmark page (⌘D)'}
      >
        {isBookmarked ? (
          <BookmarkCheck className="h-5 w-5" />
        ) : (
          <Bookmark className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </button>

      {/* View Bookmarks Button */}
      {bookmarks.length > 0 && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-56 left-16 z-40 flex items-center gap-1 px-2 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 shadow-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
        >
          <FolderHeart className="h-3 w-3" />
          {bookmarks.length}
        </button>
      )}

      {/* Bookmarks Panel */}
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
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            >
              <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-500/20">
                        <Star className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <h2 className="font-bold">Bookmarks</h2>
                        <p className="text-xs text-muted-foreground">
                          {bookmarks.length} saved {bookmarks.length === 1 ? 'page' : 'pages'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Bookmarks List */}
                <div className="max-h-80 overflow-y-auto">
                  {bookmarks.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bookmark className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">No bookmarks yet</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Press ⌘D to bookmark any page
                      </p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {bookmarks.map((bookmark, index) => (
                        <motion.div
                          key={bookmark.path}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                        >
                          <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors">
                            <BookmarkCheck className="h-4 w-4 text-amber-400" />
                          </div>

                          <button
                            onClick={() => navigateToBookmark(bookmark.path)}
                            className="flex-1 text-left min-w-0"
                          >
                            <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                              {bookmark.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDate(bookmark.timestamp)}
                            </div>
                          </button>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => removeBookmark(bookmark.path)}
                              className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                              title="Remove bookmark"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {bookmarks.length > 0 && (
                  <div className="p-3 border-t border-border/50 flex items-center justify-between">
                    <button
                      onClick={clearAllBookmarks}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Clear all
                    </button>
                    <p className="text-xs text-muted-foreground">
                      <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded">⌘⇧B</kbd>
                      {' '}to toggle
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

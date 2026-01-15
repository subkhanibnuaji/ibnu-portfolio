'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, BookmarkCheck, X, ExternalLink, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface BookmarkItem {
  id: string
  title: string
  url: string
  type: 'post' | 'project'
  savedAt: string
  image?: string
}

const BOOKMARKS_KEY = 'user-bookmarks'

// Single Bookmark Button
export function BookmarkButton({
  itemId,
  title,
  url,
  type,
  image,
  showText = false,
  className = ''
}: {
  itemId: string
  title: string
  url: string
  type: 'post' | 'project'
  image?: string
  showText?: boolean
  className?: string
}) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    const bookmarks = getBookmarks()
    setIsBookmarked(bookmarks.some(b => b.id === itemId))
  }, [itemId])

  const toggleBookmark = () => {
    const bookmarks = getBookmarks()

    if (isBookmarked) {
      // Remove bookmark
      const filtered = bookmarks.filter(b => b.id !== itemId)
      saveBookmarks(filtered)
      setIsBookmarked(false)
      toast.success('Dihapus dari bookmark')
    } else {
      // Add bookmark
      const newBookmark: BookmarkItem = {
        id: itemId,
        title,
        url,
        type,
        image,
        savedAt: new Date().toISOString()
      }
      saveBookmarks([newBookmark, ...bookmarks])
      setIsBookmarked(true)
      toast.success('Ditambahkan ke bookmark')
    }
  }

  return (
    <motion.button
      onClick={toggleBookmark}
      whileTap={{ scale: 0.9 }}
      className={`
        inline-flex items-center gap-2 transition-colors
        ${isBookmarked
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground'
        }
        ${className}
      `}
      title={isBookmarked ? 'Hapus dari bookmark' : 'Simpan ke bookmark'}
    >
      {isBookmarked ? (
        <BookmarkCheck className="w-5 h-5 fill-current" />
      ) : (
        <Bookmark className="w-5 h-5" />
      )}
      {showText && (
        <span className="text-sm">
          {isBookmarked ? 'Tersimpan' : 'Simpan'}
        </span>
      )}
    </motion.button>
  )
}

// Bookmarks List Panel
export function BookmarksList({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])

  useEffect(() => {
    if (isOpen) {
      setBookmarks(getBookmarks())
    }
  }, [isOpen])

  const removeBookmark = (id: string) => {
    const filtered = bookmarks.filter(b => b.id !== id)
    saveBookmarks(filtered)
    setBookmarks(filtered)
    toast.success('Bookmark dihapus')
  }

  const clearAll = () => {
    saveBookmarks([])
    setBookmarks([])
    toast.success('Semua bookmark dihapus')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">
                    Bookmarks ({bookmarks.length})
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bookmarks List */}
              {bookmarks.length > 0 ? (
                <>
                  <div className="space-y-3 mb-6">
                    {bookmarks.map((bookmark) => (
                      <motion.div
                        key={bookmark.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="group flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                      >
                        {/* Thumbnail */}
                        {bookmark.image && (
                          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                            <img
                              src={bookmark.image}
                              alt={bookmark.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={bookmark.url}
                            onClick={onClose}
                            className="font-medium text-sm hover:text-primary transition-colors line-clamp-2"
                          >
                            {bookmark.title}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-1">
                            {bookmark.type === 'post' ? 'Blog Post' : 'Project'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Disimpan {new Date(bookmark.savedAt).toLocaleDateString('id-ID')}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={bookmark.url}
                            onClick={onClose}
                            className="p-1.5 hover:bg-accent rounded transition-colors"
                            title="Buka"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => removeBookmark(bookmark.id)}
                            className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Clear All */}
                  <button
                    onClick={clearAll}
                    className="w-full py-2 text-sm text-muted-foreground hover:text-destructive border border-border rounded-lg hover:border-destructive/50 transition-colors"
                  >
                    Hapus Semua Bookmark
                  </button>
                </>
              ) : (
                <div className="text-center py-12">
                  <Bookmark className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    Belum ada bookmark tersimpan
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Klik ikon bookmark untuk menyimpan artikel atau project
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Utility functions
function getBookmarks(): BookmarkItem[] {
  if (typeof window === 'undefined') return []
  const saved = localStorage.getItem(BOOKMARKS_KEY)
  return saved ? JSON.parse(saved) : []
}

function saveBookmarks(bookmarks: BookmarkItem[]) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
}

// Hook to use bookmarks
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])

  useEffect(() => {
    setBookmarks(getBookmarks())
  }, [])

  const refresh = () => setBookmarks(getBookmarks())

  return { bookmarks, refresh }
}

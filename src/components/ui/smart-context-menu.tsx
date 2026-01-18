'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Copy,
  Share2,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Search,
  Terminal,
  Command,
  Palette,
  Moon,
  Sun,
  Maximize2,
  ZoomIn,
  ZoomOut,
  QrCode,
  Download,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContextMenuItem {
  icon: React.ElementType
  label: string
  shortcut?: string
  action: () => void
  divider?: boolean
  disabled?: boolean
}

export function SmartContextMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [selectedText, setSelectedText] = useState('')
  const [isBookmarked, setIsBookmarked] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Check if current page is bookmarked
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    setIsBookmarked(bookmarks.some((b: any) => b.path === pathname))
  }, [pathname])

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Show toast notification
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { message: 'Copied to clipboard!', type: 'success' }
      }))
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [])

  const shareCurrentPage = useCallback(async () => {
    const shareData = {
      title: document.title,
      text: 'Check out this page on Ibnu Portfolio!',
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // User cancelled or error
      }
    } else {
      copyToClipboard(window.location.href)
    }
  }, [copyToClipboard])

  const toggleBookmark = useCallback(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')

    if (isBookmarked) {
      const filtered = bookmarks.filter((b: any) => b.path !== pathname)
      localStorage.setItem('bookmarks', JSON.stringify(filtered))
      setIsBookmarked(false)
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { message: 'Bookmark removed', type: 'info' }
      }))
    } else {
      bookmarks.push({
        path: pathname,
        title: document.title,
        timestamp: Date.now(),
      })
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
      setIsBookmarked(true)
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { message: 'Page bookmarked!', type: 'success' }
      }))

      // Trigger achievement
      window.dispatchEvent(new CustomEvent('achievementUnlocked', {
        detail: { id: 'first_bookmark' }
      }))
    }
  }, [pathname, isBookmarked])

  const triggerSearch = useCallback(() => {
    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
    document.dispatchEvent(event)
    window.dispatchEvent(new CustomEvent('commandPaletteOpened'))
  }, [])

  const triggerTerminal = useCallback(() => {
    const event = new KeyboardEvent('keydown', { key: 't' })
    document.dispatchEvent(event)
    window.dispatchEvent(new CustomEvent('terminalOpened'))
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [])

  // Context menu items
  const getMenuItems = useCallback((): ContextMenuItem[] => {
    const items: ContextMenuItem[] = []

    // If text is selected, show text-related options first
    if (selectedText) {
      items.push(
        {
          icon: Copy,
          label: 'Copy selected text',
          shortcut: '⌘C',
          action: () => copyToClipboard(selectedText),
        },
        {
          icon: Search,
          label: 'Search for selected text',
          action: () => {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedText)}`, '_blank')
          },
          divider: true,
        }
      )
    }

    // Navigation items
    items.push(
      {
        icon: ArrowLeft,
        label: 'Go back',
        shortcut: '⌘[',
        action: () => router.back(),
        disabled: !window.history.length,
      },
      {
        icon: ArrowRight,
        label: 'Go forward',
        shortcut: '⌘]',
        action: () => router.forward(),
      },
      {
        icon: Home,
        label: 'Go to homepage',
        action: () => router.push('/'),
      },
      {
        icon: RefreshCw,
        label: 'Refresh page',
        shortcut: '⌘R',
        action: () => window.location.reload(),
        divider: true,
      }
    )

    // Page actions
    items.push(
      {
        icon: isBookmarked ? BookmarkCheck : Bookmark,
        label: isBookmarked ? 'Remove bookmark' : 'Bookmark this page',
        shortcut: '⌘D',
        action: toggleBookmark,
      },
      {
        icon: Share2,
        label: 'Share this page',
        action: shareCurrentPage,
      },
      {
        icon: Copy,
        label: 'Copy page URL',
        action: () => copyToClipboard(window.location.href),
        divider: true,
      }
    )

    // Quick actions
    items.push(
      {
        icon: Search,
        label: 'Quick search',
        shortcut: '⌘K',
        action: triggerSearch,
      },
      {
        icon: Terminal,
        label: 'Open terminal',
        shortcut: 'T',
        action: triggerTerminal,
      },
      {
        icon: Maximize2,
        label: 'Toggle fullscreen',
        shortcut: 'F11',
        action: toggleFullscreen,
        divider: true,
      }
    )

    // View options
    items.push(
      {
        icon: ZoomIn,
        label: 'Zoom in',
        shortcut: '⌘+',
        action: () => {
          document.body.style.zoom = String(parseFloat(document.body.style.zoom || '1') + 0.1)
        },
      },
      {
        icon: ZoomOut,
        label: 'Zoom out',
        shortcut: '⌘-',
        action: () => {
          document.body.style.zoom = String(Math.max(0.5, parseFloat(document.body.style.zoom || '1') - 0.1))
        },
      }
    )

    return items
  }, [selectedText, isBookmarked, copyToClipboard, router, toggleBookmark, shareCurrentPage, triggerSearch, triggerTerminal, toggleFullscreen])

  // Handle context menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()

      // Get selected text
      const selection = window.getSelection()
      setSelectedText(selection?.toString() || '')

      // Calculate position
      const x = Math.min(e.clientX, window.innerWidth - 220)
      const y = Math.min(e.clientY, window.innerHeight - 400)

      setPosition({ x, y })
      setIsOpen(true)
    }

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          style={{ left: position.x, top: position.y }}
          className="fixed z-[100] w-56 py-2 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl overflow-hidden"
        >
          {getMenuItems().map((item, index) => (
            <div key={index}>
              <button
                onClick={() => {
                  if (!item.disabled) {
                    item.action()
                    setIsOpen(false)
                  }
                }}
                disabled={item.disabled}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors',
                  item.disabled
                    ? 'text-muted-foreground/50 cursor-not-allowed'
                    : 'text-foreground hover:bg-muted/50'
                )}
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs text-muted-foreground font-mono">{item.shortcut}</span>
                )}
              </button>
              {item.divider && <div className="my-1 h-px bg-border/50" />}
            </div>
          ))}

          {/* Footer */}
          <div className="mt-1 pt-2 px-3 border-t border-border/50">
            <p className="text-[10px] text-muted-foreground text-center">
              Ibnu Portfolio v3.0
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Keyboard,
  X,
  Navigation,
  Palette,
  Zap,
  Search,
  Home,
  User,
  Briefcase,
  BookOpen,
  Mail,
  Moon,
  Sun,
  Command,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface Shortcut {
  keys: string[]
  description: string
  category: string
  action?: () => void
}

export function KeyboardShortcuts() {
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const shortcuts: Shortcut[] = [
    // Navigation
    { keys: ['G', 'H'], description: 'Go to Home', category: 'Navigation', action: () => router.push('/') },
    { keys: ['G', 'A'], description: 'Go to About', category: 'Navigation', action: () => router.push('/about') },
    { keys: ['G', 'P'], description: 'Go to Projects', category: 'Navigation', action: () => router.push('/projects') },
    { keys: ['G', 'B'], description: 'Go to Blog', category: 'Navigation', action: () => router.push('/blog') },
    { keys: ['G', 'T'], description: 'Go to Tools', category: 'Navigation', action: () => router.push('/tools') },
    { keys: ['G', 'C'], description: 'Go to Contact', category: 'Navigation', action: () => router.push('/contact') },

    // Actions
    { keys: ['⌘', 'K'], description: 'Open Command Palette', category: 'Actions' },
    { keys: ['?'], description: 'Show Keyboard Shortcuts', category: 'Actions' },
    { keys: ['/'], description: 'Focus Search', category: 'Actions' },
    { keys: ['Esc'], description: 'Close Modal/Panel', category: 'Actions' },

    // Theme
    { keys: ['⌘', 'D'], description: 'Toggle Dark Mode', category: 'Theme', action: () => setTheme(theme === 'dark' ? 'light' : 'dark') },

    // Accessibility
    { keys: ['Tab'], description: 'Navigate Elements', category: 'Accessibility' },
    { keys: ['Enter'], description: 'Activate Element', category: 'Accessibility' },
    { keys: ['←', '→'], description: 'Navigate Tabs', category: 'Accessibility' },
  ]

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) acc[shortcut.category] = []
    acc[shortcut.category].push(shortcut)
    return acc
  }, {} as Record<string, Shortcut[]>)

  // Keyboard listener
  useEffect(() => {
    let keySequence: string[] = []
    let sequenceTimeout: NodeJS.Timeout

    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts panel with ?
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault()
          setIsOpen(prev => !prev)
          return
        }
      }

      // Close with Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        return
      }

      // Don't process shortcuts in inputs
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

      // Toggle dark mode
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault()
        setTheme(theme === 'dark' ? 'light' : 'dark')
        return
      }

      // Handle key sequences (G + H, G + P, etc.)
      clearTimeout(sequenceTimeout)
      keySequence.push(e.key.toUpperCase())

      // Check for matching shortcuts
      const matchingShortcut = shortcuts.find(s => {
        if (s.keys.length !== keySequence.length) return false
        return s.keys.every((key, i) => {
          const seqKey = keySequence[i]
          return key.toUpperCase() === seqKey ||
                 (key === '⌘' && (seqKey === 'META' || seqKey === 'CONTROL'))
        })
      })

      if (matchingShortcut?.action) {
        e.preventDefault()
        matchingShortcut.action()
        keySequence = []
        setIsOpen(false)
        return
      }

      // Clear sequence after delay
      sequenceTimeout = setTimeout(() => {
        keySequence = []
      }, 1000)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(sequenceTimeout)
    }
  }, [isOpen, router, setTheme, theme, shortcuts])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Navigation': return Navigation
      case 'Actions': return Zap
      case 'Theme': return Palette
      case 'Accessibility': return Keyboard
      default: return Command
    }
  }

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-20 z-40 p-2.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 shadow-lg hover:shadow-xl transition-all group hidden md:flex items-center justify-center"
        title="Keyboard Shortcuts (?)"
        aria-label="Show keyboard shortcuts"
      >
        <Keyboard className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[101] p-4"
            >
              <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/20">
                        <Keyboard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-bold text-lg">Keyboard Shortcuts</h2>
                        <p className="text-xs text-muted-foreground">
                          Power-user navigation
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
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-6">
                    {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => {
                      const Icon = getCategoryIcon(category)
                      return (
                        <div key={category}>
                          <div className="flex items-center gap-2 mb-3">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                              {category}
                            </h3>
                          </div>
                          <div className="space-y-2">
                            {categoryShortcuts.map((shortcut, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                              >
                                <span className="text-sm text-foreground">
                                  {shortcut.description}
                                </span>
                                <div className="flex items-center gap-1">
                                  {shortcut.keys.map((key, keyIndex) => (
                                    <span key={keyIndex} className="flex items-center gap-1">
                                      <kbd className="px-2 py-1 rounded bg-muted text-xs font-mono min-w-[28px] text-center">
                                        {key}
                                      </kbd>
                                      {keyIndex < shortcut.keys.length - 1 && (
                                        <span className="text-muted-foreground text-xs">+</span>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border/50 bg-muted/30">
                  <p className="text-xs text-center text-muted-foreground">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">?</kbd> anytime to toggle this panel
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

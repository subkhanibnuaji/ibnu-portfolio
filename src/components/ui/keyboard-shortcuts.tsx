'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Keyboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Shortcut {
  keys: string[]
  description: string
  category: string
}

const SHORTCUTS: Shortcut[] = [
  // Navigation
  { keys: ['⌘', 'K'], description: 'Open command palette', category: 'Navigation' },
  { keys: ['T'], description: 'Open terminal', category: 'Navigation' },
  { keys: ['Esc'], description: 'Close modal/dialog', category: 'Navigation' },
  { keys: ['?'], description: 'Show keyboard shortcuts', category: 'Navigation' },

  // Actions
  { keys: ['⌘', 'Enter'], description: 'Submit form', category: 'Actions' },
  { keys: ['⌘', 'S'], description: 'Save (in admin)', category: 'Actions' },

  // Terminal
  { keys: ['help'], description: 'Show all commands', category: 'Terminal' },
  { keys: ['clear'], description: 'Clear terminal', category: 'Terminal' },
  { keys: ['neofetch'], description: 'Show system info', category: 'Terminal' },
  { keys: ['matrix'], description: 'Matrix animation', category: 'Terminal' },

  // Scrolling
  { keys: ['↑', '↓'], description: 'Scroll up/down', category: 'Scrolling' },
  { keys: ['Home'], description: 'Scroll to top', category: 'Scrolling' },
  { keys: ['End'], description: 'Scroll to bottom', category: 'Scrolling' },
]

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with ? key
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setIsOpen(true)
      }
      // Close with Escape
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const categories = [...new Set(SHORTCUTS.map(s => s.category))]

  return (
    <>
      {/* Trigger Button (optional - can be hidden) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-6 z-40 p-3 rounded-full bg-muted/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-foreground transition-colors hidden lg:flex"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard className="h-5 w-5" />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl bg-background border border-border shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyber-gradient">
                    <Keyboard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
                    <p className="text-sm text-muted-foreground">
                      Navigate faster with these shortcuts
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">
                  {categories.map((category) => (
                    <div key={category}>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {SHORTCUTS.filter(s => s.category === category).map((shortcut, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <span className="text-sm">{shortcut.description}</span>
                            <div className="flex items-center gap-1">
                              {shortcut.keys.map((key, keyIndex) => (
                                <kbd
                                  key={keyIndex}
                                  className={cn(
                                    'px-2 py-1 text-xs font-mono rounded',
                                    'bg-muted border border-border',
                                    'min-w-[24px] text-center'
                                  )}
                                >
                                  {key}
                                </kbd>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border bg-muted/30">
                <p className="text-xs text-muted-foreground text-center">
                  Press <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">?</kbd> anytime to show this help
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

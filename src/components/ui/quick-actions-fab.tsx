'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  X,
  Terminal,
  Command,
  Brain,
  Gamepad2,
  Mail,
  Moon,
  Sun,
  Settings2,
  Accessibility,
  Bookmark,
  BarChart3,
  Palette,
  ChevronRight,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

type MenuCategory = 'main' | 'ui-settings'

interface QuickAction {
  icon: React.ElementType
  label: string
  action: () => void
  color: string
  shortcut?: string
}

export function QuickActionsFAB() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('main')
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const triggerTerminal = useCallback(() => {
    const event = new KeyboardEvent('keydown', { key: 't' })
    document.dispatchEvent(event)
    window.dispatchEvent(new CustomEvent('terminalOpened'))
    setIsOpen(false)
  }, [])

  const triggerCommandPalette = useCallback(() => {
    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
    document.dispatchEvent(event)
    window.dispatchEvent(new CustomEvent('commandPaletteOpened'))
    setIsOpen(false)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    window.dispatchEvent(new CustomEvent('themeChanged'))
  }, [theme, setTheme])

  const openPersonalization = useCallback(() => {
    window.dispatchEvent(new CustomEvent('openPersonalization'))
    setIsOpen(false)
  }, [])

  const openAccessibility = useCallback(() => {
    window.dispatchEvent(new CustomEvent('openAccessibility'))
    setIsOpen(false)
  }, [])

  const openBookmarks = useCallback(() => {
    window.dispatchEvent(new CustomEvent('openBookmarks'))
    setIsOpen(false)
  }, [])

  const openSiteStats = useCallback(() => {
    window.dispatchEvent(new CustomEvent('openSiteStats'))
    setIsOpen(false)
  }, [])

  // Main menu actions (4 items max)
  const mainActions: QuickAction[] = [
    {
      icon: Terminal,
      label: 'Terminal',
      action: triggerTerminal,
      color: 'bg-green-500',
      shortcut: 'T',
    },
    {
      icon: Command,
      label: 'Search',
      action: triggerCommandPalette,
      color: 'bg-purple-500',
      shortcut: '⌘K',
    },
    {
      icon: Brain,
      label: 'AI Tools',
      action: () => { router.push('/ai-tools'); setIsOpen(false) },
      color: 'bg-pink-500',
    },
    {
      icon: Mail,
      label: 'Contact',
      action: () => { router.push('/contact'); setIsOpen(false) },
      color: 'bg-teal-500',
    },
  ]

  // UI Settings submenu actions
  const uiSettingsActions: QuickAction[] = [
    {
      icon: theme === 'dark' ? Sun : Moon,
      label: theme === 'dark' ? 'Light' : 'Dark',
      action: toggleTheme,
      color: 'bg-amber-500',
    },
    {
      icon: Settings2,
      label: 'Personalize',
      action: openPersonalization,
      color: 'bg-violet-500',
    },
    {
      icon: Accessibility,
      label: 'Accessibility',
      action: openAccessibility,
      color: 'bg-blue-500',
    },
    {
      icon: Bookmark,
      label: 'Bookmarks',
      action: openBookmarks,
      color: 'bg-yellow-500',
    },
    {
      icon: BarChart3,
      label: 'Stats',
      action: openSiteStats,
      color: 'bg-emerald-500',
    },
    {
      icon: Gamepad2,
      label: 'Games',
      action: () => { router.push('/tools'); setIsOpen(false) },
      color: 'bg-cyan-500',
    },
  ]

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setActiveCategory('main')
  }, [])

  const currentActions = activeCategory === 'main' ? mainActions : uiSettingsActions

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute bottom-16 right-0 z-50 w-64 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-3 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {activeCategory !== 'main' && (
                    <button
                      onClick={() => setActiveCategory('main')}
                      className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                    </button>
                  )}
                  <h3 className="text-sm font-semibold">
                    {activeCategory === 'main' ? 'Quick Actions' : 'UI Settings'}
                  </h3>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Actions Grid */}
              <div className="p-3">
                <div className="grid grid-cols-3 gap-2">
                  {currentActions.map((action, index) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.03 } }}
                      onClick={action.action}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-muted/50 transition-colors group relative"
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform',
                        action.color
                      )}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {action.label}
                      </span>
                      {action.shortcut && (
                        <span className="absolute top-1 right-1 text-[8px] font-mono text-muted-foreground/50">
                          {action.shortcut}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* UI Settings Link (only in main menu) */}
                {activeCategory === 'main' && (
                  <button
                    onClick={() => setActiveCategory('ui-settings')}
                    className="w-full mt-3 flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        UI Settings & More
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50',
          isOpen
            ? 'bg-card border border-border'
            : 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500'
        )}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Zap className="h-6 w-6 text-white" />
          )}
        </motion.div>

        {/* Pulse effect when closed */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.button>
    </div>
  )
}

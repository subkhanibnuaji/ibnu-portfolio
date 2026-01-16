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
  FileText,
  Github,
  Linkedin,
  MessageSquare,
  Palette,
  Calculator,
  Music,
  Search,
  Moon,
  Sun,
  Sparkles,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface QuickAction {
  icon: React.ElementType
  label: string
  description: string
  action: () => void
  color: string
  shortcut?: string
}

export function QuickActionsFAB() {
  const [isOpen, setIsOpen] = useState(false)
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
    setIsOpen(false)
  }, [theme, setTheme])

  const actions: QuickAction[] = [
    {
      icon: Terminal,
      label: 'Terminal',
      description: 'Open terminal emulator',
      action: triggerTerminal,
      color: 'from-green-500 to-emerald-500',
      shortcut: 'T',
    },
    {
      icon: Command,
      label: 'Command',
      description: 'Quick navigation',
      action: triggerCommandPalette,
      color: 'from-purple-500 to-indigo-500',
      shortcut: '⌘K',
    },
    {
      icon: Brain,
      label: 'AI Tools',
      description: 'Explore AI features',
      action: () => { router.push('/ai-tools'); setIsOpen(false) },
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Gamepad2,
      label: 'Games',
      description: 'Play some games',
      action: () => { router.push('/tools'); setIsOpen(false) },
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: theme === 'dark' ? Sun : Moon,
      label: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
      description: 'Toggle theme',
      action: toggleTheme,
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Mail,
      label: 'Contact',
      description: 'Get in touch',
      action: () => { router.push('/contact'); setIsOpen(false) },
      color: 'from-teal-500 to-cyan-500',
    },
  ]

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Action items */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Actions */}
            <div className="absolute bottom-16 right-0 z-50">
              {actions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { delay: index * 0.05 }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: 20, 
                    scale: 0.8,
                    transition: { delay: (actions.length - index) * 0.03 }
                  }}
                  className="mb-3"
                >
                  <button
                    onClick={action.action}
                    className="group flex items-center gap-3 w-full"
                  >
                    {/* Label */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 shadow-lg">
                      <p className="text-sm font-medium text-foreground whitespace-nowrap">
                        {action.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>

                    {/* Icon button */}
                    <div className={cn(
                      'flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r shadow-lg hover:shadow-xl transition-all hover:scale-110',
                      action.color
                    )}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>

                    {/* Shortcut badge */}
                    {action.shortcut && (
                      <span className="absolute -top-1 -left-1 px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-card border border-border shadow-sm">
                        {action.shortcut}
                      </span>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
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

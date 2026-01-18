'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Star,
  FolderKanban,
  Award,
  User,
  Mail,
  Terminal,
  Bot,
  Moon,
  Sun,
  ArrowUp,
  Search,
  Sparkles,
  MessageSquare,
  FileText,
  Cpu,
  Bitcoin,
  Shield,
  Brain,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface Command {
  id: string
  icon: React.ElementType
  label: string
  shortcut?: string
  action: () => void
  category: 'navigation' | 'actions' | 'theme'
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const commands: Command[] = [
    // Navigation
    { id: 'home', icon: Home, label: 'Go to Home', shortcut: 'G H', action: () => router.push('/'), category: 'navigation' },
    { id: 'projects', icon: FolderKanban, label: 'Go to Projects', shortcut: 'G P', action: () => router.push('/projects'), category: 'navigation' },
    { id: 'creds', icon: Award, label: 'Go to Credentials', shortcut: 'G C', action: () => router.push('/certifications'), category: 'navigation' },
    { id: 'about', icon: User, label: 'Go to About', shortcut: 'G A', action: () => router.push('/about'), category: 'navigation' },
    { id: 'contact', icon: Mail, label: 'Go to Contact', shortcut: 'G K', action: () => router.push('/contact'), category: 'navigation' },
    // 3 Pillars of the Future
    { id: 'blockchain', icon: Bitcoin, label: 'Blockchain & Crypto', shortcut: 'G B', action: () => router.push('/pillars/blockchain-crypto'), category: 'navigation' },
    { id: 'security', icon: Shield, label: 'Cyber Security', shortcut: 'G S', action: () => router.push('/pillars/cyber-security'), category: 'navigation' },
    { id: 'ai-pillar', icon: Brain, label: 'Artificial Intelligence', shortcut: 'G I', action: () => router.push('/pillars/artificial-intelligence'), category: 'navigation' },
    // AI Tools
    { id: 'ai-tools', icon: Sparkles, label: 'AI Tools Playground', shortcut: 'G T', action: () => router.push('/ai-tools'), category: 'navigation' },
    { id: 'ai-llm', icon: MessageSquare, label: 'LLM Chat', shortcut: 'G L', action: () => router.push('/ai-tools/llm'), category: 'navigation' },
    { id: 'ai-rag', icon: FileText, label: 'RAG System', shortcut: 'G R', action: () => router.push('/ai-tools/rag'), category: 'navigation' },
    { id: 'ai-agent', icon: Cpu, label: 'AI Agent', shortcut: 'G N', action: () => router.push('/ai-tools/agent'), category: 'navigation' },
    // Actions
    { id: 'terminal', icon: Terminal, label: 'Open Terminal', shortcut: 'T', action: () => {
      const event = new KeyboardEvent('keydown', { key: 't' })
      document.dispatchEvent(event)
    }, category: 'actions' },
    { id: 'chatbot', icon: Bot, label: 'Open AI Assistant', shortcut: 'A', action: () => {
      // Trigger chatbot open
    }, category: 'actions' },
    { id: 'scrolltop', icon: ArrowUp, label: 'Scroll to Top', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }), category: 'actions' },
    // Theme
    { id: 'theme', icon: theme === 'dark' ? Sun : Moon, label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, shortcut: 'D', action: () => setTheme(theme === 'dark' ? 'light' : 'dark'), category: 'theme' },
  ]

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  )

  const executeCommand = useCallback((command: Command) => {
    command.action()
    setIsOpen(false)
    setSearch('')
    setSelectedIndex(0)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }

      // Close with Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setSearch('')
        setSelectedIndex(0)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex])
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands, executeCommand])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
          >
            <div className="mx-4 overflow-hidden rounded-2xl bg-card border border-border shadow-2xl">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
                <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[300px] overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="py-6 text-center text-muted-foreground">
                    No commands found.
                  </div>
                ) : (
                  <>
                    {/* Group by category */}
                    {['navigation', 'actions', 'theme'].map((category) => {
                      const categoryCommands = filteredCommands.filter(
                        (cmd) => cmd.category === category
                      )
                      if (categoryCommands.length === 0) return null

                      return (
                        <div key={category} className="mb-2">
                          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase">
                            {category}
                          </div>
                          {categoryCommands.map((command) => {
                            const globalIndex = filteredCommands.indexOf(command)
                            return (
                              <button
                                key={command.id}
                                onClick={() => executeCommand(command)}
                                className={cn(
                                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                                  globalIndex === selectedIndex
                                    ? 'bg-muted text-foreground'
                                    : 'text-muted-foreground hover:bg-muted/50'
                                )}
                              >
                                <command.icon className="h-4 w-4" />
                                <span className="flex-1">{command.label}</span>
                                {command.shortcut && (
                                  <kbd className="px-1.5 py-0.5 text-xs font-mono bg-background rounded">
                                    {command.shortcut}
                                  </kbd>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )
                    })}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

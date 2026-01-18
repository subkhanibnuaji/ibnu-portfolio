'use client'

import { useEffect, useState, useCallback, useMemo, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Home,
  User,
  Briefcase,
  BookOpen,
  Wrench,
  Terminal,
  Gamepad2,
  Mail,
  FileText,
  MessageSquare,
  Moon,
  Sun,
  Monitor,
  ArrowRight,
  Command,
  Zap,
  Brain,
  Shield,
  Palette,
  Volume2,
  VolumeX,
  Sparkles,
  Globe,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface CommandItem {
  id: string
  title: string
  description?: string
  icon: React.ElementType
  category: string
  keywords?: string[]
  action: () => void
  shortcut?: string
  isExternal?: boolean
}

const CATEGORIES = [
  { id: 'navigation', name: 'Navigation', icon: ArrowRight },
  { id: 'tools', name: 'AI Tools', icon: Brain },
  { id: 'actions', name: 'Actions', icon: Zap },
  { id: 'theme', name: 'Appearance', icon: Palette },
  { id: 'social', name: 'Social', icon: Globe },
]

export function CommandPalette() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const commands: CommandItem[] = useMemo(() => [
    // Navigation
    { id: 'home', title: 'Home', description: 'Go to homepage', icon: Home, category: 'navigation', keywords: ['main', 'start'], action: () => router.push('/'), shortcut: 'G H' },
    { id: 'about', title: 'About', description: 'Learn about me', icon: User, category: 'navigation', keywords: ['bio', 'profile'], action: () => router.push('/about'), shortcut: 'G A' },
    { id: 'projects', title: 'Projects', description: 'View my work', icon: Briefcase, category: 'navigation', keywords: ['portfolio', 'work'], action: () => router.push('/projects'), shortcut: 'G P' },
    { id: 'blog', title: 'Blog', description: 'Read articles', icon: BookOpen, category: 'navigation', keywords: ['articles', 'posts'], action: () => router.push('/blog'), shortcut: 'G B' },
    { id: 'tools', title: 'AI Tools', description: '70+ AI tools', icon: Wrench, category: 'navigation', keywords: ['ai', 'utilities'], action: () => router.push('/tools'), shortcut: 'G T' },
    { id: 'terminal', title: 'Terminal', description: 'Interactive CLI', icon: Terminal, category: 'navigation', keywords: ['cli', 'command'], action: () => router.push('/terminal') },
    { id: 'games', title: 'Games', description: 'Play mini-games', icon: Gamepad2, category: 'navigation', keywords: ['play', 'fun'], action: () => router.push('/games') },
    { id: 'contact', title: 'Contact', description: 'Get in touch', icon: Mail, category: 'navigation', keywords: ['email', 'message'], action: () => router.push('/contact'), shortcut: 'G C' },
    { id: 'resume', title: 'Resume', description: 'Download CV', icon: FileText, category: 'navigation', keywords: ['cv', 'download'], action: () => router.push('/resume') },
    { id: 'guestbook', title: 'Guestbook', description: 'Leave a message', icon: MessageSquare, category: 'navigation', keywords: ['sign', 'message'], action: () => router.push('/guestbook') },

    // AI Tools
    { id: 'ai-chat', title: 'AI Chat', description: 'Chat with AI assistant', icon: Brain, category: 'tools', keywords: ['chatbot', 'assistant'], action: () => router.push('/tools?category=ai') },
    { id: 'code-gen', title: 'Code Generator', description: 'Generate code with AI', icon: Terminal, category: 'tools', keywords: ['coding', 'programming'], action: () => router.push('/tools?category=developer') },
    { id: 'security', title: 'Security Tools', description: 'Cybersecurity utilities', icon: Shield, category: 'tools', keywords: ['cyber', 'hack'], action: () => router.push('/tools?category=security') },

    // Actions
    { id: 'search', title: 'Search Site', description: 'Search everything', icon: Search, category: 'actions', keywords: ['find', 'lookup'], action: () => {}, shortcut: '/' },
    { id: 'toggle-sound', title: 'Toggle Sound', description: 'Enable/disable sounds', icon: Volume2, category: 'actions', keywords: ['audio', 'mute'], action: () => window.dispatchEvent(new CustomEvent('toggleSound')) },
    { id: 'easter-eggs', title: 'Easter Eggs', description: 'Discover hidden features', icon: Sparkles, category: 'actions', keywords: ['secret', 'hidden'], action: () => window.dispatchEvent(new CustomEvent('showEasterEggs')) },

    // Theme
    { id: 'theme-dark', title: 'Dark Mode', description: 'Switch to dark theme', icon: Moon, category: 'theme', keywords: ['night'], action: () => setTheme('dark') },
    { id: 'theme-light', title: 'Light Mode', description: 'Switch to light theme', icon: Sun, category: 'theme', keywords: ['day', 'bright'], action: () => setTheme('light') },
    { id: 'theme-system', title: 'System Theme', description: 'Follow system preference', icon: Monitor, category: 'theme', keywords: ['auto'], action: () => setTheme('system') },

    // Social
    { id: 'github', title: 'GitHub', description: 'View my repositories', icon: Github, category: 'social', keywords: ['code', 'repo'], action: () => window.open('https://github.com/subkhanibnuaji', '_blank'), isExternal: true },
    { id: 'linkedin', title: 'LinkedIn', description: 'Professional network', icon: Linkedin, category: 'social', keywords: ['professional', 'network'], action: () => window.open('https://linkedin.com/in/subkhanibnuaji', '_blank'), isExternal: true },
    { id: 'twitter', title: 'Twitter', description: 'Follow for updates', icon: Twitter, category: 'social', keywords: ['social', 'tweets'], action: () => window.open('https://twitter.com/subkhanibnuaji', '_blank'), isExternal: true },
  ], [router, setTheme])

  const filteredCommands = useMemo(() => {
    if (!query) return commands
    const lowerQuery = query.toLowerCase()
    return commands.filter(cmd =>
      cmd.title.toLowerCase().includes(lowerQuery) ||
      cmd.description?.toLowerCase().includes(lowerQuery) ||
      cmd.keywords?.some(k => k.includes(lowerQuery)) ||
      cmd.category.includes(lowerQuery)
    )
  }, [commands, query])

  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}
    filteredCommands.forEach(cmd => {
      if (!groups[cmd.category]) groups[cmd.category] = []
      groups[cmd.category].push(cmd)
    })
    return groups
  }, [filteredCommands])

  const flatCommands = useMemo(() => {
    return Object.values(groupedCommands).flat()
  }, [groupedCommands])

  const handleSelect = useCallback((command: CommandItem) => {
    command.action()
    setIsOpen(false)
    setQuery('')
    setSelectedIndex(0)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
        return
      }

      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          setIsOpen(false)
          setQuery('')
          setSelectedIndex(0)
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % flatCommands.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => (prev - 1 + flatCommands.length) % flatCommands.length)
          break
        case 'Enter':
          e.preventDefault()
          if (flatCommands[selectedIndex]) {
            handleSelect(flatCommands[selectedIndex])
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, flatCommands, selectedIndex, handleSelect])

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  return (
    <>
      {/* Trigger hint */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 hidden md:block">
        <motion.button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 text-muted-foreground text-sm hover:text-foreground hover:border-primary/50 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Command className="h-3.5 w-3.5" />
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">⌘K</kbd>
          <span>to open command palette</span>
        </motion.button>
      </div>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-xl z-[101] p-4"
            >
              <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-border/50">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search commands, pages, tools..."
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                    autoFocus
                  />
                  <kbd className="px-2 py-1 rounded bg-muted text-xs text-muted-foreground font-mono">ESC</kbd>
                </div>

                {/* Results */}
                <div className="max-h-[400px] overflow-y-auto p-2">
                  {flatCommands.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No results found for &quot;{query}&quot;</p>
                    </div>
                  ) : (
                    Object.entries(groupedCommands).map(([category, items]) => {
                      const categoryInfo = CATEGORIES.find(c => c.id === category)
                      return (
                        <div key={category} className="mb-2">
                          <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            {categoryInfo && <categoryInfo.icon className="h-3.5 w-3.5" />}
                            {categoryInfo?.name || category}
                          </div>
                          {items.map((command) => {
                            const globalIndex = flatCommands.indexOf(command)
                            const isSelected = globalIndex === selectedIndex
                            return (
                              <button
                                key={command.id}
                                onClick={() => handleSelect(command)}
                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                className={cn(
                                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                                  isSelected
                                    ? 'bg-primary/10 text-foreground'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                )}
                              >
                                <div className={cn(
                                  'p-2 rounded-lg transition-colors',
                                  isSelected ? 'bg-primary/20' : 'bg-muted/50'
                                )}>
                                  <command.icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{command.title}</span>
                                    {command.isExternal && (
                                      <ExternalLink className="h-3 w-3 opacity-50" />
                                    )}
                                  </div>
                                  {command.description && (
                                    <p className="text-xs text-muted-foreground">{command.description}</p>
                                  )}
                                </div>
                                {command.shortcut && (
                                  <div className="flex items-center gap-1">
                                    {command.shortcut.split(' ').map((key, i) => (
                                      <kbd
                                        key={i}
                                        className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground font-mono"
                                      >
                                        {key}
                                      </kbd>
                                    ))}
                                  </div>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">↑↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">↵</kbd>
                      Select
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {flatCommands.length} commands available
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

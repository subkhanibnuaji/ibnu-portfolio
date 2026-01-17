'use client'

/**
 * Global Search Component
 * Super Apps feature for searching across all content
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  FileText,
  FolderGit2,
  Wrench,
  Bot,
  X,
  ArrowRight,
  Command,
  Clock,
  TrendingUp,
} from 'lucide-react'

// =============================================================================
// TYPES
// =============================================================================

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'blog' | 'project' | 'tool' | 'ai-tool' | 'page'
  url: string
  icon?: React.ReactNode
  tags?: string[]
}

interface SearchCategory {
  id: string
  label: string
  icon: React.ReactNode
}

// =============================================================================
// DATA
// =============================================================================

const CATEGORIES: SearchCategory[] = [
  { id: 'all', label: 'All', icon: <Search className="h-4 w-4" /> },
  { id: 'blog', label: 'Blog', icon: <FileText className="h-4 w-4" /> },
  { id: 'project', label: 'Projects', icon: <FolderGit2 className="h-4 w-4" /> },
  { id: 'tool', label: 'Tools', icon: <Wrench className="h-4 w-4" /> },
  { id: 'ai-tool', label: 'AI Tools', icon: <Bot className="h-4 w-4" /> },
]

// Static content index (in production, this would come from API/DB)
const CONTENT_INDEX: SearchResult[] = [
  // Pages
  { id: 'home', title: 'Home', description: 'Main landing page', type: 'page', url: '/' },
  { id: 'about', title: 'About', description: 'About me and my journey', type: 'page', url: '/about' },
  { id: 'projects', title: 'Projects', description: 'View all my projects', type: 'page', url: '/projects' },
  { id: 'blog', title: 'Blog', description: 'Read my articles', type: 'page', url: '/blog' },
  { id: 'contact', title: 'Contact', description: 'Get in touch', type: 'page', url: '/contact' },
  { id: 'certifications', title: 'Certifications', description: 'My credentials and certificates', type: 'page', url: '/certifications' },

  // AI Tools
  { id: 'ai-chat', title: 'AI Chat', description: 'Chat with AI assistant', type: 'ai-tool', url: '/ai-tools/llm', tags: ['chat', 'gpt', 'claude'] },
  { id: 'image-classifier', title: 'Image Classifier', description: 'Classify images using AI', type: 'ai-tool', url: '/ai-tools/image-classifier', tags: ['ml', 'vision'] },
  { id: 'object-detection', title: 'Object Detection', description: 'Detect objects in images', type: 'ai-tool', url: '/ai-tools/object-detection', tags: ['ml', 'vision'] },
  { id: 'sentiment-analysis', title: 'Sentiment Analysis', description: 'Analyze text sentiment', type: 'ai-tool', url: '/ai-tools/sentiment-analysis', tags: ['nlp', 'text'] },
  { id: 'speech-to-text', title: 'Speech to Text', description: 'Convert voice to text', type: 'ai-tool', url: '/ai-tools/speech-to-text', tags: ['audio', 'transcription'] },
  { id: 'text-to-speech', title: 'Text to Speech', description: 'Convert text to voice', type: 'ai-tool', url: '/ai-tools/text-to-speech', tags: ['audio', 'synthesis'] },
  { id: 'background-removal', title: 'Background Removal', description: 'Remove image backgrounds', type: 'ai-tool', url: '/ai-tools/background-removal', tags: ['image', 'editing'] },
  { id: 'pose-estimation', title: 'Pose Estimation', description: 'Detect human poses', type: 'ai-tool', url: '/ai-tools/pose-estimation', tags: ['ml', 'vision'] },

  // Utility Tools
  { id: 'calculator', title: 'Calculator', description: 'Basic calculator', type: 'tool', url: '/tools/calculator', tags: ['math'] },
  { id: 'password-generator', title: 'Password Generator', description: 'Generate secure passwords', type: 'tool', url: '/tools/password-generator', tags: ['security'] },
  { id: 'qr-generator', title: 'QR Generator', description: 'Generate QR codes', type: 'tool', url: '/tools/qr-generator', tags: ['code'] },
  { id: 'color-picker', title: 'Color Picker', description: 'Pick and convert colors', type: 'tool', url: '/tools/color-picker', tags: ['design'] },
  { id: 'json-formatter', title: 'JSON Formatter', description: 'Format and validate JSON', type: 'tool', url: '/tools/json-formatter', tags: ['dev'] },
  { id: 'markdown-editor', title: 'Markdown Editor', description: 'Write and preview markdown', type: 'tool', url: '/tools/markdown-editor', tags: ['writing'] },
  { id: 'base64', title: 'Base64 Encoder', description: 'Encode and decode base64', type: 'tool', url: '/tools/base64', tags: ['dev'] },
  { id: 'hash-generator', title: 'Hash Generator', description: 'Generate hash values', type: 'tool', url: '/tools/hash-generator', tags: ['security'] },
  { id: 'pomodoro', title: 'Pomodoro Timer', description: 'Focus timer for productivity', type: 'tool', url: '/tools/pomodoro-timer', tags: ['productivity'] },
  { id: 'notes', title: 'Notes App', description: 'Quick notes taking', type: 'tool', url: '/tools/notes-app', tags: ['productivity'] },

  // Games
  { id: 'snake', title: 'Snake Game', description: 'Classic snake game', type: 'tool', url: '/tools/snake-game', tags: ['game'] },
  { id: '2048', title: '2048 Game', description: 'Number puzzle game', type: 'tool', url: '/tools/2048-game', tags: ['game'] },
  { id: 'tetris', title: 'Tetris', description: 'Classic tetris game', type: 'tool', url: '/tools/tetris-game', tags: ['game'] },
]

const TRENDING_SEARCHES = [
  'AI Chat',
  'Password Generator',
  'JSON Formatter',
  'Snake Game',
]

// =============================================================================
// COMPONENT
// =============================================================================

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchQuery = query.toLowerCase()
    const filtered = CONTENT_INDEX.filter((item) => {
      // Filter by category
      if (category !== 'all' && item.type !== category) return false

      // Search in title, description, and tags
      const matchTitle = item.title.toLowerCase().includes(searchQuery)
      const matchDesc = item.description.toLowerCase().includes(searchQuery)
      const matchTags = item.tags?.some((tag) => tag.toLowerCase().includes(searchQuery))

      return matchTitle || matchDesc || matchTags
    })

    setResults(filtered.slice(0, 10))
    setSelectedIndex(0)
  }, [query, category])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((i) => Math.max(i - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (results[selectedIndex]) {
            navigateTo(results[selectedIndex])
          }
          break
        case 'Escape':
          onClose()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, onClose])

  const navigateTo = useCallback(
    (result: SearchResult) => {
      // Save to recent searches
      const updated = [result.title, ...recentSearches.filter((s) => s !== result.title)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem('recentSearches', JSON.stringify(updated))

      // Navigate
      router.push(result.url)
      onClose()
      setQuery('')
    },
    [router, onClose, recentSearches]
  )

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'blog':
        return <FileText className="h-4 w-4 text-cyan-500" />
      case 'project':
        return <FolderGit2 className="h-4 w-4 text-purple-500" />
      case 'tool':
        return <Wrench className="h-4 w-4 text-green-500" />
      case 'ai-tool':
        return <Bot className="h-4 w-4 text-orange-500" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl mx-auto p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search everything..."
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                autoComplete="off"
                spellCheck="false"
              />
              <div className="flex items-center gap-2">
                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <Command className="h-3 w-3" />K
                </kbd>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1 p-2 border-b border-border overflow-x-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap
                    transition-colors
                    ${
                      category === cat.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    }
                  `}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim() ? (
                results.length > 0 ? (
                  <div className="p-2">
                    {results.map((result, index) => (
                      <button
                        key={result.id}
                        onClick={() => navigateTo(result)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                          transition-colors
                          ${
                            index === selectedIndex
                              ? 'bg-muted'
                              : 'hover:bg-muted/50'
                          }
                        `}
                      >
                        {getIcon(result.type)}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{result.title}</div>
                          <div className="text-sm text-muted-foreground truncate">
                            {result.description}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No results found for &quot;{query}&quot;</p>
                    <p className="text-sm mt-1">Try different keywords</p>
                  </div>
                )
              ) : (
                <div className="p-4 space-y-6">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                        <Clock className="h-4 w-4" />
                        Recent Searches
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search) => (
                          <button
                            key={search}
                            onClick={() => setQuery(search)}
                            className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending */}
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                      <TrendingUp className="h-4 w-4" />
                      Trending
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING_SEARCHES.map((search) => (
                        <button
                          key={search}
                          onClick={() => setQuery(search)}
                          className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded">↵</kbd> Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded">Esc</kbd> Close
                </span>
              </div>
              <div>{results.length} results</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// =============================================================================
// HOOK
// =============================================================================

export function useGlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  FileText,
  Code,
  Award,
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { semanticSearch, getSearchSuggestions, type SearchableItem } from '@/lib/search'

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
}

const TYPE_ICONS = {
  project: Code,
  blog: FileText,
  certification: Award,
  skill: Sparkles
}

const TYPE_COLORS = {
  project: 'text-cyber-cyan',
  blog: 'text-cyber-purple',
  certification: 'text-yellow-500',
  skill: 'text-cyber-green'
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchableItem[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSuggestions([])
      return
    }

    setIsSearching(true)
    const timer = setTimeout(() => {
      const searchResults = semanticSearch(query, 8)
      const searchSuggestions = getSearchSuggestions(query)
      setResults(searchResults)
      setSuggestions(searchSuggestions)
      setIsSearching(false)
      setSelectedIndex(0)
    }, 150)

    return () => clearTimeout(timer)
  }, [query])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, results.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (results[selectedIndex]) {
          router.push(results[selectedIndex].url)
          onClose()
        }
        break
      case 'Escape':
        onClose()
        break
    }
  }, [isOpen, results, selectedIndex, router, onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults([])
      setSuggestions([])
      setSelectedIndex(0)
    }
  }, [isOpen])

  const handleResultClick = (url: string) => {
    router.push(url)
    onClose()
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed inset-x-4 top-[15%] z-50 mx-auto max-w-2xl"
          >
            <div className="overflow-hidden rounded-2xl bg-background border border-border shadow-2xl">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 border-b border-border">
                {isSearching ? (
                  <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                ) : (
                  <Search className="h-5 w-5 text-muted-foreground" />
                )}
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects, articles, skills..."
                  autoFocus
                  className="flex-1 py-4 bg-transparent outline-none placeholder:text-muted-foreground"
                />
                {query && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuery('')}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* AI Badge */}
              <div className="px-4 py-2 bg-muted/30 border-b border-border">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-cyber-cyan" />
                  AI-powered semantic search
                </span>
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto">
                {query && results.length === 0 && !isSearching && (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>No results found for "{query}"</p>
                    <p className="text-sm mt-2">Try different keywords</p>
                  </div>
                )}

                {results.length > 0 && (
                  <ul className="p-2">
                    {results.map((result, index) => {
                      const Icon = TYPE_ICONS[result.type]
                      return (
                        <li key={result.id}>
                          <button
                            onClick={() => handleResultClick(result.url)}
                            className={cn(
                              'w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors',
                              index === selectedIndex
                                ? 'bg-muted'
                                : 'hover:bg-muted/50'
                            )}
                          >
                            <div className={cn('p-2 rounded-lg bg-muted', TYPE_COLORS[result.type])}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium truncate">
                                  {result.title}
                                </span>
                                <span className="text-xs text-muted-foreground capitalize">
                                  {result.type}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                                {result.content.slice(0, 100)}...
                              </p>
                              {result.tags && (
                                <div className="flex gap-1 mt-1">
                                  {result.tags.slice(0, 3).map(tag => (
                                    <span
                                      key={tag}
                                      className="px-1.5 py-0.5 text-xs bg-muted rounded"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}

                {/* Suggestions */}
                {suggestions.length > 0 && results.length === 0 && (
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map(suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => setQuery(suggestion)}
                          className="px-3 py-1.5 text-sm bg-muted rounded-full hover:bg-muted/80 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded">↵</kbd>
                    Open
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded">Esc</kbd>
                    Close
                  </span>
                </div>
                {results.length > 0 && (
                  <span>{results.length} results</span>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

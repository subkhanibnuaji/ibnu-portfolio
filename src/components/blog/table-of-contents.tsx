'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { List, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  className?: string
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Get all headings from the article
    const article = document.querySelector('article')
    if (!article) return

    const elements = article.querySelectorAll('h2, h3, h4')
    const items: TOCItem[] = []

    elements.forEach((el) => {
      const id = el.id || el.textContent?.toLowerCase().replace(/\s+/g, '-') || ''
      if (!el.id) el.id = id

      items.push({
        id,
        text: el.textContent || '',
        level: parseInt(el.tagName[1])
      })
    })

    setHeadings(items)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 100
      const top = el.offsetTop - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  if (headings.length === 0) return null

  return (
    <nav className={cn('glass rounded-xl p-6', className)}>
      <div className="flex items-center gap-2 mb-4">
        <List className="h-5 w-5 text-cyber-cyan" />
        <span className="font-semibold">Table of Contents</span>
      </div>

      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={cn(
                'w-full text-left py-1.5 px-3 rounded-lg text-sm transition-colors',
                'hover:bg-muted',
                heading.level === 2 && 'font-medium',
                heading.level === 3 && 'pl-6 text-muted-foreground',
                heading.level === 4 && 'pl-9 text-muted-foreground text-xs',
                activeId === heading.id && 'bg-cyber-cyan/10 text-cyber-cyan'
              )}
            >
              <span className="flex items-center gap-2">
                {activeId === heading.id && (
                  <motion.span
                    layoutId="toc-indicator"
                    className="w-1 h-4 bg-cyber-cyan rounded-full"
                  />
                )}
                {heading.text}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// Floating TOC for larger screens
export function FloatingTOC() {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const article = document.querySelector('article')
    if (!article) return

    const elements = article.querySelectorAll('h2, h3')
    const items: TOCItem[] = []

    elements.forEach((el) => {
      const id = el.id || el.textContent?.toLowerCase().replace(/\s+/g, '-') || ''
      if (!el.id) el.id = id

      items.push({
        id,
        text: el.textContent || '',
        level: parseInt(el.tagName[1])
      })
    })

    setHeadings(items)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 100
      const top = el.offsetTop - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setIsExpanded(false)
  }

  if (headings.length === 0) return null

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:block">
      <motion.div
        animate={{ width: isExpanded ? 280 : 48 }}
        className="glass rounded-xl overflow-hidden"
      >
        {isExpanded ? (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-sm">On this page</span>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-muted rounded"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <ul className="space-y-1">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <button
                    onClick={() => scrollToHeading(heading.id)}
                    className={cn(
                      'w-full text-left py-1 px-2 rounded text-xs transition-colors truncate',
                      heading.level === 3 && 'pl-4 text-muted-foreground',
                      activeId === heading.id
                        ? 'bg-cyber-cyan/10 text-cyber-cyan'
                        : 'hover:bg-muted'
                    )}
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
            title="Table of Contents"
          >
            <List className="h-5 w-5" />
          </button>
        )}
      </motion.div>
    </div>
  )
}

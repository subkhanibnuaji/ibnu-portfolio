'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  Search,
  ChevronDown,
  FolderKanban,
  Wrench,
  Smartphone,
  Bot,
  Brain,
  MessageSquare,
  FileSearch,
  Sparkles,
  Shield,
  Wallet,
  Cpu,
  Layers,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'

// Main navigation links
const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/certifications', label: 'Credentials' },
]

// Dropdown menu items for "3 Pillars"
const PILLARS_ITEMS = [
  {
    href: '/interests',
    label: 'All Interests',
    icon: Layers,
    description: 'Explore all three pillars'
  },
  {
    href: '/interests#ai',
    label: 'Artificial Intelligence',
    icon: Brain,
    description: 'AI, LLMs, and autonomous agents'
  },
  {
    href: '/interests#crypto',
    label: 'Blockchain & Crypto',
    icon: Wallet,
    description: 'DeFi, Web3, and trading'
  },
  {
    href: '/interests#cyber',
    label: 'Cybersecurity',
    icon: Shield,
    description: 'OSINT, threat intel, forensics'
  },
]

// Dropdown menu items for "Explore"
const EXPLORE_ITEMS = [
  {
    href: '/projects',
    label: 'Projects',
    icon: FolderKanban,
    description: 'View my work portfolio'
  },
  {
    href: '/tools',
    label: 'Tools',
    icon: Wrench,
    description: '50+ utility tools'
  },
  {
    href: '/mobile',
    label: 'Mobile App',
    icon: Smartphone,
    description: 'Download Android APK'
  },
]

// Dropdown menu items for "AI"
const AI_ITEMS = [
  {
    href: '/ai-tools',
    label: 'AI Tools',
    icon: Bot,
    description: 'AI-powered utilities'
  },
  {
    href: '/ai-tools/llm',
    label: 'LLM Chat',
    icon: MessageSquare,
    description: 'Chat with AI models'
  },
  {
    href: '/ai-tools/rag',
    label: 'RAG System',
    icon: FileSearch,
    description: 'Document Q&A'
  },
  {
    href: '/ai-tools/agent',
    label: 'AI Agent',
    icon: Brain,
    description: 'Autonomous AI agent'
  },
]

interface DropdownProps {
  label: string
  items: typeof EXPLORE_ITEMS
  isActive: boolean
  icon?: React.ElementType
}

function NavDropdown({ label, items, isActive, icon: Icon }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150)
  }

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className={cn(
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5',
          'cursor-pointer select-none',
          isActive
            ? 'text-foreground bg-muted'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        )}
        onClick={handleClick}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {Icon && <Icon className="h-4 w-4" />}
        {label}
        <ChevronDown className={cn(
          'h-3 w-3 transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-64 p-2 rounded-xl bg-background/95 backdrop-blur-xl border border-border shadow-xl z-[60]"
          >
            {items.map((item) => {
              const ItemIcon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-lg bg-muted group-hover:bg-cyber-cyan/20 transition-colors">
                    <ItemIcon className="h-4 w-4 text-muted-foreground group-hover:text-cyber-cyan transition-colors" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </Link>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
    setMobileSubmenu(null)
  }, [pathname])

  const isPillarsActive = pathname.startsWith('/interests')
  const isExploreActive = EXPLORE_ITEMS.some(item => pathname.startsWith(item.href.split('#')[0]))
  const isAIActive = AI_ITEMS.some(item => pathname.startsWith(item.href.split('#')[0]))

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[52] transition-all duration-300',
          isScrolled
            ? 'bg-background/80 dark:bg-background/70 backdrop-blur-xl border-b border-border/50 dark:border-primary/10 py-3 shadow-sm dark:shadow-primary/5'
            : 'bg-transparent py-5'
        )}
      >
        <nav className="container flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight relative z-10"
          >
            <span className="gradient-text">IBNU</span>
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Home Link */}
            <Link
              href="/"
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === '/'
                  ? 'text-foreground bg-muted'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              Home
            </Link>

            {/* 3 Pillars Dropdown */}
            <NavDropdown
              label="3 Pillars"
              items={PILLARS_ITEMS}
              isActive={isPillarsActive}
              icon={Sparkles}
            />

            {/* Explore Dropdown */}
            <NavDropdown
              label="Explore"
              items={EXPLORE_ITEMS}
              isActive={isExploreActive}
            />

            {/* AI Dropdown */}
            <NavDropdown
              label="AI"
              items={AI_ITEMS}
              isActive={isAIActive}
            />

            {/* About Link */}
            <Link
              href="/about"
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === '/about'
                  ? 'text-foreground bg-muted'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              About
            </Link>

            {/* Credentials Link */}
            <Link
              href="/certifications"
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === '/certifications'
                  ? 'text-foreground bg-muted'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              Credentials
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 relative z-10">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Command Palette Trigger */}
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-2 text-muted-foreground"
              onClick={() => {
                const event = new KeyboardEvent('keydown', {
                  key: 'k',
                  metaKey: true,
                })
                document.dispatchEvent(event)
              }}
            >
              <Search className="h-4 w-4" />
              <span className="text-xs">Search</span>
              <kbd className="ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded">
                ⌘K
              </kbd>
            </Button>

            {/* CTA Button */}
            <Button size="sm" variant="gradient" asChild className="hidden sm:flex">
              <Link href="/contact">
                Let&apos;s Connect
              </Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-[53] p-4 md:hidden"
          >
            <div className="rounded-2xl bg-background/95 backdrop-blur-xl border border-border p-4 shadow-xl max-h-[80vh] overflow-y-auto">
              <nav className="flex flex-col gap-1">
                {/* Home */}
                <Link
                  href="/"
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    pathname === '/'
                      ? 'text-foreground bg-muted'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  Home
                </Link>

                {/* 3 Pillars Section */}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setMobileSubmenu(mobileSubmenu === 'pillars' ? null : 'pillars')}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between',
                      isPillarsActive
                        ? 'text-foreground bg-muted'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      3 Pillars
                    </span>
                    <ChevronDown className={cn(
                      'h-4 w-4 transition-transform',
                      mobileSubmenu === 'pillars' && 'rotate-180'
                    )} />
                  </button>
                  <AnimatePresence>
                    {mobileSubmenu === 'pillars' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 mt-1 space-y-1">
                          {PILLARS_ITEMS.map((item) => {
                            const ItemIcon = item.icon
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                  'flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors',
                                  pathname === item.href.split('#')[0]
                                    ? 'text-foreground bg-muted/50'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                )}
                              >
                                <ItemIcon className="h-4 w-4" />
                                {item.label}
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Explore Section */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileSubmenu(mobileSubmenu === 'explore' ? null : 'explore')}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between',
                      isExploreActive
                        ? 'text-foreground bg-muted'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <FolderKanban className="h-4 w-4" />
                      Explore
                    </span>
                    <ChevronDown className={cn(
                      'h-4 w-4 transition-transform',
                      mobileSubmenu === 'explore' && 'rotate-180'
                    )} />
                  </button>
                  <AnimatePresence>
                    {mobileSubmenu === 'explore' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 mt-1 space-y-1">
                          {EXPLORE_ITEMS.map((item) => {
                            const ItemIcon = item.icon
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                  'flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors',
                                  pathname === item.href
                                    ? 'text-foreground bg-muted/50'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                )}
                              >
                                <ItemIcon className="h-4 w-4" />
                                {item.label}
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* AI Section */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileSubmenu(mobileSubmenu === 'ai' ? null : 'ai')}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between',
                      isAIActive
                        ? 'text-foreground bg-muted'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      AI
                    </span>
                    <ChevronDown className={cn(
                      'h-4 w-4 transition-transform',
                      mobileSubmenu === 'ai' && 'rotate-180'
                    )} />
                  </button>
                  <AnimatePresence>
                    {mobileSubmenu === 'ai' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 mt-1 space-y-1">
                          {AI_ITEMS.map((item) => {
                            const ItemIcon = item.icon
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                  'flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors',
                                  pathname === item.href
                                    ? 'text-foreground bg-muted/50'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                )}
                              >
                                <ItemIcon className="h-4 w-4" />
                                {item.label}
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* About */}
                <Link
                  href="/about"
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    pathname === '/about'
                      ? 'text-foreground bg-muted'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  About
                </Link>

                {/* Credentials */}
                <Link
                  href="/certifications"
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    pathname === '/certifications'
                      ? 'text-foreground bg-muted'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  Credentials
                </Link>

                <Button variant="gradient" className="mt-4" asChild>
                  <Link href="/contact">Let&apos;s Connect</Link>
                </Button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

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
  Bitcoin,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'

// 3 Pillars of the Future submenu
const PILLARS_ITEMS = [
  {
    href: '/pillars/blockchain-crypto',
    label: 'Blockchain & Crypto',
    icon: Bitcoin,
    description: 'Live crypto prices & news',
    color: 'text-cyber-orange',
    bgColor: 'bg-cyber-orange/10',
  },
  {
    href: '/pillars/cyber-security',
    label: 'Cyber Security',
    icon: Shield,
    description: 'Security news & threats',
    color: 'text-security-safe',
    bgColor: 'bg-security-safe/10',
  },
  {
    href: '/pillars/artificial-intelligence',
    label: 'Artificial Intelligence',
    icon: Brain,
    description: 'AI news & breakthroughs',
    color: 'text-ai-primary',
    bgColor: 'bg-ai-primary/10',
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

// Main navigation links
const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/certifications', label: 'Credentials' },
  { href: '/mobile', label: 'Mobile' },
]

interface DropdownItem {
  href: string
  label: string
  icon: React.ElementType
  description: string
  color?: string
  bgColor?: string
}

interface DropdownProps {
  label: string
  items: DropdownItem[]
  isActive: boolean
  icon?: React.ElementType
  showHeader?: boolean
  headerText?: string
}

function NavDropdown({ label, items, isActive, icon: LabelIcon, showHeader, headerText }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cn(
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5',
          isActive
            ? 'text-foreground bg-muted'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {LabelIcon && <LabelIcon className="h-4 w-4" />}
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
            className="absolute top-full left-0 mt-2 w-72 p-2 rounded-xl bg-background/95 backdrop-blur-xl border border-border shadow-xl z-50"
          >
            {showHeader && headerText && (
              <div className="px-3 py-2 mb-1 border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {headerText}
                </p>
              </div>
            )}
            {items.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className={cn(
                    'p-2 rounded-lg transition-colors',
                    item.bgColor || 'bg-muted group-hover:bg-cyber-cyan/20'
                  )}>
                    <Icon className={cn(
                      'h-4 w-4 transition-colors',
                      item.color || 'text-muted-foreground group-hover:text-cyber-cyan'
                    )} />
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

  const isPillarsActive = pathname.startsWith('/pillars')
  const isExploreActive = EXPLORE_ITEMS.some(item => pathname.startsWith(item.href))
  const isAIActive = AI_ITEMS.some(item => pathname.startsWith(item.href))

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[52] transition-all duration-300 pointer-events-auto',
          isScrolled
            ? 'bg-background/80 dark:bg-background/70 backdrop-blur-xl border-b border-border/50 dark:border-primary/10 py-3 shadow-sm dark:shadow-primary/5'
            : 'bg-transparent py-5'
        )}
      >
        <nav className="container flex items-center justify-between pointer-events-auto">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight cursor-pointer"
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
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                pathname === '/'
                  ? 'text-foreground bg-muted'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              Home
            </Link>

            {/* 3 Pillars Dropdown - NEW */}
            <NavDropdown
              label="3 Pillars"
              items={PILLARS_ITEMS}
              isActive={isPillarsActive}
              icon={Sparkles}
              showHeader
              headerText="3 Pillars of the Future"
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

            {/* About & Credentials */}
            {NAV_LINKS.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                  pathname === link.href
                    ? 'text-foreground bg-muted'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
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
            className="fixed inset-x-0 top-16 z-30 p-4 md:hidden"
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

                {/* 3 Pillars Section - NEW */}
                <div className="mt-2">
                  <button
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
                      3 Pillars of the Future
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
                            const Icon = item.icon
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors',
                                  pathname === item.href
                                    ? 'text-foreground bg-muted/50'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                )}
                              >
                                <div className={cn('p-1.5 rounded-md', item.bgColor)}>
                                  <Icon className={cn('h-4 w-4', item.color)} />
                                </div>
                                <span>{item.label}</span>
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
                            const Icon = item.icon
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
                                <Icon className="h-4 w-4" />
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
                            const Icon = item.icon
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
                                <Icon className="h-4 w-4" />
                                {item.label}
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Other Links */}
                {NAV_LINKS.slice(1).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      pathname === link.href
                        ? 'text-foreground bg-muted'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

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

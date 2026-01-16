'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, Search, ChevronDown,
  Bitcoin, Shield, Brain, Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'

const PILLARS_SUBMENU = [
  {
    href: '/pillars/blockchain-crypto',
    label: 'Blockchain & Crypto',
    description: 'Real-time crypto prices and blockchain news',
    icon: Bitcoin,
    color: 'text-cyber-orange',
    bgColor: 'bg-cyber-orange/10',
  },
  {
    href: '/pillars/cyber-security',
    label: 'Cyber Security',
    description: 'Security news, threats and vulnerabilities',
    icon: Shield,
    color: 'text-security-safe',
    bgColor: 'bg-security-safe/10',
  },
  {
    href: '/pillars/artificial-intelligence',
    label: 'Artificial Intelligence',
    description: 'AI news, tools and research breakthroughs',
    icon: Brain,
    color: 'text-ai-primary',
    bgColor: 'bg-ai-primary/10',
  },
]

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/tools', label: 'Tools' },
  { href: '/certifications', label: 'Credentials' },
  { href: '/about', label: 'About' },
  { href: '/mobile', label: 'Mobile' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isPillarsOpen, setIsPillarsOpen] = useState(false)
  const [isMobilePillarsOpen, setIsMobilePillarsOpen] = useState(false)
  const pillarsRef = useRef<HTMLDivElement>(null)
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
    setIsMobilePillarsOpen(false)
  }, [pathname])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pillarsRef.current && !pillarsRef.current.contains(event.target as Node)) {
        setIsPillarsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isPillarPage = pathname.startsWith('/pillars')
  const isAIToolsPage = pathname.startsWith('/ai-tools')

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled
            ? 'bg-background/80 dark:bg-background/70 backdrop-blur-xl border-b border-border/50 dark:border-primary/10 py-3 shadow-sm dark:shadow-primary/5'
            : 'bg-transparent py-5'
        )}
      >
        <nav className="container flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight"
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
            <div ref={pillarsRef} className="relative">
              <button
                onClick={() => setIsPillarsOpen(!isPillarsOpen)}
                onMouseEnter={() => setIsPillarsOpen(true)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isPillarPage || isAIToolsPage
                    ? 'text-foreground bg-muted'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Sparkles className="w-4 h-4" />
                3 Pillars
                <ChevronDown className={cn(
                  'w-3.5 h-3.5 transition-transform duration-200',
                  isPillarsOpen && 'rotate-180'
                )} />
              </button>

              <AnimatePresence>
                {isPillarsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    onMouseLeave={() => setIsPillarsOpen(false)}
                    className="absolute top-full left-0 mt-2 w-80 p-2 rounded-xl bg-background/95 backdrop-blur-xl border border-border shadow-xl"
                  >
                    <div className="p-2 mb-2 border-b border-border">
                      <p className="text-xs font-medium text-muted-foreground">
                        3 PILLARS OF THE FUTURE
                      </p>
                    </div>
                    {PILLARS_SUBMENU.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsPillarsOpen(false)}
                        className={cn(
                          'flex items-start gap-3 p-3 rounded-lg transition-colors',
                          pathname === item.href
                            ? 'bg-muted'
                            : 'hover:bg-muted/50'
                        )}
                      >
                        <div className={cn('p-2 rounded-lg', item.bgColor)}>
                          <item.icon className={cn('w-5 h-5', item.color)} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                    {/* AI Tools Quick Link in Dropdown */}
                    <div className="mt-2 pt-2 border-t border-border">
                      <Link
                        href="/ai-tools"
                        onClick={() => setIsPillarsOpen(false)}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg transition-colors',
                          isAIToolsPage
                            ? 'bg-muted'
                            : 'hover:bg-muted/50'
                        )}
                      >
                        <div className="p-2 rounded-lg bg-ai-secondary/10">
                          <Brain className="w-5 h-5 text-ai-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">AI Tools Playground</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Try browser-based ML tools
                          </p>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other Nav Links */}
            {NAV_LINKS.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
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

                {/* 3 Pillars Dropdown for Mobile */}
                <div>
                  <button
                    onClick={() => setIsMobilePillarsOpen(!isMobilePillarsOpen)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      isPillarPage || isAIToolsPage
                        ? 'text-foreground bg-muted'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      3 Pillars of the Future
                    </span>
                    <ChevronDown className={cn(
                      'w-4 h-4 transition-transform duration-200',
                      isMobilePillarsOpen && 'rotate-180'
                    )} />
                  </button>

                  <AnimatePresence>
                    {isMobilePillarsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 py-2 space-y-1">
                          {PILLARS_SUBMENU.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                                pathname === item.href
                                  ? 'bg-muted'
                                  : 'hover:bg-muted/50'
                              )}
                            >
                              <div className={cn('p-2 rounded-lg', item.bgColor)}>
                                <item.icon className={cn('w-4 h-4', item.color)} />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{item.label}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.description}
                                </p>
                              </div>
                            </Link>
                          ))}
                          {/* AI Tools in Mobile Dropdown */}
                          <Link
                            href="/ai-tools"
                            className={cn(
                              'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                              isAIToolsPage
                                ? 'bg-muted'
                                : 'hover:bg-muted/50'
                            )}
                          >
                            <div className="p-2 rounded-lg bg-ai-secondary/10">
                              <Brain className="w-4 h-4 text-ai-secondary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">AI Tools Playground</p>
                              <p className="text-xs text-muted-foreground">
                                Try browser-based ML tools
                              </p>
                            </div>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Other Nav Links */}
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

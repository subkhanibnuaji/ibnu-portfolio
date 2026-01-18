'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  X,
  Home,
  User,
  Briefcase,
  BookOpen,
  Mail,
  Terminal,
  Gamepad2,
  Wrench,
  Share2,
  Bookmark,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================
interface SpeedDialAction {
  id: string
  icon: React.ElementType
  label: string
  color?: string
  onClick: () => void
}

// ============================================
// SPEED DIAL COMPONENT
// ============================================
interface SpeedDialProps {
  className?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function SpeedDial({
  className,
  position = 'bottom-right',
  direction = 'up',
}: SpeedDialProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [soundEnabled, setSoundEnabled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const actions: SpeedDialAction[] = [
    {
      id: 'home',
      icon: Home,
      label: 'Home',
      color: 'bg-blue-500',
      onClick: () => router.push('/'),
    },
    {
      id: 'about',
      icon: User,
      label: 'About',
      color: 'bg-purple-500',
      onClick: () => router.push('/about'),
    },
    {
      id: 'projects',
      icon: Briefcase,
      label: 'Projects',
      color: 'bg-green-500',
      onClick: () => router.push('/projects'),
    },
    {
      id: 'tools',
      icon: Wrench,
      label: 'AI Tools',
      color: 'bg-amber-500',
      onClick: () => router.push('/tools'),
    },
    {
      id: 'terminal',
      icon: Terminal,
      label: 'Terminal',
      color: 'bg-emerald-500',
      onClick: () => router.push('/terminal'),
    },
    {
      id: 'theme',
      icon: theme === 'dark' ? Sun : Moon,
      label: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
      color: 'bg-indigo-500',
      onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share',
      color: 'bg-pink-500',
      onClick: () => {
        if (navigator.share) {
          navigator.share({
            title: document.title,
            url: window.location.href,
          })
        }
      },
    },
  ]

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  }

  const getActionStyle = (index: number) => {
    const spacing = 56
    const offset = (index + 1) * spacing

    switch (direction) {
      case 'up':
        return { bottom: offset }
      case 'down':
        return { top: offset }
      case 'left':
        return { right: offset }
      case 'right':
        return { left: offset }
    }
  }

  return (
    <div
      ref={menuRef}
      className={cn('fixed z-50', positionClasses[position], className)}
    >
      {/* Action buttons */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Actions */}
            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  type: 'spring',
                  damping: 20,
                  stiffness: 300,
                  delay: index * 0.03,
                }}
                style={{
                  position: 'absolute',
                  ...getActionStyle(index),
                }}
                className="flex items-center gap-3"
              >
                {/* Label */}
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: index * 0.03 + 0.1 }}
                  className="px-3 py-1.5 rounded-lg bg-card/90 backdrop-blur-sm border border-border/50 text-sm font-medium whitespace-nowrap shadow-lg"
                >
                  {action.label}
                </motion.span>

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    action.onClick()
                    setIsOpen(false)
                  }}
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg',
                    action.color
                  )}
                >
                  <action.icon className="h-5 w-5" />
                </motion.button>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-colors',
          isOpen
            ? 'bg-muted text-foreground'
            : 'bg-gradient-to-br from-primary to-purple-600 text-white'
        )}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
        </motion.div>
      </motion.button>
    </div>
  )
}

// ============================================
// CIRCULAR SPEED DIAL
// ============================================
export function CircularSpeedDial({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const actions: SpeedDialAction[] = [
    { id: 'home', icon: Home, label: 'Home', color: 'bg-blue-500', onClick: () => router.push('/') },
    { id: 'about', icon: User, label: 'About', color: 'bg-purple-500', onClick: () => router.push('/about') },
    { id: 'projects', icon: Briefcase, label: 'Projects', color: 'bg-green-500', onClick: () => router.push('/projects') },
    { id: 'blog', icon: BookOpen, label: 'Blog', color: 'bg-amber-500', onClick: () => router.push('/blog') },
    { id: 'contact', icon: Mail, label: 'Contact', color: 'bg-pink-500', onClick: () => router.push('/contact') },
  ]

  const radius = 80
  const angleStep = (Math.PI / 2) / (actions.length - 1) // Quarter circle

  return (
    <div className={cn('fixed bottom-6 right-6 z-50', className)}>
      <AnimatePresence>
        {isOpen && (
          <>
            {actions.map((action, index) => {
              const angle = Math.PI + index * angleStep // Start from left, go up
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius

              return (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{ opacity: 1, x, y, scale: 1 }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 300,
                    delay: index * 0.05,
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    action.onClick()
                    setIsOpen(false)
                  }}
                  className={cn(
                    'absolute w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg',
                    action.color
                  )}
                  style={{ bottom: 4, right: 4 }}
                  title={action.label}
                >
                  <action.icon className="h-5 w-5" />
                </motion.button>
              )
            })}
          </>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-colors z-10',
          isOpen
            ? 'bg-muted text-foreground'
            : 'bg-gradient-to-br from-primary to-purple-600 text-white'
        )}
      >
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <Plus className="h-6 w-6" />
        </motion.div>
      </motion.button>
    </div>
  )
}

// ============================================
// DOCK STYLE MENU
// ============================================
export function DockMenu({ className }: { className?: string }) {
  const router = useRouter()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const items = [
    { id: 'home', icon: Home, label: 'Home', href: '/' },
    { id: 'about', icon: User, label: 'About', href: '/about' },
    { id: 'projects', icon: Briefcase, label: 'Projects', href: '/projects' },
    { id: 'tools', icon: Wrench, label: 'Tools', href: '/tools' },
    { id: 'terminal', icon: Terminal, label: 'Terminal', href: '/terminal' },
    { id: 'games', icon: Gamepad2, label: 'Games', href: '/games' },
    { id: 'contact', icon: Mail, label: 'Contact', href: '/contact' },
  ]

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-3 py-2 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl',
        className
      )}
    >
      <div className="flex items-end gap-1">
        {items.map((item) => {
          const isHovered = hoveredId === item.id
          const neighborHovered = items.findIndex(i => i.id === hoveredId)
          const currentIndex = items.findIndex(i => i.id === item.id)
          const distance = Math.abs(neighborHovered - currentIndex)
          const scale = isHovered ? 1.4 : distance === 1 && hoveredId ? 1.2 : 1

          return (
            <motion.button
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => router.push(item.href)}
              animate={{ scale }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              className="relative p-2.5 rounded-xl hover:bg-muted/50 transition-colors origin-bottom"
              title={item.label}
            >
              <item.icon className="h-6 w-6 text-muted-foreground" />

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-foreground text-background text-xs font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  Star,
  Zap,
  Crown,
  Target,
  Compass,
  BookOpen,
  Code2,
  Gamepad2,
  Brain,
  Terminal,
  MessageSquare,
  Palette,
  Clock,
  Eye,
  MousePointerClick,
  Scroll,
  Award,
  Rocket,
  Heart,
  Coffee,
  Moon,
  Sun,
  Ghost,
  Sparkles,
  X,
  ChevronRight,
  Lock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ElementType
  color: string
  category: 'exploration' | 'interaction' | 'tools' | 'secret' | 'social'
  points: number
  unlockedAt?: Date
  progress?: number
  maxProgress?: number
}

const ACHIEVEMENTS: Achievement[] = [
  // Exploration achievements
  {
    id: 'first_visit',
    title: 'First Steps',
    description: 'Visited the portfolio for the first time',
    icon: Compass,
    color: 'from-cyan-500 to-blue-500',
    category: 'exploration',
    points: 10,
  },
  {
    id: 'tour_complete',
    title: 'Welcome Explorer',
    description: 'Completed the welcome tour',
    icon: Star,
    color: 'from-yellow-500 to-amber-500',
    category: 'exploration',
    points: 20,
  },
  {
    id: 'page_explorer',
    title: 'Page Explorer',
    description: 'Visited 5 different pages',
    icon: Compass,
    color: 'from-green-500 to-emerald-500',
    category: 'exploration',
    points: 25,
    maxProgress: 5,
  },
  {
    id: 'deep_diver',
    title: 'Deep Diver',
    description: 'Visited all main sections',
    icon: Target,
    color: 'from-purple-500 to-indigo-500',
    category: 'exploration',
    points: 50,
    maxProgress: 7,
  },
  {
    id: 'scroll_master',
    title: 'Scroll Master',
    description: 'Scrolled to the bottom of 3 pages',
    icon: Scroll,
    color: 'from-orange-500 to-red-500',
    category: 'exploration',
    points: 15,
    maxProgress: 3,
  },

  // Interaction achievements
  {
    id: 'command_user',
    title: 'Power User',
    description: 'Used the command palette (⌘K)',
    icon: Zap,
    color: 'from-violet-500 to-purple-500',
    category: 'interaction',
    points: 15,
  },
  {
    id: 'terminal_hacker',
    title: 'Terminal Hacker',
    description: 'Opened the terminal emulator',
    icon: Terminal,
    color: 'from-green-500 to-lime-500',
    category: 'interaction',
    points: 20,
  },
  {
    id: 'ai_chatter',
    title: 'AI Conversationalist',
    description: 'Had a conversation with the AI assistant',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
    category: 'interaction',
    points: 25,
  },
  {
    id: 'theme_switcher',
    title: 'Theme Switcher',
    description: 'Toggled between light and dark mode',
    icon: Moon,
    color: 'from-slate-500 to-zinc-500',
    category: 'interaction',
    points: 10,
  },
  {
    id: 'keyboard_ninja',
    title: 'Keyboard Ninja',
    description: 'Used 5 different keyboard shortcuts',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    category: 'interaction',
    points: 30,
    maxProgress: 5,
  },

  // Tools achievements
  {
    id: 'tool_explorer',
    title: 'Tool Explorer',
    description: 'Used your first tool',
    icon: Code2,
    color: 'from-cyan-500 to-teal-500',
    category: 'tools',
    points: 15,
  },
  {
    id: 'tool_master',
    title: 'Tool Master',
    description: 'Used 10 different tools',
    icon: Crown,
    color: 'from-yellow-500 to-orange-500',
    category: 'tools',
    points: 50,
    maxProgress: 10,
  },
  {
    id: 'ai_enthusiast',
    title: 'AI Enthusiast',
    description: 'Tried 3 different AI tools',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    category: 'tools',
    points: 35,
    maxProgress: 3,
  },
  {
    id: 'gamer',
    title: 'Casual Gamer',
    description: 'Played a game on the site',
    icon: Gamepad2,
    color: 'from-green-500 to-emerald-500',
    category: 'tools',
    points: 20,
  },
  {
    id: 'designer',
    title: 'Designer at Heart',
    description: 'Used a design tool',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
    category: 'tools',
    points: 20,
  },

  // Secret achievements
  {
    id: 'konami_master',
    title: 'Konami Master',
    description: '↑↑↓↓←→←→BA - You found it!',
    icon: Ghost,
    color: 'from-purple-600 to-indigo-600',
    category: 'secret',
    points: 100,
  },
  {
    id: 'matrix_dweller',
    title: 'Matrix Dweller',
    description: 'Entered the Matrix',
    icon: Code2,
    color: 'from-green-600 to-emerald-600',
    category: 'secret',
    points: 50,
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Visited between midnight and 4 AM',
    icon: Moon,
    color: 'from-indigo-600 to-violet-600',
    category: 'secret',
    points: 30,
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Visited between 5 AM and 7 AM',
    icon: Sun,
    color: 'from-orange-500 to-yellow-500',
    category: 'secret',
    points: 30,
  },
  {
    id: 'easter_hunter',
    title: 'Easter Egg Hunter',
    description: 'Found 3 hidden Easter eggs',
    icon: Sparkles,
    color: 'from-pink-500 to-purple-500',
    category: 'secret',
    points: 75,
    maxProgress: 3,
  },

  // Social achievements
  {
    id: 'reader',
    title: 'Avid Reader',
    description: 'Read a blog post',
    icon: BookOpen,
    color: 'from-blue-500 to-indigo-500',
    category: 'social',
    points: 15,
  },
  {
    id: 'project_viewer',
    title: 'Project Enthusiast',
    description: 'Viewed 3 projects in detail',
    icon: Eye,
    color: 'from-teal-500 to-cyan-500',
    category: 'social',
    points: 25,
    maxProgress: 3,
  },
  {
    id: 'cert_checker',
    title: 'Credential Inspector',
    description: 'Checked out the certifications',
    icon: Award,
    color: 'from-amber-500 to-yellow-500',
    category: 'social',
    points: 15,
  },
  {
    id: 'time_spent',
    title: 'Dedicated Visitor',
    description: 'Spent 5 minutes exploring',
    icon: Clock,
    color: 'from-rose-500 to-pink-500',
    category: 'social',
    points: 40,
  },
  {
    id: 'super_fan',
    title: 'Super Fan',
    description: 'Earned 500 total points',
    icon: Heart,
    color: 'from-red-500 to-rose-500',
    category: 'social',
    points: 100,
  },
]

const CATEGORY_INFO = {
  exploration: { label: 'Exploration', icon: Compass, color: 'text-cyan-400' },
  interaction: { label: 'Interaction', icon: MousePointerClick, color: 'text-purple-400' },
  tools: { label: 'Tools', icon: Code2, color: 'text-green-400' },
  secret: { label: 'Secret', icon: Ghost, color: 'text-amber-400' },
  social: { label: 'Social', icon: Heart, color: 'text-pink-400' },
}

export function AchievementSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [showNotification, setShowNotification] = useState(false)
  const [latestAchievement, setLatestAchievement] = useState<Achievement | null>(null)
  const [showPanel, setShowPanel] = useState(false)
  const [visitedPages, setVisitedPages] = useState<Set<string>>(new Set())
  const [scrolledPages, setScrolledPages] = useState<Set<string>>(new Set())
  const [startTime] = useState(Date.now())
  const pathname = usePathname()

  // Load achievements from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('achievements')
    if (stored) {
      const parsed = JSON.parse(stored)
      setAchievements(parsed.map((a: any) => ({
        ...ACHIEVEMENTS.find((base) => base.id === a.id),
        ...a,
        unlockedAt: a.unlockedAt ? new Date(a.unlockedAt) : undefined,
      })))
    }

    // Load visited pages
    const storedPages = localStorage.getItem('visitedPages')
    if (storedPages) {
      setVisitedPages(new Set(JSON.parse(storedPages)))
    }

    // Load scrolled pages
    const storedScrolled = localStorage.getItem('scrolledPages')
    if (storedScrolled) {
      setScrolledPages(new Set(JSON.parse(storedScrolled)))
    }

    // First visit achievement
    const firstVisit = localStorage.getItem('firstVisit')
    if (!firstVisit) {
      localStorage.setItem('firstVisit', 'true')
      unlockAchievement('first_visit')
    }

    // Time-based achievements
    const hour = new Date().getHours()
    if (hour >= 0 && hour < 4) {
      unlockAchievement('night_owl')
    } else if (hour >= 5 && hour < 7) {
      unlockAchievement('early_bird')
    }
  }, [])

  // Track page visits
  useEffect(() => {
    if (pathname) {
      const newVisited = new Set(visitedPages)
      newVisited.add(pathname)
      setVisitedPages(newVisited)
      localStorage.setItem('visitedPages', JSON.stringify([...newVisited]))

      // Check exploration achievements
      if (newVisited.size >= 5) {
        updateProgress('page_explorer', newVisited.size)
      }

      // Main sections check
      const mainSections = ['/', '/about', '/projects', '/blog', '/certifications', '/interests', '/contact']
      const visitedMain = mainSections.filter((s) => newVisited.has(s))
      if (visitedMain.length > 0) {
        updateProgress('deep_diver', visitedMain.length)
      }

      // Specific page achievements
      if (pathname.startsWith('/blog/') && pathname !== '/blog') {
        unlockAchievement('reader')
      }
      if (pathname === '/certifications') {
        unlockAchievement('cert_checker')
      }
      if (pathname.startsWith('/projects/') && pathname !== '/projects') {
        updateProgress('project_viewer', 1, true)
      }
      if (pathname.startsWith('/tools/')) {
        unlockAchievement('tool_explorer')
        updateProgress('tool_master', 1, true)

        // Check for specific tool types
        const gameTools = ['snake', 'tetris', '2048', 'sudoku', 'minesweeper', 'memory', 'tic-tac-toe']
        const aiTools = ['llm', 'rag', 'agent', 'background-removal', 'object-detection', 'face-landmark']
        const designTools = ['color-picker', 'gradient-generator', 'palette-generator', 'drawing-canvas']

        if (gameTools.some((g) => pathname.includes(g))) {
          unlockAchievement('gamer')
        }
        if (designTools.some((d) => pathname.includes(d))) {
          unlockAchievement('designer')
        }
      }
      if (pathname.startsWith('/ai-tools/')) {
        unlockAchievement('ai_enthusiast')
        updateProgress('ai_enthusiast', 1, true)
      }
    }
  }, [pathname, visitedPages])

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000 / 60 // minutes
      if (elapsed >= 5) {
        unlockAchievement('time_spent')
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [startTime])

  // Track scroll to bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const clientHeight = window.innerHeight

      if ((scrollTop + clientHeight) / scrollHeight > 0.95) {
        if (!scrolledPages.has(pathname)) {
          const newScrolled = new Set(scrolledPages)
          newScrolled.add(pathname)
          setScrolledPages(newScrolled)
          localStorage.setItem('scrolledPages', JSON.stringify([...newScrolled]))
          updateProgress('scroll_master', newScrolled.size)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname, scrolledPages])

  // Listen for custom achievement events
  useEffect(() => {
    const handleAchievement = (event: CustomEvent) => {
      const { id } = event.detail
      unlockAchievement(id)
    }

    const handleKeyboardShortcut = () => {
      updateProgress('keyboard_ninja', 1, true)
    }

    const handleCommandPalette = () => {
      unlockAchievement('command_user')
    }

    const handleTerminal = () => {
      unlockAchievement('terminal_hacker')
    }

    const handleThemeChange = () => {
      unlockAchievement('theme_switcher')
    }

    const handleChatbot = () => {
      unlockAchievement('ai_chatter')
    }

    const handleEasterEgg = () => {
      updateProgress('easter_hunter', 1, true)
    }

    const handleKonami = () => {
      unlockAchievement('konami_master')
    }

    const handleMatrix = () => {
      unlockAchievement('matrix_dweller')
    }

    window.addEventListener('achievementUnlocked', handleAchievement as EventListener)
    window.addEventListener('keyboardShortcutUsed', handleKeyboardShortcut)
    window.addEventListener('commandPaletteOpened', handleCommandPalette)
    window.addEventListener('terminalOpened', handleTerminal)
    window.addEventListener('themeChanged', handleThemeChange)
    window.addEventListener('chatbotOpened', handleChatbot)
    window.addEventListener('easterEggFound', handleEasterEgg)
    window.addEventListener('konamiCodeEntered', handleKonami)
    window.addEventListener('matrixModeActivated', handleMatrix)

    return () => {
      window.removeEventListener('achievementUnlocked', handleAchievement as EventListener)
      window.removeEventListener('keyboardShortcutUsed', handleKeyboardShortcut)
      window.removeEventListener('commandPaletteOpened', handleCommandPalette)
      window.removeEventListener('terminalOpened', handleTerminal)
      window.removeEventListener('themeChanged', handleThemeChange)
      window.removeEventListener('chatbotOpened', handleChatbot)
      window.removeEventListener('easterEggFound', handleEasterEgg)
      window.removeEventListener('konamiCodeEntered', handleKonami)
      window.removeEventListener('matrixModeActivated', handleMatrix)
    }
  }, [])

  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) => {
      const existing = prev.find((a) => a.id === id)
      if (existing?.unlockedAt) return prev // Already unlocked

      const achievement = ACHIEVEMENTS.find((a) => a.id === id)
      if (!achievement) return prev

      const updated = {
        ...achievement,
        unlockedAt: new Date(),
        progress: achievement.maxProgress ? achievement.maxProgress : undefined,
      }

      const newAchievements = existing
        ? prev.map((a) => (a.id === id ? updated : a))
        : [...prev, updated]

      // Save to localStorage
      localStorage.setItem('achievements', JSON.stringify(newAchievements))

      // Show notification
      setLatestAchievement(updated)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 4000)

      // Check for super fan achievement
      const totalPoints = newAchievements
        .filter((a) => a.unlockedAt)
        .reduce((sum, a) => sum + a.points, 0)
      if (totalPoints >= 500) {
        setTimeout(() => unlockAchievement('super_fan'), 500)
      }

      return newAchievements
    })
  }, [])

  const updateProgress = useCallback((id: string, value: number, increment = false) => {
    setAchievements((prev) => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === id)
      if (!achievement?.maxProgress) return prev

      const existing = prev.find((a) => a.id === id)
      if (existing?.unlockedAt) return prev // Already unlocked

      const currentProgress = existing?.progress || 0
      const newProgress = increment ? currentProgress + value : value

      if (newProgress >= achievement.maxProgress) {
        // Unlock the achievement
        setTimeout(() => unlockAchievement(id), 100)
        return prev
      }

      const updated = {
        ...achievement,
        progress: newProgress,
      }

      const newAchievements = existing
        ? prev.map((a) => (a.id === id ? updated : a))
        : [...prev, updated]

      localStorage.setItem('achievements', JSON.stringify(newAchievements))
      return newAchievements
    })
  }, [unlockAchievement])

  const totalPoints = achievements
    .filter((a) => a.unlockedAt)
    .reduce((sum, a) => sum + a.points, 0)

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length

  return (
    <>
      {/* Achievement button */}
      <button
        onClick={() => setShowPanel(true)}
        className="fixed bottom-4 left-4 z-40 flex items-center gap-2 px-3 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 shadow-lg hover:shadow-xl transition-all group"
      >
        <Trophy className="h-5 w-5 text-amber-400" />
        <span className="text-sm font-medium">{totalPoints}</span>
        <span className="text-xs text-muted-foreground hidden sm:inline">pts</span>
        {unlockedCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {unlockedCount}
          </span>
        )}
      </button>

      {/* Achievement notification */}
      <AnimatePresence>
        {showNotification && latestAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-4 left-1/2 z-50"
          >
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl">
              <div className={cn(
                'p-2 rounded-xl bg-gradient-to-br',
                latestAchievement.color
              )}>
                <latestAchievement.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Achievement Unlocked!</p>
                <p className="font-semibold text-foreground">{latestAchievement.title}</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold">
                +{latestAchievement.points}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement panel */}
      <AnimatePresence>
        {showPanel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPanel(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-full max-w-md z-50 overflow-hidden"
            >
              <div className="h-full bg-card/95 backdrop-blur-xl border-r border-border/50 shadow-2xl overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-card/95 backdrop-blur-xl border-b border-border/50 p-4 z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">Achievements</h2>
                        <p className="text-sm text-muted-foreground">
                          {unlockedCount} / {ACHIEVEMENTS.length} unlocked
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPanel(false)}
                      className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Total points */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                    <span className="text-sm font-medium">Total Points</span>
                    <span className="text-2xl font-bold text-amber-400">{totalPoints}</span>
                  </div>
                </div>

                {/* Categories */}
                <div className="p-4 space-y-6">
                  {Object.entries(CATEGORY_INFO).map(([category, info]) => {
                    const categoryAchievements = ACHIEVEMENTS.filter((a) => a.category === category)
                    const unlocked = categoryAchievements.filter((a) =>
                      achievements.find((ua) => ua.id === a.id && ua.unlockedAt)
                    )

                    return (
                      <div key={category}>
                        <div className="flex items-center gap-2 mb-3">
                          <info.icon className={cn('h-4 w-4', info.color)} />
                          <span className="font-medium">{info.label}</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {unlocked.length} / {categoryAchievements.length}
                          </span>
                        </div>

                        <div className="grid gap-2">
                          {categoryAchievements.map((achievement) => {
                            const userAchievement = achievements.find((a) => a.id === achievement.id)
                            const isUnlocked = userAchievement?.unlockedAt
                            const progress = userAchievement?.progress || 0

                            return (
                              <div
                                key={achievement.id}
                                className={cn(
                                  'flex items-center gap-3 p-3 rounded-xl border transition-all',
                                  isUnlocked
                                    ? 'bg-gradient-to-r from-card to-muted/50 border-primary/30'
                                    : 'bg-muted/30 border-border/50 opacity-60'
                                )}
                              >
                                <div className={cn(
                                  'p-2 rounded-lg',
                                  isUnlocked
                                    ? `bg-gradient-to-br ${achievement.color}`
                                    : 'bg-muted'
                                )}>
                                  {isUnlocked ? (
                                    <achievement.icon className="h-4 w-4 text-white" />
                                  ) : (
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className={cn(
                                    'font-medium text-sm truncate',
                                    !isUnlocked && 'text-muted-foreground'
                                  )}>
                                    {achievement.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {achievement.description}
                                  </p>
                                  {achievement.maxProgress && !isUnlocked && (
                                    <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
                                      <div
                                        className={cn('h-full bg-gradient-to-r', achievement.color)}
                                        style={{ width: `${(progress / achievement.maxProgress) * 100}%` }}
                                      />
                                    </div>
                                  )}
                                </div>

                                <div className={cn(
                                  'text-sm font-bold',
                                  isUnlocked ? 'text-amber-400' : 'text-muted-foreground'
                                )}>
                                  +{achievement.points}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

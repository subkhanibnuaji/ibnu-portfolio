'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  X,
  Eye,
  Clock,
  MousePointerClick,
  Globe,
  Cpu,
  Code2,
  Gamepad2,
  Brain,
  Trophy,
  TrendingUp,
  Users,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Stat {
  label: string
  value: string | number
  icon: React.ElementType
  color: string
  description?: string
}

export function SiteStatsWidget() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [pageViews, setPageViews] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [scrollDistance, setScrollDistance] = useState(0)
  const [achievementPoints, setAchievementPoints] = useState(0)

  // Track session time
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Track page views
  useEffect(() => {
    const stored = sessionStorage.getItem('pageViews')
    const current = stored ? parseInt(stored) + 1 : 1
    sessionStorage.setItem('pageViews', current.toString())
    setPageViews(current)
  }, [])

  // Track clicks
  useEffect(() => {
    const handleClick = () => {
      setClickCount((prev) => {
        const newCount = prev + 1
        sessionStorage.setItem('clickCount', newCount.toString())
        return newCount
      })
    }

    // Load stored count
    const stored = sessionStorage.getItem('clickCount')
    if (stored) setClickCount(parseInt(stored))

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  // Track scroll distance
  useEffect(() => {
    let totalScroll = 0
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY)
      totalScroll += delta
      lastScrollY = window.scrollY
      setScrollDistance(Math.round(totalScroll / 1000)) // Convert to "screens"
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track achievement points
  useEffect(() => {
    const checkPoints = () => {
      const stored = localStorage.getItem('achievements')
      if (stored) {
        const achievements = JSON.parse(stored)
        const total = achievements
          .filter((a: any) => a.unlockedAt)
          .reduce((sum: number, a: any) => sum + (a.points || 0), 0)
        setAchievementPoints(total)
      }
    }

    checkPoints()
    window.addEventListener('storage', checkPoints)
    return () => window.removeEventListener('storage', checkPoints)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins + ':' + secs.toString().padStart(2, '0')
  }

  // Listen for open event from Quick Actions FAB
  useEffect(() => {
    const handleOpen = () => setIsExpanded(true)
    window.addEventListener('openSiteStats', handleOpen)
    return () => window.removeEventListener('openSiteStats', handleOpen)
  }, [])

  const stats: Stat[] = [
    {
      label: 'Session Time',
      value: formatTime(sessionTime),
      icon: Clock,
      color: 'text-cyan-400',
      description: 'Time spent exploring',
    },
    {
      label: 'Pages Visited',
      value: pageViews,
      icon: Eye,
      color: 'text-purple-400',
      description: 'Different pages viewed',
    },
    {
      label: 'Interactions',
      value: clickCount,
      icon: MousePointerClick,
      color: 'text-pink-400',
      description: 'Clicks made',
    },
    {
      label: 'Scroll Distance',
      value: scrollDistance + 'x',
      icon: TrendingUp,
      color: 'text-green-400',
      description: 'Screen heights scrolled',
    },
    {
      label: 'Achievement Points',
      value: achievementPoints,
      icon: Trophy,
      color: 'text-amber-400',
      description: 'Points earned',
    },
  ]

  const siteStats: Stat[] = [
    {
      label: 'Total Tools',
      value: '70+',
      icon: Code2,
      color: 'text-cyan-400',
    },
    {
      label: 'AI Features',
      value: '17+',
      icon: Brain,
      color: 'text-purple-400',
    },
    {
      label: 'Games',
      value: '10+',
      icon: Gamepad2,
      color: 'text-green-400',
    },
    {
      label: 'Certifications',
      value: '50+',
      icon: Trophy,
      color: 'text-amber-400',
    },
  ]

  return (
    <>
      {/* Stats Panel - triggered via Quick Actions FAB */}
      <AnimatePresence>
        {isExpanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-50"
            >
              <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-cyan-500/20">
                        <BarChart3 className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <h2 className="font-bold">Site Statistics</h2>
                        <p className="text-xs text-muted-foreground">Your session & site info</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  {/* Your Session */}
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Your Session
                    </h3>
                    <div className="space-y-2">
                      {stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <stat.icon className={cn('h-4 w-4', stat.color)} />
                            <span className="text-xs text-muted-foreground">{stat.label}</span>
                          </div>
                          <span className={cn('text-sm font-bold', stat.color)}>{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border/50 my-4" />

                  {/* Site Capabilities */}
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Site Capabilities
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {siteStats.map((stat) => (
                        <div
                          key={stat.label}
                          className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-muted/30 to-muted/50 border border-border/30"
                        >
                          <stat.icon className={cn('h-5 w-5 mb-1', stat.color)} />
                          <span className={cn('text-lg font-bold', stat.color)}>{stat.value}</span>
                          <span className="text-[10px] text-muted-foreground text-center">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fun fact */}
                  <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-3 w-3 text-amber-400" />
                      <span className="text-[10px] font-semibold text-amber-400">FUN FACT</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {clickCount > 50
                        ? "You're a click master! Over 50 interactions!"
                        : scrollDistance > 10
                        ? "You've scrolled equivalent to a small building!"
                        : sessionTime > 300
                        ? "You've been here for over 5 minutes. Thank you!"
                        : pageViews > 5
                        ? "Explorer mode! You've visited multiple pages!"
                        : "Keep exploring to discover hidden features!"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

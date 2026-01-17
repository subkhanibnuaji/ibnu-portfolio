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
    <div className="fixed top-20 right-4 z-30">
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 shadow-lg hover:shadow-xl transition-all',
          isExpanded && 'rounded-b-none border-b-0'
        )}
      >
        <BarChart3 className="h-4 w-4 text-cyan-400" />
        <span className="text-sm font-medium">{formatTime(sessionTime)}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Expanded panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="overflow-hidden"
          >
            <div className="w-64 bg-card/95 backdrop-blur-xl border border-border/50 border-t-0 rounded-b-2xl rounded-tl-2xl shadow-2xl p-4">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

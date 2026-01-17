'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Eye,
  Globe2,
  Sparkles,
  TrendingUp,
  Clock,
  MapPin,
  MousePointerClick,
  X,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface VisitorAction {
  id: string
  action: string
  page: string
  time: Date
  country?: string
  flag?: string
}

// Simulated visitor actions for demo
const COUNTRIES = [
  { name: 'Indonesia', flag: '🇮🇩' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'Canada', flag: '🇨🇦' },
]

const ACTIONS = [
  'is viewing',
  'just visited',
  'is exploring',
  'discovered',
]

const PAGES = [
  'Homepage',
  'Projects',
  'AI Tools',
  'Blog',
  'About',
  'Snake Game',
  'LLM Chat',
  'Certifications',
  'Contact',
  'Calculator',
]

export function VisitorActivity() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentAction, setCurrentAction] = useState<VisitorAction | null>(null)
  const [recentActions, setRecentActions] = useState<VisitorAction[]>([])
  const [liveVisitors, setLiveVisitors] = useState(0)
  const [totalViews, setTotalViews] = useState(0)
  const [showNotification, setShowNotification] = useState(false)

  // Generate random visitor action
  const generateAction = useCallback((): VisitorAction => {
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
    const page = PAGES[Math.floor(Math.random() * PAGES.length)]

    return {
      id: Math.random().toString(36).substr(2, 9),
      action,
      page,
      time: new Date(),
      country: country.name,
      flag: country.flag,
    }
  }, [])

  // Initialize
  useEffect(() => {
    // Set initial values
    setLiveVisitors(Math.floor(Math.random() * 5) + 2)
    setTotalViews(Math.floor(Math.random() * 1000) + 5000)

    // Generate initial actions
    const initialActions: VisitorAction[] = []
    for (let i = 0; i < 5; i++) {
      const action = generateAction()
      action.time = new Date(Date.now() - Math.random() * 300000) // Last 5 minutes
      initialActions.push(action)
    }
    setRecentActions(initialActions.sort((a, b) => b.time.getTime() - a.time.getTime()))
  }, [generateAction])

  // Periodically update visitor count and add new actions
  useEffect(() => {
    const visitorInterval = setInterval(() => {
      // Fluctuate live visitors
      setLiveVisitors(prev => {
        const change = Math.random() > 0.5 ? 1 : -1
        return Math.max(1, Math.min(15, prev + change))
      })
    }, 10000)

    const actionInterval = setInterval(() => {
      // Add new action
      const newAction = generateAction()
      setCurrentAction(newAction)
      setShowNotification(true)

      setRecentActions(prev => [newAction, ...prev.slice(0, 9)])
      setTotalViews(prev => prev + 1)

      // Hide notification after 4 seconds
      setTimeout(() => setShowNotification(false), 4000)
    }, 15000 + Math.random() * 10000) // Random interval 15-25 seconds

    return () => {
      clearInterval(visitorInterval)
      clearInterval(actionInterval)
    }
  }, [generateAction])

  const formatTime = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return 'Just now'
    if (seconds < 120) return '1 min ago'
    if (seconds < 3600) return Math.floor(seconds / 60) + ' mins ago'
    return Math.floor(seconds / 3600) + ' hrs ago'
  }

  return (
    <>
      {/* Floating notification */}
      <AnimatePresence>
        {showNotification && currentAction && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: 20 }}
            className="fixed bottom-20 left-4 z-40 max-w-xs"
          >
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-lg">
              <div className="text-2xl">{currentAction.flag}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Someone from {currentAction.country}</span>{' '}
                  <span className="text-muted-foreground">{currentAction.action}</span>
                </p>
                <p className="text-xs text-primary font-medium truncate">{currentAction.page}</p>
              </div>
              <div className="flex items-center gap-1 text-green-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main widget */}
      <div className="fixed bottom-4 left-44 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 shadow-lg hover:shadow-xl transition-all',
            isExpanded && 'rounded-b-none border-b-0'
          )}
        >
          <div className="relative">
            <Users className="h-4 w-4 text-green-400" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
          <span className="text-sm font-medium">{liveVisitors} live</span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {/* Expanded panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              className="absolute bottom-full left-0 mb-0 overflow-hidden"
            >
              <div className="w-72 bg-card/95 backdrop-blur-xl border border-border/50 border-b-0 rounded-t-2xl shadow-2xl">
                {/* Stats */}
                <div className="p-4 border-b border-border/50">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                      <Users className="h-4 w-4 text-green-400" />
                      <div>
                        <p className="text-lg font-bold text-green-400">{liveVisitors}</p>
                        <p className="text-[10px] text-muted-foreground">Live now</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <Eye className="h-4 w-4 text-cyan-400" />
                      <div>
                        <p className="text-lg font-bold text-cyan-400">{totalViews.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">Total views</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent activity */}
                <div className="p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    Live Activity
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {recentActions.map((action, i) => (
                      <motion.div
                        key={action.id}
                        initial={i === 0 ? { opacity: 0, x: -20 } : false}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <span className="text-lg">{action.flag}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs truncate">
                            <span className="text-muted-foreground">{action.action}</span>{' '}
                            <span className="font-medium text-foreground">{action.page}</span>
                          </p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            {formatTime(action.time)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-border/50 bg-muted/30">
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Globe2 className="h-3 w-3" />
                    <span>Visitors from {COUNTRIES.length}+ countries</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

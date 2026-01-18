'use client'

import { useEffect, useState, useCallback, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  Info,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  Gift,
  Trophy,
  MessageSquare,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================
type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'update' | 'message'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: number
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
  persistent?: boolean
}

interface NotificationContextValue {
  notifications: Notification[]
  unreadCount: number
  add: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  remove: (id: string) => void
  clearAll: () => void
}

// ============================================
// CONTEXT
// ============================================
const NotificationContext = createContext<NotificationContextValue | null>(null)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

// ============================================
// PROVIDER
// ============================================
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('notifications')
    if (stored) {
      setNotifications(JSON.parse(stored))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  const add = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      read: false,
    }
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)) // Keep max 50
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const remove = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications(prev => prev.filter(n => n.persistent))
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  // Listen for notification events
  useEffect(() => {
    const handleNotification = (e: CustomEvent) => {
      add(e.detail)
    }
    window.addEventListener('notification' as any, handleNotification)
    return () => window.removeEventListener('notification' as any, handleNotification)
  }, [add])

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, add, markAsRead, markAllAsRead, remove, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

// ============================================
// NOTIFICATION CENTER UI
// ============================================
export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    remove,
    clearAll,
  } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-400" />
      case 'success':
        return <Check className="h-4 w-4 text-green-400" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      case 'achievement':
        return <Trophy className="h-4 w-4 text-yellow-400" />
      case 'update':
        return <Sparkles className="h-4 w-4 text-purple-400" />
      case 'message':
        return <MessageSquare className="h-4 w-4 text-cyan-400" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-16 z-50 p-2.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 shadow-lg hover:shadow-xl transition-all group"
        title="Notifications"
        aria-label="Open notifications"
      >
        <Bell className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground rounded-full"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />

            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-96 max-w-full z-[101] bg-card/95 backdrop-blur-xl border-l border-border/50 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/20">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-bold">Notifications</h2>
                      <p className="text-xs text-muted-foreground">
                        {unreadCount} unread
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      filter === 'all'
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      filter === 'unread'
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Unread
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="ml-auto px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">No notifications</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {filter === 'unread' ? 'All caught up!' : 'Check back later'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/30">
                    {filteredNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={cn(
                          'p-4 hover:bg-muted/30 transition-colors relative group',
                          !notification.read && 'bg-primary/5'
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="p-2 rounded-lg bg-muted/50">
                              {getIcon(notification.type)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={cn(
                                'font-medium text-sm',
                                !notification.read && 'text-foreground'
                              )}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">
                                {formatTime(notification.timestamp)}
                              </span>
                              {notification.action && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    notification.action?.onClick()
                                    markAsRead(notification.id)
                                  }}
                                  className="text-xs font-medium text-primary hover:underline"
                                >
                                  {notification.action.label}
                                </button>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              remove(notification.id)
                            }}
                            className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                            aria-label="Remove notification"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-4 border-t border-border/50">
                  <button
                    onClick={clearAll}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-border/50 hover:border-destructive/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// Helper to trigger notifications
export const notify = {
  info: (title: string, message: string) => {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { type: 'info', title, message }
    }))
  },
  success: (title: string, message: string) => {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { type: 'success', title, message }
    }))
  },
  warning: (title: string, message: string) => {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { type: 'warning', title, message }
    }))
  },
  error: (title: string, message: string) => {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { type: 'error', title, message }
    }))
  },
  achievement: (title: string, message: string) => {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { type: 'achievement', title, message }
    }))
  },
  update: (title: string, message: string) => {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { type: 'update', title, message }
    }))
  },
  message: (title: string, message: string) => {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { type: 'message', title, message }
    }))
  },
}

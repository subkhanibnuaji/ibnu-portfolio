'use client'

/**
 * Notification Center
 * Super Apps feature for managing in-app notifications
 */

import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  X,
  Check,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Settings,
} from 'lucide-react'

// =============================================================================
// TYPES
// =============================================================================

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
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
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

// =============================================================================
// CONTEXT
// =============================================================================

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

// =============================================================================
// PROVIDER
// =============================================================================

interface NotificationProviderProps {
  children: React.ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('notifications')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setNotifications(
          parsed.map((n: Notification) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }))
        )
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        timestamp: new Date(),
        read: false,
      }

      setNotifications((prev) => [newNotification, ...prev].slice(0, 50)) // Keep max 50

      // Auto-remove non-persistent notifications after 30 seconds
      if (!notification.persistent) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id))
        }, 30000)
      }
    },
    []
  )

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

// =============================================================================
// BELL BUTTON
// =============================================================================

interface NotificationBellProps {
  onClick: () => void
}

export function NotificationBell({ onClick }: NotificationBellProps) {
  const { unreadCount } = useNotifications()

  return (
    <button
      onClick={onClick}
      className="relative p-2 hover:bg-muted rounded-lg transition-colors"
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  )
}

// =============================================================================
// NOTIFICATION PANEL
// =============================================================================

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll, unreadCount } =
    useNotifications()

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="fixed top-16 right-4 z-50 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <span className="font-semibold">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                    title="Mark all as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                    title="Clear all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No notifications yet</p>
                  <p className="text-sm mt-1">We&apos;ll notify you when something happens</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`
                        p-4 hover:bg-muted/50 transition-colors cursor-pointer
                        ${!notification.read ? 'bg-primary/5' : ''}
                      `}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        {getIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                removeNotification(notification.id)
                              }}
                              className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
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
                                }}
                                className="text-xs text-primary hover:underline"
                              >
                                {notification.action.label}
                              </button>
                            )}
                          </div>
                          {!notification.read && (
                            <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2 border-t border-border bg-muted/30">
                <button className="w-full text-sm text-center text-muted-foreground hover:text-foreground transition-colors">
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// =============================================================================
// TOAST NOTIFICATIONS
// =============================================================================

export function NotificationToast() {
  const { notifications, markAsRead, removeNotification } = useNotifications()

  // Show only the latest unread notification as a toast
  const latestUnread = notifications.find((n) => !n.read && !n.persistent)

  if (!latestUnread) return null

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      className="fixed bottom-4 right-4 z-50 max-w-sm bg-card border border-border rounded-lg shadow-lg p-4"
    >
      <div className="flex gap-3">
        {getIcon(latestUnread.type)}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{latestUnread.title}</h4>
          <p className="text-sm text-muted-foreground mt-0.5">{latestUnread.message}</p>
        </div>
        <button
          onClick={() => {
            markAsRead(latestUnread.id)
            removeNotification(latestUnread.id)
          }}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}

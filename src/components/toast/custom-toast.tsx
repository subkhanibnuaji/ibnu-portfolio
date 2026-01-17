'use client'

import { useEffect, useState, useCallback, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  X,
  Loader2,
  Bell,
  Sparkles,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'achievement'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  updateToast: (id: string, updates: Partial<Toast>) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

// Convenience functions
export function toast(options: Omit<Toast, 'id'>) {
  window.dispatchEvent(new CustomEvent('toast', { detail: options }))
}

toast.success = (title: string, message?: string) => toast({ type: 'success', title, message })
toast.error = (title: string, message?: string) => toast({ type: 'error', title, message })
toast.warning = (title: string, message?: string) => toast({ type: 'warning', title, message })
toast.info = (title: string, message?: string) => toast({ type: 'info', title, message })
toast.loading = (title: string, message?: string) => toast({ type: 'loading', title, message, duration: 0 })
toast.achievement = (title: string, message?: string) => toast({ type: 'achievement', title, message })

const TOAST_ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
  loading: Loader2,
  achievement: Sparkles,
}

const TOAST_STYLES = {
  success: {
    bg: 'bg-green-500/10 border-green-500/30',
    icon: 'text-green-400',
    bar: 'bg-green-500',
  },
  error: {
    bg: 'bg-red-500/10 border-red-500/30',
    icon: 'text-red-400',
    bar: 'bg-red-500',
  },
  warning: {
    bg: 'bg-amber-500/10 border-amber-500/30',
    icon: 'text-amber-400',
    bar: 'bg-amber-500',
  },
  info: {
    bg: 'bg-blue-500/10 border-blue-500/30',
    icon: 'text-blue-400',
    bar: 'bg-blue-500',
  },
  loading: {
    bg: 'bg-purple-500/10 border-purple-500/30',
    icon: 'text-purple-400',
    bar: 'bg-purple-500',
  },
  achievement: {
    bg: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30',
    icon: 'text-amber-400',
    bar: 'bg-gradient-to-r from-amber-500 to-orange-500',
  },
}

interface ToastItemProps {
  toast: Toast
  onRemove: () => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [progress, setProgress] = useState(100)
  const Icon = TOAST_ICONS[toast.type]
  const styles = TOAST_STYLES[toast.type]
  const duration = toast.duration ?? 5000

  useEffect(() => {
    if (duration === 0) return // No auto-dismiss for loading toasts

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)

      if (remaining === 0) {
        clearInterval(interval)
        onRemove()
      }
    }, 50)

    return () => clearInterval(interval)
  }, [duration, onRemove])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={cn(
        'relative w-full max-w-sm overflow-hidden rounded-xl border backdrop-blur-xl shadow-lg',
        styles.bg
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <div className={cn('mt-0.5', styles.icon)}>
          <Icon className={cn('h-5 w-5', toast.type === 'loading' && 'animate-spin')} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground">{toast.title}</p>
          {toast.message && (
            <p className="text-sm text-muted-foreground mt-0.5">{toast.message}</p>
          )}
          {toast.action && (
            <button
              onClick={() => {
                toast.action?.onClick()
                onRemove()
              }}
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        <button
          onClick={onRemove}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="h-1 bg-muted/30">
          <motion.div
            className={cn('h-full', styles.bar)}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.05 }}
          />
        </div>
      )}

      {/* Achievement sparkle effect */}
      {toast.type === 'achievement' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 right-8 w-1 h-1 bg-amber-400 rounded-full animate-ping" />
          <div className="absolute bottom-4 left-12 w-1 h-1 bg-orange-400 rounded-full animate-ping animation-delay-300" />
        </div>
      )}
    </motion.div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const updateToast = useCallback((id: string, updates: Partial<Toast>) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }, [])

  // Listen for toast events
  useEffect(() => {
    const handleToast = (e: CustomEvent) => {
      addToast(e.detail)
    }

    window.addEventListener('toast', handleToast as EventListener)
    return () => window.removeEventListener('toast', handleToast as EventListener)
  }, [addToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, updateToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <div key={toast.id} className="pointer-events-auto">
              <ToastItem toast={toast} onRemove={() => removeToast(toast.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

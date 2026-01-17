'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, RefreshCw, Cloud, CloudOff } from 'lucide-react'
import { cn } from '@/lib/utils'

type ConnectionStatus = 'online' | 'offline' | 'slow'

export function NetworkStatus() {
  const [status, setStatus] = useState<ConnectionStatus>('online')
  const [showBanner, setShowBanner] = useState(false)
  const [connectionType, setConnectionType] = useState<string>('')
  const [downlink, setDownlink] = useState<number | null>(null)

  useEffect(() => {
    // Check initial status
    setStatus(navigator.onLine ? 'online' : 'offline')

    // Get connection info if available
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    if (connection) {
      setConnectionType(connection.effectiveType || '')
      setDownlink(connection.downlink || null)

      // Check for slow connection
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        setStatus('slow')
      }

      connection.addEventListener('change', () => {
        setConnectionType(connection.effectiveType || '')
        setDownlink(connection.downlink || null)
        if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
          setStatus('slow')
          setShowBanner(true)
        }
      })
    }

    // Handle online/offline events
    const handleOnline = () => {
      setStatus('online')
      setShowBanner(true)
      setTimeout(() => setShowBanner(false), 3000)
    }

    const handleOffline = () => {
      setStatus('offline')
      setShowBanner(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Show banner on initial offline state
    if (!navigator.onLine) {
      setShowBanner(true)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const getStatusConfig = () => {
    switch (status) {
      case 'offline':
        return {
          icon: WifiOff,
          text: 'You are offline',
          subtext: 'Some features may not work',
          color: 'bg-red-500',
          textColor: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
        }
      case 'slow':
        return {
          icon: Wifi,
          text: 'Slow connection detected',
          subtext: `${connectionType.toUpperCase()} - ${downlink ? downlink + ' Mbps' : 'Limited bandwidth'}`,
          color: 'bg-amber-500',
          textColor: 'text-amber-400',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
        }
      default:
        return {
          icon: Wifi,
          text: 'Back online',
          subtext: connectionType ? `${connectionType.toUpperCase()} connection` : 'Connection restored',
          color: 'bg-green-500',
          textColor: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
        }
    }
  }

  const config = getStatusConfig()

  return (
    <>
      {/* Small indicator in corner */}
      {status !== 'online' && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30">
          <div className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-sm',
            config.bgColor,
            config.borderColor
          )}>
            <div className="relative">
              <config.icon className={cn('h-4 w-4', config.textColor)} />
              {status === 'offline' && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
            <span className={cn('text-xs font-medium', config.textColor)}>
              {status === 'offline' ? 'Offline' : 'Slow'}
            </span>
          </div>
        </div>
      )}

      {/* Banner notification */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
          >
            <div className={cn(
              'flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-xl shadow-lg',
              config.bgColor,
              config.borderColor
            )}>
              <div className={cn(
                'p-2 rounded-xl',
                status === 'online' ? 'bg-green-500/20' : status === 'offline' ? 'bg-red-500/20' : 'bg-amber-500/20'
              )}>
                <config.icon className={cn('h-6 w-6', config.textColor)} />
              </div>

              <div className="flex-1">
                <p className={cn('font-semibold', config.textColor)}>{config.text}</p>
                <p className="text-xs text-muted-foreground">{config.subtext}</p>
              </div>

              {status === 'offline' && (
                <button
                  onClick={() => window.location.reload()}
                  className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                  title="Retry connection"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              )}

              {status === 'online' && (
                <button
                  onClick={() => setShowBanner(false)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dismiss
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline mode features notice */}
      <AnimatePresence>
        {status === 'offline' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-40"
          >
            <div className="p-4 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <CloudOff className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Offline Mode</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                You can still browse cached pages and use some tools offline.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">Cached pages available</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">Games work offline</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">AI tools need connection</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

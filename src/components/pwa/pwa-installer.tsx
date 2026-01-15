'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone, Monitor, Share } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true
    setIsStandalone(standalone)

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after delay if not dismissed before
      const dismissed = localStorage.getItem('pwa-prompt-dismissed')
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 5000)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false)
      setDeferredPrompt(null)
      localStorage.setItem('pwa-installed', 'true')
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setShowPrompt(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString())
  }

  // Don't show if already installed
  if (isStandalone) return null

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="bg-card border border-border rounded-xl shadow-lg p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                {isIOS ? (
                  <Smartphone className="w-6 h-6 text-primary" />
                ) : (
                  <Download className="w-6 h-6 text-primary" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Install Aplikasi</h3>

                {isIOS ? (
                  <p className="text-sm text-muted-foreground mb-3">
                    Tap <Share className="w-4 h-4 inline mx-1" /> lalu pilih &quot;Add to Home Screen&quot;
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground mb-3">
                    Install untuk akses lebih cepat dan pengalaman lebih baik
                  </p>
                )}

                {/* Features */}
                <div className="flex gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Monitor className="w-3 h-3" />
                    Offline
                  </span>
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3 h-3" />
                    Native feel
                  </span>
                </div>

                {/* Actions */}
                {!isIOS && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleInstall}
                      className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Install
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="px-3 py-2 border border-border rounded-lg text-sm hover:bg-accent transition-colors"
                    >
                      Nanti
                    </button>
                  </div>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-accent rounded transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook to register service worker
export function useServiceWorker() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration.scope)

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available
                console.log('New content available, refresh to update')
              }
            })
          }
        })
      })
      .catch((error) => {
        console.error('SW registration failed:', error)
      })
  }, [])
}

// Update notification component
export function PWAUpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      setShowUpdate(true)
    })
  }, [])

  if (!showUpdate) return null

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto z-50"
    >
      <div className="bg-primary text-primary-foreground rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
        <span className="text-sm">Update tersedia!</span>
        <button
          onClick={() => window.location.reload()}
          className="px-3 py-1 bg-white/20 rounded text-sm font-medium hover:bg-white/30 transition-colors"
        >
          Refresh
        </button>
      </div>
    </motion.div>
  )
}

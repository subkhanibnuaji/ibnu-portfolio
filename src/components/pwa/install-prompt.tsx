'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download,
  X,
  Smartphone,
  Zap,
  Wifi,
  Bell,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [installSuccess, setInstallSuccess] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if user dismissed before
    const dismissed = localStorage.getItem('pwaPromptDismissed')
    const dismissedAt = dismissed ? parseInt(dismissed) : 0
    const daysSinceDismissed = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24)

    // Listen for beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after delay if not dismissed recently
      if (daysSinceDismissed > 7) {
        setTimeout(() => setShowPrompt(true), 5000)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setInstallSuccess(true)
      setShowPrompt(false)
      setDeferredPrompt(null)

      // Trigger achievement
      window.dispatchEvent(new CustomEvent('achievementUnlocked', {
        detail: { id: 'pwa_installer', title: 'App Installed', description: 'Installed the PWA' }
      }))
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }, [])

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        setInstallSuccess(true)
      }
    } catch (error) {
      console.error('Install failed:', error)
    }

    setShowPrompt(false)
  }, [deferredPrompt])

  const handleDismiss = useCallback(() => {
    setShowPrompt(false)
    localStorage.setItem('pwaPromptDismissed', Date.now().toString())
  }, [])

  const features = [
    { icon: Zap, text: 'Lightning fast loading' },
    { icon: Wifi, text: 'Works offline' },
    { icon: Bell, text: 'Get notifications' },
    { icon: Smartphone, text: 'Native app experience' },
  ]

  // Don't render if already installed
  if (isInstalled) return null

  return (
    <>
      {/* Install Success Toast */}
      <AnimatePresence>
        {installSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-green-500/90 backdrop-blur-sm text-white shadow-lg">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">App installed successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Prompt */}
      <AnimatePresence>
        {showPrompt && deferredPrompt && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleDismiss}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 z-50 p-4 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md"
            >
              <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden">
                {/* Gradient header */}
                <div className="relative h-24 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500">
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                    <div className="w-16 h-16 rounded-2xl bg-card border-4 border-card shadow-lg flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="pt-12 pb-6 px-6 text-center">
                  <h2 className="text-xl font-bold mb-2">Install Ibnu Portfolio</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Get the full app experience with faster loading and offline access.
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border/50"
                      >
                        <feature.icon className="h-4 w-4 text-primary" />
                        <span className="text-xs text-muted-foreground">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleDismiss}
                      className="flex-1 px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors"
                    >
                      Not now
                    </button>
                    <button
                      onClick={handleInstall}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                    >
                      <Download className="h-4 w-4" />
                      Install
                    </button>
                  </div>
                </div>

                {/* Footer tip */}
                <div className="px-6 py-3 bg-muted/30 border-t border-border/50">
                  <p className="text-xs text-center text-muted-foreground">
                    No app store required - installs instantly from the browser
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mini install button when prompt is available but dismissed */}
      {deferredPrompt && !showPrompt && !isInstalled && (
        <button
          onClick={() => setShowPrompt(true)}
          className="fixed top-20 right-20 z-40 flex items-center gap-2 px-3 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 shadow-lg hover:shadow-xl transition-all group"
          title="Install App"
        >
          <Download className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium hidden sm:inline">Install App</span>
        </button>
      )}
    </>
  )
}

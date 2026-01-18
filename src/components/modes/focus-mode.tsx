'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Focus,
  X,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Clock,
  Pause,
  Play,
  RotateCcw,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FocusModeSettings {
  ambientSound: 'none' | 'rain' | 'coffee' | 'forest' | 'ocean'
  dimSidebars: boolean
  hideWidgets: boolean
  timerEnabled: boolean
  timerDuration: number // minutes
}

const AMBIENT_SOUNDS = [
  { id: 'none', label: 'None', icon: VolumeX },
  { id: 'rain', label: 'Rain', icon: Volume2 },
  { id: 'coffee', label: 'Coffee Shop', icon: Volume2 },
  { id: 'forest', label: 'Forest', icon: Volume2 },
  { id: 'ocean', label: 'Ocean', icon: Volume2 },
]

export function FocusMode() {
  const [isActive, setIsActive] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<FocusModeSettings>({
    ambientSound: 'none',
    dimSidebars: true,
    hideWidgets: true,
    timerEnabled: false,
    timerDuration: 25,
  })
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)

  // Timer logic
  useEffect(() => {
    if (!isActive || !settings.timerEnabled || !timerRunning) return

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 0) {
          setTimerRunning(false)
          // Play notification sound or show alert
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Focus Session Complete!', {
              body: 'Great job! Take a short break.',
              icon: '/favicon.ico',
            })
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, settings.timerEnabled, timerRunning])

  // Apply focus mode styles
  useEffect(() => {
    if (isActive) {
      document.body.classList.add('focus-mode-active')

      if (settings.hideWidgets) {
        document.body.classList.add('focus-mode-hide-widgets')
      }

      if (settings.dimSidebars) {
        document.body.classList.add('focus-mode-dim-sidebars')
      }
    } else {
      document.body.classList.remove(
        'focus-mode-active',
        'focus-mode-hide-widgets',
        'focus-mode-dim-sidebars'
      )
    }

    return () => {
      document.body.classList.remove(
        'focus-mode-active',
        'focus-mode-hide-widgets',
        'focus-mode-dim-sidebars'
      )
    }
  }, [isActive, settings.hideWidgets, settings.dimSidebars])

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault()
        setIsActive((prev) => !prev)
      }
      // Escape to exit focus mode
      if (e.key === 'Escape' && isActive) {
        setIsActive(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isActive])

  const toggleFocusMode = useCallback(() => {
    setIsActive((prev) => {
      if (!prev) {
        // Starting focus mode
        if (settings.timerEnabled) {
          setTimerSeconds(settings.timerDuration * 60)
          setTimerRunning(true)
        }

        // Trigger achievement
        window.dispatchEvent(new CustomEvent('achievementUnlocked', {
          detail: { id: 'focus_master' }
        }))
      }
      return !prev
    })
  }, [settings.timerEnabled, settings.timerDuration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0')
  }

  const resetTimer = () => {
    setTimerSeconds(settings.timerDuration * 60)
    setTimerRunning(false)
  }

  return (
    <>
      {/* Global styles for focus mode */}
      <style jsx global>{`
        .focus-mode-active {
          transition: all 0.5s ease;
        }

        .focus-mode-hide-widgets [data-focus-hide="true"] {
          opacity: 0 !important;
          pointer-events: none !important;
          transition: opacity 0.3s ease;
        }

        .focus-mode-dim-sidebars nav,
        .focus-mode-dim-sidebars footer,
        .focus-mode-dim-sidebars aside {
          opacity: 0.3;
          transition: opacity 0.3s ease;
        }

        .focus-mode-dim-sidebars nav:hover,
        .focus-mode-dim-sidebars footer:hover,
        .focus-mode-dim-sidebars aside:hover {
          opacity: 1;
        }

        .focus-mode-active main {
          max-width: 800px;
          margin: 0 auto;
          transition: max-width 0.5s ease;
        }
      `}</style>

      {/* Toggle Button */}
      <button
        onClick={() => setShowSettings(true)}
        className={cn(
          'fixed top-32 left-4 z-40 flex items-center gap-2 p-3 rounded-full backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all group',
          isActive
            ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
            : 'bg-card/80 border-border/50 hover:border-primary/50'
        )}
        title="Focus Mode (Ctrl+Shift+F)"
      >
        <Focus className={cn(
          'h-5 w-5 transition-transform',
          isActive && 'animate-pulse'
        )} />
        {isActive && settings.timerEnabled && timerSeconds > 0 && (
          <span className="text-sm font-mono font-medium">{formatTime(timerSeconds)}</span>
        )}
      </button>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-50"
            >
              <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'p-2 rounded-xl',
                        isActive
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-muted text-muted-foreground'
                      )}>
                        <Focus className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-bold">Focus Mode</h2>
                        <p className="text-xs text-muted-foreground">
                          {isActive ? 'Currently active' : 'Distraction-free reading'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Settings */}
                <div className="p-4 space-y-4">
                  {/* Timer */}
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Focus Timer</span>
                      </div>
                      <button
                        onClick={() => setSettings(s => ({ ...s, timerEnabled: !s.timerEnabled }))}
                        className={cn(
                          'w-10 h-6 rounded-full transition-colors relative',
                          settings.timerEnabled ? 'bg-primary' : 'bg-muted'
                        )}
                      >
                        <span className={cn(
                          'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                          settings.timerEnabled ? 'left-5' : 'left-1'
                        )} />
                      </button>
                    </div>

                    {settings.timerEnabled && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => setSettings(s => ({ ...s, timerDuration: Math.max(5, s.timerDuration - 5) }))}
                            className="p-2 rounded-lg bg-muted hover:bg-muted/80"
                          >
                            -5
                          </button>
                          <span className="text-3xl font-mono font-bold text-primary">
                            {settings.timerDuration}
                          </span>
                          <span className="text-muted-foreground">min</span>
                          <button
                            onClick={() => setSettings(s => ({ ...s, timerDuration: Math.min(120, s.timerDuration + 5) }))}
                            className="p-2 rounded-lg bg-muted hover:bg-muted/80"
                          >
                            +5
                          </button>
                        </div>

                        {isActive && (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setTimerRunning(!timerRunning)}
                              className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30"
                            >
                              {timerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={resetTimer}
                              className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 cursor-pointer">
                      <span className="text-sm">Hide UI widgets</span>
                      <input
                        type="checkbox"
                        checked={settings.hideWidgets}
                        onChange={(e) => setSettings(s => ({ ...s, hideWidgets: e.target.checked }))}
                        className="sr-only"
                      />
                      <div className={cn(
                        'w-10 h-6 rounded-full transition-colors relative',
                        settings.hideWidgets ? 'bg-primary' : 'bg-muted'
                      )}>
                        <span className={cn(
                          'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                          settings.hideWidgets ? 'left-5' : 'left-1'
                        )} />
                      </div>
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 cursor-pointer">
                      <span className="text-sm">Dim sidebars</span>
                      <input
                        type="checkbox"
                        checked={settings.dimSidebars}
                        onChange={(e) => setSettings(s => ({ ...s, dimSidebars: e.target.checked }))}
                        className="sr-only"
                      />
                      <div className={cn(
                        'w-10 h-6 rounded-full transition-colors relative',
                        settings.dimSidebars ? 'bg-primary' : 'bg-muted'
                      )}>
                        <span className={cn(
                          'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                          settings.dimSidebars ? 'left-5' : 'left-1'
                        )} />
                      </div>
                    </label>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border/50">
                  <button
                    onClick={() => {
                      toggleFocusMode()
                      setShowSettings(false)
                    }}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all',
                      isActive
                        ? 'bg-muted hover:bg-muted/80 text-foreground'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                    )}
                  >
                    {isActive ? (
                      <>
                        <X className="h-4 w-4" />
                        Exit Focus Mode
                      </>
                    ) : (
                      <>
                        <Focus className="h-4 w-4" />
                        Start Focus Session
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-muted-foreground mt-3">
                    <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded">Ctrl+Shift+F</kbd>
                    {' '}to toggle quickly
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Focus mode indicator overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 z-[45] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </>
  )
}

'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Accessibility,
  X,
  Type,
  ZoomIn,
  ZoomOut,
  Contrast,
  MousePointer2,
  Eye,
  Volume2,
  VolumeX,
  Minus,
  Plus,
  RotateCcw,
  Keyboard,
  Focus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccessibilitySettings {
  fontSize: number // percentage, 100 is default
  contrast: 'normal' | 'high' | 'low'
  reducedMotion: boolean
  highlightLinks: boolean
  largerCursor: boolean
  focusHighlight: boolean
  textSpacing: 'normal' | 'wide' | 'wider'
  dyslexiaFont: boolean
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 100,
  contrast: 'normal',
  reducedMotion: false,
  highlightLinks: false,
  largerCursor: false,
  focusHighlight: false,
  textSpacing: 'normal',
  dyslexiaFont: false,
}

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS)

  // Load settings
  useEffect(() => {
    const stored = localStorage.getItem('accessibility')
    if (stored) {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) })
    }
  }, [])

  // Apply settings
  useEffect(() => {
    const root = document.documentElement

    // Font size
    root.style.fontSize = `${settings.fontSize}%`

    // Contrast
    root.classList.remove('high-contrast', 'low-contrast')
    if (settings.contrast === 'high') {
      root.classList.add('high-contrast')
    } else if (settings.contrast === 'low') {
      root.classList.add('low-contrast')
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    // Highlight links
    if (settings.highlightLinks) {
      root.classList.add('highlight-links')
    } else {
      root.classList.remove('highlight-links')
    }

    // Larger cursor
    if (settings.largerCursor) {
      root.classList.add('larger-cursor')
    } else {
      root.classList.remove('larger-cursor')
    }

    // Focus highlight
    if (settings.focusHighlight) {
      root.classList.add('focus-highlight')
    } else {
      root.classList.remove('focus-highlight')
    }

    // Text spacing
    root.classList.remove('text-spacing-wide', 'text-spacing-wider')
    if (settings.textSpacing === 'wide') {
      root.classList.add('text-spacing-wide')
    } else if (settings.textSpacing === 'wider') {
      root.classList.add('text-spacing-wider')
    }

    // Dyslexia font
    if (settings.dyslexiaFont) {
      root.classList.add('dyslexia-font')
    } else {
      root.classList.remove('dyslexia-font')
    }

    // Save settings
    localStorage.setItem('accessibility', JSON.stringify(settings))
  }, [settings])

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.removeItem('accessibility')
  }, [])

  const adjustFontSize = useCallback((delta: number) => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.max(75, Math.min(150, prev.fontSize + delta))
    }))
  }, [])

  return (
    <>
      {/* Global accessibility styles */}
      <style jsx global>{`
        .high-contrast {
          filter: contrast(1.25);
        }

        .low-contrast {
          filter: contrast(0.85);
        }

        .reduce-motion *,
        .reduce-motion *::before,
        .reduce-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }

        .highlight-links a {
          background-color: rgba(0, 212, 255, 0.2) !important;
          text-decoration: underline !important;
          outline: 2px solid rgba(0, 212, 255, 0.5) !important;
        }

        .larger-cursor,
        .larger-cursor * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%23fff' stroke='%23000' stroke-width='1'%3E%3Cpath d='M4 4l16 12-8 0-4 8-4-20z'/%3E%3C/svg%3E") 0 0, auto !important;
        }

        .focus-highlight *:focus {
          outline: 3px solid #00d4ff !important;
          outline-offset: 2px !important;
        }

        .text-spacing-wide {
          letter-spacing: 0.05em;
          word-spacing: 0.1em;
          line-height: 1.8;
        }

        .text-spacing-wider {
          letter-spacing: 0.1em;
          word-spacing: 0.2em;
          line-height: 2;
        }

        .dyslexia-font {
          font-family: 'OpenDyslexic', 'Comic Sans MS', sans-serif !important;
        }

        .dyslexia-font * {
          font-family: inherit !important;
        }
      `}</style>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-68 left-4 z-40 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 shadow-lg hover:shadow-xl transition-all group"
        title="Accessibility Options"
        aria-label="Open accessibility options"
      >
        <Accessibility className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            >
              <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-card/95 backdrop-blur-xl p-4 border-b border-border/50 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-blue-500/20">
                        <Accessibility className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="font-bold">Accessibility</h2>
                        <p className="text-xs text-muted-foreground">Customize for your needs</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Close accessibility options"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-5">
                  {/* Font Size */}
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Type className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Text Size</span>
                      <span className="ml-auto text-sm text-muted-foreground">{settings.fontSize}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => adjustFontSize(-10)}
                        disabled={settings.fontSize <= 75}
                        className="p-2 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Decrease font size"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${((settings.fontSize - 75) / 75) * 100}%` }}
                        />
                      </div>
                      <button
                        onClick={() => adjustFontSize(10)}
                        disabled={settings.fontSize >= 150}
                        className="p-2 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Increase font size"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Contrast */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Contrast className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Contrast</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'low' as const, label: 'Low' },
                        { id: 'normal' as const, label: 'Normal' },
                        { id: 'high' as const, label: 'High' },
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => updateSetting('contrast', option.id)}
                          className={cn(
                            'p-3 rounded-xl border text-sm transition-all',
                            settings.contrast === option.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border/50 hover:border-primary/30 bg-muted/30'
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Spacing */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Type className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Text Spacing</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'normal' as const, label: 'Normal' },
                        { id: 'wide' as const, label: 'Wide' },
                        { id: 'wider' as const, label: 'Wider' },
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => updateSetting('textSpacing', option.id)}
                          className={cn(
                            'p-3 rounded-xl border text-sm transition-all',
                            settings.textSpacing === option.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border/50 hover:border-primary/30 bg-muted/30'
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-3">
                    {[
                      {
                        key: 'reducedMotion' as const,
                        icon: Eye,
                        label: 'Reduce Motion',
                        description: 'Minimize animations',
                      },
                      {
                        key: 'highlightLinks' as const,
                        icon: MousePointer2,
                        label: 'Highlight Links',
                        description: 'Make links more visible',
                      },
                      {
                        key: 'focusHighlight' as const,
                        icon: Focus,
                        label: 'Focus Indicator',
                        description: 'Enhanced focus outline',
                      },
                      {
                        key: 'largerCursor' as const,
                        icon: MousePointer2,
                        label: 'Large Cursor',
                        description: 'Bigger mouse pointer',
                      },
                      {
                        key: 'dyslexiaFont' as const,
                        icon: Type,
                        label: 'Dyslexia Font',
                        description: 'Easier to read font',
                      },
                    ].map((option) => (
                      <label
                        key={option.key}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <option.icon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{option.label}</p>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => updateSetting(option.key, !settings[option.key])}
                          className={cn(
                            'w-10 h-6 rounded-full transition-colors relative',
                            settings[option.key] ? 'bg-primary' : 'bg-muted'
                          )}
                          role="switch"
                          aria-checked={settings[option.key]}
                        >
                          <span className={cn(
                            'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                            settings[option.key] ? 'left-5' : 'left-1'
                          )} />
                        </button>
                      </label>
                    ))}
                  </div>

                  {/* Reset */}
                  <button
                    onClick={resetSettings}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-border/50 hover:border-destructive/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset to Defaults
                  </button>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 p-4 border-t border-border/50 bg-card/95">
                  <p className="text-xs text-center text-muted-foreground">
                    Settings are saved automatically
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

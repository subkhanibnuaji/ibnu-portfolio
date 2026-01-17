'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
  Settings2,
  X,
  Palette,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Check,
  RotateCcw,
  Type,
  Layout,
  Zap,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PersonalizationSettings {
  accentColor: string
  fontSize: 'small' | 'medium' | 'large'
  reducedMotion: boolean
  compactMode: boolean
  showParticles: boolean
  cursorEffects: boolean
}

const ACCENT_COLORS = [
  { id: 'cyan', color: '#00d4ff', label: 'Cyan' },
  { id: 'purple', color: '#a855f7', label: 'Purple' },
  { id: 'pink', color: '#ec4899', label: 'Pink' },
  { id: 'green', color: '#22c55e', label: 'Green' },
  { id: 'orange', color: '#f97316', label: 'Orange' },
  { id: 'blue', color: '#3b82f6', label: 'Blue' },
  { id: 'red', color: '#ef4444', label: 'Red' },
  { id: 'yellow', color: '#eab308', label: 'Yellow' },
]

const DEFAULT_SETTINGS: PersonalizationSettings = {
  accentColor: 'cyan',
  fontSize: 'medium',
  reducedMotion: false,
  compactMode: false,
  showParticles: true,
  cursorEffects: true,
}

export function PersonalizationPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<PersonalizationSettings>(DEFAULT_SETTINGS)
  const { theme, setTheme } = useTheme()

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('personalization')
    if (stored) {
      const parsed = JSON.parse(stored)
      setSettings({ ...DEFAULT_SETTINGS, ...parsed })
    }
  }, [])

  // Apply settings
  useEffect(() => {
    const root = document.documentElement

    // Apply accent color
    const accent = ACCENT_COLORS.find(c => c.id === settings.accentColor)
    if (accent) {
      root.style.setProperty('--accent-color', accent.color)
      root.style.setProperty('--primary', accent.color)
    }

    // Apply font size
    const fontSizes = { small: '14px', medium: '16px', large: '18px' }
    root.style.setProperty('--base-font-size', fontSizes[settings.fontSize])
    root.style.fontSize = fontSizes[settings.fontSize]

    // Apply reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    // Apply compact mode
    if (settings.compactMode) {
      root.classList.add('compact-mode')
    } else {
      root.classList.remove('compact-mode')
    }

    // Apply particle visibility
    if (!settings.showParticles) {
      root.classList.add('hide-particles')
    } else {
      root.classList.remove('hide-particles')
    }

    // Apply cursor effects
    if (!settings.cursorEffects) {
      root.classList.add('no-cursor-effects')
    } else {
      root.classList.remove('no-cursor-effects')
    }
  }, [settings])

  const updateSetting = useCallback(<K extends keyof PersonalizationSettings>(
    key: K,
    value: PersonalizationSettings[K]
  ) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value }
      localStorage.setItem('personalization', JSON.stringify(newSettings))
      return newSettings
    })
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.removeItem('personalization')
  }, [])

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ',' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Listen for open event from Quick Actions FAB
  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('openPersonalization', handleOpen)
    return () => window.removeEventListener('openPersonalization', handleOpen)
  }, [])

  return (
    <>
      {/* Global styles for personalization */}
      <style jsx global>{`
        .reduce-motion * {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }

        .compact-mode {
          --spacing-unit: 0.75;
        }

        .compact-mode .container {
          padding: calc(var(--spacing-unit) * 1rem);
        }

        .hide-particles [data-particles="true"] {
          display: none !important;
        }

        .no-cursor-effects [data-cursor-effect="true"] {
          display: none !important;
        }
      `}</style>

      {/* Panel - triggered via Quick Actions FAB */}
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
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-full max-w-sm z-50"
            >
              <div className="h-full bg-card/95 backdrop-blur-xl border-r border-border/50 shadow-2xl overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-card/95 backdrop-blur-xl border-b border-border/50 p-4 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                        <Palette className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-bold">Personalization</h2>
                        <p className="text-xs text-muted-foreground">Customize your experience</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-6">
                  {/* Theme Selection */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Theme
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'light', label: 'Light', icon: Sun },
                        { id: 'dark', label: 'Dark', icon: Moon },
                        { id: 'system', label: 'System', icon: Monitor },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id)}
                          className={cn(
                            'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all',
                            theme === t.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border/50 hover:border-primary/30 bg-muted/30'
                          )}
                        >
                          <t.icon className={cn(
                            'h-5 w-5',
                            theme === t.id ? 'text-primary' : 'text-muted-foreground'
                          )} />
                          <span className="text-xs">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Accent Color
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {ACCENT_COLORS.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => updateSetting('accentColor', color.id)}
                          className={cn(
                            'relative flex items-center justify-center w-full aspect-square rounded-xl border-2 transition-all',
                            settings.accentColor === color.id
                              ? 'border-foreground scale-110'
                              : 'border-transparent hover:scale-105'
                          )}
                          style={{ backgroundColor: color.color }}
                          title={color.label}
                        >
                          {settings.accentColor === color.id && (
                            <Check className="h-4 w-4 text-white drop-shadow-md" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Font Size
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'small' as const, label: 'Small', size: 'text-sm' },
                        { id: 'medium' as const, label: 'Medium', size: 'text-base' },
                        { id: 'large' as const, label: 'Large', size: 'text-lg' },
                      ].map((size) => (
                        <button
                          key={size.id}
                          onClick={() => updateSetting('fontSize', size.id)}
                          className={cn(
                            'p-3 rounded-xl border transition-all',
                            settings.fontSize === size.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border/50 hover:border-primary/30 bg-muted/30',
                            size.size
                          )}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visual Options */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Visual Options
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          key: 'reducedMotion' as const,
                          label: 'Reduced Motion',
                          description: 'Minimize animations',
                          icon: Zap,
                        },
                        {
                          key: 'compactMode' as const,
                          label: 'Compact Mode',
                          description: 'Tighter spacing',
                          icon: Layout,
                        },
                        {
                          key: 'showParticles' as const,
                          label: 'Particle Effects',
                          description: 'Background particles',
                          icon: Sparkles,
                        },
                        {
                          key: 'cursorEffects' as const,
                          label: 'Cursor Effects',
                          description: 'Custom cursor trail',
                          icon: Palette,
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
                          >
                            <span className={cn(
                              'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                              settings[option.key] ? 'left-5' : 'left-1'
                            )} />
                          </button>
                        </label>
                      ))}
                    </div>
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
                    <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded">⌘,</kbd>
                    {' '}to toggle panel
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

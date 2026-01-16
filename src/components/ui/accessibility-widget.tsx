'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Accessibility,
  X,
  Type,
  Sun,
  Moon,
  Minus,
  Plus,
  Eye,
  MousePointer,
  RotateCcw,
  Underline
} from 'lucide-react'

interface AccessibilitySettings {
  fontSize: number
  contrast: 'normal' | 'high' | 'inverted'
  reducedMotion: boolean
  highlightLinks: boolean
  bigCursor: boolean
  lineHeight: number
  letterSpacing: number
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  contrast: 'normal',
  reducedMotion: false,
  highlightLinks: false,
  bigCursor: false,
  lineHeight: 100,
  letterSpacing: 0
}

const STORAGE_KEY = 'accessibility-settings'

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)

  // Load settings on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      setSettings(parsed)
      applySettings(parsed)
    }
  }, [])

  // Apply settings to document
  const applySettings = (s: AccessibilitySettings) => {
    const root = document.documentElement

    // Font size
    root.style.fontSize = `${s.fontSize}%`

    // Line height
    root.style.setProperty('--a11y-line-height', `${s.lineHeight / 100}`)

    // Letter spacing
    root.style.setProperty('--a11y-letter-spacing', `${s.letterSpacing}px`)

    // Contrast
    root.classList.remove('high-contrast', 'inverted-contrast')
    if (s.contrast === 'high') {
      root.classList.add('high-contrast')
    } else if (s.contrast === 'inverted') {
      root.classList.add('inverted-contrast')
    }

    // Reduced motion
    if (s.reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    // Highlight links
    if (s.highlightLinks) {
      root.classList.add('highlight-links')
    } else {
      root.classList.remove('highlight-links')
    }

    // Big cursor
    if (s.bigCursor) {
      root.classList.add('big-cursor')
    } else {
      root.classList.remove('big-cursor')
    }
  }

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
    applySettings(newSettings)
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.removeItem(STORAGE_KEY)
    applySettings(defaultSettings)
  }

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Accessibility Settings"
      >
        <Accessibility className="w-5 h-5" />
      </motion.button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-background border-l border-border z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Accessibility className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Accessibility</h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Font Size */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-3">
                      <Type className="w-4 h-4" />
                      Font Size: {settings.fontSize}%
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateSetting('fontSize', Math.max(80, settings.fontSize - 10))}
                        className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="range"
                        min="80"
                        max="150"
                        value={settings.fontSize}
                        onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <button
                        onClick={() => updateSetting('fontSize', Math.min(150, settings.fontSize + 10))}
                        className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Line Height */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-3">
                      Line Height: {settings.lineHeight}%
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="200"
                      step="10"
                      value={settings.lineHeight}
                      onChange={(e) => updateSetting('lineHeight', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Letter Spacing */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-3">
                      Letter Spacing: {settings.letterSpacing}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={settings.letterSpacing}
                      onChange={(e) => updateSetting('letterSpacing', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Contrast */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-3">
                      <Eye className="w-4 h-4" />
                      Contrast Mode
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['normal', 'high', 'inverted'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => updateSetting('contrast', mode)}
                          className={`
                            px-3 py-2 text-sm rounded-lg border transition-colors capitalize
                            ${settings.contrast === mode
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:bg-accent'
                            }
                          `}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3">
                    {/* Reduced Motion */}
                    <label className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
                      <span className="text-sm font-medium">Reduce Motion</span>
                      <input
                        type="checkbox"
                        checked={settings.reducedMotion}
                        onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-muted rounded-full peer-checked:bg-primary relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-4" />
                    </label>

                    {/* Highlight Links */}
                    <label className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <Underline className="w-4 h-4" />
                        Highlight Links
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.highlightLinks}
                        onChange={(e) => updateSetting('highlightLinks', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-muted rounded-full peer-checked:bg-primary relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-4" />
                    </label>

                    {/* Big Cursor */}
                    <label className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <MousePointer className="w-4 h-4" />
                        Big Cursor
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.bigCursor}
                        onChange={(e) => updateSetting('bigCursor', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-muted rounded-full peer-checked:bg-primary relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-4" />
                    </label>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={resetSettings}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset to Default
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global styles */}
      <style jsx global>{`
        .high-contrast {
          filter: contrast(1.5);
        }

        .inverted-contrast {
          filter: invert(1) hue-rotate(180deg);
        }

        .inverted-contrast img,
        .inverted-contrast video {
          filter: invert(1) hue-rotate(180deg);
        }

        .reduce-motion * {
          animation: none !important;
          transition: none !important;
        }

        .highlight-links a {
          outline: 2px solid currentColor !important;
          outline-offset: 2px;
          text-decoration: underline !important;
        }

        .big-cursor,
        .big-cursor * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%23000'%3E%3Cpath d='M4 4l16 8-8 2-2 8z'/%3E%3C/svg%3E") 0 0, auto !important;
        }
      `}</style>
    </>
  )
}

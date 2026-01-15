'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, Settings, Check } from 'lucide-react'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

const COOKIE_CONSENT_KEY = 'cookie-consent'
const COOKIE_PREFERENCES_KEY = 'cookie-preferences'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false
  })

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => setShowBanner(true), 1500)
      return () => clearTimeout(timer)
    } else {
      // Load saved preferences
      const savedPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY)
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs))
      }
    }
  }, [])

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    }
    saveConsent(allAccepted)
  }

  const acceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    }
    saveConsent(necessaryOnly)
  }

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true')
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs))
    setPreferences(prefs)
    setShowBanner(false)
    setShowSettings(false)

    // Trigger event for analytics scripts
    window.dispatchEvent(new CustomEvent('cookieConsentUpdate', { detail: prefs }))
  }

  const cookieTypes = [
    {
      key: 'necessary' as const,
      label: 'Necessary',
      description: 'Required for the website to function properly. Cannot be disabled.',
      required: true
    },
    {
      key: 'analytics' as const,
      label: 'Analytics',
      description: 'Help us understand how visitors interact with our website.',
      required: false
    },
    {
      key: 'marketing' as const,
      label: 'Marketing',
      description: 'Used to track visitors across websites for advertising purposes.',
      required: false
    },
    {
      key: 'preferences' as const,
      label: 'Preferences',
      description: 'Remember your settings and personalization choices.',
      required: false
    }
  ]

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto">
            {/* Main Banner */}
            {!showSettings ? (
              <div className="bg-card border border-border rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    <Cookie className="w-6 h-6 text-primary" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Cookie Notice</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Kami menggunakan cookies untuk meningkatkan pengalaman Anda.
                      Dengan melanjutkan menggunakan situs ini, Anda menyetujui penggunaan cookies.
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={acceptAll}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Accept All
                      </button>
                      <button
                        onClick={acceptNecessary}
                        className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                      >
                        Necessary Only
                      </button>
                      <button
                        onClick={() => setShowSettings(true)}
                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                      >
                        <Settings className="w-4 h-4" />
                        Customize
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={acceptNecessary}
                    className="p-2 hover:bg-accent rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Settings Panel */
              <div className="bg-card border border-border rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Cookie Settings</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {cookieTypes.map(type => (
                    <div
                      key={type.key}
                      className="flex items-start justify-between gap-4 p-3 rounded-lg bg-accent/50"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{type.label}</span>
                          {type.required && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {type.description}
                        </p>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={preferences[type.key]}
                          onChange={(e) => {
                            if (!type.required) {
                              setPreferences(prev => ({
                                ...prev,
                                [type.key]: e.target.checked
                              }))
                            }
                          }}
                          disabled={type.required}
                          className="sr-only peer"
                        />
                        <div className={`
                          w-11 h-6 rounded-full peer
                          ${type.required ? 'bg-primary cursor-not-allowed' : 'bg-muted peer-checked:bg-primary'}
                          peer-focus:ring-2 peer-focus:ring-primary/50
                          after:content-[''] after:absolute after:top-0.5 after:left-[2px]
                          after:bg-white after:rounded-full after:h-5 after:w-5
                          after:transition-all peer-checked:after:translate-x-full
                        `} />
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => saveConsent(preferences)}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Save Preferences
                  </button>
                  <button
                    onClick={acceptAll}
                    className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook to check cookie consent
export function useCookieConsent() {
  const [consent, setConsent] = useState<CookiePreferences | null>(null)

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
    const savedPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY)

    if (savedConsent && savedPrefs) {
      setConsent(JSON.parse(savedPrefs))
    }

    // Listen for updates
    const handleUpdate = (e: CustomEvent<CookiePreferences>) => {
      setConsent(e.detail)
    }

    window.addEventListener('cookieConsentUpdate', handleUpdate as EventListener)
    return () => window.removeEventListener('cookieConsentUpdate', handleUpdate as EventListener)
  }, [])

  return consent
}

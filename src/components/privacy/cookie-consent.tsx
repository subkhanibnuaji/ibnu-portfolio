'use client'

/**
 * GDPR-Compliant Cookie Consent Banner
 *
 * Features:
 * - Granular consent options
 * - Remembers preferences
 * - Easy to customize
 * - Accessible (WCAG 2.1)
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, Settings, Check, Shield } from 'lucide-react'

// =============================================================================
// TYPES
// =============================================================================

export interface CookiePreferences {
  necessary: boolean // Always true, can't be disabled
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

interface CookieConsentProps {
  onAccept?: (preferences: CookiePreferences) => void
  onDecline?: () => void
  privacyPolicyUrl?: string
}

// =============================================================================
// CONSTANTS
// =============================================================================

const CONSENT_COOKIE_NAME = 'cookie-consent'
const CONSENT_VERSION = '1.0'

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
}

const COOKIE_CATEGORIES = [
  {
    id: 'necessary',
    name: 'Necessary',
    description: 'Essential for the website to function. Cannot be disabled.',
    required: true,
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Help us understand how visitors interact with our website.',
    required: false,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Used to deliver personalized advertisements.',
    required: false,
  },
  {
    id: 'preferences',
    name: 'Preferences',
    description: 'Remember your settings and preferences.',
    required: false,
  },
] as const

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getConsentCookie(): CookiePreferences | null {
  if (typeof document === 'undefined') return null

  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`))

  if (!cookie) return null

  try {
    const value = JSON.parse(decodeURIComponent(cookie.split('=')[1]))
    if (value.version !== CONSENT_VERSION) return null
    return value.preferences
  } catch {
    return null
  }
}

export function setConsentCookie(preferences: CookiePreferences): void {
  if (typeof document === 'undefined') return

  const value = JSON.stringify({
    version: CONSENT_VERSION,
    preferences,
    timestamp: new Date().toISOString(),
  })

  // Set cookie for 1 year
  const expires = new Date()
  expires.setFullYear(expires.getFullYear() + 1)

  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`
}

export function hasConsent(category: keyof CookiePreferences): boolean {
  const preferences = getConsentCookie()
  if (!preferences) return category === 'necessary'
  return preferences[category]
}

export function revokeConsent(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${CONSENT_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CookieConsent({
  onAccept,
  onDecline,
  privacyPolicyUrl = '/privacy',
}: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES)

  // Check if consent already given
  useEffect(() => {
    const existingConsent = getConsentCookie()
    if (!existingConsent) {
      // Delay showing banner slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = useCallback(() => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    }
    setConsentCookie(allAccepted)
    setIsVisible(false)
    onAccept?.(allAccepted)
  }, [onAccept])

  const handleAcceptSelected = useCallback(() => {
    setConsentCookie(preferences)
    setIsVisible(false)
    onAccept?.(preferences)
  }, [preferences, onAccept])

  const handleDecline = useCallback(() => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    }
    setConsentCookie(onlyNecessary)
    setIsVisible(false)
    onDecline?.()
  }, [onDecline])

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return // Can't toggle necessary
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
      >
        <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between p-4 md:p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Cookie Settings</h2>
                <p className="text-sm text-muted-foreground">
                  We use cookies to enhance your experience
                </p>
              </div>
            </div>
            <button
              onClick={handleDecline}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6">
            {!showSettings ? (
              // Simple view
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  We use cookies and similar technologies to help personalize content,
                  tailor and measure ads, and provide a better experience. By clicking
                  &quot;Accept All&quot;, you agree to this, as outlined in our{' '}
                  <a
                    href={privacyPolicyUrl}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAcceptAll}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Check className="h-4 w-4" />
                    Accept All
                  </button>
                  <button
                    onClick={handleDecline}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Customize
                  </button>
                </div>
              </div>
            ) : (
              // Detailed settings view
              <div>
                <div className="space-y-4 mb-6">
                  {COOKIE_CATEGORIES.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-start justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{category.name}</span>
                          {category.required && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.description}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input
                          type="checkbox"
                          checked={preferences[category.id as keyof CookiePreferences]}
                          onChange={() => togglePreference(category.id as keyof CookiePreferences)}
                          disabled={category.required}
                          className="sr-only peer"
                        />
                        <div
                          className={`
                            w-11 h-6 rounded-full peer
                            ${category.required ? 'bg-primary' : 'bg-muted'}
                            peer-checked:bg-primary
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                            after:bg-white after:rounded-full after:h-5 after:w-5
                            after:transition-all peer-checked:after:translate-x-full
                            ${category.required ? 'opacity-70 cursor-not-allowed' : ''}
                          `}
                        />
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAcceptSelected}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Shield className="h-4 w-4" />
                    Save Preferences
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// =============================================================================
// MANAGE CONSENT BUTTON (for footer/settings page)
// =============================================================================

export function ManageCookiesButton() {
  const handleClick = () => {
    revokeConsent()
    window.location.reload()
  }

  return (
    <button
      onClick={handleClick}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      Manage Cookie Preferences
    </button>
  )
}

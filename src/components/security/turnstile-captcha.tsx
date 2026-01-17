'use client'

/**
 * Cloudflare Turnstile CAPTCHA Component
 *
 * Usage:
 * 1. Get your site key from https://dash.cloudflare.com/turnstile
 * 2. Add NEXT_PUBLIC_TURNSTILE_SITE_KEY to .env
 * 3. Add TURNSTILE_SECRET_KEY to .env (for server verification)
 *
 * Example:
 * ```tsx
 * <TurnstileCaptcha onVerify={(token) => setToken(token)} />
 * ```
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import Script from 'next/script'

// =============================================================================
// TYPES
// =============================================================================

interface TurnstileInstance {
  render: (
    container: string | HTMLElement,
    options: TurnstileOptions
  ) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
  getResponse: (widgetId: string) => string | undefined
}

interface TurnstileOptions {
  sitekey: string
  callback?: (token: string) => void
  'error-callback'?: (error: unknown) => void
  'expired-callback'?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact'
  'refresh-expired'?: 'auto' | 'manual' | 'never'
  language?: string
  appearance?: 'always' | 'execute' | 'interaction-only'
  retry?: 'auto' | 'never'
  'retry-interval'?: number
}

declare global {
  interface Window {
    turnstile: TurnstileInstance
    onTurnstileLoad?: () => void
  }
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

interface TurnstileCaptchaProps {
  onVerify: (token: string) => void
  onError?: (error: unknown) => void
  onExpire?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact'
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function TurnstileCaptcha({
  onVerify,
  onError,
  onExpire,
  theme = 'auto',
  size = 'normal',
  className,
}: TurnstileCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile || !siteKey) return

    // Remove existing widget if any
    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current)
      } catch {
        // Ignore errors when removing
      }
    }

    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        'error-callback': (err) => {
          setError('Verification failed')
          onError?.(err)
        },
        'expired-callback': () => {
          onExpire?.()
        },
        theme,
        size,
        'refresh-expired': 'auto',
        retry: 'auto',
        'retry-interval': 5000,
      })
    } catch (err) {
      console.error('Failed to render Turnstile widget:', err)
      setError('Failed to load CAPTCHA')
    }
  }, [siteKey, onVerify, onError, onExpire, theme, size])

  useEffect(() => {
    if (isLoaded) {
      renderWidget()
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          // Ignore cleanup errors
        }
      }
    }
  }, [isLoaded, renderWidget])

  // If no site key configured, show placeholder
  if (!siteKey) {
    return (
      <div className={`text-sm text-muted-foreground ${className}`}>
        <p>CAPTCHA not configured</p>
        <p className="text-xs">Add NEXT_PUBLIC_TURNSTILE_SITE_KEY to enable</p>
      </div>
    )
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        onLoad={() => setIsLoaded(true)}
        onError={() => setError('Failed to load CAPTCHA script')}
      />

      <div className={className}>
        {error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : (
          <div ref={containerRef} />
        )}
      </div>
    </>
  )
}

// =============================================================================
// INVISIBLE TURNSTILE (for programmatic verification)
// =============================================================================

interface InvisibleTurnstileProps {
  onVerify: (token: string) => void
  onError?: (error: unknown) => void
}

export function useInvisibleTurnstile({ onVerify, onError }: InvisibleTurnstileProps) {
  const [isReady, setIsReady] = useState(false)
  const widgetIdRef = useRef<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    // Create hidden container
    const container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)
    containerRef.current = container

    // Load script
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    script.onload = () => {
      setIsReady(true)
    }
    document.head.appendChild(script)

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          // Ignore
        }
      }
      container.remove()
      script.remove()
    }
  }, [])

  const execute = useCallback(async (): Promise<string | null> => {
    if (!isReady || !containerRef.current || !window.turnstile || !siteKey) {
      return null
    }

    return new Promise((resolve) => {
      widgetIdRef.current = window.turnstile.render(containerRef.current!, {
        sitekey: siteKey,
        callback: (token) => {
          onVerify(token)
          resolve(token)
        },
        'error-callback': (err) => {
          onError?.(err)
          resolve(null)
        },
        appearance: 'execute',
      })
    })
  }, [isReady, siteKey, onVerify, onError])

  return { isReady, execute }
}

// =============================================================================
// HONEYPOT FIELD COMPONENT
// =============================================================================

interface HoneypotFieldProps {
  name?: string
  onChange?: (value: string) => void
}

export function HoneypotField({ name = 'website', onChange }: HoneypotFieldProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '-9999px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      <label htmlFor={name}>
        Leave this field empty
        <input
          type="text"
          id={name}
          name={name}
          tabIndex={-1}
          autoComplete="off"
          onChange={(e) => onChange?.(e.target.value)}
        />
      </label>
    </div>
  )
}

// =============================================================================
// FORM TIMESTAMP FIELD
// =============================================================================

interface FormTimestampFieldProps {
  name?: string
}

export function FormTimestampField({ name = '_ft' }: FormTimestampFieldProps) {
  const [timestamp, setTimestamp] = useState('')

  useEffect(() => {
    // Generate timestamp when form loads
    const ts = Buffer.from(Date.now().toString()).toString('base64')
    setTimestamp(ts)
  }, [])

  return <input type="hidden" name={name} value={timestamp} />
}

// =============================================================================
// PROTECTED FORM WRAPPER
// =============================================================================

interface ProtectedFormProps {
  children: React.ReactNode
  onSubmit: (data: FormData, captchaToken: string | null) => Promise<void>
  requireCaptcha?: boolean
  className?: string
}

export function ProtectedForm({
  children,
  onSubmit,
  requireCaptcha = true,
  className,
}: ProtectedFormProps) {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [honeypotValue, setHoneypotValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    // Check honeypot
    if (honeypotValue) {
      console.warn('Honeypot triggered')
      setError('Invalid submission')
      return
    }

    // Check CAPTCHA
    if (requireCaptcha && !captchaToken) {
      setError('Please complete the CAPTCHA')
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      await onSubmit(formData, captchaToken)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {/* Honeypot field */}
      <HoneypotField onChange={setHoneypotValue} />

      {/* Form timestamp */}
      <FormTimestampField />

      {/* Form content */}
      {children}

      {/* CAPTCHA */}
      {requireCaptcha && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <div className="mt-4">
          <TurnstileCaptcha
            onVerify={setCaptchaToken}
            onError={() => setError('CAPTCHA verification failed')}
          />
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="mt-2 text-sm text-red-500">{error}</div>
      )}

      {/* Submit indicator */}
      {isSubmitting && (
        <div className="mt-2 text-sm text-muted-foreground">Submitting...</div>
      )}
    </form>
  )
}

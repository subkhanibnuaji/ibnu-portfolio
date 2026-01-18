/**
 * Sentry.io Integration for Error Monitoring & Performance
 *
 * This is a stub implementation that works with or without @sentry/nextjs.
 * If Sentry is installed and configured, it will use the real implementation.
 * Otherwise, it falls back to console logging.
 *
 * FREE Tier includes:
 * - 5K errors/month
 * - 10K performance units/month
 * - 1 team member
 * - 30 day data retention
 *
 * Setup:
 * 1. Create account at https://sentry.io
 * 2. Create a new Next.js project
 * 3. Add SENTRY_DSN to .env
 * 4. Run: npx @sentry/wizard@latest -i nextjs
 */

// Type definitions for Sentry-like API
interface SentryScope {
  setTag: (key: string, value: string) => void
  setExtra: (key: string, value: unknown) => void
}

interface SentrySpan {
  end: () => void
}

interface SentryModule {
  init: (config: unknown) => void
  withScope: (callback: (scope: SentryScope) => void) => void
  captureException: (error: Error) => void
  captureMessage: (message: string, level?: string) => void
  setUser: (user: { id: string; email?: string; role?: string } | null) => void
  startInactiveSpan: (options: { name: string; op: string }) => SentrySpan
  captureConsoleIntegration: (options: { levels: string[] }) => unknown
}

// Try to load Sentry, fall back to stub if not available
let Sentry: SentryModule | null = null

try {
  // Dynamic import to avoid build errors when @sentry/nextjs is not installed
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Sentry = require('@sentry/nextjs') as SentryModule
} catch {
  // Sentry not installed, will use fallback implementation
  console.log('[Sentry] Package not installed, using fallback logging')
}

// Stub implementation when Sentry is not available
const SentryStub: SentryModule = {
  init: () => {},
  withScope: (callback) => {
    const stubScope: SentryScope = {
      setTag: () => {},
      setExtra: () => {},
    }
    callback(stubScope)
  },
  captureException: (error) => {
    console.error('[Error]', error)
  },
  captureMessage: (message, level) => {
    console.log(`[${level || 'info'}]`, message)
  },
  setUser: () => {},
  startInactiveSpan: () => ({ end: () => {} }),
  captureConsoleIntegration: () => ({}),
}

// Use real Sentry or stub
const SentryAPI = Sentry || SentryStub

// =============================================================================
// CONFIGURATION
// =============================================================================

export const SENTRY_CONFIG = {
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
}

// =============================================================================
// INITIALIZATION
// =============================================================================

export function initSentry() {
  if (!SENTRY_CONFIG.dsn) {
    console.warn('[Sentry] DSN not configured, skipping initialization')
    return
  }

  if (!Sentry) {
    console.warn('[Sentry] Package not installed, using fallback logging')
    return
  }

  SentryAPI.init({
    dsn: SENTRY_CONFIG.dsn,
    environment: SENTRY_CONFIG.environment,
    tracesSampleRate: SENTRY_CONFIG.tracesSampleRate,

    // Capture unhandled promise rejections
    integrations: [
      SentryAPI.captureConsoleIntegration({
        levels: ['error', 'warn'],
      }),
    ],

    // Filter out sensitive data
    beforeSend(event: { request?: { headers?: Record<string, string> }; breadcrumbs?: Array<{ message?: string }> }) {
      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers['authorization']
        delete event.request.headers['cookie']
        delete event.request.headers['x-api-key']
      }

      // Remove sensitive data from breadcrumbs
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.filter(
          (breadcrumb) => !breadcrumb.message?.includes('password')
        )
      }

      return event
    },

    // Ignore certain errors
    ignoreErrors: [
      // Browser extensions
      /extensions\//i,
      /^chrome:\/\//i,
      // Network errors
      'Network request failed',
      'Failed to fetch',
      'NetworkError',
      // User actions
      'ResizeObserver loop',
      'Non-Error promise rejection',
    ],
  })
}

// =============================================================================
// ERROR CAPTURE HELPERS
// =============================================================================

export function captureError(
  error: Error | unknown,
  context?: Record<string, unknown>
) {
  if (!SENTRY_CONFIG.dsn && !Sentry) {
    console.error('[Error]', error, context)
    return
  }

  SentryAPI.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value)
      })
    }

    if (error instanceof Error) {
      SentryAPI.captureException(error)
    } else {
      SentryAPI.captureMessage(String(error), 'error')
    }
  })
}

export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: Record<string, unknown>
) {
  if (!SENTRY_CONFIG.dsn && !Sentry) {
    console.log(`[${level}]`, message, context)
    return
  }

  SentryAPI.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value)
      })
    }
    SentryAPI.captureMessage(message, level)
  })
}

// =============================================================================
// USER TRACKING (Privacy-Friendly)
// =============================================================================

export function setUser(user: {
  id: string
  email?: string
  role?: string
}) {
  if (!SENTRY_CONFIG.dsn && !Sentry) return

  SentryAPI.setUser({
    id: user.id,
    // Hash email for privacy
    email: user.email ? hashEmail(user.email) : undefined,
    role: user.role,
  })
}

export function clearUser() {
  if (!SENTRY_CONFIG.dsn && !Sentry) return
  SentryAPI.setUser(null)
}

// =============================================================================
// PERFORMANCE MONITORING
// =============================================================================

export function startTransaction(
  name: string,
  operation: string
): SentrySpan | undefined {
  if (!SENTRY_CONFIG.dsn && !Sentry) return undefined

  return SentryAPI.startInactiveSpan({
    name,
    op: operation,
  })
}

export function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const span = startTransaction(name, 'function')

  return fn().finally(() => {
    span?.end()
  })
}

// =============================================================================
// SECURITY EVENT TRACKING
// =============================================================================

export function trackSecurityEvent(
  eventType: string,
  details: Record<string, unknown>
) {
  captureMessage(`Security Event: ${eventType}`, 'warning', {
    category: 'security',
    eventType,
    ...details,
  })
}

export function trackSuspiciousActivity(
  ip: string,
  activity: string,
  details?: Record<string, unknown>
) {
  SentryAPI.withScope((scope) => {
    scope.setTag('category', 'security')
    scope.setTag('activity_type', activity)
    scope.setExtra('ip', ip)
    if (details) {
      Object.entries(details).forEach(([key, value]) => {
        scope.setExtra(key, value)
      })
    }
    SentryAPI.captureMessage(`Suspicious Activity: ${activity}`, 'warning')
  })
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function hashEmail(email: string): string {
  // Simple hash for privacy - don't expose actual email
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return `user_${Math.abs(hash).toString(16)}`
}

// =============================================================================
// ALTERNATIVE: LIGHTWEIGHT ERROR TRACKING (No External Service)
// =============================================================================

interface ErrorLog {
  timestamp: Date
  type: 'error' | 'warning' | 'info'
  message: string
  stack?: string
  context?: Record<string, unknown>
  url?: string
  userAgent?: string
}

const errorLogs: ErrorLog[] = []
const MAX_ERROR_LOGS = 1000

export function logError(
  error: Error | string,
  context?: Record<string, unknown>
) {
  const log: ErrorLog = {
    timestamp: new Date(),
    type: 'error',
    message: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
    context,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  }

  errorLogs.push(log)

  if (errorLogs.length > MAX_ERROR_LOGS) {
    errorLogs.shift()
  }

  // Also send to Sentry if configured
  if (SENTRY_CONFIG.dsn || Sentry) {
    captureError(error, context)
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error Logged]', log)
  }
}

export function getErrorLogs(limit = 100): ErrorLog[] {
  return errorLogs.slice(-limit)
}

export function clearErrorLogs() {
  errorLogs.length = 0
}

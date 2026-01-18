/**
 * Sentry.io Integration for Error Monitoring & Performance
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
 * 4. Install: npm install @sentry/nextjs
 * 5. Run: npx @sentry/wizard@latest -i nextjs
 */

// Stub types for when @sentry/nextjs is not installed
interface SentrySpan {
  end: () => void
}

type SentryScope = {
  setTag: (key: string, value: string) => void
  setExtra: (key: string, value: unknown) => void
}

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

// Sentry module type (using any since @sentry/nextjs may not be installed)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Sentry: any = null

async function loadSentry() {
  try {
    // @ts-expect-error - @sentry/nextjs may not be installed
    Sentry = await import('@sentry/nextjs')
  } catch {
    // Sentry not installed, use fallback
    Sentry = null
  }
}

// Try to load Sentry
if (typeof window !== 'undefined') {
  loadSentry()
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
    console.warn('[Sentry] @sentry/nextjs not installed, using fallback logging')
    return
  }

  Sentry.init({
    dsn: SENTRY_CONFIG.dsn,
    environment: SENTRY_CONFIG.environment,
    tracesSampleRate: SENTRY_CONFIG.tracesSampleRate,

    // Capture unhandled promise rejections
    integrations: [
      Sentry.captureConsoleIntegration({
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
          (breadcrumb: { message?: string }) => !breadcrumb.message?.includes('password')
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
  if (!SENTRY_CONFIG.dsn || !Sentry) {
    console.error('[Error]', error, context)
    return
  }

  Sentry.withScope((scope: SentryScope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value)
      })
    }

    if (error instanceof Error) {
      Sentry.captureException(error)
    } else {
      Sentry.captureMessage(String(error), 'error')
    }
  })
}

export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: Record<string, unknown>
) {
  if (!SENTRY_CONFIG.dsn || !Sentry) {
    console.log(`[${level}]`, message, context)
    return
  }

  Sentry.withScope((scope: SentryScope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value)
      })
    }
    Sentry.captureMessage(message, level)
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
  if (!SENTRY_CONFIG.dsn || !Sentry) return

  Sentry.setUser({
    id: user.id,
    // Hash email for privacy
    email: user.email ? hashEmail(user.email) : undefined,
    role: user.role,
  })
}

export function clearUser() {
  if (!SENTRY_CONFIG.dsn || !Sentry) return
  Sentry.setUser(null)
}

// =============================================================================
// PERFORMANCE MONITORING
// =============================================================================

export function startTransaction(
  name: string,
  operation: string
): SentrySpan | undefined {
  if (!SENTRY_CONFIG.dsn || !Sentry) return undefined

  return Sentry.startInactiveSpan({
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
  if (!Sentry) {
    console.warn(`[Security] Suspicious Activity: ${activity}`, { ip, ...details })
    return
  }

  Sentry.withScope((scope: SentryScope) => {
    scope.setTag('category', 'security')
    scope.setTag('activity_type', activity)
    scope.setExtra('ip', ip)
    if (details) {
      Object.entries(details).forEach(([key, value]) => {
        scope.setExtra(key, value)
      })
    }
    Sentry.captureMessage(`Suspicious Activity: ${activity}`, 'warning')
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
  if (SENTRY_CONFIG.dsn && Sentry) {
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

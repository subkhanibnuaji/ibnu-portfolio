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
 * 4. Run: npm install @sentry/nextjs
 * 5. Run: npx @sentry/wizard@latest -i nextjs
 */

// Stub implementation when @sentry/nextjs is not installed
const SentryStub = {
  init: (_config?: unknown) => {},
  captureException: (error: Error) => console.error('[Sentry Stub]', error),
  captureMessage: (message: string) => console.log('[Sentry Stub]', message),
  setUser: (_user?: unknown) => {},
  setContext: (_name?: string, _context?: unknown) => {},
  setTag: (_key?: string, _value?: string) => {},
  addBreadcrumb: (_breadcrumb?: unknown) => {},
  startSpan: (_options?: unknown) => ({ end: () => {} }),
  captureConsoleIntegration: () => ({}),
  browserTracingIntegration: () => ({}),
  replayIntegration: () => ({}),
  withScope: (callback: (scope: unknown) => void) => callback({}),
}

// Try to use real Sentry if available, otherwise use stub
let Sentry: typeof SentryStub
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Sentry = require('@sentry/nextjs')
} catch {
  Sentry = SentryStub
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

// =============================================================================
// INITIALIZATION
// =============================================================================

export function initSentry() {
  if (!SENTRY_CONFIG.dsn) {
    console.warn('[Sentry] DSN not configured, skipping initialization')
    return
  }

  if (Sentry === SentryStub) {
    console.warn('[Sentry] @sentry/nextjs not installed, using stub')
    return
  }

  Sentry.init({
    dsn: SENTRY_CONFIG.dsn,
    environment: SENTRY_CONFIG.environment,
    tracesSampleRate: SENTRY_CONFIG.tracesSampleRate,
  })
}

// =============================================================================
// ERROR CAPTURING
// =============================================================================

interface ErrorContext {
  userId?: string
  email?: string
  action?: string
  component?: string
  componentStack?: string | null
  section?: string
  metadata?: Record<string, unknown>
  [key: string]: unknown // Allow additional properties
}

export function captureError(error: Error, context?: ErrorContext) {
  console.error('[Error]', error.message, context)

  if (Sentry === SentryStub) return

  Sentry.withScope((scope: unknown) => {
    if (context?.userId) {
      Sentry.setUser({ id: context.userId, email: context.email })
    }
    if (context?.action) {
      Sentry.setTag('action', context.action)
    }
    if (context?.component) {
      Sentry.setTag('component', context.component)
    }
    if (context?.metadata) {
      Sentry.setContext('metadata', context.metadata)
    }
    Sentry.captureException(error)
  })
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  console.log(`[${level.toUpperCase()}]`, message)

  if (Sentry === SentryStub) return

  Sentry.captureMessage(message)
}

// =============================================================================
// USER TRACKING
// =============================================================================

export function setUser(user: { id: string; email?: string; username?: string }) {
  if (Sentry === SentryStub) return
  Sentry.setUser(user)
}

export function clearUser() {
  if (Sentry === SentryStub) return
  Sentry.setUser(null)
}

// =============================================================================
// BREADCRUMBS
// =============================================================================

export function addBreadcrumb(breadcrumb: {
  category: string
  message: string
  level?: 'debug' | 'info' | 'warning' | 'error'
  data?: Record<string, unknown>
}) {
  if (Sentry === SentryStub) return
  Sentry.addBreadcrumb(breadcrumb)
}

// =============================================================================
// PERFORMANCE MONITORING
// =============================================================================

export function startTransaction(name: string, op: string) {
  if (Sentry === SentryStub) {
    return { finish: () => {} }
  }
  return Sentry.startSpan({ name, op })
}

// =============================================================================
// SECURITY EVENT TRACKING
// =============================================================================

export function trackSecurityEvent(
  type: string,
  metadata?: Record<string, unknown>,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
) {
  console.log(`[Security Event] [${severity.toUpperCase()}] ${type}`, metadata)

  if (Sentry === SentryStub) return

  Sentry.withScope((scope: unknown) => {
    Sentry.setTag('security_event', type)
    Sentry.setTag('severity', severity)
    if (metadata) {
      Sentry.setContext('security_metadata', metadata)
    }
    Sentry.captureMessage(`[Security] ${type}`)
  })
}

// =============================================================================
// EXPORTS
// =============================================================================

export { Sentry }

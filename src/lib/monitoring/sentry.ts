/**
 * Sentry.io Integration for Error Monitoring & Performance
 * 
 * This is a stub implementation - Sentry is optional.
 * To enable Sentry:
 * 1. Install @sentry/nextjs: npm install @sentry/nextjs
 * 2. Create account at https://sentry.io
 * 3. Add SENTRY_DSN to .env
 * 4. Run: npx @sentry/wizard@latest -i nextjs
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

export const SENTRY_CONFIG = {
    dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    enabled: false, // Set to true when @sentry/nextjs is installed
}

// ============================================================================
// STUB IMPLEMENTATIONS (No-op when Sentry is not installed)
// ============================================================================

export const initSentry = () => {
    if (SENTRY_CONFIG.dsn && SENTRY_CONFIG.enabled) {
          console.log('[Sentry] Would initialize with DSN:', SENTRY_CONFIG.dsn)
    }
}

export const captureException = (error: Error, context?: Record<string, unknown>) => {
    console.error('[Sentry Stub] Exception:', error.message, context)
}

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
    console.log(`[Sentry Stub] ${level.toUpperCase()}:`, message)
}

export const setUser = (user: { id?: string; email?: string; username?: string } | null) => {
    console.log('[Sentry Stub] Set user:', user)
}

export const setTag = (key: string, value: string) => {
    console.log('[Sentry Stub] Set tag:', key, value)
}

export const setExtra = (key: string, value: unknown) => {
    console.log('[Sentry Stub] Set extra:', key, value)
}

export const addBreadcrumb = (breadcrumb: {
    category?: string
    message?: string
    level?: 'info' | 'warning' | 'error'
    data?: Record<string, unknown>
}) => {
    console.log('[Sentry Stub] Breadcrumb:', breadcrumb)
}

export const startTransaction = (context: { name: string; op?: string }) => {
    console.log('[Sentry Stub] Start transaction:', context)
    return {
          finish: () => console.log('[Sentry Stub] Finish transaction:', context.name),
          setTag: () => {},
          setData: () => {},
    }
}

export const withScope = (callback: (scope: unknown) => void) => {
    callback({
          setTag: () => {},
          setExtra: () => {},
          setUser: () => {},
          setLevel: () => {},
    })
}

// Security event tracking for CSP and other security violations
export const trackSecurityEvent = (
      eventType: string,
      details: Record<string, unknown>
    ) => {
          console.log(`[Sentry Stub] Security Event: ${eventType}`, details)
          // In production with Sentry enabled, this would send to Sentry
          captureMessage(`Security: ${eventType}`, 'warning')
    }

// Export default object for compatibility
export default {
    init: initSentry,
    captureException,
    captureMessage,
    setUser,
    setTag,
    setExtra,
    addBreadcrumb,
    startTransaction,
    withScope,
        trackSecurityEvent,
}

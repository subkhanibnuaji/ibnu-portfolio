'use client'

/**
 * Global Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the component tree,
 * logs them, and displays a fallback UI.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { captureError } from '@/lib/monitoring/sentry'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

// =============================================================================
// ERROR BOUNDARY CLASS COMPONENT
// =============================================================================

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })

    // Log to Sentry
    captureError(error, {
      componentStack: errorInfo.componentStack,
    })

    // Call custom error handler
    this.props.onError?.(error, errorInfo)

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary]', error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          showDetails={this.props.showDetails}
          onReset={this.handleReset}
          onReload={this.handleReload}
          onGoHome={this.handleGoHome}
        />
      )
    }

    return this.props.children
  }
}

// =============================================================================
// ERROR FALLBACK UI
// =============================================================================

interface ErrorFallbackProps {
  error: Error | null
  errorInfo: ErrorInfo | null
  showDetails?: boolean
  onReset?: () => void
  onReload?: () => void
  onGoHome?: () => void
}

export function ErrorFallback({
  error,
  errorInfo,
  showDetails = process.env.NODE_ENV === 'development',
  onReset,
  onReload,
  onGoHome,
}: ErrorFallbackProps) {
  const [showStack, setShowStack] = React.useState(false)

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          An unexpected error occurred. Our team has been notified.
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-muted rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-mono text-red-500">{error.message}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}

          {onReload && (
            <button
              onClick={onReload}
              className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </button>
          )}

          {onGoHome && (
            <button
              onClick={onGoHome}
              className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          )}
        </div>

        {/* Technical Details (Development) */}
        {showDetails && errorInfo && (
          <div className="text-left">
            <button
              onClick={() => setShowStack(!showStack)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <Bug className="w-4 h-4" />
              {showStack ? 'Hide' : 'Show'} technical details
            </button>

            {showStack && (
              <div className="bg-muted rounded-lg p-4 overflow-auto max-h-[300px]">
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// HOOK FOR FUNCTIONAL COMPONENTS
// =============================================================================

export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: Error) => {
    setError(error)
    captureError(error)
  }, [])

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  // Throw error to be caught by nearest ErrorBoundary
  if (error) {
    throw error
  }

  return { handleError, resetError }
}

// =============================================================================
// ASYNC ERROR BOUNDARY (for Suspense)
// =============================================================================

interface AsyncErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

export function AsyncErrorBoundary({ children, fallback }: AsyncErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        fallback || (
          <div className="p-8 text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Failed to load component</p>
          </div>
        )
      }
    >
      {children}
    </ErrorBoundary>
  )
}

// =============================================================================
// SECTION ERROR BOUNDARY (for specific sections)
// =============================================================================

interface SectionErrorBoundaryProps {
  children: ReactNode
  sectionName: string
}

export function SectionErrorBoundary({ children, sectionName }: SectionErrorBoundaryProps) {
  return (
    <ErrorBoundary
      onError={(error) => {
        captureError(error, { section: sectionName })
      }}
      fallback={
        <div className="p-4 bg-muted rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            Failed to load {sectionName}
          </p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

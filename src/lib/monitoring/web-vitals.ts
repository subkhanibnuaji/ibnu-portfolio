/**
 * Web Vitals Monitoring
 * Tracks Core Web Vitals and sends to analytics
 *
 * Metrics tracked:
 * - LCP (Largest Contentful Paint) - Loading performance
 * - FID (First Input Delay) - Interactivity
 * - CLS (Cumulative Layout Shift) - Visual stability
 * - FCP (First Contentful Paint) - Initial render
 * - TTFB (Time to First Byte) - Server response
 * - INP (Interaction to Next Paint) - Responsiveness
 */

export type WebVitalMetric = {
  id: string
  name: 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB' | 'INP'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  navigationType: string
}

// Thresholds based on Google's Core Web Vitals guidelines
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
}

function getRating(name: keyof typeof THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name]
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

/**
 * Report Web Vitals to analytics endpoint
 */
export async function reportWebVitals(metric: WebVitalMetric): Promise<void> {
  const body = {
    id: metric.id,
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    navigationType: metric.navigationType,
    url: typeof window !== 'undefined' ? window.location.pathname : '',
    timestamp: Date.now(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌'
    console.log(`${emoji} Web Vital: ${metric.name} = ${metric.value.toFixed(2)} (${metric.rating})`)
  }

  // Send to analytics endpoint (if available)
  try {
    // Use sendBeacon for reliable delivery
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/monitoring/vitals', JSON.stringify(body))
    } else {
      // Fallback to fetch
      await fetch('/api/monitoring/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        keepalive: true,
      })
    }
  } catch {
    // Silently fail - analytics should not break the app
  }
}

/**
 * Initialize Web Vitals monitoring
 * Call this in your app's entry point
 */
export async function initWebVitals(): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    const { onLCP, onFID, onCLS, onFCP, onTTFB, onINP } = await import('web-vitals')

    const handleMetric = (metric: { name: string; id: string; value: number; delta: number; navigationType: string }) => {
      const name = metric.name as keyof typeof THRESHOLDS
      reportWebVitals({
        id: metric.id,
        name: name as WebVitalMetric['name'],
        value: metric.value,
        rating: getRating(name, metric.value),
        delta: metric.delta,
        navigationType: metric.navigationType,
      })
    }

    onLCP(handleMetric)
    onFID(handleMetric)
    onCLS(handleMetric)
    onFCP(handleMetric)
    onTTFB(handleMetric)
    onINP(handleMetric)
  } catch {
    // web-vitals not available
    console.warn('Web Vitals monitoring not available')
  }
}

/**
 * Get performance score (0-100) based on Core Web Vitals
 */
export function calculatePerformanceScore(metrics: {
  lcp?: number
  fid?: number
  cls?: number
}): number {
  let score = 100
  const weights = { lcp: 0.4, fid: 0.3, cls: 0.3 }

  if (metrics.lcp !== undefined) {
    const lcpRating = getRating('LCP', metrics.lcp)
    if (lcpRating === 'needs-improvement') score -= 15 * weights.lcp * 100
    if (lcpRating === 'poor') score -= 30 * weights.lcp * 100
  }

  if (metrics.fid !== undefined) {
    const fidRating = getRating('FID', metrics.fid)
    if (fidRating === 'needs-improvement') score -= 15 * weights.fid * 100
    if (fidRating === 'poor') score -= 30 * weights.fid * 100
  }

  if (metrics.cls !== undefined) {
    const clsRating = getRating('CLS', metrics.cls)
    if (clsRating === 'needs-improvement') score -= 15 * weights.cls * 100
    if (clsRating === 'poor') score -= 30 * weights.cls * 100
  }

  return Math.max(0, Math.round(score))
}

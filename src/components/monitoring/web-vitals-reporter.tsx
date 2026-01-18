'use client'

import { useEffect } from 'react'
import { initWebVitals } from '@/lib/monitoring/web-vitals'

/**
 * Web Vitals Reporter Component
 * Initializes Core Web Vitals monitoring on mount
 *
 * Add to your root layout to enable monitoring:
 * <WebVitalsReporter />
 */
export function WebVitalsReporter() {
  useEffect(() => {
    initWebVitals()
  }, [])

  // This component doesn't render anything
  return null
}

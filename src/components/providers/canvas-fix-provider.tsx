'use client'

import { useEffect } from 'react'
import { initCanvasColorFix } from '@/lib/canvas-color-fix'

/**
 * CanvasFixProvider
 *
 * This provider initializes the canvas color fix polyfill that automatically
 * adds '#' prefix to hex colors passed to CanvasGradient.addColorStop().
 *
 * This fixes errors like:
 * "Failed to execute 'addColorStop' on 'CanvasGradient':
 * The value provided ('a855f7') could not be parsed as a color."
 *
 * The fix works by patching the CanvasGradient prototype before any
 * third-party libraries try to use it.
 */
export function CanvasFixProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize the canvas color fix as early as possible
    initCanvasColorFix()
  }, [])

  return <>{children}</>
}

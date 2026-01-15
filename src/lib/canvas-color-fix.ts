'use client'

/**
 * Canvas Gradient Color Fix
 *
 * This polyfill patches the CanvasGradient.addColorStop method to automatically
 * fix hex color values that are missing the '#' prefix.
 *
 * Problem: Some third-party libraries pass hex colors without '#' prefix to
 * addColorStop(), causing "Failed to execute 'addColorStop' on 'CanvasGradient'"
 * errors.
 *
 * Solution: Intercept addColorStop calls and auto-fix the color format.
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

/**
 * Validates and fixes a color value for canvas gradient use
 * @param color - The color value to fix
 * @returns The fixed color value with proper format
 */
function fixColorValue(color: string): string {
  if (typeof color !== 'string') return color

  // Trim whitespace
  const trimmed = color.trim()

  // If it's already a valid color format, return as-is
  if (
    trimmed.startsWith('#') ||           // Hex with #
    trimmed.startsWith('rgb') ||          // rgb() or rgba()
    trimmed.startsWith('hsl') ||          // hsl() or hsla()
    /^[a-z]+$/i.test(trimmed)             // Named colors (red, blue, etc.)
  ) {
    return trimmed
  }

  // Check if it's a hex color without # (3, 4, 6, or 8 characters)
  // 3 chars: RGB shorthand (e.g., 'fff')
  // 4 chars: RGBA shorthand (e.g., 'ffff')
  // 6 chars: RGB full (e.g., 'ffffff')
  // 8 chars: RGBA full (e.g., 'ffffffff')
  const hexPattern = /^[0-9a-f]{3,4}$|^[0-9a-f]{6}$|^[0-9a-f]{8}$/i

  if (hexPattern.test(trimmed)) {
    // It's a hex color without #, add it
    return `#${trimmed}`
  }

  // Return original if we can't determine the format
  return color
}

/**
 * Initializes the canvas color fix polyfill
 * This should be called once when the app loads
 */
export function initCanvasColorFix(): void {
  if (!isBrowser) return

  // Check if CanvasGradient exists
  if (typeof CanvasGradient === 'undefined') return

  // Store the original addColorStop method
  const originalAddColorStop = CanvasGradient.prototype.addColorStop

  // Check if already patched
  if ((CanvasGradient.prototype as any).__colorFixPatched) return

  // Patch the addColorStop method
  CanvasGradient.prototype.addColorStop = function(offset: number, color: string) {
    const fixedColor = fixColorValue(color)
    return originalAddColorStop.call(this, offset, fixedColor)
  }

  // Mark as patched to prevent double-patching
  ;(CanvasGradient.prototype as any).__colorFixPatched = true

  // Also patch createLinearGradient and createRadialGradient to ensure
  // the gradients they create use our patched addColorStop
  // (This is automatically handled since we patched the prototype)

  if (process.env.NODE_ENV === 'development') {
    console.log('[Canvas Color Fix] Polyfill initialized')
  }
}

/**
 * React hook to initialize the canvas color fix
 * Use this in a client component that renders early in the app
 */
export function useCanvasColorFix(): void {
  if (isBrowser) {
    // Initialize immediately on first render
    initCanvasColorFix()
  }
}

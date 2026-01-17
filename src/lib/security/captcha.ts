/**
 * CAPTCHA Verification using Cloudflare Turnstile (FREE)
 *
 * Turnstile is Cloudflare's free, privacy-friendly CAPTCHA alternative.
 * Get your site key and secret key at: https://dash.cloudflare.com/turnstile
 *
 * Environment variables needed:
 * - NEXT_PUBLIC_TURNSTILE_SITE_KEY (for client-side)
 * - TURNSTILE_SECRET_KEY (for server-side verification)
 */

// =============================================================================
// TURNSTILE VERIFICATION
// =============================================================================

interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
  action?: string
  cdata?: string
}

/**
 * Verify Cloudflare Turnstile token on the server side
 */
export async function verifyTurnstileToken(token: string, ip?: string): Promise<{
  success: boolean
  error?: string
}> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  // If no secret key configured, skip verification (for development)
  if (!secretKey) {
    console.warn('[CAPTCHA] Turnstile secret key not configured, skipping verification')
    return { success: true }
  }

  try {
    const formData = new URLSearchParams()
    formData.append('secret', secretKey)
    formData.append('response', token)
    if (ip) {
      formData.append('remoteip', ip)
    }

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    const result: TurnstileVerifyResponse = await response.json()

    if (!result.success) {
      console.warn('[CAPTCHA] Turnstile verification failed:', result['error-codes'])
      return {
        success: false,
        error: result['error-codes']?.join(', ') || 'Verification failed',
      }
    }

    return { success: true }
  } catch (error) {
    console.error('[CAPTCHA] Turnstile verification error:', error)
    return {
      success: false,
      error: 'Verification request failed',
    }
  }
}

// =============================================================================
// HONEYPOT PROTECTION
// =============================================================================

/**
 * Validate honeypot field
 * Honeypot fields should be empty - if filled, it's likely a bot
 */
export function validateHoneypot(honeypotValue: string | undefined | null): {
  valid: boolean
  isBot: boolean
} {
  // If honeypot field is filled, it's a bot
  if (honeypotValue && honeypotValue.trim().length > 0) {
    return { valid: false, isBot: true }
  }
  return { valid: true, isBot: false }
}

/**
 * Generate honeypot field name (randomized to avoid detection)
 */
export function generateHoneypotFieldName(): string {
  const names = [
    'website',
    'url',
    'phone2',
    'fax',
    'company',
    'address2',
    'nickname',
    'firstname',
    'surname',
  ]
  return names[Math.floor(Math.random() * names.length)]
}

// =============================================================================
// TIME-BASED PROTECTION
// =============================================================================

/**
 * Validate form submission time
 * Forms submitted too quickly are likely bots
 */
export function validateSubmissionTime(
  formLoadTime: number,
  minTimeMs: number = 2000 // Minimum 2 seconds
): { valid: boolean; isBot: boolean } {
  const submissionTime = Date.now()
  const timeTaken = submissionTime - formLoadTime

  if (timeTaken < minTimeMs) {
    return { valid: false, isBot: true }
  }

  return { valid: true, isBot: false }
}

/**
 * Generate encrypted form timestamp
 * This should be included as a hidden field in forms
 */
export function generateFormTimestamp(): string {
  const timestamp = Date.now()
  // Simple obfuscation (in production, use proper encryption)
  return Buffer.from(timestamp.toString()).toString('base64')
}

/**
 * Decode form timestamp
 */
export function decodeFormTimestamp(encoded: string): number | null {
  try {
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
    const timestamp = parseInt(decoded, 10)
    if (isNaN(timestamp)) return null
    return timestamp
  } catch {
    return null
  }
}

// =============================================================================
// COMBINED VALIDATION
// =============================================================================

interface FormSecurityValidation {
  turnstileToken?: string
  honeypotValue?: string
  formTimestamp?: string
  clientIP?: string
}

interface ValidationResult {
  valid: boolean
  errors: string[]
  isBot: boolean
  score: number // 0-100, higher = more likely bot
}

export async function validateFormSecurity(
  data: FormSecurityValidation
): Promise<ValidationResult> {
  const errors: string[] = []
  let botScore = 0

  // 1. Turnstile CAPTCHA verification
  if (data.turnstileToken) {
    const captchaResult = await verifyTurnstileToken(data.turnstileToken, data.clientIP)
    if (!captchaResult.success) {
      errors.push(`CAPTCHA verification failed: ${captchaResult.error}`)
      botScore += 50
    }
  } else if (process.env.TURNSTILE_SECRET_KEY) {
    // Token required but not provided
    errors.push('CAPTCHA token required')
    botScore += 30
  }

  // 2. Honeypot check
  const honeypotResult = validateHoneypot(data.honeypotValue)
  if (!honeypotResult.valid) {
    errors.push('Invalid form submission')
    botScore += 40
  }

  // 3. Time-based check
  if (data.formTimestamp) {
    const timestamp = decodeFormTimestamp(data.formTimestamp)
    if (timestamp) {
      const timeResult = validateSubmissionTime(timestamp, 2000)
      if (!timeResult.valid) {
        errors.push('Form submitted too quickly')
        botScore += 30
      }
    } else {
      botScore += 10 // Invalid timestamp
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    isBot: botScore >= 50,
    score: Math.min(100, botScore),
  }
}

// =============================================================================
// REACT COMPONENT HELPERS
// =============================================================================

/**
 * Get Turnstile site key for client-side
 */
export function getTurnstileSiteKey(): string | undefined {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
}

/**
 * Check if Turnstile is configured
 */
export function isTurnstileConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
    process.env.TURNSTILE_SECRET_KEY
  )
}

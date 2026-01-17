/**
 * Security Utilities for Super Apps
 * Rate limiting, CSRF protection, security headers, etc.
 */

import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

// =============================================================================
// RATE LIMITING (Using Upstash Redis when available)
// =============================================================================

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
}

// In-memory rate limit store (fallback when Redis not available)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean every minute

export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Strict limits for auth endpoints
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 requests per 15 minutes

  // Moderate limits for form submissions
  contact: { windowMs: 60 * 1000, maxRequests: 3 }, // 3 per minute
  newsletter: { windowMs: 60 * 1000, maxRequests: 2 }, // 2 per minute
  guestbook: { windowMs: 60 * 1000, maxRequests: 5 }, // 5 per minute
  comment: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 per minute

  // Higher limits for read operations
  api: { windowMs: 60 * 1000, maxRequests: 60 }, // 60 per minute

  // AI endpoints (expensive operations)
  ai: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 per minute

  // Very strict for admin operations
  admin: { windowMs: 60 * 1000, maxRequests: 30 }, // 30 per minute
}

export async function checkRateLimit(
  req: NextRequest,
  limitType: keyof typeof RATE_LIMITS = 'api'
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const config = RATE_LIMITS[limitType]
  const ip = getClientIp(req)
  const key = `ratelimit:${limitType}:${ip}`

  // Try Upstash Redis first
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const { Ratelimit } = await import('@upstash/ratelimit')
      const { Redis } = await import('@upstash/redis')

      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })

      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(
          config.maxRequests,
          `${config.windowMs}ms`
        ),
        analytics: true,
      })

      const result = await ratelimit.limit(key)

      return {
        allowed: result.success,
        remaining: result.remaining,
        resetIn: result.reset - Date.now(),
      }
    } catch (error) {
      console.error('Upstash rate limit error, falling back to in-memory:', error)
    }
  }

  // Fallback to in-memory rate limiting
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
    }
  }

  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: record.resetTime - now,
    }
  }

  record.count++
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetIn: record.resetTime - now,
  }
}

export function rateLimitResponse(resetIn: number): NextResponse {
  return NextResponse.json(
    {
      error: 'Too many requests',
      message: 'Please try again later',
      retryAfter: Math.ceil(resetIn / 1000),
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil(resetIn / 1000)),
        'X-RateLimit-Remaining': '0',
      },
    }
  )
}

// =============================================================================
// IP EXTRACTION
// =============================================================================

export function getClientIp(req: NextRequest): string {
  // Check various headers for the real IP
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = req.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  const cfConnectingIp = req.headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // Fallback to a hash of user agent if no IP available
  const userAgent = req.headers.get('user-agent') || 'unknown'
  return `ua:${hashString(userAgent).slice(0, 16)}`
}

// =============================================================================
// CSRF PROTECTION
// =============================================================================

const CSRF_TOKEN_LENGTH = 32
const csrfTokens = new Map<string, { token: string; expires: number }>()

export function generateCsrfToken(): string {
  const array = new Uint8Array(CSRF_TOKEN_LENGTH)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function validateCsrfToken(req: NextRequest, token: string): boolean {
  const sessionId = req.cookies.get('session-id')?.value
  if (!sessionId) return false

  const stored = csrfTokens.get(sessionId)
  if (!stored) return false

  if (Date.now() > stored.expires) {
    csrfTokens.delete(sessionId)
    return false
  }

  // Constant-time comparison to prevent timing attacks
  return timingSafeEqual(stored.token, token)
}

export function storeCsrfToken(sessionId: string, token: string): void {
  csrfTokens.set(sessionId, {
    token,
    expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  })
}

// =============================================================================
// INPUT SANITIZATION
// =============================================================================

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: URIs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: URIs
    .trim()
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value)
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'string' ? sanitizeInput(item) : item
      )
    } else if (value !== null && typeof value === 'object') {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized as T
}

// =============================================================================
// SECURITY HEADERS
// =============================================================================

export const SECURITY_HEADERS: Record<string, string> = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // XSS Protection (legacy but still useful)
  'X-XSS-Protection': '1; mode=block',

  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions Policy (formerly Feature-Policy)
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',

  // HSTS (only in production)
  ...(process.env.NODE_ENV === 'production'
    ? { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload' }
    : {}),
}

// Content Security Policy
export function getContentSecurityPolicy(): string {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https: wss:",
    "media-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ]

  return directives.join('; ')
}

// =============================================================================
// REQUEST VALIDATION
// =============================================================================

export function validateOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  const referer = req.headers.get('referer')

  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000',
    'https://localhost:3000',
  ].filter(Boolean)

  // Allow requests without origin (same-origin requests)
  if (!origin && !referer) {
    return true
  }

  // Check if origin is allowed
  if (origin && allowedOrigins.some((allowed) => origin.startsWith(allowed!))) {
    return true
  }

  // Check referer as fallback
  if (referer && allowedOrigins.some((allowed) => referer.startsWith(allowed!))) {
    return true
  }

  return false
}

export function validateContentType(req: NextRequest, expected: string[]): boolean {
  const contentType = req.headers.get('content-type')
  if (!contentType) return false

  return expected.some((type) => contentType.includes(type))
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

// =============================================================================
// API RESPONSE HELPERS
// =============================================================================

export function apiError(
  message: string,
  status: number = 400,
  details?: Record<string, unknown>
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...details,
    },
    { status }
  )
}

export function apiSuccess<T>(
  data: T,
  status: number = 200,
  headers?: Record<string, string>
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status, headers }
  )
}

// =============================================================================
// AUDIT LOGGING
// =============================================================================

interface AuditLogEntry {
  timestamp: Date
  action: string
  userId?: string
  ip: string
  userAgent: string
  details?: Record<string, unknown>
  success: boolean
}

const auditLog: AuditLogEntry[] = []
const MAX_AUDIT_LOG_SIZE = 10000

export function logAuditEvent(
  req: NextRequest,
  action: string,
  success: boolean,
  userId?: string,
  details?: Record<string, unknown>
): void {
  const entry: AuditLogEntry = {
    timestamp: new Date(),
    action,
    userId,
    ip: getClientIp(req),
    userAgent: req.headers.get('user-agent') || 'unknown',
    details,
    success,
  }

  auditLog.push(entry)

  // Keep log size manageable
  if (auditLog.length > MAX_AUDIT_LOG_SIZE) {
    auditLog.shift()
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[AUDIT]', JSON.stringify(entry))
  }

  // TODO: Send to external logging service in production
  // e.g., Sentry, LogRocket, etc.
}

export function getAuditLogs(
  limit: number = 100,
  offset: number = 0
): AuditLogEntry[] {
  return auditLog.slice(-limit - offset, auditLog.length - offset)
}

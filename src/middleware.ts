/**
 * Next.js Middleware - Security Layer
 *
 * This middleware runs on EVERY request and provides:
 * - DDoS protection
 * - Bot detection
 * - IP blocking
 * - Honeypot traps
 * - SQL injection/XSS detection
 * - Path traversal protection
 * - Security headers
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// =============================================================================
// CONFIGURATION
// =============================================================================

const RATE_LIMIT_WINDOW = 1000 // 1 second
const MAX_REQUESTS_PER_SECOND = 50
const MAX_REQUESTS_PER_MINUTE = 300
const BLOCK_DURATION = 60 * 60 * 1000 // 1 hour

// =============================================================================
// IN-MEMORY STORAGE (Edge Runtime compatible)
// =============================================================================

// Using global Map that persists across requests in the same instance
const requestCounts = new Map<string, { count: number; windowStart: number; minuteCount: number; minuteStart: number }>()
const blockedIPs = new Map<string, { until: number; reason: string }>()
const suspicionScores = new Map<string, { score: number; lastUpdate: number }>()

// =============================================================================
// HONEYPOT PATHS (Trap for attackers)
// =============================================================================

const HONEYPOT_PATHS = [
  '/admin.php',
  '/wp-admin',
  '/wp-login.php',
  '/phpmyadmin',
  '/administrator',
  '/.env',
  '/.git',
  '/config.php',
  '/backup.sql',
  '/database.sql',
  '/debug.php',
  '/test.php',
  '/shell.php',
  '/cmd.php',
  '/eval.php',
  '/.htaccess',
  '/.htpasswd',
  '/server-status',
  '/xmlrpc.php',
  '/wp-config.php',
  '/config.json',
  '/secrets.json',
  '/credentials.json',
  '/.aws',
  '/id_rsa',
]

// =============================================================================
// SUSPICIOUS PATTERNS
// =============================================================================

// SQL Injection patterns
const SQL_PATTERNS = [
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
  /union\s+(all\s+)?select/i,
  /exec(\s|\+)+(s|x)p/i,
  /;.*drop\s+table/i,
  /1\s*=\s*1/i,
  /or\s+1\s*=\s*1/i,
  /'\s*or\s*'1'\s*=\s*'1/i,
]

// XSS patterns
const XSS_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /<iframe/i,
  /<object/i,
  /<embed/i,
  /data:text\/html/i,
]

// Path traversal patterns
const PATH_TRAVERSAL_PATTERNS = [
  /\.\.\//g,
  /\.\.\\/,
  /%2e%2e/i,
  /etc\/passwd/i,
  /etc\/shadow/i,
]

// Suspicious User Agents (hacking tools)
const SUSPICIOUS_UA_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /nessus/i,
  /nmap/i,
  /masscan/i,
  /zgrab/i,
  /gobuster/i,
  /dirbuster/i,
  /wfuzz/i,
  /hydra/i,
  /havij/i,
  /acunetix/i,
  /netsparker/i,
]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  const realIP = request.headers.get('x-real-ip')
  if (realIP) return realIP
  const cfIP = request.headers.get('cf-connecting-ip')
  if (cfIP) return cfIP
  return 'unknown'
}

function isIPBlocked(ip: string): { blocked: boolean; reason?: string } {
  const block = blockedIPs.get(ip)
  if (!block) return { blocked: false }

  if (Date.now() > block.until) {
    blockedIPs.delete(ip)
    return { blocked: false }
  }

  return { blocked: true, reason: block.reason }
}

function blockIP(ip: string, duration: number, reason: string): void {
  blockedIPs.set(ip, { until: Date.now() + duration, reason })
  console.warn(`[SECURITY] IP blocked: ${ip} - Reason: ${reason}`)
}

function addSuspicionScore(ip: string, points: number): number {
  const existing = suspicionScores.get(ip)
  const now = Date.now()

  if (existing) {
    const hoursPassed = (now - existing.lastUpdate) / (60 * 60 * 1000)
    const decayedScore = Math.max(0, existing.score - hoursPassed * 10)
    const newScore = decayedScore + points

    suspicionScores.set(ip, { score: newScore, lastUpdate: now })

    if (newScore >= 100) {
      blockIP(ip, 24 * 60 * 60 * 1000, 'Suspicion threshold exceeded')
    }

    return newScore
  }

  suspicionScores.set(ip, { score: points, lastUpdate: now })
  return points
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = requestCounts.get(ip)

  if (!record) {
    requestCounts.set(ip, { count: 1, windowStart: now, minuteCount: 1, minuteStart: now })
    return true
  }

  // Check per-second limit
  if (now - record.windowStart > RATE_LIMIT_WINDOW) {
    record.count = 1
    record.windowStart = now
  } else {
    record.count++
    if (record.count > MAX_REQUESTS_PER_SECOND) {
      return false
    }
  }

  // Check per-minute limit
  if (now - record.minuteStart > 60000) {
    record.minuteCount = 1
    record.minuteStart = now
  } else {
    record.minuteCount++
    if (record.minuteCount > MAX_REQUESTS_PER_MINUTE) {
      return false
    }
  }

  return true
}

function hasPatternMatch(text: string, patterns: RegExp[]): boolean {
  return patterns.some(pattern => pattern.test(text))
}

function isHoneypotPath(path: string): boolean {
  const lowerPath = path.toLowerCase()
  return HONEYPOT_PATHS.some(hp => lowerPath.includes(hp.toLowerCase()))
}

// =============================================================================
// SECURITY RESPONSE HELPERS
// =============================================================================

function blockedResponse(reason: string, status: number = 403): NextResponse {
  return new NextResponse(
    JSON.stringify({
      error: 'Access Denied',
      message: reason,
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    }
  )
}

function rateLimitResponse(): NextResponse {
  return new NextResponse(
    JSON.stringify({
      error: 'Too Many Requests',
      message: 'Please slow down',
      retryAfter: 60,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '60',
        'X-Content-Type-Options': 'nosniff',
      },
    }
  )
}

// =============================================================================
// MIDDLEWARE FUNCTION
// =============================================================================

export function middleware(request: NextRequest) {
  const ip = getClientIP(request)
  const path = request.nextUrl.pathname
  const url = request.url
  const userAgent = request.headers.get('user-agent') || ''

  // Skip static files and images
  if (
    path.startsWith('/_next') ||
    path.startsWith('/images') ||
    path.startsWith('/fonts') ||
    path.includes('.') && !path.endsWith('.php') && !path.endsWith('.sql')
  ) {
    return NextResponse.next()
  }

  // ==========================================================================
  // 1. CHECK IF IP IS BLOCKED
  // ==========================================================================
  const blockCheck = isIPBlocked(ip)
  if (blockCheck.blocked) {
    console.warn(`[SECURITY] Blocked IP attempted access: ${ip} - Path: ${path}`)
    return blockedResponse(blockCheck.reason || 'Access denied')
  }

  // ==========================================================================
  // 2. RATE LIMITING (DDoS Protection)
  // ==========================================================================
  if (!checkRateLimit(ip)) {
    addSuspicionScore(ip, 20)
    blockIP(ip, BLOCK_DURATION, 'Rate limit exceeded')
    console.warn(`[SECURITY] Rate limit exceeded: ${ip}`)
    return rateLimitResponse()
  }

  // ==========================================================================
  // 3. HONEYPOT TRAPS
  // ==========================================================================
  if (isHoneypotPath(path)) {
    addSuspicionScore(ip, 50)
    blockIP(ip, 24 * 60 * 60 * 1000, 'Honeypot access')
    console.warn(`[SECURITY] Honeypot accessed: ${ip} - Path: ${path}`)
    return blockedResponse('Not found', 404)
  }

  // ==========================================================================
  // 4. SUSPICIOUS USER AGENT CHECK
  // ==========================================================================
  if (hasPatternMatch(userAgent, SUSPICIOUS_UA_PATTERNS)) {
    addSuspicionScore(ip, 30)
    console.warn(`[SECURITY] Suspicious User-Agent: ${ip} - UA: ${userAgent}`)
    // Don't block immediately, but increase suspicion score
  }

  // ==========================================================================
  // 5. SQL INJECTION CHECK (URL)
  // ==========================================================================
  if (hasPatternMatch(url, SQL_PATTERNS)) {
    addSuspicionScore(ip, 40)
    blockIP(ip, BLOCK_DURATION, 'SQL injection attempt')
    console.warn(`[SECURITY] SQL injection attempt: ${ip} - URL: ${url.substring(0, 200)}`)
    return blockedResponse('Invalid request')
  }

  // ==========================================================================
  // 6. XSS CHECK (URL)
  // ==========================================================================
  if (hasPatternMatch(url, XSS_PATTERNS)) {
    addSuspicionScore(ip, 35)
    blockIP(ip, BLOCK_DURATION, 'XSS attempt')
    console.warn(`[SECURITY] XSS attempt: ${ip} - URL: ${url.substring(0, 200)}`)
    return blockedResponse('Invalid request')
  }

  // ==========================================================================
  // 7. PATH TRAVERSAL CHECK
  // ==========================================================================
  if (hasPatternMatch(path, PATH_TRAVERSAL_PATTERNS)) {
    addSuspicionScore(ip, 35)
    blockIP(ip, BLOCK_DURATION, 'Path traversal attempt')
    console.warn(`[SECURITY] Path traversal attempt: ${ip} - Path: ${path}`)
    return blockedResponse('Invalid request')
  }

  // ==========================================================================
  // 8. MISSING/EMPTY USER AGENT (Often bots)
  // ==========================================================================
  if (!userAgent || userAgent.length < 10) {
    addSuspicionScore(ip, 5)
    // Don't block, but track
  }

  // ==========================================================================
  // PROCEED WITH ADDITIONAL SECURITY HEADERS
  // ==========================================================================
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Add request ID for tracking
  const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  response.headers.set('X-Request-ID', requestId)

  return response
}

// =============================================================================
// MIDDLEWARE CONFIG
// =============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

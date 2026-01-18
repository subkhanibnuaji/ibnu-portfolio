/**
 * Advanced Security Middleware for Super Apps
 * Multi-layered defense against cyber attacks
 *
 * Features:
 * - DDoS protection
 * - Bot detection
 * - IP blocking/reputation
 * - Request validation
 * - Brute force protection
 * - SQL injection detection
 * - XSS detection
 * - Path traversal protection
 * - Honeypot traps
 */

import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

// =============================================================================
// TYPES
// =============================================================================

interface SecurityCheckResult {
  allowed: boolean
  reason?: string
  threat?: ThreatType
  severity?: 'low' | 'medium' | 'high' | 'critical'
}

type ThreatType =
  | 'ddos'
  | 'bot'
  | 'brute_force'
  | 'sql_injection'
  | 'xss'
  | 'path_traversal'
  | 'blocked_ip'
  | 'suspicious_ua'
  | 'honeypot'
  | 'payload_size'
  | 'invalid_content_type'

interface ThreatLog {
  timestamp: Date
  ip: string
  threat: ThreatType
  severity: string
  path: string
  userAgent: string
  details?: string
}

// =============================================================================
// STORAGE (In-memory, production should use Redis)
// =============================================================================

// IP-based rate limiting for DDoS protection
const requestCounts = new Map<string, { count: number; windowStart: number }>()

// Blocked IPs (temporary and permanent)
const blockedIPs = new Map<string, { until: number; reason: string; permanent: boolean }>()

// Failed login attempts for brute force protection
const failedLogins = new Map<string, { count: number; lastAttempt: number }>()

// Suspicious activity scores
const suspicionScores = new Map<string, { score: number; lastUpdate: number }>()

// Threat logs for monitoring
const threatLogs: ThreatLog[] = []
const MAX_THREAT_LOGS = 10000

// Known bad IPs (could be loaded from external source)
const knownBadIPs = new Set<string>([
  // Add known malicious IPs here
])

// =============================================================================
// CONFIGURATION
// =============================================================================

export const SECURITY_CONFIG = {
  // DDoS Protection
  ddos: {
    windowMs: 1000, // 1 second window
    maxRequestsPerSecond: 50, // Max requests per IP per second
    maxRequestsPerMinute: 300, // Max requests per IP per minute
    blockDuration: 60 * 60 * 1000, // 1 hour block
  },

  // Brute Force Protection
  bruteForce: {
    maxAttempts: 5, // Max failed attempts
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDuration: 30 * 60 * 1000, // 30 minutes block
    progressiveDelay: true, // Increase delay with each attempt
  },

  // Request Limits
  requestLimits: {
    maxBodySize: 10 * 1024 * 1024, // 10MB max body
    maxUrlLength: 2048, // Max URL length
    maxHeaderSize: 8192, // Max header size
  },

  // Suspicion Threshold
  suspicion: {
    maxScore: 100, // Score at which IP is blocked
    decayRate: 10, // Points reduced per hour
    blockDuration: 24 * 60 * 60 * 1000, // 24 hour block when threshold reached
  },
}

// =============================================================================
// SUSPICIOUS PATTERNS
// =============================================================================

// SQL Injection patterns
const SQL_INJECTION_PATTERNS = [
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
  /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
  /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
  /((\%27)|(\'))union/i,
  /exec(\s|\+)+(s|x)p\w+/i,
  /UNION(\s+)ALL(\s+)SELECT/i,
  /SELECT(\s+).*(\s+)FROM/i,
  /INSERT(\s+)INTO/i,
  /DELETE(\s+)FROM/i,
  /DROP(\s+)TABLE/i,
  /UPDATE(\s+).*(\s+)SET/i,
  /;(\s*)DROP/i,
  /1(\s*)=(\s*)1/i,
  /1'(\s*)OR(\s*)'1'(\s*)=(\s*)'1/i,
]

// XSS patterns
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<img[^>]+src[^>]+onerror/gi,
  /<svg[^>]+onload/gi,
  /data:text\/html/gi,
  /expression\s*\(/gi,
  /vbscript:/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
  /<link[^>]+href[^>]+javascript/gi,
]

// Path traversal patterns
const PATH_TRAVERSAL_PATTERNS = [
  /\.\.\//g,
  /\.\.\\/,
  /%2e%2e%2f/gi,
  /%2e%2e\//gi,
  /\.%2e\//gi,
  /%2e\.\//gi,
  /\.\.%2f/gi,
  /%2e%2e%5c/gi,
  /etc\/passwd/gi,
  /etc\/shadow/gi,
  /proc\/self/gi,
  /windows\/system32/gi,
]

// Suspicious User Agents
const SUSPICIOUS_USER_AGENTS = [
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
  /medusa/i,
  /havij/i,
  /acunetix/i,
  /netsparker/i,
  /burpsuite/i,
  /owasp/i,
  /w3af/i,
  /skipfish/i,
  /arachni/i,
  /grabber/i,
  /python-requests/i, // Often used by bots (be careful, legitimate use too)
  /curl/i, // Often used by bots
  /wget/i,
  /scrapy/i,
  /phantomjs/i,
  /headless/i,
]

// Known bot patterns (not necessarily malicious)
const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /slurp/i,
  /mediapartners/i,
]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getClientIP(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIP = req.headers.get('x-real-ip')
  if (realIP) return realIP

  const cfIP = req.headers.get('cf-connecting-ip')
  if (cfIP) return cfIP

  return 'unknown'
}

function logThreat(
  ip: string,
  threat: ThreatType,
  severity: string,
  path: string,
  userAgent: string,
  details?: string
): void {
  const log: ThreatLog = {
    timestamp: new Date(),
    ip,
    threat,
    severity,
    path,
    userAgent,
    details,
  }

  threatLogs.push(log)

  // Keep log size manageable
  if (threatLogs.length > MAX_THREAT_LOGS) {
    threatLogs.shift()
  }

  // Console log for monitoring
  console.warn(`[SECURITY THREAT] ${severity.toUpperCase()} - ${threat}`, {
    ip,
    path,
    details,
  })
}

function addSuspicionScore(ip: string, points: number): number {
  const now = Date.now()
  const existing = suspicionScores.get(ip)

  if (existing) {
    // Decay old score
    const hoursPassed = (now - existing.lastUpdate) / (60 * 60 * 1000)
    const decayedScore = Math.max(0, existing.score - (hoursPassed * SECURITY_CONFIG.suspicion.decayRate))
    const newScore = decayedScore + points

    suspicionScores.set(ip, { score: newScore, lastUpdate: now })

    // Auto-block if threshold reached
    if (newScore >= SECURITY_CONFIG.suspicion.maxScore) {
      blockIP(ip, SECURITY_CONFIG.suspicion.blockDuration, 'Suspicion threshold exceeded', false)
    }

    return newScore
  } else {
    suspicionScores.set(ip, { score: points, lastUpdate: now })
    return points
  }
}

export function blockIP(ip: string, durationMs: number, reason: string, permanent: boolean = false): void {
  blockedIPs.set(ip, {
    until: permanent ? Infinity : Date.now() + durationMs,
    reason,
    permanent,
  })

  logThreat(ip, 'blocked_ip', 'high', '/', '', `Blocked for: ${reason}`)
}

export function unblockIP(ip: string): boolean {
  return blockedIPs.delete(ip)
}

export function isIPBlocked(ip: string): { blocked: boolean; reason?: string } {
  const block = blockedIPs.get(ip)

  if (!block) return { blocked: false }

  if (!block.permanent && Date.now() > block.until) {
    blockedIPs.delete(ip)
    return { blocked: false }
  }

  return { blocked: true, reason: block.reason }
}

// =============================================================================
// SECURITY CHECKS
// =============================================================================

/**
 * Check for DDoS attack patterns
 */
export function checkDDoS(ip: string): SecurityCheckResult {
  const now = Date.now()
  const record = requestCounts.get(ip)

  if (!record || now - record.windowStart > 1000) {
    // New window
    requestCounts.set(ip, { count: 1, windowStart: now })
    return { allowed: true }
  }

  record.count++

  if (record.count > SECURITY_CONFIG.ddos.maxRequestsPerSecond) {
    addSuspicionScore(ip, 20)
    logThreat(ip, 'ddos', 'high', '/', '', `${record.count} requests/second`)

    // Block IP temporarily
    blockIP(ip, SECURITY_CONFIG.ddos.blockDuration, 'DDoS attack detected', false)

    return {
      allowed: false,
      reason: 'Rate limit exceeded',
      threat: 'ddos',
      severity: 'high',
    }
  }

  return { allowed: true }
}

/**
 * Check for SQL injection attempts
 */
export function checkSQLInjection(input: string): SecurityCheckResult {
  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return {
        allowed: false,
        reason: 'Potential SQL injection detected',
        threat: 'sql_injection',
        severity: 'critical',
      }
    }
  }
  return { allowed: true }
}

/**
 * Check for XSS attempts
 */
export function checkXSS(input: string): SecurityCheckResult {
  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(input)) {
      return {
        allowed: false,
        reason: 'Potential XSS attack detected',
        threat: 'xss',
        severity: 'high',
      }
    }
  }
  return { allowed: true }
}

/**
 * Check for path traversal attempts
 */
export function checkPathTraversal(path: string): SecurityCheckResult {
  for (const pattern of PATH_TRAVERSAL_PATTERNS) {
    if (pattern.test(path)) {
      return {
        allowed: false,
        reason: 'Path traversal attempt detected',
        threat: 'path_traversal',
        severity: 'high',
      }
    }
  }
  return { allowed: true }
}

/**
 * Check User Agent for suspicious patterns
 */
export function checkUserAgent(userAgent: string): SecurityCheckResult {
  if (!userAgent || userAgent.length < 10) {
    return {
      allowed: false,
      reason: 'Missing or invalid User-Agent',
      threat: 'suspicious_ua',
      severity: 'medium',
    }
  }

  for (const pattern of SUSPICIOUS_USER_AGENTS) {
    if (pattern.test(userAgent)) {
      return {
        allowed: false,
        reason: 'Suspicious User-Agent detected',
        threat: 'suspicious_ua',
        severity: 'high',
      }
    }
  }

  return { allowed: true }
}

/**
 * Check if request is from a bot
 */
export function isBot(userAgent: string): boolean {
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent))
}

/**
 * Check for brute force login attempts
 */
export function checkBruteForce(ip: string, success: boolean): SecurityCheckResult {
  const now = Date.now()
  const record = failedLogins.get(ip)

  if (success) {
    // Reset on successful login
    failedLogins.delete(ip)
    return { allowed: true }
  }

  if (!record || now - record.lastAttempt > SECURITY_CONFIG.bruteForce.windowMs) {
    // New window or expired
    failedLogins.set(ip, { count: 1, lastAttempt: now })
    return { allowed: true }
  }

  record.count++
  record.lastAttempt = now

  if (record.count >= SECURITY_CONFIG.bruteForce.maxAttempts) {
    addSuspicionScore(ip, 30)
    blockIP(ip, SECURITY_CONFIG.bruteForce.blockDuration, 'Brute force attack detected', false)

    return {
      allowed: false,
      reason: 'Too many failed login attempts',
      threat: 'brute_force',
      severity: 'high',
    }
  }

  // Progressive delay
  if (SECURITY_CONFIG.bruteForce.progressiveDelay) {
    const delay = Math.min(record.count * 1000, 10000) // Max 10 second delay
    // In real implementation, you'd want to delay the response
  }

  return { allowed: true }
}

/**
 * Check payload size
 */
export function checkPayloadSize(contentLength: number): SecurityCheckResult {
  if (contentLength > SECURITY_CONFIG.requestLimits.maxBodySize) {
    return {
      allowed: false,
      reason: 'Payload too large',
      threat: 'payload_size',
      severity: 'medium',
    }
  }
  return { allowed: true }
}

// =============================================================================
// MAIN SECURITY CHECK FUNCTION
// =============================================================================

export async function performSecurityCheck(req: NextRequest): Promise<SecurityCheckResult> {
  const ip = getClientIP(req)
  const userAgent = req.headers.get('user-agent') || ''
  const path = req.nextUrl.pathname
  const url = req.url

  // 1. Check if IP is blocked
  const blockCheck = isIPBlocked(ip)
  if (blockCheck.blocked) {
    return {
      allowed: false,
      reason: blockCheck.reason,
      threat: 'blocked_ip',
      severity: 'high',
    }
  }

  // 2. Check if IP is known bad
  if (knownBadIPs.has(ip)) {
    blockIP(ip, Infinity, 'Known malicious IP', true)
    logThreat(ip, 'blocked_ip', 'critical', path, userAgent, 'Known bad IP')
    return {
      allowed: false,
      reason: 'Access denied',
      threat: 'blocked_ip',
      severity: 'critical',
    }
  }

  // 3. DDoS check
  const ddosCheck = checkDDoS(ip)
  if (!ddosCheck.allowed) {
    logThreat(ip, 'ddos', 'high', path, userAgent)
    return ddosCheck
  }

  // 4. User Agent check (allow bots for SEO, but flag suspicious tools)
  const uaCheck = checkUserAgent(userAgent)
  if (!uaCheck.allowed) {
    addSuspicionScore(ip, 15)
    logThreat(ip, 'suspicious_ua', 'medium', path, userAgent)
    // Don't block immediately, just add to suspicion score
  }

  // 5. Path traversal check
  const pathCheck = checkPathTraversal(path)
  if (!pathCheck.allowed) {
    addSuspicionScore(ip, 25)
    logThreat(ip, 'path_traversal', 'high', path, userAgent)
    return pathCheck
  }

  // 6. Check URL for SQL injection and XSS
  const urlCheck = checkSQLInjection(url)
  if (!urlCheck.allowed) {
    addSuspicionScore(ip, 30)
    logThreat(ip, 'sql_injection', 'critical', path, userAgent, `URL: ${url.substring(0, 200)}`)
    return urlCheck
  }

  const xssUrlCheck = checkXSS(url)
  if (!xssUrlCheck.allowed) {
    addSuspicionScore(ip, 25)
    logThreat(ip, 'xss', 'high', path, userAgent, `URL: ${url.substring(0, 200)}`)
    return xssUrlCheck
  }

  // 7. Check Content-Length
  const contentLength = parseInt(req.headers.get('content-length') || '0')
  if (contentLength > 0) {
    const sizeCheck = checkPayloadSize(contentLength)
    if (!sizeCheck.allowed) {
      addSuspicionScore(ip, 10)
      logThreat(ip, 'payload_size', 'medium', path, userAgent, `Size: ${contentLength}`)
      return sizeCheck
    }
  }

  return { allowed: true }
}

/**
 * Check request body for attacks
 */
export async function checkRequestBody(body: string, ip: string, path: string, userAgent: string): Promise<SecurityCheckResult> {
  // SQL Injection check
  const sqlCheck = checkSQLInjection(body)
  if (!sqlCheck.allowed) {
    addSuspicionScore(ip, 30)
    logThreat(ip, 'sql_injection', 'critical', path, userAgent, 'In request body')
    return sqlCheck
  }

  // XSS check
  const xssCheck = checkXSS(body)
  if (!xssCheck.allowed) {
    addSuspicionScore(ip, 25)
    logThreat(ip, 'xss', 'high', path, userAgent, 'In request body')
    return xssCheck
  }

  return { allowed: true }
}

// =============================================================================
// HONEYPOT ENDPOINTS
// =============================================================================

export const HONEYPOT_PATHS = [
  '/admin.php',
  '/wp-admin',
  '/wp-login.php',
  '/phpmyadmin',
  '/administrator',
  '/.env',
  '/.git/config',
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
  '/.aws/credentials',
  '/id_rsa',
  '/id_rsa.pub',
]

export function isHoneypotPath(path: string): boolean {
  return HONEYPOT_PATHS.some(hp => path.toLowerCase().includes(hp.toLowerCase()))
}

export function handleHoneypot(ip: string, path: string, userAgent: string): void {
  // Immediately block IP that accesses honeypot
  addSuspicionScore(ip, 50)
  blockIP(ip, 24 * 60 * 60 * 1000, 'Honeypot access', false)
  logThreat(ip, 'honeypot', 'critical', path, userAgent, 'Honeypot path accessed')
}

// =============================================================================
// EXPORTS FOR MONITORING
// =============================================================================

export function getThreatLogs(limit: number = 100): ThreatLog[] {
  return threatLogs.slice(-limit)
}

export function getBlockedIPs(): Map<string, { until: number; reason: string; permanent: boolean }> {
  return new Map(blockedIPs)
}

export function getSuspicionScores(): Map<string, { score: number; lastUpdate: number }> {
  return new Map(suspicionScores)
}

export function getSecurityStats() {
  const now = Date.now()
  const last24h = threatLogs.filter(log => now - log.timestamp.getTime() < 24 * 60 * 60 * 1000)

  const threatsByType = last24h.reduce((acc, log) => {
    acc[log.threat] = (acc[log.threat] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const threatsBySeverity = last24h.reduce((acc, log) => {
    acc[log.severity] = (acc[log.severity] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    totalThreatsLast24h: last24h.length,
    blockedIPs: blockedIPs.size,
    threatsByType,
    threatsBySeverity,
    topOffenders: Array.from(
      last24h.reduce((acc, log) => {
        acc.set(log.ip, (acc.get(log.ip) || 0) + 1)
        return acc
      }, new Map<string, number>())
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, count })),
  }
}

// Cleanup function to run periodically
export function cleanupExpiredData(): void {
  const now = Date.now()

  // Clean expired blocks
  for (const [ip, block] of blockedIPs.entries()) {
    if (!block.permanent && now > block.until) {
      blockedIPs.delete(ip)
    }
  }

  // Clean expired rate limits
  for (const [ip, record] of requestCounts.entries()) {
    if (now - record.windowStart > 60000) { // 1 minute
      requestCounts.delete(ip)
    }
  }

  // Clean expired failed logins
  for (const [ip, record] of failedLogins.entries()) {
    if (now - record.lastAttempt > SECURITY_CONFIG.bruteForce.windowMs) {
      failedLogins.delete(ip)
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredData, 5 * 60 * 1000)
}

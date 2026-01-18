/**
 * CSP Violation Report Endpoint
 *
 * Receives Content Security Policy violation reports from browsers
 * and logs them for security monitoring.
 *
 * To enable, add this to your CSP header:
 * report-uri /api/monitoring/csp-report;
 * report-to csp-endpoint;
 */

import { NextRequest, NextResponse } from 'next/server'
import { trackSecurityEvent } from '@/lib/monitoring/sentry'
import { getClientIp } from '@/lib/security'

// Store CSP violations (in-memory, use Redis/DB in production)
const cspViolations: CSPViolation[] = []
const MAX_VIOLATIONS = 1000

interface CSPViolation {
  timestamp: Date
  ip: string
  userAgent: string
  documentUri: string
  blockedUri: string
  violatedDirective: string
  effectiveDirective: string
  originalPolicy: string
  disposition: string
  statusCode: number
  sourceFile?: string
  lineNumber?: number
  columnNumber?: number
}

interface CSPReport {
  'csp-report'?: {
    'document-uri': string
    'blocked-uri': string
    'violated-directive': string
    'effective-directive': string
    'original-policy': string
    disposition: string
    'status-code': number
    'source-file'?: string
    'line-number'?: number
    'column-number'?: number
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || ''

    // CSP reports are sent as application/csp-report or application/json
    if (
      !contentType.includes('application/csp-report') &&
      !contentType.includes('application/json')
    ) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
    }

    const body: CSPReport = await req.json()
    const report = body['csp-report']

    if (!report) {
      return NextResponse.json({ error: 'Invalid report format' }, { status: 400 })
    }

    const violation: CSPViolation = {
      timestamp: new Date(),
      ip: getClientIp(req),
      userAgent: req.headers.get('user-agent') || 'unknown',
      documentUri: report['document-uri'],
      blockedUri: report['blocked-uri'],
      violatedDirective: report['violated-directive'],
      effectiveDirective: report['effective-directive'],
      originalPolicy: report['original-policy'],
      disposition: report.disposition,
      statusCode: report['status-code'],
      sourceFile: report['source-file'],
      lineNumber: report['line-number'],
      columnNumber: report['column-number'],
    }

    // Store violation
    cspViolations.push(violation)
    if (cspViolations.length > MAX_VIOLATIONS) {
      cspViolations.shift()
    }

    // Log to Sentry if configured
    trackSecurityEvent('csp_violation', {
      blockedUri: violation.blockedUri,
      violatedDirective: violation.violatedDirective,
      documentUri: violation.documentUri,
    })

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('[CSP Violation]', {
        blockedUri: violation.blockedUri,
        violatedDirective: violation.violatedDirective,
      })
    }

    return NextResponse.json({ received: true }, { status: 204 })
  } catch (error) {
    console.error('CSP report error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// GET endpoint for viewing CSP violations (admin only)
export async function GET(req: NextRequest) {
  // In production, add authentication check here
  const { searchParams } = new URL(req.url)
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '50'))

  return NextResponse.json({
    violations: cspViolations.slice(-limit),
    total: cspViolations.length,
  })
}

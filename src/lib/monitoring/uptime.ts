/**
 * Uptime Monitoring Integration
 *
 * FREE Services to use:
 * 1. UptimeRobot (https://uptimerobot.com)
 *    - 50 monitors free
 *    - 5-minute interval
 *    - Email/SMS alerts
 *
 * 2. Better Uptime (https://betteruptime.com)
 *    - 10 monitors free
 *    - 3-minute interval
 *    - Status page
 *
 * 3. Freshping (https://freshping.io)
 *    - 50 monitors free
 *    - 1-minute interval
 *    - Public status page
 *
 * 4. Uptime Kuma (https://github.com/louislam/uptime-kuma)
 *    - Self-hosted, unlimited
 *    - 1-second to 1-day interval
 *    - Many notification options
 *
 * Configuration:
 * Point these services to: /api/monitoring/health
 */

// =============================================================================
// UPTIME STATUS TYPES
// =============================================================================

export interface UptimeStatus {
  status: 'up' | 'down' | 'degraded'
  lastChecked: Date
  uptime: number // percentage
  responseTime: number // ms
  incidents: Incident[]
}

export interface Incident {
  id: string
  title: string
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  startedAt: Date
  resolvedAt?: Date
  updates: IncidentUpdate[]
}

export interface IncidentUpdate {
  timestamp: Date
  status: string
  message: string
}

// =============================================================================
// STATUS PAGE DATA
// =============================================================================

const incidents: Incident[] = []
const statusHistory: { timestamp: Date; status: 'up' | 'down' }[] = []
const MAX_HISTORY = 1000

export function getUptimeStatus(): UptimeStatus {
  // Calculate uptime percentage from history
  const last24h = statusHistory.filter(
    (h) => Date.now() - h.timestamp.getTime() < 24 * 60 * 60 * 1000
  )

  const upCount = last24h.filter((h) => h.status === 'up').length
  const uptime = last24h.length > 0 ? (upCount / last24h.length) * 100 : 100

  // Get current status
  const currentStatus = statusHistory[statusHistory.length - 1]?.status || 'up'

  return {
    status: currentStatus === 'up' ? 'up' : 'down',
    lastChecked: new Date(),
    uptime: Math.round(uptime * 100) / 100,
    responseTime: 0, // Would be calculated from actual checks
    incidents: incidents.filter((i) => i.status !== 'resolved').slice(0, 5),
  }
}

export function recordStatus(status: 'up' | 'down') {
  statusHistory.push({ timestamp: new Date(), status })
  if (statusHistory.length > MAX_HISTORY) {
    statusHistory.shift()
  }
}

// =============================================================================
// INCIDENT MANAGEMENT
// =============================================================================

export function createIncident(title: string, message: string): Incident {
  const incident: Incident = {
    id: `inc_${Date.now()}`,
    title,
    status: 'investigating',
    startedAt: new Date(),
    updates: [
      {
        timestamp: new Date(),
        status: 'investigating',
        message,
      },
    ],
  }

  incidents.unshift(incident)
  return incident
}

export function updateIncident(
  incidentId: string,
  status: Incident['status'],
  message: string
) {
  const incident = incidents.find((i) => i.id === incidentId)
  if (!incident) return null

  incident.status = status
  incident.updates.push({
    timestamp: new Date(),
    status,
    message,
  })

  if (status === 'resolved') {
    incident.resolvedAt = new Date()
  }

  return incident
}

export function getIncidents(limit = 10): Incident[] {
  return incidents.slice(0, limit)
}

// =============================================================================
// WEBHOOK HANDLERS
// =============================================================================

/**
 * Handle webhook from UptimeRobot
 */
export function handleUptimeRobotWebhook(payload: {
  monitorID: string
  monitorURL: string
  monitorFriendlyName: string
  alertType: number // 1 = down, 2 = up
  alertTypeFriendlyName: string
  alertDetails: string
  alertDuration?: number
}) {
  const isDown = payload.alertType === 1

  recordStatus(isDown ? 'down' : 'up')

  if (isDown) {
    createIncident(
      `${payload.monitorFriendlyName} is down`,
      payload.alertDetails || 'Service is not responding'
    )
  } else {
    // Resolve any open incidents for this monitor
    const openIncident = incidents.find(
      (i) =>
        i.status !== 'resolved' &&
        i.title.includes(payload.monitorFriendlyName)
    )
    if (openIncident) {
      updateIncident(
        openIncident.id,
        'resolved',
        `Service recovered after ${payload.alertDuration || 'unknown'} seconds`
      )
    }
  }
}

/**
 * Handle webhook from Better Uptime
 */
export function handleBetterUptimeWebhook(payload: {
  data: {
    id: string
    type: string
    attributes: {
      url: string
      status: string
      started_at?: string
      resolved_at?: string
      cause?: string
    }
  }
}) {
  const { attributes } = payload.data
  const isDown = attributes.status === 'down'

  recordStatus(isDown ? 'down' : 'up')

  if (isDown) {
    createIncident(
      `Service outage: ${attributes.url}`,
      attributes.cause || 'Service is not responding'
    )
  }
}

// =============================================================================
// SELF-MONITORING
// =============================================================================

/**
 * Perform a self-health check
 */
export async function selfHealthCheck(): Promise<{
  healthy: boolean
  checks: Record<string, boolean>
}> {
  const checks: Record<string, boolean> = {}

  // Check if critical endpoints respond
  const endpoints = [
    '/api/monitoring/health',
    '/api/health',
  ]

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
      })
      checks[endpoint] = response.ok
    } catch {
      checks[endpoint] = false
    }
  }

  const healthy = Object.values(checks).every(Boolean)
  recordStatus(healthy ? 'up' : 'down')

  return { healthy, checks }
}

// =============================================================================
// STATUS BADGE
// =============================================================================

export function getStatusBadge(): {
  color: string
  text: string
  svg: string
} {
  const status = getUptimeStatus()

  const colors = {
    up: '4ade80', // green
    down: 'ef4444', // red
    degraded: 'fbbf24', // yellow
  }

  const color = colors[status.status]
  const text = status.status === 'up' ? 'operational' : status.status

  // Simple SVG badge
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="20">
      <rect width="100" height="20" fill="#${color}" rx="3"/>
      <text x="50" y="14" fill="white" font-family="Arial" font-size="11" text-anchor="middle">
        ${text}
      </text>
    </svg>
  `.trim()

  return { color, text, svg }
}

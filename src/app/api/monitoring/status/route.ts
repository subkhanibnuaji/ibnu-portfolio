/**
 * Public Status API
 *
 * Returns current system status and recent incidents.
 * Can be used to power a status page.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getUptimeStatus, getIncidents, getStatusBadge } from '@/lib/monitoring/uptime'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const format = searchParams.get('format')

  // Return SVG badge
  if (format === 'badge') {
    const { svg } = getStatusBadge()
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache',
      },
    })
  }

  // Return JSON status
  const status = getUptimeStatus()
  const incidents = getIncidents(5)

  return NextResponse.json({
    status: status.status,
    uptime: status.uptime,
    lastChecked: status.lastChecked.toISOString(),
    incidents: incidents.map((i) => ({
      id: i.id,
      title: i.title,
      status: i.status,
      startedAt: i.startedAt.toISOString(),
      resolvedAt: i.resolvedAt?.toISOString(),
    })),
    components: {
      website: 'operational',
      api: 'operational',
      database: 'operational',
      cdn: 'operational',
    },
  })
}

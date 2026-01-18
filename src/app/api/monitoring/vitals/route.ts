import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for vitals (use Redis/DB in production)
const vitalsStore: Map<string, VitalEntry[]> = new Map()

interface VitalEntry {
  id: string
  name: string
  value: number
  rating: string
  delta: number
  url: string
  timestamp: number
  userAgent: string
}

// Keep only last 1000 entries per metric
const MAX_ENTRIES_PER_METRIC = 1000

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { id, name, value, rating, delta, url, timestamp, userAgent } = body

    // Validate required fields
    if (!name || typeof value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid vital data' },
        { status: 400 }
      )
    }

    // Store the vital
    const entry: VitalEntry = {
      id: id || crypto.randomUUID(),
      name,
      value,
      rating: rating || 'unknown',
      delta: delta || 0,
      url: url || '/',
      timestamp: timestamp || Date.now(),
      userAgent: userAgent || 'unknown',
    }

    const entries = vitalsStore.get(name) || []
    entries.push(entry)

    // Keep only recent entries
    if (entries.length > MAX_ENTRIES_PER_METRIC) {
      entries.shift()
    }

    vitalsStore.set(name, entries)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to record vital' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return aggregated vitals data
  const aggregated: Record<string, {
    count: number
    average: number
    p75: number
    p95: number
    good: number
    needsImprovement: number
    poor: number
  }> = {}

  for (const [name, entries] of vitalsStore.entries()) {
    if (entries.length === 0) continue

    const values = entries.map(e => e.value).sort((a, b) => a - b)
    const ratings = entries.map(e => e.rating)

    const sum = values.reduce((a, b) => a + b, 0)
    const p75Index = Math.floor(values.length * 0.75)
    const p95Index = Math.floor(values.length * 0.95)

    aggregated[name] = {
      count: entries.length,
      average: sum / entries.length,
      p75: values[p75Index] || 0,
      p95: values[p95Index] || 0,
      good: ratings.filter(r => r === 'good').length,
      needsImprovement: ratings.filter(r => r === 'needs-improvement').length,
      poor: ratings.filter(r => r === 'poor').length,
    }
  }

  return NextResponse.json({
    vitals: aggregated,
    timestamp: Date.now(),
  })
}

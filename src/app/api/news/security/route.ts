import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // Revalidate every 5 minutes

interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  imageUrl?: string
  category: string
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'info'
}

// Security-focused RSS feeds
const SECURITY_RSS_FEEDS = [
  {
    url: 'https://www.bleepingcomputer.com/feed/',
    source: 'BleepingComputer',
  },
  {
    url: 'https://feeds.feedburner.com/TheHackersNews',
    source: 'The Hacker News',
  },
  {
    url: 'https://krebsonsecurity.com/feed/',
    source: 'Krebs on Security',
  },
  {
    url: 'https://www.darkreading.com/rss.xml',
    source: 'Dark Reading',
  },
]

// Keywords for severity classification
const CRITICAL_KEYWORDS = ['zero-day', '0-day', 'critical vulnerability', 'ransomware attack', 'data breach', 'exploited in wild']
const HIGH_KEYWORDS = ['vulnerability', 'exploit', 'malware', 'backdoor', 'remote code execution', 'rce']
const MEDIUM_KEYWORDS = ['security flaw', 'patch', 'update', 'bug', 'cve-']

function classifySeverity(title: string, description: string): NewsItem['severity'] {
  const text = `${title} ${description}`.toLowerCase()

  if (CRITICAL_KEYWORDS.some(kw => text.includes(kw))) return 'critical'
  if (HIGH_KEYWORDS.some(kw => text.includes(kw))) return 'high'
  if (MEDIUM_KEYWORDS.some(kw => text.includes(kw))) return 'medium'
  return 'info'
}

async function parseRSSFeed(feedUrl: string, source: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SecurityNewsBot/1.0)',
      },
      next: { revalidate: 300 }
    })

    if (!response.ok) {
      console.error(`Failed to fetch RSS from ${source}`)
      return []
    }

    const xml = await response.text()
    const items: NewsItem[] = []

    // Simple XML parsing for RSS items
    const itemMatches = xml.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || []

    for (const itemXml of itemMatches.slice(0, 8)) {
      const title = itemXml.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)?.[1]?.trim()
      const link = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim() ||
                   itemXml.match(/<link[^>]*href="([^"]*)"[^>]*\/>/i)?.[1]
      const description = itemXml.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i)?.[1]?.trim()
      const pubDate = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim()
      const imageUrl = itemXml.match(/<media:content[^>]*url="([^"]*)"[^>]*>/i)?.[1] ||
                       itemXml.match(/<media:thumbnail[^>]*url="([^"]*)"[^>]*>/i)?.[1] ||
                       itemXml.match(/<enclosure[^>]*url="([^"]*)"[^>]*>/i)?.[1]

      if (title && link) {
        const cleanTitle = title.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'")
        const cleanDesc = description?.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").slice(0, 250) || ''

        items.push({
          id: Buffer.from(link).toString('base64').slice(0, 16),
          title: cleanTitle,
          description: cleanDesc,
          url: link,
          source,
          publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          imageUrl,
          category: 'security',
          severity: classifySeverity(cleanTitle, cleanDesc),
        })
      }
    }

    return items
  } catch (error) {
    console.error(`Error parsing RSS from ${source}:`, error)
    return []
  }
}

export async function GET() {
  try {
    // Fetch from all RSS feeds in parallel
    const feedPromises = SECURITY_RSS_FEEDS.map(feed =>
      parseRSSFeed(feed.url, feed.source)
    )

    const feedResults = await Promise.all(feedPromises)
    const allNews = feedResults.flat()

    // Sort by date, prioritize by severity, and deduplicate
    const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3, info: 4 }
    const seen = new Set<string>()
    const uniqueNews = allNews
      .sort((a, b) => {
        // First sort by severity
        const sevDiff = (severityOrder[a.severity || 'info'] || 4) - (severityOrder[b.severity || 'info'] || 4)
        if (sevDiff !== 0) return sevDiff
        // Then by date
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      })
      .filter(item => {
        const key = item.title.toLowerCase().slice(0, 50)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .slice(0, 25)

    // Count by severity
    const severityCounts = {
      critical: uniqueNews.filter(n => n.severity === 'critical').length,
      high: uniqueNews.filter(n => n.severity === 'high').length,
      medium: uniqueNews.filter(n => n.severity === 'medium').length,
      info: uniqueNews.filter(n => n.severity === 'info' || n.severity === 'low').length,
    }

    return NextResponse.json({
      success: true,
      data: uniqueNews,
      count: uniqueNews.length,
      severityCounts,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Security News API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch security news',
        data: []
      },
      { status: 500 }
    )
  }
}

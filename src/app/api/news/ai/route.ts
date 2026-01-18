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
  tags?: string[]
}

// AI-focused RSS feeds
const AI_RSS_FEEDS = [
  {
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    source: 'TechCrunch AI',
  },
  {
    url: 'https://www.artificialintelligence-news.com/feed/',
    source: 'AI News',
  },
  {
    url: 'https://venturebeat.com/category/ai/feed/',
    source: 'VentureBeat AI',
  },
  {
    url: 'https://www.marktechpost.com/feed/',
    source: 'MarkTechPost',
  },
]

// Keywords for categorization
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'LLM': ['llm', 'large language model', 'gpt', 'claude', 'gemini', 'llama', 'chatbot'],
  'Computer Vision': ['vision', 'image', 'visual', 'detection', 'recognition', 'video'],
  'Robotics': ['robot', 'autonomous', 'humanoid', 'automation'],
  'Research': ['research', 'paper', 'study', 'breakthrough', 'discovery'],
  'Business': ['funding', 'startup', 'investment', 'acquisition', 'company'],
  'Regulation': ['regulation', 'policy', 'law', 'government', 'safety', 'ethics'],
}

function extractTags(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase()
  const tags: string[] = []

  for (const [tag, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) {
      tags.push(tag)
    }
  }

  return tags.slice(0, 3)
}

async function parseRSSFeed(feedUrl: string, source: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AINewsBot/1.0)',
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
      const description = itemXml.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i)?.[1]?.trim() ||
                          itemXml.match(/<content:encoded[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/i)?.[1]?.trim()
      const pubDate = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim()
      const imageUrl = itemXml.match(/<media:content[^>]*url="([^"]*)"[^>]*>/i)?.[1] ||
                       itemXml.match(/<media:thumbnail[^>]*url="([^"]*)"[^>]*>/i)?.[1] ||
                       itemXml.match(/<enclosure[^>]*url="([^"]*)"[^>]*type="image[^>]*>/i)?.[1] ||
                       itemXml.match(/src="(https?:\/\/[^"]*(?:jpg|jpeg|png|gif|webp)[^"]*)"/i)?.[1]

      if (title && link) {
        const cleanTitle = title.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&#8217;/g, "'")
        const cleanDesc = description?.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&#8217;/g, "'").slice(0, 250) || ''

        items.push({
          id: Buffer.from(link).toString('base64').slice(0, 16),
          title: cleanTitle,
          description: cleanDesc,
          url: link,
          source,
          publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          imageUrl,
          category: 'ai',
          tags: extractTags(cleanTitle, cleanDesc),
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
    const feedPromises = AI_RSS_FEEDS.map(feed =>
      parseRSSFeed(feed.url, feed.source)
    )

    const feedResults = await Promise.all(feedPromises)
    const allNews = feedResults.flat()

    // Sort by date and deduplicate
    const seen = new Set<string>()
    const uniqueNews = allNews
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .filter(item => {
        const key = item.title.toLowerCase().slice(0, 50)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .slice(0, 25)

    // Count by tags
    const tagCounts: Record<string, number> = {}
    uniqueNews.forEach(item => {
      item.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })

    return NextResponse.json({
      success: true,
      data: uniqueNews,
      count: uniqueNews.length,
      tagCounts,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('AI News API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch AI news',
        data: []
      },
      { status: 500 }
    )
  }
}

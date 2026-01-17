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
}

// Multiple RSS feed sources for crypto news
const CRYPTO_RSS_FEEDS = [
  {
    url: 'https://cointelegraph.com/rss',
    source: 'CoinTelegraph',
  },
  {
    url: 'https://cryptonews.com/news/feed/',
    source: 'CryptoNews',
  },
]

async function parseRSSFeed(feedUrl: string, source: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
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

    for (const itemXml of itemMatches.slice(0, 10)) {
      const title = itemXml.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)?.[1]?.trim()
      const link = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim()
      const description = itemXml.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i)?.[1]?.trim()
      const pubDate = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim()
      const imageUrl = itemXml.match(/<media:content[^>]*url="([^"]*)"[^>]*>/i)?.[1] ||
                       itemXml.match(/<enclosure[^>]*url="([^"]*)"[^>]*>/i)?.[1] ||
                       itemXml.match(/<img[^>]*src="([^"]*)"[^>]*>/i)?.[1]

      if (title && link) {
        items.push({
          id: Buffer.from(link).toString('base64').slice(0, 16),
          title: title.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'),
          description: description?.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').slice(0, 200) || '',
          url: link,
          source,
          publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          imageUrl,
          category: 'crypto',
        })
      }
    }

    return items
  } catch (error) {
    console.error(`Error parsing RSS from ${source}:`, error)
    return []
  }
}

// Fallback: Use a free news API
async function fetchFromNewsAPI(): Promise<NewsItem[]> {
  try {
    // Using GNews API (free tier: 100 requests/day)
    const response = await fetch(
      'https://gnews.io/api/v4/search?q=bitcoin+OR+cryptocurrency+OR+blockchain&lang=en&max=15&apikey=demo',
      { next: { revalidate: 300 } }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()

    return (data.articles || []).map((article: {
      title: string
      description: string
      url: string
      source: { name: string }
      publishedAt: string
      image?: string
    }) => ({
      id: Buffer.from(article.url).toString('base64').slice(0, 16),
      title: article.title,
      description: article.description?.slice(0, 200) || '',
      url: article.url,
      source: article.source?.name || 'GNews',
      publishedAt: article.publishedAt,
      imageUrl: article.image,
      category: 'crypto',
    }))
  } catch {
    return []
  }
}

export async function GET() {
  try {
    // Try RSS feeds first
    const feedPromises = CRYPTO_RSS_FEEDS.map(feed =>
      parseRSSFeed(feed.url, feed.source)
    )

    const feedResults = await Promise.all(feedPromises)
    let allNews = feedResults.flat()

    // If RSS feeds fail or return little data, try news API
    if (allNews.length < 5) {
      const apiNews = await fetchFromNewsAPI()
      allNews = [...allNews, ...apiNews]
    }

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
      .slice(0, 20)

    return NextResponse.json({
      success: true,
      data: uniqueNews,
      count: uniqueNews.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Crypto News API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch crypto news',
        data: []
      },
      { status: 500 }
    )
  }
}

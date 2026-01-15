import { NextResponse } from 'next/server'

const BASE_URL = 'https://ibnu-portfolio-ashen.vercel.app'
const SITE_TITLE = 'Ibnu Portfolio - AI, Blockchain, Cybersecurity'
const SITE_DESCRIPTION = 'Articles and insights on AI, Blockchain, Cybersecurity, and Technology by Subkhan Ibnu Aji'

// Mock blog posts - replace with DB query when available
const BLOG_POSTS = [
  {
    slug: 'getting-started-with-agentic-ai',
    title: 'Getting Started with Agentic AI: Building Autonomous Systems',
    description: 'Learn how to build autonomous AI agents that can reason, plan, and execute complex tasks using LangChain and modern LLM frameworks.',
    date: '2024-01-15',
    category: 'AI'
  },
  {
    slug: 'defi-portfolio-management',
    title: 'DeFi Portfolio Management: A Comprehensive Guide',
    description: 'Strategies for managing your DeFi portfolio across multiple chains, protocols, and risk levels.',
    date: '2024-01-10',
    category: 'Blockchain'
  },
  {
    slug: 'building-secure-web-apps',
    title: 'Building Secure Web Applications: OWASP Top 10 Guide',
    description: 'A practical guide to securing your web applications against the most common vulnerabilities.',
    date: '2024-01-05',
    category: 'Cybersecurity'
  }
]

function generateRSSFeed() {
  const items = BLOG_POSTS.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${post.category}</category>
    </item>
  `).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${BASE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE_URL}/og-image.png</url>
      <title>${SITE_TITLE}</title>
      <link>${BASE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`
}

export async function GET() {
  const feed = generateRSSFeed()

  return new NextResponse(feed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}

import { MetadataRoute } from 'next'

const BASE_URL = 'https://ibnu-portfolio-ashen.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString()

  // Static pages
  const staticPages = [
    { url: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { url: '/about', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/projects', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/interests', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/certifications', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/blog', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/contact', priority: 0.7, changeFrequency: 'yearly' as const },
  ]

  // Project detail pages (mock data - replace with DB query when available)
  const projectSlugs = ['hub-pkp', 'automate-all', 'crypto-portfolio']
  const projectPages = projectSlugs.map(slug => ({
    url: `/projects/${slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }))

  // Blog post pages (mock data - replace with DB query when available)
  const blogSlugs = [
    'getting-started-with-agentic-ai',
    'defi-portfolio-management',
    'building-secure-web-apps'
  ]
  const blogPages = blogSlugs.map(slug => ({
    url: `/blog/${slug}`,
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }))

  // Combine all pages
  const allPages = [...staticPages, ...projectPages, ...blogPages]

  return allPages.map(page => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: currentDate,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}

// ML-based content recommendation engine
// Uses collaborative filtering and content-based filtering hybrid approach

interface ContentItem {
  id: string
  title: string
  type: 'project' | 'blog' | 'certification'
  tags: string[]
  category: string
  popularity: number // 0-100
  createdAt: string
}

// Sample content database
const CONTENT_DATABASE: ContentItem[] = [
  // Projects
  { id: 'hub-pkp', title: 'HUB PKP - Klinik Rumah', type: 'project', tags: ['AI', 'React', 'Government'], category: 'AI', popularity: 95, createdAt: '2024-01-01' },
  { id: 'automate-all', title: 'Automate All - RPA Solutions', type: 'project', tags: ['RPA', 'Python', 'Automation'], category: 'Automation', popularity: 88, createdAt: '2022-08-01' },
  { id: 'crypto-portfolio', title: 'Crypto Portfolio Tracker', type: 'project', tags: ['Web3', 'DeFi', 'React'], category: 'Blockchain', popularity: 82, createdAt: '2023-06-01' },
  { id: 'icp-dapp', title: 'ICP Token dApp', type: 'project', tags: ['Web3', 'Solidity', 'Blockchain'], category: 'Blockchain', popularity: 75, createdAt: '2023-03-01' },

  // Blog posts
  { id: 'agentic-ai', title: 'Getting Started with Agentic AI', type: 'blog', tags: ['AI', 'LangChain', 'Tutorial'], category: 'AI', popularity: 90, createdAt: '2024-01-15' },
  { id: 'defi-guide', title: 'DeFi Portfolio Management', type: 'blog', tags: ['DeFi', 'Crypto', 'Investment'], category: 'Blockchain', popularity: 85, createdAt: '2024-01-10' },
  { id: 'web-security', title: 'Building Secure Web Apps', type: 'blog', tags: ['Security', 'OWASP', 'Web'], category: 'Security', popularity: 88, createdAt: '2024-01-05' },
  { id: 'prompt-engineering', title: 'Prompt Engineering Masterclass', type: 'blog', tags: ['AI', 'LLM', 'Tutorial'], category: 'AI', popularity: 92, createdAt: '2024-01-01' },
  { id: 'smart-contracts', title: 'Smart Contract Security', type: 'blog', tags: ['Blockchain', 'Security', 'Solidity'], category: 'Security', popularity: 78, createdAt: '2023-12-28' },

  // Certifications
  { id: 'google-cyber', title: 'Google Cybersecurity Professional', type: 'certification', tags: ['Security', 'Google'], category: 'Security', popularity: 95, createdAt: '2023-01-01' },
  { id: 'stanford-ml', title: 'Stanford Machine Learning', type: 'certification', tags: ['AI', 'ML', 'Stanford'], category: 'AI', popularity: 98, createdAt: '2023-06-01' },
  { id: 'aws-cloud', title: 'AWS Cloud Fundamentals', type: 'certification', tags: ['Cloud', 'AWS'], category: 'Cloud', popularity: 85, createdAt: '2023-03-01' },
]

// Calculate Jaccard similarity between two tag sets
function jaccardSimilarity(tags1: string[], tags2: string[]): number {
  const set1 = new Set(tags1.map(t => t.toLowerCase()))
  const set2 = new Set(tags2.map(t => t.toLowerCase()))

  const intersection = new Set([...set1].filter(x => set2.has(x)))
  const union = new Set([...set1, ...set2])

  return intersection.size / union.size
}

// Calculate content similarity score
function contentSimilarity(item1: ContentItem, item2: ContentItem): number {
  let score = 0

  // Tag similarity (40% weight)
  score += jaccardSimilarity(item1.tags, item2.tags) * 0.4

  // Category match (30% weight)
  if (item1.category === item2.category) {
    score += 0.3
  }

  // Type match (10% weight)
  if (item1.type === item2.type) {
    score += 0.1
  }

  // Recency boost (10% weight)
  const daysDiff = Math.abs(
    (new Date(item1.createdAt).getTime() - new Date(item2.createdAt).getTime()) /
    (1000 * 60 * 60 * 24)
  )
  const recencyScore = Math.max(0, 1 - daysDiff / 365)
  score += recencyScore * 0.1

  // Popularity factor (10% weight)
  const avgPopularity = (item1.popularity + item2.popularity) / 200
  score += avgPopularity * 0.1

  return score
}

// Get recommendations based on a content item
export function getRecommendations(
  currentItemId: string,
  limit: number = 4
): ContentItem[] {
  const currentItem = CONTENT_DATABASE.find(item => item.id === currentItemId)
  if (!currentItem) return []

  const scores = CONTENT_DATABASE
    .filter(item => item.id !== currentItemId)
    .map(item => ({
      item,
      score: contentSimilarity(currentItem, item)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return scores.map(s => s.item)
}

// Get recommendations based on user interests (tags they've interacted with)
export function getPersonalizedRecommendations(
  userInterests: string[],
  viewedItems: string[] = [],
  limit: number = 6
): ContentItem[] {
  const scores = CONTENT_DATABASE
    .filter(item => !viewedItems.includes(item.id))
    .map(item => {
      // Calculate interest match score
      const interestScore = jaccardSimilarity(item.tags, userInterests)

      // Popularity boost
      const popularityScore = item.popularity / 100

      // Recency boost
      const daysSinceCreated = (Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      const recencyScore = Math.max(0, 1 - daysSinceCreated / 365)

      // Combined score
      const totalScore = (interestScore * 0.5) + (popularityScore * 0.3) + (recencyScore * 0.2)

      return { item, score: totalScore }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return scores.map(s => s.item)
}

// Get trending content (based on popularity and recency)
export function getTrendingContent(limit: number = 5): ContentItem[] {
  const now = Date.now()

  return CONTENT_DATABASE
    .map(item => {
      const daysSinceCreated = (now - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      const recencyBoost = Math.max(0, 1 - daysSinceCreated / 90) // Boost for last 90 days
      const trendScore = (item.popularity / 100) * 0.6 + recencyBoost * 0.4

      return { item, score: trendScore }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.item)
}

// Get content by category with smart ordering
export function getContentByCategory(
  category: string,
  excludeIds: string[] = [],
  limit: number = 4
): ContentItem[] {
  return CONTENT_DATABASE
    .filter(item =>
      item.category === category &&
      !excludeIds.includes(item.id)
    )
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
}

// Get diverse recommendations (mix of different types and categories)
export function getDiverseRecommendations(
  excludeIds: string[] = [],
  limit: number = 6
): ContentItem[] {
  const results: ContentItem[] = []
  const usedCategories = new Set<string>()
  const usedTypes = new Set<string>()

  // Sort by popularity
  const sorted = [...CONTENT_DATABASE]
    .filter(item => !excludeIds.includes(item.id))
    .sort((a, b) => b.popularity - a.popularity)

  // Pick diverse items
  for (const item of sorted) {
    if (results.length >= limit) break

    // Prefer items from different categories and types
    const categoryBonus = usedCategories.has(item.category) ? 0 : 1
    const typeBonus = usedTypes.has(item.type) ? 0 : 0.5

    if (categoryBonus + typeBonus > 0 || results.length < limit / 2) {
      results.push(item)
      usedCategories.add(item.category)
      usedTypes.add(item.type)
    }
  }

  // Fill remaining slots
  for (const item of sorted) {
    if (results.length >= limit) break
    if (!results.includes(item)) {
      results.push(item)
    }
  }

  return results
}

export type { ContentItem }

// AI-powered semantic search using TF-IDF and cosine similarity
// No external API required - runs entirely in browser/server

interface SearchableItem {
  id: string
  title: string
  content: string
  type: 'project' | 'blog' | 'certification' | 'skill'
  url: string
  tags?: string[]
}

// Sample searchable content - replace with actual data
const SEARCHABLE_CONTENT: SearchableItem[] = [
  // Projects
  {
    id: 'hub-pkp',
    title: 'HUB PKP - Klinik Rumah',
    content: 'Digital platform for Indonesia self-built housing ecosystem. AI-powered design consultation, permit processing, material marketplace. React TypeScript Node.js PostgreSQL AWS',
    type: 'project',
    url: '/projects/hub-pkp',
    tags: ['AI', 'React', 'Government', 'Housing']
  },
  {
    id: 'automate-all',
    title: 'Automate All - RPA Solutions',
    content: 'Robotic Process Automation startup. Built 100+ automation bots for document processing, data extraction, workflow automation. Python UiPath Power Automate',
    type: 'project',
    url: '/projects/automate-all',
    tags: ['RPA', 'Automation', 'Python', 'Startup']
  },
  {
    id: 'crypto-portfolio',
    title: 'Crypto Portfolio Tracker',
    content: 'DeFi portfolio management and tracking. On-chain analysis, yield farming, perpetual futures trading. Web3 Solidity React',
    type: 'project',
    url: '/projects/crypto-portfolio',
    tags: ['Crypto', 'DeFi', 'Web3', 'Trading']
  },
  // Blog posts
  {
    id: 'agentic-ai',
    title: 'Getting Started with Agentic AI',
    content: 'Learn how to build autonomous AI agents using LangChain, LangGraph, and modern LLM frameworks. Multi-agent systems, RAG, prompt engineering.',
    type: 'blog',
    url: '/blog/getting-started-with-agentic-ai',
    tags: ['AI', 'LangChain', 'Tutorial']
  },
  {
    id: 'defi-guide',
    title: 'DeFi Portfolio Management Guide',
    content: 'Strategies for managing DeFi portfolio across multiple chains. Yield farming, liquidity provision, risk management, on-chain analysis.',
    type: 'blog',
    url: '/blog/defi-portfolio-management',
    tags: ['DeFi', 'Crypto', 'Investment']
  },
  {
    id: 'web-security',
    title: 'Building Secure Web Applications',
    content: 'OWASP Top 10 vulnerabilities and how to prevent them. XSS, SQL injection, CSRF, authentication security, defensive coding.',
    type: 'blog',
    url: '/blog/building-secure-web-apps',
    tags: ['Security', 'Web', 'OWASP']
  },
  // Skills
  {
    id: 'skill-ai',
    title: 'Artificial Intelligence & Machine Learning',
    content: 'LLM workflows, prompt engineering, agentic AI, RAG systems, LangChain, OpenAI, Claude, multi-agent systems, AI automation.',
    type: 'skill',
    url: '/interests#ai',
    tags: ['AI', 'ML', 'LLM']
  },
  {
    id: 'skill-blockchain',
    title: 'Blockchain & Cryptocurrency',
    content: 'DeFi protocols, smart contracts, Solidity, on-chain analysis, portfolio management, yield farming, perpetual futures, Web3 development.',
    type: 'skill',
    url: '/interests#blockchain',
    tags: ['Blockchain', 'Crypto', 'Web3']
  },
  {
    id: 'skill-security',
    title: 'Cybersecurity',
    content: 'Defensive security, OPSEC, OSINT, threat intelligence, web application security, penetration testing, security hardening.',
    type: 'skill',
    url: '/interests#cybersecurity',
    tags: ['Security', 'OSINT', 'Pentest']
  },
  // Certifications
  {
    id: 'cert-google',
    title: 'Google Professional Certifications',
    content: 'Google Cybersecurity Professional, Google Business Intelligence, Google Project Management, Google Data Analytics.',
    type: 'certification',
    url: '/certifications#google',
    tags: ['Google', 'Professional']
  },
  {
    id: 'cert-stanford',
    title: 'Stanford Machine Learning',
    content: 'Stanford University Machine Learning course by Andrew Ng. Supervised learning, neural networks, deep learning fundamentals.',
    type: 'certification',
    url: '/certifications#stanford',
    tags: ['Stanford', 'ML', 'University']
  }
]

// Tokenize and normalize text
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2)
}

// Calculate TF-IDF scores
function calculateTFIDF(query: string, documents: SearchableItem[]): Map<string, number> {
  const queryTokens = tokenize(query)
  const scores = new Map<string, number>()

  // Document frequency for IDF
  const docFreq = new Map<string, number>()
  documents.forEach(doc => {
    const tokens = new Set(tokenize(`${doc.title} ${doc.content} ${doc.tags?.join(' ') || ''}`))
    tokens.forEach(token => {
      docFreq.set(token, (docFreq.get(token) || 0) + 1)
    })
  })

  const N = documents.length

  documents.forEach(doc => {
    const docText = `${doc.title} ${doc.content} ${doc.tags?.join(' ') || ''}`
    const docTokens = tokenize(docText)
    let score = 0

    queryTokens.forEach(queryToken => {
      // Term frequency in document
      const tf = docTokens.filter(t => t === queryToken).length / docTokens.length

      // Inverse document frequency
      const df = docFreq.get(queryToken) || 1
      const idf = Math.log(N / df)

      // TF-IDF score
      score += tf * idf

      // Boost for title match
      if (doc.title.toLowerCase().includes(queryToken)) {
        score += 0.5
      }

      // Boost for tag match
      if (doc.tags?.some(tag => tag.toLowerCase().includes(queryToken))) {
        score += 0.3
      }
    })

    if (score > 0) {
      scores.set(doc.id, score)
    }
  })

  return scores
}

// Main search function
export function semanticSearch(query: string, limit: number = 10): SearchableItem[] {
  if (!query.trim()) return []

  const scores = calculateTFIDF(query, SEARCHABLE_CONTENT)

  // Sort by score and return top results
  const results = SEARCHABLE_CONTENT
    .filter(item => scores.has(item.id))
    .sort((a, b) => (scores.get(b.id) || 0) - (scores.get(a.id) || 0))
    .slice(0, limit)

  return results
}

// Search with filters
export function searchWithFilters(
  query: string,
  filters: { type?: SearchableItem['type']; tags?: string[] },
  limit: number = 10
): SearchableItem[] {
  let results = semanticSearch(query, limit * 2) // Get more results for filtering

  if (filters.type) {
    results = results.filter(item => item.type === filters.type)
  }

  if (filters.tags && filters.tags.length > 0) {
    results = results.filter(item =>
      item.tags?.some(tag =>
        filters.tags!.some(filterTag =>
          tag.toLowerCase().includes(filterTag.toLowerCase())
        )
      )
    )
  }

  return results.slice(0, limit)
}

// Get search suggestions
export function getSearchSuggestions(query: string): string[] {
  const suggestions: string[] = []
  const queryLower = query.toLowerCase()

  // Collect all unique tags and titles
  const allTerms = new Set<string>()
  SEARCHABLE_CONTENT.forEach(item => {
    allTerms.add(item.title)
    item.tags?.forEach(tag => allTerms.add(tag))
  })

  // Find matching suggestions
  allTerms.forEach(term => {
    if (term.toLowerCase().includes(queryLower) && term.toLowerCase() !== queryLower) {
      suggestions.push(term)
    }
  })

  return suggestions.slice(0, 5)
}

// Export types
export type { SearchableItem }

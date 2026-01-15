// Common types for the portfolio application

export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
}

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  longDesc: string | null
  category: string
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'ARCHIVED'
  featured: boolean
  imageUrl: string | null
  liveUrl: string | null
  githubUrl: string | null
  technologies: string[]
  features: string[]
  impact: string | null
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  icon: string | null
}

export interface Experience {
  id: string
  company: string
  position: string
  location: string | null
  type: string
  description: string
  highlights: string[]
  startDate: Date
  endDate: Date | null
  isCurrent: boolean
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  location: string | null
  gpa: number | null
  description: string | null
  startDate: Date
  endDate: Date | null
  isCurrent: boolean
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issuerLogo: string | null
  category: string
  credentialId: string | null
  credentialUrl: string | null
  issueDate: Date
  expiryDate: Date | null
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  coverImage: string | null
  published: boolean
  featured: boolean
  views: number
  readingTime: number | null
  publishedAt: Date | null
  createdAt: Date
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  category: string | null
  status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED' | 'SPAM'
  createdAt: Date
}

export interface CryptoAsset {
  id: string
  symbol: string
  name: string
  category: string
  allocation: number
  avgBuyPrice: number | null
  quantity: number | null
}

export interface PageView {
  id: string
  path: string
  referrer: string | null
  country: string | null
  device: string | null
  browser: string | null
  createdAt: Date
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Form types
export interface ContactFormData {
  name: string
  email: string
  subject?: string
  message: string
  category?: string
}

export interface NewsletterFormData {
  email: string
  name?: string
}

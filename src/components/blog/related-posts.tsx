'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Post {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readingTime: number
  coverImage?: string
}

interface RelatedPostsProps {
  currentSlug: string
  currentCategory: string
  posts?: Post[]
  className?: string
}

// Mock posts - replace with actual data fetching
const MOCK_POSTS: Post[] = [
  {
    slug: 'getting-started-with-agentic-ai',
    title: 'Getting Started with Agentic AI',
    excerpt: 'Learn how to build autonomous AI agents using LangChain and modern frameworks.',
    category: 'AI',
    date: '2024-01-15',
    readingTime: 8,
    coverImage: '/images/blog/agentic-ai.jpg'
  },
  {
    slug: 'defi-portfolio-management',
    title: 'DeFi Portfolio Management Guide',
    excerpt: 'Strategies for managing your DeFi portfolio across multiple chains.',
    category: 'Blockchain',
    date: '2024-01-10',
    readingTime: 12,
    coverImage: '/images/blog/defi.jpg'
  },
  {
    slug: 'building-secure-web-apps',
    title: 'Building Secure Web Applications',
    excerpt: 'A practical guide to OWASP Top 10 and web security best practices.',
    category: 'Cybersecurity',
    date: '2024-01-05',
    readingTime: 10,
    coverImage: '/images/blog/security.jpg'
  },
  {
    slug: 'prompt-engineering-masterclass',
    title: 'Prompt Engineering Masterclass',
    excerpt: 'Advanced techniques for crafting effective prompts for LLMs.',
    category: 'AI',
    date: '2024-01-01',
    readingTime: 15,
    coverImage: '/images/blog/prompts.jpg'
  },
  {
    slug: 'smart-contract-security',
    title: 'Smart Contract Security Audit',
    excerpt: 'How to audit smart contracts for common vulnerabilities.',
    category: 'Blockchain',
    date: '2023-12-28',
    readingTime: 14,
    coverImage: '/images/blog/smart-contracts.jpg'
  }
]

export function RelatedPosts({
  currentSlug,
  currentCategory,
  posts = MOCK_POSTS,
  className
}: RelatedPostsProps) {
  // Filter out current post and find related by category
  const relatedPosts = posts
    .filter(post => post.slug !== currentSlug)
    .sort((a, b) => {
      // Prioritize same category
      const aScore = a.category === currentCategory ? 2 : 1
      const bScore = b.category === currentCategory ? 2 : 1
      return bScore - aScore
    })
    .slice(0, 3)

  if (relatedPosts.length === 0) return null

  return (
    <section className={cn('py-12', className)}>
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {relatedPosts.map((post, index) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group block glass rounded-xl overflow-hidden hover:scale-[1.02] transition-transform"
            >
              {/* Cover Image */}
              <div className="aspect-video bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl opacity-50">📝</span>
                </div>
                {/* Category Badge */}
                <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-background/80 backdrop-blur-sm rounded-full">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold mb-2 group-hover:text-cyber-cyan transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime} min
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-8 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View all articles
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}

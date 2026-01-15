'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  User
} from 'lucide-react'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Mock published blog posts
const blogPosts = [
  {
    id: '1',
    title: 'Building AI-Powered Government Services: Lessons from HUB PKP',
    slug: 'building-ai-powered-government-services',
    excerpt: 'How we transformed Indonesia\'s self-built housing ecosystem with modern AI technology and user-centric design.',
    coverImage: '',
    category: 'Technology',
    tags: ['AI', 'Government', 'Case Study'],
    author: 'Ibnu Aji',
    readTime: 8,
    publishedAt: '2024-12-15',
    featured: true,
  },
  {
    id: '2',
    title: 'My Journey from Developer to Tech Lead: 5 Key Lessons',
    slug: 'developer-to-tech-lead-journey',
    excerpt: 'Reflecting on my career transition and the crucial lessons I learned along the way.',
    coverImage: '',
    category: 'Career',
    tags: ['Career', 'Leadership', 'Personal'],
    author: 'Ibnu Aji',
    readTime: 6,
    publishedAt: '2024-11-28',
    featured: true,
  },
  {
    id: '3',
    title: 'Understanding Blockchain Technology for Government Applications',
    slug: 'blockchain-for-government',
    excerpt: 'Exploring how blockchain can bring transparency and efficiency to public sector services.',
    coverImage: '',
    category: 'Technology',
    tags: ['Blockchain', 'Web3', 'Government'],
    author: 'Ibnu Aji',
    readTime: 10,
    publishedAt: '2024-10-15',
    featured: false,
  },
  {
    id: '4',
    title: 'The Art of Code Review: Best Practices for Teams',
    slug: 'code-review-best-practices',
    excerpt: 'Learn how to conduct effective code reviews that improve code quality and team collaboration.',
    coverImage: '',
    category: 'Technology',
    tags: ['Code Review', 'Best Practices', 'Team'],
    author: 'Ibnu Aji',
    readTime: 7,
    publishedAt: '2024-09-20',
    featured: false,
  },
  {
    id: '5',
    title: 'Why I Chose to Work in Government Tech',
    slug: 'why-government-tech',
    excerpt: 'The unexpected rewards of building technology for public service.',
    coverImage: '',
    category: 'Career',
    tags: ['Career', 'Government', 'Personal'],
    author: 'Ibnu Aji',
    readTime: 5,
    publishedAt: '2024-08-10',
    featured: false,
  },
  {
    id: '6',
    title: 'Getting Started with Next.js 15: What\'s New',
    slug: 'nextjs-15-whats-new',
    excerpt: 'A comprehensive guide to the latest features in Next.js 15 and how to use them effectively.',
    coverImage: '',
    category: 'Tutorial',
    tags: ['Next.js', 'React', 'Tutorial'],
    author: 'Ibnu Aji',
    readTime: 12,
    publishedAt: '2024-07-05',
    featured: false,
  },
]

const categories = ['All', 'Technology', 'Career', 'Tutorial', 'Personal']

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = !selectedCategory || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPosts = filteredPosts.filter((post) => post.featured)
  const regularPosts = filteredPosts.filter((post) => !post.featured)

  return (
    <PageLayout
      title="Blog"
      subtitle="Thoughts, tutorials, and insights about technology, career, and life as a developer."
    >
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === (category === 'All' ? null : category) ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category === 'All' ? null : category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && !searchQuery && !selectedCategory && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Featured Articles</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="glass rounded-xl overflow-hidden group h-full flex flex-col">
                    {/* Cover placeholder */}
                    <div className="aspect-[16/9] bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 flex items-center justify-center">
                      <Tag className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 rounded text-xs bg-cyber-cyan/20 text-cyber-cyan">
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime} min read
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-cyber-cyan transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      {/* All Posts */}
      <section>
        {(searchQuery || selectedCategory || featuredPosts.length === 0) ? null : (
          <h2 className="text-xl font-semibold mb-6">All Articles</h2>
        )}
        <div className="space-y-4">
          {(searchQuery || selectedCategory ? filteredPosts : regularPosts).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="glass rounded-xl p-5 group flex flex-col md:flex-row gap-4">
                  {/* Cover placeholder */}
                  <div className="md:w-48 aspect-video md:aspect-square shrink-0 rounded-lg bg-gradient-to-br from-cyber-cyan/10 to-cyber-purple/10 flex items-center justify-center">
                    <Tag className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-xs bg-muted">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime} min
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-cyber-cyan transition-colors line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full text-xs bg-muted/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-cyber-cyan text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Read more
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No articles found matching your criteria.</p>
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="mt-16">
        <div className="glass rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get notified when I publish new articles about technology, career growth, and developer life.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
            />
            <Button variant="gradient">Subscribe</Button>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

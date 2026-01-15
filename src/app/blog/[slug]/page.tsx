'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Share2,
  Twitter,
  Linkedin,
  Link2,
  ArrowRight
} from 'lucide-react'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'

// Mock blog post data
const blogPosts: Record<string, {
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  readTime: number
  publishedAt: string
}> = {
  'building-ai-powered-government-services': {
    title: 'Building AI-Powered Government Services: Lessons from HUB PKP',
    excerpt: 'How we transformed Indonesia\'s self-built housing ecosystem with modern AI technology and user-centric design.',
    content: `# Building AI-Powered Government Services

## Introduction

When I joined the Ministry of Public Works and Housing to lead the development of HUB PKP, I knew we were embarking on something transformative. Indonesia has a unique housing challenge - 84% of homes are self-built by their owners. Our mission was to digitize and streamline this entire ecosystem.

## The Challenge

Traditional government services were:
- Paper-based and slow
- Difficult to navigate for citizens
- Prone to errors and inconsistencies
- Lacking in transparency

## Our Solution

We built HUB PKP with three core pillars:

### 1. AI-Powered Design Consultation

Using machine learning, we created a system that helps homeowners:
- Generate house designs based on their preferences
- Optimize layouts for their land plots
- Estimate construction costs accurately

\`\`\`python
# Example of our design recommendation system
def recommend_design(land_size, budget, preferences):
    features = extract_features(land_size, budget, preferences)
    designs = model.predict(features)
    return rank_by_suitability(designs)
\`\`\`

### 2. Integrated Permit Processing

We digitized the entire permit workflow:
- Online PBG (Building Permit) applications
- SIMBG integration for compliance checking
- Real-time status tracking

### 3. Material Marketplace

A transparent marketplace connecting homeowners with suppliers:
- Price comparison across vendors
- Quality verification
- Delivery tracking

## Results

After one year of operation:
- **40%** reduction in permit processing time
- **60%** increase in citizen satisfaction
- **100,000+** designs generated through AI
- **Rp 2 trillion** in transactions facilitated

## Lessons Learned

1. **Start with user research** - We spent 3 months just understanding citizen pain points
2. **Build for scale** - Government services need to handle millions of users
3. **Iterate quickly** - We released updates every 2 weeks
4. **Measure everything** - Data-driven decisions are crucial

## Conclusion

Digital transformation in government is challenging but rewarding. The key is to keep citizens at the center of every decision.

---

*If you're working on similar projects, feel free to reach out. I'd love to share more insights.*`,
    category: 'Technology',
    tags: ['AI', 'Government', 'Case Study'],
    author: 'Ibnu Aji',
    readTime: 8,
    publishedAt: '2024-12-15',
  },
  'developer-to-tech-lead-journey': {
    title: 'My Journey from Developer to Tech Lead: 5 Key Lessons',
    excerpt: 'Reflecting on my career transition and the crucial lessons I learned along the way.',
    content: `# My Journey from Developer to Tech Lead

## The Transition

Making the leap from individual contributor to tech lead was one of the most challenging yet rewarding transitions in my career. Here are the key lessons I learned.

## Lesson 1: It's About People, Not Just Code

As a developer, my focus was on writing clean, efficient code. As a tech lead, I quickly realized that my primary job is to enable my team to do their best work.

> "The best tech leads are force multipliers - they make everyone around them better."

## Lesson 2: Communication is Your Superpower

I spend a significant portion of my day:
- Clarifying requirements with stakeholders
- Explaining technical decisions to non-technical team members
- Mentoring junior developers
- Resolving conflicts and removing blockers

## Lesson 3: Learn to Delegate

This was hard for me. I used to think "I can do this faster myself." But delegation is not about speed - it's about growth.

\`\`\`
Before: Do everything yourself
After: Empower others to do it (and learn in the process)
\`\`\`

## Lesson 4: Stay Technical, But Know When to Step Back

I still write code, but I'm strategic about it:
- Tackle complex architectural problems
- Prototype new technologies
- Review critical code paths
- Debug production issues

## Lesson 5: Build Trust Through Transparency

I share:
- Why decisions are made
- What challenges we're facing
- Where we're headed as a team
- My own mistakes and learnings

## Final Thoughts

The journey continues. Every day brings new challenges and opportunities to grow. If you're considering this transition, my advice is: embrace the change, stay curious, and never stop learning.`,
    category: 'Career',
    tags: ['Career', 'Leadership', 'Personal'],
    author: 'Ibnu Aji',
    readTime: 6,
    publishedAt: '2024-11-28',
  },
}

// Related posts (mock)
const relatedPosts = [
  {
    slug: 'blockchain-for-government',
    title: 'Understanding Blockchain Technology for Government Applications',
    category: 'Technology',
    readTime: 10,
  },
  {
    slug: 'code-review-best-practices',
    title: 'The Art of Code Review: Best Practices for Teams',
    category: 'Technology',
    readTime: 7,
  },
]

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string

  const post = blogPosts[slug]

  if (!post) {
    return (
      <PageLayout title="Post Not Found" subtitle="The article you're looking for doesn't exist.">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">This blog post could not be found.</p>
          <Link href="/blog">
            <Button variant="gradient">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </PageLayout>
    )
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = post.title

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
        break
    }
  }

  return (
    <PageLayout title="">
      <article className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="px-3 py-1 rounded-full text-sm bg-cyber-cyan/20 text-cyber-cyan">
              {post.category}
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime} min read
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyber-gradient flex items-center justify-center">
                <span className="text-white font-medium">IA</span>
              </div>
              <div>
                <p className="font-medium">{post.author}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">Share:</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleShare('twitter')}
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleShare('linkedin')}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleShare('copy')}
              >
                <Link2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-sm bg-muted flex items-center gap-1"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg dark:prose-invert max-w-none mb-12"
        >
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground border-b border-border pb-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-muted-foreground">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-cyber-cyan pl-4 italic my-4 text-muted-foreground">{children}</blockquote>
              ),
              code: ({ className, children }) => {
                const isInline = !className
                if (isInline) {
                  return (
                    <code className="px-1.5 py-0.5 rounded bg-muted text-cyber-cyan text-sm font-mono">
                      {children}
                    </code>
                  )
                }
                return (
                  <code className="block p-4 rounded-lg bg-muted text-sm font-mono overflow-x-auto">
                    {children}
                  </code>
                )
              },
              pre: ({ children }) => (
                <pre className="rounded-lg bg-muted p-4 overflow-x-auto mb-4">{children}</pre>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
              hr: () => <hr className="border-border my-8" />,
              a: ({ href, children }) => (
                <a href={href} className="text-cyber-cyan hover:underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </motion.div>

        {/* Author Card */}
        <div className="glass rounded-xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-cyber-gradient flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xl">IA</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">About {post.author}</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Tech Lead at Ministry of Public Works and Housing, Indonesia. Building digital solutions for government services. Passionate about AI, blockchain, and creating impact through technology.
              </p>
              <div className="flex gap-2">
                <Link href="/about">
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="gradient" size="sm">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        <section>
          <h2 className="text-xl font-semibold mb-6">Related Articles</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                <div className="glass rounded-lg p-4 group h-full">
                  <span className="text-xs text-muted-foreground">{relatedPost.category}</span>
                  <h3 className="font-medium mt-1 mb-2 group-hover:text-cyber-cyan transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {relatedPost.readTime} min read
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
          <Link href="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            All Articles
          </Link>
          <Link href="/contact" className="flex items-center gap-2 text-cyber-cyan hover:text-cyber-cyan/80 transition-colors">
            Let's Connect
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </PageLayout>
  )
}

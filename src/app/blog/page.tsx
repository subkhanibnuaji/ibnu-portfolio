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
  // Featured Crypto Articles
  {
    id: 'btc-1',
    title: 'Bitcoin Indicators: A Complete Guide to MVRV, Stock-to-Flow, and Rainbow Chart',
    slug: 'bitcoin-indicators-complete-guide',
    excerpt: 'Learn how to use the most powerful on-chain and technical indicators to analyze Bitcoin cycles, including MVRV ratio, Stock-to-Flow model, and the famous Rainbow Chart.',
    coverImage: '',
    category: 'Crypto',
    tags: ['Bitcoin', 'Indicators', 'Technical Analysis', 'On-Chain'],
    author: 'Ibnu Aji',
    readTime: 15,
    publishedAt: '2025-01-15',
    featured: true,
  },
  {
    id: 'defi-1',
    title: 'DeFi 101: Understanding Yield Farming, Impermanent Loss, and Liquidity Pools',
    slug: 'defi-101-yield-farming-impermanent-loss',
    excerpt: 'A comprehensive beginner\'s guide to Decentralized Finance. Learn how yield farming works, calculate impermanent loss, and understand liquidity provision strategies.',
    coverImage: '',
    category: 'DeFi',
    tags: ['DeFi', 'Yield Farming', 'Liquidity', 'Ethereum'],
    author: 'Ibnu Aji',
    readTime: 12,
    publishedAt: '2025-01-10',
    featured: true,
  },
  {
    id: 'web3-1',
    title: 'Web3 Security: Protecting Your Crypto Assets from Smart Contract Exploits',
    slug: 'web3-security-protecting-crypto-assets',
    excerpt: 'Essential security practices for Web3 users. Learn about token approvals, phishing attacks, smart contract risks, and how to keep your crypto safe.',
    coverImage: '',
    category: 'Web3',
    tags: ['Web3', 'Security', 'Smart Contracts', 'Crypto Safety'],
    author: 'Ibnu Aji',
    readTime: 10,
    publishedAt: '2025-01-05',
    featured: true,
  },
  // Bitcoin Articles
  {
    id: 'btc-2',
    title: 'Bitcoin Halving 2028: What to Expect and How to Prepare',
    slug: 'bitcoin-halving-2028-guide',
    excerpt: 'Everything you need to know about the upcoming Bitcoin halving. Historical analysis, price predictions based on S2F model, and investment strategies.',
    coverImage: '',
    category: 'Crypto',
    tags: ['Bitcoin', 'Halving', 'Investment', 'S2F'],
    author: 'Ibnu Aji',
    readTime: 8,
    publishedAt: '2024-12-28',
    featured: false,
  },
  {
    id: 'btc-3',
    title: 'Understanding the Pi Cycle Top Indicator: Historical Accuracy and Limitations',
    slug: 'pi-cycle-top-indicator-explained',
    excerpt: 'Deep dive into the Pi Cycle Top indicator that has historically predicted Bitcoin market tops. Learn how it works and its limitations.',
    coverImage: '',
    category: 'Crypto',
    tags: ['Bitcoin', 'Pi Cycle', 'Technical Analysis', 'Market Cycles'],
    author: 'Ibnu Aji',
    readTime: 7,
    publishedAt: '2024-12-20',
    featured: false,
  },
  {
    id: 'btc-4',
    title: 'Hash Ribbon Indicator: Finding Bitcoin Bottom with Miner Capitulation Signals',
    slug: 'hash-ribbon-bitcoin-indicator',
    excerpt: 'How to use the Hash Ribbon indicator to identify Bitcoin accumulation zones during miner capitulation periods.',
    coverImage: '',
    category: 'Crypto',
    tags: ['Bitcoin', 'Mining', 'Hash Ribbon', 'On-Chain'],
    author: 'Ibnu Aji',
    readTime: 6,
    publishedAt: '2024-12-15',
    featured: false,
  },
  {
    id: 'btc-5',
    title: 'Bitcoin RSI Strategy: Using Relative Strength Index for Entry and Exit Points',
    slug: 'bitcoin-rsi-trading-strategy',
    excerpt: 'A practical guide to using RSI for Bitcoin trading. Learn to identify overbought and oversold conditions in crypto markets.',
    coverImage: '',
    category: 'Crypto',
    tags: ['Bitcoin', 'RSI', 'Trading', 'Technical Analysis'],
    author: 'Ibnu Aji',
    readTime: 9,
    publishedAt: '2024-12-10',
    featured: false,
  },
  // DeFi Articles
  {
    id: 'defi-2',
    title: 'Impermanent Loss Explained: Calculator, Formulas, and Mitigation Strategies',
    slug: 'impermanent-loss-explained-calculator',
    excerpt: 'Master impermanent loss calculation. Understand when LP positions are profitable and learn strategies to minimize IL in AMM protocols.',
    coverImage: '',
    category: 'DeFi',
    tags: ['DeFi', 'Impermanent Loss', 'AMM', 'Uniswap'],
    author: 'Ibnu Aji',
    readTime: 11,
    publishedAt: '2024-11-28',
    featured: false,
  },
  {
    id: 'defi-3',
    title: 'Staking vs Yield Farming: Which Strategy Fits Your Risk Profile?',
    slug: 'staking-vs-yield-farming-comparison',
    excerpt: 'Compare proof-of-stake staking with DeFi yield farming. Analysis of risks, rewards, and which approach suits different investment goals.',
    coverImage: '',
    category: 'DeFi',
    tags: ['DeFi', 'Staking', 'Yield Farming', 'Investment'],
    author: 'Ibnu Aji',
    readTime: 8,
    publishedAt: '2024-11-20',
    featured: false,
  },
  {
    id: 'defi-4',
    title: 'Top DeFi Protocols by TVL: Lido, AAVE, MakerDAO, and Uniswap Compared',
    slug: 'top-defi-protocols-tvl-comparison',
    excerpt: 'In-depth comparison of the largest DeFi protocols by Total Value Locked. Understand their mechanisms, risks, and earning opportunities.',
    coverImage: '',
    category: 'DeFi',
    tags: ['DeFi', 'TVL', 'Lido', 'AAVE', 'Uniswap'],
    author: 'Ibnu Aji',
    readTime: 14,
    publishedAt: '2024-11-15',
    featured: false,
  },
  {
    id: 'defi-5',
    title: 'Understanding Token Vesting: Cliff Periods, Linear Vesting, and Investment Implications',
    slug: 'token-vesting-schedules-explained',
    excerpt: 'How token vesting schedules affect crypto projects. Learn to analyze vesting as an investor and understand unlock events.',
    coverImage: '',
    category: 'DeFi',
    tags: ['DeFi', 'Tokenomics', 'Vesting', 'Investment'],
    author: 'Ibnu Aji',
    readTime: 7,
    publishedAt: '2024-11-08',
    featured: false,
  },
  // Web3 Articles
  {
    id: 'web3-2',
    title: 'ENS Domains: The Complete Guide to Ethereum Name Service',
    slug: 'ens-domains-complete-guide',
    excerpt: 'Everything about ENS domains - registration, subdomains, integrations, and why .eth addresses are becoming the future of Web3 identity.',
    coverImage: '',
    category: 'Web3',
    tags: ['Web3', 'ENS', 'Ethereum', 'Identity'],
    author: 'Ibnu Aji',
    readTime: 9,
    publishedAt: '2024-10-25',
    featured: false,
  },
  {
    id: 'web3-3',
    title: 'NFT Rarity: How to Calculate and Analyze NFT Collection Traits',
    slug: 'nft-rarity-calculation-guide',
    excerpt: 'Understanding NFT rarity scores. Learn how rarity is calculated, tools to check it, and how it affects NFT valuations.',
    coverImage: '',
    category: 'Web3',
    tags: ['Web3', 'NFT', 'Rarity', 'Collectibles'],
    author: 'Ibnu Aji',
    readTime: 6,
    publishedAt: '2024-10-18',
    featured: false,
  },
  {
    id: 'web3-4',
    title: 'Token Approvals: The Hidden Risk in Your Web3 Wallet',
    slug: 'token-approvals-wallet-security',
    excerpt: 'Why unlimited token approvals are dangerous. Learn to check and revoke approvals to protect your crypto assets.',
    coverImage: '',
    category: 'Web3',
    tags: ['Web3', 'Security', 'Token Approvals', 'Wallet'],
    author: 'Ibnu Aji',
    readTime: 5,
    publishedAt: '2024-10-10',
    featured: false,
  },
  {
    id: 'web3-5',
    title: 'Airdrop Farming: Strategies, Eligibility Criteria, and What to Expect',
    slug: 'airdrop-farming-strategies-guide',
    excerpt: 'How to position yourself for potential airdrops. Learn the common eligibility criteria and farming strategies used by successful airdrop hunters.',
    coverImage: '',
    category: 'Web3',
    tags: ['Web3', 'Airdrop', 'Strategy', 'Crypto'],
    author: 'Ibnu Aji',
    readTime: 10,
    publishedAt: '2024-10-05',
    featured: false,
  },
  // Original Articles
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
    publishedAt: '2024-09-15',
    featured: false,
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
    publishedAt: '2024-08-28',
    featured: false,
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
    publishedAt: '2024-07-15',
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
    publishedAt: '2024-06-20',
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
    publishedAt: '2024-05-10',
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
    publishedAt: '2024-04-05',
    featured: false,
  },
]

const categories = ['All', 'Crypto', 'DeFi', 'Web3', 'Technology', 'Career', 'Tutorial']

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

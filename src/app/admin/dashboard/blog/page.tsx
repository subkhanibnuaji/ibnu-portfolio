'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  FileText,
  Loader2,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Tag,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminLayout } from '@/components/admin/admin-layout'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// Mock data
const mockPosts = [
  {
    id: '1',
    title: 'Building AI-Powered Government Services: Lessons from HUB PKP',
    slug: 'building-ai-powered-government-services',
    excerpt: 'How we transformed Indonesia\'s self-built housing ecosystem with modern AI technology and user-centric design.',
    content: '# Building AI-Powered Government Services\n\nThis is the full content of the article...',
    coverImage: '',
    category: 'Technology',
    tags: ['AI', 'Government', 'Case Study'],
    status: 'PUBLISHED',
    featured: true,
    readTime: 8,
    views: 1250,
    createdAt: '2024-12-15T10:00:00Z',
    publishedAt: '2024-12-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'My Journey from Developer to Tech Lead: 5 Key Lessons',
    slug: 'developer-to-tech-lead-journey',
    excerpt: 'Reflecting on my career transition and the crucial lessons I learned along the way.',
    content: '# My Journey\n\nThis is the full content...',
    coverImage: '',
    category: 'Career',
    tags: ['Career', 'Leadership', 'Personal'],
    status: 'PUBLISHED',
    featured: false,
    readTime: 6,
    views: 890,
    createdAt: '2024-11-28T08:00:00Z',
    publishedAt: '2024-11-28T08:00:00Z',
  },
  {
    id: '3',
    title: 'Web3 and Blockchain in Government: Opportunities and Challenges',
    slug: 'web3-blockchain-government',
    excerpt: 'Exploring how blockchain technology can enhance transparency and efficiency in public services.',
    content: '# Web3 in Government\n\nThis is the full content...',
    coverImage: '',
    category: 'Technology',
    tags: ['Web3', 'Blockchain', 'Government'],
    status: 'DRAFT',
    featured: false,
    readTime: 10,
    views: 0,
    createdAt: '2024-12-20T14:00:00Z',
    publishedAt: null,
  },
  {
    id: '4',
    title: 'The Future of Indonesian Tech: A 2025 Perspective',
    slug: 'future-indonesian-tech-2025',
    excerpt: 'Predictions and insights on where Indonesian technology industry is heading.',
    content: '# The Future\n\nThis is the full content...',
    coverImage: '',
    category: 'Industry',
    tags: ['Indonesia', 'Predictions', 'Industry'],
    status: 'DRAFT',
    featured: false,
    readTime: 7,
    views: 0,
    createdAt: '2025-01-10T09:00:00Z',
    publishedAt: null,
  },
]

const statusColors: Record<string, string> = {
  PUBLISHED: 'bg-cyber-green/20 text-cyber-green',
  DRAFT: 'bg-yellow-500/20 text-yellow-500',
  ARCHIVED: 'bg-muted text-muted-foreground',
}

const categories = ['All', 'Technology', 'Career', 'Industry', 'Personal']

export default function AdminBlogPage() {
  const [posts, setPosts] = useState(mockPosts)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !filterStatus || post.status === filterStatus
    const matchesCategory = !filterCategory || post.category === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    setDeleteId(id)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setPosts((prev) => prev.filter((p) => p.id !== id))
    setDeleteId(null)
  }

  const handleToggleStatus = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: p.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
              publishedAt: p.status === 'PUBLISHED' ? null : new Date().toISOString(),
            }
          : p
      )
    )
  }

  const handleToggleFeatured = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    )
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <AdminLayout
      title="Blog"
      description="Manage your blog posts and articles"
      actions={
        <Link href="/admin/dashboard/blog/new">
          <Button size="sm" variant="gradient">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      }
    >
      {/* Filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            {['All', 'PUBLISHED', 'DRAFT'].map((status) => (
              <Button
                key={status}
                variant={filterStatus === (status === 'All' ? null : status) ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status === 'All' ? null : status)}
              >
                {status}
                {status !== 'All' && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-muted rounded text-xs">
                    {posts.filter((p) => p.status === status).length}
                  </span>
                )}
              </Button>
            ))}
          </div>
          <div className="w-px h-6 bg-border self-center mx-2 hidden sm:block" />
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={filterCategory === (cat === 'All' ? null : cat) ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterCategory(cat === 'All' ? null : cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass rounded-xl p-5"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="font-semibold text-lg truncate">{post.title}</h3>
                  {post.featured && (
                    <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-500">
                      Featured
                    </span>
                  )}
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-xs',
                      statusColors[post.status]
                    )}
                  >
                    {post.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readTime} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(post.createdAt)}
                  </span>
                  {post.status === 'PUBLISHED' && (
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {post.views.toLocaleString()} views
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-xs bg-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 lg:shrink-0">
                {post.status === 'PUBLISHED' && (
                  <Link href={`/blog/${post.slug}`} target="_blank">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => handleToggleStatus(post.id)}
                >
                  {post.status === 'PUBLISHED' ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Link href={`/admin/dashboard/blog/${post.id}`}>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={() => handleDelete(post.id)}
                  disabled={deleteId === post.id}
                >
                  {deleteId === post.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No blog posts found</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{posts.length}</p>
          <p className="text-sm text-muted-foreground">Total Posts</p>
        </div>
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-cyber-green">
            {posts.filter((p) => p.status === 'PUBLISHED').length}
          </p>
          <p className="text-sm text-muted-foreground">Published</p>
        </div>
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">
            {posts.filter((p) => p.status === 'DRAFT').length}
          </p>
          <p className="text-sm text-muted-foreground">Drafts</p>
        </div>
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-cyber-cyan">
            {posts.reduce((acc, p) => acc + p.views, 0).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Total Views</p>
        </div>
      </div>
    </AdminLayout>
  )
}

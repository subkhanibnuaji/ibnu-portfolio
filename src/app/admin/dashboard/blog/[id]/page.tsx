'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Save,
  Eye,
  FileText,
  Plus,
  X,
  Loader2,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminLayout } from '@/components/admin/admin-layout'
import Link from 'next/link'

// Mock data - same as in blog list
const mockPost = {
  id: '1',
  title: 'Building AI-Powered Government Services: Lessons from HUB PKP',
  slug: 'building-ai-powered-government-services',
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
  coverImage: '',
  category: 'Technology',
  tags: ['AI', 'Government', 'Case Study'],
  status: 'PUBLISHED',
  featured: true,
  readTime: 8,
  views: 1250,
  createdAt: '2024-12-15T10:00:00Z',
  publishedAt: '2024-12-15T10:00:00Z',
}

const categories = ['Technology', 'Career', 'Industry', 'Personal', 'Tutorial']

export default function EditBlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    title: mockPost.title,
    slug: mockPost.slug,
    excerpt: mockPost.excerpt,
    content: mockPost.content,
    category: mockPost.category,
    tags: mockPost.tags,
    status: mockPost.status,
    featured: mockPost.featured,
  })
  const [newTag, setNewTag] = useState('')

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleSubmit = async (asDraft = true) => {
    if (!formData.title || !formData.content) {
      alert('Title and content are required')
      return
    }

    setIsSaving(true)
    const status = asDraft ? 'DRAFT' : 'PUBLISHED'

    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log('Updating post:', postId, { ...formData, status })

    // When database is connected:
    // await fetch(`/api/blog/${postId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ ...formData, status }),
    // })

    setIsSaving(false)
    router.push('/admin/dashboard/blog')
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log('Deleting post:', postId)

    // When database is connected:
    // await fetch(`/api/blog/${postId}`, { method: 'DELETE' })

    router.push('/admin/dashboard/blog')
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.trim().split(/\s+/).length
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  }

  return (
    <AdminLayout
      title="Edit Blog Post"
      description={`Editing: ${mockPost.title}`}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
            Delete
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSubmit(true)} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Draft
          </Button>
          <Button variant="gradient" size="sm" onClick={() => handleSubmit(false)} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Eye className="h-4 w-4 mr-2" />}
            {formData.status === 'PUBLISHED' ? 'Update' : 'Publish'}
          </Button>
        </div>
      }
    >
      <div className="mb-4">
        <Link href="/admin/dashboard/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-xl p-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none text-lg"
                  placeholder="Enter blog post title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL Slug</label>
                <div className="flex items-center">
                  <span className="text-muted-foreground text-sm mr-2">/blog/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none text-sm"
                    placeholder="url-slug"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none resize-none"
                  placeholder="Brief summary of your post (shown in previews)..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content * (Markdown supported)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={25}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none resize-none font-mono text-sm"
                  placeholder="Write your blog post content here..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Estimated read time: {calculateReadTime(formData.content)} min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold mb-4">Post Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`px-2 py-1 rounded ${formData.status === 'PUBLISHED' ? 'bg-cyber-green/20 text-cyber-green' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    {formData.status}
                  </span>
                  {mockPost.publishedAt && (
                    <span className="text-muted-foreground">
                      Published {new Date(mockPost.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>{mockPost.views.toLocaleString()}</strong> views
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none text-sm"
                    placeholder="Add tag..."
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-border"
                />
                <label htmlFor="featured" className="text-sm">
                  Featured post
                </label>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold mb-4">Cover Image</h3>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop or click to upload
              </p>
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

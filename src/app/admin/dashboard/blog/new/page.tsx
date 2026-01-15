'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Save,
  Eye,
  FileText,
  Plus,
  X,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminLayout } from '@/components/admin/admin-layout'
import Link from 'next/link'

const categories = ['Technology', 'Career', 'Industry', 'Personal', 'Tutorial']

export default function NewBlogPostPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Technology',
    tags: [] as string[],
    status: 'DRAFT',
    featured: false,
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
      slug: prev.slug || generateSlug(value),
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

    console.log('Saving post:', { ...formData, status })

    // When database is connected:
    // await fetch('/api/blog', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ ...formData, status }),
    // })

    setIsSaving(false)
    router.push('/admin/dashboard/blog')
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.trim().split(/\s+/).length
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  }

  return (
    <AdminLayout
      title="New Blog Post"
      description="Create a new blog article"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleSubmit(true)} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Draft
          </Button>
          <Button variant="gradient" size="sm" onClick={() => handleSubmit(false)} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Eye className="h-4 w-4 mr-2" />}
            Publish
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
                  rows={20}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none resize-none font-mono text-sm"
                  placeholder="Write your blog post content here...

# Heading 1
## Heading 2

Regular paragraph text with **bold** and *italic* formatting.

- Bullet point 1
- Bullet point 2

```javascript
// Code block
const hello = 'world';
```
"
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

          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold mb-2">Writing Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li>• Use headings to structure your content</li>
              <li>• Keep paragraphs short and readable</li>
              <li>• Add code examples when relevant</li>
              <li>• Include a clear call-to-action</li>
              <li>• Proofread before publishing</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

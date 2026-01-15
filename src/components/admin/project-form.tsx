'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Save,
  X,
  Plus,
  Trash2,
  Loader2,
  Upload,
  Image as ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProjectFormProps {
  project?: {
    id: string
    slug: string
    title: string
    description: string
    longDesc?: string
    category: string
    status: string
    featured: boolean
    imageUrl?: string
    liveUrl?: string
    githubUrl?: string
    technologies: string[]
    features: string[]
    impact?: string
  }
  onSubmit: (data: any) => Promise<void>
}

const categories = ['Government', 'Enterprise', 'Healthcare', 'Web3', 'AI/ML', 'Other']
const statuses = ['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'ARCHIVED']

export function ProjectForm({ project, onSubmit }: ProjectFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    slug: project?.slug || '',
    title: project?.title || '',
    description: project?.description || '',
    longDesc: project?.longDesc || '',
    category: project?.category || 'Government',
    status: project?.status || 'IN_PROGRESS',
    featured: project?.featured || false,
    imageUrl: project?.imageUrl || '',
    liveUrl: project?.liveUrl || '',
    githubUrl: project?.githubUrl || '',
    technologies: project?.technologies || [''],
    features: project?.features || [''],
    impact: project?.impact || '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleArrayChange = (
    field: 'technologies' | 'features',
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const handleAddArrayItem = (field: 'technologies' | 'features') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }))
  }

  const handleRemoveArrayItem = (field: 'technologies' | 'features', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Filter out empty array items
      const cleanedData = {
        ...formData,
        technologies: formData.technologies.filter((t) => t.trim()),
        features: formData.features.filter((f) => f.trim()),
      }
      await onSubmit(cleanedData)
      router.push('/admin/dashboard/projects')
    } catch (error) {
      console.error('Error saving project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-generate slug from title
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setFormData((prev) => ({ ...prev, slug }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={generateSlug}
              required
              className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
              placeholder="Project title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
              placeholder="project-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="featured"
              id="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-5 h-5 rounded border-border"
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Featured Project
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Short Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none resize-none"
              placeholder="Brief description of the project"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Long Description</label>
            <textarea
              name="longDesc"
              value={formData.longDesc}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none resize-none"
              placeholder="Detailed description of the project"
            />
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Links</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Live URL</label>
            <input
              type="url"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">GitHub URL</label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
              placeholder="https://github.com/..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>

      {/* Technologies */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Technologies</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleAddArrayItem('technologies')}
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {formData.technologies.map((tech, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={tech}
                onChange={(e) => handleArrayChange('technologies', index, e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                placeholder="Technology name"
              />
              {formData.technologies.length > 1 && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-red-500"
                  onClick={() => handleRemoveArrayItem('technologies', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Key Features</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleAddArrayItem('features')}
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleArrayChange('features', index, e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                placeholder="Feature description"
              />
              {formData.features.length > 1 && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-red-500"
                  onClick={() => handleRemoveArrayItem('features', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Impact */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Impact</h3>
        <textarea
          name="impact"
          value={formData.impact}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none resize-none"
          placeholder="Describe the impact or results of this project"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/dashboard/projects')}
        >
          <X className="h-4 w-4 mr-2" /> Cancel
        </Button>
        <Button type="submit" variant="gradient" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" /> Save Project
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

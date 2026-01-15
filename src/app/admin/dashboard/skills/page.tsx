'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Code2,
  Loader2,
  GripVertical,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminLayout } from '@/components/admin/admin-layout'
import { cn } from '@/lib/utils'

// Mock data
const mockSkills = [
  // Programming Languages
  { id: '1', name: 'TypeScript', category: 'language', level: 95, featured: true },
  { id: '2', name: 'Python', category: 'language', level: 90, featured: true },
  { id: '3', name: 'JavaScript', category: 'language', level: 95, featured: false },
  { id: '4', name: 'Go', category: 'language', level: 75, featured: false },
  { id: '5', name: 'Rust', category: 'language', level: 60, featured: false },
  // Frameworks
  { id: '6', name: 'React', category: 'framework', level: 95, featured: true },
  { id: '7', name: 'Next.js', category: 'framework', level: 92, featured: true },
  { id: '8', name: 'Node.js', category: 'framework', level: 90, featured: true },
  { id: '9', name: 'FastAPI', category: 'framework', level: 85, featured: false },
  { id: '10', name: 'Django', category: 'framework', level: 80, featured: false },
  // Databases
  { id: '11', name: 'PostgreSQL', category: 'database', level: 88, featured: true },
  { id: '12', name: 'MongoDB', category: 'database', level: 82, featured: false },
  { id: '13', name: 'Redis', category: 'database', level: 78, featured: false },
  // Cloud & DevOps
  { id: '14', name: 'AWS', category: 'cloud', level: 85, featured: true },
  { id: '15', name: 'Docker', category: 'cloud', level: 88, featured: true },
  { id: '16', name: 'Kubernetes', category: 'cloud', level: 72, featured: false },
  // AI/ML
  { id: '17', name: 'TensorFlow', category: 'ai', level: 75, featured: false },
  { id: '18', name: 'PyTorch', category: 'ai', level: 70, featured: false },
  { id: '19', name: 'LangChain', category: 'ai', level: 82, featured: true },
]

const categories = ['All', 'language', 'framework', 'database', 'cloud', 'ai']

const categoryLabels: Record<string, string> = {
  language: 'Languages',
  framework: 'Frameworks',
  database: 'Databases',
  cloud: 'Cloud & DevOps',
  ai: 'AI/ML',
}

const categoryColors: Record<string, string> = {
  language: 'bg-cyber-cyan/20 text-cyber-cyan',
  framework: 'bg-cyber-purple/20 text-cyber-purple',
  database: 'bg-cyber-green/20 text-cyber-green',
  cloud: 'bg-cyber-orange/20 text-cyber-orange',
  ai: 'bg-pink-500/20 text-pink-400',
}

const getLevelColor = (level: number) => {
  if (level >= 90) return 'bg-cyber-cyan'
  if (level >= 75) return 'bg-cyber-green'
  if (level >= 60) return 'bg-cyber-orange'
  return 'bg-muted-foreground'
}

const getLevelLabel = (level: number) => {
  if (level >= 90) return 'Expert'
  if (level >= 75) return 'Advanced'
  if (level >= 60) return 'Intermediate'
  return 'Beginner'
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState(mockSkills)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'language',
    level: 50,
    featured: false,
  })

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !filterCategory || skill.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Group skills by category
  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, typeof mockSkills>)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return
    setDeleteId(id)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setSkills((prev) => prev.filter((s) => s.id !== id))
    setDeleteId(null)
  }

  const handleToggleFeatured = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, featured: !s.featured } : s))
    )
  }

  const handleSubmit = async () => {
    if (!formData.name) return

    if (editingId) {
      setSkills((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...formData } : s))
      )
    } else {
      const newSkill = {
        ...formData,
        id: Date.now().toString(),
      }
      setSkills((prev) => [...prev, newSkill])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'language',
      level: 50,
      featured: false,
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleEdit = (skill: typeof mockSkills[0]) => {
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      featured: skill.featured,
    })
    setEditingId(skill.id)
    setIsAdding(true)
  }

  return (
    <AdminLayout
      title="Skills"
      description="Manage your technical skills and proficiency levels"
      actions={
        <Button size="sm" variant="gradient" onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      }
    >
      {/* Add/Edit Form Modal */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => resetForm()}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Skill' : 'Add Skill'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Skill Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                  placeholder="e.g. React, Python, AWS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                >
                  <option value="language">Programming Language</option>
                  <option value="framework">Framework / Library</option>
                  <option value="database">Database</option>
                  <option value="cloud">Cloud & DevOps</option>
                  <option value="ai">AI / Machine Learning</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Proficiency Level: {formData.level}% ({getLevelLabel(formData.level)})
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: parseInt(e.target.value) })
                  }
                  className="w-full accent-cyber-cyan"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                  <span>Expert</span>
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
                  Featured skill (shown prominently on portfolio)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button variant="gradient" onClick={handleSubmit}>
                {editingId ? 'Update Skill' : 'Add Skill'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filterCategory === (cat === 'All' ? null : cat) ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterCategory(cat === 'All' ? null : cat)}
              className="capitalize"
            >
              {cat === 'All' ? 'All' : categoryLabels[cat] || cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Skills by Category */}
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span
                className={cn(
                  'px-2 py-1 rounded text-xs',
                  categoryColors[category]
                )}
              >
                {categoryLabels[category] || category}
              </span>
              <span className="text-sm text-muted-foreground font-normal">
                ({categorySkills.length} skills)
              </span>
            </h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {categorySkills
                .sort((a, b) => b.level - a.level)
                .map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="glass rounded-lg p-4 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{skill.name}</span>
                        {skill.featured && (
                          <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 0.5, delay: index * 0.03 }}
                        className={cn('h-full rounded-full', getLevelColor(skill.level))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {getLevelLabel(skill.level)}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => handleToggleFeatured(skill.id)}
                        >
                          <Star
                            className={cn(
                              'h-3.5 w-3.5',
                              skill.featured
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-muted-foreground'
                            )}
                          />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => handleEdit(skill)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={() => handleDelete(skill.id)}
                          disabled={deleteId === skill.id}
                        >
                          {deleteId === skill.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <Code2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No skills found</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{skills.length}</p>
          <p className="text-sm text-muted-foreground">Total Skills</p>
        </div>
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">
            {skills.filter((s) => s.featured).length}
          </p>
          <p className="text-sm text-muted-foreground">Featured</p>
        </div>
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-cyber-cyan">
            {skills.filter((s) => s.level >= 90).length}
          </p>
          <p className="text-sm text-muted-foreground">Expert Level</p>
        </div>
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-cyber-green">
            {Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length)}%
          </p>
          <p className="text-sm text-muted-foreground">Avg Proficiency</p>
        </div>
      </div>
    </AdminLayout>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Briefcase,
  Loader2,
  Calendar,
  MapPin,
  Building2,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminLayout } from '@/components/admin/admin-layout'
import { cn } from '@/lib/utils'

// Mock data
const mockExperiences = [
  {
    id: '1',
    title: 'Lead Developer',
    company: 'Ministry of Public Works and Housing',
    location: 'Jakarta, Indonesia',
    type: 'FULL_TIME',
    startDate: '2023-01-01',
    endDate: null,
    current: true,
    description: 'Leading the development of HUB PKP platform, Indonesia\'s flagship self-built housing digital ecosystem.',
    achievements: [
      'Architected and led development of HUB PKP platform serving millions of Indonesians',
      'Integrated AI-powered house design consultation system',
      'Implemented blockchain-based document verification for permits',
    ],
  },
  {
    id: '2',
    title: 'Senior Software Engineer',
    company: 'Tech Startup',
    location: 'Jakarta, Indonesia',
    type: 'FULL_TIME',
    startDate: '2021-06-01',
    endDate: '2022-12-31',
    current: false,
    description: 'Full-stack development with focus on scalable microservices architecture.',
    achievements: [
      'Built microservices architecture handling 10k+ concurrent users',
      'Reduced system latency by 40% through optimization',
      'Mentored junior developers and conducted code reviews',
    ],
  },
  {
    id: '3',
    title: 'Software Developer',
    company: 'Digital Agency',
    location: 'Bandung, Indonesia',
    type: 'FULL_TIME',
    startDate: '2019-03-01',
    endDate: '2021-05-31',
    current: false,
    description: 'Developed web applications for various clients in finance and e-commerce sectors.',
    achievements: [
      'Delivered 15+ client projects on time and within budget',
      'Implemented payment gateway integrations',
      'Built real-time dashboard systems',
    ],
  },
  {
    id: '4',
    title: 'Freelance Developer',
    company: 'Self-employed',
    location: 'Remote',
    type: 'FREELANCE',
    startDate: '2018-01-01',
    endDate: '2019-02-28',
    current: false,
    description: 'Freelance web development for local businesses and startups.',
    achievements: [
      'Built custom e-commerce solutions for 10+ clients',
      'Developed WordPress themes and plugins',
    ],
  },
]

const typeLabels: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  FREELANCE: 'Freelance',
  INTERNSHIP: 'Internship',
}

const typeColors: Record<string, string> = {
  FULL_TIME: 'bg-cyber-cyan/20 text-cyber-cyan',
  PART_TIME: 'bg-cyber-purple/20 text-cyber-purple',
  CONTRACT: 'bg-cyber-orange/20 text-cyber-orange',
  FREELANCE: 'bg-cyber-green/20 text-cyber-green',
  INTERNSHIP: 'bg-blue-500/20 text-blue-400',
}

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState(mockExperiences)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'FULL_TIME',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: [''],
  })

  const filteredExperiences = experiences.filter((exp) => {
    const matchesSearch =
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.company.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return
    setDeleteId(id)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setExperiences((prev) => prev.filter((e) => e.id !== id))
    setDeleteId(null)
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.company) return

    if (editingId) {
      // Update existing
      setExperiences((prev) =>
        prev.map((e) =>
          e.id === editingId
            ? {
                ...e,
                ...formData,
                achievements: formData.achievements.filter((a) => a.trim()),
              }
            : e
        )
      )
    } else {
      // Add new
      const newExp = {
        ...formData,
        id: Date.now().toString(),
        achievements: formData.achievements.filter((a) => a.trim()),
      }
      setExperiences((prev) => [newExp, ...prev])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      type: 'FULL_TIME',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [''],
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleEdit = (exp: typeof mockExperiences[0]) => {
    setFormData({
      title: exp.title,
      company: exp.company,
      location: exp.location,
      type: exp.type,
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      current: exp.current,
      description: exp.description,
      achievements: exp.achievements.length > 0 ? exp.achievements : [''],
    })
    setEditingId(exp.id)
    setIsAdding(true)
  }

  const addAchievement = () => {
    setFormData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, ''],
    }))
  }

  const updateAchievement = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a, i) => (i === index ? value : a)),
    }))
  }

  const removeAchievement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }))
  }

  const formatDateRange = (start: string, end: string | null, current: boolean) => {
    const startDate = new Date(start).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
    if (current) return `${startDate} - Present`
    if (!end) return startDate
    const endDate = new Date(end).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
    return `${startDate} - ${endDate}`
  }

  return (
    <AdminLayout
      title="Experience"
      description="Manage your work experience and career history"
      actions={
        <Button size="sm" variant="gradient" onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      }
    >
      {/* Add/Edit Form Modal */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => resetForm()}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Experience' : 'Add Experience'}
            </h3>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Job Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                    placeholder="e.g. Senior Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company *</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                    placeholder="e.g. Tech Corp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                    placeholder="e.g. Jakarta, Indonesia"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Employment Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                  >
                    <option value="FULL_TIME">Full-time</option>
                    <option value="PART_TIME">Part-time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="FREELANCE">Freelance</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    disabled={formData.current}
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current}
                  onChange={(e) =>
                    setFormData({ ...formData, current: e.target.checked, endDate: '' })
                  }
                  className="rounded border-border"
                />
                <label htmlFor="current" className="text-sm">
                  I currently work here
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none resize-none"
                  placeholder="Brief description of your role..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Key Achievements</label>
                  <Button type="button" variant="ghost" size="sm" onClick={addAchievement}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => updateAchievement(index, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                        placeholder="Achievement or responsibility..."
                      />
                      {formData.achievements.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAchievement(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button variant="gradient" onClick={handleSubmit}>
                {editingId ? 'Update Experience' : 'Add Experience'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search experience..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
        />
      </div>

      {/* Experience Timeline */}
      <div className="space-y-4">
        {filteredExperiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl overflow-hidden"
          >
            <div
              className="p-5 cursor-pointer"
              onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-cyber-cyan/10 shrink-0">
                    <Briefcase className="h-6 w-6 text-cyber-cyan" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{exp.title}</h3>
                      {exp.current && (
                        <span className="px-2 py-0.5 rounded text-xs bg-cyber-green/20 text-cyber-green">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Building2 className="h-4 w-4" />
                      <span>{exp.company}</span>
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-xs',
                          typeColors[exp.type]
                        )}
                      >
                        {typeLabels[exp.type]}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {exp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(exp)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(exp.id)
                    }}
                    disabled={deleteId === exp.id}
                  >
                    {deleteId === exp.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    {expandedId === exp.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === exp.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-5 pb-5 pt-0 border-t border-border"
              >
                <div className="pt-4">
                  <p className="text-muted-foreground mb-4">{exp.description}</p>
                  {exp.achievements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Key Achievements:</h4>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan mt-2 shrink-0" />
                            <span className="text-muted-foreground">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredExperiences.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No experience found</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{experiences.length}</p>
          <p className="text-sm text-muted-foreground">Total Positions</p>
        </div>
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-cyber-cyan">
            {experiences.filter((e) => e.type === 'FULL_TIME').length}
          </p>
          <p className="text-sm text-muted-foreground">Full-time</p>
        </div>
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-cyber-green">
            {experiences.filter((e) => e.current).length}
          </p>
          <p className="text-sm text-muted-foreground">Current</p>
        </div>
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-cyber-purple">
            {(() => {
              const years = experiences.reduce((acc, exp) => {
                const start = new Date(exp.startDate)
                const end = exp.current ? new Date() : new Date(exp.endDate || exp.startDate)
                return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365)
              }, 0)
              return Math.round(years)
            })()}
          </p>
          <p className="text-sm text-muted-foreground">Years Experience</p>
        </div>
      </div>
    </AdminLayout>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  GraduationCap,
  Loader2,
  Calendar,
  MapPin,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminLayout } from '@/components/admin/admin-layout'
import { cn } from '@/lib/utils'

// Mock data
const mockEducation = [
  {
    id: '1',
    institution: 'Institut Teknologi Bandung',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    location: 'Bandung, Indonesia',
    startDate: '2015-08-01',
    endDate: '2019-07-31',
    current: false,
    gpa: '3.85',
    description: 'Focused on software engineering, algorithms, and artificial intelligence.',
    achievements: [
      'Dean\'s List for 6 consecutive semesters',
      'Best Thesis Award in Computer Science Department',
      'Led University Programming Club',
    ],
  },
  {
    id: '2',
    institution: 'Stanford Online',
    degree: 'Professional Certificate',
    field: 'Machine Learning',
    location: 'Online',
    startDate: '2022-01-01',
    endDate: '2022-06-30',
    current: false,
    gpa: '',
    description: 'Comprehensive machine learning program covering supervised and unsupervised learning.',
    achievements: [
      'Completed all courses with distinction',
      'Built 5 ML projects as part of the curriculum',
    ],
  },
  {
    id: '3',
    institution: 'Harvard Business School Online',
    degree: 'Certificate',
    field: 'Leadership Principles',
    location: 'Online',
    startDate: '2023-03-01',
    endDate: '2023-05-31',
    current: false,
    gpa: '',
    description: 'Executive education program on leadership and management.',
    achievements: [
      'Graduated with Honors',
    ],
  },
]

const degreeColors: Record<string, string> = {
  'Bachelor of Science': 'bg-cyber-cyan/20 text-cyber-cyan',
  'Master of Science': 'bg-cyber-purple/20 text-cyber-purple',
  'PhD': 'bg-cyber-orange/20 text-cyber-orange',
  'Professional Certificate': 'bg-cyber-green/20 text-cyber-green',
  'Certificate': 'bg-blue-500/20 text-blue-400',
}

export default function AdminEducationPage() {
  const [education, setEducation] = useState(mockEducation)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    institution: '',
    degree: 'Bachelor of Science',
    field: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: '',
    description: '',
    achievements: [''],
  })

  const filteredEducation = education.filter((edu) => {
    const matchesSearch =
      edu.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      edu.field.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return
    setDeleteId(id)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setEducation((prev) => prev.filter((e) => e.id !== id))
    setDeleteId(null)
  }

  const handleSubmit = async () => {
    if (!formData.institution || !formData.field) return

    if (editingId) {
      setEducation((prev) =>
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
      const newEdu = {
        ...formData,
        id: Date.now().toString(),
        achievements: formData.achievements.filter((a) => a.trim()),
      }
      setEducation((prev) => [newEdu, ...prev])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      institution: '',
      degree: 'Bachelor of Science',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      description: '',
      achievements: [''],
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleEdit = (edu: typeof mockEducation[0]) => {
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      location: edu.location,
      startDate: edu.startDate,
      endDate: edu.endDate || '',
      current: edu.current,
      gpa: edu.gpa,
      description: edu.description,
      achievements: edu.achievements.length > 0 ? edu.achievements : [''],
    })
    setEditingId(edu.id)
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
      title="Education"
      description="Manage your educational background and qualifications"
      actions={
        <Button size="sm" variant="gradient" onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Education
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
              {editingId ? 'Edit Education' : 'Add Education'}
            </h3>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium mb-1">Institution *</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                  placeholder="e.g. Massachusetts Institute of Technology"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Degree</label>
                  <select
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                  >
                    <option value="Bachelor of Science">Bachelor of Science</option>
                    <option value="Bachelor of Arts">Bachelor of Arts</option>
                    <option value="Master of Science">Master of Science</option>
                    <option value="Master of Business Administration">MBA</option>
                    <option value="PhD">PhD</option>
                    <option value="Professional Certificate">Professional Certificate</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Field of Study *</label>
                  <input
                    type="text"
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                    placeholder="e.g. Computer Science"
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
                    placeholder="e.g. Cambridge, MA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">GPA (Optional)</label>
                  <input
                    type="text"
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                    placeholder="e.g. 3.85"
                  />
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
                  Currently studying here
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none resize-none"
                  placeholder="Brief description of your studies..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Achievements & Activities</label>
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
                        placeholder="Achievement or activity..."
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
                {editingId ? 'Update Education' : 'Add Education'}
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
          placeholder="Search education..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
        />
      </div>

      {/* Education List */}
      <div className="space-y-4">
        {filteredEducation.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-cyber-purple/10 shrink-0">
                  <GraduationCap className="h-6 w-6 text-cyber-purple" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-lg">{edu.institution}</h3>
                    {edu.current && (
                      <span className="px-2 py-0.5 rounded text-xs bg-cyber-green/20 text-cyber-green">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-xs font-medium',
                        degreeColors[edu.degree] || 'bg-muted'
                      )}
                    >
                      {edu.degree}
                    </span>
                    <span className="text-muted-foreground">in</span>
                    <span className="font-medium">{edu.field}</span>
                    {edu.gpa && (
                      <span className="text-sm text-muted-foreground">
                        • GPA: {edu.gpa}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {edu.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="text-sm text-muted-foreground mb-3">{edu.description}</p>
                  )}
                  {edu.achievements.length > 0 && (
                    <div className="space-y-1">
                      {edu.achievements.map((achievement, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <Award className="h-3.5 w-3.5 text-cyber-cyan mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => handleEdit(edu)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={() => handleDelete(edu.id)}
                  disabled={deleteId === edu.id}
                >
                  {deleteId === edu.id ? (
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

      {filteredEducation.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No education entries found</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{education.length}</p>
          <p className="text-sm text-muted-foreground">Total Entries</p>
        </div>
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-cyber-cyan">
            {education.filter((e) => e.degree.includes('Bachelor') || e.degree.includes('Master') || e.degree === 'PhD').length}
          </p>
          <p className="text-sm text-muted-foreground">Degrees</p>
        </div>
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-cyber-green">
            {education.filter((e) => e.degree.includes('Certificate')).length}
          </p>
          <p className="text-sm text-muted-foreground">Certificates</p>
        </div>
      </div>
    </AdminLayout>
  )
}

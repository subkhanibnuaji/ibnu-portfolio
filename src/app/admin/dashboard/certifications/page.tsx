'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Award,
  Loader2,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminLayout } from '@/components/admin/admin-layout'
import { cn } from '@/lib/utils'

// Mock data
const mockCertifications = [
  { id: '1', name: 'Leadership', issuer: 'Harvard University', category: 'university', issueDate: '2022-01-15', credentialUrl: '' },
  { id: '2', name: 'Machine Learning', issuer: 'Stanford University', category: 'university', issueDate: '2022-03-20', credentialUrl: '' },
  { id: '3', name: 'Web3 & Blockchain Fundamentals', issuer: 'INSEAD', category: 'university', issueDate: '2023-05-10', credentialUrl: '' },
  { id: '4', name: 'Cybersecurity Specialization', issuer: 'Google', category: 'tech', issueDate: '2024-01-08', credentialUrl: '' },
  { id: '5', name: 'AI Engineering Specialization', issuer: 'IBM', category: 'tech', issueDate: '2024-02-15', credentialUrl: '' },
  { id: '6', name: 'Forward Program', issuer: 'McKinsey & Company', category: 'consulting', issueDate: '2022-06-01', credentialUrl: '' },
  { id: '7', name: 'AWS Fundamentals', issuer: 'Amazon', category: 'tech', issueDate: '2024-03-01', credentialUrl: '' },
  { id: '8', name: 'Project Management', issuer: 'Google', category: 'tech', issueDate: '2024-01-20', credentialUrl: '' },
]

const categoryColors: Record<string, string> = {
  university: 'bg-cyber-purple/20 text-cyber-purple',
  tech: 'bg-cyber-cyan/20 text-cyber-cyan',
  consulting: 'bg-cyber-orange/20 text-cyber-orange',
  finance: 'bg-cyber-green/20 text-cyber-green',
}

const categories = ['All', 'university', 'tech', 'consulting', 'finance']

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState(mockCertifications)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // New certification form state
  const [newCert, setNewCert] = useState({
    name: '',
    issuer: '',
    category: 'tech',
    issueDate: '',
    credentialUrl: '',
  })

  const filteredCerts = certifications.filter((cert) => {
    const matchesSearch =
      cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !filterCategory || cert.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return
    setDeleteId(id)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setCertifications((prev) => prev.filter((c) => c.id !== id))
    setDeleteId(null)
  }

  const handleAdd = async () => {
    if (!newCert.name || !newCert.issuer) return

    const cert = {
      ...newCert,
      id: Date.now().toString(),
    }

    setCertifications((prev) => [cert, ...prev])
    setNewCert({ name: '', issuer: '', category: 'tech', issueDate: '', credentialUrl: '' })
    setIsAdding(false)
  }

  return (
    <AdminLayout
      title="Certifications"
      description="Manage your certifications and credentials"
      actions={
        <Button size="sm" variant="gradient" onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      }
    >
      {/* Add Form Modal */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsAdding(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Add Certification</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={newCert.name}
                  onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                  placeholder="Certification name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Issuer *</label>
                <input
                  type="text"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                  placeholder="Issuing organization"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={newCert.category}
                  onChange={(e) => setNewCert({ ...newCert, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                >
                  <option value="university">University</option>
                  <option value="tech">Tech</option>
                  <option value="consulting">Consulting</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Issue Date</label>
                <input
                  type="date"
                  value={newCert.issueDate}
                  onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Credential URL</label>
                <input
                  type="url"
                  value={newCert.credentialUrl}
                  onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button variant="gradient" onClick={handleAdd}>
                Add Certification
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search certifications..."
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
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCerts.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass rounded-xl p-5 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-cyber-cyan/10">
                <Award className="h-5 w-5 text-cyber-cyan" />
              </div>
              <span
                className={cn(
                  'px-2 py-1 rounded text-xs font-medium capitalize',
                  categoryColors[cert.category] || 'bg-muted'
                )}
              >
                {cert.category}
              </span>
            </div>
            <h3 className="font-semibold mb-1 line-clamp-2">{cert.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{cert.issuer}</p>
            {cert.issueDate && (
              <p className="text-xs text-muted-foreground">
                Issued: {new Date(cert.issueDate).toLocaleDateString()}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              {cert.credentialUrl && (
                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              )}
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                onClick={() => handleDelete(cert.id)}
                disabled={deleteId === cert.id}
              >
                {deleteId === cert.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCerts.length === 0 && (
        <div className="text-center py-12">
          <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No certifications found</p>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{certifications.length}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-cyber-purple">
            {certifications.filter((c) => c.category === 'university').length}
          </p>
          <p className="text-sm text-muted-foreground">University</p>
        </div>
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-cyber-cyan">
            {certifications.filter((c) => c.category === 'tech').length}
          </p>
          <p className="text-sm text-muted-foreground">Tech</p>
        </div>
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-cyber-orange">
            {certifications.filter((c) => c.category === 'consulting').length}
          </p>
          <p className="text-sm text-muted-foreground">Consulting</p>
        </div>
      </div>
    </AdminLayout>
  )
}

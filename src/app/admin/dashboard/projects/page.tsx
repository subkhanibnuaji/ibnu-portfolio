'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Github,
  Search,
  Filter,
  MoreHorizontal,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminLayout } from '@/components/admin/admin-layout'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// Mock data - will be replaced with API calls when database is connected
const mockProjects = [
  {
    id: '1',
    slug: 'hub-pkp',
    title: 'HUB PKP - Klinik Rumah',
    description: 'Comprehensive digital platform for Indonesia\'s self-built housing program.',
    category: 'Government',
    status: 'IN_PROGRESS',
    featured: true,
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    createdAt: '2024-08-01',
  },
  {
    id: '2',
    slug: 'sibaru',
    title: 'SIBARU',
    description: 'Enterprise information system for ministry operations.',
    category: 'Government',
    status: 'COMPLETED',
    featured: false,
    technologies: ['React', 'FastAPI', 'PostgreSQL'],
    createdAt: '2024-06-15',
  },
  {
    id: '3',
    slug: 'simoni',
    title: 'SIMONI',
    description: 'Monitoring and evaluation system for housing programs.',
    category: 'Government',
    status: 'COMPLETED',
    featured: false,
    technologies: ['React', 'Node.js', 'MongoDB'],
    createdAt: '2024-05-01',
  },
  {
    id: '4',
    slug: 'icp-token-dapp',
    title: 'ICP Token dApp',
    description: 'Fungible token canister on Internet Computer.',
    category: 'Web3',
    status: 'COMPLETED',
    featured: false,
    technologies: ['Motoko', 'React', 'Internet Computer'],
    createdAt: '2023-12-01',
  },
]

const statusColors = {
  PLANNING: 'bg-yellow-500/20 text-yellow-500',
  IN_PROGRESS: 'bg-cyber-cyan/20 text-cyber-cyan',
  COMPLETED: 'bg-cyber-green/20 text-cyber-green',
  ON_HOLD: 'bg-orange-500/20 text-orange-500',
  ARCHIVED: 'bg-muted text-muted-foreground',
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState(mockProjects)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !filterStatus || project.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    setDeleteId(id)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setDeleteId(null)
  }

  const handleToggleFeatured = async (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    )
  }

  return (
    <AdminLayout
      title="Projects"
      description="Manage your portfolio projects"
      actions={
        <Link href="/admin/dashboard/projects/new">
          <Button size="sm" variant="gradient">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      }
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan outline-none"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'IN_PROGRESS', 'COMPLETED', 'PLANNING'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === (status === 'All' ? null : status) ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status === 'All' ? null : status)}
            >
              {status === 'All' ? 'All' : status.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium">Project</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Category</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium hidden lg:table-cell">Featured</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project, index) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {project.description}
                      </p>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded text-xs bg-muted"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-0.5 rounded text-xs bg-muted">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-sm">{project.category}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        statusColors[project.status as keyof typeof statusColors]
                      )}
                    >
                      {project.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <button
                      onClick={() => handleToggleFeatured(project.id)}
                      className={cn(
                        'p-1 rounded transition-colors',
                        project.featured
                          ? 'text-cyber-green hover:bg-cyber-green/10'
                          : 'text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {project.featured ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/dashboard/projects/${project.id}`}>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        onClick={() => handleDelete(project.id)}
                        disabled={deleteId === project.id}
                      >
                        {deleteId === project.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProjects.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No projects found</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{projects.length}</p>
          <p className="text-sm text-muted-foreground">Total Projects</p>
        </div>
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-cyber-green">
            {projects.filter((p) => p.status === 'COMPLETED').length}
          </p>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-cyber-cyan">
            {projects.filter((p) => p.status === 'IN_PROGRESS').length}
          </p>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </div>
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-cyber-orange">
            {projects.filter((p) => p.featured).length}
          </p>
          <p className="text-sm text-muted-foreground">Featured</p>
        </div>
      </div>
    </AdminLayout>
  )
}

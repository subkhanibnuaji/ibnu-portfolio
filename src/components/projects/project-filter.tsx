'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, Grid, List, SortAsc, SortDesc } from 'lucide-react'

interface Project {
  id: string
  title: string
  description?: string
  technologies: string[]
  category?: string
  featured?: boolean
  createdAt: Date | string
}

interface ProjectFilterProps {
  projects: Project[]
  onFilteredChange: (filtered: Project[]) => void
  className?: string
}

type SortOption = 'newest' | 'oldest' | 'title' | 'featured'
type ViewMode = 'grid' | 'list'

export function ProjectFilter({
  projects,
  onFilteredChange,
  className = ''
}: ProjectFilterProps) {
  const [search, setSearch] = useState('')
  const [selectedTech, setSelectedTech] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique technologies and categories
  const allTechnologies = useMemo(() => {
    const techs = new Set<string>()
    projects.forEach(p => p.technologies.forEach(t => techs.add(t)))
    return Array.from(techs).sort()
  }, [projects])

  const allCategories = useMemo(() => {
    const cats = new Set<string>()
    projects.forEach(p => {
      if (p.category) cats.add(p.category)
    })
    return Array.from(cats).sort()
  }, [projects])

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let result = [...projects]

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.technologies.some(t => t.toLowerCase().includes(searchLower))
      )
    }

    // Tech filter
    if (selectedTech.length > 0) {
      result = result.filter(p =>
        selectedTech.every(tech => p.technologies.includes(tech))
      )
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory)
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'featured':
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    return result
  }, [projects, search, selectedTech, selectedCategory, sortBy])

  // Update parent when filtered changes
  useMemo(() => {
    onFilteredChange(filteredProjects)
  }, [filteredProjects, onFilteredChange])

  const clearFilters = () => {
    setSearch('')
    setSelectedTech([])
    setSelectedCategory(null)
    setSortBy('newest')
  }

  const hasActiveFilters = search || selectedTech.length > 0 || selectedCategory

  return (
    <div className={className}>
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari project..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
              ${showFilters ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-accent'}
            `}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </button>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="title">A-Z</option>
            <option value="featured">Featured</option>
          </select>

          {/* View mode */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="p-4 rounded-lg border border-border bg-card space-y-4">
              {/* Categories */}
              {allCategories.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Kategori</label>
                  <div className="flex flex-wrap gap-2">
                    {allCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                        className={`
                          px-3 py-1.5 text-sm rounded-full border transition-colors
                          ${selectedCategory === cat
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary/50'
                          }
                        `}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              <div>
                <label className="text-sm font-medium mb-2 block">Teknologi</label>
                <div className="flex flex-wrap gap-2">
                  {allTechnologies.slice(0, 20).map(tech => (
                    <button
                      key={tech}
                      onClick={() => {
                        setSelectedTech(prev =>
                          prev.includes(tech)
                            ? prev.filter(t => t !== tech)
                            : [...prev, tech]
                        )
                      }}
                      className={`
                        px-3 py-1.5 text-sm rounded-full border transition-colors
                        ${selectedTech.includes(tech)
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary/50'
                        }
                      `}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Menampilkan {filteredProjects.length} dari {projects.length} project
      </p>
    </div>
  )
}

// Export view mode for parent component
export type { ViewMode, Project as FilterableProject }

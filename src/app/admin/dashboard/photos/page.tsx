'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FolderKanban,
  Award,
  GraduationCap,
  Briefcase,
  Users,
  Mail,
  Settings,
  LogOut,
  Upload,
  Image as ImageIcon,
  Trash2,
  Loader2,
  Menu,
  X,
  Plus,
  Check,
  Camera,
  User,
  Building,
  Presentation,
  Network
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/admin/dashboard' },
  { icon: FolderKanban, label: 'Projects', href: '/admin/dashboard/projects' },
  { icon: ImageIcon, label: 'Photo Gallery', href: '/admin/dashboard/photos', active: true },
  { icon: Award, label: 'Certifications', href: '/admin/dashboard/certifications' },
  { icon: Briefcase, label: 'Experience', href: '/admin/dashboard/experience' },
  { icon: GraduationCap, label: 'Education', href: '/admin/dashboard/education' },
  { icon: Users, label: 'Testimonials', href: '/admin/dashboard/testimonials' },
  { icon: Mail, label: 'Messages', href: '/admin/dashboard/messages' },
  { icon: Settings, label: 'Settings', href: '/admin/dashboard/settings' },
]

const photoCategories = [
  { id: 'hero', label: 'Profile / Hero', icon: User, color: 'cyber-cyan', description: 'Main profile photo for hero section' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: 'cyber-purple', description: 'Graduation and education photos' },
  { id: 'presentations', label: 'Presentations', icon: Presentation, color: 'cyber-orange', description: 'Speaking and pitching photos' },
  { id: 'networking', label: 'Networking', icon: Network, color: 'cyber-green', description: 'Photos with industry leaders' },
  { id: 'organizations', label: 'Organizations', icon: Building, color: 'cyber-pink', description: 'HIPMI, CFA, and other organizations' },
]

interface UploadedPhoto {
  id: string
  src: string
  alt: string
  caption: string
  category: string
  person?: string
  role?: string
  uploadedAt: string
}

export default function PhotoGalleryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [uploading, setUploading] = useState(false)
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [dragActive, setDragActive] = useState(false)

  // Form state for new photo
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [newPhoto, setNewPhoto] = useState({
    file: null as File | null,
    preview: '',
    category: 'networking',
    caption: '',
    person: '',
    role: '',
    alt: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  // Load existing photos from localStorage (or API in production)
  useEffect(() => {
    const savedPhotos = localStorage.getItem('portfolio-photos')
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos))
    }
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewPhoto(prev => ({
          ...prev,
          file,
          preview: e.target?.result as string
        }))
        setShowUploadForm(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!newPhoto.file || !newPhoto.caption) return

    setUploading(true)

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const uploadedPhoto: UploadedPhoto = {
      id: Date.now().toString(),
      src: newPhoto.preview, // In production, this would be the uploaded URL
      alt: newPhoto.alt || newPhoto.caption,
      caption: newPhoto.caption,
      category: newPhoto.category,
      person: newPhoto.person,
      role: newPhoto.role,
      uploadedAt: new Date().toISOString()
    }

    const updatedPhotos = [...photos, uploadedPhoto]
    setPhotos(updatedPhotos)
    localStorage.setItem('portfolio-photos', JSON.stringify(updatedPhotos))

    // Reset form
    setNewPhoto({
      file: null,
      preview: '',
      category: 'networking',
      caption: '',
      person: '',
      role: '',
      alt: ''
    })
    setShowUploadForm(false)
    setUploading(false)
  }

  const handleDeletePhoto = (id: string) => {
    const updatedPhotos = photos.filter(p => p.id !== id)
    setPhotos(updatedPhotos)
    localStorage.setItem('portfolio-photos', JSON.stringify(updatedPhotos))
  }

  const filteredPhotos = selectedCategory === 'all'
    ? photos
    : photos.filter(p => p.category === selectedCategory)

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-cyber-cyan" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyber-gradient flex items-center justify-center">
                <span className="text-white font-bold text-sm">IA</span>
              </div>
              <span className="font-bold">Admin Panel</span>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = item.active
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-cyber-cyan/10 text-cyber-cyan'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-cyber-gradient flex items-center justify-center">
                <span className="text-white font-medium">
                  {session.user?.name?.[0] || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session.user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold flex items-center gap-2">
              <Camera className="h-5 w-5 text-cyber-cyan" />
              Photo Gallery Manager
            </h1>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInputChange}
              />
              <Button size="sm" variant="gradient" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </span>
              </Button>
            </label>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Category Filter */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Filter by Category</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
              >
                All Photos
              </Button>
              {photoCategories.map((cat) => {
                const Icon = cat.icon
                return (
                  <Button
                    key={cat.id}
                    size="sm"
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={selectedCategory === cat.id ? '' : `hover:text-${cat.color}`}
                  >
                    <Icon className="h-4 w-4 mr-1.5" />
                    {cat.label}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Upload Form Modal */}
          {showUploadForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowUploadForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-4">Upload New Photo</h3>

                {/* Preview */}
                {newPhoto.preview && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={newPhoto.preview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      value={newPhoto.category}
                      onChange={(e) => setNewPhoto(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-primary outline-none"
                    >
                      {photoCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Caption *</label>
                    <input
                      type="text"
                      value={newPhoto.caption}
                      onChange={(e) => setNewPhoto(prev => ({ ...prev, caption: e.target.value }))}
                      placeholder="e.g., HIPMI Bandung Welcome Event"
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Person Name (optional)</label>
                    <input
                      type="text"
                      value={newPhoto.person}
                      onChange={(e) => setNewPhoto(prev => ({ ...prev, person: e.target.value }))}
                      placeholder="e.g., Raymond Chin"
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Person Role (optional)</label>
                    <input
                      type="text"
                      value={newPhoto.role}
                      onChange={(e) => setNewPhoto(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g., Founder, Ternak Uang"
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Alt Text</label>
                    <input
                      type="text"
                      value={newPhoto.alt}
                      onChange={(e) => setNewPhoto(prev => ({ ...prev, alt: e.target.value }))}
                      placeholder="Description for accessibility"
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-primary outline-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowUploadForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="gradient"
                    className="flex-1"
                    onClick={handleUpload}
                    disabled={uploading || !newPhoto.caption}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Upload Photo
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Drag & Drop Zone */}
          <div
            className={cn(
              'border-2 border-dashed rounded-2xl p-8 mb-8 text-center transition-colors',
              dragActive
                ? 'border-cyber-cyan bg-cyber-cyan/5'
                : 'border-border hover:border-primary/50'
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Drag & Drop Photos Here</h3>
            <p className="text-sm text-muted-foreground mb-4">
              or click the Upload button above
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: JPG, PNG, WebP (max 10MB)
            </p>
          </div>

          {/* Photo Categories Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {photoCategories.map((cat) => {
              const Icon = cat.icon
              const count = photos.filter(p => p.category === cat.id).length
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'glass rounded-xl p-4 cursor-pointer transition-all hover:scale-105',
                    selectedCategory === cat.id && `border-${cat.color}/50 border-2`
                  )}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <div className={`p-2 rounded-lg bg-${cat.color}/10 w-fit mb-3`}>
                    <Icon className={`h-5 w-5 text-${cat.color}`} />
                  </div>
                  <h3 className="font-semibold text-sm">{cat.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{count} photos</p>
                </motion.div>
              )
            })}
          </div>

          {/* Photos Grid */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              {selectedCategory === 'all' ? 'All Photos' : photoCategories.find(c => c.id === selectedCategory)?.label}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredPhotos.length} photos)
              </span>
            </h2>
          </div>

          {filteredPhotos.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="font-semibold mb-2">No Photos Yet</h3>
              <p className="text-sm text-muted-foreground">
                Upload photos to see them here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative rounded-xl overflow-hidden bg-card border border-border"
                >
                  <div className="relative h-48">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDeletePhoto(photo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm truncate">{photo.caption}</p>
                    {photo.person && (
                      <p className="text-xs text-cyber-cyan truncate">{photo.person}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                      {photoCategories.find(c => c.id === photo.category)?.label || photo.category}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

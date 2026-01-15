'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  FolderKanban,
  Award,
  Briefcase,
  GraduationCap,
  Code2,
  Mail,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/admin/dashboard' },
  { icon: FolderKanban, label: 'Projects', href: '/admin/dashboard/projects' },
  { icon: Award, label: 'Certifications', href: '/admin/dashboard/certifications' },
  { icon: Briefcase, label: 'Experience', href: '/admin/dashboard/experience' },
  { icon: GraduationCap, label: 'Education', href: '/admin/dashboard/education' },
  { icon: Code2, label: 'Skills', href: '/admin/dashboard/skills' },
  { icon: FileText, label: 'Blog', href: '/admin/dashboard/blog' },
  { icon: Mail, label: 'Messages', href: '/admin/dashboard/messages' },
  { icon: Settings, label: 'Settings', href: '/admin/dashboard/settings' },
]

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  actions?: React.ReactNode
}

export function AdminLayout({ children, title, description, actions }: AdminLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

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

  // Get breadcrumb from pathname
  const pathParts = pathname.split('/').filter(Boolean)
  const breadcrumbs = pathParts.map((part, index) => ({
    label: part.charAt(0).toUpperCase() + part.slice(1),
    href: '/' + pathParts.slice(0, index + 1).join('/'),
  }))

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
          <div className="p-6 border-b border-border flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyber-gradient flex items-center justify-center">
                <span className="text-white font-bold text-sm">IA</span>
              </div>
              <span className="font-bold">Admin Panel</span>
            </Link>
            <button
              className="lg:hidden p-1 rounded hover:bg-muted"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
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

          {/* User Info */}
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
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-muted"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Breadcrumb */}
              <nav className="hidden md:flex items-center gap-1 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center gap-1">
                    {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    <Link
                      href={crumb.href}
                      className={cn(
                        'hover:text-foreground transition-colors',
                        index === breadcrumbs.length - 1
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground'
                      )}
                    >
                      {crumb.label}
                    </Link>
                  </div>
                ))}
              </nav>
            </div>

            {actions}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>

          {children}
        </main>
      </div>
    </div>
  )
}

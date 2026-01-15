'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
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
  Plus,
  Loader2,
  Menu,
  X,
  BarChart3,
  Eye,
  MessageSquare,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/admin/dashboard' },
  { icon: FolderKanban, label: 'Projects', href: '/admin/dashboard/projects' },
  { icon: Award, label: 'Certifications', href: '/admin/dashboard/certifications' },
  { icon: Briefcase, label: 'Experience', href: '/admin/dashboard/experience' },
  { icon: GraduationCap, label: 'Education', href: '/admin/dashboard/education' },
  { icon: Users, label: 'Testimonials', href: '/admin/dashboard/testimonials' },
  { icon: Mail, label: 'Messages', href: '/admin/dashboard/messages' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/dashboard/analytics' },
  { icon: Settings, label: 'Settings', href: '/admin/dashboard/settings' },
]

const stats = [
  { label: 'Total Projects', value: '7', change: '+2 this month', icon: FolderKanban, color: 'cyber-cyan' },
  { label: 'Certifications', value: '50+', change: '+5 this year', icon: Award, color: 'cyber-purple' },
  { label: 'Page Views', value: '1.2K', change: '+15% vs last week', icon: Eye, color: 'cyber-green' },
  { label: 'Messages', value: '12', change: '3 unread', icon: MessageSquare, color: 'cyber-orange' },
]

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
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
              const isActive = item.href === '/admin/dashboard'
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
            <h1 className="text-lg font-semibold">Dashboard Overview</h1>
            <Button size="sm" variant="gradient">
              <Plus className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-xl p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-cyber-green" />
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                      <Icon className={`h-5 w-5 text-${stat.color}`} />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/admin/dashboard/projects/new"
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <FolderKanban className="h-6 w-6 text-cyber-cyan" />
                  <span className="text-sm">New Project</span>
                </Link>
                <Link
                  href="/admin/dashboard/certifications/new"
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Award className="h-6 w-6 text-cyber-purple" />
                  <span className="text-sm">Add Certification</span>
                </Link>
                <Link
                  href="/admin/dashboard/experience/new"
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Briefcase className="h-6 w-6 text-cyber-green" />
                  <span className="text-sm">Add Experience</span>
                </Link>
                <Link
                  href="/admin/dashboard/messages"
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Mail className="h-6 w-6 text-cyber-orange" />
                  <span className="text-sm">View Messages</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyber-cyan/10 flex items-center justify-center flex-shrink-0">
                    <FolderKanban className="h-4 w-4 text-cyber-cyan" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">HUB PKP project updated</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyber-green/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-cyber-green" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New message from John Doe</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyber-purple/10 flex items-center justify-center flex-shrink-0">
                    <Award className="h-4 w-4 text-cyber-purple" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New certification added</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Database Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold mb-4">System Status</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="w-3 h-3 rounded-full bg-cyber-green mx-auto mb-2" />
                <p className="text-sm font-medium">Database</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="w-3 h-3 rounded-full bg-cyber-green mx-auto mb-2" />
                <p className="text-sm font-medium">Auth</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="w-3 h-3 rounded-full bg-cyber-green mx-auto mb-2" />
                <p className="text-sm font-medium">Storage</p>
                <p className="text-xs text-muted-foreground">Ready</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="w-3 h-3 rounded-full bg-cyber-green mx-auto mb-2" />
                <p className="text-sm font-medium">API</p>
                <p className="text-xs text-muted-foreground">Operational</p>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

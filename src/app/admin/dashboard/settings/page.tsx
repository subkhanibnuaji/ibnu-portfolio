'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Save,
  User,
  Lock,
  Bell,
  Globe,
  Palette,
  Database,
  Shield,
  Loader2,
  Check,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminLayout } from '@/components/admin/admin-layout'
import { ImageUpload } from '@/components/ui/image-upload'
import { cn } from '@/lib/utils'

// Mock settings data
const mockSettings = {
  profile: {
    name: 'Ibnu Aji',
    email: 'admin@heyibnu.com',
    bio: 'Tech Lead at Ministry of Public Works and Housing, Indonesia. Building digital solutions for government services.',
    avatar: '',
    website: 'https://heyibnu.com',
    twitter: '@ibnuaji',
    github: 'ibnuaji',
    linkedin: 'ibnuaji',
  },
  site: {
    title: 'Ibnu Aji - Portfolio',
    description: 'Tech Lead & Full Stack Developer',
    keywords: 'developer, portfolio, tech lead, indonesia',
    googleAnalytics: '',
    maintenance: false,
  },
  notifications: {
    emailOnContact: true,
    emailOnComment: false,
    weeklyDigest: true,
  },
}

type TabType = 'profile' | 'security' | 'site' | 'notifications'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Form states
  const [profile, setProfile] = useState(mockSettings.profile)
  const [site, setSite] = useState(mockSettings.site)
  const [notifications, setNotifications] = useState(mockSettings.notifications)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'site', label: 'Site Settings', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)

    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log('Saving settings:', { profile, site, notifications })

    // When database is connected:
    // await fetch('/api/settings', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ profile, site, notifications }),
    // })

    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match')
      return
    }

    if (passwords.new.length < 8) {
      alert('Password must be at least 8 characters')
      return
    }

    setIsSaving(true)

    // Simulate password change
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log('Changing password')

    // When database is connected:
    // await fetch('/api/auth/change-password', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(passwords),
    // })

    setPasswords({ current: '', new: '', confirm: '' })
    setIsSaving(false)
    alert('Password changed successfully')
  }

  return (
    <AdminLayout
      title="Settings"
      description="Manage your account and site settings"
      actions={
        <Button variant="gradient" size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : saveSuccess ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saveSuccess ? 'Saved!' : 'Save Changes'}
        </Button>
      }
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:w-56 shrink-0">
          <nav className="flex lg:flex-col gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors text-left',
                    activeTab === tab.id
                      ? 'bg-cyber-cyan/10 text-cyber-cyan'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6"
          >
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Profile Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your personal information and social links
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-40 shrink-0">
                    <label className="block text-sm font-medium mb-2">Avatar</label>
                    <ImageUpload
                      value={profile.avatar}
                      onChange={(url) => setProfile({ ...profile, avatar: url })}
                      aspectRatio="square"
                      placeholder="Upload avatar"
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="font-medium mb-4">Social Links</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Website</label>
                      <input
                        type="url"
                        value={profile.website}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                        placeholder="https://yoursite.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Twitter</label>
                      <input
                        type="text"
                        value={profile.twitter}
                        onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                        placeholder="@username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">GitHub</label>
                      <input
                        type="text"
                        value={profile.github}
                        onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                        placeholder="username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">LinkedIn</label>
                      <input
                        type="text"
                        value={profile.linkedin}
                        onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Change Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your password to keep your account secure
                  </p>
                </div>

                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        className="w-full px-3 py-2 pr-10 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum 8 characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                    />
                  </div>
                  <Button onClick={handlePasswordChange} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Lock className="h-4 w-4 mr-2" />}
                    Update Password
                  </Button>
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Security Status
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <span className="text-sm">Two-factor authentication</span>
                      <span className="text-sm text-yellow-500">Not enabled</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <span className="text-sm">Last password change</span>
                      <span className="text-sm text-muted-foreground">30 days ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <span className="text-sm">Active sessions</span>
                      <span className="text-sm text-muted-foreground">1 device</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Site Settings */}
            {activeTab === 'site' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Site Configuration</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your website settings and SEO
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Site Title</label>
                    <input
                      type="text"
                      value={site.title}
                      onChange={(e) => setSite({ ...site, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Site Description</label>
                    <textarea
                      value={site.description}
                      onChange={(e) => setSite({ ...site, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Keywords</label>
                    <input
                      type="text"
                      value={site.keywords}
                      onChange={(e) => setSite({ ...site, keywords: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                      placeholder="Comma-separated keywords"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Google Analytics ID</label>
                    <input
                      type="text"
                      value={site.googleAnalytics}
                      onChange={(e) => setSite({ ...site, googleAnalytics: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none"
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Maintenance Mode</h4>
                      <p className="text-sm text-muted-foreground">
                        Temporarily disable your site for visitors
                      </p>
                    </div>
                    <button
                      onClick={() => setSite({ ...site, maintenance: !site.maintenance })}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        site.maintenance ? 'bg-cyber-cyan' : 'bg-muted'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          site.maintenance ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage how you receive notifications
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                    <div>
                      <p className="font-medium">Contact Form Submissions</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone submits the contact form
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications({ ...notifications, emailOnContact: !notifications.emailOnContact })
                      }
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        notifications.emailOnContact ? 'bg-cyber-cyan' : 'bg-border'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          notifications.emailOnContact ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                    <div>
                      <p className="font-medium">Blog Comments</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone comments on your blog
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications({ ...notifications, emailOnComment: !notifications.emailOnComment })
                      }
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        notifications.emailOnComment ? 'bg-cyber-cyan' : 'bg-border'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          notifications.emailOnComment ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                    <div>
                      <p className="font-medium">Weekly Digest</p>
                      <p className="text-sm text-muted-foreground">
                        Receive a weekly summary of your site activity
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications({ ...notifications, weeklyDigest: !notifications.weeklyDigest })
                      }
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        notifications.weeklyDigest ? 'bg-cyber-cyan' : 'bg-border'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          notifications.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}

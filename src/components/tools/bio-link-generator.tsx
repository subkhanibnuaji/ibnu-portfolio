'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Link, Plus, Trash2, Copy, Check, GripVertical, ExternalLink,
  Github, Twitter, Linkedin, Instagram, Youtube, Globe, Mail, Phone,
  Music, Coffee, Twitch, Facebook, MessageCircle
} from 'lucide-react'

interface BioLink {
  id: string
  title: string
  url: string
  icon: string
  enabled: boolean
}

const iconOptions = [
  { id: 'globe', icon: Globe, label: 'Website' },
  { id: 'github', icon: Github, label: 'GitHub' },
  { id: 'twitter', icon: Twitter, label: 'Twitter' },
  { id: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
  { id: 'instagram', icon: Instagram, label: 'Instagram' },
  { id: 'youtube', icon: Youtube, label: 'YouTube' },
  { id: 'mail', icon: Mail, label: 'Email' },
  { id: 'phone', icon: Phone, label: 'Phone' },
  { id: 'music', icon: Music, label: 'Music' },
  { id: 'coffee', icon: Coffee, label: 'Support' },
  { id: 'twitch', icon: Twitch, label: 'Twitch' },
  { id: 'facebook', icon: Facebook, label: 'Facebook' },
  { id: 'message', icon: MessageCircle, label: 'Chat' }
]

const themes = [
  { id: 'minimal', name: 'Minimal', bg: 'bg-white', text: 'text-gray-900', button: 'bg-gray-900 text-white' },
  { id: 'dark', name: 'Dark', bg: 'bg-gray-900', text: 'text-white', button: 'bg-gray-800 text-white border border-gray-700' },
  { id: 'gradient', name: 'Gradient', bg: 'bg-gradient-to-br from-purple-600 to-pink-500', text: 'text-white', button: 'bg-white/20 text-white backdrop-blur' },
  { id: 'neon', name: 'Neon', bg: 'bg-black', text: 'text-cyan-400', button: 'bg-transparent text-cyan-400 border border-cyan-400' },
  { id: 'nature', name: 'Nature', bg: 'bg-gradient-to-br from-green-600 to-emerald-500', text: 'text-white', button: 'bg-white/20 text-white backdrop-blur' },
  { id: 'sunset', name: 'Sunset', bg: 'bg-gradient-to-br from-orange-500 to-red-500', text: 'text-white', button: 'bg-white/20 text-white backdrop-blur' }
]

export function BioLinkGenerator() {
  const [name, setName] = useState('Your Name')
  const [bio, setBio] = useState('Digital creator & developer')
  const [avatar, setAvatar] = useState('')
  const [links, setLinks] = useState<BioLink[]>([
    { id: '1', title: 'My Website', url: 'https://example.com', icon: 'globe', enabled: true },
    { id: '2', title: 'Follow on Twitter', url: 'https://twitter.com', icon: 'twitter', enabled: true },
    { id: '3', title: 'Connect on LinkedIn', url: 'https://linkedin.com', icon: 'linkedin', enabled: true }
  ])
  const [selectedTheme, setSelectedTheme] = useState(themes[0])
  const [copied, setCopied] = useState(false)
  const [showCode, setShowCode] = useState(false)

  const addLink = () => {
    const newLink: BioLink = {
      id: Date.now().toString(),
      title: 'New Link',
      url: '',
      icon: 'globe',
      enabled: true
    }
    setLinks([...links, newLink])
  }

  const updateLink = (id: string, field: keyof BioLink, value: string | boolean) => {
    setLinks(links.map(link =>
      link.id === id ? { ...link, [field]: value } : link
    ))
  }

  const removeLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id))
  }

  const moveLink = (index: number, direction: 'up' | 'down') => {
    const newLinks = [...links]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= links.length) return
    [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]]
    setLinks(newLinks)
  }

  const getIconComponent = (iconId: string) => {
    return iconOptions.find(opt => opt.id === iconId)?.icon || Globe
  }

  const generateHTML = () => {
    const enabledLinks = links.filter(l => l.enabled)
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - Links</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="${selectedTheme.bg} min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full text-center">
    ${avatar ? `<img src="${avatar}" alt="${name}" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover">` : ''}
    <h1 class="${selectedTheme.text} text-2xl font-bold mb-2">${name}</h1>
    <p class="${selectedTheme.text} opacity-80 mb-8">${bio}</p>
    <div class="space-y-3">
${enabledLinks.map(link => `      <a href="${link.url}" target="_blank" class="${selectedTheme.button} block w-full py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity">${link.title}</a>`).join('\n')}
    </div>
  </div>
</body>
</html>`
  }

  const copyHTML = () => {
    navigator.clipboard.writeText(generateHTML())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor */}
      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="font-semibold mb-4">Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-lg border border-border bg-background"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Bio</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-lg border border-border bg-background"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Avatar URL</label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full mt-1 px-4 py-2 rounded-lg border border-border bg-background"
              />
            </div>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="font-semibold mb-4">Theme</h3>
          <div className="grid grid-cols-3 gap-2">
            {themes.map(theme => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedTheme.id === theme.id
                    ? 'border-primary'
                    : 'border-transparent'
                }`}
              >
                <div className={`h-12 rounded-lg ${theme.bg} mb-2`} />
                <p className="text-xs font-medium">{theme.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Links</h3>
            <button
              onClick={addLink}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
            >
              <Plus className="w-4 h-4" />
              Add Link
            </button>
          </div>

          <div className="space-y-3">
            {links.map((link, index) => (
              <motion.div
                key={link.id}
                layout
                className="p-4 rounded-lg border border-border bg-muted/50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 pt-2">
                    <button
                      onClick={() => moveLink(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-muted rounded disabled:opacity-30"
                    >
                      <GripVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                      <select
                        value={link.icon}
                        onChange={(e) => updateLink(link.id, 'icon', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-border bg-background"
                      >
                        {iconOptions.map(opt => (
                          <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                        placeholder="Link title"
                        className="flex-1 px-3 py-2 rounded-lg border border-border bg-background"
                      />
                    </div>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={link.enabled}
                        onChange={(e) => updateLink(link.id, 'enabled', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-xs">Show</span>
                    </label>
                    <button
                      onClick={() => removeLink(link.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Export */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={copyHTML}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? 'Copied!' : 'Copy HTML'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCode(!showCode)}
            className="px-4 py-3 border border-border rounded-lg font-medium"
          >
            {showCode ? 'Hide Code' : 'View Code'}
          </motion.button>
        </div>

        {showCode && (
          <pre className="p-4 rounded-xl border border-border bg-muted overflow-auto max-h-64 text-xs">
            {generateHTML()}
          </pre>
        )}
      </div>

      {/* Preview */}
      <div className="lg:sticky lg:top-24 h-fit">
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="font-semibold mb-4 flex items-center justify-between">
            Preview
            <span className="text-xs text-muted-foreground">Mobile View</span>
          </h3>

          {/* Mobile Preview Frame */}
          <div className="max-w-[320px] mx-auto">
            <div className={`rounded-3xl ${selectedTheme.bg} p-6 min-h-[500px] shadow-xl`}>
              <div className="text-center">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gray-300 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                )}

                <h2 className={`text-xl font-bold ${selectedTheme.text} mb-1`}>
                  {name}
                </h2>
                <p className={`text-sm ${selectedTheme.text} opacity-80 mb-6`}>
                  {bio}
                </p>

                <div className="space-y-3">
                  {links.filter(l => l.enabled).map(link => {
                    const IconComponent = getIconComponent(link.icon)
                    return (
                      <a
                        key={link.id}
                        href={link.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${selectedTheme.button} flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity`}
                      >
                        <IconComponent className="w-4 h-4" />
                        {link.title}
                        <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

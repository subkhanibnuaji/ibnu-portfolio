'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User, Mail, Phone, Globe, Linkedin, Github, Twitter,
  Instagram, Download, Copy, Check, QrCode, Palette,
  MapPin, Briefcase, Share2
} from 'lucide-react'

interface CardData {
  name: string
  title: string
  company: string
  email: string
  phone: string
  website: string
  location: string
  linkedin: string
  github: string
  twitter: string
  instagram: string
}

interface Theme {
  id: string
  name: string
  background: string
  text: string
  accent: string
}

const THEMES: Theme[] = [
  { id: 'dark', name: 'Dark', background: 'bg-slate-900', text: 'text-white', accent: 'text-blue-400' },
  { id: 'light', name: 'Light', background: 'bg-white', text: 'text-slate-900', accent: 'text-blue-600' },
  { id: 'gradient-blue', name: 'Ocean', background: 'bg-gradient-to-br from-blue-600 to-purple-700', text: 'text-white', accent: 'text-cyan-300' },
  { id: 'gradient-green', name: 'Forest', background: 'bg-gradient-to-br from-green-600 to-teal-700', text: 'text-white', accent: 'text-lime-300' },
  { id: 'gradient-pink', name: 'Sunset', background: 'bg-gradient-to-br from-pink-500 to-orange-500', text: 'text-white', accent: 'text-yellow-200' },
  { id: 'gradient-dark', name: 'Midnight', background: 'bg-gradient-to-br from-slate-800 to-slate-900', text: 'text-white', accent: 'text-purple-400' }
]

export function DigitalBusinessCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [theme, setTheme] = useState<Theme>(THEMES[0])
  const [data, setData] = useState<CardData>({
    name: 'John Doe',
    title: 'Software Engineer',
    company: 'Tech Company',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    website: 'johndoe.com',
    location: 'San Francisco, CA',
    linkedin: 'johndoe',
    github: 'johndoe',
    twitter: 'johndoe',
    instagram: 'johndoe'
  })

  const generateVCard = (): string => {
    return `BEGIN:VCARD
VERSION:3.0
FN:${data.name}
TITLE:${data.title}
ORG:${data.company}
EMAIL:${data.email}
TEL:${data.phone}
URL:${data.website}
ADR:;;${data.location};;;
END:VCARD`
  }

  const downloadVCard = () => {
    const vcard = generateVCard()
    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${data.name.replace(/\s+/g, '_')}.vcf`
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyContact = () => {
    const contact = `${data.name}
${data.title} at ${data.company}
📧 ${data.email}
📱 ${data.phone}
🌐 ${data.website}
📍 ${data.location}`

    navigator.clipboard.writeText(contact)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data.name}'s Contact Card`,
          text: `Connect with ${data.name} - ${data.title} at ${data.company}`,
          url: data.website ? `https://${data.website}` : undefined
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      copyContact()
    }
  }

  const updateField = (field: keyof CardData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  // Simple QR code generation (using a basic pattern)
  const generateQRPattern = (): boolean[][] => {
    const vcard = generateVCard()
    const size = 21
    const pattern: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false))

    // Add finder patterns
    const addFinderPattern = (x: number, y: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
            if (y + i < size && x + j < size) {
              pattern[y + i][x + j] = true
            }
          }
        }
      }
    }

    addFinderPattern(0, 0)
    addFinderPattern(size - 7, 0)
    addFinderPattern(0, size - 7)

    // Add data pattern (simplified)
    for (let i = 0; i < vcard.length && i < 100; i++) {
      const char = vcard.charCodeAt(i)
      const x = 8 + (i % 12)
      const y = 8 + Math.floor(i / 12)
      if (x < size && y < size) {
        pattern[y][x] = char % 2 === 0
      }
    }

    return pattern
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Card Preview */}
          <div>
            <h3 className="text-white font-semibold mb-4">Preview</h3>

            <div
              ref={cardRef}
              className={`${theme.background} rounded-2xl p-6 shadow-2xl max-w-md mx-auto`}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className={`w-20 h-20 mx-auto rounded-full ${theme.id.includes('light') ? 'bg-slate-200' : 'bg-white/10'} flex items-center justify-center mb-4`}>
                  <User className={`w-10 h-10 ${theme.accent}`} />
                </div>
                <h2 className={`text-2xl font-bold ${theme.text}`}>{data.name || 'Your Name'}</h2>
                <p className={theme.accent}>{data.title || 'Your Title'}</p>
                {data.company && (
                  <p className={`${theme.text} opacity-70 text-sm mt-1`}>at {data.company}</p>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                {data.email && (
                  <div className={`flex items-center gap-3 ${theme.text}`}>
                    <Mail className={`w-5 h-5 ${theme.accent}`} />
                    <span className="text-sm">{data.email}</span>
                  </div>
                )}
                {data.phone && (
                  <div className={`flex items-center gap-3 ${theme.text}`}>
                    <Phone className={`w-5 h-5 ${theme.accent}`} />
                    <span className="text-sm">{data.phone}</span>
                  </div>
                )}
                {data.website && (
                  <div className={`flex items-center gap-3 ${theme.text}`}>
                    <Globe className={`w-5 h-5 ${theme.accent}`} />
                    <span className="text-sm">{data.website}</span>
                  </div>
                )}
                {data.location && (
                  <div className={`flex items-center gap-3 ${theme.text}`}>
                    <MapPin className={`w-5 h-5 ${theme.accent}`} />
                    <span className="text-sm">{data.location}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-white/10">
                {data.linkedin && (
                  <div className={`p-2 rounded-full ${theme.id.includes('light') ? 'bg-slate-100' : 'bg-white/10'}`}>
                    <Linkedin className={`w-5 h-5 ${theme.accent}`} />
                  </div>
                )}
                {data.github && (
                  <div className={`p-2 rounded-full ${theme.id.includes('light') ? 'bg-slate-100' : 'bg-white/10'}`}>
                    <Github className={`w-5 h-5 ${theme.accent}`} />
                  </div>
                )}
                {data.twitter && (
                  <div className={`p-2 rounded-full ${theme.id.includes('light') ? 'bg-slate-100' : 'bg-white/10'}`}>
                    <Twitter className={`w-5 h-5 ${theme.accent}`} />
                  </div>
                )}
                {data.instagram && (
                  <div className={`p-2 rounded-full ${theme.id.includes('light') ? 'bg-slate-100' : 'bg-white/10'}`}>
                    <Instagram className={`w-5 h-5 ${theme.accent}`} />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-6 justify-center">
              <button
                onClick={downloadVCard}
                className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600"
              >
                <Download className="w-4 h-4" />
                Save Contact
              </button>
              <button
                onClick={copyContact}
                className="px-4 py-2 bg-white/10 text-white rounded-lg flex items-center gap-2 hover:bg-white/20"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={shareCard}
                className="px-4 py-2 bg-white/10 text-white rounded-lg flex items-center gap-2 hover:bg-white/20"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {/* Theme Selection */}
            <div className="mt-6">
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Theme
              </label>
              <div className="flex flex-wrap gap-2">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      theme.id === t.id
                        ? 'ring-2 ring-blue-500'
                        : ''
                    } ${t.background} ${t.text}`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div>
            <h3 className="text-white font-semibold mb-4">Edit Details</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/50 text-xs mb-1 block">Name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs mb-1 block">Title</label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/50 text-xs mb-1 block">Company</label>
                <input
                  type="text"
                  value={data.company}
                  onChange={(e) => updateField('company', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/50 text-xs mb-1 block">Email</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs mb-1 block">Phone</label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/50 text-xs mb-1 block">Website</label>
                  <input
                    type="text"
                    value={data.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs mb-1 block">Location</label>
                  <input
                    type="text"
                    value={data.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mt-4">
                <h4 className="text-white/70 text-sm mb-3">Social Links</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/50 text-xs mb-1 flex items-center gap-1">
                      <Linkedin className="w-3 h-3" /> LinkedIn
                    </label>
                    <input
                      type="text"
                      value={data.linkedin}
                      onChange={(e) => updateField('linkedin', e.target.value)}
                      placeholder="username"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs mb-1 flex items-center gap-1">
                      <Github className="w-3 h-3" /> GitHub
                    </label>
                    <input
                      type="text"
                      value={data.github}
                      onChange={(e) => updateField('github', e.target.value)}
                      placeholder="username"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs mb-1 flex items-center gap-1">
                      <Twitter className="w-3 h-3" /> Twitter
                    </label>
                    <input
                      type="text"
                      value={data.twitter}
                      onChange={(e) => updateField('twitter', e.target.value)}
                      placeholder="username"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs mb-1 flex items-center gap-1">
                      <Instagram className="w-3 h-3" /> Instagram
                    </label>
                    <input
                      type="text"
                      value={data.instagram}
                      onChange={(e) => updateField('instagram', e.target.value)}
                      placeholder="username"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

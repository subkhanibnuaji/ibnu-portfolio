'use client'

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import {
  Smartphone,
  Globe,
  Download,
  Github,
  Check,
  Sparkles,
  Palette,
  Zap,
  Wifi,
  Shield,
  HardDrive,
  MonitorSmartphone,
  Loader2,
  AlertCircle,
  Home,
  FolderKanban,
  User,
  Wrench,
  Mail
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

const features = [
  {
    icon: Globe,
    title: 'Cross-Platform',
    description: 'Satu codebase untuk Android, iOS, dan Web'
  },
  {
    icon: Palette,
    title: 'Dark Theme',
    description: 'Desain modern dengan dark mode yang nyaman'
  },
  {
    icon: Zap,
    title: 'Smooth Animations',
    description: 'Animasi fluid dengan React Native Reanimated'
  },
  {
    icon: Wifi,
    title: 'Offline Support',
    description: 'Caching data untuk akses offline'
  }
]

const screens = [
  { name: 'Home', description: 'Dashboard dengan statistik dan quick links' },
  { name: 'Projects', description: 'Daftar project dengan filter kategori' },
  { name: 'About', description: 'Profil, pengalaman, dan pendidikan' },
  { name: 'Skills', description: 'Skills dengan progress bar animasi' },
  { name: 'Contact', description: 'Form kontak dengan validasi' }
]

const techStack = [
  'React Native',
  'Expo SDK 51',
  'TypeScript',
  'Expo Router',
  'Zustand',
  'React Query',
  'Reanimated'
]

const tabIcons = [Home, FolderKanban, User, Wrench, Mail]

interface ReleaseInfo {
  version: string
  downloadUrl: string
  size: string
  publishedAt: string
}

// Interactive 3D Phone Component
function Interactive3DPhone() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState(0)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 100, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 100, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = (e.clientX - centerX) / rect.width
    const y = (e.clientY - centerY) / rect.height
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  // Auto cycle tabs
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => (prev + 1) % 5)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex justify-center perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        animate={{
          y: [0, -10, 0]
        }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        {/* Phone Frame */}
        <motion.div
          className="w-[280px] h-[580px] bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-[3rem] p-3 shadow-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="w-full h-full bg-zinc-950 rounded-[2.5rem] overflow-hidden relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-zinc-900 rounded-b-2xl z-10" />

            {/* Screen Content */}
            <div className="w-full h-full bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 pt-10">
              {/* Status Bar */}
              <motion.div
                className="flex justify-between text-xs text-zinc-500 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span>9:41</span>
                <div className="flex gap-1 items-center">
                  <Wifi className="h-3 w-3" />
                  <span>100%</span>
                </div>
              </motion.div>

              {/* App Header */}
              <motion.div
                className="text-center mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-2xl font-bold text-white">IA</span>
                </motion.div>
                <h3 className="text-white font-bold">Ibnu Portfolio</h3>
                <p className="text-zinc-500 text-xs">Mobile App</p>
              </motion.div>

              {/* Quick Stats - Animated */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: 'Projects', value: '7+' },
                  { label: 'Certs', value: '50+' },
                  { label: 'Skills', value: '29' },
                  { label: 'Years', value: '4+' }
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="bg-zinc-800/50 rounded-xl p-3 text-center cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: 'rgba(6, 182, 212, 0.2)',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="text-cyber-cyan font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-zinc-500 text-xs">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Tab Bar Preview - Interactive */}
              <div className="absolute bottom-4 left-4 right-4">
                <motion.div
                  className="bg-zinc-800/80 backdrop-blur rounded-2xl p-2 flex justify-around"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {['Home', 'Projects', 'About', 'Skills', 'Contact'].map((tab, i) => {
                    const Icon = tabIcons[i]
                    return (
                      <motion.div
                        key={tab}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                          activeTab === i ? 'bg-cyber-cyan/20' : 'hover:bg-zinc-700/50'
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setActiveTab(i)}
                        animate={activeTab === i ? { y: [0, -3, 0] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className={`h-4 w-4 ${activeTab === i ? 'text-cyber-cyan' : 'text-zinc-500'}`} />
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Glowing Effects */}
        <motion.div
          className="absolute -top-4 -right-4 w-24 h-24 bg-cyber-cyan/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyber-purple/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />

        {/* Floating Badge */}
        <motion.div
          className="absolute -top-2 -right-2 bg-cyber-green text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg"
          animate={{
            y: [0, -5, 0],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          FREE
        </motion.div>

        {/* 3D Shadow */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[200px] h-[20px] bg-black/20 rounded-full blur-xl"
          style={{ transform: 'translateX(-50%) rotateX(90deg)' }}
        />
      </motion.div>
    </div>
  )
}

export default function MobilePage() {
  const [release, setRelease] = useState<ReleaseInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchLatestRelease() {
      try {
        const res = await fetch('https://api.github.com/repos/subkhanibnuaji/ibnu-portfolio/releases/latest')
        if (res.ok) {
          const data = await res.json()
          const apkAsset = data.assets?.find((a: { name: string }) => a.name.endsWith('.apk'))
          if (apkAsset) {
            setRelease({
              version: data.tag_name?.replace('mobile-v', '').split('-')[0] || '1.0.0',
              downloadUrl: apkAsset.browser_download_url,
              size: `${(apkAsset.size / (1024 * 1024)).toFixed(1)} MB`,
              publishedAt: new Date(data.published_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            })
          }
        }
      } catch (e) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchLatestRelease()
  }, [])

  const downloadInfo = {
    version: release?.version || '1.0.1',
    size: release?.size || '~74 MB',
    minAndroid: 'Android 6.0+',
    lastUpdated: release?.publishedAt || 'Coming Soon'
  }

  const downloadUrl = release?.downloadUrl || 'https://github.com/subkhanibnuaji/ibnu-portfolio/releases'

  return (
    <PageLayout
      title="Mobile App"
      subtitle="Portfolio app yang bisa diakses dari berbagai platform"
      showBadge
      badgeText="Cross-Platform"
    >
      <div className="container">
        {/* Download Section - Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="glass rounded-2xl p-8 md:p-12 border-2 border-cyber-green/30 bg-gradient-to-br from-cyber-green/5 to-transparent">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Download Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {release ? (
                    <span className="px-3 py-1 rounded-full bg-cyber-green/20 text-cyber-green text-sm font-medium flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Available Now
                    </span>
                  ) : loading ? (
                    <span className="px-3 py-1 rounded-full bg-cyber-cyan/20 text-cyber-cyan text-sm font-medium flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Checking...
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-sm font-medium flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Building...
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-cyber-purple/20 text-cyber-purple text-sm font-medium">
                    v{downloadInfo.version}
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Download
                  <span className="gradient-text"> Android App</span>
                </h2>

                <p className="text-muted-foreground text-lg mb-6">
                  Unduh dan install aplikasi portfolio langsung di HP Android kamu.
                  Gratis, tanpa iklan, dan bisa diakses offline.
                </p>

                {/* App Info Cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
                    <HardDrive className="h-5 w-5 text-cyber-cyan" />
                    <div>
                      <div className="text-xs text-muted-foreground">Size</div>
                      <div className="font-semibold">{downloadInfo.size}</div>
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
                    <Shield className="h-5 w-5 text-cyber-green" />
                    <div>
                      <div className="text-xs text-muted-foreground">Requires</div>
                      <div className="font-semibold">{downloadInfo.minAndroid}</div>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {release ? (
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="gradient" size="lg" className="gap-2 text-lg px-8">
                        <Download className="h-5 w-5" />
                        Download APK
                      </Button>
                    </a>
                  ) : (
                    <a
                      href="https://github.com/subkhanibnuaji/ibnu-portfolio/actions/workflows/build-android.yml"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="gradient" size="lg" className="gap-2 text-lg px-8">
                        {loading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Download className="h-5 w-5" />
                        )}
                        {loading ? 'Checking...' : 'View Build Status'}
                      </Button>
                    </a>
                  )}
                  <a
                    href="https://github.com/subkhanibnuaji/ibnu-portfolio/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="lg" className="gap-2">
                      <Github className="h-5 w-5" />
                      All Releases
                    </Button>
                  </a>
                </div>

                {/* Status Message */}
                {!release && !loading && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
                    <p className="text-yellow-500 text-sm flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        APK sedang dalam proses build (~15 menit). Refresh halaman ini untuk cek status terbaru.
                      </span>
                    </p>
                  </div>
                )}

                {/* Install Instructions */}
                <div className="text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-cyber-green" />
                    Download file APK
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-cyber-green" />
                    Buka file di HP Android
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-cyber-green" />
                    Izinkan install dari sumber tidak dikenal jika diminta
                  </p>
                </div>
              </div>

              {/* Right - Interactive 3D Phone Mockup */}
              <Interactive3DPhone />
            </div>
          </div>
        </motion.section>

        {/* Features */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-8 text-center">Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass rounded-xl p-6 text-center cursor-pointer"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-cyber-cyan/20 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-cyber-cyan" />
                  </div>
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Screens */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-8 text-center">App Screens</h3>
          <div className="glass rounded-2xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {screens.map((screen, i) => (
                <motion.div
                  key={screen.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyber-green/20 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-cyber-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{screen.name}</h4>
                    <p className="text-sm text-muted-foreground">{screen.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-8 text-center">Tech Stack</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * i }}
                whileHover={{ scale: 1.1 }}
                className="px-4 py-2 rounded-full bg-muted text-sm font-medium cursor-pointer"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.section>

        {/* Web Preview Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link href="/mobile/preview">
            <Button variant="outline" size="lg" className="gap-2">
              <MonitorSmartphone className="h-5 w-5" />
              Web Preview
            </Button>
          </Link>
        </motion.section>
      </div>
    </PageLayout>
  )
}

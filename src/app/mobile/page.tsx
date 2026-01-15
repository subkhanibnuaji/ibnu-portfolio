'use client'

import { motion } from 'framer-motion'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import {
  Smartphone,
  Globe,
  Download,
  Github,
  ExternalLink,
  Check,
  Sparkles,
  Palette,
  Zap,
  Wifi
} from 'lucide-react'
import Link from 'next/link'

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

export default function MobilePage() {
  return (
    <PageLayout
      title="Mobile App"
      subtitle="Portfolio app yang bisa diakses dari berbagai platform"
      showBadge
      badgeText="Cross-Platform"
    >
      <div className="container">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="glass rounded-2xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-cyber-green/20 text-cyber-green text-sm font-medium">
                    Active Development
                  </span>
                  <span className="px-3 py-1 rounded-full bg-cyber-purple/20 text-cyber-purple text-sm font-medium">
                    v1.0.0
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ibnu Portfolio
                  <span className="gradient-text"> Mobile App</span>
                </h2>

                <p className="text-muted-foreground text-lg mb-6">
                  Aplikasi mobile portfolio yang dibuat dengan React Native dan Expo.
                  Bisa di-deploy ke Android, iOS, dan Web dengan satu codebase.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <a
                    href="https://github.com/subkhanibnuaji/ibnu-portfolio/tree/main/mobile-app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="gradient" className="gap-2">
                      <Github className="h-4 w-4" />
                      View Source
                    </Button>
                  </a>
                  <Link href="/mobile/preview">
                    <Button variant="outline" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Live Preview
                    </Button>
                  </Link>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full bg-muted text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right - Phone Mockup */}
              <div className="flex justify-center">
                <div className="relative">
                  {/* Phone Frame */}
                  <div className="w-[280px] h-[580px] bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-[3rem] p-3 shadow-2xl">
                    <div className="w-full h-full bg-zinc-950 rounded-[2.5rem] overflow-hidden relative">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-zinc-900 rounded-b-2xl z-10" />

                      {/* Screen Content */}
                      <div className="w-full h-full bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 pt-10">
                        {/* Status Bar */}
                        <div className="flex justify-between text-xs text-zinc-500 mb-6">
                          <span>9:41</span>
                          <div className="flex gap-1">
                            <Wifi className="h-3 w-3" />
                            <span>100%</span>
                          </div>
                        </div>

                        {/* App Header */}
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">IA</span>
                          </div>
                          <h3 className="text-white font-bold">Ibnu Portfolio</h3>
                          <p className="text-zinc-500 text-xs">Mobile App</p>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {[
                            { label: 'Projects', value: '7+' },
                            { label: 'Certs', value: '50+' },
                            { label: 'Skills', value: '29' },
                            { label: 'Years', value: '4+' }
                          ].map((stat) => (
                            <div
                              key={stat.label}
                              className="bg-zinc-800/50 rounded-xl p-3 text-center"
                            >
                              <div className="text-cyber-cyan font-bold">{stat.value}</div>
                              <div className="text-zinc-500 text-xs">{stat.label}</div>
                            </div>
                          ))}
                        </div>

                        {/* Tab Bar Preview */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-zinc-800/80 backdrop-blur rounded-2xl p-2 flex justify-around">
                            {['Home', 'Projects', 'About', 'Skills', 'Contact'].map((tab, i) => (
                              <div
                                key={tab}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                  i === 0 ? 'bg-cyber-cyan/20' : ''
                                }`}
                              >
                                <Smartphone className={`h-4 w-4 ${i === 0 ? 'text-cyber-cyan' : 'text-zinc-500'}`} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyber-cyan/20 rounded-full blur-3xl" />
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyber-purple/20 rounded-full blur-3xl" />
                </div>
              </div>
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
                  className="glass rounded-xl p-6 text-center"
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
                  className="flex items-start gap-3 p-4 rounded-xl bg-muted/30"
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

        {/* How to Run */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold mb-8 text-center">How to Run</h3>
          <div className="glass rounded-2xl p-6 md:p-8">
            <div className="font-mono text-sm bg-zinc-950 rounded-xl p-6 overflow-x-auto">
              <div className="text-zinc-500"># Clone repository</div>
              <div className="text-cyber-cyan mb-4">git clone https://github.com/subkhanibnuaji/ibnu-portfolio.git</div>

              <div className="text-zinc-500"># Masuk ke folder mobile app</div>
              <div className="text-cyber-cyan mb-4">cd ibnu-portfolio/mobile-app</div>

              <div className="text-zinc-500"># Install dependencies</div>
              <div className="text-cyber-cyan mb-4">npm install</div>

              <div className="text-zinc-500"># Jalankan di development mode</div>
              <div className="text-cyber-green">npm start</div>
              <div className="text-zinc-500 mt-2"># Pilih: a = Android, i = iOS, w = Web</div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <a
                href="https://github.com/subkhanibnuaji/ibnu-portfolio/tree/main/mobile-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2">
                  <Github className="h-4 w-4" />
                  GitHub Repository
                </Button>
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </PageLayout>
  )
}

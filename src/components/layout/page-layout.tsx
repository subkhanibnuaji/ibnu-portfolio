'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ParticleBackground } from '@/components/effects/particle-background'
import { CustomCursor } from '@/components/effects/custom-cursor'
import { ScrollProgress } from '@/components/effects/scroll-progress'
import { AIChatbot } from '@/components/chat/ai-chatbot'
import { Terminal } from '@/components/terminal/terminal'
import { CommandPalette } from '@/components/layout/command-palette'

interface PageLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  showBadge?: boolean
  badgeText?: string
}

export function PageLayout({
  children,
  title,
  subtitle,
  showBadge = false,
  badgeText
}: PageLayoutProps) {
  return (
    <>
      {/* Background Effects */}
      <ParticleBackground />
      <CustomCursor />
      <ScrollProgress />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 min-h-screen pt-24">
        {/* Page Header */}
        <section className="relative py-16 px-4 overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 grid-pattern opacity-30 dark:opacity-50" />

          {/* Gradient Orbs - Adaptive for dark/light mode */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyber-cyan/10 dark:bg-cyber-cyan/20 rounded-full blur-[128px] animate-pulse-glow" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyber-purple/10 dark:bg-cyber-purple/20 rounded-full blur-[128px] animate-pulse-glow animation-delay-1000" />

          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {showBadge && badgeText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-cyan" />
                  </span>
                  <span className="text-sm text-muted-foreground">{badgeText}</span>
                </motion.div>
              )}

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              >
                <span className="gradient-text">{title}</span>
              </motion.h1>

              {subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
          </div>
        </section>

        {/* Page Content */}
        <div className="relative pb-20">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Components */}
      <Suspense fallback={null}>
        <AIChatbot />
        <Terminal />
        <CommandPalette />
      </Suspense>
    </>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Terminal, Download, Github, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const roles = [
  { text: 'Artificial Intelligence', color: 'text-cyber-cyan' },
  { text: 'Blockchain & Crypto', color: 'text-cyber-orange' },
  { text: 'Cybersecurity', color: 'text-cyber-green' },
]

const stats = [
  { value: '50+', label: 'Certifications', icon: '🎓' },
  { value: '$68-100K', label: 'Trading Volume', icon: '📈' },
  { value: 'MBA + S.Kom', label: 'Education', icon: '🎯' },
]

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyber-cyan/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyber-purple/20 rounded-full blur-[128px]" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-green" />
            </span>
            <span className="text-sm text-muted-foreground">Available for Opportunities</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-muted-foreground">Hi, I&apos;m</span>{' '}
            <span className="gradient-text">Ibnu</span>
          </motion.h1>

          {/* Rotating Role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl lg:text-3xl mb-8"
          >
            <span className="text-muted-foreground">I explore the future of</span>{' '}
            <span className={`font-semibold ${roles[roleIndex].color} transition-colors duration-500`}>
              {roles[roleIndex].text}
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Civil Servant (ASN) at Indonesia&apos;s Ministry of Housing & Settlement Areas,
            handling IT projects including enterprise systems like{' '}
            <strong className="text-foreground">HUB PKP</strong>,{' '}
            <strong className="text-foreground">SIBARU</strong>, and{' '}
            <strong className="text-foreground">SIMONI</strong>.
            Combining government experience with deep interests in emerging technologies.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 md:gap-10 mb-10"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1 justify-center">
                  <span>{stat.icon}</span>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <Button size="lg" variant="gradient" asChild>
              <Link href="/projects">
                Explore My Work
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/interests">
                <Sparkles className="mr-2 h-4 w-4" />
                My Interests
              </Link>
            </Button>
            <Button size="lg" variant="ghost" id="open-terminal">
              <Terminal className="mr-2 h-4 w-4" />
              Open Terminal
            </Button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex justify-center gap-4"
          >
            <Button size="icon" variant="ghost" asChild>
              <a href="https://github.com/subkhanibnuaji" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button size="icon" variant="ghost" asChild>
              <a href="https://linkedin.com/in/subkhanibnuaji" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button size="icon" variant="ghost" asChild>
              <a href="mailto:hi@heyibnu.com">
                <Mail className="h-5 w-5" />
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-sm">Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center p-2">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

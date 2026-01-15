'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Terminal, Github, Linkedin, Mail, Shield, Cpu, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const roles = [
  { text: 'Artificial Intelligence', color: 'text-cyber-cyan dark:text-cyber-cyan', icon: Cpu },
  { text: 'Blockchain & Crypto', color: 'text-cyber-orange dark:text-cyber-orange', icon: TrendingUp },
  { text: 'Cybersecurity', color: 'text-cyber-green dark:text-cyber-green', icon: Shield },
]

const stats = [
  { value: '50+', label: 'Certifications', icon: Shield },
  { value: '$68-100K', label: 'Trading Volume', icon: TrendingUp },
  { value: 'MBA + S.Kom', label: 'Education', icon: Cpu },
]

// Unsplash images for cyber/trading/AI theme
const heroImages = {
  main: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80', // Blockchain/Crypto
  ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80', // AI
  security: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80', // Cybersecurity
  trading: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80', // Trading
}

// Personal profile photo
const profilePhoto = {
  src: '/images/profile/graduation-ugm.jpg',
  alt: 'Subkhan Ibnu Aji',
}

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const CurrentIcon = roles[roleIndex].icon

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImages.main}
          alt="Cyber Background"
          fill
          className="object-cover opacity-10 dark:opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 grid-pattern opacity-30 dark:opacity-50" />

      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyber-cyan/10 dark:bg-cyber-cyan/20 rounded-full blur-[128px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyber-purple/10 dark:bg-cyber-purple/20 rounded-full blur-[128px] animate-pulse-glow animation-delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-green/5 dark:bg-cyber-green/10 rounded-full blur-[150px]" />

      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Profile Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative flex-shrink-0"
            >
              <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72">
                {/* Glow effect behind photo */}
                <div className="absolute inset-0 rounded-full bg-cyber-gradient blur-2xl opacity-30 animate-pulse-glow" />

                {/* Photo container with border */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-primary/30 shadow-xl shadow-primary/20">
                  <Image
                    src={profilePhoto.src}
                    alt={profilePhoto.alt}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>

                {/* Decorative ring */}
                <div className="absolute -inset-2 rounded-full border-2 border-dashed border-primary/20 animate-spin-slow" />

                {/* Status badge */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-green" />
                    </span>
                    Available
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Text Content */}
            <div className="text-center lg:text-left flex-1">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
              >
                <Cpu className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Tech Enthusiast & Government IT Leader</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
              >
                <span className="text-muted-foreground">Hi, I&apos;m</span>{' '}
                <span className="gradient-text">Ibnu</span>
              </motion.h1>

              {/* Rotating Role */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl lg:text-2xl mb-6"
              >
                <span className="text-muted-foreground">I explore the future of</span>{' '}
                <span className={`font-semibold ${roles[roleIndex].color} transition-colors duration-500 inline-flex items-center gap-2`}>
                  <CurrentIcon className="h-5 w-5 md:h-6 md:w-6" />
                  {roles[roleIndex].text}
                </span>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-base text-muted-foreground max-w-xl mb-8"
              >
                Civil Servant (ASN) at Indonesia&apos;s Ministry of Housing & Settlement Areas,
                handling IT projects including enterprise systems like{' '}
                <strong className="text-foreground">HUB PKP</strong>,{' '}
                <strong className="text-foreground">SIBARU</strong>, and{' '}
                <strong className="text-foreground">SIMONI</strong>.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left group">
                    <div className="text-xl md:text-2xl font-bold gradient-text group-hover:scale-105 transition-transform">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 justify-center lg:justify-start">
                      <stat.icon className="h-3.5 w-3.5 text-primary" />
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
                className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8"
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
                  Terminal
                </Button>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex justify-center lg:justify-start gap-3"
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
          </div>
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

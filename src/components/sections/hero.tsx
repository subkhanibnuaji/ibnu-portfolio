'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, Terminal, Github, Linkedin, Mail, Shield, Cpu, TrendingUp, Bot, Binary, Lock, Wallet } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const roles = [
  { text: 'Artificial Intelligence', color: 'text-cyber-cyan', icon: Bot },
  { text: 'Blockchain & Crypto', color: 'text-cyber-orange', icon: Wallet },
  { text: 'Cybersecurity', color: 'text-cyber-green', icon: Lock },
  { text: 'Quantitative Trading', color: 'text-cyber-purple', icon: TrendingUp },
]

const stats = [
  { value: '50+', label: 'Certifications', icon: Shield, color: 'cyber-cyan' },
  { value: '$68-100K', label: 'Trading Volume', icon: TrendingUp, color: 'cyber-orange' },
  { value: 'MBA + S.Kom', label: 'Education', icon: Cpu, color: 'cyber-purple' },
]

// Cyber/Hacker themed Unsplash images - free to use
const cyberImages = {
  // Anonymous hacker with hoodie
  hacker: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&q=80',
  // Matrix code rain
  matrix: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1920&q=80',
  // AI robot face
  robot: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  // Crypto bitcoin
  bitcoin: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80',
  // Cybersecurity lock
  security: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
  // Trading charts
  trading: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  // Neural network
  neural: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
  // Humanoid robot
  humanoid: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
}

// Matrix rain effect component
function MatrixRain() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-30 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-cyber-green font-mono text-xs"
          style={{ left: `${i * 5}%` }}
          initial={{ y: -100, opacity: 0 }}
          animate={{
            y: ['0%', '100%'],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear'
          }}
        >
          {[...Array(20)].map((_, j) => (
            <div key={j} className="my-1">
              {String.fromCharCode(0x30A0 + Math.random() * 96)}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

// Floating crypto icons
function FloatingIcons() {
  const icons = [
    { Icon: Binary, color: 'text-cyber-cyan', delay: 0 },
    { Icon: Lock, color: 'text-cyber-green', delay: 1 },
    { Icon: Wallet, color: 'text-cyber-orange', delay: 2 },
    { Icon: Bot, color: 'text-cyber-purple', delay: 3 },
    { Icon: Shield, color: 'text-cyber-pink', delay: 4 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, color, delay }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color} opacity-20`}
          style={{
            left: `${15 + index * 18}%`,
            top: `${20 + (index % 3) * 25}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            delay: delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Icon className="h-12 w-12 md:h-16 md:w-16" />
        </motion.div>
      ))}
    </div>
  )
}

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [glitchActive, setGlitchActive] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 200)
      setRoleIndex((prev) => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 100)
      }
    }, 2000)
    return () => clearInterval(glitchInterval)
  }, [])

  const CurrentIcon = roles[roleIndex].icon

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden bg-[#0a0a0f]">
      {/* Layered Background Images */}
      <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
        {/* Primary cyber background */}
        <Image
          src={cyberImages.matrix}
          alt="Matrix Background"
          fill
          className="object-cover opacity-30 dark:opacity-40"
          priority
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/90 via-[#0a0a0f]/70 to-[#0a0a0f]" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/5 via-transparent to-cyber-purple/5" />
      </motion.div>

      {/* Scanlines effect */}
      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none z-10" />

      {/* Matrix Rain */}
      <MatrixRain />

      {/* Floating Icons */}
      <FloatingIcons />

      {/* Hex pattern overlay */}
      <div className="absolute inset-0 hex-pattern opacity-10" />

      {/* Grid Background */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyber-cyan/20 rounded-full blur-[128px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyber-purple/20 rounded-full blur-[128px] animate-pulse-glow animation-delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-orange/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cyber-green/15 rounded-full blur-[100px]" />

      <div className="container relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Profile/Avatar Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative flex-shrink-0"
            >
              <div className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80">
                {/* Animated rings */}
                <motion.div
                  className="absolute -inset-4 rounded-full border border-cyber-cyan/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute -inset-8 rounded-full border border-cyber-purple/20"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute -inset-12 rounded-full border border-dashed border-cyber-orange/10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                />

                {/* Glow effect behind */}
                <div className="absolute inset-0 rounded-full bg-cyber-gradient blur-2xl opacity-40 animate-pulse-glow" />

                {/* Cyber frame */}
                <div className="absolute inset-0 rounded-2xl rotate-45 border-2 border-cyber-cyan/20 scale-[0.7]" />

                {/* Main image container - Humanoid Robot / AI Avatar */}
                <div className={`relative w-full h-full rounded-full overflow-hidden border-2 border-cyber-cyan/50 shadow-2xl shadow-cyber-cyan/20 ${glitchActive ? 'animate-cyber-flicker' : ''}`}>
                  <Image
                    src={cyberImages.humanoid}
                    alt="AI Avatar"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    priority
                  />
                  {/* Cyber overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-cyber-cyan/20 via-transparent to-cyber-purple/10" />

                  {/* Glitch overlay */}
                  {glitchActive && (
                    <div className="absolute inset-0 bg-cyber-cyan/20 mix-blend-overlay" />
                  )}
                </div>

                {/* Corner accents */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-cyber-cyan" />
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-cyber-cyan" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-cyber-cyan" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-cyber-cyan" />

                {/* Status indicator */}
                <motion.div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a0a0f]/80 backdrop-blur-sm border border-cyber-green/50 text-xs font-mono">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-green" />
                    </span>
                    <span className="text-cyber-green">ONLINE</span>
                  </span>
                </motion.div>

                {/* Floating badges around avatar */}
                <motion.div
                  className="absolute -right-4 top-1/4"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="p-2 rounded-lg bg-[#0a0a0f]/80 backdrop-blur-sm border border-cyber-orange/50">
                    <Wallet className="h-5 w-5 text-cyber-orange" />
                  </div>
                </motion.div>
                <motion.div
                  className="absolute -left-4 top-1/3"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="p-2 rounded-lg bg-[#0a0a0f]/80 backdrop-blur-sm border border-cyber-cyan/50">
                    <Bot className="h-5 w-5 text-cyber-cyan" />
                  </div>
                </motion.div>
                <motion.div
                  className="absolute -right-2 bottom-1/3"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                >
                  <div className="p-2 rounded-lg bg-[#0a0a0f]/80 backdrop-blur-sm border border-cyber-green/50">
                    <Lock className="h-5 w-5 text-cyber-green" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Text Content */}
            <div className="text-center lg:text-left flex-1">
              {/* Terminal-style badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0a0a0f]/80 backdrop-blur-sm border border-cyber-cyan/30 mb-6 font-mono text-sm"
              >
                <span className="text-cyber-green">$</span>
                <span className="text-cyber-cyan">whoami</span>
                <span className="text-muted-foreground">--</span>
                <span className="text-foreground">Tech Enthusiast & Digital Innovator</span>
                <span className="animate-pulse text-cyber-cyan">_</span>
              </motion.div>

              {/* Title with glitch effect */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-4 ${glitchActive ? 'animate-cyber-flicker' : ''}`}
              >
                <span className="text-muted-foreground">Hi, I&apos;m</span>{' '}
                <span className="relative">
                  <span className="gradient-text text-glow">IBNU</span>
                  {glitchActive && (
                    <>
                      <span className="absolute inset-0 gradient-text opacity-70 translate-x-[2px] translate-y-[2px]">IBNU</span>
                      <span className="absolute inset-0 text-cyber-cyan opacity-50 -translate-x-[2px] -translate-y-[1px]">IBNU</span>
                    </>
                  )}
                </span>
              </motion.h1>

              {/* Rotating Role with icon */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl lg:text-2xl mb-6 font-mono"
              >
                <span className="text-muted-foreground">&gt; exploring_</span>{' '}
                <motion.span
                  key={roleIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`font-bold ${roles[roleIndex].color} inline-flex items-center gap-2`}
                >
                  <CurrentIcon className="h-5 w-5 md:h-6 md:w-6" />
                  {roles[roleIndex].text}
                </motion.span>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-base md:text-lg text-muted-foreground max-w-xl mb-8"
              >
                Civil Servant (ASN) building enterprise systems at Indonesia&apos;s Ministry of Housing.
                Passionate about{' '}
                <span className="text-cyber-cyan font-medium">AI</span>,{' '}
                <span className="text-cyber-orange font-medium">Crypto Trading</span>, and{' '}
                <span className="text-cyber-green font-medium">Cybersecurity</span>.
              </motion.p>

              {/* Stats with cyber styling */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 mb-8"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className={`relative px-4 py-3 rounded-lg bg-[#0a0a0f]/60 backdrop-blur-sm border border-${stat.color}/30 group cursor-pointer`}
                  >
                    <div className={`absolute inset-0 rounded-lg bg-${stat.color}/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className={`text-xl md:text-2xl font-bold text-${stat.color} font-mono`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <stat.icon className={`h-3.5 w-3.5 text-${stat.color}`} />
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons with cyber style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8"
              >
                <Button size="lg" className="bg-cyber-gradient hover:opacity-90 text-white font-mono" asChild>
                  <Link href="/projects">
                    <Binary className="mr-2 h-4 w-4" />
                    Explore_Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-cyber-purple/50 hover:bg-cyber-purple/10 font-mono" asChild>
                  <Link href="/interests">
                    <Sparkles className="mr-2 h-4 w-4 text-cyber-purple" />
                    My_Interests
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-cyber-green/50 hover:bg-cyber-green/10 font-mono" id="open-terminal">
                  <Terminal className="mr-2 h-4 w-4 text-cyber-green" />
                  ./terminal
                </Button>
              </motion.div>

              {/* Social Links with glow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex justify-center lg:justify-start gap-3"
              >
                {[
                  { href: 'https://github.com/subkhanibnuaji', icon: Github, color: 'hover:text-white hover:border-white' },
                  { href: 'https://linkedin.com/in/subkhanibnuaji', icon: Linkedin, color: 'hover:text-cyber-cyan hover:border-cyber-cyan' },
                  { href: 'mailto:hi@heyibnu.com', icon: Mail, color: 'hover:text-cyber-orange hover:border-cyber-orange' },
                ].map(({ href, icon: Icon, color }) => (
                  <Button
                    key={href}
                    size="icon"
                    variant="outline"
                    className={`border-muted-foreground/30 bg-[#0a0a0f]/50 ${color} transition-all duration-300`}
                    asChild
                  >
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      <Icon className="h-5 w-5" />
                    </a>
                  </Button>
                ))}
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
          <div className="flex flex-col items-center gap-2 text-muted-foreground font-mono text-sm">
            <span className="text-cyber-cyan">&lt;scroll&gt;</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-cyber-cyan/30 flex justify-center p-2"
            >
              <motion.div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Atom,
  Dna,
  Brain,
  Shield,
  Blocks,
  Bot,
  Fingerprint,
  Coins,
  ArrowRight,
  Sparkles,
  BookOpen,
  Zap,
  FlaskConical,
  Rocket,
  Lock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// 5 Pillars of Superhuman Intelligence
const SUPERHUMAN_PILLARS = [
  { icon: Brain, name: 'AI', color: 'text-cyber-cyan', bgColor: 'bg-cyber-cyan/10' },
  { icon: Shield, name: 'Security', color: 'text-security-safe', bgColor: 'bg-security-safe/10' },
  { icon: Blocks, name: 'Blockchain', color: 'text-cyber-orange', bgColor: 'bg-cyber-orange/10' },
  { icon: Atom, name: 'Quantum', color: 'text-cyber-purple', bgColor: 'bg-cyber-purple/10' },
  { icon: Dna, name: 'Biotech', color: 'text-cyber-green', bgColor: 'bg-cyber-green/10' },
]

// Research categories with sample topics
const RESEARCH_CATEGORIES = [
  {
    id: 'ai',
    category: 'Artificial Intelligence',
    icon: Brain,
    color: 'text-cyber-cyan',
    bgGradient: 'from-cyber-cyan/20 to-transparent',
    topics: ['AI Agents', 'LLMs', 'Computer Vision'],
    href: '/research',
    activeTopics: 3,
  },
  {
    id: 'security',
    category: 'Cybersecurity',
    icon: Shield,
    color: 'text-security-safe',
    bgGradient: 'from-security-safe/20 to-transparent',
    topics: ['Threat Analysis', 'Post-Quantum Crypto', 'Offensive Security'],
    href: '/research',
    activeTopics: 3,
  },
  {
    id: 'blockchain',
    category: 'Blockchain',
    icon: Blocks,
    color: 'text-cyber-orange',
    bgGradient: 'from-cyber-orange/20 to-transparent',
    topics: ['Zero-Knowledge', 'DeFi', 'Smart Contracts'],
    href: '/research',
    activeTopics: 3,
  },
  {
    id: 'quantum',
    category: 'Quantum',
    icon: Atom,
    color: 'text-cyber-purple',
    bgGradient: 'from-cyber-purple/20 to-transparent',
    topics: ['Algorithms', 'Quantum ML', 'Hardware'],
    href: '/research',
    activeTopics: 2,
  },
  {
    id: 'biotech',
    category: 'Biotechnology',
    icon: Dna,
    color: 'text-cyber-green',
    bgGradient: 'from-cyber-green/20 to-transparent',
    topics: ['CRISPR', 'BCI', 'Drug Discovery', 'Longevity'],
    href: '/research',
    activeTopics: 3,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export function ResearchPreviewSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-cyan/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyber-green/3 rounded-full blur-3xl" />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0a0a0f]/80 backdrop-blur-sm border border-cyber-purple/30 text-sm font-mono mb-4">
            <FlaskConical className="h-4 w-4 text-cyber-purple" />
            <span className="text-cyber-purple">$</span>
            <span className="text-cyber-cyan">research</span>
            <span className="text-foreground">--superhuman</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
            <span className="gradient-text">Superhuman Intelligence</span>
            <span className="text-muted-foreground"> Research</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Building capabilities beyond natural human limits through the strategic convergence of cutting-edge technologies
          </p>
        </motion.div>

        {/* 5 Pillars Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
            {SUPERHUMAN_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="flex items-center gap-2"
                >
                  {idx > 0 && (
                    <span className="text-xl font-bold text-muted-foreground hidden md:block">+</span>
                  )}
                  <div className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10',
                    pillar.bgColor
                  )}>
                    <Icon className={cn('h-5 w-5', pillar.color)} />
                    <span className={cn('font-medium text-sm', pillar.color)}>{pillar.name}</span>
                  </div>
                </motion.div>
              )
            })}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="flex items-center gap-2"
            >
              <span className="text-xl font-bold text-muted-foreground hidden md:block">=</span>
              <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyber-purple/20 via-cyber-cyan/20 to-cyber-green/20 border border-white/20">
                <span className="font-bold gradient-text">Superhuman</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Featured: Superhuman Convergence */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <Link href="/superhuman-research" className="block group">
            <div className="relative">
              <div className="absolute -inset-px bg-gradient-to-r from-cyber-purple via-cyber-green to-cyber-cyan rounded-2xl opacity-40 blur-sm group-hover:opacity-60 transition-opacity" />
              <div className="relative rounded-2xl border border-white/10 bg-[#0a0a0f]/90 p-6 md:p-8 hover:border-cyber-purple/30 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/10 via-cyber-green/5 to-cyber-cyan/10 rounded-2xl opacity-50" />

                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-start gap-4">
                    {/* Icons Stack */}
                    <div className="flex items-center gap-1">
                      <motion.div
                        animate={{ boxShadow: ['0 0 15px rgba(168, 85, 247, 0.3)', '0 0 25px rgba(168, 85, 247, 0.5)', '0 0 15px rgba(168, 85, 247, 0.3)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-cyber-purple/10 border border-cyber-purple/30 flex items-center justify-center"
                      >
                        <Atom className="h-5 w-5 md:h-6 md:w-6 text-cyber-purple" />
                      </motion.div>
                      <span className="text-lg font-bold text-muted-foreground">+</span>
                      <motion.div
                        animate={{ boxShadow: ['0 0 15px rgba(0, 255, 136, 0.3)', '0 0 25px rgba(0, 255, 136, 0.5)', '0 0 15px rgba(0, 255, 136, 0.3)'] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center"
                      >
                        <Dna className="h-5 w-5 md:h-6 md:w-6 text-cyber-green" />
                      </motion.div>
                      <span className="text-lg font-bold text-muted-foreground">+</span>
                      <motion.div
                        animate={{ boxShadow: ['0 0 15px rgba(0, 212, 255, 0.3)', '0 0 25px rgba(0, 212, 255, 0.5)', '0 0 15px rgba(0, 212, 255, 0.3)'] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center"
                      >
                        <Brain className="h-5 w-5 md:h-6 md:w-6 text-cyber-cyan" />
                      </motion.div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-cyber-orange/20 text-cyber-orange text-xs font-medium">
                          Featured
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-muted-foreground text-xs">
                          45 min
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold group-hover:text-cyber-cyan transition-colors">
                        The Superhuman Convergence
                      </h3>
                      <p className="text-sm text-muted-foreground">Quantum Computing + Biotechnology + AI</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                      <div className="text-center">
                        <div className="text-lg md:text-xl font-bold text-cyber-purple">3:1</div>
                        <div className="text-xs text-muted-foreground">Gap</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg md:text-xl font-bold text-cyber-green">$72B</div>
                        <div className="text-xs text-muted-foreground">Market</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg md:text-xl font-bold text-cyber-cyan">$500B</div>
                        <div className="text-xs text-muted-foreground">Value</div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-cyber-cyan group-hover:translate-x-1 transition-transform hidden md:block" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Research Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10"
        >
          {RESEARCH_CATEGORIES.map((category) => {
            const Icon = category.icon
            return (
              <motion.div key={category.id} variants={itemVariants}>
                <Link href={category.href} className="block group h-full">
                  <div className={cn(
                    'h-full rounded-xl border border-white/10 bg-[#0a0a0f]/80 p-4',
                    'hover:border-cyber-cyan/30 hover:-translate-y-1 transition-all duration-300'
                  )}>
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
                      'bg-gradient-to-br',
                      category.bgGradient,
                      'border border-white/10'
                    )}>
                      <Icon className={cn('h-5 w-5', category.color)} />
                    </div>
                    <h3 className="font-bold text-sm mb-1 group-hover:text-cyber-cyan transition-colors">
                      {category.category}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {category.activeTopics} active topics
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {category.topics.slice(0, 2).map((topic, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-white/5 text-xs text-foreground/50">
                          {topic}
                        </span>
                      ))}
                      {category.topics.length > 2 && (
                        <span className="px-1.5 py-0.5 rounded bg-white/5 text-xs text-foreground/50">
                          +{category.topics.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6 md:gap-12 mb-10 py-6 border-y border-white/5"
        >
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text">20+</div>
            <div className="text-xs text-muted-foreground">Research Topics</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text">500+</div>
            <div className="text-xs text-muted-foreground">Hours Research</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text">12</div>
            <div className="text-xs text-muted-foreground">Active Studies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text">6</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Button asChild size="lg" variant="gradient">
            <Link href="/research">
              <BookOpen className="mr-2 h-4 w-4" />
              Explore Research Lab
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

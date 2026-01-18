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
  Satellite,
  TreePine,
  ArrowRight,
  Sparkles,
  BookOpen,
  Zap,
  FlaskConical,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const RESEARCH_TOPICS = [
  {
    id: 'superhuman',
    title: 'Superhuman Skillset',
    subtitle: 'Quantum + Biotech + AI',
    icon: Atom,
    secondaryIcon: Dna,
    tertiaryIcon: Brain,
    color: 'text-cyber-purple',
    bgGradient: 'from-cyber-purple/20 via-cyber-green/10 to-cyber-cyan/20',
    href: '/superhuman-research',
    featured: true,
    stats: { value: '$500B', label: 'Value Creation' },
  },
  {
    id: 'ai-agents',
    title: 'AI Agents',
    subtitle: 'Autonomous Systems',
    icon: Bot,
    color: 'text-cyber-cyan',
    bgGradient: 'from-cyber-cyan/20 to-transparent',
    href: '/research/ai-agents',
    stats: { value: '75%', label: 'Enterprise Interest' },
  },
  {
    id: 'zk-proofs',
    title: 'Zero-Knowledge',
    subtitle: 'Privacy & Scaling',
    icon: Fingerprint,
    color: 'text-cyber-purple',
    bgGradient: 'from-cyber-purple/20 to-transparent',
    href: '/research/zero-knowledge-proofs',
    stats: { value: '$4B+', label: 'ZK L2 TVL' },
  },
  {
    id: 'defi',
    title: 'DeFi Research',
    subtitle: 'Protocol Analysis',
    icon: Coins,
    color: 'text-cyber-orange',
    bgGradient: 'from-cyber-orange/20 to-transparent',
    href: '/research/defi-research',
    stats: { value: '80%', label: 'Progress' },
  },
  {
    id: 'cybersecurity',
    title: 'Threat Landscape',
    subtitle: 'Security Research',
    icon: Shield,
    color: 'text-security-safe',
    bgGradient: 'from-security-safe/20 to-transparent',
    href: '/research/cybersecurity-landscape',
    stats: { value: '85%', label: 'Progress' },
  },
  {
    id: 'space',
    title: 'Space Tech',
    subtitle: 'Commercialization',
    icon: Satellite,
    color: 'text-cyber-cyan',
    bgGradient: 'from-cyber-cyan/20 to-transparent',
    href: '/research/space-technology',
    stats: { value: 'Planned', label: 'Status' },
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
  const featuredTopic = RESEARCH_TOPICS.find(t => t.featured)
  const otherTopics = RESEARCH_TOPICS.filter(t => !t.featured)

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-cyan/5 rounded-full blur-3xl" />

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
            <span className="text-foreground">--lab</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
            <span className="gradient-text">Research Lab</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Exploring the frontiers of technology through deep research and analysis
          </p>
        </motion.div>

        {/* Featured Research */}
        {featuredTopic && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link href={featuredTopic.href} className="block group">
              <div className="relative">
                <div className="absolute -inset-px bg-gradient-to-r from-cyber-purple via-cyber-green to-cyber-cyan rounded-2xl opacity-40 blur-sm group-hover:opacity-60 transition-opacity" />
                <div className={cn(
                  'relative rounded-2xl border border-white/10 bg-[#0a0a0f]/90 p-6 md:p-8',
                  'hover:border-cyber-purple/30 transition-all duration-300'
                )}>
                  <div className={cn('absolute inset-0 bg-gradient-to-br rounded-2xl opacity-30', featuredTopic.bgGradient)} />

                  <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-start gap-4">
                      {/* Icons Stack */}
                      <div className="flex items-center gap-1">
                        <motion.div
                          animate={{ boxShadow: ['0 0 15px rgba(168, 85, 247, 0.3)', '0 0 25px rgba(168, 85, 247, 0.5)', '0 0 15px rgba(168, 85, 247, 0.3)'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-12 h-12 rounded-xl bg-cyber-purple/10 border border-cyber-purple/30 flex items-center justify-center"
                        >
                          <Atom className="h-6 w-6 text-cyber-purple" />
                        </motion.div>
                        <span className="text-xl font-bold text-muted-foreground">+</span>
                        <motion.div
                          animate={{ boxShadow: ['0 0 15px rgba(0, 255, 136, 0.3)', '0 0 25px rgba(0, 255, 136, 0.5)', '0 0 15px rgba(0, 255, 136, 0.3)'] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          className="w-12 h-12 rounded-xl bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center"
                        >
                          <Dna className="h-6 w-6 text-cyber-green" />
                        </motion.div>
                        <span className="text-xl font-bold text-muted-foreground">+</span>
                        <motion.div
                          animate={{ boxShadow: ['0 0 15px rgba(0, 212, 255, 0.3)', '0 0 25px rgba(0, 212, 255, 0.5)', '0 0 15px rgba(0, 212, 255, 0.3)'] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                          className="w-12 h-12 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center"
                        >
                          <Brain className="h-6 w-6 text-cyber-cyan" />
                        </motion.div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-full bg-cyber-orange/20 text-cyber-orange text-xs font-medium">
                            Featured
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold group-hover:text-cyber-cyan transition-colors">
                          {featuredTopic.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{featuredTopic.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold gradient-text">{featuredTopic.stats.value}</div>
                        <div className="text-xs text-muted-foreground">{featuredTopic.stats.label}</div>
                      </div>
                      <div className="flex items-center text-cyber-cyan font-medium group-hover:gap-3 gap-2 transition-all">
                        <span className="hidden md:inline">Explore</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Other Research Topics Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
        >
          {otherTopics.map((topic) => {
            const Icon = topic.icon
            return (
              <motion.div key={topic.id} variants={itemVariants}>
                <Link href={topic.href} className="block group h-full">
                  <div className={cn(
                    'h-full rounded-xl border border-white/10 bg-[#0a0a0f]/80 p-4',
                    'hover:border-cyber-cyan/30 hover:-translate-y-1 transition-all duration-300'
                  )}>
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
                      'bg-gradient-to-br',
                      topic.bgGradient,
                      'border border-white/10'
                    )}>
                      <Icon className={cn('h-5 w-5', topic.color)} />
                    </div>
                    <h3 className="font-bold text-sm mb-0.5 group-hover:text-cyber-cyan transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">{topic.subtitle}</p>
                    <div className="flex items-center justify-between">
                      <span className={cn('text-sm font-bold', topic.color)}>{topic.stats.value}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-cyber-cyan group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
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
              View All Research
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

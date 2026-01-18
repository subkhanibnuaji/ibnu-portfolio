'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Atom,
  Dna,
  Brain,
  Shield,
  Blocks,
  Sparkles,
  Zap,
  Bot,
  Lock,
  Rocket,
  Globe,
  Cpu,
  Network,
  Eye,
  Fingerprint,
  Coins,
  TreePine,
  Satellite,
  Users,
  ArrowRight,
  Clock,
  BookOpen,
  TrendingUp,
  Star,
  Layers,
  Binary,
  Workflow,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

// Research Topics Data
const FEATURED_RESEARCH = {
  id: 'superhuman',
  slug: 'superhuman-research',
  title: 'The Superhuman Skillset',
  subtitle: 'Quantum Computing, Biotechnology & AI Convergence',
  description: 'Mastering the convergence of Quantum Computing, Biotechnology, and AI creates capabilities that fewer than a handful of professionals worldwide possess. A comprehensive guide to building this transformative skillset.',
  icon: Atom,
  secondaryIcons: [Dna, Brain],
  gradient: 'from-cyber-purple via-cyber-green to-cyber-cyan',
  bgGradient: 'from-cyber-purple/20 via-cyber-green/10 to-cyber-cyan/20',
  borderColor: 'border-cyber-purple/30 hover:border-cyber-purple/60',
  stats: [
    { label: 'Talent Gap', value: '3:1' },
    { label: 'Market Size', value: '$72B' },
    { label: 'Value Creation', value: '$500B' },
  ],
  tags: ['Quantum', 'Biotech', 'AI', 'Post-Quantum Crypto', 'Drug Discovery'],
  readTime: '45 min read',
  status: 'Featured',
}

const RESEARCH_TOPICS = [
  {
    id: 'ai-agents',
    slug: 'ai-agents',
    title: 'AI Agents & Autonomous Systems',
    description: 'Exploring the frontier of autonomous AI agents, multi-agent systems, and their applications in complex problem-solving.',
    icon: Bot,
    color: 'text-cyber-cyan',
    bgColor: 'bg-cyber-cyan/10',
    borderColor: 'border-cyber-cyan/30 hover:border-cyber-cyan/60',
    tags: ['LLM Agents', 'AutoGPT', 'Multi-Agent', 'ReAct'],
    status: 'Active',
    progress: 75,
  },
  {
    id: 'zero-knowledge',
    slug: 'zero-knowledge-proofs',
    title: 'Zero-Knowledge Proofs & Privacy',
    description: 'Deep dive into ZK-SNARKs, ZK-STARKs, and privacy-preserving computation for blockchain and beyond.',
    icon: Fingerprint,
    color: 'text-cyber-purple',
    bgColor: 'bg-cyber-purple/10',
    borderColor: 'border-cyber-purple/30 hover:border-cyber-purple/60',
    tags: ['ZK-SNARKs', 'ZK-STARKs', 'Privacy', 'Blockchain'],
    status: 'Active',
    progress: 60,
  },
  {
    id: 'defi-research',
    slug: 'defi-research',
    title: 'DeFi Protocol Research',
    description: 'Analysis of decentralized finance protocols, MEV, liquidity mechanisms, and economic security.',
    icon: Coins,
    color: 'text-cyber-orange',
    bgColor: 'bg-cyber-orange/10',
    borderColor: 'border-cyber-orange/30 hover:border-cyber-orange/60',
    tags: ['AMM', 'MEV', 'Liquidity', 'Tokenomics'],
    status: 'Active',
    progress: 80,
  },
  {
    id: 'cybersecurity-landscape',
    slug: 'cybersecurity-landscape',
    title: 'Cybersecurity Threat Landscape',
    description: 'Comprehensive analysis of emerging threats, attack vectors, and defense strategies in the modern digital ecosystem.',
    icon: Shield,
    color: 'text-security-safe',
    bgColor: 'bg-security-safe/10',
    borderColor: 'border-security-safe/30 hover:border-security-safe/60',
    tags: ['APT', 'Ransomware', 'Supply Chain', 'Zero-Day'],
    status: 'Active',
    progress: 85,
  },
  {
    id: 'space-tech',
    slug: 'space-technology',
    title: 'Space Technology & Commercialization',
    description: 'The new space economy: satellite networks, space computing, and the commercialization of orbital infrastructure.',
    icon: Satellite,
    color: 'text-cyber-cyan',
    bgColor: 'bg-cyber-cyan/10',
    borderColor: 'border-cyber-cyan/30 hover:border-cyber-cyan/60',
    tags: ['Starlink', 'Space Computing', 'Satellite', 'Launch'],
    status: 'Planned',
    progress: 25,
  },
  {
    id: 'climate-tech',
    slug: 'climate-technology',
    title: 'Climate Tech & Sustainability',
    description: 'Technology solutions for climate change: carbon capture, renewable energy optimization, and sustainable computing.',
    icon: TreePine,
    color: 'text-cyber-green',
    bgColor: 'bg-cyber-green/10',
    borderColor: 'border-cyber-green/30 hover:border-cyber-green/60',
    tags: ['Carbon Capture', 'Green AI', 'Renewable', 'ESG'],
    status: 'Planned',
    progress: 15,
  },
  {
    id: 'hci-research',
    slug: 'human-computer-interaction',
    title: 'Human-Computer Interaction',
    description: 'Next-generation interfaces: brain-computer interfaces, AR/VR, haptics, and the future of human-machine collaboration.',
    icon: Users,
    color: 'text-cyber-pink',
    bgColor: 'bg-cyber-pink/10',
    borderColor: 'border-cyber-pink/30 hover:border-cyber-pink/60',
    tags: ['BCI', 'AR/VR', 'Haptics', 'UX'],
    status: 'Planned',
    progress: 20,
  },
  {
    id: 'edge-computing',
    slug: 'edge-computing',
    title: 'Edge Computing & IoT',
    description: 'Distributed computing at the edge: IoT security, fog computing, and real-time processing architectures.',
    icon: Network,
    color: 'text-cyber-orange',
    bgColor: 'bg-cyber-orange/10',
    borderColor: 'border-cyber-orange/30 hover:border-cyber-orange/60',
    tags: ['IoT', 'Fog Computing', 'MQTT', 'Edge AI'],
    status: 'Planned',
    progress: 10,
  },
]

const RESEARCH_STATS = [
  { icon: BookOpen, value: '9+', label: 'Research Topics' },
  { icon: Clock, value: '200+', label: 'Hours Research' },
  { icon: TrendingUp, value: '15+', label: 'Technologies Covered' },
  { icon: Star, value: '5', label: 'Active Studies' },
]

const RESEARCH_INTERESTS = [
  'Quantum Computing',
  'Biotechnology',
  'AI/ML',
  'Blockchain',
  'Cybersecurity',
  'Zero-Knowledge Proofs',
  'DeFi',
  'Space Tech',
  'Climate Tech',
  'HCI',
]

export default function ResearchPage() {
  return (
    <PageLayout
      title="Research Lab"
      subtitle="Exploring the frontiers of technology through deep research and analysis"
      showBadge={true}
      badgeText="Active Research Program"
    >
      <div className="container px-4">
        {/* Research Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {RESEARCH_STATS.map((stat, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-white/5 border border-white/10 text-center hover:border-cyber-cyan/30 transition-colors"
            >
              <stat.icon className="h-6 w-6 mx-auto mb-2 text-cyber-cyan" />
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Featured Research */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-5 w-5 text-cyber-orange" />
            <h2 className="text-xl font-bold">Featured Research</h2>
          </div>

          <Link href={`/${FEATURED_RESEARCH.slug}`} className="block group">
            <div className="relative">
              {/* Glowing border effect */}
              <div className={cn(
                'absolute -inset-px bg-gradient-to-r rounded-3xl opacity-50 blur-sm group-hover:opacity-80 transition-opacity',
                FEATURED_RESEARCH.gradient
              )} />

              <div className="relative rounded-3xl border border-white/10 bg-[#0a0a0f]/90 backdrop-blur-xl overflow-hidden">
                {/* Inner gradient */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-30',
                  FEATURED_RESEARCH.bgGradient
                )} />

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyber-purple/50 rounded-tl-3xl" />
                <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyber-cyan/50 rounded-tr-3xl" />
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyber-green/50 rounded-bl-3xl" />
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyber-purple/50 rounded-br-3xl" />

                <div className="relative p-8 md:p-12">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{
                            boxShadow: [
                              '0 0 20px rgba(168, 85, 247, 0.3)',
                              '0 0 40px rgba(168, 85, 247, 0.5)',
                              '0 0 20px rgba(168, 85, 247, 0.3)'
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-14 h-14 rounded-2xl bg-cyber-purple/10 border border-cyber-purple/30 flex items-center justify-center"
                        >
                          <Atom className="h-7 w-7 text-cyber-purple" />
                        </motion.div>
                        <span className="text-2xl font-bold text-muted-foreground">+</span>
                        <motion.div
                          animate={{
                            boxShadow: [
                              '0 0 20px rgba(0, 255, 136, 0.3)',
                              '0 0 40px rgba(0, 255, 136, 0.5)',
                              '0 0 20px rgba(0, 255, 136, 0.3)'
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                          className="w-14 h-14 rounded-2xl bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center"
                        >
                          <Dna className="h-7 w-7 text-cyber-green" />
                        </motion.div>
                        <span className="text-2xl font-bold text-muted-foreground">+</span>
                        <motion.div
                          animate={{
                            boxShadow: [
                              '0 0 20px rgba(0, 212, 255, 0.3)',
                              '0 0 40px rgba(0, 212, 255, 0.5)',
                              '0 0 20px rgba(0, 212, 255, 0.3)'
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
                          className="w-14 h-14 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center"
                        >
                          <Brain className="h-7 w-7 text-cyber-cyan" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-cyber-orange/20 text-cyber-orange text-xs font-medium">
                        {FEATURED_RESEARCH.status}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-muted-foreground text-xs">
                        {FEATURED_RESEARCH.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-cyber-cyan transition-colors">
                      {FEATURED_RESEARCH.title}
                    </h3>
                    <p className="text-lg text-cyber-purple font-medium mb-4">
                      {FEATURED_RESEARCH.subtitle}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {FEATURED_RESEARCH.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    {FEATURED_RESEARCH.stats.map((stat, idx) => (
                      <div key={idx} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-lg font-bold gradient-text">{stat.value}</span>
                        <span className="text-sm text-muted-foreground ml-2">{stat.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {FEATURED_RESEARCH.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-foreground/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center text-cyber-cyan font-medium group-hover:gap-3 gap-2 transition-all">
                    <span>Explore Research</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.section>

        {/* All Research Topics */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <Layers className="h-5 w-5 text-cyber-cyan" />
            <h2 className="text-xl font-bold">All Research Topics</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESEARCH_TOPICS.map((topic) => {
              const Icon = topic.icon
              const isActive = topic.status === 'Active'

              return (
                <motion.div
                  key={topic.id}
                  variants={itemVariants}
                  className="group"
                >
                  <Link href={`/research/${topic.slug}`}>
                    <div
                      className={cn(
                        'h-full rounded-2xl border p-6',
                        'bg-[#0a0a0f]/80 backdrop-blur-sm',
                        'transition-all duration-500',
                        topic.borderColor,
                        'hover:-translate-y-2 hover:shadow-lg'
                      )}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center',
                          topic.bgColor,
                          'border border-white/10'
                        )}>
                          <Icon className={cn('h-6 w-6', topic.color)} />
                        </div>
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          isActive ? 'bg-cyber-green/20 text-cyber-green' : 'bg-white/10 text-muted-foreground'
                        )}>
                          {topic.status}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-lg font-bold mb-2 group-hover:text-cyber-cyan transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {topic.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className={topic.color}>{topic.progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={cn('h-full rounded-full transition-all', topic.bgColor)}
                            style={{ width: `${topic.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {topic.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-white/5 text-xs text-foreground/60"
                          >
                            {tag}
                          </span>
                        ))}
                        {topic.tags.length > 3 && (
                          <span className="px-2 py-0.5 rounded bg-white/5 text-xs text-foreground/60">
                            +{topic.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Research Interests Cloud */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-cyber-purple" />
            <h2 className="text-xl font-bold">Research Interests</h2>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex flex-wrap gap-3 justify-center">
              {RESEARCH_INTERESTS.map((interest, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={cn(
                    'px-4 py-2 rounded-full border text-sm font-medium',
                    'hover:scale-105 transition-transform cursor-default',
                    idx % 5 === 0 && 'bg-cyber-purple/10 border-cyber-purple/30 text-cyber-purple',
                    idx % 5 === 1 && 'bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan',
                    idx % 5 === 2 && 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green',
                    idx % 5 === 3 && 'bg-cyber-orange/10 border-cyber-orange/30 text-cyber-orange',
                    idx % 5 === 4 && 'bg-cyber-pink/10 border-cyber-pink/30 text-cyber-pink',
                  )}
                >
                  {interest}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-br from-cyber-purple/10 via-cyber-green/5 to-cyber-cyan/10 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">
              <span className="gradient-text">Interested in Collaboration?</span>
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              I'm always open to discussing research ideas, potential collaborations, or exploring new frontiers together.
            </p>
            <Button asChild size="lg" variant="gradient">
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.section>
      </div>
    </PageLayout>
  )
}

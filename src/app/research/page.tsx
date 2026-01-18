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
  HeartPulse,
  Activity,
  Microscope,
  FlaskConical,
  Server,
  Lightbulb,
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

// Superhuman Intelligence Pillars
const SUPERHUMAN_PILLARS = [
  {
    name: 'Artificial Intelligence',
    icon: Brain,
    color: 'text-cyber-cyan',
    description: 'Machine learning, LLMs, autonomous agents',
  },
  {
    name: 'Cybersecurity',
    icon: Shield,
    color: 'text-security-safe',
    description: 'Post-quantum crypto, threat intelligence',
  },
  {
    name: 'Blockchain',
    icon: Blocks,
    color: 'text-cyber-orange',
    description: 'DeFi, smart contracts, zero-knowledge proofs',
  },
  {
    name: 'Quantum Computing',
    icon: Atom,
    color: 'text-cyber-purple',
    description: 'Qubits, quantum ML, cryptography',
  },
  {
    name: 'Biotechnology',
    icon: Dna,
    color: 'text-cyber-green',
    description: 'CRISPR, genomics, brain-computer interfaces',
  },
]

// Research Topics Data - All related to Superhuman Intelligence
const FEATURED_RESEARCH = {
  id: 'superhuman',
  slug: 'superhuman-research',
  title: 'The Superhuman Convergence',
  subtitle: 'Quantum Computing + Biotechnology + AI',
  description: 'The ultimate guide to mastering the convergence of Quantum Computing, Biotechnology, and AI. This combination creates capabilities that fewer than a handful of professionals worldwide possess—positioning you at the epicenter of technological transformation.',
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

const RESEARCH_CATEGORIES = [
  {
    category: 'Artificial Intelligence',
    icon: Brain,
    color: 'text-cyber-cyan',
    bgColor: 'bg-cyber-cyan/10',
    topics: [
      {
        id: 'ai-agents',
        slug: 'ai-agents',
        title: 'AI Agents & Autonomous Systems',
        description: 'Autonomous agents, multi-agent systems, LangChain, AutoGPT, and complex problem-solving architectures.',
        tags: ['LLM Agents', 'AutoGPT', 'Multi-Agent', 'ReAct'],
        status: 'Active',
        progress: 75,
      },
      {
        id: 'llm-research',
        slug: 'llm-research',
        title: 'Large Language Models',
        description: 'Transformer architectures, fine-tuning, RLHF, prompt engineering, and model optimization.',
        tags: ['Transformers', 'RLHF', 'Fine-tuning', 'RAG'],
        status: 'Active',
        progress: 80,
      },
      {
        id: 'computer-vision',
        slug: 'computer-vision',
        title: 'Computer Vision & Perception',
        description: 'Object detection, image segmentation, neural radiance fields, and multimodal understanding.',
        tags: ['CNN', 'ViT', 'NeRF', 'Multimodal'],
        status: 'Planned',
        progress: 25,
      },
    ],
  },
  {
    category: 'Cybersecurity',
    icon: Shield,
    color: 'text-security-safe',
    bgColor: 'bg-security-safe/10',
    topics: [
      {
        id: 'threat-landscape',
        slug: 'threat-landscape',
        title: 'Threat Landscape Analysis',
        description: 'APT groups, ransomware evolution, supply chain attacks, and emerging threat vectors.',
        tags: ['APT', 'Ransomware', 'Supply Chain', 'Zero-Day'],
        status: 'Active',
        progress: 85,
      },
      {
        id: 'post-quantum-crypto',
        slug: 'post-quantum-crypto',
        title: 'Post-Quantum Cryptography',
        description: 'NIST PQC standards, lattice-based crypto, hash-based signatures, and quantum-safe protocols.',
        tags: ['ML-KEM', 'Lattice', 'SPHINCS+', 'Hybrid'],
        status: 'Active',
        progress: 70,
      },
      {
        id: 'offensive-security',
        slug: 'offensive-security',
        title: 'Offensive Security Research',
        description: 'Penetration testing methodologies, exploit development, red team operations.',
        tags: ['Pentest', 'Red Team', 'Exploit Dev', 'OSCP'],
        status: 'Active',
        progress: 65,
      },
    ],
  },
  {
    category: 'Blockchain & Web3',
    icon: Blocks,
    color: 'text-cyber-orange',
    bgColor: 'bg-cyber-orange/10',
    topics: [
      {
        id: 'zero-knowledge',
        slug: 'zero-knowledge-proofs',
        title: 'Zero-Knowledge Proofs',
        description: 'ZK-SNARKs, ZK-STARKs, privacy-preserving computation, and blockchain scaling solutions.',
        tags: ['ZK-SNARKs', 'ZK-STARKs', 'Privacy', 'Rollups'],
        status: 'Active',
        progress: 60,
      },
      {
        id: 'defi-research',
        slug: 'defi-research',
        title: 'DeFi Protocol Analysis',
        description: 'AMM mechanisms, MEV extraction, liquidity optimization, and protocol security.',
        tags: ['AMM', 'MEV', 'Liquidity', 'Tokenomics'],
        status: 'Active',
        progress: 80,
      },
      {
        id: 'smart-contracts',
        slug: 'smart-contracts',
        title: 'Smart Contract Security',
        description: 'Vulnerability patterns, formal verification, auditing methodologies, and secure development.',
        tags: ['Solidity', 'Audit', 'Formal Verify', 'EVM'],
        status: 'Active',
        progress: 75,
      },
    ],
  },
  {
    category: 'Quantum Computing',
    icon: Atom,
    color: 'text-cyber-purple',
    bgColor: 'bg-cyber-purple/10',
    topics: [
      {
        id: 'quantum-algorithms',
        slug: 'quantum-algorithms',
        title: 'Quantum Algorithms',
        description: "Shor's algorithm, Grover's search, VQE, QAOA, and quantum error correction.",
        tags: ['Shor', 'Grover', 'VQE', 'QAOA'],
        status: 'Active',
        progress: 55,
      },
      {
        id: 'quantum-ml',
        slug: 'quantum-machine-learning',
        title: 'Quantum Machine Learning',
        description: 'Quantum neural networks, variational circuits, quantum advantage in ML applications.',
        tags: ['QNN', 'PennyLane', 'Qiskit', 'Hybrid'],
        status: 'Active',
        progress: 45,
      },
      {
        id: 'quantum-hardware',
        slug: 'quantum-hardware',
        title: 'Quantum Hardware Platforms',
        description: 'Superconducting qubits, trapped ions, photonics, and topological approaches.',
        tags: ['IBM', 'Google', 'IonQ', 'Photonic'],
        status: 'Planned',
        progress: 30,
      },
    ],
  },
  {
    category: 'Biotechnology & BioMedic',
    icon: Dna,
    color: 'text-cyber-green',
    bgColor: 'bg-cyber-green/10',
    topics: [
      {
        id: 'gene-editing',
        slug: 'gene-editing',
        title: 'Gene Editing & CRISPR',
        description: 'CRISPR-Cas9, base editing, prime editing, and therapeutic applications.',
        tags: ['CRISPR', 'Base Edit', 'Prime Edit', 'Therapy'],
        status: 'Active',
        progress: 65,
      },
      {
        id: 'brain-computer',
        slug: 'brain-computer-interfaces',
        title: 'Brain-Computer Interfaces',
        description: 'Neural implants, non-invasive BCI, Neuralink, and cognitive enhancement.',
        tags: ['Neuralink', 'EEG', 'Neural', 'BCI'],
        status: 'Active',
        progress: 50,
      },
      {
        id: 'ai-drug-discovery',
        slug: 'ai-drug-discovery',
        title: 'AI-Driven Drug Discovery',
        description: 'AlphaFold, molecular simulation, protein structure prediction, and computational biology.',
        tags: ['AlphaFold', 'Molecular', 'Protein', 'Pharma'],
        status: 'Active',
        progress: 70,
      },
      {
        id: 'longevity',
        slug: 'longevity-research',
        title: 'Longevity & Life Extension',
        description: 'Cellular rejuvenation, senolytics, epigenetic reprogramming, and aging intervention.',
        tags: ['Aging', 'Senolytic', 'Epigenetic', 'Altos'],
        status: 'Planned',
        progress: 35,
      },
    ],
  },
  {
    category: 'Emerging Technologies',
    icon: Rocket,
    color: 'text-cyber-pink',
    bgColor: 'bg-cyber-pink/10',
    topics: [
      {
        id: 'space-tech',
        slug: 'space-technology',
        title: 'Space Technology',
        description: 'Satellite networks, space computing, and orbital infrastructure commercialization.',
        tags: ['Starlink', 'Satellite', 'Launch', 'Orbit'],
        status: 'Planned',
        progress: 20,
      },
      {
        id: 'robotics',
        slug: 'robotics-automation',
        title: 'Robotics & Automation',
        description: 'Humanoid robots, autonomous systems, industrial automation, and embodied AI.',
        tags: ['Humanoid', 'ROS', 'Automation', 'Tesla Bot'],
        status: 'Planned',
        progress: 15,
      },
      {
        id: 'ar-vr',
        slug: 'ar-vr-metaverse',
        title: 'AR/VR & Spatial Computing',
        description: 'Mixed reality, spatial computing, metaverse infrastructure, and immersive experiences.',
        tags: ['Vision Pro', 'Quest', 'Spatial', 'XR'],
        status: 'Planned',
        progress: 25,
      },
    ],
  },
]

const RESEARCH_STATS = [
  { icon: BookOpen, value: '20+', label: 'Research Topics' },
  { icon: Clock, value: '500+', label: 'Hours Research' },
  { icon: TrendingUp, value: '30+', label: 'Technologies' },
  { icon: Star, value: '12', label: 'Active Studies' },
]

export default function ResearchPage() {
  return (
    <PageLayout
      title="Research Lab"
      subtitle="Building Superhuman Intelligence through convergent technology research"
      showBadge={true}
      badgeText="Superhuman Intelligence Program"
    >
      <div className="container px-4">
        {/* Intro Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-br from-cyber-purple/10 via-cyber-cyan/5 to-cyber-green/10 border border-white/10">
            <p className="text-lg leading-relaxed text-foreground/90 mb-6">
              <strong className="gradient-text">Superhuman Intelligence</strong> is not science fiction—it's the strategic convergence of cutting-edge technologies that amplify human capabilities beyond natural limits. This research lab explores the technologies that will define the next era of human potential.
            </p>

            {/* Superhuman Pillars */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {SUPERHUMAN_PILLARS.map((pillar, idx) => {
                const Icon = pillar.icon
                return (
                  <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                    <Icon className={cn('h-4 w-4', pillar.color)} />
                    <span className="text-sm font-medium">{pillar.name}</span>
                  </div>
                )
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {RESEARCH_STATS.map((stat, index) => (
                <div key={index} className="p-3 rounded-xl bg-white/5 text-center">
                  <stat.icon className="h-5 w-5 mx-auto mb-1 text-cyber-cyan" />
                  <div className="text-xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

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
              <div className={cn(
                'absolute -inset-px bg-gradient-to-r rounded-3xl opacity-50 blur-sm group-hover:opacity-80 transition-opacity',
                FEATURED_RESEARCH.gradient
              )} />

              <div className="relative rounded-3xl border border-white/10 bg-[#0a0a0f]/90 backdrop-blur-xl overflow-hidden">
                <div className={cn('absolute inset-0 bg-gradient-to-br opacity-30', FEATURED_RESEARCH.bgGradient)} />

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyber-purple/50 rounded-tl-3xl" />
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyber-cyan/50 rounded-tr-3xl" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyber-green/50 rounded-bl-3xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyber-purple/50 rounded-br-3xl" />

                <div className="relative p-8 md:p-10">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ boxShadow: ['0 0 20px rgba(168, 85, 247, 0.3)', '0 0 40px rgba(168, 85, 247, 0.5)', '0 0 20px rgba(168, 85, 247, 0.3)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-12 h-12 rounded-xl bg-cyber-purple/10 border border-cyber-purple/30 flex items-center justify-center"
                      >
                        <Atom className="h-6 w-6 text-cyber-purple" />
                      </motion.div>
                      <span className="text-xl font-bold text-muted-foreground">+</span>
                      <motion.div
                        animate={{ boxShadow: ['0 0 20px rgba(0, 255, 136, 0.3)', '0 0 40px rgba(0, 255, 136, 0.5)', '0 0 20px rgba(0, 255, 136, 0.3)'] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                        className="w-12 h-12 rounded-xl bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center"
                      >
                        <Dna className="h-6 w-6 text-cyber-green" />
                      </motion.div>
                      <span className="text-xl font-bold text-muted-foreground">+</span>
                      <motion.div
                        animate={{ boxShadow: ['0 0 20px rgba(0, 212, 255, 0.3)', '0 0 40px rgba(0, 212, 255, 0.5)', '0 0 20px rgba(0, 212, 255, 0.3)'] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
                        className="w-12 h-12 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center"
                      >
                        <Brain className="h-6 w-6 text-cyber-cyan" />
                      </motion.div>
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

                  <div className="flex flex-wrap gap-4 mb-6">
                    {FEATURED_RESEARCH.stats.map((stat, idx) => (
                      <div key={idx} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-lg font-bold gradient-text">{stat.value}</span>
                        <span className="text-sm text-muted-foreground ml-2">{stat.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {FEATURED_RESEARCH.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-foreground/70">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center text-cyber-cyan font-medium group-hover:gap-3 gap-2 transition-all">
                    <span>Explore Full Research</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.section>

        {/* Research Categories */}
        {RESEARCH_CATEGORIES.map((category, catIdx) => {
          const CategoryIcon = category.icon
          return (
            <motion.section
              key={category.category}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', category.bgColor)}>
                  <CategoryIcon className={cn('h-5 w-5', category.color)} />
                </div>
                <h2 className="text-xl font-bold">{category.category}</h2>
                <span className="text-sm text-muted-foreground">({category.topics.length} topics)</span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.topics.map((topic) => {
                  const isActive = topic.status === 'Active'
                  return (
                    <motion.div key={topic.id} variants={itemVariants}>
                      <Link href={`/research/${topic.slug}`} className="block group h-full">
                        <div className={cn(
                          'h-full rounded-xl border p-5',
                          'bg-[#0a0a0f]/80 backdrop-blur-sm',
                          'border-white/10 hover:border-white/20',
                          'transition-all duration-300 hover:-translate-y-1'
                        )}>
                          <div className="flex items-start justify-between mb-3">
                            <h3 className={cn('font-bold group-hover:text-cyber-cyan transition-colors', category.color)}>
                              {topic.title}
                            </h3>
                            <span className={cn(
                              'px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0',
                              isActive ? 'bg-cyber-green/20 text-cyber-green' : 'bg-white/10 text-muted-foreground'
                            )}>
                              {topic.status}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {topic.description}
                          </p>

                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className={category.color}>{topic.progress}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className={cn('h-full rounded-full', category.bgColor)}
                                style={{ width: `${topic.progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {topic.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-xs text-foreground/60">
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
          )
        })}

        {/* Vision Statement */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="relative">
            <div className="absolute -inset-px bg-gradient-to-r from-cyber-purple via-cyber-cyan to-cyber-green rounded-2xl opacity-30 blur-sm" />
            <div className="relative p-8 rounded-2xl bg-[#0a0a0f]/90 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="h-6 w-6 text-cyber-orange" />
                <h3 className="text-xl font-bold">The Vision</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The convergence of <span className="text-cyber-cyan">Artificial Intelligence</span>, <span className="text-security-safe">Cybersecurity</span>, <span className="text-cyber-orange">Blockchain</span>, <span className="text-cyber-purple">Quantum Computing</span>, and <span className="text-cyber-green">Biotechnology</span> creates a unique skillset positioned at the epicenter of technological transformation.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This research program aims to build <strong className="gradient-text">Superhuman Intelligence</strong>—not through replacing human capabilities, but by <strong>augmenting and amplifying</strong> them through the strategic mastery of convergent technologies.
              </p>
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
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">
              <span className="gradient-text">Join the Research</span>
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Interested in collaboration, discussion, or exploring these frontiers together? Let's connect and push the boundaries of what's possible.
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

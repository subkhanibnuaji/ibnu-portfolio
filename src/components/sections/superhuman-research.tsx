'use client'

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
  Target,
  TrendingUp,
  GraduationCap,
  ArrowRight,
  FlaskConical,
  Cpu,
  Network,
  Lock,
  Rocket,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const RESEARCH_PILLARS = [
  {
    id: 'quantum',
    icon: Atom,
    title: 'Quantum Computing',
    description: 'Mastering qubits, superposition, and entanglement for exponential computational power',
    color: 'text-cyber-purple',
    bgColor: 'bg-cyber-purple/10',
    borderColor: 'border-cyber-purple/30 hover:border-cyber-purple/60',
    gradient: 'from-cyber-purple/20 via-transparent to-cyber-cyan/20',
    stats: [
      { label: 'Talent Gap', value: '3:1' },
      { label: 'Market by 2035', value: '$72B' },
    ],
    highlights: [
      'Gate-based & Quantum Annealing',
      'Qiskit & PennyLane Frameworks',
      'Post-Quantum Cryptography',
    ],
  },
  {
    id: 'biotech',
    icon: Dna,
    title: 'Biotechnology',
    description: 'Gene editing, CRISPR, and AI-driven drug discovery transforming healthcare',
    color: 'text-cyber-green',
    bgColor: 'bg-cyber-green/10',
    borderColor: 'border-cyber-green/30 hover:border-cyber-green/60',
    gradient: 'from-cyber-green/20 via-transparent to-cyber-cyan/20',
    stats: [
      { label: 'AI Drug Market', value: '$8.5B' },
      { label: 'mRNA Market', value: '$221B' },
    ],
    highlights: [
      'CRISPR-Cas9 & Prime Editing',
      'AlphaFold & Protein Prediction',
      'Brain-Computer Interfaces',
    ],
  },
  {
    id: 'convergence',
    icon: Brain,
    title: 'AI Convergence',
    description: 'The intersection of Quantum, Biotech, AI, Security, and Blockchain',
    color: 'text-cyber-cyan',
    bgColor: 'bg-cyber-cyan/10',
    borderColor: 'border-cyber-cyan/30 hover:border-cyber-cyan/60',
    gradient: 'from-cyber-cyan/20 via-transparent to-cyber-purple/20',
    stats: [
      { label: 'Life Science Value', value: '$500B' },
      { label: 'Growth Rate', value: '30%+' },
    ],
    highlights: [
      'Quantum-AI Drug Discovery',
      'Blockchain Health Records',
      'Post-Quantum Security',
    ],
  },
]

const CONVERGENCE_BENEFITS = [
  {
    icon: Lock,
    title: 'Quantum-Secured Genomics',
    description: 'Individual DNA data control via blockchain with PQC protection',
  },
  {
    icon: FlaskConical,
    title: 'AI-Quantum Drug Design',
    description: 'Generative AI + quantum validation for molecular binding',
  },
  {
    icon: Network,
    title: 'Decentralized Clinical Trials',
    description: 'Blockchain integrity, AI optimization, quantum-secured transmission',
  },
]

const MARKET_STATS = [
  { icon: TrendingUp, value: '$72B', label: 'Quantum Computing by 2035' },
  { icon: Target, value: '3:1', label: 'Talent Gap Ratio' },
  { icon: Rocket, value: '$2B+', label: 'AI-Biotech VC Investment/Year' },
  { icon: GraduationCap, value: '250K', label: 'Quantum Roles by 2030' },
]

export function SuperhumanResearchSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-b from-[#0a0a0f] via-[#080810] to-[#0a0a0f]">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-r from-cyber-purple/10 to-cyber-green/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-l from-cyber-cyan/10 to-cyber-purple/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-green/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0a0a0f]/80 backdrop-blur-sm border border-cyber-purple/30 text-sm font-mono mb-4">
            <Sparkles className="h-4 w-4 text-cyber-purple" />
            <span className="text-cyber-purple">$</span>
            <span className="text-cyber-cyan">research</span>
            <span className="text-foreground">--superhuman</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
            <span className="text-muted-foreground">The</span>{' '}
            <span className="gradient-text text-glow">Superhuman</span>{' '}
            <span className="text-muted-foreground">Skillset</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            Mastering Quantum Computing, Biotechnology, and their convergence with AI creates
            capabilities that fewer than a handful of professionals worldwide possess.
          </p>
        </motion.div>

        {/* Market Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {MARKET_STATS.map((stat, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-white/5 border border-white/10 text-center"
            >
              <stat.icon className="h-6 w-6 mx-auto mb-2 text-cyber-purple" />
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Research Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {RESEARCH_PILLARS.map((pillar, index) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div
                  className={cn(
                    'h-full rounded-2xl border p-6',
                    'bg-[#0a0a0f]/80 backdrop-blur-sm',
                    'transition-all duration-500',
                    pillar.borderColor,
                    'hover:-translate-y-2 hover:shadow-lg'
                  )}
                >
                  {/* Icon */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={cn(
                      'w-14 h-14 rounded-xl flex items-center justify-center',
                      'bg-gradient-to-br',
                      pillar.gradient,
                      'border border-white/10'
                    )}>
                      <Icon className={cn('h-7 w-7', pillar.color)} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-mono text-foreground">
                        {pillar.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4">
                    {pillar.description}
                  </p>

                  {/* Stats */}
                  <div className="flex gap-4 mb-4">
                    {pillar.stats.map((stat, i) => (
                      <div key={i} className="flex-1 p-2 rounded-lg bg-white/5 text-center">
                        <div className={cn('text-lg font-bold', pillar.color)}>{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Highlights List */}
                  <div className="space-y-2">
                    {pillar.highlights.map((highlight, i) => (
                      <div
                        key={i}
                        className={cn(
                          'flex items-center gap-2 text-sm px-3 py-2 rounded-lg',
                          'bg-white/5 border border-white/5'
                        )}
                      >
                        <Zap className={cn('h-3 w-3 flex-shrink-0', pillar.color)} />
                        <span className="text-muted-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Convergence Section */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative"
        >
          {/* Glowing border effect */}
          <div className="absolute -inset-px bg-gradient-to-r from-cyber-purple via-cyber-green to-cyber-cyan rounded-3xl opacity-50 blur-sm" />

          <div className="relative rounded-3xl border border-white/10 bg-[#0a0a0f]/90 backdrop-blur-xl overflow-hidden">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/5 via-cyber-green/5 to-cyber-cyan/5" />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyber-purple/50 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyber-cyan/50 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyber-green/50 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyber-purple/50 rounded-br-3xl" />

            <div className="relative p-8 md:p-12">
              {/* Combined Icons */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(168, 85, 247, 0.3)',
                      '0 0 40px rgba(168, 85, 247, 0.5)',
                      '0 0 20px rgba(168, 85, 247, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-cyber-purple/10 border border-cyber-purple/30 flex items-center justify-center"
                >
                  <Atom className="h-8 w-8 md:h-10 md:w-10 text-cyber-purple" />
                </motion.div>

                <span className="text-3xl font-bold gradient-text">+</span>

                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(0, 255, 136, 0.3)',
                      '0 0 40px rgba(0, 255, 136, 0.5)',
                      '0 0 20px rgba(0, 255, 136, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center"
                >
                  <Dna className="h-8 w-8 md:h-10 md:w-10 text-cyber-green" />
                </motion.div>

                <span className="text-3xl font-bold gradient-text">+</span>

                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(0, 212, 255, 0.3)',
                      '0 0 40px rgba(0, 212, 255, 0.5)',
                      '0 0 20px rgba(0, 212, 255, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center"
                >
                  <Brain className="h-8 w-8 md:h-10 md:w-10 text-cyber-cyan" />
                </motion.div>
              </div>

              {/* Title */}
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-4xl font-bold mb-4 font-mono">
                  <span className="text-cyber-purple">Quantum</span>
                  <span className="text-muted-foreground mx-2">+</span>
                  <span className="text-cyber-green">Biotech</span>
                  <span className="text-muted-foreground mx-2">+</span>
                  <span className="text-cyber-cyan">AI</span>
                </h3>
                <p className="text-xl md:text-2xl font-bold gradient-text text-glow">
                  The Convergence Stack for Transformation
                </p>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10 text-lg leading-relaxed">
                When these domains converge with
                <span className="text-cyber-orange"> Blockchain</span> and
                <span className="text-cyber-green"> Cybersecurity</span>,
                you create capabilities positioned at the epicenter of technological transformation.
                McKinsey projects life sciences alone will capture <span className="text-cyber-cyan font-bold">$200-500 billion</span> in value creation.
              </p>

              {/* Convergence Benefits Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {CONVERGENCE_BENEFITS.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="group"
                  >
                    <div className="h-full p-6 rounded-xl bg-white/5 border border-white/10 hover:border-cyber-purple/30 transition-all duration-300 hover:bg-white/[0.07]">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-purple/20 via-cyber-green/20 to-cyber-cyan/20 flex items-center justify-center border border-white/10 flex-shrink-0">
                          <benefit.icon className="h-6 w-6 text-cyber-purple" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground mb-1">{benefit.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-center"
              >
                <Button
                  asChild
                  size="lg"
                  variant="gradient"
                  className="group"
                >
                  <Link href="/superhuman-research">
                    <span>Explore Full Research</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

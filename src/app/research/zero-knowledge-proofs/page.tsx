'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Fingerprint,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Blocks,
  Zap,
  Code,
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
  Layers,
  Binary,
  Network,
  Cpu,
  Scale,
  FileCode,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const ZK_TYPES = [
  {
    name: 'ZK-SNARKs',
    fullName: 'Succinct Non-interactive Arguments of Knowledge',
    description: 'Constant-size proofs, requires trusted setup',
    pros: ['Small proof size (~200 bytes)', 'Fast verification', 'Widely adopted'],
    cons: ['Trusted setup required', 'Not quantum-safe'],
    color: 'text-cyber-purple',
    bgColor: 'bg-cyber-purple/10',
  },
  {
    name: 'ZK-STARKs',
    fullName: 'Scalable Transparent Arguments of Knowledge',
    description: 'No trusted setup, quantum-resistant',
    pros: ['Transparent (no trusted setup)', 'Quantum-resistant', 'Scalable'],
    cons: ['Larger proof size', 'More complex'],
    color: 'text-cyber-cyan',
    bgColor: 'bg-cyber-cyan/10',
  },
  {
    name: 'Bulletproofs',
    fullName: 'Short Non-interactive Zero-knowledge Proofs',
    description: 'No trusted setup, logarithmic proof size',
    pros: ['No trusted setup', 'Good for range proofs'],
    cons: ['Slower verification', 'Linear prover time'],
    color: 'text-cyber-green',
    bgColor: 'bg-cyber-green/10',
  },
  {
    name: 'PLONK',
    fullName: 'Permutations over Lagrange-bases for Oecumenical Noninteractive arguments of Knowledge',
    description: 'Universal trusted setup, flexible',
    pros: ['Universal setup', 'Flexible circuits', 'Efficient'],
    cons: ['Still needs setup', 'Complex math'],
    color: 'text-cyber-orange',
    bgColor: 'bg-cyber-orange/10',
  },
]

const USE_CASES = [
  {
    category: 'Blockchain Scaling',
    icon: Blocks,
    applications: [
      { name: 'zkSync', description: 'Ethereum L2 with ZK rollups' },
      { name: 'StarkNet', description: 'STARK-based L2 scaling' },
      { name: 'Polygon zkEVM', description: 'EVM-equivalent ZK rollup' },
    ],
  },
  {
    category: 'Privacy',
    icon: EyeOff,
    applications: [
      { name: 'Zcash', description: 'Private cryptocurrency' },
      { name: 'Tornado Cash', description: 'Privacy mixer' },
      { name: 'Aztec', description: 'Private DeFi' },
    ],
  },
  {
    category: 'Identity',
    icon: Fingerprint,
    applications: [
      { name: 'Worldcoin', description: 'Proof of personhood' },
      { name: 'Polygon ID', description: 'Self-sovereign identity' },
      { name: 'zkKYC', description: 'Privacy-preserving KYC' },
    ],
  },
  {
    category: 'Computation',
    icon: Cpu,
    applications: [
      { name: 'RISC Zero', description: 'zkVM for any program' },
      { name: 'SP1', description: 'Succinct Processor 1' },
      { name: 'zkWASM', description: 'ZK proofs for WASM' },
    ],
  },
]

const KEY_CONCEPTS = [
  {
    title: 'Completeness',
    description: 'If the statement is true, an honest prover can convince an honest verifier',
    icon: CheckCircle2,
  },
  {
    title: 'Soundness',
    description: 'If the statement is false, no cheating prover can convince the verifier',
    icon: Shield,
  },
  {
    title: 'Zero-Knowledge',
    description: 'The verifier learns nothing except that the statement is true',
    icon: EyeOff,
  },
]

const PROJECTS = [
  { name: 'circom', description: 'Circuit compiler for ZK', language: 'Rust' },
  { name: 'snarkjs', description: 'JavaScript ZK library', language: 'JavaScript' },
  { name: 'arkworks', description: 'Rust ZK ecosystem', language: 'Rust' },
  { name: 'halo2', description: 'ZK proving system', language: 'Rust' },
  { name: 'noir', description: 'DSL for ZK circuits', language: 'Noir' },
  { name: 'o1js', description: 'TypeScript ZK framework', language: 'TypeScript' },
]

const MARKET_DATA = [
  { metric: 'ZK L2 TVL', value: '$4B+', trend: 'Growing' },
  { metric: 'ZK Projects', value: '100+', trend: 'Expanding' },
  { metric: 'Developer Growth', value: '150%', trend: 'YoY' },
  { metric: 'VC Funding', value: '$1B+', trend: '2023-2024' },
]

export default function ZeroKnowledgeResearchPage() {
  return (
    <PageLayout
      title="Zero-Knowledge Proofs"
      subtitle="Privacy-preserving computation and blockchain scaling"
      showBadge={true}
      badgeText="Active Research"
    >
      <div className="container px-4">
        {/* Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-br from-cyber-purple/10 via-transparent to-cyber-cyan/10 border border-white/10">
            <p className="text-lg leading-relaxed text-foreground/90 mb-6">
              <strong className="gradient-text">Zero-Knowledge Proofs</strong> allow one party (the prover) to prove to another (the verifier) that a statement is true, without revealing any information beyond the validity of the statement itself.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MARKET_DATA.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 text-center">
                  <div className="text-xl font-bold text-cyber-purple">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.metric}</div>
                  <div className="text-xs text-cyber-green">{item.trend}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Key Properties */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <Scale className="h-5 w-5 text-cyber-purple" />
            <h2 className="text-xl font-bold">Key Properties</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {KEY_CONCEPTS.map((concept, idx) => {
              const Icon = concept.icon
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyber-purple/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-cyber-purple" />
                  </div>
                  <h3 className="font-bold mb-2 text-cyber-purple">{concept.title}</h3>
                  <p className="text-sm text-muted-foreground">{concept.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* ZK Types */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <Layers className="h-5 w-5 text-cyber-cyan" />
            <h2 className="text-xl font-bold">Proof Systems Comparison</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {ZK_TYPES.map((zk, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={cn(
                  'p-6 rounded-2xl border bg-white/5',
                  'border-white/10 hover:border-cyber-purple/30 transition-colors'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={cn('text-lg font-bold', zk.color)}>{zk.name}</h3>
                    <p className="text-xs text-muted-foreground">{zk.fullName}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{zk.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-cyber-green mb-2">Pros</p>
                    {zk.pros.map((pro, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <CheckCircle2 className="h-3 w-3 text-cyber-green" />
                        {pro}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-cyber-orange mb-2">Cons</p>
                    {zk.cons.map((con, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Zap className="h-3 w-3 text-cyber-orange" />
                        {con}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Use Cases */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <Target className="h-5 w-5 text-cyber-green" />
            <h2 className="text-xl font-bold">Applications</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {USE_CASES.map((category, idx) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="p-5 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-cyber-green/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-cyber-green" />
                    </div>
                    <h3 className="font-bold text-cyber-green">{category.category}</h3>
                  </div>
                  <div className="space-y-3">
                    {category.applications.map((app, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white/5">
                        <div className="font-medium text-sm">{app.name}</div>
                        <div className="text-xs text-muted-foreground">{app.description}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Development Tools */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <FileCode className="h-5 w-5 text-cyber-orange" />
            <h2 className="text-xl font-bold">Development Tools</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PROJECTS.map((project, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyber-orange/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-cyber-orange">{project.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-muted-foreground">
                    {project.language}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Back to Research */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button asChild variant="outline" size="lg">
            <Link href="/research">
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              Back to Research Lab
            </Link>
          </Button>
        </motion.div>
      </div>
    </PageLayout>
  )
}

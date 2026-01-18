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
  Target,
  TrendingUp,
  GraduationCap,
  ArrowRight,
  FlaskConical,
  Cpu,
  Network,
  Lock,
  Rocket,
  Code,
  Database,
  Globe,
  BookOpen,
  Briefcase,
  DollarSign,
  Clock,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Binary,
  Microscope,
  Syringe,
  Activity,
  HeartPulse,
  Eye,
  Laptop,
  Server,
  Award,
  MapPin,
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

// Quantum Computing Data
const QUANTUM_HARDWARE = [
  {
    name: 'Gate-based (IBM, Google)',
    description: 'Universal computation with quantum gates',
    stats: 'IBM Heron: <0.1% error, 330K CLOPS',
    color: 'text-cyber-cyan',
  },
  {
    name: 'Quantum Annealing (D-Wave)',
    description: 'Optimization problems via energy landscapes',
    stats: '4,400+ qubits, 20-way connectivity',
    color: 'text-cyber-purple',
  },
  {
    name: 'Trapped Ion (IonQ, Quantinuum)',
    description: '99.9%+ gate fidelity, seconds coherence',
    stats: 'QV >2,000,000 (Quantinuum H2)',
    color: 'text-cyber-green',
  },
  {
    name: 'Photonic (PsiQuantum, Xanadu)',
    description: 'Photons in optical circuits',
    stats: 'Target: 1M qubits by 2027',
    color: 'text-cyber-orange',
  },
]

const QUANTUM_FRAMEWORKS = [
  { name: 'Qiskit (IBM)', users: '550K+', highlight: '83x faster transpilation' },
  { name: 'PennyLane (Xanadu)', users: 'Leading QML', highlight: 'PyTorch-like syntax' },
  { name: 'Cirq (Google)', users: 'NISQ focus', highlight: 'TensorFlow Quantum' },
  { name: 'Amazon Braket', users: 'Multi-vendor', highlight: '$0.0009-$0.03/shot' },
]

const QUANTUM_ALGORITHMS = [
  {
    name: "Shor's Algorithm",
    type: 'Exponential speedup',
    use: 'Integer factorization, breaks RSA/ECC',
    timeline: '~10 years for fault-tolerant',
  },
  {
    name: "Grover's Algorithm",
    type: 'Quadratic speedup',
    use: 'Unstructured search',
    timeline: 'Available on NISQ devices',
  },
  {
    name: 'VQE',
    type: 'Hybrid quantum-classical',
    use: 'Ground state energies, drug discovery',
    timeline: 'Active research now',
  },
  {
    name: 'QAOA',
    type: 'Optimization',
    use: 'Portfolio allocation, logistics',
    timeline: 'Benchmarked on all platforms',
  },
]

const QUANTUM_CAREERS = [
  { role: 'Quantum Associate', salary: '$80K-$120K', level: 'Entry' },
  { role: 'Quantum Software Engineer', salary: '$110K-$200K', level: 'Mid' },
  { role: 'Quantum Algorithm Researcher', salary: '$130K-$200K', level: 'Senior' },
  { role: 'Senior Research Scientist', salary: '$180K-$300K+', level: 'Lead' },
]

// Biotech Data
const CRISPR_TOOLS = [
  {
    name: 'CRISPR-Cas9',
    description: 'Double-strand breaks via guide RNA',
    use: 'Gene knockouts, HDR editing',
    milestone: 'FDA approved Casgevy (Dec 2023)',
  },
  {
    name: 'Base Editing',
    description: 'Single nucleotide conversion without DSB',
    use: 'C→T, A→G conversions',
    milestone: '~30,000 disease variants addressable',
  },
  {
    name: 'Prime Editing',
    description: 'Search-and-replace capability',
    use: 'All 12 point mutations, insertions',
    milestone: 'First clinical success (May 2025)',
  },
]

const SEQUENCING_TECH = [
  {
    name: 'Illumina NGS',
    accuracy: '~99.9% (Q30)',
    reads: 'Short-read dominant',
    cost: 'Lowest per-base',
  },
  {
    name: 'Pacific Biosciences',
    accuracy: '>99.9% CCS',
    reads: '10-30kb long-read',
    cost: 'De novo assembly',
  },
  {
    name: 'Oxford Nanopore',
    accuracy: '~99.84% R10.4.1',
    reads: '>4Mb possible',
    cost: 'Portable (MinION)',
  },
]

const AI_BIOTECH_COMPANIES = [
  {
    name: 'Recursion + Exscientia',
    achievement: '65PB biological data, 42→18 month timeline',
    funding: 'Merged 2024',
  },
  {
    name: 'Insilico Medicine',
    achievement: 'First AI drug to Phase 2 trials',
    funding: 'IPF treatment success',
  },
  {
    name: 'Atomwise',
    achievement: 'Acquired by Merck',
    funding: '$2.1B (2025)',
  },
]

const EMERGING_FRONTIERS = [
  {
    name: 'Brain-Computer Interfaces',
    icon: Brain,
    details: [
      'Neuralink: 5 patients implanted (mid-2025)',
      'FDA Breakthrough for Telepathy, Blindsight, Speech',
      '$650M raised, $9B valuation',
      'Market TAM: $400B (Morgan Stanley)',
    ],
    color: 'text-cyber-cyan',
  },
  {
    name: 'DNA Data Storage',
    icon: Database,
    details: [
      '215 petabytes per gram density',
      '1000x denser than magnetic media',
      'Durability: thousands of years',
      'Market: $44.2B by 2034 (88% CAGR)',
    ],
    color: 'text-cyber-purple',
  },
  {
    name: 'Longevity Research',
    icon: HeartPulse,
    details: [
      'Altos Labs: $3B funding (Bezos-backed)',
      'Cellular rejuvenation via Yamanaka factors',
      'BioAge: $238M IPO, $550M Novartis deal',
      'Human trials by 2026',
    ],
    color: 'text-cyber-green',
  },
]

// Convergence Data
const CONVERGENCE_STACK = [
  {
    domain: 'Quantum Computing',
    icon: Atom,
    contribution: 'Enhanced molecular simulations & ML',
    color: 'text-cyber-purple',
  },
  {
    domain: 'AI/ML',
    icon: Brain,
    contribution: 'Accelerated pattern recognition',
    color: 'text-cyber-cyan',
  },
  {
    domain: 'Biotechnology',
    icon: Dna,
    contribution: 'Protein design, gene editing, medicine',
    color: 'text-cyber-green',
  },
  {
    domain: 'Blockchain',
    icon: Blocks,
    contribution: 'Secure data ownership, supply chain',
    color: 'text-cyber-orange',
  },
  {
    domain: 'Cybersecurity',
    icon: Shield,
    contribution: 'Protection across all layers',
    color: 'text-security-safe',
  },
]

const LEARNING_PATH = [
  {
    phase: 'Phase 1',
    title: 'Biotech Fundamentals',
    duration: '3-6 months',
    focus: 'Domain context for applying tech skills',
    resources: ['MIT OpenCourseWare Biology', 'Coursera Genomics', 'Molecular Biology of the Cell'],
  },
  {
    phase: 'Phase 2',
    title: 'AI in Biotech',
    duration: '3-4 months',
    focus: 'Leverage existing AI expertise',
    resources: ['AlphaFold tutorials', 'Recursion datasets', 'Kaggle bio competitions'],
  },
  {
    phase: 'Phase 3',
    title: 'Quantum Fundamentals',
    duration: '4-6 months',
    focus: 'VQE and QAOA for chemistry',
    resources: ['IBM Qiskit Textbook', 'Microsoft Quantum Katas', 'IBM Certification'],
  },
  {
    phase: 'Phase 4',
    title: 'Quantum ML Integration',
    duration: '3-4 months',
    focus: 'Hybrid quantum-classical models',
    resources: ['PennyLane QML course', 'Nature Communications papers', 'AWS Quantum'],
  },
  {
    phase: 'Phase 5',
    title: 'Post-Quantum Cryptography',
    duration: '2-3 months',
    focus: 'Connect to security expertise',
    resources: ['NIST PQC guidelines', 'Open Quantum Safe', 'Health data protection'],
  },
]

const INDONESIA_OPPORTUNITIES = [
  {
    initiative: 'Bukit Algoritma',
    description: '888-hectare tech hub (AI, biotech, quantum, semiconductors)',
    timeline: 'Completion 2030',
  },
  {
    initiative: 'Microsoft Investment',
    description: '$1.7B for cloud/AI infrastructure, 840K workers trained',
    timeline: '2024-2028',
  },
  {
    initiative: 'NVIDIA AI Center',
    description: '$200M AI Talent Development Center',
    timeline: 'Active',
  },
  {
    initiative: 'GDP Impact',
    description: '2.3-3.1% GDP increase by 2027 (highest in ASEAN)',
    timeline: 'BCG Projection',
  },
]

export default function SuperhumanResearchPage() {
  return (
    <PageLayout
      title="Superhuman Research"
      subtitle="Mastering Quantum Computing, Biotechnology, and Their Convergence with AI"
      showBadge={true}
      badgeText="Active Research Program"
    >
      <div className="container px-4">
        {/* Introduction */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-br from-cyber-purple/10 via-cyber-green/5 to-cyber-cyan/10 border border-white/10">
            <p className="text-lg leading-relaxed text-foreground/90 mb-6">
              <strong className="gradient-text">The combination of Quantum Computing, Biotechnology, AI, Cybersecurity, and Blockchain creates a uniquely powerful skillset positioned at the epicenter of technological transformation.</strong>
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              For someone with existing expertise in AI, Cybersecurity, and Blockchain—particularly a computer scientist preparing for PhD research—adding quantum computing and biotechnology creates capabilities that fewer than a handful of professionals worldwide possess.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <div className="text-2xl font-bold text-cyber-purple">3:1</div>
                <div className="text-xs text-muted-foreground">Talent Gap</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <div className="text-2xl font-bold text-cyber-green">$2B+</div>
                <div className="text-xs text-muted-foreground">AI-Biotech VC/Year</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <div className="text-2xl font-bold text-cyber-cyan">$72B</div>
                <div className="text-xs text-muted-foreground">Quantum by 2035</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <div className="text-2xl font-bold text-cyber-orange">$500B</div>
                <div className="text-xs text-muted-foreground">Life Sciences Value</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Part 1: Quantum Computing */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-24"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-cyber-purple/10 border border-cyber-purple/30 flex items-center justify-center">
              <Atom className="h-8 w-8 text-cyber-purple" />
            </div>
            <div>
              <span className="text-cyber-purple font-mono text-sm">Part 1</span>
              <h2 className="text-3xl md:text-4xl font-bold">Quantum Computing Deep Dive</h2>
            </div>
          </motion.div>

          {/* Fundamentals */}
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Binary className="h-5 w-5 text-cyber-purple" />
              Quantum Fundamentals
            </h3>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 mb-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Classical computers process bits (0 or 1), but quantum computers use <strong className="text-cyber-cyan">qubits</strong> leveraging three quantum phenomena:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-cyber-purple/10 border border-cyber-purple/20">
                  <h4 className="font-bold text-cyber-purple mb-2">Superposition</h4>
                  <p className="text-sm text-muted-foreground">Qubits exist in multiple states simultaneously—both 0 and 1 until measured</p>
                </div>
                <div className="p-4 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20">
                  <h4 className="font-bold text-cyber-cyan mb-2">Entanglement</h4>
                  <p className="text-sm text-muted-foreground">Correlations between qubits where one affects another regardless of distance</p>
                </div>
                <div className="p-4 rounded-lg bg-cyber-green/10 border border-cyber-green/20">
                  <h4 className="font-bold text-cyber-green mb-2">Quantum Gates</h4>
                  <p className="text-sm text-muted-foreground">Reversible operations that manipulate states while preserving quantum properties</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                A quantum computer with <strong>n qubits</strong> can represent <strong>2^n states</strong> simultaneously. Google's 53-qubit Sycamore demonstrated ~10^16 dimensional computational space.
              </p>
            </div>
          </motion.div>

          {/* Hardware Approaches */}
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-cyber-purple" />
              Four Competing Hardware Approaches
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {QUANTUM_HARDWARE.map((hw, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyber-purple/30 transition-colors">
                  <h4 className={cn('font-bold mb-2', hw.color)}>{hw.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{hw.description}</p>
                  <p className="text-xs font-mono text-foreground/70">{hw.stats}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Milestones */}
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-cyber-purple" />
              Honest Assessment: Breakthroughs & Limitations
            </h3>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyber-green flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground">Google Willow (Dec 2024):</strong>
                    <span className="text-muted-foreground"> 105 qubits, ~100μs coherence, first "below threshold" QEC. Completed benchmark in 5 minutes that would take classical computers 10^25 years—but no practical application.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-cyber-orange flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground">RSA-2048 Breaking:</strong>
                    <span className="text-muted-foreground"> Requires ~4,000 logical qubits (~1M physical qubits). Estimated 10-15 years away.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Rocket className="h-5 w-5 text-cyber-cyan flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground">IBM Roadmap:</strong>
                    <span className="text-muted-foreground"> Starling (2029) targets 100M gates on 200 logical qubits—first large-scale fault-tolerant system.</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Frameworks */}
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Code className="h-5 w-5 text-cyber-purple" />
              Programming Frameworks
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              {QUANTUM_FRAMEWORKS.map((fw, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <h4 className="font-bold text-cyber-cyan mb-1">{fw.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{fw.users}</p>
                  <p className="text-xs font-mono text-cyber-purple">{fw.highlight}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Key Algorithms */}
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyber-purple" />
              Key Quantum Algorithms
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-cyber-purple">Algorithm</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Application</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  {QUANTUM_ALGORITHMS.map((algo, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 font-medium">{algo.name}</td>
                      <td className="py-3 px-4 text-cyber-cyan">{algo.type}</td>
                      <td className="py-3 px-4 text-muted-foreground">{algo.use}</td>
                      <td className="py-3 px-4 text-muted-foreground">{algo.timeline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Applications */}
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-cyber-purple" />
              Real-World Applications
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-cyber-purple/10 to-transparent border border-cyber-purple/20">
                <Lock className="h-8 w-8 text-cyber-purple mb-4" />
                <h4 className="font-bold mb-2">Cryptography</h4>
                <p className="text-sm text-muted-foreground mb-3">NIST finalized post-quantum standards (Aug 2024): ML-KEM, ML-DSA, SLH-DSA</p>
                <p className="text-xs text-cyber-cyan">50%+ traffic now uses PQC (Cloudflare)</p>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-cyber-green/10 to-transparent border border-cyber-green/20">
                <FlaskConical className="h-8 w-8 text-cyber-green mb-4" />
                <h4 className="font-bold mb-2">Drug Discovery</h4>
                <p className="text-sm text-muted-foreground mb-3">AstraZeneca + IonQ/AWS/NVIDIA: quantum-accelerated drug synthesis</p>
                <p className="text-xs text-cyber-cyan">$200-500B value by 2035 (McKinsey)</p>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-cyber-orange/10 to-transparent border border-cyber-orange/20">
                <DollarSign className="h-8 w-8 text-cyber-orange mb-4" />
                <h4 className="font-bold mb-2">Financial Services</h4>
                <p className="text-sm text-muted-foreground mb-3">JPMorgan: 12% runtime reduction. Goldman: 1000x faster derivatives pricing</p>
                <p className="text-xs text-cyber-cyan">80% of top 50 banks investing</p>
              </div>
            </div>
          </motion.div>

          {/* Careers */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-cyber-purple" />
              Quantum Career Opportunities
            </h3>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              {QUANTUM_CAREERS.map((career, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="text-xs text-cyber-purple">{career.level}</span>
                  <h4 className="font-bold text-sm mb-1">{career.role}</h4>
                  <p className="text-cyber-green font-mono">{career.salary}</p>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-cyber-purple/10 border border-cyber-purple/20">
              <p className="text-sm text-muted-foreground">
                <strong className="text-cyber-purple">Entry Path:</strong> 2-4 weeks linear algebra → 4-6 weeks quantum mechanics concepts → Qiskit programming. <strong>6-12 months</strong> to job-ready with IBM certification (~$200, 1,300+ certified globally).
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* Part 2: Biotechnology */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-24"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center">
              <Dna className="h-8 w-8 text-cyber-green" />
            </div>
            <div>
              <span className="text-cyber-green font-mono text-sm">Part 2</span>
              <h2 className="text-3xl md:text-4xl font-bold">Biotechnology Deep Dive</h2>
            </div>
          </motion.div>

          {/* Central Dogma */}
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Microscope className="h-5 w-5 text-cyber-green" />
              Molecular Biology Fundamentals
            </h3>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                <div className="px-6 py-3 rounded-xl bg-cyber-purple/20 border border-cyber-purple/30">
                  <span className="font-bold text-cyber-purple">DNA</span>
                </div>
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
                <div className="px-6 py-3 rounded-xl bg-cyber-cyan/20 border border-cyber-cyan/30">
                  <span className="font-bold text-cyber-cyan">RNA</span>
                </div>
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
                <div className="px-6 py-3 rounded-xl bg-cyber-green/20 border border-cyber-green/30">
                  <span className="font-bold text-cyber-green">Protein</span>
                </div>
              </div>
              <p className="text-muted-foreground text-center">
                Human genome: <strong className="text-cyber-cyan">~3 billion base pairs</strong> encoding <strong className="text-cyber-green">~20,000 protein-coding genes</strong>
              </p>
            </div>
          </motion.div>

          {/* CRISPR Tools */}
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Syringe className="h-5 w-5 text-cyber-green" />
              CRISPR Gene Editing Revolution
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {CRISPR_TOOLS.map((tool, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyber-green/30 transition-colors">
                  <h4 className="font-bold text-cyber-green mb-2">{tool.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{tool.description}</p>
                  <p className="text-xs text-foreground/70 mb-2">{tool.use}</p>
                  <p className="text-xs font-mono text-cyber-cyan">{tool.milestone}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sequencing Technologies */}
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyber-green" />
              DNA Sequencing Technologies
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-cyber-green">Platform</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Accuracy</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Read Type</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Advantage</th>
                  </tr>
                </thead>
                <tbody>
                  {SEQUENCING_TECH.map((tech, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 font-medium">{tech.name}</td>
                      <td className="py-3 px-4 text-cyber-cyan">{tech.accuracy}</td>
                      <td className="py-3 px-4 text-muted-foreground">{tech.reads}</td>
                      <td className="py-3 px-4 text-muted-foreground">{tech.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* AI in Biotech */}
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-cyber-green" />
              AI Transforming Biotechnology
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-cyber-cyan/10 to-transparent border border-cyber-cyan/20">
                <h4 className="font-bold text-cyber-cyan mb-3">AlphaFold Revolution</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyber-green flex-shrink-0 mt-0.5" />
                    AlphaFold 2: Solved 50-year protein folding problem
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyber-green flex-shrink-0 mt-0.5" />
                    200M+ protein structures, 2M+ researchers using
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyber-green flex-shrink-0 mt-0.5" />
                    AlphaFold 3: All molecules, 50%+ interaction accuracy
                  </li>
                  <li className="flex items-start gap-2">
                    <Award className="h-4 w-4 text-cyber-orange flex-shrink-0 mt-0.5" />
                    2024 Nobel Prize in Chemistry
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-cyber-green/10 to-transparent border border-cyber-green/20">
                <h4 className="font-bold text-cyber-green mb-3">AI Drug Discovery Market</h4>
                <div className="text-3xl font-bold gradient-text mb-2">$1.72B → $8.53B</div>
                <p className="text-sm text-muted-foreground mb-4">2024 to 2030 (30.59% CAGR)</p>
                {AI_BIOTECH_COMPANIES.map((company, idx) => (
                  <div key={idx} className="mb-2 text-sm">
                    <strong className="text-foreground">{company.name}:</strong>
                    <span className="text-muted-foreground"> {company.achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Emerging Frontiers */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Rocket className="h-5 w-5 text-cyber-green" />
              Emerging Frontiers
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {EMERGING_FRONTIERS.map((frontier, idx) => {
                const Icon = frontier.icon
                return (
                  <div key={idx} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-cyber-green/30 transition-colors">
                    <Icon className={cn('h-8 w-8 mb-4', frontier.color)} />
                    <h4 className={cn('font-bold mb-3', frontier.color)}>{frontier.name}</h4>
                    <ul className="space-y-2">
                      {frontier.details.map((detail, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <Zap className={cn('h-3 w-3 flex-shrink-0 mt-0.5', frontier.color)} />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </motion.section>

        {/* Part 3: The Superhuman Convergence */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-24"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-cyber-cyan" />
            </div>
            <div>
              <span className="text-cyber-cyan font-mono text-sm">Part 3</span>
              <h2 className="text-3xl md:text-4xl font-bold">The Superhuman Convergence</h2>
            </div>
          </motion.div>

          {/* Convergence Stack */}
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Network className="h-5 w-5 text-cyber-cyan" />
              Five Domains Creating Emergent Capabilities
            </h3>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {CONVERGENCE_STACK.map((domain, idx) => {
                const Icon = domain.icon
                return (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center min-w-[140px]">
                    <Icon className={cn('h-8 w-8 mx-auto mb-2', domain.color)} />
                    <h4 className={cn('font-bold text-sm mb-1', domain.color)}>{domain.domain}</h4>
                    <p className="text-xs text-muted-foreground">{domain.contribution}</p>
                  </div>
                )
              })}
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-cyber-purple/10 via-cyber-green/5 to-cyber-cyan/10 border border-white/10">
              <h4 className="font-bold text-center mb-4">Emergent Capabilities</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5">
                  <h5 className="font-medium text-cyber-purple mb-2">Quantum-Secured Genomic Data Markets</h5>
                  <p className="text-sm text-muted-foreground">Individuals control their DNA data via blockchain, protected by post-quantum cryptography</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h5 className="font-medium text-cyber-green mb-2">AI-Designed, Quantum-Validated Drugs</h5>
                  <p className="text-sm text-muted-foreground">Generative AI designs molecules, quantum computers validate binding affinity</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h5 className="font-medium text-cyber-cyan mb-2">Secure Clinical Trials</h5>
                  <p className="text-sm text-muted-foreground">Blockchain-verified integrity, AI-optimized patient selection, quantum-secured transmission</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h5 className="font-medium text-cyber-orange mb-2">Personalized Medicine at Scale</h5>
                  <p className="text-sm text-muted-foreground">Multi-omics analysis with quantum ML and blockchain consent management</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Learning Path */}
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-cyber-cyan" />
              Strategic Learning Path (18-24 months)
            </h3>
            <div className="space-y-4">
              {LEARNING_PATH.map((phase, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyber-cyan/30 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-cyber-cyan/20 text-cyber-cyan text-sm font-mono">{phase.phase}</span>
                      <h4 className="font-bold">{phase.title}</h4>
                    </div>
                    <span className="text-sm text-muted-foreground">{phase.duration}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{phase.focus}</p>
                  <div className="flex flex-wrap gap-2">
                    {phase.resources.map((resource, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-white/5 text-xs text-foreground/70">{resource}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Indonesia Context */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-cyber-cyan" />
              Indonesia Context & Regional Opportunities
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {INDONESIA_OPPORTUNITIES.map((opp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-cyber-orange">{opp.initiative}</h4>
                    <span className="text-xs text-muted-foreground">{opp.timeline}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{opp.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Conclusion */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative">
            <div className="absolute -inset-px bg-gradient-to-r from-cyber-purple via-cyber-green to-cyber-cyan rounded-3xl opacity-50 blur-sm" />
            <div className="relative p-8 md:p-12 rounded-3xl bg-[#0a0a0f]/90 border border-white/10">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
                <span className="gradient-text">Positioning for the Convergence Window</span>
              </h2>
              <p className="text-muted-foreground text-center mb-8 leading-relaxed">
                The <strong className="text-cyber-cyan">2025-2030 period</strong> represents a critical window for multi-domain positioning. The technologies are converging. The talent is scarce. Those who master these convergent domains will shape what comes next.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-white/5 text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-cyber-purple" />
                  <div className="font-bold text-cyber-purple">IBM Starling</div>
                  <div className="text-sm text-muted-foreground">2029</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 text-center">
                  <FlaskConical className="h-6 w-6 mx-auto mb-2 text-cyber-green" />
                  <div className="font-bold text-cyber-green">Quantum-AI Drugs</div>
                  <div className="text-sm text-muted-foreground">Clinical trials 2027</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 text-center">
                  <Lock className="h-6 w-6 mx-auto mb-2 text-cyber-cyan" />
                  <div className="font-bold text-cyber-cyan">PQC Migration</div>
                  <div className="text-sm text-muted-foreground">Complete by 2035</div>
                </div>
              </div>

              <div className="text-center">
                <Button asChild size="lg" variant="gradient">
                  <Link href="/contact">
                    Start Your Superhuman Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </PageLayout>
  )
}

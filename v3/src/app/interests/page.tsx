'use client'

import { motion } from 'framer-motion'
import { PageLayout } from '@/components/layout/page-layout'
import {
  Brain,
  Blocks,
  Shield,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Lock,
  Cpu,
  Globe,
  Database
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const interests = [
  {
    id: 'ai',
    title: 'Artificial Intelligence',
    tagline: 'Building intelligent systems that augment human capability',
    icon: Brain,
    color: 'cyber-cyan',
    gradient: 'from-cyber-cyan to-blue-500',
    description: 'Exploring agentic AI systems, LLM workflows, and their applications in government and enterprise digital transformation.',
    focusAreas: [
      'Agentic AI & Multi-Agent Systems',
      'LLM Workflows & Prompt Engineering',
      'AI for Government Documentation',
      'Enterprise AI Integration'
    ],
    skills: ['LangChain', 'LangGraph', 'AutoGen', 'CrewAI', 'RAG', 'Prompt Engineering', 'LLM Workflows'],
    futureImpact: 'AI will revolutionize government service delivery through autonomous document processing, intelligent citizen assistance, and predictive policy analysis.',
    stats: [
      { value: '85%', label: 'LLM Workflows' },
      { value: '90%', label: 'Prompt Engineering' },
      { value: '80%', label: 'Agentic AI' }
    ]
  },
  {
    id: 'blockchain',
    title: 'Crypto & Blockchain',
    tagline: 'Navigating digital finance with disciplined strategy',
    icon: Blocks,
    color: 'cyber-orange',
    gradient: 'from-cyber-orange to-yellow-500',
    description: 'Active portfolio management with thesis-driven approach, focusing on disciplined risk controls and DeFi research.',
    focusAreas: [
      'Portfolio Construction & Risk Management',
      'DeFi Protocols & Yield Strategies',
      'On-chain Analysis & Research',
      'Smart Contract Development'
    ],
    skills: ['DeFi', 'Web3', 'Smart Contracts', 'CEX/DEX Trading', 'On-chain Analysis', 'Portfolio Management'],
    futureImpact: 'Blockchain will transform government transparency through immutable records, smart contract-based procurement, and decentralized identity systems.',
    stats: [
      { value: '$68-100K', label: 'Trading Volume' },
      { value: '70%', label: 'BTC Allocation' },
      { value: '80%', label: 'DeFi Proficiency' }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    tagline: 'Protecting digital assets in an evolving threat landscape',
    icon: Shield,
    color: 'cyber-green',
    gradient: 'from-cyber-green to-emerald-500',
    description: 'Defensive security, OSINT, and threat intelligence for protecting digital assets and ensuring compliance.',
    focusAreas: [
      'Defensive Security & OPSEC',
      'OSINT & Threat Intelligence',
      'Web Application Security',
      'Incident Response & Forensics'
    ],
    skills: ['OSINT', 'Threat Intelligence', 'Digital Forensics', 'OPSEC', 'Incident Response', 'Web Security'],
    futureImpact: 'Robust cybersecurity will be essential as government systems become more digital, requiring proactive threat hunting and zero-trust architectures.',
    stats: [
      { value: '75%', label: 'Security Fundamentals' },
      { value: '70%', label: 'OSINT' },
      { value: '80%', label: 'Risk Assessment' }
    ]
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

export default function InterestsPage() {
  return (
    <PageLayout
      title="Interests"
      subtitle="Deep diving into the technologies shaping our future - AI, Blockchain, and Cybersecurity."
    >
      <div className="container">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-lg text-muted-foreground">
            As a cross-functional professional, I explore the intersection of emerging technologies
            and their practical applications in government, enterprise, and personal domains.
            These three areas represent where I invest my continuous learning and professional development.
          </p>
        </motion.div>

        {/* Interests Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-20"
        >
          {interests.map((interest, index) => {
            const Icon = interest.icon
            const isEven = index % 2 === 0

            return (
              <motion.section
                key={interest.id}
                variants={itemVariants}
                className="relative"
              >
                {/* Background Glow */}
                <div
                  className={`absolute ${isEven ? '-left-32' : '-right-32'} top-1/2 -translate-y-1/2 w-96 h-96 bg-${interest.color}/10 rounded-full blur-[128px]`}
                />

                <div className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven && 'lg:grid-flow-col-dense'}`}>
                  {/* Content */}
                  <div className={`relative ${!isEven && 'lg:col-start-2'}`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-3 rounded-xl bg-${interest.color}/10`}>
                        <Icon className={`h-8 w-8 text-${interest.color}`} />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold">{interest.title}</h2>
                        <p className={`text-${interest.color} text-sm font-medium`}>{interest.tagline}</p>
                      </div>
                    </div>

                    <p className="text-lg text-muted-foreground mb-8">
                      {interest.description}
                    </p>

                    {/* Focus Areas */}
                    <div className="mb-8">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-cyber-cyan" />
                        Focus Areas
                      </h3>
                      <ul className="grid sm:grid-cols-2 gap-3">
                        {interest.focusAreas.map((area, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <ArrowRight className={`h-4 w-4 text-${interest.color} mt-0.5 flex-shrink-0`} />
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {interest.skills.map((skill, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 rounded-full bg-${interest.color}/10 text-${interest.color} text-sm`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats Card */}
                  <div className={`relative ${!isEven && 'lg:col-start-1'}`}>
                    <div className="glass rounded-2xl p-8">
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-8">
                        {interest.stats.map((stat, i) => (
                          <div key={i} className="text-center">
                            <div className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${interest.gradient} bg-clip-text text-transparent`}>
                              {stat.value}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Future Impact */}
                      <div className={`p-4 rounded-xl bg-${interest.color}/5 border border-${interest.color}/10`}>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Future Impact
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {interest.futureImpact}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )
          })}
        </motion.div>

        {/* Intersection Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <div className="glass rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              The <span className="gradient-text">Convergence</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              The real power lies in the intersection of these technologies. AI-powered security systems,
              blockchain-based AI governance, and secure decentralized applications represent the future
              I&apos;m building towards.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Brain className="h-6 w-6 text-cyber-cyan" />
                  <span className="text-xl">+</span>
                  <Shield className="h-6 w-6 text-cyber-green" />
                </div>
                <h3 className="font-bold mb-2">AI + Security</h3>
                <p className="text-sm text-muted-foreground">
                  Intelligent threat detection and automated incident response
                </p>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Blocks className="h-6 w-6 text-cyber-orange" />
                  <span className="text-xl">+</span>
                  <Brain className="h-6 w-6 text-cyber-cyan" />
                </div>
                <h3 className="font-bold mb-2">Blockchain + AI</h3>
                <p className="text-sm text-muted-foreground">
                  Decentralized AI governance and transparent decision-making
                </p>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Shield className="h-6 w-6 text-cyber-green" />
                  <span className="text-xl">+</span>
                  <Blocks className="h-6 w-6 text-cyber-orange" />
                </div>
                <h3 className="font-bold mb-2">Security + Blockchain</h3>
                <p className="text-sm text-muted-foreground">
                  Immutable audit trails and cryptographic protection
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="gradient" asChild>
                <Link href="/projects">
                  See My Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/certifications">View Credentials</Link>
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </PageLayout>
  )
}

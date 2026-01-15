'use client'

import { motion } from 'framer-motion'
import { Target, Shield, Code, TrendingUp, Cpu, Lock, Database, Wallet } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const SKILL_CATEGORIES = [
  {
    icon: Cpu,
    title: 'AI & Machine Learning',
    color: 'text-cyber-cyan',
    bgColor: 'bg-cyber-cyan/10 dark:bg-cyber-cyan/20',
    borderColor: 'hover:border-cyber-cyan/50',
    skills: [
      'Python, TensorFlow, PyTorch',
      'LangChain, RAG Systems',
      'NLP & Computer Vision',
      'AI Agents & Automation',
    ],
  },
  {
    icon: Wallet,
    title: 'Blockchain & Crypto',
    color: 'text-cyber-orange',
    bgColor: 'bg-cyber-orange/10 dark:bg-cyber-orange/20',
    borderColor: 'hover:border-cyber-orange/50',
    skills: [
      'Solidity, Web3.js, Ethers',
      'DeFi & Smart Contracts',
      'Crypto Trading (CEX/DEX)',
      'Portfolio Management',
    ],
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    color: 'text-cyber-green',
    bgColor: 'bg-cyber-green/10 dark:bg-cyber-green/20',
    borderColor: 'hover:border-cyber-green/50',
    skills: [
      'Risk Assessment & Mitigation',
      'Penetration Testing',
      'Security Compliance',
      'Incident Response',
    ],
  },
  {
    icon: Database,
    title: 'Full-Stack Development',
    color: 'text-cyber-purple',
    bgColor: 'bg-cyber-purple/10 dark:bg-cyber-purple/20',
    borderColor: 'hover:border-cyber-purple/50',
    skills: [
      'React, Next.js, TypeScript',
      'Node.js, PostgreSQL, Prisma',
      'Cloud (AWS, GCP, Vercel)',
      'DevOps & CI/CD',
    ],
  },
]

// Unsplash background for skills section
const skillsBgImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80'

export function SkillsSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={skillsBgImage}
          alt="Skills Background"
          fill
          className="object-cover opacity-5 dark:opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      {/* Hex Pattern Overlay */}
      <div className="absolute inset-0 hex-pattern opacity-50" />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-primary uppercase tracking-wider mb-4">
            <Cpu className="h-4 w-4" />
            Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Skills & <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Specialized in cutting-edge technologies spanning AI, Blockchain, and Cybersecurity
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {SKILL_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group p-6 rounded-2xl border border-border bg-card/50 dark:bg-card/30 backdrop-blur-sm ${category.borderColor} transition-all duration-300 hover:shadow-lg hover:shadow-primary/5`}
            >
              <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <category.icon className={`h-6 w-6 ${category.color}`} />
              </div>
              <h3 className={`font-semibold mb-3 ${category.color}`}>{category.title}</h3>
              <ul className="space-y-2">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${category.bgColor} mt-2 shrink-0`} />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="outline" asChild className="group">
            <Link href="/about#skills">
              View All Skills
              <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

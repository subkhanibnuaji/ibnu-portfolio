'use client'

import { motion } from 'framer-motion'
import { Shield, Cpu, Database, Wallet, Bot, Brain, Lock, Code2, Server, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const SKILL_CATEGORIES = [
  {
    icon: Bot,
    title: 'AI & Machine Learning',
    color: 'text-cyber-cyan',
    bgColor: 'bg-cyber-cyan/10',
    borderColor: 'border-cyber-cyan/20 hover:border-cyber-cyan/50',
    glowColor: 'shadow-cyber-cyan/20',
    skills: [
      'Python, TensorFlow, PyTorch',
      'LangChain, RAG Systems',
      'NLP & Computer Vision',
      'AI Agents & Automation',
    ],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80',
  },
  {
    icon: Wallet,
    title: 'Blockchain & Crypto',
    color: 'text-cyber-orange',
    bgColor: 'bg-cyber-orange/10',
    borderColor: 'border-cyber-orange/20 hover:border-cyber-orange/50',
    glowColor: 'shadow-cyber-orange/20',
    skills: [
      'Solidity, Web3.js, Ethers',
      'DeFi & Smart Contracts',
      'Crypto Trading (CEX/DEX)',
      'Portfolio Management',
    ],
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&q=80',
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    color: 'text-cyber-green',
    bgColor: 'bg-cyber-green/10',
    borderColor: 'border-cyber-green/20 hover:border-cyber-green/50',
    glowColor: 'shadow-cyber-green/20',
    skills: [
      'Risk Assessment & Mitigation',
      'Penetration Testing',
      'Security Compliance',
      'Incident Response',
    ],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80',
  },
  {
    icon: Code2,
    title: 'Full-Stack Development',
    color: 'text-cyber-purple',
    bgColor: 'bg-cyber-purple/10',
    borderColor: 'border-cyber-purple/20 hover:border-cyber-purple/50',
    glowColor: 'shadow-cyber-purple/20',
    skills: [
      'React, Next.js, TypeScript',
      'Node.js, PostgreSQL, Prisma',
      'Cloud (AWS, GCP, Vercel)',
      'DevOps & CI/CD',
    ],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80',
  },
]

// Background with circuit/tech pattern
const skillsBgImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80'

export function SkillsSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-[#0a0a0f]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={skillsBgImage}
          alt="Skills Background"
          fill
          className="object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0a0a0f]/95 to-[#0a0a0f]" />
      </div>

      {/* Scanlines */}
      <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Animated orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyber-cyan/10 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyber-purple/10 rounded-full blur-[100px] animate-pulse-glow" />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0a0a0f]/80 backdrop-blur-sm border border-cyber-cyan/30 text-sm font-mono mb-4">
            <Brain className="h-4 w-4 text-cyber-cyan" />
            <span className="text-cyber-green">$</span>
            <span className="text-cyber-cyan">cat</span>
            <span className="text-foreground">skills.json</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
            <span className="text-muted-foreground">&lt;</span>
            <span className="gradient-text">Skills</span>
            <span className="text-muted-foreground">/&gt;</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm">
            // Specialized in cutting-edge technologies spanning AI, Blockchain, and Cybersecurity
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {SKILL_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl border ${category.borderColor} bg-[#0a0a0f]/60 backdrop-blur-sm transition-all duration-500 hover:shadow-lg ${category.glowColor}`}
            >
              {/* Background image */}
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="relative p-6 md:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl ${category.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform border border-${category.color.replace('text-', '')}/30`}>
                    <category.icon className={`h-7 w-7 ${category.color}`} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${category.color} font-mono`}>{category.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Zap className={`h-3 w-3 ${category.color}`} />
                      <span className="text-xs text-muted-foreground font-mono">ACTIVE</span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.li
                      key={skill}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * skillIndex }}
                      className="text-sm text-muted-foreground flex items-center gap-3 font-mono"
                    >
                      <span className={`w-2 h-2 rounded-full ${category.bgColor} ${category.color.replace('text-', 'border-')} border shrink-0`} />
                      <span className="group-hover:text-foreground transition-colors">{skill}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Corner accents */}
                <div className={`absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 ${category.borderColor.split(' ')[0]} opacity-30`} />
                <div className={`absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 ${category.borderColor.split(' ')[0]} opacity-30`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button variant="outline" className="border-cyber-cyan/50 hover:bg-cyber-cyan/10 font-mono" asChild>
            <Link href="/about#skills">
              <Database className="mr-2 h-4 w-4 text-cyber-cyan" />
              ./view_all_skills
              <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

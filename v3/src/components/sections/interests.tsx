'use client'

import { motion } from 'framer-motion'
import { Brain, Bitcoin, Shield, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const INTERESTS = [
  {
    id: 'ai',
    icon: Brain,
    title: 'Artificial Intelligence',
    description:
      'From LLMs to autonomous agents, AI is becoming the most transformative technology in human history. I research agentic AI systems for government documentation and build practical solutions.',
    tags: ['LangChain', 'AutoGen', 'LLMs', 'RAG'],
    color: 'cyber-cyan',
    gradient: 'from-cyber-cyan to-blue-500',
    why: 'AI will augment human capabilities exponentially, automating complex tasks and enabling breakthroughs in science, medicine, and governance.',
  },
  {
    id: 'crypto',
    icon: Bitcoin,
    title: 'Blockchain & Crypto',
    description:
      'Decentralized systems are rewriting the rules of finance, ownership, and trust. Active trader with $68k-$100k cumulative futures volume, disciplined risk management.',
    tags: ['DeFi', 'Web3', 'Trading', 'Smart Contracts'],
    color: 'cyber-orange',
    gradient: 'from-cyber-orange to-yellow-500',
    why: 'Blockchain enables trustless systems, programmable money, and true digital ownership. It will transform finance and governance.',
  },
  {
    id: 'cyber',
    icon: Shield,
    title: 'Cybersecurity',
    description:
      'As our world becomes digital, protecting systems and data is critical. I study defensive security, OSINT, threat intelligence, and the dark web.',
    tags: ['OSINT', 'Threat Intel', 'Forensics', 'OPSEC'],
    color: 'cyber-green',
    gradient: 'from-cyber-green to-emerald-500',
    why: 'Cyber threats evolve faster than defenses. Security professionals will be the guardians of our digital civilization.',
  },
]

export function InterestsSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Core Focus Areas
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Three Pillars of the Future
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These technologies will fundamentally reshape how we live, work, and interact.
            I&apos;m deeply invested in understanding and building with them.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {INTERESTS.map((interest, index) => (
            <motion.div
              key={interest.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div
                className={cn(
                  'h-full p-6 rounded-2xl border border-border',
                  'bg-card/50 backdrop-blur-sm',
                  'transition-all duration-300',
                  'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10',
                  'hover:-translate-y-1'
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
                    `bg-gradient-to-br ${interest.gradient}`
                  )}
                >
                  <interest.icon className="h-7 w-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-2">{interest.title}</h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm mb-4">
                  {interest.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {interest.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Why Section */}
                <div className="pt-4 border-t border-border">
                  <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    Why It Matters
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {interest.why}
                  </p>
                </div>

                {/* Link */}
                <Link
                  href={`/interests#${interest.id}`}
                  className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-primary hover:gap-3 transition-all"
                >
                  Deep Dive
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

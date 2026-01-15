'use client'

import { motion } from 'framer-motion'
import { Brain, Bitcoin, Shield, ArrowRight, Cpu, Wallet, Lock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const INTERESTS = [
  {
    id: 'ai',
    icon: Cpu,
    title: 'Artificial Intelligence',
    description:
      'From LLMs to autonomous agents, AI is becoming the most transformative technology in human history. I research agentic AI systems for government documentation and build practical solutions.',
    tags: ['LangChain', 'AutoGen', 'LLMs', 'RAG'],
    color: 'cyber-cyan',
    textColor: 'text-cyber-cyan',
    bgColor: 'bg-cyber-cyan/10 dark:bg-cyber-cyan/20',
    gradient: 'from-cyber-cyan to-blue-500',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
    why: 'AI will augment human capabilities exponentially, automating complex tasks and enabling breakthroughs in science, medicine, and governance.',
  },
  {
    id: 'crypto',
    icon: Wallet,
    title: 'Blockchain & Crypto',
    description:
      'Decentralized systems are rewriting the rules of finance, ownership, and trust. Active trader with $68k-$100k cumulative futures volume, disciplined risk management.',
    tags: ['DeFi', 'Web3', 'Trading', 'Smart Contracts'],
    color: 'cyber-orange',
    textColor: 'text-cyber-orange',
    bgColor: 'bg-cyber-orange/10 dark:bg-cyber-orange/20',
    gradient: 'from-cyber-orange to-yellow-500',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80',
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
    textColor: 'text-cyber-green',
    bgColor: 'bg-cyber-green/10 dark:bg-cyber-green/20',
    gradient: 'from-cyber-green to-emerald-500',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
    why: 'Cyber threats evolve faster than defenses. Security professionals will be the guardians of our digital civilization.',
  },
]

export function InterestsSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20 dark:opacity-40" />

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
            <Brain className="h-4 w-4" />
            Core Focus Areas
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Three Pillars of the <span className="gradient-text">Future</span>
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
                  'h-full rounded-2xl border border-border overflow-hidden',
                  'bg-card/50 dark:bg-card/30 backdrop-blur-sm',
                  'transition-all duration-300',
                  'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10',
                  'hover:-translate-y-1'
                )}
              >
                {/* Image Header */}
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={interest.image}
                    alt={interest.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={cn(
                    'absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent'
                  )} />
                  <div className={cn(
                    'absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center',
                    interest.bgColor
                  )}>
                    <interest.icon className={cn('h-6 w-6', interest.textColor)} />
                  </div>
                </div>

                <div className="p-6">
                  {/* Title */}
                  <h3 className={cn('text-xl font-bold mb-2', interest.textColor)}>
                    {interest.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4">
                    {interest.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {interest.tags.map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          'px-2.5 py-1 text-xs rounded-full',
                          interest.bgColor,
                          interest.textColor
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Why Section */}
                  <div className="pt-4 border-t border-border dark:border-border/50">
                    <h4 className={cn('text-xs font-semibold uppercase tracking-wider mb-2', interest.textColor)}>
                      Why It Matters
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {interest.why}
                    </p>
                  </div>

                  {/* Link */}
                  <Link
                    href={`/interests#${interest.id}`}
                    className={cn(
                      'inline-flex items-center gap-2 mt-4 text-sm font-medium hover:gap-3 transition-all',
                      interest.textColor
                    )}
                  >
                    Deep Dive
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

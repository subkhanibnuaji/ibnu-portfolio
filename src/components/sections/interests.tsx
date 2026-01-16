'use client'

import { motion } from 'framer-motion'
import { Brain, ArrowRight, Bot, Wallet, Shield, Zap, Target, Code2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const INTERESTS = [
  {
    id: 'ai',
    icon: Bot,
    title: 'Artificial Intelligence',
    description:
      'From LLMs to autonomous agents, AI is becoming the most transformative technology in human history. I research agentic AI systems for government documentation and build practical solutions.',
    tags: ['LangChain', 'AutoGen', 'LLMs', 'RAG'],
    color: 'cyber-cyan',
    textColor: 'text-cyber-cyan',
    bgColor: 'bg-cyber-cyan/10',
    borderColor: 'border-cyber-cyan/30 hover:border-cyber-cyan/60',
    glowColor: 'hover:shadow-cyber-cyan/20',
    gradient: 'from-cyber-cyan to-blue-500',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
    why: 'AI will augment human capabilities exponentially, automating complex tasks and enabling breakthroughs in science, medicine, and governance.',
    stats: { value: 'GPT-4', label: 'Level' },
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
    bgColor: 'bg-cyber-orange/10',
    borderColor: 'border-cyber-orange/30 hover:border-cyber-orange/60',
    glowColor: 'hover:shadow-cyber-orange/20',
    gradient: 'from-cyber-orange to-yellow-500',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80',
    why: 'Blockchain enables trustless systems, programmable money, and true digital ownership. It will transform finance and governance.',
    stats: { value: '$68-100K', label: 'Volume' },
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
    bgColor: 'bg-cyber-green/10',
    borderColor: 'border-cyber-green/30 hover:border-cyber-green/60',
    glowColor: 'hover:shadow-cyber-green/20',
    gradient: 'from-cyber-green to-emerald-500',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
    why: 'Cyber threats evolve faster than defenses. Security professionals will be the guardians of our digital civilization.',
    stats: { value: 'ACTIVE', label: 'Status' },
  },
]

export function InterestsSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-[#0a0a0f]">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />

      {/* Animated orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-[150px] animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-orange/10 rounded-full blur-[150px] animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyber-green/5 rounded-full blur-[100px]" />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0a0a0f]/80 backdrop-blur-sm border border-cyber-green/30 text-sm font-mono mb-4">
            <Target className="h-4 w-4 text-cyber-green" />
            <span className="text-cyber-green">$</span>
            <span className="text-cyber-cyan">focus</span>
            <span className="text-foreground">--areas</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
            <span className="text-muted-foreground">Three Pillars of the</span>{' '}
            <span className="gradient-text text-glow">Future</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm">
            // Technologies that will fundamentally reshape how we live, work, and interact
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
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative"
            >
              <div
                className={cn(
                  'h-full rounded-2xl border overflow-hidden',
                  'bg-[#0a0a0f]/60 backdrop-blur-sm',
                  'transition-all duration-500',
                  interest.borderColor,
                  'hover:shadow-lg',
                  interest.glowColor,
                  'hover:-translate-y-2'
                )}
              >
                {/* Image Header with cyber overlay */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={interest.image}
                    alt={interest.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                  />
                  {/* Cyber overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
                  <div className={cn(
                    'absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity',
                    `bg-gradient-to-br ${interest.gradient}`
                  )} />

                  {/* Icon badge */}
                  <div className={cn(
                    'absolute top-4 left-4 w-14 h-14 rounded-xl flex items-center justify-center',
                    interest.bgColor,
                    'border',
                    interest.borderColor.split(' ')[0],
                    'group-hover:scale-110 transition-transform'
                  )}>
                    <interest.icon className={cn('h-7 w-7', interest.textColor)} />
                  </div>

                  {/* Stats badge */}
                  <div className="absolute top-4 right-4">
                    <div className={cn(
                      'px-3 py-1.5 rounded-lg backdrop-blur-sm border',
                      interest.bgColor,
                      interest.borderColor.split(' ')[0]
                    )}>
                      <div className={cn('text-sm font-mono font-bold', interest.textColor)}>
                        {interest.stats.value}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase">
                        {interest.stats.label}
                      </div>
                    </div>
                  </div>

                  {/* Corner accents */}
                  <div className={cn('absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 opacity-50', interest.borderColor.split(' ')[0])} />
                  <div className={cn('absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 opacity-50', interest.borderColor.split(' ')[0])} />
                </div>

                <div className="p-6">
                  {/* Title */}
                  <h3 className={cn('text-xl font-bold mb-3 font-mono', interest.textColor)}>
                    {interest.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {interest.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {interest.tags.map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          'px-2.5 py-1 text-xs rounded-lg font-mono border',
                          interest.bgColor,
                          interest.textColor,
                          interest.borderColor.split(' ')[0]
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Why Section */}
                  <div className={cn('pt-4 border-t', interest.borderColor.split(' ')[0])}>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className={cn('h-3 w-3', interest.textColor)} />
                      <h4 className={cn('text-xs font-semibold uppercase tracking-wider font-mono', interest.textColor)}>
                        WHY_IT_MATTERS
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {interest.why}
                    </p>
                  </div>

                  {/* Link */}
                  <Link
                    href={`/interests#${interest.id}`}
                    className={cn(
                      'inline-flex items-center gap-2 mt-4 text-sm font-mono font-medium',
                      'hover:gap-3 transition-all',
                      interest.textColor
                    )}
                  >
                    ./deep_dive
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

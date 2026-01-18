'use client'

import { motion } from 'framer-motion'
import { Brain, Shield, Blocks, Sparkles, Zap, Network, Lock, Cpu } from 'lucide-react'
import { cn } from '@/lib/utils'

const COMBINATIONS = [
  {
    id: 'ai-security',
    icons: [Brain, Shield],
    colors: ['text-cyber-cyan', 'text-cyber-green'],
    title: 'AI + Security',
    description: 'Intelligent threat detection and automated incident response',
    benefits: ['Real-time threat analysis', 'Predictive vulnerability detection', 'Automated security audits'],
    gradient: 'from-cyber-cyan/20 via-transparent to-cyber-green/20',
    borderGradient: 'border-cyber-cyan/30 hover:border-cyber-green/50',
    shadowStyle: { boxShadow: '0 0 30px rgba(0,212,255,0.15), 0 0 30px rgba(0,255,136,0.15)' },
  },
  {
    id: 'blockchain-ai',
    icons: [Blocks, Brain],
    colors: ['text-cyber-orange', 'text-cyber-cyan'],
    title: 'Blockchain + AI',
    description: 'Decentralized AI governance and transparent decision-making',
    benefits: ['Verifiable AI outputs', 'Trustless model training', 'Token-incentivized learning'],
    gradient: 'from-cyber-orange/20 via-transparent to-cyber-cyan/20',
    borderGradient: 'border-cyber-orange/30 hover:border-cyber-cyan/50',
    shadowStyle: { boxShadow: '0 0 30px rgba(247,147,26,0.15), 0 0 30px rgba(0,212,255,0.15)' },
  },
  {
    id: 'security-blockchain',
    icons: [Shield, Blocks],
    colors: ['text-cyber-green', 'text-cyber-orange'],
    title: 'Security + Blockchain',
    description: 'Immutable audit trails and cryptographic protection',
    benefits: ['Zero-knowledge proofs', 'Immutable security logs', 'Decentralized identity'],
    gradient: 'from-cyber-green/20 via-transparent to-cyber-orange/20',
    borderGradient: 'border-cyber-green/30 hover:border-cyber-orange/50',
    shadowStyle: { boxShadow: '0 0 30px rgba(0,255,136,0.15), 0 0 30px rgba(247,147,26,0.15)' },
  },
]

const ULTIMATE_BENEFITS = [
  { icon: Lock, text: 'Secure AI on immutable infrastructure' },
  { icon: Network, text: 'Decentralized threat intelligence networks' },
  { icon: Cpu, text: 'Self-healing autonomous security systems' },
]

export function ConvergenceSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-b from-[#0a0a0f] via-[#080810] to-[#0a0a0f]">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-r from-cyber-cyan/10 to-cyber-green/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-l from-cyber-orange/10 to-cyber-cyan/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-purple/5 rounded-full blur-3xl" />

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
            <span className="text-cyber-cyan">synergy</span>
            <span className="text-foreground">--maximize</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
            <span className="text-muted-foreground">The Power of</span>{' '}
            <span className="gradient-text text-glow">Convergence</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm">
            {'// When technologies merge, exponential possibilities emerge'}
          </p>
        </motion.div>

        {/* 1+1 Combinations Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {COMBINATIONS.map((combo, index) => {
            const IconA = combo.icons[0]
            const IconB = combo.icons[1]
            return (
              <motion.div
                key={combo.id}
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
                    combo.borderGradient,
                    'hover:-translate-y-2 hover:shadow-lg'
                  )}
                  style={{
                    '--shadow-hover': combo.shadowStyle.boxShadow,
                  } as React.CSSProperties}
                >
                  {/* Icons */}
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className={cn(
                      'w-14 h-14 rounded-xl flex items-center justify-center',
                      'bg-gradient-to-br',
                      combo.gradient,
                      'border border-white/10'
                    )}>
                      <IconA className={cn('h-7 w-7', combo.colors[0])} />
                    </div>
                    <span className="text-2xl font-bold text-muted-foreground">+</span>
                    <div className={cn(
                      'w-14 h-14 rounded-xl flex items-center justify-center',
                      'bg-gradient-to-br',
                      combo.gradient,
                      'border border-white/10'
                    )}>
                      <IconB className={cn('h-7 w-7', combo.colors[1])} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-center mb-3 font-mono bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    {combo.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm text-center mb-6">
                    {combo.description}
                  </p>

                  {/* Benefits List */}
                  <div className="space-y-2">
                    {combo.benefits.map((benefit, i) => (
                      <div
                        key={i}
                        className={cn(
                          'flex items-center gap-2 text-sm px-3 py-2 rounded-lg',
                          'bg-white/5 border border-white/5'
                        )}
                      >
                        <Zap className={cn('h-3 w-3 flex-shrink-0', combo.colors[0])} />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Ultimate 1+1+1 Section */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative"
        >
          {/* Glowing border effect */}
          <div className="absolute -inset-px bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-orange rounded-3xl opacity-50 blur-sm" />

          <div className="relative rounded-3xl border border-white/10 bg-[#0a0a0f]/90 backdrop-blur-xl overflow-hidden">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 via-cyber-purple/5 to-cyber-orange/5" />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyber-cyan/50 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyber-orange/50 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyber-green/50 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyber-purple/50 rounded-br-3xl" />

            <div className="relative p-8 md:p-12">
              {/* Combined Icons - The Ultimate Convergence */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(0, 212, 255, 0.3)',
                      '0 0 40px rgba(0, 212, 255, 0.5)',
                      '0 0 20px rgba(0, 212, 255, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center"
                >
                  <Brain className="h-8 w-8 md:h-10 md:w-10 text-cyber-cyan" />
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
                  <Shield className="h-8 w-8 md:h-10 md:w-10 text-cyber-green" />
                </motion.div>

                <span className="text-3xl font-bold gradient-text">+</span>

                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(247, 147, 26, 0.3)',
                      '0 0 40px rgba(247, 147, 26, 0.5)',
                      '0 0 20px rgba(247, 147, 26, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-cyber-orange/10 border border-cyber-orange/30 flex items-center justify-center"
                >
                  <Blocks className="h-8 w-8 md:h-10 md:w-10 text-cyber-orange" />
                </motion.div>
              </div>

              {/* Title */}
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-4xl font-bold mb-4 font-mono">
                  <span className="text-cyber-cyan">AI</span>
                  <span className="text-muted-foreground mx-2">+</span>
                  <span className="text-cyber-green">Security</span>
                  <span className="text-muted-foreground mx-2">+</span>
                  <span className="text-cyber-orange">Blockchain</span>
                </h3>
                <p className="text-xl md:text-2xl font-bold gradient-text text-glow">
                  The Complete Stack for the Future
                </p>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10 text-lg leading-relaxed">
                When all three pillars unite, you get an unprecedented technology stack:
                <span className="text-cyber-cyan"> intelligent systems</span> that can
                <span className="text-cyber-green"> defend themselves</span> while operating on
                <span className="text-cyber-orange"> trustless, decentralized infrastructure</span>.
                This is the foundation of next-generation applications.
              </p>

              {/* Ultimate Benefits Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {ULTIMATE_BENEFITS.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="group"
                  >
                    <div className="h-full p-6 rounded-xl bg-white/5 border border-white/10 hover:border-cyber-purple/30 transition-all duration-300 hover:bg-white/[0.07]">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-cyan/20 via-cyber-green/20 to-cyber-orange/20 flex items-center justify-center border border-white/10">
                          <benefit.icon className="h-6 w-6 text-cyber-purple" />
                        </div>
                        <p className="text-sm font-medium text-foreground/90">
                          {benefit.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Tagline */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-10 text-center"
              >
                <span className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-cyber-cyan/10 via-cyber-purple/10 to-cyber-orange/10 border border-white/10">
                  <Sparkles className="h-5 w-5 text-cyber-purple" />
                  <span className="font-mono text-sm">
                    <span className="text-muted-foreground">Building the</span>
                    {' '}
                    <span className="gradient-text font-bold">future-proof</span>
                    {' '}
                    <span className="text-muted-foreground">technology stack</span>
                  </span>
                  <Sparkles className="h-5 w-5 text-cyber-purple" />
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

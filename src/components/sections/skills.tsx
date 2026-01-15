'use client'

import { motion } from 'framer-motion'
import { Target, Shield, Code, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const SKILL_CATEGORIES = [
  {
    icon: Target,
    title: 'Strategic Management',
    skills: [
      'Strategic Planning & Analysis',
      'Change Management',
      'Project Execution',
      'Industry Analysis',
    ],
  },
  {
    icon: Shield,
    title: 'Risk Management',
    skills: [
      'Risk Assessment & Mitigation',
      'Compliance Management',
      'Business Continuity',
      'Incident Management',
    ],
  },
  {
    icon: Code,
    title: 'Technical Skills',
    skills: [
      'Python, JavaScript, SQL',
      'AI/ML, LangChain, RAG',
      'Blockchain, Web3, Solidity',
      'Cloud (AWS), DevOps',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Financial Skills',
    skills: [
      'Portfolio Management',
      'Crypto Trading (CEX/DEX)',
      'Financial Analysis',
      'Risk-adjusted Returns',
    ],
  },
]

export function SkillsSection() {
  return (
    <section className="py-24 px-4">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Skills & Expertise
          </h2>
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
              className="p-6 rounded-2xl border border-border bg-card/50 hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <category.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-3">{category.title}</h3>
              <ul className="space-y-2">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="outline" asChild>
            <Link href="/about#skills">View All Skills</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

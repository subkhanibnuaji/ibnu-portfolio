'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Bot,
  Brain,
  Cpu,
  Network,
  Zap,
  Code,
  GitBranch,
  MessageSquare,
  Search,
  Workflow,
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
  Layers,
  Sparkles,
  ExternalLink,
  BookOpen,
  Users,
  TrendingUp,
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

const AGENT_TYPES = [
  {
    name: 'ReAct Agents',
    description: 'Reasoning + Acting: Interleave thought and action for complex tasks',
    capabilities: ['Chain-of-thought reasoning', 'Tool usage', 'Self-correction'],
    color: 'text-cyber-cyan',
    bgColor: 'bg-cyber-cyan/10',
  },
  {
    name: 'Plan-and-Execute',
    description: 'Create high-level plans then execute step-by-step',
    capabilities: ['Task decomposition', 'Sequential execution', 'Plan revision'],
    color: 'text-cyber-purple',
    bgColor: 'bg-cyber-purple/10',
  },
  {
    name: 'Multi-Agent Systems',
    description: 'Multiple specialized agents collaborating on complex problems',
    capabilities: ['Role specialization', 'Agent communication', 'Consensus building'],
    color: 'text-cyber-green',
    bgColor: 'bg-cyber-green/10',
  },
  {
    name: 'Autonomous Agents',
    description: 'Self-directed agents with long-term memory and goal persistence',
    capabilities: ['Memory management', 'Goal tracking', 'Self-improvement'],
    color: 'text-cyber-orange',
    bgColor: 'bg-cyber-orange/10',
  },
]

const FRAMEWORKS = [
  { name: 'LangChain', description: 'Composable agent framework', stars: '75K+' },
  { name: 'LangGraph', description: 'Stateful multi-agent workflows', stars: '5K+' },
  { name: 'AutoGPT', description: 'Autonomous GPT-4 experiments', stars: '160K+' },
  { name: 'CrewAI', description: 'Multi-agent orchestration', stars: '15K+' },
  { name: 'MetaGPT', description: 'Multi-agent meta programming', stars: '40K+' },
  { name: 'OpenAI Swarm', description: 'Lightweight multi-agent framework', stars: '10K+' },
]

const KEY_CONCEPTS = [
  {
    title: 'Tool Use & Function Calling',
    description: 'Agents interact with external systems through well-defined tool interfaces',
    icon: Workflow,
  },
  {
    title: 'Memory Systems',
    description: 'Short-term (conversation), long-term (vector DB), and episodic memory',
    icon: Brain,
  },
  {
    title: 'Planning & Reasoning',
    description: 'Chain-of-thought, tree-of-thought, and graph-based reasoning',
    icon: GitBranch,
  },
  {
    title: 'Agent Communication',
    description: 'Protocols for multi-agent coordination and task delegation',
    icon: MessageSquare,
  },
]

const APPLICATIONS = [
  {
    name: 'Code Generation',
    description: 'AI agents that write, test, and debug code autonomously',
    examples: ['Devin AI', 'GitHub Copilot Workspace', 'Cursor'],
  },
  {
    name: 'Research Assistants',
    description: 'Agents that search, synthesize, and analyze information',
    examples: ['Perplexity', 'Elicit', 'Consensus'],
  },
  {
    name: 'Customer Service',
    description: 'Automated support with context awareness and tool access',
    examples: ['Intercom Fin', 'Sierra', 'Decagon'],
  },
  {
    name: 'Data Analysis',
    description: 'Agents that query databases and generate insights',
    examples: ['Julius AI', 'Code Interpreter', 'Hex Magic'],
  },
]

const CHALLENGES = [
  { challenge: 'Hallucination & Reliability', status: 'Active Research' },
  { challenge: 'Long-horizon Planning', status: 'Partial Solutions' },
  { challenge: 'Tool Selection Accuracy', status: 'Improving' },
  { challenge: 'Cost & Latency', status: 'Engineering Focus' },
  { challenge: 'Security & Sandboxing', status: 'Critical Priority' },
  { challenge: 'Evaluation & Benchmarks', status: 'Emerging Standards' },
]

export default function AIAgentsResearchPage() {
  return (
    <PageLayout
      title="AI Agents Research"
      subtitle="Exploring autonomous AI systems and multi-agent architectures"
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
          <div className="p-8 rounded-2xl bg-gradient-to-br from-cyber-cyan/10 via-transparent to-cyber-purple/10 border border-white/10">
            <p className="text-lg leading-relaxed text-foreground/90 mb-6">
              <strong className="gradient-text">AI Agents represent the next evolution of AI systems</strong>—moving from single-turn interactions to autonomous entities that can plan, reason, use tools, and accomplish complex goals over extended periods.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-white/5 text-center">
                <div className="text-xl font-bold text-cyber-cyan">$5B+</div>
                <div className="text-xs text-muted-foreground">Agent Startup Funding</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 text-center">
                <div className="text-xl font-bold text-cyber-purple">300K+</div>
                <div className="text-xs text-muted-foreground">GitHub Stars (Top 5)</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 text-center">
                <div className="text-xl font-bold text-cyber-green">2024</div>
                <div className="text-xs text-muted-foreground">Year of Agents</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 text-center">
                <div className="text-xl font-bold text-cyber-orange">75%</div>
                <div className="text-xs text-muted-foreground">Enterprise Interest</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Agent Types */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <Bot className="h-5 w-5 text-cyber-cyan" />
            <h2 className="text-xl font-bold">Agent Architectures</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {AGENT_TYPES.map((agent, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={cn(
                  'p-6 rounded-2xl border bg-white/5',
                  'border-white/10 hover:border-cyber-cyan/30 transition-colors'
                )}
              >
                <h3 className={cn('text-lg font-bold mb-2', agent.color)}>{agent.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>
                <div className="space-y-2">
                  {agent.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className={cn('h-4 w-4', agent.color)} />
                      <span className="text-foreground/80">{cap}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Key Concepts */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <Layers className="h-5 w-5 text-cyber-purple" />
            <h2 className="text-xl font-bold">Key Concepts</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {KEY_CONCEPTS.map((concept, idx) => {
              const Icon = concept.icon
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="p-5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyber-purple/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-cyber-purple" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{concept.title}</h3>
                    <p className="text-sm text-muted-foreground">{concept.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Frameworks */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <Code className="h-5 w-5 text-cyber-green" />
            <h2 className="text-xl font-bold">Popular Frameworks</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {FRAMEWORKS.map((fw, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyber-green/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-cyber-green">{fw.name}</h3>
                  <span className="text-xs text-muted-foreground">{fw.stars}</span>
                </div>
                <p className="text-sm text-muted-foreground">{fw.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Applications */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <Target className="h-5 w-5 text-cyber-orange" />
            <h2 className="text-xl font-bold">Real-World Applications</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {APPLICATIONS.map((app, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-5 rounded-xl bg-white/5 border border-white/10"
              >
                <h3 className="font-bold text-cyber-orange mb-2">{app.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{app.description}</p>
                <div className="flex flex-wrap gap-2">
                  {app.examples.map((ex, i) => (
                    <span key={i} className="px-2 py-1 rounded bg-cyber-orange/10 text-xs text-cyber-orange">
                      {ex}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Challenges */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-5 w-5 text-cyber-pink" />
            <h2 className="text-xl font-bold">Open Challenges</h2>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="grid md:grid-cols-2 gap-4">
              {CHALLENGES.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-foreground/90">{item.challenge}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-cyber-pink/10 text-cyber-pink">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
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

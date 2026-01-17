'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Bot, Sparkles, PenTool, Code2, Search, Lightbulb, Languages, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const AI_AGENTS = [
  {
    id: 'writer',
    name: 'Writer Agent',
    description: 'Craft compelling content, articles, social media captions, and more',
    icon: PenTool,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    specialty: 'Content Creation',
  },
  {
    id: 'coder',
    name: 'Coder Agent',
    description: 'Help with coding, debugging, code review, and technical explanations',
    icon: Code2,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    specialty: 'Programming',
  },
  {
    id: 'researcher',
    name: 'Research Agent',
    description: 'Analyze topics, summarize information, and provide in-depth insights',
    icon: Search,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    specialty: 'Analysis',
  },
  {
    id: 'creative',
    name: 'Creative Agent',
    description: 'Generate creative ideas, brainstorm concepts, and think outside the box',
    icon: Lightbulb,
    color: 'from-orange-500 to-yellow-500',
    bgColor: 'bg-orange-500/10',
    specialty: 'Ideation',
  },
  {
    id: 'translator',
    name: 'Translator Agent',
    description: 'Translate text between languages with cultural context awareness',
    icon: Languages,
    color: 'from-indigo-500 to-violet-500',
    bgColor: 'bg-indigo-500/10',
    specialty: 'Languages',
  },
  {
    id: 'assistant',
    name: 'General Assistant',
    description: 'Your all-purpose AI helper for any task or question',
    icon: Bot,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    specialty: 'General',
  },
]

export function AIAgentsSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background -z-10" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-10 right-20 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-10 left-20 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-primary text-sm font-medium mb-4">
            <Bot className="w-4 h-4" />
            Specialized AI Agents
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            AI Agents
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet our team of specialized AI agents, each designed for specific tasks.
            Powered by advanced LLMs with unique personas and capabilities.
          </p>
        </motion.div>

        {/* Agents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {AI_AGENTS.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/ai-agents?agent=${agent.id}`}>
                <div className="group relative h-full p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                  {/* Gradient Border on Hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                  {/* Icon with Animation */}
                  <div className="relative mb-4">
                    <div className={`w-14 h-14 rounded-xl ${agent.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <agent.icon className={`w-7 h-7`} style={{
                        background: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))`,
                      }} />
                      <agent.icon className={`w-7 h-7 absolute`} />
                    </div>

                    {/* Status Indicator */}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {agent.name}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${agent.bgColor}`}>
                      {agent.specialty}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {agent.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center text-sm text-primary font-medium">
                    <span>Chat with agent</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Features & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          {/* Features */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Powered by Llama 3.3 70B</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-primary" />
              <span>Real-time Streaming</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bot className="w-4 h-4 text-primary" />
              <span>6 Specialized Agents</span>
            </div>
          </div>

          <Button variant="gradient" size="lg" asChild>
            <Link href="/ai-agents">
              Explore AI Agents
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

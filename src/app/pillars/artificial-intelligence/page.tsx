'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Brain, Sparkles, Bot, MessageSquare, Code, Cpu, Zap, ArrowRight,
  Eye, Mic, FileText, Palette, Hand, Languages, CloudSun, Tag,
  User, Box, Smile, QrCode, Volume2, ScanText, Shield, Hash,
  Wand2, BookOpen, Wrench
} from 'lucide-react'
import { NewsFeed } from '@/components/pillars/news-feed'
import { AIToolsGrid } from '@/components/ai'

// LangChain-powered LLM Tools (from AI Tools page)
const LLM_TOOLS = [
  {
    slug: 'llm',
    name: 'LLM Chat',
    description: 'Interactive chat with AI powered by Groq LLMs.',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    model: 'Groq LLMs'
  },
  {
    slug: 'rag',
    name: 'RAG System',
    description: 'Upload documents and chat with context-aware AI.',
    icon: Tag,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-500',
    model: 'LangChain RAG'
  },
  {
    slug: 'agent',
    name: 'AI Agent',
    description: 'AI with tool-use capabilities for various tasks.',
    icon: Brain,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-500',
    model: 'Agent Tools'
  }
]

// Browser-based ML Tools
const BROWSER_TOOLS = [
  { slug: 'background-removal', name: 'Background Removal', icon: User, color: 'text-green-500', bgColor: 'bg-green-500/10' },
  { slug: 'pose-estimation', name: 'Pose Estimation', icon: User, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  { slug: 'object-detection', name: 'Object Detection', icon: Box, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  { slug: 'style-transfer', name: 'Style Transfer', icon: Palette, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  { slug: 'face-landmark', name: 'Face Landmark', icon: Smile, color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
  { slug: 'sentiment-analysis', name: 'Sentiment Analysis', icon: MessageSquare, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' },
  { slug: 'hand-gesture', name: 'Hand Gesture', icon: Hand, color: 'text-violet-500', bgColor: 'bg-violet-500/10' },
  { slug: 'qr-scanner', name: 'QR Scanner', icon: QrCode, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  { slug: 'text-to-speech', name: 'Text to Speech', icon: Volume2, color: 'text-sky-500', bgColor: 'bg-sky-500/10' },
  { slug: 'speech-to-text', name: 'Speech to Text', icon: Mic, color: 'text-red-500', bgColor: 'bg-red-500/10' },
  { slug: 'language-detector', name: 'Language Detector', icon: Languages, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  { slug: 'word-cloud', name: 'Word Cloud', icon: CloudSun, color: 'text-teal-500', bgColor: 'bg-teal-500/10' },
  { slug: 'text-summarizer', name: 'Text Summarizer', icon: ScanText, color: 'text-fuchsia-500', bgColor: 'bg-fuchsia-500/10' },
  { slug: 'color-extractor', name: 'Color Extractor', icon: Palette, color: 'text-rose-500', bgColor: 'bg-rose-500/10' },
]

const aiTrends = [
  { icon: Brain, title: 'Large Language Models', desc: 'GPT, Claude, Llama and beyond' },
  { icon: Eye, title: 'Computer Vision', desc: 'Image and video understanding' },
  { icon: Bot, title: 'Autonomous Agents', desc: 'AI that can take actions' },
  { icon: Cpu, title: 'Edge AI', desc: 'On-device machine learning' },
  { icon: Code, title: 'AI Coding Assistants', desc: 'AI-powered development' },
  { icon: FileText, title: 'Multimodal AI', desc: 'Text, image, audio fusion' },
]

const features = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Browser ML runs locally. LLM tools use secure API calls.'
  },
  {
    icon: Zap,
    title: 'Real-time Performance',
    description: 'Optimized for fast inference using WebGL and Edge Runtime.'
  },
  {
    icon: Code,
    title: 'Open Source',
    description: 'Built with TensorFlow.js, LangChain, and open-source models.'
  }
]

export default function ArtificialIntelligencePage() {
  return (
    <main className="min-h-screen py-24">
      {/* Hero Section */}
      <section className="container mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ai-primary/10 text-ai-primary text-sm font-medium mb-6">
            <Brain className="w-4 h-4" />
            Pillar of the Future
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Artificial
            <span className="bg-gradient-to-r from-ai-primary to-ai-secondary bg-clip-text text-transparent"> Intelligence</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore the cutting edge of AI development. News, research breakthroughs,
            and interactive AI tools you can try right in your browser.
          </p>

          {/* Tool Badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              { icon: Hash, label: 'Token Counter' },
              { icon: Wand2, label: 'Prompt Builder' },
              { icon: BookOpen, label: 'Readability' },
              { icon: Code, label: 'JSON Schema' },
            ].map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm"
              >
                <badge.icon className="w-4 h-4 text-ai-primary" />
                <span className="font-medium">{badge.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mb-12">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl border border-border bg-card/50 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Content: AI News + LLM Tools */}
      <section className="container mb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* AI News Feed */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-ai-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-ai-primary" />
              </div>
              AI News & Research
            </h2>
            <NewsFeed
              endpoint="/api/news/ai"
              title="Latest AI News"
              icon={<Brain className="w-5 h-5 text-ai-secondary" />}
              showTags={true}
              limit={8}
            />
          </div>

          {/* LLM Tools */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              LangChain LLM Tools
            </h2>
            <div className="space-y-4">
              {LLM_TOOLS.map((tool, index) => (
                <motion.div
                  key={tool.slug}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/ai-tools/${tool.slug}`}>
                    <div className="group p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
                          <tool.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{tool.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${tool.bgColor} ${tool.textColor}`}>
                          {tool.model}
                        </span>
                        <span className="text-xs text-muted-foreground">FREE API</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Quick Link to Full AI Tools */}
            <Link
              href="/ai-tools"
              className="mt-6 block p-4 rounded-xl border border-dashed border-primary/30 text-center hover:bg-primary/5 transition-colors"
            >
              <span className="text-primary font-medium">View All AI Tools</span>
              <ArrowRight className="w-4 h-4 inline ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Browser ML Tools Grid */}
      <section className="container mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Browser ML Tools</h2>
              <p className="text-sm text-muted-foreground">Runs entirely in your browser - no server needed</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {BROWSER_TOOLS.map((tool, index) => (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
            >
              <Link href={`/ai-tools/${tool.slug}`}>
                <div className="group p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all text-center">
                  <div className={`w-10 h-10 rounded-lg ${tool.bgColor} flex items-center justify-center mx-auto mb-2`}>
                    <tool.icon className={`w-5 h-5 ${tool.color}`} />
                  </div>
                  <h4 className="text-xs font-medium group-hover:text-primary transition-colors line-clamp-2">
                    {tool.name}
                  </h4>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Developer Tools Section */}
      <section className="container mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-ai-primary/10 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-ai-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI Developer Tools</h2>
              <p className="text-sm text-muted-foreground">Utilities for prompt engineering & LLM development</p>
            </div>
          </div>
        </motion.div>

        <AIToolsGrid />
      </section>

      {/* AI Trends */}
      <section className="container mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">AI Trends to Watch</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The most exciting developments shaping the future of artificial intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {aiTrends.map((trend, index) => (
            <motion.div
              key={trend.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-card border border-border rounded-xl text-center hover:border-primary/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-ai-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-ai-primary/20 transition-colors">
                <trend.icon className="w-5 h-5 text-ai-primary" />
              </div>
              <h4 className="font-semibold text-sm mb-1">{trend.title}</h4>
              <p className="text-xs text-muted-foreground">{trend.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="container mb-16">
        <div className="max-w-4xl mx-auto p-8 rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30">
          <h2 className="text-xl font-bold mb-6 text-center">Powered By</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['LangChain', 'Groq API', 'TensorFlow.js', 'WebGL', 'MediaPipe', 'Next.js Edge'].map((tech) => (
              <div key={tech} className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-ai-primary/10 via-ai-secondary/5 to-transparent border border-ai-primary/20 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Build with AI
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Check out my AI-powered projects and applications showcasing machine learning capabilities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/ai-tools"
              className="inline-flex items-center gap-2 px-6 py-3 bg-ai-primary text-white rounded-lg font-medium hover:bg-ai-primary/90 transition-colors"
            >
              Try AI Tools
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/projects?category=ai"
              className="inline-flex items-center gap-2 px-6 py-3 border border-ai-primary text-ai-primary rounded-lg font-medium hover:bg-ai-primary/10 transition-colors"
            >
              View AI Projects
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  )
}

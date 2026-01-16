'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Brain, Camera, Mic, Palette, Scan, MessageSquare, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FEATURED_AI_TOOLS = [
  {
    slug: 'object-detection',
    name: 'Object Detection',
    description: 'Detect and identify objects in real-time using your camera',
    icon: Camera,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    slug: 'sentiment-analysis',
    name: 'Sentiment Analysis',
    description: 'Analyze emotions and sentiment in any text',
    icon: MessageSquare,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
  },
  {
    slug: 'pose-estimation',
    name: 'Pose Estimation',
    description: 'Track body movements and poses with AI',
    icon: Scan,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    slug: 'style-transfer',
    name: 'Style Transfer',
    description: 'Transform images into artistic masterpieces',
    icon: Palette,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    slug: 'text-to-speech',
    name: 'Text to Speech',
    description: 'Convert text into natural-sounding speech',
    icon: Mic,
    color: 'from-indigo-500 to-violet-500',
    bgColor: 'bg-indigo-500/10',
  },
  {
    slug: 'image-classifier',
    name: 'Image Classifier',
    description: 'Identify objects and scenes in images',
    icon: Brain,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
  },
]

export function AIPlaygroundSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background -z-10" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Tools
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            AI Playground
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore cutting-edge AI tools powered by TensorFlow.js and machine learning models.
            All processing happens directly in your browser - no data sent to servers.
          </p>
        </motion.div>

        {/* AI Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {FEATURED_AI_TOOLS.map((tool, index) => (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/ai-tools/${tool.slug}`}>
                <div className="group relative h-full p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                  {/* Gradient Border on Hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${tool.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <tool.icon className={`w-7 h-7 bg-gradient-to-br ${tool.color} bg-clip-text`} style={{ color: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text' }} />
                    <tool.icon className={`w-7 h-7 absolute bg-gradient-to-br ${tool.color}`} style={{ opacity: 1 }} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {tool.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center text-sm text-primary font-medium">
                    <span>Try it now</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Stats & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">15+</div>
              <div className="text-sm text-muted-foreground">AI Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Client-side</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">Free</div>
              <div className="text-sm text-muted-foreground">No API Keys</div>
            </div>
          </div>

          <Button variant="gradient" size="lg" asChild>
            <Link href="/ai-tools">
              Explore All AI Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

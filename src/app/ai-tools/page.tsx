'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Sparkles, Box, User, Palette, Smile, MessageSquare,
  Brain, ArrowRight, Shield, Zap, Code
} from 'lucide-react'

const AI_TOOLS = [
  {
    slug: 'background-removal',
    name: 'Background Removal',
    description: 'Remove backgrounds from images instantly using AI segmentation.',
    icon: User,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500',
    model: 'BodyPix'
  },
  {
    slug: 'pose-estimation',
    name: 'Pose Estimation',
    description: 'Detect human body poses and track 17 key body points in real-time.',
    icon: User,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    model: 'MoveNet'
  },
  {
    slug: 'object-detection',
    name: 'Object Detection',
    description: 'Detect and identify 80+ types of objects in images or video.',
    icon: Box,
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-500',
    model: 'COCO-SSD'
  },
  {
    slug: 'style-transfer',
    name: 'Style Transfer',
    description: 'Transform photos into artistic masterpieces with various art styles.',
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-500',
    model: 'Canvas API'
  },
  {
    slug: 'face-landmark',
    name: 'Face Landmark Detection',
    description: 'Detect 468 facial landmarks including eyes, lips, and face contours.',
    icon: Smile,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-500',
    model: 'MediaPipe FaceMesh'
  },
  {
    slug: 'sentiment-analysis',
    name: 'Sentiment Analysis',
    description: 'Analyze text to detect sentiment, emotions, and key phrases.',
    icon: MessageSquare,
    color: 'from-cyan-500 to-teal-500',
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-500',
    model: 'NLP Lexicon'
  }
]

const features = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'All processing happens locally in your browser. No data is sent to servers.'
  },
  {
    icon: Zap,
    title: 'Real-time Performance',
    description: 'Optimized for fast inference using WebGL and WASM acceleration.'
  },
  {
    icon: Code,
    title: 'Open Source Models',
    description: 'Built with TensorFlow.js and open-source machine learning models.'
  }
]

export default function AIToolsPage() {
  return (
    <main className="min-h-screen py-24">
      {/* Hero Section */}
      <section className="container mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Brain className="w-4 h-4" />
            Machine Learning in Browser
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AI Tools
            <span className="gradient-text"> Playground</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Explore powerful AI capabilities running entirely in your browser.
            No server uploads, no API costs — just pure client-side machine learning.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl border border-border bg-card/50 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Tools Grid */}
      <section className="container">
        <h2 className="text-2xl font-bold mb-8 text-center">Available Tools</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {AI_TOOLS.map((tool, index) => (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link href={`/ai-tools/${tool.slug}`}>
                <div className="group h-full p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                  <div className={`w-12 h-12 rounded-xl ${tool.bgColor} flex items-center justify-center mb-4`}>
                    <tool.icon className={`w-6 h-6 ${tool.textColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${tool.bgColor} ${tool.textColor}`}>
                      {tool.model}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="container mt-16">
        <div className="max-w-4xl mx-auto p-8 rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30">
          <h2 className="text-xl font-bold mb-6 text-center">Powered By</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium">
              TensorFlow.js
            </div>
            <div className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium">
              WebGL
            </div>
            <div className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium">
              WASM
            </div>
            <div className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium">
              MediaPipe
            </div>
            <div className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium">
              Canvas API
            </div>
            <div className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium">
              WebRTC
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            All models are loaded on-demand and cached locally for faster subsequent use.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container mt-12">
        <div className="max-w-3xl mx-auto text-center text-sm text-muted-foreground">
          <p>
            These AI tools are for demonstration purposes. Model accuracy may vary.
            First-time loading may take a few seconds as models are downloaded.
          </p>
        </div>
      </section>
    </main>
  )
}

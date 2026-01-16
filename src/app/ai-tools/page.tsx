'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Sparkles, Box, User, Palette, Smile, MessageSquare,
  Brain, ArrowRight, Shield, Zap, Code, Tag, Hand, QrCode, Volume2, Mic, Languages, ScanText, CloudSun
} from 'lucide-react'

// LangChain-powered LLM Tools
const LLM_TOOLS = [
  {
    slug: 'llm',
    name: 'LLM Chat',
    description: 'Interactive chat with AI powered by Groq LLMs. Multiple models available.',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    model: 'Groq LLMs'
  },
  {
    slug: 'rag',
    name: 'RAG System',
    description: 'Upload documents and chat with AI that has context from your files.',
    icon: Tag,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-500',
    model: 'LangChain RAG'
  },
  {
    slug: 'agent',
    name: 'AI Agent',
    description: 'AI with tool-use capabilities. Calculations, time, weather, and more.',
    icon: Brain,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-500',
    model: 'Agent Tools'
  }
]

// Browser-based ML Tools
const BROWSER_TOOLS = [
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
  },
  {
    slug: 'image-classifier',
    name: 'Image Classification',
    description: 'Identify objects in images using deep learning. Recognizes 1000+ categories.',
    icon: Tag,
    color: 'from-indigo-500 to-violet-500',
    bgColor: 'bg-indigo-500/10',
    textColor: 'text-indigo-500',
    model: 'MobileNet v2'
  },
  {
    slug: 'hand-gesture',
    name: 'Hand Gesture Recognition',
    description: 'Detect hand gestures in real-time. Recognizes thumbs up, peace, fist & more.',
    icon: Hand,
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-500/10',
    textColor: 'text-violet-500',
    model: 'MediaPipe Hands'
  },
  {
    slug: 'qr-scanner',
    name: 'QR Code Scanner',
    description: 'Scan QR codes using your camera or upload an image.',
    icon: QrCode,
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-500',
    model: 'jsQR'
  },
  {
    slug: 'color-extractor',
    name: 'Color Palette Extractor',
    description: 'Extract dominant colors from images to create color palettes.',
    icon: Palette,
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-500/10',
    textColor: 'text-rose-500',
    model: 'Canvas API'
  },
  {
    slug: 'text-to-speech',
    name: 'Text to Speech',
    description: 'Convert text to natural-sounding speech using browser synthesis.',
    icon: Volume2,
    color: 'from-sky-500 to-blue-500',
    bgColor: 'bg-sky-500/10',
    textColor: 'text-sky-500',
    model: 'Web Speech API'
  },
  {
    slug: 'speech-to-text',
    name: 'Speech to Text',
    description: 'Convert spoken words to text in real-time with multi-language support.',
    icon: Mic,
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-500',
    model: 'Web Speech API'
  },
  {
    slug: 'language-detector',
    name: 'Language Detector',
    description: 'Automatically detect the language of any text with confidence scores.',
    icon: Languages,
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-500',
    model: 'NLP Analysis'
  },
  {
    slug: 'word-cloud',
    name: 'Word Cloud Generator',
    description: 'Create beautiful word cloud visualizations from any text.',
    icon: CloudSun,
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'bg-teal-500/10',
    textColor: 'text-teal-500',
    model: 'Canvas API'
  },
  {
    slug: 'text-summarizer',
    name: 'Text Summarizer',
    description: 'Automatically summarize long text into key points and sentences.',
    icon: ScanText,
    color: 'from-fuchsia-500 to-pink-500',
    bgColor: 'bg-fuchsia-500/10',
    textColor: 'text-fuchsia-500',
    model: 'NLP Extraction'
  }
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
    description: 'Optimized for fast inference using WebGL, WASM, and Edge Runtime.'
  },
  {
    icon: Code,
    title: 'Open Source',
    description: 'Built with TensorFlow.js, LangChain, and open-source models.'
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
            AI Tools Playground
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AI Tools
            <span className="gradient-text"> Collection</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Browser-based ML models and LangChain-powered LLM applications.
            Explore the future of AI right in your browser.
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

      {/* LangChain LLM Tools */}
      <section className="container mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">LangChain LLM Tools</h2>
            <p className="text-sm text-muted-foreground">Powered by Groq (FREE API)</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {LLM_TOOLS.map((tool, index) => (
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

      {/* Browser ML Tools */}
      <section className="container">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Browser ML Tools</h2>
            <p className="text-sm text-muted-foreground">Runs entirely in your browser</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {BROWSER_TOOLS.map((tool, index) => (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
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
              LangChain
            </div>
            <div className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium">
              Groq API
            </div>
            <div className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium">
              TensorFlow.js
            </div>
            <div className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium">
              WebGL
            </div>
            <div className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium">
              MediaPipe
            </div>
            <div className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium">
              Next.js Edge
            </div>
          </div>
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

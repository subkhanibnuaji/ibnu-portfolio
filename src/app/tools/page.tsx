'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Wrench, ArrowRight, Keyboard, Calculator, Gamepad2, Music,
  Ruler, Clock, Timer, ArrowRightLeft, Code, Quote, Paintbrush,
  Cloud, Blocks, FileText, Palette, Timer as StopwatchIcon, Key, Target,
  Braces, StickyNote, Scale, Globe, Sparkles, Hourglass,
  QrCode, Type, AlignLeft, BookOpen, Grid3X3
} from 'lucide-react'

const TOOLS = [
  {
    slug: 'typing-test',
    name: 'Typing Speed Test',
    description: 'Test your typing speed and accuracy. Track your WPM and improve!',
    icon: Keyboard,
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-500',
    category: 'Productivity'
  },
  {
    slug: 'calculator',
    name: 'Calculator',
    description: 'A beautiful calculator with history and all basic operations.',
    icon: Calculator,
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    category: 'Utility'
  },
  {
    slug: 'snake-game',
    name: 'Snake Game',
    description: 'Classic snake game with smooth controls and high score tracking.',
    icon: Gamepad2,
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500',
    category: 'Game'
  },
  {
    slug: 'music-visualizer',
    name: 'Music Visualizer',
    description: 'Beautiful audio visualizations with multiple styles and color themes.',
    icon: Music,
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-500',
    category: 'Entertainment'
  },
  {
    slug: 'pomodoro',
    name: 'Pomodoro Timer',
    description: 'Boost productivity with the Pomodoro technique. Focus and break timers.',
    icon: Timer,
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-500',
    category: 'Productivity'
  },
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between length, weight, temperature, time, data, and speed units.',
    icon: ArrowRightLeft,
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-500',
    category: 'Utility'
  },
  {
    slug: 'code-playground',
    name: 'Code Playground',
    description: 'Write and run JavaScript, HTML, or CSS code directly in your browser.',
    icon: Code,
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-500',
    category: 'Developer'
  },
  {
    slug: 'quote-generator',
    name: 'Quote Generator',
    description: 'Get inspired with random quotes from famous people across various categories.',
    icon: Quote,
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-500',
    category: 'Inspiration'
  },
  {
    slug: 'drawing-canvas',
    name: 'Drawing Canvas',
    description: 'Express your creativity with a full-featured drawing canvas and tools.',
    icon: Paintbrush,
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-500',
    category: 'Creative'
  },
  {
    slug: 'weather-widget',
    name: 'Weather Widget',
    description: 'Check weather conditions for cities around the world.',
    icon: Cloud,
    bgColor: 'bg-sky-500/10',
    textColor: 'text-sky-500',
    category: 'Widget'
  },
  {
    slug: 'tetris-game',
    name: 'Tetris',
    description: 'Classic Tetris game with score tracking and increasing difficulty.',
    icon: Blocks,
    bgColor: 'bg-violet-500/10',
    textColor: 'text-violet-500',
    category: 'Game'
  },
  {
    slug: 'markdown-editor',
    name: 'Markdown Editor',
    description: 'Write markdown with live preview. Perfect for documentation.',
    icon: FileText,
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-500',
    category: 'Developer'
  },
  {
    slug: 'color-picker',
    name: 'Color Picker',
    description: 'Pick colors and get them in HEX, RGB, and HSL formats.',
    icon: Palette,
    bgColor: 'bg-indigo-500/10',
    textColor: 'text-indigo-500',
    category: 'Design'
  },
  {
    slug: 'stopwatch',
    name: 'Stopwatch',
    description: 'Precise stopwatch with lap times and split tracking.',
    icon: StopwatchIcon,
    bgColor: 'bg-teal-500/10',
    textColor: 'text-teal-500',
    category: 'Utility'
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure, random passwords with customizable options.',
    icon: Key,
    bgColor: 'bg-rose-500/10',
    textColor: 'text-rose-500',
    category: 'Security'
  },
  {
    slug: 'habit-tracker',
    name: 'Habit Tracker',
    description: 'Track your daily habits and build consistency over time.',
    icon: Target,
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500',
    category: 'Productivity'
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, and minify JSON data with syntax highlighting.',
    icon: Braces,
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    category: 'Developer'
  },
  {
    slug: 'notes-app',
    name: 'Notes',
    description: 'Quick notes with tags, colors, and search. Data saved locally.',
    icon: StickyNote,
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-500',
    category: 'Productivity'
  },
  {
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index with health recommendations.',
    icon: Scale,
    bgColor: 'bg-lime-500/10',
    textColor: 'text-lime-500',
    category: 'Health'
  },
  {
    slug: 'world-clock',
    name: 'World Clock',
    description: 'Track time across multiple time zones around the world.',
    icon: Globe,
    bgColor: 'bg-indigo-500/10',
    textColor: 'text-indigo-500',
    category: 'Utility'
  },
  {
    slug: 'gradient-generator',
    name: 'Gradient Generator',
    description: 'Create beautiful CSS gradients with live preview and code export.',
    icon: Sparkles,
    bgColor: 'bg-fuchsia-500/10',
    textColor: 'text-fuchsia-500',
    category: 'Design'
  },
  {
    slug: 'countdown-timer',
    name: 'Countdown Timer',
    description: 'Track important dates and events with beautiful countdown cards.',
    icon: Hourglass,
    bgColor: 'bg-rose-500/10',
    textColor: 'text-rose-500',
    category: 'Utility'
  },
  {
    slug: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes for text, URLs, email, phone, or WiFi.',
    icon: QrCode,
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-500',
    category: 'Utility'
  },
  {
    slug: 'text-converter',
    name: 'Text Case Converter',
    description: 'Convert text to uppercase, lowercase, title case, and more.',
    icon: Type,
    bgColor: 'bg-violet-500/10',
    textColor: 'text-violet-500',
    category: 'Developer'
  },
  {
    slug: 'lorem-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for your designs and mockups.',
    icon: AlignLeft,
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-500',
    category: 'Developer'
  },
  {
    slug: 'flashcards',
    name: 'Flashcards',
    description: 'Create and study flashcards with decks and spaced repetition.',
    icon: BookOpen,
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-500',
    category: 'Learning'
  },
  {
    slug: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    description: 'Classic game with AI opponent at multiple difficulty levels.',
    icon: Grid3X3,
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    category: 'Game'
  }
]

export default function ToolsPage() {
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
            <Wrench className="w-4 h-4" />
            Interactive Tools
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Useful
            <span className="gradient-text"> Tools</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            A collection of useful tools and mini-games to boost your productivity
            or just have some fun!
          </p>
        </motion.div>
      </section>

      {/* Tools Grid */}
      <section className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TOOLS.map((tool, index) => (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link href={`/tools/${tool.slug}`}>
                <div className="group h-full p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${tool.bgColor} flex items-center justify-center`}>
                      <tool.icon className={`w-6 h-6 ${tool.textColor}`} />
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {tool.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {tool.description}
                  </p>
                  <div className="flex items-center text-sm text-primary">
                    <span>Open Tool</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

    </main>
  )
}

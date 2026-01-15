'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Wrench, ArrowRight, Keyboard, Calculator, Gamepad2, Music,
  Ruler, Clock, Timer, ArrowRightLeft
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

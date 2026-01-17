'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  X, Search, ChevronRight, Sparkles, Bot, Gamepad2, Calculator,
  Code2, Palette, Briefcase, Heart, Wrench, BookOpen, Home,
  User, FolderKanban, Mail, Award, Newspaper, Terminal,
  Brain, Camera, Hand, QrCode, Volume2, Smile, Tag, Box,
  Zap, Clock, Timer, CheckSquare, FileText, Hash, Percent,
  DollarSign, Thermometer, Ruler, Moon, Dumbbell, Music,
  PenTool, Lightbulb, Send, MessageSquare, Shield, Database,
  LayoutGrid, Compass, Map, Rocket, Star, ArrowRight,
  Cpu, Globe, Layers, Monitor, Smartphone
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// SITE DATA - All Features
// ============================================

interface SiteFeature {
  name: string
  path: string
  icon: React.ElementType
  description: string
  isNew?: boolean
  isHot?: boolean
}

interface SiteCategory {
  id: string
  name: string
  icon: React.ElementType
  color: string
  gradient: string
  features: SiteFeature[]
}

const SITE_CATEGORIES: SiteCategory[] = [
  {
    id: 'main',
    name: 'Main Pages',
    icon: Home,
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-cyan-500',
    features: [
      { name: 'Home', path: '/', icon: Home, description: 'Landing page & overview' },
      { name: 'About', path: '/about', icon: User, description: 'Professional background' },
      { name: 'Projects', path: '/projects', icon: FolderKanban, description: '7 major projects' },
      { name: 'Blog', path: '/blog', icon: Newspaper, description: 'Articles & insights' },
      { name: 'Certifications', path: '/certifications', icon: Award, description: '50+ credentials' },
      { name: 'Contact', path: '/contact', icon: Mail, description: 'Get in touch' },
    ]
  },
  {
    id: 'ai-llm',
    name: 'AI LLM Tools',
    icon: Brain,
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-pink-500',
    features: [
      { name: 'LLM Chat', path: '/ai-tools/llm', icon: MessageSquare, description: 'Chat with Groq LLMs', isHot: true },
      { name: 'RAG System', path: '/ai-tools/rag', icon: Database, description: 'Document Q&A' },
      { name: 'AI Agent', path: '/ai-tools/agent', icon: Bot, description: 'AI with tools' },
      { name: 'Telegram Bot', path: '/ai-tools/telegram-bot', icon: Send, description: 'Telegram chatbot', isNew: true },
    ]
  },
  {
    id: 'ai-ml',
    name: 'AI/ML Vision',
    icon: Camera,
    color: 'text-pink-400',
    gradient: 'from-pink-500 to-rose-500',
    features: [
      { name: 'Object Detection', path: '/ai-tools/object-detection', icon: Box, description: '80+ objects (COCO-SSD)' },
      { name: 'Pose Estimation', path: '/ai-tools/pose-estimation', icon: User, description: '17 body keypoints' },
      { name: 'Face Landmark', path: '/ai-tools/face-landmark', icon: Smile, description: '468 facial points' },
      { name: 'Hand Gesture', path: '/ai-tools/hand-gesture', icon: Hand, description: 'Real-time tracking' },
      { name: 'Background Removal', path: '/ai-tools/background-removal', icon: Layers, description: 'BodyPix segmentation' },
      { name: 'Style Transfer', path: '/ai-tools/style-transfer', icon: Palette, description: 'Artistic effects' },
      { name: 'Image Classifier', path: '/ai-tools/image-classifier', icon: Tag, description: '1000+ categories' },
      { name: 'Sentiment Analysis', path: '/ai-tools/sentiment-analysis', icon: Heart, description: 'Text emotions' },
      { name: 'Color Extractor', path: '/ai-tools/color-extractor', icon: Palette, description: 'Dominant colors' },
      { name: 'QR Scanner', path: '/ai-tools/qr-scanner', icon: QrCode, description: 'Scan QR codes' },
      { name: 'Text to Speech', path: '/ai-tools/text-to-speech', icon: Volume2, description: 'Web Speech API' },
    ]
  },
  {
    id: 'games',
    name: 'Games',
    icon: Gamepad2,
    color: 'text-green-400',
    gradient: 'from-green-500 to-emerald-500',
    features: [
      { name: 'Snake Game', path: '/tools/snake-game', icon: Gamepad2, description: 'Classic snake' },
      { name: 'Tetris', path: '/tools/tetris-game', icon: Gamepad2, description: 'Block puzzle' },
      { name: '2048', path: '/tools/game-2048', icon: Gamepad2, description: 'Number merge' },
      { name: 'Tic Tac Toe', path: '/tools/tic-tac-toe', icon: Gamepad2, description: 'X and O' },
      { name: 'Memory Game', path: '/tools/memory-game', icon: Gamepad2, description: 'Card matching' },
      { name: 'Hangman', path: '/tools/hangman', icon: Gamepad2, description: 'Word guessing' },
      { name: 'Minesweeper', path: '/tools/minesweeper', icon: Gamepad2, description: 'Mine finder' },
      { name: 'Sudoku', path: '/tools/sudoku', icon: Gamepad2, description: 'Number puzzle' },
      { name: 'Simon Says', path: '/tools/simon-says', icon: Gamepad2, description: 'Memory sequence' },
      { name: 'Connect Four', path: '/tools/connect-four', icon: Gamepad2, description: 'Line up 4' },
      { name: 'Word Scramble', path: '/tools/word-scramble', icon: Gamepad2, description: 'Unscramble words' },
    ]
  },
  {
    id: 'calculators',
    name: 'Calculators',
    icon: Calculator,
    color: 'text-yellow-400',
    gradient: 'from-yellow-500 to-orange-500',
    features: [
      { name: 'Calculator', path: '/tools/calculator', icon: Calculator, description: 'Basic calculator' },
      { name: 'BMI Calculator', path: '/tools/bmi-calculator', icon: Heart, description: 'Body mass index' },
      { name: 'Age Calculator', path: '/tools/age-calculator', icon: Clock, description: 'Calculate age' },
      { name: 'Loan Calculator', path: '/tools/loan-calculator', icon: DollarSign, description: 'EMI & interest' },
      { name: 'Unit Converter', path: '/tools/unit-converter', icon: Ruler, description: 'Convert units' },
      { name: 'Currency Converter', path: '/tools/currency-converter', icon: DollarSign, description: 'Exchange rates' },
      { name: 'Tip Calculator', path: '/tools/tip-calculator', icon: DollarSign, description: 'Split bills' },
      { name: 'GPA Calculator', path: '/tools/gpa-calculator', icon: BookOpen, description: 'Grade points' },
      { name: 'Percentage', path: '/tools/percentage-calculator', icon: Percent, description: 'Percentage calc' },
      { name: 'Temperature', path: '/tools/temperature-converter', icon: Thermometer, description: 'C/F/K convert' },
      { name: 'Savings', path: '/tools/savings-calculator', icon: DollarSign, description: 'Savings growth' },
    ]
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    icon: Code2,
    color: 'text-cyan-400',
    gradient: 'from-cyan-500 to-blue-500',
    features: [
      { name: 'Code Playground', path: '/tools/code-playground', icon: Code2, description: 'Live code editor' },
      { name: 'Markdown Editor', path: '/tools/markdown-editor', icon: FileText, description: 'Write markdown' },
      { name: 'JSON Formatter', path: '/tools/json-formatter', icon: Code2, description: 'Format JSON' },
      { name: 'Regex Tester', path: '/tools/regex-tester', icon: Code2, description: 'Test patterns' },
      { name: 'Base64 Encoder', path: '/tools/base64-converter', icon: Code2, description: 'Encode/decode' },
      { name: 'Hash Generator', path: '/tools/hash-generator', icon: Hash, description: 'MD5/SHA hashes' },
      { name: 'Lorem Generator', path: '/tools/lorem-generator', icon: FileText, description: 'Dummy text' },
      { name: 'URL Encoder', path: '/tools/url-encoder', icon: Code2, description: 'URL encode' },
      { name: 'PX to REM', path: '/tools/px-to-rem', icon: Ruler, description: 'Unit conversion' },
      { name: 'Binary Converter', path: '/tools/binary-converter', icon: Code2, description: 'Binary/hex/dec' },
    ]
  },
  {
    id: 'design',
    name: 'Design Tools',
    icon: Palette,
    color: 'text-rose-400',
    gradient: 'from-rose-500 to-pink-500',
    features: [
      { name: 'Gradient Generator', path: '/tools/gradient-generator', icon: Palette, description: 'CSS gradients' },
      { name: 'Box Shadow', path: '/tools/box-shadow-generator', icon: Layers, description: 'Shadow effects' },
      { name: 'Color Picker', path: '/tools/color-picker', icon: Palette, description: 'Pick colors' },
      { name: 'Color Converter', path: '/tools/color-converter', icon: Palette, description: 'HEX/RGB/HSL' },
      { name: 'Color Palette', path: '/tools/color-palette', icon: Palette, description: 'Generate palettes' },
      { name: 'Aspect Ratio', path: '/tools/aspect-ratio', icon: Ruler, description: 'Calculate ratios' },
    ]
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: Zap,
    color: 'text-orange-400',
    gradient: 'from-orange-500 to-red-500',
    features: [
      { name: 'Pomodoro Timer', path: '/tools/pomodoro', icon: Timer, description: 'Focus sessions' },
      { name: 'Typing Test', path: '/tools/typing-test', icon: Zap, description: 'Speed test' },
      { name: 'Notes App', path: '/tools/notes-app', icon: FileText, description: 'Quick notes' },
      { name: 'Checklist', path: '/tools/checklist', icon: CheckSquare, description: 'Task lists' },
      { name: 'Habit Tracker', path: '/tools/habit-tracker', icon: CheckSquare, description: 'Track habits' },
      { name: 'Flashcards', path: '/tools/flashcards', icon: BookOpen, description: 'Study cards' },
      { name: 'Timer', path: '/tools/timer', icon: Timer, description: 'Countdown timer' },
      { name: 'Stopwatch', path: '/tools/stopwatch', icon: Clock, description: 'Time tracking' },
    ]
  },
  {
    id: 'creative',
    name: 'Creative',
    icon: PenTool,
    color: 'text-violet-400',
    gradient: 'from-violet-500 to-purple-500',
    features: [
      { name: 'Drawing Canvas', path: '/tools/drawing-canvas', icon: PenTool, description: 'Digital drawing' },
      { name: 'Pixel Art Editor', path: '/tools/pixel-art-editor', icon: LayoutGrid, description: 'Create pixel art' },
      { name: 'Music Visualizer', path: '/tools/music-visualizer', icon: Music, description: 'Audio visuals' },
      { name: 'QR Generator', path: '/tools/qr-generator', icon: QrCode, description: 'Generate QR codes' },
    ]
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: Wrench,
    color: 'text-slate-400',
    gradient: 'from-slate-500 to-gray-500',
    features: [
      { name: 'Weather Widget', path: '/tools/weather-widget', icon: Globe, description: 'Weather info' },
      { name: 'World Clock', path: '/tools/world-clock', icon: Clock, description: 'Global times' },
      { name: 'Timezone Converter', path: '/tools/timezone-converter', icon: Globe, description: 'Convert zones' },
      { name: 'Text Statistics', path: '/tools/text-statistics', icon: FileText, description: 'Word count' },
      { name: 'Emoji Picker', path: '/tools/emoji-picker', icon: Smile, description: 'Find emojis' },
      { name: 'Morse Code', path: '/tools/morse-code', icon: Zap, description: 'Translate morse' },
      { name: 'Roman Numeral', path: '/tools/roman-numeral', icon: Hash, description: 'Convert numerals' },
      { name: 'Random Number', path: '/tools/random-number', icon: Hash, description: 'Generate random' },
      { name: 'Quote Generator', path: '/tools/quote-generator', icon: Lightbulb, description: 'Inspiring quotes' },
      { name: 'Invoice Generator', path: '/tools/invoice-generator', icon: FileText, description: 'Create invoices' },
    ]
  },
  {
    id: 'special',
    name: 'Special Features',
    icon: Sparkles,
    color: 'text-amber-400',
    gradient: 'from-amber-500 to-yellow-500',
    features: [
      { name: 'AI Chatbot', path: '/#chatbot', icon: Bot, description: 'Floating assistant', isHot: true },
      { name: 'Terminal', path: '/#terminal', icon: Terminal, description: 'Press T to open' },
      { name: 'Command Palette', path: '/#cmd', icon: Zap, description: 'Ctrl+K shortcut' },
      { name: 'Mobile App', path: '/mobile', icon: Smartphone, description: 'Mobile preview' },
      { name: 'RSS Feed', path: '/feed.xml', icon: Globe, description: 'Blog subscription' },
    ]
  },
]

// ============================================
// COMPONENT
// ============================================

export function SiteNavigator() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)

  // Check scroll position
  const handleScroll = useCallback(() => {
    if (hasShown) return

    const scrollHeight = document.documentElement.scrollHeight
    const scrollTop = document.documentElement.scrollTop
    const clientHeight = document.documentElement.clientHeight

    // Show when user is 80% down the page
    const scrollPercent = (scrollTop + clientHeight) / scrollHeight
    if (scrollPercent > 0.8) {
      setIsVisible(true)
      setHasShown(true)
    }
  }, [hasShown])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Reset on page change
  useEffect(() => {
    setHasShown(false)
    setIsVisible(false)
  }, [])

  // Filter features based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return SITE_CATEGORIES

    const query = searchQuery.toLowerCase()
    return SITE_CATEGORIES.map(category => ({
      ...category,
      features: category.features.filter(
        feature =>
          feature.name.toLowerCase().includes(query) ||
          feature.description.toLowerCase().includes(query)
      )
    })).filter(category => category.features.length > 0)
  }, [searchQuery])

  // Total feature count
  const totalFeatures = SITE_CATEGORIES.reduce(
    (acc, cat) => acc + cat.features.length,
    0
  )

  // Close popup
  const handleClose = () => {
    setIsVisible(false)
  }

  // Open full navigator
  const handleOpenNavigator = () => {
    setIsOpen(true)
    setIsVisible(false)
  }

  return (
    <>
      {/* Trigger Popup */}
      <AnimatePresence>
        {isVisible && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl blur-xl opacity-50 animate-pulse" />

              {/* Card */}
              <div className="relative bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>

                {/* Sparkle icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-1">
                  Discover More
                </h3>
                <p className="text-sm text-white/60 mb-4">
                  Want to see all <span className="text-purple-400 font-semibold">{totalFeatures}+ features</span> of this portfolio?
                </p>

                {/* Stats */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-white/40">AI Tools</p>
                    <p className="text-lg font-bold text-purple-400">15</p>
                  </div>
                  <div className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-white/40">Utilities</p>
                    <p className="text-lg font-bold text-cyan-400">83+</p>
                  </div>
                  <div className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-white/40">Games</p>
                    <p className="text-lg font-bold text-green-400">15</p>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleOpenNavigator}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium flex items-center justify-center gap-2 transition-all group"
                >
                  <Map className="w-5 h-5" />
                  Explore Site Navigator
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Navigator Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl bg-gradient-to-b from-gray-900 to-black border border-white/10 shadow-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center">
                      <Compass className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Site Navigator</h2>
                      <p className="text-sm text-white/60">
                        Explore all {totalFeatures}+ features of this portfolio
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <X className="w-6 h-6 text-white/60" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search features..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCategories.map((category, catIndex) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: catIndex * 0.05 }}
                      className="group"
                    >
                      {/* Category Header */}
                      <button
                        onClick={() =>
                          setActiveCategory(
                            activeCategory === category.id ? null : category.id
                          )
                        }
                        className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all mb-3"
                      >
                        <div
                          className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br',
                            category.gradient
                          )}
                        >
                          <category.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-white">{category.name}</h3>
                          <p className="text-xs text-white/40">
                            {category.features.length} features
                          </p>
                        </div>
                        <ChevronRight
                          className={cn(
                            'w-5 h-5 text-white/40 transition-transform',
                            activeCategory === category.id && 'rotate-90'
                          )}
                        />
                      </button>

                      {/* Features Grid */}
                      <AnimatePresence>
                        {(activeCategory === category.id || activeCategory === null) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-1"
                          >
                            {category.features.slice(0, activeCategory === category.id ? undefined : 4).map((feature) => (
                              <Link
                                key={feature.path}
                                href={feature.path}
                                onClick={() => setIsOpen(false)}
                                onMouseEnter={() => setHoveredFeature(feature.path)}
                                onMouseLeave={() => setHoveredFeature(null)}
                                className={cn(
                                  'flex items-center gap-3 p-3 rounded-lg transition-all',
                                  'hover:bg-white/10 border border-transparent hover:border-white/10',
                                  hoveredFeature === feature.path && 'bg-white/10 border-white/10'
                                )}
                              >
                                <feature.icon className={cn('w-4 h-4', category.color)} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-white truncate">{feature.name}</span>
                                    {feature.isNew && (
                                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-green-500/20 text-green-400">
                                        NEW
                                      </span>
                                    )}
                                    {feature.isHot && (
                                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-orange-500/20 text-orange-400">
                                        HOT
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-white/40 truncate">{feature.description}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-white/20" />
                              </Link>
                            ))}

                            {activeCategory !== category.id && category.features.length > 4 && (
                              <button
                                onClick={() => setActiveCategory(category.id)}
                                className="w-full p-2 text-center text-xs text-white/40 hover:text-white/60 transition-colors"
                              >
                                +{category.features.length - 4} more
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {/* Empty State */}
                {filteredCategories.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60">No features found for "{searchQuery}"</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-black/80 backdrop-blur-xl border-t border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-white/40">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-4 h-4" />
                      {totalFeatures}+ Features
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Built with Next.js 15
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">Powered by</span>
                    <span className="text-xs font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Ibnu's Portfolio v3.0
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

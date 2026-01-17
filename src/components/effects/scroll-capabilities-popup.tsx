'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Sparkles,
  Home,
  User,
  FolderKanban,
  Award,
  BookOpen,
  Mail,
  Star,
  Brain,
  MessageSquare,
  FileText,
  Cpu,
  Wand2,
  ImageOff,
  Palette,
  Hand,
  Camera,
  Globe2,
  Mic,
  Volume2,
  Type,
  CloudSun,
  Gamepad2,
  Calculator,
  Clock,
  FileCode2,
  QrCode,
  PenTool,
  Music,
  Timer,
  CheckSquare,
  StickyNote,
  Wallet,
  Terminal,
  Command,
  Keyboard,
  Search,
  Bot,
  Map,
  Rocket,
  Zap,
  ChevronRight,
  ExternalLink,
  MousePointerClick,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Capability {
  icon: React.ElementType
  label: string
  description: string
  href: string
  color: string
  isNew?: boolean
  isHot?: boolean
}

interface CapabilityCategory {
  title: string
  icon: React.ElementType
  color: string
  capabilities: Capability[]
}

export function ScrollCapabilitiesPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // All website capabilities organized by category
  const categories: CapabilityCategory[] = [
    {
      title: 'Main Pages',
      icon: Home,
      color: 'from-cyan-500 to-blue-500',
      capabilities: [
        { icon: Home, label: 'Home', description: 'Interactive hero & featured content', href: '/', color: 'text-cyan-400' },
        { icon: User, label: 'About', description: 'Timeline, skills & GitHub stats', href: '/about', color: 'text-blue-400' },
        { icon: FolderKanban, label: 'Projects', description: 'Portfolio showcase gallery', href: '/projects', color: 'text-purple-400' },
        { icon: BookOpen, label: 'Blog', description: 'Articles with MDX & comments', href: '/blog', color: 'text-pink-400' },
        { icon: Award, label: 'Certifications', description: '50+ credentials & badges', href: '/certifications', color: 'text-amber-400' },
        { icon: Star, label: 'Interests', description: 'AI, Blockchain, Cybersecurity', href: '/interests', color: 'text-yellow-400' },
        { icon: Mail, label: 'Contact', description: 'Get in touch form', href: '/contact', color: 'text-green-400' },
      ],
    },
    {
      title: 'AI Tools',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      capabilities: [
        { icon: MessageSquare, label: 'LLM Chat', description: 'Chat with LangChain models', href: '/ai-tools/llm', color: 'text-purple-400', isHot: true },
        { icon: FileText, label: 'RAG System', description: 'Upload docs & ask questions', href: '/ai-tools/rag', color: 'text-pink-400', isNew: true },
        { icon: Cpu, label: 'AI Agent', description: 'Agent with tools & reasoning', href: '/ai-tools/agent', color: 'text-cyan-400', isHot: true },
        { icon: ImageOff, label: 'BG Removal', description: 'Remove image backgrounds', href: '/ai-tools/background-removal', color: 'text-green-400' },
        { icon: Palette, label: 'Color Extractor', description: 'Extract colors from images', href: '/ai-tools/color-extractor', color: 'text-amber-400' },
        { icon: Wand2, label: 'Style Transfer', description: 'Neural style transfer', href: '/ai-tools/style-transfer', color: 'text-purple-400' },
        { icon: Hand, label: 'Hand Gesture', description: 'Hand tracking & gestures', href: '/ai-tools/hand-gesture', color: 'text-blue-400' },
        { icon: Camera, label: 'Face Landmark', description: 'Facial detection & mesh', href: '/ai-tools/face-landmark', color: 'text-pink-400' },
        { icon: Camera, label: 'Object Detection', description: 'COCO-SSD detection', href: '/ai-tools/object-detection', color: 'text-cyan-400' },
        { icon: Camera, label: 'Pose Estimation', description: 'Body pose tracking', href: '/ai-tools/pose-estimation', color: 'text-green-400' },
        { icon: Globe2, label: 'Language Detector', description: 'Detect text language', href: '/ai-tools/language-detector', color: 'text-amber-400' },
        { icon: Type, label: 'Sentiment Analysis', description: 'Analyze text sentiment', href: '/ai-tools/sentiment-analysis', color: 'text-rose-400' },
        { icon: FileText, label: 'Text Summarizer', description: 'AI text summarization', href: '/ai-tools/text-summarizer', color: 'text-blue-400' },
        { icon: CloudSun, label: 'Word Cloud', description: 'Generate word clouds', href: '/ai-tools/word-cloud', color: 'text-purple-400' },
        { icon: Mic, label: 'Speech to Text', description: 'Audio transcription', href: '/ai-tools/speech-to-text', color: 'text-cyan-400' },
        { icon: Volume2, label: 'Text to Speech', description: 'TTS synthesis', href: '/ai-tools/text-to-speech', color: 'text-green-400' },
        { icon: QrCode, label: 'QR Scanner', description: 'Scan QR codes', href: '/ai-tools/qr-scanner', color: 'text-amber-400' },
      ],
    },
    {
      title: 'Games',
      icon: Gamepad2,
      color: 'from-green-500 to-emerald-500',
      capabilities: [
        { icon: Gamepad2, label: 'Snake', description: 'Classic snake game', href: '/tools/snake-game', color: 'text-green-400' },
        { icon: Gamepad2, label: 'Tetris', description: 'Block puzzle game', href: '/tools/tetris-game', color: 'text-cyan-400' },
        { icon: Gamepad2, label: '2048', description: 'Number sliding puzzle', href: '/tools/2048-game', color: 'text-amber-400' },
        { icon: Gamepad2, label: 'Sudoku', description: 'Number logic puzzle', href: '/tools/sudoku', color: 'text-blue-400' },
        { icon: Gamepad2, label: 'Minesweeper', description: 'Mine-finding classic', href: '/tools/minesweeper', color: 'text-red-400' },
        { icon: Gamepad2, label: 'Memory Game', description: 'Card matching memory', href: '/tools/memory-game', color: 'text-purple-400' },
        { icon: Gamepad2, label: 'Tic Tac Toe', description: 'X and O strategy', href: '/tools/tic-tac-toe', color: 'text-pink-400' },
        { icon: Gamepad2, label: 'Connect Four', description: '4-in-a-row game', href: '/tools/connect-four', color: 'text-yellow-400' },
        { icon: Gamepad2, label: 'Hangman', description: 'Word guessing game', href: '/tools/hangman', color: 'text-orange-400' },
        { icon: Gamepad2, label: 'Simon Says', description: 'Memory sequence game', href: '/tools/simon-says', color: 'text-emerald-400' },
      ],
    },
    {
      title: 'Utilities',
      icon: Calculator,
      color: 'from-amber-500 to-orange-500',
      capabilities: [
        { icon: Calculator, label: 'Calculator', description: 'Scientific calculator', href: '/tools/calculator', color: 'text-amber-400' },
        { icon: Calculator, label: 'Unit Converter', description: 'Convert measurements', href: '/tools/unit-converter', color: 'text-blue-400' },
        { icon: Wallet, label: 'Currency', description: 'Currency converter', href: '/tools/currency-converter', color: 'text-green-400' },
        { icon: Clock, label: 'World Clock', description: 'Multiple time zones', href: '/tools/world-clock', color: 'text-cyan-400' },
        { icon: Timer, label: 'Pomodoro', description: 'Focus timer technique', href: '/tools/pomodoro', color: 'text-red-400' },
        { icon: Timer, label: 'Countdown', description: 'Countdown timer', href: '/tools/countdown-timer', color: 'text-purple-400' },
        { icon: QrCode, label: 'QR Generator', description: 'Create QR codes', href: '/tools/qr-generator', color: 'text-pink-400' },
        { icon: CheckSquare, label: 'Checklist', description: 'Task checklist app', href: '/tools/checklist', color: 'text-emerald-400' },
        { icon: StickyNote, label: 'Notes', description: 'Quick notes app', href: '/tools/notes-app', color: 'text-yellow-400' },
        { icon: Wallet, label: 'Expense Tracker', description: 'Track expenses', href: '/tools/expense-tracker', color: 'text-orange-400' },
      ],
    },
    {
      title: 'Developer Tools',
      icon: FileCode2,
      color: 'from-blue-500 to-indigo-500',
      capabilities: [
        { icon: FileCode2, label: 'Code Playground', description: 'HTML/CSS/JS editor', href: '/tools/code-playground', color: 'text-blue-400' },
        { icon: FileCode2, label: 'JSON Formatter', description: 'Format & validate JSON', href: '/tools/json-formatter', color: 'text-green-400' },
        { icon: FileCode2, label: 'Regex Tester', description: 'Test regex patterns', href: '/tools/regex-tester', color: 'text-purple-400' },
        { icon: FileCode2, label: 'Base64 Tool', description: 'Encode/decode Base64', href: '/tools/base64-tool', color: 'text-cyan-400' },
        { icon: FileCode2, label: 'Hash Generator', description: 'Generate hash values', href: '/tools/hash-generator', color: 'text-amber-400' },
        { icon: Type, label: 'Markdown Editor', description: 'Live markdown preview', href: '/tools/markdown-editor', color: 'text-pink-400' },
        { icon: Type, label: 'Text Converter', description: 'Transform text cases', href: '/tools/text-converter', color: 'text-yellow-400' },
        { icon: Type, label: 'Lorem Generator', description: 'Generate placeholder text', href: '/tools/lorem-generator', color: 'text-orange-400' },
      ],
    },
    {
      title: 'Design Tools',
      icon: PenTool,
      color: 'from-pink-500 to-rose-500',
      capabilities: [
        { icon: Palette, label: 'Color Picker', description: 'Pick & analyze colors', href: '/tools/color-picker', color: 'text-pink-400' },
        { icon: Palette, label: 'Color Converter', description: 'Convert color formats', href: '/tools/color-converter', color: 'text-purple-400' },
        { icon: Palette, label: 'Gradient Generator', description: 'Create CSS gradients', href: '/tools/gradient-generator', color: 'text-cyan-400' },
        { icon: Palette, label: 'Palette Generator', description: 'Generate color palettes', href: '/tools/palette-generator', color: 'text-green-400' },
        { icon: PenTool, label: 'Box Shadow', description: 'CSS shadow generator', href: '/tools/box-shadow-generator', color: 'text-amber-400' },
        { icon: PenTool, label: 'Drawing Canvas', description: 'Digital drawing board', href: '/tools/drawing-canvas', color: 'text-blue-400' },
        { icon: Type, label: 'Emoji Picker', description: 'Browse all emojis', href: '/tools/emoji-picker', color: 'text-yellow-400' },
      ],
    },
    {
      title: 'Special Features',
      icon: Zap,
      color: 'from-cyan-400 to-purple-500',
      capabilities: [
        { icon: Terminal, label: 'Terminal', description: 'Built-in terminal emulator', href: '#terminal', color: 'text-green-400', isHot: true },
        { icon: Command, label: 'Command Palette', description: 'Quick navigation (⌘K)', href: '#command', color: 'text-cyan-400' },
        { icon: Keyboard, label: 'Shortcuts', description: 'Keyboard shortcuts (?)', href: '#shortcuts', color: 'text-purple-400' },
        { icon: Search, label: 'Semantic Search', description: 'AI-powered search', href: '#search', color: 'text-pink-400' },
        { icon: Bot, label: 'AI Assistant', description: 'Chat with AI assistant', href: '#chatbot', color: 'text-amber-400', isHot: true },
        { icon: Music, label: 'Music Visualizer', description: 'Audio visualization', href: '/tools/music-visualizer', color: 'text-blue-400' },
        { icon: CloudSun, label: 'Weather Widget', description: 'Check weather', href: '/tools/weather-widget', color: 'text-cyan-400' },
        { icon: Keyboard, label: 'Typing Test', description: 'Test typing speed', href: '/tools/typing-test', color: 'text-green-400' },
      ],
    },
  ]

  // Scroll detection
  useEffect(() => {
    if (hasShown) return

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const clientHeight = window.innerHeight

      // Trigger when user has scrolled to 85% of the page
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight

      if (scrollPercentage > 0.85 && !hasShown) {
        setIsOpen(true)
        setHasShown(true)
        // Store in sessionStorage so it doesn't show again this session
        sessionStorage.setItem('capabilitiesPopupShown', 'true')
      }
    }

    // Check if already shown this session
    const alreadyShown = sessionStorage.getItem('capabilitiesPopupShown')
    if (alreadyShown) {
      setHasShown(true)
      return
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasShown])

  // Reset hasShown when navigating to different page
  useEffect(() => {
    // Reset only on page change, not on initial load
    const alreadyShown = sessionStorage.getItem('capabilitiesPopupShown')
    if (!alreadyShown) {
      setHasShown(false)
    }
  }, [pathname])

  const handleNavigate = useCallback((href: string) => {
    setIsOpen(false)

    // Handle special features that aren't real routes
    if (href === '#terminal') {
      // Trigger terminal
      const event = new KeyboardEvent('keydown', { key: 't' })
      document.dispatchEvent(event)
      return
    }
    if (href === '#command') {
      // Trigger command palette
      const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
      document.dispatchEvent(event)
      return
    }
    if (href === '#shortcuts') {
      // Trigger shortcuts dialog
      const event = new KeyboardEvent('keydown', { key: '?' })
      document.dispatchEvent(event)
      return
    }
    if (href === '#search' || href === '#chatbot') {
      // These would need custom event handling
      return
    }

    router.push(href)
  }, [router])

  const totalCapabilities = categories.reduce((acc, cat) => acc + cat.capabilities.length, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-12 z-50 flex items-center justify-center"
          >
            <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl">
              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse-glow" />

              {/* Glow effects */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse animation-delay-500" />

              {/* Content */}
              <div className="relative z-10 p-6 md:p-8 max-h-[90vh] overflow-y-auto no-scrollbar">
                {/* Close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-20"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring' }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 mb-4 shadow-lg shadow-purple-500/25"
                  >
                    <Map className="h-8 w-8 text-white" />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-2xl md:text-3xl font-bold mb-2"
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                      Want to see my maximum capabilities?
                    </span>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground max-w-2xl mx-auto"
                  >
                    Explore the full ecosystem of{' '}
                    <span className="text-cyan-400 font-semibold">{totalCapabilities}+ features</span>{' '}
                    including AI tools, games, utilities, and more.
                    This is your personal super app navigation map.
                  </motion.p>

                  {/* Quick stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex flex-wrap items-center justify-center gap-4 mt-4"
                  >
                    {[
                      { label: 'AI Tools', count: 17, color: 'text-purple-400' },
                      { label: 'Games', count: 10, color: 'text-green-400' },
                      { label: 'Utilities', count: 70, color: 'text-amber-400' },
                      { label: 'Features', count: totalCapabilities, color: 'text-cyan-400' },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                        <span className={cn('font-bold', stat.color)}>{stat.count}+</span>
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Category tabs */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-2 justify-center mb-6"
                >
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-all',
                      activeCategory === null
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.title}
                      onClick={() => setActiveCategory(category.title === activeCategory ? null : category.title)}
                      className={cn(
                        'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2',
                        activeCategory === category.title
                          ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <category.icon className="h-4 w-4" />
                      {category.title}
                    </button>
                  ))}
                </motion.div>

                {/* Categories grid */}
                <div className="space-y-6">
                  {categories
                    .filter((cat) => !activeCategory || cat.title === activeCategory)
                    .map((category, catIndex) => (
                      <motion.div
                        key={category.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 + catIndex * 0.05 }}
                        className="relative"
                      >
                        {/* Category header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className={cn(
                            'p-2 rounded-xl bg-gradient-to-br shadow-lg',
                            category.color
                          )}>
                            <category.icon className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {category.title}
                          </h3>
                          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                          <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted/50">
                            {category.capabilities.length} items
                          </span>
                        </div>

                        {/* Capabilities grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
                          {category.capabilities.map((capability, capIndex) => (
                            <motion.button
                              key={capability.label}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4 + catIndex * 0.05 + capIndex * 0.02 }}
                              onClick={() => handleNavigate(capability.href)}
                              className="group relative p-3 md:p-4 rounded-xl bg-muted/30 hover:bg-muted/60 border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 text-left"
                            >
                              {/* Badges */}
                              {capability.isNew && (
                                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-green-500 text-white">
                                  NEW
                                </span>
                              )}
                              {capability.isHot && (
                                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse">
                                  HOT
                                </span>
                              )}

                              <div className="flex items-start gap-3">
                                <capability.icon className={cn('h-5 w-5 shrink-0 mt-0.5', capability.color)} />
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                                    {capability.label}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate mt-0.5 hidden md:block">
                                    {capability.description}
                                  </p>
                                </div>
                              </div>

                              {/* Hover arrow */}
                              <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                </div>

                {/* Footer CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 pt-6 border-t border-border/50"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MousePointerClick className="h-5 w-5 text-cyan-400" />
                      <span className="text-sm">
                        Click any item to explore, or press{' '}
                        <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">⌘K</kbd>{' '}
                        for quick navigation
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleNavigate('/tools')}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 hover:bg-muted text-sm font-medium text-foreground transition-all hover:-translate-y-0.5"
                      >
                        <Rocket className="h-4 w-4" />
                        All 70+ Tools
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </button>

                      <button
                        onClick={() => handleNavigate('/ai-tools')}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white text-sm font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:-translate-y-0.5"
                      >
                        <Sparkles className="h-4 w-4" />
                        Explore AI Hub
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

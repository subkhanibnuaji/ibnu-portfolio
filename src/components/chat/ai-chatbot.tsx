'use client'

import { useState, useRef, useEffect, useCallback, useMemo, useTransition, memo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  Bot, X, Send, User, Trash2, Sparkles, Brain, Zap, Loader2, Wand2,
  Home, FolderKanban, Award, BookOpen, Mail, Star, User as UserIcon,
  MessageSquare, FileText, Cpu, ImageIcon as ImageOff, Palette, Hand, Camera, Globe2, Mic, Volume2, Type, CloudSun,
  Gamepad2, Calculator, Clock, Timer, QrCode, CheckSquare, StickyNote, Wallet,
  FileCode2, PenTool, Music, Terminal, Command, Keyboard, Search, Bot as BotIcon,
  ChevronRight, ArrowLeft, Grid3X3, Rocket, Settings, Phone,
  Download, Copy, Check, ThumbsUp, ThumbsDown, RotateCcw, History, MicOff,
  Minimize2, Maximize2, Share2, ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { generatePDF, generatePPT, type PDFData, type PPTData } from '@/lib/ai/file-generators'

// ============================================
// PERFORMANCE UTILITIES
// ============================================

// Batched state updater using requestAnimationFrame to prevent INP issues
class StreamingBuffer {
  private buffer: string = ''
  private rafId: number | null = null
  private callback: ((content: string) => void) | null = null

  setCallback(cb: (content: string) => void) {
    this.callback = cb
  }

  append(chunk: string) {
    this.buffer += chunk
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => {
        if (this.callback && this.buffer) {
          this.callback(this.buffer)
          this.buffer = ''
        }
        this.rafId = null
      })
    }
  }

  flush() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    if (this.callback && this.buffer) {
      this.callback(this.buffer)
      this.buffer = ''
    }
  }

  clear() {
    this.buffer = ''
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }
}

// Throttle utility for scroll handlers
function throttle<T extends (...args: Parameters<T>) => void>(
  func: T,
  limit: number
): T {
  let inThrottle = false
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }) as T
}

type ChatMode = 'quick' | 'ai' | 'agent'

interface ToolExecution {
  tool: string
  input: Record<string, unknown>
  result?: string
  isLoading?: boolean
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  quickReplies?: QuickReply[]
  toolExecutions?: ToolExecution[]
  images?: string[]
  feedback?: 'up' | 'down' | null
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  mode: ChatMode
  createdAt: Date
  updatedAt: Date
}

// Parse special results (images, QR codes, files)
type ResultType = 'text' | 'image' | 'qr' | 'pdf' | 'ppt'

interface ParsedResult {
  type: ResultType
  content: string
  meta?: string
  data?: PDFData | PPTData
}

function parseSpecialResult(result: string): ParsedResult {
  if (result.startsWith('IMAGE_GENERATED:')) {
    const parts = result.replace('IMAGE_GENERATED:', '').split('|')
    return { type: 'image', content: parts[0], meta: parts[1] }
  }
  if (result.startsWith('QR_GENERATED:')) {
    const parts = result.replace('QR_GENERATED:', '').split('|')
    return { type: 'qr', content: parts[0], meta: parts[1] }
  }
  if (result.startsWith('PDF_GENERATE:')) {
    try {
      const data = JSON.parse(result.replace('PDF_GENERATE:', ''))
      return { type: 'pdf', content: '', data }
    } catch {
      return { type: 'text', content: result }
    }
  }
  if (result.startsWith('PPT_GENERATE:')) {
    try {
      const data = JSON.parse(result.replace('PPT_GENERATE:', ''))
      return { type: 'ppt', content: '', data }
    } catch {
      return { type: 'text', content: result }
    }
  }
  return { type: 'text', content: result }
}

// Handle file generation (async for PPT which uses API)
async function handleFileGeneration(result: string): Promise<boolean> {
  const parsed = parseSpecialResult(result)
  if (parsed.type === 'pdf' && parsed.data) {
    await generatePDF(parsed.data as PDFData)
    return true
  }
  if (parsed.type === 'ppt' && parsed.data) {
    try {
      await generatePPT(parsed.data as PPTData)
      return true
    } catch (error) {
      console.error('PPT generation failed:', error)
      return false
    }
  }
  return false
}

interface QuickReply {
  label: string
  value: string
}

// Quick Tool Categories - Comprehensive
interface QuickTool {
  icon: React.ElementType
  label: string
  description: string
  href?: string
  action?: string
  color: string
  isNew?: boolean
  isHot?: boolean
}

interface QuickCategory {
  id: string
  title: string
  icon: React.ElementType
  color: string
  gradient: string
  tools: QuickTool[]
}

const QUICK_CATEGORIES: QuickCategory[] = [
  {
    id: 'pages',
    title: 'Main Pages',
    icon: Home,
    color: 'text-cyan-400',
    gradient: 'from-cyan-500 to-blue-500',
    tools: [
      { icon: Home, label: 'Home', description: 'Main homepage', href: '/', color: 'text-cyan-400' },
      { icon: UserIcon, label: 'About', description: 'About me & timeline', href: '/about', color: 'text-blue-400' },
      { icon: FolderKanban, label: 'Projects', description: 'Portfolio gallery', href: '/projects', color: 'text-purple-400' },
      { icon: BookOpen, label: 'Blog', description: 'Articles & insights', href: '/blog', color: 'text-pink-400' },
      { icon: Award, label: 'Credentials', description: '50+ certifications', href: '/certifications', color: 'text-amber-400' },
      { icon: Star, label: 'Interests', description: 'AI, Blockchain, Security', href: '/interests', color: 'text-yellow-400' },
      { icon: Mail, label: 'Contact', description: 'Get in touch', href: '/contact', color: 'text-green-400' },
      { icon: Phone, label: 'Mobile App', description: 'Download Android app', href: '/mobile', color: 'text-emerald-400' },
    ],
  },
  {
    id: 'ai-tools',
    title: 'AI Tools',
    icon: Brain,
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-pink-500',
    tools: [
      { icon: MessageSquare, label: 'LLM Chat', description: 'Chat with AI', href: '/ai-tools/llm', color: 'text-purple-400', isHot: true },
      { icon: FileText, label: 'RAG System', description: 'Upload & ask docs', href: '/ai-tools/rag', color: 'text-pink-400', isNew: true },
      { icon: Cpu, label: 'AI Agent', description: 'Agent with tools', href: '/ai-tools/agent', color: 'text-cyan-400', isHot: true },
      { icon: ImageOff, label: 'BG Removal', description: 'Remove backgrounds', href: '/ai-tools/background-removal', color: 'text-green-400' },
      { icon: Palette, label: 'Color Extract', description: 'Extract image colors', href: '/ai-tools/color-extractor', color: 'text-amber-400' },
      { icon: Wand2, label: 'Style Transfer', description: 'Neural style transfer', href: '/ai-tools/style-transfer', color: 'text-purple-400' },
      { icon: Hand, label: 'Hand Gesture', description: 'Hand tracking', href: '/ai-tools/hand-gesture', color: 'text-blue-400' },
      { icon: Camera, label: 'Face Landmark', description: 'Face detection', href: '/ai-tools/face-landmark', color: 'text-pink-400' },
      { icon: Camera, label: 'Object Detection', description: 'COCO-SSD detection', href: '/ai-tools/object-detection', color: 'text-cyan-400' },
      { icon: Camera, label: 'Pose Estimation', description: 'Body pose tracking', href: '/ai-tools/pose-estimation', color: 'text-green-400' },
      { icon: Globe2, label: 'Language Detect', description: 'Detect language', href: '/ai-tools/language-detector', color: 'text-amber-400' },
      { icon: Type, label: 'Sentiment', description: 'Analyze sentiment', href: '/ai-tools/sentiment-analysis', color: 'text-rose-400' },
      { icon: FileText, label: 'Summarizer', description: 'AI summarization', href: '/ai-tools/text-summarizer', color: 'text-blue-400' },
      { icon: CloudSun, label: 'Word Cloud', description: 'Generate word clouds', href: '/ai-tools/word-cloud', color: 'text-purple-400' },
      { icon: Mic, label: 'Speech to Text', description: 'Audio transcription', href: '/ai-tools/speech-to-text', color: 'text-cyan-400' },
      { icon: Volume2, label: 'Text to Speech', description: 'TTS synthesis', href: '/ai-tools/text-to-speech', color: 'text-green-400' },
      { icon: QrCode, label: 'QR Scanner', description: 'Scan QR codes', href: '/ai-tools/qr-scanner', color: 'text-amber-400' },
    ],
  },
  {
    id: 'games',
    title: 'Games',
    icon: Gamepad2,
    color: 'text-green-400',
    gradient: 'from-green-500 to-emerald-500',
    tools: [
      { icon: Gamepad2, label: 'Snake', description: 'Classic snake', href: '/tools/snake-game', color: 'text-green-400' },
      { icon: Gamepad2, label: 'Tetris', description: 'Block puzzle', href: '/tools/tetris-game', color: 'text-cyan-400' },
      { icon: Gamepad2, label: '2048', description: 'Number puzzle', href: '/tools/2048-game', color: 'text-amber-400' },
      { icon: Gamepad2, label: 'Sudoku', description: 'Number logic', href: '/tools/sudoku', color: 'text-blue-400' },
      { icon: Gamepad2, label: 'Minesweeper', description: 'Mine finder', href: '/tools/minesweeper', color: 'text-red-400' },
      { icon: Gamepad2, label: 'Memory Game', description: 'Card matching', href: '/tools/memory-game', color: 'text-purple-400' },
      { icon: Gamepad2, label: 'Tic Tac Toe', description: 'X and O', href: '/tools/tic-tac-toe', color: 'text-pink-400' },
      { icon: Gamepad2, label: 'Connect Four', description: '4-in-a-row', href: '/tools/connect-four', color: 'text-yellow-400' },
      { icon: Gamepad2, label: 'Hangman', description: 'Word guess', href: '/tools/hangman', color: 'text-orange-400' },
      { icon: Gamepad2, label: 'Simon Says', description: 'Memory sequence', href: '/tools/simon-says', color: 'text-emerald-400' },
    ],
  },
  {
    id: 'utilities',
    title: 'Utilities',
    icon: Calculator,
    color: 'text-amber-400',
    gradient: 'from-amber-500 to-orange-500',
    tools: [
      { icon: Calculator, label: 'Calculator', description: 'Scientific calc', href: '/tools/calculator', color: 'text-amber-400' },
      { icon: Calculator, label: 'Unit Converter', description: 'Convert units', href: '/tools/unit-converter', color: 'text-blue-400' },
      { icon: Wallet, label: 'Currency', description: 'Currency converter', href: '/tools/currency-converter', color: 'text-green-400' },
      { icon: Clock, label: 'World Clock', description: 'Time zones', href: '/tools/world-clock', color: 'text-cyan-400' },
      { icon: Timer, label: 'Pomodoro', description: 'Focus timer', href: '/tools/pomodoro', color: 'text-red-400' },
      { icon: Timer, label: 'Countdown', description: 'Countdown timer', href: '/tools/countdown-timer', color: 'text-purple-400' },
      { icon: QrCode, label: 'QR Generator', description: 'Create QR codes', href: '/tools/qr-generator', color: 'text-pink-400' },
      { icon: CheckSquare, label: 'Checklist', description: 'Task checklist', href: '/tools/checklist', color: 'text-emerald-400' },
      { icon: StickyNote, label: 'Notes', description: 'Quick notes', href: '/tools/notes-app', color: 'text-yellow-400' },
      { icon: Wallet, label: 'Expense', description: 'Track expenses', href: '/tools/expense-tracker', color: 'text-orange-400' },
    ],
  },
  {
    id: 'dev-tools',
    title: 'Developer',
    icon: FileCode2,
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-indigo-500',
    tools: [
      { icon: FileCode2, label: 'Code Editor', description: 'HTML/CSS/JS', href: '/tools/code-playground', color: 'text-blue-400' },
      { icon: FileCode2, label: 'JSON Format', description: 'Format JSON', href: '/tools/json-formatter', color: 'text-green-400' },
      { icon: FileCode2, label: 'Regex Tester', description: 'Test regex', href: '/tools/regex-tester', color: 'text-purple-400' },
      { icon: FileCode2, label: 'Base64', description: 'Encode/decode', href: '/tools/base64-tool', color: 'text-cyan-400' },
      { icon: FileCode2, label: 'Hash Gen', description: 'Generate hash', href: '/tools/hash-generator', color: 'text-amber-400' },
      { icon: Type, label: 'Markdown', description: 'Markdown editor', href: '/tools/markdown-editor', color: 'text-pink-400' },
      { icon: Type, label: 'Text Convert', description: 'Transform text', href: '/tools/text-converter', color: 'text-yellow-400' },
      { icon: Type, label: 'Lorem Gen', description: 'Placeholder text', href: '/tools/lorem-generator', color: 'text-orange-400' },
    ],
  },
  {
    id: 'design',
    title: 'Design',
    icon: PenTool,
    color: 'text-pink-400',
    gradient: 'from-pink-500 to-rose-500',
    tools: [
      { icon: Palette, label: 'Color Picker', description: 'Pick colors', href: '/tools/color-picker', color: 'text-pink-400' },
      { icon: Palette, label: 'Color Convert', description: 'Convert colors', href: '/tools/color-converter', color: 'text-purple-400' },
      { icon: Palette, label: 'Gradient', description: 'CSS gradients', href: '/tools/gradient-generator', color: 'text-cyan-400' },
      { icon: Palette, label: 'Palette Gen', description: 'Color palettes', href: '/tools/palette-generator', color: 'text-green-400' },
      { icon: PenTool, label: 'Box Shadow', description: 'CSS shadows', href: '/tools/box-shadow-generator', color: 'text-amber-400' },
      { icon: PenTool, label: 'Drawing', description: 'Drawing board', href: '/tools/drawing-canvas', color: 'text-blue-400' },
      { icon: Type, label: 'Emoji Picker', description: 'Browse emojis', href: '/tools/emoji-picker', color: 'text-yellow-400' },
    ],
  },
  {
    id: 'special',
    title: 'Special Features',
    icon: Zap,
    color: 'text-cyan-400',
    gradient: 'from-cyan-400 to-purple-500',
    tools: [
      { icon: Terminal, label: 'Terminal', description: 'Built-in terminal', action: 'terminal', color: 'text-green-400', isHot: true },
      { icon: Command, label: 'Command Palette', description: 'Quick nav (⌘K)', action: 'command', color: 'text-cyan-400' },
      { icon: Keyboard, label: 'Shortcuts', description: 'Keyboard help (?)', action: 'shortcuts', color: 'text-purple-400' },
      { icon: Search, label: 'Search', description: 'Search site', action: 'search', color: 'text-pink-400' },
      { icon: BotIcon, label: 'AI Chat', description: 'Chat with AI', action: 'ai-mode', color: 'text-amber-400', isHot: true },
      { icon: Music, label: 'Music Visualizer', description: 'Audio visuals', href: '/tools/music-visualizer', color: 'text-blue-400' },
      { icon: CloudSun, label: 'Weather', description: 'Check weather', href: '/tools/weather-widget', color: 'text-cyan-400' },
      { icon: Keyboard, label: 'Typing Test', description: 'Test speed', href: '/tools/typing-test', color: 'text-green-400' },
      { icon: Rocket, label: 'All 70+ Tools', description: 'Browse all tools', href: '/tools', color: 'text-orange-400' },
      { icon: Settings, label: 'All AI Tools', description: 'Browse AI tools', href: '/ai-tools', color: 'text-purple-400' },
    ],
  },
]

// Suggested prompts for different modes
const SUGGESTED_PROMPTS = {
  quick: [
    "Tell me about Ibnu's background",
    "What projects has he worked on?",
    "What are his technical skills?",
    "How can I contact him?",
  ],
  ai: [
    "Explain machine learning in simple terms",
    "What's the difference between AI and ML?",
    "Help me write a professional email",
    "Summarize the key trends in tech",
  ],
  agent: [
    "Generate an image of a futuristic city",
    "Create a QR code for my website",
    "What's the current price of Bitcoin?",
    "Calculate 15% tip on $85",
  ],
}

// Knowledge base for pattern matching
const knowledgeBase = {
  greetings: {
    patterns: ['hi', 'hello', 'hey', 'halo', 'hai', 'good morning', 'good afternoon', 'good evening', 'howdy', 'sup', 'apa kabar', 'selamat'],
    response: "Hi there! I'm Ibnu's portfolio assistant. I can help you learn about his background, projects, skills, and interests. What would you like to know?",
    quickReplies: [
      { label: 'About Ibnu', value: 'Tell me about Ibnu' },
      { label: 'Projects', value: 'What projects has he worked on?' },
      { label: 'Skills', value: 'What are his skills?' }
    ]
  },
  about: {
    patterns: ['about', 'who is', 'introduce', 'background', 'tell me about ibnu', 'who are you', 'siapa', 'profil', 'profile'],
    response: `**Subkhan Ibnu Aji, S.Kom., M.B.A.**

I'm a cross-functional professional currently working as a Civil Servant (ASN) at Indonesia's Ministry of Housing & Settlement Areas.

**Background:**
- Senior Executive MBA from Universitas Gadjah Mada (UGM)
- Bachelor in Informatics from Telkom University
- 5+ years of experience in tech and consulting`,
    quickReplies: [
      { label: 'Education', value: 'Tell me about your education' },
      { label: 'Experience', value: 'What is your work experience?' },
      { label: 'Interests', value: 'What are your interests?' }
    ]
  },
  skills: {
    patterns: ['skill', 'technology', 'tech stack', 'programming', 'framework', 'tools', 'expertise', 'kemampuan', 'keahlian'],
    response: `**Technical Skills:**

**Programming:** Python (90%), JavaScript (85%), TypeScript (80%), SQL (85%), Solidity (70%)

**Frameworks:** React/Next.js (85%), Node.js (80%), FastAPI (70%), LangChain (75%), TailwindCSS (85%)

**AI/ML:** LLM Workflows (85%), Prompt Engineering (90%), Agentic AI (80%), RAG Systems (75%)

**Blockchain:** DeFi Protocols (80%), Smart Contracts (70%), On-chain Analysis (75%)`,
    quickReplies: [
      { label: 'Certifications', value: 'What certifications do you have?' },
      { label: 'AI Skills', value: 'Tell me about your AI experience' }
    ]
  },
  projects: {
    patterns: ['project', 'portfolio', 'work on', 'built', 'develop', 'proyek'],
    response: `**Key Projects:**

1. **HUB PKP (Klinik Rumah)** - Digital platform for Indonesia's self-built housing program
2. **SIBARU** - Enterprise information system for ministry
3. **SIMONI** - Housing program monitoring system
4. **RPA Solutions** - 100+ bots for 10+ clients
5. **This Portfolio** - Next.js 15, AI chatbot, Terminal emulator`,
    quickReplies: [
      { label: 'Tech Stack', value: 'What technologies do you use?' },
      { label: 'AI Projects', value: 'Tell me about AI projects' }
    ]
  },
  interests: {
    patterns: ['interest', 'passion', 'focus', 'specialization', 'minat'],
    response: `**Three Core Interests:**

1. **Artificial Intelligence** - Agentic AI, LLM Workflows, RAG Systems
2. **Crypto & Blockchain** - DeFi, On-chain Analysis, Smart Contracts
3. **Cybersecurity** - Defensive Security, OSINT, Web App Security`,
    quickReplies: [
      { label: 'AI Details', value: 'Tell me more about your AI work' },
      { label: 'Crypto', value: 'Tell me about crypto experience' }
    ]
  },
  certifications: {
    patterns: ['certification', 'certificate', 'credential', 'course', 'harvard', 'stanford', 'google', 'ibm', 'mckinsey', 'sertifikat'],
    response: `**50+ Certifications from:**

**Elite Universities:** Harvard, Stanford, Cambridge, INSEAD, Wharton
**Tech Giants:** Google, IBM, AWS, Meta
**Consulting Firms:** McKinsey, BCG, Deloitte, PwC, EY, KPMG

Visit **/certifications** to see all credentials!`,
    quickReplies: [
      { label: 'View All Certs', value: 'Navigate to certifications' },
      { label: 'Skills', value: 'What skills do you have?' }
    ]
  },
  contact: {
    patterns: ['contact', 'email', 'reach', 'hire', 'connect', 'work together', 'hubungi', 'kontak'],
    response: `**Let's Connect!**

- Email: hi@heyibnu.com
- GitHub: github.com/subkhanibnuaji
- LinkedIn: linkedin.com/in/subkhanibnuaji
- Twitter: @subkhanibnuaji

Visit the **Contact** page to send a message directly!`,
    quickReplies: [
      { label: 'Go to Contact', value: 'Navigate to contact page' },
      { label: 'Download Resume', value: 'How can I download your resume?' }
    ]
  },
  resume: {
    patterns: ['resume', 'cv', 'curriculum vitae', 'download cv', 'download resume'],
    response: `**Resume / CV**

You can download Ibnu's resume from the **About** page!

**What's Included:**
- Complete work experience
- Education details
- Technical skills
- Certifications summary
- Contact information

**Quick Stats:**
- 5+ Years Experience
- 50+ Projects
- 2 Degrees (MBA + S.Kom)
- 50+ Certifications

Visit **/about** and scroll to the Resume section to download!`,
    quickReplies: [
      { label: 'Go to About', value: 'Navigate to about page' },
      { label: 'Experience', value: 'Tell me about your experience' }
    ]
  },
  newsletter: {
    patterns: ['newsletter', 'subscribe', 'update', 'langganan', 'berlangganan'],
    response: `**Newsletter Subscription**

Stay updated with Ibnu's latest:
- Tech articles and insights
- Project updates
- AI/Blockchain/Cybersecurity content
- Career tips

**How to Subscribe:**
Look for the newsletter form in the website footer, or visit the blog page!

**Topics Covered:**
Tech, AI/ML, Web3, Career, Projects

No spam, unsubscribe anytime.`,
    quickReplies: [
      { label: 'Blog', value: 'Where is the blog?' },
      { label: 'Contact', value: 'How can I contact you?' }
    ]
  },
  languages: {
    patterns: ['language', 'bahasa', 'english', 'indonesian', 'mandarin', 'arabic', 'toefl'],
    response: `**Language Proficiency:**

1. **Indonesian** - Native Speaker
   - First language

2. **English** - Advanced (C1)
   - TOEFL ITP: 593
   - Professional working proficiency

3. **Arabic** - Beginner
   - Basic reading (Quran)

4. **Mandarin** - Beginner
   - HSK Level 1 certified

Currently focused on improving English for international opportunities and Mandarin for business in Asia.`,
    quickReplies: [
      { label: 'Education', value: 'Tell me about your education' },
      { label: 'Certifications', value: 'What certifications?' }
    ]
  },
  navigation: {
    patterns: ['page', 'navigate', 'go to', 'where', 'find', 'see all', 'halaman'],
    response: `**Website Navigation:**

- **/about** - Timeline, education, experience, resume
- **/projects** - All projects showcase
- **/interests** - AI, Blockchain, Cybersecurity deep-dive
- **/certifications** - 50+ credentials
- **/contact** - Send me a message
- **/blog** - Articles and insights
- **/simple-llm** - Chat with AI (LangChain)

**Keyboard Shortcuts:**
- Press **Cmd+K** (or Ctrl+K) to open command palette
- Press **T** to open terminal emulator
- Press **Esc** to close modals`,
    quickReplies: [
      { label: 'About Page', value: 'What can I find on the About page?' },
      { label: 'Terminal', value: 'How do I use the terminal?' }
    ]
  },
  terminal: {
    patterns: ['terminal', 'command', 'cli', 'shell', 'console'],
    response: `**Interactive Terminal**

Press **T** or click the Terminal button to open an interactive terminal emulator!

**Popular Commands:**
- \`help\` - Show all commands
- \`about\` - About Ibnu
- \`skills\` - List all skills
- \`projects\` - View projects
- \`crypto\` - Crypto portfolio info
- \`contact\` - Contact info
- \`neofetch\` - System info ASCII art
- \`matrix\` - Fun easter egg!
- \`clear\` - Clear screen

Try typing \`help\` in the terminal for a full list of 40+ commands.`,
    quickReplies: [
      { label: 'Open Terminal', value: 'How do I open the terminal?' }
    ]
  },
  website: {
    patterns: ['website', 'portfolio', 'built with', 'stack', 'next.js', 'this site', 'web ini'],
    response: `**This Portfolio Website**

Built with modern technologies:

**Frontend:**
- Next.js 15 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animations)

**Features:**
- AI Chatbot (you're using it now!)
- Interactive Terminal Emulator
- Command Palette (Cmd+K)
- Dark Theme
- Responsive Design
- Newsletter Subscription
- Contact Form with Email

**Backend:**
- Prisma ORM
- PostgreSQL (Neon)
- NextAuth.js
- Resend (emails)

Built with modern best practices!`,
    quickReplies: [
      { label: 'Skills', value: 'What are your skills?' },
      { label: 'Projects', value: 'What projects have you built?' }
    ]
  },
  funfacts: {
    patterns: ['fun fact', 'interesting', 'hobi', 'hobby', 'free time', 'waktu luang', 'menarik'],
    response: `**Fun Facts About Ibnu:**

- Started coding at 16, built first website in high school
- Founded a startup while still in university
- Can read Arabic (basic) and learning Mandarin
- Crypto enthusiast since 2021 bull run
- Love exploring new AI tools and frameworks
- Terminal and CLI enthusiast (hence the terminal feature!)
- Believe in "learn by building" philosophy
- Coffee > Tea (definitely)
- Based in Jakarta, Indonesia

**Motto:** "Technology should serve humanity, not the other way around."`,
    quickReplies: [
      { label: 'About', value: 'Tell me more about Ibnu' },
      { label: 'Interests', value: 'What are your interests?' }
    ]
  },
  thanks: {
    patterns: ['thank', 'thanks', 'terima kasih', 'makasih', 'appreciate', 'helpful'],
    response: `You're welcome! I'm glad I could help.

Feel free to ask more questions about:
- Ibnu's background and experience
- Projects and technical work
- Skills and certifications
- Contact information

Or explore the website:
- Use **Cmd+K** for quick navigation
- Press **T** for the terminal
- Check out the **Projects** page

Is there anything else you'd like to know?`,
    quickReplies: [
      { label: 'Contact', value: 'How can I contact you?' },
      { label: 'Projects', value: 'Show me the projects' }
    ]
  },
  bye: {
    patterns: ['bye', 'goodbye', 'see you', 'sampai jumpa', 'dadah', 'later'],
    response: `Goodbye! Thanks for chatting with me.

**Before you go:**
- Subscribe to the newsletter for updates
- Connect on LinkedIn: /in/subkhanibnuaji
- Check out the Projects page
- Download the resume from About page

Feel free to come back anytime! The chat will be here.

Have a great day!`,
    quickReplies: [
      { label: 'Stay', value: 'Actually, I have more questions' },
      { label: 'Newsletter', value: 'How do I subscribe?' }
    ]
  },
  currentrole: {
    patterns: ['current', 'now', 'sekarang', 'saat ini', 'hari ini', 'present'],
    response: `**Current Role (Aug 2024 - Present)**

**Civil Servant (ASN)** at Ministry of Housing & Settlement Areas (Kementerian PKP)

**Responsibilities:**
- Managing end-to-end delivery of enterprise IT applications
- Lead development of HUB PKP digital housing ecosystem
- Coordinate vendor delivery and user adoption
- Support ministerial policy drafting
- Evaluate procurement proposals >IDR 10B

**Key Projects:**
- HUB PKP (Klinik Rumah) - Digital housing platform
- SIBARU - Enterprise information system
- SIMONI - Monitoring & evaluation system

Located in Jakarta, Indonesia.`,
    quickReplies: [
      { label: 'HUB PKP', value: 'Tell me about HUB PKP' },
      { label: 'Previous Jobs', value: 'What did you do before?' }
    ]
  },
  default: {
    response: "I'm not sure about that. I can help you with:\n\n- **Background** - Education, experience, skills\n- **Projects** - Portfolio and work\n- **Interests** - AI, Blockchain, Cybersecurity\n- **Contact** - How to reach Ibnu\n\nOr use the **Quick Menu** for direct access to all features!",
    quickReplies: [
      { label: 'About Ibnu', value: 'Tell me about Ibnu' },
      { label: 'Projects', value: 'What projects has he worked on?' },
      { label: 'Quick Menu', value: 'Show quick menu' }
    ]
  }
}

// Find matching response based on user input
function findResponse(input: string): { response: string; quickReplies?: QuickReply[] } {
  const lowerInput = input.toLowerCase()

  for (const [key, data] of Object.entries(knowledgeBase)) {
    if (key === 'default') continue
    const hasPatterns = 'patterns' in data
    if (hasPatterns && data.patterns.some(pattern => lowerInput.includes(pattern))) {
      return { response: data.response, quickReplies: data.quickReplies }
    }
  }

  return {
    response: knowledgeBase.default.response,
    quickReplies: knowledgeBase.default.quickReplies
  }
}

// Initial quick reply options
const INITIAL_QUICK_REPLIES: QuickReply[] = [
  { label: 'About Ibnu', value: 'Tell me about Ibnu' },
  { label: 'Projects', value: 'What projects has he worked on?' },
  { label: 'Skills & Tech', value: 'What are his skills?' },
  { label: 'Quick Menu', value: 'Show quick menu' }
]

// LocalStorage keys
const STORAGE_KEYS = {
  CHAT_HISTORY: 'ibnu-chat-history',
  CURRENT_SESSION: 'ibnu-chat-current-session',
}

// Typing Indicator Component
function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-4 py-3">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-muted-foreground/50"
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground ml-2">IbnuGPT is typing...</span>
    </div>
  )
}

// Quick Tool Picker Component
function QuickToolPicker({
  onNavigate,
  onAction,
  onClose
}: {
  onNavigate: (href: string) => void
  onAction: (action: string) => void
  onClose: () => void
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedCategoryData = QUICK_CATEGORIES.find(c => c.id === selectedCategory)

  // Filter tools based on search
  const filteredCategories = searchQuery
    ? QUICK_CATEGORIES.map(cat => ({
        ...cat,
        tools: cat.tools.filter(tool =>
          tool.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.tools.length > 0)
    : QUICK_CATEGORIES

  return (
    <div className="p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        {selectedCategory ? (
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Quick Actions</span>
          </div>
        )}
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      {!selectedCategory && (
        <div className="mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-muted/50 border-0 outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      )}

      {!selectedCategory ? (
        // Category Grid or Search Results
        searchQuery ? (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredCategories.map((category) => (
              <div key={category.id}>
                <div className="text-xs font-medium text-muted-foreground mb-1">{category.title}</div>
                {category.tools.map((tool, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (tool.href) onNavigate(tool.href)
                      else if (tool.action) onAction(tool.action)
                      onClose()
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                  >
                    <tool.icon className={cn("h-4 w-4", tool.color)} />
                    <span className="text-sm">{tool.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filteredCategories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl",
                  "bg-gradient-to-br opacity-90 hover:opacity-100",
                  category.gradient,
                  "text-white text-left transition-all"
                )}
              >
                <category.icon className="h-5 w-5" />
                <div>
                  <div className="text-sm font-medium">{category.title}</div>
                  <div className="text-[10px] opacity-80">{category.tools.length} items</div>
                </div>
              </motion.button>
            ))}
          </div>
        )
      ) : (
        // Tools List
        <div className="space-y-1 max-h-[300px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className={cn("p-1.5 rounded-lg bg-gradient-to-br", selectedCategoryData?.gradient)}>
              {selectedCategoryData && <selectedCategoryData.icon className="h-4 w-4 text-white" />}
            </div>
            <span className="font-semibold text-sm">{selectedCategoryData?.title}</span>
          </div>

          {selectedCategoryData?.tools.map((tool, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => {
                if (tool.href) onNavigate(tool.href)
                else if (tool.action) onAction(tool.action)
                onClose()
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors group text-left"
            >
              <tool.icon className={cn("h-4 w-4", tool.color)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{tool.label}</span>
                  {tool.isNew && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-green-500 text-white">NEW</span>
                  )}
                  {tool.isHot && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-gradient-to-r from-orange-500 to-red-500 text-white">HOT</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground truncate block">{tool.description}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </div>
      )}

      {/* Footer shortcuts */}
      {!selectedCategory && !searchQuery && (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Press ⌘K for command palette</span>
          <div className="flex gap-1">
            <button
              onClick={() => onAction('terminal')}
              className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
              title="Terminal"
            >
              <Terminal className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onAction('command')}
              className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
              title="Command Palette"
            >
              <Command className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onAction('ai-mode')}
              className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
              title="AI Chat"
            >
              <Brain className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Chat History Panel
function ChatHistoryPanel({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onClose,
}: {
  sessions: ChatSession[]
  currentSessionId: string | null
  onSelectSession: (session: ChatSession) => void
  onDeleteSession: (sessionId: string) => void
  onClose: () => void
}) {
  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Chat History</span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No chat history yet</p>
      ) : (
        <div className="space-y-1 max-h-[250px] overflow-y-auto">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors group",
                session.id === currentSessionId ? "bg-primary/10" : "hover:bg-muted/50"
              )}
              onClick={() => onSelectSession(session)}
            >
              <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(session.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteSession(session.id)
                }}
                className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-400 transition-all"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// MEMOIZED CHAT MESSAGE ITEM COMPONENT
// ============================================

interface ChatMessageItemProps {
  message: Message
  mode: ChatMode
}

const ChatMessageItem = memo(function ChatMessageItem({ message, mode }: ChatMessageItemProps) {
  return (
    <div
      className={cn(
        'flex gap-3',
        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
      )}
      style={{ contain: 'content' }} // CSS containment for performance
    >
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
          message.role === 'user'
            ? 'bg-primary'
            : mode === 'agent' ? 'bg-gradient-to-r from-pink-500 to-orange-500' : mode === 'ai' ? 'bg-cyber-purple' : 'bg-cyber-gradient'
        )}
      >
        {message.role === 'user' ? (
          <User className="h-4 w-4 text-white" />
        ) : mode === 'agent' ? (
          <Wand2 className="h-4 w-4 text-white" />
        ) : mode === 'ai' ? (
          <Brain className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5',
          message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
        style={{ contain: 'layout style' }} // CSS containment
      >
        {message.role === 'assistant' ? (
          <div className="text-sm space-y-2">
            {/* Tool Executions */}
            {message.toolExecutions && message.toolExecutions.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {message.toolExecutions.map((exec, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs bg-black/10 rounded-lg px-2 py-1.5">
                    {exec.isLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin text-orange-400" />
                    ) : (
                      <span className="text-green-400">✓</span>
                    )}
                    <span className="capitalize text-muted-foreground">{exec.tool.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Generated Images */}
            {message.images && message.images.length > 0 && (
              <div className="space-y-2 mb-2">
                {message.images.map((imgUrl, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden">
                    <Image
                      src={imgUrl}
                      alt="Generated image"
                      width={280}
                      height={280}
                      className="rounded-lg"
                      unoptimized
                      loading="lazy"
                    />
                    <a
                      href={imgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded hover:bg-black/70"
                    >
                      Open Full
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Text Content */}
            <div className="whitespace-pre-line">
              {message.content ? message.content.split('\n').map((line, i) => {
                // Handle bold text
                const parts = line.split(/(\*\*[^*]+\*\*)/g)
                return (
                  <p key={i} className={line.startsWith('-') || line.startsWith('•') ? 'ml-2' : ''}>
                    {parts.map((part, j) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j}>{part.slice(2, -2)}</strong>
                      }
                      return part
                    })}
                  </p>
                )
              }) : (
                !message.toolExecutions?.length && !message.images?.length && (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </span>
                )
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm">{message.content}</p>
        )}
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison for memo - only re-render if these change
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.toolExecutions?.length === nextProps.message.toolExecutions?.length &&
    prevProps.message.images?.length === nextProps.message.images?.length &&
    prevProps.mode === nextProps.mode
  )
})

// ============================================
// MAIN CHATBOT COMPONENT
// ============================================

export function AIChatbot() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [mode, setMode] = useState<ChatMode>('quick')
  const [showQuickPicker, setShowQuickPicker] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm Ibnu's portfolio assistant. I can help you learn about his background, projects, skills, and interests in AI, Blockchain, and Cybersecurity. What would you like to know?",
      timestamp: new Date(),
      quickReplies: INITIAL_QUICK_REPLIES
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Performance: useTransition for non-blocking updates
  const [, startTransition] = useTransition()

  // Performance: Streaming buffer for batched updates
  const streamingBufferRef = useRef(new StreamingBuffer())

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((result: any) => result[0].transcript)
          .join('')
        setInput(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }
    }
  }, [])

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY)
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions)
        setSessions(parsed.map((s: ChatSession) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt),
          messages: s.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) }))
        })))
      }
    } catch (e) {
      console.error('Failed to load chat history:', e)
    }
  }, [])

  // Save chat history to localStorage
  const saveToHistory = useCallback((msgs: Message[], sessionMode: ChatMode) => {
    if (msgs.length <= 1) return

    const sessionId = currentSessionId || `session-${Date.now()}`
    const title = msgs.find(m => m.role === 'user')?.content.slice(0, 30) || 'New Chat'

    const newSession: ChatSession = {
      id: sessionId,
      title: title + (title.length >= 30 ? '...' : ''),
      messages: msgs,
      mode: sessionMode,
      createdAt: currentSessionId
        ? sessions.find(s => s.id === currentSessionId)?.createdAt || new Date()
        : new Date(),
      updatedAt: new Date()
    }

    setSessions(prev => {
      const existing = prev.findIndex(s => s.id === sessionId)
      const updated = existing >= 0
        ? [...prev.slice(0, existing), newSession, ...prev.slice(existing + 1)]
        : [newSession, ...prev].slice(0, 20) // Keep last 20 sessions

      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(updated))
      return updated
    })

    if (!currentSessionId) {
      setCurrentSessionId(sessionId)
    }
  }, [currentSessionId, sessions])

  // Initialize messages on client-side only
  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hi! I'm Ibnu's portfolio assistant. I can help you learn about his background, projects, skills, and interests in AI, Blockchain, and Cybersecurity. What would you like to know?",
        timestamp: new Date(),
        quickReplies: INITIAL_QUICK_REPLIES
      }
    ])
  }, [])

  // Performance: Throttled scroll to bottom
  const scrollToBottom = useMemo(
    () =>
      throttle(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100),
    []
  )

  // Scroll on new messages (with transition for non-blocking)
  useEffect(() => {
    startTransition(() => {
      scrollToBottom()
    })
  }, [messages, scrollToBottom, isTyping])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  // Toggle voice input
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  // Copy message to clipboard
  const copyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (e) {
      console.error('Failed to copy:', e)
    }
  }

  // Export chat
  const exportChat = () => {
    const text = messages
      .map(m => `[${m.role.toUpperCase()}]: ${m.content}`)
      .join('\n\n')

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Handle feedback
  const handleFeedback = (messageId: string, feedback: 'up' | 'down') => {
    setMessages(prev => prev.map(m =>
      m.id === messageId
        ? { ...m, feedback: m.feedback === feedback ? null : feedback }
        : m
    ))
  }

  // Handle navigation
  const handleNavigate = useCallback((href: string) => {
    setIsOpen(false)
    router.push(href)
  }, [router])

  // Handle special actions
  const handleAction = useCallback((action: string) => {
    setShowQuickPicker(false)

    switch (action) {
      case 'terminal':
        setIsOpen(false)
        const terminalEvent = new KeyboardEvent('keydown', { key: 't' })
        document.dispatchEvent(terminalEvent)
        break
      case 'command':
        setIsOpen(false)
        const cmdEvent = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
        document.dispatchEvent(cmdEvent)
        break
      case 'shortcuts':
        setIsOpen(false)
        const shortcutEvent = new KeyboardEvent('keydown', { key: '?' })
        document.dispatchEvent(shortcutEvent)
        break
      case 'search':
        setIsOpen(false)
        const searchEvent = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
        document.dispatchEvent(searchEvent)
        break
      case 'ai-mode':
        setShowQuickPicker(false)
        switchMode('ai')
        break
    }
  }, [])

  // Cleanup streaming buffer on unmount
  useEffect(() => {
    return () => {
      streamingBufferRef.current.clear()
    }
  }, [])

  // Send message with AI mode (using Groq API) - OPTIMIZED with batched updates
  const sendAIMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    const assistantMessageId = (Date.now() + 1).toString()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput('')
    setIsLoading(true)
    setIsTyping(true)
    setShowSuggestions(false)

    // Accumulated content for batched updates
    let accumulatedContent = ''

    // Setup streaming buffer callback for batched updates
    streamingBufferRef.current.setCallback((batchedContent) => {
      accumulatedContent += batchedContent
      // Use startTransition for non-blocking UI update
      startTransition(() => {
        setMessages(prev => {
          const updated = [...prev]
          const lastMessage = updated[updated.length - 1]
          if (lastMessage.role === 'assistant' && lastMessage.id === assistantMessageId) {
            // Create new object to trigger re-render
            updated[updated.length - 1] = { ...lastMessage, content: accumulatedContent }
          }
          return updated
        })
      })
    })

    try {
      const response = await fetch('/api/simple-llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          model: 'llama-3.3-70b-versatile'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get response')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No reader available')

      setIsTyping(false)

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                // Use streaming buffer for batched updates (prevents INP issues)
                streamingBufferRef.current.append(parsed.content)
              }
              if (parsed.error) {
                throw new Error(parsed.error)
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      // Flush any remaining content in buffer
      streamingBufferRef.current.flush()
      // Save to history after completion
      setMessages(prev => {
        saveToHistory(prev, mode)
        return prev
      })
    } catch (error) {
      console.error('AI Chat Error:', error)
      streamingBufferRef.current.clear()
      setIsTyping(false)
      setMessages(prev => {
        const updated = [...prev]
        const lastMessage = updated[updated.length - 1]
        if (lastMessage.role === 'assistant') {
          updated[updated.length - 1] = {
            ...lastMessage,
            content: error instanceof Error
              ? `Error: ${error.message}\n\nTip: Make sure GROQ_API_KEY is set. Get free key at console.groq.com`
              : 'Sorry, an error occurred. Please try again.'
          }
        }
        return updated
      })
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }, [messages, startTransition])

  // Send message with Agent mode (using tools including image generation) - OPTIMIZED
  const sendAgentMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    const assistantMessageId = (Date.now() + 1).toString()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      toolExecutions: [],
      images: []
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput('')
    setIsLoading(true)
    setIsTyping(true)
    setShowSuggestions(false)

    try {
      const response = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          model: 'llama-3.3-70b-versatile'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get response')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No reader available')

      const toolExecutions: ToolExecution[] = []
      const images: string[] = []

      setIsTyping(false)

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)

              if (parsed.type === 'tool_call') {
                const execution: ToolExecution = {
                  tool: parsed.tool,
                  input: parsed.input,
                  isLoading: true
                }
                toolExecutions.push(execution)
                // Use startTransition for non-blocking update
                startTransition(() => {
                  setMessages(prev => {
                    const updated = [...prev]
                    const lastMessage = updated[updated.length - 1]
                    if (lastMessage.role === 'assistant' && lastMessage.id === assistantMessageId) {
                      updated[updated.length - 1] = { ...lastMessage, toolExecutions: [...toolExecutions] }
                    }
                    return updated
                  })
                })
              } else if (parsed.type === 'tool_result') {
                const lastExecution = toolExecutions[toolExecutions.length - 1]
                if (lastExecution) {
                  lastExecution.result = parsed.result
                  lastExecution.isLoading = false

                  const parsedResult = parseSpecialResult(parsed.result || '')
                  if (parsedResult.type === 'image' || parsedResult.type === 'qr') {
                    images.push(parsedResult.content)
                  } else if (parsedResult.type === 'pdf' || parsedResult.type === 'ppt') {
                    // Trigger file download (async, don't block)
                    handleFileGeneration(parsed.result || '').catch(err => {
                      console.error('File generation error:', err)
                    })
                  }

                  // Use startTransition for non-blocking update
                  startTransition(() => {
                    setMessages(prev => {
                      const updated = [...prev]
                      const lastMessage = updated[updated.length - 1]
                      if (lastMessage.role === 'assistant' && lastMessage.id === assistantMessageId) {
                        updated[updated.length - 1] = {
                          ...lastMessage,
                          toolExecutions: [...toolExecutions],
                          images: [...images]
                        }
                      }
                      return updated
                    })
                  })
                }
              } else if (parsed.type === 'response' || parsed.type === 'text') {
                // Use startTransition for non-blocking update
                startTransition(() => {
                  setMessages(prev => {
                    const updated = [...prev]
                    const lastMessage = updated[updated.length - 1]
                    if (lastMessage.role === 'assistant' && lastMessage.id === assistantMessageId) {
                      updated[updated.length - 1] = {
                        ...lastMessage,
                        content: parsed.content || '',
                        toolExecutions: [...toolExecutions],
                        images: [...images]
                      }
                    }
                    return updated
                  })
                })
              } else if (parsed.type === 'error') {
                throw new Error(parsed.error)
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      // Save to history after completion
      setMessages(prev => {
        saveToHistory(prev, mode)
        return prev
      })
    } catch (error) {
      console.error('Agent Chat Error:', error)
      setIsTyping(false)
      setMessages(prev => {
        const updated = [...prev]
        const lastMessage = updated[updated.length - 1]
        if (lastMessage.role === 'assistant') {
          updated[updated.length - 1] = {
            ...lastMessage,
            content: error instanceof Error
              ? `Error: ${error.message}\n\nTip: Make sure GROQ_API_KEY is set. Get free key at console.groq.com`
              : 'Sorry, an error occurred. Please try again.'
          }
        }
        return updated
      })
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }, [messages, startTransition])

  // Send message with Quick mode (pattern matching) - memoized
  const sendQuickMessage = useCallback((content: string) => {
    if (content.toLowerCase().includes('quick menu') || content.toLowerCase().includes('show menu')) {
      setShowQuickPicker(true)
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    const { response, quickReplies } = findResponse(content)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      quickReplies
    }

    setMessages((prev) => {
      const updated = [...prev, userMessage, assistantMessage]
      saveToHistory(updated, mode)
      return updated
    })
    setInput('')
    setShowSuggestions(false)
  }, [])

  // Memoized sendMessage handler
  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || isLoading) return

    if (mode === 'agent') {
      sendAgentMessage(content)
    } else if (mode === 'ai') {
      sendAIMessage(content)
    } else {
      sendQuickMessage(content)
    }
  }, [mode, isLoading, sendAgentMessage, sendAIMessage, sendQuickMessage])

  // Memoized keyboard handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }, [sendMessage, input])

  const getWelcomeMessage = useCallback((chatMode: ChatMode) => {
    switch (chatMode) {
      case 'agent':
        return "Hi! I'm IbnuGPT Agent with 25 superpowers!\n\n**Generate:** Images, QR codes, PDFs, Presentations\n**Knowledge:** Wikipedia, Dictionary, Crypto prices\n**Utility:** Calculator, Translator, URL shortener\n\nTry: \"Generate a motivational quote\" or \"Shorten this URL\""
      case 'ai':
        return "Hi! I'm IbnuGPT powered by Llama 3.3 (via Groq). I can answer any questions with AI intelligence. What would you like to know?"
      default:
        return "Hi! I'm Ibnu's portfolio assistant. I can help you learn about his background, projects, skills, and interests. What would you like to know?"
    }
  }, [])

  // Memoized clear chat handler
  const clearChat = useCallback(() => {
    setCurrentSessionId(null)
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: getWelcomeMessage(mode),
        timestamp: new Date(),
        quickReplies: mode === 'quick' ? INITIAL_QUICK_REPLIES : undefined
      }
    ])
    setShowSuggestions(true)
  }, [mode, getWelcomeMessage])

  // Memoized switch mode handler
  const switchMode = useCallback((newMode: ChatMode) => {
    setMode(newMode)
    setShowQuickPicker(false)
    setShowHistory(false)
    setCurrentSessionId(null)
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: getWelcomeMessage(newMode),
        timestamp: new Date(),
        quickReplies: newMode === 'quick' ? INITIAL_QUICK_REPLIES : undefined
      }
    ])
    setShowSuggestions(true)
  }, [getWelcomeMessage])

  const loadSession = useCallback((session: ChatSession) => {
    setCurrentSessionId(session.id)
    setMode(session.mode)
    setMessages(session.messages)
    setShowHistory(false)
    setShowSuggestions(false)
  }, [])

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== sessionId)
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(updated))
      return updated
    })
    if (currentSessionId === sessionId) {
      clearChat()
    }
  }, [currentSessionId, clearChat])

  // Memoized derived state for quick replies
  const lastMessage = useMemo(() => messages[messages.length - 1], [messages])
  const showQuickReplies = useMemo(
    () => mode === 'quick' && lastMessage?.role === 'assistant' && lastMessage?.quickReplies && !showQuickPicker && !showHistory,
    [mode, lastMessage, showQuickPicker, showHistory]
  )

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 p-4 rounded-full',
          'bg-cyber-gradient shadow-lg shadow-primary/25',
          'hover:scale-110 transition-transform duration-200',
          isOpen && 'hidden'
        )}
      >
        <Bot className="h-6 w-6 text-white" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-cyber-green rounded-full animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 60 : 600,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed bottom-6 right-6 z-50',
              'w-[400px] max-w-[calc(100vw-3rem)]',
              'flex flex-col rounded-2xl overflow-hidden',
              'bg-background/95 backdrop-blur-xl border border-border',
              'shadow-2xl shadow-black/20'
            )}
            style={{ maxHeight: isMinimized ? 60 : 'calc(100vh - 6rem)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    mode === 'agent' ? "bg-gradient-to-r from-pink-500 to-orange-500" : mode === 'ai' ? "bg-cyber-purple" : "bg-cyber-gradient"
                  )}>
                    {mode === 'agent' ? (
                      <Wand2 className="h-5 w-5 text-white" />
                    ) : mode === 'ai' ? (
                      <Brain className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-cyber-green rounded-full border-2 border-background" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">
                    {mode === 'agent' ? 'IbnuGPT Agent' : mode === 'ai' ? 'IbnuGPT' : 'Portfolio Assistant'}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {mode === 'agent' ? (
                      <><Wand2 className="h-3 w-3" />Image Gen + Tools</>
                    ) : mode === 'ai' ? (
                      <><Brain className="h-3 w-3" />AI Powered (Llama 3.3)</>
                    ) : (
                      <><Sparkles className="h-3 w-3" />Quick Answers</>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowQuickPicker(!showQuickPicker)}
                  className={cn("h-8 w-8", showQuickPicker && "bg-muted")}
                  title="Quick Actions"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowHistory(!showHistory)}
                  className={cn("h-8 w-8", showHistory && "bg-muted")}
                  title="Chat History"
                >
                  <History className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={exportChat} className="h-8 w-8" title="Export Chat">
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={clearChat} className="h-8 w-8" title="Clear Chat">
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-8 w-8"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Mode Selector */}
                <div className="flex p-2 gap-1.5 border-b border-border bg-muted/30">
                  <button
                    onClick={() => switchMode('quick')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all",
                      mode === 'quick'
                        ? "bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Zap className="h-3 w-3" />Quick
                  </button>
                  <button
                    onClick={() => switchMode('ai')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all",
                      mode === 'ai'
                        ? "bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Brain className="h-3 w-3" />AI Chat
                  </button>
                  <button
                    onClick={() => switchMode('agent')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all",
                      mode === 'agent'
                        ? "bg-gradient-to-r from-pink-500/20 to-orange-500/20 text-orange-400 border border-orange-500/30"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Wand2 className="h-3 w-3" />Agent
                  </button>
                </div>

                {/* Quick Picker / History Panel */}
                <AnimatePresence>
                  {showQuickPicker && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-b border-border bg-card/30 overflow-hidden"
                    >
                      <QuickToolPicker
                        onNavigate={handleNavigate}
                        onAction={handleAction}
                        onClose={() => setShowQuickPicker(false)}
                      />
                    </motion.div>
                  )}
                  {showHistory && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-b border-border bg-card/30 overflow-hidden"
                    >
                      <ChatHistoryPanel
                        sessions={sessions}
                        currentSessionId={currentSessionId}
                        onSelectSession={loadSession}
                        onDeleteSession={deleteSession}
                        onClose={() => setShowHistory(false)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex gap-3',
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      )}
                    >
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                          message.role === 'user'
                            ? 'bg-primary'
                            : mode === 'agent' ? 'bg-gradient-to-r from-pink-500 to-orange-500' : mode === 'ai' ? 'bg-cyber-purple' : 'bg-cyber-gradient'
                        )}
                      >
                        {message.role === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : mode === 'agent' ? (
                          <Wand2 className="h-4 w-4 text-white" />
                        ) : mode === 'ai' ? (
                          <Brain className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-2.5 inline-block max-w-full',
                            message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          )}
                        >
                          {message.role === 'assistant' ? (
                            <div className="text-sm space-y-2">
                              {/* Tool Executions */}
                              {message.toolExecutions && message.toolExecutions.length > 0 && (
                                <div className="space-y-1.5 mb-2">
                                  {message.toolExecutions.map((exec, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs bg-black/10 rounded-lg px-2 py-1.5">
                                      {exec.isLoading ? (
                                        <Loader2 className="h-3 w-3 animate-spin text-orange-400" />
                                      ) : (
                                        <span className="text-green-400">✓</span>
                                      )}
                                      <span className="capitalize text-muted-foreground">{exec.tool.replace(/_/g, ' ')}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Generated Images */}
                              {message.images && message.images.length > 0 && (
                                <div className="space-y-2 mb-2">
                                  {message.images.map((imgUrl, idx) => (
                                    <div key={idx} className="relative rounded-lg overflow-hidden">
                                      <Image
                                        src={imgUrl}
                                        alt="Generated image"
                                        width={280}
                                        height={280}
                                        className="rounded-lg"
                                        unoptimized
                                      />
                                      <a
                                        href={imgUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute bottom-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded hover:bg-black/70"
                                      >
                                        Open Full
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Text Content */}
                              <div className="whitespace-pre-line">
                                {message.content ? message.content.split('\n').map((line, i) => {
                                  const parts = line.split(/(\*\*[^*]+\*\*)/g)
                                  return (
                                    <p key={i} className={line.startsWith('-') || line.startsWith('•') ? 'ml-2' : ''}>
                                      {parts.map((part, j) => {
                                        if (part.startsWith('**') && part.endsWith('**')) {
                                          return <strong key={j}>{part.slice(2, -2)}</strong>
                                        }
                                        return part
                                      })}
                                    </p>
                                  )
                                }) : (
                                  !message.toolExecutions?.length && !message.images?.length && (
                                    <span className="flex items-center gap-2">
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      Thinking...
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm">{message.content}</p>
                          )}
                        </div>

                        {/* Message Actions */}
                        {message.role === 'assistant' && message.content && (
                          <div className="flex items-center gap-1 mt-1">
                            <button
                              onClick={() => copyMessage(message.content, message.id)}
                              className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                              title="Copy"
                            >
                              {copiedMessageId === message.id ? (
                                <Check className="h-3 w-3 text-green-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                            <button
                              onClick={() => handleFeedback(message.id, 'up')}
                              className={cn(
                                "p-1 rounded hover:bg-muted/50 transition-colors",
                                message.feedback === 'up' ? "text-green-400" : "text-muted-foreground hover:text-foreground"
                              )}
                              title="Good response"
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleFeedback(message.id, 'down')}
                              className={cn(
                                "p-1 rounded hover:bg-muted/50 transition-colors",
                                message.feedback === 'down' ? "text-red-400" : "text-muted-foreground hover:text-foreground"
                              )}
                              title="Bad response"
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </button>
                            {mode !== 'quick' && (
                              <button
                                onClick={() => sendMessage(message.content)}
                                className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                                title="Regenerate"
                              >
                                <RotateCcw className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && <TypingIndicator />}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {showQuickReplies && (
                  <div className="px-4 pb-2">
                    <div className="flex flex-wrap gap-2">
                      {lastMessage.quickReplies?.map((reply, index) => (
                        <button
                          key={index}
                          onClick={() => sendMessage(reply.value)}
                          className="text-xs px-3 py-1.5 rounded-full bg-cyber-cyan/10 text-cyber-cyan hover:bg-cyber-cyan/20 transition-colors border border-cyber-cyan/20"
                        >
                          {reply.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Prompts */}
                {showSuggestions && messages.length <= 1 && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-muted-foreground mb-2">Suggested prompts:</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_PROMPTS[mode].map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => sendMessage(prompt)}
                          className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors truncate max-w-[180px]"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-border bg-card/50">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={mode === 'ai' ? "Ask anything..." : "Ask me anything..."}
                      disabled={isLoading}
                      className={cn(
                        'flex-1 px-4 py-2.5 rounded-xl',
                        'bg-muted border-0 outline-none',
                        'text-sm placeholder:text-muted-foreground',
                        'focus:ring-2 focus:ring-primary/20',
                        'disabled:opacity-50'
                      )}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleVoiceInput}
                      disabled={isLoading}
                      className={cn("shrink-0", isListening && "text-red-500 bg-red-500/10")}
                      title={isListening ? "Stop listening" : "Voice input"}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="icon"
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || isLoading}
                      className="shrink-0"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {(mode === 'ai' || mode === 'agent') && (
                    <p className="text-[10px] text-muted-foreground mt-2 text-center">
                      {mode === 'agent'
                        ? 'Groq (Free) + Pollinations.ai (Free Image Gen)'
                        : 'Powered by Groq (Free) • Llama 3.3 70B'}
                    </p>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

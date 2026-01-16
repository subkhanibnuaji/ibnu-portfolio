'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Wrench, ArrowRight, Keyboard, Calculator, Gamepad2, Music,
  Ruler, Clock, Timer, ArrowRightLeft, Code, Quote, Paintbrush,
  Cloud, Blocks, FileText, Palette, Timer as StopwatchIcon, Key, Target,
  Braces, StickyNote, Scale, Globe, Sparkles, Hourglass,
  QrCode, Type, AlignLeft, BookOpen, Grid3X3,
  Binary, Regex, Brain, SquareStack, Cake, Banknote, Square, Smile,
  DollarSign, Receipt, LayoutGrid, Hash, Shuffle, Grid2X2, Wallet,
  CircleDot, Bomb, ListChecks, Disc, ShoppingCart, User, Zap, Dices, Percent, Monitor,
  Radio, Coins, PiggyBank, Moon, Link2, LetterText, Fingerprint, BadgePercent, Languages, Flame, Atom,
  Thermometer, GraduationCap, Lightbulb, Pipette, Car
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
  },
  {
    slug: 'base64-tool',
    name: 'Base64 Encoder',
    description: 'Encode and decode text or files to/from Base64 format.',
    icon: Binary,
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-500',
    category: 'Developer'
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions with live highlighting.',
    icon: Regex,
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-500',
    category: 'Developer'
  },
  {
    slug: 'memory-game',
    name: 'Memory Game',
    description: 'Test your memory by matching pairs of cards.',
    icon: Brain,
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-500',
    category: 'Game'
  },
  {
    slug: 'game-2048',
    name: '2048',
    description: 'Slide tiles and combine numbers to reach 2048!',
    icon: SquareStack,
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-500',
    category: 'Game'
  },
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate your exact age with zodiac signs and fun facts.',
    icon: Cake,
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-500',
    category: 'Calculator'
  },
  {
    slug: 'loan-calculator',
    name: 'Loan Calculator',
    description: 'Calculate monthly payments and total interest for loans.',
    icon: Banknote,
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500',
    category: 'Finance'
  },
  {
    slug: 'box-shadow-generator',
    name: 'Box Shadow Generator',
    description: 'Create CSS box shadows with live preview and presets.',
    icon: Square,
    bgColor: 'bg-violet-500/10',
    textColor: 'text-violet-500',
    category: 'Design'
  },
  {
    slug: 'emoji-picker',
    name: 'Emoji Picker',
    description: 'Browse and copy emojis organized by category.',
    icon: Smile,
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-500',
    category: 'Utility'
  },
  {
    slug: 'currency-converter',
    name: 'Currency Converter',
    description: 'Convert between 24 world currencies instantly.',
    icon: DollarSign,
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500',
    category: 'Finance'
  },
  {
    slug: 'invoice-generator',
    name: 'Invoice Generator',
    description: 'Create professional invoices with itemized billing.',
    icon: Receipt,
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    category: 'Business'
  },
  {
    slug: 'brick-breaker',
    name: 'Brick Breaker',
    description: 'Classic arcade game - break all the bricks with the ball!',
    icon: LayoutGrid,
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-500',
    category: 'Game'
  },
  {
    slug: 'sudoku',
    name: 'Sudoku',
    description: 'Classic number puzzle with multiple difficulty levels.',
    icon: Hash,
    bgColor: 'bg-indigo-500/10',
    textColor: 'text-indigo-500',
    category: 'Game'
  },
  {
    slug: 'word-scramble',
    name: 'Word Scramble',
    description: 'Unscramble letters to find hidden words in 6 categories.',
    icon: Shuffle,
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-500',
    category: 'Game'
  },
  {
    slug: 'pixel-art-editor',
    name: 'Pixel Art Editor',
    description: 'Create beautiful pixel art with multiple tools and colors.',
    icon: Grid2X2,
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-500',
    category: 'Creative'
  },
  {
    slug: 'expense-tracker',
    name: 'Expense Tracker',
    description: 'Track income and expenses with charts and categories.',
    icon: Wallet,
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500',
    category: 'Finance'
  },
  {
    slug: 'connect-four',
    name: 'Connect Four',
    description: 'Drop discs to connect 4 in a row! Play vs friend or AI.',
    icon: CircleDot,
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-500',
    category: 'Game'
  },
  {
    slug: 'minesweeper',
    name: 'Minesweeper',
    description: 'Classic puzzle game - clear the board without hitting mines!',
    icon: Bomb,
    bgColor: 'bg-gray-500/10',
    textColor: 'text-gray-500',
    category: 'Game'
  },
  {
    slug: 'checklist',
    name: 'Checklist',
    description: 'Create multiple lists with priorities and due dates.',
    icon: ListChecks,
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    category: 'Productivity'
  },
  {
    slug: 'simon-says',
    name: 'Simon Says',
    description: 'Memory game - repeat the color pattern as it grows!',
    icon: Disc,
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-500',
    category: 'Game'
  },
  {
    slug: 'unit-price-calculator',
    name: 'Unit Price Calculator',
    description: 'Compare product prices to find the best deal.',
    icon: ShoppingCart,
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-500',
    category: 'Calculator'
  },
  {
    slug: 'hangman',
    name: 'Hangman',
    description: 'Classic word guessing game with 6 categories.',
    icon: User,
    bgColor: 'bg-indigo-500/10',
    textColor: 'text-indigo-500',
    category: 'Game'
  },
  {
    slug: 'reaction-test',
    name: 'Reaction Time Test',
    description: 'Test how fast you can react! Track your best times.',
    icon: Zap,
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-500',
    category: 'Game'
  },
  {
    slug: 'dice-roller',
    name: 'Dice Roller',
    description: 'Roll any combination of RPG dice (d4, d6, d8, d10, d12, d20, d100).',
    icon: Dices,
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-500',
    category: 'Utility'
  },
  {
    slug: 'timer',
    name: 'Timer',
    description: 'Set custom timers with presets and alarm sounds.',
    icon: Clock,
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-500',
    category: 'Utility'
  },
  {
    slug: 'color-palette',
    name: 'Color Palette Generator',
    description: 'Generate harmonious color palettes with various modes.',
    icon: Palette,
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-500',
    category: 'Design'
  },
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Calculate percentages, changes, and more.',
    icon: Percent,
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500',
    category: 'Calculator'
  },
  {
    slug: 'text-statistics',
    name: 'Text Statistics',
    description: 'Analyze text with word count, reading time, and more.',
    icon: FileText,
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    category: 'Utility'
  },
  {
    slug: 'tip-calculator',
    name: 'Tip Calculator',
    description: 'Calculate tips and split bills between people.',
    icon: Receipt,
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500',
    category: 'Calculator'
  },
  {
    slug: 'aspect-ratio',
    name: 'Aspect Ratio Calculator',
    description: 'Calculate and convert aspect ratios for images and video.',
    icon: Monitor,
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-500',
    category: 'Design'
  },
  {
    slug: 'morse-code',
    name: 'Morse Code Translator',
    description: 'Convert text to Morse code and back with audio playback.',
    icon: Radio,
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-500',
    category: 'Utility'
  },
  {
    slug: 'binary-converter',
    name: 'Number Base Converter',
    description: 'Convert between decimal, binary, octal, and hexadecimal.',
    icon: Binary,
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-500',
    category: 'Developer'
  },
  {
    slug: 'coin-flip',
    name: 'Coin Flip',
    description: 'Flip a virtual coin with stats tracking.',
    icon: Coins,
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-500',
    category: 'Utility'
  },
  {
    slug: 'savings-calculator',
    name: 'Savings Goal Calculator',
    description: 'Plan savings with interest and monthly contributions.',
    icon: PiggyBank,
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500',
    category: 'Finance'
  },
  {
    slug: 'random-number',
    name: 'Random Number Generator',
    description: 'Generate random numbers in any range.',
    icon: Shuffle,
    bgColor: 'bg-violet-500/10',
    textColor: 'text-violet-500',
    category: 'Utility'
  },
  {
    slug: 'character-counter',
    name: 'Character Counter',
    description: 'Count characters and words with platform limits.',
    icon: LetterText,
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    category: 'Utility'
  },
  {
    slug: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs for web development.',
    icon: Link2,
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-500',
    category: 'Developer'
  },
  {
    slug: 'sleep-calculator',
    name: 'Sleep Calculator',
    description: 'Calculate optimal sleep and wake times based on sleep cycles.',
    icon: Moon,
    bgColor: 'bg-indigo-500/10',
    textColor: 'text-indigo-500',
    category: 'Health'
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 hashes.',
    icon: Fingerprint,
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-500',
    category: 'Developer'
  },
  {
    slug: 'discount-calculator',
    name: 'Discount Calculator',
    description: 'Calculate discounts, savings, and final prices.',
    icon: BadgePercent,
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-500',
    category: 'Calculator'
  },
  {
    slug: 'roman-numeral',
    name: 'Roman Numeral Converter',
    description: 'Convert between Arabic and Roman numerals.',
    icon: Languages,
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-500',
    category: 'Utility'
  },
  {
    slug: 'bmr-calculator',
    name: 'BMR Calculator',
    description: 'Calculate your Basal Metabolic Rate and daily calories.',
    icon: Flame,
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-500',
    category: 'Health'
  },
  {
    slug: 'prime-checker',
    name: 'Prime Number Checker',
    description: 'Check if a number is prime and find prime factors.',
    icon: Atom,
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-500',
    category: 'Calculator'
  },
  {
    slug: 'temperature-converter',
    name: 'Temperature Converter',
    description: 'Convert between Celsius, Fahrenheit, and Kelvin.',
    icon: Thermometer,
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-500',
    category: 'Utility'
  },
  {
    slug: 'gpa-calculator',
    name: 'GPA Calculator',
    description: 'Calculate your Grade Point Average.',
    icon: GraduationCap,
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    category: 'Calculator'
  },
  {
    slug: 'electricity-calculator',
    name: 'Electricity Calculator',
    description: 'Calculate electricity usage and cost.',
    icon: Lightbulb,
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-500',
    category: 'Calculator'
  },
  {
    slug: 'color-converter',
    name: 'Color Converter',
    description: 'Convert colors between HEX, RGB, HSL, and CMYK.',
    icon: Pipette,
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-500',
    category: 'Design'
  },
  {
    slug: 'fuel-calculator',
    name: 'Fuel Calculator',
    description: 'Calculate fuel costs, consumption, and range.',
    icon: Car,
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500',
    category: 'Calculator'
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

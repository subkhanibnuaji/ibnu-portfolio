'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandOutput {
  command: string
  output: string
  isError?: boolean
}

const COMMANDS: Record<string, () => string> = {
  help: () => `
<span class="text-cyber-cyan font-bold">AVAILABLE COMMANDS</span>
<span class="text-muted-foreground">═══════════════════</span>

<span class="text-cyber-green">Portfolio:</span>
  about          - About me
  skills         - Technical skills
  projects       - View projects
  experience     - Work experience
  certifications - Professional certifications
  interests      - AI, Crypto, Cybersecurity
  contact        - Contact information
  crypto         - Crypto trading info

<span class="text-cyber-green">Navigation:</span>
  goto [page]    - Navigate to page

<span class="text-cyber-green">System:</span>
  clear          - Clear terminal
  help           - Show this help
  whoami         - Display user info
  neofetch       - System information
  theme [name]   - Change theme

<span class="text-cyber-green">Fun:</span>
  matrix         - Enter the Matrix
  fortune        - Get a fortune
  coffee         - Get some coffee

<span class="text-cyber-green">Exit:</span>
  exit           - Close terminal

<span class="text-muted-foreground">Tip: Use Tab for autocomplete, Arrow keys for history</span>
`,

  about: () => `
<span class="text-cyber-cyan">╔══════════════════════════════════════════════════════════════╗</span>
<span class="text-cyber-cyan">║                    SUBKHAN IBNU AJI                          ║</span>
<span class="text-cyber-cyan">║              S.Kom., M.B.A. | Jakarta, Indonesia             ║</span>
<span class="text-cyber-cyan">╚══════════════════════════════════════════════════════════════╝</span>

Cross-functional professional with expertise in:
• Digital Transformation & IT Governance
• AI/ML & Agentic Systems
• Blockchain/Web3 Development
• Cybersecurity & Risk Management

Currently serving at Indonesia's Ministry of Housing and
Settlement Areas (Kementerian PKP), handling enterprise IT
projects including SIBARU, PKP HUB, and SIMONI systems.

<span class="text-cyber-green">Education:</span>
• MBA - Universitas Gadjah Mada (GPA: 3.60)
• B.Sc. Informatics - Telkom University (GPA: 3.34)
• TOEFL ITP: 593

<span class="text-cyber-cyan">Email:</span> hi@heyibnu.com
`,

  skills: () => `
<span class="text-cyber-cyan font-bold">TECHNICAL SKILLS</span>
<span class="text-muted-foreground">================</span>

<span class="text-cyber-green">[Programming]</span>
Python     <span class="text-cyber-cyan">████████████████████</span> 90%
JavaScript <span class="text-cyber-cyan">██████████████████</span> 85%
TypeScript <span class="text-cyber-cyan">████████████████</span> 80%
Solidity   <span class="text-cyber-cyan">██████████████</span> 70%
Motoko     <span class="text-cyber-cyan">████████████</span> 60%

<span class="text-cyber-green">[Frameworks]</span>
React/Next.js <span class="text-cyber-cyan">██████████████████</span> 85%
Node.js       <span class="text-cyber-cyan">████████████████</span> 80%
LangChain     <span class="text-cyber-cyan">██████████████</span> 70%
FastAPI       <span class="text-cyber-cyan">████████████</span> 60%

<span class="text-cyber-green">[AI/ML]</span>
Prompt Engineering <span class="text-cyber-cyan">████████████████████</span> 90%
LLM Workflows      <span class="text-cyber-cyan">██████████████████</span> 85%
Agentic AI         <span class="text-cyber-cyan">████████████████</span> 80%

<span class="text-cyber-green">[Blockchain]</span>
DeFi Protocols   <span class="text-cyber-cyan">████████████████</span> 80%
Smart Contracts  <span class="text-cyber-cyan">██████████████</span> 70%
`,

  projects: () => `
<span class="text-cyber-cyan font-bold">PROJECTS</span>
<span class="text-muted-foreground">════════</span>

<span class="text-cyber-green">1. HUB PKP</span> - Digital Housing Ecosystem
   Platform for Indonesia's self-built housing program
   Tech: React, Node.js, PostgreSQL
   Status: <span class="text-cyber-green">● Active</span>

<span class="text-cyber-green">2. SIBARU</span> - Enterprise Housing System
   Subsidized housing distribution platform
   Status: <span class="text-cyber-green">● Active</span>

<span class="text-cyber-green">3. SIMONI</span> - Monitoring & Analytics
   Real-time construction monitoring
   Status: <span class="text-cyber-green">● Active</span>

<span class="text-cyber-green">4. ICP Token dApp</span> - Web3 Application
   Fungible token on Internet Computer
   Tech: Motoko, React, Internet Identity
   Status: <span class="text-cyber-purple">● Completed</span>

Type 'goto projects' to see detailed project pages.
`,

  crypto: () => `
<span class="text-cyber-cyan font-bold">CRYPTO TRADING PROFILE</span>
<span class="text-muted-foreground">══════════════════════</span>

<span class="text-cyber-green">Trading Experience:</span>
  • Cumulative Futures Volume: $68K-100K USD
  • Approach: Thesis-driven, risk-controlled
  • Strategies: Spot & derivatives (CEX/DEX)

<span class="text-cyber-green">Portfolio Allocation:</span>
  <span class="text-cyber-orange">████████████████████</span> 70% Bitcoin (BTC)
  <span class="text-cyber-cyan">██████</span>               15% Strong Altcoins
  <span class="text-cyber-pink">████</span>                 10% Memecoins
  <span class="text-cyber-green">██</span>                    5% DEX Coins

<span class="text-cyber-green">Risk Management:</span>
  • Position sizing with R-multiples
  • Stop-loss discipline
  • Portfolio tracking & journaling
  • On-chain research for liquidity analysis
`,

  whoami: () => '<span class="text-cyber-green">visitor@ibnu.dev</span>',

  neofetch: () => `
<span class="text-cyber-cyan">       ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄       </span><span class="text-cyber-cyan">visitor</span>@<span class="text-cyber-purple">ibnu.dev</span>
<span class="text-cyber-cyan">     ██░░░░░░░░░░░░░░░██       </span><span class="text-muted-foreground">──────────────────</span>
<span class="text-cyber-cyan">   ██░░░░░░░░░░░░░░░░░░░██     </span><span class="text-cyber-green">OS:</span> Portfolio v3.0
<span class="text-cyber-cyan">  ██░░░░░░░░░░░░░░░░░░░░░██    </span><span class="text-cyber-green">Host:</span> heyibnu.com
<span class="text-cyber-cyan">  ██░░░░░░░░░░░░░░░░░░░░░██    </span><span class="text-cyber-green">Kernel:</span> Next.js 15
<span class="text-cyber-cyan">  ██░░░░░░░░░░░░░░░░░░░░░██    </span><span class="text-cyber-green">Shell:</span> Terminal v3.0
<span class="text-cyber-cyan">  ██░░░░░░░░░░░░░░░░░░░░░██    </span><span class="text-cyber-green">Theme:</span> Cyber Dark
<span class="text-cyber-cyan">   ██░░░░░░░░░░░░░░░░░░░██     </span><span class="text-cyber-green">AI:</span> Claude 3.5 Sonnet
<span class="text-cyber-cyan">     ██░░░░░░░░░░░░░░░██       </span><span class="text-cyber-green">DB:</span> PostgreSQL
<span class="text-cyber-cyan">       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀        </span><span class="text-cyber-green">Cache:</span> Redis

                               <span class="text-cyber-cyan">████</span><span class="text-cyber-purple">████</span><span class="text-cyber-green">████</span><span class="text-cyber-orange">████</span>
`,

  fortune: () => {
    const fortunes = [
      "The best time to start coding was yesterday. The second best time is now.",
      "In the world of crypto, DYOR is not advice—it's survival.",
      "A good portfolio is like a good code: clean, efficient, and well-documented.",
      "The blockchain never forgets, but the market often does.",
      "Every bug is a feature waiting to be understood.",
      "Risk management isn't about avoiding losses—it's about surviving them.",
    ]
    return `\n🔮 <span class="text-cyber-purple">${fortunes[Math.floor(Math.random() * fortunes.length)]}</span>\n`
  },

  coffee: () => `
<span class="text-cyber-orange">
        ( (
         ) )
      .______.
      |      |]
      \\      /
       \`----'
</span>
<span class="text-cyber-green">Here's your coffee! ☕</span>
Fun fact: Ibnu is definitely a coffee addict.
`,

  matrix: () => `
<span class="text-cyber-green animate-pulse">Wake up, Neo...</span>
<span class="text-cyber-green">The Matrix has you...</span>
<span class="text-cyber-green">Follow the white rabbit.</span>
<span class="text-cyber-green">Knock, knock, Neo.</span>
`,

  contact: () => `
<span class="text-cyber-cyan font-bold">CONTACT INFORMATION</span>
<span class="text-muted-foreground">===================</span>

📧 Email: <span class="text-cyber-cyan">hi@heyibnu.com</span>
🔗 LinkedIn: <span class="text-cyber-cyan">linkedin.com/in/subkhanibnuaji</span>
💻 GitHub: <span class="text-cyber-cyan">github.com/subkhanibnuaji</span>
📍 Location: Jakarta, Indonesia (GMT+7)

<span class="text-cyber-green">Available for:</span>
• Consulting engagements
• Freelance projects
• Speaking opportunities
• Web3 collaborations
`,
}

export function Terminal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [history, setHistory] = useState<CommandOutput[]>([])
  const [input, setInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [history, scrollToBottom])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  // Keyboard shortcut to open terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault()
          setIsOpen(true)
        }
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()

    if (!trimmed) return

    setCommandHistory((prev) => [...prev, trimmed])
    setHistoryIndex(-1)

    if (trimmed === 'clear') {
      setHistory([])
      return
    }

    if (trimmed === 'exit') {
      setIsOpen(false)
      return
    }

    if (trimmed.startsWith('goto ')) {
      const page = trimmed.replace('goto ', '')
      const pages: Record<string, string> = {
        home: '/',
        projects: '/projects',
        about: '/about',
        contact: '/contact',
        interests: '/interests',
        certs: '/certifications',
        certifications: '/certifications',
      }
      if (pages[page]) {
        setHistory((prev) => [
          ...prev,
          { command: cmd, output: `<span class="text-cyber-green">Navigating to ${page}...</span>` },
        ])
        setTimeout(() => {
          window.location.href = pages[page]
        }, 500)
        return
      }
    }

    const commandFn = COMMANDS[trimmed]
    if (commandFn) {
      setHistory((prev) => [
        ...prev,
        { command: cmd, output: commandFn() },
      ])
    } else {
      setHistory((prev) => [
        ...prev,
        {
          command: cmd,
          output: `<span class="text-red-500">Command not found: ${trimmed}. Type 'help' for available commands.</span>`,
          isError: true,
        },
      ])
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      } else {
        setHistoryIndex(-1)
        setInput('')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const matches = Object.keys(COMMANDS).filter((c) => c.startsWith(input))
      if (matches.length === 1) {
        setInput(matches[0])
      }
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed z-50 flex flex-col',
              'bg-[#0a0a1a]/98 backdrop-blur-xl',
              'border border-cyber-cyan/30 rounded-xl overflow-hidden',
              'shadow-2xl shadow-black/50',
              isMaximized
                ? 'inset-4'
                : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] max-w-[95vw] h-[500px] max-h-[80vh]'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/30 border-b border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
                />
                <button
                  onClick={() => setIsMaximized(false)}
                  className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"
                />
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
                />
              </div>
              <span className="text-sm text-muted-foreground font-mono">
                visitor@ibnu.dev:~
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <Maximize2 className="h-4 w-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Output */}
            <div
              ref={outputRef}
              className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2"
              onClick={() => inputRef.current?.focus()}
            >
              {/* Welcome Message */}
              {history.length === 0 && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: `
<span class="text-cyber-cyan">
 ██╗██████╗ ███╗   ██╗██╗   ██╗
 ██║██╔══██╗████╗  ██║██║   ██║
 ██║██████╔╝██╔██╗ ██║██║   ██║
 ██║██╔══██╗██║╚██╗██║██║   ██║
 ██║██████╔╝██║ ╚████║╚██████╔╝
 ╚═╝╚═════╝ ╚═╝  ╚═══╝ ╚═════╝
</span>
<span class="text-cyber-purple">Welcome to Ibnu's Portfolio Terminal v3.0</span>
<span class="text-muted-foreground">Type </span><span class="text-cyber-cyan">'help'</span><span class="text-muted-foreground"> to see available commands.</span>
`,
                  }}
                />
              )}

              {history.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-cyber-green">visitor@ibnu.dev</span>
                    <span className="text-muted-foreground">:</span>
                    <span className="text-cyber-purple">~</span>
                    <span className="text-muted-foreground">$</span>
                    <span className="text-foreground">{item.command}</span>
                  </div>
                  <div
                    className="pl-4 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: item.output }}
                  />
                </div>
              ))}

              {/* Input Line */}
              <div className="flex items-center gap-2">
                <span className="text-cyber-green">visitor@ibnu.dev</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-cyber-purple">~</span>
                <span className="text-muted-foreground">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none text-foreground caret-cyber-cyan"
                  spellCheck={false}
                  autoComplete="off"
                />
                <span className="w-2 h-5 bg-cyber-cyan animate-blink" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, User, Trash2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  quickReplies?: QuickReply[]
}

interface QuickReply {
  label: string
  value: string
}

// Knowledge base for pattern matching
const knowledgeBase = {
  greetings: {
    patterns: ['hi', 'hello', 'hey', 'halo', 'hai', 'good morning', 'good afternoon', 'good evening'],
    response: "Hi there! I'm Ibnu's portfolio assistant. I can help you learn about his background, projects, skills, and interests. What would you like to know?",
    quickReplies: [
      { label: 'About Ibnu', value: 'Tell me about Ibnu' },
      { label: 'Projects', value: 'What projects has he worked on?' },
      { label: 'Skills', value: 'What are his skills?' }
    ]
  },
  about: {
    patterns: ['about', 'who is', 'introduce', 'background', 'tell me about ibnu', 'who are you'],
    response: `**Subkhan Ibnu Aji, S.Kom., M.B.A.**

I'm a cross-functional professional currently working as a Civil Servant (ASN) at Indonesia's Ministry of Housing & Settlement Areas.

**Background:**
- Senior Executive MBA from Universitas Gadjah Mada (UGM)
- Bachelor in Informatics from Telkom University
- 5+ years of experience in tech and consulting

**Current Role:**
Managing enterprise IT projects including HUB PKP, SIBARU, and SIMONI at the ministry.`,
    quickReplies: [
      { label: 'Education', value: 'Tell me about your education' },
      { label: 'Experience', value: 'What is your work experience?' },
      { label: 'Interests', value: 'What are your interests?' }
    ]
  },
  education: {
    patterns: ['education', 'study', 'university', 'degree', 'mba', 'bachelor', 'ugm', 'telkom'],
    response: `**Education:**

1. **Senior Executive MBA** - Universitas Gadjah Mada (UGM)
   - Period: 2022 - 2024
   - GPA: 3.60/4.00
   - Thesis: Product Differentiation Strategy

2. **Bachelor of Informatics (S.Kom)** - Telkom University
   - Period: 2017 - 2021
   - GPA: 3.34/4.00
   - Thesis: Animo - Web-Based Automation for F&B SMEs

**Languages:** Indonesian (Native), English (TOEFL 593), Arabic & Mandarin (Beginner)`,
    quickReplies: [
      { label: 'Work Experience', value: 'What is your work experience?' },
      { label: 'Certifications', value: 'What certifications do you have?' }
    ]
  },
  experience: {
    patterns: ['experience', 'work', 'job', 'career', 'ministry', 'consulting', 'startup'],
    response: `**Work Experience:**

1. **Civil Servant (ASN)** - Ministry of Housing & Settlement Areas
   - Aug 2024 - Present
   - Managing IT projects: HUB PKP, SIBARU, SIMONI

2. **Founder & CEO** - Virtus Futura Consulting
   - Jul 2021 - Jul 2024
   - Managed portfolio >IDR 1T (~USD 71M)

3. **Founder & CEO** - CV Solusi Automasi Indonesia
   - Aug 2020 - Aug 2022
   - Built RPA solutions for 50+ clients

4. **Independent Crypto Investor**
   - Jul 2021 - Present
   - $68K-100K cumulative futures volume`,
    quickReplies: [
      { label: 'Projects', value: 'What projects has he worked on?' },
      { label: 'Skills', value: 'What are his skills?' }
    ]
  },
  projects: {
    patterns: ['project', 'hub pkp', 'sibaru', 'simoni', 'portfolio', 'work on', 'built', 'develop'],
    response: `**Key Projects:**

1. **HUB PKP (Klinik Rumah)** - In Development
   - Digital platform for Indonesia's self-built housing program
   - AI-powered design consultation, permit processing, material marketplace

2. **SIBARU** - Active
   - Enterprise information system for ministry operations

3. **SIMONI** - Active
   - Monitoring and evaluation system for housing programs

4. **RPA Solutions** - Completed
   - 100+ automation bots for 10+ clients

5. **ICP Token dApp** - Completed
   - Web3 application on Internet Computer`,
    quickReplies: [
      { label: 'HUB PKP Details', value: 'Tell me more about HUB PKP project' },
      { label: 'Tech Stack', value: 'What technologies do you use?' }
    ]
  },
  hubpkp: {
    patterns: ['hub pkp', 'klinik rumah', 'housing platform', 'rumah', 'housing'],
    response: `**HUB PKP - Klinik Rumah**

The flagship digital platform for Indonesia's self-built housing ecosystem.

**Features:**
- AI-powered house design consultation
- Integrated permit processing (PBG/SIMBG)
- Material marketplace with price comparison
- Certified worker facilitation
- Housing finance integration with banks
- Construction monitoring system

**Impact:**
Streamlines housing construction for 84% of Indonesian homes built through self-construction (swadaya).

**Technologies:** React, TypeScript, Node.js, PostgreSQL, AWS, SIMBG API`,
    quickReplies: [
      { label: 'Other Projects', value: 'What other projects have you worked on?' },
      { label: 'Tech Stack', value: 'What technologies do you use?' }
    ]
  },
  skills: {
    patterns: ['skill', 'technology', 'tech stack', 'programming', 'framework', 'tools', 'expertise'],
    response: `**Technical Skills:**

**Programming:** Python (90%), JavaScript (85%), TypeScript (80%), SQL (85%), Solidity (70%)

**Frameworks:** React/Next.js (85%), Node.js (80%), FastAPI (70%), LangChain (75%), TailwindCSS (85%)

**AI/ML:** LLM Workflows (85%), Prompt Engineering (90%), Agentic AI (80%)

**Blockchain:** DeFi Protocols (80%), Smart Contracts (70%), On-chain Analysis (75%)

**Cloud:** AWS (80%), Docker (70%), Linux (80%), Git (90%)`,
    quickReplies: [
      { label: 'Certifications', value: 'What certifications do you have?' },
      { label: 'AI Skills', value: 'Tell me about your AI experience' }
    ]
  },
  interests: {
    patterns: ['interest', 'passion', 'focus', 'specialization', 'ai', 'blockchain', 'cybersecurity', 'crypto'],
    response: `**Three Core Interests:**

1. **Artificial Intelligence**
   - Agentic AI & Multi-Agent Systems
   - LLM Workflows & Prompt Engineering
   - AI for Government Documentation

2. **Crypto & Blockchain**
   - Portfolio Management & DeFi
   - On-chain Analysis & Research
   - Smart Contract Development

3. **Cybersecurity**
   - Defensive Security & OPSEC
   - OSINT & Threat Intelligence
   - Web Application Security`,
    quickReplies: [
      { label: 'AI Details', value: 'Tell me more about your AI work' },
      { label: 'Crypto Trading', value: 'Tell me about your crypto experience' }
    ]
  },
  ai: {
    patterns: ['artificial intelligence', 'machine learning', 'llm', 'langchain', 'gpt', 'claude', 'agentic'],
    response: `**AI & Machine Learning:**

I explore agentic AI systems, LLM workflows, and their applications in government and enterprise.

**Focus Areas:**
- Agentic AI & Multi-Agent Systems
- RAG (Retrieval Augmented Generation)
- Prompt Engineering
- AI for Government Documentation

**Technologies:** LangChain, LangGraph, AutoGen, CrewAI, RAG systems

**Vision:** AI will revolutionize government service delivery through autonomous document processing and intelligent citizen assistance.`,
    quickReplies: [
      { label: 'Projects', value: 'What AI projects have you built?' },
      { label: 'Blockchain', value: 'Tell me about your blockchain work' }
    ]
  },
  crypto: {
    patterns: ['crypto', 'bitcoin', 'trading', 'defi', 'web3', 'futures', 'portfolio'],
    response: `**Crypto & Trading Experience:**

**Portfolio Allocation:**
- 70% Bitcoin (BTC)
- 15% Strong Altcoins
- 10% Memecoin
- 5% DEX Coins

**Trading Stats:**
- $68K-100K cumulative futures volume
- Thesis-driven, risk-controlled approach
- Spot and CEX/DEX derivatives

**Skills:** DeFi protocols, On-chain analysis, Smart contracts, Portfolio management`,
    quickReplies: [
      { label: 'Web3 Projects', value: 'Have you built any Web3 projects?' },
      { label: 'Cybersecurity', value: 'Tell me about cybersecurity' }
    ]
  },
  certifications: {
    patterns: ['certification', 'certificate', 'credential', 'course', 'harvard', 'stanford', 'google', 'ibm', 'mckinsey'],
    response: `**50+ Certifications from:**

**Elite Universities:**
- Leadership (Harvard)
- Machine Learning (Stanford)
- Finance (Cambridge)
- Web3 (INSEAD)

**Tech Giants:**
- Cybersecurity, BI, PM (Google)
- AI & Data Engineering (IBM)
- AWS Fundamentals (Amazon)

**Consulting Firms:**
- Forward Program (McKinsey)
- Strategy (BCG, Deloitte, Accenture)
- Audit & Finance (PwC, EY, KPMG)`,
    quickReplies: [
      { label: 'View All', value: 'How can I see all certifications?' },
      { label: 'Skills', value: 'What skills do you have?' }
    ]
  },
  contact: {
    patterns: ['contact', 'email', 'reach', 'hire', 'connect', 'work together', 'collaborate'],
    response: `**Let's Connect!**

- Email: hi@heyibnu.com
- GitHub: github.com/subkhanibnuaji
- LinkedIn: linkedin.com/in/subkhanibnuaji
- Location: Jakarta, Indonesia

I'm open to:
- Project Collaboration
- Consulting Opportunities
- Speaking Engagements
- Advisory Roles

Visit the **Contact** page to send a message!`,
    quickReplies: [
      { label: 'Go to Contact', value: 'How do I go to the contact page?' }
    ]
  },
  navigation: {
    patterns: ['page', 'navigate', 'go to', 'where', 'find', 'see all'],
    response: `**Website Navigation:**

- **/about** - Timeline, education, experience
- **/projects** - All projects showcase
- **/interests** - AI, Blockchain, Cybersecurity deep-dive
- **/certifications** - 50+ credentials
- **/contact** - Send me a message

**Keyboard Shortcuts:**
- Press **Cmd+K** (or Ctrl+K) to open command palette
- Press **T** to open terminal emulator`,
    quickReplies: [
      { label: 'About Page', value: 'What can I find on the About page?' },
      { label: 'Terminal', value: 'How do I use the terminal?' }
    ]
  },
  terminal: {
    patterns: ['terminal', 'command', 'cli', 'shell'],
    response: `**Interactive Terminal**

Press **T** or click the Terminal button to open an interactive terminal emulator!

**Popular Commands:**
- \`help\` - Show all commands
- \`about\` - About Ibnu
- \`skills\` - List all skills
- \`projects\` - View projects
- \`crypto\` - Crypto portfolio info
- \`neofetch\` - System info ASCII art
- \`matrix\` - Fun easter egg!

Try typing \`help\` in the terminal for a full list of 40+ commands.`,
    quickReplies: [
      { label: 'Open Terminal', value: 'How do I open the terminal?' }
    ]
  },
  default: {
    response: "I'm not sure about that specific topic, but I can help you with information about Ibnu's background, projects, skills, interests (AI, Blockchain, Cybersecurity), certifications, and more. What would you like to know?",
    quickReplies: [
      { label: 'About Ibnu', value: 'Tell me about Ibnu' },
      { label: 'Projects', value: 'What projects has he worked on?' },
      { label: 'Interests', value: 'What are your interests?' },
      { label: 'Contact', value: 'How can I contact you?' }
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
  { label: 'Interests', value: 'What are your interests?' }
]

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const sendMessage = (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    // Find response from knowledge base
    const { response, quickReplies } = findResponse(content)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      quickReplies
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hi! I'm Ibnu's portfolio assistant. What would you like to know?",
        timestamp: new Date(),
        quickReplies: INITIAL_QUICK_REPLIES
      }
    ])
  }

  // Get the last message's quick replies
  const lastMessage = messages[messages.length - 1]
  const showQuickReplies = lastMessage?.role === 'assistant' && lastMessage?.quickReplies

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
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed bottom-6 right-6 z-50',
              'w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)]',
              'flex flex-col rounded-2xl overflow-hidden',
              'bg-background/95 backdrop-blur-xl border border-border',
              'shadow-2xl shadow-black/20'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-cyber-gradient flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-cyber-green rounded-full border-2 border-background" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Portfolio Assistant</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Quick Answers
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" onClick={clearChat} className="h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

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
                      message.role === 'user' ? 'bg-primary' : 'bg-cyber-gradient'
                    )}
                  >
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-2.5',
                      message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}
                  >
                    {message.role === 'assistant' ? (
                      <div className="text-sm whitespace-pre-line">
                        {message.content.split('\n').map((line, i) => {
                          // Handle bold text
                          const parts = line.split(/(\*\*[^*]+\*\*)/g)
                          return (
                            <p key={i} className={line.startsWith('-') ? 'ml-2' : ''}>
                              {parts.map((part, j) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return <strong key={j}>{part.slice(2, -2)}</strong>
                                }
                                return part
                              })}
                            </p>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}
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

            {/* Input */}
            <div className="p-4 border-t border-border bg-card/50">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  className={cn(
                    'flex-1 px-4 py-2.5 rounded-xl',
                    'bg-muted border-0 outline-none',
                    'text-sm placeholder:text-muted-foreground',
                    'focus:ring-2 focus:ring-primary/20'
                  )}
                />
                <Button size="icon" onClick={() => sendMessage(input)} disabled={!input.trim()} className="shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Bot, X, Send, User, Trash2, Sparkles, Brain, Zap, Loader2, Wand2, ImageIcon, Calculator, Clock, Languages, Code, QrCode, FileDown, Presentation, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { generatePDF, generatePPT, type PDFData, type PPTData } from '@/lib/ai/file-generators'

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

// Knowledge base for pattern matching - Comprehensive version
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
    patterns: ['education', 'study', 'university', 'degree', 'mba', 'bachelor', 'ugm', 'telkom', 'kuliah', 'sekolah', 'pendidikan'],
    response: `**Education:**

1. **Senior Executive MBA** - Universitas Gadjah Mada (UGM)
   - Period: 2022 - 2024
   - GPA: 3.60/4.00
   - Thesis: Product Differentiation Strategy at PT Sambel Korek DNO

2. **Bachelor of Informatics (S.Kom)** - Telkom University
   - Period: 2017 - 2021
   - GPA: 3.34/4.00
   - Thesis: Animo - Web-Based Automation for F&B SMEs

**Languages:** Indonesian (Native), English (TOEFL ITP 593), Arabic & Mandarin (Beginner, HSK 1)`,
    quickReplies: [
      { label: 'Work Experience', value: 'What is your work experience?' },
      { label: 'Certifications', value: 'What certifications do you have?' }
    ]
  },
  experience: {
    patterns: ['experience', 'work', 'job', 'career', 'ministry', 'consulting', 'startup', 'kerja', 'pengalaman'],
    response: `**Work Experience:**

1. **Civil Servant (ASN)** - Ministry of Housing & Settlement Areas
   - Aug 2024 - Present
   - Managing IT projects: HUB PKP, SIBARU, SIMONI
   - Evaluate procurement proposals >IDR 10B

2. **Founder & CEO** - Virtus Futura Consulting
   - Jul 2021 - Jul 2024
   - Managed portfolio >IDR 1T (~USD 71M)
   - Hospital feasibility, healthcare turnaround, F&B scale-up

3. **Founder & CEO** - Automate All (CV Solusi Automasi Indonesia)
   - Aug 2020 - Aug 2022
   - Built 100+ RPA bots, 50+ clients
   - Achieved IDR 1B valuation

4. **Independent Crypto Investor**
   - Jul 2021 - Present
   - $68K-100K cumulative futures volume`,
    quickReplies: [
      { label: 'Virtus Consulting', value: 'Tell me about Virtus Futura' },
      { label: 'Automate All', value: 'Tell me about Automate All startup' }
    ]
  },
  virtusfutura: {
    patterns: ['virtus', 'futura', 'consulting', 'consultant', 'konsultan'],
    response: `**Virtus Futura Consulting** (Jul 2021 - Jul 2024)

Project-based consulting firm in strategy, operations, and digital transformation.

**Key Achievements:**
- Managed portfolio >IDR 1T (~USD 71M)
- Hospital feasibility studies (IDR 331B project)
- Healthcare turnaround management
- Multi-clinic governance models
- F&B scale-up: IDR 100M to IDR 1B/month revenue

**Sectors:** Healthcare, F&B, Retail, Real Estate

The company was wound down when Ibnu joined the government as a Civil Servant.`,
    quickReplies: [
      { label: 'Automate All', value: 'Tell me about Automate All startup' },
      { label: 'Current Work', value: 'What are you doing now?' }
    ]
  },
  automateall: {
    patterns: ['automate all', 'automate', 'rpa', 'automation', 'robot', 'solusi automasi'],
    response: `**Automate All - CV Solusi Automasi Indonesia** (Aug 2020 - Aug 2022)

RPA (Robotic Process Automation) startup founded during college.

**Achievements:**
- Built 100+ automation bots for 10+ clients
- Served 50+ total clients
- Achieved IDR 1B valuation through pre-seed efforts
- Top 100 Startup - Startup4Industry 2021 (Ministry of Industry)
- Top 100 Startup - ASMI 2021 (Kemendikbud/Dikti)
- Top 45 - Bandung Startup Pitching Day (SBM ITB)
- Top 20 - BLOCK71 Community Open Incubation (NUS Enterprise)

**Services:** Document automation, data extraction, workflow automation, custom bots`,
    quickReplies: [
      { label: 'Awards', value: 'What awards has he won?' },
      { label: 'Current Role', value: 'What are you doing now?' }
    ]
  },
  projects: {
    patterns: ['project', 'portfolio', 'work on', 'built', 'develop', 'proyek'],
    response: `**Key Projects:**

1. **HUB PKP (Klinik Rumah)** - In Development
   - Digital platform for Indonesia's self-built housing program
   - AI-powered design, permits, marketplace

2. **SIBARU** - Active
   - Enterprise information system for ministry

3. **SIMONI** - Active
   - Housing program monitoring system

4. **RPA Solutions** - 100+ bots for 10+ clients

5. **ICP Token dApp** - Web3 app on Internet Computer

6. **This Portfolio** - Next.js 15, AI chatbot, Terminal emulator`,
    quickReplies: [
      { label: 'HUB PKP Details', value: 'Tell me more about HUB PKP project' },
      { label: 'Tech Stack', value: 'What technologies do you use?' }
    ]
  },
  hubpkp: {
    patterns: ['hub pkp', 'klinik rumah', 'housing platform', 'rumah', 'housing', 'perumahan'],
    response: `**HUB PKP - Klinik Rumah**

The flagship digital platform for Indonesia's self-built housing ecosystem.

**Features:**
- AI-powered house design consultation
- Integrated permit processing (PBG/SIMBG)
- Material marketplace with price comparison
- Certified worker/contractor facilitation
- Housing finance integration with banks
- Construction monitoring system

**Impact:**
Streamlines housing construction for 84% of Indonesian homes built through self-construction (swadaya).

**Technologies:** React, TypeScript, Node.js, PostgreSQL, AWS, SIMBG API integration`,
    quickReplies: [
      { label: 'Other Projects', value: 'What other projects have you worked on?' },
      { label: 'Tech Stack', value: 'What technologies do you use?' }
    ]
  },
  skills: {
    patterns: ['skill', 'technology', 'tech stack', 'programming', 'framework', 'tools', 'expertise', 'kemampuan', 'keahlian'],
    response: `**Technical Skills:**

**Programming:** Python (90%), JavaScript (85%), TypeScript (80%), SQL (85%), Solidity (70%)

**Frameworks:** React/Next.js (85%), Node.js (80%), FastAPI (70%), LangChain (75%), TailwindCSS (85%)

**AI/ML:** LLM Workflows (85%), Prompt Engineering (90%), Agentic AI (80%), RAG Systems (75%)

**Blockchain:** DeFi Protocols (80%), Smart Contracts (70%), On-chain Analysis (75%)

**Cloud & DevOps:** AWS (80%), Docker (70%), Linux (80%), Git (90%)

**Soft Skills:** Project Management, Strategic Planning, Team Leadership, Public Speaking`,
    quickReplies: [
      { label: 'Certifications', value: 'What certifications do you have?' },
      { label: 'AI Skills', value: 'Tell me about your AI experience' }
    ]
  },
  interests: {
    patterns: ['interest', 'passion', 'focus', 'specialization', 'minat', 'passion'],
    response: `**Three Core Interests:**

1. **Artificial Intelligence**
   - Agentic AI & Multi-Agent Systems
   - LLM Workflows & Prompt Engineering
   - AI for Government Documentation
   - RAG Systems & Knowledge Bases

2. **Crypto & Blockchain**
   - Portfolio Management & DeFi
   - On-chain Analysis & Research
   - Smart Contract Development
   - Token Economics

3. **Cybersecurity**
   - Defensive Security & OPSEC
   - OSINT & Threat Intelligence
   - Web Application Security
   - Privacy & Anonymity`,
    quickReplies: [
      { label: 'AI Details', value: 'Tell me more about your AI work' },
      { label: 'Crypto Trading', value: 'Tell me about your crypto experience' },
      { label: 'Cybersecurity', value: 'Tell me about cybersecurity' }
    ]
  },
  ai: {
    patterns: ['artificial intelligence', 'machine learning', 'llm', 'langchain', 'gpt', 'claude', 'agentic', 'rag', 'kecerdasan buatan'],
    response: `**AI & Machine Learning:**

I explore agentic AI systems, LLM workflows, and their applications in government and enterprise.

**Focus Areas:**
- Agentic AI & Multi-Agent Systems
- RAG (Retrieval Augmented Generation)
- Prompt Engineering & Chain-of-Thought
- AI for Government Documentation
- Autonomous Task Completion

**Technologies:** LangChain, LangGraph, AutoGen, CrewAI, OpenAI, Claude, Ollama, HuggingFace

**Vision:** AI will revolutionize government service delivery through autonomous document processing and intelligent citizen assistance.`,
    quickReplies: [
      { label: 'Projects', value: 'What AI projects have you built?' },
      { label: 'Blockchain', value: 'Tell me about your blockchain work' }
    ]
  },
  crypto: {
    patterns: ['crypto', 'bitcoin', 'trading', 'defi', 'web3', 'futures', 'altcoin', 'memecoin'],
    response: `**Crypto & Trading Experience:**

**Portfolio Allocation:**
- 70% Bitcoin (BTC) - Core holding
- 15% Strong Altcoins - ETH, SOL, etc.
- 10% Memecoin - High risk, high reward
- 5% DEX Coins - Liquidity provision

**Trading Stats:**
- $68K-100K cumulative futures volume
- Thesis-driven, risk-controlled approach
- Spot and CEX/DEX derivatives
- Active on Binance, Bybit, Jupiter, GMX

**Skills:** DeFi protocols, On-chain analysis, Smart contracts, Portfolio management, MEV research`,
    quickReplies: [
      { label: 'Web3 Projects', value: 'Have you built any Web3 projects?' },
      { label: 'DeFi Details', value: 'Tell me about DeFi' }
    ]
  },
  defi: {
    patterns: ['defi', 'decentralized finance', 'yield', 'liquidity', 'swap', 'lending'],
    response: `**DeFi Experience:**

**Protocols Used:**
- DEXs: Uniswap, Jupiter, Raydium, GMX
- Lending: Aave, Compound, Kamino
- Derivatives: GMX, dYdX, Hyperliquid
- Yield: Convex, Yearn, Marinade

**Skills:**
- Liquidity provision & yield farming
- Perpetual futures trading
- On-chain analysis (Dune, Arkham, DefiLlama)
- MEV protection strategies
- Bridge & cross-chain operations

**Philosophy:** DeFi enables financial sovereignty and removes intermediaries from finance.`,
    quickReplies: [
      { label: 'Crypto Portfolio', value: 'Tell me about your crypto portfolio' },
      { label: 'Web3 Projects', value: 'Have you built Web3 projects?' }
    ]
  },
  cybersecurity: {
    patterns: ['cybersecurity', 'security', 'hacking', 'pentest', 'osint', 'opsec', 'keamanan', 'cyber'],
    response: `**Cybersecurity Focus:**

**Areas of Interest:**
- Defensive Security & Hardening
- OPSEC (Operational Security)
- OSINT (Open Source Intelligence)
- Threat Intelligence & Analysis
- Web Application Security
- Privacy & Anonymity

**Tools & Frameworks:**
- Burp Suite, OWASP ZAP
- Nmap, Wireshark
- Maltego, theHarvester
- Linux security hardening

**Certifications:** Google Cybersecurity Professional, IBM Cybersecurity Analyst

**Philosophy:** Security is a mindset, not just tools. Defense-in-depth and zero trust.`,
    quickReplies: [
      { label: 'Certifications', value: 'What security certifications?' },
      { label: 'AI Security', value: 'AI and security?' }
    ]
  },
  certifications: {
    patterns: ['certification', 'certificate', 'credential', 'course', 'harvard', 'stanford', 'google', 'ibm', 'mckinsey', 'sertifikat'],
    response: `**50+ Certifications from:**

**Elite Universities:**
- Leadership (Harvard)
- Machine Learning (Stanford)
- Finance (Cambridge Judge)
- Web3 & Blockchain (INSEAD)
- Business Strategy (Wharton)

**Tech Giants:**
- Cybersecurity Professional (Google)
- Business Intelligence (Google)
- Project Management (Google)
- AI & Data Engineering (IBM)
- AWS Cloud Fundamentals (Amazon)

**Consulting Firms:**
- Forward Program (McKinsey)
- Strategy Consulting (BCG, Deloitte)
- Audit & Finance (PwC, EY, KPMG)

Visit **/certifications** to see all credentials!`,
    quickReplies: [
      { label: 'View All Certs', value: 'How can I see all certifications?' },
      { label: 'Skills', value: 'What skills do you have?' }
    ]
  },
  awards: {
    patterns: ['award', 'achievement', 'penghargaan', 'prestasi', 'trophy', 'winner'],
    response: `**Awards & Achievements:**

**Academic:**
- 2nd Best Outstanding Graduate (Innovation & Entrepreneurship) - Telkom University 2022

**Startup Competitions:**
- Top 100 Startup - Startup4Industry 2021 (Ministry of Industry)
- Top 100 Startup - ASMI 2021 (Kemendikbud/Dikti)
- Top 45 - Bandung Startup Pitching Day (SBM ITB / LPIK ITB)
- Top 20 - BLOCK71 Community Open Incubation (NUS Enterprise Singapore)

**Business:**
- Achieved IDR 1B startup valuation (Automate All)
- Managed IDR 1T+ consulting portfolio (Virtus Futura)`,
    quickReplies: [
      { label: 'Automate All', value: 'Tell me about Automate All' },
      { label: 'Virtus Consulting', value: 'Tell me about Virtus Futura' }
    ]
  },
  organizations: {
    patterns: ['organization', 'membership', 'member', 'cfa', 'hipmi', 'kadin', 'komunitas', 'organisasi'],
    response: `**Professional Memberships:**

1. **CFA Institute** - Member
   - ID: 200530563
   - Since 2024

2. **KADIN Indonesia** - Member
   - ID: 20203-2132274685
   - Chamber of Commerce

3. **BPD HIPMI JAYA** - Member
   - DKI Jakarta Young Entrepreneurs
   - Since 2021

4. **Akademi Crypto** - Lifetime Member
   - Indonesian crypto community
   - Since 2023

These networks help me stay connected with business and tech communities.`,
    quickReplies: [
      { label: 'Contact', value: 'How can I contact you?' },
      { label: 'LinkedIn', value: 'What is your LinkedIn?' }
    ]
  },
  contact: {
    patterns: ['contact', 'email', 'reach', 'hire', 'connect', 'work together', 'collaborate', 'hubungi', 'kontak'],
    response: `**Let's Connect!**

**Contact Info:**
- Email: hi@heyibnu.com
- GitHub: github.com/subkhanibnuaji
- LinkedIn: linkedin.com/in/subkhanibnuaji
- Twitter: @subkhanibnuaji
- Location: Jakarta, Indonesia

**Open For:**
- Project Collaboration
- Consulting Opportunities
- Speaking Engagements
- Advisory Roles
- Technical Discussions

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

Fully open source!`,
    quickReplies: [
      { label: 'Skills', value: 'What are your skills?' },
      { label: 'GitHub', value: 'Where is the source code?' }
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
    response: "I'm not sure about that specific topic. I can help you with information about:\n\n- **Background** - Education, experience, skills\n- **Projects** - HUB PKP, RPA solutions, Web3\n- **Interests** - AI, Blockchain, Cybersecurity\n- **Certifications** - 50+ credentials\n- **Contact** - How to reach Ibnu\n\nWhat would you like to know?",
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
  const [mode, setMode] = useState<ChatMode>('quick')
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize messages on client-side only to prevent hydration mismatch
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

  // Send message with AI mode (using Groq API)
  const sendAIMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput('')
    setIsLoading(true)

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
                setMessages(prev => {
                  const updated = [...prev]
                  const lastMessage = updated[updated.length - 1]
                  if (lastMessage.role === 'assistant') {
                    lastMessage.content += parsed.content
                  }
                  return updated
                })
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
    } catch (error) {
      console.error('AI Chat Error:', error)
      setMessages(prev => {
        const updated = [...prev]
        const lastMessage = updated[updated.length - 1]
        if (lastMessage.role === 'assistant') {
          lastMessage.content = error instanceof Error
            ? `Error: ${error.message}\n\nTip: Make sure GROQ_API_KEY is set. Get free key at console.groq.com`
            : 'Sorry, an error occurred. Please try again.'
        }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Send message with Agent mode (using tools including image generation)
  const sendAgentMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      toolExecutions: [],
      images: []
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput('')
    setIsLoading(true)

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
                setMessages(prev => {
                  const updated = [...prev]
                  const lastMessage = updated[updated.length - 1]
                  if (lastMessage.role === 'assistant') {
                    lastMessage.toolExecutions = [...toolExecutions]
                  }
                  return [...updated]
                })
              } else if (parsed.type === 'tool_result') {
                const lastExecution = toolExecutions[toolExecutions.length - 1]
                if (lastExecution) {
                  lastExecution.result = parsed.result
                  lastExecution.isLoading = false

                  // Check result type and handle accordingly
                  const parsedResult = parseSpecialResult(parsed.result || '')
                  if (parsedResult.type === 'image' || parsedResult.type === 'qr') {
                    images.push(parsedResult.content)
                  } else if (parsedResult.type === 'pdf' || parsedResult.type === 'ppt') {
                    // Trigger file download (async, don't block)
                    handleFileGeneration(parsed.result || '').catch(err => {
                      console.error('File generation error:', err)
                    })
                  }

                  setMessages(prev => {
                    const updated = [...prev]
                    const lastMessage = updated[updated.length - 1]
                    if (lastMessage.role === 'assistant') {
                      lastMessage.toolExecutions = [...toolExecutions]
                      lastMessage.images = [...images]
                    }
                    return [...updated]
                  })
                }
              } else if (parsed.type === 'response' || parsed.type === 'text') {
                setMessages(prev => {
                  const updated = [...prev]
                  const lastMessage = updated[updated.length - 1]
                  if (lastMessage.role === 'assistant') {
                    lastMessage.content = parsed.content || ''
                    lastMessage.toolExecutions = toolExecutions
                    lastMessage.images = images
                  }
                  return [...updated]
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
    } catch (error) {
      console.error('Agent Chat Error:', error)
      setMessages(prev => {
        const updated = [...prev]
        const lastMessage = updated[updated.length - 1]
        if (lastMessage.role === 'assistant') {
          lastMessage.content = error instanceof Error
            ? `Error: ${error.message}\n\nTip: Make sure GROQ_API_KEY is set. Get free key at console.groq.com`
            : 'Sorry, an error occurred. Please try again.'
        }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Send message with Quick mode (pattern matching)
  const sendQuickMessage = (content: string) => {
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

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput('')
  }

  const sendMessage = (content: string) => {
    if (!content.trim() || isLoading) return

    if (mode === 'agent') {
      sendAgentMessage(content)
    } else if (mode === 'ai') {
      sendAIMessage(content)
    } else {
      sendQuickMessage(content)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const getWelcomeMessage = (chatMode: ChatMode) => {
    switch (chatMode) {
      case 'agent':
        return "Hi! I'm IbnuGPT Agent with superpowers! I can:\n• Generate images from text\n• Generate QR codes\n• Create memes\n• Generate PDF documents\n• Create PowerPoint presentations\n• Calculate math & get time\n• Translate text & generate code\n\nTry: \"Generate a QR code for heyibnu.com\" or \"Create a PDF about AI\""
      case 'ai':
        return "Hi! I'm IbnuGPT powered by Llama 3.3 (via Groq). I can answer any questions with AI intelligence. What would you like to know?"
      default:
        return "Hi! I'm Ibnu's portfolio assistant. I can help you learn about his background, projects, skills, and interests. What would you like to know?"
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: getWelcomeMessage(mode),
        timestamp: new Date(),
        quickReplies: mode === 'quick' ? INITIAL_QUICK_REPLIES : undefined
      }
    ])
  }

  const switchMode = (newMode: ChatMode) => {
    setMode(newMode)
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: getWelcomeMessage(newMode),
        timestamp: new Date(),
        quickReplies: newMode === 'quick' ? INITIAL_QUICK_REPLIES : undefined
      }
    ])
  }

  // Get the last message's quick replies
  const lastMessage = messages[messages.length - 1]
  const showQuickReplies = mode === 'quick' && lastMessage?.role === 'assistant' && lastMessage?.quickReplies

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
                      <>
                        <Wand2 className="h-3 w-3" />
                        Image Gen + Tools
                      </>
                    ) : mode === 'ai' ? (
                      <>
                        <Brain className="h-3 w-3" />
                        AI Powered (Llama 3.3)
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3" />
                        Quick Answers
                      </>
                    )}
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
                <Zap className="h-3 w-3" />
                Quick
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
                <Brain className="h-3 w-3" />
                AI Chat
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
                <Wand2 className="h-3 w-3" />
                Agent
              </button>
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

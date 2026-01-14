// Terminal Emulator for Ibnu's Portfolio
// Interactive command-line interface with portfolio-specific commands

class Terminal {
    constructor() {
        this.isOpen = false;
        this.history = [];
        this.historyIndex = -1;
        this.currentInput = '';
        this.user = 'visitor';
        this.host = 'ibnu.dev';
        this.cwd = '~';
        
        this.commands = {
            help: this.cmdHelp.bind(this),
            about: this.cmdAbout.bind(this),
            skills: this.cmdSkills.bind(this),
            projects: this.cmdProjects.bind(this),
            experience: this.cmdExperience.bind(this),
            certifications: this.cmdCertifications.bind(this),
            contact: this.cmdContact.bind(this),
            social: this.cmdSocial.bind(this),
            interests: this.cmdInterests.bind(this),
            crypto: this.cmdCrypto.bind(this),
            clear: this.cmdClear.bind(this),
            whoami: this.cmdWhoami.bind(this),
            date: this.cmdDate.bind(this),
            pwd: this.cmdPwd.bind(this),
            ls: this.cmdLs.bind(this),
            cd: this.cmdCd.bind(this),
            cat: this.cmdCat.bind(this),
            echo: this.cmdEcho.bind(this),
            neofetch: this.cmdNeofetch.bind(this),
            matrix: this.cmdMatrix.bind(this),
            exit: this.cmdExit.bind(this),
            goto: this.cmdGoto.bind(this),
            theme: this.cmdTheme.bind(this),
            fortune: this.cmdFortune.bind(this),
            sudo: this.cmdSudo.bind(this),
            hack: this.cmdHack.bind(this),
            coffee: this.cmdCoffee.bind(this),
            weather: this.cmdWeather.bind(this),
            uptime: this.cmdUptime.bind(this),
            history: this.cmdHistory.bind(this),
        };
        
        this.fileSystem = {
            '~': ['about.txt', 'skills.txt', 'projects/', 'contact.txt', 'resume.pdf'],
            '~/projects': ['hub-pkp/', 'sibaru/', 'simoni/', 'rpa-solutions/', 'icp-token/'],
            '~/projects/hub-pkp': ['README.md', 'features.txt', 'tech-stack.txt'],
        };
        
        this.files = {
            'about.txt': `
╔══════════════════════════════════════════════════════════════╗
║                    SUBKHAN IBNU AJI                          ║
║              S.Kom., M.B.A. | Jakarta, Indonesia             ║
╚══════════════════════════════════════════════════════════════╝

Cross-functional professional with expertise in:
• Digital Transformation & IT Governance
• AI/ML & Agentic Systems
• Blockchain/Web3 Development
• Cybersecurity & Risk Management

Currently serving at Indonesia's Ministry of Housing and 
Settlement Areas (Kementerian PKP), handling enterprise IT 
projects including SIBARU, PKP HUB, and SIMONI systems.

Education:
• MBA - Universitas Gadjah Mada (GPA: 3.60)
• B.Sc. Informatics - Telkom University (GPA: 3.34)
• TOEFL ITP: 593

Email: hi@heyibnu.com
`,
            'skills.txt': `
TECHNICAL SKILLS
================

[Programming]
Python ████████████████████ 90%
JavaScript ██████████████████ 85%
TypeScript ████████████████ 80%
Solidity ██████████████ 70%
Motoko ████████████ 60%

[Frameworks]
React/Next.js ██████████████████ 85%
Node.js ████████████████ 80%
LangChain ██████████████ 70%
FastAPI ████████████ 60%

[AI/ML]
LLM Workflows ██████████████████ 85%
Prompt Engineering ████████████████████ 90%
Agentic AI ████████████████ 80%
Computer Vision ██████████████ 70%

[Blockchain]
DeFi Protocols ████████████████ 80%
Smart Contracts ██████████████ 70%
ICP Development ████████████ 60%

[Cloud/DevOps]
AWS ████████████████ 80%
Docker ██████████████ 70%
Linux Admin ████████████████ 80%
`,
            'contact.txt': `
CONTACT INFORMATION
===================

📧 Email: hi@heyibnu.com
🔗 LinkedIn: linkedin.com/in/subkhanibnuaji
💻 GitHub: github.com/subkhanibnuaji
📍 Location: Jakarta, Indonesia (GMT+7)

Available for:
• Consulting engagements
• Freelance projects
• Speaking opportunities
• Web3 collaborations

Response time: 24-48 hours
`,
            '~/projects/hub-pkp/README.md': `
# HUB PKP - Digital Housing Ecosystem

## Overview
Comprehensive digital platform for Indonesia's self-built 
housing program under Ministry PKP.

## Key Features
• AI-powered house design consultation
• Integrated permit processing (PBG/SIMBG)
• Material marketplace with price comparison
• Certified worker facilitation
• Housing finance integration
• Construction monitoring system

## Impact
• Streamlines housing construction process
• Reduces bureaucratic friction
• Empowers communities to build quality homes
• Supports government housing initiatives

## Tech Stack
• Frontend: React, TypeScript
• Backend: Node.js, PostgreSQL
• Integration: SIMBG API, Banking APIs
`,
        };
        
        this.startTime = Date.now();
        this.init();
    }
    
    init() {
        this.createTerminalElement();
        this.bindEvents();
    }
    
    createTerminalElement() {
        // Check if terminal already exists
        if (document.getElementById('terminal-window')) return;
        
        const terminal = document.createElement('div');
        terminal.id = 'terminal-window';
        terminal.className = 'terminal-window';
        terminal.innerHTML = `
            <div class="terminal-header">
                <div class="terminal-controls">
                    <span class="control close" data-action="close"></span>
                    <span class="control minimize" data-action="minimize"></span>
                    <span class="control maximize" data-action="maximize"></span>
                </div>
                <div class="terminal-title">${this.user}@${this.host}: ${this.cwd}</div>
            </div>
            <div class="terminal-body" id="terminal-body">
                <div class="terminal-output" id="terminal-output"></div>
                <div class="terminal-input-line">
                    <span class="terminal-prompt">${this.getPrompt()}</span>
                    <input type="text" class="terminal-input" id="terminal-input" autocomplete="off" spellcheck="false">
                    <span class="terminal-cursor"></span>
                </div>
            </div>
        `;
        
        document.body.appendChild(terminal);
        
        // Add terminal styles if not present
        this.injectStyles();
    }
    
    injectStyles() {
        if (document.getElementById('terminal-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'terminal-styles';
        styles.textContent = `
            .terminal-window {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.9);
                width: 800px;
                max-width: 95vw;
                height: 500px;
                max-height: 80vh;
                background: rgba(10, 10, 26, 0.98);
                border: 1px solid rgba(0, 212, 255, 0.3);
                border-radius: 12px;
                box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5),
                            0 0 40px rgba(0, 212, 255, 0.1);
                z-index: 10000;
                display: none;
                flex-direction: column;
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                font-family: 'JetBrains Mono', 'Fira Code', monospace;
            }
            
            .terminal-window.active {
                display: flex;
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            
            .terminal-header {
                display: flex;
                align-items: center;
                padding: 12px 16px;
                background: rgba(0, 0, 0, 0.3);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px 12px 0 0;
            }
            
            .terminal-controls {
                display: flex;
                gap: 8px;
            }
            
            .terminal-controls .control {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                cursor: pointer;
                transition: transform 0.2s, filter 0.2s;
            }
            
            .terminal-controls .control:hover {
                transform: scale(1.2);
                filter: brightness(1.2);
            }
            
            .terminal-controls .close { background: #ff5f57; }
            .terminal-controls .minimize { background: #ffbd2e; }
            .terminal-controls .maximize { background: #28ca41; }
            
            .terminal-title {
                flex: 1;
                text-align: center;
                color: #64748b;
                font-size: 13px;
            }
            
            .terminal-body {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
            }
            
            .terminal-output {
                flex: 1;
                white-space: pre-wrap;
                word-wrap: break-word;
                color: #e2e8f0;
                font-size: 14px;
                line-height: 1.6;
            }
            
            .terminal-output .command-line {
                color: #00d4ff;
            }
            
            .terminal-output .output-text {
                color: #e2e8f0;
            }
            
            .terminal-output .error-text {
                color: #ff6b6b;
            }
            
            .terminal-output .success-text {
                color: #13FFAA;
            }
            
            .terminal-output .info-text {
                color: #8b5cf6;
            }
            
            .terminal-output .highlight {
                color: #00d4ff;
            }
            
            .terminal-input-line {
                display: flex;
                align-items: center;
                margin-top: 8px;
            }
            
            .terminal-prompt {
                color: #13FFAA;
                margin-right: 8px;
                white-space: nowrap;
            }
            
            .terminal-input {
                flex: 1;
                background: transparent;
                border: none;
                outline: none;
                color: #f8fafc;
                font-family: inherit;
                font-size: 14px;
                caret-color: #00d4ff;
            }
            
            .terminal-cursor {
                display: inline-block;
                width: 8px;
                height: 18px;
                background: #00d4ff;
                animation: blink 1s step-end infinite;
            }
            
            @keyframes blink {
                50% { opacity: 0; }
            }
            
            .ascii-art {
                color: #00d4ff;
                font-size: 10px;
                line-height: 1.2;
            }
            
            .matrix-text {
                color: #13FFAA;
                text-shadow: 0 0 10px #13FFAA;
            }
            
            /* Scrollbar */
            .terminal-body::-webkit-scrollbar {
                width: 8px;
            }
            
            .terminal-body::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
            }
            
            .terminal-body::-webkit-scrollbar-thumb {
                background: rgba(0, 212, 255, 0.3);
                border-radius: 4px;
            }
            
            .terminal-body::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 212, 255, 0.5);
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    bindEvents() {
        // Close button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('control') && e.target.dataset.action === 'close') {
                this.close();
            }
        });
        
        // Input handling
        document.addEventListener('keydown', (e) => {
            const input = document.getElementById('terminal-input');
            if (!this.isOpen || !input) return;
            
            if (e.key === 'Enter') {
                this.executeCommand(input.value);
                input.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory(1);
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.autocomplete(input);
            } else if (e.key === 'c' && e.ctrlKey) {
                this.print('^C', 'error-text');
                input.value = '';
            } else if (e.key === 'l' && e.ctrlKey) {
                e.preventDefault();
                this.cmdClear();
            }
        });
        
        // Focus input when clicking terminal body
        document.addEventListener('click', (e) => {
            if (e.target.closest('.terminal-body')) {
                document.getElementById('terminal-input')?.focus();
            }
        });
        
        // Escape to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    getPrompt() {
        return `<span class="highlight">${this.user}</span>@<span class="info-text">${this.host}</span>:<span class="success-text">${this.cwd}</span>$ `;
    }
    
    updatePrompt() {
        const promptEl = document.querySelector('.terminal-prompt');
        if (promptEl) {
            promptEl.innerHTML = this.getPrompt();
        }
        const titleEl = document.querySelector('.terminal-title');
        if (titleEl) {
            titleEl.textContent = `${this.user}@${this.host}: ${this.cwd}`;
        }
    }
    
    open() {
        const terminal = document.getElementById('terminal-window');
        if (terminal) {
            terminal.classList.add('active');
            this.isOpen = true;
            
            // Show welcome message if first time
            if (this.history.length === 0) {
                this.showWelcome();
            }
            
            setTimeout(() => {
                document.getElementById('terminal-input')?.focus();
            }, 100);
        }
    }
    
    close() {
        const terminal = document.getElementById('terminal-window');
        if (terminal) {
            terminal.classList.remove('active');
            this.isOpen = false;
        }
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    showWelcome() {
        const welcome = `
<span class="ascii-art">
 ██╗██████╗ ███╗   ██╗██╗   ██╗
 ██║██╔══██╗████╗  ██║██║   ██║
 ██║██████╔╝██╔██╗ ██║██║   ██║
 ██║██╔══██╗██║╚██╗██║██║   ██║
 ██║██████╔╝██║ ╚████║╚██████╔╝
 ╚═╝╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ 
</span>
<span class="info-text">Welcome to Ibnu's Portfolio Terminal v2.0</span>
<span class="output-text">Type </span><span class="highlight">'help'</span><span class="output-text"> to see available commands.</span>

`;
        this.print(welcome);
    }
    
    print(text, className = 'output-text') {
        const output = document.getElementById('terminal-output');
        if (output) {
            const line = document.createElement('div');
            line.className = className;
            line.innerHTML = text;
            output.appendChild(line);
            this.scrollToBottom();
        }
    }
    
    scrollToBottom() {
        const body = document.getElementById('terminal-body');
        if (body) {
            body.scrollTop = body.scrollHeight;
        }
    }
    
    executeCommand(input) {
        const trimmed = input.trim();
        
        // Print the command
        this.print(`<span class="command-line">${this.getPrompt()}${trimmed}</span>`);
        
        if (!trimmed) return;
        
        // Add to history
        this.history.push(trimmed);
        this.historyIndex = this.history.length;
        
        // Parse command and arguments
        const parts = trimmed.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // Execute command
        if (this.commands[cmd]) {
            this.commands[cmd](args);
        } else {
            this.print(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error-text');
        }
    }
    
    navigateHistory(direction) {
        const input = document.getElementById('terminal-input');
        if (!input) return;
        
        const newIndex = this.historyIndex + direction;
        
        if (newIndex >= 0 && newIndex < this.history.length) {
            this.historyIndex = newIndex;
            input.value = this.history[newIndex];
        } else if (newIndex >= this.history.length) {
            this.historyIndex = this.history.length;
            input.value = '';
        }
    }
    
    autocomplete(input) {
        const value = input.value.trim();
        const commands = Object.keys(this.commands);
        const matches = commands.filter(cmd => cmd.startsWith(value));
        
        if (matches.length === 1) {
            input.value = matches[0] + ' ';
        } else if (matches.length > 1) {
            this.print(`\nPossible commands: ${matches.join(', ')}`, 'info-text');
        }
    }
    
    // ============ COMMANDS ============
    
    cmdHelp() {
        const help = `
<span class="highlight">AVAILABLE COMMANDS</span>
<span class="info-text">═══════════════════</span>

<span class="success-text">Portfolio:</span>
  about          - About me
  skills         - Technical skills
  projects       - View projects
  experience     - Work experience
  certifications - Professional certifications
  interests      - AI, Crypto, Cybersecurity
  contact        - Contact information
  social         - Social media links
  crypto         - Crypto trading info

<span class="success-text">Navigation:</span>
  goto [page]    - Navigate to page (home/projects/about/contact/interests/certs)
  ls             - List files
  cd [dir]       - Change directory
  cat [file]     - View file contents
  pwd            - Print working directory

<span class="success-text">System:</span>
  clear          - Clear terminal
  help           - Show this help
  whoami         - Display user info
  date           - Show current date
  uptime         - Show session uptime
  history        - Command history
  neofetch       - System information
  theme [name]   - Change theme (cyber/matrix/sunset)

<span class="success-text">Fun:</span>
  matrix         - Enter the Matrix
  fortune        - Get a fortune
  coffee         - Get some coffee
  weather        - Check weather
  hack           - Hack the mainframe
  sudo [cmd]     - Try superuser

<span class="success-text">Exit:</span>
  exit           - Close terminal

<span class="info-text">Tip: Use Tab for autocomplete, Arrow keys for history</span>
`;
        this.print(help);
    }
    
    cmdAbout() {
        this.print(this.files['about.txt']);
    }
    
    cmdSkills() {
        this.print(this.files['skills.txt']);
    }
    
    cmdProjects() {
        const projects = `
<span class="highlight">PROJECTS</span>
<span class="info-text">════════</span>

<span class="success-text">1. HUB PKP</span> - Digital Housing Ecosystem
   Platform for Indonesia's self-built housing program
   Tech: React, Node.js, PostgreSQL
   Status: <span class="success-text">● Active</span>

<span class="success-text">2. SIBARU</span> - Enterprise Housing System
   Subsidized housing distribution platform
   Tech: Enterprise Stack
   Status: <span class="success-text">● Active</span>

<span class="success-text">3. SIMONI</span> - Monitoring & Analytics
   Real-time construction monitoring
   Tech: Dashboard, Analytics
   Status: <span class="success-text">● Active</span>

<span class="success-text">4. ICP Token dApp</span> - Web3 Application
   Fungible token on Internet Computer
   Tech: Motoko, React, Internet Identity
   Status: <span class="info-text">● Completed</span>

<span class="success-text">5. Animo</span> - F&B Automation
   Operations automation for F&B businesses
   Tech: Web Platform
   Status: <span class="info-text">● Completed</span>

Type 'goto projects' to see detailed project pages.
`;
        this.print(projects);
    }
    
    cmdExperience() {
        const exp = `
<span class="highlight">WORK EXPERIENCE</span>
<span class="info-text">════════════════</span>

<span class="success-text">● Ministry of Housing (PKP)</span>
  Position: IT Project Handler (ASN)
  Period: Aug 2024 - Present
  • Managing SIBARU, PKP HUB, SIMONI systems
  • End-to-end delivery of enterprise IT projects
  • Vendor coordination & procurement support
  • Projects valued > IDR 10 billion

<span class="success-text">● Virtus Futura Consulting</span>
  Position: Founder & CEO
  Period: Jul 2021 - Jul 2024
  • Portfolio value > IDR 1 Trillion
  • Healthcare & government consulting
  • Digital transformation projects
  • Hospital feasibility studies

<span class="success-text">● Automate All (CV Solusi Automasi)</span>
  Position: Founder & CEO
  Period: Aug 2020 - Aug 2022
  • RPA solutions for 50+ clients
  • Company valuation: IDR 1 Billion
  • Pre-seed funding secured

<span class="success-text">● Independent Crypto Trader</span>
  Period: Jul 2021 - Present
  • $68K-100K cumulative futures volume
  • Thesis-driven risk management
  • CEX & DEX trading strategies
`;
        this.print(exp);
    }
    
    cmdCertifications() {
        const certs = `
<span class="highlight">CERTIFICATIONS (50+)</span>
<span class="info-text">════════════════════</span>

<span class="success-text">Elite Universities:</span>
  • Harvard - Leadership
  • Stanford - Machine Learning, Game Theory
  • Cambridge - Foundations of Finance
  • INSEAD - Web3 & Blockchain

<span class="success-text">Tech Giants:</span>
  • Google - PM, BI, Cybersecurity, LLM
  • IBM - Data Engineering, AI Engineering
  • Microsoft - Azure AI, Power BI
  • Meta - Metaverse, Social Media Marketing

<span class="success-text">Consulting/Big4:</span>
  • McKinsey - Forward Program
  • BCG - Strategy Consulting
  • Deloitte, PwC, EY, KPMG, Accenture

<span class="success-text">Finance:</span>
  • JP Morgan - Commercial Banking
  • Goldman Sachs - Software Engineering
  • Bank of America - Investment Banking

<span class="success-text">Memberships:</span>
  • CFA Institute (ID: 200530563)
  • KADIN Indonesia (ID: 20203-2132274685)
  • Strategic Club MBA UGM
  • Akademi Crypto Lifetime

Type 'goto certs' for full list.
`;
        this.print(certs);
    }
    
    cmdContact() {
        this.print(this.files['contact.txt']);
    }
    
    cmdSocial() {
        const social = `
<span class="highlight">SOCIAL LINKS</span>
<span class="info-text">════════════</span>

<span class="success-text">GitHub:</span>     github.com/subkhanibnuaji
<span class="success-text">LinkedIn:</span>  linkedin.com/in/subkhanibnuaji
<span class="success-text">TikTok:</span>    @ibnu (40K+ followers)
<span class="success-text">Twitter:</span>   @subkhanibnuaji
<span class="success-text">Email:</span>     hi@heyibnu.com

Type 'goto contact' to visit contact page.
`;
        this.print(social);
    }
    
    cmdInterests() {
        const interests = `
<span class="highlight">CORE INTERESTS</span>
<span class="info-text">══════════════</span>

<span class="success-text">🤖 Artificial Intelligence</span>
   Focus: Agentic AI, LLM workflows, Prompt Engineering
   Vision: AI for government documentation & public service

<span class="success-text">⛓️ Blockchain/Web3</span>
   Focus: DeFi, Smart Contracts, ICP Development
   Experience: $68K-100K futures volume, active trading

<span class="success-text">🔐 Cybersecurity</span>
   Focus: OSINT, Web Security, Incident Response
   Skills: Ethical hacking, digital forensics, threat intel

Type 'goto interests' for deep dive.
`;
        this.print(interests);
    }
    
    cmdCrypto() {
        const crypto = `
<span class="highlight">CRYPTO TRADING PROFILE</span>
<span class="info-text">══════════════════════</span>

<span class="success-text">Trading Experience:</span>
  • Cumulative Futures Volume: $68K-100K USD
  • Approach: Thesis-driven, risk-controlled
  • Strategies: Spot & derivatives (CEX/DEX)

<span class="success-text">Portfolio Allocation:</span>
  ████████████████████ 70% Bitcoin (BTC)
  ██████               15% Strong Altcoins
  ████                 10% Memecoins
  ██                    5% DEX Coins

<span class="success-text">Risk Management:</span>
  • Position sizing with R-multiples
  • Stop-loss discipline
  • Portfolio tracking & journaling
  • On-chain research for liquidity analysis

<span class="success-text">Knowledge Areas:</span>
  • Market microstructure
  • Perpetual swaps & funding rates
  • Options (implied vol, skew)
  • DeFi protocols & yield strategies
`;
        this.print(crypto);
    }
    
    cmdClear() {
        const output = document.getElementById('terminal-output');
        if (output) {
            output.innerHTML = '';
        }
    }
    
    cmdWhoami() {
        this.print(`${this.user}`, 'success-text');
    }
    
    cmdDate() {
        const now = new Date();
        this.print(now.toString(), 'info-text');
    }
    
    cmdPwd() {
        this.print(this.cwd, 'success-text');
    }
    
    cmdLs(args) {
        const dir = this.cwd;
        const files = this.fileSystem[dir];
        
        if (files) {
            let output = '\n';
            files.forEach(f => {
                if (f.endsWith('/')) {
                    output += `<span class="info-text">${f}</span>  `;
                } else if (f.endsWith('.txt') || f.endsWith('.md')) {
                    output += `<span class="success-text">${f}</span>  `;
                } else {
                    output += `${f}  `;
                }
            });
            this.print(output);
        } else {
            this.print('Cannot list directory', 'error-text');
        }
    }
    
    cmdCd(args) {
        if (!args.length || args[0] === '~') {
            this.cwd = '~';
        } else if (args[0] === '..') {
            const parts = this.cwd.split('/');
            if (parts.length > 1) {
                parts.pop();
                this.cwd = parts.join('/') || '~';
            }
        } else {
            const newPath = this.cwd === '~' ? `~/${args[0].replace(/\/$/, '')}` : `${this.cwd}/${args[0].replace(/\/$/, '')}`;
            if (this.fileSystem[newPath]) {
                this.cwd = newPath;
            } else {
                this.print(`cd: ${args[0]}: No such directory`, 'error-text');
                return;
            }
        }
        this.updatePrompt();
    }
    
    cmdCat(args) {
        if (!args.length) {
            this.print('Usage: cat <filename>', 'error-text');
            return;
        }
        
        const filename = args[0];
        const fullPath = this.cwd === '~' ? filename : `${this.cwd}/${filename}`;
        
        if (this.files[fullPath]) {
            this.print(this.files[fullPath]);
        } else if (this.files[filename]) {
            this.print(this.files[filename]);
        } else {
            this.print(`cat: ${filename}: No such file`, 'error-text');
        }
    }
    
    cmdEcho(args) {
        this.print(args.join(' '));
    }
    
    cmdNeofetch() {
        const neofetch = `
<span class="ascii-art">
       ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄       </span><span class="highlight">visitor</span>@<span class="info-text">ibnu.dev</span>
<span class="ascii-art">     ██░░░░░░░░░░░░░░░██       </span><span class="info-text">──────────────────</span>
<span class="ascii-art">   ██░░░░░░░░░░░░░░░░░░░██     </span><span class="success-text">OS:</span> Portfolio v2.0
<span class="ascii-art">  ██░░░░░░░░░░░░░░░░░░░░░██    </span><span class="success-text">Host:</span> ibnu.dev
<span class="ascii-art">  ██░░░░░░░░░░░░░░░░░░░░░██    </span><span class="success-text">Kernel:</span> Next.js 14
<span class="ascii-art">  ██░░░░░░░░░░░░░░░░░░░░░██    </span><span class="success-text">Shell:</span> Terminal v2.0
<span class="ascii-art">  ██░░░░░░░░░░░░░░░░░░░░░██    </span><span class="success-text">Theme:</span> Cyber Dark
<span class="ascii-art">   ██░░░░░░░░░░░░░░░░░░░██     </span><span class="success-text">Icons:</span> Lucide
<span class="ascii-art">     ██░░░░░░░░░░░░░░░██       </span><span class="success-text">Terminal:</span> Custom JS
<span class="ascii-art">       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀        </span><span class="success-text">CPU:</span> Cloudflare Edge
                               <span class="success-text">Memory:</span> ∞ MB
                               
                               <span class="highlight">████</span><span class="info-text">████</span><span class="success-text">████</span><span class="error-text">████</span>
`;
        this.print(neofetch);
    }
    
    cmdMatrix() {
        this.print('\n<span class="matrix-text">Wake up, Neo...</span>\n');
        setTimeout(() => {
            this.print('<span class="matrix-text">The Matrix has you...</span>\n');
        }, 1000);
        setTimeout(() => {
            this.print('<span class="matrix-text">Follow the white rabbit.</span>\n');
        }, 2000);
        setTimeout(() => {
            this.print('<span class="matrix-text">Knock, knock, Neo.</span>\n');
        }, 3000);
    }
    
    cmdExit() {
        this.print('Goodbye! 👋', 'success-text');
        setTimeout(() => this.close(), 500);
    }
    
    cmdGoto(args) {
        if (!args.length) {
            this.print('Usage: goto <page>\nPages: home, projects, about, contact, interests, certs', 'info-text');
            return;
        }
        
        const pages = {
            'home': '../index.html',
            'projects': 'projects.html',
            'about': 'about.html',
            'contact': 'contact.html',
            'interests': 'interests.html',
            'certs': 'certifications.html',
            'certifications': 'certifications.html',
        };
        
        const page = args[0].toLowerCase();
        if (pages[page]) {
            this.print(`Navigating to ${page}...`, 'success-text');
            setTimeout(() => {
                // Check if we're on the main page or a subpage
                const isMainPage = window.location.pathname.endsWith('index.html') || 
                                   window.location.pathname === '/' ||
                                   !window.location.pathname.includes('/pages/');
                
                if (page === 'home') {
                    window.location.href = isMainPage ? 'index.html' : '../index.html';
                } else {
                    window.location.href = isMainPage ? `pages/${pages[page]}` : pages[page];
                }
            }, 500);
        } else {
            this.print(`Unknown page: ${page}`, 'error-text');
        }
    }
    
    cmdTheme(args) {
        if (!args.length) {
            this.print('Usage: theme <name>\nThemes: cyber, matrix, sunset', 'info-text');
            return;
        }
        
        const themes = {
            'cyber': { primary: '#00d4ff', secondary: '#8b5cf6' },
            'matrix': { primary: '#13FFAA', secondary: '#00ff00' },
            'sunset': { primary: '#ff6b6b', secondary: '#ffa500' },
        };
        
        const theme = args[0].toLowerCase();
        if (themes[theme]) {
            document.documentElement.style.setProperty('--accent-primary', themes[theme].primary);
            document.documentElement.style.setProperty('--accent-secondary', themes[theme].secondary);
            this.print(`Theme changed to ${theme}`, 'success-text');
        } else {
            this.print(`Unknown theme: ${theme}`, 'error-text');
        }
    }
    
    cmdFortune() {
        const fortunes = [
            "The best time to start coding was yesterday. The second best time is now.",
            "In the world of crypto, DYOR is not advice—it's survival.",
            "A good portfolio is like a good code: clean, efficient, and well-documented.",
            "The blockchain never forgets, but the market often does.",
            "Every bug is a feature waiting to be understood.",
            "Risk management isn't about avoiding losses—it's about surviving them.",
            "The terminal is mightier than the GUI.",
            "In AI we trust, but we still verify.",
            "Not your keys, not your coins. Not your tests, not your code.",
            "The best investment is in yourself—especially in learning.",
        ];
        
        const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        this.print(`\n🔮 ${fortune}\n`, 'info-text');
    }
    
    cmdSudo(args) {
        this.print("Nice try! 😄 But you don't have root access here.", 'error-text');
    }
    
    cmdHack(args) {
        this.print('\n<span class="success-text">Initializing hack sequence...</span>');
        
        const messages = [
            'Bypassing firewall...',
            'Accessing mainframe...',
            'Decrypting passwords...',
            'Downloading secret files...',
            'Covering tracks...',
        ];
        
        let i = 0;
        const interval = setInterval(() => {
            if (i < messages.length) {
                this.print(`<span class="matrix-text">[${Math.floor(Math.random() * 100)}%] ${messages[i]}</span>`);
                i++;
            } else {
                clearInterval(interval);
                this.print('\n<span class="error-text">ACCESS DENIED</span>');
                this.print('Just kidding! This is a portfolio, not a hacking simulator. 😎\n', 'info-text');
            }
        }, 800);
    }
    
    cmdCoffee() {
        const coffee = `
<span class="info-text">
        ( (
         ) )
      .______.
      |      |]
      \\      /
       \`----'
</span>
<span class="success-text">Here's your coffee! ☕</span>
<span class="output-text">Fun fact: Ibnu is definitely a coffee addict.</span>
`;
        this.print(coffee);
    }
    
    cmdWeather() {
        const weather = `
<span class="highlight">Weather in Jakarta, Indonesia</span>
<span class="info-text">━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

  🌤️  Partly Cloudy
  🌡️  Temperature: 29°C (84°F)
  💧 Humidity: 75%
  🌬️  Wind: 12 km/h
  
<span class="output-text">Perfect weather for coding!</span>
`;
        this.print(weather);
    }
    
    cmdUptime() {
        const uptime = Date.now() - this.startTime;
        const seconds = Math.floor(uptime / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        this.print(`Session uptime: ${hours}h ${minutes % 60}m ${seconds % 60}s`, 'success-text');
    }
    
    cmdHistory() {
        if (this.history.length === 0) {
            this.print('No commands in history', 'info-text');
            return;
        }
        
        let output = '\n';
        this.history.forEach((cmd, i) => {
            output += `  ${i + 1}  ${cmd}\n`;
        });
        this.print(output);
    }
}

// Initialize terminal
const terminal = new Terminal();

// Export for global access
window.terminal = terminal;

// Add keyboard shortcut to open terminal
document.addEventListener('keydown', (e) => {
    // Backtick or Ctrl+` to toggle terminal
    if (e.key === '`' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        terminal.toggle();
    }
    
    // T key (when not typing) to open terminal
    if (e.key === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeElement = document.activeElement;
        const isTyping = activeElement.tagName === 'INPUT' || 
                         activeElement.tagName === 'TEXTAREA' ||
                         activeElement.isContentEditable;
        
        if (!isTyping) {
            e.preventDefault();
            terminal.toggle();
        }
    }
});

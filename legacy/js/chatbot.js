/* ============================================
   IBNU PORTFOLIO V2 - AI CHATBOT
   Context-aware AI assistant with knowledge base
   ============================================ */

// Knowledge base about Ibnu
const knowledgeBase = {
  profile: {
    name: "Subkhan Ibnu Aji",
    nickname: "Ibnu",
    title: "Civil Servant (CPNS)",
    organization: "Ministry of Housing and Settlement Areas (Kementerian PKP), Indonesia",
    email: "hi@heyibnu.com",
    education: [
      "MBA - Universitas Gadjah Mada (GPA 3.60/4.00)",
      "S.Kom (Computer Science) - Telkom University (GPA 3.34/4.00)",
      "TOEFL ITP: 593"
    ],
    summary: "Civil servant handling IT projects at the Ministry of PKP. Background in informatics and business administration. Deeply interested in AI, Blockchain/Crypto, and Cybersecurity."
  },
  
  interests: {
    ai: {
      name: "Artificial Intelligence",
      description: "Research focus on autonomous agentic AI for government documentation. Skills in LLMs, LangChain, AutoGen, RAG systems.",
      why: "AI will augment human capabilities exponentially, automating complex tasks and enabling breakthroughs in science, medicine, and governance.",
      skills: ["LangChain", "LangGraph", "AutoGen", "CrewAI", "RAG", "Prompt Engineering", "LLM Workflows"]
    },
    crypto: {
      name: "Blockchain & Crypto",
      description: "Active trader with $68k-$100k USD cumulative futures volume. Disciplined risk management and continuous blockchain upskilling.",
      why: "Blockchain enables trustless systems, programmable money, and true digital ownership. It will transform finance, supply chains, identity, and governance.",
      skills: ["DeFi", "Web3", "Smart Contracts", "CEX/DEX Trading", "On-chain Analysis", "Portfolio Management"]
    },
    cyber: {
      name: "Cybersecurity",
      description: "Study of defensive security, OSINT, threat intelligence, and dark web research for understanding the full security landscape.",
      why: "As our world becomes digital, protecting systems and data is critical. Security professionals will be the guardians of our digital civilization.",
      skills: ["OSINT", "Threat Intelligence", "Digital Forensics", "OPSEC", "Incident Response", "Web Security"]
    }
  },
  
  projects: {
    hubpkp: {
      name: "HUB PKP - Klinik Rumah Swadaya",
      description: "Digital ecosystem for self-built housing in Indonesia. Integrates design consultation, permits (PBG/SIMBG), materials, contractors, financing, and construction monitoring.",
      role: "IT project handling including requirements, vendor coordination, and delivery",
      impact: "Addresses the 83.99% of Indonesian houses built self-managed (swadaya) without proper standards"
    },
    sibaru: {
      name: "SIBARU",
      description: "Enterprise system at Ministry PKP",
      role: "End-to-end IT project handling"
    },
    simoni: {
      name: "SIMONI",
      description: "Enterprise system at Ministry PKP",
      role: "End-to-end IT project handling"
    }
  },
  
  certifications: {
    summary: "50+ professional certifications from world-class institutions",
    institutions: [
      "Harvard University - Leadership",
      "Stanford University - Machine Learning, Game Theory, AI in Healthcare",
      "Cambridge University - Foundations of Finance",
      "McKinsey & Company - Forward Program",
      "BCG - Strategy Consulting, Pricing Strategy",
      "Google - Cybersecurity, BI, Project Management, LLM Fundamentals",
      "IBM - Data Engineering, AI Engineering, Cybersecurity",
      "INSEAD - Web3 and Blockchain Fundamentals",
      "PwC, Deloitte, EY, KPMG - Various consulting certifications"
    ]
  },
  
  organizations: [
    "CFA Institute (Member ID: 200530563)",
    "KADIN Indonesia (Member ID: 20203-2132274685)",
    "BPD HIPMI JAYA DKI Jakarta",
    "Strategic Club - MBA UGM",
    "Akademi Crypto Lifetime Member"
  ],
  
  skills: {
    technical: ["Python", "JavaScript", "SQL", "AI/ML", "LangChain", "Blockchain", "Web3", "Solidity", "AWS", "Linux"],
    management: ["Strategic Planning", "Project Management", "Change Management", "Risk Management"],
    financial: ["Portfolio Management", "Crypto Trading", "Financial Analysis", "Risk-adjusted Returns"]
  },
  
  trading: {
    volume: "$68k-$100k USD cumulative futures volume",
    approach: "Disciplined risk management, portfolio tracking, on-chain research",
    platforms: "CEX and DEX experience across spot and futures"
  }
};

// Response patterns
const responsePatterns = [
  {
    keywords: ['hello', 'hi', 'hey', 'halo', 'hai'],
    response: () => `Hi there! 👋 I'm Ibnu's AI assistant. I can tell you about his interests in AI, Blockchain, and Cybersecurity, his projects like HUB PKP, his certifications, or his background. What would you like to know?`
  },
  {
    keywords: ['interest', 'passion', 'focus', 'care about'],
    response: () => `Ibnu has three core interests that he believes will shape the future:\n\n🤖 **AI/Machine Learning** - Research in agentic AI systems\n💰 **Blockchain & Crypto** - Active trader with $68-100k futures volume\n🛡️ **Cybersecurity** - Defensive security and threat intelligence\n\nWould you like to learn more about any of these?`
  },
  {
    keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'llm'],
    response: () => `🤖 **Artificial Intelligence**\n\n${knowledgeBase.interests.ai.description}\n\n**Skills:** ${knowledgeBase.interests.ai.skills.join(', ')}\n\n**Why it matters:** ${knowledgeBase.interests.ai.why}`
  },
  {
    keywords: ['crypto', 'blockchain', 'bitcoin', 'trading', 'defi', 'web3'],
    response: () => `💰 **Blockchain & Crypto**\n\n${knowledgeBase.interests.crypto.description}\n\n**Skills:** ${knowledgeBase.interests.crypto.skills.join(', ')}\n\n**Why it matters:** ${knowledgeBase.interests.crypto.why}`
  },
  {
    keywords: ['cyber', 'security', 'hacking', 'osint', 'threat'],
    response: () => `🛡️ **Cybersecurity**\n\n${knowledgeBase.interests.cyber.description}\n\n**Skills:** ${knowledgeBase.interests.cyber.skills.join(', ')}\n\n**Why it matters:** ${knowledgeBase.interests.cyber.why}`
  },
  {
    keywords: ['hub', 'pkp', 'klinik', 'rumah', 'project', 'proyek'],
    response: () => `🏠 **HUB PKP - Klinik Rumah Swadaya**\n\n${knowledgeBase.projects.hubpkp.description}\n\n**Role:** ${knowledgeBase.projects.hubpkp.role}\n\n**Impact:** ${knowledgeBase.projects.hubpkp.impact}\n\nThis is a comprehensive digital platform helping Indonesian communities build proper housing.`
  },
  {
    keywords: ['work', 'job', 'position', 'kerja', 'pns', 'asn', 'cpns'],
    response: () => `💼 **Current Position**\n\nIbnu is a Civil Servant (CPNS) at Indonesia's Ministry of Housing and Settlement Areas (Kementerian PKP).\n\nHe handles IT projects including:\n• HUB PKP (Klinik Rumah)\n• SIBARU\n• SIMONI\n\nResponsibilities include requirements gathering, vendor coordination, delivery monitoring, and user adoption.`
  },
  {
    keywords: ['education', 'study', 'degree', 'university', 'kuliah', 'pendidikan'],
    response: () => `🎓 **Education**\n\n${knowledgeBase.profile.education.map(e => `• ${e}`).join('\n')}\n\nCombining technical informatics background with business administration expertise.`
  },
  {
    keywords: ['certificate', 'certification', 'sertifikat', 'credential'],
    response: () => `📜 **Certifications**\n\n${knowledgeBase.certifications.summary}\n\n**Key institutions:**\n${knowledgeBase.certifications.institutions.slice(0, 6).map(c => `• ${c}`).join('\n')}\n\n...and many more from PwC, Deloitte, KPMG, AWS, Microsoft, etc.`
  },
  {
    keywords: ['skill', 'expertise', 'kemampuan', 'keahlian'],
    response: () => `💪 **Skills & Expertise**\n\n**Technical:** ${knowledgeBase.skills.technical.join(', ')}\n\n**Management:** ${knowledgeBase.skills.management.join(', ')}\n\n**Financial:** ${knowledgeBase.skills.financial.join(', ')}`
  },
  {
    keywords: ['organization', 'member', 'organisasi', 'komunitas'],
    response: () => `🤝 **Organizations & Memberships**\n\n${knowledgeBase.organizations.map(o => `• ${o}`).join('\n')}`
  },
  {
    keywords: ['contact', 'email', 'reach', 'hubungi', 'kontak'],
    response: () => `📧 **Contact Ibnu**\n\nEmail: hi@heyibnu.com\n\n**Social:**\n• GitHub: github.com/subkhanibnuaji\n• LinkedIn: linkedin.com/in/subkhanibnuaji\n• TikTok: @heyibnu\n\nFeel free to reach out for collaboration or opportunities!`
  },
  {
    keywords: ['trading', 'futures', 'volume', 'invest'],
    response: () => `📊 **Trading Experience**\n\n${knowledgeBase.trading.volume}\n\n**Approach:** ${knowledgeBase.trading.approach}\n\n**Platforms:** ${knowledgeBase.trading.platforms}\n\nDisciplined risk management with position sizing and portfolio tracking.`
  },
  {
    keywords: ['who', 'about', 'siapa', 'tentang'],
    response: () => `👋 **About Ibnu**\n\n${knowledgeBase.profile.summary}\n\n**Full name:** ${knowledgeBase.profile.name}\n**Position:** ${knowledgeBase.profile.title} at ${knowledgeBase.profile.organization}\n\nHis three core interests: AI, Blockchain, and Cybersecurity.`
  }
];

// Default response
function getDefaultResponse() {
  const defaults = [
    "I'm not sure I understand. Could you ask about Ibnu's interests (AI, Crypto, Cybersecurity), projects, certifications, or background?",
    "Hmm, I don't have specific information about that. Try asking about Ibnu's work at Ministry PKP, his trading experience, or his education!",
    "I'd be happy to help! You can ask me about Ibnu's three main interests, his HUB PKP project, or his professional credentials."
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

// Get response based on message
function getResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  for (const pattern of responsePatterns) {
    if (pattern.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return pattern.response();
    }
  }
  
  return getDefaultResponse();
}

// Initialize chatbot
function initChatbot() {
  const trigger = document.getElementById('chatbotTrigger');
  const window_ = document.getElementById('chatbotWindow');
  const close = document.getElementById('chatbotClose');
  const input = document.getElementById('chatbotInput');
  const send = document.getElementById('chatbotSend');
  const messages = document.getElementById('chatbotMessages');
  const suggestions = document.querySelectorAll('.suggestion');
  
  if (!trigger || !window_) return;
  
  // Toggle chatbot
  trigger.addEventListener('click', () => {
    window_.classList.toggle('active');
    if (window_.classList.contains('active')) {
      input.focus();
    }
  });
  
  close?.addEventListener('click', () => {
    window_.classList.remove('active');
  });
  
  // Send message
  function sendMessage(text) {
    if (!text.trim()) return;
    
    // Add user message
    addMessage(text, 'user');
    input.value = '';
    
    // Show typing indicator
    const typingEl = document.createElement('div');
    typingEl.className = 'message bot typing';
    typingEl.innerHTML = `
      <div class="message-content">
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    messages.appendChild(typingEl);
    messages.scrollTop = messages.scrollHeight;
    
    // Get response after delay
    setTimeout(() => {
      typingEl.remove();
      const response = getResponse(text);
      addMessage(response, 'bot');
    }, 800 + Math.random() * 700);
  }
  
  function addMessage(text, sender) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${sender}`;
    
    // Parse markdown-like formatting
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    
    messageEl.innerHTML = `
      <div class="message-content">
        <p>${formatted}</p>
      </div>
    `;
    
    messages.appendChild(messageEl);
    messages.scrollTop = messages.scrollHeight;
  }
  
  // Event listeners
  send?.addEventListener('click', () => sendMessage(input.value));
  
  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage(input.value);
    }
  });
  
  // Suggestion buttons
  suggestions.forEach(btn => {
    btn.addEventListener('click', () => {
      sendMessage(btn.dataset.query);
    });
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initChatbot);

// Export for external use
window.ChatbotAPI = {
  getResponse,
  knowledgeBase
};

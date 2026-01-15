/* ============================================
   IBNU PORTFOLIO V2 - MAIN JAVASCRIPT
   Core functionality, animations, and interactions
   ============================================ */

// Global state
const state = {
  isLoading: true,
  currentPage: 'home',
  theme: 'dark',
  isMobile: window.innerWidth <= 768
};

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavigation();
  initCursor();
  initScrollEffects();
  initCommandPalette();
  initHeroAnimations();
  initInterestCards();
  initKeyboardShortcuts();
  
  // Remove loading state
  setTimeout(() => {
    document.body.classList.add('loaded');
    state.isLoading = false;
  }, 500);
});

/* ============================================
   PARTICLE BACKGROUND
   ============================================ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  // Track mouse
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Particle class
  class Particle {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.color = this.getRandomColor();
    }
    
    getRandomColor() {
      const colors = ['#00d4ff', '#8b5cf6', '#10b981', '#f7931a'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
      // Mouse interaction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 150) {
        const force = (150 - dist) / 150;
        this.speedX -= (dx / dist) * force * 0.02;
        this.speedY -= (dy / dist) * force * 0.02;
      }
      
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Friction
      this.speedX *= 0.99;
      this.speedY *= 0.99;
      
      // Bounds
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  
  // Create particles
  const particleCount = state.isMobile ? 50 : 100;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  // Draw connections
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    if (!state.isMobile) {
      drawConnections();
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Hide/show on scroll
    if (currentScroll > lastScroll && currentScroll > 300) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
  });
  
  // Mobile toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });
  }
  
  // Close on link click (mobile)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });
  });
}

/* ============================================
   CUSTOM CURSOR
   ============================================ */
function initCursor() {
  if (state.isMobile) return;
  
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  
  if (!dot || !ring) return;
  
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });
  
  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    
    requestAnimationFrame(animateRing);
  }
  animateRing();
  
  // Hover effects
  document.querySelectorAll('a, button, .interactive').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });
  
  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}

/* ============================================
   SCROLL EFFECTS
   ============================================ */
function initScrollEffects() {
  // Scroll progress bar
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }
  
  // Reveal on scroll
  const revealElements = document.querySelectorAll('.section-header, .interest-card, .skill-category, .credential-logos, .highlight-card');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => {
    el.classList.add('reveal-element');
    revealObserver.observe(el);
  });
}

/* ============================================
   COMMAND PALETTE
   ============================================ */
function initCommandPalette() {
  const modal = document.getElementById('cmdPalette');
  const input = document.getElementById('cmdInput');
  const results = document.getElementById('cmdResults');
  const trigger = document.getElementById('cmdTrigger');
  
  if (!modal || !input) return;
  
  const commands = [
    { icon: 'fa-home', label: 'Home', action: 'navigate', target: 'index.html', keys: 'G H' },
    { icon: 'fa-star', label: 'Interests', action: 'navigate', target: 'pages/interests.html', keys: 'G I' },
    { icon: 'fa-folder', label: 'Projects', action: 'navigate', target: 'pages/projects.html', keys: 'G P' },
    { icon: 'fa-certificate', label: 'Credentials', action: 'navigate', target: 'pages/certifications.html', keys: 'G C' },
    { icon: 'fa-user', label: 'About', action: 'navigate', target: 'pages/about.html', keys: 'G A' },
    { icon: 'fa-envelope', label: 'Contact', action: 'navigate', target: 'pages/contact.html', keys: 'G K' },
    { icon: 'fa-terminal', label: 'Open Terminal', action: 'terminal', keys: 'T' },
    { icon: 'fa-robot', label: 'AI Assistant', action: 'chatbot', keys: 'A' },
    { icon: 'fa-moon', label: 'Toggle Theme', action: 'theme', keys: 'D' },
    { icon: 'fa-arrow-up', label: 'Scroll to Top', action: 'scrolltop', keys: '↑' },
  ];
  
  function openPalette() {
    modal.classList.add('active');
    input.value = '';
    input.focus();
    renderCommands(commands);
  }
  
  function closePalette() {
    modal.classList.remove('active');
  }
  
  function renderCommands(cmds) {
    results.innerHTML = cmds.map(cmd => `
      <div class="cmd-item" data-action="${cmd.action}" data-target="${cmd.target || ''}">
        <i class="fas ${cmd.icon}"></i>
        <span>${cmd.label}</span>
        <kbd>${cmd.keys}</kbd>
      </div>
    `).join('');
    
    // Add click handlers
    results.querySelectorAll('.cmd-item').forEach(item => {
      item.addEventListener('click', () => {
        executeCommand(item.dataset.action, item.dataset.target);
      });
    });
  }
  
  function executeCommand(action, target) {
    closePalette();
    
    switch(action) {
      case 'navigate':
        window.location.href = target;
        break;
      case 'terminal':
        document.getElementById('terminalModal')?.classList.add('active');
        document.getElementById('terminalInput')?.focus();
        break;
      case 'chatbot':
        document.getElementById('chatbotWindow')?.classList.add('active');
        document.getElementById('chatbotInput')?.focus();
        break;
      case 'theme':
        document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        break;
      case 'scrolltop':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
    }
  }
  
  // Event listeners
  trigger?.addEventListener('click', openPalette);
  
  modal.querySelector('.modal-overlay')?.addEventListener('click', closePalette);
  
  input.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = commands.filter(cmd => 
      cmd.label.toLowerCase().includes(query)
    );
    renderCommands(filtered);
  });
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePalette();
    if (e.key === 'Enter') {
      const first = results.querySelector('.cmd-item');
      if (first) {
        executeCommand(first.dataset.action, first.dataset.target);
      }
    }
  });
  
  // Keyboard shortcut to open
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openPalette();
    }
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closePalette();
    }
  });
}

/* ============================================
   HERO ANIMATIONS
   ============================================ */
function initHeroAnimations() {
  // Tagline rotator
  const rotateTexts = document.querySelectorAll('.rotate-text');
  if (rotateTexts.length === 0) return;
  
  let currentIndex = 0;
  
  setInterval(() => {
    rotateTexts[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % rotateTexts.length;
    rotateTexts[currentIndex].classList.add('active');
    
    // Update color scheme based on current text
    const color = rotateTexts[currentIndex].dataset.color;
    document.querySelector('.hero')?.setAttribute('data-active-interest', color);
  }, 3000);
  
  // 3D Cube rotation on mouse
  const cube = document.querySelector('.tech-cube');
  if (cube) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * -30;
      cube.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
    });
  }
}

/* ============================================
   INTEREST CARDS
   ============================================ */
function initInterestCards() {
  const cards = document.querySelectorAll('.interest-card');
  
  cards.forEach(card => {
    // Tilt effect
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      
      // Move glow
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 212, 255, 0.15), transparent 50%)`;
      }
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.background = '';
      }
    });
  });
}

/* ============================================
   KEYBOARD SHORTCUTS
   ============================================ */
function initKeyboardShortcuts() {
  let keyBuffer = '';
  let keyTimeout;
  
  document.addEventListener('keydown', (e) => {
    // Ignore if typing in input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    clearTimeout(keyTimeout);
    keyBuffer += e.key.toLowerCase();
    
    keyTimeout = setTimeout(() => {
      keyBuffer = '';
    }, 1000);
    
    // Navigation shortcuts
    const shortcuts = {
      'gh': 'index.html',
      'gi': 'pages/interests.html',
      'gp': 'pages/projects.html',
      'gc': 'pages/certifications.html',
      'ga': 'pages/about.html',
      'gk': 'pages/contact.html'
    };
    
    if (shortcuts[keyBuffer]) {
      window.location.href = shortcuts[keyBuffer];
      keyBuffer = '';
    }
    
    // Single key shortcuts
    if (e.key === 't' && !e.metaKey && !e.ctrlKey) {
      document.getElementById('terminalModal')?.classList.add('active');
      document.getElementById('terminalInput')?.focus();
    }
    
    if (e.key === 'a' && !e.metaKey && !e.ctrlKey) {
      document.getElementById('chatbotWindow')?.classList.add('active');
      document.getElementById('chatbotInput')?.focus();
    }
  });
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ============================================
   PAGE-SPECIFIC GLOBAL FUNCTIONS
   These are used by onclick handlers in HTML
   ============================================ */

// Toggle mobile menu (for pages that use onclick)
function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  const toggle = document.querySelector('.mobile-toggle, .nav-btn.mobile-toggle');

  if (navMenu) {
    navMenu.classList.toggle('active');
  }
  if (toggle) {
    toggle.classList.toggle('active');
  }
  document.body.classList.toggle('nav-open');
}

// Open command palette
function openCommandPalette() {
  const palette = document.getElementById('commandPalette');
  const input = document.getElementById('commandInput');

  if (palette) {
    palette.classList.add('active');
    if (input) {
      input.value = '';
      input.focus();
    }
  }
}

// Close command palette
function closeCommandPalette(event) {
  if (event && event.target.classList.contains('command-palette')) return;

  const palette = document.getElementById('commandPalette');
  if (palette) {
    palette.classList.remove('active');
  }
}

// Filter commands in command palette
function filterCommands() {
  const input = document.getElementById('commandInput');
  const items = document.querySelectorAll('.command-item');

  if (!input || !items.length) return;

  const query = input.value.toLowerCase();

  items.forEach(item => {
    const label = item.querySelector('.command-label')?.textContent.toLowerCase() || '';
    if (label.includes(query) || query === '') {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

// Execute command from command palette
function executeCommand(action) {
  closeCommandPalette();

  const pages = {
    'home': '../index.html',
    'interests': 'interests.html',
    'projects': 'projects.html',
    'credentials': 'certifications.html',
    'contact': 'contact.html',
    'about': 'about.html',
  };

  // Check if we're on the main page
  const isMainPage = window.location.pathname.endsWith('index.html') ||
                     window.location.pathname === '/' ||
                     !window.location.pathname.includes('/pages/');

  switch(action) {
    case 'home':
      window.location.href = isMainPage ? 'index.html' : '../index.html';
      break;
    case 'interests':
    case 'projects':
    case 'credentials':
    case 'contact':
    case 'about':
      window.location.href = isMainPage ? `pages/${pages[action]}` : pages[action];
      break;
    case 'chatbot':
      toggleChatbot();
      break;
    case 'terminal':
      openTerminal();
      break;
    default:
      if (pages[action]) {
        window.location.href = isMainPage ? `pages/${pages[action]}` : pages[action];
      }
  }
}

// Toggle chatbot
function toggleChatbot() {
  const chatWindow = document.getElementById('chatbotWindow');
  const chatInput = document.getElementById('chatInput');

  if (chatWindow) {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active') && chatInput) {
      chatInput.focus();
    }
  }
}

// Open terminal
function openTerminal() {
  const terminalOverlay = document.getElementById('terminalOverlay');
  const terminalInput = document.getElementById('terminalInput');

  if (terminalOverlay) {
    terminalOverlay.classList.add('active');
    if (terminalInput) {
      terminalInput.focus();
    }
  } else if (window.terminal) {
    window.terminal.open();
  }
}

// Close terminal
function closeTerminal(event) {
  if (event && event.target.classList.contains('terminal-window')) return;

  const terminalOverlay = document.getElementById('terminalOverlay');
  if (terminalOverlay) {
    terminalOverlay.classList.remove('active');
  } else if (window.terminal) {
    window.terminal.close();
  }
}

// Handle chat keypress
function handleChatKeypress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

// Send chat message
function sendMessage() {
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('chatbotMessages');

  if (!input || !messages || !input.value.trim()) return;

  const text = input.value.trim();
  input.value = '';

  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'message user';
  userMsg.innerHTML = `<p>${text}</p>`;
  messages.appendChild(userMsg);

  // Get AI response using ChatbotAPI if available
  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.className = 'message bot';

    let response = "I'm not sure how to respond to that. Try asking about Ibnu's interests, projects, or background!";

    if (window.ChatbotAPI && window.ChatbotAPI.getResponse) {
      response = window.ChatbotAPI.getResponse(text);
    }

    botMsg.innerHTML = `<p>${response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</p>`;
    messages.appendChild(botMsg);
    messages.scrollTop = messages.scrollHeight;
  }, 500);

  messages.scrollTop = messages.scrollHeight;
}

// Ask predefined question
function askQuestion(question) {
  const input = document.getElementById('chatInput');
  if (input) {
    input.value = question;
    sendMessage();
  }
}

// Handle terminal keypress
function handleTerminalKeypress(event) {
  if (event.key === 'Enter') {
    const input = document.getElementById('terminalInput');
    if (input && window.terminal) {
      window.terminal.executeCommand(input.value);
      input.value = '';
    }
  }
}

// Keyboard shortcut for command palette (Ctrl+K)
document.addEventListener('keydown', function(e) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();

    // Try the command palette overlay first (for pages)
    const paletteOverlay = document.getElementById('commandPalette');
    if (paletteOverlay) {
      openCommandPalette();
    } else {
      // Fall back to the cmd-palette modal (for index)
      const cmdPalette = document.getElementById('cmdPalette');
      if (cmdPalette) {
        cmdPalette.classList.add('active');
        document.getElementById('cmdInput')?.focus();
      }
    }
  }

  // Escape to close modals
  if (e.key === 'Escape') {
    closeCommandPalette();
    closeTerminal();

    const chatWindow = document.getElementById('chatbotWindow');
    if (chatWindow) {
      chatWindow.classList.remove('active');
    }

    const cmdPalette = document.getElementById('cmdPalette');
    if (cmdPalette) {
      cmdPalette.classList.remove('active');
    }
  }
});

// Console easter egg
console.log(`
%c
██╗██████╗ ███╗   ██╗██╗   ██╗
██║██╔══██╗████╗  ██║██║   ██║
██║██████╔╝██╔██╗ ██║██║   ██║
██║██╔══██╗██║╚██╗██║██║   ██║
██║██████╔╝██║ ╚████║╚██████╔╝
╚═╝╚═════╝ ╚═╝  ╚═══╝ ╚═════╝

Hey there, curious developer! 👋
Interested in AI, Blockchain, or Cybersecurity?
Let's connect: hi@heyibnu.com

`, 'color: #00d4ff; font-family: monospace;');

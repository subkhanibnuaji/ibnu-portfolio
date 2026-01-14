# Ibnu's Portfolio v2.0

A sophisticated multi-page portfolio website with tech-futuristic design, featuring AI chatbot, terminal emulator, command palette, and no-code admin panel.

## 🎯 Features

### Interactive Elements
- **AI Chatbot**: Ask questions about skills, projects, and interests
- **Terminal Emulator**: Full command-line interface (press `T` or `Ctrl+\``)
- **Command Palette**: Quick navigation (press `⌘K` or `Ctrl+K`)
- **Custom Cursor**: Magnetic effects and blend modes
- **Particle Background**: Animated canvas particles

### Pages
- **Home** (`index.html`) - Hero with role rotator, interest cards, and quick navigation
- **Interests** (`pages/interests.html`) - Deep dive into AI, Blockchain, and Cybersecurity
- **Projects** (`pages/projects.html`) - HUB PKP showcase and portfolio projects
- **Credentials** (`pages/certifications.html`) - 50+ certifications and organizations
- **About** (`pages/about.html`) - Timeline, skills, and professional background
- **Contact** (`pages/contact.html`) - Contact form and information
- **Admin Panel** (`pages/admin.html`) - No-code content management

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Open command palette |
| `T` | Open terminal |
| `A` | Toggle AI assistant |
| `G H` | Go to Home |
| `G I` | Go to Interests |
| `G P` | Go to Projects |
| `G C` | Go to Contact |
| `G A` | Go to About |
| `G K` | Go to Credentials |
| `Esc` | Close modals |

### Terminal Commands
```
help          - Show all commands
about         - Display profile info
skills        - Show technical skills
projects      - List projects
certifications - Show certifications
crypto        - Crypto trading info
neofetch      - System info display
goto <page>   - Navigate to page
theme <name>  - Change color theme
fortune       - Random wisdom
coffee        - Get virtual coffee ☕
```

## 🚀 Deployment

### Option 1: Static Hosting (Recommended)
Upload all files to any static hosting service:
- **Netlify**: Drop the folder or connect GitHub
- **Vercel**: Import from GitHub
- **GitHub Pages**: Push to gh-pages branch
- **Cloudflare Pages**: Connect repository

### Option 2: Local Preview
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 🔐 Admin Panel

Access the admin panel at `pages/admin.html`

**Default Credentials:**
- Username: `admin`
- Password: `ibnu2024`

Features:
- Edit profile information
- Manage projects and skills
- Update certifications
- Export/import content as JSON
- Customize site settings

## 📁 File Structure

```
portfolio-v2/
├── index.html              # Main landing page
├── css/
│   └── styles.css          # Complete design system (30KB)
├── js/
│   ├── main.js             # Core functionality
│   ├── chatbot.js          # AI assistant
│   ├── terminal.js         # Terminal emulator
│   └── admin.js            # Admin panel logic
├── pages/
│   ├── interests.html      # AI/Crypto/Cybersecurity
│   ├── projects.html       # Portfolio showcase
│   ├── certifications.html # Credentials & orgs
│   ├── about.html          # Professional background
│   ├── contact.html        # Contact form
│   └── admin.html          # Content management
├── data/
│   └── content.json        # Editable content
└── assets/                 # Images and media
```

## 🎨 Customization

### Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
  --accent-primary: #00d4ff;   /* Electric Cyan */
  --accent-secondary: #8b5cf6; /* Neon Purple */
  --accent-tertiary: #13FFAA;  /* Matrix Green */
}
```

### Content
1. Use Admin Panel for no-code editing
2. Or directly edit `data/content.json`
3. Or modify HTML files directly

## 📧 Contact

- **Email**: hi@heyibnu.com
- **GitHub**: github.com/subkhanibnuaji
- **LinkedIn**: linkedin.com/in/subkhanibnuaji

---

Built with ❤️ by Ibnu • 2024

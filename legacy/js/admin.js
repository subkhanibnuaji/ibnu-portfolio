// Admin Panel JavaScript for Ibnu's Portfolio
// No-code content management system

class AdminPanel {
    constructor() {
        this.isAuthenticated = false;
        this.contentData = null;
        this.currentSection = 'profile';
        
        // Default credentials (in production, this would be server-side)
        this.credentials = {
            username: 'admin',
            password: 'ibnu2024' // Demo password
        };
        
        this.init();
    }
    
    init() {
        this.loadContent();
        this.checkAuth();
        this.bindEvents();
    }
    
    // Authentication
    checkAuth() {
        const authToken = localStorage.getItem('admin_auth');
        if (authToken) {
            try {
                const decoded = JSON.parse(atob(authToken));
                if (decoded.expires > Date.now()) {
                    this.isAuthenticated = true;
                    this.showDashboard();
                    return;
                }
            } catch (e) {
                localStorage.removeItem('admin_auth');
            }
        }
        this.showLogin();
    }
    
    login(username, password) {
        if (username === this.credentials.username && password === this.credentials.password) {
            const token = btoa(JSON.stringify({
                user: username,
                expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
            }));
            localStorage.setItem('admin_auth', token);
            this.isAuthenticated = true;
            this.showDashboard();
            this.showToast('Welcome back, Admin!', 'success');
            return true;
        }
        return false;
    }
    
    logout() {
        localStorage.removeItem('admin_auth');
        this.isAuthenticated = false;
        this.showLogin();
        this.showToast('Logged out successfully', 'info');
    }
    
    showLogin() {
        const loginScreen = document.getElementById('login-screen');
        const dashboard = document.getElementById('admin-dashboard');
        
        if (loginScreen) loginScreen.style.display = 'flex';
        if (dashboard) dashboard.style.display = 'none';
    }
    
    showDashboard() {
        const loginScreen = document.getElementById('login-screen');
        const dashboard = document.getElementById('admin-dashboard');
        
        if (loginScreen) loginScreen.style.display = 'none';
        if (dashboard) dashboard.style.display = 'block';
        
        this.populateForm();
    }
    
    // Content Management
    loadContent() {
        // Try to load from localStorage first
        const savedContent = localStorage.getItem('portfolio_content');
        if (savedContent) {
            try {
                this.contentData = JSON.parse(savedContent);
            } catch (e) {
                this.contentData = this.getDefaultContent();
            }
        } else {
            this.contentData = this.getDefaultContent();
        }
    }
    
    saveContent() {
        try {
            localStorage.setItem('portfolio_content', JSON.stringify(this.contentData));
            this.showToast('Changes saved successfully!', 'success');
            return true;
        } catch (e) {
            this.showToast('Error saving changes', 'error');
            return false;
        }
    }
    
    getDefaultContent() {
        return {
            profile: {
                name: 'Subkhan Ibnu Aji',
                title: 'S.Kom., M.B.A.',
                tagline: 'Government Tech Leader • AI Researcher • Crypto Enthusiast',
                email: 'hi@heyibnu.com',
                location: 'Jakarta, Indonesia',
                bio: 'Cross-functional professional with expertise in Digital Transformation, IT Governance, AI/ML, Blockchain/Web3, and Cybersecurity. Currently serving at Indonesia\'s Ministry of Housing and Settlement Areas.',
                avatar: 'https://ui-avatars.com/api/?name=Ibnu&background=00d4ff&color=fff&size=200',
                resume_url: '#'
            },
            social: {
                github: 'https://github.com/subkhanibnuaji',
                linkedin: 'https://linkedin.com/in/subkhanibnuaji',
                twitter: 'https://twitter.com/subkhanibnuaji',
                tiktok: 'https://tiktok.com/@subkhanibnuaji'
            },
            stats: {
                years_experience: '5+',
                projects_completed: '50+',
                portfolio_managed: '1T+',
                tiktok_followers: '40K+'
            },
            skills: [
                { name: 'Python', category: 'Programming', level: 90 },
                { name: 'JavaScript', category: 'Programming', level: 85 },
                { name: 'TypeScript', category: 'Programming', level: 80 },
                { name: 'React/Next.js', category: 'Framework', level: 85 },
                { name: 'Node.js', category: 'Framework', level: 80 },
                { name: 'LLM Workflows', category: 'AI/ML', level: 85 },
                { name: 'Prompt Engineering', category: 'AI/ML', level: 90 },
                { name: 'Agentic AI', category: 'AI/ML', level: 80 },
                { name: 'DeFi Protocols', category: 'Blockchain', level: 80 },
                { name: 'Smart Contracts', category: 'Blockchain', level: 70 },
                { name: 'AWS', category: 'Cloud', level: 80 },
                { name: 'Cybersecurity', category: 'Security', level: 75 }
            ],
            projects: [
                {
                    id: 'hub-pkp',
                    name: 'HUB PKP',
                    category: 'Government',
                    description: 'Comprehensive digital ecosystem for Indonesia\'s self-built housing program',
                    technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
                    featured: true,
                    live_url: '#',
                    github_url: '#'
                },
                {
                    id: 'sibaru',
                    name: 'SIBARU',
                    category: 'Government',
                    description: 'Enterprise information system for ministry operations',
                    technologies: ['React', 'FastAPI', 'PostgreSQL'],
                    featured: false,
                    live_url: '#',
                    github_url: '#'
                },
                {
                    id: 'simoni',
                    name: 'SIMONI',
                    category: 'Government',
                    description: 'Monitoring and evaluation system for housing programs',
                    technologies: ['React', 'Node.js', 'MongoDB'],
                    featured: false,
                    live_url: '#',
                    github_url: '#'
                },
                {
                    id: 'icp-token',
                    name: 'ICP Token dApp',
                    category: 'Web3',
                    description: 'Fungible token canister on Internet Computer with React frontend',
                    technologies: ['Motoko', 'React', 'Internet Computer'],
                    featured: false,
                    live_url: '#',
                    github_url: '#'
                }
            ],
            experience: [
                {
                    title: 'Civil Servant (ASN)',
                    company: 'Ministry of Housing & Settlement Areas (PKP)',
                    period: 'Aug 2024 - Present',
                    description: 'Managing end-to-end delivery of enterprise IT applications including SIBARU, PKP HUB, and SIMONI.',
                    current: true
                },
                {
                    title: 'Founder & CEO',
                    company: 'Virtus Futura Consulting',
                    period: 'Jul 2021 - Jul 2024',
                    description: 'Led consultancy managing portfolio valued over IDR 1T across healthcare, government, and private sectors.',
                    current: false
                },
                {
                    title: 'Founder & CEO',
                    company: 'CV Solusi Automasi Indonesia (Automate All)',
                    period: 'Aug 2020 - Aug 2022',
                    description: 'Grew RPA company valuation to IDR 1B through pre-seed funding, serving 50+ clients.',
                    current: false
                }
            ],
            education: [
                {
                    degree: 'MBA',
                    institution: 'Universitas Gadjah Mada',
                    period: '2022 - 2024',
                    gpa: '3.60/4.00'
                },
                {
                    degree: 'B.Sc. Informatics',
                    institution: 'Telkom University',
                    period: '2017 - 2021',
                    gpa: '3.34/4.00'
                }
            ],
            interests: [
                {
                    title: 'Artificial Intelligence',
                    icon: '🤖',
                    description: 'Exploring agentic AI systems and their applications in government and enterprise.'
                },
                {
                    title: 'Crypto & Blockchain',
                    icon: '🔗',
                    description: 'Active portfolio management with disciplined risk controls and DeFi research.'
                },
                {
                    title: 'Cybersecurity',
                    icon: '🛡️',
                    description: 'Defensive security, OSINT, and threat intelligence for digital protection.'
                }
            ],
            settings: {
                theme: 'dark',
                particles_enabled: true,
                cursor_enabled: true,
                analytics_enabled: true,
                maintenance_mode: false
            }
        };
    }
    
    populateForm() {
        if (!this.contentData) return;
        
        // Profile fields
        this.setFieldValue('profile-name', this.contentData.profile.name);
        this.setFieldValue('profile-title', this.contentData.profile.title);
        this.setFieldValue('profile-tagline', this.contentData.profile.tagline);
        this.setFieldValue('profile-email', this.contentData.profile.email);
        this.setFieldValue('profile-location', this.contentData.profile.location);
        this.setFieldValue('profile-bio', this.contentData.profile.bio);
        this.setFieldValue('profile-avatar', this.contentData.profile.avatar);
        
        // Social fields
        this.setFieldValue('social-github', this.contentData.social.github);
        this.setFieldValue('social-linkedin', this.contentData.social.linkedin);
        this.setFieldValue('social-twitter', this.contentData.social.twitter);
        this.setFieldValue('social-tiktok', this.contentData.social.tiktok);
        
        // Stats fields
        this.setFieldValue('stats-years', this.contentData.stats.years_experience);
        this.setFieldValue('stats-projects', this.contentData.stats.projects_completed);
        this.setFieldValue('stats-portfolio', this.contentData.stats.portfolio_managed);
        this.setFieldValue('stats-followers', this.contentData.stats.tiktok_followers);
        
        // Render dynamic lists
        this.renderSkillsList();
        this.renderProjectsList();
        this.renderExperienceList();
        
        // Settings
        if (this.contentData.settings) {
            this.setCheckboxValue('settings-particles', this.contentData.settings.particles_enabled);
            this.setCheckboxValue('settings-cursor', this.contentData.settings.cursor_enabled);
            this.setCheckboxValue('settings-analytics', this.contentData.settings.analytics_enabled);
            this.setCheckboxValue('settings-maintenance', this.contentData.settings.maintenance_mode);
        }
    }
    
    setFieldValue(id, value) {
        const field = document.getElementById(id);
        if (field) field.value = value || '';
    }
    
    setCheckboxValue(id, checked) {
        const field = document.getElementById(id);
        if (field) field.checked = checked;
    }
    
    collectFormData() {
        // Profile
        this.contentData.profile.name = document.getElementById('profile-name')?.value || '';
        this.contentData.profile.title = document.getElementById('profile-title')?.value || '';
        this.contentData.profile.tagline = document.getElementById('profile-tagline')?.value || '';
        this.contentData.profile.email = document.getElementById('profile-email')?.value || '';
        this.contentData.profile.location = document.getElementById('profile-location')?.value || '';
        this.contentData.profile.bio = document.getElementById('profile-bio')?.value || '';
        this.contentData.profile.avatar = document.getElementById('profile-avatar')?.value || '';
        
        // Social
        this.contentData.social.github = document.getElementById('social-github')?.value || '';
        this.contentData.social.linkedin = document.getElementById('social-linkedin')?.value || '';
        this.contentData.social.twitter = document.getElementById('social-twitter')?.value || '';
        this.contentData.social.tiktok = document.getElementById('social-tiktok')?.value || '';
        
        // Stats
        this.contentData.stats.years_experience = document.getElementById('stats-years')?.value || '';
        this.contentData.stats.projects_completed = document.getElementById('stats-projects')?.value || '';
        this.contentData.stats.portfolio_managed = document.getElementById('stats-portfolio')?.value || '';
        this.contentData.stats.tiktok_followers = document.getElementById('stats-followers')?.value || '';
        
        // Settings
        this.contentData.settings.particles_enabled = document.getElementById('settings-particles')?.checked || false;
        this.contentData.settings.cursor_enabled = document.getElementById('settings-cursor')?.checked || false;
        this.contentData.settings.analytics_enabled = document.getElementById('settings-analytics')?.checked || false;
        this.contentData.settings.maintenance_mode = document.getElementById('settings-maintenance')?.checked || false;
    }
    
    // Dynamic List Rendering
    renderSkillsList() {
        const container = document.getElementById('skills-list');
        if (!container || !this.contentData.skills) return;
        
        container.innerHTML = this.contentData.skills.map((skill, index) => `
            <div class="skill-item" data-index="${index}">
                <div class="skill-info">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-category">${skill.category}</span>
                    <span class="skill-level">${skill.level}%</span>
                </div>
                <div class="skill-bar">
                    <div class="skill-progress" style="width: ${skill.level}%"></div>
                </div>
                <div class="skill-actions">
                    <button class="action-btn edit" onclick="adminPanel.editSkill(${index})">Edit</button>
                    <button class="action-btn delete" onclick="adminPanel.deleteSkill(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }
    
    renderProjectsList() {
        const container = document.getElementById('projects-list');
        if (!container || !this.contentData.projects) return;
        
        container.innerHTML = this.contentData.projects.map((project, index) => `
            <div class="project-item" data-index="${index}">
                <div class="project-info">
                    <span class="project-name">${project.name}</span>
                    <span class="project-category">${project.category}</span>
                    ${project.featured ? '<span class="project-featured">★ Featured</span>' : ''}
                </div>
                <div class="project-description">${project.description}</div>
                <div class="project-tech">
                    ${project.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                </div>
                <div class="project-actions">
                    <button class="action-btn edit" onclick="adminPanel.editProject(${index})">Edit</button>
                    <button class="action-btn delete" onclick="adminPanel.deleteProject(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }
    
    renderExperienceList() {
        const container = document.getElementById('experience-list');
        if (!container || !this.contentData.experience) return;
        
        container.innerHTML = this.contentData.experience.map((exp, index) => `
            <div class="experience-item" data-index="${index}">
                <div class="experience-header">
                    <div class="experience-info">
                        <span class="experience-title">${exp.title}</span>
                        <span class="experience-company">${exp.company}</span>
                    </div>
                    <span class="experience-period">${exp.period}</span>
                </div>
                <div class="experience-description">${exp.description}</div>
                <div class="experience-actions">
                    <button class="action-btn edit" onclick="adminPanel.editExperience(${index})">Edit</button>
                    <button class="action-btn delete" onclick="adminPanel.deleteExperience(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }
    
    // CRUD Operations
    addSkill(skill) {
        this.contentData.skills.push(skill);
        this.renderSkillsList();
        this.saveContent();
    }
    
    editSkill(index) {
        const skill = this.contentData.skills[index];
        if (!skill) return;
        
        const name = prompt('Skill Name:', skill.name);
        if (name === null) return;
        
        const level = prompt('Level (0-100):', skill.level);
        if (level === null) return;
        
        skill.name = name;
        skill.level = parseInt(level) || skill.level;
        
        this.renderSkillsList();
        this.saveContent();
    }
    
    deleteSkill(index) {
        if (confirm('Delete this skill?')) {
            this.contentData.skills.splice(index, 1);
            this.renderSkillsList();
            this.saveContent();
        }
    }
    
    addProject(project) {
        this.contentData.projects.push(project);
        this.renderProjectsList();
        this.saveContent();
    }
    
    editProject(index) {
        const project = this.contentData.projects[index];
        if (!project) return;
        
        const name = prompt('Project Name:', project.name);
        if (name === null) return;
        
        const description = prompt('Description:', project.description);
        if (description === null) return;
        
        project.name = name;
        project.description = description;
        
        this.renderProjectsList();
        this.saveContent();
    }
    
    deleteProject(index) {
        if (confirm('Delete this project?')) {
            this.contentData.projects.splice(index, 1);
            this.renderProjectsList();
            this.saveContent();
        }
    }
    
    addExperience(exp) {
        this.contentData.experience.push(exp);
        this.renderExperienceList();
        this.saveContent();
    }
    
    editExperience(index) {
        const exp = this.contentData.experience[index];
        if (!exp) return;
        
        const title = prompt('Title:', exp.title);
        if (title === null) return;
        
        const company = prompt('Company:', exp.company);
        if (company === null) return;
        
        exp.title = title;
        exp.company = company;
        
        this.renderExperienceList();
        this.saveContent();
    }
    
    deleteExperience(index) {
        if (confirm('Delete this experience?')) {
            this.contentData.experience.splice(index, 1);
            this.renderExperienceList();
            this.saveContent();
        }
    }
    
    // Import/Export
    exportContent() {
        const dataStr = JSON.stringify(this.contentData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio_content_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Content exported successfully!', 'success');
    }
    
    importContent(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                this.contentData = imported;
                this.populateForm();
                this.saveContent();
                this.showToast('Content imported successfully!', 'success');
            } catch (err) {
                this.showToast('Error importing file. Invalid JSON.', 'error');
            }
        };
        reader.readAsText(file);
    }
    
    resetContent() {
        if (confirm('Reset all content to default? This cannot be undone.')) {
            this.contentData = this.getDefaultContent();
            this.populateForm();
            this.saveContent();
            this.showToast('Content reset to default', 'info');
        }
    }
    
    // UI Helpers
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        const icon = toast.querySelector('.toast-icon');
        const text = toast.querySelector('.toast-message');
        
        const icons = {
            success: '✓',
            error: '✕',
            info: 'ℹ',
            warning: '⚠'
        };
        
        if (icon) icon.textContent = icons[type] || icons.success;
        if (text) text.textContent = message;
        
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    bindEvents() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('login-username')?.value;
                const password = document.getElementById('login-password')?.value;
                
                if (!this.login(username, password)) {
                    this.showToast('Invalid credentials', 'error');
                }
            });
        }
        
        // Section forms
        const forms = document.querySelectorAll('.admin-form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.collectFormData();
                this.saveContent();
            });
        });
        
        // Sidebar navigation
        const navLinks = document.querySelectorAll('.admin-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.switchSection(section);
            });
        });
        
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }
    
    switchSection(sectionId) {
        // Update nav
        document.querySelectorAll('.admin-nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });
        
        // Update sections
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.toggle('active', section.id === `section-${sectionId}`);
        });
        
        this.currentSection = sectionId;
    }
}

// Modal functions
function openModal(id) {
    const modal = document.getElementById(`modal-${id}`);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(id) {
    const modal = document.getElementById(`modal-${id}`);
    if (modal) {
        modal.classList.remove('active');
    }
}

function saveProject() {
    const modal = document.getElementById('modal-add-project');
    if (!modal) return;
    
    const inputs = modal.querySelectorAll('.form-input');
    const project = {
        id: `project-${Date.now()}`,
        name: inputs[0]?.value || 'New Project',
        category: inputs[1]?.value || 'Other',
        description: inputs[2]?.value || '',
        technologies: (inputs[3]?.value || '').split(',').map(t => t.trim()).filter(t => t),
        featured: false,
        live_url: inputs[4]?.value || '#',
        github_url: inputs[5]?.value || '#'
    };
    
    adminPanel.addProject(project);
    closeModal('add-project');
}

function saveSkill() {
    const modal = document.getElementById('modal-add-skill');
    if (!modal) return;
    
    const inputs = modal.querySelectorAll('.form-input');
    const skill = {
        name: inputs[0]?.value || 'New Skill',
        category: inputs[1]?.value || 'Other',
        level: parseInt(inputs[2]?.value) || 50
    };
    
    adminPanel.addSkill(skill);
    closeModal('add-skill');
}

function exportContent() {
    adminPanel.exportContent();
}

function importContent(event) {
    const file = event.target.files[0];
    if (file) {
        adminPanel.importContent(file);
    }
}

function resetContent() {
    adminPanel.resetContent();
}

// Initialize admin panel
const adminPanel = new AdminPanel();

// Export for global access
window.adminPanel = adminPanel;

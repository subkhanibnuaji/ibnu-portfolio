// API Configuration
// Change this to your production URL when deploying
export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://ibnu-portfolio-ashen.vercel.app';

export const API_ENDPOINTS = {
  summary: '/api/mobile/summary',
  profile: '/api/mobile/profile',
  projects: '/api/mobile/projects',
  experience: '/api/mobile/experience',
  education: '/api/mobile/education',
  skills: '/api/mobile/skills',
  certifications: '/api/mobile/certifications',
  interests: '/api/mobile/interests',
  contact: '/api/mobile/contact',
  chat: '/api/chat',
} as const;

// App Colors
export const Colors = {
  light: {
    primary: '#2563eb',
    secondary: '#8b5cf6',
    background: '#ffffff',
    card: '#f8fafc',
    text: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  dark: {
    primary: '#3b82f6',
    secondary: '#a78bfa',
    background: '#0a0a0a',
    card: '#171717',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    border: '#262626',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
} as const;

// App Constants
export const APP_NAME = 'Ibnu Portfolio';
export const APP_VERSION = '1.0.0';

// Animation durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Social Links
export const SOCIAL_LINKS = {
  github: 'https://github.com/subkhanibnuaji',
  linkedin: 'https://linkedin.com/in/subkhanibnuaji',
  twitter: 'https://twitter.com/subkhanibnuaji',
  email: 'mailto:contact@ibnuaji.com',
} as const;

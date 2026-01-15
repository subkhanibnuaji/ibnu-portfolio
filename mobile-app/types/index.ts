// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  count?: number;
}

// Profile Types
export interface Profile {
  id?: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  avatarUrl?: string;
  resumeUrl?: string;
  socialLinks: SocialLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  username?: string;
}

// Project Types
export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDesc?: string;
  category: string;
  status: ProjectStatus;
  featured: boolean;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies: string[];
  features: string[];
  impact?: string;
  startDate?: string;
  endDate?: string;
}

export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'ARCHIVED';

// Experience Types
export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  type: string;
  description: string;
  highlights: string[];
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
}

// Education Types
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  gpa?: number;
  description?: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
}

// Skill Types
export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
}

// Certification Types
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuerLogo?: string;
  category: string;
  credentialId?: string;
  credentialUrl?: string;
  issueDate: string;
  expiryDate?: string;
}

// Interest Types
export interface Interest {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  topics: InterestTopic[];
  resources?: InterestResource[];
  stats?: InterestStat[];
}

export interface InterestTopic {
  name: string;
  description: string;
}

export interface InterestResource {
  title: string;
  url: string;
}

export interface InterestStat {
  label: string;
  value: string;
}

// Summary Types
export interface Summary {
  profile: {
    name: string;
    title: string;
    tagline: string;
    currentRole: string;
    location: string;
  };
  stats: {
    projects: number;
    certifications: number;
    experience: number;
    skills: number;
  };
  highlights: Highlight[];
  quickLinks: QuickLink[];
  version: string;
  lastUpdated: string;
}

export interface Highlight {
  icon: string;
  label: string;
  value: string;
}

export interface QuickLink {
  id: string;
  label: string;
  icon: string;
  route: string;
}

// Contact Form Types
export interface ContactForm {
  name: string;
  email: string;
  subject?: string;
  message: string;
  category?: string;
}

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'system';

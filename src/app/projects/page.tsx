'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/page-layout'
import {
  ExternalLink,
  Github,
  Folder,
  Building2,
  Heart,
  Bot,
  Blocks,
  Filter,
  ArrowRight,
  Smartphone,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Last updated: 2026-01-16
const projects = [
  {
    id: 'mobile-app',
    title: 'Ibnu Portfolio Mobile App',
    description: 'Cross-platform mobile app for Android with interactive UI and offline support.',
    longDesc: 'A complete mobile application built with React Native and Expo that showcases my portfolio. Features include dark theme, smooth animations, offline data caching, and automatic updates from the backend API.',
    category: 'Personal',
    status: 'Active',
    featured: false,
    technologies: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'React Query'],
    features: [
      'Cross-platform (Android, iOS, Web)',
      'Interactive 3D phone mockup on web',
      'Offline data caching',
      'Dark theme with smooth animations',
      'Auto-sync with portfolio backend'
    ],
    impact: 'Provides easy access to portfolio on mobile devices with downloadable APK',
    liveUrl: '/mobile',
    githubUrl: 'https://github.com/subkhanibnuaji/ibnu-portfolio/tree/main/mobile-app',
    isInternal: true
  },
  {
    id: 'hub-pkp',
    title: 'HUB PKP - Klinik Rumah',
    description: 'Comprehensive digital platform for Indonesia\'s self-built housing program under Ministry PKP.',
    longDesc: 'HUB PKP is the flagship digital platform I developed to transform Indonesia\'s self-built housing ecosystem. It addresses the gap between housing stakeholders and citizens who need affordable access to quality housing.',
    category: 'Government',
    status: 'In Development',
    featured: true,
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'SIMBG API'],
    features: [
      'AI-powered house design consultation',
      'Integrated permit processing (PBG/SIMBG)',
      'Material marketplace with price comparison',
      'Certified worker facilitation',
      'Housing finance integration with banks',
      'Construction monitoring system'
    ],
    impact: 'Streamlines housing construction process for 84% of Indonesian homes built through self-construction (swadaya)',
    liveUrl: null,
    githubUrl: null
  },
  {
    id: 'sibaru',
    title: 'SIBARU',
    description: 'Enterprise information system for ministry operations and data management.',
    longDesc: 'SIBARU is an enterprise-grade information system designed to handle ministry operations, data management, and reporting needs with high scalability.',
    category: 'Government',
    status: 'Active',
    featured: false,
    technologies: ['React', 'FastAPI', 'PostgreSQL', 'Docker'],
    features: [
      'User management and RBAC',
      'Document management system',
      'Reporting and analytics',
      'Integration with other ministry systems'
    ],
    impact: 'Improves operational efficiency across multiple ministry departments',
    liveUrl: null,
    githubUrl: null
  },
  {
    id: 'simoni',
    title: 'SIMONI',
    description: 'Comprehensive monitoring and evaluation system for housing program tracking and reporting.',
    longDesc: 'SIMONI provides real-time monitoring and evaluation capabilities for housing programs, enabling data-driven decision making.',
    category: 'Government',
    status: 'Active',
    featured: false,
    technologies: ['React', 'Node.js', 'MongoDB', 'Chart.js'],
    features: [
      'Real-time program monitoring',
      'Interactive dashboards',
      'Progress tracking',
      'Automated report generation'
    ],
    impact: 'Enables transparency in housing program implementation and budget allocation',
    liveUrl: null,
    githubUrl: null
  },
  {
    id: 'hospital-feasibility',
    title: 'Hospital Feasibility Study - RS Wibawa Mukti Type B',
    description: 'Comprehensive feasibility study for 11,000 m² hospital with IDR 331B budget.',
    longDesc: 'Complete feasibility analysis including market analysis, technical review, financial projections, and risk assessment for a Type B hospital.',
    category: 'Healthcare',
    status: 'Completed',
    featured: false,
    technologies: ['Financial Modeling', 'Market Analysis', 'Risk Assessment'],
    features: [
      'Market demand analysis',
      'Technical infrastructure planning',
      'Financial projections (10-year)',
      'Risk assessment and mitigation',
      'Regulatory compliance review'
    ],
    impact: 'Secured IDR 331B investment approval for hospital development',
    liveUrl: null,
    githubUrl: null
  },
  {
    id: 'rpa-solutions',
    title: 'RPA Solutions',
    description: 'Delivered automation solutions to 50+ clients, significantly enhancing operational efficiencies.',
    longDesc: 'Enterprise RPA solutions built using UiPath and Python to automate repetitive business processes across various industries.',
    category: 'Enterprise',
    status: 'Completed',
    featured: false,
    technologies: ['UiPath', 'Power Automate', 'Python', 'Process Mining'],
    features: [
      '100+ RPA bots deployed',
      'Process mining and analysis',
      'Custom automation workflows',
      'Integration with enterprise systems'
    ],
    impact: 'Reduced manual workload by 60-80% for client operations',
    liveUrl: null,
    githubUrl: null
  },
  {
    id: 'icp-token-dapp',
    title: 'ICP Token dApp',
    description: 'Fungible token canister on Internet Computer with React frontend.',
    longDesc: 'A decentralized application built on Internet Computer Protocol featuring fungible token functionality, balance tracking, and transfers.',
    category: 'Web3',
    status: 'Completed',
    featured: false,
    technologies: ['Motoko', 'React', 'Internet Computer', 'Internet Identity'],
    features: [
      'Token balance tracking',
      'Faucet for test tokens',
      'Transfer functionality',
      'Internet Identity authentication'
    ],
    impact: 'Demonstrates Web3 development capabilities on ICP',
    liveUrl: null,
    githubUrl: 'https://github.com/subkhanibnuaji'
  },
  {
    id: 'animo',
    title: 'Animo',
    description: 'Web-based automation tool for F&B SMEs with COGS/HPP calculation.',
    longDesc: 'My undergraduate thesis project - a comprehensive automation platform for F&B businesses to manage their operations efficiently.',
    category: 'Enterprise',
    status: 'Completed',
    featured: false,
    technologies: ['JavaScript', 'Node.js', 'PostgreSQL'],
    features: [
      'COGS/HPP calculation',
      'Inventory tracking',
      'Sales logging',
      'Financial reporting'
    ],
    impact: 'Helped F&B SMEs reduce operational overhead by 40%',
    liveUrl: null,
    githubUrl: null
  }
]

const categories = [
  { value: 'all', label: 'All Projects', icon: Folder },
  { value: 'Personal', label: 'Personal', icon: Smartphone },
  { value: 'Government', label: 'Government', icon: Building2 },
  { value: 'Healthcare', label: 'Healthcare', icon: Heart },
  { value: 'Enterprise', label: 'Enterprise', icon: Bot },
  { value: 'Web3', label: 'Web3', icon: Blocks }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  const featuredProject = projects.find(p => p.featured)

  return (
    <PageLayout
      title="Projects"
      subtitle="A showcase of my work across government, enterprise, healthcare, and Web3 domains."
      showBadge
      badgeText="50+ Projects Completed"
    >
      <div className="container">
        {/* Featured Project */}
        {featuredProject && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-cyber-orange/20 text-cyber-orange text-sm font-medium">
                Featured Project
              </span>
            </div>

            <div className="glass rounded-2xl p-6 md:p-8 lg:p-10">
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={cn(
                      'px-2 py-1 rounded text-xs font-medium',
                      featuredProject.status === 'In Development'
                        ? 'bg-cyber-cyan/20 text-cyber-cyan'
                        : 'bg-cyber-green/20 text-cyber-green'
                    )}>
                      {featuredProject.status}
                    </span>
                    <span className="text-sm text-muted-foreground">{featuredProject.category}</span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold mb-4">{featuredProject.title}</h2>
                  <p className="text-muted-foreground mb-6">{featuredProject.longDesc}</p>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {featuredProject.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-cyber-cyan mt-0.5">-</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredProject.technologies.map((tech, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-muted text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link href={`/projects/${featuredProject.id}`}>
                    <Button variant="gradient">
                      View Project Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="glass rounded-xl p-6 bg-gradient-to-br from-cyber-cyan/5 to-cyber-purple/5">
                    <h4 className="font-semibold mb-4">Impact</h4>
                    <p className="text-lg text-muted-foreground">{featuredProject.impact}</p>

                    <div className="mt-6 pt-6 border-t border-border/50">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold gradient-text">84%</div>
                          <div className="text-xs text-muted-foreground">of Indonesian homes</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold gradient-text">6</div>
                          <div className="text-xs text-muted-foreground">integrated services</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.value}
                variant={activeCategory === category.value ? 'gradient' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(category.value)}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </Button>
            )
          })}
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.filter(p => !p.featured).map((project) => {
              const projectUrl = (project as { isInternal?: boolean }).isInternal && project.liveUrl
                ? project.liveUrl
                : `/projects/${project.id}`

              return (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  layout
                >
                  <Link href={projectUrl} className="block h-full">
                    <div className={cn(
                      "glass rounded-xl p-6 flex flex-col h-full group hover:border-cyber-cyan/30 transition-colors",
                      (project as { isInternal?: boolean }).isInternal && "border-cyber-green/30 bg-gradient-to-br from-cyber-green/5 to-transparent"
                    )}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'px-2 py-1 rounded text-xs font-medium',
                            project.status === 'Active'
                              ? 'bg-cyber-green/20 text-cyber-green'
                              : project.status === 'In Development'
                              ? 'bg-cyber-cyan/20 text-cyber-cyan'
                              : 'bg-muted text-muted-foreground'
                          )}>
                            {project.status}
                          </span>
                          {(project as { isInternal?: boolean }).isInternal && (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-cyber-purple/20 text-cyber-purple flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              APK
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg hover:bg-muted transition-colors"
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          )}
                          {project.liveUrl && !(project as { isInternal?: boolean }).isInternal && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg hover:bg-muted transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      <h3 className="text-lg font-bold mb-2 group-hover:text-cyber-cyan transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-1">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {project.technologies.slice(0, 4).map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-muted text-xs">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="px-2 py-0.5 rounded-full bg-muted text-xs">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No projects found</h3>
            <p className="text-muted-foreground">Try selecting a different category</p>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

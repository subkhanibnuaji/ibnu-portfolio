'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Clock,
  Tag,
  CheckCircle,
  Code2,
  Layers,
  Users,
  Zap
} from 'lucide-react'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Mock project data
const projects: Record<string, {
  title: string
  slug: string
  description: string
  longDescription: string
  category: string
  status: 'completed' | 'in-progress' | 'planning'
  featured: boolean
  technologies: string[]
  features: string[]
  challenges: string[]
  results: string[]
  links: { label: string; url: string; icon: 'github' | 'external' }[]
  images: string[]
  startDate: string
  endDate?: string
  team?: string
}> = {
  'hub-pkp': {
    title: 'HUB PKP Platform',
    slug: 'hub-pkp',
    description: 'Indonesia\'s flagship digital ecosystem for self-built housing, serving millions of citizens.',
    longDescription: `HUB PKP (Pusat Kegiatan Perumahan dan Kawasan Permukiman) is a comprehensive digital platform developed for the Ministry of Public Works and Housing. It serves as the central hub for all housing-related services in Indonesia, where 84% of homes are self-built.

The platform integrates AI-powered design consultation, permit processing, material marketplace, and community features into a single ecosystem. Our goal was to make the housing journey easier for Indonesian citizens while improving government efficiency.`,
    category: 'Government Tech',
    status: 'completed',
    featured: true,
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Redis', 'TensorFlow', 'Docker', 'Kubernetes', 'AWS'],
    features: [
      'AI-powered house design generator with 100,000+ designs created',
      'Integrated PBG (Building Permit) processing system',
      'Real-time permit tracking and notifications',
      'Material marketplace with verified suppliers',
      'Construction cost estimator with regional pricing',
      'Community forum for homeowners',
      'Multi-language support (Indonesian, English)',
      'Mobile-responsive progressive web app'
    ],
    challenges: [
      'Scaling to handle millions of concurrent users',
      'Integrating with legacy government systems (SIMBG)',
      'Ensuring data security for citizen information',
      'Building AI models with limited historical data',
      'Training government staff on new digital workflows'
    ],
    results: [
      '40% reduction in permit processing time',
      '60% increase in citizen satisfaction scores',
      '100,000+ AI-generated house designs',
      'Rp 2 trillion in marketplace transactions facilitated',
      'Processing 50,000+ permit applications monthly'
    ],
    links: [
      { label: 'Live Platform', url: 'https://hubpkp.pu.go.id', icon: 'external' },
    ],
    images: [],
    startDate: '2023-08',
    endDate: '2024-12',
    team: 'Led a team of 12 developers, 3 designers, and 2 data scientists'
  },
  'automate-all': {
    title: 'Automate All RPA Platform',
    slug: 'automate-all',
    description: 'Enterprise RPA solution that helped 50+ clients automate their business processes.',
    longDescription: `Automate All was an RPA (Robotic Process Automation) startup I founded and led as CEO. We built a platform that allows businesses to automate repetitive tasks without coding knowledge.

The platform grew to serve 50+ enterprise clients across banking, insurance, and manufacturing sectors, processing millions of automated tasks monthly.`,
    category: 'Enterprise SaaS',
    status: 'completed',
    featured: true,
    technologies: ['Python', 'UiPath', 'Selenium', 'FastAPI', 'React', 'PostgreSQL', 'RabbitMQ', 'Docker'],
    features: [
      'Visual workflow builder with drag-and-drop interface',
      'Pre-built connectors for 100+ enterprise applications',
      'Scheduled and triggered automation execution',
      'Centralized bot management dashboard',
      'Detailed analytics and reporting',
      'Role-based access control',
      'API integration capabilities',
      'On-premise and cloud deployment options'
    ],
    challenges: [
      'Building reliable bots for unstable legacy applications',
      'Handling various edge cases in automated workflows',
      'Scaling bot infrastructure for enterprise clients',
      'Maintaining bots when target applications change',
      'Educating market about RPA benefits'
    ],
    results: [
      'Achieved IDR 1B company valuation',
      'Delivered 100+ RPA bots for 10+ clients',
      'Top 100 Startup - Startup4Industry 2021',
      'Top 100 Startup - ASMI 2021',
      'Average 70% time savings for client processes'
    ],
    links: [
      { label: 'Company Website', url: 'https://automateall.id', icon: 'external' },
    ],
    images: [],
    startDate: '2020-08',
    endDate: '2022-08',
    team: 'Founded and led team of 8 developers and 3 business analysts'
  },
  'crypto-portfolio': {
    title: 'Crypto Trading Dashboard',
    slug: 'crypto-portfolio',
    description: 'Personal trading dashboard for managing digital asset portfolio with on-chain analytics.',
    longDescription: `A custom-built trading dashboard for managing my personal cryptocurrency portfolio. The dashboard aggregates data from multiple exchanges and on-chain sources to provide a unified view of positions, P&L, and market opportunities.

Built with a focus on real-time data, the platform helps make data-driven trading decisions with features like liquidity analysis, whale tracking, and automated alerts.`,
    category: 'Web3 / DeFi',
    status: 'in-progress',
    featured: false,
    technologies: ['Next.js', 'TypeScript', 'Web3.js', 'Ethers.js', 'TradingView', 'Supabase', 'Redis'],
    features: [
      'Multi-exchange portfolio aggregation',
      'Real-time P&L tracking across positions',
      'On-chain liquidity flow analysis',
      'Whale wallet tracking and alerts',
      'TradingView chart integration',
      'Automated position sizing calculator',
      'Tax reporting export feature',
      'Telegram bot for price alerts'
    ],
    challenges: [
      'Handling rate limits from multiple exchange APIs',
      'Aggregating data from different blockchain networks',
      'Building reliable alert systems for volatile markets',
      'Securing API keys and wallet connections'
    ],
    results: [
      'Managing $68K-100K cumulative trading volume',
      'Automated monitoring of 50+ tokens',
      'Real-time alerts with <5 second latency',
      'Consolidated view across 5 exchanges'
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/subkhanibnuaji/crypto-dashboard', icon: 'github' },
    ],
    images: [],
    startDate: '2021-07',
    team: 'Solo project'
  },
}

const statusColors = {
  'completed': 'bg-cyber-green/20 text-cyber-green',
  'in-progress': 'bg-yellow-500/20 text-yellow-500',
  'planning': 'bg-blue-500/20 text-blue-400',
}

const statusLabels = {
  'completed': 'Completed',
  'in-progress': 'In Progress',
  'planning': 'Planning',
}

export default function ProjectDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const project = projects[slug]

  if (!project) {
    return (
      <PageLayout title="Project Not Found" subtitle="The project you're looking for doesn't exist.">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">This project could not be found.</p>
          <Link href="/projects">
            <Button variant="gradient">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="">
      <div className="container max-w-5xl">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="px-3 py-1 rounded-full text-sm bg-cyber-cyan/20 text-cyber-cyan">
              {project.category}
            </span>
            <span className={cn('px-3 py-1 rounded-full text-sm', statusColors[project.status])}>
              {statusLabels[project.status]}
            </span>
            {project.featured && (
              <span className="px-3 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-500">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {project.title}
          </h1>

          <p className="text-xl text-muted-foreground mb-6">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {project.startDate} - {project.endDate || 'Present'}
            </span>
            {project.team && (
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {project.team}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {project.links.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
                <Button variant={link.icon === 'external' ? 'gradient' : 'outline'}>
                  {link.icon === 'github' ? (
                    <Github className="h-4 w-4 mr-2" />
                  ) : (
                    <ExternalLink className="h-4 w-4 mr-2" />
                  )}
                  {link.label}
                </Button>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 md:p-8"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5 text-cyber-cyan" />
                Overview
              </h2>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {project.longDescription}
              </p>
            </motion.section>

            {/* Features */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 md:p-8"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-cyber-purple" />
                Key Features
              </h2>
              <ul className="space-y-3">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-cyber-green shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Challenges */}
            {project.challenges.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-6 md:p-8"
              >
                <h2 className="text-xl font-bold mb-4">Challenges & Solutions</h2>
                <ul className="space-y-3">
                  {project.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-cyber-orange mt-1">-</span>
                      <span className="text-muted-foreground">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            {/* Results */}
            {project.results.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-2xl p-6 md:p-8"
              >
                <h2 className="text-xl font-bold mb-4">Results & Impact</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {project.results.map((result, index) => (
                    <div key={index} className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">{result}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tech Stack */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Code2 className="h-5 w-5 text-cyber-cyan" />
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg text-sm bg-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.section>

            {/* Quick Stats */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="font-bold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span>
                    {project.endDate
                      ? `${Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months`
                      : 'Ongoing'
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Technologies</span>
                  <span>{project.technologies.length} tools</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Features</span>
                  <span>{project.features.length} features</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className={cn('px-2 py-0.5 rounded text-xs', statusColors[project.status])}>
                    {statusLabels[project.status]}
                  </span>
                </div>
              </div>
            </motion.section>

            {/* Related Projects */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="font-bold mb-4">Other Projects</h3>
              <div className="space-y-3">
                {Object.values(projects)
                  .filter((p) => p.slug !== slug)
                  .slice(0, 3)
                  .map((p) => (
                    <Link
                      key={p.slug}
                      href={`/projects/${p.slug}`}
                      className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <p className="font-medium text-sm mb-1">{p.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                    </Link>
                  ))}
              </div>
            </motion.section>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Interested in working together on a similar project?
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/contact">
              <Button variant="gradient">
                Get in Touch
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline">
                View All Projects
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
}

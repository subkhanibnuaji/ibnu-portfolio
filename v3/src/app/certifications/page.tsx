'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageLayout } from '@/components/layout/page-layout'
import {
  Award,
  ExternalLink,
  GraduationCap,
  Building2,
  Briefcase,
  Landmark,
  Shield,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const certifications = {
  'Elite Universities': [
    { name: 'Leadership', issuer: 'Harvard University', year: '2022', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Harvard_University_coat_of_arms.svg' },
    { name: 'Foundations of Finance', issuer: 'University of Cambridge', year: '2022', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Coat_of_Arms_of_the_University_of_Cambridge.svg' },
    { name: 'Machine Learning', issuer: 'Stanford University', year: '2022', logo: 'https://upload.wikimedia.org/wikipedia/en/b/b7/Stanford_University_seal_2003.svg' },
    { name: 'Game Theory', issuer: 'Stanford University', year: '2022', logo: 'https://upload.wikimedia.org/wikipedia/en/b/b7/Stanford_University_seal_2003.svg' },
    { name: 'Web3 & Blockchain Fundamentals', issuer: 'INSEAD', year: '2023', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/INSEAD_LOGO.png' }
  ],
  'Tech Giants': [
    { name: 'Cybersecurity Specialization', issuer: 'Google', year: '2024', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Business Intelligence Professional', issuer: 'Google', year: '2024', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Project Management', issuer: 'Google', year: '2024', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Data Engineering Specialization', issuer: 'IBM', year: '2024', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
    { name: 'AI Engineering Specialization', issuer: 'IBM', year: '2024', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
    { name: 'AWS Fundamentals', issuer: 'Amazon', year: '2024', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
    { name: 'Azure AI Fundamentals', issuer: 'Microsoft', year: '2024', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' }
  ],
  'Consulting Firms': [
    { name: 'Forward Program', issuer: 'McKinsey & Company', year: '2022', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/79/McKinsey_%26_Company_Logo_1.svg' },
    { name: 'Strategy Consulting', issuer: 'BCG', year: '2023', logo: null },
    { name: 'Technology Consulting', issuer: 'Deloitte', year: '2023', logo: null },
    { name: 'Data Analysis: PwC Approach', issuer: 'PwC', year: '2023', logo: null },
    { name: 'Climate Change & Sustainability', issuer: 'EY', year: '2023', logo: null },
    { name: 'Audit & Assurance', issuer: 'KPMG', year: '2023', logo: null },
    { name: 'Strategy Consulting', issuer: 'Accenture', year: '2022', logo: null }
  ],
  'Finance': [
    { name: 'Investment Banking', issuer: 'Bank of America', year: '2023', logo: null },
    { name: 'Commercial Banking', issuer: 'JP Morgan', year: '2023', logo: null },
    { name: 'Software Engineering', issuer: 'Goldman Sachs', year: '2023', logo: null },
    { name: 'Wealth & Personal Banking', issuer: 'Citi/HSBC', year: '2023', logo: null }
  ],
  'Specialized': [
    { name: 'Robotic Process Automation', issuer: 'UiPath', year: '2023', logo: null },
    { name: 'Cybersecurity Operations', issuer: 'Cisco', year: '2023', logo: null },
    { name: 'SAP Technology Consultant', issuer: 'SAP', year: '2023', logo: null }
  ]
}

const categoryIcons: Record<string, typeof GraduationCap> = {
  'Elite Universities': GraduationCap,
  'Tech Giants': Building2,
  'Consulting Firms': Briefcase,
  'Finance': Landmark,
  'Specialized': Shield
}

const categoryColors: Record<string, string> = {
  'Elite Universities': 'cyber-purple',
  'Tech Giants': 'cyber-cyan',
  'Consulting Firms': 'cyber-orange',
  'Finance': 'cyber-green',
  'Specialized': 'cyber-pink'
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function CertificationsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = Object.keys(certifications)
  const totalCerts = Object.values(certifications).flat().length

  const filteredCategories = activeCategory
    ? { [activeCategory]: certifications[activeCategory as keyof typeof certifications] }
    : certifications

  return (
    <PageLayout
      title="Credentials"
      subtitle="Professional certifications from world-renowned institutions and organizations."
      showBadge
      badgeText={`${totalCerts}+ Certifications`}
    >
      <div className="container">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12"
        >
          {categories.map((category) => {
            const Icon = categoryIcons[category]
            const count = certifications[category as keyof typeof certifications].length
            const color = categoryColors[category]

            return (
              <div
                key={category}
                className={cn(
                  'glass rounded-xl p-4 text-center cursor-pointer transition-all',
                  activeCategory === category && 'ring-2 ring-cyber-cyan'
                )}
                onClick={() => setActiveCategory(activeCategory === category ? null : category)}
              >
                <div className={`p-2 rounded-lg bg-${color}/10 text-${color} inline-flex mb-2`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs text-muted-foreground">{category}</div>
              </div>
            )
          })}
        </motion.div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={activeCategory === null ? 'gradient' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(null)}
          >
            All Certifications
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'gradient' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Certifications by Category */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory || 'all'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            {Object.entries(filteredCategories).map(([category, certs]) => {
              const Icon = categoryIcons[category]
              const color = categoryColors[category]

              return (
                <motion.section
                  key={category}
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-lg bg-${color}/10`}>
                      <Icon className={`h-6 w-6 text-${color}`} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold">{category}</h2>
                    <span className="px-2 py-1 rounded-full bg-muted text-xs">
                      {certs.length} certifications
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certs.map((cert, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="glass rounded-xl p-5 flex items-start gap-4 group hover:border-cyber-cyan/30 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Award className="h-6 w-6 text-cyber-cyan" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm mb-1 group-hover:text-cyber-cyan transition-colors line-clamp-2">
                            {cert.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                          <p className="text-xs text-muted-foreground mt-1">{cert.year}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Continuous Learning</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            I believe in lifelong learning and constantly updating my skills to stay current
            with the latest technologies and best practices in AI, blockchain, and cybersecurity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">50+</div>
              <div className="text-sm text-muted-foreground">Certifications</div>
            </div>
            <div className="w-px h-12 bg-border hidden md:block" />
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">5</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="w-px h-12 bg-border hidden md:block" />
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">20+</div>
              <div className="text-sm text-muted-foreground">Top Institutions</div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
}

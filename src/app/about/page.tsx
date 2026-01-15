'use client'

import { motion } from 'framer-motion'
import { PageLayout } from '@/components/layout/page-layout'
import {
  GraduationCap,
  Briefcase,
  Award,
  MapPin,
  Calendar,
  ExternalLink,
  Languages,
  Trophy,
  Github,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { GitHubStats } from '@/components/github/github-stats'
import { ResumeDownload } from '@/components/resume/resume-download'

const education = [
  {
    degree: 'Senior Executive MBA',
    institution: 'Universitas Gadjah Mada (UGM)',
    location: 'Jakarta, Indonesia',
    period: '2022 - 2024',
    gpa: '3.60/4.00',
    thesis: 'Evaluation of Product Differentiation Strategy Implementation at PT Sambel Korek DNO',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Logo_UGM.png'
  },
  {
    degree: 'Bachelor of Science in Informatics (S.Kom)',
    institution: 'Telkom University',
    location: 'Bandung, Indonesia',
    period: '2017 - 2021',
    gpa: '3.34/4.00',
    thesis: 'Animo: Web-Based Automation for F&B SMEs',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Telkom_University_Logo.png'
  }
]

const experience = [
  {
    title: 'Civil Servant (ASN)',
    company: 'Ministry of Housing & Settlement Areas (PKP)',
    location: 'Jakarta, Indonesia',
    period: 'Aug 2024 - Present',
    current: true,
    description: 'Managing end-to-end delivery of multiple enterprise IT applications including SIBARU, PKP HUB, and SIMONI.',
    highlights: [
      'Lead development of PKP HUB digital housing ecosystem',
      'Coordinate vendor delivery and user adoption',
      'Support ministerial policy drafting',
      'Evaluate procurement proposals >IDR 10B'
    ]
  },
  {
    title: 'Founder & CEO',
    company: 'Virtus Futura Consulting',
    location: 'Jakarta, Indonesia',
    period: 'Jul 2021 - Jul 2024',
    current: false,
    description: 'Led project-based consulting in strategy, operations, and digital transformation. Managed portfolio value >IDR 1T (~USD 71M).',
    highlights: [
      'Hospital feasibility studies (IDR 331B project)',
      'Healthcare turnaround management',
      'Multi-clinic governance models',
      'F&B scale-up operations (IDR 100M to IDR 1B/month)'
    ]
  },
  {
    title: 'Founder & CEO',
    company: 'CV Solusi Automasi Indonesia (Automate All)',
    location: 'Bandung, Indonesia',
    period: 'Aug 2020 - Aug 2022',
    current: false,
    description: 'Grew RPA company valuation to IDR 1B through pre-seed funding efforts. Delivered automation solutions to 50+ clients.',
    highlights: [
      'Built 100+ RPA bots for 10+ clients',
      'Achieved IDR 1B valuation',
      'Top 100 Startup - Startup4Industry 2021',
      'Top 100 Startup - ASMI 2021'
    ]
  },
  {
    title: 'Independent Crypto Investor',
    company: 'Self-Funded Portfolio',
    location: 'Remote',
    period: 'Jul 2021 - Present',
    current: true,
    description: 'Managing self-funded digital asset portfolio with thesis-driven, risk-controlled approach.',
    highlights: [
      '$68K-100K cumulative futures volume',
      '70% BTC / 15% Altcoin / 10% Memecoin / 5% DEX allocation',
      'Spot and CEX/DEX derivatives strategies',
      'On-chain research for liquidity/flows analysis'
    ]
  }
]

const languages = [
  { name: 'Indonesian', level: 'Native', flag: '🇮🇩' },
  { name: 'English', level: 'Advanced (C1)', certification: 'TOEFL ITP 593', flag: '🇺🇸' },
  { name: 'Arabic', level: 'Beginner', flag: '🇸🇦' },
  { name: 'Mandarin', level: 'Beginner', certification: 'HSK 1', flag: '🇨🇳' }
]

const achievements = [
  {
    title: '2nd Best Outstanding Graduate (Innovation & Entrepreneurship)',
    issuer: 'Telkom University',
    year: '2022'
  },
  {
    title: 'Top 100 Startup - Startup4Industry 2021',
    issuer: 'Ministry of Industry',
    year: '2021'
  },
  {
    title: 'Top 100 Startup - ASMI 2021',
    issuer: 'Kemendikbud/Dikti',
    year: '2021'
  },
  {
    title: 'Top 45 Selected Startup - Bandung Startup Pitching Day',
    issuer: 'SBM ITB / LPIK ITB',
    year: '2021'
  },
  {
    title: 'Top 20 Startup - BLOCK71 Community Open Incubation',
    issuer: 'NUS Enterprise',
    year: '2021'
  }
]

const organizations = [
  { name: 'CFA Institute', role: 'Member', id: 'ID: 200530563', period: '2024 - Present' },
  { name: 'KADIN Indonesia', role: 'Member', id: 'ID: 20203-2132274685', period: '2022 - Present' },
  { name: 'BPD HIPMI JAYA', role: 'Member', id: 'DKI Jakarta', period: '2021 - Present' },
  { name: 'Akademi Crypto', role: 'Lifetime Member', id: '', period: '2023 - Present' }
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

export default function AboutPage() {
  return (
    <PageLayout
      title="About Me"
      subtitle="Cross-functional professional with expertise in Digital Transformation, IT Governance, AI/ML, Blockchain/Web3, and Cybersecurity."
      showBadge
      badgeText="Subkhan Ibnu Aji, S.Kom., M.B.A."
    >
      <div className="container">
        {/* Education Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Education</h2>
          </div>

          <div className="grid gap-6">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass rounded-2xl p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-8 w-8 text-cyber-cyan" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{edu.degree}</h3>
                    <p className="text-cyber-cyan font-medium mb-2">{edu.institution}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {edu.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {edu.period}
                      </span>
                      <span className="text-cyber-green font-medium">GPA: {edu.gpa}</span>
                    </div>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Thesis:</strong> {edu.thesis}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Experience Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-cyber-purple/10 text-cyber-purple">
              <Briefcase className="h-6 w-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Experience</h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyber-cyan via-cyber-purple to-cyber-green hidden md:block" />

            <div className="space-y-8">
              {experience.map((exp, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative pl-0 md:pl-20"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-6 top-8 w-4 h-4 rounded-full bg-cyber-cyan border-4 border-background hidden md:block" />

                  <div className="glass rounded-2xl p-6 md:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{exp.title}</h3>
                        <p className="text-cyber-cyan font-medium">{exp.company}</p>
                      </div>
                      {exp.current && (
                        <span className="px-3 py-1 rounded-full bg-cyber-green/20 text-cyber-green text-sm font-medium">
                          Current
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {exp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {exp.period}
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-4">{exp.description}</p>

                    <ul className="space-y-2">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-cyber-cyan mt-1">-</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Languages Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-cyber-orange/10 text-cyber-orange">
              <Languages className="h-6 w-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Languages</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {languages.map((lang, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass rounded-xl p-4 text-center"
              >
                <div className="text-4xl mb-2">{lang.flag}</div>
                <h3 className="font-bold">{lang.name}</h3>
                <p className="text-sm text-muted-foreground">{lang.level}</p>
                {lang.certification && (
                  <p className="text-xs text-cyber-cyan mt-1">{lang.certification}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Achievements Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-cyber-green/10 text-cyber-green">
              <Trophy className="h-6 w-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Achievements</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass rounded-xl p-6 flex items-start gap-4"
              >
                <div className="p-2 rounded-lg bg-cyber-green/10 flex-shrink-0">
                  <Award className="h-5 w-5 text-cyber-green" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {achievement.issuer} - {achievement.year}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Organizations Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-cyber-purple/10 text-cyber-purple">
              <Briefcase className="h-6 w-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Professional Memberships</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {organizations.map((org, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass rounded-xl p-6"
              >
                <h3 className="font-bold text-lg mb-1">{org.name}</h3>
                <p className="text-cyber-cyan text-sm mb-2">{org.role}</p>
                {org.id && <p className="text-xs text-muted-foreground">{org.id}</p>}
                <p className="text-xs text-muted-foreground mt-2">{org.period}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* GitHub Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-muted text-foreground">
              <Github className="h-6 w-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">GitHub Activity</h2>
          </div>

          <GitHubStats username="subkhanibnuaji" showRepos maxRepos={4} />
        </motion.section>

        {/* Resume Download Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan">
              <FileText className="h-6 w-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Resume / CV</h2>
          </div>

          <ResumeDownload variant="card" />
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Want to know more?</h3>
          <p className="text-muted-foreground mb-6">
            Check out my projects or get in touch to discuss opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="gradient" asChild>
              <Link href="/projects">
                View Projects
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Me</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
}

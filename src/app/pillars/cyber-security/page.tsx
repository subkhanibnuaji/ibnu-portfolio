'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Shield, ShieldAlert, Lock, Bug, Eye, Fingerprint, Server, Key,
  AlertTriangle, FileWarning, Wifi, Database, Terminal, Skull, ArrowRight
} from 'lucide-react'
import { NewsFeed } from '@/components/pillars/news-feed'
import { SecurityStatsWidget, ThreatIndicator } from '@/components/pillars/security-stats'

const securityDomains = [
  {
    icon: Bug,
    title: 'Penetration Testing',
    description: 'Ethical hacking to identify vulnerabilities before attackers do.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    icon: Shield,
    title: 'Network Security',
    description: 'Protecting network infrastructure from unauthorized access.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Lock,
    title: 'Cryptography',
    description: 'Securing data through encryption and secure protocols.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Eye,
    title: 'Threat Intelligence',
    description: 'Monitoring and analyzing cyber threats in real-time.',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: Server,
    title: 'Cloud Security',
    description: 'Securing cloud infrastructure and applications.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Fingerprint,
    title: 'Identity & Access',
    description: 'Managing user authentication and authorization.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
]

const threatTypes = [
  { icon: Skull, name: 'Ransomware', description: 'Malware that encrypts files for ransom' },
  { icon: FileWarning, name: 'Phishing', description: 'Social engineering attacks via email' },
  { icon: Bug, name: 'Zero-Day', description: 'Unknown vulnerabilities exploited' },
  { icon: Wifi, name: 'Man-in-the-Middle', description: 'Intercepting network traffic' },
  { icon: Database, name: 'SQL Injection', description: 'Database manipulation attacks' },
  { icon: Terminal, name: 'Command Injection', description: 'Executing malicious commands' },
]

const certifications = [
  { name: 'CompTIA Security+', level: 'Foundation' },
  { name: 'CEH', level: 'Intermediate' },
  { name: 'OSCP', level: 'Advanced' },
  { name: 'CISSP', level: 'Expert' },
]

export default function CyberSecurityPage() {
  return (
    <main className="min-h-screen py-24">
      {/* Hero Section */}
      <section className="container mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-security-safe/10 text-security-safe text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Pillar of the Future
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Cyber
            <span className="bg-gradient-to-r from-security-safe to-cyan-500 bg-clip-text text-transparent"> Security</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stay informed about the latest cybersecurity threats, vulnerabilities, and defense strategies.
            Real-time news from trusted security researchers and organizations.
          </p>
        </motion.div>
      </section>

      {/* Security Stats */}
      <section className="container mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-security-warning/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-security-warning" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Today&apos;s Threat Level</h2>
            <p className="text-sm text-muted-foreground">Based on current news severity</p>
          </div>
        </div>
        <SecurityStatsWidget />
      </section>

      {/* Main Content Grid */}
      <section className="container mb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Security News Feed - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-security-danger/10 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-security-danger" />
              </div>
              Security News Feed
            </h2>
            <NewsFeed
              endpoint="/api/news/security"
              title="Latest Security News"
              icon={<Shield className="w-5 h-5 text-security-safe" />}
              showSeverity={true}
              limit={12}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Threat Indicator */}
            <ThreatIndicator />

            {/* Security Certifications */}
            <div className="p-6 bg-card border border-border rounded-2xl">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                Security Certifications Path
              </h3>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <div
                    key={cert.name}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium text-sm">{cert.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{cert.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Domains */}
      <section className="container mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Cybersecurity Domains</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive security requires expertise across multiple specialized domains.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityDomains.map((domain, index) => (
            <motion.div
              key={domain.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-card border border-border rounded-xl hover:border-primary/30 transition-all group"
            >
              <div className={`w-12 h-12 rounded-lg ${domain.bgColor} flex items-center justify-center mb-4`}>
                <domain.icon className={`w-6 h-6 ${domain.color}`} />
              </div>
              <h3 className="font-bold text-lg mb-2">{domain.title}</h3>
              <p className="text-sm text-muted-foreground">{domain.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Common Threat Types */}
      <section className="container mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Common Threat Types</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Understanding attack vectors is the first step in building effective defenses.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {threatTypes.map((threat, index) => (
            <motion.div
              key={threat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-card border border-border rounded-xl text-center hover:border-security-danger/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-security-danger/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-security-danger/20 transition-colors">
                <threat.icon className="w-5 h-5 text-security-danger" />
              </div>
              <h4 className="font-semibold text-sm mb-1">{threat.name}</h4>
              <p className="text-xs text-muted-foreground">{threat.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Security Best Practices */}
      <section className="container mb-16">
        <div className="p-8 bg-card border border-border rounded-2xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Lock className="w-6 h-6 text-security-safe" />
            Security Best Practices
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Use Strong Passwords', desc: 'Unique passwords with 12+ characters' },
              { title: 'Enable 2FA', desc: 'Add extra layer of authentication' },
              { title: 'Keep Software Updated', desc: 'Patch vulnerabilities promptly' },
              { title: 'Backup Regularly', desc: 'Protect against data loss' },
            ].map((practice, index) => (
              <div
                key={practice.title}
                className="p-4 bg-muted/50 rounded-xl"
              >
                <div className="w-8 h-8 rounded-lg bg-security-safe/10 flex items-center justify-center mb-3">
                  <span className="text-security-safe font-bold">{index + 1}</span>
                </div>
                <h4 className="font-semibold mb-1">{practice.title}</h4>
                <p className="text-sm text-muted-foreground">{practice.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-security-safe/10 via-cyan-500/5 to-transparent border border-security-safe/20 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Explore Security Projects
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Check out my cybersecurity tools, vulnerability research, and security-focused applications.
          </p>
          <Link
            href="/projects?category=security"
            className="inline-flex items-center gap-2 px-6 py-3 bg-security-safe text-white rounded-lg font-medium hover:bg-security-safe/90 transition-colors"
          >
            View Security Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </main>
  )
}

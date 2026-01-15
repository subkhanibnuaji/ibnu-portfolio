'use client'

import Link from 'next/link'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { FooterNewsletter } from '@/components/newsletter/newsletter-form'

const FOOTER_LINKS = {
  pages: [
    { href: '/', label: 'Home' },
    { href: '/interests', label: 'Interests' },
    { href: '/projects', label: 'Projects' },
    { href: '/certifications', label: 'Credentials' },
  ],
  connect: [
    { href: '/contact', label: 'Contact' },
    { href: 'mailto:hi@heyibnu.com', label: 'Email' },
    { href: 'https://linkedin.com/in/subkhanibnuaji', label: 'LinkedIn' },
    { href: 'https://github.com/subkhanibnuaji', label: 'GitHub' },
  ],
}

const SOCIAL_LINKS = [
  { href: 'https://github.com/subkhanibnuaji', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com/in/subkhanibnuaji', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://twitter.com/subkhanibnuaji', icon: Twitter, label: 'Twitter' },
  { href: 'mailto:hi@heyibnu.com', icon: Mail, label: 'Email' },
]

export function Footer() {
  return (
    <footer className="relative border-t border-border dark:border-primary/10 bg-card/30 dark:bg-card/20">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-20 dark:opacity-30" />

      <div className="container relative z-10 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
              <span className="gradient-text">IBNU</span>
              <span className="w-2 h-2 rounded-full bg-cyber-cyan" />
            </Link>
            <p className="mt-4 text-muted-foreground max-w-md">
              Building at the intersection of AI, Blockchain, and Cybersecurity.
              Exploring emerging technologies to shape the future of digital transformation.
            </p>
            <div className="flex gap-3 mt-6">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-muted dark:bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300 hover:scale-105"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div>
            <h4 className="font-semibold mb-4">Pages</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.pages.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.connect.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2">
            <FooterNewsletter />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Subkhan Ibnu Aji. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with passion for technology and the future.
          </p>
        </div>
      </div>
    </footer>
  )
}

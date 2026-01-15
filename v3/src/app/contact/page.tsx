'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageLayout } from '@/components/layout/page-layout'
import {
  Mail,
  MapPin,
  Github,
  Linkedin,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hi@heyibnu.com',
    href: 'mailto:hi@heyibnu.com',
    color: 'cyber-cyan'
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Jakarta, Indonesia',
    href: null,
    color: 'cyber-purple'
  }
]

const socialLinks = [
  {
    icon: Github,
    label: 'GitHub',
    value: '@subkhanibnuaji',
    href: 'https://github.com/subkhanibnuaji',
    color: 'cyber-green'
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: '/in/subkhanibnuaji',
    href: 'https://linkedin.com/in/subkhanibnuaji',
    color: 'cyber-cyan'
  }
]

const subjectOptions = [
  'Project Collaboration',
  'Job Opportunity',
  'Consulting Request',
  'Speaking Engagement',
  'Just Saying Hi',
  'Other'
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    // Simulate form submission (replace with actual API call later)
    await new Promise(resolve => setTimeout(resolve, 1500))

    // For now, just show success message
    setStatus('success')
    setFormData({ name: '', email: '', subject: '', message: '' })

    // Reset status after 5 seconds
    setTimeout(() => setStatus('idle'), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <PageLayout
      title="Get in Touch"
      subtitle="Have a project in mind or want to discuss opportunities? I'd love to hear from you."
      showBadge
      badgeText="Available for Opportunities"
    >
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

            <div className="space-y-4 mb-8">
              {contactInfo.map((item, index) => {
                const Icon = item.icon
                const Content = (
                  <div className="glass rounded-xl p-4 flex items-center gap-4 group hover:border-cyber-cyan/30 transition-colors">
                    <div className={`p-3 rounded-lg bg-${item.color}/10`}>
                      <Icon className={`h-5 w-5 text-${item.color}`} />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                      <div className="font-medium group-hover:text-cyber-cyan transition-colors">
                        {item.value}
                      </div>
                    </div>
                  </div>
                )

                return item.href ? (
                  <a key={index} href={item.href}>
                    {Content}
                  </a>
                ) : (
                  <div key={index}>{Content}</div>
                )
              })}
            </div>

            <h3 className="font-bold mb-4">Connect with me</h3>
            <div className="space-y-3">
              {socialLinks.map((item, index) => {
                const Icon = item.icon
                return (
                  <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass rounded-xl p-4 flex items-center gap-4 group hover:border-cyber-cyan/30 transition-colors block"
                  >
                    <div className={`p-3 rounded-lg bg-${item.color}/10`}>
                      <Icon className={`h-5 w-5 text-${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                      <div className="font-medium group-hover:text-cyber-cyan transition-colors">
                        {item.value}
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>

            {/* Quick Info */}
            <div className="mt-8 glass rounded-xl p-6">
              <h3 className="font-bold mb-4">Quick Facts</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan">-</span>
                  <span>Currently working at Indonesia&apos;s Ministry of Housing & Settlement Areas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan">-</span>
                  <span>Open to consulting, advisory, and collaboration opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan">-</span>
                  <span>Response time: Usually within 24-48 hours</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8">
              {status === 'success' && (
                <div className="mb-6 p-4 rounded-lg bg-cyber-green/10 border border-cyber-green/20 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-cyber-green" />
                  <div>
                    <p className="font-medium text-cyber-green">Message sent successfully!</p>
                    <p className="text-sm text-muted-foreground">I&apos;ll get back to you soon.</p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-red-500">Something went wrong</p>
                    <p className="text-sm text-muted-foreground">Please try again later.</p>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan outline-none transition-colors"
                  >
                    <option value="">Select a subject</option>
                    {subjectOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan outline-none transition-colors resize-none"
                    placeholder="Your message..."
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  variant="gradient"
                  className="w-full"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              By submitting this form, you agree to receive a response via email.
            </p>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  )
}

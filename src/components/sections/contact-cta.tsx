'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Mail, Github, Linkedin, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const SOCIAL_LINKS = [
  { href: 'https://github.com/subkhanibnuaji', icon: Github },
  { href: 'https://linkedin.com/in/subkhanibnuaji', icon: Linkedin },
  { href: 'https://tiktok.com/@subkhanibnuaji', icon: MessageCircle },
]

export function ContactCTASection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[128px]" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Let&apos;s Build the{' '}
            <span className="gradient-text">Future Together</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Interested in AI, blockchain, or cybersecurity projects?
            Let&apos;s connect and explore possibilities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Button size="lg" variant="gradient" asChild>
              <Link href="/contact">
                Get In Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="mailto:hi@heyibnu.com">
                <Mail className="mr-2 h-4 w-4" />
                hi@heyibnu.com
              </a>
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            {SOCIAL_LINKS.map((social, index) => (
              <motion.a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
              >
                <social.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

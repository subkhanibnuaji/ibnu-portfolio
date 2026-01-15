'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Award, Users, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const LOGOS = [
  { name: 'Harvard', src: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Harvard_University_coat_of_arms.svg' },
  { name: 'Stanford', src: 'https://upload.wikimedia.org/wikipedia/en/b/b7/Stanford_University_seal_2003.svg' },
  { name: 'Cambridge', src: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Coat_of_Arms_of_the_University_of_Cambridge.svg' },
  { name: 'McKinsey', src: 'https://upload.wikimedia.org/wikipedia/commons/7/79/McKinsey_%26_Company_Logo_1.svg' },
  { name: 'Google', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { name: 'IBM', src: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
]

const HIGHLIGHTS = [
  {
    icon: GraduationCap,
    title: 'Education',
    items: ['MBA - Universitas Gadjah Mada', 'S.Kom - Telkom University', 'TOEFL ITP: 593'],
  },
  {
    icon: Award,
    title: 'Certifications',
    items: ['50+ Professional Certifications', 'From Harvard, Stanford, Google, IBM, McKinsey, BCG, and more'],
  },
  {
    icon: Users,
    title: 'Memberships',
    items: ['CFA Institute, KADIN Indonesia, HIPMI JAYA, Akademi Crypto'],
  },
]

export function CredentialsSection() {
  return (
    <section className="py-24 px-4 bg-card/30">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Education & Certifications
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            World-Class Credentials
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Continuous learning from the world&apos;s best institutions and organizations.
          </p>
        </motion.div>

        {/* Logo Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8 md:gap-12 mb-16"
        >
          {LOGOS.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative w-16 h-16 md:w-20 md:h-20 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                className="object-contain"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Highlight Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {HIGHLIGHTS.map((highlight, index) => (
            <motion.div
              key={highlight.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-4 p-6 rounded-2xl border border-border bg-card/50"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <highlight.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">{highlight.title}</h4>
                <ul className="space-y-1">
                  {highlight.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="gradient" asChild>
            <Link href="/certifications">
              View All Credentials
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

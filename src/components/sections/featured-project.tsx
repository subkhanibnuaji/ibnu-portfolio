'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Home, FileCheck, Store, HardHat, Wallet, ClipboardCheck } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const FEATURES = [
  { icon: Home, label: 'Konsultasi Desain' },
  { icon: FileCheck, label: 'Perizinan PBG' },
  { icon: Store, label: 'Toko Material' },
  { icon: HardHat, label: 'Pekerja Konstruksi' },
  { icon: Wallet, label: 'Pembiayaan' },
  { icon: ClipboardCheck, label: 'Pengawasan' },
]

export function FeaturedProjectSection() {
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
            Government Project
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            HUB PKP - Klinik Rumah
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Digital ecosystem for self-built housing in Indonesia, integrating design
            consultation, permits, materials, contractors, financing, and construction monitoring.
          </p>
        </motion.div>

        {/* Project Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="rounded-2xl border border-border overflow-hidden bg-card">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="flex-1 text-center text-sm text-muted-foreground">
                  HUB Rumah Swadaya Layak Huni
                </span>
              </div>

              {/* App Content */}
              <div className="p-6 bg-gradient-to-br from-card to-muted/30">
                <div className="flex items-center gap-3 mb-6">
                  <Home className="h-6 w-6 text-primary" />
                  <span className="font-semibold">Klinik PKP</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {FEATURES.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-background/50 border border-border"
                    >
                      <feature.icon className="h-6 w-6 text-primary" />
                      <span className="text-xs text-center text-muted-foreground">
                        {feature.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-3xl -z-10" />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <h4 className="font-semibold mb-2">The Challenge</h4>
                <p className="text-sm text-muted-foreground">
                  83.99% of houses in Indonesia are self-built by communities, often without
                  proper permits (PBG), standards compliance, or access to quality materials
                  and skilled workers.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <h4 className="font-semibold mb-2">The Solution</h4>
                <p className="text-sm text-muted-foreground">
                  HUB PKP creates an integrated digital ecosystem connecting homeowners with
                  architects, permit systems (SIMBG), material suppliers, construction workers,
                  and financing options - all in one platform.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary border border-primary/20">
                Government System
              </span>
              <span className="px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary border border-primary/20">
                Multi-stakeholder
              </span>
              <span className="px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary border border-primary/20">
                End-to-end Integration
              </span>
            </div>

            <Button variant="gradient" asChild>
              <Link href="/projects#hub-pkp">
                View Full Case Study
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import { Users, ExternalLink, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { personalPhotos } from '@/config/personal-photos'
import { cn } from '@/lib/utils'

export function NetworkingGallery() {
  const networkingPhotos = personalPhotos.networking
  const pitchingPhoto = personalPhotos.achievements.pitching

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20 dark:opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyber-purple/5 dark:bg-cyber-purple/10 rounded-full blur-[150px]" />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-primary uppercase tracking-wider mb-4">
            <Users className="h-4 w-4" />
            Network & Connections
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Building <span className="gradient-text">Meaningful Connections</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learning from industry leaders and building relationships with visionaries in tech, finance, and entrepreneurship.
          </p>
        </motion.div>

        {/* Featured - Pitching Achievement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="relative rounded-2xl overflow-hidden glass">
            <div className="flex flex-col lg:flex-row">
              {/* Image */}
              <div className="relative lg:w-1/2 h-80 lg:h-auto">
                <Image
                  src={pitchingPhoto.src}
                  alt={pitchingPhoto.alt}
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card lg:bg-gradient-to-t lg:from-card/80 lg:via-transparent lg:to-transparent" />
              </div>

              {/* Content */}
              <div className="flex-1 p-8 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-orange/10 text-cyber-orange text-xs font-medium w-fit mb-4">
                  <Sparkles className="h-3 w-3" />
                  Featured Moment
                </div>
                <h3 className="text-2xl font-bold mb-2">{pitchingPhoto.caption}</h3>
                <p className="text-lg text-cyber-cyan font-medium mb-1">{pitchingPhoto.person}</p>
                <p className="text-sm text-muted-foreground mb-4">{pitchingPhoto.role}</p>
                <p className="text-muted-foreground">
                  Pitching startup ideas to one of Indonesia&apos;s most prominent venture capitalists.
                  A memorable experience that shaped my entrepreneurial journey.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Networking Photos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {networkingPhotos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className={cn(
                'relative rounded-2xl overflow-hidden',
                'border border-border bg-card/50 dark:bg-card/30',
                'transition-all duration-300',
                'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10',
                'hover:-translate-y-1'
              )}>
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

                  {/* Category Badge */}
                  {photo.category && (
                    <div className="absolute top-4 right-4">
                      <span className={cn(
                        'px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm',
                        photo.category === 'finance' && 'bg-cyber-orange/20 text-cyber-orange',
                        photo.category === 'startup' && 'bg-cyber-cyan/20 text-cyber-cyan',
                        photo.category === 'tech' && 'bg-cyber-purple/20 text-cyber-purple',
                      )}>
                        {photo.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold mb-1">{photo.caption}</h3>
                  {photo.person && (
                    <>
                      <p className="text-cyber-cyan text-sm font-medium">{photo.person}</p>
                      <p className="text-xs text-muted-foreground">{photo.role}</p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

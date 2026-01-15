'use client'

import { motion } from 'framer-motion'
import { Users, ExternalLink, Sparkles, Building2, Briefcase, GraduationCap, Award, Handshake } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// Professional networking/events - using Unsplash free images
const networkingData = {
  featured: {
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    alt: 'Startup Pitching Event',
    caption: 'Startup Pitching Session',
    description: 'Presenting innovative ideas to prominent venture capitalists and industry leaders.',
    category: 'startup',
  },
  networking: [
    {
      src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80',
      alt: 'Business Conference',
      caption: 'Tech Conference Networking',
      description: 'Building connections with tech leaders',
      category: 'tech',
      icon: Briefcase,
    },
    {
      src: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&q=80',
      alt: 'Professional Meeting',
      caption: 'Industry Expert Discussion',
      description: 'Learning from finance professionals',
      category: 'finance',
      icon: Building2,
    },
    {
      src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80',
      alt: 'Graduation Ceremony',
      caption: 'MBA Graduation - UGM',
      description: 'Master of Business Administration',
      category: 'education',
      icon: GraduationCap,
    },
    {
      src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80',
      alt: 'Public Speaking',
      caption: 'Corporate Presentation',
      description: 'Presenting tech solutions',
      category: 'presentation',
      icon: Award,
    },
    {
      src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80',
      alt: 'Team Collaboration',
      caption: 'Startup Community Meetup',
      description: 'Collaborating with entrepreneurs',
      category: 'startup',
      icon: Handshake,
    },
    {
      src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80',
      alt: 'Business Organization',
      caption: 'HIPMI Business Network',
      description: 'Young entrepreneurs association',
      category: 'organization',
      icon: Users,
    },
  ],
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  tech: { bg: 'bg-cyber-cyan/20', text: 'text-cyber-cyan', border: 'border-cyber-cyan/50' },
  finance: { bg: 'bg-cyber-orange/20', text: 'text-cyber-orange', border: 'border-cyber-orange/50' },
  startup: { bg: 'bg-cyber-purple/20', text: 'text-cyber-purple', border: 'border-cyber-purple/50' },
  education: { bg: 'bg-cyber-green/20', text: 'text-cyber-green', border: 'border-cyber-green/50' },
  presentation: { bg: 'bg-cyber-pink/20', text: 'text-cyber-pink', border: 'border-cyber-pink/50' },
  organization: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', border: 'border-yellow-500/50' },
}

export function NetworkingGallery() {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-[#0a0a0f]">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyber-purple/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyber-cyan/10 rounded-full blur-[100px]" />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0a0a0f]/80 backdrop-blur-sm border border-cyber-purple/30 text-sm font-mono mb-4">
            <Users className="h-4 w-4 text-cyber-purple" />
            <span className="text-cyber-green">$</span>
            <span className="text-cyber-purple">network</span>
            <span className="text-foreground">--connections</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
            Building <span className="gradient-text">Connections</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learning from industry leaders and building relationships with visionaries in tech, finance, and entrepreneurship.
          </p>
        </motion.div>

        {/* Featured - Main Achievement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="relative rounded-2xl overflow-hidden border border-cyber-purple/30 bg-[#0a0a0f]/60 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row">
              {/* Image */}
              <div className="relative lg:w-1/2 h-80 lg:h-auto min-h-[300px]">
                <Image
                  src={networkingData.featured.src}
                  alt={networkingData.featured.alt}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0f] lg:block hidden" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent to-transparent lg:hidden" />
              </div>

              {/* Content */}
              <div className="flex-1 p-8 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-orange/10 border border-cyber-orange/30 text-cyber-orange text-xs font-mono w-fit mb-4">
                  <Sparkles className="h-3 w-3" />
                  FEATURED_MOMENT
                </div>
                <h3 className="text-2xl font-bold mb-2 font-mono">{networkingData.featured.caption}</h3>
                <p className="text-muted-foreground mb-4">{networkingData.featured.description}</p>

                {/* Stats */}
                <div className="flex gap-4 mt-4">
                  <div className="px-3 py-2 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30">
                    <div className="text-cyber-cyan font-mono font-bold">VC</div>
                    <div className="text-xs text-muted-foreground">Pitching</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-cyber-green/10 border border-cyber-green/30">
                    <div className="text-cyber-green font-mono font-bold">Startup</div>
                    <div className="text-xs text-muted-foreground">Ideas</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-cyber-purple/10 border border-cyber-purple/30">
                    <div className="text-cyber-purple font-mono font-bold">Network</div>
                    <div className="text-xs text-muted-foreground">Building</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Networking Photos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {networkingData.networking.map((photo, index) => {
            const colors = categoryColors[photo.category] || categoryColors.tech
            const Icon = photo.icon

            return (
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
                  'border bg-[#0a0a0f]/60 backdrop-blur-sm',
                  colors.border,
                  'transition-all duration-300',
                  'hover:shadow-lg hover:-translate-y-1'
                )}>
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/30 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={cn(
                        'px-3 py-1 rounded-full text-xs font-mono backdrop-blur-sm border',
                        colors.bg,
                        colors.text,
                        colors.border
                      )}>
                        {photo.category.toUpperCase()}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="absolute bottom-4 left-4">
                      <div className={cn(
                        'p-2 rounded-lg backdrop-blur-sm border',
                        colors.bg,
                        colors.border
                      )}>
                        <Icon className={cn('h-5 w-5', colors.text)} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className={cn('font-semibold mb-1 font-mono', colors.text)}>{photo.caption}</h3>
                    <p className="text-sm text-muted-foreground">{photo.description}</p>
                  </div>

                  {/* Corner accents */}
                  <div className={cn('absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 opacity-50', colors.border)} />
                  <div className={cn('absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 opacity-50', colors.border)} />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

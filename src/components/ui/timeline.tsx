'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Building2, GraduationCap, Briefcase, Award } from 'lucide-react'

type TimelineItemType = 'work' | 'education' | 'certification' | 'achievement'

interface TimelineItem {
  id: string
  title: string
  subtitle?: string
  description?: string
  date: string
  endDate?: string
  location?: string
  type: TimelineItemType
  current?: boolean
  tags?: string[]
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

const typeConfig: Record<TimelineItemType, {
  icon: typeof Briefcase
  color: string
  bgColor: string
}> = {
  work: {
    icon: Briefcase,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500'
  },
  education: {
    icon: GraduationCap,
    color: 'text-green-500',
    bgColor: 'bg-green-500'
  },
  certification: {
    icon: Award,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500'
  },
  achievement: {
    icon: Award,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500'
  }
}

export function Timeline({ items, className = '' }: TimelineProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Vertical line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-0.5" />

      <div className="space-y-8">
        {items.map((item, index) => {
          const config = typeConfig[item.type]
          const Icon = config.icon
          const isEven = index % 2 === 0

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row items-start ${
                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Icon */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${item.current ? config.bgColor : 'bg-background border-2 border-border'}
                `}>
                  <Icon className={`w-4 h-4 ${item.current ? 'text-white' : config.color}`} />
                </div>
              </div>

              {/* Content */}
              <div className={`
                ml-12 md:ml-0 md:w-[calc(50%-2rem)]
                ${isEven ? 'md:pr-8 md:text-right' : 'md:pl-8'}
              `}>
                <div className={`
                  p-4 rounded-xl border border-border bg-card
                  hover:border-primary/50 hover:shadow-lg transition-all
                  ${item.current ? 'border-primary/50 shadow-md' : ''}
                `}>
                  {/* Current badge */}
                  {item.current && (
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-2">
                      Sekarang
                    </span>
                  )}

                  {/* Title */}
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>

                  {/* Subtitle (Company/School) */}
                  {item.subtitle && (
                    <div className={`flex items-center gap-1 text-sm text-muted-foreground mb-2 ${
                      isEven ? 'md:justify-end' : ''
                    }`}>
                      <Building2 className="w-4 h-4" />
                      <span>{item.subtitle}</span>
                    </div>
                  )}

                  {/* Date */}
                  <div className={`flex items-center gap-1 text-sm text-muted-foreground mb-2 ${
                    isEven ? 'md:justify-end' : ''
                  }`}>
                    <Calendar className="w-4 h-4" />
                    <span>
                      {item.date}
                      {item.endDate && ` - ${item.endDate}`}
                      {item.current && !item.endDate && ' - Sekarang'}
                    </span>
                  </div>

                  {/* Location */}
                  {item.location && (
                    <div className={`flex items-center gap-1 text-sm text-muted-foreground mb-3 ${
                      isEven ? 'md:justify-end' : ''
                    }`}>
                      <MapPin className="w-4 h-4" />
                      <span>{item.location}</span>
                    </div>
                  )}

                  {/* Description */}
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.description}
                    </p>
                  )}

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className={`flex flex-wrap gap-1 ${isEven ? 'md:justify-end' : ''}`}>
                      {item.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs rounded-full bg-accent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Simple vertical timeline
export function VerticalTimeline({ items, className = '' }: TimelineProps) {
  return (
    <div className={`relative pl-8 ${className}`}>
      {/* Vertical line */}
      <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />

      <div className="space-y-6">
        {items.map((item, index) => {
          const config = typeConfig[item.type]
          const Icon = config.icon

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Dot */}
              <div className={`
                absolute -left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center
                ${item.current ? config.bgColor : 'bg-background border-2 border-border'}
              `}>
                <Icon className={`w-3 h-3 ${item.current ? 'text-white' : config.color}`} />
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{item.title}</h4>
                  {item.current && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                      Now
                    </span>
                  )}
                </div>
                {item.subtitle && (
                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {item.date}{item.endDate && ` - ${item.endDate}`}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

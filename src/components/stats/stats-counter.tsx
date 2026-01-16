'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Briefcase,
  Award,
  Code,
  Users,
  Coffee,
  FileText,
  TrendingUp,
  Globe
} from 'lucide-react'

interface Stat {
  label: string
  value: number
  suffix?: string
  prefix?: string
  icon: React.ElementType
  color: string
}

const STATS: Stat[] = [
  {
    label: 'Years Experience',
    value: 5,
    suffix: '+',
    icon: Briefcase,
    color: 'text-cyber-cyan'
  },
  {
    label: 'Projects Completed',
    value: 50,
    suffix: '+',
    icon: Code,
    color: 'text-cyber-purple'
  },
  {
    label: 'Certifications',
    value: 50,
    suffix: '+',
    icon: Award,
    color: 'text-cyber-green'
  },
  {
    label: 'Happy Clients',
    value: 30,
    suffix: '+',
    icon: Users,
    color: 'text-yellow-500'
  }
]

function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!startOnView || (isInView && !hasStarted)) {
      setHasStarted(true)
      let startTime: number
      let animationFrame: number

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        setCount(Math.floor(easeOutQuart * end))

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }

      animationFrame = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationFrame)
    }
  }, [end, duration, isInView, startOnView, hasStarted])

  return { count, ref }
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const { count, ref } = useCountUp(stat.value)
  const Icon = stat.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-2xl p-6 text-center group hover:scale-105 transition-transform duration-300"
    >
      <div className={cn(
        'w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center',
        'bg-muted group-hover:scale-110 transition-transform',
        stat.color
      )}>
        <Icon className="h-7 w-7" />
      </div>
      <div className="text-4xl font-bold mb-2">
        {stat.prefix}{count}{stat.suffix}
      </div>
      <div className="text-sm text-muted-foreground">{stat.label}</div>
    </motion.div>
  )
}

export function StatsCounter({ className }: { className?: string }) {
  return (
    <section className={cn('py-16', className)}>
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Inline version for embedding in other sections
export function StatsInline({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap justify-center gap-8 md:gap-12', className)}>
      {STATS.map((stat, index) => {
        const { count, ref } = useCountUp(stat.value)
        return (
          <motion.div
            key={stat.label}
            ref={ref}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className="text-3xl md:text-4xl font-bold gradient-text">
              {stat.prefix}{count}{stat.suffix}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
          </motion.div>
        )
      })}
    </div>
  )
}

// Compact stats for cards/sidebars
export function StatsCompact({ className }: { className?: string }) {
  const compactStats = [
    { icon: Briefcase, value: '5+', label: 'Years' },
    { icon: Code, value: '50+', label: 'Projects' },
    { icon: Award, value: '50+', label: 'Certs' },
  ]

  return (
    <div className={cn('flex gap-6', className)}>
      {compactStats.map((stat) => (
        <div key={stat.label} className="text-center">
          <stat.icon className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <div className="font-bold">{stat.value}</div>
          <div className="text-xs text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Calendar, Timer } from 'lucide-react'

interface SiteAgeCounterProps {
  launchDate: string // ISO date string
  className?: string
  variant?: 'compact' | 'detailed' | 'minimal'
}

interface TimeElapsed {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
  totalDays: number
}

function calculateTimeElapsed(launchDate: Date): TimeElapsed {
  const now = new Date()
  const diff = now.getTime() - launchDate.getTime()

  const totalSeconds = Math.floor(diff / 1000)
  const totalMinutes = Math.floor(totalSeconds / 60)
  const totalHours = Math.floor(totalMinutes / 60)
  const totalDays = Math.floor(totalHours / 24)

  const years = Math.floor(totalDays / 365)
  const months = Math.floor((totalDays % 365) / 30)
  const days = totalDays % 30
  const hours = totalHours % 24
  const minutes = totalMinutes % 60
  const seconds = totalSeconds % 60

  return { years, months, days, hours, minutes, seconds, totalDays }
}

export function SiteAgeCounter({
  launchDate,
  className = '',
  variant = 'compact'
}: SiteAgeCounterProps) {
  const [time, setTime] = useState<TimeElapsed | null>(null)
  const launch = new Date(launchDate)

  useEffect(() => {
    setTime(calculateTimeElapsed(launch))

    const interval = setInterval(() => {
      setTime(calculateTimeElapsed(launch))
    }, 1000)

    return () => clearInterval(interval)
  }, [launchDate])

  if (!time) return null

  if (variant === 'minimal') {
    return (
      <span className={`inline-flex items-center gap-1 text-sm text-muted-foreground ${className}`}>
        <Timer className="w-3 h-3" />
        {time.totalDays} days online
      </span>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className={`p-4 rounded-lg bg-card border border-border ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Site Online For</span>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <TimeUnit value={time.years} label="Years" />
          <TimeUnit value={time.months} label="Months" />
          <TimeUnit value={time.days} label="Days" />
          <TimeUnit value={time.hours} label="Hours" />
          <TimeUnit value={time.minutes} label="Minutes" />
          <TimeUnit value={time.seconds} label="Seconds" />
        </div>

        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Launched on {launch.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>
    )
  }

  // Compact variant
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <Clock className="w-4 h-4 text-primary" />
      <div className="flex items-center gap-1.5 font-mono text-sm">
        {time.years > 0 && (
          <span>{time.years}y</span>
        )}
        {time.months > 0 && (
          <span>{time.months}m</span>
        )}
        <span>{time.days}d</span>
        <span className="text-muted-foreground">
          {String(time.hours).padStart(2, '0')}:
          {String(time.minutes).padStart(2, '0')}:
          {String(time.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center p-2 bg-muted/50 rounded">
      <motion.div
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-xl font-bold tabular-nums"
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </div>
  )
}

// Lifetime visitor count
export function LifetimeVisitorCount({
  count,
  className = ''
}: {
  count: number
  className?: string
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground">Total visitors:</span>
      <motion.span
        key={count}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        className="font-bold"
      >
        {count.toLocaleString()}
      </motion.span>
    </div>
  )
}

// Countdown timer
export function CountdownTimer({
  targetDate,
  className = '',
  onComplete
}: {
  targetDate: string
  className?: string
  onComplete?: () => void
}) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const target = new Date(targetDate)

    const calculateTimeLeft = () => {
      const now = new Date()
      const diff = target.getTime() - now.getTime()

      if (diff <= 0) {
        setIsComplete(true)
        onComplete?.()
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      }
    }

    setTimeLeft(calculateTimeLeft())
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate, onComplete])

  if (isComplete) {
    return <span className={className}>🎉 Event Started!</span>
  }

  return (
    <div className={`flex items-center gap-2 font-mono ${className}`}>
      <span>{timeLeft.days}d</span>
      <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
      <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
      <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
    </div>
  )
}

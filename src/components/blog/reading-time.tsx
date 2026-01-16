'use client'

import { Clock } from 'lucide-react'
import { calculateReadingTime } from '@/lib/reading-time'

interface ReadingTimeProps {
  content: string
  showIcon?: boolean
  showWords?: boolean
  className?: string
}

export function ReadingTime({
  content,
  showIcon = true,
  showWords = false,
  className = ''
}: ReadingTimeProps) {
  const { text, words } = calculateReadingTime(content)

  return (
    <span className={`inline-flex items-center gap-1 text-sm text-muted-foreground ${className}`}>
      {showIcon && <Clock className="w-4 h-4" />}
      <span>{text}</span>
      {showWords && (
        <span className="text-xs">({words.toLocaleString()} kata)</span>
      )}
    </span>
  )
}

// Badge variant for cards
export function ReadingTimeBadge({ content }: { content: string }) {
  const { minutes } = calculateReadingTime(content)

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
      <Clock className="w-3 h-3" />
      {minutes} min
    </span>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

interface ReadingProgressProps {
  className?: string
  color?: string
  height?: number
  position?: 'top' | 'bottom'
  showPercentage?: boolean
  targetRef?: React.RefObject<HTMLElement>
}

export function ReadingProgress({
  className = '',
  color = 'bg-primary',
  height = 3,
  position = 'top',
  showPercentage = false,
  targetRef
}: ReadingProgressProps) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end']
  })

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <>
      <motion.div
        className={`fixed left-0 right-0 z-[45] origin-left pointer-events-none ${color} ${className}`}
        style={{
          scaleX,
          height,
          [position]: 0
        }}
      />
      {showPercentage && <PercentageDisplay progress={scrollYProgress} />}
    </>
  )
}

function PercentageDisplay({ progress }: { progress: any }) {
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    return progress.on('change', (v: number) => {
      setPercentage(Math.round(v * 100))
    })
  }, [progress])

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card/80 backdrop-blur px-3 py-1.5 rounded-full border border-border text-sm font-medium">
      {percentage}%
    </div>
  )
}

// Circle progress indicator
export function CircleReadingProgress({
  size = 48,
  strokeWidth = 3,
  className = ''
}: {
  size?: number
  strokeWidth?: number
  className?: string
}) {
  const { scrollYProgress } = useScroll()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      setProgress(v)
    })
  }, [scrollYProgress])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - progress * circumference

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-muted fill-none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-primary fill-none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset
          }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
        {Math.round(progress * 100)}%
      </span>
    </div>
  )
}

// Reading time left
export function ReadingTimeLeft({
  totalReadTime,
  className = ''
}: {
  totalReadTime: number // in minutes
  className?: string
}) {
  const { scrollYProgress } = useScroll()
  const [timeLeft, setTimeLeft] = useState(totalReadTime)

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      const remaining = Math.ceil(totalReadTime * (1 - v))
      setTimeLeft(Math.max(0, remaining))
    })
  }, [scrollYProgress, totalReadTime])

  if (timeLeft === 0) {
    return (
      <span className={`text-sm text-green-500 ${className}`}>
        ✓ Finished reading
      </span>
    )
  }

  return (
    <span className={`text-sm text-muted-foreground ${className}`}>
      {timeLeft} min left
    </span>
  )
}

// Scroll depth indicator
export function ScrollDepthIndicator({
  milestones = [25, 50, 75, 100],
  onMilestone
}: {
  milestones?: number[]
  onMilestone?: (percentage: number) => void
}) {
  const { scrollYProgress } = useScroll()
  const [reachedMilestones, setReachedMilestones] = useState<number[]>([])

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      const percentage = Math.round(v * 100)
      milestones.forEach(milestone => {
        if (percentage >= milestone && !reachedMilestones.includes(milestone)) {
          setReachedMilestones(prev => [...prev, milestone])
          onMilestone?.(milestone)
        }
      })
    })
  }, [scrollYProgress, milestones, reachedMilestones, onMilestone])

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
      {milestones.map(milestone => (
        <div
          key={milestone}
          className={`w-2 h-2 rounded-full transition-colors ${
            reachedMilestones.includes(milestone)
              ? 'bg-primary'
              : 'bg-muted'
          }`}
          title={`${milestone}%`}
        />
      ))}
    </div>
  )
}

'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface MarqueeProps {
  children: ReactNode
  speed?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  className?: string
  gap?: number
}

export function Marquee({
  children,
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
  className = '',
  gap = 48
}: MarqueeProps) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{
          gap,
          ...(pauseOnHover && { '--pause-on-hover': 'paused' } as any)
        }}
        whileHover={pauseOnHover ? { animationPlayState: 'paused' } : undefined}
      >
        {/* Duplicate content for seamless loop */}
        <div className="flex shrink-0" style={{ gap }}>
          {children}
        </div>
        <div className="flex shrink-0" style={{ gap }}>
          {children}
        </div>
      </motion.div>
    </div>
  )
}

// Text Marquee
export function TextMarquee({
  text,
  speed = 20,
  className = '',
  separator = ' • ',
  repeat = 4
}: {
  text: string
  speed?: number
  className?: string
  separator?: string
  repeat?: number
}) {
  const repeatedText = Array(repeat).fill(text).join(separator)

  return (
    <Marquee speed={speed} className={className}>
      <span className="text-4xl md:text-6xl font-bold opacity-20">
        {repeatedText}
      </span>
    </Marquee>
  )
}

// Logo/Icon Marquee
export function LogoMarquee({
  items,
  speed = 25,
  className = ''
}: {
  items: Array<{ icon: ReactNode; name: string }>
  speed?: number
  className?: string
}) {
  return (
    <Marquee speed={speed} className={className} gap={64}>
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="w-8 h-8">{item.icon}</span>
          <span className="text-lg font-medium">{item.name}</span>
        </div>
      ))}
    </Marquee>
  )
}

// Vertical Marquee
export function VerticalMarquee({
  children,
  speed = 20,
  direction = 'up',
  className = '',
  height = 300
}: {
  children: ReactNode
  speed?: number
  direction?: 'up' | 'down'
  className?: string
  height?: number
}) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        height,
        maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
      }}
    >
      <motion.div
        className="flex flex-col"
        animate={{
          y: direction === 'up' ? ['0%', '-50%'] : ['-50%', '0%']
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <div className="flex flex-col gap-4">
          {children}
        </div>
        <div className="flex flex-col gap-4 mt-4">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

// Tech Stack Marquee
export function TechStackMarquee({
  technologies,
  className = ''
}: {
  technologies: string[]
  className?: string
}) {
  return (
    <div className={`py-8 ${className}`}>
      <Marquee speed={30} gap={32}>
        {technologies.map((tech, i) => (
          <span
            key={i}
            className="px-6 py-3 bg-muted rounded-full text-sm font-medium whitespace-nowrap"
          >
            {tech}
          </span>
        ))}
      </Marquee>
    </div>
  )
}

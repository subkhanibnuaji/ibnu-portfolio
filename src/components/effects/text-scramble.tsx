'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface TextScrambleProps {
  text: string
  className?: string
  scrambleOnHover?: boolean
  autoStart?: boolean
  speed?: number
  characters?: string
}

const DEFAULT_CHARS = '!<>-_\\/[]{}—=+*^?#________'

export function TextScramble({
  text,
  className = '',
  scrambleOnHover = true,
  autoStart = false,
  speed = 50,
  characters = DEFAULT_CHARS
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isScrambling, setIsScrambling] = useState(false)
  const frameRef = useRef(0)
  const resolveRef = useRef<(() => void) | null>(null)

  const scramble = useCallback(() => {
    if (isScrambling) return

    setIsScrambling(true)
    let iteration = 0
    const originalText = text

    const interval = setInterval(() => {
      setDisplayText(
        originalText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < iteration) return originalText[index]
            return characters[Math.floor(Math.random() * characters.length)]
          })
          .join('')
      )

      if (iteration >= originalText.length) {
        clearInterval(interval)
        setIsScrambling(false)
        setDisplayText(originalText)
      }

      iteration += 1 / 3
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, characters, isScrambling])

  useEffect(() => {
    if (autoStart) {
      const timer = setTimeout(scramble, 500)
      return () => clearTimeout(timer)
    }
  }, [autoStart, scramble])

  useEffect(() => {
    setDisplayText(text)
  }, [text])

  return (
    <span
      className={`font-mono ${className}`}
      onMouseEnter={scrambleOnHover ? scramble : undefined}
      style={{ display: 'inline-block' }}
    >
      {displayText}
    </span>
  )
}

// Glitch text effect with CSS
export function GlitchText({
  text,
  className = '',
  intensity = 'medium'
}: {
  text: string
  className?: string
  intensity?: 'low' | 'medium' | 'high'
}) {
  const intensityClasses = {
    low: 'hover:animate-glitch-low',
    medium: 'hover:animate-glitch',
    high: 'hover:animate-glitch-high'
  }

  return (
    <span
      className={`relative inline-block ${className}`}
      data-text={text}
    >
      <span className={`relative z-10 ${intensityClasses[intensity]}`}>
        {text}
      </span>
      <span
        className="absolute top-0 left-0 -z-10 opacity-0 hover:opacity-80 text-cyan-500 animate-glitch-1"
        aria-hidden="true"
        style={{ clipPath: 'inset(40% 0 61% 0)' }}
      >
        {text}
      </span>
      <span
        className="absolute top-0 left-0 -z-10 opacity-0 hover:opacity-80 text-red-500 animate-glitch-2"
        aria-hidden="true"
        style={{ clipPath: 'inset(65% 0 14% 0)' }}
      >
        {text}
      </span>
    </span>
  )
}

// Cyberpunk style scramble
export function CyberpunkText({
  text,
  className = ''
}: {
  text: string
  className?: string
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [displayText, setDisplayText] = useState(text)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const glitchChars = '█▓▒░╔╗╚╝║═╬├┤┬┴┼'

  useEffect(() => {
    if (isHovered) {
      let frame = 0
      intervalRef.current = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' '
              if (Math.random() > 0.85) {
                return glitchChars[Math.floor(Math.random() * glitchChars.length)]
              }
              return char
            })
            .join('')
        )
        frame++
        if (frame > 10) {
          setDisplayText(text)
        }
      }, 50)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setDisplayText(text)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isHovered, text])

  return (
    <span
      className={`font-mono relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        textShadow: isHovered
          ? '2px 0 #ff0040, -2px 0 #00ffff'
          : 'none',
        transition: 'text-shadow 0.1s ease'
      }}
    >
      {displayText}
    </span>
  )
}

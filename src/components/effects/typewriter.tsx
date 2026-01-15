'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TypewriterProps {
  texts: string[]
  className?: string
  speed?: number
  deleteSpeed?: number
  delayBetween?: number
  cursor?: boolean
  cursorChar?: string
  loop?: boolean
  onComplete?: () => void
}

export function Typewriter({
  texts,
  className = '',
  speed = 100,
  deleteSpeed = 50,
  delayBetween = 2000,
  cursor = true,
  cursorChar = '|',
  loop = true,
  onComplete
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)

  useEffect(() => {
    const currentText = texts[textIndex]

    if (isWaiting) {
      const waitTimer = setTimeout(() => {
        setIsWaiting(false)
        setIsDeleting(true)
      }, delayBetween)
      return () => clearTimeout(waitTimer)
    }

    if (isDeleting) {
      if (displayText === '') {
        setIsDeleting(false)
        const nextIndex = (textIndex + 1) % texts.length
        if (nextIndex === 0 && !loop) {
          onComplete?.()
          return
        }
        setTextIndex(nextIndex)
      } else {
        const timer = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, deleteSpeed)
        return () => clearTimeout(timer)
      }
    } else {
      if (displayText === currentText) {
        setIsWaiting(true)
      } else {
        const timer = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        }, speed)
        return () => clearTimeout(timer)
      }
    }
  }, [displayText, textIndex, isDeleting, isWaiting, texts, speed, deleteSpeed, delayBetween, loop, onComplete])

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className="ml-0.5"
        >
          {cursorChar}
        </motion.span>
      )}
    </span>
  )
}

// Single text typewriter (type once)
export function TypeOnce({
  text,
  className = '',
  speed = 50,
  delay = 0,
  cursor = true,
  onComplete
}: {
  text: string
  className?: string
  speed?: number
  delay?: number
  cursor?: boolean
  onComplete?: () => void
}) {
  const [displayText, setDisplayText] = useState('')
  const [started, setStarted] = useState(false)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(startTimer)
  }, [delay])

  useEffect(() => {
    if (!started || completed) return

    if (displayText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1))
      }, speed)
      return () => clearTimeout(timer)
    } else {
      setCompleted(true)
      onComplete?.()
    }
  }, [displayText, text, speed, started, completed, onComplete])

  return (
    <span className={className}>
      {displayText}
      {cursor && !completed && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        >
          |
        </motion.span>
      )}
    </span>
  )
}

// Terminal style typewriter
export function TerminalTypewriter({
  lines,
  className = '',
  prompt = '$ ',
  speed = 30,
  lineDelay = 500
}: {
  lines: string[]
  className?: string
  prompt?: string
  speed?: number
  lineDelay?: number
}) {
  const [completedLines, setCompletedLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState('')
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => {
    if (lineIndex >= lines.length) return

    const targetLine = lines[lineIndex]

    if (currentLine.length < targetLine.length) {
      const timer = setTimeout(() => {
        setCurrentLine(targetLine.slice(0, currentLine.length + 1))
      }, speed)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setCompletedLines(prev => [...prev, currentLine])
        setCurrentLine('')
        setLineIndex(prev => prev + 1)
      }, lineDelay)
      return () => clearTimeout(timer)
    }
  }, [currentLine, lineIndex, lines, speed, lineDelay])

  return (
    <div className={`font-mono text-sm ${className}`}>
      {completedLines.map((line, i) => (
        <div key={i} className="text-green-400">
          <span className="text-gray-500">{prompt}</span>
          {line}
        </div>
      ))}
      {lineIndex < lines.length && (
        <div className="text-green-400">
          <span className="text-gray-500">{prompt}</span>
          {currentLine}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            className="bg-green-400 text-black px-0.5"
          >
            _
          </motion.span>
        </div>
      )}
    </div>
  )
}

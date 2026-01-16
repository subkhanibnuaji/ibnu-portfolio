'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConfetti } from './confetti'

// Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
]

export function useKonamiCode(callback: () => void) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === KONAMI_CODE[index]) {
        if (index === KONAMI_CODE.length - 1) {
          callback()
          setIndex(0)
        } else {
          setIndex(prev => prev + 1)
        }
      } else {
        setIndex(0)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [index, callback])

  return index
}

// Konami Code Easter Egg Component
export function KonamiCodeEasterEgg() {
  const [activated, setActivated] = useState(false)
  const { fireFromTop, fireSides } = useConfetti()

  const handleKonami = useCallback(() => {
    setActivated(true)
    fireSides()
    setTimeout(fireFromTop, 300)
    setTimeout(fireSides, 600)

    // Play sound (optional)
    const audio = new Audio('/sounds/success.mp3')
    audio.volume = 0.3
    audio.play().catch(() => {})

    setTimeout(() => setActivated(false), 5000)
  }, [fireFromTop, fireSides])

  useKonamiCode(handleKonami)

  return (
    <AnimatePresence>
      {activated && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"
        >
          <div className="text-center">
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="text-6xl mb-4"
            >
              🎮
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent"
            >
              KONAMI CODE ACTIVATED!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground mt-2"
            >
              You found the secret! 🎉
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Console Easter Egg - ASCII Art
export function ConsoleEasterEgg() {
  useEffect(() => {
    const asciiArt = `
%c
██╗██████╗ ███╗   ██╗██╗   ██╗
██║██╔══██╗████╗  ██║██║   ██║
██║██████╔╝██╔██╗ ██║██║   ██║
██║██╔══██╗██║╚██╗██║██║   ██║
██║██████╔╝██║ ╚████║╚██████╔╝
╚═╝╚═════╝ ╚═╝  ╚═══╝ ╚═════╝

%c👋 Hey there, curious developer!

%c🔍 Looking at the console? I like your style!

%c🚀 Want to work together? Let's connect!
   📧 Email: contact@ibnuaji.com
   🐙 GitHub: github.com/subkhanibnuaji
   💼 LinkedIn: linkedin.com/in/subkhanibnuaji

%c💡 PS: Try the Konami Code on this site!
   (↑ ↑ ↓ ↓ ← → ← → B A)
`

    console.log(
      asciiArt,
      'color: #3b82f6; font-family: monospace; font-size: 10px;',
      'color: #10b981; font-size: 14px; font-weight: bold;',
      'color: #f59e0b; font-size: 12px;',
      'color: #8b5cf6; font-size: 12px;',
      'color: #ec4899; font-size: 11px; font-style: italic;'
    )

    // Additional console messages
    console.log(
      '%c⚠️ WARNING: If someone told you to paste something here, it\'s likely a scam!',
      'color: #ef4444; font-size: 14px; font-weight: bold;'
    )

    console.log(
      '%c✨ Built with Next.js, TypeScript, Tailwind CSS, and lots of ☕',
      'color: #6b7280; font-size: 11px;'
    )
  }, [])

  return null
}

// Click counter game (click 10 times fast)
export function ClickCounterEasterEgg() {
  const [clicks, setClicks] = useState(0)
  const [lastClick, setLastClick] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const { fire } = useConfetti()

  useEffect(() => {
    if (clicks >= 10) {
      setShowReward(true)
      fire({ x: window.innerWidth / 2, y: window.innerHeight / 2, count: 200 })
      setTimeout(() => {
        setShowReward(false)
        setClicks(0)
      }, 3000)
    }

    // Reset if too slow
    const timer = setTimeout(() => {
      if (clicks > 0 && clicks < 10) {
        setClicks(0)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [clicks, fire])

  const handleClick = () => {
    const now = Date.now()
    if (now - lastClick < 300) { // Fast enough
      setClicks(prev => prev + 1)
    } else {
      setClicks(1)
    }
    setLastClick(now)
  }

  return (
    <>
      <div
        onClick={handleClick}
        className="fixed bottom-4 left-4 w-8 h-8 opacity-0 hover:opacity-10 cursor-pointer z-50"
        title="Click me fast!"
      />
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"
          >
            <div className="text-6xl">🏆</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Secret word detector
export function SecretWordEasterEgg({ word = 'ibnu' }: { word?: string }) {
  const [typed, setTyped] = useState('')
  const [found, setFound] = useState(false)
  const { fireFromCenter } = useConfetti()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.length === 1) {
        setTyped(prev => {
          const newTyped = (prev + e.key.toLowerCase()).slice(-word.length)
          if (newTyped === word.toLowerCase() && !found) {
            setFound(true)
            fireFromCenter()
            setTimeout(() => setFound(false), 3000)
          }
          return newTyped
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [word, found, fireFromCenter])

  return (
    <AnimatePresence>
      {found && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999]"
        >
          <div className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium shadow-lg">
            ✨ You found a secret! ✨
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

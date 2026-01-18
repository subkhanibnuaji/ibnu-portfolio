'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Konami code: ↑↑↓↓←→←→BA
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
]

// Matrix characters
const MATRIX_CHARS = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function EasterEggs() {
  const [konamiIndex, setKonamiIndex] = useState(0)
  const [matrixMode, setMatrixMode] = useState(false)
  const [discoMode, setDiscoMode] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [rainbowMode, setRainbowMode] = useState(false)
  const [gravityMode, setGravityMode] = useState(false)
  const [secretMessage, setSecretMessage] = useState<string | null>(null)
  const [clickCount, setClickCount] = useState(0)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastClickRef = useRef<number>(0)

  // Konami code detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.code

      if (key === KONAMI_CODE[konamiIndex]) {
        const newIndex = konamiIndex + 1

        if (newIndex === KONAMI_CODE.length) {
          // Konami code completed!
          activateKonamiEffect()
          setKonamiIndex(0)
        } else {
          setKonamiIndex(newIndex)
        }
      } else if (key === KONAMI_CODE[0]) {
        setKonamiIndex(1)
      } else {
        setKonamiIndex(0)
      }

      // Secret keyboard shortcuts
      if (e.ctrlKey && e.shiftKey) {
        switch (key) {
          case 'KeyM':
            toggleMatrixMode()
            break
          case 'KeyD':
            toggleDiscoMode()
            break
          case 'KeyR':
            toggleRainbowMode()
            break
          case 'KeyG':
            toggleGravityMode()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [konamiIndex])

  // Rapid click easter egg (click 7 times fast)
  useEffect(() => {
    const handleClick = () => {
      const now = Date.now()
      const timeSinceLastClick = now - lastClickRef.current
      lastClickRef.current = now

      if (timeSinceLastClick < 300) {
        setClickCount((prev) => {
          const newCount = prev + 1
          if (newCount >= 7) {
            triggerConfetti()
            return 0
          }
          return newCount
        })
      } else {
        setClickCount(1)
      }

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0)
      }, 1000)
    }

    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('click', handleClick)
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
    }
  }, [])

  // Listen for terminal commands
  useEffect(() => {
    const handleTerminalCommand = (e: CustomEvent) => {
      const command = e.detail?.command?.toLowerCase()

      switch (command) {
        case 'matrix':
          toggleMatrixMode()
          break
        case 'disco':
          toggleDiscoMode()
          break
        case 'rainbow':
          toggleRainbowMode()
          break
        case 'party':
          triggerConfetti()
          break
        case 'gravity':
          toggleGravityMode()
          break
        case 'secret':
          showSecret('You found the secret command! ')
          break
        case '42':
          showSecret('The answer to life, the universe, and everything!')
          break
        case 'hello':
          showSecret('Hello there, curious explorer!')
          break
      }
    }

    window.addEventListener('terminalCommand', handleTerminalCommand as EventListener)
    return () => window.removeEventListener('terminalCommand', handleTerminalCommand as EventListener)
  }, [])

  const activateKonamiEffect = useCallback(() => {
    // Trigger konami code event for achievements
    window.dispatchEvent(new CustomEvent('konamiCodeEntered'))
    window.dispatchEvent(new CustomEvent('easterEggFound'))

    // Show special message
    showSecret('KONAMI CODE ACTIVATED! You are a true gamer!')

    // Trigger confetti
    triggerConfetti()

    // Temporary matrix effect
    setMatrixMode(true)
    setTimeout(() => setMatrixMode(false), 5000)
  }, [])

  const toggleMatrixMode = useCallback(() => {
    setMatrixMode((prev) => {
      const newValue = !prev
      if (newValue) {
        window.dispatchEvent(new CustomEvent('matrixModeActivated'))
        window.dispatchEvent(new CustomEvent('easterEggFound'))
        showSecret('Welcome to the Matrix, Neo...')
      }
      return newValue
    })
  }, [])

  const toggleDiscoMode = useCallback(() => {
    setDiscoMode((prev) => {
      const newValue = !prev
      if (newValue) {
        window.dispatchEvent(new CustomEvent('easterEggFound'))
        showSecret('DISCO MODE ACTIVATED!')
      }
      return newValue
    })
  }, [])

  const toggleRainbowMode = useCallback(() => {
    setRainbowMode((prev) => {
      const newValue = !prev
      if (newValue) {
        window.dispatchEvent(new CustomEvent('easterEggFound'))
        showSecret('Rainbow mode activated!')
      }
      return newValue
    })
  }, [])

  const toggleGravityMode = useCallback(() => {
    setGravityMode((prev) => {
      const newValue = !prev
      if (newValue) {
        window.dispatchEvent(new CustomEvent('easterEggFound'))
        showSecret('Gravity reversed!')
        document.body.style.transform = 'rotate(180deg)'
        document.body.style.transition = 'transform 1s ease-in-out'
      } else {
        document.body.style.transform = ''
      }
      return newValue
    })
  }, [])

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true)
    window.dispatchEvent(new CustomEvent('easterEggFound'))
    setTimeout(() => setShowConfetti(false), 3000)
  }, [])

  const showSecret = useCallback((message: string) => {
    setSecretMessage(message)
    setTimeout(() => setSecretMessage(null), 4000)
  }, [])

  return (
    <>
      {/* Matrix Rain Effect */}
      <AnimatePresence>
        {matrixMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-none overflow-hidden bg-black/90"
          >
            <MatrixRain />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-green-500 text-4xl md:text-6xl font-mono font-bold text-center"
              >
                FOLLOW THE WHITE RABBIT
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disco Mode */}
      <AnimatePresence>
        {discoMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] pointer-events-none"
          >
            <div className="absolute inset-0 animate-disco-colors mix-blend-overlay" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rainbow Border */}
      {rainbowMode && (
        <div className="fixed inset-0 z-[98] pointer-events-none">
          <div className="absolute inset-0 border-4 border-transparent animate-rainbow-border" />
        </div>
      )}

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[101] pointer-events-none"
          >
            <Confetti />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secret Message Toast */}
      <AnimatePresence>
        {secretMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[102] px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white font-bold text-lg shadow-2xl"
          >
            {secretMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Easter Egg Hints (subtle) */}
      <style jsx global>{`
        @keyframes disco-colors {
          0% { background: rgba(255, 0, 0, 0.3); }
          14% { background: rgba(255, 127, 0, 0.3); }
          28% { background: rgba(255, 255, 0, 0.3); }
          42% { background: rgba(0, 255, 0, 0.3); }
          57% { background: rgba(0, 0, 255, 0.3); }
          71% { background: rgba(75, 0, 130, 0.3); }
          85% { background: rgba(148, 0, 211, 0.3); }
          100% { background: rgba(255, 0, 0, 0.3); }
        }

        .animate-disco-colors {
          animation: disco-colors 2s linear infinite;
        }

        @keyframes rainbow-border {
          0% { border-color: #ff0000; }
          14% { border-color: #ff7f00; }
          28% { border-color: #ffff00; }
          42% { border-color: #00ff00; }
          57% { border-color: #0000ff; }
          71% { border-color: #4b0082; }
          85% { border-color: #9400d3; }
          100% { border-color: #ff0000; }
        }

        .animate-rainbow-border {
          animation: rainbow-border 3s linear infinite;
        }
      `}</style>
    </>
  )
}

// Matrix Rain Component
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const fontSize = 16
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#0F0'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0" />
}

// Confetti Component
function Confetti() {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#88ff00']
  const pieces = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 8 + 4,
    rotation: Math.random() * 360,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -20, x: `${piece.x}vw`, rotate: piece.rotation, opacity: 1 }}
          animate={{
            y: '110vh',
            rotate: piece.rotation + 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 3,
            delay: piece.delay,
            ease: 'easeIn',
          }}
          style={{
            position: 'absolute',
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          }}
        />
      ))}
    </div>
  )
}

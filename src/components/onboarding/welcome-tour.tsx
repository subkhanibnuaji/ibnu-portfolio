'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Home,
  Brain,
  Gamepad2,
  Terminal,
  Command,
  MessageSquare,
  Rocket,
  PartyPopper,
  Play,
  SkipForward,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TourStep {
  id: string
  title: string
  description: string
  icon: React.ElementType
  color: string
  highlight?: string
  tip?: string
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to My Digital Universe!',
    description: 'This is not just a portfolio - it\'s a complete ecosystem with 70+ tools, AI features, games, and much more. Let me show you around!',
    icon: Sparkles,
    color: 'from-cyan-500 to-purple-500',
    tip: 'This tour only takes 30 seconds!',
  },
  {
    id: 'navigation',
    title: 'Smart Navigation',
    description: 'Press ⌘K (or Ctrl+K) anytime to open the Command Palette - your fastest way to navigate anywhere. You can also press "?" to see all keyboard shortcuts.',
    icon: Command,
    color: 'from-purple-500 to-pink-500',
    highlight: 'Try it now: Press ⌘K',
    tip: 'Power users love this feature!',
  },
  {
    id: 'terminal',
    title: 'Built-in Terminal',
    description: 'Press "T" to open a fully functional terminal emulator. Try commands like "help", "projects", "skills", or even "matrix" for a surprise!',
    icon: Terminal,
    color: 'from-green-500 to-emerald-500',
    highlight: 'Press T to try it!',
    tip: 'There are 20+ commands to explore',
  },
  {
    id: 'ai-tools',
    title: 'AI-Powered Tools',
    description: 'Explore 17+ AI tools including LLM Chat, RAG System, AI Agent, Object Detection, Style Transfer, Speech-to-Text, and more - all running in your browser!',
    icon: Brain,
    color: 'from-purple-500 to-indigo-500',
    highlight: 'Visit /ai-tools to explore',
    tip: 'Most AI features work offline!',
  },
  {
    id: 'games',
    title: 'Take a Break with Games',
    description: 'Feeling tired? Play Snake, Tetris, 2048, Sudoku, Minesweeper, and more! All classic games, beautifully redesigned.',
    icon: Gamepad2,
    color: 'from-green-500 to-teal-500',
    highlight: 'Visit /tools for all games',
    tip: 'Try to beat my high scores!',
  },
  {
    id: 'chatbot',
    title: 'AI Assistant',
    description: 'Click the chat bubble in the corner to talk with my AI assistant. Ask about my projects, skills, or anything else!',
    icon: MessageSquare,
    color: 'from-cyan-500 to-blue-500',
    highlight: 'Look for the chat icon',
    tip: 'The AI knows everything about me',
  },
  {
    id: 'explore',
    title: 'There\'s So Much More!',
    description: '70+ utility tools, blog with MDX, 50+ certifications, project showcases, and hidden Easter eggs waiting to be discovered. Scroll to the bottom of any page for a surprise!',
    icon: Rocket,
    color: 'from-amber-500 to-orange-500',
    highlight: 'Start exploring now!',
    tip: 'Try the Konami code: ↑↑↓↓←→←→BA',
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'You now know the essentials. Go explore and discover everything this portfolio has to offer. Don\'t forget to check out the Achievements system!',
    icon: PartyPopper,
    color: 'from-pink-500 to-rose-500',
    tip: 'You just earned your first achievement!',
  },
]

export function WelcomeTour() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [hasSeenTour, setHasSeenTour] = useState(true) // Start as true to avoid flash

  useEffect(() => {
    // Check if user has seen the tour
    const seen = localStorage.getItem('welcomeTourCompleted')
    if (!seen) {
      setHasSeenTour(false)
      // Show tour after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleNext = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleComplete()
    }
  }, [currentStep])

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  const handleComplete = useCallback(() => {
    setIsOpen(false)
    localStorage.setItem('welcomeTourCompleted', 'true')
    setHasSeenTour(true)

    // Trigger achievement for completing tour
    const event = new CustomEvent('achievementUnlocked', {
      detail: { id: 'tour_complete', title: 'Welcome Explorer', description: 'Completed the welcome tour' }
    })
    window.dispatchEvent(event)
  }, [])

  const handleSkip = useCallback(() => {
    setIsOpen(false)
    localStorage.setItem('welcomeTourCompleted', 'true')
    setHasSeenTour(true)
  }, [])

  const handleRestart = useCallback(() => {
    setCurrentStep(0)
    setIsOpen(true)
  }, [])

  const step = tourSteps[currentStep]
  const progress = ((currentStep + 1) / tourSteps.length) * 100

  if (hasSeenTour && !isOpen) return null

  return (
    <>
      {/* Trigger button for users who want to restart tour */}
      {hasSeenTour && !isOpen && (
        <button
          onClick={handleRestart}
          className="fixed bottom-24 left-4 z-40 p-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          title="Restart Tour"
        >
          <Play className="h-5 w-5" />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={handleSkip}
            />

            {/* Tour Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50"
            >
              <div className="relative overflow-hidden rounded-3xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl">
                {/* Progress bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
                  <motion.div
                    className={cn('h-full bg-gradient-to-r', step.color)}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Glow effect */}
                <div className={cn(
                  'absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30',
                  `bg-gradient-to-r ${step.color}`
                )} />

                {/* Content */}
                <div className="relative p-6 md:p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <motion.div
                      key={step.id}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className={cn(
                        'p-3 rounded-2xl bg-gradient-to-br shadow-lg',
                        step.color
                      )}
                    >
                      <step.icon className="h-8 w-8 text-white" />
                    </motion.div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {currentStep + 1} / {tourSteps.length}
                      </span>
                      <button
                        onClick={handleSkip}
                        className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <motion.div
                    key={`content-${step.id}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="text-xl md:text-2xl font-bold mb-3">
                      <span className={cn(
                        'bg-clip-text text-transparent bg-gradient-to-r',
                        step.color
                      )}>
                        {step.title}
                      </span>
                    </h2>

                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Highlight box */}
                    {step.highlight && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={cn(
                          'p-3 rounded-xl bg-gradient-to-r/10 border border-primary/20 mb-4',
                          `bg-gradient-to-r ${step.color} bg-opacity-10`
                        )}
                      >
                        <p className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          {step.highlight}
                        </p>
                      </motion.div>
                    )}

                    {/* Tip */}
                    {step.tip && (
                      <p className="text-xs text-muted-foreground italic">
                        💡 {step.tip}
                      </p>
                    )}
                  </motion.div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                    <button
                      onClick={handleSkip}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <SkipForward className="h-4 w-4" />
                      Skip tour
                    </button>

                    <div className="flex items-center gap-2">
                      {currentStep > 0 && (
                        <button
                          onClick={handlePrev}
                          className="flex items-center gap-1 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Back
                        </button>
                      )}

                      <button
                        onClick={handleNext}
                        className={cn(
                          'flex items-center gap-1 px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg transition-all hover:-translate-y-0.5',
                          `bg-gradient-to-r ${step.color}`
                        )}
                      >
                        {currentStep < tourSteps.length - 1 ? (
                          <>
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Let's Go!
                            <Rocket className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Step indicators */}
                  <div className="flex items-center justify-center gap-1.5 mt-4">
                    {tourSteps.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentStep(idx)}
                        className={cn(
                          'w-2 h-2 rounded-full transition-all',
                          idx === currentStep
                            ? `bg-gradient-to-r ${step.color} w-6`
                            : idx < currentStep
                            ? 'bg-primary/50'
                            : 'bg-muted-foreground/30'
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

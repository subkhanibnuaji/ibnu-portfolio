'use client'

import { useEffect, useState, useRef, useCallback, createContext, useContext } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ChevronUp, ChevronDown, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// SCROLL CONTEXT
// ============================================
interface ScrollContextValue {
  activeSection: string
  sections: string[]
  scrollToSection: (id: string) => void
  registerSection: (id: string) => void
  unregisterSection: (id: string) => void
}

const ScrollContext = createContext<ScrollContextValue | null>(null)

export function useScrollContext() {
  const context = useContext(ScrollContext)
  if (!context) {
    throw new Error('useScrollContext must be used within ScrollProvider')
  }
  return context
}

// ============================================
// SCROLL PROVIDER
// ============================================
export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<string[]>([])
  const [activeSection, setActiveSection] = useState('')

  const registerSection = useCallback((id: string) => {
    setSections(prev => prev.includes(id) ? prev : [...prev, id])
  }, [])

  const unregisterSection = useCallback((id: string) => {
    setSections(prev => prev.filter(s => s !== id))
  }, [])

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  // Track active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const { top, bottom } = element.getBoundingClientRect()
          const absoluteTop = top + window.scrollY
          const absoluteBottom = bottom + window.scrollY

          if (scrollPosition >= absoluteTop && scrollPosition < absoluteBottom) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  return (
    <ScrollContext.Provider value={{ activeSection, sections, scrollToSection, registerSection, unregisterSection }}>
      {children}
    </ScrollContext.Provider>
  )
}

// ============================================
// SCROLL SECTION
// ============================================
interface ScrollSectionProps {
  id: string
  children: React.ReactNode
  className?: string
  parallax?: boolean
  parallaxSpeed?: number
}

export function ScrollSection({
  id,
  children,
  className,
  parallax = false,
  parallaxSpeed = 0.5,
}: ScrollSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [100 * parallaxSpeed, -100 * parallaxSpeed])

  const context = useContext(ScrollContext)

  useEffect(() => {
    context?.registerSection(id)
    return () => context?.unregisterSection(id)
  }, [id, context])

  return (
    <section ref={ref} id={id} className={cn('relative', className)}>
      {parallax ? (
        <motion.div style={{ y }}>
          {children}
        </motion.div>
      ) : (
        children
      )}
    </section>
  )
}

// ============================================
// SECTION INDICATOR
// ============================================
interface SectionIndicatorProps {
  className?: string
  showLabels?: boolean
  labels?: Record<string, string>
}

export function SectionIndicator({
  className,
  showLabels = false,
  labels = {},
}: SectionIndicatorProps) {
  const { activeSection, sections, scrollToSection } = useScrollContext()

  if (sections.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-3',
        className
      )}
    >
      {sections.map((section, index) => {
        const isActive = activeSection === section
        const label = labels[section] || section

        return (
          <button
            key={section}
            onClick={() => scrollToSection(section)}
            className="group flex items-center gap-2"
            aria-label={`Scroll to ${label}`}
          >
            {showLabels && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors"
              >
                {label}
              </motion.span>
            )}
            <motion.div
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                isActive
                  ? 'bg-primary scale-150'
                  : 'bg-muted-foreground/30 group-hover:bg-muted-foreground'
              )}
              whileHover={{ scale: 1.5 }}
            />
          </button>
        )
      })}
    </motion.div>
  )
}

// ============================================
// SCROLL ARROWS
// ============================================
export function ScrollArrows({ className }: { className?: string }) {
  const { activeSection, sections, scrollToSection } = useScrollContext()
  const currentIndex = sections.indexOf(activeSection)

  const scrollUp = useCallback(() => {
    if (currentIndex > 0) {
      scrollToSection(sections[currentIndex - 1])
    }
  }, [currentIndex, sections, scrollToSection])

  const scrollDown = useCallback(() => {
    if (currentIndex < sections.length - 1) {
      scrollToSection(sections[currentIndex + 1])
    }
  }, [currentIndex, sections, scrollToSection])

  if (sections.length <= 1) return null

  return (
    <div className={cn('fixed right-6 bottom-6 z-50 flex flex-col gap-2', className)}>
      <motion.button
        onClick={scrollUp}
        disabled={currentIndex <= 0}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 transition-all',
          currentIndex <= 0
            ? 'opacity-30 cursor-not-allowed'
            : 'hover:border-primary/50'
        )}
        aria-label="Scroll to previous section"
      >
        <ChevronUp className="h-4 w-4" />
      </motion.button>
      <motion.button
        onClick={scrollDown}
        disabled={currentIndex >= sections.length - 1}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 transition-all',
          currentIndex >= sections.length - 1
            ? 'opacity-30 cursor-not-allowed'
            : 'hover:border-primary/50'
        )}
        aria-label="Scroll to next section"
      >
        <ChevronDown className="h-4 w-4" />
      </motion.button>
    </div>
  )
}

// ============================================
// SCROLL PROGRESS LINE
// ============================================
export function ScrollProgressLine({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className={cn(
        'fixed left-0 top-0 bottom-0 w-1 bg-muted/20 z-50',
        className
      )}
    >
      <motion.div
        className="w-full bg-gradient-to-b from-primary to-purple-500 origin-top"
        style={{ scaleY: scrollYProgress }}
      />
    </motion.div>
  )
}

// ============================================
// SNAP SCROLL CONTAINER
// ============================================
interface SnapScrollContainerProps {
  children: React.ReactNode
  className?: string
}

export function SnapScrollContainer({ children, className }: SnapScrollContainerProps) {
  return (
    <div className={cn('snap-y snap-mandatory h-screen overflow-y-scroll', className)}>
      {children}
    </div>
  )
}

export function SnapScrollSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('snap-start snap-always min-h-screen', className)}>
      {children}
    </div>
  )
}

// ============================================
// SCROLL FADE
// ============================================
interface ScrollFadeProps {
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'down' | 'both'
}

export function ScrollFade({ children, className, direction = 'both' }: ScrollFadeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(
    scrollYProgress,
    direction === 'up' ? [0, 0.3, 1] :
    direction === 'down' ? [0, 0.7, 1] :
    [0, 0.2, 0.8, 1],
    direction === 'up' ? [0, 1, 1] :
    direction === 'down' ? [1, 1, 0] :
    [0, 1, 1, 0]
  )

  return (
    <motion.div ref={ref} style={{ opacity }} className={className}>
      {children}
    </motion.div>
  )
}

// ============================================
// SCROLL ZOOM
// ============================================
interface ScrollZoomProps {
  children: React.ReactNode
  className?: string
  zoomIn?: boolean
}

export function ScrollZoom({ children, className, zoomIn = true }: ScrollZoomProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    zoomIn ? [0.8, 1] : [1.2, 1]
  )

  return (
    <motion.div ref={ref} style={{ scale }} className={className}>
      {children}
    </motion.div>
  )
}

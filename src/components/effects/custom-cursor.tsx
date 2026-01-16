'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(true) // Default to true to prevent flash
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Mark as mounted
    setIsMounted(true)

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  useEffect(() => {
    if (!isMounted || isMobile) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0
    let animationId: number

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`
        dotRef.current.style.top = `${mouseY}px`
      }
    }

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15

      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`
        ringRef.current.style.top = `${ringY}px`
      }

      animationId = requestAnimationFrame(animateRing)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    // Hover detection
    const addHoverListeners = () => {
      const elements = document.querySelectorAll('a, button, [role="button"], input, textarea, .interactive')
      elements.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true))
        el.addEventListener('mouseleave', () => setIsHovering(false))
      })
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    animateRing()
    addHoverListeners()

    // Re-add hover listeners when DOM changes
    const observer = new MutationObserver(addHoverListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      observer.disconnect()
    }
  }, [isMounted, isMobile])

  // Don't render anything during SSR or on mobile
  if (!isMounted || isMobile) return null

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className={cn(
          'fixed top-0 left-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2',
          'bg-cyber-cyan rounded-full pointer-events-none z-[9999]',
          'transition-transform duration-100',
          isHovering && 'scale-0',
          !isVisible && 'opacity-0'
        )}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        className={cn(
          'fixed top-0 left-0 w-10 h-10 -translate-x-1/2 -translate-y-1/2',
          'border-2 border-cyber-cyan/50 rounded-full pointer-events-none z-[9998]',
          'transition-all duration-200',
          isHovering && 'w-16 h-16 border-cyber-cyan bg-cyber-cyan/10',
          !isVisible && 'opacity-0'
        )}
      />
    </>
  )
}

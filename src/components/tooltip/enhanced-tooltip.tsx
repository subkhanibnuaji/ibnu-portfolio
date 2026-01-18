'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { createPortal } from 'react-dom'

// ============================================
// TYPES
// ============================================
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'
type TooltipVariant = 'default' | 'info' | 'success' | 'warning' | 'error'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  position?: TooltipPosition
  variant?: TooltipVariant
  delay?: number
  className?: string
  arrow?: boolean
  interactive?: boolean
  maxWidth?: number
}

// ============================================
// ENHANCED TOOLTIP
// ============================================
export function Tooltip({
  content,
  children,
  position = 'top',
  variant = 'default',
  delay = 200,
  className,
  arrow = true,
  interactive = false,
  maxWidth = 250,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setMounted(true)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const scrollX = window.scrollX
    const scrollY = window.scrollY

    let x = 0
    let y = 0

    switch (position) {
      case 'top':
        x = rect.left + rect.width / 2 + scrollX
        y = rect.top + scrollY - 8
        break
      case 'bottom':
        x = rect.left + rect.width / 2 + scrollX
        y = rect.bottom + scrollY + 8
        break
      case 'left':
        x = rect.left + scrollX - 8
        y = rect.top + rect.height / 2 + scrollY
        break
      case 'right':
        x = rect.right + scrollX + 8
        y = rect.top + rect.height / 2 + scrollY
        break
    }

    setCoords({ x, y })
  }, [position])

  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      calculatePosition()
      setIsVisible(true)
    }, delay)
  }, [delay, calculatePosition])

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (!interactive) {
      setIsVisible(false)
    } else {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false)
      }, 100)
    }
  }, [interactive])

  const handleTooltipEnter = useCallback(() => {
    if (interactive && timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [interactive])

  const handleTooltipLeave = useCallback(() => {
    if (interactive) {
      setIsVisible(false)
    }
  }, [interactive])

  const variantStyles = {
    default: 'bg-card/95 border-border/50 text-foreground',
    info: 'bg-blue-500/95 border-blue-400/50 text-white',
    success: 'bg-green-500/95 border-green-400/50 text-white',
    warning: 'bg-amber-500/95 border-amber-400/50 text-white',
    error: 'bg-red-500/95 border-red-400/50 text-white',
  }

  const arrowStyles = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
    left: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rotate-45',
    right: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
  }

  const transformOrigin = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  }

  const getTransformStyle = () => {
    switch (position) {
      case 'top':
        return { transform: 'translateX(-50%) translateY(-100%)' }
      case 'bottom':
        return { transform: 'translateX(-50%)' }
      case 'left':
        return { transform: 'translateX(-100%) translateY(-50%)' }
      case 'right':
        return { transform: 'translateY(-50%)' }
    }
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className="inline-block"
      >
        {children}
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isVisible && (
              <motion.div
                ref={tooltipRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                onMouseEnter={handleTooltipEnter}
                onMouseLeave={handleTooltipLeave}
                className={cn(
                  'fixed z-[300] px-3 py-2 text-sm rounded-lg border backdrop-blur-sm shadow-lg pointer-events-none',
                  interactive && 'pointer-events-auto',
                  variantStyles[variant],
                  className
                )}
                style={{
                  left: coords.x,
                  top: coords.y,
                  maxWidth,
                  transformOrigin: transformOrigin[position],
                  ...getTransformStyle(),
                }}
              >
                {content}
                {arrow && (
                  <div
                    className={cn(
                      'absolute w-2 h-2 border-r border-b',
                      arrowStyles[position],
                      variant === 'default'
                        ? 'bg-card border-border/50'
                        : variantStyles[variant].split(' ')[0].replace('/95', '')
                    )}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}

// ============================================
// RICH TOOLTIP (with title, content, actions)
// ============================================
interface RichTooltipProps {
  title?: string
  content: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
  position?: TooltipPosition
  className?: string
}

export function RichTooltip({
  title,
  content,
  actions,
  children,
  position = 'top',
  className,
}: RichTooltipProps) {
  return (
    <Tooltip
      position={position}
      interactive={!!actions}
      maxWidth={300}
      className={className}
      content={
        <div className="space-y-2">
          {title && <div className="font-semibold">{title}</div>}
          <div className="text-sm text-muted-foreground">{content}</div>
          {actions && (
            <div className="flex gap-2 pt-2 border-t border-border/50">
              {actions}
            </div>
          )}
        </div>
      }
    >
      {children}
    </Tooltip>
  )
}

// ============================================
// KEYBOARD SHORTCUT TOOLTIP
// ============================================
interface ShortcutTooltipProps {
  label: string
  shortcut: string | string[]
  children: React.ReactNode
  position?: TooltipPosition
}

export function ShortcutTooltip({
  label,
  shortcut,
  children,
  position = 'top',
}: ShortcutTooltipProps) {
  const shortcuts = Array.isArray(shortcut) ? shortcut : [shortcut]

  return (
    <Tooltip
      position={position}
      content={
        <div className="flex items-center gap-2">
          <span>{label}</span>
          <div className="flex items-center gap-0.5">
            {shortcuts.map((key, i) => (
              <kbd
                key={i}
                className="px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded"
              >
                {key}
              </kbd>
            ))}
          </div>
        </div>
      }
    >
      {children}
    </Tooltip>
  )
}

// ============================================
// PREVIEW TOOLTIP (with image)
// ============================================
interface PreviewTooltipProps {
  imageSrc: string
  title?: string
  description?: string
  children: React.ReactNode
  position?: TooltipPosition
}

export function PreviewTooltip({
  imageSrc,
  title,
  description,
  children,
  position = 'right',
}: PreviewTooltipProps) {
  return (
    <Tooltip
      position={position}
      maxWidth={320}
      content={
        <div className="space-y-2 -m-3">
          <img
            src={imageSrc}
            alt={title || ''}
            className="w-full h-40 object-cover rounded-t-lg"
          />
          <div className="p-3 pt-0">
            {title && <div className="font-semibold">{title}</div>}
            {description && (
              <div className="text-sm text-muted-foreground">{description}</div>
            )}
          </div>
        </div>
      }
    >
      {children}
    </Tooltip>
  )
}

// ============================================
// STATUS TOOLTIP
// ============================================
interface StatusTooltipProps {
  status: 'online' | 'offline' | 'busy' | 'away'
  customMessage?: string
  children: React.ReactNode
  position?: TooltipPosition
}

export function StatusTooltip({
  status,
  customMessage,
  children,
  position = 'top',
}: StatusTooltipProps) {
  const statusConfig = {
    online: { color: 'bg-green-500', label: 'Online' },
    offline: { color: 'bg-gray-500', label: 'Offline' },
    busy: { color: 'bg-red-500', label: 'Busy' },
    away: { color: 'bg-amber-500', label: 'Away' },
  }

  const config = statusConfig[status]

  return (
    <Tooltip
      position={position}
      content={
        <div className="flex items-center gap-2">
          <span className={cn('w-2 h-2 rounded-full', config.color)} />
          <span>{customMessage || config.label}</span>
        </div>
      }
    >
      {children}
    </Tooltip>
  )
}

// ============================================
// COPY TOOLTIP
// ============================================
interface CopyTooltipProps {
  text: string
  children: React.ReactNode
  position?: TooltipPosition
}

export function CopyTooltip({ text, children, position = 'top' }: CopyTooltipProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  return (
    <Tooltip
      position={position}
      content={copied ? '✓ Copied!' : 'Click to copy'}
      variant={copied ? 'success' : 'default'}
    >
      <span onClick={handleCopy} className="cursor-pointer">
        {children}
      </span>
    </Tooltip>
  )
}

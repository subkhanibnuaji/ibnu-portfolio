'use client'

import { useEffect, useRef } from 'react'

interface AnimatedFaviconProps {
  frames: string[] // Array of emoji or SVG data URLs
  interval?: number // Animation interval in ms
  enabled?: boolean
}

// Emoji-based animated favicon
export function AnimatedFavicon({
  frames = ['💻', '⚡', '🚀', '✨'],
  interval = 500,
  enabled = true
}: AnimatedFaviconProps) {
  const frameIndex = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Create canvas for rendering emoji
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    canvasRef.current = canvas

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateFavicon = () => {
      const emoji = frames[frameIndex.current]
      ctx.clearRect(0, 0, 64, 64)
      ctx.font = '56px serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(emoji, 32, 36)

      // Update favicon
      const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
        || document.createElement('link')
      link.type = 'image/x-icon'
      link.rel = 'icon'
      link.href = canvas.toDataURL()

      if (!document.querySelector('link[rel="icon"]')) {
        document.head.appendChild(link)
      }

      frameIndex.current = (frameIndex.current + 1) % frames.length
    }

    updateFavicon()
    const timer = setInterval(updateFavicon, interval)

    return () => {
      clearInterval(timer)
      // Reset to default favicon
      const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
      if (link) {
        link.href = '/favicon.ico'
      }
    }
  }, [frames, interval, enabled])

  return null
}

// Progress favicon (shows loading/progress)
export function ProgressFavicon({
  progress, // 0-100
  color = '#3b82f6',
  backgroundColor = '#e5e7eb'
}: {
  progress: number
  color?: string
  backgroundColor?: string
}) {
  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Background circle
    ctx.beginPath()
    ctx.arc(32, 32, 28, 0, Math.PI * 2)
    ctx.fillStyle = backgroundColor
    ctx.fill()

    // Progress arc
    const angle = (progress / 100) * Math.PI * 2 - Math.PI / 2
    ctx.beginPath()
    ctx.moveTo(32, 32)
    ctx.arc(32, 32, 28, -Math.PI / 2, angle)
    ctx.fillStyle = color
    ctx.fill()

    // Center circle (donut style)
    ctx.beginPath()
    ctx.arc(32, 32, 18, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()

    // Percentage text
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 20px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${Math.round(progress)}`, 32, 34)

    // Update favicon
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
      || document.createElement('link')
    link.type = 'image/png'
    link.rel = 'icon'
    link.href = canvas.toDataURL()

    if (!document.querySelector('link[rel="icon"]')) {
      document.head.appendChild(link)
    }
  }, [progress, color, backgroundColor])

  return null
}

// Notification badge favicon
export function NotificationFavicon({
  count,
  maxCount = 99
}: {
  count: number
  maxCount?: number
}) {
  useEffect(() => {
    if (count <= 0) {
      // Reset to default favicon
      const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
      if (link) link.href = '/favicon.ico'
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Load original favicon
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 64, 64)

      // Draw badge
      const displayCount = count > maxCount ? `${maxCount}+` : count.toString()
      const badgeSize = displayCount.length > 1 ? 32 : 24

      // Badge background
      ctx.beginPath()
      ctx.arc(64 - badgeSize / 2, badgeSize / 2, badgeSize / 2, 0, Math.PI * 2)
      ctx.fillStyle = '#ef4444'
      ctx.fill()

      // Badge text
      ctx.fillStyle = '#ffffff'
      ctx.font = `bold ${badgeSize * 0.6}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(displayCount, 64 - badgeSize / 2, badgeSize / 2 + 1)

      // Update favicon
      const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
        || document.createElement('link')
      link.type = 'image/png'
      link.rel = 'icon'
      link.href = canvas.toDataURL()

      if (!document.querySelector('link[rel="icon"]')) {
        document.head.appendChild(link)
      }
    }
    img.src = '/favicon.ico'
  }, [count, maxCount])

  return null
}

// Status favicon (online/offline/busy)
export function StatusFavicon({
  status
}: {
  status: 'online' | 'offline' | 'busy' | 'away'
}) {
  useEffect(() => {
    const statusColors = {
      online: '#22c55e',
      offline: '#6b7280',
      busy: '#ef4444',
      away: '#f59e0b'
    }

    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Load original favicon
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 64, 64)

      // Draw status dot
      ctx.beginPath()
      ctx.arc(54, 54, 10, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.fill()

      ctx.beginPath()
      ctx.arc(54, 54, 8, 0, Math.PI * 2)
      ctx.fillStyle = statusColors[status]
      ctx.fill()

      // Update favicon
      const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
        || document.createElement('link')
      link.type = 'image/png'
      link.rel = 'icon'
      link.href = canvas.toDataURL()

      if (!document.querySelector('link[rel="icon"]')) {
        document.head.appendChild(link)
      }
    }
    img.src = '/favicon.ico'
  }, [status])

  return null
}

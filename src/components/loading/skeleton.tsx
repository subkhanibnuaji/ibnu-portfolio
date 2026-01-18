'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

// ============================================
// BASE SKELETON
// ============================================
interface SkeletonProps {
  className?: string
  variant?: 'default' | 'shimmer' | 'pulse' | 'wave'
  style?: React.CSSProperties
}

export function Skeleton({ className, variant = 'shimmer', style }: SkeletonProps) {
  const baseClasses = 'bg-muted rounded'

  const variantClasses = {
    default: '',
    shimmer: 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
    pulse: 'animate-pulse',
    wave: 'relative overflow-hidden',
  }

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)} style={style}>
      {variant === 'wave' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </div>
  )
}

// ============================================
// TEXT SKELETON
// ============================================
interface TextSkeletonProps {
  lines?: number
  className?: string
  variant?: SkeletonProps['variant']
}

export function TextSkeleton({ lines = 3, className, variant }: TextSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant={variant}
          className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  )
}

// ============================================
// AVATAR SKELETON
// ============================================
interface AvatarSkeletonProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  variant?: SkeletonProps['variant']
}

export function AvatarSkeleton({ size = 'md', className, variant }: AvatarSkeletonProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }

  return (
    <Skeleton
      variant={variant}
      className={cn('rounded-full', sizes[size], className)}
    />
  )
}

// ============================================
// CARD SKELETON
// ============================================
interface CardSkeletonProps {
  className?: string
  variant?: SkeletonProps['variant']
  showImage?: boolean
  showAvatar?: boolean
}

export function CardSkeleton({
  className,
  variant,
  showImage = true,
  showAvatar = false,
}: CardSkeletonProps) {
  return (
    <div className={cn('rounded-xl border border-border/50 overflow-hidden', className)}>
      {showImage && <Skeleton variant={variant} className="h-48 w-full rounded-none" />}
      <div className="p-4 space-y-4">
        {showAvatar && (
          <div className="flex items-center gap-3">
            <AvatarSkeleton size="sm" variant={variant} />
            <div className="space-y-1.5 flex-1">
              <Skeleton variant={variant} className="h-3 w-24" />
              <Skeleton variant={variant} className="h-2 w-16" />
            </div>
          </div>
        )}
        <Skeleton variant={variant} className="h-6 w-3/4" />
        <TextSkeleton lines={2} variant={variant} />
        <div className="flex gap-2">
          <Skeleton variant={variant} className="h-6 w-16 rounded-full" />
          <Skeleton variant={variant} className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// ============================================
// TABLE SKELETON
// ============================================
interface TableSkeletonProps {
  rows?: number
  columns?: number
  className?: string
  variant?: SkeletonProps['variant']
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
  variant,
}: TableSkeletonProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex gap-4 p-4 border-b border-border/50">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            variant={variant}
            className="h-4 flex-1"
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4 border-b border-border/30">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant={variant}
              className="h-4 flex-1"
              style={{ width: `${60 + Math.random() * 40}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// ============================================
// LIST SKELETON
// ============================================
interface ListSkeletonProps {
  items?: number
  className?: string
  variant?: SkeletonProps['variant']
  showIcon?: boolean
}

export function ListSkeleton({
  items = 5,
  className,
  variant,
  showIcon = true,
}: ListSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
          {showIcon && <Skeleton variant={variant} className="w-10 h-10 rounded-lg flex-shrink-0" />}
          <div className="flex-1 space-y-2">
            <Skeleton variant={variant} className="h-4 w-3/4" />
            <Skeleton variant={variant} className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// GRID SKELETON
// ============================================
interface GridSkeletonProps {
  items?: number
  columns?: number
  className?: string
  variant?: SkeletonProps['variant']
}

export function GridSkeleton({
  items = 6,
  columns = 3,
  className,
  variant,
}: GridSkeletonProps) {
  return (
    <div
      className={cn('grid gap-4', className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} variant={variant} />
      ))}
    </div>
  )
}

// ============================================
// PAGE SKELETON
// ============================================
export function PageSkeleton({ variant }: { variant?: SkeletonProps['variant'] }) {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Skeleton variant={variant} className="h-10 w-64" />
        <Skeleton variant={variant} className="h-4 w-96" />
      </div>

      {/* Hero Card */}
      <div className="flex gap-8">
        <Skeleton variant={variant} className="w-48 h-48 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-4">
          <Skeleton variant={variant} className="h-8 w-3/4" />
          <TextSkeleton lines={4} variant={variant} />
          <div className="flex gap-3">
            <Skeleton variant={variant} className="h-10 w-32 rounded-lg" />
            <Skeleton variant={variant} className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <GridSkeleton items={6} columns={3} variant={variant} />
    </div>
  )
}

// ============================================
// PROFILE SKELETON
// ============================================
export function ProfileSkeleton({ variant }: { variant?: SkeletonProps['variant'] }) {
  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <AvatarSkeleton size="xl" variant={variant} />
      <Skeleton variant={variant} className="h-6 w-32" />
      <Skeleton variant={variant} className="h-4 w-48" />
      <div className="flex gap-2">
        <Skeleton variant={variant} className="h-8 w-24 rounded-full" />
        <Skeleton variant={variant} className="h-8 w-24 rounded-full" />
      </div>
    </div>
  )
}

// ============================================
// CHAT SKELETON
// ============================================
export function ChatSkeleton({ variant }: { variant?: SkeletonProps['variant'] }) {
  return (
    <div className="space-y-4 p-4">
      {/* Message from other */}
      <div className="flex gap-3">
        <AvatarSkeleton size="sm" variant={variant} />
        <div className="space-y-1">
          <Skeleton variant={variant} className="h-3 w-16" />
          <Skeleton variant={variant} className="h-16 w-48 rounded-2xl rounded-tl-none" />
        </div>
      </div>
      {/* Message from self */}
      <div className="flex gap-3 justify-end">
        <div className="space-y-1 text-right">
          <Skeleton variant={variant} className="h-3 w-16 ml-auto" />
          <Skeleton variant={variant} className="h-12 w-36 rounded-2xl rounded-tr-none" />
        </div>
      </div>
      {/* Message from other */}
      <div className="flex gap-3">
        <AvatarSkeleton size="sm" variant={variant} />
        <div className="space-y-1">
          <Skeleton variant={variant} className="h-3 w-16" />
          <Skeleton variant={variant} className="h-20 w-56 rounded-2xl rounded-tl-none" />
        </div>
      </div>
    </div>
  )
}

// Add shimmer animation to globals.css
export const skeletonStyles = `
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`

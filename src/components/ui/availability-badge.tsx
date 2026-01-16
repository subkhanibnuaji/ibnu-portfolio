'use client'

import { motion } from 'framer-motion'
import { Briefcase, Clock, Calendar, CheckCircle, XCircle } from 'lucide-react'

type AvailabilityStatus = 'available' | 'busy' | 'limited' | 'unavailable'

interface AvailabilityBadgeProps {
  status?: AvailabilityStatus
  customText?: string
  showIcon?: boolean
  showPulse?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const statusConfig: Record<AvailabilityStatus, {
  label: string
  icon: typeof Briefcase
  bgColor: string
  textColor: string
  pulseColor: string
}> = {
  available: {
    label: 'Available for Hire',
    icon: CheckCircle,
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500',
    pulseColor: 'bg-green-500'
  },
  busy: {
    label: 'Currently Busy',
    icon: Clock,
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-500',
    pulseColor: 'bg-yellow-500'
  },
  limited: {
    label: 'Limited Availability',
    icon: Calendar,
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-500',
    pulseColor: 'bg-orange-500'
  },
  unavailable: {
    label: 'Not Available',
    icon: XCircle,
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-500',
    pulseColor: 'bg-red-500'
  }
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs gap-1',
  md: 'px-3 py-1.5 text-sm gap-1.5',
  lg: 'px-4 py-2 text-base gap-2'
}

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5'
}

const pulseSizes = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5'
}

export function AvailabilityBadge({
  status = 'available',
  customText,
  showIcon = true,
  showPulse = true,
  size = 'md',
  className = ''
}: AvailabilityBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center rounded-full font-medium
        ${config.bgColor} ${config.textColor}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {/* Pulse indicator */}
      {showPulse && (
        <span className="relative flex">
          <span
            className={`
              animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
              ${config.pulseColor}
            `}
          />
          <span
            className={`
              relative inline-flex rounded-full
              ${config.pulseColor}
              ${pulseSizes[size]}
            `}
          />
        </span>
      )}

      {/* Icon */}
      {showIcon && <Icon className={iconSizes[size]} />}

      {/* Text */}
      <span>{customText || config.label}</span>
    </motion.div>
  )
}

// Compact version for navbar/header
export function AvailabilityDot({ status = 'available' }: { status?: AvailabilityStatus }) {
  const config = statusConfig[status]

  return (
    <span className="relative flex h-3 w-3" title={config.label}>
      <span
        className={`
          animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
          ${config.pulseColor}
        `}
      />
      <span
        className={`
          relative inline-flex rounded-full h-3 w-3
          ${config.pulseColor}
        `}
      />
    </span>
  )
}

// Full card version
export function AvailabilityCard({
  status = 'available',
  message,
  responseTime = '24 hours'
}: {
  status?: AvailabilityStatus
  message?: string
  responseTime?: string
}) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-xl p-4 border
        ${config.bgColor} border-current/20
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bgColor}`}>
          <Icon className={`w-5 h-5 ${config.textColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-semibold ${config.textColor}`}>
              {config.label}
            </span>
            <AvailabilityDot status={status} />
          </div>
          {message && (
            <p className="text-sm text-muted-foreground mb-2">{message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Typical response time: <span className="font-medium">{responseTime}</span>
          </p>
        </div>
      </div>
    </motion.div>
  )
}

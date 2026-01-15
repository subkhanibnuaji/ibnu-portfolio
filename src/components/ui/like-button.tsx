'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ThumbsUp, Star, Sparkles } from 'lucide-react'

type ReactionType = 'like' | 'love' | 'star' | 'sparkle'

interface LikeButtonProps {
  itemId: string
  itemType: 'post' | 'project' | 'comment'
  initialLikes?: number
  reactionType?: ReactionType
  showCount?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const reactionConfig: Record<ReactionType, {
  icon: typeof Heart
  activeColor: string
  label: string
}> = {
  like: {
    icon: ThumbsUp,
    activeColor: 'text-blue-500 fill-blue-500',
    label: 'Like'
  },
  love: {
    icon: Heart,
    activeColor: 'text-red-500 fill-red-500',
    label: 'Love'
  },
  star: {
    icon: Star,
    activeColor: 'text-yellow-500 fill-yellow-500',
    label: 'Star'
  },
  sparkle: {
    icon: Sparkles,
    activeColor: 'text-purple-500 fill-purple-500',
    label: 'Sparkle'
  }
}

const sizeClasses = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3'
}

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
}

export function LikeButton({
  itemId,
  itemType,
  initialLikes = 0,
  reactionType = 'love',
  showCount = true,
  size = 'md',
  className = ''
}: LikeButtonProps) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(initialLikes)
  const [isAnimating, setIsAnimating] = useState(false)

  const config = reactionConfig[reactionType]
  const Icon = config.icon
  const storageKey = `${itemType}-${itemId}-${reactionType}`

  // Check if already liked (from localStorage)
  useEffect(() => {
    const isLiked = localStorage.getItem(storageKey) === 'true'
    setLiked(isLiked)
  }, [storageKey])

  const handleClick = async () => {
    setIsAnimating(true)

    if (liked) {
      // Unlike
      setLiked(false)
      setLikes(prev => Math.max(0, prev - 1))
      localStorage.removeItem(storageKey)
    } else {
      // Like
      setLiked(true)
      setLikes(prev => prev + 1)
      localStorage.setItem(storageKey, 'true')
    }

    // API call (optional - fire and forget)
    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          itemType,
          reactionType,
          action: liked ? 'remove' : 'add'
        })
      })
    } catch (error) {
      // Silently fail - localStorage already has the state
    }

    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      className={`
        inline-flex items-center gap-1.5 rounded-full
        transition-colors
        ${liked ? config.activeColor : 'text-muted-foreground hover:text-foreground'}
        ${sizeClasses[size]}
        ${className}
      `}
      title={config.label}
    >
      <div className="relative">
        <motion.div
          animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Icon className={`${iconSizes[size]} transition-all ${liked ? config.activeColor : ''}`} />
        </motion.div>

        {/* Particle effects on like */}
        <AnimatePresence>
          {isAnimating && liked && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 0,
                    scale: 1,
                    x: Math.cos(i * 60 * Math.PI / 180) * 20,
                    y: Math.sin(i * 60 * Math.PI / 180) * 20
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full ${config.activeColor.split(' ')[0].replace('text', 'bg')}`}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {showCount && (
        <AnimatePresence mode="wait">
          <motion.span
            key={likes}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-sm font-medium min-w-[1.5rem] text-center"
          >
            {likes > 0 ? likes : ''}
          </motion.span>
        </AnimatePresence>
      )}
    </motion.button>
  )
}

// Multiple reaction types
export function ReactionBar({
  itemId,
  itemType,
  reactions = { like: 0, love: 0, star: 0 }
}: {
  itemId: string
  itemType: 'post' | 'project' | 'comment'
  reactions?: Partial<Record<ReactionType, number>>
}) {
  return (
    <div className="flex items-center gap-2">
      {Object.entries(reactions).map(([type, count]) => (
        <LikeButton
          key={type}
          itemId={itemId}
          itemType={itemType}
          reactionType={type as ReactionType}
          initialLikes={count}
          size="sm"
        />
      ))}
    </div>
  )
}

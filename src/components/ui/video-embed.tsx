'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Youtube, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoEmbedProps {
  url: string
  title?: string
  className?: string
  autoplay?: boolean
  thumbnail?: string
}

// Extract video ID and platform from URL
function parseVideoUrl(url: string): { platform: 'youtube' | 'vimeo' | 'unknown'; id: string } {
  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (youtubeMatch) {
    return { platform: 'youtube', id: youtubeMatch[1] }
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return { platform: 'vimeo', id: vimeoMatch[1] }
  }

  return { platform: 'unknown', id: '' }
}

export function VideoEmbed({
  url,
  title,
  className,
  autoplay = false,
  thumbnail
}: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const { platform, id } = parseVideoUrl(url)

  const getEmbedUrl = () => {
    switch (platform) {
      case 'youtube':
        return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
      case 'vimeo':
        return `https://player.vimeo.com/video/${id}?autoplay=1`
      default:
        return url
    }
  }

  const getThumbnailUrl = () => {
    if (thumbnail) return thumbnail
    if (platform === 'youtube') {
      return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
    }
    return null
  }

  const thumbnailUrl = getThumbnailUrl()

  if (platform === 'unknown') {
    return (
      <div className={cn('glass rounded-xl p-6 text-center', className)}>
        <p className="text-muted-foreground mb-2">Unsupported video platform</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-cyber-cyan hover:underline"
        >
          Open video <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    )
  }

  return (
    <div className={cn('relative rounded-xl overflow-hidden', className)}>
      {isPlaying ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="aspect-video"
        >
          <iframe
            src={getEmbedUrl()}
            title={title || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </motion.div>
      ) : (
        <button
          onClick={() => setIsPlaying(true)}
          className="relative aspect-video w-full group"
        >
          {/* Thumbnail */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20">
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt={title || 'Video thumbnail'}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
            {/* Play Button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 rounded-full bg-cyber-gradient flex items-center justify-center shadow-lg"
            >
              <Play className="h-8 w-8 text-white ml-1" fill="white" />
            </motion.div>
          </div>

          {/* Platform Badge */}
          <div className="absolute top-4 left-4">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 text-white text-sm">
              {platform === 'youtube' && <Youtube className="h-4 w-4 text-red-500" />}
              {platform === 'youtube' ? 'YouTube' : 'Vimeo'}
            </span>
          </div>

          {/* Title */}
          {title && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-medium">{title}</h3>
            </div>
          )}
        </button>
      )}
    </div>
  )
}

// Video Grid for multiple videos
interface VideoGridProps {
  videos: { url: string; title: string }[]
  columns?: 2 | 3
  className?: string
}

export function VideoGrid({ videos, columns = 2, className }: VideoGridProps) {
  const gridCols = columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'

  return (
    <div className={cn('grid gap-6', gridCols, className)}>
      {videos.map((video, index) => (
        <VideoEmbed key={index} url={video.url} title={video.title} />
      ))}
    </div>
  )
}

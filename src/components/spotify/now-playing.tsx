'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Pause, ExternalLink } from 'lucide-react'
import Image from 'next/image'

interface Track {
  title: string
  artist: string
  album: string
  albumImage: string
  songUrl: string
  duration?: number
  progress?: number
}

interface SpotifyData {
  isPlaying: boolean
  configured: boolean
  track?: Track
  recentTrack?: Track
  message?: string
}

interface SpotifyNowPlayingProps {
  variant?: 'card' | 'bar' | 'compact'
  className?: string
}

export function SpotifyNowPlaying({ variant = 'card', className = '' }: SpotifyNowPlayingProps) {
  const [data, setData] = useState<SpotifyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchNowPlaying()

    // Poll every 30 seconds
    const interval = setInterval(fetchNowPlaying, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchNowPlaying = async () => {
    try {
      const response = await fetch('/api/spotify/now-playing')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch Spotify data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <SpotifyLoading variant={variant} className={className} />
  }

  if (!data || !data.configured) {
    return null // Don't show anything if Spotify not configured
  }

  const track = data.track || data.recentTrack
  const isPlaying = data.isPlaying

  if (!track) {
    return null
  }

  if (variant === 'compact') {
    return (
      <a
        href={track.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1DB954]/10 text-sm hover:bg-[#1DB954]/20 transition-colors ${className}`}
      >
        {isPlaying ? (
          <SoundBars />
        ) : (
          <Music className="w-4 h-4 text-[#1DB954]" />
        )}
        <span className="truncate max-w-[150px]">{track.title}</span>
        <span className="text-muted-foreground">-</span>
        <span className="text-muted-foreground truncate max-w-[100px]">{track.artist}</span>
      </a>
    )
  }

  if (variant === 'bar') {
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card/95 backdrop-blur border border-border rounded-lg shadow-lg z-40 ${className}`}
      >
        <a
          href={track.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 hover:bg-accent/50 transition-colors rounded-lg"
        >
          {/* Album art */}
          <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
            {track.albumImage ? (
              <Image
                src={track.albumImage}
                alt={track.album}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Music className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <SoundBars />
              </div>
            )}
          </div>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-[#1DB954] font-medium">
                {isPlaying ? 'Now Playing' : 'Last Played'}
              </span>
            </div>
            <p className="font-medium text-sm truncate">{track.title}</p>
            <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
          </div>

          <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </a>

        {/* Progress bar */}
        {isPlaying && track.duration && track.progress && (
          <div className="px-3 pb-2">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#1DB954]"
                initial={{ width: `${(track.progress / track.duration) * 100}%` }}
                animate={{ width: '100%' }}
                transition={{
                  duration: (track.duration - track.progress) / 1000,
                  ease: 'linear'
                }}
              />
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  // Card variant (default)
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`bg-gradient-to-br from-[#1DB954]/10 to-transparent border border-[#1DB954]/20 rounded-xl p-4 ${className}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
        <span className="text-sm font-medium text-[#1DB954]">
          {isPlaying ? 'Now Playing' : 'Last Played'}
        </span>
        {isPlaying && <SoundBars />}
      </div>

      <a
        href={track.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 group"
      >
        {/* Album art */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
          {track.albumImage ? (
            <Image
              src={track.albumImage}
              alt={track.album}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Music className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Track info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate group-hover:text-[#1DB954] transition-colors">
            {track.title}
          </p>
          <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
          <p className="text-xs text-muted-foreground truncate">{track.album}</p>
        </div>
      </a>
    </motion.div>
  )
}

// Animated sound bars
function SoundBars() {
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-1 bg-[#1DB954] rounded-full"
          animate={{
            height: ['40%', '100%', '60%', '80%', '40%'],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Loading skeleton
function SpotifyLoading({ variant, className }: { variant: string, className: string }) {
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted animate-pulse ${className}`}>
        <div className="w-4 h-4 rounded bg-muted-foreground/20" />
        <div className="w-24 h-4 rounded bg-muted-foreground/20" />
      </div>
    )
  }

  return (
    <div className={`bg-muted/50 rounded-xl p-4 animate-pulse ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-full bg-muted-foreground/20" />
        <div className="w-20 h-4 rounded bg-muted-foreground/20" />
      </div>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg bg-muted-foreground/20" />
        <div className="flex-1">
          <div className="w-32 h-5 rounded bg-muted-foreground/20 mb-2" />
          <div className="w-24 h-4 rounded bg-muted-foreground/20" />
        </div>
      </div>
    </div>
  )
}

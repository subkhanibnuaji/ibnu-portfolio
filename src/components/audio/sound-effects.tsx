'use client'

import { useEffect, useState, useCallback, createContext, useContext, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Music } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================
type SoundType =
  | 'click'
  | 'hover'
  | 'success'
  | 'error'
  | 'notification'
  | 'toggle'
  | 'pop'
  | 'whoosh'
  | 'achievement'
  | 'typing'

interface SoundContextValue {
  enabled: boolean
  volume: number
  toggleSound: () => void
  setVolume: (volume: number) => void
  play: (sound: SoundType) => void
}

// ============================================
// SOUND DATA (Web Audio API generated sounds)
// ============================================
const createAudioContext = () => {
  if (typeof window === 'undefined') return null
  return new (window.AudioContext || (window as any).webkitAudioContext)()
}

const generateSound = (
  ctx: AudioContext,
  type: SoundType,
  volume: number
): void => {
  const now = ctx.currentTime
  const masterGain = ctx.createGain()
  masterGain.connect(ctx.destination)
  masterGain.gain.value = volume * 0.3 // Master volume control

  switch (type) {
    case 'click': {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(masterGain)
      osc.frequency.setValueAtTime(800, now)
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.05)
      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05)
      osc.start(now)
      osc.stop(now + 0.05)
      break
    }

    case 'hover': {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(masterGain)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1200, now)
      gain.gain.setValueAtTime(0.1, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03)
      osc.start(now)
      osc.stop(now + 0.03)
      break
    }

    case 'success': {
      const notes = [523.25, 659.25, 783.99] // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(masterGain)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + i * 0.1)
        gain.gain.setValueAtTime(0, now + i * 0.1)
        gain.gain.linearRampToValueAtTime(0.3, now + i * 0.1 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2)
        osc.start(now + i * 0.1)
        osc.stop(now + i * 0.1 + 0.2)
      })
      break
    }

    case 'error': {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(masterGain)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(150, now)
      osc.frequency.linearRampToValueAtTime(100, now + 0.2)
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
      osc.start(now)
      osc.stop(now + 0.2)
      break
    }

    case 'notification': {
      const notes = [880, 1108.73] // A5, C#6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(masterGain)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + i * 0.15)
        gain.gain.setValueAtTime(0, now + i * 0.15)
        gain.gain.linearRampToValueAtTime(0.25, now + i * 0.15 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.15)
        osc.start(now + i * 0.15)
        osc.stop(now + i * 0.15 + 0.15)
      })
      break
    }

    case 'toggle': {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(masterGain)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08)
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08)
      osc.start(now)
      osc.stop(now + 0.08)
      break
    }

    case 'pop': {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(masterGain)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(400, now)
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.1)
      gain.gain.setValueAtTime(0.4, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
      osc.start(now)
      osc.stop(now + 0.1)
      break
    }

    case 'whoosh': {
      const noise = ctx.createBufferSource()
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate)
      const noiseData = noiseBuffer.getChannelData(0)
      for (let i = 0; i < noiseBuffer.length; i++) {
        noiseData[i] = Math.random() * 2 - 1
      }
      noise.buffer = noiseBuffer
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(1000, now)
      filter.frequency.exponentialRampToValueAtTime(4000, now + 0.1)
      filter.frequency.exponentialRampToValueAtTime(500, now + 0.2)
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
      noise.connect(filter)
      filter.connect(gain)
      gain.connect(masterGain)
      noise.start(now)
      break
    }

    case 'achievement': {
      const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(masterGain)
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + i * 0.08)
        gain.gain.setValueAtTime(0, now + i * 0.08)
        gain.gain.linearRampToValueAtTime(0.3, now + i * 0.08 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.3)
        osc.start(now + i * 0.08)
        osc.stop(now + i * 0.08 + 0.3)
      })
      break
    }

    case 'typing': {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(masterGain)
      osc.type = 'square'
      osc.frequency.setValueAtTime(200 + Math.random() * 100, now)
      gain.gain.setValueAtTime(0.05, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.02)
      osc.start(now)
      osc.stop(now + 0.02)
      break
    }
  }
}

// ============================================
// CONTEXT
// ============================================
const SoundContext = createContext<SoundContextValue | null>(null)

export function useSoundEffects() {
  const context = useContext(SoundContext)
  if (!context) {
    throw new Error('useSoundEffects must be used within SoundProvider')
  }
  return context
}

// ============================================
// PROVIDER
// ============================================
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Load preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('soundEnabled')
    const storedVolume = localStorage.getItem('soundVolume')
    if (stored !== null) setEnabled(stored === 'true')
    if (storedVolume !== null) setVolume(parseFloat(storedVolume))
  }, [])

  // Save preference to localStorage
  useEffect(() => {
    localStorage.setItem('soundEnabled', enabled.toString())
    localStorage.setItem('soundVolume', volume.toString())
  }, [enabled, volume])

  const toggleSound = useCallback(() => {
    setEnabled(prev => !prev)
  }, [])

  const play = useCallback((sound: SoundType) => {
    if (!enabled) return

    // Create or resume audio context
    if (!audioContextRef.current) {
      audioContextRef.current = createAudioContext()
    }

    const ctx = audioContextRef.current
    if (!ctx) return

    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    generateSound(ctx, sound, volume)
  }, [enabled, volume])

  // Listen for global sound events
  useEffect(() => {
    const handleToggleSound = () => toggleSound()
    window.addEventListener('toggleSound', handleToggleSound)
    return () => window.removeEventListener('toggleSound', handleToggleSound)
  }, [toggleSound])

  return (
    <SoundContext.Provider value={{ enabled, volume, toggleSound, setVolume, play }}>
      {children}
    </SoundContext.Provider>
  )
}

// ============================================
// SOUND TOGGLE BUTTON
// ============================================
export function SoundToggle({ className }: { className?: string }) {
  const { enabled, toggleSound, volume, setVolume } = useSoundEffects()
  const [showVolume, setShowVolume] = useState(false)

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={toggleSound}
        onMouseEnter={() => setShowVolume(true)}
        onMouseLeave={() => setShowVolume(false)}
        className={cn(
          'p-2.5 rounded-full transition-all',
          enabled
            ? 'bg-primary/20 text-primary hover:bg-primary/30'
            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
        )}
        title={enabled ? 'Mute sounds' : 'Enable sounds'}
        aria-label={enabled ? 'Mute sounds' : 'Enable sounds'}
      >
        {enabled ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
      </button>

      {/* Volume slider */}
      <AnimatePresence>
        {showVolume && enabled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 rounded-xl bg-card/95 backdrop-blur-sm border border-border/50 shadow-lg"
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="text-xs text-center text-muted-foreground mt-1">
              {Math.round(volume * 100)}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// SOUND BUTTON (plays sound on click)
// ============================================
interface SoundButtonProps {
  sound?: SoundType
  hoverSound?: SoundType
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export function SoundButton({
  sound = 'click',
  hoverSound = 'hover',
  children,
  className,
  onClick,
  disabled,
}: SoundButtonProps) {
  const { play } = useSoundEffects()

  return (
    <button
      onMouseEnter={() => play(hoverSound)}
      onClick={() => {
        play(sound)
        onClick?.()
      }}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  )
}

// ============================================
// HOOKS
// ============================================

// Play sound on event
export function useSound(sound: SoundType) {
  const { play } = useSoundEffects()
  return useCallback(() => play(sound), [play, sound])
}

// Play sound on mount
export function useSoundOnMount(sound: SoundType) {
  const { play } = useSoundEffects()
  useEffect(() => {
    play(sound)
  }, [play, sound])
}

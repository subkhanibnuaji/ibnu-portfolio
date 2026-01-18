'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Play, Pause, Square, Volume2, VolumeX,
  Plus, Minus, RotateCcw, Download, Music
} from 'lucide-react'

interface Track {
  id: string
  name: string
  pattern: boolean[]
  volume: number
  muted: boolean
  color: string
  sound: 'kick' | 'snare' | 'hihat' | 'clap' | 'tom' | 'rim' | 'cymbal' | 'bass'
}

const SOUNDS = {
  kick: { freq: 150, decay: 0.5, type: 'sine' as OscillatorType },
  snare: { freq: 200, decay: 0.2, type: 'triangle' as OscillatorType, noise: true },
  hihat: { freq: 800, decay: 0.1, type: 'square' as OscillatorType, highpass: true },
  clap: { freq: 300, decay: 0.15, type: 'triangle' as OscillatorType, noise: true },
  tom: { freq: 200, decay: 0.3, type: 'sine' as OscillatorType },
  rim: { freq: 400, decay: 0.05, type: 'square' as OscillatorType },
  cymbal: { freq: 600, decay: 0.4, type: 'triangle' as OscillatorType, highpass: true },
  bass: { freq: 80, decay: 0.4, type: 'sine' as OscillatorType }
}

const DEFAULT_TRACKS: Track[] = [
  { id: '1', name: 'Kick', pattern: Array(16).fill(false), volume: 0.8, muted: false, color: '#ef4444', sound: 'kick' },
  { id: '2', name: 'Snare', pattern: Array(16).fill(false), volume: 0.7, muted: false, color: '#f97316', sound: 'snare' },
  { id: '3', name: 'Hi-Hat', pattern: Array(16).fill(false), volume: 0.5, muted: false, color: '#eab308', sound: 'hihat' },
  { id: '4', name: 'Clap', pattern: Array(16).fill(false), volume: 0.6, muted: false, color: '#22c55e', sound: 'clap' },
]

// Preset patterns
const PRESETS = {
  'Basic Rock': {
    kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
    hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
    clap: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
  },
  'Hip Hop': {
    kick: [true, false, false, false, false, false, true, false, false, false, true, false, false, false, false, false],
    snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, true],
    hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    clap: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false]
  },
  'House': {
    kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    snare: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    hihat: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
    clap: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false]
  },
  'Drum & Bass': {
    kick: [true, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false],
    snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, true, false],
    hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    clap: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false]
  }
}

export function BeatMaker() {
  const [tracks, setTracks] = useState<Track[]>(DEFAULT_TRACKS)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [bpm, setBpm] = useState(120)
  const [masterVolume, setMasterVolume] = useState(0.8)
  const [swing, setSwing] = useState(0)

  const audioContextRef = useRef<AudioContext | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const stepRef = useRef(0)

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    return () => {
      audioContextRef.current?.close()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const playSound = useCallback((sound: keyof typeof SOUNDS, volume: number) => {
    const ctx = audioContextRef.current
    if (!ctx) return

    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const config = SOUNDS[sound]
    const now = ctx.currentTime

    // Main oscillator
    const osc = ctx.createOscillator()
    osc.type = config.type
    osc.frequency.setValueAtTime(config.freq, now)
    osc.frequency.exponentialRampToValueAtTime(config.freq * 0.5, now + config.decay)

    // Gain envelope
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(volume * masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + config.decay)

    // Filter for hi-hat/cymbal
    if ('highpass' in config && config.highpass) {
      const filter = ctx.createBiquadFilter()
      filter.type = 'highpass'
      filter.frequency.value = 5000
      osc.connect(filter)
      filter.connect(gain)
    } else {
      osc.connect(gain)
    }

    // Add noise for snare/clap
    if ('noise' in config && config.noise) {
      const bufferSize = ctx.sampleRate * config.decay
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }

      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(volume * masterVolume * 0.3, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + config.decay)

      const noiseFilter = ctx.createBiquadFilter()
      noiseFilter.type = 'highpass'
      noiseFilter.frequency.value = 1000

      noise.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(ctx.destination)

      noise.start(now)
      noise.stop(now + config.decay)
    }

    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + config.decay)
  }, [masterVolume])

  const playStep = useCallback((step: number) => {
    tracks.forEach(track => {
      if (track.pattern[step] && !track.muted) {
        playSound(track.sound, track.volume)
      }
    })
  }, [tracks, playSound])

  const startPlayback = useCallback(() => {
    if (isPlaying) return

    const ctx = audioContextRef.current
    if (ctx?.state === 'suspended') {
      ctx.resume()
    }

    setIsPlaying(true)
    stepRef.current = 0
    setCurrentStep(0)

    const stepTime = (60 / bpm / 4) * 1000 // 16th notes

    intervalRef.current = setInterval(() => {
      playStep(stepRef.current)
      setCurrentStep(stepRef.current)

      stepRef.current = (stepRef.current + 1) % 16
    }, stepTime)
  }, [isPlaying, bpm, playStep])

  const stopPlayback = useCallback(() => {
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setCurrentStep(0)
    stepRef.current = 0
  }, [])

  const toggleStep = (trackId: string, stepIndex: number) => {
    setTracks(prev => prev.map(track => {
      if (track.id === trackId) {
        const newPattern = [...track.pattern]
        newPattern[stepIndex] = !newPattern[stepIndex]
        return { ...track, pattern: newPattern }
      }
      return track
    }))
  }

  const toggleMute = (trackId: string) => {
    setTracks(prev => prev.map(track => {
      if (track.id === trackId) {
        return { ...track, muted: !track.muted }
      }
      return track
    }))
  }

  const setTrackVolume = (trackId: string, volume: number) => {
    setTracks(prev => prev.map(track => {
      if (track.id === trackId) {
        return { ...track, volume }
      }
      return track
    }))
  }

  const clearAll = () => {
    setTracks(prev => prev.map(track => ({
      ...track,
      pattern: Array(16).fill(false)
    })))
  }

  const loadPreset = (presetName: keyof typeof PRESETS) => {
    const preset = PRESETS[presetName]
    setTracks(prev => prev.map(track => {
      const presetPattern = preset[track.sound as keyof typeof preset]
      if (presetPattern) {
        return { ...track, pattern: [...presetPattern] }
      }
      return track
    }))
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Transport controls */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={isPlaying ? stopPlayback : startPlayback}
              className={`p-3 rounded-lg transition-colors ${
                isPlaying
                  ? 'bg-red-500 text-white'
                  : 'bg-green-500 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button
              onClick={stopPlayback}
              className="p-3 rounded-lg bg-white/10 text-white/70 hover:bg-white/20"
            >
              <Square className="w-6 h-6" />
            </button>
            <button
              onClick={clearAll}
              className="p-3 rounded-lg bg-white/10 text-white/70 hover:bg-white/20"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>

          {/* BPM control */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBpm(prev => Math.max(60, prev - 5))}
              className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="text-white font-mono w-20 text-center">
              <div className="text-2xl font-bold">{bpm}</div>
              <div className="text-xs text-white/50">BPM</div>
            </div>
            <button
              onClick={() => setBpm(prev => Math.min(200, prev + 5))}
              className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Master volume */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-white/70" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="w-24 accent-blue-500"
            />
          </div>

          {/* Presets */}
          <select
            onChange={(e) => loadPreset(e.target.value as keyof typeof PRESETS)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            defaultValue=""
          >
            <option value="" disabled className="bg-slate-800">Load Preset</option>
            {Object.keys(PRESETS).map(name => (
              <option key={name} value={name} className="bg-slate-800">{name}</option>
            ))}
          </select>
        </div>

        {/* Step sequencer */}
        <div className="space-y-2 overflow-x-auto">
          {/* Step numbers */}
          <div className="flex items-center gap-1 min-w-fit">
            <div className="w-32 md:w-48" />
            {Array(16).fill(0).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-6 flex items-center justify-center text-xs ${
                  i % 4 === 0 ? 'text-white/70 font-bold' : 'text-white/40'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Tracks */}
          {tracks.map(track => (
            <div key={track.id} className="flex items-center gap-1 min-w-fit">
              {/* Track controls */}
              <div className="w-32 md:w-48 flex items-center gap-2 pr-2">
                <button
                  onClick={() => toggleMute(track.id)}
                  className={`p-1 rounded transition-colors ${
                    track.muted ? 'text-red-400' : 'text-white/70'
                  }`}
                >
                  {track.muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-white text-sm font-medium truncate flex-1">{track.name}</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={track.volume}
                  onChange={(e) => setTrackVolume(track.id, parseFloat(e.target.value))}
                  className="w-16 accent-blue-500 hidden md:block"
                />
              </div>

              {/* Steps */}
              {track.pattern.map((active, stepIndex) => (
                <motion.button
                  key={stepIndex}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleStep(track.id, stepIndex)}
                  className={`
                    w-8 h-8 rounded transition-all border
                    ${stepIndex % 4 === 0 ? 'border-white/20' : 'border-white/5'}
                    ${active
                      ? 'shadow-lg'
                      : 'bg-white/5 hover:bg-white/10'
                    }
                    ${currentStep === stepIndex && isPlaying
                      ? 'ring-2 ring-white/50'
                      : ''
                    }
                  `}
                  style={{
                    backgroundColor: active ? track.color : undefined,
                    opacity: track.muted ? 0.3 : 1
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Current step indicator */}
        <div className="mt-4 flex items-center gap-1">
          <div className="w-32 md:w-48" />
          {Array(16).fill(0).map((_, i) => (
            <div
              key={i}
              className={`w-8 h-1 rounded-full transition-colors ${
                currentStep === i && isPlaying
                  ? 'bg-blue-500'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-white/50 text-sm">
          Click on cells to add/remove beats • Use presets for quick patterns • Adjust BPM for tempo
        </div>
      </motion.div>
    </div>
  )
}

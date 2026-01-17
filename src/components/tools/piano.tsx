'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Volume2, VolumeX, Music, Mic, Square, Play,
  ChevronUp, ChevronDown, RotateCcw
} from 'lucide-react'

interface Note {
  key: string
  note: string
  frequency: number
  isBlack: boolean
  keyBinding: string
}

const NOTES: Note[] = [
  { key: 'C4', note: 'C', frequency: 261.63, isBlack: false, keyBinding: 'a' },
  { key: 'C#4', note: 'C#', frequency: 277.18, isBlack: true, keyBinding: 'w' },
  { key: 'D4', note: 'D', frequency: 293.66, isBlack: false, keyBinding: 's' },
  { key: 'D#4', note: 'D#', frequency: 311.13, isBlack: true, keyBinding: 'e' },
  { key: 'E4', note: 'E', frequency: 329.63, isBlack: false, keyBinding: 'd' },
  { key: 'F4', note: 'F', frequency: 349.23, isBlack: false, keyBinding: 'f' },
  { key: 'F#4', note: 'F#', frequency: 369.99, isBlack: true, keyBinding: 't' },
  { key: 'G4', note: 'G', frequency: 392.00, isBlack: false, keyBinding: 'g' },
  { key: 'G#4', note: 'G#', frequency: 415.30, isBlack: true, keyBinding: 'y' },
  { key: 'A4', note: 'A', frequency: 440.00, isBlack: false, keyBinding: 'h' },
  { key: 'A#4', note: 'A#', frequency: 466.16, isBlack: true, keyBinding: 'u' },
  { key: 'B4', note: 'B', frequency: 493.88, isBlack: false, keyBinding: 'j' },
  { key: 'C5', note: 'C', frequency: 523.25, isBlack: false, keyBinding: 'k' },
  { key: 'C#5', note: 'C#', frequency: 554.37, isBlack: true, keyBinding: 'o' },
  { key: 'D5', note: 'D', frequency: 587.33, isBlack: false, keyBinding: 'l' },
  { key: 'D#5', note: 'D#', frequency: 622.25, isBlack: true, keyBinding: 'p' },
  { key: 'E5', note: 'E', frequency: 659.25, isBlack: false, keyBinding: ';' },
]

interface RecordedNote {
  note: Note
  time: number
  duration: number
}

export function Piano() {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set())
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const [octaveShift, setOctaveShift] = useState(0)
  const [waveform, setWaveform] = useState<OscillatorType>('sine')
  const [isRecording, setIsRecording] = useState(false)
  const [recordedNotes, setRecordedNotes] = useState<RecordedNote[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [showKeyBindings, setShowKeyBindings] = useState(true)

  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map())
  const gainNodesRef = useRef<Map<string, GainNode>>(new Map())
  const recordStartRef = useRef<number>(0)
  const noteStartTimesRef = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    return () => {
      audioContextRef.current?.close()
    }
  }, [])

  const playNote = useCallback((note: Note) => {
    if (!audioContextRef.current || isMuted) return

    const ctx = audioContextRef.current
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    // Calculate shifted frequency
    const shiftedFrequency = note.frequency * Math.pow(2, octaveShift)

    // Create oscillator
    const oscillator = ctx.createOscillator()
    oscillator.type = waveform
    oscillator.frequency.setValueAtTime(shiftedFrequency, ctx.currentTime)

    // Create gain node for envelope
    const gainNode = ctx.createGain()
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01)

    // Connect nodes
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Start oscillator
    oscillator.start()

    // Store references
    oscillatorsRef.current.set(note.key, oscillator)
    gainNodesRef.current.set(note.key, gainNode)

    // Record if recording
    if (isRecording) {
      noteStartTimesRef.current.set(note.key, Date.now() - recordStartRef.current)
    }

    setActiveKeys(prev => new Set([...prev, note.key]))
  }, [isMuted, octaveShift, volume, waveform, isRecording])

  const stopNote = useCallback((note: Note) => {
    const ctx = audioContextRef.current
    const oscillator = oscillatorsRef.current.get(note.key)
    const gainNode = gainNodesRef.current.get(note.key)

    if (ctx && gainNode && oscillator) {
      // Fade out
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1)

      // Stop and cleanup after fade
      setTimeout(() => {
        oscillator.stop()
        oscillator.disconnect()
        gainNode.disconnect()
        oscillatorsRef.current.delete(note.key)
        gainNodesRef.current.delete(note.key)
      }, 100)
    }

    // Record note end
    if (isRecording && noteStartTimesRef.current.has(note.key)) {
      const startTime = noteStartTimesRef.current.get(note.key)!
      const endTime = Date.now() - recordStartRef.current
      setRecordedNotes(prev => [...prev, {
        note,
        time: startTime,
        duration: endTime - startTime
      }])
      noteStartTimesRef.current.delete(note.key)
    }

    setActiveKeys(prev => {
      const next = new Set(prev)
      next.delete(note.key)
      return next
    })
  }, [isRecording])

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      const note = NOTES.find(n => n.keyBinding === e.key.toLowerCase())
      if (note && !activeKeys.has(note.key)) {
        playNote(note)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = NOTES.find(n => n.keyBinding === e.key.toLowerCase())
      if (note) {
        stopNote(note)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [playNote, stopNote, activeKeys])

  const startRecording = () => {
    setRecordedNotes([])
    noteStartTimesRef.current.clear()
    recordStartRef.current = Date.now()
    setIsRecording(true)
  }

  const stopRecording = () => {
    setIsRecording(false)
  }

  const playRecording = async () => {
    if (recordedNotes.length === 0 || isPlaying) return

    setIsPlaying(true)
    const startTime = Date.now()

    for (const recorded of recordedNotes) {
      const waitTime = recorded.time - (Date.now() - startTime)
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }

      playNote(recorded.note)

      setTimeout(() => {
        stopNote(recorded.note)
      }, recorded.duration)
    }

    // Wait for last note to finish
    const lastNote = recordedNotes[recordedNotes.length - 1]
    await new Promise(resolve => setTimeout(resolve, lastNote.duration + 100))

    setIsPlaying(false)
  }

  const whiteKeys = NOTES.filter(n => !n.isBlack)
  const blackKeys = NOTES.filter(n => n.isBlack)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
          <div className="flex gap-4 items-center">
            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 accent-blue-500"
              />
            </div>

            {/* Octave */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOctaveShift(prev => Math.max(-2, prev - 1))}
                className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <span className="text-white/70 w-16 text-center">Oct: {octaveShift >= 0 ? '+' : ''}{octaveShift}</span>
              <button
                onClick={() => setOctaveShift(prev => Math.min(2, prev + 1))}
                className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>

            {/* Waveform */}
            <select
              value={waveform}
              onChange={(e) => setWaveform(e.target.value as OscillatorType)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="sine" className="bg-slate-800">Sine</option>
              <option value="square" className="bg-slate-800">Square</option>
              <option value="sawtooth" className="bg-slate-800">Sawtooth</option>
              <option value="triangle" className="bg-slate-800">Triangle</option>
            </select>
          </div>

          {/* Recording controls */}
          <div className="flex gap-2">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30"
              >
                <Mic className="w-5 h-5" />
                Record
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 rounded-lg text-white animate-pulse"
              >
                <Square className="w-5 h-5" />
                Stop
              </button>
            )}

            <button
              onClick={playRecording}
              disabled={recordedNotes.length === 0 || isPlaying}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-500/30 disabled:opacity-50"
            >
              <Play className="w-5 h-5" />
              Play ({recordedNotes.length})
            </button>

            <button
              onClick={() => setShowKeyBindings(!showKeyBindings)}
              className={`p-2 rounded-lg border transition-colors ${
                showKeyBindings
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                  : 'bg-white/10 border-white/20 text-white/70'
              }`}
            >
              <Music className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Piano keyboard */}
        <div className="relative select-none">
          {/* White keys */}
          <div className="flex justify-center">
            {whiteKeys.map((note, index) => (
              <motion.div
                key={note.key}
                whileTap={{ scale: 0.98 }}
                onMouseDown={() => playNote(note)}
                onMouseUp={() => stopNote(note)}
                onMouseLeave={() => activeKeys.has(note.key) && stopNote(note)}
                onTouchStart={(e) => { e.preventDefault(); playNote(note); }}
                onTouchEnd={() => stopNote(note)}
                className={`
                  relative w-12 md:w-16 h-48 md:h-64 border border-gray-300 rounded-b-lg cursor-pointer
                  transition-colors duration-75
                  ${activeKeys.has(note.key)
                    ? 'bg-blue-200 shadow-inner'
                    : 'bg-white hover:bg-gray-50 shadow-lg'
                  }
                `}
              >
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <div className="text-gray-600 font-medium">{note.note}</div>
                  {showKeyBindings && (
                    <div className="text-gray-400 text-sm uppercase">{note.keyBinding}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Black keys */}
          <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none">
            {whiteKeys.map((whiteNote, index) => {
              const blackNote = blackKeys.find(b => {
                const whiteIndex = NOTES.indexOf(whiteNote)
                const blackIndex = NOTES.indexOf(b)
                return blackIndex === whiteIndex + 1
              })

              if (!blackNote) {
                return <div key={index} className="w-12 md:w-16" />
              }

              return (
                <div key={index} className="relative w-12 md:w-16">
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onMouseDown={() => playNote(blackNote)}
                    onMouseUp={() => stopNote(blackNote)}
                    onMouseLeave={() => activeKeys.has(blackNote.key) && stopNote(blackNote)}
                    onTouchStart={(e) => { e.preventDefault(); playNote(blackNote); }}
                    onTouchEnd={() => stopNote(blackNote)}
                    className={`
                      absolute -right-4 w-8 md:w-10 h-28 md:h-40 rounded-b-lg cursor-pointer z-10
                      pointer-events-auto transition-colors duration-75
                      ${activeKeys.has(blackNote.key)
                        ? 'bg-blue-700 shadow-inner'
                        : 'bg-gray-900 hover:bg-gray-800 shadow-lg'
                      }
                    `}
                  >
                    {showKeyBindings && (
                      <div className="absolute bottom-2 left-0 right-0 text-center text-gray-400 text-xs uppercase">
                        {blackNote.keyBinding}
                      </div>
                    )}
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-white/50 text-sm">
          Use keyboard keys (A-; for white keys, W-P for black keys) or click/tap the piano keys
        </div>
      </motion.div>
    </div>
  )
}

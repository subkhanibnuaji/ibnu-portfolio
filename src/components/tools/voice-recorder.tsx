'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Mic, Square, Play, Pause, Download, Trash2,
  Volume2, Clock, Waves
} from 'lucide-react'

interface Recording {
  id: string
  blob: Blob
  url: string
  duration: number
  timestamp: Date
  name: string
}

export function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(20).fill(0))

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      recordings.forEach(r => URL.revokeObjectURL(r.url))
    }
  }, [recordings])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Set up audio analysis
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 64

      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)

        const newRecording: Recording = {
          id: Date.now().toString(),
          blob,
          url,
          duration: currentTime,
          timestamp: new Date(),
          name: `Recording ${recordings.length + 1}`
        }

        setRecordings(prev => [...prev, newRecording])
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start(100)
      setIsRecording(true)
      setCurrentTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 1)
      }, 1000)

      // Start visualization
      visualize()
    } catch (err) {
      console.error('Error accessing microphone:', err)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const visualize = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)

    const update = () => {
      if (!analyserRef.current) return

      analyserRef.current.getByteFrequencyData(dataArray)

      const levels = Array(20).fill(0).map((_, i) => {
        const index = Math.floor(i * dataArray.length / 20)
        return dataArray[index] / 255
      })

      setAudioLevels(levels)
      animationRef.current = requestAnimationFrame(update)
    }

    update()
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      setAudioLevels(Array(20).fill(0))

      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        timerRef.current = setInterval(() => {
          setCurrentTime(prev => prev + 1)
        }, 1000)
        visualize()
      } else {
        mediaRecorderRef.current.pause()
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
      setIsPaused(!isPaused)
    }
  }

  const playRecording = (recording: Recording) => {
    if (playingId === recording.id) {
      audioRef.current?.pause()
      setPlayingId(null)
      return
    }

    if (audioRef.current) {
      audioRef.current.pause()
    }

    audioRef.current = new Audio(recording.url)
    audioRef.current.play()
    setPlayingId(recording.id)

    audioRef.current.onended = () => {
      setPlayingId(null)
    }
  }

  const deleteRecording = (id: string) => {
    const recording = recordings.find(r => r.id === id)
    if (recording) {
      URL.revokeObjectURL(recording.url)
      setRecordings(prev => prev.filter(r => r.id !== id))
    }
  }

  const downloadRecording = (recording: Recording) => {
    const a = document.createElement('a')
    a.href = recording.url
    a.download = `${recording.name.replace(/\s+/g, '_')}.webm`
    a.click()
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Recording interface */}
        <div className="text-center mb-8">
          {/* Visualizer */}
          <div className="flex items-end justify-center gap-1 h-24 mb-6">
            {audioLevels.map((level, i) => (
              <motion.div
                key={i}
                className={`w-2 rounded-full ${isRecording && !isPaused ? 'bg-red-500' : 'bg-white/30'}`}
                animate={{ height: `${Math.max(8, level * 96)}px` }}
                transition={{ duration: 0.05 }}
              />
            ))}
          </div>

          {/* Timer */}
          <div className={`text-5xl font-mono mb-6 ${isRecording ? 'text-red-400' : 'text-white'}`}>
            {formatTime(currentTime)}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {!isRecording ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startRecording}
                className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30"
              >
                <Mic className="w-10 h-10" />
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={pauseRecording}
                  className="w-16 h-16 rounded-full bg-yellow-500 text-white flex items-center justify-center"
                >
                  {isPaused ? <Play className="w-8 h-8" /> : <Pause className="w-8 h-8" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopRecording}
                  className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center animate-pulse"
                >
                  <Square className="w-10 h-10" />
                </motion.button>
              </>
            )}
          </div>

          {isRecording && (
            <div className="mt-4 text-red-400 animate-pulse flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              {isPaused ? 'Paused' : 'Recording...'}
            </div>
          )}
        </div>

        {/* Recordings list */}
        {recordings.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Waves className="w-5 h-5" />
              Recordings ({recordings.length})
            </h3>

            {recordings.map((recording) => (
              <motion.div
                key={recording.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 rounded-lg p-4 flex items-center gap-4"
              >
                {/* Play button */}
                <button
                  onClick={() => playRecording(recording)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    playingId === recording.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {playingId === recording.id ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{recording.name}</div>
                  <div className="flex items-center gap-4 text-white/50 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(recording.duration)}
                    </span>
                    <span>{formatDate(recording.timestamp)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadRecording(recording)}
                    className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteRecording(recording.id)}
                    className="p-2 rounded-lg bg-white/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {recordings.length === 0 && !isRecording && (
          <div className="text-center text-white/50">
            <Mic className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Press the record button to start recording</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

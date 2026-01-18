'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Monitor, Video, Square, Download, Play, Pause,
  Trash2, Clock, Settings, Mic, MicOff
} from 'lucide-react'

interface Recording {
  id: string
  blob: Blob
  url: string
  duration: number
  timestamp: Date
  name: string
  type: 'screen' | 'camera'
}

export function ScreenRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [includeAudio, setIncludeAudio] = useState(true)
  const [recordingType, setRecordingType] = useState<'screen' | 'camera'>('screen')
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const previewVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      recordings.forEach(r => URL.revokeObjectURL(r.url))
      if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [recordings, previewStream])

  const startRecording = async () => {
    try {
      let stream: MediaStream

      if (recordingType === 'screen') {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            displaySurface: 'monitor'
          },
          audio: includeAudio
        })

        if (includeAudio) {
          try {
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const tracks = [...displayStream.getTracks(), ...audioStream.getAudioTracks()]
            stream = new MediaStream(tracks)
          } catch {
            stream = displayStream
          }
        } else {
          stream = displayStream
        }
      } else {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: includeAudio
        })
      }

      // Show preview
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream
        previewVideoRef.current.play()
      }
      setPreviewStream(stream)

      // Set up media recorder
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm'

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType })
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)

        const newRecording: Recording = {
          id: Date.now().toString(),
          blob,
          url,
          duration: currentTime,
          timestamp: new Date(),
          name: `${recordingType === 'screen' ? 'Screen' : 'Camera'} Recording ${recordings.length + 1}`,
          type: recordingType
        }

        setRecordings(prev => [...prev, newRecording])
        stream.getTracks().forEach(track => track.stop())
        setPreviewStream(null)
        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = null
        }
      }

      // Handle screen share stop
      stream.getVideoTracks()[0].onended = () => {
        stopRecording()
      }

      mediaRecorderRef.current.start(100)
      setIsRecording(true)
      setCurrentTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 1)
      }, 1000)

    } catch (err) {
      console.error('Error starting recording:', err)
      alert('Could not start recording. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
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
      } else {
        mediaRecorderRef.current.pause()
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
      setIsPaused(!isPaused)
    }
  }

  const playRecording = (recording: Recording) => {
    if (playingId === recording.id) {
      videoRef.current?.pause()
      setPlayingId(null)
      return
    }

    if (videoRef.current) {
      videoRef.current.src = recording.url
      videoRef.current.play()
      setPlayingId(recording.id)

      videoRef.current.onended = () => {
        setPlayingId(null)
      }
    }
  }

  const deleteRecording = (id: string) => {
    const recording = recordings.find(r => r.id === id)
    if (recording) {
      URL.revokeObjectURL(recording.url)
      setRecordings(prev => prev.filter(r => r.id !== id))
      if (playingId === id) {
        setPlayingId(null)
      }
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
        {/* Preview / Player */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6 relative">
          {previewStream ? (
            <video
              ref={previewVideoRef}
              className="w-full h-full object-contain"
              muted
              autoPlay
            />
          ) : playingId ? (
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              controls
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white/50">
                <Monitor className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Start recording to see preview</p>
              </div>
            </div>
          )}

          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 rounded-full px-4 py-2">
              <span className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} />
              <span className="text-white font-mono">{formatTime(currentTime)}</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-center mb-6">
          {/* Recording type */}
          {!isRecording && (
            <div className="flex rounded-lg overflow-hidden border border-white/20">
              <button
                onClick={() => setRecordingType('screen')}
                className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                  recordingType === 'screen'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white/70'
                }`}
              >
                <Monitor className="w-5 h-5" />
                Screen
              </button>
              <button
                onClick={() => setRecordingType('camera')}
                className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                  recordingType === 'camera'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white/70'
                }`}
              >
                <Video className="w-5 h-5" />
                Camera
              </button>
            </div>
          )}

          {/* Audio toggle */}
          {!isRecording && (
            <button
              onClick={() => setIncludeAudio(!includeAudio)}
              className={`p-2 rounded-lg border transition-colors ${
                includeAudio
                  ? 'bg-green-500/20 border-green-500/50 text-green-400'
                  : 'bg-white/10 border-white/20 text-white/70'
              }`}
              title={includeAudio ? 'Audio enabled' : 'Audio disabled'}
            >
              {includeAudio ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
          )}

          {/* Main controls */}
          {!isRecording ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startRecording}
              className="px-6 py-3 rounded-lg bg-red-500 text-white flex items-center gap-2 font-medium shadow-lg shadow-red-500/30"
            >
              <span className="w-3 h-3 rounded-full bg-white" />
              Start Recording
            </motion.button>
          ) : (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={pauseRecording}
                className="px-4 py-3 rounded-lg bg-yellow-500 text-white flex items-center gap-2"
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                {isPaused ? 'Resume' : 'Pause'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stopRecording}
                className="px-4 py-3 rounded-lg bg-red-500 text-white flex items-center gap-2"
              >
                <Square className="w-5 h-5" />
                Stop
              </motion.button>
            </div>
          )}
        </div>

        {/* Recordings list */}
        {recordings.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Video className="w-5 h-5" />
              Recordings ({recordings.length})
            </h3>

            {recordings.map((recording) => (
              <motion.div
                key={recording.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`bg-white/5 rounded-lg p-4 flex items-center gap-4 cursor-pointer transition-colors ${
                  playingId === recording.id ? 'ring-2 ring-blue-500' : 'hover:bg-white/10'
                }`}
                onClick={() => playRecording(recording)}
              >
                {/* Thumbnail */}
                <div className="w-24 h-16 rounded bg-black/50 flex items-center justify-center">
                  {recording.type === 'screen' ? (
                    <Monitor className="w-8 h-8 text-white/50" />
                  ) : (
                    <Video className="w-8 h-8 text-white/50" />
                  )}
                </div>

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
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
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
      </motion.div>
    </div>
  )
}

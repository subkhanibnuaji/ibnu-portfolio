'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Music, Play, Pause, Upload, Volume2, VolumeX, Mic, MicOff, Palette } from 'lucide-react'

type VisualizerType = 'bars' | 'wave' | 'circle' | 'particles'

const VISUALIZER_COLORS = [
  { name: 'Neon', colors: ['#00ff88', '#00ccff', '#ff00ff'] },
  { name: 'Sunset', colors: ['#ff6b6b', '#ffd93d', '#ff9f43'] },
  { name: 'Ocean', colors: ['#00d2d3', '#0984e3', '#6c5ce7'] },
  { name: 'Fire', colors: ['#ff0000', '#ff6600', '#ffcc00'] },
  { name: 'Galaxy', colors: ['#9b59b6', '#3498db', '#1abc9c'] }
]

export function MusicVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMicActive, setIsMicActive] = useState(false)
  const [visualizerType, setVisualizerType] = useState<VisualizerType>('bars')
  const [colorScheme, setColorScheme] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [audioFile, setAudioFile] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | MediaStreamAudioSourceNode | null>(null)
  const animationRef = useRef<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const setupAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
    }
    return { audioContext: audioContextRef.current, analyser: analyserRef.current! }
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    stopMic()
    const url = URL.createObjectURL(file)
    setAudioFile(url)
    setFileName(file.name)
    setIsPlaying(false)

    // Setup audio
    const { audioContext, analyser } = setupAudioContext()

    if (audioRef.current) {
      if (sourceRef.current && 'mediaElement' in sourceRef.current) {
        // Source already connected
      } else {
        sourceRef.current = audioContext.createMediaElementSource(audioRef.current)
        sourceRef.current.connect(analyser)
        analyser.connect(audioContext.destination)
      }
    }
  }

  const togglePlay = async () => {
    if (!audioRef.current || !audioFile) return

    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume()
    }

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      await audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const startMic = async () => {
    try {
      stopAudio()
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const { audioContext, analyser } = setupAudioContext()
      sourceRef.current = audioContext.createMediaStreamSource(stream)
      sourceRef.current.connect(analyser)

      setIsMicActive(true)
      startVisualization()
    } catch (err) {
      console.error('Microphone access denied:', err)
    }
  }

  const stopMic = () => {
    if (sourceRef.current && 'mediaStream' in sourceRef.current) {
      const stream = (sourceRef.current as MediaStreamAudioSourceNode).mediaStream
      stream.getTracks().forEach(track => track.stop())
    }
    setIsMicActive(false)
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
  }

  const startVisualization = useCallback(() => {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    if (!canvas || !analyser) return

    const ctx = canvas.getContext('2d')!
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const colors = VISUALIZER_COLORS[colorScheme].colors

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      switch (visualizerType) {
        case 'bars':
          drawBars(ctx, dataArray, bufferLength, canvas, colors)
          break
        case 'wave':
          drawWave(ctx, dataArray, bufferLength, canvas, colors)
          break
        case 'circle':
          drawCircle(ctx, dataArray, bufferLength, canvas, colors)
          break
        case 'particles':
          drawParticles(ctx, dataArray, bufferLength, canvas, colors)
          break
      }
    }

    draw()
  }, [visualizerType, colorScheme])

  const drawBars = (
    ctx: CanvasRenderingContext2D,
    dataArray: Uint8Array,
    bufferLength: number,
    canvas: HTMLCanvasElement,
    colors: string[]
  ) => {
    const barWidth = (canvas.width / bufferLength) * 2.5
    let x = 0

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height * 0.8

      const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight)
      gradient.addColorStop(0, colors[0])
      gradient.addColorStop(0.5, colors[1])
      gradient.addColorStop(1, colors[2])

      ctx.fillStyle = gradient
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight)

      // Mirror
      ctx.fillStyle = `${colors[0]}33`
      ctx.fillRect(x, 0, barWidth - 2, barHeight * 0.3)

      x += barWidth
    }
  }

  const drawWave = (
    ctx: CanvasRenderingContext2D,
    dataArray: Uint8Array,
    bufferLength: number,
    canvas: HTMLCanvasElement,
    colors: string[]
  ) => {
    ctx.lineWidth = 3
    ctx.strokeStyle = colors[0]
    ctx.beginPath()

    const sliceWidth = canvas.width / bufferLength
    let x = 0

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0
      const y = (v * canvas.height) / 2

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      x += sliceWidth
    }

    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()

    // Second wave with offset
    ctx.strokeStyle = colors[1]
    ctx.beginPath()
    x = 0
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0
      const y = canvas.height - (v * canvas.height) / 2

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      x += sliceWidth
    }
    ctx.stroke()
  }

  const drawCircle = (
    ctx: CanvasRenderingContext2D,
    dataArray: Uint8Array,
    bufferLength: number,
    canvas: HTMLCanvasElement,
    colors: string[]
  ) => {
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) * 0.25

    for (let i = 0; i < bufferLength; i++) {
      const amplitude = dataArray[i] / 255
      const angle = (i / bufferLength) * Math.PI * 2
      const barHeight = amplitude * radius

      const x1 = centerX + Math.cos(angle) * radius
      const y1 = centerY + Math.sin(angle) * radius
      const x2 = centerX + Math.cos(angle) * (radius + barHeight)
      const y2 = centerY + Math.sin(angle) * (radius + barHeight)

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
      gradient.addColorStop(0, colors[0])
      gradient.addColorStop(1, colors[2])

      ctx.strokeStyle = gradient
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    // Center glow
    const avg = dataArray.reduce((a, b) => a + b, 0) / bufferLength
    const glowRadius = (avg / 255) * radius * 0.5 + radius * 0.3

    const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius)
    glow.addColorStop(0, colors[1])
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2)
    ctx.fill()
  }

  const drawParticles = (
    ctx: CanvasRenderingContext2D,
    dataArray: Uint8Array,
    bufferLength: number,
    canvas: HTMLCanvasElement,
    colors: string[]
  ) => {
    const avg = dataArray.reduce((a, b) => a + b, 0) / bufferLength
    const particleCount = Math.floor(avg / 5)

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 5 + 2
      const colorIndex = Math.floor(Math.random() * colors.length)

      ctx.fillStyle = colors[colorIndex]
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  useEffect(() => {
    if (isPlaying || isMicActive) {
      startVisualization()
    }
    return () => cancelAnimationFrame(animationRef.current)
  }, [isPlaying, isMicActive, startVisualization])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-500 text-sm font-medium mb-4">
          <Music className="w-4 h-4" />
          Audio Visualizer
        </div>
        <h2 className="text-3xl font-bold mb-2">Music Visualizer</h2>
        <p className="text-muted-foreground">
          Upload music or use your microphone to see beautiful audio visualizations.
        </p>
      </div>

      {/* Canvas */}
      <div className="rounded-xl border border-border overflow-hidden bg-black mb-6">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full"
        />
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={audioFile || undefined} onEnded={() => setIsPlaying(false)} />

      {/* Controls */}
      <div className="space-y-6">
        {/* Upload & Mic */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Music
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={isMicActive ? stopMic : startMic}
            className={`px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 ${
              isMicActive
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {isMicActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isMicActive ? 'Stop Mic' : 'Use Microphone'}
          </button>
        </div>

        {/* Playback Controls */}
        {audioFile && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={togglePlay}
              className="p-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg hover:bg-muted"
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
              className="w-24"
            />

            {fileName && (
              <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                {fileName}
              </span>
            )}
          </div>
        )}

        {/* Visualizer Type */}
        <div className="flex flex-wrap justify-center gap-2">
          {(['bars', 'wave', 'circle', 'particles'] as VisualizerType[]).map((type) => (
            <button
              key={type}
              onClick={() => setVisualizerType(type)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                visualizerType === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Color Schemes */}
        <div className="flex flex-wrap justify-center gap-2">
          {VISUALIZER_COLORS.map((scheme, index) => (
            <button
              key={scheme.name}
              onClick={() => setColorScheme(index)}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2 ${
                colorScheme === index
                  ? 'bg-muted ring-2 ring-primary'
                  : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              <div className="flex gap-0.5">
                {scheme.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {scheme.name}
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <strong>Tip:</strong> Use headphones for best experience with microphone input.
        </p>
      </div>
    </div>
  )
}

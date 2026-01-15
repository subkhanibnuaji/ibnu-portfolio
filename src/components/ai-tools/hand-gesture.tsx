'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, Loader2, Video, Hand } from 'lucide-react'

type HandPoseModule = typeof import('@tensorflow-models/hand-pose-detection')
type TensorFlowModule = typeof import('@tensorflow/tfjs')

const FINGER_INDICES = {
  thumb: [0, 1, 2, 3, 4],
  index: [0, 5, 6, 7, 8],
  middle: [0, 9, 10, 11, 12],
  ring: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20]
}

const GESTURE_EMOJIS: { [key: string]: string } = {
  'thumbs_up': '👍',
  'thumbs_down': '👎',
  'victory': '✌️',
  'rock': '🤘',
  'open_palm': '🖐️',
  'fist': '✊',
  'pointing': '👆',
  'ok': '👌',
  'unknown': '❓'
}

export function HandGesture() {
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const [progress, setProgress] = useState('')
  const [gesture, setGesture] = useState<string>('unknown')
  const [handData, setHandData] = useState<any>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const modelRef = useRef<any>(null)
  const animationRef = useRef<number>(0)

  const loadModel = useCallback(async () => {
    if (modelRef.current) return modelRef.current

    setIsModelLoading(true)
    setProgress('Loading TensorFlow.js...')

    try {
      const tf: TensorFlowModule = await import('@tensorflow/tfjs')
      await tf.ready()
      setProgress('Loading Hand Detection model...')

      const handPose: HandPoseModule = await import('@tensorflow-models/hand-pose-detection')
      const model = handPose.SupportedModels.MediaPipeHands
      const detector = await handPose.createDetector(model, {
        runtime: 'tfjs',
        modelType: 'lite',
        maxHands: 2
      })

      modelRef.current = detector
      setProgress('')
      setIsModelLoading(false)
      return detector
    } catch (error) {
      console.error('Failed to load model:', error)
      setProgress('Failed to load model')
      setIsModelLoading(false)
      throw error
    }
  }, [])

  const detectGesture = (keypoints: any[]): string => {
    if (!keypoints || keypoints.length < 21) return 'unknown'

    // Get finger tip and base positions
    const thumbTip = keypoints[4]
    const indexTip = keypoints[8]
    const middleTip = keypoints[12]
    const ringTip = keypoints[16]
    const pinkyTip = keypoints[20]
    const wrist = keypoints[0]

    const thumbBase = keypoints[2]
    const indexBase = keypoints[5]
    const middleBase = keypoints[9]
    const ringBase = keypoints[13]
    const pinkyBase = keypoints[17]

    // Check if fingers are extended (tip is further from wrist than base)
    const thumbExtended = thumbTip.x < thumbBase.x // Thumb extends sideways
    const indexExtended = indexTip.y < indexBase.y
    const middleExtended = middleTip.y < middleBase.y
    const ringExtended = ringTip.y < ringBase.y
    const pinkyExtended = pinkyTip.y < pinkyBase.y

    // Detect gestures
    // Thumbs up: Only thumb extended, pointing up
    if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      if (thumbTip.y < thumbBase.y) return 'thumbs_up'
      if (thumbTip.y > thumbBase.y) return 'thumbs_down'
    }

    // Victory/Peace: Index and middle extended
    if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
      return 'victory'
    }

    // Rock: Index and pinky extended
    if (indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
      return 'rock'
    }

    // Open palm: All fingers extended
    if (indexExtended && middleExtended && ringExtended && pinkyExtended) {
      return 'open_palm'
    }

    // Fist: No fingers extended
    if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      return 'fist'
    }

    // Pointing: Only index extended
    if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      return 'pointing'
    }

    // OK sign: Thumb and index close together
    const thumbIndexDist = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) + Math.pow(thumbTip.y - indexTip.y, 2)
    )
    if (thumbIndexDist < 30 && middleExtended && ringExtended && pinkyExtended) {
      return 'ok'
    }

    return 'unknown'
  }

  const drawHand = (ctx: CanvasRenderingContext2D, hand: any) => {
    const keypoints = hand.keypoints

    // Draw connections
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
      [5, 9], [9, 13], [13, 17] // Palm
    ]

    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3

    connections.forEach(([start, end]) => {
      const startPoint = keypoints[start]
      const endPoint = keypoints[end]
      if (startPoint && endPoint) {
        ctx.beginPath()
        ctx.moveTo(startPoint.x, startPoint.y)
        ctx.lineTo(endPoint.x, endPoint.y)
        ctx.stroke()
      }
    })

    // Draw keypoints
    keypoints.forEach((point: any, index: number) => {
      // Color by finger
      let color = '#22c55e'
      if (index <= 4) color = '#ef4444' // Thumb - red
      else if (index <= 8) color = '#f97316' // Index - orange
      else if (index <= 12) color = '#eab308' // Middle - yellow
      else if (index <= 16) color = '#22c55e' // Ring - green
      else color = '#3b82f6' // Pinky - blue

      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  const startWebcam = async () => {
    try {
      setProgress('Starting webcam...')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setIsWebcamActive(true)
        setProgress('')

        await loadModel()

        const detectLoop = async () => {
          if (!videoRef.current || !canvasRef.current || !modelRef.current) return

          const canvas = canvasRef.current
          const ctx = canvas.getContext('2d')
          if (!ctx) return

          canvas.width = videoRef.current.videoWidth
          canvas.height = videoRef.current.videoHeight

          // Mirror the video
          ctx.translate(canvas.width, 0)
          ctx.scale(-1, 1)
          ctx.drawImage(videoRef.current, 0, 0)
          ctx.setTransform(1, 0, 0, 1, 0, 0)

          try {
            const hands = await modelRef.current.estimateHands(videoRef.current, {
              flipHorizontal: true
            })

            if (hands.length > 0) {
              hands.forEach((hand: any) => {
                drawHand(ctx, hand)
              })
              setHandData(hands[0])
              const detectedGesture = detectGesture(hands[0].keypoints)
              setGesture(detectedGesture)
            } else {
              setHandData(null)
              setGesture('unknown')
            }
          } catch (e) {
            // Ignore detection errors
          }

          animationRef.current = requestAnimationFrame(detectLoop)
        }

        detectLoop()
      }
    } catch (error) {
      console.error('Error starting webcam:', error)
      setProgress('Could not access webcam')
    }
  }

  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    cancelAnimationFrame(animationRef.current)
    setIsWebcamActive(false)
    setHandData(null)
    setGesture('unknown')
  }

  useEffect(() => {
    return () => stopWebcam()
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-500 text-sm font-medium mb-4">
          <Hand className="w-4 h-4" />
          MediaPipe Hands
        </div>
        <h2 className="text-3xl font-bold mb-2">Hand Gesture Recognition</h2>
        <p className="text-muted-foreground">
          Detect hand gestures in real-time. Shows thumbs up, peace sign, fist, and more.
        </p>
      </div>

      {/* Webcam View */}
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Video */}
          <div className="md:col-span-2">
            <div className="aspect-video rounded-xl border border-border overflow-hidden bg-black relative">
              <video ref={videoRef} className="hidden" playsInline muted />
              <canvas ref={canvasRef} className="w-full h-full object-contain" />

              {!isWebcamActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Gesture Display */}
          <div className="space-y-4">
            <div className="p-6 rounded-xl border border-border bg-card text-center">
              <div className="text-6xl mb-2">{GESTURE_EMOJIS[gesture]}</div>
              <h3 className="text-xl font-bold capitalize">
                {gesture.replace('_', ' ')}
              </h3>
              <p className="text-sm text-muted-foreground">Detected Gesture</p>
            </div>

            {handData && (
              <div className="p-4 rounded-xl border border-border bg-muted/30">
                <h4 className="text-sm font-medium mb-2">Hand Info</h4>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <p>Handedness: {handData.handedness}</p>
                  <p>Confidence: {(handData.score * 100).toFixed(1)}%</p>
                  <p>Keypoints: 21</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {progress && (
          <div className="text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">{progress}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isWebcamActive ? (
            <button
              onClick={startWebcam}
              disabled={isModelLoading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Start Webcam
            </button>
          ) : (
            <button
              onClick={stopWebcam}
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 inline-flex items-center gap-2"
            >
              Stop
            </button>
          )}
        </div>

        {/* Gesture Guide */}
        <div className="p-4 rounded-lg bg-muted/30">
          <h3 className="font-medium mb-3 text-center">Supported Gestures</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(GESTURE_EMOJIS).filter(([k]) => k !== 'unknown').map(([name, emoji]) => (
              <div key={name} className="text-center">
                <div className="text-2xl">{emoji}</div>
                <p className="text-xs text-muted-foreground capitalize">{name.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <strong>Privacy:</strong> All processing happens locally in your browser.
        </p>
      </div>
    </div>
  )
}

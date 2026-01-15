'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Camera, Loader2, RefreshCw, Video, Sparkles } from 'lucide-react'

type PoseDetectionModule = typeof import('@tensorflow-models/pose-detection')
type TensorFlowModule = typeof import('@tensorflow/tfjs')

interface Keypoint {
  name: string
  x: number
  y: number
  score: number
}

const KEYPOINT_CONNECTIONS = [
  ['nose', 'left_eye'], ['nose', 'right_eye'],
  ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'], ['right_shoulder', 'right_elbow'],
  ['left_elbow', 'left_wrist'], ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
  ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
]

export function PoseEstimation() {
  const [mode, setMode] = useState<'image' | 'webcam'>('image')
  const [image, setImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const [progress, setProgress] = useState('')
  const [poseData, setPoseData] = useState<any>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const modelRef = useRef<any>(null)
  const animationRef = useRef<number>(0)

  // Load model
  const loadModel = useCallback(async () => {
    if (modelRef.current) return modelRef.current

    setIsModelLoading(true)
    setProgress('Loading TensorFlow.js...')

    try {
      const tf: TensorFlowModule = await import('@tensorflow/tfjs')
      await tf.ready()
      setProgress('Loading MoveNet model...')

      const poseDetection: PoseDetectionModule = await import('@tensorflow-models/pose-detection')
      const model = poseDetection.SupportedModels.MoveNet
      const detector = await poseDetection.createDetector(model, {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setPoseData(null)
    }
    reader.readAsDataURL(file)
  }

  const detectPose = async (source: HTMLImageElement | HTMLVideoElement) => {
    const detector = await loadModel()
    const poses = await detector.estimatePoses(source)
    return poses[0] || null
  }

  const drawPose = (ctx: CanvasRenderingContext2D, pose: any, _width: number, _height: number) => {
    if (!pose?.keypoints) return

    const keypoints = pose.keypoints as Keypoint[]
    const keypointMap = new Map<string, Keypoint>(keypoints.map((kp) => [kp.name, kp]))

    // Draw connections
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3

    KEYPOINT_CONNECTIONS.forEach(([start, end]) => {
      const startPoint = keypointMap.get(start)
      const endPoint = keypointMap.get(end)

      if (startPoint && endPoint && startPoint.score > 0.3 && endPoint.score > 0.3) {
        ctx.beginPath()
        ctx.moveTo(startPoint.x, startPoint.y)
        ctx.lineTo(endPoint.x, endPoint.y)
        ctx.stroke()
      }
    })

    // Draw keypoints
    keypoints.forEach((kp: Keypoint) => {
      if (kp.score > 0.3) {
        ctx.fillStyle = '#22c55e'
        ctx.beginPath()
        ctx.arc(kp.x, kp.y, 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(kp.x, kp.y, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    })
  }

  const processImage = async () => {
    if (!image || !canvasRef.current) return

    setIsLoading(true)
    setProgress('Detecting pose...')

    try {
      const img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = image
      })

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = img.width
      canvas.height = img.height

      // Draw image
      ctx.drawImage(img, 0, 0)

      // Detect pose
      const pose = await detectPose(img)
      setPoseData(pose)

      // Draw pose
      if (pose) {
        drawPose(ctx, pose, canvas.width, canvas.height)
      }

      setProgress('')
    } catch (error) {
      console.error('Error detecting pose:', error)
      setProgress('Error processing image')
    } finally {
      setIsLoading(false)
    }
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

        // Start detection loop
        const detector = await loadModel()

        const detectLoop = async () => {
          if (!videoRef.current || !canvasRef.current || !isWebcamActive) return

          const canvas = canvasRef.current
          const ctx = canvas.getContext('2d')
          if (!ctx) return

          canvas.width = videoRef.current.videoWidth
          canvas.height = videoRef.current.videoHeight

          // Draw video frame
          ctx.drawImage(videoRef.current, 0, 0)

          // Detect and draw pose
          const pose = await detectPose(videoRef.current)
          if (pose) {
            drawPose(ctx, pose, canvas.width, canvas.height)
            setPoseData(pose)
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
    setPoseData(null)
  }

  const reset = () => {
    stopWebcam()
    setImage(null)
    setPoseData(null)
    setProgress('')
  }

  useEffect(() => {
    return () => {
      stopWebcam()
    }
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          MoveNet Model
        </div>
        <h2 className="text-3xl font-bold mb-2">Pose Estimation</h2>
        <p className="text-muted-foreground">
          Detect human body poses in real-time using AI. Tracks 17 key body points.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => { reset(); setMode('image') }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'image' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Image
        </button>
        <button
          onClick={() => { reset(); setMode('webcam') }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'webcam' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <Camera className="w-4 h-4 inline mr-2" />
          Webcam
        </button>
      </div>

      {/* Image Mode */}
      {mode === 'image' && (
        <>
          {!image ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Upload an image with a person</p>
              <p className="text-sm text-muted-foreground">Best results with full body visible</p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div className="aspect-video rounded-xl border border-border overflow-hidden bg-muted/30 flex items-center justify-center">
                <canvas ref={canvasRef} className="max-w-full max-h-full" />
              </div>

              {(isLoading || isModelLoading) && progress && (
                <div className="text-center">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">{progress}</p>
                </div>
              )}

              <div className="flex justify-center gap-4">
                <button
                  onClick={processImage}
                  disabled={isLoading || isModelLoading}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Detect Pose
                </button>
                <button onClick={reset} className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent inline-flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  New Image
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Webcam Mode */}
      {mode === 'webcam' && (
        <div className="space-y-6">
          <div className="aspect-video rounded-xl border border-border overflow-hidden bg-black relative">
            <video ref={videoRef} className="hidden" playsInline muted />
            <canvas ref={canvasRef} className="w-full h-full object-contain" />

            {!isWebcamActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {progress && (
            <div className="text-center">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">{progress}</p>
            </div>
          )}

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
        </div>
      )}

      {/* Pose Data Display */}
      {poseData && (
        <div className="mt-6 p-4 rounded-lg bg-muted/30">
          <h3 className="font-medium mb-2">Detected Keypoints: {poseData.keypoints?.filter((kp: any) => kp.score > 0.3).length || 0}/17</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
            {poseData.keypoints?.slice(0, 12).map((kp: any) => (
              <div
                key={kp.name}
                className={`p-2 rounded ${kp.score > 0.3 ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'}`}
              >
                {kp.name?.replace('_', ' ')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <strong>Privacy:</strong> All processing happens locally. No data is sent to any server.
        </p>
      </div>
    </div>
  )
}

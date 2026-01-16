'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Camera, Loader2, RefreshCw, Video, Sparkles, Smile } from 'lucide-react'

type FaceLandmarksModule = typeof import('@tensorflow-models/face-landmarks-detection')
type TensorFlowModule = typeof import('@tensorflow/tfjs')

// MediaPipe FaceMesh provides 468 facial landmarks
const FACE_MESH_CONNECTIONS = {
  // Lips outer
  lipsOuter: [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 61],
  // Lips inner
  lipsInner: [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 78],
  // Left eye
  leftEye: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246, 33],
  // Right eye
  rightEye: [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398, 362],
  // Left eyebrow
  leftEyebrow: [70, 63, 105, 66, 107, 55, 65, 52, 53, 46],
  // Right eyebrow
  rightEyebrow: [300, 293, 334, 296, 336, 285, 295, 282, 283, 276],
  // Face oval
  faceOval: [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10],
  // Nose
  nose: [168, 6, 197, 195, 5, 4, 1, 19, 94, 2]
}

export function FaceLandmark() {
  const [mode, setMode] = useState<'image' | 'webcam'>('image')
  const [image, setImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const [progress, setProgress] = useState('')
  const [faceData, setFaceData] = useState<any>(null)
  const [showMesh, setShowMesh] = useState(true)
  const [showContours, setShowContours] = useState(true)

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
      setProgress('Loading Face Landmarks model...')

      const faceLandmarks: FaceLandmarksModule = await import('@tensorflow-models/face-landmarks-detection')
      const model = faceLandmarks.SupportedModels.MediaPipeFaceMesh
      const detector = await faceLandmarks.createDetector(model, {
        runtime: 'tfjs',
        refineLandmarks: true,
        maxFaces: 1
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
      setFaceData(null)
    }
    reader.readAsDataURL(file)
  }

  const detectFace = async (source: HTMLImageElement | HTMLVideoElement) => {
    const detector = await loadModel()
    const faces = await detector.estimateFaces(source)
    return faces[0] || null
  }

  const drawLandmarks = (ctx: CanvasRenderingContext2D, face: any) => {
    if (!face?.keypoints) return

    const keypoints = face.keypoints

    // Draw mesh points
    if (showMesh) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.6)'
      keypoints.forEach((point: any) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    // Draw contours
    if (showContours) {
      Object.entries(FACE_MESH_CONNECTIONS).forEach(([name, indices]) => {
        let color = '#3b82f6'
        let lineWidth = 2

        switch (name) {
          case 'lipsOuter':
          case 'lipsInner':
            color = '#ec4899'
            break
          case 'leftEye':
          case 'rightEye':
            color = '#22c55e'
            lineWidth = 2
            break
          case 'leftEyebrow':
          case 'rightEyebrow':
            color = '#f97316'
            break
          case 'faceOval':
            color = '#8b5cf6'
            lineWidth = 3
            break
          case 'nose':
            color = '#06b6d4'
            break
        }

        ctx.strokeStyle = color
        ctx.lineWidth = lineWidth
        ctx.beginPath()

        indices.forEach((index, i) => {
          const point = keypoints[index]
          if (point) {
            if (i === 0) {
              ctx.moveTo(point.x, point.y)
            } else {
              ctx.lineTo(point.x, point.y)
            }
          }
        })

        ctx.stroke()
      })
    }
  }

  const processImage = async () => {
    if (!image || !canvasRef.current) return

    setIsLoading(true)
    setProgress('Detecting face landmarks...')

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

      // Detect face
      const face = await detectFace(img)
      setFaceData(face)

      // Draw landmarks
      if (face) {
        drawLandmarks(ctx, face)
      }

      setProgress('')
    } catch (error) {
      console.error('Error detecting face:', error)
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
        await loadModel()

        const detectLoop = async () => {
          if (!videoRef.current || !canvasRef.current || !isWebcamActive) return

          const canvas = canvasRef.current
          const ctx = canvas.getContext('2d')
          if (!ctx) return

          canvas.width = videoRef.current.videoWidth
          canvas.height = videoRef.current.videoHeight

          // Draw video frame
          ctx.drawImage(videoRef.current, 0, 0)

          // Detect and draw face
          const face = await detectFace(videoRef.current)
          if (face) {
            drawLandmarks(ctx, face)
            setFaceData(face)
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
    setFaceData(null)
  }

  const reset = () => {
    stopWebcam()
    setImage(null)
    setFaceData(null)
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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-500 text-sm font-medium mb-4">
          <Smile className="w-4 h-4" />
          MediaPipe FaceMesh
        </div>
        <h2 className="text-3xl font-bold mb-2">Face Landmark Detection</h2>
        <p className="text-muted-foreground">
          Detect 468 facial landmarks in real-time. Track eyes, lips, eyebrows, and face contours.
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

      {/* Display Options */}
      <div className="flex justify-center gap-4 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showMesh}
            onChange={(e) => setShowMesh(e.target.checked)}
            className="rounded border-border"
          />
          <span className="text-sm">Show Mesh Points</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showContours}
            onChange={(e) => setShowContours(e.target.checked)}
            className="rounded border-border"
          />
          <span className="text-sm">Show Contours</span>
        </label>
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
              <p className="text-lg font-medium mb-2">Upload an image with a face</p>
              <p className="text-sm text-muted-foreground">Clear front-facing photos work best</p>
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
                  Detect Landmarks
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

      {/* Face Data Display */}
      {faceData && (
        <div className="mt-6 p-4 rounded-lg bg-muted/30">
          <h3 className="font-medium mb-3">Detected: {faceData.keypoints?.length || 0} Landmarks</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
              <div className="text-pink-500 font-medium">Lips</div>
              <div className="text-sm text-muted-foreground">40 points</div>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-green-500 font-medium">Eyes</div>
              <div className="text-sm text-muted-foreground">32 points each</div>
            </div>
            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="text-orange-500 font-medium">Eyebrows</div>
              <div className="text-sm text-muted-foreground">10 points each</div>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="text-purple-500 font-medium">Face Oval</div>
              <div className="text-sm text-muted-foreground">36 points</div>
            </div>
            <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <div className="text-cyan-500 font-medium">Nose</div>
              <div className="text-sm text-muted-foreground">10 points</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="text-blue-500 font-medium">Total</div>
              <div className="text-sm text-muted-foreground">468 points</div>
            </div>
          </div>
        </div>
      )}

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

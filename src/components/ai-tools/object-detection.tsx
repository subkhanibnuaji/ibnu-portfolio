'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Camera, Loader2, RefreshCw, Video, Sparkles, Box } from 'lucide-react'

type CocoSsdModule = typeof import('@tensorflow-models/coco-ssd')
type TensorFlowModule = typeof import('@tensorflow/tfjs')

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#06b6d4'
]

export function ObjectDetection() {
  const [mode, setMode] = useState<'image' | 'webcam'>('image')
  const [image, setImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const [progress, setProgress] = useState('')
  const [detections, setDetections] = useState<any[]>([])

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
      setProgress('Loading COCO-SSD model...')

      const cocoSsd: CocoSsdModule = await import('@tensorflow-models/coco-ssd')
      const model = await cocoSsd.load({
        base: 'lite_mobilenet_v2'
      })

      modelRef.current = model
      setProgress('')
      setIsModelLoading(false)
      return model
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
      setDetections([])
    }
    reader.readAsDataURL(file)
  }

  const drawDetections = (ctx: CanvasRenderingContext2D, predictions: any[]) => {
    predictions.forEach((prediction, index) => {
      const [x, y, width, height] = prediction.bbox
      const color = COLORS[index % COLORS.length]

      // Draw bounding box
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.strokeRect(x, y, width, height)

      // Draw label background
      const label = `${prediction.class} ${Math.round(prediction.score * 100)}%`
      ctx.font = '16px sans-serif'
      const textWidth = ctx.measureText(label).width

      ctx.fillStyle = color
      ctx.fillRect(x, y - 25, textWidth + 10, 25)

      // Draw label text
      ctx.fillStyle = '#ffffff'
      ctx.fillText(label, x + 5, y - 7)
    })
  }

  const detectObjects = async (source: HTMLImageElement | HTMLVideoElement) => {
    const model = await loadModel()
    const predictions = await model.detect(source)
    return predictions
  }

  const processImage = async () => {
    if (!image || !canvasRef.current) return

    setIsLoading(true)
    setProgress('Detecting objects...')

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

      // Detect objects
      const predictions = await detectObjects(img)
      setDetections(predictions)

      // Draw detections
      drawDetections(ctx, predictions)

      setProgress('')
    } catch (error) {
      console.error('Error detecting objects:', error)
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

        await loadModel()

        const detectLoop = async () => {
          if (!videoRef.current || !canvasRef.current || !isWebcamActive) return

          const canvas = canvasRef.current
          const ctx = canvas.getContext('2d')
          if (!ctx) return

          canvas.width = videoRef.current.videoWidth
          canvas.height = videoRef.current.videoHeight

          ctx.drawImage(videoRef.current, 0, 0)

          const predictions = await detectObjects(videoRef.current)
          drawDetections(ctx, predictions)
          setDetections(predictions)

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
    setDetections([])
  }

  const reset = () => {
    stopWebcam()
    setImage(null)
    setDetections([])
    setProgress('')
  }

  useEffect(() => {
    return () => stopWebcam()
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-500 text-sm font-medium mb-4">
          <Box className="w-4 h-4" />
          COCO-SSD Model
        </div>
        <h2 className="text-3xl font-bold mb-2">Object Detection</h2>
        <p className="text-muted-foreground">
          Detect and identify 80+ types of objects in images or real-time video.
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
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Upload an image</p>
              <p className="text-sm text-muted-foreground">Detects 80+ object categories</p>
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
                  Detect Objects
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
              <button onClick={startWebcam} disabled={isModelLoading} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Start Webcam
              </button>
            ) : (
              <button onClick={stopWebcam} className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 inline-flex items-center gap-2">
                Stop
              </button>
            )}
          </div>
        </div>
      )}

      {/* Detections List */}
      {detections.length > 0 && (
        <div className="mt-6 p-4 rounded-lg bg-muted/30">
          <h3 className="font-medium mb-3">Detected Objects ({detections.length})</h3>
          <div className="flex flex-wrap gap-2">
            {detections.map((det, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              >
                {det.class} ({Math.round(det.score * 100)}%)
              </span>
            ))}
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

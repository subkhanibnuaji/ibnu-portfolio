'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Download, Loader2, RefreshCw, ImageIcon, Sparkles } from 'lucide-react'

type BodyPixModule = typeof import('@tensorflow-models/body-pix')
type TensorFlowModule = typeof import('@tensorflow/tfjs')

export function BackgroundRemoval() {
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [bgColor, setBgColor] = useState<string>('transparent')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const modelRef = useRef<any>(null)

  // Load model on demand
  const loadModel = useCallback(async () => {
    if (modelRef.current) return modelRef.current

    setIsModelLoading(true)
    setProgress('Loading TensorFlow.js...')

    try {
      const tf: TensorFlowModule = await import('@tensorflow/tfjs')
      await tf.ready()
      setProgress('Loading BodyPix model...')

      const bodyPix: BodyPixModule = await import('@tensorflow-models/body-pix')
      const model = await bodyPix.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2
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
      setResult(null)
    }
    reader.readAsDataURL(file)
  }

  const removeBackground = async () => {
    if (!image || !canvasRef.current) return

    setIsLoading(true)
    setProgress('Processing...')

    try {
      const model = await loadModel()

      // Create image element
      const img = new Image()
      img.crossOrigin = 'anonymous'

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

      setProgress('Segmenting person...')

      // Perform segmentation
      const segmentation = await model.segmentPerson(img, {
        flipHorizontal: false,
        internalResolution: 'medium',
        segmentationThreshold: 0.7
      })

      // Draw original image
      ctx.drawImage(img, 0, 0)

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      setProgress('Removing background...')

      // Remove background based on segmentation
      for (let i = 0; i < segmentation.data.length; i++) {
        if (segmentation.data[i] === 0) {
          // Not a person - make transparent or use bg color
          const idx = i * 4
          if (bgColor === 'transparent') {
            data[idx + 3] = 0 // Alpha = 0
          } else {
            // Convert hex to RGB
            const hex = bgColor.replace('#', '')
            data[idx] = parseInt(hex.substring(0, 2), 16)
            data[idx + 1] = parseInt(hex.substring(2, 4), 16)
            data[idx + 2] = parseInt(hex.substring(4, 6), 16)
            data[idx + 3] = 255
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)
      setResult(canvas.toDataURL('image/png'))
      setProgress('')
    } catch (error) {
      console.error('Error removing background:', error)
      setProgress('Error processing image')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadResult = () => {
    if (!result) return
    const link = document.createElement('a')
    link.download = 'background-removed.png'
    link.href = result
    link.click()
  }

  const reset = () => {
    setImage(null)
    setResult(null)
    setProgress('')
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-500 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          Powered by TensorFlow.js
        </div>
        <h2 className="text-3xl font-bold mb-2">Background Removal</h2>
        <p className="text-muted-foreground">
          Remove background from photos instantly using AI. All processing happens in your browser - your images never leave your device.
        </p>
      </div>

      {/* Background Color Options */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <span className="text-sm text-muted-foreground">Background:</span>
        <div className="flex gap-2">
          {[
            { value: 'transparent', label: 'Transparent', style: 'bg-[url(/checkered.svg)]' },
            { value: '#ffffff', label: 'White', style: 'bg-white' },
            { value: '#000000', label: 'Black', style: 'bg-black' },
            { value: '#3b82f6', label: 'Blue', style: 'bg-blue-500' },
            { value: '#22c55e', label: 'Green', style: 'bg-green-500' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setBgColor(option.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${option.style} ${
                bgColor === option.value ? 'border-primary scale-110' : 'border-border'
              }`}
              title={option.label}
            />
          ))}
        </div>
      </div>

      {/* Upload Area */}
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
          <p className="text-lg font-medium mb-2">Drop an image here or click to upload</p>
          <p className="text-sm text-muted-foreground">Supports JPG, PNG, WebP</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Image Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Original */}
            <div className="space-y-2">
              <h3 className="font-medium text-center">Original</h3>
              <div className="aspect-square rounded-xl border border-border overflow-hidden bg-muted/30 flex items-center justify-center">
                <img
                  src={image}
                  alt="Original"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            {/* Result */}
            <div className="space-y-2">
              <h3 className="font-medium text-center">Result</h3>
              <div
                className="aspect-square rounded-xl border border-border overflow-hidden flex items-center justify-center"
                style={{
                  backgroundImage: bgColor === 'transparent'
                    ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' fill-opacity=\'.1\'%3E%3Crect x=\'0\' y=\'0\' width=\'10\' height=\'10\' fill=\'%23000\'/%3E%3Crect x=\'10\' y=\'10\' width=\'10\' height=\'10\' fill=\'%23000\'/%3E%3C/svg%3E")'
                    : 'none',
                  backgroundColor: bgColor !== 'transparent' ? bgColor : 'transparent'
                }}
              >
                {result ? (
                  <img
                    src={result}
                    alt="Result"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Click &quot;Remove Background&quot; to process</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Progress */}
          {(isLoading || isModelLoading) && progress && (
            <div className="text-center py-4">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">{progress}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={removeBackground}
              disabled={isLoading || isModelLoading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Remove Background
                </>
              )}
            </button>

            {result && (
              <button
                onClick={downloadResult}
                className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>
            )}

            <button
              onClick={reset}
              className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              New Image
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <strong>Privacy:</strong> All processing happens locally in your browser. No images are uploaded to any server.
        </p>
      </div>
    </div>
  )
}

'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, Loader2, RefreshCw, Sparkles, Palette, Wand2 } from 'lucide-react'

// Artistic style presets using CSS filters and canvas manipulation
const STYLE_PRESETS = [
  {
    id: 'oil-painting',
    name: 'Oil Painting',
    description: 'Classic oil paint texture',
    filters: { contrast: 1.2, saturation: 1.3, brightness: 1.05 },
    effect: 'oil'
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Soft watercolor wash',
    filters: { contrast: 0.9, saturation: 1.4, brightness: 1.1 },
    effect: 'watercolor'
  },
  {
    id: 'pencil-sketch',
    name: 'Pencil Sketch',
    description: 'Hand-drawn pencil effect',
    filters: { contrast: 1.5, saturation: 0, brightness: 1.2 },
    effect: 'sketch'
  },
  {
    id: 'pop-art',
    name: 'Pop Art',
    description: 'Bold Warhol-style colors',
    filters: { contrast: 1.5, saturation: 2, brightness: 1.1 },
    effect: 'pop'
  },
  {
    id: 'vintage',
    name: 'Vintage Film',
    description: 'Nostalgic sepia tones',
    filters: { contrast: 1.1, saturation: 0.8, brightness: 1.05 },
    effect: 'vintage'
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    description: 'Cyberpunk neon effect',
    filters: { contrast: 1.4, saturation: 1.8, brightness: 0.9 },
    effect: 'neon'
  },
  {
    id: 'impressionist',
    name: 'Impressionist',
    description: 'Monet-inspired brushwork',
    filters: { contrast: 1.1, saturation: 1.2, brightness: 1.05 },
    effect: 'impressionist'
  },
  {
    id: 'comic',
    name: 'Comic Book',
    description: 'Bold outlines and colors',
    filters: { contrast: 1.6, saturation: 1.4, brightness: 1 },
    effect: 'comic'
  }
]

export function StyleTransfer() {
  const [image, setImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState(STYLE_PRESETS[0])
  const [progress, setProgress] = useState('')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setProcessedImage(null)
    }
    reader.readAsDataURL(file)
  }

  // Apply oil painting effect
  const applyOilPainting = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    const radius = 4
    const intensity = 20

    const tempData = new Uint8ClampedArray(data)

    for (let y = radius; y < height - radius; y++) {
      for (let x = radius; x < width - radius; x++) {
        const intensityCount: number[] = new Array(intensity + 1).fill(0)
        const avgR: number[] = new Array(intensity + 1).fill(0)
        const avgG: number[] = new Array(intensity + 1).fill(0)
        const avgB: number[] = new Array(intensity + 1).fill(0)

        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const idx = ((y + dy) * width + (x + dx)) * 4
            const curIntensity = Math.floor(
              ((tempData[idx] + tempData[idx + 1] + tempData[idx + 2]) / 3) * intensity / 255
            )
            intensityCount[curIntensity]++
            avgR[curIntensity] += tempData[idx]
            avgG[curIntensity] += tempData[idx + 1]
            avgB[curIntensity] += tempData[idx + 2]
          }
        }

        let maxCount = 0
        let maxIndex = 0
        for (let i = 0; i <= intensity; i++) {
          if (intensityCount[i] > maxCount) {
            maxCount = intensityCount[i]
            maxIndex = i
          }
        }

        const idx = (y * width + x) * 4
        data[idx] = avgR[maxIndex] / maxCount
        data[idx + 1] = avgG[maxIndex] / maxCount
        data[idx + 2] = avgB[maxIndex] / maxCount
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  // Apply watercolor effect
  const applyWatercolor = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    // Simple blur pass
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = width
    tempCanvas.height = height
    const tempCtx = tempCanvas.getContext('2d')!
    tempCtx.putImageData(imageData, 0, 0)

    ctx.filter = 'blur(2px)'
    ctx.drawImage(tempCanvas, 0, 0)
    ctx.filter = 'none'

    // Add texture
    const newImageData = ctx.getImageData(0, 0, width, height)
    const newData = newImageData.data

    for (let i = 0; i < newData.length; i += 4) {
      const noise = (Math.random() - 0.5) * 20
      newData[i] = Math.min(255, Math.max(0, newData[i] + noise))
      newData[i + 1] = Math.min(255, Math.max(0, newData[i + 1] + noise))
      newData[i + 2] = Math.min(255, Math.max(0, newData[i + 2] + noise))
    }

    ctx.putImageData(newImageData, 0, 0)
  }

  // Apply pencil sketch effect
  const applySketch = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    // Convert to grayscale and apply edge detection
    const grayscale = new Float32Array(width * height)

    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
      grayscale[i / 4] = gray
    }

    // Sobel edge detection
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x

        const gx =
          -grayscale[(y - 1) * width + (x - 1)] + grayscale[(y - 1) * width + (x + 1)] +
          -2 * grayscale[y * width + (x - 1)] + 2 * grayscale[y * width + (x + 1)] +
          -grayscale[(y + 1) * width + (x - 1)] + grayscale[(y + 1) * width + (x + 1)]

        const gy =
          -grayscale[(y - 1) * width + (x - 1)] - 2 * grayscale[(y - 1) * width + x] - grayscale[(y - 1) * width + (x + 1)] +
          grayscale[(y + 1) * width + (x - 1)] + 2 * grayscale[(y + 1) * width + x] + grayscale[(y + 1) * width + (x + 1)]

        const magnitude = Math.sqrt(gx * gx + gy * gy)
        const pixelIdx = idx * 4
        const inverted = 255 - Math.min(255, magnitude)

        data[pixelIdx] = inverted
        data[pixelIdx + 1] = inverted
        data[pixelIdx + 2] = inverted
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  // Apply pop art effect
  const applyPopArt = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    // Posterize colors
    const levels = 4
    const step = 255 / levels

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(data[i] / step) * step
      data[i + 1] = Math.round(data[i + 1] / step) * step
      data[i + 2] = Math.round(data[i + 2] / step) * step
    }

    ctx.putImageData(imageData, 0, 0)
  }

  // Apply vintage effect
  const applyVintage = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      // Sepia tone
      data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189)
      data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168)
      data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131)
    }

    ctx.putImageData(imageData, 0, 0)

    // Add vignette
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 1.5
    )
    gradient.addColorStop(0, 'rgba(0,0,0,0)')
    gradient.addColorStop(1, 'rgba(0,0,0,0.5)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  // Apply neon effect
  const applyNeon = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      // Boost colors and add glow effect
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      // Find dominant color and boost it
      const max = Math.max(r, g, b)
      if (r === max) {
        data[i] = Math.min(255, r * 1.5)
        data[i + 1] = g * 0.3
        data[i + 2] = Math.min(255, b * 1.2)
      } else if (g === max) {
        data[i] = r * 0.3
        data[i + 1] = Math.min(255, g * 1.5)
        data[i + 2] = Math.min(255, b * 1.2)
      } else {
        data[i] = Math.min(255, r * 1.2)
        data[i + 1] = g * 0.3
        data[i + 2] = Math.min(255, b * 1.5)
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  // Apply impressionist effect (simplified)
  const applyImpressionist = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = width
    tempCanvas.height = height
    const tempCtx = tempCanvas.getContext('2d')!
    tempCtx.putImageData(imageData, 0, 0)

    // Clear and redraw with "brush strokes"
    ctx.fillStyle = '#f5f5dc'
    ctx.fillRect(0, 0, width, height)

    const brushSize = 6
    for (let y = 0; y < height; y += brushSize) {
      for (let x = 0; x < width; x += brushSize) {
        const pixel = tempCtx.getImageData(x, y, 1, 1).data
        ctx.fillStyle = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`

        // Random brush stroke direction
        const angle = Math.random() * Math.PI * 2
        const length = brushSize + Math.random() * 4

        ctx.beginPath()
        ctx.ellipse(
          x + Math.random() * brushSize,
          y + Math.random() * brushSize,
          length / 2,
          brushSize / 3,
          angle,
          0,
          Math.PI * 2
        )
        ctx.fill()
      }
    }
  }

  // Apply comic book effect
  const applyComic = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // First posterize
    applyPopArt(ctx, width, height)

    // Then add edge detection overlay
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    // Simple edge detection
    const edges = new Uint8ClampedArray(width * height)

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4
        const idxLeft = (y * width + (x - 1)) * 4
        const idxRight = (y * width + (x + 1)) * 4
        const idxUp = ((y - 1) * width + x) * 4
        const idxDown = ((y + 1) * width + x) * 4

        const gx = Math.abs(data[idxRight] - data[idxLeft])
        const gy = Math.abs(data[idxDown] - data[idxUp])

        edges[y * width + x] = gx + gy > 50 ? 0 : 255
      }
    }

    // Apply edges
    for (let i = 0; i < edges.length; i++) {
      if (edges[i] === 0) {
        data[i * 4] = 0
        data[i * 4 + 1] = 0
        data[i * 4 + 2] = 0
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const applyStyle = useCallback(async () => {
    if (!image || !canvasRef.current) return

    setIsLoading(true)
    setProgress('Applying style...')

    try {
      const img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = image
      })

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')!

      // Scale down large images for performance
      const maxSize = 800
      let width = img.width
      let height = img.height

      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = (height / width) * maxSize
          width = maxSize
        } else {
          width = (width / height) * maxSize
          height = maxSize
        }
      }

      canvas.width = width
      canvas.height = height

      // Draw original image
      ctx.drawImage(img, 0, 0, width, height)

      // Apply base filters
      const { contrast, saturation, brightness } = selectedStyle.filters
      ctx.filter = `contrast(${contrast}) saturate(${saturation}) brightness(${brightness})`
      ctx.drawImage(canvas, 0, 0)
      ctx.filter = 'none'

      // Apply specific effect
      setProgress(`Applying ${selectedStyle.name} effect...`)

      switch (selectedStyle.effect) {
        case 'oil':
          applyOilPainting(ctx, width, height)
          break
        case 'watercolor':
          applyWatercolor(ctx, width, height)
          break
        case 'sketch':
          applySketch(ctx, width, height)
          break
        case 'pop':
          applyPopArt(ctx, width, height)
          break
        case 'vintage':
          applyVintage(ctx, width, height)
          break
        case 'neon':
          applyNeon(ctx, width, height)
          break
        case 'impressionist':
          applyImpressionist(ctx, width, height)
          break
        case 'comic':
          applyComic(ctx, width, height)
          break
      }

      setProcessedImage(canvas.toDataURL('image/png'))
      setProgress('')
    } catch (error) {
      console.error('Error applying style:', error)
      setProgress('Error processing image')
    } finally {
      setIsLoading(false)
    }
  }, [image, selectedStyle])

  const downloadImage = () => {
    if (!processedImage) return
    const link = document.createElement('a')
    link.download = `styled-${selectedStyle.id}.png`
    link.href = processedImage
    link.click()
  }

  const reset = () => {
    setImage(null)
    setProcessedImage(null)
    setProgress('')
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-500 text-sm font-medium mb-4">
          <Palette className="w-4 h-4" />
          Artistic Styles
        </div>
        <h2 className="text-3xl font-bold mb-2">Style Transfer</h2>
        <p className="text-muted-foreground">
          Transform your photos into artistic masterpieces with various art styles.
        </p>
      </div>

      {/* Style Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3 text-center">Choose a Style</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STYLE_PRESETS.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedStyle.id === style.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <p className="font-medium text-sm">{style.name}</p>
              <p className="text-xs text-muted-foreground">{style.description}</p>
            </button>
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
          <p className="text-lg font-medium mb-2">Upload an image to stylize</p>
          <p className="text-sm text-muted-foreground">
            Selected style: {selectedStyle.name}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Image Display */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Original */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-center">Original</h3>
              <div className="aspect-square rounded-xl border border-border overflow-hidden bg-muted/30 flex items-center justify-center">
                <img
                  src={image}
                  alt="Original"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            {/* Styled */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-center">
                {selectedStyle.name} Style
              </h3>
              <div className="aspect-square rounded-xl border border-border overflow-hidden bg-muted/30 flex items-center justify-center">
                {processedImage ? (
                  <img
                    src={processedImage}
                    alt="Styled"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Wand2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Click "Apply Style" to transform</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Loading State */}
          {isLoading && progress && (
            <div className="text-center">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">{progress}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={applyStyle}
              disabled={isLoading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Apply Style
            </button>

            {processedImage && (
              <button
                onClick={downloadImage}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 inline-flex items-center gap-2"
              >
                Download
              </button>
            )}

            <button
              onClick={reset}
              className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent inline-flex items-center gap-2"
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
          <strong>Privacy:</strong> All processing happens locally in your browser.
        </p>
      </div>
    </div>
  )
}

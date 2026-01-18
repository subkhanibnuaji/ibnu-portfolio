'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Image, Download, Upload, Trash2, FileImage, Zap, Settings } from 'lucide-react'

interface CompressedImage {
  original: {
    name: string
    size: number
    url: string
    width: number
    height: number
  }
  compressed: {
    size: number
    url: string
    width: number
    height: number
  }
  savings: number
}

export function ImageCompressor() {
  const [images, setImages] = useState<CompressedImage[]>([])
  const [quality, setQuality] = useState(80)
  const [maxWidth, setMaxWidth] = useState(1920)
  const [maxHeight, setMaxHeight] = useState(1080)
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg')
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const compressImage = async (file: File): Promise<CompressedImage> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new window.Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)

            const mimeType = format === 'jpeg' ? 'image/jpeg' :
                           format === 'png' ? 'image/png' : 'image/webp'

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const compressedUrl = URL.createObjectURL(blob)
                  resolve({
                    original: {
                      name: file.name,
                      size: file.size,
                      url: e.target?.result as string,
                      width: img.width,
                      height: img.height
                    },
                    compressed: {
                      size: blob.size,
                      url: compressedUrl,
                      width,
                      height
                    },
                    savings: Math.round((1 - blob.size / file.size) * 100)
                  })
                }
              },
              mimeType,
              quality / 100
            )
          }
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setIsProcessing(true)

    const newImages: CompressedImage[] = []
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        const compressed = await compressImage(file)
        newImages.push(compressed)
      }
    }

    setImages(prev => [...prev, ...newImages])
    setIsProcessing(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const downloadImage = (image: CompressedImage) => {
    const link = document.createElement('a')
    const ext = format === 'jpeg' ? 'jpg' : format
    const baseName = image.original.name.replace(/\.[^/.]+$/, '')
    link.download = `${baseName}_compressed.${ext}`
    link.href = image.compressed.url
    link.click()
  }

  const downloadAll = () => {
    images.forEach(img => downloadImage(img))
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const clearAll = () => {
    setImages([])
  }

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const totalOriginalSize = images.reduce((acc, img) => acc + img.original.size, 0)
  const totalCompressedSize = images.reduce((acc, img) => acc + img.compressed.size, 0)
  const totalSavings = totalOriginalSize > 0
    ? Math.round((1 - totalCompressedSize / totalOriginalSize) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Compression Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Quality: {quality}%</label>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-full mt-2"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Max Width</label>
            <input
              type="number"
              value={maxWidth}
              onChange={(e) => setMaxWidth(parseInt(e.target.value) || 1920)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Max Height</label>
            <input
              type="number"
              value={maxHeight}
              onChange={(e) => setMaxHeight(parseInt(e.target.value) || 1080)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'jpeg' | 'png' | 'webp')}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="p-12 rounded-xl border-2 border-dashed border-border bg-card hover:border-primary transition-colors text-center">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">Drop images here or click to upload</p>
          <p className="text-sm text-muted-foreground">Supports JPEG, PNG, GIF, WebP</p>
        </div>
      </div>

      {/* Stats */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card text-center">
            <FileImage className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{images.length}</p>
            <p className="text-sm text-muted-foreground">Images</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card text-center">
            <Image className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{formatSize(totalOriginalSize)}</p>
            <p className="text-sm text-muted-foreground">Original Size</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card text-center">
            <Zap className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{formatSize(totalCompressedSize)}</p>
            <p className="text-sm text-muted-foreground">Compressed Size</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card text-center">
            <Download className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold text-green-500">{totalSavings}%</p>
            <p className="text-sm text-muted-foreground">Space Saved</p>
          </div>
        </div>
      )}

      {/* Actions */}
      {images.length > 0 && (
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadAll}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
          >
            <Download className="w-5 h-5" />
            Download All
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={clearAll}
            className="px-6 py-3 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-500/10"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="p-8 rounded-xl border border-border bg-card text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Compressing images...</p>
        </div>
      )}

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl border border-border bg-card"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Preview */}
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={image.compressed.url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h4 className="font-medium mb-2 truncate">{image.original.name}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Original</p>
                      <p className="font-medium">{formatSize(image.original.size)}</p>
                      <p className="text-xs text-muted-foreground">{image.original.width}×{image.original.height}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Compressed</p>
                      <p className="font-medium">{formatSize(image.compressed.size)}</p>
                      <p className="text-xs text-muted-foreground">{image.compressed.width}×{image.compressed.height}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Saved</p>
                      <p className={`font-bold ${image.savings > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {image.savings}%
                      </p>
                    </div>
                    <div className="flex items-end gap-2">
                      <button
                        onClick={() => downloadImage(image)}
                        className="p-2 bg-primary text-primary-foreground rounded-lg"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeImage(index)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

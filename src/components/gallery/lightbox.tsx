'use client'

import { useEffect, useState, useCallback, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Maximize2,
  Grid3X3,
  Info,
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================
interface LightboxImage {
  src: string
  alt?: string
  title?: string
  description?: string
  width?: number
  height?: number
}

interface LightboxContextValue {
  open: (images: LightboxImage[], startIndex?: number) => void
  close: () => void
}

// ============================================
// CONTEXT
// ============================================
const LightboxContext = createContext<LightboxContextValue | null>(null)

export function useLightbox() {
  const context = useContext(LightboxContext)
  if (!context) {
    throw new Error('useLightbox must be used within LightboxProvider')
  }
  return context
}

// ============================================
// PROVIDER
// ============================================
export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [images, setImages] = useState<LightboxImage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [showThumbnails, setShowThumbnails] = useState(false)

  const open = useCallback((imgs: LightboxImage[], startIndex = 0) => {
    setImages(imgs)
    setCurrentIndex(startIndex)
    setIsOpen(true)
    setZoom(1)
    setRotation(0)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setZoom(1)
    setRotation(0)
    setShowInfo(false)
    setShowThumbnails(false)
  }, [])

  const next = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % images.length)
    setZoom(1)
    setRotation(0)
  }, [images.length])

  const prev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length)
    setZoom(1)
    setRotation(0)
  }, [images.length])

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.5, 4))
  }, [])

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.5, 0.5))
  }, [])

  const rotate = useCallback(() => {
    setRotation(prev => (prev + 90) % 360)
  }, [])

  const downloadImage = useCallback(async () => {
    const image = images[currentIndex]
    try {
      const response = await fetch(image.src)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = image.title || `image-${currentIndex + 1}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }, [images, currentIndex])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          close()
          break
        case 'ArrowRight':
          next()
          break
        case 'ArrowLeft':
          prev()
          break
        case '+':
        case '=':
          zoomIn()
          break
        case '-':
          zoomOut()
          break
        case 'r':
          rotate()
          break
        case 'i':
          setShowInfo(prev => !prev)
          break
        case 'g':
          setShowThumbnails(prev => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, close, next, prev, zoomIn, zoomOut, rotate])

  const currentImage = images[currentIndex]

  return (
    <LightboxContext.Provider value={{ open, close }}>
      {children}

      <AnimatePresence>
        {isOpen && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 text-white">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {currentIndex + 1} / {images.length}
                </span>
                {currentImage.title && (
                  <span className="font-medium">{currentImage.title}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={zoomOut}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title="Zoom out (-)"
                >
                  <ZoomOut className="h-5 w-5" />
                </button>
                <span className="text-sm min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title="Zoom in (+)"
                >
                  <ZoomIn className="h-5 w-5" />
                </button>
                <button
                  onClick={rotate}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title="Rotate (R)"
                >
                  <RotateCw className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowThumbnails(prev => !prev)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    showThumbnails ? 'bg-white/20' : 'hover:bg-white/10'
                  )}
                  title="Thumbnails (G)"
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowInfo(prev => !prev)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    showInfo ? 'bg-white/20' : 'hover:bg-white/10'
                  )}
                  title="Info (I)"
                >
                  <Info className="h-5 w-5" />
                </button>
                <button
                  onClick={downloadImage}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title="Download"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={close}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title="Close (Esc)"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 relative flex items-center justify-center p-4">
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    title="Previous (←)"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    title="Next (→)"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
                </>
              )}

              {/* Image */}
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative max-w-full max-h-full overflow-hidden"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease-out',
                }}
              >
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt || ''}
                  width={currentImage.width || 1200}
                  height={currentImage.height || 800}
                  className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
                  priority
                />
              </motion.div>

              {/* Info Panel */}
              <AnimatePresence>
                {showInfo && currentImage.description && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-72 p-4 rounded-xl bg-black/80 backdrop-blur-sm text-white"
                  >
                    {currentImage.title && (
                      <h3 className="font-bold mb-2">{currentImage.title}</h3>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {currentImage.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Thumbnails */}
            <AnimatePresence>
              {showThumbnails && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="p-4 bg-black/50"
                >
                  <div className="flex gap-2 overflow-x-auto justify-center">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentIndex(i)
                          setZoom(1)
                          setRotation(0)
                        }}
                        className={cn(
                          'relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all',
                          i === currentIndex
                            ? 'ring-2 ring-primary scale-110'
                            : 'opacity-50 hover:opacity-100'
                        )}
                      >
                        <Image
                          src={img.src}
                          alt={img.alt || ''}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  )
}

// ============================================
// LIGHTBOX IMAGE COMPONENT
// ============================================
interface LightboxImageProps {
  src: string
  alt?: string
  title?: string
  description?: string
  className?: string
  width?: number
  height?: number
  gallery?: LightboxImage[]
  index?: number
}

export function LightboxImage({
  src,
  alt,
  title,
  description,
  className,
  width = 400,
  height = 300,
  gallery,
  index = 0,
}: LightboxImageProps) {
  const { open } = useLightbox()

  const handleClick = () => {
    const images = gallery || [{ src, alt, title, description, width, height }]
    open(images, index)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden rounded-lg group cursor-zoom-in',
        className
      )}
    >
      <Image
        src={src}
        alt={alt || ''}
        width={width}
        height={height}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
        <Maximize2 className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  )
}

// ============================================
// GALLERY GRID
// ============================================
interface GalleryGridProps {
  images: LightboxImage[]
  columns?: number
  className?: string
}

export function GalleryGrid({ images, columns = 3, className }: GalleryGridProps) {
  const { open } = useLightbox()

  return (
    <div
      className={cn('grid gap-4', className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {images.map((image, i) => (
        <button
          key={i}
          onClick={() => open(images, i)}
          className="relative aspect-square overflow-hidden rounded-xl group cursor-zoom-in"
        >
          <Image
            src={image.src}
            alt={image.alt || ''}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-3 left-3 right-3">
              {image.title && (
                <p className="text-white font-medium text-sm truncate">
                  {image.title}
                </p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

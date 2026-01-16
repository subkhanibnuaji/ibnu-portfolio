'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, Loader2, RefreshCw, QrCode, Copy, ExternalLink, Check } from 'lucide-react'
import jsQR from 'jsqr'

export function QRScanner() {
  const [mode, setMode] = useState<'camera' | 'upload'>('camera')
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const animationRef = useRef<number>(0)

  const startScanning = async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 640, height: 480 }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setIsScanning(true)

        const scanLoop = () => {
          if (!videoRef.current || !canvasRef.current) return

          const canvas = canvasRef.current
          const ctx = canvas.getContext('2d')
          if (!ctx) return

          canvas.width = videoRef.current.videoWidth
          canvas.height = videoRef.current.videoHeight
          ctx.drawImage(videoRef.current, 0, 0)

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          })

          if (code) {
            // Draw detection box
            ctx.strokeStyle = '#22c55e'
            ctx.lineWidth = 4
            ctx.beginPath()
            ctx.moveTo(code.location.topLeftCorner.x, code.location.topLeftCorner.y)
            ctx.lineTo(code.location.topRightCorner.x, code.location.topRightCorner.y)
            ctx.lineTo(code.location.bottomRightCorner.x, code.location.bottomRightCorner.y)
            ctx.lineTo(code.location.bottomLeftCorner.x, code.location.bottomLeftCorner.y)
            ctx.closePath()
            ctx.stroke()

            setResult(code.data)
            stopScanning()
            return
          }

          animationRef.current = requestAnimationFrame(scanLoop)
        }

        scanLoop()
      }
    } catch (err) {
      console.error('Camera error:', err)
      setError('Could not access camera. Please check permissions.')
    }
  }

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    cancelAnimationFrame(animationRef.current)
    setIsScanning(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setResult(null)

    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth'
      })

      if (code) {
        setResult(code.data)

        // Draw detection box
        ctx.strokeStyle = '#22c55e'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(code.location.topLeftCorner.x, code.location.topLeftCorner.y)
        ctx.lineTo(code.location.topRightCorner.x, code.location.topRightCorner.y)
        ctx.lineTo(code.location.bottomRightCorner.x, code.location.bottomRightCorner.y)
        ctx.lineTo(code.location.bottomLeftCorner.x, code.location.bottomLeftCorner.y)
        ctx.closePath()
        ctx.stroke()
      } else {
        setError('No QR code found in image')
      }
    }
    img.src = URL.createObjectURL(file)
  }

  const copyToClipboard = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isURL = (str: string) => {
    try {
      new URL(str)
      return true
    } catch {
      return false
    }
  }

  const reset = () => {
    stopScanning()
    setResult(null)
    setError('')
  }

  useEffect(() => {
    return () => stopScanning()
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium mb-4">
          <QrCode className="w-4 h-4" />
          QR Scanner
        </div>
        <h2 className="text-3xl font-bold mb-2">QR Code Scanner</h2>
        <p className="text-muted-foreground">
          Scan QR codes using your camera or upload an image.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => { reset(); setMode('camera') }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'camera' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <Camera className="w-4 h-4 inline mr-2" />
          Camera
        </button>
        <button
          onClick={() => { reset(); setMode('upload') }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'upload' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Upload
        </button>
      </div>

      <div className="space-y-6">
        {/* Scanner View */}
        <div className="aspect-video rounded-xl border border-border overflow-hidden bg-black relative">
          <video ref={videoRef} className="hidden" playsInline muted />
          <canvas ref={canvasRef} className="w-full h-full object-contain" />

          {!isScanning && mode === 'camera' && !result && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <QrCode className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p>Click "Start Scanning" to begin</p>
              </div>
            </div>
          )}

          {mode === 'upload' && !result && (
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="text-center text-muted-foreground">
                <Upload className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p>Click to upload QR code image</p>
              </div>
            </div>
          )}

          {isScanning && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-primary rounded-lg relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-primary"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-center">
            {error}
          </div>
        )}

        {/* Result Display */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 rounded-xl border border-green-500/20 bg-green-500/5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-green-500 mb-2">QR Code Detected</h3>
                  <p className="text-foreground break-all">{result}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  {isURL(result) && (
                    <a
                      href={result}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
                      title="Open link"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {mode === 'camera' && (
            <>
              {!isScanning ? (
                <button
                  onClick={startScanning}
                  disabled={!!result}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Start Scanning
                </button>
              ) : (
                <button
                  onClick={stopScanning}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 inline-flex items-center gap-2"
                >
                  Stop
                </button>
              )}
            </>
          )}

          {result && (
            <button
              onClick={reset}
              className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Scan Another
            </button>
          )}
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

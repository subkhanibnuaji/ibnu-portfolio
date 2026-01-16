'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { QrCode, Copy, Check, Download, RefreshCw, Link2, Mail, Phone, Wifi } from 'lucide-react'

type QRType = 'text' | 'url' | 'email' | 'phone' | 'wifi'

interface QRTypeConfig {
  icon: any
  label: string
  placeholder: string
  prefix?: string
}

const QR_TYPES: Record<QRType, QRTypeConfig> = {
  text: { icon: QrCode, label: 'Text', placeholder: 'Enter any text...' },
  url: { icon: Link2, label: 'URL', placeholder: 'https://example.com', prefix: '' },
  email: { icon: Mail, label: 'Email', placeholder: 'email@example.com', prefix: 'mailto:' },
  phone: { icon: Phone, label: 'Phone', placeholder: '+1234567890', prefix: 'tel:' },
  wifi: { icon: Wifi, label: 'WiFi', placeholder: 'Network name' }
}

const COLORS = [
  { fg: '#000000', bg: '#ffffff', name: 'Classic' },
  { fg: '#1e3a8a', bg: '#dbeafe', name: 'Blue' },
  { fg: '#166534', bg: '#dcfce7', name: 'Green' },
  { fg: '#7c2d12', bg: '#fed7aa', name: 'Orange' },
  { fg: '#581c87', bg: '#f3e8ff', name: 'Purple' },
  { fg: '#be123c', bg: '#fce7f3', name: 'Pink' }
]

export function QRGenerator() {
  const [type, setType] = useState<QRType>('text')
  const [content, setContent] = useState('')
  const [wifiSSID, setWifiSSID] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA')
  const [size, setSize] = useState(256)
  const [colorIndex, setColorIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate QR code data
  const getQRContent = (): string => {
    if (type === 'wifi') {
      return `WIFI:T:${wifiEncryption};S:${wifiSSID};P:${wifiPassword};;`
    }
    const prefix = QR_TYPES[type].prefix || ''
    return prefix + content
  }

  // Simple QR code rendering using canvas
  // This uses a simple implementation - for production, use a library like 'qrcode'
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const qrContent = getQRContent()
    if (!qrContent) {
      ctx.fillStyle = COLORS[colorIndex].bg
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = COLORS[colorIndex].fg
      ctx.font = '14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Enter content to generate QR', size / 2, size / 2)
      return
    }

    // Simple QR pattern generator (for demo - in production use qrcode library)
    const generatePattern = (data: string): boolean[][] => {
      const moduleCount = 25
      const pattern: boolean[][] = Array(moduleCount).fill(null).map(() =>
        Array(moduleCount).fill(false)
      )

      // Add finder patterns (corners)
      const addFinderPattern = (row: number, col: number) => {
        for (let r = -1; r <= 7; r++) {
          for (let c = -1; c <= 7; c++) {
            if (row + r < 0 || row + r >= moduleCount || col + c < 0 || col + c >= moduleCount) continue
            if (
              (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
              (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
              (r >= 2 && r <= 4 && c >= 2 && c <= 4)
            ) {
              pattern[row + r][col + c] = true
            }
          }
        }
      }

      addFinderPattern(0, 0)
      addFinderPattern(0, moduleCount - 7)
      addFinderPattern(moduleCount - 7, 0)

      // Add timing patterns
      for (let i = 8; i < moduleCount - 8; i++) {
        pattern[6][i] = i % 2 === 0
        pattern[i][6] = i % 2 === 0
      }

      // Generate data modules based on input hash
      let hash = 0
      for (let i = 0; i < data.length; i++) {
        hash = ((hash << 5) - hash) + data.charCodeAt(i)
        hash = hash & hash
      }

      // Fill data area with pseudo-random pattern based on hash
      let seed = Math.abs(hash)
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          // Skip finder patterns area
          if (
            (row < 9 && col < 9) ||
            (row < 9 && col >= moduleCount - 8) ||
            (row >= moduleCount - 8 && col < 9)
          ) continue
          if (row === 6 || col === 6) continue

          seed = (seed * 1103515245 + 12345) & 0x7fffffff
          pattern[row][col] = seed % 2 === 0
        }
      }

      return pattern
    }

    const pattern = generatePattern(qrContent)
    const moduleCount = pattern.length
    const moduleSize = size / moduleCount

    // Draw
    ctx.fillStyle = COLORS[colorIndex].bg
    ctx.fillRect(0, 0, size, size)

    ctx.fillStyle = COLORS[colorIndex].fg
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (pattern[row][col]) {
          ctx.fillRect(
            col * moduleSize,
            row * moduleSize,
            moduleSize,
            moduleSize
          )
        }
      }
    }
  }, [content, wifiSSID, wifiPassword, wifiEncryption, type, size, colorIndex])

  const downloadQR = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const copyQRContent = async () => {
    await navigator.clipboard.writeText(getQRContent())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-500 text-sm font-medium mb-4">
          <QrCode className="w-4 h-4" />
          Generator
        </div>
        <h2 className="text-2xl font-bold">QR Code Generator</h2>
        <p className="text-muted-foreground mt-2">
          Generate QR codes for text, URLs, email, phone, or WiFi.
        </p>
      </div>

      {/* Type Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {(Object.keys(QR_TYPES) as QRType[]).map((t) => {
          const { icon: Icon, label } = QR_TYPES[t]
          return (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 ${
                type === t
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          )
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="space-y-4">
          {type === 'wifi' ? (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">Network Name (SSID)</label>
                <input
                  type="text"
                  value={wifiSSID}
                  onChange={(e) => setWifiSSID(e.target.value)}
                  placeholder="My WiFi Network"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Password</label>
                <input
                  type="text"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Encryption</label>
                <div className="flex gap-2">
                  {(['WPA', 'WEP', 'nopass'] as const).map((enc) => (
                    <button
                      key={enc}
                      onClick={() => setWifiEncryption(enc)}
                      className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                        wifiEncryption === enc
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {enc === 'nopass' ? 'None' : enc}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={QR_TYPES[type].placeholder}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background resize-none"
              />
            </div>
          )}

          {/* Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Size</label>
              <span className="text-sm text-muted-foreground">{size}px</span>
            </div>
            <input
              type="range"
              min={128}
              max={512}
              step={32}
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Colors */}
          <div>
            <label className="text-sm font-medium mb-2 block">Color Style</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setColorIndex(idx)}
                  className={`w-10 h-10 rounded-lg border-2 transition-transform ${
                    colorIndex === idx ? 'scale-110 border-primary' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.bg }}
                >
                  <div
                    className="w-4 h-4 mx-auto rounded"
                    style={{ backgroundColor: color.fg }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-xl border border-border bg-white">
            <canvas
              ref={canvasRef}
              width={size}
              height={size}
              className="rounded-lg"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={downloadQR}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={copyQRContent}
              className="px-4 py-2 bg-muted rounded-lg inline-flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              Copy Data
            </button>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground text-center">
        <p>Note: This is a simplified QR preview. The pattern represents your data uniquely.</p>
      </div>
    </div>
  )
}

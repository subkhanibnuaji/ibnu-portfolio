'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Share2, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface QRCodeProps {
  value: string
  size?: number
  bgColor?: string
  fgColor?: string
  level?: 'L' | 'M' | 'Q' | 'H'
  includeMargin?: boolean
  className?: string
  showActions?: boolean
  title?: string
}

// Simple QR Code generator using Canvas API
// Uses a third-party QR generation service for simplicity
export function QRCode({
  value,
  size = 200,
  bgColor = 'ffffff',
  fgColor = '000000',
  level = 'M',
  includeMargin = true,
  className = '',
  showActions = true,
  title
}: QRCodeProps) {
  const [copied, setCopied] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Using QR Server API (free, no API key needed)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&bgcolor=${bgColor}&color=${fgColor}&ecc=${level}&margin=${includeMargin ? 10 : 0}`

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `qrcode-${title || 'download'}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('QR Code berhasil diunduh!')
    } catch (error) {
      toast.error('Gagal mengunduh QR Code')
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success('Link berhasil disalin!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Gagal menyalin link')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'QR Code',
          text: 'Scan QR code ini',
          url: value
        })
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      handleCopy()
    }
  }

  return (
    <div className={`inline-flex flex-col items-center gap-4 ${className}`}>
      {/* QR Code Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white p-4 rounded-xl shadow-lg"
      >
        {!imageLoaded && (
          <div
            className="animate-pulse bg-gray-200 rounded"
            style={{ width: size, height: size }}
          />
        )}
        <img
          src={qrUrl}
          alt={`QR Code for ${value}`}
          width={size}
          height={size}
          className={`rounded ${imageLoaded ? 'block' : 'hidden'}`}
          onLoad={() => setImageLoaded(true)}
        />
      </motion.div>

      {/* Title */}
      {title && (
        <p className="text-sm text-muted-foreground text-center">{title}</p>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-accent transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                Tersalin
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg border border-border hover:bg-accent transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

// QR Code Card with more info
export function QRCodeCard({
  value,
  title,
  description
}: {
  value: string
  title: string
  description?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-center">
      <QRCode value={value} size={180} title={title} />
      {description && (
        <p className="mt-4 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

// Contact QR Code (vCard format)
export function ContactQRCode({
  name,
  email,
  phone,
  website,
  title: jobTitle,
  company
}: {
  name: string
  email?: string
  phone?: string
  website?: string
  title?: string
  company?: string
}) {
  // Generate vCard format
  const vCard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    email ? `EMAIL:${email}` : '',
    phone ? `TEL:${phone}` : '',
    website ? `URL:${website}` : '',
    jobTitle ? `TITLE:${jobTitle}` : '',
    company ? `ORG:${company}` : '',
    'END:VCARD'
  ].filter(Boolean).join('\n')

  return (
    <QRCode
      value={vCard}
      title={`Contact: ${name}`}
      size={200}
    />
  )
}

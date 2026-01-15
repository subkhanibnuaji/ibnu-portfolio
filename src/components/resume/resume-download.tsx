'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Download,
  Eye,
  Check,
  Loader2,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ResumeDownloadProps {
  className?: string
  variant?: 'button' | 'card' | 'inline'
}

export function ResumeDownload({ className, variant = 'button' }: ResumeDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // Resume URL - replace with actual resume file
  const resumeUrl = '/resume/Subkhan_Ibnu_Aji_Resume.pdf'

  const handleDownload = async () => {
    setIsDownloading(true)

    // Simulate download preparation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create download link
    const link = document.createElement('a')
    link.href = resumeUrl
    link.download = 'Subkhan_Ibnu_Aji_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setIsDownloading(false)
    setDownloaded(true)

    // Reset downloaded state after 3 seconds
    setTimeout(() => setDownloaded(false), 3000)
  }

  const handlePreview = () => {
    window.open(resumeUrl, '_blank')
  }

  if (variant === 'button') {
    return (
      <Button
        onClick={handleDownload}
        disabled={isDownloading}
        className={cn('gap-2', className)}
        variant="outline"
      >
        {isDownloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : downloaded ? (
          <Check className="h-4 w-4 text-cyber-green" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {downloaded ? 'Downloaded!' : 'Download Resume'}
      </Button>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          size="sm"
          variant="outline"
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : downloaded ? (
            <Check className="h-4 w-4 text-cyber-green" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </Button>
        <Button onClick={handlePreview} size="sm" variant="ghost">
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // Card variant
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('glass rounded-xl p-6', className)}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-cyber-cyan/10">
            <FileText className="h-6 w-6 text-cyber-cyan" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Download My Resume</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get a detailed overview of my experience, skills, and achievements.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                variant="gradient"
                size="sm"
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : downloaded ? (
                  <Check className="h-4 w-4 mr-2 text-cyber-green" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {downloaded ? 'Downloaded!' : 'Download PDF'}
              </Button>
              <Button onClick={handlePreview} variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-lg font-bold text-cyber-cyan">5+</p>
            <p className="text-xs text-muted-foreground">Years Experience</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-cyber-purple">50+</p>
            <p className="text-xs text-muted-foreground">Projects</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-cyber-green">2</p>
            <p className="text-xs text-muted-foreground">Degrees</p>
          </div>
        </div>
      </motion.div>
    </>
  )
}

// Floating Resume Button for easy access
export function FloatingResumeButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const resumeUrl = '/resume/Subkhan_Ibnu_Aji_Resume.pdf'

  const handleDownload = async () => {
    setIsDownloading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const link = document.createElement('a')
    link.href = resumeUrl
    link.download = 'Subkhan_Ibnu_Aji_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setIsDownloading(false)
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-14 right-0 glass rounded-lg p-4 w-64 mb-2"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm">Resume</h4>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                size="sm"
                variant="gradient"
                className="flex-1"
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </>
                )}
              </Button>
              <Button
                onClick={() => window.open(resumeUrl, '_blank')}
                size="sm"
                variant="outline"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors',
          isOpen
            ? 'bg-cyber-cyan text-background'
            : 'glass hover:border-cyber-cyan/50'
        )}
      >
        <FileText className="h-5 w-5" />
      </motion.button>
    </div>
  )
}

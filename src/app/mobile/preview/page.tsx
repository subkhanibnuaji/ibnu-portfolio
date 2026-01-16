'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import {
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  ExternalLink,
  ArrowLeft,
  Maximize2,
  Info
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type ViewMode = 'mobile' | 'tablet' | 'desktop'

const viewModes: { mode: ViewMode; icon: typeof Smartphone; label: string; width: string }[] = [
  { mode: 'mobile', icon: Smartphone, label: 'Mobile', width: '375px' },
  { mode: 'tablet', icon: Tablet, label: 'Tablet', width: '768px' },
  { mode: 'desktop', icon: Monitor, label: 'Desktop', width: '100%' }
]

// URL untuk Expo web app - served from same domain as static HTML
const MOBILE_APP_URL = '/mobile-app/index.html'

export default function MobilePreviewPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('mobile')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [key, setKey] = useState(0)

  const currentMode = viewModes.find(v => v.mode === viewMode)!

  const handleRefresh = () => {
    setIsLoading(true)
    setHasError(false)
    setKey(prev => prev + 1)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <PageLayout
      title="Mobile App Preview"
      subtitle="Live preview of the mobile portfolio app"
      showBadge
      badgeText="Beta"
    >
      <div className="container">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 mb-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Back Button */}
            <Link href="/mobile">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Mobile
              </Button>
            </Link>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              {viewModes.map((v) => {
                const Icon = v.icon
                return (
                  <button
                    key={v.mode}
                    onClick={() => setViewMode(v.mode)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
                      viewMode === v.mode
                        ? 'bg-background text-foreground shadow'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{v.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleRefresh} className="gap-2">
                <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <a href={MOBILE_APP_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">Open</span>
                </Button>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Preview Frame */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <div
            className={cn(
              'glass rounded-2xl overflow-hidden transition-all duration-300',
              viewMode === 'desktop' ? 'w-full' : ''
            )}
            style={{
              width: viewMode === 'desktop' ? '100%' : currentMode.width,
              maxWidth: '100%'
            }}
          >
            {/* Browser Bar */}
            <div className="bg-muted/50 border-b border-border px-4 py-2 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 bg-muted rounded-md px-3 py-1 text-xs text-muted-foreground truncate">
                ibnu-portfolio-ashen.vercel.app/mobile-app
              </div>
            </div>

            {/* Content */}
            <div
              className="relative bg-zinc-950"
              style={{
                height: viewMode === 'mobile' ? '667px' : viewMode === 'tablet' ? '1024px' : '600px'
              }}
            >
              {/* Loading State */}
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-10">
                  <RefreshCw className="h-8 w-8 text-cyber-cyan animate-spin mb-4" />
                  <p className="text-muted-foreground">Loading mobile app...</p>
                </div>
              )}

              {/* Error State */}
              {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-10">
                  <Info className="h-12 w-12 text-cyber-orange mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Preview Unavailable</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    The mobile app preview is currently being set up.
                    You can still view the source code or run it locally.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleRefresh} className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Try Again
                    </Button>
                    <a
                      href="https://github.com/subkhanibnuaji/ibnu-portfolio/tree/main/mobile-app"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="gradient" className="gap-2">
                        View Source
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              )}

              {/* Iframe */}
              <iframe
                key={key}
                src={MOBILE_APP_URL}
                className="w-full h-full border-0"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title="Mobile App Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-muted-foreground">
            This is a live preview of the Expo web export.{' '}
            <Link href="/mobile" className="text-cyber-cyan hover:underline">
              Learn more about the mobile app
            </Link>
          </p>
        </motion.div>
      </div>
    </PageLayout>
  )
}

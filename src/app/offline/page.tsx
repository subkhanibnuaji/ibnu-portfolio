'use client'

import { WifiOff, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        {/* Icon */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
            <WifiOff className="w-16 h-16 text-muted-foreground" />
          </div>
          {/* Animated rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-2 border-muted-foreground/20 animate-ping" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold mb-4">Anda Sedang Offline</h1>
        <p className="text-muted-foreground mb-8">
          Sepertinya koneksi internet Anda terputus. Periksa koneksi Anda dan coba lagi.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRetry}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
          >
            <Home className="w-4 h-4" />
            Ke Beranda
          </Link>
        </div>

        {/* Tips */}
        <div className="mt-12 p-4 rounded-lg bg-muted/30 text-left">
          <h2 className="font-semibold mb-2">Tips:</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Periksa koneksi WiFi atau data seluler Anda</li>
            <li>• Coba matikan mode pesawat jika aktif</li>
            <li>• Halaman yang pernah dikunjungi mungkin tersedia offline</li>
          </ul>
        </div>
      </div>
    </main>
  )
}

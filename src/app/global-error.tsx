'use client'

import { useEffect } from 'react'
import { AlertOctagon, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to console
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertOctagon className="w-12 h-12 text-red-500" />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl font-bold mb-4">
            Terjadi Kesalahan Kritis
          </h1>
          <p className="text-gray-400 mb-8">
            Aplikasi mengalami kesalahan yang tidak dapat dipulihkan.
            Silakan muat ulang halaman.
          </p>

          {/* Error ID */}
          {error.digest && (
            <p className="text-xs text-gray-500 mb-6">
              Error ID: {error.digest}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Muat Ulang
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-700 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Ke Beranda
            </a>
          </div>

          {/* Contact */}
          <p className="mt-8 text-sm text-gray-500">
            Butuh bantuan?{' '}
            <a href="/contact" className="text-blue-400 hover:underline">
              Hubungi kami
            </a>
          </p>
        </div>
      </body>
    </html>
  )
}

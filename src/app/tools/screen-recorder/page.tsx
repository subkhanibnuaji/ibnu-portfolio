'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ScreenRecorder } from '@/components/tools/screen-recorder'

export default function ScreenRecorderPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container max-w-4xl">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>

        <h1 className="text-4xl font-bold text-white mb-4">Screen Recorder</h1>
        <p className="text-white/70 mb-8">
          Record your screen or camera with audio support
        </p>

        <ScreenRecorder />
      </div>
    </main>
  )
}

'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { MindMap } from '@/components/tools/mind-map'

export default function MindMapPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container max-w-5xl">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>

        <h1 className="text-4xl font-bold text-white mb-4">Mind Map</h1>
        <p className="text-white/70 mb-8">
          Create and visualize ideas with an interactive mind mapping tool
        </p>

        <MindMap />
      </div>
    </main>
  )
}

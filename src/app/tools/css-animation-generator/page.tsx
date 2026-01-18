'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CSSAnimationGenerator } from '@/components/tools/css-animation-generator'

export default function CSSAnimationGeneratorPage() {
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

        <h1 className="text-4xl font-bold text-white mb-4">CSS Animation Generator</h1>
        <p className="text-white/70 mb-8">
          Create CSS keyframe animations with live preview and copy-ready code
        </p>

        <CSSAnimationGenerator />
      </div>
    </main>
  )
}

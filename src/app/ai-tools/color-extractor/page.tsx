'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ColorExtractor } from '@/components/ai-tools/color-extractor'

export default function ColorExtractorPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container">
        <Link
          href="/ai-tools"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to AI Tools
        </Link>
        <ColorExtractor />
      </div>
    </main>
  )
}

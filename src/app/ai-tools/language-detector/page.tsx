'use client'

import { LanguageDetector } from '@/components/ai-tools/language-detector'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function LanguageDetectorPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container">
        <Link
          href="/ai-tools"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to AI Tools
        </Link>
        <LanguageDetector />
      </div>
    </main>
  )
}

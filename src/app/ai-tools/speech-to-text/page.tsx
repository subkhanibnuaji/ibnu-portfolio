'use client'

import { SpeechToText } from '@/components/ai-tools/speech-to-text'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SpeechToTextPage() {
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
        <SpeechToText />
      </div>
    </main>
  )
}

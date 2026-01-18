'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { TypingRace } from '@/components/tools/typing-race'

export default function TypingRacePage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container max-w-3xl">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>

        <h1 className="text-4xl font-bold text-white mb-4">Typing Race</h1>
        <p className="text-white/70 mb-8">
          Test your typing speed and accuracy with timed challenges
        </p>

        <TypingRace />
      </div>
    </main>
  )
}

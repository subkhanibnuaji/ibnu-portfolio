'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { MeditationTimer } from '@/components/tools/meditation-timer'

export default function MeditationTimerPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container max-w-2xl">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>
        <h1 className="text-3xl font-bold mb-2">Meditation Timer</h1>
        <p className="text-muted-foreground mb-8">Guided meditation with breathing exercises</p>
        <MeditationTimer />
      </div>
    </main>
  )
}

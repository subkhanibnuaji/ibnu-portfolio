'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { BreathingExercise } from '@/components/tools/breathing-exercise'

export default function BreathingExercisePage() {
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
        <h1 className="text-3xl font-bold mb-2">Breathing Exercise</h1>
        <p className="text-muted-foreground mb-8">Guided breathing patterns for relaxation</p>
        <BreathingExercise />
      </div>
    </main>
  )
}

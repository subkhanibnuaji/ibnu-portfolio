'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { FocusTimer } from '@/components/tools/focus-timer'

export default function FocusTimerPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>
        <h1 className="text-3xl font-bold mb-2 text-center">Focus Timer</h1>
        <p className="text-muted-foreground mb-8 text-center">Deep work timer with multiple modes</p>
        <FocusTimer />
      </div>
    </main>
  )
}

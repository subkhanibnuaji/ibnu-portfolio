'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PongGame } from '@/components/tools/pong-game'

export default function PongGamePage() {
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

        <h1 className="text-4xl font-bold text-white mb-4">Pong</h1>
        <p className="text-white/70 mb-8">
          Classic Pong game - play against AI or a friend in 2-player mode
        </p>

        <PongGame />
      </div>
    </main>
  )
}

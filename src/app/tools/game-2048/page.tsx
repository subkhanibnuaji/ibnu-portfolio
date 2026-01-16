'use client'

import { Game2048 } from '@/components/tools'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function Game2048Page() {
  return (
    <main className="min-h-screen py-24">
      <div className="container">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>
        <Game2048 />
      </div>
    </main>
  )
}

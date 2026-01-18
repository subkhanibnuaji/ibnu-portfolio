'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { GraphPlotter } from '@/components/tools/graph-plotter'

export default function GraphPlotterPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container max-w-5xl">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>
        <h1 className="text-3xl font-bold mb-2">Graph Plotter</h1>
        <p className="text-muted-foreground mb-8">Plot mathematical functions interactively</p>
        <GraphPlotter />
      </div>
    </main>
  )
}

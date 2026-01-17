'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { MemeGenerator } from '@/components/tools/meme-generator'

export default function MemeGeneratorPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container max-w-6xl">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>
        <h1 className="text-3xl font-bold mb-2">Meme Generator</h1>
        <p className="text-muted-foreground mb-8">Create memes with templates and custom text</p>
        <MemeGenerator />
      </div>
    </main>
  )
}

'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { StoryGenerator } from '@/components/tools/story-generator'

export default function StoryGeneratorPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container max-w-4xl">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>

        <h1 className="text-4xl font-bold text-white mb-4">Story Generator</h1>
        <p className="text-white/70 mb-8">
          Generate creative short stories in various genres with unique characters and plots
        </p>

        <StoryGenerator />
      </div>
    </main>
  )
}

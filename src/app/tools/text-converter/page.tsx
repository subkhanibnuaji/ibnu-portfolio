'use client'

import { TextConverter } from '@/components/tools'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TextConverterPage() {
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
        <TextConverter />
      </div>
    </main>
  )
}

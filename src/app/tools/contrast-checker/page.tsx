'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ContrastChecker } from '@/components/tools/contrast-checker'

export default function ContrastCheckerPage() {
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

        <h1 className="text-4xl font-bold text-white mb-4">Contrast Checker</h1>
        <p className="text-white/70 mb-8">
          Check color contrast ratios for WCAG accessibility compliance
        </p>

        <ContrastChecker />
      </div>
    </main>
  )
}

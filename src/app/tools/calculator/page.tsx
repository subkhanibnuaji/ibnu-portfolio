'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Calculator } from '@/components/tools/calculator'

export default function CalculatorPage() {
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
        <Calculator />
      </div>
    </main>
  )
}

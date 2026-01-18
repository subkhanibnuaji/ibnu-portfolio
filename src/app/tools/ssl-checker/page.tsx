'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SSLChecker } from '@/components/tools/ssl-checker'

export default function SSLCheckerPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container max-w-4xl">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>
        <h1 className="text-3xl font-bold mb-2">SSL Certificate Checker</h1>
        <p className="text-muted-foreground mb-8">Check SSL certificate validity and expiration</p>
        <SSLChecker />
      </div>
    </main>
  )
}

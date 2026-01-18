'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { MarkdownToHtml } from '@/components/tools/markdown-to-html'

export default function MarkdownToHtmlPage() {
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

        <h1 className="text-4xl font-bold text-white mb-4">Markdown to HTML</h1>
        <p className="text-white/70 mb-8">
          Convert Markdown text to HTML with live preview
        </p>

        <MarkdownToHtml />
      </div>
    </main>
  )
}

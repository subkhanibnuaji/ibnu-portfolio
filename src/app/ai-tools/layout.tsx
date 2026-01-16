/**
 * AI Tools Layout
 * File: app/ai-tools/layout.tsx
 *
 * Shared layout for all AI tools pages.
 * Provides consistent navigation and styling.
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Tools - Ibnu Portfolio',
  description: 'AI-powered tools built with LangChain and Groq',
};

interface AIToolsLayoutProps {
  children: React.ReactNode;
}

export default function AIToolsLayout({ children }: AIToolsLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Home */}
            <Link
              href="/"
              className="flex items-center gap-2 text-white transition-colors hover:text-blue-400"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="font-medium">Back to Portfolio</span>
            </Link>

            {/* AI Tools Navigation */}
            <nav className="flex items-center gap-1">
              <Link
                href="/ai-tools"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700/50 hover:text-white"
              >
                Overview
              </Link>
              <Link
                href="/ai-tools/llm"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700/50 hover:text-white"
              >
                LLM Chat
              </Link>
              <Link
                href="/ai-tools/rag"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700/50 hover:text-white"
              >
                RAG
              </Link>
              <Link
                href="/ai-tools/agent"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700/50 hover:text-white"
              >
                Agent
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700/50 bg-gray-900/50 py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-400 sm:px-6 lg:px-8">
          <p>
            Powered by{' '}
            <a
              href="https://js.langchain.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              LangChain
            </a>{' '}
            +{' '}
            <a
              href="https://console.groq.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Groq (FREE)
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

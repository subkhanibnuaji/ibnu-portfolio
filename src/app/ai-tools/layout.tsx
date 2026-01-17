import { Metadata } from 'next'
import { AIToolsLayoutClient } from './layout-client'

export const metadata: Metadata = {
  title: 'AI Tools - Ibnu Portfolio',
  description: 'Explore AI-powered tools - browser-based ML models and LangChain-powered LLM applications.',
  openGraph: {
    title: 'AI Tools - Ibnu Portfolio',
    description: 'Explore AI-powered tools running in your browser and LangChain LLM applications.',
    type: 'website'
  }
}

export default function AIToolsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <AIToolsLayoutClient>{children}</AIToolsLayoutClient>
}

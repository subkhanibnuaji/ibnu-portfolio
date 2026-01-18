import { Metadata } from 'next'
import { ToolsLayoutClient } from './layout-client'

export const metadata: Metadata = {
  title: 'Tools - Ibnu Portfolio',
  description: 'A collection of useful tools and mini-games. Typing test, calculator, games, and more.',
  openGraph: {
    title: 'Tools - Ibnu Portfolio',
    description: 'A collection of useful tools and mini-games.',
    type: 'website'
  }
}

export default function ToolsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <ToolsLayoutClient>{children}</ToolsLayoutClient>
}

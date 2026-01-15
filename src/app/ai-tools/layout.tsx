import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Tools - Ibnu Portfolio',
  description: 'Explore AI-powered tools running entirely in your browser. Object detection, pose estimation, background removal, and more.',
  openGraph: {
    title: 'AI Tools - Ibnu Portfolio',
    description: 'Explore AI-powered tools running entirely in your browser.',
    type: 'website'
  }
}

export default function AIToolsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return children
}

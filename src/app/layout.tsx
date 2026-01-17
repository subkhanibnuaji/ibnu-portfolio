import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { CanvasFixProvider } from '@/components/providers/canvas-fix-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { SessionProvider } from '@/components/providers/session-provider'
import { Toaster } from '@/components/ui/sonner'
import { AchievementSystem } from '@/components/gamification/achievement-system'
import { QuickActionsFAB } from '@/components/ui/quick-actions-fab'
import { SiteStatsWidget } from '@/components/widgets/site-stats-widget'
import { PWAInstallPrompt } from '@/components/pwa/install-prompt'
import { FocusMode } from '@/components/modes/focus-mode'
import { SmartContextMenu } from '@/components/ui/smart-context-menu'
import { PersonalizationPanel } from '@/components/personalization/personalization-panel'
import { BookmarkManager } from '@/components/bookmarks/bookmark-manager'
import { NavigationProgress } from '@/components/transitions/page-transition'
import { AccessibilityWidget } from '@/components/accessibility/accessibility-widget'
import { NetworkStatus } from '@/components/network/network-status'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Ibnu | AI • Blockchain • Cybersecurity',
    template: '%s | Ibnu Portfolio',
  },
  description:
    'Subkhan Ibnu Aji - Government Tech Leader, AI Researcher, and Crypto Enthusiast. Building the future of digital transformation at the intersection of AI, Blockchain, and Cybersecurity.',
  keywords: [
    'AI',
    'Artificial Intelligence',
    'Blockchain',
    'Crypto',
    'Cybersecurity',
    'Digital Transformation',
    'Indonesia',
    'Government IT',
    'Web3',
    'Full Stack Developer',
  ],
  authors: [{ name: 'Subkhan Ibnu Aji', url: 'https://heyibnu.com' }],
  creator: 'Subkhan Ibnu Aji',
  publisher: 'Subkhan Ibnu Aji',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://heyibnu.com',
    siteName: 'Ibnu Portfolio',
    title: 'Ibnu | AI • Blockchain • Cybersecurity',
    description:
      'Building the future at the intersection of AI, Blockchain, and Cybersecurity',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ibnu Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ibnu | AI • Blockchain • Cybersecurity',
    description:
      'Building the future at the intersection of AI, Blockchain, and Cybersecurity',
    creator: '@subkhanibnuaji',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <CanvasFixProvider>
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster richColors position="bottom-right" />
              <AchievementSystem />
              <QuickActionsFAB />
              <SiteStatsWidget />
              <PWAInstallPrompt />
              <FocusMode />
              <SmartContextMenu />
              <PersonalizationPanel />
              <BookmarkManager />
              <NavigationProgress />
              <AccessibilityWidget />
              <NetworkStatus />
            </ThemeProvider>
          </SessionProvider>
        </CanvasFixProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

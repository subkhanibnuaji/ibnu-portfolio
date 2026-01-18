'use client'

/**
 * Client-Only Components Wrapper
 * File: components/providers/client-components.tsx
 *
 * Wraps all client-only components that use browser APIs (window, localStorage, etc.)
 * to prevent React Hydration errors.
 */

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamic imports with ssr: false to prevent hydration mismatch
const SiteNavigator = dynamic(
  () => import('@/components/site-navigator').then((mod) => mod.SiteNavigator),
  { ssr: false }
)

// Accessibility & SEO components (use browser APIs like document, usePathname)
const SkipLink = dynamic(
  () => import('@/components/accessibility/skip-link').then((mod) => mod.SkipLink),
  { ssr: false }
)

const HomePageSchema = dynamic(
  () => import('@/components/seo/schema-markup').then((mod) => mod.HomePageSchema),
  { ssr: false }
)

const AutoBreadcrumbSchema = dynamic(
  () => import('@/components/seo/schema-markup').then((mod) => mod.AutoBreadcrumbSchema),
  { ssr: false }
)

const AchievementSystem = dynamic(
  () => import('@/components/gamification/achievement-system').then((mod) => mod.AchievementSystem),
  { ssr: false }
)

const QuickActionsFAB = dynamic(
  () => import('@/components/ui/quick-actions-fab').then((mod) => mod.QuickActionsFAB),
  { ssr: false }
)

const SiteStatsWidget = dynamic(
  () => import('@/components/widgets/site-stats-widget').then((mod) => mod.SiteStatsWidget),
  { ssr: false }
)

const PWAInstallPrompt = dynamic(
  () => import('@/components/pwa/install-prompt').then((mod) => mod.PWAInstallPrompt),
  { ssr: false }
)

const FocusMode = dynamic(
  () => import('@/components/modes/focus-mode').then((mod) => mod.FocusMode),
  { ssr: false }
)

const SmartContextMenu = dynamic(
  () => import('@/components/ui/smart-context-menu').then((mod) => mod.SmartContextMenu),
  { ssr: false }
)

const PersonalizationPanel = dynamic(
  () => import('@/components/personalization/personalization-panel').then((mod) => mod.PersonalizationPanel),
  { ssr: false }
)

const BookmarkManager = dynamic(
  () => import('@/components/bookmarks/bookmark-manager').then((mod) => mod.BookmarkManager),
  { ssr: false }
)

const NavigationProgress = dynamic(
  () => import('@/components/transitions/page-transition').then((mod) => mod.NavigationProgress),
  { ssr: false }
)

const AccessibilityWidget = dynamic(
  () => import('@/components/accessibility/accessibility-widget').then((mod) => mod.AccessibilityWidget),
  { ssr: false }
)

const NetworkStatus = dynamic(
  () => import('@/components/network/network-status').then((mod) => mod.NetworkStatus),
  { ssr: false }
)

/**
 * ClientComponents - Wrapper for all client-only components
 * These components use browser APIs and must not be server-rendered
 */
export function ClientComponents() {
  return (
    <Suspense fallback={null}>
      {/* Accessibility */}
      <SkipLink />

      {/* SEO Schema */}
      <HomePageSchema />
      <AutoBreadcrumbSchema />

      {/* Core Features */}
      <SiteNavigator />
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
    </Suspense>
  )
}

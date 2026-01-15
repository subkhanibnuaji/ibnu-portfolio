'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  showHome?: boolean
  className?: string
}

// Map path segments to readable labels
const pathLabels: Record<string, string> = {
  'blog': 'Blog',
  'projects': 'Projects',
  'about': 'About',
  'contact': 'Contact',
  'certifications': 'Certifications',
  'interests': 'Interests',
  'admin': 'Admin',
  'dashboard': 'Dashboard',
  'settings': 'Settings',
  'messages': 'Messages',
  'skills': 'Skills',
  'experience': 'Experience',
  'education': 'Education',
  'new': 'New',
  'edit': 'Edit',
}

export function Breadcrumbs({ items, showHome = true, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbs: BreadcrumbItem[] = items || generateBreadcrumbs(pathname)

  if (breadcrumbs.length === 0 && !showHome) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-sm text-muted-foreground ${className}`}
    >
      <ol className="flex items-center gap-1 flex-wrap">
        {showHome && (
          <li className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="sr-only">Home</span>
            </Link>
            {breadcrumbs.length > 0 && (
              <ChevronRight className="w-4 h-4 mx-1" />
            )}
          </li>
        )}

        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <li key={item.href} className="flex items-center">
              {isLast ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight className="w-4 h-4 mx-1" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []
  let currentPath = ''

  for (const segment of segments) {
    currentPath += `/${segment}`

    // Skip dynamic segments that look like IDs
    const isId = /^[0-9a-f-]{20,}$/.test(segment) || /^\d+$/.test(segment)

    const label = isId
      ? 'Detail'
      : pathLabels[segment] || formatSegment(segment)

    breadcrumbs.push({
      label,
      href: currentPath
    })
  }

  return breadcrumbs
}

function formatSegment(segment: string): string {
  // Convert slug to readable format
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Schema.org BreadcrumbList structured data
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${process.env.NEXT_PUBLIC_SITE_URL || ''}${item.href}`
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  )
}

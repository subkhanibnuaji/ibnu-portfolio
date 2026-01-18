'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  Home,
  User,
  Briefcase,
  BookOpen,
  Wrench,
  Terminal,
  Gamepad2,
  Mail,
  FileText,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================
interface BreadcrumbItem {
  label: string
  href: string
  icon?: React.ElementType
}

// Page icon mapping
const PAGE_ICONS: Record<string, React.ElementType> = {
  '': Home,
  about: User,
  projects: Briefcase,
  blog: BookOpen,
  tools: Wrench,
  terminal: Terminal,
  games: Gamepad2,
  contact: Mail,
  resume: FileText,
  guestbook: MessageSquare,
}

// Page label mapping
const PAGE_LABELS: Record<string, string> = {
  '': 'Home',
  about: 'About',
  projects: 'Projects',
  blog: 'Blog',
  tools: 'Tools',
  terminal: 'Terminal',
  games: 'Games',
  contact: 'Contact',
  resume: 'Resume',
  guestbook: 'Guestbook',
}

// ============================================
// BREADCRUMB COMPONENT
// ============================================
interface BreadcrumbNavProps {
  className?: string
  showHome?: boolean
  showIcons?: boolean
  separator?: 'chevron' | 'slash' | 'dot'
  variant?: 'default' | 'pills' | 'minimal'
}

export function BreadcrumbNav({
  className,
  showHome = true,
  showIcons = true,
  separator = 'chevron',
  variant = 'default',
}: BreadcrumbNavProps) {
  const pathname = usePathname()

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const items: BreadcrumbItem[] = []

    if (showHome) {
      items.push({
        label: 'Home',
        href: '/',
        icon: Home,
      })
    }

    let currentPath = ''
    segments.forEach((segment) => {
      currentPath += `/${segment}`
      const label = PAGE_LABELS[segment] ||
        segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
      const icon = PAGE_ICONS[segment]

      items.push({
        label,
        href: currentPath,
        icon,
      })
    })

    return items
  }

  const breadcrumbs = generateBreadcrumbs()

  // Don't render if only home
  if (breadcrumbs.length <= 1 && showHome) return null

  const getSeparator = () => {
    switch (separator) {
      case 'slash':
        return <span className="text-muted-foreground/50">/</span>
      case 'dot':
        return <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
      case 'chevron':
      default:
        return <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
    }
  }

  const variantStyles = {
    default: 'bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-2',
    pills: '',
    minimal: '',
  }

  const itemStyles = {
    default: 'hover:text-foreground transition-colors',
    pills: 'px-3 py-1.5 rounded-lg hover:bg-muted transition-colors',
    minimal: 'hover:text-primary transition-colors',
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(variantStyles[variant], className)}
    >
      <ol className="flex items-center gap-2 flex-wrap">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1
          const Icon = item.icon

          return (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && getSeparator()}
              {isLast ? (
                <span
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-medium',
                    variant === 'pills' && 'px-3 py-1.5 rounded-lg bg-primary/10 text-primary'
                  )}
                  aria-current="page"
                >
                  {showIcons && Icon && <Icon className="h-3.5 w-3.5" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 text-sm text-muted-foreground',
                    itemStyles[variant]
                  )}
                >
                  {showIcons && Icon && <Icon className="h-3.5 w-3.5" />}
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// ============================================
// ANIMATED BREADCRUMB
// ============================================
export function AnimatedBreadcrumb({
  className,
  showHome = true,
  showIcons = true,
}: Omit<BreadcrumbNavProps, 'separator' | 'variant'>) {
  const pathname = usePathname()

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const items: BreadcrumbItem[] = []

    if (showHome) {
      items.push({ label: 'Home', href: '/', icon: Home })
    }

    let currentPath = ''
    segments.forEach((segment) => {
      currentPath += `/${segment}`
      const label = PAGE_LABELS[segment] ||
        segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
      items.push({ label, href: currentPath, icon: PAGE_ICONS[segment] })
    })

    return items
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1 && showHome) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('overflow-hidden', className)}
    >
      <ol className="flex items-center">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1
          const Icon = item.icon

          return (
            <motion.li
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center"
            >
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/30" />
              )}
              {isLast ? (
                <motion.span
                  layoutId="breadcrumb-active"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium"
                >
                  {showIcons && Icon && <Icon className="h-3.5 w-3.5" />}
                  {item.label}
                </motion.span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  {showIcons && Icon && <Icon className="h-3.5 w-3.5" />}
                  {item.label}
                </Link>
              )}
            </motion.li>
          )
        })}
      </ol>
    </nav>
  )
}

// ============================================
// COLLAPSED BREADCRUMB (for long paths)
// ============================================
export function CollapsedBreadcrumb({
  className,
  maxVisible = 3,
}: {
  className?: string
  maxVisible?: number
}) {
  const pathname = usePathname()

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const items: BreadcrumbItem[] = [{ label: 'Home', href: '/', icon: Home }]

    let currentPath = ''
    segments.forEach((segment) => {
      currentPath += `/${segment}`
      const label = PAGE_LABELS[segment] ||
        segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
      items.push({ label, href: currentPath, icon: PAGE_ICONS[segment] })
    })

    return items
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) return null

  const shouldCollapse = breadcrumbs.length > maxVisible + 1
  const visibleItems = shouldCollapse
    ? [breadcrumbs[0], ...breadcrumbs.slice(-maxVisible)]
    : breadcrumbs

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-2">
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1
          const showEllipsis = shouldCollapse && index === 0

          return (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
              )}
              {showEllipsis && (
                <>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.icon && <item.icon className="h-3.5 w-3.5" />}
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                  <span className="text-sm text-muted-foreground">...</span>
                </>
              )}
              {!showEllipsis && (
                isLast ? (
                  <span className="text-sm font-medium">{item.label}</span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

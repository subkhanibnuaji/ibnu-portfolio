'use client'

/**
 * Skip to Main Content Link
 * Accessibility feature for keyboard navigation
 */

export function SkipLink() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const main = document.querySelector('main') || document.getElementById('main-content')
    if (main) {
      main.setAttribute('tabindex', '-1')
      main.focus()
      main.removeAttribute('tabindex')
    }
  }

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className="
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999]
        focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground
        focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        focus:font-medium focus:text-sm
        transition-all duration-200
      "
    >
      Skip to main content
    </a>
  )
}

/**
 * Skip Links Group
 * Multiple skip links for complex pages
 */
interface SkipLinksProps {
  links?: { href: string; label: string }[]
}

export function SkipLinks({ links }: SkipLinksProps) {
  const defaultLinks = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#navigation', label: 'Skip to navigation' },
    { href: '#footer', label: 'Skip to footer' },
  ]

  const allLinks = links || defaultLinks

  return (
    <div className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-4 focus-within:left-4 focus-within:z-[9999]">
      <div className="flex flex-col gap-2 bg-background border border-border rounded-lg p-2 shadow-lg">
        {allLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="
              px-4 py-2 text-sm font-medium
              bg-muted hover:bg-primary hover:text-primary-foreground
              rounded-md transition-colors
              focus:outline-none focus:ring-2 focus:ring-ring
            "
            onClick={(e) => {
              e.preventDefault()
              const target = document.querySelector(link.href)
              if (target) {
                target.setAttribute('tabindex', '-1')
                ;(target as HTMLElement).focus()
                target.removeAttribute('tabindex')
              }
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}

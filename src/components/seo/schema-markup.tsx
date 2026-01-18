'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'

// =============================================================================
// CONFIG
// =============================================================================

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://heyibnu.com'
const SITE_NAME = 'Ibnu Portfolio'
const AUTHOR_NAME = 'Subkhan Ibnu Aji'
const AUTHOR_EMAIL = 'hi@heyibnu.com'

// =============================================================================
// PERSON SCHEMA
// =============================================================================

export function PersonSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR_NAME,
    alternateName: 'Ibnu',
    description: 'Government Tech Leader & AI Researcher specializing in AI, Blockchain, and Cybersecurity',
    url: SITE_URL,
    image: `${SITE_URL}/images/profile/ibnu-profile.jpg`,
    email: AUTHOR_EMAIL,
    jobTitle: 'Government Tech Leader & AI Researcher',
    worksFor: {
      '@type': 'Organization',
      name: 'Ministry of Housing & Settlement Areas',
      url: 'https://perumahan.pu.go.id'
    },
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'Universitas Gadjah Mada',
        url: 'https://ugm.ac.id'
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Telkom University',
        url: 'https://telkomuniversity.ac.id'
      }
    ],
    knowsAbout: [
      'Artificial Intelligence',
      'Machine Learning',
      'Deep Learning',
      'Natural Language Processing',
      'Blockchain',
      'Cryptocurrency',
      'DeFi',
      'Web3',
      'Cybersecurity',
      'Penetration Testing',
      'Web Development',
      'Full Stack Development',
      'Cloud Computing',
      'Project Management',
      'Digital Transformation'
    ],
    sameAs: [
      'https://github.com/subkhanibnuaji',
      'https://linkedin.com/in/subkhanibnuaji',
      'https://twitter.com/subkhanibnuaji'
    ]
  }

  return (
    <Script
      id="person-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// =============================================================================
// WEBSITE SCHEMA
// =============================================================================

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'Subkhan Ibnu Aji Portfolio',
    url: SITE_URL,
    description: 'Building the future at the intersection of AI, Blockchain, and Cybersecurity',
    inLanguage: ['en', 'id'],
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: SITE_URL
    },
    publisher: {
      '@type': 'Person',
      name: AUTHOR_NAME
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// =============================================================================
// ORGANIZATION SCHEMA
// =============================================================================

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-image.png`,
    description: 'Personal portfolio and digital presence of Subkhan Ibnu Aji',
    founder: {
      '@type': 'Person',
      name: AUTHOR_NAME
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: AUTHOR_EMAIL,
      contactType: 'customer service',
      availableLanguage: ['English', 'Indonesian']
    },
    sameAs: [
      'https://github.com/subkhanibnuaji',
      'https://linkedin.com/in/subkhanibnuaji',
      'https://twitter.com/subkhanibnuaji'
    ]
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// =============================================================================
// BLOG POST SCHEMA
// =============================================================================

interface BlogPostSchemaProps {
  title: string
  description: string
  slug: string
  datePublished: string
  dateModified?: string
  author?: string
  image?: string
  tags?: string[]
  wordCount?: number
}

export function BlogPostSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  author = AUTHOR_NAME,
  image,
  tags = [],
  wordCount
}: BlogPostSchemaProps) {
  const articleUrl = `${SITE_URL}/blog/${slug}`
  const articleImage = image || `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&type=blog`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url: articleUrl,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author,
      url: `${SITE_URL}/about`
    },
    publisher: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`
      }
    },
    image: {
      '@type': 'ImageObject',
      url: articleImage
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl
    },
    inLanguage: 'en',
    ...(tags.length > 0 && { keywords: tags.join(', ') }),
    ...(wordCount && { wordCount })
  }

  return (
    <Script
      id="blogpost-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// =============================================================================
// PROJECT SCHEMA
// =============================================================================

interface ProjectSchemaProps {
  name: string
  description: string
  slug: string
  technologies: string[]
  status: string
  githubUrl?: string
  liveUrl?: string
  image?: string
  dateCreated?: string
}

export function ProjectSchema({
  name,
  description,
  slug,
  technologies,
  status,
  githubUrl,
  liveUrl,
  image,
  dateCreated
}: ProjectSchemaProps) {
  const projectUrl = `${SITE_URL}/projects/${slug}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url: projectUrl,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: SITE_URL
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    keywords: technologies.join(', '),
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: image.startsWith('http') ? image : `${SITE_URL}${image}`
      }
    }),
    ...(githubUrl && { codeRepository: githubUrl }),
    ...(liveUrl && { installUrl: liveUrl }),
    ...(dateCreated && { dateCreated }),
    softwareVersion: '1.0',
    applicationSubCategory: status === 'COMPLETED' ? 'Production' : 'Development'
  }

  return (
    <Script
      id="project-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// =============================================================================
// BREADCRUMB SCHEMA
// =============================================================================

interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`
    }))
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Auto breadcrumb based on pathname
export function AutoBreadcrumbSchema() {
  const pathname = usePathname()

  if (!pathname || pathname === '/') return null

  const segments = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = [{ name: 'Home', url: '/' }]

  let currentPath = ''
  for (const segment of segments) {
    currentPath += `/${segment}`
    const name = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    items.push({ name, url: currentPath })
  }

  return <BreadcrumbSchema items={items} />
}

// =============================================================================
// FAQ SCHEMA
// =============================================================================

interface FAQItem {
  question: string
  answer: string
}

export function FAQSchema({ items }: { items: FAQItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// =============================================================================
// SERVICE SCHEMA (For AI Tools, etc)
// =============================================================================

interface ServiceSchemaProps {
  name: string
  description: string
  url: string
  category: string
}

export function ServiceSchema({ name, description, url, category }: ServiceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    provider: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: SITE_URL
    },
    serviceType: category,
    areaServed: 'Worldwide',
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: url.startsWith('http') ? url : `${SITE_URL}${url}`,
      serviceType: 'Online'
    }
  }

  return (
    <Script
      id="service-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// =============================================================================
// COURSE/CERTIFICATION SCHEMA
// =============================================================================

interface CertificationSchemaProps {
  name: string
  description: string
  provider: string
  dateIssued: string
  url?: string
}

export function CertificationSchema({
  name,
  description,
  provider,
  dateIssued,
  url
}: CertificationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online'
    },
    ...(url && { url })
  }

  return (
    <Script
      id="certification-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// =============================================================================
// HOMEPAGE COMBINED SCHEMA
// =============================================================================

export function HomePageSchema() {
  return (
    <>
      <WebsiteSchema />
      <PersonSchema />
      <OrganizationSchema />
    </>
  )
}

// =============================================================================
// PROFILE PAGE SCHEMA
// =============================================================================

export function ProfilePageSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: SITE_URL
    },
    dateCreated: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0]
  }

  return (
    <>
      <PersonSchema />
      <Script
        id="profile-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  )
}

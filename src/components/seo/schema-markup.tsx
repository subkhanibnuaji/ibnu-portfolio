import Script from 'next/script'

// Person Schema for About page
export function PersonSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Subkhan Ibnu Aji',
    alternateName: 'Ibnu',
    description: 'Civil Servant & Technology Professional specializing in AI, Blockchain, and Cybersecurity',
    url: 'https://ibnu-portfolio-ashen.vercel.app',
    image: 'https://ibnu-portfolio-ashen.vercel.app/images/profile.jpg',
    email: 'hi@heyibnu.com',
    jobTitle: 'Civil Servant - IT Project Manager',
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
      'Blockchain',
      'Cryptocurrency',
      'Cybersecurity',
      'Web Development',
      'Project Management'
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

// Website Schema for Homepage
export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ibnu Portfolio',
    alternateName: 'Subkhan Ibnu Aji Portfolio',
    url: 'https://ibnu-portfolio-ashen.vercel.app',
    description: 'Personal portfolio showcasing expertise in AI, Blockchain, and Cybersecurity',
    author: {
      '@type': 'Person',
      name: 'Subkhan Ibnu Aji'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://ibnu-portfolio-ashen.vercel.app/search?q={search_term_string}',
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

// Blog Post Schema
interface BlogPostSchemaProps {
  title: string
  description: string
  slug: string
  datePublished: string
  dateModified?: string
  author?: string
  image?: string
}

export function BlogPostSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  author = 'Subkhan Ibnu Aji',
  image
}: BlogPostSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url: `https://ibnu-portfolio-ashen.vercel.app/blog/${slug}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author,
      url: 'https://ibnu-portfolio-ashen.vercel.app/about'
    },
    publisher: {
      '@type': 'Person',
      name: 'Subkhan Ibnu Aji',
      url: 'https://ibnu-portfolio-ashen.vercel.app'
    },
    image: image || `https://ibnu-portfolio-ashen.vercel.app/api/og?title=${encodeURIComponent(title)}&type=blog`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ibnu-portfolio-ashen.vercel.app/blog/${slug}`
    }
  }

  return (
    <Script
      id="blogpost-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Project/Software Schema
interface ProjectSchemaProps {
  name: string
  description: string
  slug: string
  technologies: string[]
  status: string
}

export function ProjectSchema({
  name,
  description,
  slug,
  technologies,
  status
}: ProjectSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url: `https://ibnu-portfolio-ashen.vercel.app/projects/${slug}`,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web',
    author: {
      '@type': 'Person',
      name: 'Subkhan Ibnu Aji'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    keywords: technologies.join(', ')
  }

  return (
    <Script
      id="project-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Breadcrumb Schema
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
      item: item.url
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

// FAQ Schema
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

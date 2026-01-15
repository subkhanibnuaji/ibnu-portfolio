import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { calculateReadingTime } from '@/lib/reading-time'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPostsByCategory(category: string) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        category: {
          equals: category,
          mode: 'insensitive'
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return posts
  } catch (error) {
    return []
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const categoryName = decodeURIComponent(slug)
  const posts = await getPostsByCategory(categoryName)

  if (posts.length === 0) {
    notFound()
  }

  // Get proper category name from first post
  const displayName = posts[0].category || categoryName

  return (
    <main className="min-h-screen bg-background py-20">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Blog', href: '/blog' },
            { label: 'Kategori', href: '/blog/categories' },
            { label: displayName, href: `/blog/categories/${slug}` }
          ]}
          className="mb-8"
        />

        {/* Header */}
        <div className="mb-12">
          <Link
            href="/blog/categories"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Semua Kategori
          </Link>
          <h1 className="text-4xl font-bold mb-4">{displayName}</h1>
          <p className="text-muted-foreground">
            {posts.length} artikel dalam kategori ini
          </p>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {posts.map((post) => {
            const readingTime = calculateReadingTime(post.content)

            return (
              <article
                key={post.id}
                className="group rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {readingTime.text}
                    </span>
                  </div>
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const categoryName = decodeURIComponent(slug)

  return {
    title: `${categoryName} | Blog Kategori | Ibnu Portfolio`,
    description: `Artikel blog dalam kategori ${categoryName}`
  }
}

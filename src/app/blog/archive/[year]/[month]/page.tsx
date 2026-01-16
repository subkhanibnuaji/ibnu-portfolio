import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { calculateReadingTime } from '@/lib/reading-time'

interface PageProps {
  params: Promise<{ year: string; month: string }>
}

async function getPostsByMonth(year: number, month: number) {
  try {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return posts
  } catch (error) {
    return []
  }
}

export default async function MonthArchivePage({ params }: PageProps) {
  const { year: yearStr, month: monthStr } = await params
  const year = parseInt(yearStr)
  const month = parseInt(monthStr)

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    notFound()
  }

  const posts = await getPostsByMonth(year, month)

  const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric'
  })

  return (
    <main className="min-h-screen bg-background py-20">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Blog', href: '/blog' },
            { label: 'Arsip', href: '/blog/archive' },
            { label: monthName, href: `/blog/archive/${year}/${month}` }
          ]}
          className="mb-8"
        />

        {/* Header */}
        <div className="mb-12">
          <Link
            href="/blog/archive"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Semua Arsip
          </Link>
          <h1 className="text-4xl font-bold mb-4">{monthName}</h1>
          <p className="text-muted-foreground">
            {posts.length} artikel dipublikasikan
          </p>
        </div>

        {/* Posts List */}
        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => {
              const readingTime = calculateReadingTime(post.content)

              return (
                <article
                  key={post.id}
                  className="group rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all"
                >
                  <Link href={`/blog/${post.slug}`}>
                    {/* Date badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-primary">
                        {new Date(post.createdAt).getDate()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString('id-ID', {
                          weekday: 'long'
                        })}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {post.category && (
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                          {post.category}
                        </span>
                      )}
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
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Tidak Ada Artikel</h2>
            <p className="text-muted-foreground">
              Tidak ada artikel yang dipublikasikan pada {monthName}.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
          <Link
            href={`/blog/archive/${month === 1 ? year - 1 : year}/${month === 1 ? 12 : month - 1}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Bulan Sebelumnya
          </Link>
          <Link
            href={`/blog/archive/${month === 12 ? year + 1 : year}/${month === 12 ? 1 : month + 1}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Bulan Selanjutnya →
          </Link>
        </div>
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { year: yearStr, month: monthStr } = await params
  const year = parseInt(yearStr)
  const month = parseInt(monthStr)

  const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric'
  })

  return {
    title: `Arsip ${monthName} | Blog | Ibnu Portfolio`,
    description: `Artikel blog yang dipublikasikan pada ${monthName}`
  }
}

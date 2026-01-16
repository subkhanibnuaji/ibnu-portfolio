import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Calendar, FileText, ChevronRight } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

interface ArchiveItem {
  year: number
  month: number
  monthName: string
  count: number
}

async function getArchive(): Promise<ArchiveItem[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' }
    })

    // Group by year and month
    const archiveMap = new Map<string, ArchiveItem>()

    posts.forEach(post => {
      const date = new Date(post.createdAt)
      const year = date.getFullYear()
      const month = date.getMonth()
      const key = `${year}-${month}`

      if (archiveMap.has(key)) {
        archiveMap.get(key)!.count++
      } else {
        archiveMap.set(key, {
          year,
          month,
          monthName: date.toLocaleDateString('id-ID', { month: 'long' }),
          count: 1
        })
      }
    })

    return Array.from(archiveMap.values())
  } catch (error) {
    return []
  }
}

// Group archive by year
function groupByYear(archive: ArchiveItem[]): Map<number, ArchiveItem[]> {
  const grouped = new Map<number, ArchiveItem[]>()

  archive.forEach(item => {
    if (!grouped.has(item.year)) {
      grouped.set(item.year, [])
    }
    grouped.get(item.year)!.push(item)
  })

  return grouped
}

export default async function ArchivePage() {
  const archive = await getArchive()
  const groupedArchive = groupByYear(archive)
  const years = Array.from(groupedArchive.keys()).sort((a, b) => b - a)
  const totalPosts = archive.reduce((sum, item) => sum + item.count, 0)

  return (
    <main className="min-h-screen bg-background py-20">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs className="mb-8" />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Arsip Blog</h1>
          <p className="text-muted-foreground">
            {totalPosts} artikel telah dipublikasikan
          </p>
        </div>

        {/* Archive Timeline */}
        {years.length > 0 ? (
          <div className="space-y-8">
            {years.map(year => {
              const months = groupedArchive.get(year)!
              const yearTotal = months.reduce((sum, m) => sum + m.count, 0)

              return (
                <div key={year} className="relative">
                  {/* Year Header */}
                  <div className="sticky top-20 z-10 bg-background/95 backdrop-blur py-2 mb-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">{year}</h2>
                      <span className="text-sm text-muted-foreground">
                        {yearTotal} artikel
                      </span>
                    </div>
                  </div>

                  {/* Months */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-4 border-l-2 border-border">
                    {months.map(item => (
                      <Link
                        key={`${item.year}-${item.month}`}
                        href={`/blog/archive/${item.year}/${item.month + 1}`}
                        className="group flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-primary" />
                          <span className="font-medium group-hover:text-primary transition-colors">
                            {item.monthName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="w-4 h-4" />
                          <span>{item.count}</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Belum Ada Artikel</h2>
            <p className="text-muted-foreground mb-6">
              Arsip akan tersedia setelah artikel dipublikasikan.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Lihat Blog
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

export const metadata = {
  title: 'Arsip Blog | Ibnu Portfolio',
  description: 'Arsip artikel blog berdasarkan bulan dan tahun'
}

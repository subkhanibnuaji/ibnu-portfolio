import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Folder, FileText, ArrowRight } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

async function getCategories() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { category: true }
    })

    // Count posts per category
    const categoryCount: Record<string, number> = {}
    posts.forEach(post => {
      if (post.category) {
        categoryCount[post.category] = (categoryCount[post.category] || 0) + 1
      }
    })

    // Convert to array and sort by count
    return Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  } catch (error) {
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <main className="min-h-screen bg-background py-20">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs className="mb-8" />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Kategori Blog</h1>
          <p className="text-muted-foreground">
            Telusuri artikel berdasarkan kategori
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/blog/categories/${encodeURIComponent(category.name.toLowerCase())}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Folder className="w-6 h-6 text-primary" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>

                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h2>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>{category.count} artikel</span>
                </div>

                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Belum Ada Kategori</h2>
            <p className="text-muted-foreground mb-6">
              Artikel akan dikategorikan setelah dipublikasikan.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Lihat Semua Blog
            </Link>
          </div>
        )}

        {/* All Posts Link */}
        {categories.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <span>Lihat semua artikel</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

export const metadata = {
  title: 'Kategori Blog | Ibnu Portfolio',
  description: 'Telusuri artikel blog berdasarkan kategori'
}

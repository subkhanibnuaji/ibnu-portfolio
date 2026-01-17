'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, RefreshCw, Clock, AlertTriangle, Shield, ShieldAlert, ShieldCheck, Info, Tag, Newspaper } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  imageUrl?: string
  category: string
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'info'
  tags?: string[]
}

interface NewsFeedProps {
  endpoint: string
  title: string
  icon?: React.ReactNode
  className?: string
  showSeverity?: boolean
  showTags?: boolean
  limit?: number
}

const severityConfig = {
  critical: {
    icon: ShieldAlert,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
  },
  high: {
    icon: AlertTriangle,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
  },
  medium: {
    icon: Shield,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
  },
  low: {
    icon: ShieldCheck,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
  },
  info: {
    icon: Info,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
}

export function NewsFeed({
  endpoint,
  title,
  icon,
  className,
  showSeverity = false,
  showTags = false,
  limit = 10,
}: NewsFeedProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchNews = async () => {
    try {
      setError(null)
      setRefreshing(true)
      const response = await fetch(endpoint)
      const data = await response.json()

      if (data.success) {
        setNews(data.data.slice(0, limit))
      } else {
        setError('Failed to fetch news')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchNews()
    const interval = setInterval(fetchNews, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [endpoint, limit])

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className={cn('p-6 bg-card border border-border rounded-2xl', className)}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {icon || <Newspaper className="w-5 h-5 text-primary" />}
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
        </div>
        <div className="space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-20 h-16 bg-muted rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('p-6 bg-card border border-border rounded-2xl', className)}>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{error}</span>
          <button
            onClick={fetchNews}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('p-6 bg-card border border-border rounded-2xl', className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon || <Newspaper className="w-5 h-5 text-primary" />}
          <h3 className="text-xl font-bold">{title}</h3>
          <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-full">
            {news.length} articles
          </span>
        </div>
        <button
          onClick={fetchNews}
          disabled={refreshing}
          className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
          title="Refresh news"
        >
          <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
        </button>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 -mr-2">
        <AnimatePresence mode="popLayout">
          {news.map((item, index) => {
            const SeverityIcon = item.severity ? severityConfig[item.severity].icon : null

            return (
              <motion.a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'block p-4 rounded-xl border border-border hover:border-primary/30 transition-all hover:bg-muted/50 group',
                  showSeverity && item.severity && severityConfig[item.severity].border
                )}
              >
                <div className="flex gap-4">
                  {/* Image or Severity Icon */}
                  {item.imageUrl ? (
                    <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  ) : showSeverity && SeverityIcon ? (
                    <div
                      className={cn(
                        'w-12 h-12 rounded-lg shrink-0 flex items-center justify-center',
                        item.severity && severityConfig[item.severity].bg
                      )}
                    >
                      <SeverityIcon
                        className={cn(
                          'w-6 h-6',
                          item.severity && severityConfig[item.severity].color
                        )}
                      />
                    </div>
                  ) : null}

                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>

                    {/* Description */}
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Tags */}
                    {showTags && item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="font-medium">{item.source}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(item.publishedAt)}
                      </span>
                      <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </motion.a>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

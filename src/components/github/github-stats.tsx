'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Github,
  Star,
  GitFork,
  Users,
  BookOpen,
  ExternalLink,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GitHubUser {
  login: string
  name: string
  avatar_url: string
  bio: string
  public_repos: number
  followers: number
  following: number
  html_url: string
}

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string
  topics: string[]
}

interface GitHubStatsProps {
  username: string
  showRepos?: boolean
  maxRepos?: number
  className?: string
}

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Vue: '#41b883',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Shell: '#89e051',
}

export function GitHubStats({
  username,
  showRepos = true,
  maxRepos = 6,
  className,
}: GitHubStatsProps) {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch user data
        const userRes = await fetch(`https://api.github.com/users/${username}`)
        if (!userRes.ok) throw new Error('Failed to fetch user')
        const userData = await userRes.json()
        setUser(userData)

        // Fetch repos if needed
        if (showRepos) {
          const reposRes = await fetch(
            `https://api.github.com/users/${username}/repos?sort=stars&per_page=${maxRepos}`
          )
          if (!reposRes.ok) throw new Error('Failed to fetch repos')
          const reposData = await reposRes.json()
          setRepos(reposData)
        }
      } catch (err) {
        console.error('GitHub API error:', err)
        setError('Failed to load GitHub data')
      } finally {
        setLoading(false)
      }
    }

    fetchGitHubData()
  }, [username, showRepos, maxRepos])

  if (loading) {
    return (
      <div className={cn('glass rounded-xl p-8 text-center', className)}>
        <Loader2 className="h-8 w-8 animate-spin text-cyber-cyan mx-auto" />
        <p className="text-muted-foreground mt-2">Loading GitHub stats...</p>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className={cn('glass rounded-xl p-8 text-center', className)}>
        <Github className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">{error || 'Unable to load GitHub data'}</p>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4"
        >
          <Button variant="outline" size="sm">
            <Github className="h-4 w-4 mr-2" />
            View on GitHub
          </Button>
        </a>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* User Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-start gap-4">
          <img
            src={user.avatar_url}
            alt={user.name}
            className="w-16 h-16 rounded-full border-2 border-cyber-cyan/30"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg">{user.name}</h3>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-cyber-cyan transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <p className="text-cyber-cyan text-sm mb-2">@{user.login}</p>
            {user.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <BookOpen className="h-5 w-5 mx-auto mb-1 text-cyber-cyan" />
            <p className="text-xl font-bold">{user.public_repos}</p>
            <p className="text-xs text-muted-foreground">Repos</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Users className="h-5 w-5 mx-auto mb-1 text-cyber-purple" />
            <p className="text-xl font-bold">{user.followers}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Users className="h-5 w-5 mx-auto mb-1 text-cyber-green" />
            <p className="text-xl font-bold">{user.following}</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
        </div>
      </motion.div>

      {/* Repositories */}
      {showRepos && repos.length > 0 && (
        <div>
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Top Repositories
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            {repos.map((repo, index) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-lg p-4 group hover:border-cyber-cyan/30 transition-colors block"
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium group-hover:text-cyber-cyan transition-colors truncate">
                    {repo.name}
                  </h5>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
                {repo.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {repo.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: languageColors[repo.language] || '#888' }}
                      />
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" />
                    {repo.forks_count}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      )}

      {/* View All Link */}
      <div className="text-center">
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline">
            <Github className="h-4 w-4 mr-2" />
            View All Repositories
          </Button>
        </a>
      </div>
    </div>
  )
}

// Compact version for embedding in other pages
export function GitHubStatsCompact({ username }: { username: string }) {
  const [stats, setStats] = useState<{ repos: number; stars: number; followers: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const userRes = await fetch(`https://api.github.com/users/${username}`)
        const userData = await userRes.json()

        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
        const reposData = await reposRes.json()
        const totalStars = reposData.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0)

        setStats({
          repos: userData.public_repos,
          stars: totalStars,
          followers: userData.followers,
        })
      } catch (err) {
        console.error('Failed to fetch GitHub stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [username])

  if (loading || !stats) {
    return null
  }

  return (
    <div className="flex items-center gap-6 text-sm">
      <a
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Github className="h-4 w-4" />
        <span>{stats.repos} repos</span>
      </a>
      <span className="flex items-center gap-1 text-muted-foreground">
        <Star className="h-4 w-4 text-yellow-500" />
        {stats.stars} stars
      </span>
      <span className="flex items-center gap-1 text-muted-foreground">
        <Users className="h-4 w-4" />
        {stats.followers} followers
      </span>
    </div>
  )
}

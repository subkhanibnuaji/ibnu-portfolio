'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Database,
  Mail,
  Lock,
  Key,
  HardDrive,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminLayout } from '@/components/admin/admin-layout'
import { cn } from '@/lib/utils'

interface EnvStatus {
  key: string
  configured: boolean
  required: boolean
}

const envVariables = [
  {
    key: 'DATABASE_URL',
    description: 'PostgreSQL connection string (with pooling)',
    required: true,
    category: 'Database',
    icon: Database,
    setupUrl: 'https://neon.tech',
    example: 'postgresql://user:pass@host/db?sslmode=require',
  },
  {
    key: 'DIRECT_URL',
    description: 'PostgreSQL direct connection (without pooling)',
    required: false,
    category: 'Database',
    icon: Database,
    setupUrl: 'https://neon.tech',
    example: 'postgresql://user:pass@host/db?sslmode=require',
  },
  {
    key: 'NEXTAUTH_SECRET',
    description: 'Secret key for NextAuth.js encryption',
    required: true,
    category: 'Authentication',
    icon: Lock,
    setupUrl: null,
    example: 'your-32-character-secret-key-here',
    generateCommand: 'openssl rand -base64 32',
  },
  {
    key: 'NEXTAUTH_URL',
    description: 'Your site URL for NextAuth.js',
    required: true,
    category: 'Authentication',
    icon: Lock,
    setupUrl: null,
    example: 'https://heyibnu.com',
  },
  {
    key: 'RESEND_API_KEY',
    description: 'API key for Resend email service (100 emails/day free)',
    required: false,
    category: 'Email',
    icon: Mail,
    setupUrl: 'https://resend.com',
    example: 're_xxxxxxxxxxxx',
  },
  {
    key: 'ADMIN_EMAIL',
    description: 'Email address for receiving contact notifications',
    required: false,
    category: 'Email',
    icon: Mail,
    setupUrl: null,
    example: 'hi@heyibnu.com',
  },
  {
    key: 'BLOB_READ_WRITE_TOKEN',
    description: 'Vercel Blob storage token for file uploads',
    required: false,
    category: 'Storage',
    icon: HardDrive,
    setupUrl: 'https://vercel.com/docs/storage/vercel-blob',
    example: 'vercel_blob_xxxxxxxxxxxx',
  },
]

const categories = ['Database', 'Authentication', 'Email', 'Storage']

export default function AdminSetupPage() {
  const [envStatus, setEnvStatus] = useState<EnvStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    checkEnvStatus()
  }, [])

  const checkEnvStatus = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/setup/check')
      if (res.ok) {
        const data = await res.json()
        setEnvStatus(data.status)
      }
    } catch (error) {
      console.error('Failed to check env status:', error)
    }
    setLoading(false)
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const getStatusIcon = (key: string) => {
    const status = envStatus.find((e) => e.key === key)
    if (!status) return <AlertCircle className="h-5 w-5 text-yellow-500" />
    if (status.configured) return <CheckCircle className="h-5 w-5 text-cyber-green" />
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  const getConfiguredCount = (category: string) => {
    const categoryVars = envVariables.filter((v) => v.category === category)
    const configured = categoryVars.filter((v) => {
      const status = envStatus.find((e) => e.key === v.key)
      return status?.configured
    })
    return `${configured.length}/${categoryVars.length}`
  }

  const overallProgress = () => {
    const required = envVariables.filter((v) => v.required)
    const configured = required.filter((v) => {
      const status = envStatus.find((e) => e.key === v.key)
      return status?.configured
    })
    return { configured: configured.length, total: required.length }
  }

  const progress = overallProgress()

  return (
    <AdminLayout
      title="Setup Guide"
      description="Configure your environment variables to enable all features"
      actions={
        <Button variant="outline" size="sm" onClick={checkEnvStatus} disabled={loading}>
          <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
          Refresh Status
        </Button>
      }
    >
      {/* Progress Overview */}
      <div className="glass rounded-xl p-6 mb-8">
        <h3 className="font-semibold mb-4">Setup Progress</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(progress.configured / progress.total) * 100}%` }}
                className="h-full bg-cyber-gradient rounded-full"
              />
            </div>
          </div>
          <span className="text-sm font-medium">
            {progress.configured}/{progress.total} Required
          </span>
        </div>
        {progress.configured === progress.total ? (
          <p className="text-sm text-cyber-green mt-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            All required environment variables are configured!
          </p>
        ) : (
          <p className="text-sm text-yellow-500 mt-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Some required variables are missing. Configure them in Vercel or your .env.local file.
          </p>
        )}
      </div>

      {/* Environment Variables by Category */}
      <div className="space-y-8">
        {categories.map((category) => {
          const categoryVars = envVariables.filter((v) => v.category === category)
          const CategoryIcon = categoryVars[0].icon

          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyber-cyan/10">
                    <CategoryIcon className="h-5 w-5 text-cyber-cyan" />
                  </div>
                  <h3 className="font-semibold text-lg">{category}</h3>
                </div>
                <span className="text-sm text-muted-foreground">
                  {getConfiguredCount(category)} configured
                </span>
              </div>

              <div className="space-y-3">
                {categoryVars.map((envVar, index) => (
                  <motion.div
                    key={envVar.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(envVar.key)}
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-sm font-medium">{envVar.key}</code>
                            {envVar.required && (
                              <span className="px-1.5 py-0.5 rounded text-xs bg-red-500/20 text-red-400">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {envVar.description}
                          </p>
                        </div>
                      </div>
                      {envVar.setupUrl && (
                        <a
                          href={envVar.setupUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </div>

                    {/* Example */}
                    <div className="mt-3 p-3 rounded bg-muted/50">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Example value:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          onClick={() => copyToClipboard(envVar.example, envVar.key)}
                        >
                          {copied === envVar.key ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <code className="text-xs text-muted-foreground font-mono break-all">
                        {envVar.example}
                      </code>
                    </div>

                    {envVar.generateCommand && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Generate with: <code className="bg-muted px-1.5 py-0.5 rounded">{envVar.generateCommand}</code>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Setup Guide */}
      <div className="glass rounded-xl p-6 mt-8">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Key className="h-5 w-5 text-cyber-cyan" />
          Quick Setup Guide
        </h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">1. Database (Neon PostgreSQL)</h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Go to <a href="https://neon.tech" className="text-cyber-cyan hover:underline" target="_blank">neon.tech</a> and create free account</li>
              <li>Create a new project</li>
              <li>Copy the connection string to DATABASE_URL</li>
              <li>Run <code className="bg-muted px-1.5 py-0.5 rounded">npx prisma db push</code> to create tables</li>
              <li>Run <code className="bg-muted px-1.5 py-0.5 rounded">npm run db:seed</code> to create admin user</li>
            </ol>
          </div>
          <div>
            <h4 className="font-medium mb-2">2. Authentication</h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Generate NEXTAUTH_SECRET using: <code className="bg-muted px-1.5 py-0.5 rounded">openssl rand -base64 32</code></li>
              <li>Set NEXTAUTH_URL to your domain (e.g., https://heyibnu.com)</li>
              <li>Default admin credentials: admin@heyibnu.com / admin123</li>
            </ol>
          </div>
          <div>
            <h4 className="font-medium mb-2">3. Email (Optional but Recommended)</h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Go to <a href="https://resend.com" className="text-cyber-cyan hover:underline" target="_blank">resend.com</a> and create free account</li>
              <li>Create an API key and add it to RESEND_API_KEY</li>
              <li>Verify your domain in Resend dashboard</li>
              <li>Free tier: 100 emails/day, 3000 emails/month</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Environment File Template */}
      <div className="glass rounded-xl p-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Environment File Template</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(envFileTemplate, 'template')}
          >
            {copied === 'template' ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Template
              </>
            )}
          </Button>
        </div>
        <pre className="p-4 rounded-lg bg-muted overflow-x-auto text-xs">
          <code>{envFileTemplate}</code>
        </pre>
      </div>
    </AdminLayout>
  )
}

const envFileTemplate = `# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# NextAuth.js
NEXTAUTH_SECRET="your-32-character-secret-key-here"
NEXTAUTH_URL="https://heyibnu.com"

# Resend Email (Optional - Free tier: 100 emails/day)
RESEND_API_KEY="re_xxxxxxxxxxxx"
ADMIN_EMAIL="hi@heyibnu.com"

# Vercel Blob Storage (Optional)
BLOB_READ_WRITE_TOKEN="vercel_blob_xxxxxxxxxxxx"
`

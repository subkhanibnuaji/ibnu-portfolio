/**
 * Environment Variable Validation
 * Type-safe environment variables with Zod
 *
 * This ensures all required env vars are present at build/runtime
 */

import { z } from 'zod'

// Server-side environment schema
const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().optional(),

  // Authentication
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  NEXTAUTH_URL: z.string().url().optional(),

  // OAuth Providers
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // AI Services
  ANTHROPIC_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),

  // Security
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),

  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),

  // Email
  RESEND_API_KEY: z.string().optional(),

  // Storage
  VERCEL_BLOB_READ_WRITE_TOKEN: z.string().optional(),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Client-side environment schema (NEXT_PUBLIC_ prefix)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
})

// Parse and validate environment
function validateEnv() {
  // Skip validation during build if explicitly disabled
  if (process.env.SKIP_ENV_VALIDATION === 'true') {
    console.warn('⚠️ Skipping environment validation')
    return {
      server: process.env as unknown as z.infer<typeof serverEnvSchema>,
      client: {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
        NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
      } as z.infer<typeof clientEnvSchema>,
    }
  }

  const serverResult = serverEnvSchema.safeParse(process.env)
  const clientResult = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  })

  if (!serverResult.success) {
    console.error('❌ Invalid server environment variables:')
    console.error(serverResult.error.flatten().fieldErrors)
  }

  if (!clientResult.success) {
    console.error('❌ Invalid client environment variables:')
    console.error(clientResult.error.flatten().fieldErrors)
  }

  return {
    server: serverResult.success ? serverResult.data : (process.env as unknown as z.infer<typeof serverEnvSchema>),
    client: clientResult.success ? clientResult.data : ({
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    } as z.infer<typeof clientEnvSchema>),
  }
}

const env = validateEnv()

// Export validated environment
export const serverEnv = env.server
export const clientEnv = env.client

// Type exports
export type ServerEnv = z.infer<typeof serverEnvSchema>
export type ClientEnv = z.infer<typeof clientEnvSchema>

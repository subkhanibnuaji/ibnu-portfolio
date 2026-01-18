/**
 * Comprehensive Zod Validation Schemas for Super Apps
 * All API input validation schemas in one place
 */

import { z } from 'zod'

// =============================================================================
// COMMON VALIDATORS
// =============================================================================

export const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(5, 'Email too short')
  .max(255, 'Email too long')
  .transform((v) => v.toLowerCase().trim())

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s\u00C0-\u024F\u1E00-\u1EFF]+$/, 'Name contains invalid characters')
  .transform((v) => v.trim())

export const slugSchema = z
  .string()
  .min(2, 'Slug must be at least 2 characters')
  .max(200, 'Slug must be less than 200 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')

export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .max(2000, 'URL too long')
  .optional()
  .or(z.literal(''))

export const idSchema = z
  .string()
  .min(1, 'ID is required')
  .max(100, 'ID too long')

// =============================================================================
// CONTACT FORM
// =============================================================================

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z
    .string()
    .max(200, 'Subject must be less than 200 characters')
    .optional()
    .default('General Inquiry'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters')
    .transform((v) => v.trim()),
})

export type ContactInput = z.infer<typeof contactSchema>

// =============================================================================
// NEWSLETTER
// =============================================================================

export const newsletterSchema = z.object({
  email: emailSchema,
})

export type NewsletterInput = z.infer<typeof newsletterSchema>

// =============================================================================
// COMMENTS
// =============================================================================

export const commentSchema = z.object({
  postId: idSchema,
  postSlug: slugSchema.optional(),
  parentId: idSchema.optional().nullable(),
  name: nameSchema,
  email: emailSchema,
  content: z
    .string()
    .min(2, 'Comment must be at least 2 characters')
    .max(2000, 'Comment must be less than 2000 characters')
    .transform((v) => v.trim())
    .refine(
      (val) => !containsSpam(val),
      'Comment contains prohibited content'
    ),
})

export type CommentInput = z.infer<typeof commentSchema>

// =============================================================================
// GUESTBOOK
// =============================================================================

export const guestbookSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .transform((v) => v.trim()),
  message: z
    .string()
    .min(5, 'Message must be at least 5 characters')
    .max(500, 'Message must be less than 500 characters')
    .transform((v) => v.trim())
    .refine(
      (val) => !containsSpam(val),
      'Message contains prohibited content'
    ),
})

export type GuestbookInput = z.infer<typeof guestbookSchema>

// =============================================================================
// PROJECTS
// =============================================================================

export const projectStatusSchema = z.enum([
  'PLANNING',
  'IN_PROGRESS',
  'COMPLETED',
  'ON_HOLD',
  'ARCHIVED',
])

export const projectCategorySchema = z.enum([
  'AI',
  'WEB3',
  'SECURITY',
  'FULLSTACK',
  'MOBILE',
  'OTHER',
])

export const projectSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters')
    .transform((v) => v.trim()),
  slug: slugSchema,
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .transform((v) => v.trim()),
  longDesc: z
    .string()
    .max(10000, 'Long description must be less than 10000 characters')
    .optional(),
  category: projectCategorySchema.optional().default('OTHER'),
  status: projectStatusSchema.optional().default('IN_PROGRESS'),
  featured: z.boolean().optional().default(false),
  imageUrl: urlSchema,
  liveUrl: urlSchema,
  githubUrl: urlSchema,
  technologies: z
    .array(z.string().max(50))
    .max(20, 'Maximum 20 technologies allowed')
    .optional()
    .default([]),
  features: z
    .array(z.string().max(200))
    .max(20, 'Maximum 20 features allowed')
    .optional()
    .default([]),
  impact: z
    .string()
    .max(1000, 'Impact must be less than 1000 characters')
    .optional(),
})

export const projectUpdateSchema = projectSchema.partial()

export type ProjectInput = z.infer<typeof projectSchema>
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>

// =============================================================================
// BLOG POSTS
// =============================================================================

export const blogPostSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters')
    .transform((v) => v.trim()),
  slug: slugSchema,
  excerpt: z
    .string()
    .min(10, 'Excerpt must be at least 10 characters')
    .max(500, 'Excerpt must be less than 500 characters')
    .transform((v) => v.trim()),
  content: z
    .string()
    .min(100, 'Content must be at least 100 characters')
    .max(100000, 'Content must be less than 100000 characters'),
  coverImage: urlSchema,
  published: z.boolean().optional().default(false),
  categoryId: idSchema.optional(),
  tags: z.array(z.string().max(50)).max(10).optional().default([]),
})

export type BlogPostInput = z.infer<typeof blogPostSchema>

// =============================================================================
// REACTIONS
// =============================================================================

export const reactionSchema = z.object({
  itemId: idSchema,
  itemType: z.enum(['blog', 'project', 'comment', 'guestbook']),
  reactionType: z.enum(['like', 'love', 'wow', 'sad', 'angry']).optional().default('like'),
})

export type ReactionInput = z.infer<typeof reactionSchema>

// =============================================================================
// SEARCH
// =============================================================================

export const searchSchema = z.object({
  query: z
    .string()
    .min(2, 'Search query must be at least 2 characters')
    .max(100, 'Search query must be less than 100 characters')
    .transform((v) => v.trim()),
  type: z.enum(['all', 'blog', 'projects', 'tools']).optional().default('all'),
  limit: z.coerce.number().min(1).max(50).optional().default(10),
  offset: z.coerce.number().min(0).optional().default(0),
})

export type SearchInput = z.infer<typeof searchSchema>

// =============================================================================
// AUTH
// =============================================================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = loginSchema.extend({
  name: nameSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type RegisterInput = z.infer<typeof registerSchema>

// =============================================================================
// AI/CHAT
// =============================================================================

export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(10000, 'Message must be less than 10000 characters')
    .transform((v) => v.trim()),
  sessionId: idSchema.optional(),
  context: z.record(z.unknown()).optional(),
})

export type ChatMessageInput = z.infer<typeof chatMessageSchema>

// =============================================================================
// UPLOAD
// =============================================================================

export const uploadSchema = z.object({
  filename: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[\w\-. ]+$/, 'Invalid filename'),
  contentType: z
    .string()
    .refine(
      (val) => ALLOWED_MIME_TYPES.includes(val),
      'File type not allowed'
    ),
  size: z
    .number()
    .max(10 * 1024 * 1024, 'File size must be less than 10MB'),
})

export type UploadInput = z.infer<typeof uploadSchema>

// =============================================================================
// HELPERS
// =============================================================================

const SPAM_PATTERNS = [
  /\b(viagra|cialis|casino|lottery|winner|prize|free money|click here|buy now)\b/i,
  /<script/i,
  /javascript:/i,
  /on\w+=/i,
  /data:/i,
]

function containsSpam(text: string): boolean {
  return SPAM_PATTERNS.some((pattern) => pattern.test(text))
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'text/plain',
  'text/markdown',
]

// =============================================================================
// SANITIZATION HELPERS
// =============================================================================

export function sanitizeHtml(html: string): string {
  // Remove potentially dangerous tags and attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, 'data-blocked:')
}

export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// =============================================================================
// VALIDATION HELPER FUNCTION
// =============================================================================

export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

export function formatZodErrors(error: z.ZodError): string {
  return error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
}

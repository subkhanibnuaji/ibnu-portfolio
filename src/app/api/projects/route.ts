/**
 * Projects API
 * Handles project CRUD operations with validation and caching
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { projectSchema, validateInput, formatZodErrors } from '@/lib/validations'
import {
  checkRateLimit,
  rateLimitResponse,
  apiError,
  apiSuccess,
  logAuditEvent,
} from '@/lib/security'

// Cache revalidation time (5 minutes)
export const revalidate = 300

// =============================================================================
// GET - Fetch all projects
// =============================================================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '50')))

    // Build filter
    const where: Record<string, unknown> = {}
    if (featured === 'true') where.featured = true
    if (category) where.category = category.toUpperCase()
    if (status) where.status = status.toUpperCase()

    const projects = await prisma.project.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    })

    return apiSuccess({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return apiError('Failed to fetch projects', 500)
  }
}

// =============================================================================
// POST - Create new project (admin only)
// =============================================================================

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      logAuditEvent(req, 'project_create_unauthorized', false)
      return apiError('Unauthorized', 401)
    }

    // Rate limiting for admin
    const rateLimit = await checkRateLimit(req, 'admin')
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.resetIn)
    }

    // Parse and validate input
    const body = await req.json()
    const validation = validateInput(projectSchema, body)

    if (!validation.success) {
      logAuditEvent(req, 'project_create_validation_failed', false, session.user.id, {
        errors: formatZodErrors(validation.errors),
      })
      return apiError(formatZodErrors(validation.errors), 400)
    }

    const data = validation.data

    // Check for duplicate slug
    const existingProject = await prisma.project.findUnique({
      where: { slug: data.slug },
    })

    if (existingProject) {
      return apiError('A project with this slug already exists', 409)
    }

    // Create project with validated data only
    const project = await prisma.project.create({
      data: {
        title: data.title || '',
        slug: data.slug || '',
        description: data.description || '',
        longDesc: data.longDesc || null,
        category: data.category || 'OTHER',
        status: data.status || 'PLANNING',
        featured: data.featured || false,
        imageUrl: data.imageUrl || null,
        liveUrl: data.liveUrl || null,
        githubUrl: data.githubUrl || null,
        technologies: data.technologies || [],
        features: data.features || [],
        impact: data.impact || null,
      },
    })

    logAuditEvent(req, 'project_created', true, session.user.id, {
      projectId: project.id,
      slug: project.slug,
    })

    return apiSuccess({ project }, 201)
  } catch (error) {
    console.error('Error creating project:', error)
    logAuditEvent(req, 'project_create_error', false, undefined, {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return apiError('Failed to create project', 500)
  }
}

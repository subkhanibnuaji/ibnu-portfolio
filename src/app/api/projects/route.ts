import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST create new project
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      title,
      slug,
      description,
      longDesc,
      category,
      status,
      featured,
      imageUrl,
      liveUrl,
      githubUrl,
      technologies,
      features,
      impact,
    } = body

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        longDesc,
        category,
        status: status || 'IN_PROGRESS',
        featured: featured || false,
        imageUrl,
        liveUrl,
        githubUrl,
        technologies: technologies || [],
        features: features || [],
        impact,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

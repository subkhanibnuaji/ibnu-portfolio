import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Default projects data
const defaultProjects = [
  {
    id: '1',
    slug: 'hub-pkp-klinik-rumah',
    title: 'HUB PKP - Klinik Rumah',
    description: 'Digital housing platform for Indonesia\'s self-built housing program (FLPP & Tapera). End-to-end solution from application to disbursement monitoring.',
    category: 'government',
    status: 'IN_PROGRESS',
    featured: true,
    imageUrl: '/images/projects/hub-pkp.jpg',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'TailwindCSS'],
    features: [
      'Online application portal',
      'Document verification system',
      'Real-time progress tracking',
      'Integration with banking partners',
    ],
    impact: 'Streamlining housing subsidy process for millions of Indonesian families',
  },
  {
    id: '2',
    slug: 'sibaru',
    title: 'SIBARU',
    description: 'Enterprise information system for Ministry of Housing internal operations and data management.',
    category: 'government',
    status: 'COMPLETED',
    featured: false,
    imageUrl: '/images/projects/sibaru.jpg',
    technologies: ['PHP', 'Laravel', 'MySQL', 'Bootstrap', 'jQuery'],
    features: [
      'Employee management',
      'Document workflow',
      'Reporting dashboard',
      'Access control system',
    ],
  },
  {
    id: '3',
    slug: 'simoni',
    title: 'SIMONI',
    description: 'Monitoring and evaluation system for housing development programs across Indonesia.',
    category: 'government',
    status: 'COMPLETED',
    featured: false,
    imageUrl: '/images/projects/simoni.jpg',
    technologies: ['Next.js', 'React', 'PostgreSQL', 'MapBox', 'Chart.js'],
    features: [
      'Geographic visualization',
      'Progress tracking',
      'Performance metrics',
      'Automated reporting',
    ],
  },
  {
    id: '4',
    slug: 'rpa-solutions',
    title: 'RPA Solutions',
    description: 'Robotic Process Automation solutions deployed to 50+ enterprise clients, automating repetitive tasks.',
    category: 'enterprise',
    status: 'COMPLETED',
    featured: false,
    imageUrl: '/images/projects/rpa.jpg',
    technologies: ['UiPath', 'Python', 'VBA', 'SQL Server', 'Power Automate'],
    features: [
      'Invoice processing automation',
      'Data entry automation',
      'Report generation',
      'Email handling bots',
    ],
    impact: '100+ bots deployed, saving thousands of man-hours',
  },
  {
    id: '5',
    slug: 'icp-token-dapp',
    title: 'ICP Token dApp',
    description: 'Decentralized application for fungible token on Internet Computer Protocol blockchain.',
    category: 'web3',
    status: 'COMPLETED',
    featured: false,
    imageUrl: '/images/projects/icp.jpg',
    technologies: ['Motoko', 'React', 'Internet Computer', 'DFX', 'Candid'],
    features: [
      'Token minting',
      'Transfer functionality',
      'Balance checking',
      'Transaction history',
    ],
  },
  {
    id: '6',
    slug: 'animo-fnb-automation',
    title: 'Animo - F&B Automation',
    description: 'Undergraduate thesis project on automating Food & Beverage operations using machine learning.',
    category: 'research',
    status: 'COMPLETED',
    featured: false,
    imageUrl: '/images/projects/animo.jpg',
    technologies: ['Python', 'TensorFlow', 'Flask', 'MySQL', 'OpenCV'],
    features: [
      'Menu recommendation system',
      'Demand forecasting',
      'Inventory optimization',
      'Customer behavior analysis',
    ],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    // Try to get projects from database
    const whereClause: Record<string, unknown> = {}
    if (category) whereClause.category = category
    if (featured === 'true') whereClause.featured = true

    const projects = await prisma.project.findMany({
      where: whereClause,
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
      take: limit ? parseInt(limit) : undefined,
    })

    if (projects.length > 0) {
      return NextResponse.json({
        success: true,
        data: projects,
        count: projects.length,
      })
    }

    // Return filtered default projects if DB is empty
    let filteredProjects = [...defaultProjects]
    if (category) {
      filteredProjects = filteredProjects.filter(p => p.category === category)
    }
    if (featured === 'true') {
      filteredProjects = filteredProjects.filter(p => p.featured)
    }
    if (limit) {
      filteredProjects = filteredProjects.slice(0, parseInt(limit))
    }

    return NextResponse.json({
      success: true,
      data: filteredProjects,
      count: filteredProjects.length,
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({
      success: true,
      data: defaultProjects,
      count: defaultProjects.length,
    })
  }
}

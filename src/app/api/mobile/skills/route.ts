import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const defaultSkills = [
  // Programming Languages
  { id: '1', name: 'TypeScript', category: 'programming', proficiency: 90, icon: 'typescript' },
  { id: '2', name: 'JavaScript', category: 'programming', proficiency: 95, icon: 'javascript' },
  { id: '3', name: 'Python', category: 'programming', proficiency: 85, icon: 'python' },
  { id: '4', name: 'PHP', category: 'programming', proficiency: 75, icon: 'php' },
  { id: '5', name: 'SQL', category: 'programming', proficiency: 85, icon: 'database' },
  { id: '6', name: 'Motoko', category: 'programming', proficiency: 60, icon: 'code' },

  // Frameworks
  { id: '7', name: 'React', category: 'frameworks', proficiency: 90, icon: 'react' },
  { id: '8', name: 'Next.js', category: 'frameworks', proficiency: 90, icon: 'nextjs' },
  { id: '9', name: 'Node.js', category: 'frameworks', proficiency: 85, icon: 'nodejs' },
  { id: '10', name: 'Laravel', category: 'frameworks', proficiency: 75, icon: 'laravel' },
  { id: '11', name: 'Express.js', category: 'frameworks', proficiency: 80, icon: 'express' },
  { id: '12', name: 'TailwindCSS', category: 'frameworks', proficiency: 95, icon: 'tailwind' },

  // AI & ML
  { id: '13', name: 'LLM/RAG', category: 'ai-ml', proficiency: 85, icon: 'brain' },
  { id: '14', name: 'Prompt Engineering', category: 'ai-ml', proficiency: 90, icon: 'sparkles' },
  { id: '15', name: 'TensorFlow', category: 'ai-ml', proficiency: 65, icon: 'tensorflow' },
  { id: '16', name: 'OpenAI API', category: 'ai-ml', proficiency: 90, icon: 'openai' },
  { id: '17', name: 'Claude API', category: 'ai-ml', proficiency: 90, icon: 'anthropic' },

  // Blockchain
  { id: '18', name: 'Web3.js/Ethers', category: 'blockchain', proficiency: 75, icon: 'ethereum' },
  { id: '19', name: 'Smart Contracts', category: 'blockchain', proficiency: 70, icon: 'contract' },
  { id: '20', name: 'DeFi Protocols', category: 'blockchain', proficiency: 85, icon: 'defi' },
  { id: '21', name: 'ICP Development', category: 'blockchain', proficiency: 65, icon: 'icp' },

  // RPA & Automation
  { id: '22', name: 'UiPath', category: 'automation', proficiency: 95, icon: 'uipath' },
  { id: '23', name: 'Power Automate', category: 'automation', proficiency: 85, icon: 'microsoft' },
  { id: '24', name: 'Python Automation', category: 'automation', proficiency: 90, icon: 'python' },

  // DevOps & Tools
  { id: '25', name: 'Git', category: 'devops', proficiency: 90, icon: 'git' },
  { id: '26', name: 'Docker', category: 'devops', proficiency: 75, icon: 'docker' },
  { id: '27', name: 'Vercel', category: 'devops', proficiency: 90, icon: 'vercel' },
  { id: '28', name: 'PostgreSQL', category: 'devops', proficiency: 85, icon: 'postgresql' },
  { id: '29', name: 'Prisma', category: 'devops', proficiency: 90, icon: 'prisma' },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const whereClause: Record<string, unknown> = {}
    if (category) whereClause.category = category

    const skills = await prisma.skill.findMany({
      where: whereClause,
      orderBy: [{ category: 'asc' }, { proficiency: 'desc' }],
    })

    if (skills.length > 0) {
      return NextResponse.json({
        success: true,
        data: skills,
      })
    }

    let filteredSkills = [...defaultSkills]
    if (category) {
      filteredSkills = filteredSkills.filter(s => s.category === category)
    }

    return NextResponse.json({
      success: true,
      data: filteredSkills,
    })
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json({
      success: true,
      data: defaultSkills,
    })
  }
}

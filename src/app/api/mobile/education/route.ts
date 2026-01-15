import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const defaultEducation = [
  {
    id: '1',
    institution: 'Universitas Gadjah Mada (UGM)',
    degree: 'Master of Business Administration',
    field: 'Senior Executive MBA',
    location: 'Yogyakarta, Indonesia',
    gpa: 3.60,
    description: 'Focused on strategic management, digital transformation, and entrepreneurship. Thesis on technology adoption in government institutions.',
    startDate: '2022-08-01',
    endDate: '2024-08-31',
    isCurrent: false,
  },
  {
    id: '2',
    institution: 'Telkom University',
    degree: 'Bachelor of Science',
    field: 'Informatics Engineering',
    location: 'Bandung, Indonesia',
    gpa: 3.34,
    description: 'Majored in software engineering with focus on artificial intelligence and machine learning. Final project on F&B automation using ML.',
    startDate: '2017-08-01',
    endDate: '2021-08-31',
    isCurrent: false,
  },
]

export async function GET() {
  try {
    const education = await prisma.education.findMany({
      orderBy: [{ endDate: 'desc' }, { startDate: 'desc' }],
    })

    if (education.length > 0) {
      return NextResponse.json({
        success: true,
        data: education,
      })
    }

    return NextResponse.json({
      success: true,
      data: defaultEducation,
    })
  } catch (error) {
    console.error('Error fetching education:', error)
    return NextResponse.json({
      success: true,
      data: defaultEducation,
    })
  }
}

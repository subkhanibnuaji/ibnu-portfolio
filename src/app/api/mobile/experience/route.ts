import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const defaultExperience = [
  {
    id: '1',
    company: 'Ministry of Housing & Settlement Areas',
    position: 'Civil Servant (ASN)',
    location: 'Jakarta, Indonesia',
    type: 'full-time',
    description: 'Working on digital transformation initiatives for housing programs, including development and management of information systems for housing subsidies.',
    highlights: [
      'Lead developer for HUB PKP digital platform',
      'System integration with banking partners',
      'Data analysis for policy recommendations',
    ],
    startDate: '2024-08-01',
    endDate: null,
    isCurrent: true,
  },
  {
    id: '2',
    company: 'Virtus Futura Consulting',
    position: 'Founder & CEO',
    location: 'Jakarta, Indonesia',
    type: 'founder',
    description: 'Founded a consulting firm specializing in digital transformation, RPA implementation, and enterprise system development.',
    highlights: [
      'Built team of 15+ professionals',
      'Served Fortune 500 clients',
      'Delivered 50+ successful projects',
    ],
    startDate: '2021-07-01',
    endDate: '2024-07-31',
    isCurrent: false,
  },
  {
    id: '3',
    company: 'CV Solusi Automasi Indonesia',
    position: 'Founder & CEO',
    location: 'Bandung, Indonesia',
    type: 'founder',
    description: 'Started RPA automation company providing robotic process automation solutions to enterprise clients.',
    highlights: [
      'Deployed 100+ automation bots',
      'Served 50+ clients across industries',
      'Achieved 90%+ client satisfaction rate',
    ],
    startDate: '2020-08-01',
    endDate: '2022-08-31',
    isCurrent: false,
  },
  {
    id: '4',
    company: 'Independent',
    position: 'Crypto Investor & Trader',
    location: 'Remote',
    type: 'freelance',
    description: 'Active cryptocurrency investor focusing on DeFi protocols, altcoins, and futures trading with comprehensive portfolio management.',
    highlights: [
      '$68-100K monthly futures trading volume',
      'Diversified portfolio across multiple chains',
      'Active in DeFi yield farming',
    ],
    startDate: '2021-07-01',
    endDate: null,
    isCurrent: true,
  },
]

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
    })

    if (experiences.length > 0) {
      return NextResponse.json({
        success: true,
        data: experiences,
      })
    }

    return NextResponse.json({
      success: true,
      data: defaultExperience,
    })
  } catch (error) {
    console.error('Error fetching experience:', error)
    return NextResponse.json({
      success: true,
      data: defaultExperience,
    })
  }
}

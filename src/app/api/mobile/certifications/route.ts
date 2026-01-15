import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const defaultCertifications = [
  // Elite Universities
  { id: '1', name: 'CS50x Introduction to Computer Science', issuer: 'Harvard University', category: 'university', issueDate: '2020-12-01' },
  { id: '2', name: 'Machine Learning Specialization', issuer: 'Stanford University', category: 'university', issueDate: '2021-06-01' },
  { id: '3', name: 'Blockchain and FinTech', issuer: 'University of Cambridge', category: 'university', issueDate: '2021-09-01' },
  { id: '4', name: 'Digital Transformation Leadership', issuer: 'INSEAD', category: 'university', issueDate: '2022-03-01' },

  // Tech Giants
  { id: '5', name: 'Google Cloud Professional', issuer: 'Google', category: 'tech', issueDate: '2021-04-01' },
  { id: '6', name: 'IBM Data Science Professional', issuer: 'IBM', category: 'tech', issueDate: '2020-08-01' },
  { id: '7', name: 'AWS Cloud Practitioner', issuer: 'Amazon', category: 'tech', issueDate: '2021-11-01' },
  { id: '8', name: 'Microsoft Azure Fundamentals', issuer: 'Microsoft', category: 'tech', issueDate: '2021-07-01' },

  // Consulting Firms
  { id: '9', name: 'Problem Solving', issuer: 'McKinsey & Company', category: 'consulting', issueDate: '2022-01-01' },
  { id: '10', name: 'Strategy Consulting', issuer: 'BCG', category: 'consulting', issueDate: '2022-02-01' },
  { id: '11', name: 'Digital Transformation', issuer: 'Deloitte', category: 'consulting', issueDate: '2021-10-01' },
  { id: '12', name: 'Risk Management', issuer: 'PwC', category: 'consulting', issueDate: '2022-04-01' },
  { id: '13', name: 'Strategy & Operations', issuer: 'EY', category: 'consulting', issueDate: '2022-05-01' },
  { id: '14', name: 'Data Analytics', issuer: 'KPMG', category: 'consulting', issueDate: '2021-12-01' },
  { id: '15', name: 'Digital Consulting', issuer: 'Accenture', category: 'consulting', issueDate: '2022-06-01' },

  // Finance
  { id: '16', name: 'Investment Banking Virtual Experience', issuer: 'JP Morgan', category: 'finance', issueDate: '2021-08-01' },
  { id: '17', name: 'Securities Virtual Experience', issuer: 'Goldman Sachs', category: 'finance', issueDate: '2021-09-01' },
  { id: '18', name: 'Global Markets', issuer: 'Bank of America', category: 'finance', issueDate: '2022-07-01' },
  { id: '19', name: 'Financial Markets', issuer: 'Citi', category: 'finance', issueDate: '2021-05-01' },

  // Specialized
  { id: '20', name: 'UiPath Advanced Developer', issuer: 'UiPath', category: 'specialized', issueDate: '2020-06-01' },
  { id: '21', name: 'CCNA Routing & Switching', issuer: 'Cisco', category: 'specialized', issueDate: '2019-12-01' },
  { id: '22', name: 'SAP Business One', issuer: 'SAP', category: 'specialized', issueDate: '2021-03-01' },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')

    const whereClause: Record<string, unknown> = {}
    if (category) whereClause.category = category

    const certifications = await prisma.certification.findMany({
      where: whereClause,
      orderBy: [{ issueDate: 'desc' }],
      take: limit ? parseInt(limit) : undefined,
    })

    if (certifications.length > 0) {
      return NextResponse.json({
        success: true,
        data: certifications,
        count: certifications.length,
      })
    }

    let filteredCerts = [...defaultCertifications]
    if (category) {
      filteredCerts = filteredCerts.filter(c => c.category === category)
    }
    if (limit) {
      filteredCerts = filteredCerts.slice(0, parseInt(limit))
    }

    return NextResponse.json({
      success: true,
      data: filteredCerts,
      count: filteredCerts.length,
    })
  } catch (error) {
    console.error('Error fetching certifications:', error)
    return NextResponse.json({
      success: true,
      data: defaultCertifications,
      count: defaultCertifications.length,
    })
  }
}

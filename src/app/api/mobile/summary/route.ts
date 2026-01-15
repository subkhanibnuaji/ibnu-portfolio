import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// This endpoint returns a summary of all portfolio data for initial app load
export async function GET() {
  try {
    // Fetch all data in parallel for better performance
    const [
      projectsCount,
      certificationsCount,
      experiencesCount,
      skillsCount,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.certification.count(),
      prisma.experience.count(),
      prisma.skill.count(),
    ])

    const profile = {
      name: 'Subkhan Ibnu Aji',
      title: 'S.Kom., M.B.A.',
      tagline: 'Civil Servant | Tech Enthusiast | Crypto Investor',
      currentRole: 'Civil Servant at Ministry of Housing & Settlement Areas',
      location: 'Jakarta, Indonesia',
    }

    const stats = {
      projects: projectsCount || 7,
      certifications: certificationsCount || 50,
      experience: experiencesCount || 4,
      skills: skillsCount || 29,
    }

    const highlights = [
      { icon: 'briefcase', label: 'Current Role', value: 'Civil Servant at Kementerian PUPR' },
      { icon: 'graduation-cap', label: 'Education', value: 'MBA from UGM, S.Kom from Telkom University' },
      { icon: 'award', label: 'Certifications', value: '50+ from Top Institutions' },
      { icon: 'code', label: 'Projects', value: '7+ Completed Projects' },
      { icon: 'trending-up', label: 'Trading Volume', value: '$68-100K Monthly' },
    ]

    const quickLinks = [
      { id: 'projects', label: 'Projects', icon: 'folder', route: '/projects' },
      { id: 'experience', label: 'Experience', icon: 'briefcase', route: '/experience' },
      { id: 'skills', label: 'Skills', icon: 'code', route: '/skills' },
      { id: 'certifications', label: 'Certifications', icon: 'award', route: '/certifications' },
      { id: 'interests', label: 'Interests', icon: 'heart', route: '/interests' },
      { id: 'contact', label: 'Contact', icon: 'mail', route: '/contact' },
    ]

    return NextResponse.json({
      success: true,
      data: {
        profile,
        stats,
        highlights,
        quickLinks,
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Error fetching summary:', error)
    // Return default data on error
    return NextResponse.json({
      success: true,
      data: {
        profile: {
          name: 'Subkhan Ibnu Aji',
          title: 'S.Kom., M.B.A.',
          tagline: 'Civil Servant | Tech Enthusiast | Crypto Investor',
          currentRole: 'Civil Servant at Ministry of Housing & Settlement Areas',
          location: 'Jakarta, Indonesia',
        },
        stats: {
          projects: 7,
          certifications: 50,
          experience: 4,
          skills: 29,
        },
        highlights: [
          { icon: 'briefcase', label: 'Current Role', value: 'Civil Servant at Kementerian PUPR' },
          { icon: 'graduation-cap', label: 'Education', value: 'MBA from UGM, S.Kom from Telkom University' },
          { icon: 'award', label: 'Certifications', value: '50+ from Top Institutions' },
        ],
        quickLinks: [
          { id: 'projects', label: 'Projects', icon: 'folder', route: '/projects' },
          { id: 'experience', label: 'Experience', icon: 'briefcase', route: '/experience' },
          { id: 'skills', label: 'Skills', icon: 'code', route: '/skills' },
          { id: 'certifications', label: 'Certifications', icon: 'award', route: '/certifications' },
          { id: 'contact', label: 'Contact', icon: 'mail', route: '/contact' },
        ],
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
      },
    })
  }
}

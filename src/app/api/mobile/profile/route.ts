import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Profile data for mobile app
const defaultProfile = {
  name: 'Subkhan Ibnu Aji',
  title: 'S.Kom., M.B.A.',
  tagline: 'Civil Servant | Tech Enthusiast | Crypto Investor',
  bio: `Civil Servant at Ministry of Housing & Settlement Areas, passionate about leveraging technology for government digital transformation. Former founder with expertise in RPA, enterprise systems, and blockchain technology.`,
  email: 'contact@ibnuaji.com',
  location: 'Jakarta, Indonesia',
  avatarUrl: '/images/avatar.jpg',
  socialLinks: [
    { platform: 'github', url: 'https://github.com/subkhanibnuaji', username: 'subkhanibnuaji' },
    { platform: 'linkedin', url: 'https://linkedin.com/in/subkhanibnuaji', username: 'subkhanibnuaji' },
    { platform: 'twitter', url: 'https://twitter.com/subkhanibnuaji', username: 'subkhanibnuaji' },
  ],
}

export async function GET() {
  try {
    // Try to get profile from database first
    const profile = await prisma.profile.findFirst({
      where: { isPublic: true },
      include: { socialLinks: true },
    })

    if (profile) {
      return NextResponse.json({
        success: true,
        data: profile,
      })
    }

    // Return default profile if not found in DB
    return NextResponse.json({
      success: true,
      data: defaultProfile,
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    // Return default profile on error
    return NextResponse.json({
      success: true,
      data: defaultProfile,
    })
  }
}

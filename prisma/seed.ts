import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@heyibnu.com' },
    update: {},
    create: {
      email: 'admin@heyibnu.com',
      name: 'Ibnu Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create profile
  const profile = await prisma.profile.upsert({
    where: { id: 'main-profile' },
    update: {},
    create: {
      id: 'main-profile',
      name: 'Subkhan Ibnu Aji',
      title: 'S.Kom., M.B.A.',
      tagline: 'Government Tech Leader • AI Researcher • Crypto Enthusiast',
      bio: 'Cross-functional professional with expertise in Digital Transformation, IT Governance, AI/ML, Blockchain/Web3, and Cybersecurity. Currently serving at Indonesia\'s Ministry of Housing and Settlement Areas.',
      email: 'hi@heyibnu.com',
      location: 'Jakarta, Indonesia',
    },
  })
  console.log('✅ Profile created:', profile.name)

  // Create projects
  const projects = [
    {
      slug: 'hub-pkp',
      title: 'HUB PKP - Klinik Rumah',
      description: 'Comprehensive digital platform for Indonesia\'s self-built housing program under Ministry PKP.',
      category: 'Government',
      status: 'IN_PROGRESS' as const,
      featured: true,
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'SIMBG API'],
      features: [
        'AI-powered house design consultation',
        'Integrated permit processing (PBG/SIMBG)',
        'Material marketplace with price comparison',
        'Certified worker facilitation',
        'Housing finance integration with banks',
        'Construction monitoring system',
      ],
      impact: 'Streamlines housing construction process for 84% of Indonesian homes built through self-construction',
    },
    {
      slug: 'sibaru',
      title: 'SIBARU',
      description: 'Enterprise information system for ministry operations and data management.',
      category: 'Government',
      status: 'COMPLETED' as const,
      featured: false,
      technologies: ['React', 'FastAPI', 'PostgreSQL', 'Docker'],
      features: ['User management', 'Document management', 'Reporting'],
    },
    {
      slug: 'simoni',
      title: 'SIMONI',
      description: 'Comprehensive monitoring and evaluation system for housing program tracking and reporting.',
      category: 'Government',
      status: 'COMPLETED' as const,
      featured: false,
      technologies: ['React', 'Node.js', 'MongoDB', 'Chart.js'],
      features: ['Real-time monitoring', 'Interactive dashboards', 'Automated reports'],
    },
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    })
  }
  console.log('✅ Projects created:', projects.length)

  // Create certifications
  const certifications = [
    { name: 'Leadership', issuer: 'Harvard University', category: 'university', issueDate: new Date('2022-01-01') },
    { name: 'Machine Learning', issuer: 'Stanford University', category: 'university', issueDate: new Date('2022-01-01') },
    { name: 'Web3 & Blockchain Fundamentals', issuer: 'INSEAD', category: 'university', issueDate: new Date('2023-01-01') },
    { name: 'Cybersecurity Specialization', issuer: 'Google', category: 'tech', issueDate: new Date('2024-01-01') },
    { name: 'AI Engineering Specialization', issuer: 'IBM', category: 'tech', issueDate: new Date('2024-01-01') },
    { name: 'Forward Program', issuer: 'McKinsey & Company', category: 'consulting', issueDate: new Date('2022-01-01') },
  ]

  for (const cert of certifications) {
    await prisma.certification.create({
      data: cert,
    })
  }
  console.log('✅ Certifications created:', certifications.length)

  // Create experience
  const experiences = [
    {
      company: 'Ministry of Housing & Settlement Areas (PKP)',
      position: 'Civil Servant (ASN)',
      location: 'Jakarta, Indonesia',
      type: 'full-time',
      description: 'Managing end-to-end delivery of multiple enterprise IT applications including SIBARU, PKP HUB, and SIMONI.',
      highlights: [
        'Lead development of PKP HUB digital housing ecosystem',
        'Coordinate vendor delivery and user adoption',
        'Support ministerial policy drafting',
        'Evaluate procurement proposals >IDR 10B',
      ],
      startDate: new Date('2024-08-01'),
      isCurrent: true,
    },
    {
      company: 'Virtus Futura Consulting',
      position: 'Founder & CEO',
      location: 'Jakarta, Indonesia',
      type: 'founder',
      description: 'Led project-based consulting in strategy, operations, and digital transformation. Managed portfolio value >IDR 1T.',
      highlights: [
        'Hospital feasibility studies (IDR 331B project)',
        'Healthcare turnaround management',
        'F&B scale-up operations (IDR 100M to IDR 1B/month)',
      ],
      startDate: new Date('2021-07-01'),
      endDate: new Date('2024-07-01'),
      isCurrent: false,
    },
  ]

  for (const exp of experiences) {
    await prisma.experience.create({
      data: exp,
    })
  }
  console.log('✅ Experiences created:', experiences.length)

  // Create skills
  const skills = [
    { name: 'Python', category: 'programming', proficiency: 90 },
    { name: 'JavaScript', category: 'programming', proficiency: 85 },
    { name: 'TypeScript', category: 'programming', proficiency: 80 },
    { name: 'React/Next.js', category: 'frameworks', proficiency: 85 },
    { name: 'Node.js', category: 'frameworks', proficiency: 80 },
    { name: 'LLM Workflows', category: 'ai-ml', proficiency: 85 },
    { name: 'Prompt Engineering', category: 'ai-ml', proficiency: 90 },
    { name: 'DeFi Protocols', category: 'blockchain', proficiency: 80 },
    { name: 'AWS', category: 'cloud', proficiency: 80 },
    { name: 'Project Management', category: 'management', proficiency: 90 },
  ]

  for (const skill of skills) {
    await prisma.skill.create({
      data: skill,
    })
  }
  console.log('✅ Skills created:', skills.length)

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

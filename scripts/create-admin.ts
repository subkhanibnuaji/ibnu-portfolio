/**
 * Script to create admin user for the portfolio dashboard
 *
 * Usage:
 * 1. Make sure DATABASE_URL is set in .env or environment
 * 2. Run: npx ts-node scripts/create-admin.ts
 *
 * Or with custom credentials:
 * ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword npx ts-node scripts/create-admin.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@heyibnu.com'
  const password = process.env.ADMIN_PASSWORD || 'AdminPortfolio2024!'
  const name = process.env.ADMIN_NAME || 'Subkhan Ibnu Aji'

  console.log('Creating admin user...')
  console.log(`Email: ${email}`)

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    console.log('User already exists. Updating to SUPER_ADMIN role...')
    await prisma.user.update({
      where: { email },
      data: {
        role: 'SUPER_ADMIN',
        password: await bcrypt.hash(password, 12)
      }
    })
    console.log('User updated successfully!')
  } else {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        emailVerified: new Date()
      }
    })

    console.log('Admin user created successfully!')
    console.log(`User ID: ${user.id}`)
  }

  console.log('\n=== LOGIN CREDENTIALS ===')
  console.log(`URL: https://ibnu-portfolio-ashen.vercel.app/admin/login`)
  console.log(`Email: ${email}`)
  console.log(`Password: ${password}`)
  console.log('=========================\n')
}

main()
  .catch((e) => {
    console.error('Error creating admin:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

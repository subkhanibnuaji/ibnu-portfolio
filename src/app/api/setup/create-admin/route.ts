import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

// Secret key to prevent unauthorized access
const SETUP_SECRET = process.env.NEXTAUTH_SECRET || 'setup-secret-key'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, secret } = body

    // Verify setup secret
    if (secret !== SETUP_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid setup secret.' },
        { status: 401 }
      )
    }

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      // Update existing user to SUPER_ADMIN
      const hashedPassword = await bcrypt.hash(password, 12)
      await prisma.user.update({
        where: { email },
        data: {
          role: 'SUPER_ADMIN',
          password: hashedPassword,
          name: name || existingUser.name
        }
      })

      return NextResponse.json({
        success: true,
        message: 'User updated to SUPER_ADMIN',
        email
      })
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email,
        name: name || 'Admin',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        emailVerified: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      userId: user.id,
      email: user.email
    })

  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json(
      { error: 'Failed to create admin user', details: String(error) },
      { status: 500 }
    )
  }
}

// GET endpoint to check if admin exists
export async function GET() {
  try {
    const adminCount = await prisma.user.count({
      where: {
        role: { in: ['ADMIN', 'SUPER_ADMIN'] }
      }
    })

    return NextResponse.json({
      hasAdmin: adminCount > 0,
      adminCount
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Database not connected', details: String(error) },
      { status: 500 }
    )
  }
}

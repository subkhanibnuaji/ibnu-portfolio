import { NextResponse } from 'next/server'

const envVariables = [
  { key: 'DATABASE_URL', required: true },
  { key: 'DIRECT_URL', required: false },
  { key: 'NEXTAUTH_SECRET', required: true },
  { key: 'NEXTAUTH_URL', required: true },
  { key: 'RESEND_API_KEY', required: false },
  { key: 'ADMIN_EMAIL', required: false },
  { key: 'BLOB_READ_WRITE_TOKEN', required: false },
]

export async function GET() {
  const status = envVariables.map((envVar) => ({
    key: envVar.key,
    configured: !!process.env[envVar.key],
    required: envVar.required,
  }))

  return NextResponse.json({ status })
}

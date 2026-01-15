import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Don't redirect on login page
  const isLoginPage = false // Will be handled client-side

  if (!session && !isLoginPage) {
    // Let middleware handle this
  }

  return <>{children}</>
}

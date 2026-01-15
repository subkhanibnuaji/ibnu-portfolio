'use client'

import { AdminLayout } from '@/components/admin/admin-layout'
import { ProjectForm } from '@/components/admin/project-form'

export default function NewProjectPage() {
  const handleSubmit = async (data: any) => {
    // For now, just simulate saving - will connect to API later
    console.log('Creating project:', data)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // When database is connected:
    // await fetch('/api/projects', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // })
  }

  return (
    <AdminLayout
      title="New Project"
      description="Add a new project to your portfolio"
    >
      <ProjectForm onSubmit={handleSubmit} />
    </AdminLayout>
  )
}

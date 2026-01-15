'use client'

import { useParams } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { ProjectForm } from '@/components/admin/project-form'

// Mock data - will be replaced with API call
const mockProject = {
  id: '1',
  slug: 'hub-pkp',
  title: 'HUB PKP - Klinik Rumah',
  description: 'Comprehensive digital platform for Indonesia\'s self-built housing program.',
  longDesc: 'HUB PKP is the flagship digital platform I developed to transform Indonesia\'s self-built housing ecosystem.',
  category: 'Government',
  status: 'IN_PROGRESS',
  featured: true,
  imageUrl: '',
  liveUrl: '',
  githubUrl: '',
  technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
  features: [
    'AI-powered house design consultation',
    'Integrated permit processing (PBG/SIMBG)',
    'Material marketplace with price comparison',
  ],
  impact: 'Streamlines housing construction process for 84% of Indonesian homes.',
}

export default function EditProjectPage() {
  const params = useParams()
  const projectId = params.id as string

  // In real app, fetch project data
  const project = mockProject

  const handleSubmit = async (data: any) => {
    console.log('Updating project:', projectId, data)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // When database is connected:
    // await fetch(`/api/projects/${projectId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // })
  }

  return (
    <AdminLayout
      title="Edit Project"
      description={`Editing: ${project.title}`}
    >
      <ProjectForm project={project} onSubmit={handleSubmit} />
    </AdminLayout>
  )
}

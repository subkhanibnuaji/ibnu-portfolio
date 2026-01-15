import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// This generates a PDF-like image that can be saved/printed
// For actual PDF generation, consider using a library like @react-pdf/renderer on client side
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') || 'image' // image or html

  // Profile data (in production, fetch from database)
  const profile = {
    name: 'Subkhan Ibnu Aji',
    title: 'Full Stack Developer',
    email: 'contact@ibnuaji.com',
    location: 'Indonesia',
    phone: '+62 xxx xxxx xxxx',
    website: 'https://ibnuaji.com',
    summary: 'Experienced Full Stack Developer with expertise in modern web technologies, blockchain development, and AI/ML integration. Passionate about building scalable and user-friendly applications.',
    skills: [
      'TypeScript', 'React', 'Next.js', 'Node.js',
      'Python', 'PostgreSQL', 'MongoDB', 'AWS',
      'Docker', 'Kubernetes', 'Solidity', 'Web3'
    ],
    experience: [
      {
        company: 'Tech Company',
        position: 'Senior Full Stack Developer',
        period: '2022 - Present',
        highlights: [
          'Led development of microservices architecture',
          'Improved system performance by 40%',
          'Mentored junior developers'
        ]
      },
      {
        company: 'Startup Inc',
        position: 'Full Stack Developer',
        period: '2020 - 2022',
        highlights: [
          'Built React Native mobile application',
          'Implemented CI/CD pipelines',
          'Developed REST and GraphQL APIs'
        ]
      }
    ],
    education: [
      {
        institution: 'University',
        degree: 'Bachelor of Computer Science',
        period: '2016 - 2020'
      }
    ]
  }

  // If HTML format requested, return styled HTML for printing
  if (format === 'html') {
    const html = generateResumeHTML(profile)
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  }

  // Generate image (A4 size: 210mm x 297mm at 96 DPI = 794 x 1123 pixels)
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          padding: '48px',
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: 0, color: '#1a1a1a' }}>
              {profile.name}
            </h1>
            <p style={{ fontSize: '18px', color: '#3b82f6', margin: '8px 0 0 0' }}>
              {profile.title}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '12px', color: '#666' }}>
            <span>{profile.email}</span>
            <span>{profile.phone}</span>
            <span>{profile.location}</span>
            <span>{profile.website}</span>
          </div>
        </div>

        {/* Summary */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a1a', borderBottom: '2px solid #3b82f6', paddingBottom: '4px', marginBottom: '12px' }}>
            Summary
          </h2>
          <p style={{ fontSize: '12px', color: '#444', lineHeight: 1.6, margin: 0 }}>
            {profile.summary}
          </p>
        </div>

        {/* Skills */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a1a', borderBottom: '2px solid #3b82f6', paddingBottom: '4px', marginBottom: '12px' }}>
            Skills
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {profile.skills.map((skill, i) => (
              <span
                key={i}
                style={{
                  fontSize: '11px',
                  padding: '4px 12px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '4px',
                  color: '#334155'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a1a', borderBottom: '2px solid #3b82f6', paddingBottom: '4px', marginBottom: '12px' }}>
            Experience
          </h2>
          {profile.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, color: '#1a1a1a' }}>
                  {exp.position}
                </h3>
                <span style={{ fontSize: '11px', color: '#666' }}>{exp.period}</span>
              </div>
              <p style={{ fontSize: '12px', color: '#3b82f6', margin: '2px 0 8px 0' }}>
                {exp.company}
              </p>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#444' }}>
                {exp.highlights.map((h, j) => (
                  <li key={j} style={{ marginBottom: '4px' }}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education */}
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a1a', borderBottom: '2px solid #3b82f6', paddingBottom: '4px', marginBottom: '12px' }}>
            Education
          </h2>
          {profile.education.map((edu, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, color: '#1a1a1a' }}>
                  {edu.degree}
                </h3>
                <p style={{ fontSize: '12px', color: '#666', margin: '2px 0 0 0' }}>
                  {edu.institution}
                </p>
              </div>
              <span style={{ fontSize: '11px', color: '#666' }}>{edu.period}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 794,
      height: 1123,
    }
  )
}

function generateResumeHTML(profile: any) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.name} - Resume</title>
  <style>
    @media print {
      body { margin: 0; padding: 20mm; }
      .no-print { display: none; }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; line-height: 1.5; color: #1a1a1a; max-width: 210mm; margin: 0 auto; padding: 48px; background: white; }
    h1 { font-size: 28px; font-weight: 700; }
    h2 { font-size: 16px; font-weight: 600; border-bottom: 2px solid #3b82f6; padding-bottom: 4px; margin: 24px 0 12px; }
    h3 { font-size: 14px; font-weight: 600; }
    .header { display: flex; justify-content: space-between; margin-bottom: 24px; }
    .title { color: #3b82f6; font-size: 16px; margin-top: 4px; }
    .contact { text-align: right; font-size: 12px; color: #666; }
    .contact span { display: block; }
    .summary { font-size: 13px; color: #444; }
    .skills { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill { font-size: 11px; padding: 4px 12px; background: #f1f5f9; border-radius: 4px; }
    .exp-item { margin-bottom: 16px; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
    .exp-company { color: #3b82f6; font-size: 13px; margin: 2px 0 8px; }
    .exp-period { font-size: 11px; color: #666; }
    ul { padding-left: 20px; font-size: 12px; color: #444; }
    li { margin-bottom: 4px; }
    .print-btn { position: fixed; bottom: 20px; right: 20px; padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }
    .print-btn:hover { background: #2563eb; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>${profile.name}</h1>
      <p class="title">${profile.title}</p>
    </div>
    <div class="contact">
      <span>${profile.email}</span>
      <span>${profile.phone}</span>
      <span>${profile.location}</span>
      <span>${profile.website}</span>
    </div>
  </div>

  <h2>Summary</h2>
  <p class="summary">${profile.summary}</p>

  <h2>Skills</h2>
  <div class="skills">
    ${profile.skills.map((s: string) => `<span class="skill">${s}</span>`).join('')}
  </div>

  <h2>Experience</h2>
  ${profile.experience.map((exp: any) => `
    <div class="exp-item">
      <div class="exp-header">
        <h3>${exp.position}</h3>
        <span class="exp-period">${exp.period}</span>
      </div>
      <p class="exp-company">${exp.company}</p>
      <ul>
        ${exp.highlights.map((h: string) => `<li>${h}</li>`).join('')}
      </ul>
    </div>
  `).join('')}

  <h2>Education</h2>
  ${profile.education.map((edu: any) => `
    <div class="exp-item">
      <div class="exp-header">
        <h3>${edu.degree}</h3>
        <span class="exp-period">${edu.period}</span>
      </div>
      <p class="exp-company">${edu.institution}</p>
    </div>
  `).join('')}

  <button class="print-btn no-print" onclick="window.print()">Print / Save PDF</button>
</body>
</html>
  `
}

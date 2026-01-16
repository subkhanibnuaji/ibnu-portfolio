import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Get dynamic params
    const title = searchParams.get('title') || 'Ibnu Portfolio'
    const description = searchParams.get('description') || 'AI • Blockchain • Cybersecurity'
    const type = searchParams.get('type') || 'default' // default, blog, project

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0f',
            backgroundImage: 'radial-gradient(circle at 25% 25%, #00d4ff15 0%, transparent 50%), radial-gradient(circle at 75% 75%, #7c3aed15 0%, transparent 50%)',
          }}
        >
          {/* Border gradient effect */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 60px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(124,58,237,0.1) 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                IBNU
              </span>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#00d4ff',
                  marginLeft: '8px',
                }}
              />
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: type === 'blog' ? '48px' : '56px',
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                margin: '0 0 16px 0',
                maxWidth: '900px',
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: '24px',
                color: 'rgba(255,255,255,0.7)',
                textAlign: 'center',
                margin: 0,
                maxWidth: '700px',
              }}
            >
              {description}
            </p>

            {/* Tags for blog type */}
            {type === 'blog' && (
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '24px',
                }}
              >
                {['AI', 'Tech', 'Tutorial'].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(0,212,255,0.2)',
                      color: '#00d4ff',
                      fontSize: '16px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '32px',
                gap: '24px',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px' }}>
                ibnu-portfolio-ashen.vercel.app
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.error('OG Image generation failed:', e)
    return new Response('Failed to generate image', { status: 500 })
  }
}

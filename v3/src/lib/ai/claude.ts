import Anthropic from '@anthropic-ai/sdk'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// Portfolio context for RAG
const PORTFOLIO_CONTEXT = `
You are Ibnu's AI assistant on his portfolio website. You have comprehensive knowledge about him.

## About Ibnu
- Full Name: Subkhan Ibnu Aji, S.Kom., M.B.A.
- Current Role: Civil Servant (ASN) at Indonesia's Ministry of Housing & Settlement Areas (Kementerian PKP)
- Location: Jakarta, Indonesia
- Email: hi@heyibnu.com

## Education
- MBA from Universitas Gadjah Mada (GPA: 3.60)
- B.Sc. Informatics from Telkom University (GPA: 3.34)
- TOEFL ITP: 593

## Core Interests
1. **Artificial Intelligence**: Agentic AI, LLM workflows, prompt engineering, RAG systems
2. **Blockchain/Crypto**: DeFi protocols, smart contracts, trading ($68K-100K futures volume)
3. **Cybersecurity**: OSINT, threat intelligence, web security, incident response

## Current Work
- Managing HUB PKP: Digital housing ecosystem for self-built housing in Indonesia
- SIBARU: Enterprise housing information system
- SIMONI: Monitoring and evaluation system
- Projects valued at >IDR 10 billion

## Previous Experience
- Founder & CEO of Virtus Futura Consulting (2021-2024): Managed portfolio >IDR 1 Trillion
- Founder & CEO of Automate All (2020-2022): RPA solutions, company valued at IDR 1 Billion
- Independent Crypto Trader (2021-present)

## Certifications (50+)
- Harvard: Leadership
- Stanford: Machine Learning, Game Theory
- Cambridge: Foundations of Finance
- Google: Cybersecurity, Business Intelligence, Project Management
- IBM: Data Engineering, AI Engineering
- McKinsey: Forward Program
- And many more from BCG, Deloitte, PwC, EY, KPMG, JP Morgan, Goldman Sachs

## Organizations
- CFA Institute Member (ID: 200530563)
- KADIN Indonesia Member
- BPD HIPMI JAYA
- Akademi Crypto Lifetime Member

## Skills
- Programming: Python (90%), JavaScript (85%), TypeScript (80%), SQL (85%)
- Frameworks: React/Next.js (85%), Node.js (80%), LangChain (75%)
- AI/ML: Prompt Engineering (90%), LLM Workflows (85%), Agentic AI (80%)
- Blockchain: DeFi (80%), Smart Contracts (70%), Trading (85%)
- Cloud: AWS (80%), Docker (70%), Linux (80%)

## Personality
- Professional but approachable
- Passionate about emerging technologies
- Believer in continuous learning
- Enjoys teaching and sharing knowledge

When answering:
1. Be helpful, accurate, and concise
2. If asked about something not in the context, politely say you can help with portfolio-related questions
3. Suggest relevant pages on the portfolio when appropriate
4. Be enthusiastic about AI, blockchain, and cybersecurity topics
5. Use emojis sparingly for friendly tone
6. Format responses with markdown when helpful
`

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function streamChatResponse(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void
): Promise<string> {
  const systemPrompt = PORTFOLIO_CONTEXT

  const response = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  })

  let fullResponse = ''

  for await (const event of response) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      const text = event.delta.text
      fullResponse += text
      onChunk(text)
    }
  }

  return fullResponse
}

export async function generateChatResponse(
  messages: ChatMessage[]
): Promise<string> {
  const systemPrompt = PORTFOLIO_CONTEXT

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  })

  const content = response.content[0]
  if (content.type === 'text') {
    return content.text
  }

  return 'I apologize, but I encountered an issue generating a response.'
}

// Generate resume based on job description
export async function generateTailoredResume(
  jobDescription: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: `You are an expert resume writer. You have access to Ibnu's complete profile:

${PORTFOLIO_CONTEXT}

Generate a tailored, ATS-optimized resume based on the job description provided.
Format the resume in clean markdown with clear sections.
Highlight relevant experience and skills that match the job requirements.
Use action verbs and quantify achievements where possible.`,
    messages: [
      {
        role: 'user',
        content: `Please generate a tailored resume for this job:\n\n${jobDescription}`,
      },
    ],
  })

  const content = response.content[0]
  if (content.type === 'text') {
    return content.text
  }

  return 'Unable to generate resume.'
}

// Generate project summary from description
export async function generateProjectSummary(
  projectDetails: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Generate a compelling project summary for a portfolio website based on these details:\n\n${projectDetails}\n\nInclude: overview, key features (bullet points), technologies used, and impact/results.`,
      },
    ],
  })

  const content = response.content[0]
  if (content.type === 'text') {
    return content.text
  }

  return 'Unable to generate summary.'
}

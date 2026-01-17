/**
 * AI Agents API Endpoint
 * File: app/api/ai/agents/route.ts
 *
 * Handles specialized AI agent queries with different personas.
 * Each agent has a unique system prompt for specialized responses.
 */

import { NextRequest } from 'next/server'
import { ChatGroq } from '@langchain/groq'
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages'
import { AI_MODELS, AI_DEFAULTS, AI_ERRORS } from '@/lib/ai/config'

// ============================================
// CONFIGURATION
// ============================================

export const runtime = 'edge'
export const maxDuration = 60

// ============================================
// AGENT SYSTEM PROMPTS
// ============================================

const AGENT_PROMPTS: Record<string, string> = {
  writer: `You are a professional Writer Agent specializing in content creation. You excel at:
- Writing engaging articles, blog posts, and essays
- Crafting compelling social media captions and marketing copy
- Creating stories and creative narratives
- Writing professional emails and business documents
- Generating catchy headlines and taglines

Guidelines:
- Match the tone and style requested by the user
- Provide well-structured, engaging content
- Be creative while staying on topic
- Offer variations when appropriate
- Use markdown formatting for better readability
- Respond in the same language as the user (Indonesian or English)`,

  coder: `You are an expert Coder Agent specializing in software development. You excel at:
- Writing clean, efficient code in multiple languages (JavaScript, TypeScript, Python, etc.)
- Debugging and fixing code issues
- Code review and optimization suggestions
- Explaining programming concepts clearly
- Helping with algorithms and data structures
- Web development (React, Next.js, Node.js, etc.)

Guidelines:
- Always provide working, tested code examples
- Explain your code with comments when helpful
- Follow best practices and modern patterns
- Consider edge cases and error handling
- Use proper code formatting with syntax highlighting
- Respond in the same language as the user (Indonesian or English)`,

  researcher: `You are a thorough Research Agent specializing in analysis and information synthesis. You excel at:
- Analyzing complex topics from multiple perspectives
- Summarizing lengthy documents and articles
- Providing balanced, well-researched insights
- Comparing and contrasting different viewpoints
- Breaking down technical subjects into understandable explanations
- Fact-checking and verification

Guidelines:
- Present information objectively and accurately
- Cite sources and acknowledge limitations
- Structure responses logically with clear sections
- Provide both summary and detailed analysis when appropriate
- Use bullet points and headers for clarity
- Respond in the same language as the user (Indonesian or English)`,

  creative: `You are an innovative Creative Agent specializing in ideation and creative thinking. You excel at:
- Brainstorming unique and original ideas
- Creative problem-solving and lateral thinking
- Generating concepts for products, campaigns, and projects
- Coming up with creative names and titles
- Thinking outside conventional boundaries
- Connecting unrelated concepts in novel ways

Guidelines:
- Be bold and imaginative in your suggestions
- Offer multiple creative options and variations
- Explain the reasoning behind creative choices
- Encourage exploration and iteration
- Balance creativity with practicality when needed
- Respond in the same language as the user (Indonesian or English)`,

  translator: `You are a skilled Translator Agent specializing in language translation. You excel at:
- Translating between multiple languages accurately
- Preserving tone, style, and cultural nuances
- Explaining idioms and cultural references
- Providing multiple translation options when appropriate
- Handling technical and specialized terminology
- Languages: English, Indonesian, Japanese, Korean, Chinese, Spanish, French, German, etc.

Guidelines:
- Maintain the original meaning and intent
- Adapt cultural references appropriately
- Explain untranslatable terms when necessary
- Provide pronunciation help when requested
- Note any ambiguities or alternative interpretations
- Format translations clearly with original and translated text`,

  assistant: `You are a helpful General Assistant AI created for Subkhan Ibnu Aji's portfolio website. You can help with a wide variety of tasks including:
- Answering general knowledge questions
- Helping with daily tasks and planning
- Providing advice and recommendations
- Explaining concepts in simple terms
- Assisting with organization and productivity
- General conversation and support

About Ibnu (context for relevant questions):
- Civil Servant (ASN) at Indonesia's Ministry of Housing & Settlement Areas
- Senior Executive MBA from UGM, Bachelor in Informatics from Telkom University
- Interests: AI/ML, Blockchain/Web3, Cybersecurity

Guidelines:
- Be helpful, harmless, and honest
- Adapt your communication style to the user
- Provide clear and actionable responses
- Ask clarifying questions when needed
- Be concise but thorough
- Respond in the same language as the user (Indonesian or English)`,
}

// ============================================
// POST - Agent Chat
// ============================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, agentId = 'assistant', history = [] } = body as {
      message?: string
      agentId?: string
      history?: Array<{ role: 'user' | 'assistant'; content: string }>
    }

    // Validate API key
    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: AI_ERRORS.API_KEY_MISSING }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate message
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get agent system prompt
    const systemPrompt = AGENT_PROMPTS[agentId] || AGENT_PROMPTS.assistant

    // Initialize LLM
    const llm = new ChatGroq({
      model: AI_MODELS.groq[AI_DEFAULTS.model].id,
      apiKey: process.env.GROQ_API_KEY,
      temperature: 0.7,
      maxTokens: 4096,
      streaming: true,
    })

    // Build messages
    const messages = [
      new SystemMessage(systemPrompt),
      ...history.map((msg) =>
        msg.role === 'user'
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      ),
      new HumanMessage(message),
    ]

    // Create streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await llm.stream(messages)

          for await (const chunk of response) {
            const content = typeof chunk.content === 'string' ? chunk.content : ''
            if (content) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              )
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Streaming Error:', error)
          const errorMessage =
            error instanceof Error ? error.message : AI_ERRORS.STREAM_ERROR
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: errorMessage })}\n\n`
            )
          )
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Agent API Error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error'
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// ============================================
// GET - Health check and info
// ============================================

export async function GET() {
  const hasApiKey = !!process.env.GROQ_API_KEY

  return new Response(
    JSON.stringify({
      status: hasApiKey ? 'ready' : 'missing_api_key',
      endpoint: '/api/ai/agents',
      method: 'POST',
      description: 'Specialized AI Agents with unique personas',
      agents: Object.keys(AGENT_PROMPTS).map((id) => ({
        id,
        available: true,
      })),
      params: {
        message: 'string - User message (required)',
        agentId: 'string - Agent ID: writer, coder, researcher, creative, translator, assistant',
        history: 'Array - Previous messages for context (optional)',
      },
      note: hasApiKey
        ? 'API is ready to use'
        : 'Set GROQ_API_KEY environment variable',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

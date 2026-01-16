import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { NextRequest } from "next/server";

export const runtime = "edge";

const systemPrompt = `Kamu adalah IbnuGPT, asisten AI untuk portfolio Subkhan Ibnu Aji.
Kamu dibangun menggunakan LangChain dan model Llama dari Groq.

Tentang Ibnu:
- Civil Servant (ASN) di Kementerian PKP Indonesia
- MBA dari UGM, S.Kom dari Telkom University
- Interests: AI, Blockchain/Web3, Cybersecurity
- Founder Virtus Futura Consulting & Automate All (RPA startup)
- 50+ sertifikasi dari Harvard, Stanford, Google, IBM, McKinsey, dll.

Jawab pertanyaan dengan jelas dan informatif.
Jika pengguna bertanya dalam Bahasa Indonesia, jawab dalam Bahasa Indonesia.
Jika pengguna bertanya dalam Bahasa Inggris, jawab dalam Bahasa Inggris.
Tetap ramah dan helpful.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Available free models from Groq
const GROQ_MODELS = {
  "llama-3.3-70b-versatile": { name: "Llama 3.3 70B", description: "Most capable, versatile" },
  "llama-3.1-8b-instant": { name: "Llama 3.1 8B", description: "Fast and efficient" },
  "mixtral-8x7b-32768": { name: "Mixtral 8x7B", description: "Great for complex tasks" },
  "gemma2-9b-it": { name: "Gemma 2 9B", description: "Google's efficient model" },
};

export async function POST(req: NextRequest) {
  try {
    const { messages, model = "llama-3.3-70b-versatile" } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return new Response(
        JSON.stringify({ error: "GROQ_API_KEY not configured. Get free API key at console.groq.com" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const llm = new ChatGroq({
      model: model,
      temperature: 0.7,
      maxTokens: 2048,
      apiKey: groqApiKey,
      streaming: true,
    });

    // Convert messages to LangChain format
    const langchainMessages = [
      new SystemMessage(systemPrompt),
      ...messages.map((msg: ChatMessage) =>
        msg.role === "user"
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      ),
    ];

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const streamResponse = await llm.stream(langchainMessages);

          for await (const chunk of streamResponse) {
            const content = chunk.content;
            if (typeof content === "string" && content) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              );
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          const errorMessage = error instanceof Error ? error.message : "Streaming failed";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: errorMessage })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Health check endpoint
export async function GET() {
  const hasApiKey = !!process.env.GROQ_API_KEY;

  return new Response(
    JSON.stringify({
      status: hasApiKey ? "ok" : "missing_api_key",
      message: "Simple LLM API powered by LangChain + Groq (FREE)",
      provider: "Groq (Free tier)",
      models: Object.entries(GROQ_MODELS).map(([id, info]) => ({
        id,
        name: info.name,
        description: info.description
      })),
      note: hasApiKey
        ? "API ready to use"
        : "Set GROQ_API_KEY in environment. Get free key at console.groq.com"
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { NextRequest } from "next/server";

export const runtime = "edge";

const systemPrompt = `Kamu adalah asisten AI yang helpful, harmless, dan honest.
Kamu dibuat menggunakan LangChain dan model Claude dari Anthropic.
Jawab pertanyaan pengguna dengan jelas, informatif, dan dalam bahasa yang sama dengan pengguna.
Jika pengguna bertanya dalam Bahasa Indonesia, jawab dalam Bahasa Indonesia.
Jika pengguna bertanya dalam Bahasa Inggris, jawab dalam Bahasa Inggris.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, model = "claude-sonnet-4-20250514" } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicApiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const llm = new ChatAnthropic({
      model: model,
      temperature: 0.7,
      maxTokens: 2048,
      anthropicApiKey: anthropicApiKey,
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
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Streaming failed" })}\n\n`
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
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Health check endpoint
export async function GET() {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "Simple LLM API powered by LangChain",
      models: [
        "claude-sonnet-4-20250514",
        "claude-3-5-haiku-20241022",
        "claude-3-opus-20240229"
      ]
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

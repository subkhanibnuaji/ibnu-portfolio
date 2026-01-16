/**
 * AI Agent with Tool Use
 * File: lib/ai/agent.ts
 *
 * Provides an AI agent that can use tools like calculator,
 * web search, and code execution.
 */

import { ChatGroq } from '@langchain/groq';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { AI_MODELS, AI_DEFAULTS, SYSTEM_PROMPTS, type GroqModelId, type AIMessage as AIMessageType, type AIToolCall } from './config';

// ============================================
// TOOL DEFINITIONS
// ============================================

export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, { type: string; description: string }>;
    required: string[];
  };
  execute: (args: Record<string, unknown>) => Promise<string>;
}

// ============================================
// CALCULATOR TOOL
// ============================================

const calculatorTool: Tool = {
  name: 'calculator',
  description: 'Perform mathematical calculations. Supports basic arithmetic, powers, sqrt, sin, cos, tan, log.',
  parameters: {
    type: 'object',
    properties: {
      expression: {
        type: 'string',
        description: 'Mathematical expression to evaluate (e.g., "2 + 2", "sqrt(16)", "sin(3.14)")',
      },
    },
    required: ['expression'],
  },
  execute: async (args) => {
    const expression = args.expression as string;

    try {
      // Safe math evaluation
      const sanitized = expression
        .replace(/[^0-9+\-*/().^%\s]/gi, (match) => {
          const mathFuncs: Record<string, string> = {
            'sqrt': 'Math.sqrt',
            'sin': 'Math.sin',
            'cos': 'Math.cos',
            'tan': 'Math.tan',
            'log': 'Math.log',
            'abs': 'Math.abs',
            'pow': 'Math.pow',
            'pi': 'Math.PI',
            'e': 'Math.E',
          };
          return mathFuncs[match.toLowerCase()] || '';
        })
        .replace(/\^/g, '**');

      // Evaluate safely
      const result = Function(`'use strict'; return (${sanitized})`)();
      return `Result: ${result}`;
    } catch (error) {
      return `Error: Could not evaluate expression "${expression}"`;
    }
  },
};

// ============================================
// CURRENT TIME TOOL
// ============================================

const currentTimeTool: Tool = {
  name: 'current_time',
  description: 'Get the current date and time',
  parameters: {
    type: 'object',
    properties: {
      timezone: {
        type: 'string',
        description: 'Timezone (e.g., "Asia/Jakarta", "UTC"). Default is local time.',
      },
    },
    required: [],
  },
  execute: async (args) => {
    const timezone = (args.timezone as string) || 'Asia/Jakarta';

    try {
      const now = new Date();
      const formatted = now.toLocaleString('en-US', {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      });
      return `Current time in ${timezone}: ${formatted}`;
    } catch {
      return `Current time (UTC): ${new Date().toISOString()}`;
    }
  },
};

// ============================================
// WEATHER TOOL (Mock)
// ============================================

const weatherTool: Tool = {
  name: 'weather',
  description: 'Get current weather information for a location (mock data for demo)',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'City or location name (e.g., "Jakarta", "New York")',
      },
    },
    required: ['location'],
  },
  execute: async (args) => {
    const location = args.location as string;

    // Mock weather data
    const mockWeather = {
      temperature: Math.round(25 + Math.random() * 10),
      humidity: Math.round(60 + Math.random() * 30),
      condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
    };

    return `Weather in ${location}: ${mockWeather.condition}, ${mockWeather.temperature}°C, Humidity: ${mockWeather.humidity}%
Note: This is mock data for demonstration.`;
  },
};

// ============================================
// TEXT ANALYSIS TOOL
// ============================================

const textAnalysisTool: Tool = {
  name: 'text_analysis',
  description: 'Analyze text for word count, character count, and basic statistics',
  parameters: {
    type: 'object',
    properties: {
      text: {
        type: 'string',
        description: 'Text to analyze',
      },
    },
    required: ['text'],
  },
  execute: async (args) => {
    const text = args.text as string;

    const words = text.split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const paragraphs = text.split(/\n\n+/).filter(Boolean);

    return `Text Analysis:
- Characters: ${text.length}
- Words: ${words.length}
- Sentences: ${sentences.length}
- Paragraphs: ${paragraphs.length}
- Average word length: ${(text.replace(/\s/g, '').length / words.length).toFixed(1)} characters
- Reading time: ~${Math.ceil(words.length / 200)} minutes`;
  },
};

// ============================================
// AVAILABLE TOOLS
// ============================================

export const AVAILABLE_TOOLS: Record<string, Tool> = {
  calculator: calculatorTool,
  current_time: currentTimeTool,
  weather: weatherTool,
  text_analysis: textAnalysisTool,
};

// ============================================
// AGENT EXECUTION
// ============================================

/**
 * Parse tool calls from LLM response
 */
function parseToolCalls(response: string): AIToolCall[] {
  const toolCalls: AIToolCall[] = [];

  // Look for tool call patterns like [TOOL: name(args)]
  const toolPattern = /\[TOOL:\s*(\w+)\((.*?)\)\]/g;
  let match;

  while ((match = toolPattern.exec(response)) !== null) {
    const [, toolName, argsStr] = match;

    try {
      // Parse arguments
      const args: Record<string, unknown> = {};

      if (argsStr.trim()) {
        // Simple key=value parsing
        const pairs = argsStr.split(',').map(s => s.trim());
        for (const pair of pairs) {
          const [key, ...valueParts] = pair.split('=');
          if (key && valueParts.length > 0) {
            let value = valueParts.join('=').trim();
            // Remove quotes
            value = value.replace(/^["']|["']$/g, '');
            args[key.trim()] = value;
          }
        }
      }

      toolCalls.push({
        id: `tool_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: toolName,
        arguments: args,
      });
    } catch {
      // Skip invalid tool calls
    }
  }

  return toolCalls;
}

/**
 * Execute a tool call
 */
export async function executeTool(toolCall: AIToolCall): Promise<AIToolCall> {
  const tool = AVAILABLE_TOOLS[toolCall.name];

  if (!tool) {
    return {
      ...toolCall,
      error: `Unknown tool: ${toolCall.name}`,
    };
  }

  try {
    const result = await tool.execute(toolCall.arguments);
    return {
      ...toolCall,
      result,
    };
  } catch (error) {
    return {
      ...toolCall,
      error: error instanceof Error ? error.message : 'Tool execution failed',
    };
  }
}

/**
 * Run agent with tool use
 */
export async function* runAgent(
  messages: AIMessageType[],
  modelId: GroqModelId = AI_DEFAULTS.model,
  maxIterations: number = 3
): AsyncGenerator<{ type: 'text' | 'tool' | 'result'; content: string; toolCall?: AIToolCall }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const llm = new ChatGroq({
    model: AI_MODELS.groq[modelId].id,
    apiKey,
    temperature: 0.7,
    maxTokens: 4096,
  });

  // Build system prompt with tools
  const toolDescriptions = Object.entries(AVAILABLE_TOOLS)
    .map(([name, tool]) => `- ${name}: ${tool.description}`)
    .join('\n');

  const systemPrompt = `${SYSTEM_PROMPTS.agent}

Available Tools:
${toolDescriptions}

To use a tool, include [TOOL: tool_name(param1=value1, param2=value2)] in your response.
After using a tool, explain the result to the user.

Example: To calculate 2+2, respond with: Let me calculate that. [TOOL: calculator(expression=2+2)]`;

  const langchainMessages = [
    new SystemMessage(systemPrompt),
    ...messages.map(m =>
      m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
    ),
  ];

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // Get LLM response
    const response = await llm.invoke(langchainMessages);
    const responseText = typeof response.content === 'string' ? response.content : '';

    // Check for tool calls
    const toolCalls = parseToolCalls(responseText);

    if (toolCalls.length === 0) {
      // No tools called, yield final response
      yield { type: 'text', content: responseText };
      return;
    }

    // Execute tools
    for (const toolCall of toolCalls) {
      yield { type: 'tool', content: `Using ${toolCall.name}...`, toolCall };

      const result = await executeTool(toolCall);

      yield {
        type: 'result',
        content: result.result as string || result.error || 'No result',
        toolCall: result
      };

      // Add tool result to conversation
      langchainMessages.push(new AIMessage(responseText));
      langchainMessages.push(new HumanMessage(`Tool result for ${toolCall.name}: ${result.result || result.error}`));
    }
  }
}

// ============================================
// EXPORTS
// ============================================

export function getToolsList() {
  return Object.entries(AVAILABLE_TOOLS).map(([name, tool]) => ({
    name,
    description: tool.description,
    parameters: tool.parameters,
  }));
}

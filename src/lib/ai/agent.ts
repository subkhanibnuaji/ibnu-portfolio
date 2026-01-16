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
// IMAGE GENERATION TOOL (Pollinations.ai - FREE)
// ============================================

const imageGenerationTool: Tool = {
  name: 'generate_image',
  description: 'Generate an image from a text description using AI. Creates images based on prompts.',
  parameters: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description: 'Detailed description of the image to generate (e.g., "a sunset over mountains with purple sky")',
      },
      style: {
        type: 'string',
        description: 'Art style (optional): realistic, anime, cartoon, oil-painting, watercolor, 3d-render, pixel-art',
      },
    },
    required: ['prompt'],
  },
  execute: async (args) => {
    const prompt = args.prompt as string;
    const style = args.style as string || '';

    // Enhance prompt with style if provided
    const fullPrompt = style ? `${prompt}, ${style} style, high quality` : `${prompt}, high quality, detailed`;

    // Pollinations.ai - 100% FREE, no API key needed
    const encodedPrompt = encodeURIComponent(fullPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true`;

    return `IMAGE_GENERATED:${imageUrl}|${prompt}`;
  },
};

// ============================================
// TRANSLATE TOOL (FREE)
// ============================================

const translateTool: Tool = {
  name: 'translate',
  description: 'Translate text between languages',
  parameters: {
    type: 'object',
    properties: {
      text: {
        type: 'string',
        description: 'Text to translate',
      },
      to: {
        type: 'string',
        description: 'Target language (e.g., "indonesian", "english", "japanese", "spanish")',
      },
    },
    required: ['text', 'to'],
  },
  execute: async (args) => {
    const text = args.text as string;
    const to = args.to as string;

    // This will be handled by the LLM itself as a translation task
    return `TRANSLATE_REQUEST:${text}|${to}`;
  },
};

// ============================================
// JOKE GENERATOR TOOL
// ============================================

const jokeTool: Tool = {
  name: 'tell_joke',
  description: 'Tell a random joke or joke about a specific topic',
  parameters: {
    type: 'object',
    properties: {
      topic: {
        type: 'string',
        description: 'Topic for the joke (optional, e.g., "programming", "cats")',
      },
    },
    required: [],
  },
  execute: async (args) => {
    const topic = args.topic as string || 'random';
    return `JOKE_REQUEST:${topic}`;
  },
};

// ============================================
// CODE GENERATOR TOOL
// ============================================

const codeGeneratorTool: Tool = {
  name: 'generate_code',
  description: 'Generate code snippets in various programming languages',
  parameters: {
    type: 'object',
    properties: {
      task: {
        type: 'string',
        description: 'Description of what the code should do',
      },
      language: {
        type: 'string',
        description: 'Programming language (e.g., "python", "javascript", "typescript", "java")',
      },
    },
    required: ['task', 'language'],
  },
  execute: async (args) => {
    const task = args.task as string;
    const language = args.language as string;
    return `CODE_REQUEST:${task}|${language}`;
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
// PDF GENERATOR TOOL (Client-side generation)
// ============================================

const pdfGeneratorTool: Tool = {
  name: 'generate_pdf',
  description: 'Generate a PDF document from text content. Creates downloadable PDF files.',
  parameters: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Title of the PDF document',
      },
      content: {
        type: 'string',
        description: 'Main content/body text for the PDF',
      },
      author: {
        type: 'string',
        description: 'Author name (optional)',
      },
    },
    required: ['title', 'content'],
  },
  execute: async (args) => {
    const title = args.title as string;
    const content = args.content as string;
    const author = (args.author as string) || 'IbnuGPT Agent';

    // Return data for client-side PDF generation
    return `PDF_GENERATE:${JSON.stringify({ title, content, author })}`;
  },
};

// ============================================
// PPT GENERATOR TOOL (Client-side generation)
// ============================================

const pptGeneratorTool: Tool = {
  name: 'generate_ppt',
  description: 'Generate a PowerPoint presentation. Creates downloadable PPTX files with slides.',
  parameters: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Title of the presentation',
      },
      slides: {
        type: 'string',
        description: 'Slide contents separated by "---". Each slide should have a title on first line and bullet points on following lines.',
      },
      theme: {
        type: 'string',
        description: 'Color theme: blue, green, red, purple, orange (optional, default: blue)',
      },
    },
    required: ['title', 'slides'],
  },
  execute: async (args) => {
    const title = args.title as string;
    const slides = args.slides as string;
    const theme = (args.theme as string) || 'blue';

    // Return data for client-side PPT generation
    return `PPT_GENERATE:${JSON.stringify({ title, slides, theme })}`;
  },
};

// ============================================
// QR CODE GENERATOR TOOL (FREE)
// ============================================

const qrCodeTool: Tool = {
  name: 'generate_qr',
  description: 'Generate a QR code from text or URL. Creates scannable QR code images.',
  parameters: {
    type: 'object',
    properties: {
      data: {
        type: 'string',
        description: 'Text or URL to encode in the QR code',
      },
      size: {
        type: 'string',
        description: 'Size of QR code: small (150), medium (300), large (500). Default: medium',
      },
    },
    required: ['data'],
  },
  execute: async (args) => {
    const data = args.data as string;
    const sizeMap: Record<string, number> = { small: 150, medium: 300, large: 500 };
    const size = sizeMap[(args.size as string) || 'medium'] || 300;

    // Use QR Server API (FREE, no key needed)
    const encodedData = encodeURIComponent(data);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}`;

    return `QR_GENERATED:${qrUrl}|${data}`;
  },
};

// ============================================
// MEME GENERATOR TOOL (FREE)
// ============================================

const memeGeneratorTool: Tool = {
  name: 'generate_meme',
  description: 'Generate a meme image with custom text. Creates funny meme images.',
  parameters: {
    type: 'object',
    properties: {
      template: {
        type: 'string',
        description: 'Meme template: drake, distracted, button, change-my-mind, two-buttons, expanding-brain, uno-draw, surprised-pikachu',
      },
      topText: {
        type: 'string',
        description: 'Text for top of meme',
      },
      bottomText: {
        type: 'string',
        description: 'Text for bottom of meme',
      },
    },
    required: ['template', 'topText'],
  },
  execute: async (args) => {
    const template = args.template as string;
    const topText = args.topText as string;
    const bottomText = (args.bottomText as string) || '';

    // Meme template IDs for memegen.link (FREE)
    const templateMap: Record<string, string> = {
      'drake': 'drake',
      'distracted': 'db',
      'button': 'ntot',
      'change-my-mind': 'cmm',
      'two-buttons': 'ds',
      'expanding-brain': 'eb',
      'uno-draw': 'ud',
      'surprised-pikachu': 'pikachu',
    };

    const templateId = templateMap[template.toLowerCase()] || 'drake';
    const encodedTop = encodeURIComponent(topText.replace(/ /g, '_'));
    const encodedBottom = encodeURIComponent((bottomText || '_').replace(/ /g, '_'));

    const memeUrl = `https://api.memegen.link/images/${templateId}/${encodedTop}/${encodedBottom}.png`;

    return `IMAGE_GENERATED:${memeUrl}|Meme: ${topText}`;
  },
};

// ============================================
// LOREM IPSUM GENERATOR TOOL
// ============================================

const loremIpsumTool: Tool = {
  name: 'generate_lorem',
  description: 'Generate placeholder Lorem Ipsum text for mockups and designs.',
  parameters: {
    type: 'object',
    properties: {
      paragraphs: {
        type: 'string',
        description: 'Number of paragraphs to generate (1-10, default: 3)',
      },
      type: {
        type: 'string',
        description: 'Type: standard, hipster, bacon, or office (default: standard)',
      },
    },
    required: [],
  },
  execute: async (args) => {
    const count = Math.min(10, Math.max(1, parseInt(args.paragraphs as string) || 3));

    const loremParagraphs = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.",
      "Est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.",
      "Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor ultrices risus.",
      "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      "Proin pharetra nonummy pede. Mauris et orci. Aenean nec lorem. In porttitor suspendisse potenti.",
      "Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.",
    ];

    const result = loremParagraphs.slice(0, count).join('\n\n');
    return `Generated ${count} paragraph(s) of Lorem Ipsum:\n\n${result}`;
  },
};

// ============================================
// WIKIPEDIA SEARCH TOOL (FREE)
// ============================================

const wikipediaTool: Tool = {
  name: 'wikipedia_search',
  description: 'Search Wikipedia for information about any topic. Returns a summary of the topic.',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query for Wikipedia',
      },
    },
    required: ['query'],
  },
  execute: async (args) => {
    const query = args.query as string;

    try {
      // Use Wikipedia API (FREE, no key needed)
      const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
      const response = await fetch(searchUrl);

      if (!response.ok) {
        // Try search endpoint
        const searchResponse = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`
        );
        const searchData = await searchResponse.json();

        if (searchData.query?.search?.length > 0) {
          const firstResult = searchData.query.search[0];
          return `Wikipedia: "${firstResult.title}"\n\n${firstResult.snippet.replace(/<[^>]*>/g, '')}...\n\nSearch for the exact title for more details.`;
        }
        return `No Wikipedia article found for "${query}"`;
      }

      const data = await response.json();
      return `📚 Wikipedia: ${data.title}\n\n${data.extract}\n\n🔗 Read more: ${data.content_urls?.desktop?.page || ''}`;
    } catch {
      return `Could not search Wikipedia for "${query}"`;
    }
  },
};

// ============================================
// DICTIONARY/DEFINITION TOOL (FREE)
// ============================================

const dictionaryTool: Tool = {
  name: 'define_word',
  description: 'Get the definition, pronunciation, and examples of an English word.',
  parameters: {
    type: 'object',
    properties: {
      word: {
        type: 'string',
        description: 'The word to define',
      },
    },
    required: ['word'],
  },
  execute: async (args) => {
    const word = args.word as string;

    try {
      // Free Dictionary API
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);

      if (!response.ok) {
        return `No definition found for "${word}"`;
      }

      const data = await response.json();
      const entry = data[0];

      let result = `📖 **${entry.word}**`;

      if (entry.phonetic) {
        result += ` (${entry.phonetic})`;
      }

      result += '\n\n';

      for (const meaning of entry.meanings.slice(0, 3)) {
        result += `**${meaning.partOfSpeech}**\n`;
        for (const def of meaning.definitions.slice(0, 2)) {
          result += `• ${def.definition}\n`;
          if (def.example) {
            result += `  _Example: "${def.example}"_\n`;
          }
        }
        result += '\n';
      }

      return result;
    } catch {
      return `Could not find definition for "${word}"`;
    }
  },
};

// ============================================
// CRYPTO PRICE TOOL (FREE)
// ============================================

const cryptoPriceTool: Tool = {
  name: 'crypto_price',
  description: 'Get current cryptocurrency prices in USD. Supports Bitcoin, Ethereum, and many others.',
  parameters: {
    type: 'object',
    properties: {
      coin: {
        type: 'string',
        description: 'Cryptocurrency name or symbol (e.g., bitcoin, ethereum, btc, eth, solana, doge)',
      },
    },
    required: ['coin'],
  },
  execute: async (args) => {
    const coin = (args.coin as string).toLowerCase();

    // Map common symbols to full names
    const coinMap: Record<string, string> = {
      'btc': 'bitcoin',
      'eth': 'ethereum',
      'sol': 'solana',
      'doge': 'dogecoin',
      'ada': 'cardano',
      'xrp': 'ripple',
      'dot': 'polkadot',
      'matic': 'polygon',
      'avax': 'avalanche',
      'link': 'chainlink',
    };

    const coinId = coinMap[coin] || coin;

    try {
      // CoinGecko API (FREE, no key)
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
      );

      if (!response.ok) {
        return `Could not fetch price for "${coin}"`;
      }

      const data = await response.json();

      if (!data[coinId]) {
        return `Cryptocurrency "${coin}" not found. Try using the full name (e.g., "bitcoin" instead of "btc")`;
      }

      const price = data[coinId].usd;
      const change = data[coinId].usd_24h_change;
      const marketCap = data[coinId].usd_market_cap;

      const changeEmoji = change >= 0 ? '📈' : '📉';
      const changeSign = change >= 0 ? '+' : '';

      return `💰 **${coinId.charAt(0).toUpperCase() + coinId.slice(1)}** (${coin.toUpperCase()})\n\n` +
             `Price: $${price.toLocaleString()}\n` +
             `${changeEmoji} 24h Change: ${changeSign}${change.toFixed(2)}%\n` +
             `Market Cap: $${(marketCap / 1e9).toFixed(2)}B`;
    } catch {
      return `Could not fetch cryptocurrency price for "${coin}"`;
    }
  },
};

// ============================================
// RANDOM FACTS TOOL
// ============================================

const randomFactsTool: Tool = {
  name: 'random_fact',
  description: 'Get a random interesting fact. Great for learning something new!',
  parameters: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        description: 'Category: science, history, animals, space, technology, or random (default)',
      },
    },
    required: [],
  },
  execute: async (args) => {
    const facts: Record<string, string[]> = {
      science: [
        "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible.",
        "Octopuses have three hearts and blue blood.",
        "A day on Venus is longer than a year on Venus.",
        "Water can boil and freeze at the same time under the right conditions (called the triple point).",
        "Bananas are berries, but strawberries aren't.",
        "Hot water freezes faster than cold water (Mpemba effect).",
      ],
      history: [
        "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
        "Oxford University is older than the Aztec Empire.",
        "The shortest war in history lasted only 38-45 minutes (Anglo-Zanzibar War, 1896).",
        "Ancient Romans used crushed mouse brains as toothpaste.",
        "Vikings used to give kittens to new brides as essential household gifts.",
      ],
      animals: [
        "A group of flamingos is called a 'flamboyance'.",
        "Cows have best friends and get stressed when separated.",
        "Dolphins have names for each other.",
        "A snail can sleep for three years.",
        "Elephants are the only animals that can't jump.",
        "Sea otters hold hands while sleeping so they don't drift apart.",
      ],
      space: [
        "There's a planet made of diamonds twice the size of Earth (55 Cancri e).",
        "One day on Mercury is 59 Earth days long.",
        "The footprints on the Moon will last for 100 million years.",
        "Space is completely silent because there's no medium for sound to travel.",
        "There are more stars in the universe than grains of sand on all Earth's beaches.",
      ],
      technology: [
        "The first computer mouse was made of wood.",
        "Email existed before the World Wide Web.",
        "The first iPhone didn't have copy and paste functionality.",
        "Google's original name was 'Backrub'.",
        "The first webcam was used to monitor a coffee pot at Cambridge University.",
      ],
    };

    const category = (args.category as string)?.toLowerCase() || 'random';
    let selectedFacts: string[];

    if (category === 'random' || !facts[category]) {
      // Combine all facts
      selectedFacts = Object.values(facts).flat();
    } else {
      selectedFacts = facts[category];
    }

    const randomFact = selectedFacts[Math.floor(Math.random() * selectedFacts.length)];
    return `🧠 **Did You Know?**\n\n${randomFact}`;
  },
};

// ============================================
// PASSWORD GENERATOR TOOL
// ============================================

const passwordGeneratorTool: Tool = {
  name: 'generate_password',
  description: 'Generate a secure random password.',
  parameters: {
    type: 'object',
    properties: {
      length: {
        type: 'string',
        description: 'Password length (8-64, default: 16)',
      },
      includeSymbols: {
        type: 'string',
        description: 'Include symbols? (true/false, default: true)',
      },
    },
    required: [],
  },
  execute: async (args) => {
    const length = Math.min(64, Math.max(8, parseInt(args.length as string) || 16));
    const includeSymbols = args.includeSymbols !== 'false';

    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = lowercase + uppercase + numbers;
    if (includeSymbols) chars += symbols;

    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Calculate strength
    let strength = 'Weak';
    if (length >= 12 && includeSymbols) strength = 'Strong';
    else if (length >= 16) strength = 'Very Strong';
    else if (length >= 10) strength = 'Medium';

    return `🔐 **Generated Password**\n\n\`${password}\`\n\n📊 Length: ${length} characters\n💪 Strength: ${strength}\n${includeSymbols ? '✅ Includes symbols' : '❌ No symbols'}`;
  },
};

// ============================================
// UNIT CONVERTER TOOL
// ============================================

const unitConverterTool: Tool = {
  name: 'convert_unit',
  description: 'Convert between different units of measurement (length, weight, temperature, etc.)',
  parameters: {
    type: 'object',
    properties: {
      value: {
        type: 'string',
        description: 'The numeric value to convert',
      },
      from: {
        type: 'string',
        description: 'Source unit (e.g., km, miles, kg, lbs, celsius, fahrenheit)',
      },
      to: {
        type: 'string',
        description: 'Target unit',
      },
    },
    required: ['value', 'from', 'to'],
  },
  execute: async (args) => {
    const value = parseFloat(args.value as string);
    const from = (args.from as string).toLowerCase();
    const to = (args.to as string).toLowerCase();

    if (isNaN(value)) {
      return 'Invalid value. Please provide a number.';
    }

    // Conversion factors to base units
    const conversions: Record<string, Record<string, { base: string; factor: number }>> = {
      // Length (base: meters)
      length: {
        'm': { base: 'm', factor: 1 },
        'meter': { base: 'm', factor: 1 },
        'meters': { base: 'm', factor: 1 },
        'km': { base: 'm', factor: 1000 },
        'kilometer': { base: 'm', factor: 1000 },
        'cm': { base: 'm', factor: 0.01 },
        'mm': { base: 'm', factor: 0.001 },
        'mile': { base: 'm', factor: 1609.34 },
        'miles': { base: 'm', factor: 1609.34 },
        'yard': { base: 'm', factor: 0.9144 },
        'yards': { base: 'm', factor: 0.9144 },
        'foot': { base: 'm', factor: 0.3048 },
        'feet': { base: 'm', factor: 0.3048 },
        'ft': { base: 'm', factor: 0.3048 },
        'inch': { base: 'm', factor: 0.0254 },
        'inches': { base: 'm', factor: 0.0254 },
        'in': { base: 'm', factor: 0.0254 },
      },
      // Weight (base: grams)
      weight: {
        'g': { base: 'g', factor: 1 },
        'gram': { base: 'g', factor: 1 },
        'grams': { base: 'g', factor: 1 },
        'kg': { base: 'g', factor: 1000 },
        'kilogram': { base: 'g', factor: 1000 },
        'mg': { base: 'g', factor: 0.001 },
        'lb': { base: 'g', factor: 453.592 },
        'lbs': { base: 'g', factor: 453.592 },
        'pound': { base: 'g', factor: 453.592 },
        'pounds': { base: 'g', factor: 453.592 },
        'oz': { base: 'g', factor: 28.3495 },
        'ounce': { base: 'g', factor: 28.3495 },
        'ounces': { base: 'g', factor: 28.3495 },
      },
    };

    // Temperature conversion
    if (['celsius', 'c', 'fahrenheit', 'f', 'kelvin', 'k'].includes(from) ||
        ['celsius', 'c', 'fahrenheit', 'f', 'kelvin', 'k'].includes(to)) {
      let celsius: number;

      // Convert to Celsius first
      if (from === 'celsius' || from === 'c') celsius = value;
      else if (from === 'fahrenheit' || from === 'f') celsius = (value - 32) * 5/9;
      else if (from === 'kelvin' || from === 'k') celsius = value - 273.15;
      else return `Unknown temperature unit: ${from}`;

      // Convert from Celsius to target
      let result: number;
      let targetUnit: string;
      if (to === 'celsius' || to === 'c') { result = celsius; targetUnit = '°C'; }
      else if (to === 'fahrenheit' || to === 'f') { result = celsius * 9/5 + 32; targetUnit = '°F'; }
      else if (to === 'kelvin' || to === 'k') { result = celsius + 273.15; targetUnit = 'K'; }
      else return `Unknown temperature unit: ${to}`;

      return `🌡️ **Temperature Conversion**\n\n${value} ${from.toUpperCase()} = **${result.toFixed(2)} ${targetUnit}**`;
    }

    // Find conversion category
    let fromConv: { base: string; factor: number } | undefined;
    let toConv: { base: string; factor: number } | undefined;
    let category = '';

    for (const [cat, units] of Object.entries(conversions)) {
      if (units[from]) { fromConv = units[from]; category = cat; }
      if (units[to]) { toConv = units[to]; }
    }

    if (!fromConv || !toConv) {
      return `Cannot convert between ${from} and ${to}. Supported: km, miles, m, ft, kg, lbs, g, oz, celsius, fahrenheit, kelvin`;
    }

    // Convert: value -> base -> target
    const baseValue = value * fromConv.factor;
    const result = baseValue / toConv.factor;

    return `📏 **${category.charAt(0).toUpperCase() + category.slice(1)} Conversion**\n\n${value} ${from} = **${result.toFixed(4)} ${to}**`;
  },
};

// ============================================
// COLOR PALETTE GENERATOR TOOL
// ============================================

const colorPaletteTool: Tool = {
  name: 'generate_colors',
  description: 'Generate a color palette based on a base color or theme.',
  parameters: {
    type: 'object',
    properties: {
      baseColor: {
        type: 'string',
        description: 'Base color in hex (e.g., #FF5733) or name (e.g., blue, red)',
      },
      scheme: {
        type: 'string',
        description: 'Color scheme: complementary, triadic, analogous, monochromatic (default)',
      },
    },
    required: ['baseColor'],
  },
  execute: async (args) => {
    const baseColorInput = (args.baseColor as string).toLowerCase();
    const scheme = (args.scheme as string)?.toLowerCase() || 'monochromatic';

    // Color name to hex
    const colorNames: Record<string, string> = {
      'red': '#FF0000', 'blue': '#0000FF', 'green': '#00FF00',
      'yellow': '#FFFF00', 'purple': '#800080', 'orange': '#FFA500',
      'pink': '#FFC0CB', 'cyan': '#00FFFF', 'magenta': '#FF00FF',
      'teal': '#008080', 'navy': '#000080', 'coral': '#FF7F50',
    };

    let hex = colorNames[baseColorInput] || baseColorInput;
    if (!hex.startsWith('#')) hex = '#' + hex;

    // Parse hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return `Invalid color: ${baseColorInput}. Use hex (#FF5733) or color name (blue, red, etc.)`;
    }

    // Convert to HSL
    const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break;
        case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break;
        case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break;
      }
    }

    h = Math.round(h * 360);
    const sPercent = Math.round(s * 100);
    const lPercent = Math.round(l * 100);

    // Generate palette based on scheme
    const hslToHex = (h: number, s: number, l: number): string => {
      h = ((h % 360) + 360) % 360;
      s = Math.max(0, Math.min(100, s)) / 100;
      l = Math.max(0, Math.min(100, l)) / 100;
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l - c / 2;
      let rr = 0, gg = 0, bb = 0;
      if (h < 60) { rr = c; gg = x; }
      else if (h < 120) { rr = x; gg = c; }
      else if (h < 180) { gg = c; bb = x; }
      else if (h < 240) { gg = x; bb = c; }
      else if (h < 300) { rr = x; bb = c; }
      else { rr = c; bb = x; }
      const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
      return `#${toHex(rr)}${toHex(gg)}${toHex(bb)}`.toUpperCase();
    };

    let colors: string[] = [];
    switch (scheme) {
      case 'complementary':
        colors = [hex, hslToHex(h + 180, sPercent, lPercent)];
        break;
      case 'triadic':
        colors = [hex, hslToHex(h + 120, sPercent, lPercent), hslToHex(h + 240, sPercent, lPercent)];
        break;
      case 'analogous':
        colors = [hslToHex(h - 30, sPercent, lPercent), hex, hslToHex(h + 30, sPercent, lPercent)];
        break;
      default: // monochromatic
        colors = [
          hslToHex(h, sPercent, Math.max(20, lPercent - 30)),
          hslToHex(h, sPercent, Math.max(30, lPercent - 15)),
          hex,
          hslToHex(h, sPercent, Math.min(70, lPercent + 15)),
          hslToHex(h, sPercent, Math.min(85, lPercent + 30)),
        ];
    }

    return `🎨 **Color Palette (${scheme})**\n\nBase: ${hex}\n\n${colors.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n_Copy these hex codes to use in your designs!_`;
  },
};

// ============================================
// HASHTAG GENERATOR TOOL
// ============================================

const hashtagGeneratorTool: Tool = {
  name: 'generate_hashtags',
  description: 'Generate relevant hashtags for social media posts based on a topic.',
  parameters: {
    type: 'object',
    properties: {
      topic: {
        type: 'string',
        description: 'The topic or subject for hashtags',
      },
      count: {
        type: 'string',
        description: 'Number of hashtags (5-30, default: 15)',
      },
    },
    required: ['topic'],
  },
  execute: async (args) => {
    const topic = (args.topic as string).toLowerCase();
    const count = Math.min(30, Math.max(5, parseInt(args.count as string) || 15));

    const hashtagSets: Record<string, string[]> = {
      tech: ['technology', 'tech', 'coding', 'programming', 'developer', 'software', 'webdev', 'javascript', 'python', 'ai', 'machinelearning', 'innovation', 'startup', 'digital', 'code', 'devlife'],
      photography: ['photography', 'photo', 'photographer', 'photooftheday', 'picoftheday', 'instagood', 'camera', 'portrait', 'landscape', 'naturephotography', 'streetphotography', 'travelphotography', 'art', 'creative'],
      food: ['food', 'foodie', 'foodporn', 'yummy', 'delicious', 'cooking', 'homemade', 'recipe', 'foodphotography', 'instafood', 'foodblogger', 'healthyfood', 'dinner', 'lunch', 'breakfast'],
      fitness: ['fitness', 'gym', 'workout', 'fitnessmotivation', 'training', 'health', 'fit', 'bodybuilding', 'exercise', 'healthy', 'lifestyle', 'muscle', 'nutrition', 'cardio', 'strength'],
      travel: ['travel', 'traveling', 'travelphotography', 'wanderlust', 'adventure', 'explore', 'vacation', 'travelgram', 'trip', 'tourism', 'travelblogger', 'nature', 'roadtrip', 'backpacking'],
      business: ['business', 'entrepreneur', 'marketing', 'success', 'motivation', 'startup', 'money', 'leadership', 'branding', 'smallbusiness', 'digitalmarketing', 'goals', 'hustle', 'growth'],
      fashion: ['fashion', 'style', 'ootd', 'fashionblogger', 'outfit', 'fashionista', 'streetstyle', 'trendy', 'lookoftheday', 'fashionstyle', 'instafashion', 'clothing', 'streetwear', 'model'],
      art: ['art', 'artist', 'artwork', 'drawing', 'painting', 'illustration', 'creative', 'design', 'sketch', 'digitalart', 'contemporaryart', 'artistsoninstagram', 'artoftheday', 'fineart'],
    };

    // Find matching category or use generic
    let selectedTags: string[] = [];
    for (const [category, tags] of Object.entries(hashtagSets)) {
      if (topic.includes(category) || category.includes(topic)) {
        selectedTags = [...tags];
        break;
      }
    }

    // If no match, create generic hashtags from topic
    if (selectedTags.length === 0) {
      const words = topic.split(/\s+/);
      selectedTags = [
        ...words.map(w => w.replace(/[^a-z0-9]/g, '')),
        topic.replace(/\s+/g, ''),
        `${topic.replace(/\s+/g, '')}life`,
        `${topic.replace(/\s+/g, '')}lover`,
        'instagram', 'instagood', 'photooftheday', 'love', 'beautiful',
        'happy', 'follow', 'like', 'lifestyle', 'amazing'
      ];
    }

    // Add some universal tags
    selectedTags.push('viral', 'trending', 'fyp', 'explorepage', 'reels');

    // Shuffle and select
    const shuffled = selectedTags.sort(() => Math.random() - 0.5);
    const finalTags = shuffled.slice(0, count).map(t => `#${t}`);

    return `📱 **Hashtags for "${topic}"**\n\n${finalTags.join(' ')}\n\n_${finalTags.length} hashtags generated. Copy and paste to your post!_`;
  },
};

// ============================================
// AVAILABLE TOOLS
// ============================================

export const AVAILABLE_TOOLS: Record<string, Tool> = {
  // Utility Tools
  calculator: calculatorTool,
  current_time: currentTimeTool,
  weather: weatherTool,
  convert_unit: unitConverterTool,

  // Generation Tools
  generate_image: imageGenerationTool,
  generate_qr: qrCodeTool,
  generate_meme: memeGeneratorTool,
  generate_pdf: pdfGeneratorTool,
  generate_ppt: pptGeneratorTool,
  generate_lorem: loremIpsumTool,
  generate_password: passwordGeneratorTool,
  generate_colors: colorPaletteTool,
  generate_hashtags: hashtagGeneratorTool,
  generate_code: codeGeneratorTool,

  // Knowledge Tools
  wikipedia_search: wikipediaTool,
  define_word: dictionaryTool,
  random_fact: randomFactsTool,

  // Finance Tools
  crypto_price: cryptoPriceTool,

  // Text Tools
  translate: translateTool,
  text_analysis: textAnalysisTool,

  // Fun Tools
  tell_joke: jokeTool,
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

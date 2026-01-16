/**
 * AI Tools Overview Page
 * File: app/ai-tools/page.tsx
 *
 * Landing page for all AI tools.
 * Shows available tools and their descriptions.
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const tools = [
  {
    title: 'LLM Chat',
    href: '/ai-tools/llm',
    description:
      'Interactive chat with AI powered by Groq LLMs. Multiple models available including Llama 3.3 70B, Mixtral, and Gemma.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    features: ['Streaming responses', 'Multiple models', 'Conversation history'],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'RAG System',
    href: '/ai-tools/rag',
    description:
      'Upload documents and chat with AI that has context from your files. Supports PDF, TXT, MD, and more.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    features: ['Document upload', 'Context retrieval', 'Smart chunking'],
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'AI Agent',
    href: '/ai-tools/agent',
    description:
      'AI with tool-use capabilities. Can perform calculations, get current time, check weather, and analyze text.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    features: ['Tool execution', 'Multi-step reasoning', 'Real-time results'],
    gradient: 'from-orange-500 to-red-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function AIToolsPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
          AI Tools
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Explore AI-powered tools built with LangChain and Groq
        </p>
        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Free API (Groq)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            LangChain Powered
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-purple-500"></span>
            Edge Runtime
          </span>
        </div>
      </motion.div>

      {/* Tools Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-3"
      >
        {tools.map((tool) => (
          <motion.div key={tool.href} variants={itemVariants}>
            <Link
              href={tool.href}
              className="group relative block h-full overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-800/50 p-6 transition-all duration-300 hover:border-gray-600 hover:bg-gray-800"
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
              />

              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div
                  className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${tool.gradient} p-3 text-white`}
                >
                  {tool.icon}
                </div>

                {/* Title */}
                <h2 className="mb-2 text-xl font-semibold text-white group-hover:text-blue-400">
                  {tool.title}
                </h2>

                {/* Description */}
                <p className="mb-4 text-sm text-gray-400">{tool.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {tool.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full bg-gray-700/50 px-2 py-1 text-xs text-gray-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div className="mt-4 flex items-center text-sm font-medium text-blue-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span>Explore</span>
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="rounded-2xl border border-gray-700/50 bg-gray-800/30 p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-white">Tech Stack</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-gray-700/30 p-4">
            <h4 className="mb-1 font-medium text-white">LangChain</h4>
            <p className="text-sm text-gray-400">
              Framework for building LLM applications
            </p>
          </div>
          <div className="rounded-lg bg-gray-700/30 p-4">
            <h4 className="mb-1 font-medium text-white">Groq API</h4>
            <p className="text-sm text-gray-400">
              Ultra-fast LLM inference (FREE tier)
            </p>
          </div>
          <div className="rounded-lg bg-gray-700/30 p-4">
            <h4 className="mb-1 font-medium text-white">Next.js 15</h4>
            <p className="text-sm text-gray-400">
              React framework with edge runtime
            </p>
          </div>
          <div className="rounded-lg bg-gray-700/30 p-4">
            <h4 className="mb-1 font-medium text-white">Streaming SSE</h4>
            <p className="text-sm text-gray-400">
              Real-time response streaming
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

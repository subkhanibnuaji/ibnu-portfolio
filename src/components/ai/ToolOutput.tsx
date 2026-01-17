'use client';

/**
 * Tool Output Component for AI Agent
 * File: components/ai/ToolOutput.tsx
 *
 * Displays tool execution results in the chat.
 */

import { useState } from 'react';
import Image from 'next/image';
import {
  Wrench,
  Calculator,
  Clock,
  Cloud,
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Loader2,
  ImageIcon,
  Languages,
  Laugh,
  Code,
  Download,
  QrCode,
  Smile,
  FileDown,
  Presentation,
  Type,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AIToolCall } from '@/lib/ai/config';

// ============================================
// TYPES
// ============================================

export interface ToolOutputProps {
  // New simpler interface for agent page
  tool?: string;
  input?: Record<string, unknown>;
  result?: unknown;
  isLoading?: boolean;
  // Original interface
  toolCall?: AIToolCall;
  status?: 'running' | 'success' | 'error';
  className?: string;
}

// Tool icons
const TOOL_ICONS: Record<string, React.ElementType> = {
  calculator: Calculator,
  current_time: Clock,
  weather: Cloud,
  text_analysis: FileText,
  generate_image: ImageIcon,
  translate: Languages,
  tell_joke: Laugh,
  generate_code: Code,
  generate_qr: QrCode,
  generate_meme: Smile,
  generate_pdf: FileDown,
  generate_ppt: Presentation,
  generate_lorem: Type,
};

// Parse special results (images, QR codes, PDFs, PPTs)
type ResultType = 'text' | 'image' | 'qr' | 'pdf' | 'ppt';

function parseSpecialResult(result: string): { type: ResultType; content: string; meta?: string; data?: unknown } {
  if (result.startsWith('IMAGE_GENERATED:')) {
    const parts = result.replace('IMAGE_GENERATED:', '').split('|');
    return { type: 'image', content: parts[0], meta: parts[1] };
  }
  if (result.startsWith('QR_GENERATED:')) {
    const parts = result.replace('QR_GENERATED:', '').split('|');
    return { type: 'qr', content: parts[0], meta: parts[1] };
  }
  if (result.startsWith('PDF_GENERATE:')) {
    const jsonData = result.replace('PDF_GENERATE:', '');
    try {
      const data = JSON.parse(jsonData);
      return { type: 'pdf', content: '', data };
    } catch {
      return { type: 'text', content: result };
    }
  }
  if (result.startsWith('PPT_GENERATE:')) {
    const jsonData = result.replace('PPT_GENERATE:', '');
    try {
      const data = JSON.parse(jsonData);
      return { type: 'ppt', content: '', data };
    } catch {
      return { type: 'text', content: result };
    }
  }
  return { type: 'text', content: result };
}

// ============================================
// COMPONENT
// ============================================

export function ToolOutput({ tool, input, result, isLoading, toolCall, status, className }: ToolOutputProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Normalize props - support both interfaces
  const toolName = toolCall?.name || tool || 'unknown';
  const toolArgs: Record<string, unknown> = toolCall?.arguments ?? input ?? {};
  const toolResult = toolCall?.result ?? result;
  const hasToolArgs = Object.keys(toolArgs).length > 0;
  const hasToolResult = toolResult !== undefined && toolResult !== null;
  const toolError = toolCall?.error;
  const hasToolError = !!toolError;
  const computedStatus = status || (isLoading ? 'running' : (toolResult ? 'success' : 'running'));
  const hasArgs = Object.keys(toolArgs).length > 0;

  const Icon = TOOL_ICONS[toolName] || Wrench;

  const getStatusIcon = () => {
    switch (computedStatus) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusColor = () => {
    switch (computedStatus) {
      case 'running':
        return 'border-yellow-500/30 bg-yellow-500/5';
      case 'success':
        return 'border-green-500/30 bg-green-500/5';
      case 'error':
        return 'border-red-500/30 bg-red-500/5';
    }
  };

  return (
    <div
      className={cn(
        'ai-tool-output rounded-lg border overflow-hidden',
        getStatusColor(),
        className
      )}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
      >
        {/* Tool Icon */}
        <div className="p-1.5 rounded-md bg-white/10">
          <Icon className="h-4 w-4 text-purple-400" />
        </div>

        {/* Tool Info */}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium capitalize">
              {toolName.replace(/_/g, ' ')}
            </span>
            {getStatusIcon()}
          </div>
          <p className="text-xs text-muted-foreground">
            {computedStatus === 'running' ? 'Executing...' : 'Tool execution'}
          </p>
        </div>

        {/* Expand/Collapse */}
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Content */}
      {isExpanded ? (
        <div className="px-4 pb-3 space-y-2">
          {/* Arguments */}
          {hasArgs ? (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Input:</p>
              <pre className="text-xs bg-black/20 rounded p-2 overflow-x-auto">
                {JSON.stringify(toolArgs, null, 2)}
              </pre>
            </div>
          ) : null}

          {/* Result */}
          {hasToolResult ? (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Output:</p>
              {(() => {
                const resultStr = typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult, null, 2);
                const parsed = parseSpecialResult(resultStr);

                if (parsed.type === 'image') {
                  return (
                    <div className="space-y-2">
                      <div className="relative rounded-lg overflow-hidden bg-black/20 aspect-square max-w-[300px]">
                        <Image
                          src={parsed.content}
                          alt={parsed.meta || 'Generated image'}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      {parsed.meta && (
                        <p className="text-xs text-muted-foreground italic">&quot;{parsed.meta}&quot;</p>
                      )}
                      <a
                        href={parsed.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline"
                      >
                        <Download className="h-3 w-3" />
                        Open full image
                      </a>
                    </div>
                  );
                }

                return (
                  <pre className="text-xs bg-black/20 rounded p-2 overflow-x-auto whitespace-pre-wrap">
                    {resultStr}
                  </pre>
                );
              })()}
            </div>
          ) : null}

          {/* Error */}
          {hasToolError ? (
            <div>
              <p className="text-xs text-red-400 mb-1">Error:</p>
              <pre className="text-xs bg-red-500/10 text-red-300 rounded p-2">
                {toolError}
              </pre>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// ============================================
// TOOLS LIST COMPONENT
// ============================================

export interface ToolsListProps {
  tools: Array<{
    name: string;
    description: string;
  }>;
  className?: string;
}

export function ToolsList({ tools, className }: ToolsListProps) {
  return (
    <div className={cn('ai-tools-list space-y-2', className)}>
      <p className="text-sm font-medium text-muted-foreground">Available Tools:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {tools.map((tool) => {
          const Icon = TOOL_ICONS[tool.name] || Wrench;

          return (
            <div
              key={tool.name}
              className="flex items-start gap-2 p-2 rounded-lg bg-white/5"
            >
              <div className="p-1.5 rounded-md bg-purple-500/20">
                <Icon className="h-3.5 w-3.5 text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium capitalize">
                  {tool.name.replace(/_/g, ' ')}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {tool.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

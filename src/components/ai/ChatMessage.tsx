'use client';

/**
 * AI Chat Message Component
 * File: components/ai/ChatMessage.tsx
 *
 * Renders a single chat message with proper styling.
 * Isolated component - no dependencies on existing components.
 */

import { memo } from 'react';
import { Bot, User, Copy, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

export interface ChatMessageProps {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  isStreaming?: boolean;
  model?: string;
}

// ============================================
// COMPONENT
// ============================================

function ChatMessageComponent({
  role,
  content,
  isStreaming = false,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = role === 'user';
  const isAssistant = role === 'assistant';

  if (role === 'system') {
    return null; // Don't render system messages
  }

  return (
    <div
      className={cn(
        'ai-message flex gap-3 group',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'ai-avatar flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser
            ? 'bg-gradient-to-br from-cyan-500 to-blue-500'
            : 'bg-gradient-to-br from-purple-500 to-pink-500'
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'ai-message-content relative max-w-[80%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-tr-sm'
            : 'bg-white/5 rounded-tl-sm'
        )}
      >
        {/* Content */}
        {isAssistant ? (
          <div className="ai-prose prose prose-invert prose-sm max-w-none">
            {content ? (
              <ReactMarkdown
                components={{
                  // Custom code block styling
                  code: ({ className, children, ...props }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code
                          className="bg-black/30 px-1.5 py-0.5 rounded text-cyan-300 text-xs"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code
                        className={cn('block bg-black/30 p-3 rounded-lg overflow-x-auto', className)}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  // Custom pre styling
                  pre: ({ children }) => (
                    <pre className="bg-black/30 rounded-lg overflow-hidden my-2">
                      {children}
                    </pre>
                  ),
                  // Custom link styling
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            ) : (
              <span className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {isStreaming ? 'Generating...' : 'Thinking...'}
              </span>
            )}
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        )}

        {/* Copy Button */}
        {content && !isStreaming && (
          <button
            onClick={handleCopy}
            className={cn(
              'ai-copy-btn absolute -bottom-6 opacity-0 group-hover:opacity-100',
              'transition-opacity text-xs text-muted-foreground hover:text-foreground',
              'flex items-center gap-1',
              isUser ? 'left-0' : 'right-0'
            )}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// Memoize for performance
export const ChatMessage = memo(ChatMessageComponent);

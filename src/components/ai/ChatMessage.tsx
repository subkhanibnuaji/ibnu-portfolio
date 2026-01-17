'use client';

/**
 * AI Chat Message Component
 * File: components/ai/ChatMessage.tsx
 *
 * Renders a single chat message with proper styling.
 * Isolated component - no dependencies on existing components.
 */

import { memo, useState } from 'react';
import { Bot, User, Copy, Check, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

export type FeedbackType = 'up' | 'down' | null;

export interface ChatMessageProps {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  isStreaming?: boolean;
  isLoading?: boolean; // Alias for isStreaming
  model?: string;
  feedback?: FeedbackType;
  onFeedback?: (id: string, feedback: FeedbackType) => void;
}

// ============================================
// COMPONENT
// ============================================

function ChatMessageComponent({
  id,
  role,
  content,
  isStreaming = false,
  isLoading = false,
  feedback,
  onFeedback,
}: ChatMessageProps) {
  // Support both isStreaming and isLoading
  const streaming = isStreaming || isLoading;
  const [copied, setCopied] = useState(false);
  const [localFeedback, setLocalFeedback] = useState<FeedbackType>(feedback || null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (type: 'up' | 'down') => {
    if (!id) return;
    const newFeedback = localFeedback === type ? null : type;
    setLocalFeedback(newFeedback);
    onFeedback?.(id, newFeedback);
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
              <div className="flex items-center gap-3 text-muted-foreground py-1">
                {/* Animated typing dots with custom animation */}
                <div className="flex items-center gap-1.5">
                  <span className="typing-dot h-2.5 w-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                  <span className="typing-dot h-2.5 w-2.5 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500" />
                  <span className="typing-dot h-2.5 w-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" />
                </div>
                <span className="text-sm font-medium">
                  {streaming ? 'Generating response...' : 'Thinking...'}
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        )}

        {/* Action Buttons */}
        {content && !streaming && (
          <div
            className={cn(
              'ai-action-btns absolute -bottom-7 flex items-center gap-3',
              'opacity-0 group-hover:opacity-100 transition-opacity',
              isUser ? 'left-0' : 'right-0'
            )}
          >
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
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

            {/* Feedback Buttons - Only for assistant */}
            {isAssistant && (
              <div className="flex items-center gap-1 border-l border-gray-600 pl-3">
                <button
                  onClick={() => handleFeedback('up')}
                  className={cn(
                    'p-1 rounded transition-colors',
                    localFeedback === 'up'
                      ? 'text-green-400 bg-green-400/20'
                      : 'text-muted-foreground hover:text-green-400 hover:bg-green-400/10'
                  )}
                  title="Good response"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleFeedback('down')}
                  className={cn(
                    'p-1 rounded transition-colors',
                    localFeedback === 'down'
                      ? 'text-red-400 bg-red-400/20'
                      : 'text-muted-foreground hover:text-red-400 hover:bg-red-400/10'
                  )}
                  title="Poor response"
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Memoize for performance
export const ChatMessage = memo(ChatMessageComponent);

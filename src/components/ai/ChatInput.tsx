'use client';

/**
 * AI Chat Input Component
 * File: components/ai/ChatInput.tsx
 *
 * Input field with send button for chat interface.
 * Supports keyboard shortcuts and auto-resize.
 */

import { useState, useRef, useEffect, KeyboardEvent, FormEvent } from 'react';
import { Send, Loader2, Paperclip, Mic, StopCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

export interface ChatInputProps {
  onSend?: (message: string) => void;
  // Controlled mode props
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (e?: FormEvent) => void;
  // Common props
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  showAttachment?: boolean;
  onAttach?: () => void;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function ChatInput({
  onSend,
  value: controlledValue,
  onChange: controlledOnChange,
  onSubmit,
  isLoading = false,
  disabled = false,
  placeholder = 'Type your message...',
  showAttachment = false,
  onAttach,
  className,
}: ChatInputProps) {
  const [internalInput, setInternalInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Support both controlled and uncontrolled modes
  const isControlled = controlledValue !== undefined;
  const input = isControlled ? controlledValue : internalInput;
  const setInput = isControlled
    ? (val: string) => controlledOnChange?.(val)
    : setInternalInput;

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [input]);

  // Focus input on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || disabled) return;

    // Support both onSubmit and onSend
    if (onSubmit) {
      onSubmit(e);
    } else if (onSend) {
      onSend(input.trim());
      if (!isControlled) {
        setInternalInput('');
      }
    }

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isDisabled = isLoading || disabled;

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('ai-chat-input flex gap-2 items-end', className)}
    >
      {/* Attachment Button (Optional) */}
      {showAttachment && (
        <button
          type="button"
          onClick={onAttach}
          disabled={isDisabled}
          className={cn(
            'ai-attach-btn p-3 rounded-xl transition-colors',
            'bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          title="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </button>
      )}

      {/* Input Container */}
      <div className="ai-input-container relative flex-1">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isDisabled}
          rows={1}
          className={cn(
            'ai-textarea w-full px-4 py-3 pr-12',
            'bg-white/5 border border-white/10 rounded-xl',
            'resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50',
            'placeholder:text-muted-foreground text-sm',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200'
          )}
          style={{ minHeight: '48px', maxHeight: '150px' }}
        />

        {/* Character Count */}
        {input.length > 100 && (
          <span className="absolute right-14 bottom-3 text-xs text-muted-foreground">
            {input.length}
          </span>
        )}
      </div>

      {/* Send Button */}
      <button
        type="submit"
        disabled={!input.trim() || isDisabled}
        className={cn(
          'ai-send-btn p-3 rounded-xl transition-all duration-200',
          'bg-gradient-to-r from-purple-500 to-pink-500',
          'hover:from-purple-600 hover:to-pink-600',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'disabled:from-gray-500 disabled:to-gray-600',
          'shadow-lg shadow-purple-500/25'
        )}
        title={isLoading ? 'Generating...' : 'Send message (Enter)'}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 text-white animate-spin" />
        ) : (
          <Send className="h-5 w-5 text-white" />
        )}
      </button>
    </form>
  );
}

// ============================================
// STOP BUTTON COMPONENT
// ============================================

export interface StopButtonProps {
  onStop?: () => void;
  onClick?: () => void; // Alias for onStop
  className?: string;
}

export function StopButton({ onStop, onClick, className }: StopButtonProps) {
  const handleClick = onStop || onClick;
  return (
    <button
      onClick={handleClick}
      className={cn(
        'ai-stop-btn flex items-center gap-2 px-4 py-2 rounded-lg',
        'bg-red-500/20 hover:bg-red-500/30 text-red-400',
        'transition-colors text-sm font-medium',
        className
      )}
    >
      <StopCircle className="h-4 w-4" />
      Stop generating
    </button>
  );
}

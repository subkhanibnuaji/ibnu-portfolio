'use client';

/**
 * AI Model Selector Component
 * File: components/ai/ModelSelector.tsx
 *
 * Dropdown to select AI model.
 * Shows model name, description, and free status.
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Brain, Zap, Sparkles, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AI_MODELS, type GroqModelId } from '@/lib/ai/config';

// ============================================
// TYPES
// ============================================

export interface ModelSelectorProps {
  value: GroqModelId;
  onChange: (model: GroqModelId) => void;
  disabled?: boolean;
  className?: string;
  compact?: boolean;
}

// Model icons
const MODEL_ICONS: Record<string, React.ElementType> = {
  'llama-3.3-70b-versatile': Brain,
  'llama-3.1-8b-instant': Zap,
  'mixtral-8x7b-32768': Sparkles,
  'gemma2-9b-it': Bot,
};

// ============================================
// COMPONENT
// ============================================

export function ModelSelector({
  value,
  onChange,
  disabled = false,
  className,
  compact = false,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const models = Object.values(AI_MODELS.groq);
  const selectedModel = AI_MODELS.groq[value];
  const SelectedIcon = MODEL_ICONS[value] || Brain;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className={cn('ai-model-selector relative', className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'ai-model-btn flex items-center gap-2 px-3 py-2 rounded-lg',
          'bg-white/5 hover:bg-white/10 border border-white/10',
          'transition-colors text-sm font-medium',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          isOpen && 'ring-2 ring-purple-500/50'
        )}
      >
        <SelectedIcon className="h-4 w-4 text-purple-400" />
        {!compact && (
          <span className="hidden sm:inline">{selectedModel?.name || 'Select Model'}</span>
        )}
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            'ai-model-dropdown absolute right-0 top-full mt-2 z-50',
            'w-72 rounded-xl overflow-hidden',
            'bg-background/95 backdrop-blur-xl border border-white/10',
            'shadow-xl shadow-black/20',
            'animate-in fade-in-0 zoom-in-95 duration-200'
          )}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10">
            <h4 className="text-sm font-semibold">Select Model</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              All models are free via Groq
            </p>
          </div>

          {/* Model List */}
          <div className="py-2 max-h-80 overflow-y-auto">
            {models.map((model) => {
              const Icon = MODEL_ICONS[model.id] || Brain;
              const isSelected = model.id === value;

              return (
                <button
                  key={model.id}
                  onClick={() => {
                    onChange(model.id as GroqModelId);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'ai-model-option w-full flex items-start gap-3 px-4 py-3',
                    'hover:bg-white/5 transition-colors text-left',
                    isSelected && 'bg-purple-500/10'
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      'p-2 rounded-lg',
                      isSelected ? 'bg-purple-500/20' : 'bg-white/5'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4',
                        isSelected ? 'text-purple-400' : 'text-muted-foreground'
                      )}
                    />
                  </div>

                  {/* Model Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{model.name}</span>
                      {model.free && (
                        <span className="px-1.5 py-0.5 text-[10px] rounded bg-green-500/20 text-green-400 font-medium">
                          FREE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {model.description}
                    </p>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <Check className="h-4 w-4 text-purple-400 mt-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-white/10 bg-white/5">
            <p className="text-[10px] text-muted-foreground">
              Powered by Groq • Lightning-fast inference
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

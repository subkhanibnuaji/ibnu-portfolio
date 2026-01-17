/**
 * AI Components Index
 * File: components/ai/index.ts
 *
 * Central export point for all AI components.
 * Import from '@/components/ai' instead of individual files.
 */

export { ChatMessage, type ChatMessageProps } from './ChatMessage';
export { ChatInput, StopButton, type ChatInputProps, type StopButtonProps } from './ChatInput';
export { ModelSelector, type ModelSelectorProps } from './ModelSelector';
export { DocumentUpload, type DocumentUploadProps, type UploadedDocument } from './DocumentUpload';
export { ToolOutput, ToolsList, type ToolOutputProps, type ToolsListProps } from './ToolOutput';

// AI Tools for pillar page
export {
  AIToolsGrid,
  TokenCounter,
  PromptTemplateBuilder,
  TextReadabilityAnalyzer,
  JSONSchemaGenerator,
  RegexTester,
  TextDiffViewer,
  ModelComparison,
  SystemPromptLibrary
} from './ai-tools';

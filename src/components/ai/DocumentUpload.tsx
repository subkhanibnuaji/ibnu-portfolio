'use client';

/**
 * Document Upload Component for RAG
 * File: components/ai/DocumentUpload.tsx
 *
 * Allows users to upload documents for RAG-based Q&A.
 * Supports drag-and-drop and file selection.
 */

import { useState, useRef, useCallback } from 'react';
import {
  Upload,
  FileText,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  File,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AI_FEATURES } from '@/lib/ai/config';

// ============================================
// TYPES
// ============================================

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  error?: string;
  chunks?: number;
}

export interface DocumentUploadProps {
  documents: UploadedDocument[];
  onUpload: (files: File[]) => Promise<void>;
  onRemove: (documentId: string) => void;
  disabled?: boolean;
  maxDocuments?: number;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function DocumentUpload({
  documents,
  onUpload,
  onRemove,
  disabled = false,
  maxDocuments = AI_FEATURES.rag.maxDocumentsPerUser,
  className,
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFormats = AI_FEATURES.rag.supportedFormats.join(',');
  const canUploadMore = documents.length < maxDocuments;

  // Handle file selection
  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0 || disabled || !canUploadMore) return;

      const validFiles: File[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;

        if ((AI_FEATURES.rag.supportedFormats as readonly string[]).includes(extension)) {
          validFiles.push(file);
        }
      }

      if (validFiles.length === 0) return;

      // Limit number of files
      const filesToUpload = validFiles.slice(0, maxDocuments - documents.length);

      setIsUploading(true);
      try {
        await onUpload(filesToUpload);
      } finally {
        setIsUploading(false);
      }

      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [disabled, canUploadMore, maxDocuments, documents.length, onUpload]
  );

  // Drag and drop handlers
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled && canUploadMore) {
        setIsDragging(true);
      }
    },
    [disabled, canUploadMore]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get status icon
  const getStatusIcon = (status: UploadedDocument['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />;
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
    }
  };

  return (
    <div className={cn('ai-document-upload space-y-4', className)}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => canUploadMore && fileInputRef.current?.click()}
        className={cn(
          'ai-dropzone relative border-2 border-dashed rounded-xl p-6',
          'transition-all duration-200 cursor-pointer',
          'flex flex-col items-center justify-center text-center',
          isDragging
            ? 'border-purple-500 bg-purple-500/10'
            : 'border-white/20 hover:border-white/40 hover:bg-white/5',
          (disabled || !canUploadMore) && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats}
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled || !canUploadMore}
          className="hidden"
        />

        {isUploading ? (
          <>
            <Loader2 className="h-10 w-10 text-purple-400 animate-spin mb-3" />
            <p className="text-sm font-medium">Processing documents...</p>
          </>
        ) : (
          <>
            <Upload
              className={cn(
                'h-10 w-10 mb-3',
                isDragging ? 'text-purple-400' : 'text-muted-foreground'
              )}
            />
            <p className="text-sm font-medium mb-1">
              {canUploadMore
                ? 'Drop files here or click to upload'
                : 'Maximum documents reached'}
            </p>
            <p className="text-xs text-muted-foreground">
              Supported: {AI_FEATURES.rag.supportedFormats.join(', ')} •
              Max {AI_FEATURES.rag.maxDocumentSizeMB}MB per file
            </p>
          </>
        )}
      </div>

      {/* Document List */}
      {documents.length > 0 && (
        <div className="ai-document-list space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Uploaded Documents</span>
            <span className="text-muted-foreground">
              {documents.length}/{maxDocuments}
            </span>
          </div>

          {documents.map((doc) => (
            <div
              key={doc.id}
              className={cn(
                'ai-document-item flex items-center gap-3 p-3 rounded-lg',
                'bg-white/5 border border-white/10'
              )}
            >
              {/* File Icon */}
              <div className="p-2 rounded-lg bg-white/5">
                <FileText className="h-5 w-5 text-purple-400" />
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{doc.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatSize(doc.size)}</span>
                  {doc.chunks && (
                    <>
                      <span>•</span>
                      <span>{doc.chunks} chunks</span>
                    </>
                  )}
                  {doc.error && (
                    <span className="text-red-400">{doc.error}</span>
                  )}
                </div>
              </div>

              {/* Status */}
              {getStatusIcon(doc.status)}

              {/* Remove Button */}
              {doc.status === 'ready' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(doc.id);
                  }}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="Remove document"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-red-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      {documents.length === 0 && (
        <p className="text-xs text-center text-muted-foreground">
          Upload documents to enable context-aware AI responses
        </p>
      )}
    </div>
  );
}

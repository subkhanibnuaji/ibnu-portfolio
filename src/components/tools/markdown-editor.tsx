'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FileText, Eye, Edit3, Copy, Check, Download,
  Bold, Italic, List, ListOrdered, Link2, Image, Code, Quote, Heading
} from 'lucide-react'

const SAMPLE_MARKDOWN = `# Welcome to Markdown Editor

This is a **live preview** markdown editor. Start typing on the left and see the results on the right!

## Features

- **Bold** and *italic* text
- Lists (ordered and unordered)
- [Links](https://example.com)
- Code blocks
- And more!

### Code Example

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

### Blockquote

> "The best way to predict the future is to create it."
> — Abraham Lincoln

### Table

| Feature | Status |
|---------|--------|
| Bold | ✅ |
| Italic | ✅ |
| Links | ✅ |
| Images | ✅ |

---

Happy writing! ✨
`

export function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN)
  const [view, setView] = useState<'split' | 'edit' | 'preview'>('split')
  const [copied, setCopied] = useState(false)

  const parseMarkdown = useMemo(() => {
    let html = markdown

    // Escape HTML first
    html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;')

    // Code blocks (must be before inline code)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="bg-zinc-800 text-zinc-100 p-4 rounded-lg overflow-x-auto my-4"><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`
    })

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-muted rounded text-sm font-mono">$1</code>')

    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-4">$1</h2>')
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')

    // Bold and Italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
    html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')
    html = html.replace(/_(.+?)_/g, '<em>$1</em>')

    // Strikethrough
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>')

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener">$1</a>')

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-4 max-w-full" />')

    // Blockquotes
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">$1</blockquote>')

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr class="border-border my-6" />')

    // Unordered lists
    html = html.replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
    html = html.replace(/(<li class="ml-4">.*<\/li>\n?)+/g, (match) => {
      return `<ul class="list-disc pl-4 my-2">${match}</ul>`
    })

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4">$1</li>')

    // Tables
    html = html.replace(/^\|(.+)\|$/gm, (_, content) => {
      const cells = content.split('|').map((c: string) => c.trim())
      const isHeader = content.includes('---')
      if (isHeader) return ''
      return `<tr>${cells.map((c: string) => `<td class="border border-border px-3 py-2">${c}</td>`).join('')}</tr>`
    })
    html = html.replace(/(<tr>.*<\/tr>\n?)+/g, (match) => {
      return `<table class="w-full border-collapse my-4">${match}</table>`
    })

    // Paragraphs - handle double line breaks
    html = html.replace(/\n\n/g, '</p><p class="my-4">')

    // Single line breaks within paragraphs
    html = html.replace(/\n/g, '<br />')

    return `<div class="prose-content"><p class="my-4">${html}</p></div>`
  }, [markdown])

  const insertText = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = markdown.substring(start, end)
    const newText = markdown.substring(0, start) + before + selected + after + markdown.substring(end)

    setMarkdown(newText)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length)
    }, 0)
  }

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  const toolbarButtons = [
    { icon: Heading, action: () => insertText('## '), title: 'Heading' },
    { icon: Bold, action: () => insertText('**', '**'), title: 'Bold' },
    { icon: Italic, action: () => insertText('*', '*'), title: 'Italic' },
    { icon: List, action: () => insertText('- '), title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertText('1. '), title: 'Numbered List' },
    { icon: Link2, action: () => insertText('[', '](url)'), title: 'Link' },
    { icon: Image, action: () => insertText('![alt](', ')'), title: 'Image' },
    { icon: Code, action: () => insertText('`', '`'), title: 'Inline Code' },
    { icon: Quote, action: () => insertText('> '), title: 'Quote' },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-500 text-sm font-medium mb-4">
          <FileText className="w-4 h-4" />
          Editor
        </div>
        <h2 className="text-2xl font-bold">Markdown Editor</h2>
        <p className="text-muted-foreground mt-2">
          Write markdown and see live preview instantly.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl border border-border bg-card mb-4">
        {/* Formatting Tools */}
        <div className="flex gap-1 flex-wrap">
          {toolbarButtons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.action}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title={btn.title}
            >
              <btn.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* View Toggle & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setView('edit')}
              className={`p-2 rounded ${view === 'edit' ? 'bg-background shadow' : ''}`}
              title="Edit only"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('split')}
              className={`p-2 rounded ${view === 'split' ? 'bg-background shadow' : ''}`}
              title="Split view"
            >
              <div className="w-4 h-4 flex gap-0.5">
                <div className="flex-1 bg-current rounded-sm" />
                <div className="flex-1 border border-current rounded-sm" />
              </div>
            </button>
            <button
              onClick={() => setView('preview')}
              className={`p-2 rounded ${view === 'preview' ? 'bg-background shadow' : ''}`}
              title="Preview only"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-border" />

          <button
            onClick={copyMarkdown}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Copy markdown"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={downloadMarkdown}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor and Preview */}
      <div className={`grid gap-4 ${view === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Editor */}
        {(view === 'edit' || view === 'split') && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Markdown
            </h3>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-[500px] p-4 rounded-xl border border-border bg-card font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Write your markdown here..."
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview */}
        {(view === 'preview' || view === 'split') && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </h3>
            <div
              className="w-full h-[500px] p-6 rounded-xl border border-border bg-card overflow-auto"
              dangerouslySetInnerHTML={{ __html: parseMarkdown }}
            />
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground">
        <p className="font-medium mb-2">Quick Reference:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <span>**bold**</span>
          <span>*italic*</span>
          <span># Heading</span>
          <span>[link](url)</span>
          <span>- list item</span>
          <span>&gt; quote</span>
          <span>`code`</span>
          <span>---</span>
        </div>
      </div>
    </div>
  )
}

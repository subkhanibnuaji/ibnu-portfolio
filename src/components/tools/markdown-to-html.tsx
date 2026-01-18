'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Code, Copy, Download, Check, Eye, EyeOff } from 'lucide-react'

export function MarkdownToHtml() {
  const [markdown, setMarkdown] = useState('')
  const [html, setHtml] = useState('')
  const [showPreview, setShowPreview] = useState(true)
  const [copied, setCopied] = useState(false)

  // Simple markdown parser
  const parseMarkdown = (md: string): string => {
    let result = md

    // Escape HTML
    result = result.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

    // Code blocks (must come before other patterns)
    result = result.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    result = result.replace(/`([^`]+)`/g, '<code>$1</code>')

    // Headers
    result = result.replace(/^###### (.*$)/gm, '<h6>$1</h6>')
    result = result.replace(/^##### (.*$)/gm, '<h5>$1</h5>')
    result = result.replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    result = result.replace(/^### (.*$)/gm, '<h3>$1</h3>')
    result = result.replace(/^## (.*$)/gm, '<h2>$1</h2>')
    result = result.replace(/^# (.*$)/gm, '<h1>$1</h1>')

    // Bold and Italic
    result = result.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    result = result.replace(/\*(.+?)\*/g, '<em>$1</em>')
    result = result.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
    result = result.replace(/__(.+?)__/g, '<strong>$1</strong>')
    result = result.replace(/_(.+?)_/g, '<em>$1</em>')

    // Strikethrough
    result = result.replace(/~~(.+?)~~/g, '<del>$1</del>')

    // Links and Images
    result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

    // Blockquotes
    result = result.replace(/^&gt; (.*$)/gm, '<blockquote>$1</blockquote>')

    // Horizontal rule
    result = result.replace(/^---$/gm, '<hr />')
    result = result.replace(/^\*\*\*$/gm, '<hr />')

    // Unordered lists
    result = result.replace(/^\* (.*$)/gm, '<li>$1</li>')
    result = result.replace(/^- (.*$)/gm, '<li>$1</li>')
    result = result.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')

    // Ordered lists
    result = result.replace(/^\d+\. (.*$)/gm, '<li>$1</li>')

    // Task lists
    result = result.replace(/\[ \]/g, '<input type="checkbox" disabled />')
    result = result.replace(/\[x\]/gi, '<input type="checkbox" checked disabled />')

    // Paragraphs (wrap remaining lines)
    result = result.replace(/^(?!<[a-z])(.*$)/gm, (match) => {
      if (match.trim() === '') return ''
      return `<p>${match}</p>`
    })

    // Clean up empty paragraphs
    result = result.replace(/<p><\/p>/g, '')
    result = result.replace(/<p>\s*<\/p>/g, '')

    // Clean up consecutive blockquotes
    result = result.replace(/<\/blockquote>\n<blockquote>/g, '\n')

    return result.trim()
  }

  useEffect(() => {
    setHtml(parseMarkdown(markdown))
  }, [markdown])

  const copyHtml = () => {
    navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Converted Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    pre { background: #f4f4f4; padding: 16px; border-radius: 8px; overflow-x: auto; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
    pre code { background: none; padding: 0; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
    img { max-width: 100%; }
    a { color: #0066cc; }
    hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
    h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; }
  </style>
</head>
<body>
${html}
</body>
</html>`

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  const loadSample = () => {
    setMarkdown(`# Heading 1
## Heading 2
### Heading 3

This is a **bold** and *italic* text. You can also use ***bold italic***.

Here's a ~~strikethrough~~ text.

> This is a blockquote
> It can span multiple lines

- Unordered list item 1
- Unordered list item 2
- Unordered list item 3

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list item 3

[Link to Google](https://google.com)

![Alt text for image](https://via.placeholder.com/150)

Inline \`code\` looks like this.

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

---

That's a horizontal rule above!`)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 flex items-center gap-2 text-sm"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            onClick={loadSample}
            className="px-4 py-2 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 text-sm"
          >
            Load Sample
          </button>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={copyHtml}
              disabled={!html}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy HTML'}
            </button>
            <button
              onClick={downloadHtml}
              disabled={!html}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        {/* Editor Grid */}
        <div className={`grid gap-4 ${showPreview ? 'md:grid-cols-2' : ''}`}>
          {/* Markdown Input */}
          <div>
            <label className="text-white/70 text-sm mb-2 block flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Markdown
            </label>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Enter your markdown here..."
              className="w-full h-96 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-mono text-sm placeholder:text-white/30 resize-none"
            />
          </div>

          {/* HTML Output / Preview */}
          {showPreview && (
            <div>
              <div className="flex mb-2">
                <button
                  className="flex-1 py-2 text-sm text-white/70 border-b-2 border-blue-500"
                >
                  Preview
                </button>
              </div>
              <div
                className="w-full h-96 bg-white/10 border border-white/20 rounded-lg px-4 py-3 overflow-auto prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
                style={{
                  color: 'white'
                }}
              />
            </div>
          )}
        </div>

        {/* Raw HTML Output */}
        <div className="mt-6">
          <label className="text-white/70 text-sm mb-2 block flex items-center gap-2">
            <Code className="w-4 h-4" />
            HTML Output
          </label>
          <textarea
            value={html}
            readOnly
            placeholder="HTML output will appear here..."
            className="w-full h-48 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-mono text-sm placeholder:text-white/30 resize-none"
          />
        </div>
      </motion.div>
    </div>
  )
}

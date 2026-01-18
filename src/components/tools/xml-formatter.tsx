'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileCode, Copy, Check, Trash2, AlertCircle, Wand2 } from 'lucide-react'

export function XMLFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [indentSize, setIndentSize] = useState(2)

  const formatXML = (xml: string): string => {
    if (!xml.trim()) return ''

    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(xml, 'text/xml')

      const errorNode = doc.querySelector('parsererror')
      if (errorNode) {
        throw new Error('Invalid XML: ' + errorNode.textContent?.split('\n')[0])
      }

      const indent = ' '.repeat(indentSize)
      let formatted = ''
      let depth = 0

      const serialize = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim()
          if (text) {
            formatted += text
          }
          return
        }

        if (node.nodeType === Node.COMMENT_NODE) {
          formatted += `\n${indent.repeat(depth)}<!--${node.textContent}-->`
          return
        }

        if (node.nodeType === Node.CDATA_SECTION_NODE) {
          formatted += `<![CDATA[${node.textContent}]]>`
          return
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element
          const tagName = element.tagName
          const attributes = Array.from(element.attributes)
            .map(attr => `${attr.name}="${attr.value}"`)
            .join(' ')

          const attrStr = attributes ? ' ' + attributes : ''
          const hasChildren = element.childNodes.length > 0
          const hasTextOnly = element.childNodes.length === 1 &&
                             element.childNodes[0].nodeType === Node.TEXT_NODE

          if (!hasChildren) {
            formatted += `\n${indent.repeat(depth)}<${tagName}${attrStr} />`
          } else if (hasTextOnly) {
            const text = element.textContent?.trim()
            formatted += `\n${indent.repeat(depth)}<${tagName}${attrStr}>${text}</${tagName}>`
          } else {
            formatted += `\n${indent.repeat(depth)}<${tagName}${attrStr}>`
            depth++
            Array.from(element.childNodes).forEach(child => serialize(child))
            depth--
            formatted += `\n${indent.repeat(depth)}</${tagName}>`
          }
        }
      }

      // Handle XML declaration
      const xmlDeclaration = xml.match(/<\?xml[^?]*\?>/i)
      if (xmlDeclaration) {
        formatted = xmlDeclaration[0]
      }

      Array.from(doc.childNodes).forEach(child => serialize(child))

      setError(null)
      return formatted.trim()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse XML')
      return ''
    }
  }

  const minifyXML = (xml: string): string => {
    if (!xml.trim()) return ''
    try {
      const formatted = xml
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim()
      setError(null)
      return formatted
    } catch (err) {
      setError('Failed to minify XML')
      return ''
    }
  }

  const handleFormat = () => {
    setOutput(formatXML(input))
  }

  const handleMinify = () => {
    setOutput(minifyXML(input))
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const examples = [
    {
      name: 'Simple XML',
      xml: '<?xml version="1.0"?><root><item id="1"><name>Test</name><value>123</value></item><item id="2"><name>Test 2</name><value>456</value></item></root>'
    },
    {
      name: 'With Attributes',
      xml: '<bookstore><book category="cooking"><title lang="en">Everyday Italian</title><author>Giada De Laurentiis</author><year>2005</year><price>30.00</price></book><book category="web"><title lang="en">Learning XML</title><author>Erik T. Ray</author><year>2003</year><price>39.95</price></book></bookstore>'
    },
    {
      name: 'SVG',
      xml: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#00d4ff"/><rect x="20" y="20" width="60" height="60" fill="none" stroke="#a855f7" stroke-width="2"/></svg>'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="flex flex-wrap gap-4 p-4 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Indent Size:</label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={8}>8 spaces</option>
          </select>
        </div>
        <div className="flex gap-2 ml-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFormat}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            Format
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleMinify}
            className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium"
          >
            Minify
          </motion.button>
        </div>
      </div>

      {/* Example Buttons */}
      <div className="flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example.name}
            onClick={() => {
              setInput(example.xml)
              setOutput(formatXML(example.xml))
            }}
            className="px-3 py-1.5 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            {example.name}
          </button>
        ))}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FileCode className="w-5 h-5 text-primary" />
              Input XML
            </h3>
            <button
              onClick={() => {
                setInput('')
                setOutput('')
                setError(null)
              }}
              className="p-2 hover:bg-muted rounded-lg transition-colors text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your XML here..."
            rows={16}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background font-mono text-sm resize-none"
          />
        </div>

        {/* Output */}
        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Formatted XML</h3>
            <button
              onClick={copyToClipboard}
              disabled={!output}
              className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <pre className="w-full h-[400px] p-4 rounded-lg border border-border bg-muted overflow-auto font-mono text-sm">
            {output || <span className="text-muted-foreground">Formatted XML will appear here...</span>}
          </pre>
        </div>
      </div>

      {/* Stats */}
      {input && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="p-4 rounded-xl border border-border bg-card text-center">
            <p className="text-2xl font-bold text-primary">{input.length}</p>
            <p className="text-sm text-muted-foreground">Input Size</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card text-center">
            <p className="text-2xl font-bold text-green-500">{output.length}</p>
            <p className="text-sm text-muted-foreground">Output Size</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card text-center">
            <p className="text-2xl font-bold text-purple-500">
              {(input.match(/<[^/!?][^>]*>/g) || []).length}
            </p>
            <p className="text-sm text-muted-foreground">Opening Tags</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card text-center">
            <p className="text-2xl font-bold text-cyan-500">{output.split('\n').length}</p>
            <p className="text-sm text-muted-foreground">Lines</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Database, Copy, Check, Trash2, Wand2 } from 'lucide-react'

export function SQLFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [indentSize, setIndentSize] = useState(2)
  const [uppercase, setUppercase] = useState(true)

  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS', 'NULL',
    'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'JOIN', 'INNER JOIN', 'LEFT JOIN',
    'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'ON', 'AS', 'DISTINCT', 'ALL', 'UNION',
    'INTERSECT', 'EXCEPT', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
    'CREATE', 'TABLE', 'INDEX', 'VIEW', 'DROP', 'ALTER', 'ADD', 'COLUMN', 'PRIMARY KEY',
    'FOREIGN KEY', 'REFERENCES', 'CONSTRAINT', 'DEFAULT', 'NOT NULL', 'UNIQUE', 'CHECK',
    'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'EXISTS', 'ANY', 'SOME', 'COUNT', 'SUM',
    'AVG', 'MIN', 'MAX', 'COALESCE', 'NULLIF', 'CAST', 'CONVERT', 'IF', 'IIF',
    'WITH', 'RECURSIVE', 'OVER', 'PARTITION BY', 'ROW_NUMBER', 'RANK', 'DENSE_RANK',
    'ASC', 'DESC', 'NULLS FIRST', 'NULLS LAST', 'FETCH', 'NEXT', 'ROWS', 'ONLY',
    'TRUNCATE', 'GRANT', 'REVOKE', 'BEGIN', 'COMMIT', 'ROLLBACK', 'TRANSACTION'
  ]

  const formatSQL = (sql: string): string => {
    if (!sql.trim()) return ''

    let formatted = sql.trim()

    // Normalize whitespace
    formatted = formatted.replace(/\s+/g, ' ')

    // Handle keywords casing
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      formatted = formatted.replace(regex, uppercase ? keyword : keyword.toLowerCase())
    })

    const indent = ' '.repeat(indentSize)

    // Add newlines before major keywords
    const newlineKeywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING',
      'LIMIT', 'OFFSET', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN',
      'CROSS JOIN', 'UNION', 'INTERSECT', 'EXCEPT', 'INSERT', 'INTO', 'VALUES',
      'UPDATE', 'SET', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'WITH'
    ]

    newlineKeywords.forEach(keyword => {
      const regex = new RegExp(`\\s+(${uppercase ? keyword : keyword.toLowerCase()})\\b`, 'g')
      formatted = formatted.replace(regex, `\n$1`)
    })

    // Indent sub-clauses
    const indentKeywords = ['AND', 'OR', 'ON']
    indentKeywords.forEach(keyword => {
      const regex = new RegExp(`\\n(${uppercase ? keyword : keyword.toLowerCase()})\\b`, 'g')
      formatted = formatted.replace(regex, `\n${indent}$1`)
    })

    // Handle SELECT columns - add newline after each comma
    const selectMatch = formatted.match(/(SELECT\s+)(.*?)(FROM)/is)
    if (selectMatch) {
      const columns = selectMatch[2]
        .split(',')
        .map(col => col.trim())
        .join(`,\n${indent}`)
      formatted = formatted.replace(selectMatch[0], `${selectMatch[1]}\n${indent}${columns}\n${selectMatch[3]}`)
    }

    // Handle parentheses for subqueries
    let depth = 0
    let result = ''
    for (let i = 0; i < formatted.length; i++) {
      const char = formatted[i]
      if (char === '(') {
        depth++
        result += char
        if (formatted.substring(i + 1).trim().toUpperCase().startsWith('SELECT')) {
          result += '\n' + indent.repeat(depth)
        }
      } else if (char === ')') {
        depth = Math.max(0, depth - 1)
        if (result.endsWith('\n' + indent.repeat(depth + 1))) {
          result = result.slice(0, -indent.length)
        }
        result += char
      } else {
        result += char
      }
    }

    return result.trim()
  }

  const minifySQL = (sql: string): string => {
    if (!sql.trim()) return ''
    return sql.replace(/\s+/g, ' ').trim()
  }

  useEffect(() => {
    if (input) {
      setOutput(formatSQL(input))
    } else {
      setOutput('')
    }
  }, [input, indentSize, uppercase])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const exampleQueries = [
    {
      name: 'Simple Select',
      query: "SELECT id, name, email, created_at FROM users WHERE status = 'active' AND role = 'admin' ORDER BY created_at DESC LIMIT 10"
    },
    {
      name: 'Join Query',
      query: "SELECT u.id, u.name, o.order_id, o.total FROM users u INNER JOIN orders o ON u.id = o.user_id WHERE o.status = 'completed' AND o.total > 100 ORDER BY o.total DESC"
    },
    {
      name: 'Subquery',
      query: "SELECT * FROM products WHERE category_id IN (SELECT id FROM categories WHERE active = 1) AND price > (SELECT AVG(price) FROM products)"
    },
    {
      name: 'CTE Query',
      query: "WITH active_users AS (SELECT id, name FROM users WHERE status = 'active'), user_orders AS (SELECT user_id, COUNT(*) as order_count FROM orders GROUP BY user_id) SELECT au.name, uo.order_count FROM active_users au LEFT JOIN user_orders uo ON au.id = uo.user_id"
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
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Keywords:</label>
          <select
            value={uppercase ? 'upper' : 'lower'}
            onChange={(e) => setUppercase(e.target.value === 'upper')}
            className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
          >
            <option value="upper">UPPERCASE</option>
            <option value="lower">lowercase</option>
          </select>
        </div>
      </div>

      {/* Example Queries */}
      <div className="flex flex-wrap gap-2">
        {exampleQueries.map((example) => (
          <button
            key={example.name}
            onClick={() => setInput(example.query)}
            className="px-3 py-1.5 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            {example.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Input SQL
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setInput(minifySQL(input))}
                className="p-2 hover:bg-muted rounded-lg transition-colors text-sm"
                title="Minify"
              >
                <Wand2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setInput('')}
                className="p-2 hover:bg-muted rounded-lg transition-colors text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your SQL query here..."
            rows={16}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background font-mono text-sm resize-none"
          />
        </div>

        {/* Output */}
        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Formatted SQL</h3>
            <button
              onClick={copyToClipboard}
              disabled={!output}
              className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <pre className="w-full h-[400px] p-4 rounded-lg border border-border bg-muted overflow-auto font-mono text-sm">
            {output || <span className="text-muted-foreground">Formatted SQL will appear here...</span>}
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
            <p className="text-sm text-muted-foreground">Input Characters</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card text-center">
            <p className="text-2xl font-bold text-green-500">{output.length}</p>
            <p className="text-sm text-muted-foreground">Output Characters</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card text-center">
            <p className="text-2xl font-bold text-purple-500">{output.split('\n').length}</p>
            <p className="text-sm text-muted-foreground">Lines</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card text-center">
            <p className="text-2xl font-bold text-cyan-500">
              {(input.match(/SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER/gi) || []).length}
            </p>
            <p className="text-sm text-muted-foreground">Statements</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

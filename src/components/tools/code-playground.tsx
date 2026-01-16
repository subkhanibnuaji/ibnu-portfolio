'use client'

import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Code, Play, RotateCcw, Copy, Check, Terminal, Download, AlertTriangle } from 'lucide-react'

type Language = 'javascript' | 'html' | 'css'

const TEMPLATES: Record<Language, string> = {
  javascript: `// JavaScript Playground
// Try editing and running the code!

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}

// Try some math
const sum = [1, 2, 3, 4, 5].reduce((a, b) => a + b, 0);
console.log("Sum of 1-5:", sum);

// Return values are displayed
return { message: "Hello, World!", sum };`,

  html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: system-ui, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      text-align: center;
    }
    h1 { color: #333; margin: 0 0 1rem; }
    p { color: #666; margin: 0; }
    button {
      margin-top: 1rem;
      padding: 0.5rem 1.5rem;
      border: none;
      background: #667eea;
      color: white;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
    }
    button:hover { background: #5a67d8; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello World!</h1>
    <p>Edit this HTML and click Run to see changes</p>
    <button onclick="alert('Hello!')">Click Me</button>
  </div>
</body>
</html>`,

  css: `/* CSS Art Playground */
/* The canvas is 400x400 pixels */

body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1a1a2e;
}

.canvas {
  width: 400px;
  height: 400px;
  position: relative;
  background: #16213e;
  border-radius: 20px;
  overflow: hidden;
}

/* Create a sun */
.canvas::before {
  content: '';
  position: absolute;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, #ffd700, #ff8c00);
  border-radius: 50%;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 60px #ffd700;
  animation: pulse 2s ease-in-out infinite;
}

/* Create mountains */
.canvas::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background:
    linear-gradient(135deg, transparent 50%, #0f3460 50%),
    linear-gradient(-135deg, transparent 50%, #0f3460 50%);
  background-size: 200px 200px;
  background-position: 0 100%, 200px 100%;
}

@keyframes pulse {
  0%, 100% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.1); }
}`
}

export function CodePlayground() {
  const [language, setLanguage] = useState<Language>('javascript')
  const [code, setCode] = useState(TEMPLATES.javascript)
  const [output, setOutput] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const runCode = useCallback(() => {
    setIsRunning(true)
    setError(null)
    setOutput([])

    if (language === 'javascript') {
      const logs: string[] = []
      const customConsole = {
        log: (...args: any[]) => {
          logs.push(args.map(a =>
            typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
          ).join(' '))
        },
        error: (...args: any[]) => {
          logs.push('ERROR: ' + args.join(' '))
        },
        warn: (...args: any[]) => {
          logs.push('WARN: ' + args.join(' '))
        }
      }

      try {
        const wrappedCode = `
          const console = arguments[0];
          ${code}
        `
        const func = new Function(wrappedCode)
        const result = func(customConsole)

        if (result !== undefined) {
          logs.push('=> ' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)))
        }

        setOutput(logs)
      } catch (e: any) {
        setError(e.message)
        setOutput(logs)
      }
    } else {
      // HTML/CSS preview
      if (iframeRef.current) {
        const iframe = iframeRef.current
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (doc) {
          doc.open()
          if (language === 'html') {
            doc.write(code)
          } else {
            // CSS Art
            doc.write(`
              <!DOCTYPE html>
              <html>
              <head><style>${code}</style></head>
              <body><div class="canvas"></div></body>
              </html>
            `)
          }
          doc.close()
        }
      }
    }

    setIsRunning(false)
  }, [code, language])

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang)
    setCode(TEMPLATES[newLang])
    setOutput([])
    setError(null)
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCode = () => {
    const extensions = { javascript: 'js', html: 'html', css: 'css' }
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code.${extensions[language]}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setCode(TEMPLATES[language])
    setOutput([])
    setError(null)
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium mb-4">
          <Code className="w-4 h-4" />
          Playground
        </div>
        <h2 className="text-2xl font-bold">Code Playground</h2>
        <p className="text-muted-foreground mt-2">
          Write and run JavaScript, HTML, or CSS directly in your browser.
        </p>
      </div>

      {/* Language Selector */}
      <div className="flex justify-center gap-2 mb-6">
        {(['javascript', 'html', 'css'] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
              language === lang
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Editor and Output */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Code Editor</h3>
            <div className="flex gap-2">
              <button
                onClick={copyCode}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={downloadCode}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={reset}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-[400px] p-4 rounded-xl border border-border bg-[#1e1e1e] text-green-400 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            spellCheck={false}
          />
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={runCode}
            disabled={isRunning}
            className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Run Code
          </motion.button>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            Output
          </h3>

          {language === 'javascript' ? (
            <div className="h-[400px] p-4 rounded-xl border border-border bg-[#1e1e1e] overflow-auto">
              {error && (
                <div className="flex items-start gap-2 text-red-400 mb-2 p-2 rounded bg-red-500/10">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="font-mono text-sm">{error}</span>
                </div>
              )}
              {output.length > 0 ? (
                <div className="space-y-1">
                  {output.map((line, i) => (
                    <div
                      key={i}
                      className={`font-mono text-sm ${
                        line.startsWith('=>') ? 'text-cyan-400' :
                        line.startsWith('ERROR') ? 'text-red-400' :
                        line.startsWith('WARN') ? 'text-yellow-400' :
                        'text-gray-300'
                      }`}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p className="text-sm">Click "Run Code" to see output</p>
                </div>
              )}
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              className="w-full h-[400px] rounded-xl border border-border bg-white"
              title="Preview"
              sandbox="allow-scripts"
            />
          )}

          <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            {language === 'javascript' && (
              <p>JavaScript runs in a sandboxed environment. Use <code className="px-1 bg-muted rounded">console.log()</code> to output values.</p>
            )}
            {language === 'html' && (
              <p>Write complete HTML documents with inline CSS and JavaScript.</p>
            )}
            {language === 'css' && (
              <p>Create CSS art! A 400x400 canvas with class <code className="px-1 bg-muted rounded">.canvas</code> is provided.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

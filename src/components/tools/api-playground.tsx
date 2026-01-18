'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Plus, Trash2, Copy, Check, Clock, AlertCircle, Loader2 } from 'lucide-react'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface Header {
  key: string
  value: string
  enabled: boolean
}

interface RequestHistory {
  id: string
  method: HttpMethod
  url: string
  status: number
  time: number
  timestamp: Date
}

export function ApiPlayground() {
  const [method, setMethod] = useState<HttpMethod>('GET')
  const [url, setUrl] = useState('')
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Content-Type', value: 'application/json', enabled: true }
  ])
  const [body, setBody] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [responseStatus, setResponseStatus] = useState<number | null>(null)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<RequestHistory[]>([])
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'headers' | 'body' | 'history'>('headers')

  const methodColors: Record<HttpMethod, string> = {
    GET: 'bg-green-500/20 text-green-500 border-green-500/50',
    POST: 'bg-blue-500/20 text-blue-500 border-blue-500/50',
    PUT: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
    PATCH: 'bg-purple-500/20 text-purple-500 border-purple-500/50',
    DELETE: 'bg-red-500/20 text-red-500 border-red-500/50'
  }

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }])
  }

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index))
  }

  const updateHeader = (index: number, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    const newHeaders = [...headers]
    newHeaders[index] = { ...newHeaders[index], [field]: value }
    setHeaders(newHeaders)
  }

  const sendRequest = async () => {
    if (!url) {
      setError('Please enter a URL')
      return
    }

    setLoading(true)
    setError(null)
    setResponse(null)
    setResponseStatus(null)
    setResponseTime(null)

    const startTime = performance.now()

    try {
      const headerObj: Record<string, string> = {}
      headers.filter(h => h.enabled && h.key).forEach(h => {
        headerObj[h.key] = h.value
      })

      const options: RequestInit = {
        method,
        headers: headerObj,
        mode: 'cors'
      }

      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        options.body = body
      }

      const res = await fetch(url, options)
      const endTime = performance.now()
      const time = Math.round(endTime - startTime)

      setResponseTime(time)
      setResponseStatus(res.status)

      const contentType = res.headers.get('content-type')
      let responseText: string

      if (contentType?.includes('application/json')) {
        const json = await res.json()
        responseText = JSON.stringify(json, null, 2)
      } else {
        responseText = await res.text()
      }

      setResponse(responseText)

      // Add to history
      setHistory(prev => [{
        id: Date.now().toString(),
        method,
        url,
        status: res.status,
        time,
        timestamp: new Date()
      }, ...prev].slice(0, 20))

    } catch (err) {
      const endTime = performance.now()
      setResponseTime(Math.round(endTime - startTime))
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const loadFromHistory = (item: RequestHistory) => {
    setMethod(item.method)
    setUrl(item.url)
  }

  return (
    <div className="space-y-6">
      {/* Request Builder */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            className={`px-4 py-3 rounded-lg border font-mono font-bold ${methodColors[method]}`}
          >
            {(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as HttpMethod[]).map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            className="flex-1 px-4 py-3 rounded-lg border border-border bg-background font-mono text-sm"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={sendRequest}
            disabled={loading}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Send
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(['headers', 'body', 'history'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'history' && history.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/20">
                  {history.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'headers' && (
          <div className="space-y-3">
            {headers.map((header, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  checked={header.enabled}
                  onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) => updateHeader(index, 'key', e.target.value)}
                  placeholder="Header name"
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background font-mono text-sm"
                />
                <input
                  type="text"
                  value={header.value}
                  onChange={(e) => updateHeader(index, 'value', e.target.value)}
                  placeholder="Header value"
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background font-mono text-sm"
                />
                <button
                  onClick={() => removeHeader(index)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addHeader}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
            >
              <Plus className="w-4 h-4" />
              Add Header
            </button>
          </div>
        )}

        {activeTab === 'body' && (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"key": "value"}'
            rows={8}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background font-mono text-sm resize-none"
          />
        )}

        {activeTab === 'history' && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No requests yet</p>
            ) : (
              history.map(item => (
                <button
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors text-left"
                >
                  <span className={`px-2 py-1 rounded text-xs font-bold ${methodColors[item.method]}`}>
                    {item.method}
                  </span>
                  <span className="flex-1 font-mono text-sm truncate">{item.url}</span>
                  <span className={`text-sm font-medium ${
                    item.status >= 200 && item.status < 300 ? 'text-green-500' :
                    item.status >= 400 ? 'text-red-500' : 'text-yellow-500'
                  }`}>
                    {item.status}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.time}ms</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Response */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Response</h3>
          <div className="flex items-center gap-4">
            {responseStatus !== null && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                responseStatus >= 200 && responseStatus < 300
                  ? 'bg-green-500/20 text-green-500'
                  : responseStatus >= 400
                  ? 'bg-red-500/20 text-red-500'
                  : 'bg-yellow-500/20 text-yellow-500'
              }`}>
                {responseStatus}
              </span>
            )}
            {responseTime !== null && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {responseTime}ms
              </span>
            )}
            {response && (
              <button
                onClick={copyResponse}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 text-red-500">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {response && (
          <pre className="p-4 rounded-lg bg-muted overflow-auto max-h-96 text-sm font-mono">
            {response}
          </pre>
        )}

        {!response && !error && !loading && (
          <p className="text-center text-muted-foreground py-12">
            Send a request to see the response
          </p>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  )
}

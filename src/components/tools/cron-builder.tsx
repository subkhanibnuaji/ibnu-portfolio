'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Copy, Check, Calendar, Play, AlertCircle } from 'lucide-react'

interface CronParts {
  minute: string
  hour: string
  dayOfMonth: string
  month: string
  dayOfWeek: string
}

export function CronBuilder() {
  const [cronParts, setCronParts] = useState<CronParts>({
    minute: '*',
    hour: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*'
  })
  const [cronExpression, setCronExpression] = useState('* * * * *')
  const [description, setDescription] = useState('')
  const [nextRuns, setNextRuns] = useState<Date[]>([])
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState<'builder' | 'parser'>('builder')
  const [parseInput, setParseInput] = useState('')

  const minutes = ['*', ...Array.from({ length: 60 }, (_, i) => i.toString())]
  const hours = ['*', ...Array.from({ length: 24 }, (_, i) => i.toString())]
  const daysOfMonth = ['*', ...Array.from({ length: 31 }, (_, i) => (i + 1).toString())]
  const months = [
    { value: '*', label: 'Every month' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ]
  const daysOfWeek = [
    { value: '*', label: 'Every day' },
    { value: '0', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' }
  ]

  const presets = [
    { label: 'Every minute', cron: '* * * * *' },
    { label: 'Every hour', cron: '0 * * * *' },
    { label: 'Every day at midnight', cron: '0 0 * * *' },
    { label: 'Every day at noon', cron: '0 12 * * *' },
    { label: 'Every Monday at 9 AM', cron: '0 9 * * 1' },
    { label: 'First day of month', cron: '0 0 1 * *' },
    { label: 'Every 15 minutes', cron: '*/15 * * * *' },
    { label: 'Every 6 hours', cron: '0 */6 * * *' },
    { label: 'Weekdays at 8 AM', cron: '0 8 * * 1-5' },
    { label: 'Weekend at 10 AM', cron: '0 10 * * 0,6' }
  ]

  const describeCron = (parts: CronParts): string => {
    const { minute, hour, dayOfMonth, month, dayOfWeek } = parts
    let desc = 'Runs '

    // Minute
    if (minute === '*') {
      desc += 'every minute'
    } else if (minute.includes('/')) {
      desc += `every ${minute.split('/')[1]} minutes`
    } else if (minute.includes(',')) {
      desc += `at minutes ${minute}`
    } else if (minute.includes('-')) {
      desc += `from minute ${minute.split('-')[0]} to ${minute.split('-')[1]}`
    } else {
      desc += `at minute ${minute}`
    }

    // Hour
    if (hour === '*') {
      desc += ' of every hour'
    } else if (hour.includes('/')) {
      desc += ` every ${hour.split('/')[1]} hours`
    } else if (hour.includes(',')) {
      desc += ` at hours ${hour}`
    } else {
      const h = parseInt(hour)
      const period = h >= 12 ? 'PM' : 'AM'
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
      desc += ` at ${h12}:00 ${period}`
    }

    // Day of Month
    if (dayOfMonth !== '*') {
      if (dayOfMonth.includes('/')) {
        desc += ` every ${dayOfMonth.split('/')[1]} days`
      } else if (dayOfMonth.includes(',')) {
        desc += ` on days ${dayOfMonth}`
      } else {
        desc += ` on day ${dayOfMonth}`
      }
    }

    // Month
    if (month !== '*') {
      const monthName = months.find(m => m.value === month)?.label || month
      desc += ` in ${monthName}`
    }

    // Day of Week
    if (dayOfWeek !== '*') {
      const dayName = daysOfWeek.find(d => d.value === dayOfWeek)?.label || dayOfWeek
      desc += ` on ${dayName}`
    }

    return desc
  }

  const calculateNextRuns = (parts: CronParts, count: number = 5): Date[] => {
    const runs: Date[] = []
    const now = new Date()
    let current = new Date(now)
    current.setSeconds(0)
    current.setMilliseconds(0)

    const matchesCron = (date: Date): boolean => {
      const min = date.getMinutes()
      const hr = date.getHours()
      const dom = date.getDate()
      const mon = date.getMonth() + 1
      const dow = date.getDay()

      const matchPart = (value: number, pattern: string): boolean => {
        if (pattern === '*') return true
        if (pattern.includes('/')) {
          const step = parseInt(pattern.split('/')[1])
          return value % step === 0
        }
        if (pattern.includes(',')) {
          return pattern.split(',').map(Number).includes(value)
        }
        if (pattern.includes('-')) {
          const [start, end] = pattern.split('-').map(Number)
          return value >= start && value <= end
        }
        return value === parseInt(pattern)
      }

      return matchPart(min, parts.minute) &&
        matchPart(hr, parts.hour) &&
        matchPart(dom, parts.dayOfMonth) &&
        matchPart(mon, parts.month) &&
        matchPart(dow, parts.dayOfWeek)
    }

    let iterations = 0
    while (runs.length < count && iterations < 525600) { // Max 1 year of minutes
      current.setMinutes(current.getMinutes() + 1)
      if (matchesCron(current)) {
        runs.push(new Date(current))
      }
      iterations++
    }

    return runs
  }

  useEffect(() => {
    const expr = `${cronParts.minute} ${cronParts.hour} ${cronParts.dayOfMonth} ${cronParts.month} ${cronParts.dayOfWeek}`
    setCronExpression(expr)
    setDescription(describeCron(cronParts))
    setNextRuns(calculateNextRuns(cronParts))
  }, [cronParts])

  const applyPreset = (cron: string) => {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = cron.split(' ')
    setCronParts({ minute, hour, dayOfMonth, month, dayOfWeek })
  }

  const parseCronExpression = (expr: string) => {
    const parts = expr.trim().split(/\s+/)
    if (parts.length === 5) {
      setCronParts({
        minute: parts[0],
        hour: parts[1],
        dayOfMonth: parts[2],
        month: parts[3],
        dayOfWeek: parts[4]
      })
      setMode('builder')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cronExpression)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 rounded-lg bg-muted w-fit">
        <button
          onClick={() => setMode('builder')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'builder' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Builder
        </button>
        <button
          onClick={() => setMode('parser')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'parser' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Parser
        </button>
      </div>

      {mode === 'parser' && (
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="font-semibold mb-4">Parse Cron Expression</h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={parseInput}
              onChange={(e) => setParseInput(e.target.value)}
              placeholder="Enter cron expression (e.g., 0 9 * * 1-5)"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background font-mono"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => parseCronExpression(parseInput)}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
            >
              Parse
            </motion.button>
          </div>
        </div>
      )}

      {/* Presets */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-4">Common Presets</h3>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.cron}
              onClick={() => applyPreset(preset.cron)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                cronExpression === preset.cron
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Builder */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card">
          <label className="block text-sm font-medium mb-2">Minute</label>
          <select
            value={cronParts.minute}
            onChange={(e) => setCronParts({ ...cronParts, minute: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background"
          >
            {minutes.map(m => (
              <option key={m} value={m}>{m === '*' ? 'Every minute' : m}</option>
            ))}
          </select>
          <input
            type="text"
            value={cronParts.minute}
            onChange={(e) => setCronParts({ ...cronParts, minute: e.target.value })}
            placeholder="or custom"
            className="w-full mt-2 px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono"
          />
        </div>

        <div className="p-4 rounded-xl border border-border bg-card">
          <label className="block text-sm font-medium mb-2">Hour</label>
          <select
            value={cronParts.hour}
            onChange={(e) => setCronParts({ ...cronParts, hour: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background"
          >
            {hours.map(h => (
              <option key={h} value={h}>{h === '*' ? 'Every hour' : `${h}:00`}</option>
            ))}
          </select>
          <input
            type="text"
            value={cronParts.hour}
            onChange={(e) => setCronParts({ ...cronParts, hour: e.target.value })}
            placeholder="or custom"
            className="w-full mt-2 px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono"
          />
        </div>

        <div className="p-4 rounded-xl border border-border bg-card">
          <label className="block text-sm font-medium mb-2">Day of Month</label>
          <select
            value={cronParts.dayOfMonth}
            onChange={(e) => setCronParts({ ...cronParts, dayOfMonth: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background"
          >
            {daysOfMonth.map(d => (
              <option key={d} value={d}>{d === '*' ? 'Every day' : d}</option>
            ))}
          </select>
          <input
            type="text"
            value={cronParts.dayOfMonth}
            onChange={(e) => setCronParts({ ...cronParts, dayOfMonth: e.target.value })}
            placeholder="or custom"
            className="w-full mt-2 px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono"
          />
        </div>

        <div className="p-4 rounded-xl border border-border bg-card">
          <label className="block text-sm font-medium mb-2">Month</label>
          <select
            value={cronParts.month}
            onChange={(e) => setCronParts({ ...cronParts, month: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background"
          >
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <input
            type="text"
            value={cronParts.month}
            onChange={(e) => setCronParts({ ...cronParts, month: e.target.value })}
            placeholder="or custom"
            className="w-full mt-2 px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono"
          />
        </div>

        <div className="p-4 rounded-xl border border-border bg-card">
          <label className="block text-sm font-medium mb-2">Day of Week</label>
          <select
            value={cronParts.dayOfWeek}
            onChange={(e) => setCronParts({ ...cronParts, dayOfWeek: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background"
          >
            {daysOfWeek.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
          <input
            type="text"
            value={cronParts.dayOfWeek}
            onChange={(e) => setCronParts({ ...cronParts, dayOfWeek: e.target.value })}
            placeholder="or custom"
            className="w-full mt-2 px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono"
          />
        </div>
      </div>

      {/* Result */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl border border-primary/50 bg-primary/5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Cron Expression
          </h3>
          <button
            onClick={copyToClipboard}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
        <div className="p-4 rounded-lg bg-background font-mono text-2xl text-center mb-4">
          {cronExpression}
        </div>
        <p className="text-center text-muted-foreground">{description}</p>
      </motion.div>

      {/* Next Runs */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          Next 5 Scheduled Runs
        </h3>
        <div className="space-y-2">
          {nextRuns.map((run, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted"
            >
              <Play className="w-4 h-4 text-green-500" />
              <span className="font-mono text-sm">
                {run.toLocaleString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Help */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-primary" />
          Cron Syntax Reference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium mb-2">Special Characters:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li><code className="px-1 bg-muted rounded">*</code> - any value</li>
              <li><code className="px-1 bg-muted rounded">,</code> - value list separator</li>
              <li><code className="px-1 bg-muted rounded">-</code> - range of values</li>
              <li><code className="px-1 bg-muted rounded">/</code> - step values</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Examples:</p>
            <ul className="space-y-1 text-muted-foreground font-mono">
              <li><code>*/15</code> - every 15</li>
              <li><code>1,15</code> - at 1 and 15</li>
              <li><code>1-5</code> - from 1 to 5</li>
              <li><code>0</code> - only at 0</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
